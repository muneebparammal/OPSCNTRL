import { Fuel } from 'lucide-react'
import { Chip } from '../ui/Badge'

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

export function Gauge({ percent, empty }: { percent: number; empty: boolean }) {
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

export function Delta({ actual, planned }: { actual: number; planned: number }) {
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

export function StatCard({
  label,
  value,
  unit,
  badge,
}: {
  label: string
  value: string
  unit: string
  badge?: React.ReactNode
}) {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-2 rounded-2xl bg-bg-secondary px-3 py-3">
      <p className="text-xs font-extrabold whitespace-nowrap text-fg-secondary">{label}</p>
      <div className="flex items-end gap-1 text-fg-secondary">
        <p className="text-xl leading-6 font-bold">{value}</p>
        <p className="pb-0.5 text-xs tracking-[0.24px]">{unit}</p>
      </div>
      <div className="flex min-h-5 items-center">{badge}</div>
    </div>
  )
}
