import type { LiveAircraft } from '../hooks/useLiveFleet'
import { createContext, type ReactNode, useContext, useState } from 'react'

export type HourlyCounts = { departure: number[]; arrival: number[] }
const emptyHourly = (): HourlyCounts => ({
  departure: Array(24).fill(0),
  arrival: Array(24).fill(0),
})

export type MapSettings = {
  altitudeUnit: 'ft' | 'm'
  speedUnit: 'kt' | 'kmh'
  distanceUnit: 'nm' | 'km'
  showLabels: boolean
  iconScale: 'small' | 'medium' | 'large'
  refreshSec: 15 | 30 | 60
  paused: boolean
}

const DEFAULT_SETTINGS: MapSettings = {
  altitudeUnit: 'ft',
  speedUnit: 'kt',
  distanceUnit: 'nm',
  showLabels: false,
  iconScale: 'medium',
  refreshSec: 30,
  paused: false,
}

function loadSettings(): MapSettings {
  try {
    const raw = localStorage.getItem('ops-map-settings')
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS
  } catch {
    return DEFAULT_SETTINGS
  }
}

export type AirportFilter = 'ALL' | 'DXB' | 'DWC'

export type SelectedFlight = {
  callsign: string
  altitude: number | null
  live?: LiveAircraft
  position?: { lng: number; lat: number; heading: number }
}

type MapSelectionContextValue = {
  selectedFirId: string | null
  setSelectedFirId: (id: string | null) => void
  showAllFirLayers: boolean
  setShowAllFirLayers: (show: boolean) => void
  showDxbRing: boolean
  setShowDxbRing: (show: boolean) => void
  showWeather: boolean
  setShowWeather: (show: boolean) => void
  airportFilter: AirportFilter
  setAirportFilter: (airport: AirportFilter) => void
  selectedFlight: SelectedFlight | null
  setSelectedFlight: (flight: SelectedFlight | null) => void
  showAirportsLayer: boolean
  setShowAirportsLayer: (show: boolean) => void
  selectedAirportIcao: string | null
  setSelectedAirportIcao: (icao: string | null) => void
  typeFilter: string[]
  toggleTypeFilter: (type: string) => void
  statusFilter: string[]
  toggleStatusFilter: (status: string) => void
  flowFilter: 'departure' | 'arrival' | null
  setFlowFilter: (flow: 'departure' | 'arrival' | null) => void
  hourFilter: number | null
  setHourFilter: (hour: number | null) => void
  hourMode: 'both' | 'departure' | 'arrival'
  setHourMode: (mode: 'both' | 'departure' | 'arrival') => void
  hourlyCounts: HourlyCounts
  setHourlyCounts: (counts: HourlyCounts) => void
  refreshTick: number
  requestRefresh: () => void
  showEmiratesLayer: boolean
  showCountryNames: boolean
  setShowCountryNames: (show: boolean) => void
  showNotams: boolean
  setShowNotams: (show: boolean) => void
  selectedNotamId: string | null
  setSelectedNotamId: (id: string | null) => void
  settings: MapSettings
  updateSettings: (patch: Partial<MapSettings>) => void
  resetFilters: () => void
  setShowEmiratesLayer: (show: boolean) => void
  pinnedCallsigns: string[]
  togglePin: (callsign: string) => void
}

const MapSelectionContext = createContext<MapSelectionContextValue | null>(null)

export function MapSelectionProvider({ children }: { children: ReactNode }) {
  const [selectedFirId, setSelectedFirId] = useState<string | null>(null)
  const [showAllFirLayers, setShowAllFirLayers] = useState(false)
  const [showDxbRing, setShowDxbRing] = useState(false)
  const [showWeather, setShowWeather] = useState(false)
  const [airportFilter, setAirportFilter] = useState<AirportFilter>('ALL')
  const [selectedFlight, setSelectedFlight] = useState<SelectedFlight | null>(null)
  const [showAirportsLayer, setShowAirportsLayer] = useState(false)
  const [selectedAirportIcao, setSelectedAirportIcao] = useState<string | null>(null)
  const [showEmiratesLayer, setShowEmiratesLayer] = useState(false)
  const [typeFilter, setTypeFilter] = useState<string[]>([])
  const [statusFilter, setStatusFilter] = useState<string[]>([])
  const [flowFilter, setFlowFilter] = useState<'departure' | 'arrival' | null>(null)
  const [hourFilter, setHourFilter] = useState<number | null>(null)
  const [hourMode, setHourMode] = useState<'both' | 'departure' | 'arrival'>('both')
  const [hourlyCounts, setHourlyCounts] = useState<HourlyCounts>(emptyHourly)
  const toggleIn = (list: string[], v: string) =>
    list.includes(v) ? list.filter((x) => x !== v) : [...list, v]
  const toggleTypeFilter = (t: string) => setTypeFilter((l) => toggleIn(l, t))
  const toggleStatusFilter = (s: string) => setStatusFilter((l) => toggleIn(l, s))
  const [refreshTick, setRefreshTick] = useState(0)
  const requestRefresh = () => setRefreshTick((t) => t + 1)
  const [showCountryNames, setShowCountryNames] = useState(true)
  const [showNotams, setShowNotams] = useState(false)
  const [selectedNotamId, setSelectedNotamId] = useState<string | null>(null)
  const [settings, setSettings] = useState<MapSettings>(loadSettings)
  const updateSettings = (patch: Partial<MapSettings>) =>
    setSettings((s) => {
      const next = { ...s, ...patch }
      try {
        localStorage.setItem('ops-map-settings', JSON.stringify(next))
      } catch {
        /* storage unavailable */
      }
      return next
    })
  const resetFilters = () => {
    setAirportFilter('ALL')
    setTypeFilter([])
    setStatusFilter([])
    setFlowFilter(null)
    setHourFilter(null)
    setHourMode('both')
  }
  const [pinnedCallsigns, setPinnedCallsigns] = useState<string[]>([])
  const togglePin = (callsign: string) =>
    setPinnedCallsigns((p) => (p.includes(callsign) ? p.filter((c) => c !== callsign) : [...p, callsign]))
  return (
    <MapSelectionContext.Provider
      value={{
        selectedFirId,
        setSelectedFirId,
        showAllFirLayers,
        setShowAllFirLayers,
        showDxbRing,
        setShowDxbRing,
        showWeather,
        setShowWeather,
        airportFilter,
        setAirportFilter,
        selectedFlight,
        setSelectedFlight,
        showAirportsLayer,
        setShowAirportsLayer,
        selectedAirportIcao,
        setSelectedAirportIcao,
        typeFilter,
        toggleTypeFilter,
        statusFilter,
        toggleStatusFilter,
        flowFilter,
        setFlowFilter,
        hourFilter,
        setHourFilter,
        hourMode,
        setHourMode,
        hourlyCounts,
        setHourlyCounts,
        refreshTick,
        requestRefresh,
        showEmiratesLayer,
        setShowEmiratesLayer,
        showCountryNames,
        setShowCountryNames,
        showNotams,
        setShowNotams,
        selectedNotamId,
        setSelectedNotamId,
        settings,
        updateSettings,
        resetFilters,
        pinnedCallsigns,
        togglePin,
      }}
    >
      {children}
    </MapSelectionContext.Provider>
  )
}

export function useMapSelection() {
  const ctx = useContext(MapSelectionContext)
  if (!ctx) throw new Error('useMapSelection must be used within MapSelectionProvider')
  return ctx
}
