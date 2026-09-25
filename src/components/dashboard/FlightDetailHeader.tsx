import { useMapSelection } from '../../context/MapSelectionContext'
import { icons } from '../ui/Icon'
import { Chip } from '../ui/Badge'

export function FlightDetailHeader({
  onClose,
  flightNumber = 'EK878',
}: {
  onClose?: () => void
  flightNumber?: string
}) {
  const { pinnedCallsigns, togglePin } = useMapSelection()
  const pinned = pinnedCallsigns.includes(flightNumber)
  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex h-14 w-full items-start gap-2">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-brand-ek">
          <icons.plane size={20} className="text-white" />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <p className="text-2xl leading-7 font-bold text-fg-primary">{flightNumber}</p>
          <div className="flex items-center gap-2">
            <p className="text-sm font-bold text-fg-tertiary">A380</p>
            <Chip tone="grey-blue">ENRT</Chip>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-4 pt-1">
          <button
            type="button"
            aria-label={pinned ? 'Unpin flight' : 'Pin flight'}
            onClick={() => togglePin(flightNumber)}
            className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-semibold ${
              pinned
                ? 'border-inverse bg-inverse text-white'
                : 'border-border-primary text-fg-secondary'
            }`}
          >
            <icons.bookmark size={16} />
            {pinned ? 'Pinned' : 'Pin flight'}
          </button>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="text-fg-secondary/70"
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
      </div>

      <div className="flex w-full flex-col gap-3">
        <div className="flex w-full items-center gap-4">
          <p className="text-2xl leading-7 font-bold text-fg-secondary">DXB</p>
          <div className="relative flex h-[3px] flex-1 items-center rounded-lg bg-bg-green-muted">
            <div className="h-full w-[55%] rounded-lg bg-fg-green" />
            <icons.plane
              size={20}
              className="absolute text-fg-green"
              style={{ left: '55%', transform: 'translateX(-50%) rotate(90deg)' }}
            />
          </div>
          <p className="text-2xl leading-7 font-bold text-fg-secondary">SYD</p>
        </div>
        <div className="flex w-full items-start justify-between">
          <div className="flex flex-col items-start gap-1">
            <Chip tone="dark" size="sm">
              7h 27m ago
            </Chip>
            <p className="text-xs text-fg-tertiary">
              <span className="font-bold">4,031 mi</span> flown
            </p>
          </div>
          <div className="flex flex-col items-center gap-1">
            <p className="text-sm font-extrabold text-fg-secondary">CORE ETA</p>
            <p className="text-xs text-fg-tertiary">
              <span className="font-bold">16:20</span> in 11h 5m
            </p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <Chip tone="dark" size="sm">
              in 1h 56m
            </Chip>
            <p className="text-xs text-fg-tertiary">
              <span className="font-bold">806 mi</span> to go
            </p>
          </div>
        </div>
      </div>

      <div className="flex w-full gap-3">
        <div className="flex flex-1 flex-col gap-2 rounded-2xl bg-bg-secondary px-4 py-3">
          <p className="text-xs font-extrabold text-fg-secondary">Departure</p>
          <div className="flex items-end gap-1 text-fg-secondary">
            <p className="text-2xl leading-7 font-bold">16:50</p>
            <p className="text-xs tracking-[0.24px]">EEST</p>
          </div>
          <div className="flex items-center gap-1 border-l-2 border-fg-red-chart pl-1">
            <p className="text-xs font-medium text-fg-tertiary">Scheduled 16:50</p>
            <Chip tone="red">20m Late</Chip>
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-2 rounded-2xl bg-bg-secondary px-4 py-3">
          <p className="text-xs font-extrabold text-fg-secondary">Arrival</p>
          <div className="flex items-end gap-1 text-fg-secondary">
            <p className="text-2xl leading-7 font-bold">06:30+1</p>
            <p className="text-xs tracking-[0.24px]">GST</p>
          </div>
          <div className="flex items-center gap-1 border-l-2 border-fg-green-chart pl-1">
            <p className="text-xs font-medium text-fg-tertiary">Scheduled 22:00</p>
            <Chip tone="green">9m Early</Chip>
          </div>
        </div>
      </div>
    </div>
  )
}
