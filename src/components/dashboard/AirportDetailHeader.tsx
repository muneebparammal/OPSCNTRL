import { Building2 } from 'lucide-react'
import type { Airport } from '../../data/airports'
import { Chip } from '../ui/Badge'

export function AirportDetailHeader({
  airport,
  onClose,
}: {
  airport: Airport
  onClose?: () => void
}) {
  return (
    <div className="flex w-full items-start gap-2">
      <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-brand-ek">
        <Building2 size={20} className="text-white" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <p className="text-2xl leading-7 font-bold text-fg-primary">{airport.icao}</p>
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-bold text-fg-tertiary">{airport.name}</p>
          {airport.iata && <Chip tone="grey-blue">{airport.iata}</Chip>}
        </div>
        <p className="text-xs text-fg-muted">
          {[airport.city, airport.country].filter(Boolean).join(', ')}
        </p>
      </div>
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="shrink-0 pt-1 text-fg-secondary/70 hover:text-fg-secondary"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M18 6 6 18M6 6l12 12"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  )
}
