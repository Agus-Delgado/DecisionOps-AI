const DEFAULT_API_BASE =
  (import.meta as any).env?.VITE_API_BASE ?? "http://127.0.0.1:8000";

export async function getHealth(apiBase = DEFAULT_API_BASE) {
  const res = await fetch(`${apiBase}/health`);
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}

export async function trainModel(
  source: string,
  target: string,
  testSize: number = 0.2,
  apiBase = DEFAULT_API_BASE
) {
  const res = await fetch(`${apiBase}/train`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ source, target, test_size: testSize }),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.detail || `API error ${res.status}`);
  }
  return res.json();
}

export async function predict(
  records: Array<Record<string, any>>,
  apiBase = DEFAULT_API_BASE
) {
  const res = await fetch(`${apiBase}/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ records }),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.detail || `API error ${res.status}`);
  }
  return res.json();
}

export async function explain(apiBase = DEFAULT_API_BASE) {
  const res = await fetch(`${apiBase}/explain`);
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.detail || `API error ${res.status}`);
  }
  return res.json();
}
