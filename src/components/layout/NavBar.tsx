import { Moon, RefreshCw, Sun } from 'lucide-react'
import { useState } from 'react'
import { icons } from '../ui/Icon'

type NavBarProps = {
  breadcrumb: string
  sidebarExpanded?: boolean
  onToggleSidebar?: () => void
  dark?: boolean
  onToggleTheme?: () => void
  onRefresh?: () => void
}

export function NavBar({
  breadcrumb,
  sidebarExpanded = false,
  onToggleSidebar,
  dark = false,
  onToggleTheme,
  onRefresh,
}: NavBarProps) {
  const [spinning, setSpinning] = useState(false)
  return (
    <header className="flex h-[70px] w-full shrink-0 items-center justify-between border-b border-border-primary bg-bg-primary px-6">
      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label="Toggle sidebar"
          aria-pressed={sidebarExpanded}
          onClick={onToggleSidebar}
          className={`flex size-7 items-center justify-center rounded-full text-fg-secondary ${
            sidebarExpanded ? 'bg-bg-secondary' : ''
          }`}
        >
          <icons.panelLeft size={16} />
        </button>
        <div className="h-[15px] w-px bg-border-primary" />
        <p className="text-sm font-medium tracking-[0.28px] text-fg-primary">{breadcrumb}</p>
      </div>
      <div className="flex items-center gap-1">
        <div className="flex items-center gap-2 rounded-lg p-4">
          <div className="flex size-8 items-center justify-center rounded-lg border border-border-primary bg-bg-muted">
            <icons.bell size={16} className="text-fg-secondary" />
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
          aria-pressed={dark}
          onClick={onToggleTheme}
          className="flex size-8 items-center justify-center rounded-full border border-border-primary text-fg-secondary"
        >
          {dark ? <Sun size={16} /> : <Moon size={16} />}
        </button>
        <button
          type="button"
          aria-label="Refresh"
          onClick={() => {
            onRefresh?.()
            setSpinning(true)
            window.setTimeout(() => setSpinning(false), 900)
          }}
          className="flex size-8 items-center justify-center rounded-full border border-border-primary text-fg-secondary"
        >
          <RefreshCw size={16} className={spinning ? 'animate-spin' : ''} />
        </button>
      </div>
    </header>
  )
}
