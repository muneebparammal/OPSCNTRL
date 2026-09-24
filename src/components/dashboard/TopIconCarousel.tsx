import { AlertCircle, Clock, CloudSun, Coins, Ruler } from 'lucide-react'

const items = [
  { icon: Ruler, label: 'Measure' },
  { icon: Coins, label: 'Currency' },
  { icon: Clock, label: 'History' },
  { icon: AlertCircle, label: 'Alerts', badge: 10 },
  { icon: CloudSun, label: 'Weather' },
]

export function TopIconCarousel({ className = '' }: { className?: string }) {
  return (
    <div
      className={`flex items-center gap-1 rounded-2xl bg-bg-primary p-1 shadow-sm ${className}`}
    >
      {items.map(({ icon: Icon, label, badge }) => (
        <button
          key={label}
          type="button"
          aria-label={label}
          className="relative flex size-14 items-center justify-center rounded-xl text-fg-secondary"
        >
          <Icon size={24} />
          {badge !== undefined && (
            <span className="absolute top-0.5 right-2 flex min-w-5 items-center justify-center rounded-full border border-white bg-fg-red px-1 text-[10px] font-semibold text-white">
              {badge}
            </span>
          )}
        </button>
      ))}
    </div>
  )
}
