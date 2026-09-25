import { useMapSelection } from '../../context/MapSelectionContext'
import { CollapsibleCard } from '../ui/Card'
import { icons } from '../ui/Icon'

const MODES = [
  ['both', 'Both'],
  ['departure', 'Departures'],
  ['arrival', 'Arrivals'],
] as const

export function HourlyFlightsCard({ defaultOpen = false }: { defaultOpen?: boolean }) {
  const { hourFilter, setHourFilter, hourMode, setHourMode, hourlyCounts } = useMapSelection()
  const total = (h: number) =>
    hourMode === 'departure'
      ? hourlyCounts.departure[h]
      : hourMode === 'arrival'
        ? hourlyCounts.arrival[h]
        : hourlyCounts.departure[h] + hourlyCounts.arrival[h]

  return (
    <CollapsibleCard icon={icons.clock} title="Hourly Flights (24h)" defaultOpen={defaultOpen}>
      <div className="flex w-full gap-2">
        {MODES.map(([mode, label]) => (
          <button
            key={mode}
            type="button"
            aria-pressed={hourMode === mode}
            onClick={() => setHourMode(mode)}
            className={`flex h-8 flex-1 items-center justify-center rounded-full border text-xs font-semibold ${
              hourMode === mode
                ? 'border-inverse bg-inverse text-white'
                : 'border-border-primary text-fg-secondary'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-6 gap-1.5">
        {Array.from({ length: 24 }, (_, h) => {
          const active = hourFilter === h
          return (
            <button
              key={h}
              type="button"
              aria-pressed={active}
              onClick={() => setHourFilter(active ? null : h)}
              className={`flex flex-col items-center rounded-lg border py-1.5 ${
                active
                  ? 'border-inverse bg-inverse text-white'
                  : 'border-border-primary bg-bg-primary text-fg-secondary'
              }`}
            >
              <span className="text-xs font-semibold">{String(h).padStart(2, '0')}:00</span>
              <span className={`text-[11px] ${active ? 'text-white/80' : 'text-fg-muted'}`}>
                {total(h)}
              </span>
            </button>
          )
        })}
      </div>
      <p className="text-xs text-fg-muted">
        Counts are flights in the current view, grouped by scheduled hour (demo schedule).
        {hourFilter != null && ' Tap the selected hour again to clear.'}
      </p>
    </CollapsibleCard>
  )
}
