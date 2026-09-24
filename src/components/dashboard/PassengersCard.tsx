import { UserRoundCheck } from 'lucide-react'
import { CollapsibleCard } from '../ui/Card'
import { PillTabs } from '../ui/Tabs'

const stats = [
  { label: 'Booked', value: 115, color: 'text-fg-blue' },
  { label: 'Checked In', value: 119, color: 'text-fg-green' },
  { label: 'Boarded', value: 119, color: 'text-fg-grey-blue' },
]

const cabins = [
  { label: 'First', bkd: 8, chk: 8, brd: 8 },
  { label: 'Business', bkd: 34, chk: 34, brd: 34 },
  { label: 'Premium', bkd: 17, chk: 17, brd: 17 },
  { label: 'Economy', bkd: 56, chk: 60, brd: 60 },
]

export function PassengersCard({ defaultOpen = false }: { defaultOpen?: boolean }) {
  return (
    <CollapsibleCard icon={UserRoundCheck} title="Passengers" defaultOpen={defaultOpen}>
      <PillTabs tabs={['Passengers', 'Connecting']} />
      <div className="flex w-full gap-3">
        {stats.map((s) => (
          <div key={s.label} className="flex flex-1 flex-col items-center gap-2 rounded-lg bg-bg-secondary px-4 py-3">
            <p className={`text-2xl leading-7 font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs font-medium text-fg-tertiary">{s.label}</p>
          </div>
        ))}
      </div>
      <div className="flex w-full flex-col gap-2">
        <div className="flex w-full items-center gap-2 px-4 text-sm font-extrabold text-fg-muted">
          <p className="flex-1">CABIN</p>
          <p className="w-[70px] text-right">BKD</p>
          <p className="w-[70px] text-right">CHK</p>
          <p className="w-[70px] text-right">BRD</p>
        </div>
        <div className="flex w-full flex-col gap-1">
          {cabins.map((c) => (
            <div key={c.label} className="flex w-full items-center gap-2 rounded-2xl bg-bg-muted px-4 py-2.5">
              <p className="flex-1 text-sm font-medium text-fg-muted">{c.label}</p>
              <p className="w-[70px] text-right text-sm font-semibold text-fg-blue">{c.bkd}</p>
              <p className="w-[70px] text-right text-sm font-semibold text-fg-green">{c.chk}</p>
              <p className="w-[70px] text-right text-sm font-semibold text-fg-grey-blue-chart">{c.brd}</p>
            </div>
          ))}
        </div>
      </div>
    </CollapsibleCard>
  )
}
