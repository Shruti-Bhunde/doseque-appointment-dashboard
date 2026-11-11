import {
  LayoutDashboard,
  Calendar,
  Settings,
  Activity,
  X,
  Stethoscope,
  HelpCircle,
} from 'lucide-react'

export default function Sidebar({ isOpen, onClose, activeNav = 'dashboard', onNavSelect }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'settings', label: 'Settings', icon: Settings, isPlaceholder: true },
  ]

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-[#18324F]/30 backdrop-blur-sm z-40 md:hidden transition-opacity"
          onClick={onClose}
          aria-label="Close mobile sidebar backdrop"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-white border-r border-[#E5EDF5] z-50 flex flex-col justify-between transition-transform duration-200 ease-in-out md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand / Logo Header */}
        <div>
          <div className="h-18 px-6 flex items-center justify-between border-b border-[#EEF3F8]">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-[#3979C9] flex items-center justify-center text-white shadow-sm">
                <Stethoscope className="w-5 h-5" />
              </div>
              <div>
                <span className="text-lg font-bold text-[#18324F] tracking-tight flex items-center gap-1.5">
                  DoseQue
                </span>
                <span className="block text-[11px] font-medium text-[#7B8DA3] leading-none">
                  Clinical Care
                </span>
              </div>
            </div>

            {/* Mobile close button */}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#7B8DA3] hover:text-[#18324F] hover:bg-[#F4F7FB] md:hidden focus:outline-none"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="p-4 space-y-1.5" aria-label="Main navigation">
            <div className="px-3 py-2 text-[11px] font-semibold tracking-wider text-[#7B8DA3] uppercase">
              Management
            </div>

            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = activeNav === item.id

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    if (onNavSelect) onNavSelect(item.id)
                    if (onClose) onClose()
                  }}
                  className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors text-left ${
                    isActive
                      ? 'bg-[#EBF2FA] text-[#3979C9] font-semibold'
                      : 'text-[#7B8DA3] hover:text-[#18324F] hover:bg-[#F4F7FB]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#3979C9]' : 'text-[#7B8DA3]'}`} />
                  <span>{item.label}</span>
                  {item.isPlaceholder && (
                    <span className="ml-auto text-[10px] font-medium bg-[#F4F7FB] text-[#7B8DA3] px-1.5 py-0.5 rounded border border-[#EEF3F8]">
                      Soon
                    </span>
                  )}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Footer / Status Area */}
        <div className="p-4 border-t border-[#EEF3F8]">
          <div className="p-3 rounded-xl bg-[#F4F7FB] border border-[#EEF3F8] flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-[#3979C9] border border-[#E5EDF5]">
              <Activity className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-[#18324F] truncate">Central Hospital</p>
              <p className="text-[11px] text-[#7B8DA3] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
                System Live
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
