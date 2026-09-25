import type { IconComponent } from '../ui/Icon'
import { icons } from '../ui/Icon'
import { useState } from 'react'
import { useMapSelection } from '../../context/MapSelectionContext'
import { Tooltip } from '../ui/Tooltip'

type QuickLinkButtonProps = {
  icon: IconComponent
  label: string
  active: boolean
  onClick: () => void
  badge?: number
}

function QuickLinkButton({ icon: Icon, label, active, onClick, badge }: QuickLinkButtonProps) {
  return (
    <Tooltip label={label}>
      <button
        type="button"
        aria-label={label}
        aria-pressed={active}
        onClick={onClick}
        className={`relative flex size-12 items-center justify-center rounded-full shadow-xs transition-colors ${
          active ? 'bg-fg-secondary text-white' : 'bg-bg-primary text-fg-secondary'
        }`}
      >
        <Icon size={16} />
        {badge !== undefined && (
          <span className="absolute top-0.5 right-1.5 flex min-w-4 items-center justify-center rounded-full border border-white bg-fg-red px-1 py-0.5 text-xs font-semibold text-white">
            {badge}
          </span>
        )}
      </button>
    </Tooltip>
  )
}

type QuickLinksBarProps = {
  className?: string
  airspaceActive?: boolean
  onAirspaceClick?: () => void
}

export function QuickLinksBar({
  className = '',
  airspaceActive = false,
  onAirspaceClick,
}: QuickLinksBarProps) {
  const {
    showDxbRing,
    setShowDxbRing,
    showWeather,
    setShowWeather,
    airportFilter,
    flowFilter,
    setFlowFilter,
  } = useMapSelection()
  const [playBackActive, setPlayBackActive] = useState(false)
  const [notamsActive, setNotamsActive] = useState(false)

  const airport = airportFilter === 'ALL' ? 'DXB' : airportFilter

  return (
    <div className={`flex items-center justify-center gap-3 ${className}`}>
      <QuickLinkButton
        icon={icons.firBoundaries}
        label="FIR Boundaries"
        active={airspaceActive}
        onClick={() => onAirspaceClick?.()}
      />
      <QuickLinkButton
        icon={icons.dxbRing}
        label="DXB Ring"
        active={showDxbRing}
        onClick={() => setShowDxbRing(!showDxbRing)}
      />
      <QuickLinkButton
        icon={icons.playback}
        label="Play Back"
        active={playBackActive}
        onClick={() => setPlayBackActive((v) => !v)}
      />
      <QuickLinkButton
        icon={icons.notams}
        label="NOTAMs"
        active={notamsActive}
        onClick={() => setNotamsActive((v) => !v)}
        badge={10}
      />
      <QuickLinkButton
        icon={icons.weather}
        label="Weather"
        active={showWeather}
        onClick={() => setShowWeather(!showWeather)}
      />
      <QuickLinkButton
        icon={icons.takeoff}
        label={`Departure from ${airport}`}
        active={flowFilter === 'departure'}
        onClick={() => setFlowFilter(flowFilter === 'departure' ? null : 'departure')}
      />
      <QuickLinkButton
        icon={icons.landing}
        label={`Arrival to ${airport}`}
        active={flowFilter === 'arrival'}
        onClick={() => setFlowFilter(flowFilter === 'arrival' ? null : 'arrival')}
      />
    </div>
  )
}
