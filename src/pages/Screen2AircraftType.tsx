import { AirSpaceCard } from '../components/dashboard/AirSpaceCard'
import { DashboardShell } from '../components/dashboard/DashboardShell'
import { HubActivityCard } from '../components/dashboard/HubCrewCards'
import { AircraftTypeCard, FlightStatusCard } from '../components/dashboard/InfoCards'
import { SheetSimpleHeader } from '../components/dashboard/SheetSimpleHeader'
import { Sheet } from '../components/ui/Sheet'

export default function Screen2AircraftType() {
  return (
    <DashboardShell narrowSearch sheetOpen>
      <Sheet open title={<SheetSimpleHeader />}>
        <AircraftTypeCard defaultOpen />
        <FlightStatusCard />
        <AirSpaceCard />
        <HubActivityCard />
      </Sheet>
    </DashboardShell>
  )
}
