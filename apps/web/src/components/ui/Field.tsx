import React from 'react'
import { useState } from 'react'
import { theme, styleHelpers } from '../../theme'

interface FieldProps {
  label: string
  hint?: string
  error?: string
  children: React.ReactNode
  style?: React.CSSProperties
}

export function Field({ label, hint, error, children, style }: FieldProps) {
  const fieldStyle: React.CSSProperties = {
    ...style,
  }

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: theme.fontSizes.sm,
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  }

  const hintStyle: React.CSSProperties = {
    fontSize: theme.fontSizes.xs,
    color: theme.colors.textMuted,
    marginTop: theme.spacing.xs,
  }

  const errorStyle: React.CSSProperties = {
    fontSize: theme.fontSizes.xs,
    color: theme.colors.error,
    marginTop: theme.spacing.xs,
    fontWeight: theme.fontWeights.medium,
  }

  return (
    <div style={fieldStyle}>
      <label style={labelStyle}>{label}</label>
      {children}
      {hint && !error && <div style={hintStyle}>{hint}</div>}
      {error && <div style={errorStyle}>⚠️ {error}</div>}
    </div>
  )
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
}

export function Input({ error, style, ...props }: InputProps) {
    const [isFocused, setIsFocused] = useState(false)

  const inputStyle: React.CSSProperties = {
    ...styleHelpers.input(),
    borderColor: error ? theme.colors.error : theme.colors.border,
      outline: 'none',
      boxShadow: isFocused ? theme.shadows.focus : 'none',
    ...style,
  }

  return (
    <input 
      style={inputStyle} 
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      {...props} 
    />
  )
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean
}

export function Select({ error, style, children, ...props }: SelectProps) {
    const [isFocused, setIsFocused] = useState(false)

  const selectStyle: React.CSSProperties = {
    ...styleHelpers.input(),
    cursor: 'pointer',
      outline: 'none',
      boxShadow: isFocused ? theme.shadows.focus : 'none',
    borderColor: error ? theme.colors.error : theme.colors.border,
    ...style,
  }

  return (
    <select 
      style={selectStyle}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      {...props}
    >
      {children}
    </select>
  )
}
