import { icons } from '../ui/Icon'
import { useState } from 'react'
import { useMapSelection } from '../../context/MapSelectionContext'
import { firRegions } from '../../data/firRegions'
import { CollapsibleCard } from '../ui/Card'
import { Switch } from '../ui/Switch'

export function AirSpaceCard({ defaultOpen = false }: { defaultOpen?: boolean }) {
  const [query, setQuery] = useState('')
  const { selectedFirId, setSelectedFirId, showAllFirLayers, setShowAllFirLayers } =
    useMapSelection()

  const q = query.trim().toLowerCase()
  const filtered = firRegions.filter(
    (r) => r.name.toLowerCase().includes(q) || r.country.toLowerCase().includes(q),
  )

  return (
    <CollapsibleCard icon={icons.airspace} title="Air Space" defaultOpen={defaultOpen}>
      <div className="flex h-9 w-full items-center gap-2 rounded-full border border-border-input bg-white px-3 py-1 shadow-xs">
        <icons.search size={16} className="shrink-0 text-fg-muted" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search FIR or country"
          className="w-full bg-transparent text-sm font-medium text-fg-secondary placeholder:text-fg-muted focus:outline-none"
        />
      </div>
      <div className="flex w-full items-center gap-2 py-1">
        <p className="text-sm font-semibold text-fg-secondary">FIR</p>
        <span className="rounded-full border border-border-primary px-3 py-1 text-xs font-semibold text-fg-secondary">
          {filtered.length} region{filtered.length === 1 ? '' : 's'}
        </span>
        <div className="ml-auto flex items-center gap-2">
          <p className="text-xs font-medium text-fg-muted">Overlay all</p>
          <Switch checked={showAllFirLayers} onChange={setShowAllFirLayers} label="Overlay all FIRs" />
        </div>
      </div>
      <div className="flex max-h-[328px] w-full flex-col gap-2 overflow-y-auto">
        {filtered.map((r) => {
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
              <div className="flex flex-col">
                <p className="text-sm font-semibold">{r.name}</p>
                <p className={`text-xs ${active ? 'text-white/70' : 'text-fg-muted'}`}>
                  {r.country}
                </p>
              </div>
              <p className={`text-sm ${active ? 'text-white/80' : 'text-fg-muted'}`}>
                {r.count} flights
              </p>
            </button>
          )
        })}
        {filtered.length === 0 && (
          <p className="py-4 text-center text-sm text-fg-muted">No FIR matches "{query}"</p>
        )}
      </div>
    </CollapsibleCard>
  )
}
