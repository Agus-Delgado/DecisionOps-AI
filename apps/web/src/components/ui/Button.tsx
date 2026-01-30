import React from 'react'
import { useState } from 'react'
import { theme, styleHelpers } from '../../theme'
import { Spinner } from './Spinner'

interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary'
  loading?: boolean
  disabled?: boolean
  fullWidth?: boolean
  style?: React.CSSProperties
}

export function Button({
  children,
  onClick,
  variant = 'primary',
  loading = false,
  disabled = false,
  fullWidth = false,
  style,
}: ButtonProps) {
    const [isFocused, setIsFocused] = useState(false)

  const buttonStyle: React.CSSProperties = {
    ...styleHelpers.button(variant, fullWidth),
    opacity: disabled || loading ? 0.6 : 1,
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
      outline: 'none',
      boxShadow: isFocused ? theme.shadows.focus : styleHelpers.button(variant).boxShadow,
    ...style,
  }

  const handleClick = () => {
    if (!disabled && !loading && onClick) {
      onClick()
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={disabled || loading}
      style={buttonStyle}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
    >
      {loading && (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: theme.spacing.sm, marginRight: theme.spacing.sm }}>
          <Spinner size="sm" />
        </span>
      )}
      {children}
    </button>
  )
}
