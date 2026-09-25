import { type IconComponent, icons } from './Icon'
import { type ReactNode, useState } from 'react'

type CollapsibleCardProps = {
  icon: IconComponent
  title: string
  defaultOpen?: boolean
  children?: ReactNode
}

export function CollapsibleCard({
  icon: Icon,
  title,
  defaultOpen = false,
  children,
}: CollapsibleCardProps) {
  const [open, setOpen] = useState(defaultOpen)
  const hasContent = Boolean(children)

  return (
    <div className="w-full shrink-0 overflow-hidden rounded-2xl border border-border-primary bg-bg-card shadow-sm">
      <button
        type="button"
        onClick={() => hasContent && setOpen((v) => !v)}
        className="flex w-full items-center gap-2 px-4 py-3 text-left"
      >
        <Icon size={16} className="shrink-0 text-fg-secondary" />
        <span className="flex-1 text-sm font-semibold tracking-[0.28px] text-fg-primary">
          {title}
        </span>
        {hasContent &&
          (open ? (
            <icons.chevronUp size={16} className="shrink-0 text-fg-secondary" />
          ) : (
            <icons.chevronDown size={16} className="shrink-0 text-fg-secondary" />
          ))}
      </button>
      {hasContent && open && (
        <div className="flex w-full flex-col gap-2 border-t border-border-primary p-4">
          {children}
        </div>
      )}
    </div>
  )
}

export function FieldPair({ items }: { items: [string, string][] }) {
  return (
    <div className="flex w-full gap-2">
      {items.map(([label, value]) => (
        <div key={label} className="flex min-w-px flex-1 flex-col gap-1 rounded-md p-2">
          <p className="text-sm font-medium text-fg-muted">{label}</p>
          <p className="text-sm font-semibold text-fg-primary">{value}</p>
        </div>
      ))}
    </div>
  )
}

export function Separator() {
  return <div className="h-px w-full bg-border-primary" />
}
