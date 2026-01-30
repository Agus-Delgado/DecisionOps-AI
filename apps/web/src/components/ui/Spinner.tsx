import React from 'react'
import { theme } from '../../theme'

export function Spinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = {
    sm: '16px',
    md: '20px',
    lg: '24px',
  }

  const spinnerStyle: React.CSSProperties = {
    display: 'inline-block',
    width: sizes[size],
    height: sizes[size],
    border: `3px solid ${theme.colors.gray200}`,
    borderTopColor: theme.colors.primary,
    borderRadius: theme.radius.full,
    animation: 'spin 0.8s linear infinite',
  }

  return (
    <>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
      <span style={spinnerStyle} aria-label="Cargando..." role="status" />
    </>
  )
}
