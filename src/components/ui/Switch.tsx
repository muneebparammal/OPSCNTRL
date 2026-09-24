type SwitchProps = {
  checked: boolean
  onChange?: (checked: boolean) => void
  label?: string
}

export function Switch({ checked, onChange, label }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange?.(!checked)}
      className={`flex h-4 w-6 shrink-0 items-center rounded-full p-0.5 transition-colors ${
        checked ? 'bg-fg-secondary' : 'bg-bg-tertiary'
      }`}
    >
      <span
        className={`size-3 rounded-full bg-white shadow-modal transition-transform ${
          checked ? 'translate-x-2' : 'translate-x-0'
        }`}
      />
    </button>
  )
}
