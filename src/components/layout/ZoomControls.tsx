import { ChevronsUpDown, Minus, Plus } from 'lucide-react'

export function ZoomControls({ className = '' }: { className?: string }) {
  return (
    <div
      className={`flex flex-col items-start divide-y divide-border-primary overflow-hidden rounded-full border border-border-primary bg-bg-primary shadow-xs ${className}`}
    >
      <button type="button" aria-label="Zoom in" className="flex size-8 items-center justify-center text-fg-secondary">
        <Plus size={14} />
      </button>
      <button
        type="button"
        aria-label="Reset zoom"
        className="flex h-9 w-8 items-center justify-center text-xs font-semibold text-fg-secondary"
      >
        100%
      </button>
      <button type="button" aria-label="Zoom out" className="flex size-8 items-center justify-center text-fg-secondary">
        <Minus size={14} />
      </button>
      <button
        type="button"
        aria-label="Expand"
        className="flex size-8 items-center justify-center text-fg-secondary"
      >
        <ChevronsUpDown size={14} />
      </button>
    </div>
  )
}
