import { Minus, Plus } from 'lucide-react'

type ZoomControlsProps = {
  className?: string
  onZoomIn?: () => void
  onZoomOut?: () => void
}

export function ZoomControls({ className = '', onZoomIn, onZoomOut }: ZoomControlsProps) {
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
        aria-label="Zoom out"
        onClick={onZoomOut}
        className="flex size-8 items-center justify-center text-fg-secondary"
      >
        <Minus size={14} />
      </button>
    </div>
  )
}
