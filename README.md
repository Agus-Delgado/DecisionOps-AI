# DecisionOps AI Toolkit

![CI](https://github.com/OWNER/REPO/actions/workflows/ci.yml/badge.svg)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/Version-v1.0.0-blue.svg)](https://github.com/augusllc/decisionops-ai-toolkit/releases/tag/v1.0.0)
[![Stack](https://img.shields.io/badge/Stack-FastAPI%20%7C%20Vite%20%7C%20React-blueviolet)](https://github.com/augusllc/decisionops-ai-toolkit)

## ¿Qué es DecisionOps AI Toolkit?

Herramienta para análisis predictivo con Machine Learning y explicabilidad integrada.

- **ML baseline (churn)** con métricas y persistencia de artifacts
- **Explicabilidad (feature importance)** para evitar "caja negra"
- **Modo Demo del frontend** (funciona sin backend) para compartir en Vercel

**Enfoque costo cero**: Sin base de datos, sin servicios pagos, sin vendor lock-in. Todo corre en local.

---

## Quickstart

### Opción A — Docker (recomendado, 1 comando)

```bash
docker compose up --build
```

**URLs:**
- **Web**: http://localhost:5173
- **API**: http://localhost:8000
- **Swagger**: http://localhost:8000/docs

**Detener:**
```bash
docker compose down       # Detiene los contenedores
docker compose down -v    # Detiene y elimina volúmenes
```

### Opción B — Local (2 terminales)

**Prerrequisitos**: Node.js 18+ y Python 3.9+

**Terminal 1 - API (Backend):**
```bash
npm run dev:api
```

**Terminal 2 - Web (Frontend):**
```bash
npm run dev:web
```

**URLs:**
- **Web**: http://localhost:5173
- **API**: http://127.0.0.1:8000
- **Swagger**: http://127.0.0.1:8000/docs

---

## Validación rápida (CI local)

```bash
npm run check
```

Este comando ejecuta:
- ✅ **pytest** en `apps/api` (tests del backend)
- ✅ **build** en `apps/web` (compilación del frontend)

Úsalo antes de hacer commits para validar que todo funcione correctamente.

---

## Demo flow (3 pasos)

### 1️⃣ Entrenar
**Endpoint:** `POST /train`  
Entrena el modelo con el dataset demo y devuelve métricas (accuracy, precision, recall, F1, ROC-AUC).

### 2️⃣ Predecir
**Endpoint:** `POST /predict`  
Recibe datos de un cliente y devuelve:
- **label**: `"churn"` o `"no_churn"`
- **probability**: Confianza de la predicción (0-1)

### 3️⃣ Explicar
**Endpoint:** `GET /explain`  
Devuelve las top features con sus pesos (feature importance), mostrando qué factores influyen más en la predicción.

**Tip:** Usá la interfaz web en http://localhost:5173 para probar el flujo completo con 3 botones.

---

## Modo Demo (frontend sin backend)

El frontend detecta automáticamente si la API está disponible:

- **Con API**: Conecta a `http://127.0.0.1:8000` y ejecuta entrenamientos/predicciones reales
- **Sin API**: Usa resultados mock coherentes (UI funcional para demos)

Esto permite deployar el frontend en Vercel sin necesidad de backend, ideal para compartir el proyecto en portfolios.

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

---

## Ejecución Manual (Alternativa)

Si preferís mayor control, podés ejecutar cada app manualmente:

#### API (Backend)

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

#### Web (Frontend)

```bash
cd apps/web
npm install
npm run dev
```

**URL del Frontend**:
- http://localhost:5173

**Configuración opcional**: Creá `.env.local` si necesitás cambiar `VITE_API_BASE`.

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
