import { Plane } from 'lucide-react'
import { Badge } from '../ui/Badge'
import { CollapsibleCard, FieldPair, Separator } from '../ui/Card'

export function AircraftTypeCard({ defaultOpen = false }: { defaultOpen?: boolean }) {
  return (
    <CollapsibleCard icon={Plane} title="Aircraft Type" defaultOpen={defaultOpen}>
      <div className="flex flex-wrap gap-2">
        <Badge>A380</Badge>
        <Badge>B777-300ER</Badge>
        <Badge>B787-9</Badge>
      </div>
    </CollapsibleCard>
  )
}

export function FlightStatusCard({ defaultOpen = false }: { defaultOpen?: boolean }) {
  return (
    <CollapsibleCard icon={Plane} title="Flight Status" defaultOpen={defaultOpen}>
      <div className="flex flex-wrap gap-2">
        <Badge>On Time</Badge>
        <Badge>Delayed</Badge>
        <Badge>Boarding</Badge>
        <Badge>Departed</Badge>
      </div>
    </CollapsibleCard>
  )
}

export function FlightInfoCard({ defaultOpen = true }: { defaultOpen?: boolean }) {
  return (
    <CollapsibleCard icon={Plane} title="Flight Info" defaultOpen={defaultOpen}>
      <FieldPair
        items={[
          ['TAIL', 'A6-ECB'],
          ['AIRCRAFT', 'A6-ECB'],
        ]}
      />
      <Separator />
      <FieldPair
        items={[
          ['BLOCK', '13h 40m'],
          ['DATE', 'Sep 23'],
        ]}
      />
    </CollapsibleCard>
  )
}
