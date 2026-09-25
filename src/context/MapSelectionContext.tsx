import { createContext, type ReactNode, useContext, useState } from 'react'

export type AirportFilter = 'ALL' | 'DXB' | 'DWC'

export type SelectedFlight = {
  callsign: string
  altitude: number | null
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
}

const MapSelectionContext = createContext<MapSelectionContextValue | null>(null)

export function MapSelectionProvider({ children }: { children: ReactNode }) {
  const [selectedFirId, setSelectedFirId] = useState<string | null>(null)
  const [showAllFirLayers, setShowAllFirLayers] = useState(false)
  const [showDxbRing, setShowDxbRing] = useState(false)
  const [showWeather, setShowWeather] = useState(false)
  const [airportFilter, setAirportFilter] = useState<AirportFilter>('ALL')
  const [selectedFlight, setSelectedFlight] = useState<SelectedFlight | null>(null)
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
