# Contributing to DecisionOps AI Toolkit

¡Gracias por tu interés en contribuir! Este documento te guía sobre cómo hacerlo.

## Cómo Correr Local

### Frontend
```bash
cd apps/web
npm install
npm run dev
# Abre http://localhost:5173
```

### Backend
```bash
cd apps/api
python -m venv .venv
.venv\Scripts\activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
# Abre http://127.0.0.1:8000/docs
```

### Ambos (recomendado)
```bash
# Terminal 1
npm run dev:api

# Terminal 2 (en otra terminal)
npm run dev:web
```

## Cómo Proponer Cambios

### 1. Fork el repo
```bash
git clone https://github.com/YOUR_USERNAME/decisionops-ai-toolkit.git
cd decisionops-ai-toolkit
git checkout -b feature/mi-feature
```

### 2. Haz cambios y testa
- **Frontend:** Verifica que `npm run build` compila sin errores
- **Backend:** Verifica que `python -c "from main import app"` importa sin errores
- Prueba la demo en local (entrenar → predecir → explicar)

### 3. Commit con mensajes claros
```bash
git add .
git commit -m "feat: agregar nuevo endpoint" # o fix:, docs:, etc.
git push origin feature/mi-feature
```

### 4. Abre un Pull Request
- Describe qué cambiaste y por qué
- Menciona si cierra algún issue
- Espera que el CI (GitHub Actions) pase ✅

## Estilo de Commits (Conventional Commits)

Usamos formato estándar para claridad:

```
<type>: <descripción breve>
```

**Tipos:**
- `feat:` - Nueva característica
- `fix:` - Bug fix
- `docs:` - Cambios en documentación
- `ci:` - Cambios en CI/CD
- `refactor:` - Refactorización sin cambio funcional

**Ejemplos:**
```
feat: agregar endpoint de exportación
fix: corregir mapeo de campos en predicción
docs: actualizar guía de instalación
ci: agregar test de linting
```

## Estándares Mínimos

- ✅ El código compila/importa sin errores
- ✅ No agregar dependencias nuevas sin discusión
- ✅ Mantener la filosofía costo cero (sin servicios pagos)
- ✅ README debe estar actualizado si agregas features

## Preguntas

Si no estás seguro:
1. Abre una "Discussion" en GitHub
2. Crea un issue describiendo tu idea
3. O simplemente propón un PR - los mantenedores ayudarán

¡Gracias por contribuir! 🚀
