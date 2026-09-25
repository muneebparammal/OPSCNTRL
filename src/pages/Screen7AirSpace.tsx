import { AirSpaceCard } from '../components/dashboard/AirSpaceCard'
import { DashboardShell } from '../components/dashboard/DashboardShell'
import { HubActivityCard } from '../components/dashboard/HubCrewCards'
import { AircraftTypeCard, FlightStatusCard } from '../components/dashboard/InfoCards'
import { SheetSimpleHeader } from '../components/dashboard/SheetSimpleHeader'

export default function Screen7AirSpace() {
  return (
    <DashboardShell
      sheetTitle={<SheetSimpleHeader />}
      defaultSheetOpen
      sheetContent={
        <>
          <AircraftTypeCard />
          <FlightStatusCard />
          <AirSpaceCard defaultOpen />
          <HubActivityCard />
        </>
      }
    />
  )
}
