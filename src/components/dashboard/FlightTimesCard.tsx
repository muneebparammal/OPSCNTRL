import { Clock4, PlaneLanding, PlaneTakeoff } from 'lucide-react'
import { CollapsibleCard } from '../ui/Card'

type TimeRow = {
  icon: React.ElementType
  label: string
  sch: string
  est: string
  act: string
  actColor?: string
}

const rows: TimeRow[] = [
  { icon: PlaneTakeoff, label: 'Departure', sch: '16:43', est: '16:50', act: '16:50', actColor: 'text-fg-green' },
  { icon: PlaneLanding, label: 'Arrival', sch: '06:22', est: '06:30+1', act: '_' },
]

export function FlightTimesCard({ defaultOpen = false }: { defaultOpen?: boolean }) {
  return (
    <CollapsibleCard icon={Clock4} title="Flight Times" defaultOpen={defaultOpen}>
      <div className="flex w-full items-center gap-2 px-4 text-sm text-fg-muted">
        <p className="flex-1 font-medium opacity-0">Departure</p>
        <p className="w-[70px] text-right font-extrabold">SCH</p>
        <p className="w-[70px] text-right font-extrabold">EST</p>
        <p className="w-[70px] text-right font-extrabold">ACT</p>
      </div>
      <div className="flex w-full flex-col gap-1">
        {rows.map((row) => (
          <div key={row.label} className="flex w-full items-center gap-3 rounded-2xl bg-bg-muted px-4 py-2.5">
            <row.icon size={16} className="shrink-0 text-fg-secondary" />
            <p className="flex-1 text-sm font-medium text-fg-muted">{row.label}</p>
            <p className="w-[70px] text-right text-sm font-semibold text-fg-tertiary">{row.sch}</p>
            <p className="w-[70px] text-right text-sm font-semibold text-fg-tertiary">{row.est}</p>
            <p className={`w-[70px] text-right text-sm font-semibold ${row.actColor ?? 'text-fg-tertiary'}`}>
              {row.act}
            </p>
          </div>
        ))}
      </div>
    </CollapsibleCard>
  )
}
