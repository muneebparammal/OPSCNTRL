import { icons } from '../ui/Icon'
import { CollapsibleCard, FieldPair } from '../ui/Card'

export function HubActivityCard({ defaultOpen = false }: { defaultOpen?: boolean }) {
  return (
    <CollapsibleCard icon={icons.server} title="Hub Activity" defaultOpen={defaultOpen}>
      <FieldPair
        items={[
          ['ON GROUND', '38'],
          ['GATES OCCUPIED', '24 / 32'],
        ]}
      />
    </CollapsibleCard>
  )
}

export function CrewComplementCard({ defaultOpen = false }: { defaultOpen?: boolean }) {
  return (
    <CollapsibleCard icon={icons.users} title="Crew Complement" defaultOpen={defaultOpen}>
      <FieldPair
        items={[
          ['COCKPIT', '4'],
          ['CABIN', '18'],
        ]}
      />
    </CollapsibleCard>
  )
}
