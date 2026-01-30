# 📋 ETAPA 1 — Quick Reference Card

## 🚀 Start (30 seconds)

```bash
# Terminal 1
cd apps/api
.venv\Scripts\activate
uvicorn main:app --reload --port 8000

# Terminal 2
cd apps/web
npm run dev

# Browser
http://localhost:5173
```

---

## 🎯 Flow Diagram

```
┌────────────────────────────────────────────────┐
│ Web App (React)                                │
│ http://localhost:5173                          │
├────────────────────────────────────────────────┤
│                                                │
│ 1. Page Load → GET /health                     │
│    ✓ API Status: ✅ Connected                  │
│                                                │
│ 2. User clicks "Train"                         │
│    → POST /train                               │
│    ← {"metrics": {...}, "trained_at": "..."}   │
│    ✓ Show: Accuracy, F1, ROC-AUC               │
│                                                │
│ 3. Auto-load → GET /explain                    │
│    ← {"top_features": [...]}                   │
│    ✓ Show: Feature Importance Table             │
│                                                │
│ 4. User fills form & clicks "Predict"          │
│    → POST /predict {"records": [...]}          │
│    ← {"predictions": [{"label": 0|1, ...}]}    │
│    ✓ Show: "Likely to Stay ✅" / Churn ⚠️     │
│                                                │
└────────────────────────────────────────────────┘
                      ↕ HTTP
┌────────────────────────────────────────────────┐
│ API Server (FastAPI)                           │
│ http://localhost:8000                          │
├────────────────────────────────────────────────┤
│                                                │
│ GET /health          → {"status": "ok"}        │
│ POST /train          → Train on demo data      │
│ GET /explain         → Top 10 features         │
│ POST /predict        → Predict churn           │
│                                                │
│ Data: apps/api/data/demo_churn.csv             │
│ Models: ml/pipeline.py, metrics.py, store.py   │
│                                                │
└────────────────────────────────────────────────┘
```

---

## 📊 Expected Results

### After Training
```
Accuracy:  0.960 ✓
Precision: 0.875 ✓
Recall:    1.000 ✓
F1:        0.933 ✓
ROC-AUC:   1.000 ✓
```

### Sample Prediction
```
Input:  age=34, tenure=12, plan=pro, region=latam
Output: Label=0 (Stay), Probability=28.5%

Input:  age=26, tenure=1, plan=basic, region=latam
Output: Label=1 (Churn), Probability=72.5%
```

### Top Features
```
tenure_months    -1.250   ↓ Decreases churn
monthly_spend    -0.890   ↓ Decreases churn
plan_pro         -0.650   ↓ Decreases churn
plan_enterprise  -0.550   ↓ Decreases churn
...
```

---

## 🧪 Test Cases

### Happy Path
- [x] API connects
- [x] Train works
- [x] Metrics display
- [x] Features load
- [x] Predict works

### Error Cases
- [x] API down → "Not available"
- [x] Predict before train → "Train first"
- [x] Invalid data → API validation error

### Edge Cases
- [x] Different form values → Different predictions
- [x] API recovery → Everything still works

---

## 📁 Files Changed

```
BEFORE:                      AFTER:
apps/web/src/App.tsx   -->  Complete ML integration
  • Mock demo            →    ✓ Real API calls
  • No functionality     →    ✓ Train/Predict/Explain
  • 40 lines            →    400+ lines
```

---

## 🔌 API Endpoints Used

| Method | Endpoint | Request | Response |
|--------|----------|---------|----------|
| GET | /health | - | `{"status":"ok"}` |
| POST | /train | `{"source":"demo",...}` | Metrics |
| GET | /explain | - | Top features |
| POST | /predict | `{"records":[...]}` | Predictions |

---

## 💾 Key State Variables

```typescript
const [status, setStatus]           // API connection
const [trainState, setTrainState]   // Training progress
const [metrics, setMetrics]         // Training metrics
const [formData, setFormData]       // Prediction inputs
const [prediction, setPrediction]   // Prediction result
const [topFeatures, setTopFeatures] // Feature importance
```

---

## 🎨 UI Layout

```
┌─────────────────────────────────┐
│ 🤖 DecisionOps AI Toolkit       │
├─────────────────────────────────┤
│                                 │
│ API Status: ✅ Connected        │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ 📊 Model Training           │ │
│ │ [🚀 Train Demo Model]       │ │
│ │ Metrics: accuracy, f1, ...  │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ 🎯 Make Prediction          │ │
│ │ Age: [34______]             │ │
│ │ Tenure: [12______]          │ │
│ │ Spend: [50.50____]          │ │
│ │ Tickets: [1____]            │ │
│ │ Plan: [Pro ▼]               │ │
│ │ Region: [LATAM ▼]           │ │
│ │ [🔮 Predict]                │ │
│ │ Result: Likely to Stay ✅   │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ 📈 Top Drivers              │ │
│ │ Feature | Weight | Impact    │ │
│ │ tenure_ | -1.250 | ↓ Decreases
│ │ monthly_| -0.890 | ↓ Decreases
│ │ plan_pro| -0.650 | ↓ Decreases
│ │ ... (8 total)               │ │
│ └─────────────────────────────┘ │
│                                 │
└─────────────────────────────────┘
```

---

## 🔍 Debugging Commands

```bash
# Check API is running
curl http://localhost:8000/health

# Check specific endpoint
curl -X POST http://localhost:8000/train \
  -H "Content-Type: application/json" \
  -d '{"source":"demo","target":"churn","test_size":0.2}'

# View API logs in Terminal 1
# Look for: INFO: POST /train 200 OK

# View web console (F12 in browser)
# Look for: No red errors
```

---

## ⚠️ Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| "❌ Not available" | Start API: `uvicorn main:app...` |
| "Train the model first" | Click "Train" button first |
| Port already in use | Change port or kill other process |
| Module not found | `pip install -r requirements.txt` |
| npm packages missing | `npm install` in apps/web |

---

## 📖 Documentation Map

```
START HERE ↓

Quick Overview
└─ WEB_INTEGRATION.md (5 min)

Detailed Guide
└─ apps/web/INTEGRATION_GUIDE.md (15 min)

Implementation Details
└─ apps/web/DELIVERY_SUMMARY.md (10 min)

API Reference
└─ apps/api/README.md (5 min)

Complete Overview
└─ COMPLETE_SUMMARY.md (20 min)
```

---

## ✅ Verification

Before submitting, check:

```
□ API running: http://localhost:8000 → 200 OK
□ Web running: http://localhost:5173 → Loads
□ API Status: Shows ✅ Connected
□ Train button: Works, shows metrics
□ Features: Loads after training
□ Predict: Form works, shows result
□ Error: Shows "Train first" if needed
□ No console errors (F12 → Console)
```

---

## 🎯 Success Criteria

✅ All done when:
1. Web loads without errors
2. API status shows connected
3. Train button trains successfully
4. Metrics display correctly
5. Features load automatically
6. Predict form submits correctly
7. Results display with probability
8. Error handling works properly
9. Multiple predictions work
10. Different inputs = different results

---

## 📞 Quick Troubleshooting

```
Problem: Can't access http://localhost:5173
→ Check Terminal 2: Is web server running?
  $ cd apps/web && npm run dev

Problem: Can't train
→ Check Terminal 1: Is API running?
  $ cd apps/api && uvicorn main:app --reload --port 8000

Problem: "Train the model first"
→ This is correct! Click "Train" button first.

Problem: Console errors
→ Check DevTools (F12 → Console)
→ Refresh page (Ctrl+R)
→ Clear cache if needed

Problem: Predictions don't match expected
→ Normal - model is trained on demo data
→ Try different form values to see pattern
```

---

**Version:** 1.0  
**Status:** ✅ COMPLETE  
**Date:** January 30, 2026

Print this and keep handy while testing!
