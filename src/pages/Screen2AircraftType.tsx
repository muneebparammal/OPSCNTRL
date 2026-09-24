import { AirSpaceCard } from '../components/dashboard/AirSpaceCard'
import { DashboardShell } from '../components/dashboard/DashboardShell'
import { HubActivityCard } from '../components/dashboard/HubCrewCards'
import { AircraftTypeCard, FlightStatusCard } from '../components/dashboard/InfoCards'
import { SheetSimpleHeader } from '../components/dashboard/SheetSimpleHeader'

export default function Screen2AircraftType() {
  return (
    <DashboardShell
      sheetTitle={<SheetSimpleHeader />}
      sheetContent={
        <>
          <AircraftTypeCard defaultOpen />
          <FlightStatusCard />
          <AirSpaceCard />
          <HubActivityCard />
        </>
      }
    />
  )
}
