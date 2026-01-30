"""
ML Pipeline module for tabular classification.
"""

from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LogisticRegression


def build_pipeline(
    numeric_features: list = None,
    categorical_features: list = None
) -> Pipeline:
    """
    Build a sklearn Pipeline with preprocessing and LogisticRegression.
    
    Args:
        numeric_features: List of numeric column names
        categorical_features: List of categorical column names
    
    Returns:
        Fitted sklearn Pipeline
    """
    
    if numeric_features is None:
        numeric_features = ['age', 'tenure_months', 'monthly_spend', 'support_tickets_last_90d']
    
    if categorical_features is None:
        categorical_features = ['plan', 'region']
    
    # Numeric preprocessing
    numeric_transformer = Pipeline(
        steps=[
            ('imputer', SimpleImputer(strategy='mean')),
            ('scaler', StandardScaler())
        ]
    )
    
    # Categorical preprocessing
    categorical_transformer = Pipeline(
        steps=[
            ('imputer', SimpleImputer(strategy='most_frequent')),
            ('onehot', OneHotEncoder(handle_unknown='ignore', sparse_output=False))
        ]
    )
    
    # Combine preprocessors
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', numeric_transformer, numeric_features),
            ('cat', categorical_transformer, categorical_features)
        ]
    )
    
    # Build full pipeline
    pipeline = Pipeline(
        steps=[
            ('preprocessor', preprocessor),
            ('classifier', LogisticRegression(max_iter=200, random_state=42))
        ]
    )
    
    return pipeline
