# apps/web

Vite + React + TypeScript demo application.

## Features

- **3-step flow**: Train → Predict → Explain
- **Self-explanatory UI**: No README reading needed
- **Example profiles**: Quick-load realistic customer profiles
- **Business context**: "What you're seeing" section with key value props
- **Zero dependencies**: Only React + TypeScript (no testing frameworks, no UI libs)

## Quick Start

```bash
npm install
npm run dev
# Opens http://localhost:5173
```

## Demo Flow

1. **Paso 1 (Train)**: Click "Entrenar Modelo" to train on demo churn dataset
2. **Paso 2 (Predict)**: Load an example profile or enter custom data, click "Predecir"
3. **Paso 3 (Explain)**: Click "Obtener Explicación" to see feature importance

## Commands

- `npm install` - Install dependencies
- `npm run dev` - Start dev server (http://localhost:5173)
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Environment

Optional: Set custom API base URL in `.env`:
```
VITE_API_BASE=http://127.0.0.1:8000
```

Default: `http://127.0.0.1:8000`

## Testing

See [TESTING.md](./TESTING.md) for manual smoke test checklist.

