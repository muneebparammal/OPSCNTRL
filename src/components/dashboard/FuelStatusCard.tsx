import { Fuel } from 'lucide-react'
import { useState } from 'react'
import { getFuelStatus } from '../../data/fuelStatus'
import { CollapsibleCard, Separator } from '../ui/Card'
import { displayCallsign } from '../ui/FlightTooltip'
import { FUEL_OPTIONS } from './FuelOptions'

type Unit = 'KG' | 'LT'

export function FuelStatusCard({
  callsign,
  defaultOpen = false,
}: {
  callsign: string
  defaultOpen?: boolean
}) {
  const f = getFuelStatus(displayCallsign(callsign))
  const [unit, setUnit] = useState<Unit>('KG')
  const [option, setOption] = useState<(typeof FUEL_OPTIONS)[number]['id']>('A')
  const conv = (kg: number) => (unit === 'KG' ? kg : kg / f.density)
  const num = (kg: number) => Math.round(conv(kg)).toLocaleString()
  const fmt = (kg: number) => `${Math.round(conv(kg)).toLocaleString()} ${unit}`
  const pending =
    f.fuelDepartActual + f.fuelArriveActual + f.fuelOnBoard + f.towActual + f.zfwActual === 0
  const remaining = f.fuelDepartActual ? f.fuelOnBoard / f.fuelDepartActual : 0
  const burned = f.fuelDepartActual ? f.fuelDepartActual - f.fuelOnBoard : 0
  const Active = FUEL_OPTIONS.find((o) => o.id === option)!.Component

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

      <div className="flex w-full flex-col gap-1.5 rounded-xl border border-dashed border-border-primary p-2">
        <p className="px-1 text-[11px] font-extrabold tracking-wide text-fg-muted uppercase">
          Design option · pick one to finalize
        </p>
        <div className="flex flex-wrap gap-1.5">
          {FUEL_OPTIONS.map((o) => (
            <button
              key={o.id}
              type="button"
              aria-pressed={option === o.id}
              onClick={() => setOption(o.id)}
              className={`flex h-7 items-center gap-1.5 rounded-full border px-2.5 text-xs font-semibold ${
                option === o.id
                  ? 'border-inverse bg-inverse text-white'
                  : 'border-border-primary text-fg-secondary'
              }`}
            >
              <span className="font-bold">{o.id}</span>
              {o.name}
            </button>
          ))}
        </div>
      </div>

      {pending && (
        <p className="px-1 text-xs text-fg-muted">
          No fuel or weight data yet — the flight may not have departed.
        </p>
      )}

      <Active
        f={f}
        unit={unit}
        num={num}
        fmt={fmt}
        pending={pending}
        remaining={remaining}
        burned={burned}
      />

      <Separator />
      <p className="px-1 text-[11px] text-fg-muted">
        Density {f.density} KG/LT{f.demo ? ' · demo values' : ''}
      </p>
    </CollapsibleCard>
  )
}
