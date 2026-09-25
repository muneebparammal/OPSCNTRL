import { type ReactNode, useRef, useState } from 'react'
import { MapSelectionProvider, useMapSelection } from '../../context/MapSelectionContext'
import { airports } from '../../data/airports'
import { notams } from '../../data/notams'
import { NotamDetailCards, NotamDetailHeader } from './NotamDetail'
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
  sheetTitle?: ReactNode | ((onClose: () => void) => ReactNode)
  sheetContent?: ReactNode
  hideSheetClose?: boolean
  defaultSheetOpen?: boolean
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
  sheetTitle,
  sheetContent,
  hideSheetClose = false,
  defaultSheetOpen = false,
}: DashboardShellProps) {
  const [sheetOpen, setSheetOpen] = useState(defaultSheetOpen)
  const [sidebarExpanded, setSidebarExpanded] = useState(false)
  const [mapType, setMapType] = useState<MapStyleId>('light')
  const [zoomPercent, setZoomPercent] = useState(100)
  const mapRef = useRef<MapCanvasHandle>(null)
  const {
    selectedFlight,
    setSelectedFlight,
    selectedAirportIcao,
    setSelectedAirportIcao,
    selectedNotamId,
    setSelectedNotamId,
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
      <PassengersCard />
      <CrewComplementCard />
    </>
  ) : selectedAirport ? (
    <AirportStatsCards airport={selectedAirport} />
  ) : selectedNotam ? (
    <NotamDetailCards notam={selectedNotam} />
  ) : (
    sheetContent
  )
  const activeSheetTitle = selectedFlight ? (
    <FlightDetailHeader onClose={closeSheet} flightNumber={selectedFlight.callsign} />
  ) : selectedAirport ? (
    <AirportDetailHeader airport={selectedAirport} onClose={closeSheet} />
  ) : selectedNotam ? (
    <NotamDetailHeader notam={selectedNotam} onClose={closeSheet} />
  ) : typeof sheetTitle === 'function' ? (
    sheetTitle(closeSheet)
  ) : (
    sheetTitle
  )
  const activeHideSheetClose = selectedFlight || selectedAirport || selectedNotam ? true : hideSheetClose
  const isSheetOpen = sheetOpen || Boolean(selectedFlight) || Boolean(selectedAirport) || Boolean(selectedNotam)

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-bg-primary">
      <Sidebar expanded={sidebarExpanded} />
      <div className="flex h-full flex-1 flex-col">
        <NavBar
          breadcrumb={breadcrumb}
          sidebarExpanded={sidebarExpanded}
          onToggleSidebar={() => setSidebarExpanded((v) => !v)}
        />
        <div className="relative flex-1 overflow-hidden">
          <MapCanvas ref={mapRef} mapType={mapType} onZoomChange={setZoomPercent} />

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
                selectedFlight || selectedAirport || selectedNotam ? closeSheet() : setSheetOpen((v) => !v)
              }
              mapType={mapType}
              onMapTypeChange={setMapType}
            />
          </div>

          {topExtra}

          <ZoomControls
            className={`absolute bottom-6 ${isSheetOpen ? 'right-[464px]' : 'right-6'}`}
            percent={zoomPercent}
            onZoomIn={() => mapRef.current?.zoomIn()}
            onZoomOut={() => mapRef.current?.zoomOut()}
            onReset={() => mapRef.current?.resetZoom()}
          />

          <QuickLinksBar
            className={`absolute bottom-6 ${
              isSheetOpen ? 'left-[calc(50%-220px)]' : 'left-1/2'
            } -translate-x-1/2`}
            airspaceActive={isSheetOpen}
            onAirspaceClick={() =>
              selectedFlight || selectedAirport || selectedNotam ? closeSheet() : setSheetOpen((v) => !v)
            }
          />

          {activeSheetContent && (
            <Sheet
              open={isSheetOpen}
              onClose={closeSheet}
              title={activeSheetTitle}
              hideDefaultClose={activeHideSheetClose}
            >
              {activeSheetContent}
            </Sheet>
          )}
        </div>
      </div>
    </div>
  )
}
