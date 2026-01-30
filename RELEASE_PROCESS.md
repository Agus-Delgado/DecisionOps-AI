# Cómo Publicar Release en GitHub

## Opción 1: GitHub UI (Recomendado)

1. **Ir a Releases**
   - GitHub → Tu repo → Releases (pestaña a la derecha)

2. **Click "Create a new release"**

3. **Completar formulario:**
   - **Tag version:** `v0.1.0` (debe existir o crearse)
   - **Release title:** "v0.1.0 - MVP: Demo UI + Explicabilidad + CI/CD"
   - **Description:** Copiar contenido de [RELEASE_NOTES_v0.1.0.md](RELEASE_NOTES_v0.1.0.md)
   - **Prerelease:** Check if MVP (opcional)
   - **This is a latest release:** Check (ya que es primera release)

4. **Publish release**

## Opción 2: CLI con gh (si tienes GitHub CLI)

```bash
# Crear y publicar release
gh release create v0.1.0 \
  --title "v0.1.0 - MVP: Demo UI + Explicabilidad + CI/CD" \
  --notes-file RELEASE_NOTES_v0.1.0.md

# O simplemente (automático desde tag):
gh release create v0.1.0 --draft  # En draft para revisar antes
```

## Opción 3: Git Tags + GitHub Push

```bash
# Tag local
git tag -a v0.1.0 -m "v0.1.0: Demo end-to-end + docs + costo cero"

# Push del tag
git push origin v0.1.0

# Luego completar en GitHub UI con descripción
```

## Qué Copiar en "Description"

Copiar todo el contenido de [RELEASE_NOTES_v0.1.0.md](RELEASE_NOTES_v0.1.0.md), empezando desde:

```markdown
## 🎉 Highlights
...
```

Hasta el final:
```markdown
MIT License © 2026 DecisionOps AI Toolkit Contributors
```

## Adjuntos Opcionales

En GitHub Releases puedes adjuntar:
- Screenshots (si tienes)
- Binarios compilados
- Documentos

Para v0.1.0:
- Opcional: Adjuntar screenshot de la demo UI

## Verificación Post-Release

Después de publicar:
- ✅ El badge de version en README apunta a la release
- ✅ El tag existe en Git
- ✅ Los badges de GitHub funcionan
- ✅ Se ve en la pestaña "Releases"

## Próximas Releases

Para v0.2, crear nuevos release notes:
1. Copiar este archivo a `RELEASE_NOTES_v0.2.0.md`
2. Actualizar cambios
3. Repetir proceso arriba

---

**Referencia:** https://docs.github.com/en/repositories/releasing-projects-on-github/managing-releases-in-a-repository
