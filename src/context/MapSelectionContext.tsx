import { createContext, type ReactNode, useContext, useState } from 'react'

type MapSelectionContextValue = {
  selectedFirId: string | null
  setSelectedFirId: (id: string | null) => void
  showAllFirLayers: boolean
  setShowAllFirLayers: (show: boolean) => void
  showDxbRing: boolean
  setShowDxbRing: (show: boolean) => void
  showWeather: boolean
  setShowWeather: (show: boolean) => void
}

const MapSelectionContext = createContext<MapSelectionContextValue | null>(null)

export function MapSelectionProvider({ children }: { children: ReactNode }) {
  const [selectedFirId, setSelectedFirId] = useState<string | null>(null)
  const [showAllFirLayers, setShowAllFirLayers] = useState(false)
  const [showDxbRing, setShowDxbRing] = useState(false)
  const [showWeather, setShowWeather] = useState(false)
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
