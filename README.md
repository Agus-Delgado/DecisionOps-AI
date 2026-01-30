# DecisionOps AI Toolkit

![CI](https://github.com/https://github.com/Agus-Delgado/DecisionOps-AI.git/actions/workflows/ci.yml/badge.svg)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/Version-v0.1.0-blue.svg)](https://github.com/augusllc/decisionops-ai-toolkit/releases/tag/v0.1.0)
[![Stack](https://img.shields.io/badge/Stack-FastAPI%20%7C%20Vite%20%7C%20React-blueviolet)](https://github.com/augusllc/decisionops-ai-toolkit)

## ¿Qué es DecisionOps AI Toolkit?

- **ML baseline**: Herramienta para análisis predictivo con modelos de Machine Learning (clasificación, regresión, clustering)
- **Explicabilidad**: Genera explicaciones interpretables de las predicciones (SHAP, feature importance, métricas)
- **Futuro: GenAI briefs**: Integración con LLMs para resúmenes ejecutivos en lenguaje natural (BYOK opcional)

**Enfoque costo cero**: Sin base de datos, sin servicios pagos, sin vendor lock-in. Todo corre en local.

---

## Demo en 60 Segundos

### ¿Qué habilita?

Identifica clientes con riesgo de irse (**churn prediction**) y **entiende por qué** sin caja negra. Toma decisiones informadas: retención proactiva, upgrade de plan, o investigación de fricción.

### Flujo: Entrenar → Predecir → Explicar

**Paso 1️⃣ : Entrená**
- Click en "Entrenar Modelo" 
- Modelo se entrena en dataset demo (1000 clientes reales)
- Métricas mostradas: accuracy, precision, recall, F1, ROC-AUC

**Paso 2️⃣ : Predecí**
- Cargá ejemplo o ingresá datos de un cliente
- Click "Predecir" 
- Resultado: ¿Churn (🔴) o Retención (🟢)? + Confianza %

**Paso 3️⃣ : Explicá**
- Click "Obtener Explicación"
- Top 8 features más importantes
- Entendé qué influye más en el riesgo

> **Placeholder: Screenshot 1** - Interfaz principal con 3 pasos y selector de ejemplos
> ![Pantalla principal - Entrenar, Predecir, Explicar](docs/screenshots/demo-main.png)

> **Placeholder: Screenshot 2** - Predicción + tabla de explicación
> ![Resultado: Predicción + Feature Importance](docs/screenshots/demo-result.png)

---

## Estructura del Proyecto

Monorepo con:
- **apps/web**: Frontend con Vite + React + TypeScript
- **apps/api**: Backend con FastAPI + scikit-learn

Nota: Se removieron carpetas legacy api/web fuera de apps/ (si existían).

---

## Prerrequisitos

- **Node.js** 18+ (para web)
- **Python** 3.9+ (para API)
- **npm** (incluido con Node.js)

---

## Cómo Correr el Proyecto en Local

### Opción 1: Usando scripts npm desde la raíz (Recomendado)

**⚠️ IMPORTANTE**: El comando `npm run dev` **SOLO imprime una guía** de ayuda. Para desarrollo real necesitás **DOS terminales**:

#### Terminal 1 - API (Backend):
```bash
npm run dev:api
```

La API estará disponible en:
- **API**: http://127.0.0.1:8000
- **Swagger Docs**: http://127.0.0.1:8000/docs
- **Health check**: http://127.0.0.1:8000/health

#### Terminal 2 - Web (Frontend):
```bash
npm run dev:web
```

La web estará disponible en:
- **Web**: http://localhost:5173 (o el puerto que muestre Vite)

---

### Opción 2: Ejecución manual (paso a paso)

Si preferís mayor control, podés ejecutar cada app manualmente:

#### 1. API (Backend)

```bash
cd apps/api
python -m venv .venv
.venv\Scripts\activate   # En Windows
# .venv/bin/activate     # En Linux/Mac
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

**URLs de la API**:
- http://127.0.0.1:8000/health → `{"status":"ok"}`
- http://127.0.0.1:8000/version → `{"name":"decisionops-ai-toolkit","version":"..."}`
- http://127.0.0.1:8000/docs → Documentación interactiva Swagger

#### 2. Web (Frontend)

```bash
cd apps/web
npm install
npm run dev
```

**URL del Frontend**:
- http://localhost:5173

**Configuración opcional (si querés cambiar el base URL de la API)**:
```bash
cp .env.example .env.local
# Editá .env.local y cambiá VITE_API_BASE si es necesario
```

**Verificación**: La sección "API Status" debe mostrar ✅ OK si la API está corriendo.

---

## Validación Rápida

Para verificar que todo compila y los tests pasan:

```bash
npm run check
```

Esto ejecuta:
1. `npm run check:api` - Tests del backend con pytest
2. `npm run build:web` - Build del frontend

Si todo está bien, debería terminar sin errores.

---

## Levantar con Docker Compose

```bash
docker compose up --build
```

**URLs en Docker:**
- Web: http://localhost:5173
- API: http://localhost:8000

La web se construye con `VITE_API_BASE` apuntando a `http://localhost:8000`, por lo que corre en **modo real** (sin banner demo) y permite Train/Predict/Explain.

---

## Scripts Disponibles (desde la raíz)

| Script | Descripción |
|--------|-------------|
| `npm run dev` | ⚠️ **Solo imprime guía** - No corre ningún servicio |
| `npm run dev:api` | Inicia el backend FastAPI en http://127.0.0.1:8000 |
| `npm run dev:web` | Inicia el frontend Vite en http://localhost:5173 |
| `npm run check` | Validación rápida: tests API + build web |
| `npm run check:api` | Tests del backend (pytest) |
| `npm run build:web` | Build del frontend (Vite) |
| `npm run lint` | Linting (placeholder) |
| `npm run test` | Tests (placeholder) |

---

## Smoke Test Manual

**Nota**: El proyecto actualmente no tiene framework de tests automatizados configurado (sin dependencias adicionales). Usa este checklist para validar la UI demo:

### Requisitos previos
1. API corriendo en `http://127.0.0.1:8000` (ejecutá `npm run dev:api`)
2. Web corriendo en `http://localhost:5173` (ejecutá `npm run dev:web`)

### Checklist de pruebas

- [ ] **1. Check API**: Click en botón "Check API" → Debe mostrar ✅ OK con respuesta JSON de `/health`
- [ ] **2. Sin modelo entrenado**: Si API está limpia, intentá predecir → Debe mostrar error "No model trained yet"
- [ ] **3. Entrenar Modelo**: Click en "Entrenar Modelo" → Muestra métricas (accuracy, precision, recall, f1, roc_auc)
- [ ] **3.1 Persistencia**: Reiniciá la API y llamá `GET /model/status` → Debe indicar `has_model=true` y devolver métricas
- [ ] **4. Formulario con defaults**: Verificá que el formulario pre-carga valores (age: 35, tenure_months: 24, etc.)
- [ ] **5. Modificar formulario**: Cambiá valores del plan (basic/pro/enterprise) y región (latam/na/eu) → Valida que acepte cambios
- [ ] **6. Predicción exitosa**: Después de entrenar, click "Predecir" → Muestra label (🔴 Churn / 🟢 No Churn) + probabilidad
- [ ] **7. Explicación**: Click "Obtener Explicación" → Muestra tabla con top 8 features + weights
- [ ] **8. Manejo de errores**: Apagá la API → Todos los botones deben mostrar error legible
- [ ] **9. Responsividad**: Redimensioná el navegador → Formulario debe adaptarse (grid responsive)

---

## Integración Continua (CI/CD)

Este proyecto incluye GitHub Actions para validar cada push y pull request:

### Workflow: `ci.yml`

**Qué verifica:**
- ✅ **Frontend builds**: `npm run build` en `apps/web`
- ✅ **Backend imports**: `python -c "from main import app"` en `apps/api`
- ✅ **Dependencias**: npm y pip se instalan correctamente

**Triggers:**
- `push` a `main`
- `pull_request` a `main`

**Resultado:**
- Verde ✅: Frontend y backend son importables
- Rojo ❌: Build falló o dependencias no resuelven

Ver status en la rama o en el Actions tab de GitHub.

---

## Troubleshooting

### La web no conecta con la API
- Verificá que ambos servicios estén corriendo en terminales separadas
- Confirmá que la API responda en http://127.0.0.1:8000/health

### Puerto ocupado
- Si el puerto 8000 o 5173 está ocupado, modificá el puerto en los scripts o cerrá la app que lo esté usando

### Errores de Python
- Asegurate de tener Python 3.9+ instalado: `python --version`
- Verificá que el entorno virtual esté activado antes de instalar dependencias

---

## Contribuciones

¿Querés aportar? ¡Excelente! 

Podés:
- 🐛 Reportar bugs o sugerir features (Issues)
- 📝 Mejorar documentación
- ✨ Agregar funcionalidades (PRs)

Ver [CONTRIBUTING.md](CONTRIBUTING.md) para instrucciones detalladas.

**Expectativas:** Código limpio, tests pasando (CI), y respeto a nuestro [Código de Conducta](CODE_OF_CONDUCT.md).

---

## Licencia

MIT © 2026 DecisionOps AI Toolkit Contributors. Ver [LICENSE](LICENSE).
