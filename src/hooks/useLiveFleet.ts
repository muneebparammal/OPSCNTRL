import { useEffect, useState } from 'react'

export type LiveAircraft = {
  id: string
  callsign: string
  lng: number
  lat: number
  heading: number
  altitude: number | null
  velocity: number | null
  onGround: boolean
  verticalRate: number | null
}

export type LiveFleetStatus = 'connecting' | 'live' | 'error'

// Gulf / Middle East region, matching the OPS Control map's default extent.
const BBOX = { lamin: 5, lomin: 20, lamax: 38, lomax: 75 }

// OpenSky's anonymous tier asks for no more than one bounding-box request
// roughly every 10s; poll a bit more conservatively to stay well clear of it.
const POLL_INTERVAL_MS = 20_000
const MAX_MARKERS = 150

type OpenSkyResponse = {
  states: (string | number | boolean | null)[][] | null
}

function parseStates(states: OpenSkyResponse['states']): LiveAircraft[] {
  if (!states) return []
  return states
    .filter((s) => s[5] != null && s[6] != null)
    .slice(0, MAX_MARKERS)
    .map((s) => ({
      id: String(s[0]),
      callsign: String(s[1] ?? '').trim() || String(s[0]),
      lng: Number(s[5]),
      lat: Number(s[6]),
      heading: Number(s[10] ?? 0),
      altitude: s[7] != null ? Number(s[7]) : null,
      velocity: s[9] != null ? Number(s[9]) : null,
      onGround: Boolean(s[8]),
      verticalRate: s[11] != null ? Number(s[11]) : null,
    }))
}

export function useLiveFleet() {
  const [aircraft, setAircraft] = useState<LiveAircraft[]>([])
  const [status, setStatus] = useState<LiveFleetStatus>('connecting')
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  useEffect(() => {
    let cancelled = false
    let timer: number

    async function poll() {
      try {
        const { lamin, lomin, lamax, lomax } = BBOX
        // Relative path, proxied by the dev server (see vite.config.ts) —
        // OpenSky doesn't send CORS headers, so the browser can't call it
        // directly.
        const url = `/opensky-api/states/all?lamin=${lamin}&lomin=${lomin}&lamax=${lamax}&lomax=${lomax}`
        const res = await fetch(url)
        if (!res.ok) throw new Error(`OpenSky responded ${res.status}`)
        const data: OpenSkyResponse = await res.json()
        if (cancelled) return
        setAircraft(parseStates(data.states))
        setStatus('live')
        setLastUpdated(new Date())
      } catch {
        if (!cancelled) setStatus('error')
      } finally {
        if (!cancelled) timer = window.setTimeout(poll, POLL_INTERVAL_MS)
      }
    }

    poll()
    return () => {
      cancelled = true
      window.clearTimeout(timer)
    }
  }, [])

  return { aircraft, status, lastUpdated }
}
