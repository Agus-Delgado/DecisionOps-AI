# 📦 ETAPA 1 — ML Baseline en FastAPI: Entrega Ejecutiva

## ✅ Estado: COMPLETADO Y VERIFICADO

---

## 📂 Lista de Archivos Creados/Modificados

### NUEVOS ARCHIVOS CREADOS

#### Dataset Demo
- `apps/api/data/demo_churn.csv` (160 filas, 7 columnas, ~45% churn)
- `apps/api/data/README.md` (Documentación del dataset)

#### Módulos ML
- `apps/api/ml/__init__.py` (Package init)
- `apps/api/ml/pipeline.py` (sklearn Pipeline)
- `apps/api/ml/metrics.py` (Cálculo de métricas)
- `apps/api/ml/store.py` (InMemoryModelStore singleton)

#### Documentación & Tests
- `apps/api/ENTREGA_ETAPA1.md` (Este documento)
- `apps/api/verify_ml.py` (Script de verificación - TODOS PASAN)
- `apps/api/test_api.py` (Script de test de endpoints)
- `apps/api/README.md` (ACTUALIZADO con ejemplos curl)

### ARCHIVOS MODIFICADOS
- `apps/api/main.py` (3 nuevos endpoints: /train, /predict, /explain)
- `apps/api/requirements.txt` (Sin cambios - ya tenía todo)

---

## 🚀 Inicio Rápido

### Setup (primera vez)
```bash
cd apps/api
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

### Iniciar servidor
```bash
uvicorn main:app --reload --port 8000
```

### Test (en otra terminal)
```bash
python verify_ml.py    # Verificar componentes (SIN SERVIDOR)
python test_api.py     # Test de endpoints (CON SERVIDOR CORRIENDO)
```

---

## 📡 3 Nuevos Endpoints

### 1. POST /train
Entrena modelo en dataset demo.
```bash
curl -X POST http://localhost:8000/train \
  -H "Content-Type: application/json" \
  -d '{"source":"demo","target":"churn","test_size":0.2}'
```

**Response:** Status, métricas (accuracy/precision/recall/f1/roc_auc), confusion matrix, timestamp.

### 2. POST /predict
Predice churn en nuevos records.
```bash
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{
    "records":[
      {"age":34,"tenure_months":12,"monthly_spend":50.5,"support_tickets_last_90d":1,"plan":"pro","region":"latam"}
    ]
  }'
```

**Response:** Lista de predicciones con label (0/1) y probability (0.0-1.0).

### 3. GET /explain
Muestra top features por coeficientes de LogisticRegression.
```bash
curl -X GET http://localhost:8000/explain
```

**Response:** Top 10 features con sus pesos.

---

## ✅ Verificación Completada

```
✓ Dataset loaded: 160 filas, 7 columnas
✓ Pipeline created (ColumnTransformer + LogisticRegression)
✓ Pipeline trained on 97 samples
✓ Predictions made on 25 samples
✓ Metrics computed:
  - Accuracy: 0.960
  - Precision: 0.875
  - Recall: 1.000
  - F1: 0.933
  - ROC-AUC: 1.000
✓ Model stored and retrieved in memory
```

---

## 🏗️ Arquitectura

```
apps/api/
├── main.py                      # FastAPI + 3 nuevos endpoints
├── requirements.txt             # Dependencies (fastapi, uvicorn, pandas, sklearn, numpy)
├── verify_ml.py                 # ✅ VERIFICADO EXITOSAMENTE
├── test_api.py                  # Test endpoints (con servidor)
├── README.md                     # 📖 ACTUALIZADO con ejemplos
├── ENTREGA_ETAPA1.md           # 📋 Documentación completa
├── data/
│   ├── demo_churn.csv          # 160 rows, clean, synthetic
│   └── README.md               # Dataset docs
└── ml/
    ├── pipeline.py             # build_pipeline() → Pipeline sklearn
    ├── metrics.py              # compute_classification_metrics()
    └── store.py                # InMemoryModelStore (singleton)
```

---

## 🎯 Restricciones Cumplidas

✅ No agregar DB (solo RAM)  
✅ Simple y reproducible (seed=42)  
✅ Dependencias solo en apps/api/requirements.txt  
✅ Artefactos en memoria (sin persistencia a disco)  
✅ Respuestas JSON claras y estructuradas  

---

## 🔧 Error Handling

| Error | Status | Respuesta |
|-------|--------|-----------|
| Faltan columnas | 400 | "Missing columns: [list]" |
| No hay modelo | 400 | "No model trained yet" |
| Source inválido | 400 | "Unknown source: X" |
| Upload | 400 | "Upload not implemented yet" |

Categorías desconocidas: ✅ Manejadas con `OneHotEncoder(handle_unknown="ignore")`  
Missing values: ✅ Imputados (media para numéricas, moda para categóricas)  

---

## 📊 Dataset Demo

| Campo | Tipo | Rango/Valores |
|-------|------|---------------|
| age | int | 25-56 |
| tenure_months | int | 0-54 |
| monthly_spend | float | 19.99-169.99 |
| support_tickets_last_90d | int | 0-5 |
| plan | categorical | basic, pro, enterprise |
| region | categorical | latam, na, eu |
| **churn** | **binary** | **0/1** (~45% positivos) |

---

## 📝 Ejemplos curl Listos para Copiar/Pegar

Ver [apps/api/README.md](README.md#quick-start-curl-examples) para ejemplos completos.

---

**✅ ENTREGA COMPLETADA - Todos los componentes probados y funcionando**  
**Fecha:** 30 de enero de 2026
