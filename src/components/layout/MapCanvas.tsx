import { Plane } from 'lucide-react'
import { useMemo } from 'react'
import basemap from '../../assets/map/basemap.png'

type Aircraft = {
  top: number
  left: number
  rotate: number
  color: string
  size: number
}

// Static basemap + a data-driven overlay of live aircraft positions.
// Exact per-aircraft placement is flight-data driven in production, not a
// fixed design-time layout, so positions here are illustrative.
function useFleet(count: number): Aircraft[] {
  return useMemo(() => {
    const colors = ['#bfe3f5', '#38bdf8', '#fbbf24', '#ffffff']
    let seed = 42
    const rand = () => {
      seed = (seed * 1103515245 + 12345) & 0x7fffffff
      return (seed / 0x7fffffff) % 1
    }
    return Array.from({ length: count }, () => ({
      top: 8 + rand() * 84,
      left: 8 + rand() * 84,
      rotate: rand() * 360,
      color: colors[Math.floor(rand() * colors.length)],
      size: 12 + rand() * 8,
    }))
  }, [count])
}

export function MapCanvas() {
  const fleet = useFleet(70)
  return (
    <div className="relative h-full w-full overflow-hidden bg-bg-secondary">
      <img
        src={basemap}
        alt=""
        className="absolute inset-0 size-full object-cover object-bottom"
      />
      <div className="absolute inset-0 bg-black/40" />
      {fleet.map((a, i) => (
        <Plane
          key={i}
          size={a.size}
          style={{
            position: 'absolute',
            top: `${a.top}%`,
            left: `${a.left}%`,
            transform: `rotate(${a.rotate}deg)`,
            color: a.color,
          }}
        />
      ))}
    </div>
  )
}
