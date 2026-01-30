import React from 'react'
import { theme } from '../../theme'

type BadgeVariant = 'success' | 'warning' | 'danger' | 'neutral' | 'info'

interface BadgeProps {
  children: React.ReactNode
  variant?: BadgeVariant
  dot?: boolean
  style?: React.CSSProperties
}

export function Badge({
  children,
  variant = 'neutral',
  dot = false,
  style,
}: BadgeProps) {
  const variantStyles = {
    success: {
      bg: theme.colors.successLight,
      border: theme.colors.successBorder,
      text: theme.colors.success,
    },
    warning: {
      bg: theme.colors.warningLight,
      border: theme.colors.warningBorder,
      text: theme.colors.warning,
    },
    danger: {
      bg: theme.colors.errorLight,
      border: theme.colors.errorBorder,
      text: theme.colors.error,
    },
    neutral: {
      bg: theme.colors.gray100,
      border: theme.colors.gray300,
      text: theme.colors.gray700,
    },
    info: {
      bg: theme.colors.infoLight,
      border: theme.colors.infoBorder,
      text: theme.colors.info,
    },
  }

  const colors = variantStyles[variant]

  const badgeStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: theme.spacing.sm,
    padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
    backgroundColor: colors.bg,
    border: `2px solid ${colors.border}`,
    color: colors.text,
    borderRadius: theme.radius.round,
    fontSize: theme.fontSizes.base,
    fontWeight: theme.fontWeights.semibold,
    whiteSpace: 'nowrap',
    ...style,
  }

  const dotStyle: React.CSSProperties = {
    display: 'inline-block',
    width: theme.spacing.sm,
    height: theme.spacing.sm,
    borderRadius: theme.radius.full,
    backgroundColor: colors.text,
    animation: 'pulse 2s infinite',
  }

  return (
    <span style={badgeStyle}>
      {dot && <span style={dotStyle} />}
      {children}
    </span>
  )
}
