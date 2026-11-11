import { useEffect } from 'react'
import { CheckCircle2, AlertCircle, X } from 'lucide-react'

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => {
      onClose()
    }, 4500)
    return () => clearTimeout(timer)
  }, [toast, onClose])

  if (!toast) return null

  const isSuccess = toast.type === 'success'

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-5 right-5 z-50 flex items-center space-x-3 max-w-md bg-white border border-[#E5EDF5] rounded-2xl shadow-lg p-4 animate-in fade-in slide-in-from-bottom-3 duration-200"
    >
      <div
        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
          isSuccess ? 'bg-[#EAF7EE] text-[#1E7B42]' : 'bg-[#FDF1F1] text-[#C53030]'
        }`}
      >
        {isSuccess ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
      </div>

      <div className="flex-1 pr-2">
        <p className="text-xs font-bold text-[#18324F]">
          {isSuccess ? 'Success' : 'Error'}
        </p>
        <p className="text-xs text-[#7B8DA3] mt-0.5 leading-relaxed">
          {toast.message}
        </p>
      </div>

      <button
        type="button"
        onClick={onClose}
        className="p-1 rounded-lg text-[#7B8DA3] hover:text-[#18324F] hover:bg-[#F4F7FB] transition-colors focus:outline-none"
        aria-label="Dismiss notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}
