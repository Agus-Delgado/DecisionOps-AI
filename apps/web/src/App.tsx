import { useState, useEffect } from 'react'
import { getHealth, trainModel, predict, explain } from './api'
import { mockTrainMetrics, mockPredict, mockExplainData, checkApiAvailable } from './demo'
import { theme } from './theme'
import { Card, CardHeader, CardBody, Button, Badge, Field, Input, Select, Callout, Table, TableHeader, TableBody, TableRow, TableHeadCell, TableCell } from './components/ui'

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

const API_BASE = (import.meta as any).env?.VITE_API_BASE ?? "http://127.0.0.1:8000"

export default function App() {
  // Demo mode state
  const [demoMode, setDemoMode] = useState(false)
  const [checkingApi, setCheckingApi] = useState(true)

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

  // Check API availability on mount
  useEffect(() => {
    const checkApi = async () => {
      setCheckingApi(true)
      const available = await checkApiAvailable(API_BASE)
      setDemoMode(!available)
      setCheckingApi(false)
    }
    checkApi()
  }, [])

  const handleToggleDemoMode = async () => {
    if (!demoMode) {
      // Switching to demo mode
      setDemoMode(true)
    } else {
      // Try to reconnect to API
      setCheckingApi(true)
      const available = await checkApiAvailable(API_BASE)
      setDemoMode(!available)
      setCheckingApi(false)
      if (available) {
        // Reset all states when switching back to API
        setTrainStatus('idle')
        setTrainMetrics(null)
        setPredictStatus('idle')
        setPredictResult(null)
        setExplainStatus('idle')
        setExplainData(null)
      }
    }
  }

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
    
    if (demoMode) {
      // Demo mode: return mock metrics
      setTimeout(() => {
        setTrainStatus('success')
        setTrainMetrics(mockTrainMetrics)
      }, 1000) // Simulate network delay
      return
    }

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
    
    // Map form data to match backend schema
    const record = {
      age: formData.age,
      tenure_months: formData.tenure_months,
      monthly_spend: formData.monthly_spend,
      support_tickets_last_90d: formData.tickets,
      plan: String(formData.plan).toLowerCase(),
      region: String(formData.region).toLowerCase()
    }

    if (demoMode) {
      // Demo mode: use mock prediction
      setTimeout(() => {
        const result = mockPredict(record)
        setPredictStatus('success')
        setPredictResult(result)
      }, 800)
      return
    }

    try {
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
    
    if (demoMode) {
      // Demo mode: return mock explanation
      setTimeout(() => {
        setExplainStatus('success')
        setExplainData(mockExplainData)
      }, 600)
      return
    }

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
    <div style={containerStyle}>
      {/* Header */}
      <header style={headerStyle}>
        <div style={headerContentStyle}>
          <h1 style={titleStyle}>
            DecisionOps AI Toolkit
          </h1>
          <p style={subtitleStyle}>
            Entrená un modelo ML, hacé predicciones y explicá decisiones. Todo en local, costo cero.
          </p>
        </div>
        
        {/* Status Badge */}
        {checkingApi ? (
          <Badge variant="warning" dot>
            Verificando API...
          </Badge>
        ) : demoMode ? (
          <Badge variant="warning" dot>
            Modo Demo
          </Badge>
        ) : (
          <Badge variant="success" dot>
            API Conectada
          </Badge>
        )}
      </header>

      {/* Demo Mode Banner */}
      {(demoMode || checkingApi) && (
        <div style={demoModeBannerStyle}>
          {checkingApi ? (
            <span>⏳ Verificando conexión con API...</span>
          ) : (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 14, color: '#666' }}>
                  🎭 La demo funciona sin backend usando predicciones simuladas.{' '}
                  <a 
                    href="#diagnostics" 
                    style={{ color: '#0070f3', textDecoration: 'none', fontWeight: 600 }}
                    title="Ver instrucciones para conectar API real"
                  >
                    ¿Cómo conectar una API real?
                  </a>
                </span>
              </div>
              <Button 
                onClick={handleToggleDemoMode}
                variant="primary"
              >
                🔄 Reconectar API
              </Button>
            </>
          )}
        </div>
      )}

      {/* Info Section */}
      <section style={infoCardStyle}>
        <h2 style={cardTitleStyle}>💡 Qué estás viendo</h2>
        <ul style={infoListStyle}>
          <li><strong>Predicción de churn</strong>: Identifica clientes con riesgo de irse (clasificación binaria)</li>
          <li><strong>Explicabilidad</strong>: Entiende qué features influyen más (sin caja negra)</li>
          <li><strong>Cero dependencias externas</strong>: Corre en tu máquina, sin APIs pagadas, sin data lake</li>
        </ul>
      </section>

      {/* Main Grid */}
      <div style={mainGridStyle}>
        {/* Step 1: Train */}
        <Card>
          <CardHeader stepNumber={1}>
            Entrenar Modelo
          </CardHeader>
          <CardBody description="Entrena un modelo de clasificación con nuestro dataset demo (1000 registros de clientes)">
            <Button 
              onClick={handleTrain} 
              loading={trainStatus === 'loading'}
              fullWidth
            >
              Entrenar Modelo
            </Button>
          {trainStatus === 'error' && (
            <Callout variant="error" title="Error">
              {trainError}
            </Callout>
          )}
          {trainStatus === 'success' && trainMetrics && (
            <Callout variant="success" title="Modelo entrenado exitosamente">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHeadCell>Métrica</TableHeadCell>
                    <TableHeadCell align="right">Valor</TableHeadCell>
                  </TableRow>
                </TableHeader>
                <TableBody zebra>
                  {Object.entries(trainMetrics).map(([key, value]) => (
                    <TableRow key={key}>
                      <TableCell>{key}</TableCell>
                      <TableCell align="right">
                        {typeof value === 'number' ? value.toFixed(4) : String(value)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Callout>
          )}
          </CardBody>
        </Card>

        {/* Step 2: Predict */}
        <Card>
          <CardHeader stepNumber={2}>
            Hacer Predicción
          </CardHeader>
          <CardBody description="Ingresá datos de un cliente para predecir si va a irse (churn)">

          {/* Quick load examples */}
          <div style={examplesContainerStyle}>
            <span style={examplesLabelStyle}>Cargar ejemplo:</span>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {Object.entries(EXAMPLE_PROFILES).map(([key, profile]) => (
                <Button
                  key={key}
                  onClick={() => loadExample(key as keyof typeof EXAMPLE_PROFILES)}
                  variant="secondary"
                  style={{ padding: `${theme.spacing.sm} ${theme.spacing.lg}`, fontSize: theme.fontSizes.sm }}
                >
                  {profile.label}
                </Button>
              ))}
            </div>
          </div>

          <div style={formGridStyle}>
            <Field label="Edad">
              <Input
                type="number"
                value={formData.age}
                onChange={(e) => updateFormField('age', parseInt(e.target.value))}
              />
            </Field>
            <Field label="Antigüedad (meses)">
              <Input
                type="number"
                value={formData.tenure_months}
                onChange={(e) => updateFormField('tenure_months', parseInt(e.target.value))}
              />
            </Field>
            <Field label="Gasto mensual ($)">
              <Input
                type="number"
                value={formData.monthly_spend}
                onChange={(e) => updateFormField('monthly_spend', parseFloat(e.target.value))}
              />
            </Field>
            <Field label="Tickets de soporte">
              <Input
                type="number"
                value={formData.tickets}
                onChange={(e) => updateFormField('tickets', parseInt(e.target.value))}
              />
            </Field>
            <Field label="Plan">
              <Select
                value={formData.plan}
                onChange={(e) => updateFormField('plan', e.target.value)}
              >
                <option value="basic">Basic</option>
                <option value="pro">Pro</option>
                <option value="enterprise">Enterprise</option>
              </Select>
            </Field>
            <Field label="Región">
              <Select
                value={formData.region}
                onChange={(e) => updateFormField('region', e.target.value)}
              >
                <option value="latam">LATAM</option>
                <option value="na">NA</option>
                <option value="eu">EU</option>
              </Select>
            </Field>
          </div>
          <Button
            onClick={handlePredict}
            loading={predictStatus === 'loading'}
            fullWidth
            style={{ marginTop: theme.spacing.lg }}
          >
            🎯 Predecir
          </Button>
          {predictStatus === 'error' && (
            <Callout variant="error" title="Error">
              {predictError}
            </Callout>
          )}
          {predictStatus === 'success' && predictResult && (
            <Callout 
              variant={predictResult.label === 1 ? 'error' : 'success'} 
              title={predictResult.label === 1 ? 'Churn - Cliente en riesgo 🔴' : 'Retención - Cliente leal 🟢'}
            >
              <div style={{ fontSize: theme.fontSizes.xl, marginTop: theme.spacing.sm }}>
                <strong>Confianza:</strong> {(predictResult.probability * 100).toFixed(1)}%
              </div>
            </Callout>
          )}
          </CardBody>
        </Card>

        {/* Step 3: Explain */}
        <Card>
          <CardHeader stepNumber={3}>
            Explicar Decisión
          </CardHeader>
          <CardBody description="Entiende qué factores más influyeron en la predicción">
            <Button 
              onClick={handleExplain} 
              loading={explainStatus === 'loading'}
              fullWidth
            >
              🔍 Obtener Explicación
            </Button>
          {explainStatus === 'error' && (
            <Callout variant="error" title="Error">
              {explainError}
            </Callout>
          )}
          {explainStatus === 'success' && explainData && (
            <Callout variant="success" title={`Top features (método: ${explainData.method})`}>
              <p style={{ fontSize: theme.fontSizes.sm, color: theme.colors.textMuted, margin: `${theme.spacing.sm} 0` }}>
                ↑ Rojo = aumenta churn • ↓ Verde = disminuye churn
              </p>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHeadCell>Feature</TableHeadCell>
                    <TableHeadCell align="right">Importancia</TableHeadCell>
                  </TableRow>
                </TableHeader>
                <TableBody zebra>
                  {explainData.top_features.slice(0, 8).map((feature: any, idx: number) => (
                    <TableRow key={idx}>
                      <TableCell>{feature.feature}</TableCell>
                      <TableCell align="right">
                        <span style={{ 
                          color: feature.weight > 0 ? theme.colors.error : '#059669', 
                          fontWeight: theme.fontWeights.semibold,
                          fontFamily: theme.fonts.mono
                        }}>
                          {feature.weight > 0 ? '↑' : '↓'} {Math.abs(feature.weight).toFixed(3)}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Callout>
          )}
          </CardBody>
        </Card>
      </div>

      {/* Diagnostics Section */}
      <section style={diagnosticsCardStyle}>
        <details id="diagnostics">
          <summary style={diagnosticsSummaryStyle}>
            🔧 Diagnósticos (Check API)
          </summary>
          <div style={{ marginTop: 16 }}>
            {demoMode && (
              <div style={diagnosticsInfoStyle}>
                <strong>ℹ️ Cómo conectar la API real:</strong>
                <ol style={{ marginTop: 12, marginBottom: 0, paddingLeft: 24, lineHeight: 1.8 }}>
                  <li>Abrí una terminal en la raíz del proyecto</li>
                  <li>Ejecutá: <code style={codeStyle}>npm run dev:api</code></li>
                  <li>Verificá que <a href="http://127.0.0.1:8000/health" target="_blank" rel="noopener noreferrer" style={linkStyle}>http://127.0.0.1:8000/health</a> responda OK</li>
                  <li>Hacé click en el botón "🔄 Reconectar API" arriba</li>
                </ol>
              </div>
            )}
            <Button 
              onClick={handleCheckAPI} 
              loading={healthStatus === 'loading'}
              fullWidth
            >
              ✓ Check API
            </Button>
            {healthStatus === 'success' && (
              <Callout variant="success" title="API disponible">
                <pre style={preStyle}>{healthDetail}</pre>
              </Callout>
            )}
            {healthStatus === 'error' && (
              <Callout variant="error" title="Error de conexión">
                <pre style={preStyle}>{healthDetail}</pre>
              </Callout>
            )}
          </div>
        </details>
      </section>

      <footer style={footerStyle}>
        <p>🚀 DecisionOps AI Toolkit • Costo cero • Sin DB • BYOK opcional • Open Source</p>
      </footer>
    </div>
  )
}

// ==================== STYLES ====================

const containerStyle: React.CSSProperties = {
  fontFamily: theme.fonts.system,
  minHeight: '100vh',
  backgroundColor: theme.colors.bgSecondary,
  padding: theme.spacing.xl,
  boxSizing: 'border-box'
}

const headerStyle: React.CSSProperties = {
  maxWidth: '1200px',
  margin: `0 auto ${theme.spacing['2xl']}`,
  padding: theme.spacing['2xl'],
  backgroundColor: theme.colors.bgPrimary,
  borderRadius: theme.radius.xl,
  boxShadow: theme.shadows.md,
  border: `1px solid ${theme.colors.border}`,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: theme.spacing.xl
}

const headerContentStyle: React.CSSProperties = {
  flex: '1 1 auto'
}

const titleStyle: React.CSSProperties = {
  margin: `0 0 ${theme.spacing.sm} 0`,
  fontSize: theme.fontSizes['4xl'],
  fontWeight: theme.fontWeights.bold,
  color: theme.colors.textPrimary,
  letterSpacing: '-0.5px'
}

const subtitleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: theme.fontSizes.lg,
  color: theme.colors.textTertiary,
  lineHeight: theme.lineHeights.relaxed
}

const demoModeBannerStyle: React.CSSProperties = {
  maxWidth: '1200px',
  margin: `0 auto ${theme.spacing.xl}`,
  padding: `${theme.spacing.lg} ${theme.spacing.xl}`,
  backgroundColor: theme.colors.warningLight,
  border: `2px solid ${theme.colors.warningBorder}`,
  borderRadius: theme.radius.xl,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: theme.spacing.lg
}

const infoCardStyle: React.CSSProperties = {
  maxWidth: '1200px',
  margin: `0 auto ${theme.spacing['2xl']}`,
  padding: theme.spacing.xl,
  backgroundColor: theme.colors.infoLight,
  border: `2px solid ${theme.colors.infoBorder}`,
  borderRadius: theme.radius.xl
}

const cardTitleStyle: React.CSSProperties = {
  margin: '0',
  fontSize: theme.fontSizes['2xl'],
  fontWeight: theme.fontWeights.semibold,
  color: theme.colors.textPrimary
}

const infoListStyle: React.CSSProperties = {
  margin: `${theme.spacing.lg} 0 0 0`,
  padding: `0 0 0 ${theme.spacing.xl}`,
  lineHeight: theme.lineHeights.loose,
  color: theme.colors.textSecondary
}

const mainGridStyle: React.CSSProperties = {
  maxWidth: '1200px',
  margin: '0 auto',
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
  gap: theme.spacing.xl,
  marginBottom: theme.spacing['2xl']
}

const examplesContainerStyle: React.CSSProperties = {
  padding: theme.spacing.lg,
  backgroundColor: theme.colors.bgSecondary,
  borderRadius: theme.radius.lg,
  marginBottom: theme.spacing.lg
}

const examplesLabelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: theme.fontSizes.sm,
  fontWeight: theme.fontWeights.semibold,
  color: theme.colors.textTertiary,
  marginBottom: theme.spacing.md
}

const formGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
  gap: theme.spacing.lg,
  marginBottom: theme.spacing.sm
}

const diagnosticsCardStyle: React.CSSProperties = {
  maxWidth: '1200px',
  margin: `0 auto ${theme.spacing['2xl']}`,
  padding: theme.spacing.xl,
  backgroundColor: theme.colors.bgPrimary,
  borderRadius: theme.radius.xl,
  boxShadow: theme.shadows.md,
  border: `1px solid ${theme.colors.border}`,
}

const diagnosticsSummaryStyle: React.CSSProperties = {
  cursor: 'pointer',
  fontWeight: theme.fontWeights.semibold,
  fontSize: theme.fontSizes.lg,
  color: theme.colors.textSecondary,
  padding: `${theme.spacing.xs} 0`,
  userSelect: 'none'
}

const diagnosticsInfoStyle: React.CSSProperties = {
  marginBottom: theme.spacing.lg,
  padding: theme.spacing.lg,
  backgroundColor: theme.colors.infoLight,
  borderLeft: `4px solid ${theme.colors.info}`,
  borderRadius: theme.radius.md,
  fontSize: theme.fontSizes.base,
  color: theme.colors.textSecondary
}

const codeStyle: React.CSSProperties = {
  backgroundColor: theme.colors.gray800,
  color: theme.colors.gray200,
  padding: `2px ${theme.spacing.sm}`,
  borderRadius: theme.radius.sm,
  fontSize: theme.fontSizes.sm,
  fontFamily: theme.fonts.mono
}

const linkStyle: React.CSSProperties = {
  color: theme.colors.primary,
  textDecoration: 'none',
  fontWeight: theme.fontWeights.semibold
}

const preStyle: React.CSSProperties = {
  marginTop: theme.spacing.md,
  fontSize: theme.fontSizes.xs,
  overflow: 'auto',
  backgroundColor: theme.colors.gray800,
  color: theme.colors.gray200,
  padding: theme.spacing.md,
  borderRadius: theme.radius.md,
  fontFamily: theme.fonts.mono
}

const footerStyle: React.CSSProperties = {
  maxWidth: '1200px',
  margin: `${theme.spacing['3xl']} auto 0`,
  paddingTop: theme.spacing.xl,
  borderTop: `1px solid ${theme.colors.border}`,
  fontSize: theme.fontSizes.sm,
  color: theme.colors.textMuted,
  textAlign: 'center'
}

const resultBoxStyle = (status: LoadingState): React.CSSProperties => ({
  marginTop: theme.spacing.lg,
  padding: theme.spacing.lg,
  borderRadius: theme.radius.lg,
  backgroundColor: status === 'error' ? theme.colors.errorLight : status === 'success' ? theme.colors.successLight : '#fefce8',
  border: `2px solid ${status === 'error' ? theme.colors.error : status === 'success' ? theme.colors.success : theme.colors.warning}`
})

const tableStyle: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  marginTop: theme.spacing.md
}

const thStyle: React.CSSProperties = {
  textAlign: 'left',
  padding: theme.spacing.md,
  borderBottom: `2px solid ${theme.colors.textSecondary}`,
  fontWeight: theme.fontWeights.semibold,
  fontSize: theme.fontSizes.base,
  color: theme.colors.textPrimary
}

const tdStyle: React.CSSProperties = {
  padding: theme.spacing.md,
  borderBottom: `1px solid ${theme.colors.border}`,
  fontSize: theme.fontSizes.base,
  color: theme.colors.textSecondary
}
