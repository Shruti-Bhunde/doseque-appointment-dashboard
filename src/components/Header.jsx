import { Plus, Calendar, Menu } from 'lucide-react'

export default function Header({ onOpenSidebar, onAddAppointment }) {
  // Format current date nicely
  const todayFormatted = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date())

  return (
    <header className="bg-white border-b border-[#E5EDF5] px-4 sm:px-6 lg:px-8 py-5">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Left Section: Title & Subtitle + Mobile Toggle */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={onOpenSidebar}
              className="p-2 -ml-2 rounded-lg text-[#7B8DA3] hover:text-[#18324F] hover:bg-[#F4F7FB] md:hidden focus:outline-none"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-[#18324F] tracking-tight">
                Appointment Management
              </h1>
              <p className="text-xs sm:text-sm text-[#7B8DA3] mt-0.5">
                Manage and monitor patient appointments
              </p>
            </div>
          </div>
        </div>

        {/* Right Section: Date Display & Add Appointment Button */}
        <div className="flex items-center justify-between md:justify-end space-x-3 sm:space-x-4">
          <div className="flex items-center space-x-2 text-xs font-medium text-[#7B8DA3] bg-[#F4F7FB] px-3.5 py-2 rounded-xl border border-[#EEF3F8]">
            <Calendar className="w-3.5 h-3.5 text-[#3979C9]" />
            <span className="hidden sm:inline">{todayFormatted}</span>
            <span className="sm:hidden">
              {new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(new Date())}
            </span>
          </div>

          <button
            type="button"
            onClick={onAddAppointment}
            className="inline-flex items-center justify-center space-x-2 bg-[#3979C9] hover:bg-[#2D66B0] text-white text-sm font-semibold px-4 py-2 rounded-xl shadow-sm hover:shadow transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#3979C9]/30 active:scale-[0.99]"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Appointment</span>
          </button>
        </div>
      </div>
    </header>
  )
}
