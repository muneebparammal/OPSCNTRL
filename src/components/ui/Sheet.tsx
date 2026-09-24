import { X } from 'lucide-react'
import type { ReactNode } from 'react'

type SheetProps = {
  open: boolean
  onClose?: () => void
  children: ReactNode
  title?: ReactNode
  hideDefaultClose?: boolean
}

export function Sheet({ open, onClose, children, title, hideDefaultClose = false }: SheetProps) {
  if (!open) return null
  return (
    <div className="absolute top-0 right-0 z-20 h-full w-[440px] overflow-hidden border-l border-border-primary bg-bg-primary shadow-popover">
      <div className="flex h-full flex-col overflow-y-auto p-5">
        {title !== undefined ? (
          <div className="mb-5 flex w-full items-start gap-2">
            <div className="min-w-0 flex-1">{title}</div>
            {!hideDefaultClose && (
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="shrink-0 rounded-md p-0.5 text-fg-secondary/70 hover:bg-bg-secondary"
              >
                <X size={24} />
              </button>
            )}
          </div>
        ) : (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute top-5 right-5 rounded-md p-0.5 text-fg-secondary/70 hover:bg-bg-secondary"
          >
            <X size={24} />
          </button>
        )}
        <div className="flex w-full flex-col gap-3">{children}</div>
      </div>
    </div>
  )
}
