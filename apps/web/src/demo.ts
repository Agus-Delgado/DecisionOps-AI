// Mock data and functions for demo mode (no backend required)

// Mock training metrics
export const mockTrainMetrics = {
  accuracy: 0.8750,
  precision: 0.8600,
  recall: 0.8900,
  f1: 0.8745,
  roc_auc: 0.9200
}

// Fixed coefficients for demo prediction (logistic regression simulation)
const DEMO_COEFFICIENTS = {
  age: -0.0123,
  tenure_months: -0.0456,
  monthly_spend: -0.0089,
  support_tickets_last_90d: 0.3421,
  plan_basic: 0.5234,
  plan_pro: 0.1234,
  plan_enterprise: -0.6234,
  region_latam: 0.2345,
  region_na: -0.1234,
  region_eu: -0.0987
}

// Sigmoid function for logistic regression
function sigmoid(z: number): number {
  return 1 / (1 + Math.exp(-z))
}

// Calculate prediction using mock logistic regression
export function mockPredict(record: {
  age: number
  tenure_months: number
  monthly_spend: number
  support_tickets_last_90d: number
  plan: string
  region: string
}): { label: number; probability: number } {
  // Linear combination (logit)
  let logit = 0.5 // intercept
  
  logit += record.age * DEMO_COEFFICIENTS.age
  logit += record.tenure_months * DEMO_COEFFICIENTS.tenure_months
  logit += record.monthly_spend * DEMO_COEFFICIENTS.monthly_spend
  logit += record.support_tickets_last_90d * DEMO_COEFFICIENTS.support_tickets_last_90d
  
  // One-hot encoding for plan
  if (record.plan === 'basic') logit += DEMO_COEFFICIENTS.plan_basic
  if (record.plan === 'pro') logit += DEMO_COEFFICIENTS.plan_pro
  if (record.plan === 'enterprise') logit += DEMO_COEFFICIENTS.plan_enterprise
  
  // One-hot encoding for region
  if (record.region === 'latam') logit += DEMO_COEFFICIENTS.region_latam
  if (record.region === 'na') logit += DEMO_COEFFICIENTS.region_na
  if (record.region === 'eu') logit += DEMO_COEFFICIENTS.region_eu
  
  // Apply sigmoid
  const probability = sigmoid(logit)
  const label = probability > 0.5 ? 1 : 0
  
  return { label, probability }
}

// Mock feature importance (consistent with coefficients)
export const mockExplainData = {
  method: "demo_logreg_coefficients",
  top_features: [
    { feature: "plan_enterprise", weight: -0.6234 },
    { feature: "plan_basic", weight: 0.5234 },
    { feature: "support_tickets_last_90d", weight: 0.3421 },
    { feature: "region_latam", weight: 0.2345 },
    { feature: "plan_pro", weight: 0.1234 },
    { feature: "region_na", weight: -0.1234 },
    { feature: "region_eu", weight: -0.0987 },
    { feature: "tenure_months", weight: -0.0456 }
  ]
}

// Check if API is available
export async function checkApiAvailable(apiBase: string): Promise<boolean> {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 3000) // 3s timeout
    
    const res = await fetch(`${apiBase}/health`, {
      signal: controller.signal
    })
    
    clearTimeout(timeoutId)
    return res.ok
  } catch {
    return false
  }
}
