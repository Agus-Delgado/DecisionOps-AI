# Testing Guide - Web UI

## Current State

**No automated test framework** is currently configured to keep dependencies minimal.

The app (`App.tsx`) provides a comprehensive demo UI with:
- Health check (GET `/health`)
- Model training (POST `/train`)
- Predictions (POST `/predict`)
- Feature explanations (GET `/explain`)

## Manual Smoke Test Procedure

### Setup
1. Ensure API is running: `npm run dev:api` (should respond at `http://127.0.0.1:8000`)
2. Start web dev server: `npm run dev:web` (should open at `http://localhost:5173`)

### Test Scenarios

#### A. API Connectivity
1. Open browser to `http://localhost:5173`
2. Click **"Check API"** button
3. **Expected**: Shows "✅ OK" with JSON: `{"status":"ok"}`
4. **If error**: Check that API is running and CORS is allowed for port 5173

#### B. Model Training Flow
1. Click **"Entrenar Modelo"** button
2. **Expected**: 
   - Button shows "Entrenando..."
   - After 2-3 seconds, shows success box with metrics table
   - Metrics include: accuracy, precision, recall, f1, roc_auc
3. **If error**: Check API is running and demo dataset exists at `apps/api/data/demo_churn.csv`

#### C. Form Interaction
1. Verify form pre-loads with defaults:
   - age: 35
   - tenure_months: 24
   - monthly_spend: 150
   - tickets: 2
   - plan: pro
   - region: latam
2. Change a few fields (e.g., age → 45, plan → basic, region → eu)
3. **Expected**: Form accepts input without errors

#### D. Prediction (requires trained model)
1. After training (step B), modify form or keep defaults
2. Click **"Predecir"** button
3. **Expected**:
   - Shows success box
   - Displays prediction label: "🔴 Churn" or "🟢 No Churn"
   - Shows probability as percentage (e.g., "87.45%")

#### E. Feature Explanation
1. After training (step B), click **"Obtener Explicación"** button
2. **Expected**:
   - Shows table with max 8 features
   - Each row: feature name | weight (red/green color for positive/negative)
   - Method: "logreg_coefficients"

#### F. Error Handling
1. Stop the API (Ctrl+C on API terminal)
2. Try any action (e.g., click "Check API" or "Predecir")
3. **Expected**: Shows red error box with readable message
4. **Example**: "Error: No model trained yet. Call /train first."

#### G. Responsive Design
1. Resize browser window (narrow to <600px wide)
2. **Expected**: 
   - Form fields stack vertically (grid: single column)
   - Buttons remain clickable
   - Text remains readable

### UI Elements Checklist
- [ ] Header: "DecisionOps AI Toolkit - Demo"
- [ ] Section 1: "Check API" button + status box
- [ ] Section 2: "Entrenar Modelo" button + metrics table
- [ ] Section 3: Form with 6 fields + "Predecir" button + result
- [ ] Section 4: "Obtener Explicación" button + feature table
- [ ] Footer: "Costo cero • Sin DB • BYOK opcional"

### Browser Console Checks
1. Open DevTools (F12)
2. Check **Console** tab for errors
3. **Expected**: No red error messages (warnings are OK)
4. **Check Network** tab: All API requests should have 200/400 status, not 500/network failures

## Future: Automated Testing

If you want to add automated tests later without changing the current minimal setup:

```bash
# Option 1: Simple Vitest setup (lightweight)
npm install -D vitest @testing-library/react @testing-library/jsdom

# Option 2: Minimal custom test runner in pure Node.js
# (Execute TypeScript tests manually)
```

Example test file (when adding framework):
```typescript
// src/__tests__/App.spec.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../App';

describe('App', () => {
  it('renders title', () => {
    render(<App />);
    expect(screen.getByText(/DecisionOps AI Toolkit/i)).toBeInTheDocument();
  });

  // Health check test (with fetch mock)
  it('calls health check on button click', async () => {
    global.fetch = vi.fn(() => 
      Promise.resolve({ ok: true, json: () => ({ status: 'ok' }) })
    );
    render(<App />);
    const button = screen.getByText('Check API');
    await userEvent.click(button);
    expect(global.fetch).toHaveBeenCalledWith('http://127.0.0.1:8000/health');
  });
});
```

## Documentation Links
- Frontend: [apps/web/README.md](./README.md)
- API: [apps/api/README.md](../api/README.md)
- Root: [README.md](../../README.md) - See "Smoke Test Manual" section
