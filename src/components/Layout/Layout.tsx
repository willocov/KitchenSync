import { BookOpen, ClipboardList, Clock, LayoutList } from 'lucide-react'
import { useActiveView, useMealPlanStore } from '../../store/useMealPlanStore'

const TABS = [
  { id: 'editor' as const, label: 'Plan', icon: LayoutList },
  { id: 'tasks' as const, label: 'Tasks', icon: ClipboardList },
  { id: 'timeline' as const, label: 'Timeline', icon: Clock },
  { id: 'guide' as const, label: 'Guide', icon: BookOpen },
]

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  const activeView = useActiveView()
  const setActiveView = useMealPlanStore((s) => s.setActiveView)

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🍳</span>
          <span className="font-bold text-gray-800 text-lg tracking-tight">KitchenSync</span>
        </div>

        {/* Desktop nav tabs */}
        <nav className="hidden sm:flex ml-6 gap-1">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveView(id)}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                activeView === id
                  ? 'bg-orange-100 text-orange-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Icon size={15} />
              {label}
            </button>
          ))}
        </nav>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-auto pb-16 sm:pb-0">
        {children}
        <footer className="mt-8 border-t border-gray-100 py-4 text-center text-xs text-gray-400">
          KitchenSync v2.0 &nbsp;·&nbsp; Covington Software
        </footer>
      </main>

      {/* Mobile bottom nav */}
      <nav className="sm:hidden fixed bottom-0 inset-x-0 bg-white border-t border-gray-200 flex">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveView(id)}
            className={`flex-1 flex flex-col items-center gap-0.5 py-2 text-xs font-medium transition-colors cursor-pointer ${
              activeView === id ? 'text-orange-600' : 'text-gray-500'
            }`}
          >
            <Icon size={20} />
            {label}
          </button>
        ))}
      </nav>
    </div>
  )
}
