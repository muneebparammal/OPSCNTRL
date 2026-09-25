import emiratesLogo from '../../assets/icons/airline-emirates.png'
import { Tooltip } from './Tooltip'

// Callsigns use the ICAO airline prefix (UAE = Emirates); show the IATA form.
export function displayCallsign(callsign: string) {
  return /^UAE\d/i.test(callsign) ? `EK${callsign.slice(3)}` : callsign
}

function AirlineBadge({ callsign }: { callsign: string }) {
  if (/^(UAE|EK)\d/i.test(callsign)) {
    return <img src={emiratesLogo} alt="Emirates" className="size-6 rounded-md" draggable={false} />
  }
  const code = callsign.slice(0, 3).toUpperCase()
  return (
    <span className="flex size-6 items-center justify-center rounded-md bg-fg-grey-blue text-[10px] font-bold">
      {code}
    </span>
  )
}

export function FlightTooltip({
  callsign,
  children,
}: {
  callsign: string
  children: React.ReactNode
}) {
  return (
    <Tooltip
      bubbleClassName="rounded-xl py-1.5 pr-3 pl-2 text-sm font-semibold"
      label={
        <span className="flex items-center gap-2">
          <AirlineBadge callsign={callsign} />
          {displayCallsign(callsign)}
        </span>
      }
    >
      {children}
    </Tooltip>
  )
}
