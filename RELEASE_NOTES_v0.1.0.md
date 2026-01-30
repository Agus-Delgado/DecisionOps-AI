# Release Notes v0.1.0

**Fecha:** 30 de enero de 2026  
**Versión:** v0.1.0 (MVP)

---

## 🎉 Highlights

### ✨ Demo UI End-to-End
- **Interfaz intuitiva**: 3 pasos simples (Entrenar → Predecir → Explicar)
- **Carga de ejemplos**: Botón "Cargar ejemplo" con 3 perfiles realistas (cliente leal, en riesgo, oportunidad)
- **Resultado visual claro**: Predicción con emoji (🔴 Churn / 🟢 Retención) + confianza %
- **Zero UI libraries**: Solo React + estilos inline, sin dependencias innecesarias

### 🧠 Explicabilidad
- **Feature importance**: Top 8 features ordenadas por impacto
- **Interpretable**: Coeficientes de LogisticRegression (sin caja negra)
- **Colores intuitivos**: Rojo (aumenta churn) / Verde (disminuye churn)

### 📚 Documentación Profesional
- **README.md**: Badges, demo visual, instrucciones claras
- **CONTRIBUTING.md**: Cómo correr local, workflow de PRs, convención de commits
- **CODE_OF_CONDUCT.md**: Comunidad inclusiva y respetuosa
- **CI_CD.md**: Documentación de GitHub Actions
- **FIELD_MAPPING.md**: Referencia de mapeo frontend-backend
- **TESTING.md**: Checklist manual de smoke tests

### 🚀 CI/CD Gratis
- **GitHub Actions**: Valida que frontend buildea y backend importa en cada push
- **Zero secrets**: No requiere credenciales ni configuración
- **Caching**: npm y pip cacheados para builds rápidos

---

## 🚀 Quick Start (2 terminales)

### Terminal 1 - Backend API
```bash
npm run dev:api
# O manualmente:
cd apps/api
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Acceso:
- **API:** http://127.0.0.1:8000
- **Swagger Docs:** http://127.0.0.1:8000/docs

### Terminal 2 - Frontend Web
```bash
npm run dev:web
# O manualmente:
cd apps/web
npm install
npm run dev
```

Acceso:
- **Web:** http://localhost:5173

---

## 📊 Qué Incluye

### Backend (FastAPI + scikit-learn)
- ✅ Endpoint `/train` - Entrena modelo con dataset demo
- ✅ Endpoint `/predict` - Predicción para nuevos registros
- ✅ Endpoint `/explain` - Feature importance basado en coeficientes
- ✅ CORS configurado para localhost:5173
- ✅ Validación de entrada robusta

### Frontend (Vite + React + TypeScript)
- ✅ Interfaz de 3 pasos (Entrenar → Predecir → Explicar)
- ✅ Formulario interactivo con 6 campos
- ✅ Carga de ejemplos pre-configurados
- ✅ Estados de loading/error legibles
- ✅ Tabla de explicación con top 8 features
- ✅ Responsive (desktop + mobile)

### Dataset
- 1000 registros de clientes (churn prediction)
- 6 features + 1 target
- Datos realistas para demostración

---

## ⚠️ Limitaciones Actuales

### Upload de Dataset
- ❌ Endpoint `/train` con `source="upload"` no implementado aún
- **Workaround**: Usar `source="demo"` (dataset incluido)
- **Próximo paso**: Agregar endpoint `/upload` en v0.2

### Explicación
- ⚠️ Usa coeficientes de LogisticRegression (interpretable pero simple)
- **Futuro**: SHAP values u otros métodos más avanzados
- **Nota**: Suficiente para MVP, escalable después

### Autenticación
- ❌ Sin autenticación ni autorización
- ⚠️ **No para producción** - Es un MVP/demo
- **Diseño**: Costo cero, sin base de datos, sin servicio de auth

### Tests Automatizados
- ❌ Actualmente solo smoke test manual
- **CI valida**: Build web + import backend (suficiente para MVP)
- **Próximo**: Vitest/Jest opcional en v0.2

---

## 🔄 Próximos Pasos

### v0.2 (Roadmap)
- [ ] **Tests automatizados**: Vitest + Testing Library (opcional)
- [ ] **Upload de dataset**: Endpoint `/upload` + UI para subir CSV
- [ ] **Modelos adicionales**: RandomForest, XGBoost (opcional)
- [ ] **Deploy demo**: Vercel (frontend) + Railway (backend)
- [ ] **Explicación avanzada**: SHAP values o similar

### Futuro (v1.0+)
- GenAI briefs (Bring Your Own Key - BYOK)
- Clustering en demo
- API de reentrenamiento scheduled
- Web en múltiples idiomas

---

## 🛠️ Stack Técnico

| Componente | Tecnología | Versión |
|---|---|---|
| **Frontend** | Vite + React + TypeScript | React 18, Vite 5, TS 5.3 |
| **Backend** | FastAPI + scikit-learn | FastAPI 0.100+, sklearn 1.3+ |
| **CI/CD** | GitHub Actions | N/A |
| **Licencia** | MIT | N/A |

---

## 🤝 Cómo Contribuir

Ver [CONTRIBUTING.md](CONTRIBUTING.md) para:
- Cómo correr local
- Workflow de PRs
- Convención de commits
- Estándares de código

---

## 📝 Nota sobre Costo Cero

Este proyecto **se ejecuta completamente en local**:
- ✅ Sin base de datos
- ✅ Sin servicios cloud pagos
- ✅ Sin APIs externas (excepto opcional BYOK en futuro)
- ✅ Dependencias de código abierto (gratuitas)

Perfecto para:
- Prototipado rápido
- Aprendizaje
- Presentaciones
- Base para productos propios

---

## ✅ Checklist de Prueba

Antes de reportar bugs, verifica:
- [ ] Ambos servicios corriendo (API + Web)
- [ ] API en http://127.0.0.1:8000
- [ ] Web en http://localhost:5173
- [ ] Entrená modelo primero
- [ ] Luego predecí
- [ ] Luego pidió explicación

---

## 📞 Feedback

¿Errores? ¿Sugerencias?
- Abre un [Issue](https://github.com/augusllc/decisionops-ai-toolkit/issues)
- Haz un [PR](https://github.com/augusllc/decisionops-ai-toolkit/pulls)
- Lee el [Código de Conducta](CODE_OF_CONDUCT.md)

---

**Gracias por usar DecisionOps AI Toolkit! 🚀**

MIT License © 2026 DecisionOps AI Toolkit Contributors
