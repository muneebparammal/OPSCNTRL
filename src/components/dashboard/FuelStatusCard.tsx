import { Fuel } from 'lucide-react'
import { useState } from 'react'
import { getFuelStatus } from '../../data/fuelStatus'
import { Chip } from '../ui/Badge'
import { CollapsibleCard } from '../ui/Card'
import { displayCallsign } from '../ui/FlightTooltip'

type Unit = 'KG' | 'LT'

// Analogue cockpit-style fuel meter: E to F sweep with red/amber/green bands,
// tick marks and a needle that animates to the current level.
const CX = 100
const CY = 100
const R = 78

function polar(p: number, r: number) {
  const a = Math.PI * (1 - p)
  return [CX + r * Math.cos(a), CY - r * Math.sin(a)] as const
}

function arc(p0: number, p1: number, r: number) {
  const [x0, y0] = polar(p0, r)
  const [x1, y1] = polar(p1, r)
  return `M ${x0} ${y0} A ${r} ${r} 0 0 1 ${x1} ${y1}`
}

const BANDS = [
  { from: 0, to: 0.25, color: 'var(--color-fg-red)' },
  { from: 0.25, to: 0.5, color: '#f08c00' },
  { from: 0.5, to: 1, color: 'var(--color-fg-green)' },
]
const LABELS: [number, string][] = [
  [0, 'E'],
  [0.25, '¼'],
  [0.5, '½'],
  [0.75, '¾'],
  [1, 'F'],
]

function Gauge({ percent, empty }: { percent: number; empty: boolean }) {
  const p = Math.min(1, Math.max(0, empty ? 0 : percent))
  const angle = -90 + p * 180
  return (
    <div className="mx-auto flex w-full max-w-[240px] flex-col gap-1">
      <svg viewBox="0 0 200 112" className="w-full">
        {BANDS.map((b) => (
          <path
            key={b.from}
            d={arc(b.from, b.to, R)}
            fill="none"
            stroke={empty ? 'var(--color-bg-tertiary)' : b.color}
            strokeWidth="10"
            opacity={empty ? 1 : 0.9}
          />
        ))}
        {Array.from({ length: 21 }, (_, k) => {
          const t = k / 20
          const major = k % 5 === 0
          const [x0, y0] = polar(t, R - 8)
          const [x1, y1] = polar(t, R - (major ? 17 : 13))
          return (
            <line
              key={k}
              x1={x0}
              y1={y0}
              x2={x1}
              y2={y1}
              stroke="var(--color-fg-muted)"
              strokeWidth={major ? 2 : 1}
              strokeLinecap="round"
            />
          )
        })}
        {LABELS.map(([t, label]) => {
          const [x, y] = polar(t, R - 28)
          return (
            <text
              key={label}
              x={x}
              y={y + 4}
              textAnchor="middle"
              fontSize="12"
              fontWeight="700"
              fill="var(--color-fg-secondary)"
            >
              {label}
            </text>
          )
        })}
        <g
          style={{
            transform: `rotate(${angle}deg)`,
            transformOrigin: `${CX}px ${CY}px`,
            transition: 'transform 700ms cubic-bezier(0.34, 1.3, 0.64, 1)',
          }}
        >
          <polygon
            points={`${CX - 3},${CY} ${CX + 3},${CY} ${CX},${CY - (R - 12)}`}
            fill={empty ? 'var(--color-fg-muted)' : 'var(--color-brand-ek)'}
          />
        </g>
        <circle cx={CX} cy={CY} r="7" fill="var(--color-fg-secondary)" />
        <circle cx={CX} cy={CY} r="2.5" fill="var(--color-bg-primary)" />
      </svg>
      <div className="flex items-center justify-center gap-1.5">
        <Fuel size={14} className="text-fg-muted" />
        <p className="text-xl leading-6 font-bold text-fg-primary">
          {empty ? '—' : `${Math.round(p * 100)}%`}
        </p>
      </div>
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

      <div className="flex w-full flex-col gap-2 rounded-xl bg-bg-muted px-3 pt-4 pb-3">
        <Gauge percent={remaining} empty={pending || !f.fuelDepartActual} />
        <div className="flex w-full items-end justify-between px-1">
          <div>
            <p className="text-xs font-semibold text-fg-muted">On board</p>
            <p className="text-xl leading-6 font-bold text-fg-primary">{fmt(f.fuelOnBoard)}</p>
          </div>
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
