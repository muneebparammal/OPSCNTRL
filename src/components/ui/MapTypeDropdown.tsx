import { useState } from 'react'
import type { MapStyleId } from '../layout/MapCanvas'
import { Switch } from './Switch'

const overlays = ['NOTAMs', 'Airport', 'Airspace', 'Country Name']

// Real single-tile previews from the same providers MapCanvas uses (zoom 4,
// tile x=10/y=7 — covers the Gulf/Arabian Peninsula, matching the map's
// default view), instead of flat placeholder color swatches.
const mapTypes = [
  {
    id: 'light',
    label: 'Light',
    thumb: 'https://basemaps.cartocdn.com/light_all/4/10/7.png',
  },
  {
    id: 'dark',
    label: 'Dark',
    thumb: 'https://basemaps.cartocdn.com/dark_all/4/10/7.png',
  },
  {
    id: 'satellite',
    label: 'Satelite',
    thumb: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/4/7/10',
  },
] as const

type MapTypeDropdownProps = {
  mapType: MapStyleId
  onMapTypeChange: (id: MapStyleId) => void
}

export function MapTypeDropdown({ mapType, onMapTypeChange }: MapTypeDropdownProps) {
  const [overlayState, setOverlayState] = useState<Record<string, boolean>>({
    'NOTAMs': false,
    'Airport': false,
    'Airspace': false,
    'Country Name': true,
  })

  return (
    <div className="w-56 overflow-hidden rounded-xl border border-border-primary bg-bg-popover py-1 shadow-popover">
      <div className="flex h-8 w-full items-center px-3 py-1.5">
        <p className="w-full text-sm font-bold text-fg-primary">Overlays</p>
      </div>
      <div className="h-px w-full bg-border-primary" />
      <div className="flex flex-col items-start gap-0 py-2">
        {overlays.map((label) => (
          <div key={label} className="w-full px-1">
            <div className="flex h-[30px] w-full items-center gap-2 rounded-lg px-2 py-[5px]">
              <p className="flex-1 text-sm font-medium text-fg-primary">{label}</p>
              <Switch
                checked={overlayState[label]}
                onChange={(v) => setOverlayState((s) => ({ ...s, [label]: v }))}
                label={label}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="h-px w-full bg-border-primary" />
      <div className="flex flex-col items-center justify-center gap-2.5 p-3">
        <p className="w-full text-sm font-semibold text-fg-primary">Map Type</p>
        <div className="flex w-full items-center gap-2">
          {mapTypes.map((type) => (
            <button
              key={type.id}
              type="button"
              onClick={() => onMapTypeChange(type.id)}
              className="flex flex-1 flex-col items-center gap-1"
            >
              <div
                className={`h-[34px] w-full overflow-hidden rounded-md border p-px ${
                  mapType === type.id ? 'border-fg-secondary' : 'border-transparent'
                }`}
              >
                <img
                  src={type.thumb}
                  alt=""
                  className="size-full rounded-[6px] object-cover"
                  draggable={false}
                />
              </div>
              <p
                className={`w-full text-center text-xs tracking-[0.24px] ${
                  mapType === type.id ? 'font-bold text-fg-primary' : 'font-medium text-fg-tertiary'
                }`}
              >
                {type.label}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
