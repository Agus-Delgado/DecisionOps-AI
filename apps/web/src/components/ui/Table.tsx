import React from 'react'
import { theme } from '../../theme'

interface TableProps {
  children: React.ReactNode
  style?: React.CSSProperties
}

export function Table({ children, style }: TableProps) {
  const tableStyle: React.CSSProperties = {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: theme.spacing.md,
    fontSize: theme.fontSizes.base,
    ...style,
  }

  return <table style={tableStyle}>{children}</table>
}

interface TableHeaderProps {
  children: React.ReactNode
}

export function TableHeader({ children }: TableHeaderProps) {
  return <thead>{children}</thead>
}

interface TableBodyProps {
  children: React.ReactNode
  zebra?: boolean
}

export function TableBody({ children, zebra = true }: TableBodyProps) {
  const style: React.CSSProperties = zebra
    ? {
        // Zebra stripes will be applied to individual rows
      }
    : {}

  return (
    <tbody style={style}>
      {React.Children.map(children, (child, index) => {
        if (React.isValidElement(child) && zebra) {
          return React.cloneElement(child, {
            ...child.props,
            style: {
              ...child.props.style,
              backgroundColor: index % 2 === 0 ? 'transparent' : theme.colors.gray50,
            },
          } as any)
        }
        return child
      })}
    </tbody>
  )
}

interface TableRowProps {
  children: React.ReactNode
  style?: React.CSSProperties
}

export function TableRow({ children, style }: TableRowProps) {
  return <tr style={style}>{children}</tr>
}

interface TableHeadCellProps {
  children: React.ReactNode
  align?: 'left' | 'center' | 'right'
  style?: React.CSSProperties
}

export function TableHeadCell({ children, align = 'left', style }: TableHeadCellProps) {
  const cellStyle: React.CSSProperties = {
    textAlign: align,
    padding: `${theme.spacing.md} ${theme.spacing.lg}`,
    borderBottom: `2px solid ${theme.colors.textSecondary}`,
    fontWeight: theme.fontWeights.semibold,
    fontSize: theme.fontSizes.base,
    color: theme.colors.textPrimary,
    backgroundColor: theme.colors.bgSecondary,
    ...style,
  }

  return <th style={cellStyle}>{children}</th>
}

interface TableCellProps {
  children: React.ReactNode
  align?: 'left' | 'center' | 'right'
  style?: React.CSSProperties
}

export function TableCell({ children, align = 'left', style }: TableCellProps) {
  const cellStyle: React.CSSProperties = {
    textAlign: align,
    padding: `${theme.spacing.md} ${theme.spacing.lg}`,
    borderBottom: `1px solid ${theme.colors.border}`,
    fontSize: theme.fontSizes.base,
    color: theme.colors.textSecondary,
    ...style,
  }

  return <td style={cellStyle}>{children}</td>
}
