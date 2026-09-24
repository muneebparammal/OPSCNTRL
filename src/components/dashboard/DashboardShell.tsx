import { type ReactNode, useState } from 'react'
import { MapCanvas } from '../layout/MapCanvas'
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

export function DashboardShell({
  breadcrumb = 'Operations Timeline',
  mapTypeDefaultOpen = false,
  topExtra,
  sheetTitle,
  sheetContent,
  hideSheetClose = false,
  defaultSheetOpen = false,
}: DashboardShellProps) {
  const [sheetOpen, setSheetOpen] = useState(defaultSheetOpen)

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-bg-primary">
      <Sidebar />
      <div className="flex h-full flex-1 flex-col">
        <NavBar breadcrumb={breadcrumb} />
        <div className="relative flex-1 overflow-hidden">
          <MapCanvas />

          <div className="absolute top-6 left-0 flex w-full items-start justify-between px-0">
            <SearchTabsBar
              narrow={sheetOpen}
              mapTypeDefaultOpen={mapTypeDefaultOpen}
              detailPanelActive={sheetOpen}
              onToggleDetailPanel={() => setSheetOpen((v) => !v)}
            />
          </div>

          {topExtra}

          <ZoomControls
            className={`absolute bottom-6 ${sheetOpen ? 'right-[464px]' : 'right-6'}`}
          />

          <QuickLinksBar
            className={`absolute bottom-6 ${
              sheetOpen ? 'left-[calc(50%-220px)]' : 'left-1/2'
            } -translate-x-1/2`}
          />

          {sheetContent && (
            <Sheet
              open={sheetOpen}
              onClose={() => setSheetOpen(false)}
              title={
                typeof sheetTitle === 'function'
                  ? sheetTitle(() => setSheetOpen(false))
                  : sheetTitle
              }
              hideDefaultClose={hideSheetClose}
            >
              {sheetContent}
            </Sheet>
          )}
        </div>
      </div>
    </div>
  )
}
