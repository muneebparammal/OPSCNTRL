import { AirSpaceCard } from '../components/dashboard/AirSpaceCard'
import { DashboardShell } from '../components/dashboard/DashboardShell'
import { HubActivityCard } from '../components/dashboard/HubCrewCards'
import { AircraftTypeCard, FlightStatusCard } from '../components/dashboard/InfoCards'
import { SheetSimpleHeader } from '../components/dashboard/SheetSimpleHeader'

export default function Screen3FlightStatus() {
  return (
    <DashboardShell
      sheetTitle={<SheetSimpleHeader />}
      sheetContent={
        <>
          <AircraftTypeCard />
          <FlightStatusCard defaultOpen />
          <AirSpaceCard />
          <HubActivityCard />
        </>
      }
    />
  )
}
