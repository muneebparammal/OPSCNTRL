import { ArrowUpRight, PlaneLanding, PlaneTakeoff } from 'lucide-react'
import { useState } from 'react'

type Row = { flight: string; from: string; to: string; pax: number; hrs: string }

const inboundFeeders: Row[] = [4, 1, 1, 4, 2, 5, 3, 4, 1, 8].map((pax) => ({
  flight: 'EK027', from: 'LAX', to: 'DXB', pax, hrs: '11h 59m',
}))
const outboundConnections: Row[] = [3, 6, 2, 1, 5, 2, 4, 7].map((pax) => ({
  flight: 'EK354', from: 'DXB', to: 'BKK', pax, hrs: '6h 05m',
}))

const data = { Inbound: inboundFeeders, Outbound: outboundConnections }
const sum = (rows: Row[]) => rows.reduce((n, r) => n + r.pax, 0)

export function ConnectingPassengersPanel() {
  const [direction, setDirection] = useState<'Inbound' | 'Outbound'>('Inbound')
  const rows = data[direction]

  return (
    <>
      <div className="flex w-full gap-2">
        {(['Inbound', 'Outbound'] as const).map((dir) => {
          const Icon = dir === 'Inbound' ? PlaneLanding : PlaneTakeoff
          return (
            <button
              key={dir}
              type="button"
              onClick={() => setDirection(dir)}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${
                direction === dir
                  ? 'bg-fg-secondary text-white'
                  : 'border border-border-primary text-fg-secondary'
              }`}
            >
              <Icon size={14} />
              {dir}
              <span
                className={`rounded-full px-1.5 text-[11px] leading-4 font-bold ${
                  direction === dir ? 'bg-white/20 text-white' : 'bg-bg-secondary text-fg-secondary'
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
          <p className="flex-1">{direction === 'Inbound' ? 'Inbound Feeders' : 'Outbound Connections'}</p>
          <p className="w-[70px] text-right">Pax</p>
          <p className="w-[70px] text-right">Hrs</p>
        </div>
        <div className="flex max-h-[300px] w-full flex-col gap-1 overflow-y-auto">
          {rows.map((row, i) => (
            <div key={i} className="flex w-full items-center gap-2 rounded-2xl bg-bg-muted px-4 py-2.5">
              <ArrowUpRight size={16} className="shrink-0 text-fg-secondary" />
              <p className="text-sm font-bold text-fg-secondary">{row.flight}</p>
              <span className="flex items-center gap-1 text-xs font-semibold text-fg-muted">
                {row.from} <PlaneTakeoff size={12} /> {row.to}
              </span>
              <p className="flex-1 text-right text-sm text-fg-secondary">{row.pax}</p>
              <p className="w-[70px] text-right text-sm text-fg-secondary">{row.hrs}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
