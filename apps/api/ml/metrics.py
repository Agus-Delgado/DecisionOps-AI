"""
Classification metrics computation module.
"""

from typing import Dict, Any
import numpy as np
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score, confusion_matrix


def compute_classification_metrics(
    y_true: np.ndarray,
    y_pred: np.ndarray,
    y_proba: np.ndarray = None
) -> Dict[str, Any]:
    """
    Compute classification metrics.
    
    Args:
        y_true: Ground truth labels (binary: 0 or 1)
        y_pred: Predicted labels (0 or 1)
        y_proba: Predicted probabilities for class 1 (for ROC-AUC)
    
    Returns:
        Dictionary with metrics including accuracy, precision, recall, f1, roc_auc, confusion_matrix
    """
    
    metrics = {
        "accuracy": float(accuracy_score(y_true, y_pred)),
        "precision": float(precision_score(y_true, y_pred, zero_division=0)),
        "recall": float(recall_score(y_true, y_pred, zero_division=0)),
        "f1": float(f1_score(y_true, y_pred, zero_division=0)),
    }
    
    # Add ROC-AUC if probabilities provided
    if y_proba is not None:
        try:
            metrics["roc_auc"] = float(roc_auc_score(y_true, y_proba))
        except Exception:
            metrics["roc_auc"] = None
    else:
        metrics["roc_auc"] = None
    
    # Confusion matrix as dict
    cm = confusion_matrix(y_true, y_pred)
    metrics["confusion_matrix"] = {
        "true_negatives": int(cm[0, 0]),
        "false_positives": int(cm[0, 1]),
        "false_negatives": int(cm[1, 0]),
        "true_positives": int(cm[1, 1])
    }
    
    return metrics
