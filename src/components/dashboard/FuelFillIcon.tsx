import { useId } from 'react'

// Fuel drop that fills from the bottom according to `percent` (0-1).
export function FuelFillIcon({
  percent,
  color = 'var(--color-fg-blue)',
  size = 32,
}: {
  percent: number
  color?: string
  size?: number
}) {
  const id = useId()
  const p = Math.min(1, Math.max(0, percent))
  const top = 2.5
  const bottom = 21
  const y = bottom - p * (bottom - top)
  const path = 'M12 2.5c3.6 4.3 6.3 7.6 6.3 11.2a6.3 6.3 0 0 1-12.6 0C5.7 10.1 8.4 6.8 12 2.5Z'
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden className="shrink-0">
      <defs>
        <clipPath id={id}>
          <path d={path} />
        </clipPath>
      </defs>
      <path d={path} fill="var(--color-bg-tertiary)" />
      <g clipPath={`url(#${id})`}>
        <rect
          x="0"
          y={y}
          width="24"
          height={bottom - y + 3}
          fill={color}
          style={{ transition: 'y 500ms ease, height 500ms ease' }}
        />
      </g>
      <path
        d={path}
        fill="none"
        stroke="var(--color-fg-muted)"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  )
}
