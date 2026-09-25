import blueA380 from '../../assets/icons/blue-4engine.svg'
import yellowA380 from '../../assets/icons/yellow-4engine.svg'

const A380_ART: Partial<Record<string, string>> = { departure: blueA380, arrival: yellowA380 }

export const FLOW_COLORS = {
  departure: '#1c80cf',
  arrival: '#419544',
  ground: '#607d8b',
} as const

export type FlowKind = keyof typeof FLOW_COLORS

// Top-down airliner silhouettes drawn as SVG so they stay sharp at any size
// and rotation (nose points up at heading 0).
function TwinEngine() {
  return (
    <>
      <path d="M32 2c2 0 3 4 3 9v14l25 16v5L35 38v12l9 6v4l-12-3-12 3v-4l9-6V38L4 46v-5l25-16V11c0-5 1-9 3-9Z" />
      <rect x="40" y="33" width="5" height="10" rx="2.5" />
      <rect x="19" y="33" width="5" height="10" rx="2.5" />
    </>
  )
}

function FourEngine() {
  return (
    <>
      <path d="M32 1c2.5 0 3.5 4 3.5 9v13l27 17v6L35.5 37v12l10 6.5v4.5L32 57.5 18.5 60v-4.5L28.5 49V37L1.5 46v-6L28.5 23V10c0-5 1-9 3.5-9Z" />
      <rect x="38" y="30" width="5" height="10" rx="2.5" />
      <rect x="47" y="35.5" width="5" height="10" rx="2.5" />
      <rect x="21" y="30" width="5" height="10" rx="2.5" />
      <rect x="12" y="35.5" width="5" height="10" rx="2.5" />
    </>
  )
}

export function AircraftIcon({
  kind,
  fourEngine,
  heading,
  size,
}: {
  kind: FlowKind
  fourEngine: boolean
  heading: number
  size?: number
}) {
  const px = size ?? (fourEngine ? 34 : 22)
  const art = fourEngine ? A380_ART[kind] : undefined
  if (art) {
    // Supplied artwork points east, so rotate from heading - 90.
    return (
      <img
        src={art}
        alt=""
        width={px}
        height={px}
        draggable={false}
        style={{
          transform: `rotate(${heading - 90}deg)`,
          display: 'block',
          filter: 'drop-shadow(0 1px 1.5px rgba(0,0,0,0.35))',
        }}
      />
    )
  }
  return (
    <svg
      width={px}
      height={px}
      viewBox="0 0 64 64"
      fill={FLOW_COLORS[kind]}
      stroke="#fff"
      strokeWidth="2.5"
      strokeLinejoin="round"
      paintOrder="stroke"
      style={{
        transform: `rotate(${heading}deg)`,
        display: 'block',
        filter: 'drop-shadow(0 1px 1.5px rgba(0,0,0,0.35))',
      }}
    >
      {fourEngine ? <FourEngine /> : <TwinEngine />}
    </svg>
  )
}
