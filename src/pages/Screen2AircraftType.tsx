import { AirSpaceCard } from '../components/dashboard/AirSpaceCard'
import { DashboardShell } from '../components/dashboard/DashboardShell'
import { HourlyFlightsCard } from '../components/dashboard/HourlyFlightsCard'
import { HubActivityCard } from '../components/dashboard/HubCrewCards'
import { AircraftTypeCard, FlightStatusCard } from '../components/dashboard/InfoCards'
import { SheetSimpleHeader } from '../components/dashboard/SheetSimpleHeader'

export default function Screen2AircraftType() {
  return (
    <DashboardShell
      sheetTitle={<SheetSimpleHeader />}
      defaultSheetOpen
      sheetContent={
        <>
          <AircraftTypeCard defaultOpen />
          <FlightStatusCard />
          <HourlyFlightsCard />
          <AirSpaceCard />
          <HubActivityCard />
        </>
      }
    />
  )
}
