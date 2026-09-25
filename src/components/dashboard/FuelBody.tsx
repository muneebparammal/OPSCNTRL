import { Fuel, Weight } from 'lucide-react'
import { useState } from 'react'
import type { FuelStatus } from '../../data/fuelStatus'
import { FuelFillIcon } from './FuelFillIcon'
import { Gauge } from './FuelParts'
import { TakeoffWeightBar } from './TakeoffWeightBar'

export type FuelProps = {
  f: FuelStatus
  unit: 'KG' | 'LT'
  num: (kg: number) => string
  fmt: (kg: number) => string
  pending: boolean
  remaining: number
}

const MTOW = 575000
const BLUE = 'var(--color-fg-blue)'
const GREEN = 'var(--color-fg-green)'
const ORANGE = '#f08c00'
const GREY = 'var(--color-fg-grey-blue-chart)'

function FillTile({
  label,
  value,
  unit,
  percent,
  note,
  color,
}: {
  label: string
  value: string
  unit: string
  percent: number
  note: string
  color: string
}) {
  return (
    <div className="flex min-w-0 items-center gap-2.5 rounded-2xl bg-bg-secondary px-3 py-2.5">
      <FuelFillIcon percent={percent} color={color} />
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-extrabold whitespace-nowrap text-fg-muted">{label}</p>
        <p className="text-base leading-5 font-bold text-fg-primary">
          {value} <span className="text-[11px] font-medium text-fg-muted">{unit}</span>
        </p>
        <p className="text-[11px] font-semibold whitespace-nowrap text-fg-tertiary">
          {Math.round(percent * 100)}% {note}
        </p>
      </div>
    </div>
  )
}

// Arrival fuel and the planned reserve belong together: on landing, arrival
// fuel should not be below the reserve the plan left after the burn.
function ArrivalReserveTile({
  arrived,
  reserve,
  plannedFuel,
  num,
  unit,
}: {
  arrived: number
  reserve: number
  plannedFuel: number
  num: (kg: number) => string
  unit: string
}) {
  const landed = arrived > 0
  const diff = arrived - reserve
  const pct = reserve ? Math.min(1, arrived / reserve) : 0
  const color = !landed ? GREY : diff >= 0 ? GREEN : 'var(--color-fg-red)'
  const status = !landed
    ? { text: 'Awaiting landing', cls: 'bg-bg-tertiary text-fg-tertiary' }
    : diff >= 0
      ? { text: `+${num(diff)} ${unit} above reserve`, cls: 'bg-bg-green-subtle text-fg-green' }
      : { text: `${num(-diff)} ${unit} below reserve`, cls: 'bg-bg-red-subtle text-fg-red' }
  return (
    <div className="flex w-full flex-col gap-2 border-t border-border-primary pt-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-extrabold tracking-wide text-fg-muted uppercase">
          Arrival vs reserve
        </p>
        <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${status.cls}`}>
          {status.text}
        </span>
      </div>
      <div className="flex items-center gap-3 px-1">
        <FuelFillIcon percent={pct} color={color} size={30} />
        <div className="grid flex-1 grid-cols-2 gap-x-4">
          <div>
            <p className="text-[11px] font-semibold text-fg-muted">Arrived with</p>
            <p className="text-base leading-5 font-bold text-fg-primary">
              {num(arrived)} <span className="text-[11px] font-medium text-fg-muted">{unit}</span>
            </p>
          </div>
          <div>
            <p className="text-[11px] font-semibold text-fg-muted">
              Planned reserve · {Math.round(plannedFuel ? (reserve / plannedFuel) * 100 : 0)}%
            </p>
            <p className="text-base leading-5 font-bold text-fg-primary">
              {num(reserve)} <span className="text-[11px] font-medium text-fg-muted">{unit}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export function FuelBody({ f, unit, num, fmt, pending, remaining }: FuelProps) {
  const [tab, setTab] = useState<'Fuel' | 'Weight'>('Fuel')
  const ratio = (a: number, b: number) => (b ? a / b : 0)
  const reserve = f.plannedFuel - f.plannedBurn

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
          <div className="grid grid-cols-2 gap-2">
            <FillTile
              label="PLANNED FUEL"
              value={num(f.plannedFuel)}
              unit={unit}
              percent={f.plannedFuel ? 1 : 0}
              note="of plan"
              color={GREY}
            />
            <FillTile
              label="PLANNED BURN"
              value={num(f.plannedBurn)}
              unit={unit}
              percent={ratio(f.plannedBurn, f.plannedFuel)}
              note="of planned fuel"
              color={ORANGE}
            />
            <FillTile
              label="DEPARTED WITH"
              value={num(f.fuelDepartActual)}
              unit={unit}
              percent={ratio(f.fuelDepartActual, f.plannedFuel)}
              note="of plan"
              color={BLUE}
            />
            <FillTile
              label="ON BOARD"
              value={num(f.fuelOnBoard)}
              unit={unit}
              percent={ratio(f.fuelOnBoard, f.fuelDepartActual)}
              note="of departure"
              color={GREEN}
            />
          </div>
          <ArrivalReserveTile
            arrived={f.fuelArriveActual}
            reserve={reserve}
            plannedFuel={f.plannedFuel}
            num={num}
            unit={unit}
          />
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
