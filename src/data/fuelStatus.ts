// Fuel / weight record per flight (FS03-style). EK255 BCN-MEX 08 Jun 2026 is the
// supplied sample (nothing populated yet). Other flights get repeatable demo
// values until a real fuel feed is connected.
export type FuelStatus = {
  flight: string
  date: string
  dep: string | null
  arr: string | null
  unit: 'KG'
  density: number
  fuelDepartActual: number
  fuelArriveActual: number
  fuelOnBoard: number
  plannedFuel: number
  plannedBurn: number
  towEstimate: number
  towActual: number
  zfwEstimate: number
  zfwActual: number
  demo: boolean
}

const SAMPLE: FuelStatus = {
  flight: 'EK255',
  date: '08 Jun 2026',
  dep: 'BCN',
  arr: 'MEX',
  unit: 'KG',
  density: 1.24533,
  fuelDepartActual: 0,
  fuelArriveActual: 0,
  fuelOnBoard: 0,
  plannedFuel: 0,
  plannedBurn: 0,
  towEstimate: 0,
  towActual: 0,
  zfwEstimate: 0,
  zfwActual: 0,
  demo: false,
}

function hash(s: string) {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) & 0x7fffffff
  return h
}

export function getFuelStatus(flight: string): FuelStatus {
  if (flight === SAMPLE.flight) return SAMPLE
  const h = hash(flight)
  const r = (min: number, max: number, k: number) => min + ((h >> k) % (max - min + 1))
  const round = (n: number) => Math.round(n / 10) * 10
  const planned = round(r(38000, 118000, 1))
  const burn = round(planned * 0.78)
  const departFuel = round(planned + r(0, 1500, 3))
  const onBoard = round(departFuel * (0.35 + r(0, 40, 5) / 100))
  const zfw = round(r(150000, 260000, 7))
  return {
    flight,
    date: '',
    dep: null,
    arr: null,
    unit: 'KG',
    density: 1.24533,
    fuelDepartActual: departFuel,
    fuelArriveActual: 0,
    fuelOnBoard: onBoard,
    plannedFuel: planned,
    plannedBurn: burn,
    towEstimate: round(zfw + planned),
    towActual: round(zfw + departFuel),
    zfwEstimate: zfw,
    zfwActual: round(zfw + r(-800, 800, 9)),
    demo: true,
  }
}
