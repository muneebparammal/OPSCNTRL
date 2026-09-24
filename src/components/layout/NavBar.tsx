import { Bell, Moon, PanelLeft, RefreshCw } from 'lucide-react'

export function NavBar({ breadcrumb }: { breadcrumb: string }) {
  return (
    <header className="flex h-[70px] w-full shrink-0 items-center justify-between border-b border-border-primary bg-bg-primary px-6">
      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label="Toggle sidebar"
          className="flex size-7 items-center justify-center rounded-full text-fg-secondary"
        >
          <PanelLeft size={16} />
        </button>
        <div className="h-[15px] w-px bg-border-primary" />
        <p className="text-sm font-medium tracking-[0.28px] text-fg-primary">{breadcrumb}</p>
      </div>
      <div className="flex items-center gap-1">
        <div className="flex items-center gap-2 rounded-lg p-4">
          <div className="flex size-8 items-center justify-center rounded-lg border border-border-primary bg-bg-muted">
            <Bell size={16} className="text-fg-secondary" />
          </div>
          <div className="flex flex-col items-start gap-1 tracking-[0.28px]">
            <p className="text-sm font-semibold text-fg-primary">
              15:30 / <span className="text-fg-muted">GST</span>
            </p>
            <p className="text-sm font-medium text-fg-muted">Thu, 10 Sep 2026</p>
          </div>
        </div>
        <button
          type="button"
          aria-label="Toggle dark mode"
          className="flex size-8 items-center justify-center rounded-full border border-border-primary text-fg-secondary"
        >
          <Moon size={16} />
        </button>
        <button
          type="button"
          aria-label="Refresh"
          className="flex size-8 items-center justify-center rounded-full border border-border-primary text-fg-secondary"
        >
          <RefreshCw size={16} />
        </button>
      </div>
    </header>
  )
}
