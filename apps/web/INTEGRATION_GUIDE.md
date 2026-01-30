# ETAPA 1 — Web ↔️ API Connection: Complete Guide

## ✅ What Was Done

Modified `apps/web/src/App.tsx` to connect with the ML API endpoints:

### Features Implemented

1. **Train Demo Model Button**
   - POST to `http://localhost:8000/train`
   - Shows training status: idle → training → trained/error
   - Displays metrics: accuracy, precision, recall, f1, roc_auc

2. **Prediction Form**
   - Input fields for: age, tenure_months, monthly_spend, support_tickets_last_90d
   - Dropdowns for: plan (basic/pro/enterprise), region (latam/na/eu)
   - Submit button triggers POST to `/predict`
   - Shows prediction result: label (Likely to Churn / Likely to Stay) + probability %

3. **Top Drivers Section**
   - Automatically loads after model training via GET `/explain`
   - Shows top 8 features with weights
   - Indicates direction: ↓ Decreases churn vs ↑ Increases churn

4. **Error Handling**
   - "Train the model first" if attempting prediction without training
   - API connection status indicator
   - User-friendly error messages

### Files Modified

- `apps/web/src/App.tsx` — Complete rewrite with ML integration

---

## 🚀 How to Validate Locally

### 1. **Start the API Server** (Terminal 1)

```bash
cd apps/api
python -m venv .venv           # (First time only)
.venv\Scripts\activate
pip install -r requirements.txt # (First time only)
python verify_ml.py             # (Optional: verify components work)
uvicorn main:app --reload --port 8000
```

Expected output:
```
INFO:     Started server process [XXXX]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
```

### 2. **Start the Web Server** (Terminal 2)

```bash
cd apps/web
npm install              # (First time only)
npm run dev
```

Expected output:
```
  VITE v4.X.X  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  Press h to show help
```

### 3. **Open in Browser**

Navigate to: **http://localhost:5173**

---

## ✅ Full Test Workflow

### Step 1: Check API Status
- ✅ Should show "✅ Connected" (green)
- ❌ If shows "❌ Not available", make sure API is running

### Step 2: Train Model
1. Click **🚀 Train Demo Model** button
2. Wait for button to change to **✅ Model Trained** (green)
3. See metrics appear below:
   - Accuracy: ~0.96
   - Precision: ~0.87
   - Recall: ~1.00
   - F1: ~0.93
   - ROC-AUC: ~1.00

### Step 3: Load Feature Importance
- After training, **📈 Top Drivers** section should appear automatically
- Shows 8 features with weights
- Example features: tenure_months, monthly_spend, plan_pro, etc.

### Step 4: Make Prediction
1. Form is pre-filled with demo values:
   - Age: 34
   - Tenure: 12 months
   - Monthly Spend: $50.50
   - Support Tickets: 1
   - Plan: Pro
   - Region: LATAM

2. Click **🔮 Predict** button
3. See prediction result:
   - **Churn Label:** "Likely to Stay ✅" (green, probability < 50%)
   - **Probability:** e.g., "28.5%"

### Step 5: Try Different Values
Edit the form to test:
- **Churner profile (high churn probability):**
  - Age: 26
  - Tenure: 1
  - Plan: Basic
  - Tickets: 3

- **Loyal profile (low churn probability):**
  - Age: 50
  - Tenure: 36
  - Plan: Enterprise
  - Tickets: 0

---

## 📊 Expected Behavior

### Normal Flow
```
API Status: ✅ Connected
  ↓
[User clicks "Train Demo Model"]
  ↓
Training... (button shows ⏳ Training)
  ↓
✅ Model Trained (green button)
  ↓
Metrics display + Feature Importance loads
  ↓
[User fills form and clicks "Predict"]
  ↓
Predicting... (button shows ⏳ Predicting)
  ↓
✅ Prediction Result displays
```

### Error Cases

**Case 1: API not running**
- API Status shows: "❌ Not available"
- Train button is disabled
- Fix: Start API server (terminal 1)

**Case 2: Try to predict without training**
- Error message: "Error: Train the model first"
- Fix: Click "Train Demo Model" first

**Case 3: Invalid API response**
- Error message shows HTTP status or details
- Fix: Check API server logs

---

## 🔍 Testing Edge Cases

### Test Case 1: Multiple Predictions
1. Train once
2. Change form values
3. Click Predict again → should update result

### Test Case 2: API Failure Recovery
1. Start with API running
2. Stop API (Ctrl+C in terminal 1)
3. See errors in web app
4. Restart API
5. Everything should work again

### Test Case 3: Form Validation
- Try entering negative age: Should accept (form doesn't validate)
- Try entering $0: Should accept
- Try entering 0 tickets: Should accept
- → All values are passed to API (API handles validation)

---

## 📐 API Calls Made by Web App

### 1. GET /health (on page load)
```bash
curl http://localhost:8000/health
```

### 2. POST /train (Train button click)
```bash
curl -X POST http://localhost:8000/train \
  -H "Content-Type: application/json" \
  -d '{"source":"demo","target":"churn","test_size":0.2}'
```

### 3. GET /explain (after training)
```bash
curl http://localhost:8000/explain
```

### 4. POST /predict (Predict button click)
```bash
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{
    "records":[{
      "age":34,
      "tenure_months":12,
      "monthly_spend":50.5,
      "support_tickets_last_90d":1,
      "plan":"pro",
      "region":"latam"
    }]
  }'
```

---

## 🛠️ Debugging

### View Network Requests
1. Open **Developer Tools** (F12)
2. Go to **Network** tab
3. Click buttons and watch requests
4. Click each request to see Response

### View Console Errors
1. Open **Developer Tools** (F12)
2. Go to **Console** tab
3. Should see no errors (unless API is down)

### Check API Logs
- In terminal 1 (API), see request logs:
  ```
  INFO:     POST /train 200 OK
  INFO:     POST /predict 200 OK
  INFO:     GET /explain 200 OK
  ```

---

## ✨ Code Changes Summary

### What Changed in App.tsx

**Before:**
- Basic health check
- Mock "Try Demo" button

**After:**
- Real API integration
- Training state management
- Prediction form (6 controlled inputs)
- Feature importance display
- Comprehensive error handling
- Professional styling (colors, icons, layout)

### Key Implementation Details

1. **State Management:** Used React hooks (useState, useEffect)
2. **API Calls:** Native fetch (no axios or other libraries)
3. **Form Handling:** Controlled inputs with type conversion
4. **Error Handling:** Try-catch blocks + user messages
5. **Styling:** Inline styles (no CSS files, no new dependencies)

---

## ✅ Verification Checklist

Before submitting, verify:

- [ ] API running on http://localhost:8000
- [ ] Web running on http://localhost:5173
- [ ] API Status shows "✅ Connected"
- [ ] Train button works and shows metrics
- [ ] Feature Importance appears after training
- [ ] Predict form submits without error
- [ ] Prediction result shows (label + probability)
- [ ] Error handling works (try missing train)
- [ ] Different form values produce different predictions

---

## 📁 Files Summary

### Modified
- `apps/web/src/App.tsx` — Full integration with API

### No Changes to
- `apps/web/src/api.ts` — Still just getHealth()
- `apps/api/main.py` — All endpoints working as-is
- `package.json`, `tsconfig.json`, `vite.config.ts` — No new deps

---

## 🎯 Next Steps (Future)

- [ ] Add data upload feature (for custom datasets)
- [ ] Show confusion matrix visualization
- [ ] Add SHAP explanations
- [ ] Model comparison UI
- [ ] Batch predictions

---

**✅ ETAPA 1 INTEGRATION COMPLETE - Web ↔️ API fully connected**  
**Date:** January 30, 2026
