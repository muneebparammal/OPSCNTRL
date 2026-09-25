import { Fuel, Weight } from 'lucide-react'
import { icons } from '../ui/Icon'

// Five alternative treatments of the weight data, for review. Values are KG
// internally; `num` formats in the selected unit.
type W = {
  zfwAct: number
  zfwEst: number
  fuelAct: number
  fuelEst: number
  towAct: number
  towEst: number
  mtow: number
  num: (kg: number) => string
  unit: string
}

const BLUE = 'var(--color-fg-blue)'
const GREY = 'var(--color-fg-grey-blue-chart)'

function Concept({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <div className="flex w-full flex-col gap-2 border-t border-dashed border-border-primary pt-3">
      <p className="text-[11px] font-extrabold tracking-wide text-fg-muted uppercase">
        Concept {n} · {title}
      </p>
      {children}
    </div>
  )
}

// 1. Dumbbell: estimate (hollow) vs actual (filled) on a shared track.
function Dumbbell({ w }: { w: W }) {
  const rows = [
    { label: 'Zero-fuel', est: w.zfwEst, act: w.zfwAct, icon: Weight },
    { label: 'Fuel', est: w.fuelEst, act: w.fuelAct, icon: Fuel },
    { label: 'Take-off', est: w.towEst, act: w.towAct, icon: icons.takeoff },
  ]
  return (
    <div className="flex w-full flex-col gap-3">
      {rows.map((r) => {
        const max = Math.max(r.est, r.act, 1) * 1.15
        const lo = Math.min(r.est, r.act)
        const hi = Math.max(r.est, r.act)
        const diff = r.act - r.est
        return (
          <div key={r.label} className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-xs">
              <r.icon size={14} className="text-fg-muted" />
              <p className="flex-1 font-semibold text-fg-secondary">{r.label}</p>
              <p className="font-bold text-fg-primary">
                {w.num(r.act)} <span className="font-medium text-fg-muted">{w.unit}</span>
              </p>
              <p
                className={`w-14 text-right font-semibold ${diff > 0 ? 'text-fg-red' : 'text-fg-green'}`}
              >
                {diff > 0 ? '+' : ''}
                {w.num(diff)}
              </p>
            </div>
            <div className="relative h-3 w-full">
              <div className="absolute top-1/2 h-0.5 w-full -translate-y-1/2 rounded bg-bg-tertiary" />
              <div
                className="absolute top-1/2 h-1 -translate-y-1/2 rounded bg-fg-blue/40"
                style={{ left: `${(lo / max) * 100}%`, width: `${((hi - lo) / max) * 100}%` }}
              />
              <span
                className="absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 bg-bg-primary"
                style={{ left: `${(r.est / max) * 100}%`, borderColor: GREY }}
              />
              <span
                className="absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{ left: `${(r.act / max) * 100}%`, background: BLUE }}
              />
            </div>
          </div>
        )
      })}
      <p className="text-[11px] text-fg-muted">○ estimate · ● actual · number = difference</p>
    </div>
  )
}

// 2. Take-off weight against the aircraft's maximum (MTOW) with headroom.
function MtowBar({ w }: { w: W }) {
  const pct = Math.min(1, w.towAct / w.mtow)
  const headroom = w.mtow - w.towAct
  const color = pct > 0.97 ? 'var(--color-fg-red)' : pct > 0.9 ? '#f08c00' : 'var(--color-fg-green)'
  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex items-end justify-between">
        <p className="text-xl leading-6 font-bold text-fg-primary">
          {Math.round(pct * 100)}%
          <span className="ml-1 text-xs font-medium text-fg-muted">of MTOW</span>
        </p>
        <p className="text-xs font-semibold text-fg-muted">
          Headroom{' '}
          <span className="text-fg-primary">
            {w.num(headroom)} {w.unit}
          </span>
        </p>
      </div>
      <div className="relative h-3 w-full overflow-hidden rounded-full bg-bg-secondary">
        <div
          className="h-full rounded-full"
          style={{ width: `${pct * 100}%`, background: color }}
        />
        <span
          className="absolute top-0 h-full w-0.5 bg-fg-primary/60"
          style={{ left: `${Math.min(100, (w.towEst / w.mtow) * 100)}%` }}
        />
      </div>
      <div className="flex justify-between text-[11px] font-semibold text-fg-muted">
        <span>0</span>
        <span>| est {w.num(w.towEst)}</span>
        <span>MTOW {w.num(w.mtow)}</span>
      </div>
    </div>
  )
}

// 3. Ledger: text-only rows with dotted leaders and a totals rule.
function Ledger({ w }: { w: W }) {
  const line = (label: string, act: number, est: number, bold = false) => (
    <div className="flex items-baseline gap-2">
      <span
        className={`text-sm ${bold ? 'font-bold text-fg-primary' : 'font-medium text-fg-secondary'}`}
      >
        {label}
      </span>
      <span className="flex-1 border-b border-dotted border-fg-muted/50" />
      <span className="w-16 text-right text-xs text-fg-muted">{w.num(est)}</span>
      <span
        className={`w-16 text-right text-sm ${bold ? 'font-bold' : 'font-semibold'} text-fg-primary`}
      >
        {w.num(act)}
      </span>
    </div>
  )
  return (
    <div className="flex w-full flex-col gap-1.5">
      <div className="flex justify-end gap-2 text-[11px] font-extrabold text-fg-muted">
        <span className="w-16 text-right">EST</span>
        <span className="w-16 text-right">ACT · {w.unit}</span>
      </div>
      {line('Zero-fuel weight', w.zfwAct, w.zfwEst)}
      {line('+ Fuel at departure', w.fuelAct, w.fuelEst)}
      <div className="border-t border-fg-primary/70" />
      {line('= Take-off weight', w.towAct, w.towEst, true)}
    </div>
  )
}

// 4. Waterfall: ZFW and fuel stack into TOW; a tick marks the estimate.
function Waterfall({ w }: { w: W }) {
  const H = 96
  const max = Math.max(w.towAct, w.towEst, 1) * 1.05
  const y = (v: number) => H - (v / max) * H
  const bars = [
    { x: 8, from: 0, to: w.zfwAct, fill: GREY, label: 'Zero-fuel', v: w.zfwAct },
    { x: 80, from: w.zfwAct, to: w.zfwAct + w.fuelAct, fill: BLUE, label: 'Fuel', v: w.fuelAct },
    {
      x: 152,
      from: 0,
      to: w.towAct,
      fill: 'var(--color-fg-secondary)',
      label: 'Take-off',
      v: w.towAct,
    },
  ]
  return (
    <svg viewBox={`0 0 232 ${H + 34}`} className="w-full">
      {bars.map((b) => (
        <g key={b.label}>
          <rect
            x={b.x}
            y={y(b.to) + 14}
            width="64"
            height={y(b.from) - y(b.to)}
            rx="4"
            fill={b.fill}
          />
          <text
            x={b.x + 32}
            y={y(b.to) + 9}
            textAnchor="middle"
            fontSize="10"
            fontWeight="700"
            fill="var(--color-fg-primary)"
          >
            {w.num(b.v)}
          </text>
          <text
            x={b.x + 32}
            y={H + 28}
            textAnchor="middle"
            fontSize="10"
            fontWeight="600"
            fill="var(--color-fg-muted)"
          >
            {b.label}
          </text>
        </g>
      ))}
      <line
        x1="72"
        x2="80"
        y1={y(w.zfwAct) + 14}
        y2={y(w.zfwAct) + 14}
        stroke="var(--color-fg-muted)"
        strokeDasharray="2 2"
      />
      <line
        x1="144"
        x2="152"
        y1={y(w.towAct) + 14}
        y2={y(w.towAct) + 14}
        stroke="var(--color-fg-muted)"
        strokeDasharray="2 2"
      />
      <line
        x1="148"
        x2="220"
        y1={y(w.towEst) + 14}
        y2={y(w.towEst) + 14}
        stroke="var(--color-brand-ek)"
        strokeWidth="1.5"
        strokeDasharray="4 3"
      />
      <text
        x="222"
        y={y(w.towEst) + 12}
        fontSize="8"
        fontWeight="700"
        fill="var(--color-brand-ek)"
        textAnchor="end"
      >
        est
      </text>
    </svg>
  )
}

// 5. Composition donut: how take-off weight splits between airframe/payload and fuel.
function Composition({ w }: { w: W }) {
  const r = 34
  const c = 2 * Math.PI * r
  const fuelShare = w.towAct ? w.fuelAct / w.towAct : 0
  return (
    <div className="flex w-full items-center gap-4">
      <div className="relative size-[96px] shrink-0">
        <svg viewBox="0 0 100 100" className="size-full -rotate-90">
          <circle cx="50" cy="50" r={r} fill="none" stroke={GREY} strokeWidth="14" />
          <circle
            cx="50"
            cy="50"
            r={r}
            fill="none"
            stroke={BLUE}
            strokeWidth="14"
            strokeDasharray={`${c * fuelShare} ${c}`}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-sm leading-4 font-bold text-fg-primary">
            {Math.round(fuelShare * 100)}%
          </p>
          <p className="text-[10px] font-semibold text-fg-muted">fuel</p>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="size-2.5 rounded-full" style={{ background: GREY }} />
          <span className="flex-1 font-medium text-fg-secondary">Zero-fuel</span>
          <span className="font-bold text-fg-primary">{w.num(w.zfwAct)}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="size-2.5 rounded-full" style={{ background: BLUE }} />
          <span className="flex-1 font-medium text-fg-secondary">Fuel</span>
          <span className="font-bold text-fg-primary">{w.num(w.fuelAct)}</span>
        </div>
        <div className="flex items-center gap-2 border-t border-border-primary pt-2">
          <span className="size-2.5" />
          <span className="flex-1 font-semibold text-fg-primary">Take-off</span>
          <span className="font-bold text-fg-primary">
            {w.num(w.towAct)} {w.unit}
          </span>
        </div>
      </div>
    </div>
  )
}

export function WeightConcepts(props: W) {
  return (
    <>
      <Concept n={1} title="Estimate vs actual dumbbell">
        <Dumbbell w={props} />
      </Concept>
      <Concept n={2} title="Take-off vs MTOW">
        <MtowBar w={props} />
      </Concept>
      <Concept n={3} title="Ledger">
        <Ledger w={props} />
      </Concept>
      <Concept n={4} title="Waterfall">
        <Waterfall w={props} />
      </Concept>
      <Concept n={5} title="Composition donut">
        <Composition w={props} />
      </Concept>
    </>
  )
}
