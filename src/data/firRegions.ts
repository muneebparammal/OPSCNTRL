export type FirRegion = {
  id: string
  name: string
  count: number
  lat: number
  lng: number
  /** [minLng, minLat, maxLng, maxLat] — the real boundary's extent, for fitBounds */
  bbox: [number, number, number, number]
}

// Centroids and bounding boxes computed from each region's real boundary
// polygon in firBoundaries.geojson (sourced from the VATSIM VATSpy
// project). Flight counts are illustrative.
export const firRegions: FirRegion[] = [
  {
    id: 'OMAE',
    name: 'OMAE FIR',
    count: 42,
    lat: 25.1673,
    lng: 54.4893,
    bbox: [51.7833, 22.6432, 56.8616, 26.35],
  }, // Abu Dhabi
  {
    id: 'OEJD',
    name: 'OEJD FIR',
    count: 31,
    lat: 23.6765,
    lng: 43.7884,
    bbox: [34.4556, 15.6653, 55.6667, 32.1539],
  }, // Jeddah
  {
    id: 'OOMM',
    name: 'OOMM FIR',
    count: 18,
    lat: 22.6183,
    lng: 56.5681,
    bbox: [52.0, 15.6667, 64.4953, 26.6833],
  }, // Muscat
  {
    id: 'OIIX',
    name: 'OIIX FIR',
    count: 27,
    lat: 34.6432,
    lng: 51.8705,
    bbox: [44.0166, 24.6613, 63.305, 39.7833],
  }, // Tehran
  {
    id: 'OPKR',
    name: 'OPKR FIR',
    count: 15,
    lat: 26.6054,
    lng: 66.565,
    bbox: [60.8644, 23.4962, 71.0945, 30.0033],
  }, // Karachi
  {
    id: 'VABF',
    name: 'VABF FIR',
    count: 22,
    lat: 19.8012,
    lng: 71.813,
    bbox: [59.9996, -6.0, 82.0, 25.4125],
  }, // Mumbai (oceanic — extends well over the Indian Ocean)
]
