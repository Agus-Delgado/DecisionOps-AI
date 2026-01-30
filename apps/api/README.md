# apps/api

FastAPI backend with ML baseline for tabular classification (churn prediction).

## Endpoints

### Health & Version
- `GET /health` → `{"status":"ok"}`
- `GET /version` → `{"name":"decisionops-ai-toolkit","version":"0.0.0"}`

### ML Endpoints

#### POST /train
Train a classification model on demo or uploaded dataset.

**Request:**
```json
{
  "source": "demo",
  "target": "churn",
  "test_size": 0.2
}
```

**Response:**
```json
{
  "status": "trained",
  "target": "churn",
  "rows": 160,
  "metrics": {
    "accuracy": 0.875,
    "precision": 0.86,
    "recall": 0.89,
    "f1": 0.875,
    "roc_auc": 0.92,
    "confusion_matrix": {
      "true_negatives": 45,
      "false_positives": 8,
      "false_negatives": 5,
      "true_positives": 34
    }
  },
  "trained_at": "2025-01-30T12:34:56.123456Z"
}
```

#### POST /predict
Make predictions on new records. **Requires trained model.**

**Request:**
```json
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
```

**Response:**
```json
{
  "predictions": [
    {"label": 1, "probability": 0.72},
    {"label": 0, "probability": 0.15}
  ]
}
```

#### GET /explain
Get feature importance from trained model. **Requires trained model.**

**Response:**
```json
{
  "method": "logreg_coefficients",
  "top_features": [
    {"feature": "tenure_months", "weight": -1.25},
    {"feature": "monthly_spend", "weight": -0.89},
    {"feature": "plan_pro", "weight": -0.65},
    {"feature": "support_tickets_last_90d", "weight": 0.45}
  ]
}
```

## Setup

1. **Create virtual environment** (from `apps/api` directory):
   ```bash
   python -m venv .venv
   .venv\Scripts\activate  # Windows
   # or: source .venv/bin/activate  # macOS/Linux
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the API:**
   ```bash
   uvicorn main:app --reload --port 8000
   ```

   API available at `http://localhost:8000`

## Quick Start: curl Examples

### 1. Check health
```bash
curl -X GET http://localhost:8000/health
```

### 2. Train on demo dataset
```bash
curl -X POST http://localhost:8000/train \
  -H "Content-Type: application/json" \
  -d '{"source": "demo", "target": "churn", "test_size": 0.2}'
```

### 3. Make predictions
```bash
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{
    "records": [
      {"age": 34, "tenure_months": 12, "monthly_spend": 50.5, "support_tickets_last_90d": 1, "plan": "pro", "region": "latam"},
      {"age": 50, "tenure_months": 36, "monthly_spend": 129.99, "support_tickets_last_90d": 0, "plan": "enterprise", "region": "eu"}
    ]
  }'
```

### 4. Get feature importance
```bash
curl -X GET http://localhost:8000/explain
```

## Dataset

Demo dataset: `data/demo_churn.csv` (160 rows, ~45% churn)

Features:
- `age` (int): Customer age
- `tenure_months` (int): Months as customer
- `monthly_spend` (float): Monthly cost
- `support_tickets_last_90d` (int): Support interactions
- `plan` (categorical): basic, pro, enterprise
- `region` (categorical): latam, na, eu
- **`churn`** (target): 0/1

See [data/README.md](data/README.md) for details.

## Architecture

```
apps/api/
├── main.py           # FastAPI app + endpoints
├── requirements.txt  # Dependencies
├── data/
│   ├── demo_churn.csv    # Demo dataset
│   └── README.md         # Dataset documentation
└── ml/
    ├── __init__.py
    ├── pipeline.py   # sklearn Pipeline (preprocessing + LogisticRegression)
    ├── metrics.py    # Classification metrics computation
    └── store.py      # In-memory model store (singleton)
```

## ML Pipeline

1. **Preprocessing** (ColumnTransformer):
   - Numeric features: SimpleImputer → StandardScaler
   - Categorical features: SimpleImputer → OneHotEncoder(handle_unknown="ignore")
2. **Model**: LogisticRegression(max_iter=200)
3. **Storage**: In-memory (no persistence to disk in v1)

## Error Handling

- Missing required columns → 400 with column list
- Unknown categorical values → Handled gracefully (OneHotEncoder ignore mode)
- Missing values → Imputed with mean (numeric) or most_frequent (categorical)
- No trained model → 400 "No model trained yet"

## Future Improvements

- [ ] Upload custom datasets
- [ ] Multiple model types (RandomForest, XGBoost, etc.)
- [ ] Model persistence (save/load to disk)
- [ ] SHAP explanations
- [ ] Hyperparameter tuning
- [ ] Cross-validation metrics

## CORS

Enabled for `http://localhost:5173` (Vite dev server)
