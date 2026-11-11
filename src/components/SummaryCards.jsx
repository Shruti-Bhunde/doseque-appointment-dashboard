import { CalendarDays, Clock, CheckCircle2, XCircle } from 'lucide-react'

export default function SummaryCards({ counts }) {
  const cards = [
    {
      id: 'total',
      label: 'Total Appointments',
      count: counts.total,
      icon: CalendarDays,
      iconBg: 'bg-[#EBF2FA]',
      iconColor: 'text-[#3979C9]',
      borderColor: 'border-[#E5EDF5]',
    },
    {
      id: 'scheduled',
      label: 'Scheduled',
      count: counts.scheduled,
      icon: Clock,
      iconBg: 'bg-[#EBF2FA]',
      iconColor: 'text-[#2762AA]',
      borderColor: 'border-[#E5EDF5]',
    },
    {
      id: 'completed',
      label: 'Completed',
      count: counts.completed,
      icon: CheckCircle2,
      iconBg: 'bg-[#EAF7EE]',
      iconColor: 'text-[#1E7B42]',
      borderColor: 'border-[#E5EDF5]',
    },
    {
      id: 'cancelled',
      label: 'Cancelled',
      count: counts.cancelled,
      icon: XCircle,
      iconBg: 'bg-[#FDF1F1]',
      iconColor: 'text-[#C53030]',
      borderColor: 'border-[#E5EDF5]',
    },
  ]

  return (
    <section aria-label="Appointment summary statistics">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {cards.map((card) => {
          const Icon = card.icon
          return (
            <div
              key={card.id}
              className={`bg-white rounded-2xl p-5 border ${card.borderColor} shadow-xs transition-shadow hover:shadow-sm`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-[#7B8DA3] uppercase tracking-wide">
                  {card.label}
                </span>
                <div
                  className={`w-10 h-10 rounded-xl ${card.iconBg} ${card.iconColor} flex items-center justify-center`}
                >
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl sm:text-3xl font-bold text-[#18324F] tracking-tight">
                  {card.count}
                </span>
                <span className="text-xs text-[#7B8DA3] font-medium">appointments</span>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
