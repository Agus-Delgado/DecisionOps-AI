#!/usr/bin/env bash
# 🚀 QUICK START - ETAPA 1 ML Baseline

# ============================================================================
# 1. SETUP INICIAL (Solo primera vez)
# ============================================================================

cd apps/api

# Crear entorno virtual
python -m venv .venv

# Activar entorno
.venv\Scripts\activate          # Windows
# source .venv/bin/activate     # macOS/Linux

# Instalar dependencias
pip install -r requirements.txt


# ============================================================================
# 2. VERIFICAR COMPONENTES ML (SIN SERVIDOR)
# ============================================================================

python verify_ml.py
# Output esperado:
# ✓ Dataset loaded: (122, 7)
# ✓ Pipeline created
# ✓ Pipeline trained on 97 samples
# ✓ Predictions made on 25 samples
# ✓ Metrics computed
#   - Accuracy: 0.960
#   - Precision: 0.875
#   - Recall: 1.000
#   - F1: 0.933
#   - ROC-AUC: 1.000
# ✓ Model stored and retrieved
# ✓✓✓ ALL COMPONENTS WORKING ✓✓✓


# ============================================================================
# 3. INICIAR SERVIDOR
# ============================================================================

uvicorn main:app --reload --port 8000
# Output esperado:
# INFO:     Started server process [XXXX]
# INFO:     Waiting for application startup.
# INFO:     Application startup complete.
# INFO:     Uvicorn running on http://127.0.0.1:8000


# ============================================================================
# 4. TEST ENDPOINTS (en otra terminal)
# ============================================================================

# Health check
curl -X GET http://localhost:8000/health
# {"status":"ok"}

# Entrenar modelo
curl -X POST http://localhost:8000/train \
  -H "Content-Type: application/json" \
  -d '{"source":"demo","target":"churn","test_size":0.2}'
# Respuesta: status, metrics, trained_at

# Hacer predicciones
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{
    "records":[
      {
        "age":34,
        "tenure_months":12,
        "monthly_spend":50.5,
        "support_tickets_last_90d":1,
        "plan":"pro",
        "region":"latam"
      },
      {
        "age":50,
        "tenure_months":36,
        "monthly_spend":129.99,
        "support_tickets_last_90d":0,
        "plan":"enterprise",
        "region":"eu"
      }
    ]
  }'
# {"predictions":[{"label":1,"probability":0.72},{"label":0,"probability":0.15}]}

# Ver explicación (feature importance)
curl -X GET http://localhost:8000/explain
# {"method":"logreg_coefficients","top_features":[...]}


# ============================================================================
# 5. ARCHIVOS IMPORTANTES
# ============================================================================

# 📖 Lee primero:
#    apps/api/README.md              - Guía completa con ejemplos
#    apps/api/ENTREGA_ETAPA1.md      - Documentación detallada

# 🔧 Código:
#    apps/api/main.py                - FastAPI app (3 nuevos endpoints)
#    apps/api/ml/pipeline.py         - sklearn Pipeline
#    apps/api/ml/metrics.py          - Cálculo de métricas
#    apps/api/ml/store.py            - InMemoryModelStore

# 📊 Data:
#    apps/api/data/demo_churn.csv    - Dataset demo (160 rows)
#    apps/api/data/README.md         - Dataset documentation

# ✅ Verificación:
#    apps/api/verify_ml.py           - Verificar componentes (SIN SERVIDOR)
#    apps/api/test_api.py            - Test de endpoints (CON SERVIDOR)


# ============================================================================
# 6. DATASET DEMO
# ============================================================================

# Estructura:
# - age: Edad del cliente (int, 25-56)
# - tenure_months: Meses como cliente (int, 0-54)
# - monthly_spend: Gasto mensual (float, $19.99-$169.99)
# - support_tickets_last_90d: Tickets de soporte (int, 0-5)
# - plan: Tipo de plan (categorical: basic|pro|enterprise)
# - region: Región (categorical: latam|na|eu)
# - churn: Target (binary: 0|1) ~ 45% positivos

# Cargar en Python:
# import pandas as pd
# df = pd.read_csv('data/demo_churn.csv')


# ============================================================================
# 7. API ENDPOINTS SUMMARY
# ============================================================================

# GET /health
#   Status: 200
#   Response: {"status":"ok"}

# GET /version
#   Status: 200
#   Response: {"name":"decisionops-ai-toolkit","version":"0.0.0"}

# POST /train
#   Body: {"source":"demo","target":"churn","test_size":0.2}
#   Status: 200
#   Response: {"status":"trained","target":"churn","rows":160,"metrics":{...},"trained_at":"..."}

# POST /predict (requires trained model)
#   Body: {"records":[{...}]}
#   Status: 200
#   Response: {"predictions":[{"label":0|1,"probability":0.0-1.0},...]}

# GET /explain (requires trained model)
#   Status: 200
#   Response: {"method":"logreg_coefficients","top_features":[{"feature":"...","weight":0.123},...]}


# ============================================================================
# 8. ERROR CODES
# ============================================================================

# 400 Bad Request:
#   - "Missing columns: [...]"              → faltan features en predict
#   - "No model trained yet"                → no entrenó antes de predict/explain
#   - "Unknown source: ..."                 → source inválido en train
#   - "Upload not implemented yet"          → source="upload" no implementado
#   - "Invalid records format: ..."         → records no es JSON válido
#   - "Target 'X' not found in dataset"    → target no existe en dataset


# ============================================================================
# 9. TROUBLESHOOTING
# ============================================================================

# ❌ "ModuleNotFoundError: No module named 'fastapi'"
#    → pip install -r requirements.txt

# ❌ "Dataset not found"
#    → Verificar que existe apps/api/data/demo_churn.csv

# ❌ Server not responding
#    → Verificar puerto 8000 no esté ocupado
#    → Reiniciar servidor (Ctrl+C y ejecutar nuevamente)

# ❌ Predictions always return same value
#    → Verificar que llamó /train antes de /predict

# ✅ Verificar con: python verify_ml.py (sin servidor)


# ============================================================================
# 10. ESTRUCTURA FINAL
# ============================================================================

# apps/api/
# ├── main.py                      ← Endpoints FastAPI
# ├── requirements.txt             ← Dependencies
# ├── README.md                    ← 📖 GUÍA COMPLETA
# ├── ENTREGA_ETAPA1.md           ← 📋 Documentación
# ├── verify_ml.py                 ← ✅ Script de verificación
# ├── test_api.py                  ← Test de endpoints
# ├── data/
# │   ├── demo_churn.csv          ← 📊 Dataset (160 rows)
# │   └── README.md               ← Dataset docs
# └── ml/
#     ├── __init__.py
#     ├── pipeline.py             ← Pipeline builder
#     ├── metrics.py              ← Metrics computation
#     └── store.py                ← In-memory store


# ============================================================================
# 📞 SOPORTE & DOCUMENTACIÓN
# ============================================================================

# 1. Documentación técnica: apps/api/ENTREGA_ETAPA1.md
# 2. Guía de uso: apps/api/README.md
# 3. Dataset info: apps/api/data/README.md
# 4. Ejecutar: python verify_ml.py
#
# Status: ✅ COMPLETADO Y VERIFICADO - 30 de enero de 2026
