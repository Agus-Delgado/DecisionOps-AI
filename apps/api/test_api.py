#!/usr/bin/env python
"""Test script for the ML API"""

import time
import subprocess
import requests
import json

# Give server time to start
time.sleep(3)

BASE_URL = "http://localhost:8000"

def test_health():
    print("=" * 60)
    print("TEST: Health endpoint")
    print("=" * 60)
    resp = requests.get(f"{BASE_URL}/health")
    print(f"Status: {resp.status_code}")
    print(f"Response: {json.dumps(resp.json(), indent=2)}\n")

def test_version():
    print("=" * 60)
    print("TEST: Version endpoint")
    print("=" * 60)
    resp = requests.get(f"{BASE_URL}/version")
    print(f"Status: {resp.status_code}")
    print(f"Response: {json.dumps(resp.json(), indent=2)}\n")

def test_train():
    print("=" * 60)
    print("TEST: Train endpoint")
    print("=" * 60)
    payload = {
        "source": "demo",
        "target": "churn",
        "test_size": 0.2
    }
    resp = requests.post(f"{BASE_URL}/train", json=payload)
    print(f"Status: {resp.status_code}")
    data = resp.json()
    print(f"Status: {data.get('status')}")
    print(f"Target: {data.get('target')}")
    print(f"Rows: {data.get('rows')}")
    print(f"Metrics: {json.dumps(data.get('metrics'), indent=2)}")
    print(f"Trained at: {data.get('trained_at')}\n")

def test_predict():
    print("=" * 60)
    print("TEST: Predict endpoint")
    print("=" * 60)
    payload = {
        "records": [
            {
                "age": 34,
                "tenure_months": 12,
                "monthly_spend": 50.5,
                "support_tickets_last_90d": 1,
                "plan": "pro",
                "region": "latam"
            },
            {
                "age": 50,
                "tenure_months": 36,
                "monthly_spend": 129.99,
                "support_tickets_last_90d": 0,
                "plan": "enterprise",
                "region": "eu"
            }
        ]
    }
    resp = requests.post(f"{BASE_URL}/predict", json=payload)
    print(f"Status: {resp.status_code}")
    data = resp.json()
    print(f"Predictions: {json.dumps(data, indent=2)}\n")

def test_explain():
    print("=" * 60)
    print("TEST: Explain endpoint")
    print("=" * 60)
    resp = requests.get(f"{BASE_URL}/explain")
    print(f"Status: {resp.status_code}")
    data = resp.json()
    print(f"Method: {data.get('method')}")
    print(f"Top Features:")
    for feat in data.get('top_features', []):
        print(f"  - {feat['feature']}: {feat['weight']:.4f}")
    print()

if __name__ == "__main__":
    try:
        test_health()
        test_version()
        test_train()
        test_predict()
        test_explain()
        print("=" * 60)
        print("ALL TESTS PASSED!")
        print("=" * 60)
    except Exception as e:
        print(f"ERROR: {e}")
        import traceback
        traceback.print_exc()
