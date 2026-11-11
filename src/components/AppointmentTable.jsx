import {
  Search,
  X,
  Calendar,
  Clock,
  Stethoscope,
  Pencil,
  Ban,
  Filter,
  Loader2,
  AlertCircle,
  RefreshCw,
} from 'lucide-react'

// Helper to format 24h DB time ("14:30:00") into friendly 12h display ("02:30 PM")
function formatDisplayTime(timeStr) {
  if (!timeStr) return ''
  const parts = timeStr.split(':')
  if (parts.length < 2) return timeStr
  let hours = parseInt(parts[0], 10)
  const minutes = parts[1]
  if (isNaN(hours)) return timeStr
  const ampm = hours >= 12 ? 'PM' : 'AM'
  hours = hours % 12 || 12
  return `${String(hours).padStart(2, '0')}:${minutes} ${ampm}`
}

export default function AppointmentTable({
  appointments = [],
  searchTerm = '',
  onSearchChange,
  statusFilter = 'All',
  onStatusFilterChange,
  onEditAppointment,
  onCancelAppointment,
  isLoading = false,
  error = null,
  onRetry,
}) {
  const filterOptions = ['All', 'Scheduled', 'Completed', 'Cancelled']

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Scheduled':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-[#EBF2FA] text-[#2762AA] border border-[#D2E2F4]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#3979C9] mr-1.5"></span>
            Scheduled
          </span>
        )
      case 'Completed':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-[#EAF7EE] text-[#1E7B42] border border-[#CCEBD5]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1E7B42] mr-1.5"></span>
            Completed
          </span>
        )
      case 'Cancelled':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-[#FDF1F1] text-[#C53030] border border-[#F8D2D2]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C53030] mr-1.5"></span>
            Cancelled
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[#F4F7FB] text-[#7B8DA3]">
            {status}
          </span>
        )
    }
  }

  return (
    <section
      aria-label="Appointment management list and filter controls"
      className="bg-white rounded-2xl border border-[#E5EDF5] shadow-xs overflow-hidden"
    >
      {/* Search and Filters Toolbar */}
      <div className="p-4 sm:p-5 border-b border-[#EEF3F8] flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Search input */}
        <div className="relative w-full lg:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7B8DA3]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by patient name..."
            className="w-full pl-10 pr-9 py-2 rounded-xl text-sm bg-[#F4F7FB] text-[#18324F] placeholder-[#7B8DA3] border border-[#E5EDF5] focus:outline-none focus:border-[#3979C9] focus:bg-white focus:ring-2 focus:ring-[#3979C9]/15 transition-all"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7B8DA3] hover:text-[#18324F]"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Status filter tabs */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
          <div className="flex items-center gap-1 text-xs font-semibold text-[#7B8DA3] mr-2">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter:</span>
          </div>
          {filterOptions.map((opt) => {
            const isActive = statusFilter === opt
            return (
              <button
                key={opt}
                type="button"
                onClick={() => onStatusFilterChange(opt)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap focus:outline-none ${
                  isActive
                    ? 'bg-[#3979C9] text-white shadow-xs'
                    : 'bg-[#F4F7FB] text-[#7B8DA3] hover:text-[#18324F] hover:bg-[#EEF3F8] border border-transparent'
                }`}
              >
                {opt}
              </button>
            )
          })}
        </div>
      </div>

      {/* Error state banner */}
      {error && (
        <div className="p-4 mx-5 my-4 rounded-xl bg-[#FDF1F1] border border-[#F8D2D2] flex items-center justify-between text-xs text-[#C53030]">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="inline-flex items-center space-x-1 font-semibold underline hover:no-underline ml-3"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry</span>
            </button>
          )}
        </div>
      )}

      {/* Desktop & Tablet Table (md and up) */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="bg-[#F8FAFC] border-b border-[#EEF3F8] text-[11px] font-semibold uppercase tracking-wider text-[#7B8DA3]">
              <th scope="col" className="py-3.5 px-6">Patient</th>
              <th scope="col" className="py-3.5 px-6">Doctor</th>
              <th scope="col" className="py-3.5 px-6">Appointment Date</th>
              <th scope="col" className="py-3.5 px-6">Time</th>
              <th scope="col" className="py-3.5 px-6">Reason</th>
              <th scope="col" className="py-3.5 px-6">Status</th>
              <th scope="col" className="py-3.5 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EEF3F8] text-sm">
            {isLoading ? (
              <tr>
                <td colSpan="7" className="py-16 text-center text-[#7B8DA3]">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <Loader2 className="w-6 h-6 animate-spin text-[#3979C9]" />
                    <span className="text-xs font-medium">Loading appointments from Supabase...</span>
                  </div>
                </td>
              </tr>
            ) : appointments.length > 0 ? (
              appointments.map((apt) => {
                const patientName = apt.patient_name || apt.patient || 'Unknown Patient'
                const doctorName = apt.doctor_name || apt.doctor || 'Unassigned'
                const displayTime = formatDisplayTime(apt.appointment_time || apt.time)
                const isCancelled = apt.status === 'Cancelled'

                return (
                  <tr
                    key={apt.id}
                    className="hover:bg-[#F9FBFC] transition-colors group"
                  >
                    {/* Patient */}
                    <td className="py-4 px-6 font-semibold text-[#18324F]">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-8 h-8 rounded-full bg-[#EBF2FA] text-[#3979C9] flex items-center justify-center font-bold text-xs shrink-0">
                          {patientName[0]}
                        </div>
                        <span className="truncate">{patientName}</span>
                      </div>
                    </td>

                    {/* Doctor */}
                    <td className="py-4 px-6 text-[#18324F]">
                      <div className="flex items-center space-x-2 text-[#18324F]">
                        <Stethoscope className="w-3.5 h-3.5 text-[#7B8DA3] shrink-0" />
                        <span className="truncate">{doctorName}</span>
                      </div>
                    </td>

                    {/* Date */}
                    <td className="py-4 px-6 text-[#7B8DA3] whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-3.5 h-3.5 text-[#7B8DA3] shrink-0" />
                        <span>{apt.appointment_date}</span>
                      </div>
                    </td>

                    {/* Time */}
                    <td className="py-4 px-6 text-[#7B8DA3] whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-3.5 h-3.5 text-[#7B8DA3] shrink-0" />
                        <span>{displayTime}</span>
                      </div>
                    </td>

                    {/* Reason */}
                    <td className="py-4 px-6 text-[#7B8DA3] max-w-xs truncate" title={apt.reason}>
                      {apt.reason}
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-6 whitespace-nowrap">
                      {getStatusBadge(apt.status)}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end space-x-2">
                        {/* Edit Button */}
                        <button
                          type="button"
                          onClick={() => onEditAppointment && onEditAppointment(apt)}
                          className="p-1.5 rounded-lg text-[#7B8DA3] hover:text-[#3979C9] hover:bg-[#EBF2FA] transition-colors focus:outline-none"
                          title="Edit appointment"
                          aria-label={`Edit appointment for ${patientName}`}
                        >
                          <Pencil className="w-4 h-4" />
                        </button>

                        {/* Cancel Button - hidden or disabled if already cancelled */}
                        {!isCancelled ? (
                          <button
                            type="button"
                            onClick={() => onCancelAppointment && onCancelAppointment(apt)}
                            className="p-1.5 rounded-lg text-[#7B8DA3] hover:text-[#C53030] hover:bg-[#FDF1F1] transition-colors focus:outline-none"
                            title="Cancel appointment"
                            aria-label={`Cancel appointment for ${patientName}`}
                          >
                            <Ban className="w-4 h-4" />
                          </button>
                        ) : (
                          <span
                            className="p-1.5 text-slate-300 cursor-not-allowed inline-block"
                            title="Appointment is already cancelled"
                          >
                            <Ban className="w-4 h-4 opacity-40" />
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })
            ) : (
              <tr>
                <td colSpan="7" className="py-12 px-6 text-center text-[#7B8DA3]">
                  <div className="max-w-sm mx-auto flex flex-col items-center">
                    <div className="w-12 h-12 rounded-2xl bg-[#F4F7FB] flex items-center justify-center text-[#7B8DA3] mb-3 border border-[#EEF3F8]">
                      <Search className="w-5 h-5" />
                    </div>
                    <p className="text-sm font-semibold text-[#18324F]">No matching appointments</p>
                    <p className="text-xs text-[#7B8DA3] mt-1">
                      {searchTerm
                        ? `No records found matching "${searchTerm}". Try another search or reset filters.`
                        : 'No appointments match the selected filter.'}
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View (screens below md) */}
      <div className="block md:hidden divide-y divide-[#EEF3F8]">
        {isLoading ? (
          <div className="py-12 text-center text-[#7B8DA3] flex flex-col items-center justify-center space-y-2">
            <Loader2 className="w-6 h-6 animate-spin text-[#3979C9]" />
            <span className="text-xs">Loading appointments...</span>
          </div>
        ) : appointments.length > 0 ? (
          appointments.map((apt) => {
            const patientName = apt.patient_name || apt.patient || 'Unknown Patient'
            const doctorName = apt.doctor_name || apt.doctor || 'Unassigned'
            const displayTime = formatDisplayTime(apt.appointment_time || apt.time)
            const isCancelled = apt.status === 'Cancelled'

            return (
              <div key={apt.id} className="p-4 space-y-3">
                {/* Header: Patient & Status Badge */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-9 h-9 rounded-full bg-[#EBF2FA] text-[#3979C9] flex items-center justify-center font-bold text-xs shrink-0">
                      {patientName[0]}
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm text-[#18324F] leading-tight">
                        {patientName}
                      </h3>
                      <p className="text-xs text-[#7B8DA3] flex items-center gap-1 mt-0.5">
                        <Stethoscope className="w-3 h-3" />
                        {doctorName}
                      </p>
                    </div>
                  </div>
                  {getStatusBadge(apt.status)}
                </div>

                {/* Details: Date, Time & Reason */}
                <div className="bg-[#F8FAFC] rounded-xl p-3 text-xs space-y-1.5 border border-[#EEF3F8]">
                  <div className="flex items-center justify-between text-[#7B8DA3]">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#3979C9]" />
                      {apt.appointment_date}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#3979C9]" />
                      {displayTime}
                    </span>
                  </div>
                  <div className="text-[#18324F] font-medium pt-1 border-t border-[#EEF3F8]">
                    <span className="text-[#7B8DA3] font-normal">Reason: </span>
                    {apt.reason}
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="flex items-center justify-end space-x-2 pt-1">
                  <button
                    type="button"
                    onClick={() => onEditAppointment && onEditAppointment(apt)}
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#3979C9] bg-[#EBF2FA] border border-[#D2E2F4] hover:bg-[#E0EEFA]"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>

                  {!isCancelled && (
                    <button
                      type="button"
                      onClick={() => onCancelAppointment && onCancelAppointment(apt)}
                      className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#C53030] bg-[#FDF1F1] border border-[#F8D2D2] hover:bg-[#FBE4E4]"
                    >
                      <Ban className="w-3.5 h-3.5" />
                      <span>Cancel</span>
                    </button>
                  )}
                </div>
              </div>
            )
          })
        ) : (
          <div className="py-10 px-4 text-center text-[#7B8DA3]">
            <Search className="w-8 h-8 mx-auto text-[#7B8DA3] mb-2 opacity-60" />
            <p className="text-sm font-semibold text-[#18324F]">No appointments found</p>
            <p className="text-xs text-[#7B8DA3] mt-1">
              Try adjusting your search query or status filter.
            </p>
          </div>
        )}
      </div>

      {/* Footer count indicator */}
      <div className="px-5 py-3.5 bg-[#F8FAFC] border-t border-[#EEF3F8] flex items-center justify-between text-xs text-[#7B8DA3]">
        <span>
          Showing <strong className="font-semibold text-[#18324F]">{appointments.length}</strong> appointment{appointments.length === 1 ? '' : 's'}
        </span>
        <span className="text-[11px] text-[#7B8DA3] flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
          Live PostgreSQL Database
        </span>
      </div>
    </section>
  )
}
