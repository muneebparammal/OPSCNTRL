import { AIRCRAFT_TYPES } from './flightAttributes'

// Illustrative DXB hub-wave schedule. Real hub banks need a schedule feed
// (e.g. the airline's ops system or a provider); this generates a repeatable,
// wave-shaped demo timetable so the UI can be built and reviewed.
export type WaveFlight = {
  flight: string
  time: string
  direction: 'departure' | 'arrival'
  other: string
  type: string
}

export type WaveHour = {
  label: string
  hour: number
  departures: WaveFlight[]
  arrivals: WaveFlight[]
}

const PLACES = [
  'LHR',
  'JFK',
  'SYD',
  'BOM',
  'SIN',
  'BKK',
  'DEL',
  'CAI',
  'JED',
  'KHI',
  'MNL',
  'CDG',
  'FRA',
  'MEL',
  'CPT',
  'IST',
  'LAX',
  'PEK',
]

// Emirates-style banks: arrivals bunch up before departure banks.
const DEP_SHAPE = [4, 3, 3, 4, 5, 8, 12, 14, 11, 8, 6, 5, 6, 8, 10, 12, 13, 10, 8, 6, 5, 4, 3, 3]
const ARR_SHAPE = [6, 5, 4, 3, 4, 7, 11, 13, 10, 7, 5, 6, 9, 12, 13, 11, 8, 6, 5, 6, 8, 9, 8, 7]

function rng(seed: number) {
  let s = seed
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff
    return s / 0x7fffffff
  }
}

export function gstHour(now = new Date()) {
  return Number(
    new Intl.DateTimeFormat('en-GB', {
      hour: '2-digit',
      hourCycle: 'h23',
      timeZone: 'Asia/Dubai',
    }).format(now),
  )
}

export function buildHubWave(startHour: number, hours = 12): WaveHour[] {
  return Array.from({ length: hours }, (_, i) => {
    const hour = (startHour + i) % 24
    const rand = rng(hour * 977 + 13)
    const make = (direction: WaveFlight['direction'], n: number): WaveFlight[] =>
      Array.from({ length: n }, () => {
        const minute = Math.floor(rand() * 12) * 5
        const place = PLACES[Math.floor(rand() * PLACES.length)]
        return {
          flight: `EK${String(Math.floor(rand() * 900) + 100)}`,
          time: `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`,
          direction,
          other: place,
          type: AIRCRAFT_TYPES[Math.floor(rand() * AIRCRAFT_TYPES.length)],
        }
      }).sort((a, b) => a.time.localeCompare(b.time))
    const dep = DEP_SHAPE[hour] + Math.floor(rand() * 3)
    const arr = ARR_SHAPE[hour] + Math.floor(rand() * 3)
    return {
      label: `${String(hour).padStart(2, '0')}:00–${String((hour + 1) % 24).padStart(2, '0')}:00`,
      hour,
      departures: make('departure', dep),
      arrivals: make('arrival', arr),
    }
  })
}
