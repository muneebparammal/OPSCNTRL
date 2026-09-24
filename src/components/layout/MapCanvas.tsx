import 'maplibre-gl/dist/maplibre-gl.css'

import { Plane } from 'lucide-react'
import { forwardRef, useImperativeHandle, useMemo, useRef } from 'react'
import Map, { Marker, type MapRef } from 'react-map-gl/maplibre'

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

type Aircraft = {
  lng: number
  lat: number
  heading: number
  color: string
  size: number
}

// Illustrative live-traffic overlay: real flight positions would come from a
// flight-data feed (e.g. ADS-B) rather than being placed at design time.
function useFleet(count: number): Aircraft[] {
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
  const fleet = useFleet(70)
  const mapRef = useRef<MapRef>(null)

  useImperativeHandle(ref, () => ({
    zoomIn: () => mapRef.current?.zoomIn(),
    zoomOut: () => mapRef.current?.zoomOut(),
    resetZoom: () => mapRef.current?.flyTo({ zoom: INITIAL_ZOOM }),
  }))

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
        {fleet.map((a, i) => (
          <Marker key={i} longitude={a.lng} latitude={a.lat}>
            <Plane
              size={a.size}
              style={{ transform: `rotate(${a.heading}deg)`, color: a.color }}
              strokeWidth={2.5}
            />
          </Marker>
        ))}
      </Map>
    </div>
  )
})
