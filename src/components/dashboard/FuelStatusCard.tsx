import { Fuel } from 'lucide-react'
import { getFuelStatus } from '../../data/fuelStatus'
import { Chip } from '../ui/Badge'
import { CollapsibleCard, FieldPair, Separator } from '../ui/Card'
import { displayCallsign } from '../ui/FlightTooltip'

function SubHeading({ children }: { children: string }) {
  return (
    <p className="px-2 text-xs font-extrabold tracking-wide text-fg-muted uppercase">{children}</p>
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
  const kg = (n: number) => `${n.toLocaleString()} ${f.unit}`
  const pending =
    f.fuelDepartActual + f.fuelArriveActual + f.fuelOnBoard + f.towActual + f.zfwActual === 0

  return (
    <CollapsibleCard icon={Fuel} title="Fuel Status" defaultOpen={defaultOpen}>
      <div className="flex flex-wrap items-center gap-2 px-2">
        <p className="text-sm font-bold text-fg-primary">{f.flight}</p>
        {f.dep && f.arr && (
          <p className="text-sm font-semibold text-fg-muted">
            {f.dep} → {f.arr}
          </p>
        )}
        {f.date && <p className="text-sm text-fg-muted">{f.date}</p>}
        <div className="flex-1" />
        <Chip tone={pending ? 'neutral' : 'green'}>{pending ? 'Pending' : 'Populated'}</Chip>
      </div>
      {pending && (
        <p className="rounded-lg bg-bg-orange-inverse px-3 py-2 text-xs font-medium text-fg-tertiary">
          Fuel and weight fields are pending population — the flight may not have departed yet.
        </p>
      )}

      <SubHeading>Actual fuel</SubHeading>
      <FieldPair
        items={[
          ['DEPART', kg(f.fuelDepartActual)],
          ['ARRIVE', kg(f.fuelArriveActual)],
        ]}
      />
      <FieldPair
        items={[
          ['ON BOARD', kg(f.fuelOnBoard)],
          ['ON BOARD (LT)', `${Math.round(f.fuelOnBoard / f.density).toLocaleString()} LT`],
        ]}
      />
      <Separator />
      <SubHeading>Planned fuel</SubHeading>
      <FieldPair
        items={[
          ['PLANNED FUEL', kg(f.plannedFuel)],
          ['PLANNED BURN', kg(f.plannedBurn)],
        ]}
      />
      <Separator />
      <SubHeading>Weights</SubHeading>
      <FieldPair
        items={[
          ['TOW ESTIMATE', kg(f.towEstimate)],
          ['TOW ACTUAL', kg(f.towActual)],
        ]}
      />
      <FieldPair
        items={[
          ['ZFW ESTIMATE', kg(f.zfwEstimate)],
          ['ZFW ACTUAL', kg(f.zfwActual)],
        ]}
      />
      <Separator />
      <FieldPair
        items={[
          ['FUEL UNIT', f.unit],
          ['DENSITY (KG/LT)', String(f.density)],
        ]}
      />
      {f.demo && (
        <p className="px-2 text-xs text-fg-muted">Demo values until a fuel feed is connected.</p>
      )}
    </CollapsibleCard>
  )
}
