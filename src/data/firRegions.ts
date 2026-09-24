export type FirRegion = {
  id: string
  name: string
  count: number
  lat: number
  lng: number
}

// Approximate centers for each FIR's real-world ICAO region, used to fly
// the map to and highlight the selected region — illustrative radius/count,
// not official FIR boundary data.
export const firRegions: FirRegion[] = [
  { id: 'OMAE', name: 'OMAE FIR', count: 42, lat: 24.45, lng: 54.65 }, // Abu Dhabi
  { id: 'OEJD', name: 'OEJD FIR', count: 31, lat: 21.5, lng: 39.2 }, // Jeddah
  { id: 'OOMM', name: 'OOMM FIR', count: 18, lat: 23.6, lng: 58.2 }, // Muscat
  { id: 'OIIX', name: 'OIIX FIR', count: 27, lat: 35.7, lng: 51.4 }, // Tehran
  { id: 'OPKC', name: 'OPKC FIR', count: 15, lat: 24.9, lng: 67.0 }, // Karachi
  { id: 'VABF', name: 'VABF FIR', count: 22, lat: 19.1, lng: 72.9 }, // Mumbai
]
