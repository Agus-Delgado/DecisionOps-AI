from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field


class ModelStatus(BaseModel):
    """Model status information."""
    has_model: bool = Field(description="Whether a model is currently trained")
    trained_at: Optional[str] = Field(None, description="ISO timestamp when model was trained")
    target: Optional[str] = Field(None, description="Target column name")
    rows: Optional[int] = Field(None, description="Number of training rows used")
    metrics: Optional[Dict[str, Any]] = Field(None, description="Model metrics (accuracy, precision, recall, f1, roc_auc)")
    feature_names: Optional[List[str]] = Field(None, description="Original feature names")
    numeric_features: Optional[List[str]] = Field(None, description="Numeric feature names")
    categorical_features: Optional[List[str]] = Field(None, description="Categorical feature names")

    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "has_model": True,
                    "trained_at": "2025-01-30T15:30:45.123456Z",
                    "target": "churn",
                    "rows": 1000,
                    "feature_names": ["age", "tenure_months", "monthly_spend", "support_tickets_last_90d", "plan", "region"],
                    "numeric_features": ["age", "tenure_months", "monthly_spend", "support_tickets_last_90d"],
                    "categorical_features": ["plan", "region"],
                    "metrics": {
                        "accuracy": 0.875,
                        "precision": 0.86,
                        "recall": 0.89,
                        "f1": 0.875,
                        "roc_auc": 0.92
                    }
                }
            ]
        }
    }


class VersionResponse(BaseModel):
    """Version information."""
    name: str = Field(description="Project name")
    version: str = Field(description="Version string")

    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "name": "decisionops-ai-toolkit",
                    "version": "0.1.0"
                }
            ]
        }
    }
