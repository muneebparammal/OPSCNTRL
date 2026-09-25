import 'maplibre-gl/dist/maplibre-gl.css'

import { config as maplibreConfig } from 'maplibre-gl'
// Vite's production bundler doesn't resolve MapLibre's default worker URL
// correctly once everything is bundled together (works in dev, 404s in
// prod). Importing the worker file explicitly with `?worker&url` makes Vite
// emit it as its own real asset with a correct, base-path-aware URL.
import MaplibreWorker from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url'
import { Building2 } from 'lucide-react'
import { forwardRef, useEffect, useImperativeHandle, useMemo, useState, useRef } from 'react'
import Map, { Layer, Marker, Source, type MapRef } from 'react-map-gl/maplibre'
import planeBlueSolid from '../../assets/icons/plane-blue-solid.png'
import planeBlueOutline from '../../assets/icons/plane-blue-outline.png'
import planeYellowSolid from '../../assets/icons/plane-yellow-solid.png'
import planeYellowBold from '../../assets/icons/plane-yellow-bold.png'
import planeLightBluePattern from '../../assets/icons/plane-lightblue-pattern.png'
import planeLightBlueOutline from '../../assets/icons/plane-lightblue-outline.png'
import { useMapSelection } from '../../context/MapSelectionContext'
import { airports } from '../../data/airports'
import firBoundaries from '../../data/firBoundaries.geojson?url'
import { firRegions } from '../../data/firRegions'
import { distanceKm, estimateRoute, flowDirection } from './routeGeometry'
import { flightAttrs } from '../../data/flightAttributes'
import { type LiveAircraft, useLiveFleet } from '../../hooks/useLiveFleet'
import { useRainRadar } from '../../hooks/useRainRadar'
import { Tooltip } from '../ui/Tooltip'

maplibreConfig.WORKER_URL = MaplibreWorker

export type MapStyleId = 'light' | 'dark' | 'satellite'

const INITIAL_ZOOM = 2
const WORLD_VIEW = { longitude: 40, latitude: 25, zoom: INITIAL_ZOOM }
const DWC = { lng: 55.1614, lat: 24.8967 }
const MAX_VISIBLE_AIRCRAFT = 700
const NEAR_AIRPORT_KM = 250
const FLOW_RADIUS_KM = 700

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

type MapAircraft = {
  id: string
  callsign: string
  lng: number
  lat: number
  heading: number
  altitude: number | null
  onGround: boolean
  verticalRate: number | null
  live?: LiveAircraft
  icon: string
  size: number
}

// Fallback traffic shown while the live feed is connecting or unreachable,
// so the map never looks empty/broken. Spread worldwide, with a cluster near
// the Gulf so the DXB / DWC filters have traffic to show.
function useSimulatedFleet(count: number): MapAircraft[] {
  return useMemo(() => {
    let seed = 42
    const rand = () => {
      seed = (seed * 1103515245 + 12345) & 0x7fffffff
      return (seed / 0x7fffffff) % 1
    }
    return Array.from({ length: count }, (_, i) => {
      const gulf = i % 6 === 0
      const nearHub = i % 6 === 1
      const verticalRate = (rand() - 0.5) * 12
      return {
        id: `sim-${i}`,
        callsign: `EK${100 + i}`,
        lng: nearHub ? 53 + rand() * 5 : gulf ? 45 + rand() * 25 : -170 + rand() * 340,
        lat: nearHub ? 23 + rand() * 4 : gulf ? 15 + rand() * 17 : -45 + rand() * 110,
        heading: rand() * 360,
        altitude: 9000 + rand() * 3000,
        onGround: false,
        verticalRate,
        icon: allPlaneIcons[Math.floor(rand() * allPlaneIcons.length)],
        size: 18 + rand() * 8,
      }
    })
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

function isStale(positionTime: number | null) {
  return positionTime == null || Date.now() / 1000 - positionTime > 120
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
  const {
    selectedFirId,
    showAllFirLayers,
    showDxbRing,
    showWeather,
    selectedFlight,
    setSelectedFlight,
    showAirportsLayer,
    selectedAirportIcao,
    setSelectedAirportIcao,
    showEmiratesLayer,
    pinnedCallsigns,
    airportFilter,
    typeFilter,
    statusFilter,
    flowFilter,
    hourFilter,
    hourMode,
    setHourlyCounts,
  } = useMapSelection()
  const { aircraft: liveFleet, status, lastUpdated } = useLiveFleet()
  const emiratesFleet = useMemo(
    () => liveFleet.filter((a) => a.callsign.toUpperCase().startsWith('UAE')),
    [liveFleet],
  )
  const simulatedFleet = useSimulatedFleet(400)
  const mapRef = useRef<MapRef>(null)
  const radarTileUrl = useRainRadar()

  useImperativeHandle(ref, () => ({
    zoomIn: () => mapRef.current?.zoomIn(),
    zoomOut: () => mapRef.current?.zoomOut(),
    resetZoom: () => mapRef.current?.flyTo({ zoom: INITIAL_ZOOM }),
  }))

  const showLive = status === 'live' && liveFleet.length > 0

  const [bounds, setBounds] = useState<[number, number, number, number] | null>(null)
  const updateBounds = () => {
    const b = mapRef.current?.getBounds()
    if (b) setBounds([b.getWest(), b.getSouth(), b.getEast(), b.getNorth()])
  }

  const fleet: MapAircraft[] = useMemo(
    () =>
      showLive
        ? liveFleet
            .filter((a) => !(showEmiratesLayer && a.callsign.toUpperCase().startsWith('UAE')))
            .map((a) => ({
              ...a,
              live: a,
              icon: aircraftIcon(a.onGround, a.verticalRate),
              size: 20,
            }))
        : simulatedFleet,
    [showLive, liveFleet, simulatedFleet, showEmiratesLayer],
  )

  const hub: [number, number] = [DXB.lng, DXB.lat]
  const filteredExceptHour = useMemo(() => {
    const airport = airportFilter === 'DXB' ? DXB : airportFilter === 'DWC' ? DWC : null
    return fleet.filter((a) => {
      const here: [number, number] = [a.lng, a.lat]
      if (airport && distanceKm(here, [airport.lng, airport.lat]) > NEAR_AIRPORT_KM) return false
      const attrs = flightAttrs(a.id, a.onGround, a.verticalRate)
      if (typeFilter.length && !typeFilter.includes(attrs.type)) return false
      if (statusFilter.length && !statusFilter.includes(attrs.status)) return false
      if (flowFilter) {
        if (distanceKm(here, hub) > FLOW_RADIUS_KM) return false
        if (flowDirection(a, hub) !== flowFilter) return false
      }
      return true
    })
  }, [fleet, airportFilter, typeFilter, statusFilter, flowFilter])

  const hourlyCounts = useMemo(() => {
    const counts = { departure: Array(24).fill(0), arrival: Array(24).fill(0) }
    for (const a of filteredExceptHour) {
      const { hour } = flightAttrs(a.id, a.onGround, a.verticalRate)
      counts[flowDirection(a, hub)][hour]++
    }
    return counts
  }, [filteredExceptHour])
  useEffect(() => setHourlyCounts(hourlyCounts), [hourlyCounts, setHourlyCounts])

  const visibleFleet = useMemo(() => {
    const inHour = (a: MapAircraft) => {
      if (hourFilter == null) return true
      if (flightAttrs(a.id, a.onGround, a.verticalRate).hour !== hourFilter) return false
      return hourMode === 'both' || flowDirection(a, hub) === hourMode
    }
    const inView = (a: MapAircraft) =>
      !bounds ||
      (a.lat >= bounds[1] - 2 &&
        a.lat <= bounds[3] + 2 &&
        (bounds[2] - bounds[0] >= 340 || (a.lng >= bounds[0] - 2 && a.lng <= bounds[2] + 2)))
    return filteredExceptHour.filter((a) => inHour(a) && inView(a)).slice(0, MAX_VISIBLE_AIRCRAFT)
  }, [filteredExceptHour, hourFilter, hourMode, bounds])

  const firstFlyRef = useRef(true)
  useEffect(() => {
    if (firstFlyRef.current) {
      firstFlyRef.current = false
      return
    }
    const target = airportFilter === 'DXB' ? DXB : airportFilter === 'DWC' ? DWC : null
    mapRef.current?.flyTo(
      target
        ? { center: [target.lng, target.lat], zoom: 6, duration: 1200 }
        : {
            center: [WORLD_VIEW.longitude, WORLD_VIEW.latitude],
            zoom: WORLD_VIEW.zoom,
            duration: 1200,
          },
    )
  }, [airportFilter])

  useEffect(() => {
    if (flowFilter) mapRef.current?.flyTo({ center: [DXB.lng, DXB.lat], zoom: 5, duration: 1200 })
  }, [flowFilter])

  const routeGeoJson = useMemo(() => {
    if (!selectedFlight?.position) return null
    const latest =
      [...liveFleet, ...emiratesFleet].find((a) => a.callsign === selectedFlight.callsign) ??
      selectedFlight.position
    const { solid, dashed } = estimateRoute(latest, [DXB.lng, DXB.lat])
    const line = (kind: string, coordinates: number[][]) => ({
      type: 'Feature' as const,
      properties: { kind },
      geometry: { type: 'LineString' as const, coordinates },
    })
    return {
      type: 'FeatureCollection' as const,
      features: [line('solid', solid), line('dashed', dashed)],
    }
  }, [selectedFlight, liveFleet, emiratesFleet])

  const selectedCallsign = selectedFlight?.callsign
  useEffect(() => {
    const pos = selectedFlight?.position
    if (!pos) return
    const minLng = Math.min(pos.lng, DXB.lng)
    const maxLng = Math.max(pos.lng, DXB.lng)
    const minLat = Math.min(pos.lat, DXB.lat)
    const maxLat = Math.max(pos.lat, DXB.lat)
    mapRef.current?.fitBounds(
      [
        [minLng, minLat],
        [maxLng, maxLat],
      ],
      { padding: { top: 100, bottom: 120, left: 80, right: 500 }, duration: 900, maxZoom: 6 },
    )
    // Only re-fit when a different flight is picked, not on every position update.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCallsign])

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
      mapRef.current?.flyTo({
        center: [DXB.lng, DXB.lat],
        zoom: 8,
        duration: 1000,
      })
    }
  }, [showDxbRing])

  return (
    <div className="relative h-full w-full overflow-hidden bg-bg-secondary">
      <Map
        ref={mapRef}
        initialViewState={WORLD_VIEW}
        mapStyle={mapStyles[mapType]}
        attributionControl={false}
        style={{ width: '100%', height: '100%' }}
        onLoad={updateBounds}
        onMoveEnd={updateBounds}
        onZoom={(e) => onZoomChange?.(Math.round(2 ** (e.viewState.zoom - INITIAL_ZOOM) * 100))}
      >
        {(showAllFirLayers || selectedFirId) && (
          <Source id="fir-boundaries" type="geojson" data={firBoundaries}>
            {showAllFirLayers && (
              <Layer
                id="fir-outline-all"
                type="line"
                paint={{
                  'line-color': '#94a3b8',
                  'line-width': 1,
                  'line-opacity': 0.6,
                }}
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

        {showAirportsLayer &&
          airports.map((a) => {
            const active = selectedAirportIcao === a.icao
            return (
              <Marker key={a.icao} longitude={a.lng} latitude={a.lat}>
                <Tooltip label={`${a.icao}${a.iata ? ` · ${a.iata}` : ''} — ${a.name}`}>
                  <button
                    type="button"
                    onClick={() => setSelectedAirportIcao(active ? null : a.icao)}
                    className={`flex cursor-pointer items-center justify-center rounded-full border-2 border-white shadow-sm transition-colors ${
                      active
                        ? 'size-6 bg-fg-red'
                        : a.size === 'large'
                          ? 'size-5 bg-fg-secondary'
                          : 'size-4 bg-fg-grey-blue'
                    }`}
                  >
                    <Building2
                      size={a.size === 'large' ? 12 : 9}
                      className="text-white"
                      strokeWidth={2.5}
                    />
                  </button>
                </Tooltip>
              </Marker>
            )
          })}

        {routeGeoJson && (
          <Source id="flight-route" type="geojson" data={routeGeoJson}>
            <Layer
              id="flight-route-line"
              type="line"
              layout={{ 'line-cap': 'round', 'line-join': 'round' }}
              paint={{ 'line-color': '#d71921', 'line-width': 3, 'line-opacity': 0.95 }}
              filter={['==', ['get', 'kind'], 'solid']}
            />
            <Layer
              id="flight-route-projection"
              type="line"
              paint={{
                'line-color': '#d71921',
                'line-width': 2.5,
                'line-opacity': 0.6,
                'line-dasharray': [2, 2],
              }}
              filter={['==', ['get', 'kind'], 'dashed']}
            />
          </Source>
        )}

        {routeGeoJson && (
          <Marker longitude={DXB.lng} latitude={DXB.lat}>
            <div className="flex flex-col items-center gap-1">
              <div className="size-3 rounded-full border-2 border-white bg-brand-ek shadow-sm" />
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

        {visibleFleet.map((a) => (
          <Marker key={a.id} longitude={a.lng} latitude={a.lat}>
            <button
              type="button"
              title={`${a.callsign}${a.altitude != null ? ` · FL${Math.round(a.altitude / 30.48)}` : ''}`}
              onClick={() =>
                setSelectedFlight({
                  callsign: a.callsign,
                  altitude: a.altitude,
                  live: a.live,
                  position: { lng: a.lng, lat: a.lat, heading: a.heading },
                })
              }
              className="cursor-pointer border-0 bg-transparent p-0"
            >
              <PlaneMarker icon={a.icon} heading={a.heading} size={a.size} />
            </button>
          </Marker>
        ))}

        {showEmiratesLayer &&
          emiratesFleet.map((a) => {
            const stale = isStale(a.positionTime)
            const pinned = pinnedCallsigns.includes(a.callsign)
            return (
              <Marker key={`ek-${a.id}`} longitude={a.lng} latitude={a.lat}>
                <Tooltip label={`${a.callsign} : ${a.icao24.toUpperCase()}`}>
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedFlight({
                        callsign: a.callsign,
                        altitude: a.altitude,
                        live: a,
                        position: { lng: a.lng, lat: a.lat, heading: a.heading },
                      })
                    }
                    className={`cursor-pointer rounded-full border-0 p-0 ${
                      pinned ? 'bg-brand-ek/25 ring-2 ring-brand-ek' : 'bg-transparent'
                    } ${stale ? 'opacity-40 grayscale' : ''}`}
                  >
                    <PlaneMarker icon={planeYellowBold} heading={a.heading} size={24} />
                  </button>
                </Tooltip>
              </Marker>
            )
          })}
      </Map>

      {showEmiratesLayer && (
        <div className="absolute bottom-16 left-6 z-10 flex flex-col gap-1.5 rounded-xl bg-bg-primary/90 px-3 py-2 text-xs font-semibold text-fg-secondary shadow-xs backdrop-blur">
          <p className="text-fg-muted">Emirates Tracker · {emiratesFleet.length} flights</p>
          <span className="flex items-center gap-2">
            <img src={planeYellowBold} alt="" className="size-4" />
            Emirates flight (UAE)
          </span>
          <span className="flex items-center gap-2">
            <img src={planeYellowBold} alt="" className="size-4 opacity-40 grayscale" />
            Stale position (&gt; 2 min)
          </span>
          <span className="flex items-center gap-2">
            <span className="size-4 rounded-full bg-brand-ek/25 ring-2 ring-brand-ek" />
            Pinned
          </span>
        </div>
      )}

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
            ·{' '}
            {lastUpdated.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        )}
      </div>
    </div>
  )
})
