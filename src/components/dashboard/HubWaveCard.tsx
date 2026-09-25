import { useMemo, useState } from 'react'
import { AIRCRAFT_TYPES } from '../../data/flightAttributes'
import { buildHubWave, gstHour, type WaveFlight } from '../../data/hubWave'
import { CollapsibleCard } from '../ui/Card'
import { icons } from '../ui/Icon'

function FlightRow({ f }: { f: WaveFlight }) {
  const dep = f.direction === 'departure'
  const Arrow = dep ? icons.arrowUpRight : icons.arrowDownRight
  return (
    <div className="flex w-full items-center gap-2 rounded-xl bg-bg-muted px-3 py-2">
      <Arrow size={14} className="shrink-0" />
      <p className="w-12 text-xs font-semibold text-fg-muted">{f.time}</p>
      <p className="text-sm font-bold text-fg-secondary">{f.flight}</p>
      <p className="flex-1 text-xs font-semibold text-fg-muted">
        {dep ? `DXB → ${f.other}` : `${f.other} → DXB`}
      </p>
      <span className="rounded-full bg-bg-secondary px-2 py-0.5 text-[11px] font-semibold text-fg-secondary">
        {f.type}
      </span>
    </div>
  )
}

export function HubWaveCard({ defaultOpen = false }: { defaultOpen?: boolean }) {
  const [types, setTypes] = useState<string[]>([])
  const [openHour, setOpenHour] = useState<number | null>(null)
  const wave = useMemo(() => buildHubWave(gstHour()), [])

  const toggleType = (t: string) =>
    setTypes((l) => (l.includes(t) ? l.filter((x) => x !== t) : [...l, t]))
  const keep = (f: WaveFlight) => types.length === 0 || types.includes(f.type)

  const rows = wave.map((h) => ({
    ...h,
    departures: h.departures.filter(keep),
    arrivals: h.arrivals.filter(keep),
  }))
  const maxCount = Math.max(1, ...rows.map((r) => Math.max(r.departures.length, r.arrivals.length)))
  const peak = rows.reduce(
    (p, r) =>
      r.departures.length + r.arrivals.length > p.total
        ? { hour: r.hour, total: r.departures.length + r.arrivals.length }
        : p,
    { hour: -1, total: 0 },
  )
  const totals = rows.reduce(
    (t, r) => ({ dep: t.dep + r.departures.length, arr: t.arr + r.arrivals.length }),
    { dep: 0, arr: 0 },
  )

  return (
    <CollapsibleCard
      icon={icons.airspace}
      title="Hub Wave · DXB (next 12h)"
      defaultOpen={defaultOpen}
    >
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          aria-pressed={types.length === 0}
          onClick={() => setTypes([])}
          className={`flex h-7 items-center rounded-full border px-3 text-xs font-semibold ${
            types.length === 0
              ? 'border-inverse bg-inverse text-white'
              : 'border-border-primary text-fg-secondary'
          }`}
        >
          All types
        </button>
        {AIRCRAFT_TYPES.map((t) => (
          <button
            key={t}
            type="button"
            aria-pressed={types.includes(t)}
            onClick={() => toggleType(t)}
            className={`flex h-7 items-center rounded-full border px-3 text-xs font-semibold ${
              types.includes(t)
                ? 'border-inverse bg-inverse text-white'
                : 'border-border-primary text-fg-secondary'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="flex w-full gap-2">
        <div className="flex flex-1 flex-col gap-1 rounded-lg bg-bg-secondary px-3 py-2">
          <p className="text-xl leading-6 font-bold text-fg-blue">{totals.dep}</p>
          <p className="text-xs font-medium text-fg-tertiary">Departures</p>
        </div>
        <div className="flex flex-1 flex-col gap-1 rounded-lg bg-bg-secondary px-3 py-2">
          <p className="text-xl leading-6 font-bold text-fg-green">{totals.arr}</p>
          <p className="text-xs font-medium text-fg-tertiary">Arrivals</p>
        </div>
      </div>

      <div className="flex w-full flex-col gap-1">
        <div className="flex w-full items-center gap-2 px-3 text-xs font-extrabold text-fg-muted">
          <p className="flex-1">HOUR (GST)</p>
          <p className="w-16 text-right">DEP</p>
          <p className="w-16 text-right">ARR</p>
        </div>
        {rows.map((r) => {
          const open = openHour === r.hour
          return (
            <div key={r.hour} className="flex w-full flex-col gap-1">
              <button
                type="button"
                aria-expanded={open}
                onClick={() => setOpenHour(open ? null : r.hour)}
                className={`flex w-full items-center gap-2 rounded-xl border px-3 py-2 text-left ${
                  open ? 'border-inverse bg-bg-muted' : 'border-transparent bg-bg-muted'
                }`}
              >
                <div className="flex flex-1 items-center gap-2">
                  <p className="text-sm font-bold text-fg-secondary">{r.label}</p>
                  {r.hour === peak.hour && (
                    <span className="rounded-full bg-bg-red-subtle px-1.5 py-0.5 text-[10px] font-bold text-fg-red">
                      PEAK
                    </span>
                  )}
                </div>
                <div className="flex w-16 items-center justify-end gap-1.5">
                  <span
                    className="h-1.5 rounded-full bg-fg-blue"
                    style={{ width: `${(r.departures.length / maxCount) * 24}px` }}
                  />
                  <span className="w-5 text-right text-sm font-semibold text-fg-blue">
                    {r.departures.length}
                  </span>
                </div>
                <div className="flex w-16 items-center justify-end gap-1.5">
                  <span
                    className="h-1.5 rounded-full bg-fg-green"
                    style={{ width: `${(r.arrivals.length / maxCount) * 24}px` }}
                  />
                  <span className="w-5 text-right text-sm font-semibold text-fg-green">
                    {r.arrivals.length}
                  </span>
                </div>
              </button>
              {open && (
                <div className="flex max-h-[260px] w-full flex-col gap-1 overflow-y-auto pl-2">
                  {[...r.departures, ...r.arrivals]
                    .sort((a, b) => a.time.localeCompare(b.time))
                    .map((f, i) => (
                      <FlightRow key={`${f.flight}-${i}`} f={f} />
                    ))}
                  {r.departures.length + r.arrivals.length === 0 && (
                    <p className="px-3 py-2 text-xs text-fg-muted">No flights for this filter.</p>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
      <p className="text-xs text-fg-muted">
        Demo hub-wave schedule; connect a schedule feed for live banks.
      </p>
    </CollapsibleCard>
  )
}
