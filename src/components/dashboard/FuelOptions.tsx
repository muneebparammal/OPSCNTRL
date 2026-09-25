import { Fuel, Weight } from 'lucide-react'
import { useState } from 'react'
import type { FuelStatus } from '../../data/fuelStatus'
import { Separator } from '../ui/Card'
import { icons } from '../ui/Icon'
import { Delta, Gauge, StatCard } from './FuelParts'
import { TakeoffWeightBar } from './TakeoffWeightBar'

export type FuelProps = {
  f: FuelStatus
  unit: 'KG' | 'LT'
  num: (kg: number) => string
  fmt: (kg: number) => string
  pending: boolean
  remaining: number
  burned: number
}

const BLUE = 'var(--color-fg-blue)'
const GREY = 'var(--color-fg-grey-blue-chart)'
const MTOW = 575000

// A — meter + tiles + MTOW bar (the current consolidated card).
export function OptionA(p: FuelProps) {
  const { f, unit, num, fmt, pending, remaining, burned } = p
  return (
    <>
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
      <div className="flex w-full gap-2">
        <StatCard label="Planned fuel" value={num(f.plannedFuel)} unit={unit} />
        <StatCard
          label="Departed with"
          value={num(f.fuelDepartActual)}
          unit={unit}
          badge={<Delta actual={f.fuelDepartActual} planned={f.plannedFuel} />}
        />
        <StatCard label="Planned burn" value={num(f.plannedBurn)} unit={unit} />
      </div>
      <div className="flex w-full gap-2">
        <StatCard label="Arrived with" value={num(f.fuelArriveActual)} unit={unit} />
        <StatCard
          label="Zero-fuel weight"
          value={num(f.zfwActual)}
          unit={unit}
          badge={<span className="text-[11px] text-fg-muted">est {num(f.zfwEstimate)}</span>}
        />
      </div>
      <TakeoffWeightBar
        towAct={f.towActual}
        towEst={f.towEstimate}
        mtow={MTOW}
        num={num}
        unit={unit}
      />
    </>
  )
}

// B — Ledger: one text-first statement, no boxes.
export function OptionB({ f, unit, num, pending, remaining }: FuelProps) {
  const line = (
    label: string,
    value: string,
    opts: { est?: string; bold?: boolean; badge?: React.ReactNode } = {},
  ) => (
    <div className="flex items-baseline gap-2">
      <span
        className={`text-sm ${opts.bold ? 'font-bold text-fg-primary' : 'font-medium text-fg-secondary'}`}
      >
        {label}
      </span>
      <span className="flex-1 translate-y-[-3px] border-b border-dotted border-fg-muted/50" />
      {opts.badge}
      {opts.est && <span className="text-xs text-fg-muted">est {opts.est}</span>}
      <span
        className={`min-w-[72px] text-right text-sm ${opts.bold ? 'font-bold' : 'font-semibold'} text-fg-primary`}
      >
        {value}
      </span>
    </div>
  )
  const head = (t: string) => (
    <p className="pt-1 text-[11px] font-extrabold tracking-wide text-fg-muted uppercase">{t}</p>
  )
  return (
    <div className="flex w-full flex-col gap-1.5">
      <div className="flex items-end justify-between">
        <p className="text-2xl leading-7 font-bold text-fg-primary">
          {pending ? '—' : `${Math.round(remaining * 100)}%`}
          <span className="ml-1 text-xs font-medium text-fg-muted">fuel remaining</span>
        </p>
        <p className="text-xs font-semibold text-fg-muted">{unit}</p>
      </div>
      <Separator />
      {head('Fuel')}
      {line('Planned fuel', num(f.plannedFuel))}
      {line('Planned burn', num(f.plannedBurn))}
      {line('Departed with', num(f.fuelDepartActual), {
        badge: <Delta actual={f.fuelDepartActual} planned={f.plannedFuel} />,
      })}
      {line('On board', num(f.fuelOnBoard), { bold: true })}
      {line('Arrived with', num(f.fuelArriveActual))}
      {head('Weights')}
      {line('Zero-fuel weight', num(f.zfwActual), { est: num(f.zfwEstimate) })}
      {line('Take-off weight (TOW)', num(f.towActual), { est: num(f.towEstimate), bold: true })}
      {line('MTOW', num(MTOW))}
    </div>
  )
}

// C — KPI mosaic: every figure a tile with a tiny bar for context.
export function OptionC({ f, unit, num, remaining }: FuelProps) {
  const tile = (label: string, value: number, of: number, color: string, note?: string) => (
    <div className="flex min-w-0 flex-col gap-1.5 rounded-2xl bg-bg-secondary px-3 py-2.5">
      <p className="text-[11px] font-extrabold whitespace-nowrap text-fg-muted">{label}</p>
      <p className="text-lg leading-5 font-bold text-fg-primary">
        {num(value)} <span className="text-[11px] font-medium text-fg-muted">{unit}</span>
      </p>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-bg-tertiary">
        <div
          className="h-full rounded-full"
          style={{ width: `${of ? Math.min(100, (value / of) * 100) : 0}%`, background: color }}
        />
      </div>
      <p className="text-[11px] text-fg-muted">{note ?? ' '}</p>
    </div>
  )
  const maxFuel = Math.max(f.plannedFuel, f.fuelDepartActual, 1)
  return (
    <div className="flex w-full flex-col gap-2">
      <div className="grid grid-cols-2 gap-2">
        {tile(
          'ON BOARD',
          f.fuelOnBoard,
          f.fuelDepartActual,
          'var(--color-fg-green)',
          `${Math.round(remaining * 100)}% of departure fuel`,
        )}
        {tile('DEPARTED WITH', f.fuelDepartActual, maxFuel, BLUE, `plan ${num(f.plannedFuel)}`)}
        {tile('PLANNED FUEL', f.plannedFuel, maxFuel, GREY)}
        {tile('PLANNED BURN', f.plannedBurn, f.plannedFuel, '#f08c00', 'of planned fuel')}
        {tile('ARRIVED WITH', f.fuelArriveActual, maxFuel, BLUE)}
        {tile('ZERO-FUEL WT', f.zfwActual, f.towActual, GREY, `est ${num(f.zfwEstimate)}`)}
      </div>
      {tile(
        'TAKE-OFF WT (TOW)',
        f.towActual,
        MTOW,
        'var(--color-fg-green)',
        `est ${num(f.towEstimate)} · MTOW ${num(MTOW)}`,
      )}
    </div>
  )
}

// D — Flight-phase columns: fuel at each stage, then weights as a line pair.
export function OptionD({ f, unit, num }: FuelProps) {
  const cols = [
    { label: 'Planned', v: f.plannedFuel, c: GREY },
    { label: 'Departed', v: f.fuelDepartActual, c: BLUE },
    { label: 'On board', v: f.fuelOnBoard, c: 'var(--color-fg-green)' },
    { label: 'Arrived', v: f.fuelArriveActual, c: '#f08c00' },
  ]
  const max = Math.max(...cols.map((c) => c.v), 1)
  const H = 84
  return (
    <div className="flex w-full flex-col gap-3">
      <div className="flex items-end justify-between px-1">
        <p className="text-xs font-extrabold tracking-wide text-fg-muted uppercase">
          Fuel by stage
        </p>
        <p className="text-[11px] font-semibold text-fg-muted">{unit}</p>
      </div>
      <div className="flex w-full items-end gap-3 px-1" style={{ height: H + 34 }}>
        {cols.map((c) => (
          <div key={c.label} className="flex flex-1 flex-col items-center gap-1">
            <p className="text-[11px] font-bold text-fg-primary">{num(c.v)}</p>
            <div
              className="w-full rounded-t-lg"
              style={{ height: Math.max(3, (c.v / max) * H), background: c.c }}
            />
            <p className="text-[11px] font-semibold text-fg-muted">{c.label}</p>
          </div>
        ))}
      </div>
      <Separator />
      <div className="grid grid-cols-[auto_1fr_auto_auto] items-center gap-x-3 gap-y-1.5 px-1 text-sm">
        <Weight size={14} className="text-fg-muted" />
        <span className="font-medium text-fg-secondary">Zero-fuel weight</span>
        <span className="text-xs text-fg-muted">est {num(f.zfwEstimate)}</span>
        <span className="font-bold text-fg-primary">{num(f.zfwActual)}</span>
        <icons.takeoff size={14} className="text-fg-muted" />
        <span className="font-medium text-fg-secondary">Take-off weight (TOW)</span>
        <span className="text-xs text-fg-muted">est {num(f.towEstimate)}</span>
        <span className="font-bold text-fg-primary">{num(f.towActual)}</span>
      </div>
    </div>
  )
}

// E — Focused: a Fuel | Weight switch, one clear view at a time.
export function OptionE(p: FuelProps) {
  const [tab, setTab] = useState<'Fuel' | 'Weight'>('Fuel')
  const { f, unit, num, fmt, pending, remaining } = p
  return (
    <div className="flex w-full flex-col gap-3">
      <div className="flex h-9 items-center rounded-full bg-bg-secondary p-1">
        {(['Fuel', 'Weight'] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`flex h-7 flex-1 items-center justify-center gap-1.5 rounded-full text-sm font-semibold text-fg-secondary ${
              tab === t ? 'bg-bg-primary shadow-sm' : ''
            }`}
          >
            {t === 'Fuel' ? <Fuel size={14} /> : <Weight size={14} />}
            {t}
          </button>
        ))}
      </div>
      {tab === 'Fuel' ? (
        <>
          <div className="flex w-full flex-col gap-2 rounded-xl bg-bg-muted px-3 pt-4 pb-3">
            <Gauge percent={remaining} empty={pending || !f.fuelDepartActual} />
            <p className="px-1 text-center text-sm font-bold text-fg-primary">
              {fmt(f.fuelOnBoard)} on board
            </p>
          </div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-2 px-1 text-sm">
            {[
              ['Planned fuel', f.plannedFuel],
              ['Planned burn', f.plannedBurn],
              ['Departed with', f.fuelDepartActual],
              ['Arrived with', f.fuelArriveActual],
            ].map(([l, v]) => (
              <div
                key={l as string}
                className="flex items-baseline justify-between border-b border-border-primary pb-1"
              >
                <span className="text-xs font-semibold text-fg-muted">{l}</span>
                <span className="font-bold text-fg-primary">{num(v as number)}</span>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <TakeoffWeightBar
            towAct={f.towActual}
            towEst={f.towEstimate}
            mtow={MTOW}
            num={num}
            unit={unit}
          />
          <div className="grid grid-cols-[1fr_auto_auto] gap-x-4 gap-y-1 px-1 text-sm">
            <span />
            <span className="text-right text-[11px] font-extrabold text-fg-muted">EST</span>
            <span className="text-right text-[11px] font-extrabold text-fg-muted">ACT</span>
            <span className="text-xs font-semibold text-fg-muted">Zero-fuel weight</span>
            <span className="text-right text-fg-tertiary">{num(f.zfwEstimate)}</span>
            <span className="text-right font-bold text-fg-primary">{num(f.zfwActual)}</span>
            <span className="text-xs font-semibold text-fg-muted">Take-off weight</span>
            <span className="text-right text-fg-tertiary">{num(f.towEstimate)}</span>
            <span className="text-right font-bold text-fg-primary">{num(f.towActual)}</span>
          </div>
        </>
      )}
    </div>
  )
}

export const FUEL_OPTIONS = [
  { id: 'A', name: 'Meter + tiles', Component: OptionA },
  { id: 'B', name: 'Ledger', Component: OptionB },
  { id: 'C', name: 'KPI mosaic', Component: OptionC },
  { id: 'D', name: 'Stage columns', Component: OptionD },
  { id: 'E', name: 'Fuel | Weight', Component: OptionE },
] as const
