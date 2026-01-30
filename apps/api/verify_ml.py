"""Quick test of all ML components"""

import sys
sys.path.insert(0, '.')

print('Testing imports...')

# Test ML modules
from ml.pipeline import build_pipeline
from ml.metrics import compute_classification_metrics  
from ml.store import model_store

# Test data loading
import pandas as pd
df = pd.read_csv('data/demo_churn.csv')

print(f'✓ Dataset loaded: {df.shape}')
print(f'✓ Columns: {list(df.columns)}')

# Test pipeline
pipeline = build_pipeline()
print(f'✓ Pipeline created')

# Test train
from sklearn.model_selection import train_test_split
X = df.drop(columns=['churn'])
y = df['churn']
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
pipeline.fit(X_train, y_train)
print(f'✓ Pipeline trained on {len(X_train)} samples')

# Test predictions
y_pred = pipeline.predict(X_test)
y_proba = pipeline.predict_proba(X_test)[:, 1]
print(f'✓ Predictions made on {len(X_test)} samples')

# Test metrics
metrics = compute_classification_metrics(y_test, y_pred, y_proba)
print(f'✓ Metrics computed')
print(f'  - Accuracy: {metrics["accuracy"]:.3f}')
print(f'  - Precision: {metrics["precision"]:.3f}')
print(f'  - Recall: {metrics["recall"]:.3f}')
print(f'  - F1: {metrics["f1"]:.3f}')
print(f'  - ROC-AUC: {metrics["roc_auc"]:.3f}')

# Test model store
model_store.set_model(pipeline, [], metrics, {})
stored = model_store.get_model()
print(f'✓ Model stored and retrieved')

print('\n' + '='*50)
print('✓✓✓ ALL COMPONENTS WORKING ✓✓✓')
print('='*50)
