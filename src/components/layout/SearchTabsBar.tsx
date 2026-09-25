import { Bookmark, Layers, PanelRight, Search, Settings } from 'lucide-react'
import { useState } from 'react'
import type { MapStyleId } from './MapCanvas'
import { MapTypeDropdown } from '../ui/MapTypeDropdown'
import { PillTabs } from '../ui/Tabs'

export function SearchTabsBar({
  narrow = false,
  mapTypeDefaultOpen = false,
  detailPanelActive = false,
  onToggleDetailPanel,
  mapType,
  onMapTypeChange,
}: {
  narrow?: boolean
  mapTypeDefaultOpen?: boolean
  detailPanelActive?: boolean
  onToggleDetailPanel?: () => void
  mapType: MapStyleId
  onMapTypeChange: (id: MapStyleId) => void
}) {
  const [showMapType, setShowMapType] = useState(mapTypeDefaultOpen)

  return (
    <div className="flex w-full items-start justify-between px-6">
      <div
        className={`flex min-w-0 items-center gap-2 ${narrow ? 'max-w-[800px]' : 'max-w-[928.5px]'}`}
      >
        <div className="flex min-w-[120px] flex-1 flex-col gap-2">
          <div className="flex h-9 items-center gap-2 rounded-full border border-border-input bg-white px-3 py-1 shadow-xs">
            <Search size={16} className="shrink-0 text-fg-muted" />
            <input
              type="text"
              placeholder="Search aircraft, flights, route"
              className="w-full min-w-0 bg-transparent text-sm font-medium text-fg-secondary placeholder:text-fg-muted focus:outline-none"
            />
          </div>
        </div>
        <PillTabs tabs={['All Flights', 'Arrival', 'Departure']} className="shrink-0" />
        <PillTabs tabs={['ALL', 'DXB', 'DWC']} className="shrink-0" />
      </div>
      <div className="relative">
        <div className="flex h-9 w-[168px] items-center rounded-full bg-bg-secondary p-1">
          <button
            type="button"
            aria-label="Settings"
            className="flex h-7 flex-1 items-center justify-center rounded-full text-fg-secondary"
          >
            <Settings size={16} />
          </button>
          <button
            type="button"
            aria-label="Bookmarks"
            className="flex h-7 flex-1 items-center justify-center rounded-full text-fg-secondary"
          >
            <Bookmark size={16} />
          </button>
          <button
            type="button"
            aria-label="Map layers"
            onClick={() => setShowMapType((v) => !v)}
            className="flex h-7 flex-1 items-center justify-center rounded-full text-fg-secondary"
          >
            <Layers size={16} />
          </button>
          <button
            type="button"
            aria-label="Toggle detail panel"
            aria-pressed={detailPanelActive}
            onClick={onToggleDetailPanel}
            className={`flex h-7 flex-1 items-center justify-center rounded-full text-fg-secondary ${
              detailPanelActive ? 'bg-bg-primary shadow-sm' : ''
            }`}
          >
            <PanelRight size={16} />
          </button>
        </div>
        {showMapType && (
          <div className="absolute top-11 right-0 z-30">
            <MapTypeDropdown mapType={mapType} onMapTypeChange={onMapTypeChange} />
          </div>
        )}
      </div>
    </div>
  )
}
