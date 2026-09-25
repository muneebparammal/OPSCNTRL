import { useMapSelection, type MapSettings } from '../../context/MapSelectionContext'
import { Switch } from './Switch'

function Segmented<T extends string | number>({
  value,
  options,
  onChange,
}: {
  value: T
  options: readonly (readonly [T, string])[]
  onChange: (v: T) => void
}) {
  return (
    <div className="flex h-7 items-center rounded-full bg-bg-secondary p-0.5">
      {options.map(([v, label]) => (
        <button
          key={String(v)}
          type="button"
          aria-pressed={value === v}
          onClick={() => onChange(v)}
          className={`flex h-6 items-center rounded-full px-2.5 text-xs font-semibold text-fg-secondary ${
            value === v ? 'bg-bg-primary shadow-sm' : ''
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex min-h-[34px] w-full items-center gap-2 px-3 py-1">
      <p className="flex-1 text-sm font-medium text-fg-primary">{label}</p>
      {children}
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col py-2">
      <p className="px-3 pb-1 text-xs font-bold tracking-wide text-fg-muted uppercase">{title}</p>
      {children}
    </div>
  )
}

export function SettingsDropdown() {
  const { settings, updateSettings, resetFilters } = useMapSelection()
  const set =
    <K extends keyof MapSettings>(key: K) =>
    (value: MapSettings[K]) =>
      updateSettings({ [key]: value } as Partial<MapSettings>)

  return (
    <div className="w-72 overflow-hidden rounded-xl border border-border-primary bg-bg-popover shadow-popover">
      <div className="flex h-8 items-center px-3 py-1.5">
        <p className="text-sm font-bold text-fg-primary">Settings</p>
      </div>
      <div className="h-px bg-border-primary" />
      <Section title="Units">
        <Row label="Altitude">
          <Segmented
            value={settings.altitudeUnit}
            onChange={set('altitudeUnit')}
            options={[
              ['ft', 'ft'],
              ['m', 'm'],
            ]}
          />
        </Row>
        <Row label="Speed">
          <Segmented
            value={settings.speedUnit}
            onChange={set('speedUnit')}
            options={[
              ['kt', 'kt'],
              ['kmh', 'km/h'],
            ]}
          />
        </Row>
        <Row label="Distance">
          <Segmented
            value={settings.distanceUnit}
            onChange={set('distanceUnit')}
            options={[
              ['nm', 'NM'],
              ['km', 'km'],
            ]}
          />
        </Row>
      </Section>
      <div className="h-px bg-border-primary" />
      <Section title="Aircraft on map">
        <Row label="Callsign labels">
          <Switch
            checked={settings.showLabels}
            onChange={set('showLabels')}
            label="Callsign labels"
          />
        </Row>
        <Row label="Icon size">
          <Segmented
            value={settings.iconScale}
            onChange={set('iconScale')}
            options={[
              ['small', 'S'],
              ['medium', 'M'],
              ['large', 'L'],
            ]}
          />
        </Row>
      </Section>
      <div className="h-px bg-border-primary" />
      <Section title="Live data">
        <Row label="Refresh every">
          <Segmented
            value={settings.refreshSec}
            onChange={set('refreshSec')}
            options={[
              [15, '15s'],
              [30, '30s'],
              [60, '60s'],
            ]}
          />
        </Row>
        <Row label="Pause updates">
          <Switch checked={settings.paused} onChange={set('paused')} label="Pause updates" />
        </Row>
      </Section>
      <div className="h-px bg-border-primary" />
      <div className="p-3">
        <button
          type="button"
          onClick={resetFilters}
          className="flex h-8 w-full items-center justify-center rounded-full border border-border-primary text-sm font-semibold text-fg-secondary hover:bg-bg-secondary"
        >
          Reset all filters
        </button>
      </div>
    </div>
  )
}
