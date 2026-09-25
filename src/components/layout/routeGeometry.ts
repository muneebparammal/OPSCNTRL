type LngLat = [number, number]

const R_KM = 6371
const rad = (d: number) => (d * Math.PI) / 180
const deg = (r: number) => (r * 180) / Math.PI

export function greatCircle(a: LngLat, b: LngLat, steps = 64): LngLat[] {
  const [lng1, lat1, lng2, lat2] = [rad(a[0]), rad(a[1]), rad(b[0]), rad(b[1])]
  const d =
    2 *
    Math.asin(
      Math.sqrt(
        Math.sin((lat2 - lat1) / 2) ** 2 +
          Math.cos(lat1) * Math.cos(lat2) * Math.sin((lng2 - lng1) / 2) ** 2,
      ),
    )
  if (d === 0) return [a, b]
  const pts: LngLat[] = []
  for (let i = 0; i <= steps; i++) {
    const f = i / steps
    const A = Math.sin((1 - f) * d) / Math.sin(d)
    const B = Math.sin(f * d) / Math.sin(d)
    const x = A * Math.cos(lat1) * Math.cos(lng1) + B * Math.cos(lat2) * Math.cos(lng2)
    const y = A * Math.cos(lat1) * Math.sin(lng1) + B * Math.cos(lat2) * Math.sin(lng2)
    const z = A * Math.sin(lat1) + B * Math.sin(lat2)
    pts.push([deg(Math.atan2(y, x)), deg(Math.atan2(z, Math.sqrt(x * x + y * y)))])
  }
  return pts
}

export function bearing(a: LngLat, b: LngLat): number {
  const [lng1, lat1, lng2, lat2] = [rad(a[0]), rad(a[1]), rad(b[0]), rad(b[1])]
  const y = Math.sin(lng2 - lng1) * Math.cos(lat2)
  const x =
    Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(lng2 - lng1)
  return (deg(Math.atan2(y, x)) + 360) % 360
}

export function destination(from: LngLat, bearingDeg: number, distKm: number): LngLat {
  const [lng1, lat1, brg, d] = [rad(from[0]), rad(from[1]), rad(bearingDeg), distKm / R_KM]
  const lat2 = Math.asin(
    Math.sin(lat1) * Math.cos(d) + Math.cos(lat1) * Math.sin(d) * Math.cos(brg),
  )
  const lng2 =
    lng1 +
    Math.atan2(
      Math.sin(brg) * Math.sin(d) * Math.cos(lat1),
      Math.cos(d) - Math.sin(lat1) * Math.sin(lat2),
    )
  return [deg(lng2), deg(lat2)]
}

const angleDiff = (a: number, b: number) => Math.abs(((a - b + 540) % 360) - 180)

// Estimated route for an aircraft on the Emirates hub-and-spoke network: one
// end of the trip is assumed to be the hub. The hub-side segment is drawn
// solid; the other side is a dashed projection along the current heading,
// since ADS-B carries no flight plan.
export function estimateRoute(pos: { lng: number; lat: number; heading: number }, hub: LngLat) {
  const here: LngLat = [pos.lng, pos.lat]
  const inbound = angleDiff(pos.heading, bearing(here, hub)) < 90
  const projection = (h: number) => [here, destination(here, h, 2500)]
  return inbound
    ? {
        inbound,
        solid: greatCircle(here, hub),
        dashed: projection((pos.heading + 180) % 360).reverse(),
      }
    : { inbound, solid: greatCircle(hub, here), dashed: projection(pos.heading) }
}
