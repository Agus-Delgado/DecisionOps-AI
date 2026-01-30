import { useState } from 'react'
import { getHealth, trainModel, predict, explain } from './api'

type LoadingState = 'idle' | 'loading' | 'success' | 'error'

// Example data sets for demo
const EXAMPLE_PROFILES = {
  retention: {
    label: 'Cliente leal',
    data: { age: 28, tenure_months: 48, monthly_spend: 200, tickets: 1, plan: 'enterprise', region: 'eu' }
  },
  atrisk: {
    label: 'Cliente en riesgo',
    data: { age: 52, tenure_months: 3, monthly_spend: 49, tickets: 8, plan: 'basic', region: 'latam' }
  },
  growth: {
    label: 'Oportunidad de crecimiento',
    data: { age: 35, tenure_months: 12, monthly_spend: 75, tickets: 2, plan: 'basic', region: 'na' }
  }
}

export default function App() {
  // Health check state
  const [healthStatus, setHealthStatus] = useState<LoadingState>('idle')
  const [healthDetail, setHealthDetail] = useState('')

  // Train state
  const [trainStatus, setTrainStatus] = useState<LoadingState>('idle')
  const [trainMetrics, setTrainMetrics] = useState<any>(null)
  const [trainError, setTrainError] = useState('')

  // Predict state
  const [predictStatus, setPredictStatus] = useState<LoadingState>('idle')
  const [predictResult, setPredictResult] = useState<any>(null)
  const [predictError, setPredictError] = useState('')

  // Explain state
  const [explainStatus, setExplainStatus] = useState<LoadingState>('idle')
  const [explainData, setExplainData] = useState<any>(null)
  const [explainError, setExplainError] = useState('')

  // Form state (defaults for demo)
  const [formData, setFormData] = useState({
    age: 35,
    tenure_months: 24,
    monthly_spend: 150,
    tickets: 2,
    plan: 'pro',
    region: 'latam'
  })

  const handleCheckAPI = async () => {
    setHealthStatus('loading')
    setHealthDetail('')
    try {
      const data = await getHealth()
      setHealthStatus('success')
      setHealthDetail(JSON.stringify(data, null, 2))
    } catch (err) {
      setHealthStatus('error')
      setHealthDetail(String(err))
    }
  }

  const handleTrain = async () => {
    setTrainStatus('loading')
    setTrainMetrics(null)
    setTrainError('')
    try {
      const data = await trainModel('demo', 'churn')
      setTrainStatus('success')
      setTrainMetrics(data.metrics)
    } catch (err) {
      setTrainStatus('error')
      setTrainError(String(err))
    }
  }

  const handlePredict = async () => {
    setPredictStatus('loading')
    setPredictResult(null)
    setPredictError('')
    try {
      // Map form data to match backend schema
      const record = {
        age: formData.age,
        tenure_months: formData.tenure_months,
        monthly_spend: formData.monthly_spend,
        support_tickets_last_90d: formData.tickets, // Map tickets → support_tickets_last_90d
        plan: String(formData.plan).toLowerCase(), // Normalize to lowercase
        region: String(formData.region).toLowerCase() // Normalize to lowercase
      }
      const data = await predict([record])
      setPredictStatus('success')
      setPredictResult(data.predictions[0])
    } catch (err) {
      setPredictStatus('error')
      setPredictError(String(err))
    }
  }

  const handleExplain = async () => {
    setExplainStatus('loading')
    setExplainData(null)
    setExplainError('')
    try {
      const data = await explain()
      setExplainStatus('success')
      setExplainData(data)
    } catch (err) {
      setExplainStatus('error')
      setExplainError(String(err))
    }
  }

  const updateFormField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const loadExample = (exampleKey: keyof typeof EXAMPLE_PROFILES) => {
    const example = EXAMPLE_PROFILES[exampleKey]
    setFormData(example.data)
  }

  return (
    <div style={{ fontFamily: 'system-ui', padding: 24, maxWidth: 1200, margin: '0 auto' }}>
      {/* Hero section */}
      <div style={heroStyle}>
        <h1 style={{ borderBottom: '2px solid #333', paddingBottom: 12, marginBottom: 16 }}>
          DecisionOps AI Toolkit - Demo
        </h1>
        <p style={{ fontSize: 16, color: '#555', margin: '0 0 16px 0' }}>
          Entrená un modelo ML, hacé predicciones y explicá decisiones. Todo en local, costo cero.
        </p>
      </div>

      {/* What you're seeing section */}
      <section style={infoBoxStyle}>
        <h2 style={{ marginTop: 0 }}>💡 Qué estás viendo</h2>
        <ul style={{ lineHeight: 1.8, color: '#333' }}>
          <li><strong>Predicción de churn</strong>: Identifica clientes con riesgo de irse (clasificación binaria)</li>
          <li><strong>Explicabilidad</strong>: Entiende qué features influyen más (sin caja negra)</li>
          <li><strong>Cero dependencias externas</strong>: Corre en tu máquina, sin APIs pagadas, sin data lake</li>
        </ul>
      </section>

      {/* Step-by-step flow */}
      <div style={stepsContainerStyle}>
        {/* Step 1: Train */}
        <section style={sectionStyle}>
          <div style={stepHeaderStyle}>
            <span style={stepBadgeStyle}>Paso 1</span>
            <h2 style={{ margin: 0 }}>Entrená el Modelo</h2>
          </div>
          <p style={{ fontSize: 14, color: '#666', marginTop: 8 }}>
            Entrena un modelo de clasificación con nuestro dataset demo (1000 registros de clientes)
          </p>
          <button onClick={handleTrain} disabled={trainStatus === 'loading'} style={buttonStyle}>
            {trainStatus === 'loading' ? '⏳ Entrenando...' : '🚀 Entrenar Modelo'}
          </button>
          {trainStatus === 'error' && (
            <div style={resultBoxStyle('error')}>
              <strong>❌ Error:</strong> {trainError}
            </div>
          )}
          {trainStatus === 'success' && trainMetrics && (
            <div style={resultBoxStyle('success')}>
              <strong>✅ Modelo entrenado exitosamente</strong>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={thStyle}>Métrica</th>
                    <th style={thStyle}>Valor</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(trainMetrics).map(([key, value]) => (
                    <tr key={key}>
                      <td style={tdStyle}>{key}</td>
                      <td style={tdStyle}>{typeof value === 'number' ? value.toFixed(4) : String(value)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Step 2: Predict */}
        <section style={sectionStyle}>
          <div style={stepHeaderStyle}>
            <span style={stepBadgeStyle}>Paso 2</span>
            <h2 style={{ margin: 0 }}>Hacé una Predicción</h2>
          </div>
          <p style={{ fontSize: 14, color: '#666', marginTop: 8 }}>
            Ingresá datos de un cliente para predecir si va a irse (churn)
          </p>

          {/* Quick load examples */}
          <div style={examplesStyle}>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#666', marginRight: 12 }}>Cargar ejemplo:</span>
            {Object.entries(EXAMPLE_PROFILES).map(([key, profile]) => (
              <button
                key={key}
                onClick={() => loadExample(key as keyof typeof EXAMPLE_PROFILES)}
                style={exampleButtonStyle}
                title={profile.label}
              >
                {profile.label}
              </button>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginTop: 16 }}>
            <div>
              <label style={labelStyle}>Age:</label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) => updateFormField('age', parseInt(e.target.value))}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Tenure (months):</label>
              <input
                type="number"
                value={formData.tenure_months}
                onChange={(e) => updateFormField('tenure_months', parseInt(e.target.value))}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Monthly Spend ($):</label>
              <input
                type="number"
                value={formData.monthly_spend}
                onChange={(e) => updateFormField('monthly_spend', parseFloat(e.target.value))}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Tickets:</label>
              <input
                type="number"
                value={formData.tickets}
                onChange={(e) => updateFormField('tickets', parseInt(e.target.value))}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Plan:</label>
              <select
                value={formData.plan}
                onChange={(e) => updateFormField('plan', e.target.value)}
                style={inputStyle}
              >
                <option value="basic">Basic</option>
                <option value="pro">Pro</option>
                <option value="enterprise">Enterprise</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Region:</label>
              <select
                value={formData.region}
                onChange={(e) => updateFormField('region', e.target.value)}
                style={inputStyle}
              >
                <option value="latam">LATAM</option>
                <option value="na">NA</option>
                <option value="eu">EU</option>
              </select>
            </div>
          </div>
          <button
            onClick={handlePredict}
            disabled={predictStatus === 'loading'}
            style={{ ...buttonStyle, marginTop: 16 }}
          >
            {predictStatus === 'loading' ? '⏳ Prediciendo...' : '🎯 Predecir'}
          </button>
          {predictStatus === 'error' && (
            <div style={resultBoxStyle('error')}>
              <strong>❌ Error:</strong> {predictError}
            </div>
          )}
          {predictStatus === 'success' && predictResult && (
            <div style={resultBoxStyle('success')}>
              <strong>✅ Predicción:</strong>
              <div style={{ marginTop: 12, fontSize: 18 }}>
                <p style={{ margin: '4px 0' }}>
                  <strong>Resultado:</strong> {predictResult.label === 1 ? '🔴 Churn - Cliente en riesgo' : '🟢 Retención - Cliente leal'}
                </p>
                <p style={{ margin: '4px 0' }}>
                  <strong>Confianza:</strong> {(predictResult.probability * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          )}
        </section>

        {/* Step 3: Explain */}
        <section style={sectionStyle}>
          <div style={stepHeaderStyle}>
            <span style={stepBadgeStyle}>Paso 3</span>
            <h2 style={{ margin: 0 }}>Explicá la Decisión</h2>
          </div>
          <p style={{ fontSize: 14, color: '#666', marginTop: 8 }}>
            Entiende qué factores más influyeron en la predicción
          </p>
          <button onClick={handleExplain} disabled={explainStatus === 'loading'} style={buttonStyle}>
            {explainStatus === 'loading' ? '⏳ Cargando...' : '🔍 Obtener Explicación'}
          </button>
          {explainStatus === 'error' && (
            <div style={resultBoxStyle('error')}>
              <strong>❌ Error:</strong> {explainError}
            </div>
          )}
          {explainStatus === 'success' && explainData && (
            <div style={resultBoxStyle('success')}>
              <strong>✅ Top features (método: {explainData.method})</strong>
              <p style={{ fontSize: 12, color: '#666', marginTop: 4 }}>
                Rojo = aumenta churn, Verde = disminuye churn
              </p>
              <table style={{ ...tableStyle, marginTop: 12 }}>
                <thead>
                  <tr>
                    <th style={thStyle}>Feature</th>
                    <th style={thStyle}>Importancia</th>
                  </tr>
                </thead>
                <tbody>
                  {explainData.top_features.slice(0, 8).map((feature: any, idx: number) => (
                    <tr key={idx}>
                      <td style={tdStyle}>{feature.feature}</td>
                      <td style={tdStyle}>
                        <span style={{ color: feature.weight > 0 ? '#c00' : '#080', fontWeight: 600 }}>
                          {feature.weight > 0 ? '↑' : '↓'} {Math.abs(feature.weight).toFixed(4)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      {/* Health check section (hidden by default, for diagnostics) */}
      <details style={{ marginTop: 32, padding: 16, backgroundColor: '#f5f5f5', borderRadius: 8 }}>
        <summary style={{ cursor: 'pointer', fontWeight: 600, color: '#666' }}>
          🔧 Diagnósticos (Check API)
        </summary>
        <div style={{ marginTop: 12 }}>
          <button onClick={handleCheckAPI} disabled={healthStatus === 'loading'} style={buttonStyle}>
            {healthStatus === 'loading' ? 'Checking...' : 'Check API'}
          </button>
          {healthStatus !== 'idle' && (
            <div style={resultBoxStyle(healthStatus)}>
              <strong>Estado: </strong>
              {healthStatus === 'success' && '✅ OK'}
              {healthStatus === 'error' && '❌ Error'}
              {healthStatus === 'loading' && '⏳ Loading...'}
              <pre style={{ marginTop: 8, fontSize: 12, overflow: 'auto' }}>{healthDetail}</pre>
            </div>
          )}
        </div>
      </details>

      <footer style={{ marginTop: 48, paddingTop: 24, borderTop: '1px solid #ddd', fontSize: 12, color: '#999', textAlign: 'center' }}>
        <p>🚀 DecisionOps AI Toolkit • Costo cero • Sin DB • BYOK opcional • Open Source</p>
      </footer>
    </div>
  )
}

// Styles
const heroStyle: React.CSSProperties = {
  marginBottom: 24,
  paddingBottom: 16,
  borderBottom: '2px solid #0070f3'
}

const infoBoxStyle: React.CSSProperties = {
  marginBottom: 32,
  padding: 20,
  borderRadius: 8,
  backgroundColor: '#f0f7ff',
  borderLeft: '4px solid #0070f3'
}

const stepsContainerStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
  gap: 24,
  marginBottom: 32
}

const sectionStyle: React.CSSProperties = {
  padding: 20,
  border: '1px solid #ddd',
  borderRadius: 8,
  backgroundColor: '#fff'
}

const stepHeaderStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  marginBottom: 8
}

const stepBadgeStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 32,
  height: 32,
  borderRadius: '50%',
  backgroundColor: '#0070f3',
  color: 'white',
  fontWeight: 700,
  fontSize: 14
}

const buttonStyle: React.CSSProperties = {
  padding: '10px 16px',
  fontSize: 14,
  fontWeight: 600,
  backgroundColor: '#0070f3',
  color: 'white',
  border: 'none',
  borderRadius: 6,
  cursor: 'pointer',
  transition: 'background 0.2s'
}

const examplesStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  flexWrap: 'wrap',
  padding: 12,
  backgroundColor: '#f9f9f9',
  borderRadius: 6,
  marginTop: 12
}

const exampleButtonStyle: React.CSSProperties = {
  padding: '6px 12px',
  fontSize: 12,
  fontWeight: 500,
  backgroundColor: '#e0e7ff',
  color: '#0070f3',
  border: '1px solid #0070f3',
  borderRadius: 4,
  cursor: 'pointer',
  transition: 'all 0.2s'
}

const resultBoxStyle = (status: LoadingState): React.CSSProperties => ({
  marginTop: 12,
  padding: 12,
  borderRadius: 6,
  backgroundColor: status === 'error' ? '#fee' : status === 'success' ? '#efe' : '#ffa',
  border: `1px solid ${status === 'error' ? '#c00' : status === 'success' ? '#0a0' : '#aa0'}`
})

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 13,
  fontWeight: 600,
  marginBottom: 4
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: 8,
  fontSize: 14,
  border: '1px solid #ccc',
  borderRadius: 4,
  boxSizing: 'border-box'
}

const tableStyle: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  marginTop: 12
}

const thStyle: React.CSSProperties = {
  textAlign: 'left',
  padding: 8,
  borderBottom: '2px solid #333',
  fontWeight: 600
}

const tdStyle: React.CSSProperties = {
  padding: 8,
  borderBottom: '1px solid #ddd'
}
