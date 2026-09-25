import { AirSpaceCard } from './AirSpaceCard'
import { HourlyFlightsCard } from './HourlyFlightsCard'
import { HubWaveCard } from './HubWaveCard'
import { HubActivityCard } from './HubCrewCards'
import { AircraftTypeCard, FlightStatusCard } from './InfoCards'

export function FlightLayersPanel() {
  return (
    <>
      <AircraftTypeCard />
      <FlightStatusCard />
      <HourlyFlightsCard />
      <HubWaveCard />
      <AirSpaceCard defaultOpen />
      <HubActivityCard />
    </>
  )
}
