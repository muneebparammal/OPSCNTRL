import type { ReactNode } from 'react'
import { MapCanvas } from '../layout/MapCanvas'
import { NavBar } from '../layout/NavBar'
import { QuickLinksBar } from '../layout/QuickLinksBar'
import { SearchTabsBar } from '../layout/SearchTabsBar'
import { Sidebar } from '../layout/Sidebar'
import { ZoomControls } from '../layout/ZoomControls'

type DashboardShellProps = {
  breadcrumb?: string
  narrowSearch?: boolean
  sheetOpen?: boolean
  mapTypeDefaultOpen?: boolean
  topExtra?: ReactNode
  children?: ReactNode
}

export function DashboardShell({
  breadcrumb = 'Operations Timeline',
  narrowSearch = false,
  sheetOpen = false,
  mapTypeDefaultOpen = false,
  topExtra,
  children,
}: DashboardShellProps) {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-bg-primary">
      <Sidebar />
      <div className="flex h-full flex-1 flex-col">
        <NavBar breadcrumb={breadcrumb} />
        <div className="relative flex-1 overflow-hidden">
          <MapCanvas />

          <div className="absolute top-6 left-0 flex w-full items-start justify-between px-0">
            <SearchTabsBar narrow={narrowSearch} mapTypeDefaultOpen={mapTypeDefaultOpen} />
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

          {children}
        </div>
      </div>
    </div>
  )
}
