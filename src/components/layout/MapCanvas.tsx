import 'maplibre-gl/dist/maplibre-gl.css'

import { config as maplibreConfig } from 'maplibre-gl'
// Vite's production bundler doesn't resolve MapLibre's default worker URL
// correctly once everything is bundled together (works in dev, 404s in
// prod). Importing the worker file explicitly with `?worker&url` makes Vite
// emit it as its own real asset with a correct, base-path-aware URL.
import MaplibreWorker from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url'
import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef } from 'react'
import Map, { Layer, Marker, Source, type MapRef } from 'react-map-gl/maplibre'
import planeBlueSolid from '../../assets/icons/plane-blue-solid.png'
import planeBlueOutline from '../../assets/icons/plane-blue-outline.png'
import planeYellowSolid from '../../assets/icons/plane-yellow-solid.png'
import planeYellowBold from '../../assets/icons/plane-yellow-bold.png'
import planeLightBluePattern from '../../assets/icons/plane-lightblue-pattern.png'
import planeLightBlueOutline from '../../assets/icons/plane-lightblue-outline.png'
import { useMapSelection } from '../../context/MapSelectionContext'
import firBoundaries from '../../data/firBoundaries.geojson?url'
import { firRegions } from '../../data/firRegions'
import { useLiveFleet } from '../../hooks/useLiveFleet'
import { useRainRadar } from '../../hooks/useRainRadar'

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

const allPlaneIcons = [
  planeBlueSolid,
  planeBlueOutline,
  planeYellowSolid,
  planeYellowBold,
  planeLightBluePattern,
  planeLightBlueOutline,
]

function PlaneMarker({
  icon,
  heading,
  size = 20,
}: {
  icon: string
  heading: number
  size?: number
}) {
  return (
    <img
      src={icon}
      alt=""
      width={size}
      height={size}
      style={{ transform: `rotate(${heading}deg)`, display: 'block' }}
      draggable={false}
    />
  )
}

type SimAircraft = {
  lng: number
  lat: number
  heading: number
  icon: string
  size: number
}

// Fallback traffic shown while the live feed is connecting or unreachable,
// so the map never looks empty/broken.
function useSimulatedFleet(count: number): SimAircraft[] {
  return useMemo(() => {
    let seed = 42
    const rand = () => {
      seed = (seed * 1103515245 + 12345) & 0x7fffffff
      return (seed / 0x7fffffff) % 1
    }
    return Array.from({ length: count }, () => ({
      lng: 20 + rand() * 55,
      lat: 5 + rand() * 33,
      heading: rand() * 360,
      icon: allPlaneIcons[Math.floor(rand() * allPlaneIcons.length)],
      size: 18 + rand() * 8,
    }))
  }, [count])
}

// Dubai International Airport (DXB)
const DXB = { lng: 55.3644, lat: 25.2532 }
const DXB_RING_RADII_NM = [20, 40, 60]

// Approximates a circle as a GeoJSON polygon for the DXB range rings — a
// decorative radar-style visualization, not an official controlled-airspace
// boundary.
function circleRing(lng: number, lat: number, radiusNm: number, points = 72) {
  const radiusKm = radiusNm * 1.852
  const coords: [number, number][] = []
  const latRad = (lat * Math.PI) / 180
  for (let i = 0; i <= points; i++) {
    const angle = (i / points) * 2 * Math.PI
    const offsetLat = (radiusKm / 111.32) * Math.sin(angle)
    const offsetLng = (radiusKm / (111.32 * Math.cos(latRad))) * Math.cos(angle)
    coords.push([lng + offsetLng, lat + offsetLat])
  }
  return { type: 'LineString' as const, coordinates: coords }
}

const dxbRingsGeoJson = {
  type: 'FeatureCollection' as const,
  features: DXB_RING_RADII_NM.map((r) => ({
    type: 'Feature' as const,
    properties: { radiusNm: r },
    geometry: circleRing(DXB.lng, DXB.lat, r),
  })),
}

function aircraftIcon(onGround: boolean, verticalRate: number | null) {
  if (onGround) return planeLightBlueOutline
  if (verticalRate != null && verticalRate > 1) return planeBlueSolid
  if (verticalRate != null && verticalRate < -1) return planeYellowSolid
  return planeLightBluePattern
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
  const { selectedFirId, showAllFirLayers, showDxbRing, showWeather } = useMapSelection()
  const radarTileUrl = useRainRadar()

  useImperativeHandle(ref, () => ({
    zoomIn: () => mapRef.current?.zoomIn(),
    zoomOut: () => mapRef.current?.zoomOut(),
    resetZoom: () => mapRef.current?.flyTo({ zoom: INITIAL_ZOOM }),
  }))

  const showLive = status === 'live' && liveFleet.length > 0

  const selectedFir = firRegions.find((r) => r.id === selectedFirId)

  useEffect(() => {
    if (selectedFir) {
      const [minLng, minLat, maxLng, maxLat] = selectedFir.bbox
      mapRef.current?.fitBounds(
        [
          [minLng, minLat],
          [maxLng, maxLat],
        ],
        { padding: 60, duration: 1000, maxZoom: 7 },
      )
    }
  }, [selectedFir])

  useEffect(() => {
    if (showDxbRing) {
      mapRef.current?.flyTo({ center: [DXB.lng, DXB.lat], zoom: 8, duration: 1000 })
    }
  }, [showDxbRing])

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
        {(showAllFirLayers || selectedFirId) && (
          <Source id="fir-boundaries" type="geojson" data={firBoundaries}>
            {showAllFirLayers && (
              <Layer
                id="fir-outline-all"
                type="line"
                paint={{ 'line-color': '#94a3b8', 'line-width': 1, 'line-opacity': 0.6 }}
              />
            )}
            {/* Mirrors --color-bg-blue-subtle / --color-fg-blue from index.css —
                MapLibre paint values can't reference CSS custom properties directly.
                Layer must be a direct child of Source (not wrapped in a Fragment) —
                react-map-gl injects the `source` prop by cloning direct children. */}
            {selectedFirId && (
              <Layer
                id="fir-highlight-fill"
                type="fill"
                filter={['==', ['get', 'id'], selectedFirId]}
                paint={{ 'fill-color': '#d6ebfa', 'fill-opacity': 0.65 }}
              />
            )}
            {selectedFirId && (
              <Layer
                id="fir-highlight-line"
                type="line"
                filter={['==', ['get', 'id'], selectedFirId]}
                paint={{ 'line-color': '#1c80cf', 'line-width': 2.5 }}
              />
            )}
          </Source>
        )}

        {showDxbRing && (
          <Source id="dxb-rings" type="geojson" data={dxbRingsGeoJson}>
            <Layer
              id="dxb-rings-line"
              type="line"
              paint={{
                'line-color': '#1c80cf',
                'line-width': 1.5,
                'line-dasharray': [3, 2],
                'line-opacity': 0.85,
              }}
            />
          </Source>
        )}

        {showDxbRing && (
          <Marker longitude={DXB.lng} latitude={DXB.lat}>
            <div className="flex flex-col items-center gap-1">
              <div className="size-2.5 rounded-full border-2 border-white bg-fg-blue shadow-sm" />
              <span className="rounded bg-fg-secondary px-1.5 py-0.5 text-[10px] font-semibold text-white">
                DXB
              </span>
            </div>
          </Marker>
        )}

        {showWeather && radarTileUrl && (
          <Source id="weather-radar" type="raster" tiles={[radarTileUrl]} tileSize={256}>
            <Layer id="weather-radar-layer" type="raster" paint={{ 'raster-opacity': 0.55 }} />
          </Source>
        )}

        {showLive
          ? liveFleet.map((a) => (
              <Marker key={a.id} longitude={a.lng} latitude={a.lat}>
                <div title={`${a.callsign}${a.altitude != null ? ` · FL${Math.round(a.altitude / 30.48)}` : ''}`}>
                  <PlaneMarker icon={aircraftIcon(a.onGround, a.verticalRate)} heading={a.heading} />
                </div>
              </Marker>
            ))
          : simulatedFleet.map((a, i) => (
              <Marker key={i} longitude={a.lng} latitude={a.lat}>
                <PlaneMarker icon={a.icon} heading={a.heading} size={a.size} />
              </Marker>
            ))}
      </Map>

      {/* Dims the basemap so markers, FIR highlights, and other overlays read
          clearly on top — matches the dark alpha treatment from the original
          design. pointer-events-none so it never blocks map interaction. */}
      <div className="pointer-events-none absolute inset-0 bg-black/15" />

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
