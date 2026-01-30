"""
In-memory model store for trained pipelines.
Singleton pattern for simplicity.
"""

from typing import Optional, Dict, Any
from datetime import datetime, timezone


class InMemoryModelStore:
    """Singleton store for trained models."""
    
    _instance: Optional['InMemoryModelStore'] = None
    
    def __new__(cls) -> 'InMemoryModelStore':
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._initialized = False
        return cls._instance
    
    def __init__(self):
        """Initialize the store."""
        if not self._initialized:
            self.pipeline = None
            self.feature_names = None
            self.metrics = None
            self.trained_at = None
            self.schema = None
            self._initialized = True
    
    def set_model(
        self,
        pipeline,
        feature_names: list,
        metrics: Dict[str, Any],
        schema: Dict[str, Any],
        trained_at: Optional[str] = None
    ) -> None:
        """
        Store a trained model.
        
        Args:
            pipeline: Trained sklearn Pipeline
            feature_names: List of feature names (post-preprocessing)
            metrics: Dictionary with computed metrics
            schema: Dictionary with feature info (names, dtypes, etc.)
        """
        self.pipeline = pipeline
        self.feature_names = feature_names
        self.metrics = metrics
        self.schema = schema
        self.trained_at = trained_at or (datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"))
    
    def get_model(self):
        """
        Retrieve the trained model.
        
        Returns:
            Dictionary with pipeline, feature_names, metrics, trained_at, schema
        
        Raises:
            ValueError: If no model has been trained yet
        """
        if self.pipeline is None:
            raise ValueError("No model trained yet. Call /train first.")
        
        return {
            "pipeline": self.pipeline,
            "feature_names": self.feature_names,
            "metrics": self.metrics,
            "trained_at": self.trained_at,
            "schema": self.schema
        }
    
    def has_model(self) -> bool:
        """Check if a model is stored."""
        return self.pipeline is not None
    
    def clear(self) -> None:
        """Clear the stored model."""
        self.pipeline = None
        self.feature_names = None
        self.metrics = None
        self.trained_at = None
        self.schema = None


# Global singleton instance
model_store = InMemoryModelStore()
