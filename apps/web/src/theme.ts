// Design System Tokens
// Centraliza todos los valores de diseño para consistencia y mantenibilidad

export const theme = {
  // Colors
  colors: {
    // Brand
    primary: '#0070f3',
    primaryLight: '#3b82f6',
    primaryDark: '#0051c7',
    
    // Neutral (slate palette)
    gray50: '#f8fafc',
    gray100: '#f1f5f9',
    gray200: '#e2e8f0',
    gray300: '#cbd5e1',
    gray400: '#94a3b8',
    gray500: '#64748b',
    gray600: '#475569',
    gray700: '#334155',
    gray800: '#1e293b',
    gray900: '#0f172a',
    
    // Semantic
    success: '#10b981',
    successLight: '#d1fae5',
    successBorder: '#34d399',
    
    error: '#ef4444',
    errorLight: '#fee2e2',
    errorBorder: '#f87171',
    
    warning: '#fb923c',
    warningLight: '#fff7ed',
    warningBorder: '#fdba74',
    
    info: '#3b82f6',
    infoLight: '#eff6ff',
    infoBorder: '#93c5fd',
    
    // Backgrounds
    bgPrimary: '#ffffff',
    bgSecondary: '#f8fafc',
    bgTertiary: '#f1f5f9',
    
    // Text
    textPrimary: '#1e293b',
    textSecondary: '#334155',
    textTertiary: '#64748b',
    textMuted: '#94a3b8',
    textInverse: '#ffffff',
    
    // Borders
    border: '#e2e8f0',
    borderDark: '#cbd5e1',
  },
  
  // Spacing (8px base)
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
    '2xl': '32px',
    '3xl': '48px',
  },
  
  // Border Radius
  radius: {
    sm: '4px',
    md: '6px',
    lg: '8px',
    xl: '12px',
    '2xl': '16px',
    round: '24px',
    full: '50%',
  },
  
  // Shadows
  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    md: '0 1px 3px rgba(0, 0, 0, 0.1)',
    lg: '0 4px 6px rgba(0, 0, 0, 0.1)',
    xl: '0 10px 15px rgba(0, 0, 0, 0.1)',
    focus: '0 0 0 3px rgba(0, 112, 243, 0.3)',
  },
  
  // Typography
  fontSizes: {
    xs: '12px',
    sm: '13px',
    base: '14px',
    md: '15px',
    lg: '16px',
    xl: '18px',
    '2xl': '20px',
    '3xl': '24px',
    '4xl': '32px',
  },
  
  fontWeights: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  
  lineHeights: {
    tight: '1.2',
    normal: '1.5',
    relaxed: '1.6',
    loose: '1.8',
  },
  
  // Font Family
  fonts: {
    system: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    mono: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
  },
  
  // Transitions
  transitions: {
    fast: '0.15s ease',
    base: '0.2s ease',
    slow: '0.3s ease',
  },
  
  // Z-index layers
  zIndex: {
    base: 0,
    dropdown: 10,
    modal: 20,
    popover: 30,
    tooltip: 40,
  },
} as const

// Helper functions for consistent styling patterns
export const styleHelpers = {
  // Create a card style
  card: (elevated = false) => ({
    backgroundColor: theme.colors.bgPrimary,
    borderRadius: theme.radius.xl,
    border: `1px solid ${theme.colors.border}`,
    boxShadow: elevated ? theme.shadows.lg : theme.shadows.md,
  }),
  
  // Create a badge style with semantic color
  badge: (variant: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    const colorMap = {
      success: {
        bg: theme.colors.successLight,
        border: theme.colors.successBorder,
        text: theme.colors.success,
      },
      error: {
        bg: theme.colors.errorLight,
        border: theme.colors.errorBorder,
        text: theme.colors.error,
      },
      warning: {
        bg: theme.colors.warningLight,
        border: theme.colors.warningBorder,
        text: theme.colors.warning,
      },
      info: {
        bg: theme.colors.infoLight,
        border: theme.colors.infoBorder,
        text: theme.colors.info,
      },
    }
    
    const colors = colorMap[variant]
    return {
      backgroundColor: colors.bg,
      border: `2px solid ${colors.border}`,
      color: colors.text,
      borderRadius: theme.radius.round,
      padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
      fontSize: theme.fontSizes.base,
      fontWeight: theme.fontWeights.semibold,
    }
  },
  
  // Create a button style
  button: (variant: 'primary' | 'secondary' = 'primary', fullWidth = false) => ({
    padding: `${theme.spacing.md} ${theme.spacing.xl}`,
    fontSize: theme.fontSizes.md,
    fontWeight: theme.fontWeights.semibold,
    backgroundColor: variant === 'primary' ? theme.colors.primary : theme.colors.bgPrimary,
    color: variant === 'primary' ? theme.colors.textInverse : theme.colors.primary,
    border: variant === 'primary' ? 'none' : `2px solid ${theme.colors.primary}`,
    borderRadius: theme.radius.lg,
    cursor: 'pointer',
    transition: theme.transitions.base,
    boxShadow: theme.shadows.md,
    width: fullWidth ? '100%' : 'auto',
  }),
  
  // Create an input style
  input: () => ({
    width: '100%',
    padding: `${theme.spacing.md} ${theme.spacing.lg}`,
    fontSize: theme.fontSizes.base,
    border: `2px solid ${theme.colors.border}`,
    borderRadius: theme.radius.md,
    boxSizing: 'border-box' as const,
    transition: theme.transitions.base,
    backgroundColor: theme.colors.bgPrimary,
    color: theme.colors.textPrimary,
  }),
}
