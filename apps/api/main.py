from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import pandas as pd
from pathlib import Path
from typing import List, Dict, Any, Optional, Literal, Annotated
from sklearn.model_selection import train_test_split
import json
import pickle
from contextlib import asynccontextmanager

from ml.pipeline import build_pipeline
from ml.metrics import compute_classification_metrics
from ml.store import model_store

try:
    import joblib
    JOBLIB_AVAILABLE = True
except Exception:
    joblib = None
    JOBLIB_AVAILABLE = False

ARTIFACTS_DIR = Path(__file__).parent / "artifacts"
MODEL_JOBLIB_PATH = ARTIFACTS_DIR / "model.joblib"
MODEL_PICKLE_PATH = ARTIFACTS_DIR / "model.pkl"
SCHEMA_PATH = ARTIFACTS_DIR / "schema.json"
METRICS_PATH = ARTIFACTS_DIR / "metrics.json"
TRAINED_AT_PATH = ARTIFACTS_DIR / "trained_at.json"


def save_pipeline(pipeline) -> None:
    ARTIFACTS_DIR.mkdir(parents=True, exist_ok=True)
    if JOBLIB_AVAILABLE:
        joblib.dump(pipeline, MODEL_JOBLIB_PATH)
    else:
        with open(MODEL_PICKLE_PATH, "wb") as f:
            pickle.dump(pipeline, f)


def load_pipeline(path: Path):
    if path.suffix == ".joblib":
        if not JOBLIB_AVAILABLE:
            raise RuntimeError("joblib not available to load model.joblib")
        return joblib.load(path)
    with open(path, "rb") as f:
        return pickle.load(f)


def get_model_path_for_load() -> Optional[Path]:
    if MODEL_JOBLIB_PATH.exists():
        return MODEL_JOBLIB_PATH
    if MODEL_PICKLE_PATH.exists():
        return MODEL_PICKLE_PATH
    return None


def save_json(path: Path, data: Dict[str, Any]) -> None:
    ARTIFACTS_DIR.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")


def load_json(path: Path) -> Dict[str, Any]:
    return json.loads(path.read_text(encoding="utf-8"))


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Load artifacts
    model_path = get_model_path_for_load()
    if model_path and SCHEMA_PATH.exists() and METRICS_PATH.exists() and TRAINED_AT_PATH.exists():
        try:
            pipeline = load_pipeline(model_path)
            schema = load_json(SCHEMA_PATH)
            metrics = load_json(METRICS_PATH)
            trained_at_data = load_json(TRAINED_AT_PATH)
            trained_at = trained_at_data.get("trained_at")

            preprocessor = pipeline.named_steps.get("preprocessor")
            if preprocessor is None:
                raise ValueError("Pipeline missing preprocessor step")
            feature_names_transformed = preprocessor.get_feature_names_out().tolist()

            model_store.set_model(
                pipeline=pipeline,
                feature_names=feature_names_transformed,
                metrics=metrics,
                schema=schema,
                trained_at=trained_at
            )
        except Exception:
            model_store.clear()

    yield

    # Shutdown: cleanup if needed (currently none)


app = FastAPI(title="DecisionOps AI API", lifespan=lifespan)

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost",
    "http://127.0.0.1",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request/Response models
class TrainRequest(BaseModel):
    source: Literal["demo", "upload"] = Field(
        ...,
        description="Dataset source: demo or upload",
        examples=["demo"]
    )
    target: str = Field(
        ...,
        description="Target column name",
        examples=["churn"]
    )
    test_size: Annotated[
        float,
        Field(
            ge=0.05,
            le=0.5,
            description="Test split size between 0.05 and 0.5",
            examples=[0.2]
        )
    ] = 0.2

    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "source": "demo",
                    "target": "churn",
                    "test_size": 0.2
                }
            ]
        }
    }


class PredictRequest(BaseModel):
    records: List[Dict[str, Any]] = Field(
        ...,
        description="List of records to score",
        examples=[
            [
                {
                    "age": 34,
                    "tenure_months": 12,
                    "monthly_spend": 50.5,
                    "support_tickets_last_90d": 1,
                    "plan": "pro",
                    "region": "latam"
                }
            ]
        ]
    )

    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "records": [
                        {
                            "age": 34,
                            "tenure_months": 12,
                            "monthly_spend": 50.5,
                            "support_tickets_last_90d": 1,
                            "plan": "pro",
                            "region": "latam"
                        },
                        {
                            "age": 50,
                            "tenure_months": 36,
                            "monthly_spend": 129.99,
                            "support_tickets_last_90d": 0,
                            "plan": "enterprise",
                            "region": "eu"
                        }
                    ]
                }
            ]
        }
    }


class PredictResponse(BaseModel):
    predictions: List[Dict[str, Any]]


class ExplainResponse(BaseModel):
    method: str
    top_features: List[Dict[str, Any]]


# ✅ FIX Pydantic v2: asegurar modelos “reconstruidos” para TypeAdapter / FastAPI
for _cls in (TrainRequest, PredictRequest, PredictResponse, ExplainResponse):
    if hasattr(_cls, "model_rebuild"):
        _cls.model_rebuild()


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/version")
def version():
    return {"name": "decisionops-ai-toolkit", "version": "0.0.0"}


@app.get("/model/status")
def model_status() -> Dict[str, Any]:
    if not model_store.has_model():
        return {
            "has_model": False,
            "trained_at": None,
            "target": None,
            "rows": None,
            "metrics": None
        }

    model_data = model_store.get_model()
    schema = model_data.get("schema") or {}

    return {
        "has_model": True,
        "trained_at": model_data.get("trained_at"),
        "target": schema.get("target"),
        "rows": schema.get("rows"),
        "metrics": model_data.get("metrics")
    }


@app.post("/train")
def train(request: TrainRequest) -> Dict[str, Any]:
    # Load data
    if request.source == "demo":
        data_path = Path(__file__).parent / "data" / "demo_churn.csv"
        if not data_path.exists():
            raise HTTPException(status_code=400, detail=f"Demo dataset not found at {data_path}")
        df = pd.read_csv(data_path)
    elif request.source == "upload":
        raise HTTPException(status_code=400, detail="Upload not implemented yet")
    else:
        raise HTTPException(status_code=400, detail=f"Unknown source: {request.source}")

    # Validate target
    if request.target not in df.columns:
        raise HTTPException(
            status_code=400,
            detail=f"Target '{request.target}' not found in dataset. Available columns: {list(df.columns)}"
        )

    # Separate features and target
    X = df.drop(columns=[request.target])
    y = df[request.target]

    # Store schema info
    feature_names_original = list(X.columns)
    numeric_features = X.select_dtypes(include=['int64', 'int32', 'float64', 'float32']).columns.tolist()
    categorical_features = X.select_dtypes(include=['object']).columns.tolist()

    schema = {
        "feature_names": feature_names_original,
        "numeric_features": numeric_features,
        "categorical_features": categorical_features,
        "target": request.target,
        "rows": len(df)
    }

    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=request.test_size, random_state=42
    )

    # Build and train pipeline
    pipeline = build_pipeline(
        numeric_features=numeric_features,
        categorical_features=categorical_features
    )
    pipeline.fit(X_train, y_train)

    # Predictions
    y_pred = pipeline.predict(X_test)
    y_proba = pipeline.predict_proba(X_test)[:, 1]

    # Compute metrics
    metrics = compute_classification_metrics(y_test, y_pred, y_proba)

    # Get feature names after preprocessing
    preprocessor = pipeline.named_steps['preprocessor']
    feature_names_transformed = preprocessor.get_feature_names_out().tolist()

    # Store model
    model_store.set_model(
        pipeline=pipeline,
        feature_names=feature_names_transformed,
        metrics=metrics,
        schema=schema
    )

    save_pipeline(pipeline)
    save_json(SCHEMA_PATH, schema)
    save_json(METRICS_PATH, metrics)
    save_json(TRAINED_AT_PATH, {"trained_at": model_store.trained_at})

    return {
        "status": "trained",
        "target": request.target,
        "rows": len(df),
        "metrics": metrics,
        "trained_at": model_store.trained_at
    }


@app.post("/predict", response_model=PredictResponse)
def predict(request: PredictRequest) -> PredictResponse:
    if not model_store.has_model():
        raise HTTPException(status_code=400, detail="No model trained yet. Call /train first.")

    model_data = model_store.get_model()
    pipeline = model_data["pipeline"]
    schema = model_data["schema"]

    # Convert records to DataFrame
    try:
        df_input = pd.DataFrame(request.records)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid records format: {str(e)}")

    # Validate columns
    expected_features = schema["feature_names"]
    missing_cols = set(expected_features) - set(df_input.columns)
    if missing_cols:
        raise HTTPException(
            status_code=400,
            detail=f"Missing columns: {list(missing_cols)}. Expected: {expected_features}"
        )

    numeric_features = set(schema.get("numeric_features", []))
    categorical_features = set(schema.get("categorical_features", []))
    expected_set = set(expected_features)

    extra_cols = set(df_input.columns) - expected_set
    if extra_cols:
        raise HTTPException(
            status_code=400,
            detail=f"Unexpected columns: {list(extra_cols)}. Expected: {expected_features}"
        )

    if numeric_features or categorical_features:
        invalid_fields: List[str] = []
        for idx, record in enumerate(request.records):
            for field in numeric_features:
                value = record.get(field)
                if value is None:
                    continue
                if not isinstance(value, (int, float)):
                    invalid_fields.append(f"records[{idx}].{field} must be numeric")
            for field in categorical_features:
                value = record.get(field)
                if value is None:
                    continue
                if not isinstance(value, str):
                    invalid_fields.append(f"records[{idx}].{field} must be string")
        if invalid_fields:
            raise HTTPException(status_code=400, detail="; ".join(invalid_fields))

    # Select only expected features and reorder
    df_input = df_input[expected_features]

    # Make predictions
    try:
        y_pred = pipeline.predict(df_input)
        y_proba = pipeline.predict_proba(df_input)[:, 1]
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Prediction error: {str(e)}")

    predictions = [{"label": int(pred), "probability": float(prob)} for pred, prob in zip(y_pred, y_proba)]
    return PredictResponse(predictions=predictions)


@app.get("/explain")
def explain() -> Dict[str, Any]:
    if not model_store.has_model():
        raise HTTPException(status_code=400, detail="No model trained yet. Call /train first.")

    model_data = model_store.get_model()
    pipeline = model_data["pipeline"]
    feature_names = model_data["feature_names"]

    classifier = pipeline.named_steps['classifier']
    if not hasattr(classifier, 'coef_'):
        raise HTTPException(
            status_code=400,
            detail=f"Classifier {type(classifier).__name__} does not support coefficient-based explanation"
        )

    coef = classifier.coef_[0]
    feature_importance = [{"feature": fname, "weight": float(w)} for fname, w in zip(feature_names, coef)]
    top_features = sorted(feature_importance, key=lambda x: abs(x["weight"]), reverse=True)[:10]

    return {"method": "logreg_coefficients", "top_features": top_features}
