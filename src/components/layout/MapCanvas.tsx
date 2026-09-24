import 'maplibre-gl/dist/maplibre-gl.css'

import { config as maplibreConfig } from 'maplibre-gl'
// Vite's production bundler doesn't resolve MapLibre's default worker URL
// correctly once everything is bundled together (works in dev, 404s in
// prod). Importing the worker file explicitly with `?worker&url` makes Vite
// emit it as its own real asset with a correct, base-path-aware URL.
import MaplibreWorker from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url'
import { Plane } from 'lucide-react'
import { forwardRef, useImperativeHandle, useMemo, useRef } from 'react'
import Map, { Marker, type MapRef } from 'react-map-gl/maplibre'
import { useLiveFleet } from '../../hooks/useLiveFleet'

maplibreConfig.WORKER_URL = MaplibreWorker

export type MapStyleId = 'light' | 'dark' | 'satellite'

const INITIAL_ZOOM = 3.6

const rasterStyle = (tiles: string[], attribution: string) => ({
  version: 8 as const,
  sources: {
    base: {
      type: 'raster' as const,
      tiles,
      tileSize: 256,
      attribution,
    },
  },
  layers: [{ id: 'base', type: 'raster' as const, source: 'base' }],
})

const mapStyles: Record<MapStyleId, string | ReturnType<typeof rasterStyle>> = {
  light: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
  dark: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
  satellite: rasterStyle(
    [
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    ],
    'Imagery &copy; Esri',
  ),
}

type SimAircraft = {
  lng: number
  lat: number
  heading: number
  color: string
  size: number
}

// Fallback traffic shown while the live feed is connecting or unreachable,
// so the map never looks empty/broken.
function useSimulatedFleet(count: number): SimAircraft[] {
  return useMemo(() => {
    const colors = ['#38bdf8', '#fbbf24', '#e5e7eb']
    let seed = 42
    const rand = () => {
      seed = (seed * 1103515245 + 12345) & 0x7fffffff
      return (seed / 0x7fffffff) % 1
    }
    return Array.from({ length: count }, () => ({
      lng: 20 + rand() * 55,
      lat: 5 + rand() * 33,
      heading: rand() * 360,
      color: colors[Math.floor(rand() * colors.length)],
      size: 14 + rand() * 8,
    }))
  }, [count])
}

function aircraftColor(onGround: boolean, verticalRate: number | null) {
  if (onGround) return '#9ca3af'
  if (verticalRate != null && verticalRate > 1) return '#38bdf8'
  if (verticalRate != null && verticalRate < -1) return '#fbbf24'
  return '#e5e7eb'
}

export type MapCanvasHandle = {
  zoomIn: () => void
  zoomOut: () => void
  resetZoom: () => void
}

type MapCanvasProps = {
  mapType?: MapStyleId
  onZoomChange?: (percent: number) => void
}

export const MapCanvas = forwardRef<MapCanvasHandle, MapCanvasProps>(function MapCanvas(
  { mapType = 'light', onZoomChange },
  ref,
) {
  const { aircraft: liveFleet, status, lastUpdated } = useLiveFleet()
  const simulatedFleet = useSimulatedFleet(70)
  const mapRef = useRef<MapRef>(null)

  useImperativeHandle(ref, () => ({
    zoomIn: () => mapRef.current?.zoomIn(),
    zoomOut: () => mapRef.current?.zoomOut(),
    resetZoom: () => mapRef.current?.flyTo({ zoom: INITIAL_ZOOM }),
  }))

  const showLive = status === 'live' && liveFleet.length > 0

  return (
    <div className="relative h-full w-full overflow-hidden bg-bg-secondary">
      <Map
        ref={mapRef}
        initialViewState={{ longitude: 48, latitude: 20, zoom: INITIAL_ZOOM }}
        mapStyle={mapStyles[mapType]}
        attributionControl={false}
        style={{ width: '100%', height: '100%' }}
        onZoom={(e) =>
          onZoomChange?.(Math.round(2 ** (e.viewState.zoom - INITIAL_ZOOM) * 100))
        }
      >
        {showLive
          ? liveFleet.map((a) => (
              <Marker key={a.id} longitude={a.lng} latitude={a.lat}>
                <div title={`${a.callsign}${a.altitude != null ? ` · FL${Math.round(a.altitude / 30.48)}` : ''}`}>
                  <Plane
                    size={16}
                    style={{
                      transform: `rotate(${a.heading}deg)`,
                      color: aircraftColor(a.onGround, a.verticalRate),
                    }}
                    strokeWidth={2.5}
                  />
                </div>
              </Marker>
            ))
          : simulatedFleet.map((a, i) => (
              <Marker key={i} longitude={a.lng} latitude={a.lat}>
                <Plane
                  size={a.size}
                  style={{ transform: `rotate(${a.heading}deg)`, color: a.color }}
                  strokeWidth={2.5}
                />
              </Marker>
            ))}
      </Map>

      <div className="absolute bottom-6 left-6 z-10 flex items-center gap-1.5 rounded-full bg-bg-primary/90 px-3 py-1.5 text-xs font-semibold text-fg-secondary shadow-xs backdrop-blur">
        <span
          className={`size-1.5 rounded-full ${
            showLive
              ? 'bg-fg-green'
              : status === 'connecting'
                ? 'animate-pulse bg-fg-muted'
                : 'bg-fg-red'
          }`}
        />
        {showLive
          ? `Live · ${liveFleet.length} aircraft`
          : status === 'connecting'
            ? 'Connecting to live feed…'
            : 'Live feed unavailable · showing simulated traffic'}
        {showLive && lastUpdated && (
          <span className="text-fg-muted">
            · {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        )}
      </div>
    </div>
  )
})
