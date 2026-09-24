import { Radar, Search } from 'lucide-react'
import { useState } from 'react'
import { useMapSelection } from '../../context/MapSelectionContext'
import { firRegions } from '../../data/firRegions'
import { CollapsibleCard } from '../ui/Card'
import { Switch } from '../ui/Switch'

export function AirSpaceCard({ defaultOpen = false }: { defaultOpen?: boolean }) {
  const [overlay, setOverlay] = useState(true)
  const { selectedFirId, setSelectedFirId } = useMapSelection()

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
        {firRegions.map((r) => {
          const active = selectedFirId === r.id
          return (
            <button
              key={r.id}
              type="button"
              onClick={() => setSelectedFirId(active ? null : r.id)}
              className={`flex h-12 w-full shrink-0 items-center justify-between rounded-2xl px-4 text-left transition-colors ${
                active
                  ? 'bg-fg-secondary text-white'
                  : 'bg-bg-muted text-fg-secondary hover:bg-bg-tertiary'
              }`}
            >
              <p className="text-sm font-semibold">{r.name}</p>
              <p className={`text-sm ${active ? 'text-white/80' : 'text-fg-muted'}`}>
                {r.count} flights
              </p>
            </button>
          )
        })}
      </div>
    </CollapsibleCard>
  )
}
