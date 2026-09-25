import { CollapsibleCard, FieldPair } from '../ui/Card'
import { Chip } from '../ui/Badge'
import { icons } from '../ui/Icon'
import { useMapSelection } from '../../context/MapSelectionContext'
import { distanceKm } from '../layout/routeGeometry'
import type { LiveAircraft } from '../../hooks/useLiveFleet'

const M_TO_FT = 3.28084
const MS_TO_KT = 1.94384
const MS_TO_FPM = 196.85
const DXB: [number, number] = [55.3644, 25.2532]

export function LiveFlightCard({ live }: { live: LiveAircraft }) {
  const { settings } = useMapSelection()
  const km = distanceKm([live.lng, live.lat], DXB)
  const dist =
    settings.distanceUnit === 'nm' ? `${Math.round(km / 1.852)} NM` : `${Math.round(km)} km`
  const ageSec =
    live.positionTime != null
      ? Math.max(0, Math.round(Date.now() / 1000 - live.positionTime))
      : null
  const fresh = ageSec != null && ageSec <= 120
  const fmt = (v: number | null, mul: number, unit: string) =>
    v == null ? '–' : `${Math.round(v * mul).toLocaleString()} ${unit}`

  return (
    <CollapsibleCard icon={icons.plane} title="Live Data (ADS-B)" defaultOpen>
      <div className="flex items-center gap-2">
        <Chip tone={fresh ? 'green' : 'grey-blue'}>{fresh ? 'Fresh' : 'Stale'}</Chip>
        <p className="text-xs text-fg-muted">
          {ageSec == null ? 'No timestamp' : `Position ${ageSec}s ago`} · ICAO24{' '}
          {live.icao24.toUpperCase()}
        </p>
      </div>
      <FieldPair
        items={[
          ['LAT / LON', `${live.lat.toFixed(3)}, ${live.lng.toFixed(3)}`],
          ['SQUAWK', live.squawk ?? '–'],
        ]}
      />
      <FieldPair
        items={[
          [
            'ALTITUDE',
            settings.altitudeUnit === 'ft'
              ? fmt(live.altitude, M_TO_FT, 'ft')
              : fmt(live.altitude, 1, 'm'),
          ],
          [
            'SPEED',
            settings.speedUnit === 'kt'
              ? fmt(live.velocity, MS_TO_KT, 'kt')
              : fmt(live.velocity, 3.6, 'km/h'),
          ],
        ]}
      />
      <FieldPair
        items={[
          ['HEADING', `${String(Math.round(live.heading)).padStart(3, '0')}°`],
          ['VERTICAL SPEED', fmt(live.verticalRate, MS_TO_FPM, 'fpm')],
        ]}
      />
      <FieldPair
        items={[
          ['STATE', live.onGround ? 'On ground' : 'Airborne'],
          ['DISTANCE TO DXB', dist],
        ]}
      />
    </CollapsibleCard>
  )
}
