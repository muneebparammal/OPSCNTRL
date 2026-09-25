import type { ReactNode } from 'react'

export function Tooltip({
  label,
  children,
  bubbleClassName = 'rounded-lg px-3 py-1.5 text-sm font-medium',
}: {
  label: ReactNode
  children: ReactNode
  bubbleClassName?: string
}) {
  return (
    <div className="group relative flex">
      {children}
      <div className="pointer-events-none absolute bottom-full left-1/2 z-50 w-max mb-2 -translate-x-1/2 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
        <div
          className={`whitespace-nowrap bg-fg-secondary text-white shadow-popover ${bubbleClassName}`}
        >
          {label}
        </div>
        <div className="absolute top-full left-1/2 -mt-1 size-2 -translate-x-1/2 rotate-45 bg-fg-secondary" />
      </div>
    </div>
  )
}
