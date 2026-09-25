import { DashboardShell } from '../components/dashboard/DashboardShell'
import { FlightDetailHeader } from '../components/dashboard/FlightDetailHeader'
import { FlightTimesCard } from '../components/dashboard/FlightTimesCard'
import { CrewComplementCard } from '../components/dashboard/HubCrewCards'
import { FlightInfoCard } from '../components/dashboard/InfoCards'
import { PassengersCard } from '../components/dashboard/PassengersCard'

export default function Screen6FlightDetailExpanded() {
  return (
    <DashboardShell
      sheetTitle={(onClose) => <FlightDetailHeader onClose={onClose} />}
      hideSheetClose
      defaultSheetOpen
      sheetContent={
        <>
          <FlightInfoCard defaultOpen />
          <FlightTimesCard defaultOpen />
          <PassengersCard defaultOpen />
          <CrewComplementCard />
        </>
      }
    />
  )
}
