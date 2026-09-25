// Illustrative NOTAMs for the map layer. There is no free, key-less public
// NOTAM API, so these are sample records (real airports/FIRs, made-up
// notices) shaped like a real feed: swap for FAA/EUROCONTROL/provider data.
export type NotamSeverity = 'high' | 'medium' | 'low'

export type Notam = {
  id: string
  category: string
  severity: NotamSeverity
  title: string
  location: string
  lat: number
  lng: number
  radiusNm: number
  validFrom: string
  validTo: string
  text: string
}

export const notams: Notam[] = [
  { id: 'A2041/26', category: 'Runway', severity: 'high', title: 'Runway 12L/30R closed', location: 'OMDB · Dubai Intl', lat: 25.2532, lng: 55.3644, radiusNm: 6, validFrom: '25 SEP 22:00Z', validTo: '26 SEP 03:00Z', text: 'RWY 12L/30R CLSD FOR RESURFACING. RWY 12R/30L AVBL FOR ALL OPS. EXPECT DELAYS.' },
  { id: 'A2055/26', category: 'Airspace', severity: 'high', title: 'Military exercise, FL000-FL300', location: 'OIIX · Tehran FIR', lat: 32.4, lng: 53.7, radiusNm: 90, validFrom: '25 SEP 04:00Z', validTo: '27 SEP 16:00Z', text: 'MIL EXERCISE. AIRSPACE RESTRICTED WITHIN 90NM OF 3224N05342E, SFC-FL300. ROUTE CLEAR.' },
  { id: 'A1907/26', category: 'Navaid', severity: 'medium', title: 'DXB VOR/DME unserviceable', location: 'OMDB · Dubai Intl', lat: 25.2, lng: 55.5, radiusNm: 25, validFrom: '24 SEP 08:00Z', validTo: '30 SEP 12:00Z', text: 'VOR/DME DXB 114.9MHZ U/S DUE MAINTENANCE. USE ALTERNATE NAVAIDS.' },
  { id: 'A0918/26', category: 'Airport', severity: 'medium', title: 'Reduced ILS availability', location: 'OERK · Riyadh', lat: 24.9576, lng: 46.6988, radiusNm: 10, validFrom: '25 SEP 00:00Z', validTo: '28 SEP 23:59Z', text: 'ILS RWY 15L DOWNGRADED TO CAT I. LOW VISIBILITY OPS SUSPENDED.' },
  { id: 'A3310/26', category: 'Airspace', severity: 'high', title: 'Temporary danger area (rocket launch)', location: 'OEJD · Jeddah FIR', lat: 21.3, lng: 39.0, radiusNm: 45, validFrom: '26 SEP 01:00Z', validTo: '26 SEP 05:00Z', text: 'TEMPO DANGER AREA ACT DUE LAUNCH ACTIVITY. SFC-UNL. AVOID.' },
  { id: 'A0774/26', category: 'Obstacle', severity: 'low', title: 'Crane erected near final', location: 'OTHH · Doha Hamad', lat: 25.2731, lng: 51.6081, radiusNm: 4, validFrom: '20 SEP 00:00Z', validTo: '20 OCT 00:00Z', text: 'CRANE 412FT AGL ERECTED 2.1NM SE OF THR RWY 16R. LIT.' },
  { id: 'A1266/26', category: 'Airport', severity: 'medium', title: 'Apron works, stands limited', location: 'HECA · Cairo Intl', lat: 30.1219, lng: 31.4056, radiusNm: 5, validFrom: '25 SEP 05:00Z', validTo: '05 OCT 18:00Z', text: 'STANDS 41-47 CLSD. TAXIWAY L RESTRICTED TO CODE C.' },
  { id: 'A0532/26', category: 'Airspace', severity: 'medium', title: 'UAS operations near airport', location: 'OMDW · Al Maktoum', lat: 24.8967, lng: 55.1614, radiusNm: 8, validFrom: '25 SEP 00:00Z', validTo: '25 SEP 23:59Z', text: 'UNMANNED AIRCRAFT OPS SFC-400FT AGL WI 8NM OF ARP. EXERCISE CAUTION.' },
  { id: 'A2210/26', category: 'Airport', severity: 'high', title: 'Airport closed 0100-0400Z', location: 'OYSN · Sana\'a', lat: 15.4763, lng: 44.2197, radiusNm: 12, validFrom: '25 SEP 01:00Z', validTo: '25 SEP 04:00Z', text: 'AD CLSD TO ALL TFC EXC EMERGENCY. NO ALTERNATE SERVICES AVBL.' },
  { id: 'A0349/26', category: 'Navaid', severity: 'low', title: 'GNSS interference reported', location: 'OKAC · Kuwait FIR', lat: 29.24, lng: 47.97, radiusNm: 60, validFrom: '22 SEP 00:00Z', validTo: '31 OCT 23:59Z', text: 'GPS SIGNAL DEGRADATION REPORTED. CREWS REPORT LOSS OF NAV INTEGRITY. USE CONVENTIONAL NAV.' },
]
