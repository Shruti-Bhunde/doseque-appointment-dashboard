import { AlertTriangle, X, Loader2 } from 'lucide-react'

export default function ConfirmDialog({
  isOpen,
  title = 'Cancel Appointment',
  message,
  patientName,
  confirmLabel = 'Confirm Cancellation',
  cancelLabel = 'Keep Appointment',
  onConfirm,
  onClose,
  isLoading = false,
}) {
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#18324F]/40 backdrop-blur-xs transition-opacity"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
    >
      <div className="fixed inset-0" onClick={isLoading ? undefined : onClose} aria-hidden="true" />

      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl border border-[#E5EDF5] overflow-hidden z-10 p-6 space-y-5">
        <div className="flex items-start justify-between">
          <div className="w-11 h-11 rounded-2xl bg-[#FDF1F1] text-[#C53030] flex items-center justify-center border border-[#F8D2D2] shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <button
            type="button"
            disabled={isLoading}
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#7B8DA3] hover:text-[#18324F] hover:bg-[#F4F7FB] transition-colors focus:outline-none disabled:opacity-50"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div>
          <h3 id="dialog-title" className="text-lg font-bold text-[#18324F]">
            {title}
          </h3>
          <p className="text-xs sm:text-sm text-[#7B8DA3] mt-1.5 leading-relaxed">
            {message || (
              <>
                Are you sure you want to cancel the appointment for{' '}
                <strong className="text-[#18324F] font-semibold">{patientName}</strong>?
                This will update the appointment status to <span className="font-semibold text-[#C53030]">Cancelled</span> without deleting the patient record.
              </>
            )}
          </p>
        </div>

        <div className="flex items-center justify-end space-x-3 pt-2">
          <button
            type="button"
            disabled={isLoading}
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-[#7B8DA3] hover:text-[#18324F] hover:bg-[#F4F7FB] border border-[#E5EDF5] transition-colors disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            disabled={isLoading}
            onClick={onConfirm}
            className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-[#C53030] hover:bg-[#AC2525] text-white shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#C53030]/30 disabled:opacity-60"
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>{isLoading ? 'Cancelling...' : confirmLabel}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
