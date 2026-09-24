import { CloudSun, History, ScanSearch, ShieldAlert, Target } from 'lucide-react'

const links = [
  { icon: ScanSearch, label: 'Airspace' },
  { icon: Target, label: 'DXB ring' },
  { icon: History, label: 'Play Back' },
  { icon: ShieldAlert, label: 'Notams', badge: 10 },
  { icon: CloudSun, label: 'Weather' },
]

export function QuickLinksBar({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-3 ${className}`}>
      {links.map(({ icon: Icon, label, badge }) => (
        <button
          key={label}
          type="button"
          aria-label={label}
          className="relative flex size-12 items-center justify-center rounded-full bg-bg-primary shadow-xs"
        >
          <Icon size={16} className="text-fg-secondary" />
          {badge !== undefined && (
            <span className="absolute top-0.5 right-1.5 flex min-w-4 items-center justify-center rounded-full border border-white bg-fg-red px-1 py-0.5 text-xs font-semibold text-white">
              {badge}
            </span>
          )}
        </button>
      ))}
    </div>
  )
}
