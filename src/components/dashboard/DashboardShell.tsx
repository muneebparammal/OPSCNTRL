import { type ReactNode, useEffect, useRef, useState } from 'react'
import { MapSelectionProvider, useMapSelection } from '../../context/MapSelectionContext'
import { airports } from '../../data/airports'
import { notams } from '../../data/notams'
import { NotamDetailCards, NotamDetailHeader } from './NotamDetail'
import { FuelStatusCard } from './FuelStatusCard'
import { FlightLayersPanel } from './FlightLayersPanel'
import { SheetSimpleHeader } from './SheetSimpleHeader'
import { AirportDetailHeader } from './AirportDetailHeader'
import { AirportStatsCards } from './AirportStatsCards'
import { FlightDetailHeader } from './FlightDetailHeader'
import { FlightTimesCard } from './FlightTimesCard'
import { CrewComplementCard } from './HubCrewCards'
import { LiveFlightCard } from './LiveFlightCard'
import { FlightInfoCard } from './InfoCards'
import { PassengersCard } from './PassengersCard'
import { MapCanvas, type MapCanvasHandle, type MapStyleId } from '../layout/MapCanvas'
import { NavBar } from '../layout/NavBar'
import { QuickLinksBar } from '../layout/QuickLinksBar'
import { SearchTabsBar } from '../layout/SearchTabsBar'
import { Sidebar } from '../layout/Sidebar'
import { ZoomControls } from '../layout/ZoomControls'
import { Sheet } from '../ui/Sheet'

type DashboardShellProps = {
  breadcrumb?: string
  mapTypeDefaultOpen?: boolean
  topExtra?: ReactNode
}

export function DashboardShell(props: DashboardShellProps) {
  return (
    <MapSelectionProvider>
      <DashboardShellInner {...props} />
    </MapSelectionProvider>
  )
}

function DashboardShellInner({
  breadcrumb = 'Operations Timeline',
  mapTypeDefaultOpen = false,
  topExtra,
}: DashboardShellProps) {
  const [sheetOpen, setSheetOpen] = useState(false)
  const [sidebarExpanded, setSidebarExpanded] = useState(false)
  const [dark, setDark] = useState(() => {
    try {
      return localStorage.getItem('ops-theme') === 'dark'
    } catch {
      return false
    }
  })
  const [mapType, setMapType] = useState<MapStyleId>(dark ? 'dark' : 'light')

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    try {
      localStorage.setItem('ops-theme', dark ? 'dark' : 'light')
    } catch {
      /* storage unavailable */
    }
  }, [dark])

  const toggleTheme = () => {
    setDark((d) => !d)
    setMapType(dark ? 'light' : 'dark')
  }
  const mapRef = useRef<MapCanvasHandle>(null)
  const {
    selectedFlight,
    setSelectedFlight,
    selectedAirportIcao,
    setSelectedAirportIcao,
    selectedNotamId,
    setSelectedNotamId,
    requestRefresh,
  } = useMapSelection()
  const selectedNotam = notams.find((n) => n.id === selectedNotamId) ?? null
  const selectedAirport = airports.find((a) => a.icao === selectedAirportIcao) ?? null

  const closeSheet = () => {
    setSheetOpen(false)
    setSelectedFlight(null)
    setSelectedAirportIcao(null)
    setSelectedNotamId(null)
  }

  // Clicking an aircraft or an airport on the map overrides whatever this
  // screen's own sheet content is with that item's detail view, and opens
  // the panel. Flight selection takes priority if somehow both are set.
  const activeSheetContent = selectedFlight ? (
    <>
      {selectedFlight.live && <LiveFlightCard live={selectedFlight.live} />}
      <FlightInfoCard defaultOpen={!selectedFlight.live} />
      <FlightTimesCard />
      <FuelStatusCard callsign={selectedFlight.callsign} />
      <PassengersCard />
      <CrewComplementCard />
    </>
  ) : selectedAirport ? (
    <AirportStatsCards airport={selectedAirport} />
  ) : selectedNotam ? (
    <NotamDetailCards notam={selectedNotam} />
  ) : (
    <FlightLayersPanel />
  )
  const activeSheetTitle = selectedFlight ? (
    <FlightDetailHeader onClose={closeSheet} flightNumber={selectedFlight.callsign} />
  ) : selectedAirport ? (
    <AirportDetailHeader airport={selectedAirport} onClose={closeSheet} />
  ) : selectedNotam ? (
    <NotamDetailHeader notam={selectedNotam} onClose={closeSheet} />
  ) : (
    <SheetSimpleHeader />
  )
  const activeHideSheetClose = Boolean(selectedFlight || selectedAirport || selectedNotam)
  const isSheetOpen =
    sheetOpen || Boolean(selectedFlight) || Boolean(selectedAirport) || Boolean(selectedNotam)

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-bg-primary">
      <Sidebar expanded={sidebarExpanded} />
      <div className="flex h-full flex-1 flex-col">
        <NavBar
          breadcrumb={breadcrumb}
          sidebarExpanded={sidebarExpanded}
          onToggleSidebar={() => setSidebarExpanded((v) => !v)}
          dark={dark}
          onToggleTheme={toggleTheme}
          onRefresh={requestRefresh}
        />
        <div className="relative flex-1 overflow-hidden">
          <MapCanvas ref={mapRef} mapType={mapType} />

          <div
            className={`absolute top-6 left-0 flex items-start justify-between px-0 ${
              isSheetOpen ? 'right-[440px]' : 'right-0'
            }`}
          >
            <SearchTabsBar
              narrow={isSheetOpen}
              mapTypeDefaultOpen={mapTypeDefaultOpen}
              detailPanelActive={isSheetOpen}
              onToggleDetailPanel={() =>
                selectedFlight || selectedAirport || selectedNotam || isSheetOpen
                  ? closeSheet()
                  : setSheetOpen(true)
              }
              mapType={mapType}
              onMapTypeChange={setMapType}
            />
          </div>

          {topExtra}

          <ZoomControls
            className={`absolute bottom-6 ${isSheetOpen ? 'right-[464px]' : 'right-6'}`}
            onZoomIn={() => mapRef.current?.zoomIn()}
            onZoomOut={() => mapRef.current?.zoomOut()}
          />

          <QuickLinksBar
            className={`absolute bottom-6 ${
              isSheetOpen ? 'left-[calc(50%-220px)]' : 'left-1/2'
            } -translate-x-1/2`}
            airspaceActive={isSheetOpen}
            onAirspaceClick={() =>
              selectedFlight || selectedAirport || selectedNotam || isSheetOpen
                ? closeSheet()
                : setSheetOpen(true)
            }
          />

          {
            <Sheet
              open={isSheetOpen}
              onClose={closeSheet}
              title={activeSheetTitle}
              hideDefaultClose={activeHideSheetClose}
            >
              {activeSheetContent}
            </Sheet>
          }
        </div>
      </div>
    </div>
  )
}
