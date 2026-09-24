import { useState } from 'react'

type PillTabsProps = {
  tabs: string[]
  defaultTab?: string
  className?: string
}

export function PillTabs({ tabs, defaultTab, className = '' }: PillTabsProps) {
  const [active, setActive] = useState(defaultTab ?? tabs[0])
  return (
    <div className={`flex h-9 items-center rounded-full bg-bg-secondary p-1 ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab}
          type="button"
          onClick={() => setActive(tab)}
          className={`flex h-7 flex-1 items-center justify-center rounded-full px-5 text-sm font-semibold whitespace-nowrap text-fg-secondary transition-colors ${
            active === tab ? 'bg-bg-primary shadow-sm' : ''
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  )
}

type IconTabsProps = {
  items: { icon: React.ElementType; label: string; active?: boolean; badge?: number }[]
  className?: string
}

export function IconTabs({ items, className = '' }: IconTabsProps) {
  return (
    <div className={`flex h-9 items-center rounded-full bg-bg-secondary p-1 ${className}`}>
      {items.map(({ icon: Icon, label, badge }) => (
        <button
          key={label}
          type="button"
          aria-label={label}
          className="relative flex h-7 flex-1 items-center justify-center rounded-full px-3 text-fg-secondary"
        >
          <Icon size={16} />
          {badge !== undefined && (
            <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full border border-bg-primary bg-fg-red px-1 text-[10px] font-semibold text-white">
              {badge}
            </span>
          )}
        </button>
      ))}
    </div>
  )
}
