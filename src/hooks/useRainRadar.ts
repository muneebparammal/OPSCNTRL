import { useEffect, useState } from 'react'

const REFRESH_MS = 10 * 60 * 1000 // RainViewer publishes a new frame every ~10 min

// RainViewer's public API is free and requires no API key. Returns a tile
// URL template for the latest available radar frame, or null until the
// first successful fetch.
export function useRainRadar() {
  const [tileUrl, setTileUrl] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    let timer: number

    async function poll() {
      try {
        const res = await fetch('https://api.rainviewer.com/public/weather-maps.json')
        if (!res.ok) throw new Error(`RainViewer responded ${res.status}`)
        const data = await res.json()
        const frames = data.radar?.past ?? []
        const latest = frames[frames.length - 1]
        if (latest && !cancelled) {
          setTileUrl(`${data.host}${latest.path}/256/{z}/{x}/{y}/2/1_1.png`)
        }
      } catch {
        // keep the last known-good tile URL on failure
      } finally {
        if (!cancelled) timer = window.setTimeout(poll, REFRESH_MS)
      }
    }

    poll()
    return () => {
      cancelled = true
      window.clearTimeout(timer)
    }
  }, [])

  return tileUrl
}
