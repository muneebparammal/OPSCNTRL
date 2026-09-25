import { useState } from 'react'
import emiratesLogo from '../../assets/icons/airline-emirates.png'
import { airlines } from '../../data/airlines'
import { Tooltip } from './Tooltip'

const EMIRATES = /^(UAE|EK)(\d.*)$/i

type Parsed = { iata: string | null; name: string | null; code: string; num: string }

function parse(callsign: string): Parsed {
  if (EMIRATES.test(callsign))
    return { iata: 'EK', name: 'Emirates', code: 'UAE', num: callsign.replace(/^\D+/, '') }
  const m = /^([A-Z]{3})(\d.*)$/i.exec(callsign)
  const entry = m ? airlines[m[1].toUpperCase()] : undefined
  return entry
    ? { iata: entry[0], name: entry[1], code: m![1].toUpperCase(), num: m![2] }
    : { iata: null, name: null, code: callsign.slice(0, 3).toUpperCase(), num: '' }
}

export function displayCallsign(callsign: string) {
  const p = parse(callsign)
  return p.iata ? `${p.iata}${p.num}` : callsign
}

function CodeBadge({ code }: { code: string }) {
  return (
    <span className="flex size-6 items-center justify-center rounded-md bg-fg-grey-blue text-[10px] font-bold">
      {code}
    </span>
  )
}

function AirlineBadge({ callsign }: { callsign: string }) {
  const p = parse(callsign)
  const [failed, setFailed] = useState(false)
  if (p.iata === 'EK') {
    return <img src={emiratesLogo} alt="Emirates" className="size-6 rounded-md" draggable={false} />
  }
  if (!p.iata || failed) return <CodeBadge code={p.code} />
  return (
    <img
      src={`https://pics.avs.io/96/96/${p.iata}.png`}
      alt={p.name ?? p.iata}
      className="size-7 rounded-md bg-white object-contain"
      draggable={false}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  )
}

export function FlightTooltip({
  callsign,
  children,
}: {
  callsign: string
  children: React.ReactNode
}) {
  return (
    <Tooltip
      bubbleClassName="rounded-xl py-1.5 pr-3 pl-2 text-sm font-semibold"
      label={
        <span className="flex items-center gap-2">
          <AirlineBadge callsign={callsign} />
          {displayCallsign(callsign)}
        </span>
      }
    >
      {children}
    </Tooltip>
  )
}
