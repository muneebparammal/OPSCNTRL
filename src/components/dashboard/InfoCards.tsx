import { icons } from '../ui/Icon'
import { AIRCRAFT_TYPES, FLIGHT_STATUSES } from '../../data/flightAttributes'
import { useMapSelection } from '../../context/MapSelectionContext'
import { CollapsibleCard, FieldPair, Separator } from '../ui/Card'

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`flex h-8 items-center rounded-full border px-3 text-sm font-semibold shadow-xs transition-colors ${
        active
          ? 'border-fg-secondary bg-fg-secondary text-white'
          : 'border-border-primary bg-bg-primary text-fg-secondary'
      }`}
    >
      {label}
    </button>
  )
}

export function AircraftTypeCard({ defaultOpen = false }: { defaultOpen?: boolean }) {
  const { typeFilter, toggleTypeFilter } = useMapSelection()
  return (
    <CollapsibleCard icon={icons.plane} title="Aircraft Type" defaultOpen={defaultOpen}>
      <div className="flex flex-wrap gap-2">
        {AIRCRAFT_TYPES.map((t) => (
          <FilterChip
            key={t}
            label={t}
            active={typeFilter.includes(t)}
            onClick={() => toggleTypeFilter(t)}
          />
        ))}
      </div>
    </CollapsibleCard>
  )
}

export function FlightStatusCard({ defaultOpen = false }: { defaultOpen?: boolean }) {
  const { statusFilter, toggleStatusFilter } = useMapSelection()
  return (
    <CollapsibleCard icon={icons.plane} title="Flight Status" defaultOpen={defaultOpen}>
      <div className="flex flex-wrap gap-2">
        {FLIGHT_STATUSES.map((st) => (
          <FilterChip
            key={st}
            label={st}
            active={statusFilter.includes(st)}
            onClick={() => toggleStatusFilter(st)}
          />
        ))}
      </div>
    </CollapsibleCard>
  )
}

export function FlightInfoCard({ defaultOpen = true }: { defaultOpen?: boolean }) {
  return (
    <CollapsibleCard icon={icons.plane} title="Flight Info" defaultOpen={defaultOpen}>
      <FieldPair
        items={[
          ['TAIL', 'A6-ECB'],
          ['AIRCRAFT', 'A6-ECB'],
        ]}
      />
      <Separator />
      <FieldPair
        items={[
          ['BLOCK', '13h 40m'],
          ['DATE', 'Sep 23'],
        ]}
      />
    </CollapsibleCard>
  )
}
