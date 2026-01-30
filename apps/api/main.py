from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import os
from pathlib import Path
from typing import List, Dict, Any, Optional
from sklearn.model_selection import train_test_split
import numpy as np

from ml.pipeline import build_pipeline
from ml.metrics import compute_classification_metrics
from ml.store import model_store

app = FastAPI(title="DecisionOps AI API")

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
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
    source: str  # "demo" or "upload"
    target: str  # target column name
    test_size: float = 0.2


class PredictRequest(BaseModel):
    records: List[Dict[str, Any]]


class PredictResponse(BaseModel):
    predictions: List[Dict[str, Any]]


class ExplainResponse(BaseModel):
    method: str
    top_features: List[Dict[str, Any]]


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/version")
def version():
    return {"name": "decisionops-ai-toolkit", "version": "0.0.0"}


@app.post("/train")
def train(request: TrainRequest) -> Dict[str, Any]:
    """
    Train a model on the specified dataset.
    
    Args:
        request: TrainRequest with source, target, test_size
    
    Returns:
        Dict with status, target, rows, metrics, trained_at
    """
    
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
    
    return {
        "status": "trained",
        "target": request.target,
        "rows": len(df),
        "metrics": metrics,
        "trained_at": model_store.trained_at
    }


@app.post("/predict", response_model=PredictResponse)
def predict(request: PredictRequest) -> PredictResponse:
    """
    Make predictions on new records.
    
    Args:
        request: PredictRequest with list of records
    
    Returns:
        PredictResponse with predictions
    """
    
    # Check if model is trained
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
    
    # Select only expected features and reorder
    df_input = df_input[expected_features]
    
    # Make predictions
    try:
        y_pred = pipeline.predict(df_input)
        y_proba = pipeline.predict_proba(df_input)[:, 1]
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Prediction error: {str(e)}")
    
    # Format predictions
    predictions = [
        {
            "label": int(pred),
            "probability": float(prob)
        }
        for pred, prob in zip(y_pred, y_proba)
    ]
    
    return PredictResponse(predictions=predictions)


@app.get("/explain")
def explain() -> Dict[str, Any]:
    """
    Return simple feature importance based on LogisticRegression coefficients.
    
    Returns:
        Dict with method and top_features
    """
    
    # Check if model is trained
    if not model_store.has_model():
        raise HTTPException(status_code=400, detail="No model trained yet. Call /train first.")
    
    model_data = model_store.get_model()
    pipeline = model_data["pipeline"]
    feature_names = model_data["feature_names"]
    
    # Extract classifier
    classifier = pipeline.named_steps['classifier']
    
    # Check if it's LogisticRegression
    if not hasattr(classifier, 'coef_'):
        raise HTTPException(
            status_code=400,
            detail=f"Classifier {type(classifier).__name__} does not support coefficient-based explanation"
        )
    
    # Get coefficients
    coef = classifier.coef_[0]
    
    # Create feature importance list
    feature_importance = [
        {
            "feature": fname,
            "weight": float(weight)
        }
        for fname, weight in zip(feature_names, coef)
    ]
    
    # Sort by absolute value and get top 10
    top_features = sorted(feature_importance, key=lambda x: abs(x["weight"]), reverse=True)[:10]
    
    return {
        "method": "logreg_coefficients",
        "top_features": top_features
    }
