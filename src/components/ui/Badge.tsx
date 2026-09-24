import type { ReactNode } from 'react'

type BadgeProps = {
  children: ReactNode
  icon?: ReactNode
}

export function Badge({ children, icon }: BadgeProps) {
  return (
    <span className="flex h-8 items-center gap-1.5 rounded-full border border-border-primary bg-bg-primary px-3 text-sm font-semibold text-fg-secondary shadow-xs">
      {icon}
      {children}
    </span>
  )
}

type ChipProps = {
  children: ReactNode
  tone?: 'neutral' | 'green' | 'red' | 'grey-blue' | 'dark'
  size?: 'xs' | 'sm'
}

const toneClasses: Record<NonNullable<ChipProps['tone']>, string> = {
  neutral: 'bg-bg-tertiary text-fg-muted',
  green: 'bg-bg-green-subtle text-fg-green',
  red: 'bg-bg-red-subtle text-fg-red',
  'grey-blue': 'bg-bg-grey-blue-subtle text-fg-grey-blue',
  dark: 'bg-bg-inverse-secondary text-fg-inverse-primary',
}

export function Chip({ children, tone = 'neutral', size = 'xs' }: ChipProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-1.5 py-0.5 font-semibold whitespace-nowrap ${toneClasses[tone]} ${
        size === 'xs' ? 'text-[10px] tracking-[0.2px]' : 'text-xs tracking-[0.24px]'
      }`}
    >
      {children}
    </span>
  )
}
