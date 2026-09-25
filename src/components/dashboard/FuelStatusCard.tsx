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

function BarRow({
  label,
  value,
  max,
  color,
  fmt,
  trailing,
}: {
  label: string
  value: number
  max: number
  color: string
  fmt: (n: number) => string
  trailing?: React.ReactNode
}) {
  return (
    <div className="flex w-full flex-col gap-1">
      <div className="flex items-center gap-2">
        <p className="flex-1 text-xs font-semibold text-fg-muted">{label}</p>
        {trailing}
        <p className="text-sm font-bold text-fg-primary">{fmt(value)}</p>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-bg-secondary">
        <div
          className="h-full rounded-full"
          style={{
            width: `${max ? Math.min(100, (value / max) * 100) : 0}%`,
            background: color,
            transition: 'width 500ms ease',
          }}
        />
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex w-full flex-col gap-3 rounded-xl border border-border-primary bg-bg-muted p-3">
      <p className="text-xs font-extrabold tracking-wide text-fg-muted uppercase">{title}</p>
      {children}
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
  const maxFuel = Math.max(f.plannedFuel, f.fuelDepartActual, 1)
  const maxWeight = Math.max(f.towEstimate, f.towActual, 1)

  return (
    <CollapsibleCard icon={Fuel} title="Fuel Status" defaultOpen={defaultOpen}>
      <div className="flex flex-wrap items-center gap-2">
        <p className="text-base font-bold text-fg-primary">{f.flight}</p>
        {f.dep && f.arr && (
          <p className="rounded-full bg-bg-secondary px-2 py-0.5 text-xs font-bold text-fg-secondary">
            {f.dep} → {f.arr}
          </p>
        )}
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

      <div className="flex w-full items-center gap-4 rounded-xl border border-border-primary bg-bg-muted p-3">
        <Gauge percent={remaining} empty={pending || !f.fuelDepartActual} />
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div>
            <p className="text-xs font-semibold text-fg-muted">Fuel on board</p>
            <p className="text-2xl leading-7 font-bold text-fg-primary">{fmt(f.fuelOnBoard)}</p>
          </div>
          <div className="flex gap-4">
            <div>
              <p className="text-[11px] font-semibold text-fg-muted">Departed with</p>
              <p className="text-sm font-bold text-fg-blue">{fmt(f.fuelDepartActual)}</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold text-fg-muted">Burned so far</p>
              <p className="text-sm font-bold text-fg-secondary">{fmt(burned)}</p>
            </div>
          </div>
        </div>
      </div>

      {pending && (
        <div className="flex items-start gap-2 rounded-xl bg-bg-orange-inverse px-3 py-2.5">
          <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-[#f08c00] text-[10px] font-bold text-white">
            !
          </span>
          <p className="text-xs font-medium text-fg-tertiary">
            Fuel and weight data isn't populated yet — this flight may not have departed. Figures
            will appear here once the load sheet is received.
          </p>
        </div>
      )}

      <Section title="Fuel plan vs actual">
        <BarRow
          label="Planned fuel"
          value={f.plannedFuel}
          max={maxFuel}
          color="var(--color-fg-grey-blue-chart)"
          fmt={fmt}
        />
        <BarRow
          label="Fuel at departure"
          value={f.fuelDepartActual}
          max={maxFuel}
          color="var(--color-fg-blue)"
          fmt={fmt}
          trailing={<Delta actual={f.fuelDepartActual} planned={f.plannedFuel} />}
        />
        <BarRow
          label="Planned burn"
          value={f.plannedBurn}
          max={maxFuel}
          color="#f08c00"
          fmt={fmt}
        />
      </Section>

      <Section title="Weights">
        <div className="flex w-full flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <p className="flex-1 text-xs font-semibold text-fg-muted">Take-off weight (actual)</p>
            <Delta actual={f.towActual} planned={f.towEstimate} />
            <p className="text-sm font-bold text-fg-primary">{fmt(f.towActual)}</p>
          </div>
          <div className="flex h-3 w-full overflow-hidden rounded-full bg-bg-secondary">
            <div
              className="h-full bg-fg-grey-blue-chart"
              style={{ width: `${(f.zfwActual / maxWeight) * 100}%` }}
            />
            <div
              className="h-full bg-fg-blue"
              style={{ width: `${(f.fuelDepartActual / maxWeight) * 100}%` }}
            />
          </div>
          <div className="flex gap-4 text-[11px] font-semibold text-fg-muted">
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-fg-grey-blue-chart" /> Zero fuel{' '}
              {fmt(f.zfwActual)}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-fg-blue" /> Fuel {fmt(f.fuelDepartActual)}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {[
            ['TOW estimate', f.towEstimate],
            ['TOW actual', f.towActual],
            ['ZFW estimate', f.zfwEstimate],
            ['ZFW actual', f.zfwActual],
          ].map(([label, value]) => (
            <div key={label as string} className="rounded-lg bg-bg-primary px-3 py-2">
              <p className="text-[11px] font-semibold text-fg-muted">{label}</p>
              <p className="text-sm font-bold text-fg-primary">{fmt(value as number)}</p>
            </div>
          ))}
        </div>
      </Section>

      <div className="flex flex-wrap items-center gap-2">
        <Chip tone="grey-blue">Unit {f.unit}</Chip>
        <Chip tone="grey-blue">Density {f.density} KG/LT</Chip>
        {f.demo && (
          <p className="text-[11px] text-fg-muted">Demo values until a fuel feed is connected</p>
        )}
      </div>
    </CollapsibleCard>
  )
}
