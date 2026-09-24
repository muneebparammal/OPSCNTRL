import { createContext, type ReactNode, useContext, useState } from 'react'

type MapSelectionContextValue = {
  selectedFirId: string | null
  setSelectedFirId: (id: string | null) => void
}

const MapSelectionContext = createContext<MapSelectionContextValue | null>(null)

export function MapSelectionProvider({ children }: { children: ReactNode }) {
  const [selectedFirId, setSelectedFirId] = useState<string | null>(null)
  return (
    <MapSelectionContext.Provider value={{ selectedFirId, setSelectedFirId }}>
      {children}
    </MapSelectionContext.Provider>
  )
}

export function useMapSelection() {
  const ctx = useContext(MapSelectionContext)
  if (!ctx) throw new Error('useMapSelection must be used within MapSelectionProvider')
  return ctx
}
