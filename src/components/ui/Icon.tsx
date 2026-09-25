import type { ComponentType, CSSProperties } from 'react'

const files = import.meta.glob('../../assets/icons/*.svg', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

const NEUTRAL_STROKES = /(stroke|fill)="#(0A0A0A|171717|262626|737373|FAFAFA)"/gi

const sources: Record<string, string> = {}
for (const [path, raw] of Object.entries(files)) {
  const name = path.split('/').pop()!.replace('.svg', '')
  sources[name] = raw.replace(NEUTRAL_STROKES, '$1="currentColor"')
}

export type IconProps = { size?: number; className?: string; style?: CSSProperties }
export type IconComponent = ComponentType<IconProps>

export function Icon({ name, size = 16, className = '', style }: IconProps & { name: string }) {
  const svg = (sources[name] ?? '').replace(
    /^<svg([^>]*?)\swidth="[^"]*"\sheight="[^"]*"/,
    `<svg$1 width="${size}" height="${size}"`,
  )
  return (
    <span
      aria-hidden
      className={`inline-flex shrink-0 items-center justify-center ${className}`}
      style={{ width: size, height: size, ...style }}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}

const cache: Record<string, IconComponent> = {}
export function figmaIcon(name: string): IconComponent {
  return (cache[name] ??= (props) => <Icon name={name} {...props} />)
}

export const icons = {
  close: figmaIcon('xclose'),
  chevronDown: figmaIcon('chevron-down'),
  chevronUp: figmaIcon('chevron-up'),
  search: figmaIcon('search-md'),
  settings: figmaIcon('settings-01'),
  bookmark: figmaIcon('bookmark-add'),
  layers: figmaIcon('layers-three-01'),
  panelRight: figmaIcon('layout-right'),
  panelLeft: figmaIcon('layout-left'),
  bell: figmaIcon('bell-01'),
  overview: figmaIcon('code-square-02'),
  map: figmaIcon('map-01'),
  network: figmaIcon('dataflow-04'),
  boards: figmaIcon('layout-alt-01'),
  firBoundaries: figmaIcon('scale-01'),
  notams: figmaIcon('info-circle'),
  dxbRing: figmaIcon('target-05'),
  playback: figmaIcon('clock-rewind'),
  weather: figmaIcon('cloud-sun-02'),
  weatherLarge: figmaIcon('cloud-sun-3'),
  takeoff: figmaIcon('splane-takeoff-01'),
  landing: figmaIcon('splane-landing-01'),
  plane: figmaIcon('plane'),
  clock: figmaIcon('clock'),
  clockCheck: figmaIcon('clock-check'),
  alert: figmaIcon('alert-circle'),
  currency: figmaIcon('cryptocurrency-01'),
  users: figmaIcon('users-01'),
  passengers: figmaIcon('user-right-02'),
  server: figmaIcon('server-05'),
  link: figmaIcon('link-03'),
  arrowUpRight: figmaIcon('arrow-up-right'),
  airspace: figmaIcon('map-02'),
  emirates: figmaIcon('emirates'),
}
