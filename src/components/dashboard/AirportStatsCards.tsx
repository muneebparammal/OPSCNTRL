import { Building2, Plane, Radio, Users } from 'lucide-react'
import type { Airport } from '../../data/airports'
import { CollapsibleCard, FieldPair } from '../ui/Card'

// Deterministic per-airport stats (same airport always shows the same
// numbers) — illustrative operational data, not a live feed.
function seededStats(icao: string) {
  let seed = 0
  for (let i = 0; i < icao.length; i++) seed = (seed * 31 + icao.charCodeAt(i)) & 0x7fffffff
  const rand = (min: number, max: number) => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff
    return min + Math.floor((seed / 0x7fffffff) * (max - min + 1))
  }
  return {
    cockpitCrew: rand(8, 40),
    cabinCrew: rand(30, 160),
    groundStaff: rand(50, 300),
    gatesOccupied: rand(4, 28),
    gatesTotal: rand(28, 60),
    aircraftOnGround: rand(2, 22),
    runwaysActive: rand(1, 4),
    activeFrequency: `${(118 + rand(0, 17)).toFixed(0)}.${rand(0, 9)}${rand(0, 9)} MHz`,
  }
}

export function AirportStatsCards({ airport }: { airport: Airport }) {
  const stats = seededStats(airport.icao)

  return (
    <>
      <CollapsibleCard icon={Users} title="Crew Complement" defaultOpen>
        <FieldPair
          items={[
            ['COCKPIT CREW', String(stats.cockpitCrew)],
            ['CABIN CREW', String(stats.cabinCrew)],
          ]}
        />
        <FieldPair items={[['GROUND STAFF', String(stats.groundStaff)]]} />
      </CollapsibleCard>

      <CollapsibleCard icon={Building2} title="Gates & Stands" defaultOpen>
        <FieldPair
          items={[
            ['GATES OCCUPIED', `${stats.gatesOccupied} / ${stats.gatesTotal}`],
            ['AIRCRAFT ON GROUND', String(stats.aircraftOnGround)],
          ]}
        />
      </CollapsibleCard>

      <CollapsibleCard icon={Plane} title="Runways">
        <FieldPair items={[['ACTIVE RUNWAYS', String(stats.runwaysActive)]]} />
      </CollapsibleCard>

      <CollapsibleCard icon={Radio} title="Tower Frequency">
        <FieldPair items={[['ACTIVE FREQ', stats.activeFrequency]]} />
      </CollapsibleCard>
    </>
  )
}
