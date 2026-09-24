import { Bell, LayoutGrid, Map, Plane, Share2 } from 'lucide-react'

const menuItems = [
  { icon: LayoutGrid, active: false },
  { icon: Map, active: true },
  { icon: Share2, active: false },
  { icon: LayoutGrid, active: false },
  { icon: Bell, active: false },
]

export function Sidebar() {
  return (
    <aside className="flex h-full w-12 shrink-0 flex-col items-start bg-bg-sidebar">
      <div className="flex flex-col items-start gap-2 p-2">
        <div className="flex size-8 items-center justify-center rounded-full bg-brand-ek p-2.5">
          <Plane size={16} className="text-white" />
        </div>
      </div>
      <div className="flex flex-col items-start justify-center gap-2">
        <div className="flex flex-col items-start p-2">
          <div className="flex w-8 flex-col items-start gap-1">
            {menuItems.map(({ icon: Icon, active }, i) => (
              <button
                key={i}
                type="button"
                className={`flex h-8 w-full items-center justify-center gap-2 rounded-full p-2 ${
                  active ? 'bg-bg-sidebar-secondary' : ''
                }`}
              >
                <Icon size={16} className="text-fg-secondary" />
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-auto flex w-full flex-col items-center justify-center gap-2 p-2">
        <div className="flex size-8 items-center justify-center rounded-full bg-bg-tertiary">
          <div className="relative">
            <div className="size-8 rounded-full bg-gray-300" />
            <div className="absolute right-0 bottom-0 size-2 rounded-full border border-bg-sidebar bg-fg-green" />
          </div>
        </div>
      </div>
    </aside>
  )
}
