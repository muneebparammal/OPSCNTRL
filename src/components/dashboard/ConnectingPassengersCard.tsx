import { useState } from 'react'
import { icons } from '../ui/Icon'

type Row = { flight: string; from: string; to: string; pax: number; hrs: string }

const inboundFeeders: Row[] = [4, 1, 1, 4, 2, 5, 3, 4, 1, 8].map((pax) => ({
  flight: 'EK027',
  from: 'LAX',
  to: 'DXB',
  pax,
  hrs: '11h 59m',
}))
const outboundConnections: Row[] = [3, 6, 2, 1, 5, 2, 4, 7].map((pax) => ({
  flight: 'EK354',
  from: 'DXB',
  to: 'BKK',
  pax,
  hrs: '6h 05m',
}))

const data = { Inbound: inboundFeeders, Outbound: outboundConnections }
const sum = (rows: Row[]) => rows.reduce((n, r) => n + r.pax, 0)

export function ConnectingPassengersPanel() {
  const [direction, setDirection] = useState<'Inbound' | 'Outbound'>('Inbound')
  const rows = data[direction]
  const RowArrow = direction === 'Inbound' ? icons.arrowUpRight : icons.arrowDownRight

  return (
    <>
      <div className="flex w-full gap-3">
        {(['Inbound', 'Outbound'] as const).map((dir) => {
          const Icon = dir === 'Inbound' ? icons.arrowUpRightMono : icons.arrowDownRightMono
          const active = direction === dir
          return (
            <button
              key={dir}
              type="button"
              onClick={() => setDirection(dir)}
              className={`flex h-7 items-center gap-1.5 rounded-full py-1 pr-1 pl-3 text-sm font-semibold ${
                active
                  ? 'bg-inverse text-white'
                  : 'border border-border-primary bg-bg-primary text-fg-secondary'
              }`}
            >
              <Icon size={14} />
              {dir}
              <span
                className={`flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-xs font-bold ${
                  active
                    ? 'bg-black text-white'
                    : 'border border-border-primary bg-bg-primary text-fg-secondary'
                }`}
              >
                {sum(data[dir])}
              </span>
            </button>
          )
        })}
      </div>
      <div className="flex w-full flex-col gap-1">
        <div className="flex w-full items-center gap-2 px-4 text-sm font-extrabold text-fg-muted">
          <p className="flex-1">
            {direction === 'Inbound' ? 'Inbound Feeders' : 'Outbound Connections'}
          </p>
          <p className="w-[70px] text-right">Pax</p>
          <p className="w-[70px] text-right">Hrs</p>
        </div>
        <div className="flex max-h-[300px] w-full flex-col gap-1 overflow-y-auto">
          {rows.map((row, i) => (
            <div
              key={i}
              className="flex w-full items-center gap-2 rounded-2xl bg-bg-muted px-4 py-2.5"
            >
              <div className="flex flex-1 items-center gap-2">
                <RowArrow size={16} className="shrink-0" />
                <p className="text-sm font-bold text-fg-secondary">{row.flight}</p>
                <span className="flex items-center gap-1 text-xs font-semibold text-fg-muted">
                  {row.from}
                  <span className="h-px w-4 bg-fg-muted" />
                  <icons.planeBlue size={16} />
                  <span className="h-px w-4 bg-fg-muted" />
                  {row.to}
                </span>
              </div>
              <p className="w-[70px] text-right text-sm font-semibold text-fg-blue">{row.pax}</p>
              <p className="w-[70px] text-right text-sm font-semibold text-fg-secondary">
                {row.hrs}
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
