export type FirRegion = {
  id: string
  name: string
  count: number
  lat: number
  lng: number
  /** [minLng, minLat, maxLng, maxLat] — the real boundary's extent, for fitBounds */
  bbox: [number, number, number, number]
}

// All FIRs whose real boundary overlaps the map's default view extent
// (lon 20-75, lat 5-38). Centroids/bboxes computed from the actual polygons
// in firBoundaries.geojson (VATSIM VATSpy project, CC BY-SA 4.0). Flight
// counts are illustrative — not a live count.
export const firRegions: FirRegion[] = [
  { id: 'FCCC', name: 'FCCC FIR', count: 31, lat: 4.238, lng: 15.0175, bbox: [6.5833, -5.5, 27.4667, 8.0] },
  { id: 'FSSS', name: 'FSSS FIR', count: 19, lat: -4.6008, lng: 48.1254, bbox: [44.0, -10.3018, 60.0, 10.7] },
  { id: 'FTTT', name: 'FTTT FIR', count: 21, lat: 11.9306, lng: 17.9254, bbox: [11.5, 8.0, 24.9667, 22.0] },
  { id: 'FZZA', name: 'FZZA FIR', count: 35, lat: 0.115, lng: 23.3828, bbox: [12.2, -12.0016, 31.0007, 5.3667] },
  { id: 'HAAA', name: 'HAAA FIR', count: 47, lat: 11.8036, lng: 41.4966, bbox: [33.0007, 4.0, 48.0, 14.8875] },
  { id: 'HCSM', name: 'HCSM FIR', count: 12, lat: 6.8328, lng: 44.5331, bbox: [41.0, -2.0026, 60.0, 12.184] },
  { id: 'HECC', name: 'HECC FIR', count: 47, lat: 30.5041, lng: 27.7729, bbox: [24.1667, 22.0, 38.0, 34.0] },
  { id: 'HHAA', name: 'HHAA FIR', count: 46, lat: 13.8091, lng: 40.8803, bbox: [36.45, 12.3633, 43.2, 20.0] },
  { id: 'HJJJ', name: 'HJJJ FIR', count: 17, lat: 6.8685, lng: 28.0137, bbox: [23.4458, 3.9969, 36.0008, 10.8214] },
  { id: 'HLLL', name: 'HLLL FIR', count: 21, lat: 30.3196, lng: 22.6225, bbox: [9.3833, 19.5, 25.1511, 34.3333] },
  { id: 'HSSS', name: 'HSSS FIR', count: 21, lat: 10.2026, lng: 25.957, bbox: [21.825, 3.9969, 38.5, 22.0011] },
  { id: 'LCCC', name: 'LCCC FIR', count: 44, lat: 34.0334, lng: 34.3227, bbox: [30.0, 31.8273, 35.7083, 36.0833] },
  { id: 'LGGG', name: 'LGGG FIR', count: 39, lat: 39.7956, lng: 24.3127, bbox: [19.0, 33.5, 30.0, 41.7448] },
  { id: 'LLLL', name: 'LLLL FIR', count: 8, lat: 30.8195, lng: 34.9523, bbox: [33.9731, 29.4667, 35.6672, 33.2877] },
  { id: 'LLPT', name: 'LLPT FIR', count: 8, lat: 32.4148, lng: 35.1827, bbox: [33.9731, 31.7012, 35.6672, 33.2877] },
  { id: 'LLSC', name: 'LLSC FIR', count: 25, lat: 30.3876, lng: 34.8703, bbox: [33.9834, 29.4667, 35.5233, 31.9386] },
  { id: 'LMMM', name: 'LMMM FIR', count: 36, lat: 36.4902, lng: 14.2576, bbox: [11.5, 34.3333, 23.5833, 37.3457] },
  { id: 'LTAA', name: 'LTAA FIR', count: 31, lat: 39.0545, lng: 38.8834, bbox: [29.3982, 35.775, 44.7999, 42.8] },
  { id: 'LTBB', name: 'LTBB FIR', count: 17, lat: 39.6036, lng: 27.8794, bbox: [25.6, 36.0667, 31.5508, 42.275] },
  { id: 'LTXX', name: 'LTXX FIR', count: 8, lat: 39.195, lng: 34.935, bbox: [25.6, 35.775, 44.7999, 42.8] },
  { id: 'OAKX', name: 'OAKX FIR', count: 30, lat: 35.8367, lng: 68.7936, bbox: [60.4664, 29.4025, 74.8833, 38.4833] },
  { id: 'OBBB', name: 'OBBB FIR', count: 14, lat: 26.2998, lng: 51.0067, bbox: [48.8662, 25.5383, 53.95, 28.7122] },
  { id: 'OEJD', name: 'OEJD FIR', count: 44, lat: 23.6765, lng: 43.7884, bbox: [34.4556, 15.6653, 55.6667, 32.1539] },
  { id: 'OEJN', name: 'OEJN FIR', count: 30, lat: 21.9766, lng: 39.7443, bbox: [37.3653, 19.195, 41.364, 23.7567] },
  { id: 'OERD', name: 'OERD FIR', count: 25, lat: 26.7427, lng: 44.2838, bbox: [34.6925, 22.8043, 50.9092, 32.1539] },
  { id: 'OERK', name: 'OERK FIR', count: 46, lat: 24.0915, lng: 46.4088, bbox: [44.4643, 22.8043, 48.995, 26.2333] },
  { id: 'OIIX', name: 'OIIX FIR', count: 30, lat: 34.6432, lng: 51.8705, bbox: [44.0166, 24.6613, 63.305, 39.7833] },
  { id: 'OJAC', name: 'OJAC FIR', count: 40, lat: 30.9288, lng: 35.8275, bbox: [34.9335, 29.1917, 39.301, 33.3746] },
  { id: 'OKAC', name: 'OKAC FIR', count: 26, lat: 29.2928, lng: 47.9537, bbox: [46.5553, 28.2361, 49.6691, 30.1036] },
  { id: 'OLBB', name: 'OLBB FIR', count: 25, lat: 33.8595, lng: 35.5091, bbox: [34.5432, 33.0646, 36.5836, 34.6389] },
  { id: 'OMAE', name: 'OMAE FIR', count: 23, lat: 25.1673, lng: 54.4893, bbox: [51.7833, 22.6432, 56.8616, 26.35] },
  { id: 'OOMM', name: 'OOMM FIR', count: 40, lat: 22.6183, lng: 56.5681, bbox: [52.0, 15.6667, 64.4953, 26.6833] },
  { id: 'OPKR', name: 'OPKR FIR', count: 13, lat: 26.6054, lng: 66.565, bbox: [60.8644, 23.4962, 71.0945, 30.0033] },
  { id: 'OPLR', name: 'OPLR FIR', count: 41, lat: 33.9826, lng: 73.0948, bbox: [66.2589, 27.1167, 77.85, 37.0917] },
  { id: 'ORBB', name: 'ORBB FIR', count: 37, lat: 33.5805, lng: 45.0739, bbox: [38.7936, 29.0667, 48.75, 37.35] },
  { id: 'OSTT', name: 'OSTT FIR', count: 33, lat: 34.8473, lng: 37.3412, bbox: [35.4833, 32.3, 42.3417, 37.2583] },
  { id: 'OTDF', name: 'OTDF FIR', count: 12, lat: 25.585, lng: 51.3239, bbox: [50.5645, 24.4708, 53.95, 26.7441] },
  { id: 'OYSC', name: 'OYSC FIR', count: 20, lat: 16.5195, lng: 46.4242, bbox: [41.6631, 11.7621, 60.0, 19.8] },
  { id: 'UBBA', name: 'UBBA FIR', count: 44, lat: 40.3678, lng: 46.2493, bbox: [44.7691, 37.9, 51.5, 42.6333] },
  { id: 'UTAA', name: 'UTAA FIR', count: 32, lat: 37.564, lng: 59.0099, bbox: [55.5, 35.6, 61.8967, 40.4041] },
  { id: 'UTAK', name: 'UTAK FIR', count: 24, lat: 40.1302, lng: 54.5313, bbox: [51.5, 37.3333, 57.6167, 42.35] },
  { id: 'UTAV', name: 'UTAV FIR', count: 9, lat: 37.3179, lng: 63.7038, bbox: [60.25, 35.1333, 66.6667, 40.4727] },
  { id: 'UTDD', name: 'UTDD FIR', count: 43, lat: 39.1387, lng: 70.0629, bbox: [67.385, 36.6833, 75.2333, 41.0367] },
  { id: 'UZSD', name: 'UZSD FIR', count: 13, lat: 38.7521, lng: 67.203, bbox: [62.1598, 37.1833, 68.4023, 41.3946] },
  { id: 'VAAH', name: 'VAAH FIR', count: 27, lat: 23.2162, lng: 71.695, bbox: [68.3468, 20.8008, 76.009, 25.4125] },
  { id: 'VABB', name: 'VABB FIR', count: 24, lat: 19.7002, lng: 72.4675, bbox: [68.8578, 16.2833, 76.009, 21.5261] },
  { id: 'VABF', name: 'VABF FIR', count: 16, lat: 19.8012, lng: 71.813, bbox: [59.9996, -6.0, 82.0, 25.4125] },
  { id: 'VIAR', name: 'VIAR FIR', count: 14, lat: 30.9964, lng: 74.7147, bbox: [72.9708, 29.0167, 76.9124, 32.1624] },
  { id: 'VIDF', name: 'VIDF FIR', count: 12, lat: 30.6702, lng: 77.0799, bbox: [69.4453, 24.8639, 82.748, 35.5167] },
  { id: 'VIJP', name: 'VIJP FIR', count: 18, lat: 25.4419, lng: 74.1066, bbox: [72.9286, 24.9996, 76.3786, 27.3694] },
  { id: 'VIUX', name: 'VIUX FIR', count: 40, lat: 33.5879, lng: 77.4807, bbox: [73.7776, 31.7331, 79.3, 35.5167] },
  { id: 'VOCI', name: 'VOCI FIR', count: 17, lat: 10.9524, lng: 76.7045, bbox: [74.3333, 9.5, 77.7667, 12.7583] },
  { id: 'VOMF', name: 'VOMF FIR', count: 31, lat: 13.2709, lng: 79.5015, bbox: [71.9995, 5.9996, 94.4167, 19.7167] },
  { id: 'VOML', name: 'VOML FIR', count: 32, lat: 14.1615, lng: 75.1766, bbox: [71.9995, 10.25, 77.5167, 16.6667] },
  { id: 'VOTV', name: 'VOTV FIR', count: 43, lat: 9.7768, lng: 76.176, bbox: [71.9995, 6.0, 80.0, 11.3583] },
  { id: 'VRMF', name: 'VRMF FIR', count: 33, lat: 2.9658, lng: 73.4999, bbox: [68.0, -6.0, 78.0, 7.5018] },
  { id: 'ZWUQ', name: 'ZWUQ FIR', count: 21, lat: 39.3845, lng: 80.9872, bbox: [73.6, 30.05, 96.3372, 49.1833] },
]
