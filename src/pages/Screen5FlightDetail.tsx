import { ConnectingPassengersCard } from '../components/dashboard/ConnectingPassengersCard'
import { DashboardShell } from '../components/dashboard/DashboardShell'
import { FlightDetailHeader } from '../components/dashboard/FlightDetailHeader'
import { FlightTimesCard } from '../components/dashboard/FlightTimesCard'
import { CrewComplementCard } from '../components/dashboard/HubCrewCards'
import { FlightInfoCard } from '../components/dashboard/InfoCards'
import { PassengersCard } from '../components/dashboard/PassengersCard'
import { Sheet } from '../components/ui/Sheet'

export default function Screen5FlightDetail() {
  return (
    <DashboardShell narrowSearch sheetOpen>
      <Sheet open title={<FlightDetailHeader />} hideDefaultClose>
        <FlightInfoCard defaultOpen />
        <FlightTimesCard />
        <PassengersCard />
        <ConnectingPassengersCard />
        <CrewComplementCard />
      </Sheet>
    </DashboardShell>
  )
}
