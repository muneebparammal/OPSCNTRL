type Props = {
  towAct: number
  towEst: number
  mtow: number
  num: (kg: number) => string
  unit: string
}

// Take-off weight against the aircraft's maximum (MTOW), with headroom and an
// estimate tick.
export function TakeoffWeightBar({ towAct, towEst, mtow, num, unit }: Props) {
  const pct = Math.min(1, towAct / mtow)
  const headroom = mtow - towAct
  const color = pct > 0.97 ? 'var(--color-fg-red)' : pct > 0.9 ? '#f08c00' : 'var(--color-fg-green)'
  return (
    <div className="flex w-full flex-col gap-2 border-t border-border-primary pt-3">
      <p className="text-xs font-extrabold tracking-wide text-fg-muted uppercase">
        Take-off weight
      </p>
      <div className="flex items-end justify-between">
        <p className="text-xl leading-6 font-bold text-fg-primary">
          {Math.round(pct * 100)}%
          <span className="ml-1 text-xs font-medium text-fg-muted">of MTOW</span>
        </p>
        <p className="text-xs font-semibold text-fg-muted">
          Headroom{' '}
          <span className="text-fg-primary">
            {num(headroom)} {unit}
          </span>
        </p>
      </div>
      <div className="relative h-3 w-full overflow-hidden rounded-full bg-bg-secondary">
        <div
          className="h-full rounded-full"
          style={{ width: `${pct * 100}%`, background: color }}
        />
        <span
          className="absolute top-0 h-full w-0.5 bg-fg-primary/60"
          style={{ left: `${Math.min(100, (towEst / mtow) * 100)}%` }}
        />
      </div>
      <div className="flex justify-between text-[11px] font-semibold text-fg-muted">
        <span>
          Actual {num(towAct)} · est {num(towEst)}
        </span>
        <span>
          MTOW {num(mtow)} {unit}
        </span>
      </div>
    </div>
  )
}
