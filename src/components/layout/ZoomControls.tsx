import { ChevronsUpDown, Minus, Plus } from 'lucide-react'

type ZoomControlsProps = {
  className?: string
  percent?: number
  onZoomIn?: () => void
  onZoomOut?: () => void
  onReset?: () => void
}

export function ZoomControls({
  className = '',
  percent = 100,
  onZoomIn,
  onZoomOut,
  onReset,
}: ZoomControlsProps) {
  return (
    <div
      className={`flex flex-col items-start divide-y divide-border-primary overflow-hidden rounded-full border border-border-primary bg-bg-primary shadow-xs ${className}`}
    >
      <button
        type="button"
        aria-label="Zoom in"
        onClick={onZoomIn}
        className="flex size-8 items-center justify-center text-fg-secondary"
      >
        <Plus size={14} />
      </button>
      <button
        type="button"
        aria-label="Reset zoom"
        onClick={onReset}
        className="flex h-9 w-8 items-center justify-center text-xs font-semibold text-fg-secondary"
      >
        {percent}%
      </button>
      <button
        type="button"
        aria-label="Zoom out"
        onClick={onZoomOut}
        className="flex size-8 items-center justify-center text-fg-secondary"
      >
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
