import type { ReactNode } from 'react'

export function Tooltip({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="group relative flex">
      {children}
      <div className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
        <div className="whitespace-nowrap rounded-lg bg-fg-secondary px-3 py-1.5 text-sm font-medium text-white shadow-popover">
          {label}
        </div>
        <div className="absolute top-full left-1/2 -mt-1 size-2 -translate-x-1/2 rotate-45 bg-fg-secondary" />
      </div>
    </div>
  )
}
