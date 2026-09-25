import { icons } from '../ui/Icon'

const menuItems = [
  { icon: icons.overview, label: 'Overview', active: false },
  { icon: icons.map, label: 'Map', active: true },
  { icon: icons.network, label: 'Network', active: false },
  { icon: icons.boards, label: 'Boards', active: false },
  { icon: icons.bell, label: 'Alerts', active: false },
]

type SidebarProps = {
  expanded?: boolean
}

export function Sidebar({ expanded = false }: SidebarProps) {
  return (
    <aside
      className={`flex h-full shrink-0 flex-col items-start overflow-hidden bg-bg-sidebar transition-[width] duration-200 ${
        expanded ? 'w-[220px]' : 'w-12'
      }`}
    >
      <div className="flex w-full flex-col items-start gap-2 p-2">
        <div className="flex w-full items-center gap-2">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-ek p-2.5">
            <icons.emirates size={16} className="text-white" />
          </div>
          {expanded && (
            <p className="truncate text-sm font-bold whitespace-nowrap text-fg-primary">
              OPS Control
            </p>
          )}
        </div>
      </div>
      <div className="flex w-full flex-col items-start justify-center gap-2">
        <div className="flex w-full flex-col items-start p-2">
          <div className="flex w-full flex-col items-start gap-1">
            {menuItems.map(({ icon: Icon, label, active }) => (
              <button
                key={label}
                type="button"
                className={`flex h-8 w-full items-center gap-2 rounded-full p-2 ${
                  expanded ? 'justify-start' : 'justify-center'
                } ${active ? 'bg-bg-sidebar-secondary' : ''}`}
              >
                <Icon size={16} className="shrink-0 text-fg-secondary" />
                {expanded && (
                  <span className="truncate text-sm font-medium whitespace-nowrap text-fg-secondary">
                    {label}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-auto flex w-full flex-col items-start justify-center gap-2 p-2">
        <div className="flex items-center gap-2">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-bg-tertiary">
            <div className="relative">
              <div className="size-8 rounded-full bg-gray-300" />
              <div className="absolute right-0 bottom-0 size-2 rounded-full border border-bg-sidebar bg-fg-green" />
            </div>
          </div>
          {expanded && (
            <span className="truncate text-sm font-medium whitespace-nowrap text-fg-secondary">
              Account
            </span>
          )}
        </div>
      </div>
    </aside>
  )
}
