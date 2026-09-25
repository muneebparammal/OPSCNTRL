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
  icao24: string
  squawk: string | null
  positionTime: number | null
}

export type LiveFleetStatus = 'connecting' | 'live' | 'error'

// Gulf / Middle East region, matching the OPS Control map's default extent.
const BBOX = { lamin: 5, lomin: 20, lamax: 38, lomax: 75 }

// OpenSky's anonymous tier asks for no more than one bounding-box request
// roughly every 10s; poll a bit more conservatively to stay well clear of it.
const POLL_INTERVAL_MS = 20_000
const MAX_MARKERS = 150

// In dev, Vite's server proxy at /opensky-api handles CORS (see
// vite.config.ts). In production (a static host with no server of its own,
// e.g. GitHub Pages) that proxy doesn't exist, so VITE_OPENSKY_PROXY_URL
// must point at an external proxy — see cloudflare-worker/. Left unset, the
// live feed will fail to fetch and the map falls back to simulated traffic.
const PROXY_BASE = import.meta.env.VITE_OPENSKY_PROXY_URL || '/opensky-api'

type OpenSkyResponse = {
  states: (string | number | boolean | null)[][] | null
}

function parseStates(states: OpenSkyResponse['states'], emiratesOnly: boolean): LiveAircraft[] {
  if (!states) return []
  const usable = states.filter((s) => s[5] != null && s[6] != null)
  return (emiratesOnly
    ? usable.filter((s) => String(s[1] ?? '').trim().toUpperCase().startsWith('UAE'))
    : usable.slice(0, MAX_MARKERS)
  )
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
      icao24: String(s[0]),
      squawk: s[14] != null ? String(s[14]) : null,
      positionTime: s[3] != null ? Number(s[3]) : s[4] != null ? Number(s[4]) : null,
    }))
}

// emiratesOnly polls the whole world (no bounding box) and keeps only callsigns
// with Emirates' ICAO prefix, UAE. enabled=false skips polling entirely.
export function useLiveFleet({ emiratesOnly = false, enabled = true } = {}) {
  const [aircraft, setAircraft] = useState<LiveAircraft[]>([])
  const [status, setStatus] = useState<LiveFleetStatus>('connecting')
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  useEffect(() => {
    if (!enabled) return
    let cancelled = false
    let timer: number

    async function poll() {
      try {
        const { lamin, lomin, lamax, lomax } = BBOX
        const url = emiratesOnly
          ? `${PROXY_BASE}/states/all`
          : `${PROXY_BASE}/states/all?lamin=${lamin}&lomin=${lomin}&lamax=${lamax}&lomax=${lomax}`
        const res = await fetch(url)
        if (!res.ok) throw new Error(`OpenSky responded ${res.status}`)
        const data: OpenSkyResponse = await res.json()
        if (cancelled) return
        setAircraft(parseStates(data.states, emiratesOnly))
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
  }, [emiratesOnly, enabled])

  return { aircraft, status, lastUpdated }
}
