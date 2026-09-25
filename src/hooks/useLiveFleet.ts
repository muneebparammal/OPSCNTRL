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

// Worldwide snapshot; OpenSky's anonymous tier asks for no more than one
// request roughly every 10s, so poll conservatively.
const POLL_INTERVAL_MS = 30_000

// In dev, Vite's server proxy at /opensky-api handles CORS (see
// vite.config.ts). In production (a static host with no server of its own,
// e.g. GitHub Pages) that proxy doesn't exist, so VITE_OPENSKY_PROXY_URL
// must point at an external proxy — see cloudflare-worker/. Left unset, the
// live feed will fail to fetch and the map falls back to simulated traffic.
const PROXY_BASE = import.meta.env.VITE_OPENSKY_PROXY_URL || '/opensky-api'

type OpenSkyResponse = {
  states: (string | number | boolean | null)[][] | null
}

function parseStates(states: OpenSkyResponse['states']): LiveAircraft[] {
  if (!states) return []
  return states
    .filter((s) => s[5] != null && s[6] != null)
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

export function useLiveFleet({
  intervalMs = POLL_INTERVAL_MS,
  paused = false,
}: { intervalMs?: number; paused?: boolean } = {}) {
  const [aircraft, setAircraft] = useState<LiveAircraft[]>([])
  const [status, setStatus] = useState<LiveFleetStatus>('connecting')
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  useEffect(() => {
    if (paused) return
    let cancelled = false
    let timer: number

    async function poll() {
      try {
        const url = `${PROXY_BASE}/states/all`
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
        if (!cancelled) timer = window.setTimeout(poll, intervalMs)
      }
    }

    poll()
    return () => {
      cancelled = true
      window.clearTimeout(timer)
    }
  }, [intervalMs, paused])

  return { aircraft, status, lastUpdated }
}
