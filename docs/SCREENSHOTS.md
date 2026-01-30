# Screenshots para el README

## Ubicación de archivos

Las imágenes referenciadas en el README deben colocarse en:

```
decisionops-ai-toolkit/
└── docs/
    └── screenshots/
        ├── demo-main.png
        └── demo-result.png
```

## Screenshot 1: demo-main.png

**Descripción:** Pantalla principal de la aplicación mostrando los 3 pasos

**Debe incluir:**
- Header: "DecisionOps AI Toolkit - Demo"
- Sección "Qué estás viendo" (3 bullets)
- Card para "Paso 1: Entrená el Modelo" con botón "Entrenar Modelo"
- Card para "Paso 2: Hacé una Predicción" con:
  - Selector de ejemplos ("Cliente leal", "Cliente en riesgo", "Oportunidad de crecimiento")
  - Formulario con 6 campos (age, tenure_months, monthly_spend, tickets, plan, region)
  - Botón "Predecir"
- Card para "Paso 3: Explicá la Decisión" con botón "Obtener Explicación"

**Dimensiones sugeridas:** 1200x800px (16:10 o 4:3)

## Screenshot 2: demo-result.png

**Descripción:** Resultado de predicción + tabla de explicación

**Debe incluir:**
- Resultado de predicción: "🔴 Churn - Cliente en riesgo" o "🟢 Retención - Cliente leal"
- Porcentaje de confianza (ej: "87.45%")
- Tabla con top 8 features:
  - Columna 1: Feature name (ej: "plan_enterprise", "tenure_months")
  - Columna 2: Importance/Weight (número con signo)
  - Colores: Rojo (↑ aumenta churn), Verde (↓ disminuye churn)

**Dimensiones sugeridas:** 1200x600px

## Instrucciones para captura

### Opción 1: Screenshots manuales (Recomendado)
1. Ejecutar `npm run dev:api` en una terminal
2. Ejecutar `npm run dev:web` en otra terminal
3. Abrir http://localhost:5173 en navegador
4. Hacer screenshots siguiendo descripción de cada imagen
5. Guardar como PNG en `docs/screenshots/`

### Opción 2: Mockups/Diseño
- Si no tienes los servicios corriendo, puedes crear mockups con:
  - Figma (https://figma.com)
  - GIMP
  - Photoshop
  - Excalidraw

## Formato de imagen

- **Formato:** PNG (comprimido)
- **Resolución:** 1200px wide (altura variable)
- **Tamaño máximo:** 500KB por imagen
- **Fondo:** Blanco o captura real de navegador

## Notas

- Los placeholders en el README ya están listos, solo necesitan ser reemplazados
- Si decides no agregar screenshots, simplemente borra las líneas que empiezan con `>`
- Los links son relativos: `docs/screenshots/demo-main.png`
- Las imágenes deben estar en el repo para que funcionen en GitHub

## Verificación en GitHub

Una vez que subas las imágenes:
```bash
git add docs/screenshots/
git commit -m "docs: agregar screenshots de demo"
git push origin main
```

Las imágenes aparecerán automáticamente en el README en GitHub.
