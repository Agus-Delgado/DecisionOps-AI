# CI/CD with GitHub Actions

## Overview

This project uses **GitHub Actions** for continuous integration (CI). The workflow validates every push and pull request automatically.

## Workflow File

**Location:** `.github/workflows/ci.yml`

**Triggers:**
- `push` to `main` branch
- `pull_request` targeting `main` branch

## Jobs

### 1. `web-build` (Frontend)

**Runner:** `ubuntu-latest`

**Steps:**
1. Checkout code
2. Setup Node.js (LTS)
3. Install dependencies: `npm ci`
4. Build: `npm run build`

**Fails if:**
- TypeScript compilation fails
- Build process fails (e.g., missing imports, syntax errors)

**Cache:**
- npm dependencies cached in `~/.npm`

### 2. `api-import` (Backend)

**Runner:** `ubuntu-latest`

**Steps:**
1. Checkout code
2. Setup Python (3.11)
3. Upgrade pip
4. Install dependencies: `pip install -r requirements.txt`
5. Sanity check: `python -c "from main import app; print('✅ API import successful')"`

**Fails if:**
- Python dependencies fail to install
- API module cannot be imported (syntax error, missing package, etc.)

**Cache:**
- pip packages cached in `~/.cache/pip`

## Status Checks

### Viewing Results

1. **On GitHub:**
   - Navigate to your branch
   - Look for the green ✅ or red ❌ indicator
   - Click "Details" to see logs

2. **Actions Tab:**
   - Go to `Actions` → `CI` to see all workflow runs
   - Click a run to see detailed job logs

### What Can Fail

- **Web build fails:**
  - TypeScript errors
  - Missing imports (e.g., `import.meta.env` issues)
  - Build output errors

- **API import fails:**
  - Missing dependencies in `requirements.txt`
  - Syntax error in `main.py`
  - Module import errors (e.g., circular imports)

### Troubleshooting

If CI fails locally but passes on your machine:

1. **Web build:**
   ```bash
   cd apps/web
   npm ci  # Clean install (like GitHub uses)
   npm run build
   ```

2. **API import:**
   ```bash
   cd apps/api
   python -m venv .venv_test
   source .venv_test/bin/activate  # or .venv_test\Scripts\activate on Windows
   pip install -r requirements.txt
   python -c "from main import app; print('✅ API import successful')"
   ```

## No Secrets Required

This CI workflow does **not** require any secrets (API keys, credentials, etc.).

The workflow only:
- Validates code builds/imports
- Does not deploy or push code
- Does not run integration tests (that would require running services)

## Future Enhancements

If you want to add more checks:

```yaml
# Example: Run Python tests
- name: Run Python tests
  run: |
    cd apps/api
    python -m pytest tests/  # if you add tests
```

```yaml
# Example: Run linting
- name: Lint frontend
  run: |
    cd apps/web
    npm run lint  # if you add a lint script
```

## GitHub Actions Pricing

**Free tier includes:**
- 2,000 minutes/month of GitHub Actions on public repos
- 500 MB of storage for artifacts/logs

For this project, each run takes **~30-60 seconds**, so the free tier is more than sufficient.

## References

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [actions/setup-node](https://github.com/actions/setup-node)
- [actions/setup-python](https://github.com/actions/setup-python)
- [GitHub Actions Cache](https://github.com/actions/cache)
