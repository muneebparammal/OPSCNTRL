import { Server, UsersRound } from 'lucide-react'
import { CollapsibleCard, FieldPair } from '../ui/Card'

export function HubActivityCard({ defaultOpen = false }: { defaultOpen?: boolean }) {
  return (
    <CollapsibleCard icon={Server} title="Hub Activity" defaultOpen={defaultOpen}>
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
    <CollapsibleCard icon={UsersRound} title="Crew Complement" defaultOpen={defaultOpen}>
      <FieldPair
        items={[
          ['COCKPIT', '4'],
          ['CABIN', '18'],
        ]}
      />
    </CollapsibleCard>
  )
}
