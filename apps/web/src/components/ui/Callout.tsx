import React from 'react'
import { theme } from '../../theme'

type CalloutVariant = 'success' | 'error' | 'warning' | 'info'

interface CalloutProps {
  variant: CalloutVariant
  title?: string
  children: React.ReactNode
  style?: React.CSSProperties
}

export function Callout({ variant, title, children, style }: CalloutProps) {
  const variantConfig = {
    success: {
      bg: theme.colors.successLight,
      border: theme.colors.success,
      icon: '✅',
      iconColor: theme.colors.success,
    },
    error: {
      bg: theme.colors.errorLight,
      border: theme.colors.error,
      icon: '❌',
      iconColor: theme.colors.error,
    },
    warning: {
      bg: theme.colors.warningLight,
      border: theme.colors.warning,
      icon: '⚠️',
      iconColor: theme.colors.warning,
    },
    info: {
      bg: theme.colors.infoLight,
      border: theme.colors.info,
      icon: 'ℹ️',
      iconColor: theme.colors.info,
    },
  }

  const config = variantConfig[variant]

  const calloutStyle: React.CSSProperties = {
    marginTop: theme.spacing.lg,
    padding: theme.spacing.lg,
    backgroundColor: config.bg,
    border: `2px solid ${config.border}`,
    borderRadius: theme.radius.lg,
    ...style,
  }

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: title && children ? theme.spacing.sm : 0,
  }

  const iconStyle: React.CSSProperties = {
    fontSize: theme.fontSizes.lg,
    lineHeight: '1',
  }

  const titleStyle: React.CSSProperties = {
    fontWeight: theme.fontWeights.semibold,
    fontSize: theme.fontSizes.base,
    color: theme.colors.textPrimary,
    margin: 0,
  }

  const contentStyle: React.CSSProperties = {
    fontSize: theme.fontSizes.base,
    color: theme.colors.textSecondary,
    lineHeight: theme.lineHeights.relaxed,
  }

  return (
    <div style={calloutStyle} role="alert">
      <div style={headerStyle}>
        <span style={iconStyle} aria-hidden="true">{config.icon}</span>
        {title && <strong style={titleStyle}>{title}</strong>}
      </div>
      {children && <div style={contentStyle}>{children}</div>}
    </div>
  )
}
