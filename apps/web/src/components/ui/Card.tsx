import React from 'react'
import { theme, styleHelpers } from '../../theme'

interface CardProps {
  children: React.ReactNode
  elevated?: boolean
  style?: React.CSSProperties
}

export function Card({ children, elevated = false, style }: CardProps) {
  const cardStyle: React.CSSProperties = {
    padding: theme.spacing.xl,
    ...styleHelpers.card(elevated),
    ...style,
  }

  return <section style={cardStyle}>{children}</section>
}

interface CardHeaderProps {
  children: React.ReactNode
  stepNumber?: number
  style?: React.CSSProperties
}

export function CardHeader({ children, stepNumber, style }: CardHeaderProps) {
  const headerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.md,
    ...style,
  }

  const stepNumberStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    height: '40px',
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.primary,
    color: theme.colors.textInverse,
    fontWeight: theme.fontWeights.bold,
    fontSize: theme.fontSizes.xl,
    flexShrink: 0,
  }

  const titleStyle: React.CSSProperties = {
    margin: '0',
    fontSize: theme.fontSizes['2xl'],
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.textPrimary,
  }

  return (
    <div style={headerStyle}>
      {stepNumber && <span style={stepNumberStyle}>{stepNumber}</span>}
      <h2 style={titleStyle}>{children}</h2>
    </div>
  )
}

interface CardBodyProps {
  children: React.ReactNode
  description?: string
  style?: React.CSSProperties
}

export function CardBody({ children, description, style }: CardBodyProps) {
  const bodyStyle: React.CSSProperties = {
    ...style,
  }

  const descriptionStyle: React.CSSProperties = {
    margin: `0 0 ${theme.spacing.lg} 0`,
    fontSize: theme.fontSizes.base,
    color: theme.colors.textTertiary,
    lineHeight: theme.lineHeights.relaxed,
  }

  return (
    <div style={bodyStyle}>
      {description && <p style={descriptionStyle}>{description}</p>}
      {children}
    </div>
  )
}
