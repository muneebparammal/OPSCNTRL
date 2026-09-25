import type { Notam } from '../../data/notams'
import { Chip } from '../ui/Badge'
import { CollapsibleCard, FieldPair } from '../ui/Card'
import { icons } from '../ui/Icon'

const SEVERITY_TONE = { high: 'red', medium: 'neutral', low: 'grey-blue' } as const

export function NotamDetailHeader({ notam, onClose }: { notam: Notam; onClose?: () => void }) {
  return (
    <div className="flex w-full items-start gap-2">
      <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-brand-ek text-white">
        <icons.alert size={20} />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <p className="text-2xl leading-7 font-bold text-fg-primary">{notam.id}</p>
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-bold text-fg-tertiary">{notam.title}</p>
          <Chip tone={SEVERITY_TONE[notam.severity]}>{notam.severity.toUpperCase()}</Chip>
        </div>
        <p className="text-xs text-fg-muted">{notam.location}</p>
      </div>
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="shrink-0 pt-1 text-fg-secondary/70 hover:text-fg-secondary"
      >
        <icons.close size={24} />
      </button>
    </div>
  )
}

export function NotamDetailCards({ notam }: { notam: Notam }) {
  return (
    <>
      <CollapsibleCard icon={icons.notams} title="Notice" defaultOpen>
        <p className="text-sm leading-5 font-medium text-fg-primary">{notam.text}</p>
      </CollapsibleCard>
      <CollapsibleCard icon={icons.clock} title="Validity" defaultOpen>
        <FieldPair
          items={[
            ['FROM', notam.validFrom],
            ['TO', notam.validTo],
          ]}
        />
      </CollapsibleCard>
      <CollapsibleCard icon={icons.airspace} title="Affected Area" defaultOpen>
        <FieldPair
          items={[
            ['CATEGORY', notam.category],
            ['RADIUS', `${notam.radiusNm} NM`],
          ]}
        />
        <FieldPair items={[['CENTRE', `${notam.lat.toFixed(3)}, ${notam.lng.toFixed(3)}`]]} />
      </CollapsibleCard>
    </>
  )
}
