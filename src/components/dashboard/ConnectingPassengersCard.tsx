import { ArrowUpRight, Link2, PlaneTakeoff } from 'lucide-react'
import { useState } from 'react'
import { CollapsibleCard } from '../ui/Card'

const inboundFeeders = [
  { flight: 'EK027', from: 'LAX', to: 'DXB', pax: 4, hrs: '11h 59m' },
  { flight: 'EK027', from: 'LAX', to: 'DXB', pax: 1, hrs: '11h 59m' },
  { flight: 'EK027', from: 'LAX', to: 'DXB', pax: 1, hrs: '11h 59m' },
  { flight: 'EK027', from: 'LAX', to: 'DXB', pax: 4, hrs: '11h 59m' },
  { flight: 'EK027', from: 'LAX', to: 'DXB', pax: 2, hrs: '11h 59m' },
  { flight: 'EK027', from: 'LAX', to: 'DXB', pax: 5, hrs: '11h 59m' },
  { flight: 'EK027', from: 'LAX', to: 'DXB', pax: 3, hrs: '11h 59m' },
  { flight: 'EK027', from: 'LAX', to: 'DXB', pax: 4, hrs: '11h 59m' },
  { flight: 'EK027', from: 'LAX', to: 'DXB', pax: 1, hrs: '11h 59m' },
  { flight: 'EK027', from: 'LAX', to: 'DXB', pax: 8, hrs: '11h 59m' },
]

export function ConnectingPassengersCard({ defaultOpen = false }: { defaultOpen?: boolean }) {
  const [direction, setDirection] = useState<'Inbound' | 'Outbound'>('Inbound')

  return (
    <CollapsibleCard icon={Link2} title="Connecting Passengers" defaultOpen={defaultOpen}>
      <div className="flex w-full gap-2">
        {(['Inbound', 'Outbound'] as const).map((dir) => (
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
            <PlaneTakeoff size={14} />
            {dir}
          </button>
        ))}
      </div>
      <div className="flex w-full flex-col gap-1">
        <div className="flex w-full items-center gap-2 px-4 text-sm font-extrabold text-fg-muted">
          <p className="flex-1">{direction === 'Inbound' ? 'Inbound Feeders' : 'Outbound Connections'}</p>
          <p className="w-[70px] text-right">Pax</p>
          <p className="w-[70px] text-right">Hrs</p>
        </div>
        <div className="flex max-h-[300px] w-full flex-col gap-1 overflow-y-auto">
          {inboundFeeders.map((row, i) => (
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
    </CollapsibleCard>
  )
}
