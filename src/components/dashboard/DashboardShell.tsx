import { type ReactNode, useRef, useState } from 'react'
import { MapSelectionProvider, useMapSelection } from '../../context/MapSelectionContext'
import { ConnectingPassengersCard } from './ConnectingPassengersCard'
import { FlightDetailHeader } from './FlightDetailHeader'
import { FlightTimesCard } from './FlightTimesCard'
import { CrewComplementCard } from './HubCrewCards'
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
  const { selectedFlight, setSelectedFlight } = useMapSelection()

  const closeSheet = () => {
    setSheetOpen(false)
    setSelectedFlight(null)
  }

  // Clicking an aircraft on the map overrides whatever this screen's own
  // sheet content is with that flight's detail view, and opens the panel.
  const activeSheetContent = selectedFlight ? (
    <>
      <FlightInfoCard defaultOpen />
      <FlightTimesCard />
      <PassengersCard />
      <ConnectingPassengersCard />
      <CrewComplementCard />
    </>
  ) : (
    sheetContent
  )
  const activeSheetTitle = selectedFlight ? (
    <FlightDetailHeader onClose={closeSheet} flightNumber={selectedFlight.callsign} />
  ) : typeof sheetTitle === 'function' ? (
    sheetTitle(closeSheet)
  ) : (
    sheetTitle
  )
  const activeHideSheetClose = selectedFlight ? true : hideSheetClose
  const isSheetOpen = sheetOpen || Boolean(selectedFlight)

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
              onToggleDetailPanel={() => (selectedFlight ? closeSheet() : setSheetOpen((v) => !v))}
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
            onAirspaceClick={() => (selectedFlight ? closeSheet() : setSheetOpen((v) => !v))}
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
