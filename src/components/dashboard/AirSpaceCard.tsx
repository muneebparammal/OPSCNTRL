import { Radar, Search } from 'lucide-react'
import { useState } from 'react'
import { CollapsibleCard } from '../ui/Card'
import { Switch } from '../ui/Switch'

const firRegions = [
  { name: 'OMAE FIR', count: 42 },
  { name: 'OEJD FIR', count: 31 },
  { name: 'OOMM FIR', count: 18 },
  { name: 'OIIX FIR', count: 27 },
  { name: 'OPKC FIR', count: 15 },
  { name: 'VABF FIR', count: 22 },
]

export function AirSpaceCard({ defaultOpen = false }: { defaultOpen?: boolean }) {
  const [overlay, setOverlay] = useState(true)

  return (
    <CollapsibleCard icon={Radar} title="Air Space" defaultOpen={defaultOpen}>
      <div className="flex h-9 w-full items-center gap-2 rounded-full border border-border-input bg-white px-3 py-1 shadow-xs">
        <Search size={16} className="shrink-0 text-fg-muted" />
        <input
          type="text"
          placeholder="Search FIR"
          className="w-full bg-transparent text-sm font-medium text-fg-secondary placeholder:text-fg-muted focus:outline-none"
        />
      </div>
      <div className="flex w-full items-center gap-2 py-1">
        <p className="text-sm font-semibold text-fg-secondary">FIR</p>
        <button
          type="button"
          className="rounded-full border border-border-primary px-3 py-1 text-xs font-semibold text-fg-secondary"
        >
          All regions
        </button>
        <div className="ml-auto flex items-center gap-2">
          <p className="text-xs font-medium text-fg-muted">Overlay</p>
          <Switch checked={overlay} onChange={setOverlay} label="Overlay" />
        </div>
      </div>
      <div className="flex max-h-[328px] w-full flex-col gap-2 overflow-y-auto">
        {firRegions.map((r) => (
          <div
            key={r.name}
            className="flex h-12 w-full shrink-0 items-center justify-between rounded-2xl bg-bg-muted px-4"
          >
            <p className="text-sm font-semibold text-fg-secondary">{r.name}</p>
            <p className="text-sm text-fg-muted">{r.count} flights</p>
          </div>
        ))}
      </div>
    </CollapsibleCard>
  )
}
