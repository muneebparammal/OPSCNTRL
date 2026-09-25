// ADS-B carries no aircraft type, schedule or delay information, so the type,
// status and scheduled-hour attributes used by the map filters are derived
// deterministically from the aircraft id (stable across polls). Status also
// uses real telemetry (on-ground / vertical rate). Replace with a schedule
// provider when one is available.
export const AIRCRAFT_TYPES = ['A380', 'B777-300ER', 'B787-9', 'Other'] as const
export const FLIGHT_STATUSES = ['On Time', 'Delayed', 'Boarding', 'Departed'] as const

function hash(s: string) {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) & 0x7fffffff
  return h
}

export type FlightAttrs = { type: string; status: string; hour: number }

export function flightAttrs(
  id: string,
  onGround: boolean,
  verticalRate: number | null,
): FlightAttrs {
  const h = hash(id)
  let status: string
  if (onGround) status = 'Boarding'
  else if (verticalRate != null && verticalRate > 1) status = 'Departed'
  else status = h % 3 === 0 ? 'Delayed' : 'On Time'
  return { type: AIRCRAFT_TYPES[h % AIRCRAFT_TYPES.length], status, hour: hash(`${id}h`) % 24 }
}
