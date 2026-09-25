import { AirSpaceCard } from './AirSpaceCard'
import { HourlyFlightsCard } from './HourlyFlightsCard'
import { HubActivityCard } from './HubCrewCards'
import { AircraftTypeCard, FlightStatusCard } from './InfoCards'

export function FlightLayersPanel() {
  return (
    <>
      <AircraftTypeCard />
      <FlightStatusCard />
      <HourlyFlightsCard />
      <AirSpaceCard defaultOpen />
      <HubActivityCard />
    </>
  )
}
