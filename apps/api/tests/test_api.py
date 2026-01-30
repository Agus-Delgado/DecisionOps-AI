from __future__ import annotations

from pathlib import Path
from typing import Any, Dict, Tuple
import importlib.util
import sys

import pandas as pd
import pytest
from fastapi.testclient import TestClient

# --- Paths base ---
API_ROOT = Path(__file__).resolve().parents[1]
MAIN_PATH = API_ROOT / "main.py"

# ✅ Clave: asegurar que `apps/api` esté en sys.path para resolver `ml.*`
api_root_str = str(API_ROOT)
if api_root_str not in sys.path:
    sys.path.insert(0, api_root_str)

# --- Import robusto de main.py ---
spec = importlib.util.spec_from_file_location("main", MAIN_PATH)
main = importlib.util.module_from_spec(spec)
assert spec and spec.loader
spec.loader.exec_module(main)

app = main.app
client = TestClient(app)


def _demo_csv_path() -> Path:
    return API_ROOT / "data" / "demo_churn.csv"


def _infer_target_column(df: pd.DataFrame) -> str:
    preferred = ["churn", "Churn", "target", "label", "y"]
    for c in preferred:
        if c in df.columns:
            return c

    binary_candidates = []
    for c in df.columns:
        s = df[c].dropna()
        if s.empty:
            continue

        if pd.api.types.is_bool_dtype(s):
            binary_candidates.append(c)
            continue

        if pd.api.types.is_numeric_dtype(s):
            vals = set(s.unique().tolist())
            if vals.issubset({0, 1}):
                binary_candidates.append(c)

    if not binary_candidates:
        raise RuntimeError(
            "No se pudo inferir una columna target binaria (0/1) en demo_churn.csv."
        )

    return sorted(binary_candidates)[0]


def _get_record_and_target() -> Tuple[Dict[str, Any], str]:
    path = _demo_csv_path()
    if not path.exists():
        raise RuntimeError(f"No se encontró el dataset demo en: {path}")

    df = pd.read_csv(path)
    target = _infer_target_column(df)

    record = df.drop(columns=[target]).iloc[0].to_dict()
    record = {k: (v.item() if hasattr(v, "item") else v) for k, v in record.items()}
    return record, target


@pytest.fixture(scope="session")
def demo_record_and_target() -> Tuple[Dict[str, Any], str]:
    return _get_record_and_target()


@pytest.fixture(scope="session")
def trained_model(demo_record_and_target) -> Dict[str, Any]:
    _, target = demo_record_and_target
    payload = {"source": "demo", "target": target, "test_size": 0.2}

    resp = client.post("/train", json=payload)
    assert resp.status_code == 200, resp.text

    data = resp.json()
    assert data.get("status") == "trained"
    assert data.get("target") == target
    assert "metrics" in data
    return data


def test_health():
    resp = client.get("/health")
    assert resp.status_code == 200
    assert resp.json().get("status") == "ok"


def test_version():
    resp = client.get("/version")
    assert resp.status_code == 200
    data = resp.json()
    assert "name" in data
    assert "version" in data


def test_predict_before_train_fails(demo_record_and_target):
    record, _ = demo_record_and_target
    resp = client.post("/predict", json={"records": [record]})

    if resp.status_code == 200:
        pytest.skip("La API ya tenía un modelo cargado (persistencia).")
    else:
        assert resp.status_code == 400
        data = resp.json()
        assert "detail" in data
        assert "train" in str(data["detail"]).lower()


def test_train(trained_model):
    assert trained_model["status"] == "trained"
    assert isinstance(trained_model["metrics"], dict)


def test_predict(trained_model, demo_record_and_target):
    record, _ = demo_record_and_target

    resp = client.post("/predict", json={"records": [record]})
    assert resp.status_code == 200, resp.text

    data = resp.json()
    assert "predictions" in data
    assert len(data["predictions"]) == 1

    pred = data["predictions"][0]
    assert "label" in pred
    assert "probability" in pred
    prob = float(pred["probability"])
    assert 0.0 <= prob <= 1.0


def test_explain(trained_model):
    resp = client.get("/explain")
    assert resp.status_code == 200, resp.text

    data = resp.json()
    assert "method" in data
    assert "top_features" in data
    assert isinstance(data["top_features"], list)
    assert len(data["top_features"]) > 0

    tf0 = data["top_features"][0]
    assert "feature" in tf0
    assert "weight" in tf0
