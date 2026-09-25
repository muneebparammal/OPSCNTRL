import { Fuel } from 'lucide-react'
import { useState } from 'react'
import { getFuelStatus, type FuelStatus } from '../../data/fuelStatus'
import { Chip } from '../ui/Badge'
import { CollapsibleCard } from '../ui/Card'
import { displayCallsign } from '../ui/FlightTooltip'

type Unit = 'KG' | 'LT'

function Gauge({ percent, empty }: { percent: number; empty: boolean }) {
  const r = 42
  const c = 2 * Math.PI * r
  const p = Math.min(1, Math.max(0, percent))
  const color = p < 0.25 ? 'var(--color-fg-red)' : p < 0.5 ? '#f08c00' : 'var(--color-fg-green)'
  return (
    <div className="relative size-[112px] shrink-0">
      <svg viewBox="0 0 100 100" className="size-full -rotate-90">
        <circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          stroke="var(--color-bg-tertiary)"
          strokeWidth="9"
        />
        {!empty && (
          <circle
            cx="50"
            cy="50"
            r={r}
            fill="none"
            stroke={color}
            strokeWidth="9"
            strokeLinecap="round"
            strokeDasharray={`${c * p} ${c}`}
            style={{ transition: 'stroke-dasharray 500ms ease' }}
          />
        )}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <p className="text-2xl leading-7 font-bold text-fg-primary">
          {empty ? '—' : `${Math.round(p * 100)}%`}
        </p>
        <p className="text-[11px] font-semibold text-fg-muted">{empty ? 'no data' : 'remaining'}</p>
      </div>
    </div>
  )
}

function Stepper({ f }: { f: FuelStatus }) {
  const steps = [
    { label: 'Planned', done: f.plannedFuel > 0 },
    { label: 'Fuelled', done: f.fuelDepartActual > 0 },
    { label: 'En route', done: f.fuelOnBoard > 0 },
    { label: 'Landed', done: f.fuelArriveActual > 0 },
  ]
  return (
    <div className="flex w-full items-start">
      {steps.map((s, i) => (
        <div key={s.label} className="flex flex-1 flex-col items-center gap-1">
          <div className="flex w-full items-center">
            <div
              className={`h-0.5 flex-1 ${i === 0 ? 'opacity-0' : s.done ? 'bg-fg-green' : 'bg-bg-tertiary'}`}
            />
            <div
              className={`flex size-4 items-center justify-center rounded-full border-2 ${
                s.done ? 'border-fg-green bg-fg-green' : 'border-bg-tertiary bg-bg-primary'
              }`}
            >
              {s.done && <span className="size-1.5 rounded-full bg-white" />}
            </div>
            <div
              className={`h-0.5 flex-1 ${
                i === steps.length - 1
                  ? 'opacity-0'
                  : steps[i + 1].done
                    ? 'bg-fg-green'
                    : 'bg-bg-tertiary'
              }`}
            />
          </div>
          <p
            className={`text-[11px] font-semibold ${s.done ? 'text-fg-primary' : 'text-fg-muted'}`}
          >
            {s.label}
          </p>
        </div>
      ))}
    </div>
  )
}

function Delta({ actual, planned }: { actual: number; planned: number }) {
  if (!planned || !actual) return null
  const d = ((actual - planned) / planned) * 100
  const tone = Math.abs(d) < 2 ? 'green' : d > 0 ? 'red' : 'grey-blue'
  return (
    <Chip tone={tone}>
      {d > 0 ? '+' : ''}
      {d.toFixed(1)}%
    </Chip>
  )
}

function Row({
  label,
  value,
  trailing,
}: {
  label: string
  value: string
  trailing?: React.ReactNode
}) {
  return (
    <div className="flex w-full items-center gap-2 px-1 py-1">
      <p className="flex-1 text-xs font-semibold text-fg-muted">{label}</p>
      {trailing}
      <p className="text-sm font-bold text-fg-primary">{value}</p>
    </div>
  )
}

export function FuelStatusCard({
  callsign,
  defaultOpen = false,
}: {
  callsign: string
  defaultOpen?: boolean
}) {
  const f = getFuelStatus(displayCallsign(callsign))
  const [unit, setUnit] = useState<Unit>('KG')
  const conv = (kg: number) => (unit === 'KG' ? kg : kg / f.density)
  const fmt = (kg: number) => `${Math.round(conv(kg)).toLocaleString()} ${unit}`
  const pending =
    f.fuelDepartActual + f.fuelArriveActual + f.fuelOnBoard + f.towActual + f.zfwActual === 0

  const remaining = f.fuelDepartActual ? f.fuelOnBoard / f.fuelDepartActual : 0
  const burned = f.fuelDepartActual ? f.fuelDepartActual - f.fuelOnBoard : 0
  const maxWeight = Math.max(f.towEstimate, f.towActual, 1)

  return (
    <CollapsibleCard icon={Fuel} title="Fuel Status" defaultOpen={defaultOpen}>
      <div className="flex items-center gap-2">
        <p className="text-sm font-bold text-fg-primary">
          {f.dep && f.arr ? `${f.dep} → ${f.arr}` : f.flight}
        </p>
        {f.date && <p className="text-xs text-fg-muted">{f.date}</p>}
        <div className="flex-1" />
        <div className="flex h-7 items-center rounded-full bg-bg-secondary p-0.5">
          {(['KG', 'LT'] as Unit[]).map((u) => (
            <button
              key={u}
              type="button"
              aria-pressed={unit === u}
              onClick={() => setUnit(u)}
              className={`flex h-6 items-center rounded-full px-2.5 text-xs font-semibold text-fg-secondary ${
                unit === u ? 'bg-bg-primary shadow-sm' : ''
              }`}
            >
              {u}
            </button>
          ))}
        </div>
      </div>

      <Stepper f={f} />

      <div className="flex w-full items-center gap-4 rounded-xl bg-bg-muted p-3">
        <Gauge percent={remaining} empty={pending || !f.fuelDepartActual} />
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <p className="text-xs font-semibold text-fg-muted">On board</p>
          <p className="text-2xl leading-7 font-bold text-fg-primary">{fmt(f.fuelOnBoard)}</p>
          <p className="text-xs text-fg-muted">Burned {fmt(burned)}</p>
        </div>
      </div>

      {pending && (
        <p className="px-1 text-xs text-fg-muted">
          No fuel or weight data yet — the flight may not have departed.
        </p>
      )}

      <div className="flex w-full flex-col divide-y divide-border-primary">
        <Row label="Planned fuel" value={fmt(f.plannedFuel)} />
        <Row
          label="Departed with"
          value={fmt(f.fuelDepartActual)}
          trailing={<Delta actual={f.fuelDepartActual} planned={f.plannedFuel} />}
        />
        <Row label="Planned burn" value={fmt(f.plannedBurn)} />
      </div>

      <div className="flex w-full flex-col gap-2">
        <div className="flex h-2 w-full overflow-hidden rounded-full bg-bg-secondary">
          <div
            className="h-full bg-fg-grey-blue-chart"
            style={{ width: `${(f.zfwActual / maxWeight) * 100}%` }}
          />
          <div
            className="h-full bg-fg-blue"
            style={{ width: `${(f.fuelDepartActual / maxWeight) * 100}%` }}
          />
        </div>
        <div className="flex gap-3 text-[11px] font-semibold text-fg-muted">
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-fg-grey-blue-chart" /> Zero fuel
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-fg-blue" /> Fuel
          </span>
        </div>
        <div className="grid grid-cols-[1fr_auto_auto] gap-x-4 gap-y-1 px-1 text-sm">
          <span />
          <span className="text-right text-[11px] font-extrabold text-fg-muted">EST</span>
          <span className="text-right text-[11px] font-extrabold text-fg-muted">ACT</span>
          <span className="text-xs font-semibold text-fg-muted">Take-off weight</span>
          <span className="text-right font-semibold text-fg-tertiary">{fmt(f.towEstimate)}</span>
          <span className="text-right font-bold text-fg-primary">{fmt(f.towActual)}</span>
          <span className="text-xs font-semibold text-fg-muted">Zero-fuel weight</span>
          <span className="text-right font-semibold text-fg-tertiary">{fmt(f.zfwEstimate)}</span>
          <span className="text-right font-bold text-fg-primary">{fmt(f.zfwActual)}</span>
        </div>
      </div>

      <p className="px-1 text-[11px] text-fg-muted">
        Density {f.density} KG/LT{f.demo ? ' · demo values' : ''}
      </p>
    </CollapsibleCard>
  )
}
