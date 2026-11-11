import { useState, useEffect } from 'react'
import {
  X,
  CalendarPlus,
  Edit3,
  Loader2,
  AlertCircle,
  AlertTriangle,
} from 'lucide-react'

const getTodayString = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export default function AppointmentForm({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  doctorSuggestions = [],
  existingAppointments = [],
}) {
  const isEdit = Boolean(initialData && initialData.id)
  const todayStr = getTodayString()

  const [formData, setFormData] = useState({
    patient_name: '',
    doctor_name: '',
    appointment_date: '',
    appointment_time: '10:00',
    reason: '',
    status: 'Scheduled',
  })

  const [errors, setErrors] = useState({})
  const [duplicateWarning, setDuplicateWarning] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  // Populate or reset form whenever modal opens or initialData changes
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          patient_name: initialData.patient_name || initialData.patient || '',
          doctor_name: initialData.doctor_name || initialData.doctor || '',
          appointment_date: initialData.appointment_date || '',
          appointment_time:
            initialData.appointment_time?.slice(0, 5) ||
            initialData.time?.slice(0, 5) ||
            '10:00',
          reason: initialData.reason || '',
          status: initialData.status || 'Scheduled',
        })
      } else {
        setFormData({
          patient_name: '',
          doctor_name: '',
          appointment_date: todayStr,
          appointment_time: '10:00',
          reason: '',
          status: 'Scheduled',
        })
      }
      setErrors({})
      setDuplicateWarning('')
      setSubmitError('')
    }
  }, [isOpen, initialData, todayStr])

  if (!isOpen) return null

  // Validate all fields according to Task 2 rules
  const validate = () => {
    const newErrors = {}

    // 1. Patient Name: required, not whitespace only, min 2 chars
    const trimmedPatient = formData.patient_name.trim()
    if (!trimmedPatient) {
      newErrors.patient_name = 'Patient name is required.'
    } else if (trimmedPatient.length < 2) {
      newErrors.patient_name = 'Patient name must be at least 2 characters.'
    }

    // 2. Doctor Name: required, not whitespace only
    const trimmedDoctor = formData.doctor_name.trim()
    if (!trimmedDoctor) {
      newErrors.doctor_name = 'Doctor name is required.'
    } else if (trimmedDoctor.length < 2) {
      newErrors.doctor_name = 'Doctor name must be at least 2 characters.'
    }

    // 3. Appointment Date: required, cannot be in the past
    if (!formData.appointment_date) {
      newErrors.appointment_date = 'Appointment date is required.'
    } else {
      const isPastDate = formData.appointment_date < todayStr
      const isUnmodifiedExistingDate =
        isEdit && initialData && formData.appointment_date === initialData.appointment_date

      if (isPastDate && !isUnmodifiedExistingDate) {
        newErrors.appointment_date = 'Appointment date cannot be in the past.'
      }
    }

    // 4. Appointment Time: required, valid time format HH:MM
    const timeVal = formData.appointment_time.trim()
    if (!timeVal) {
      newErrors.appointment_time = 'Appointment time is required.'
    } else {
      const timeRegex = /^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/
      if (!timeRegex.test(timeVal)) {
        newErrors.appointment_time = 'Please enter a valid appointment time.'
      }
    }

    // 5. Reason for Visit: required, not whitespace only
    const trimmedReason = formData.reason.trim()
    if (!trimmedReason) {
      newErrors.reason = 'Reason for visit is required.'
    } else if (trimmedReason.length < 3) {
      newErrors.reason = 'Please provide a descriptive reason for the visit.'
    }

    // 6. Status: required, must be Scheduled, Completed, or Cancelled
    const validStatuses = ['Scheduled', 'Completed', 'Cancelled']
    if (!formData.status || !validStatuses.includes(formData.status)) {
      newErrors.status = 'Status must be Scheduled, Completed, or Cancelled.'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Duplicate appointment check (Task 3)
  const checkForDuplicate = (trimmedPayload) => {
    const normPatient = trimmedPayload.patient_name.toLowerCase()
    const normDoctor = trimmedPayload.doctor_name.toLowerCase()
    const normDate = trimmedPayload.appointment_date
    const normTime = trimmedPayload.appointment_time.slice(0, 5)

    const isDuplicate = existingAppointments.some((apt) => {
      // Exclude currently edited record in edit mode
      if (isEdit && initialData?.id && apt.id === initialData.id) {
        return false
      }

      const existingPatient = (apt.patient_name || apt.patient || '').trim().toLowerCase()
      const existingDoctor = (apt.doctor_name || apt.doctor || '').trim().toLowerCase()
      const existingDate = (apt.appointment_date || '').trim()
      const existingTime = (apt.appointment_time || apt.time || '').slice(0, 5)

      return (
        existingPatient === normPatient &&
        existingDoctor === normDoctor &&
        existingDate === normDate &&
        existingTime === normTime
      )
    })

    return isDuplicate
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear field-specific error as user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
    if (duplicateWarning) {
      setDuplicateWarning('')
    }
    if (submitError) {
      setSubmitError('')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Run validation first (Task 2)
    const isValid = validate()
    if (!isValid || isSubmitting) return

    // Prepare trimmed payload
    let formattedTime = formData.appointment_time.trim()
    if (formattedTime.length === 5) {
      formattedTime = `${formattedTime}:00`
    }

    const trimmedPayload = {
      patient_name: formData.patient_name.trim(),
      doctor_name: formData.doctor_name.trim(),
      appointment_date: formData.appointment_date,
      appointment_time: formattedTime,
      reason: formData.reason.trim(),
      status: formData.status,
    }

    // Check for duplicate appointment (Task 3)
    if (checkForDuplicate(trimmedPayload)) {
      setDuplicateWarning(
        `Duplicate detected: An appointment is already scheduled for ${trimmedPayload.patient_name} with ${trimmedPayload.doctor_name} on ${trimmedPayload.appointment_date} at ${formData.appointment_time.slice(0, 5)}.`
      )
      return
    }

    setIsSubmitting(true)
    setSubmitError('')

    try {
      await onSubmit(trimmedPayload, initialData?.id)
      onClose()
    } catch (err) {
      console.error('Submission error:', err)
      setSubmitError(err.message || 'Failed to save appointment. Please check your connection and inputs.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#18324F]/40 backdrop-blur-xs transition-opacity"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Click outside backdrop */}
      <div
        className="fixed inset-0"
        onClick={isSubmitting ? undefined : onClose}
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-xl border border-[#E5EDF5] overflow-hidden z-10 max-h-[90vh] flex flex-col my-auto">
        {/* Header (fixed at top of modal) */}
        <div className="shrink-0 px-5 sm:px-6 py-4 sm:py-5 border-b border-[#EEF3F8] flex items-center justify-between bg-white">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#EBF2FA] text-[#3979C9] flex items-center justify-center border border-[#D2E2F4] shrink-0">
              {isEdit ? <Edit3 className="w-5 h-5" /> : <CalendarPlus className="w-5 h-5" />}
            </div>
            <div>
              <h2 id="modal-title" className="text-base sm:text-lg font-bold text-[#18324F]">
                {isEdit ? 'Edit Appointment' : 'New Appointment'}
              </h2>
              <p className="text-xs text-[#7B8DA3]">
                {isEdit
                  ? `Update consultation details for ${formData.patient_name || 'patient'}`
                  : 'Schedule a patient consultation or clinical review'}
              </p>
            </div>
          </div>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#7B8DA3] hover:text-[#18324F] hover:bg-[#F4F7FB] transition-colors focus:outline-none disabled:opacity-50"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="overflow-y-auto p-5 sm:p-6 space-y-4 flex-1">
          {/* Duplicate Warning Banner (Task 3) */}
          {duplicateWarning && (
            <div
              role="alert"
              className="p-3.5 rounded-xl bg-[#FFFBEB] border border-[#FDE68A] flex items-start space-x-2.5 text-xs text-[#92400E] animate-in fade-in"
            >
              <AlertTriangle className="w-4 h-4 shrink-0 text-[#D97706] mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-xs text-[#92400E]">Duplicate Appointment Warning</p>
                <p className="mt-0.5 leading-relaxed">{duplicateWarning}</p>
              </div>
            </div>
          )}

          {/* Global Database / Submission Error Notice (Task 4) */}
          {submitError && (
            <div
              role="alert"
              className="p-3.5 rounded-xl bg-[#FDF1F1] border border-[#F8D2D2] flex items-start space-x-2.5 text-xs text-[#C53030]"
            >
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-xs text-[#C53030]">Submission Failed</p>
                <p className="mt-0.5 leading-relaxed">{submitError}</p>
              </div>
            </div>
          )}

          <form id="appointment-form" onSubmit={handleSubmit} noValidate className="space-y-4">
            {/* Field: Patient Name (full width) */}
            <div>
              <label htmlFor="patient_name" className="block text-xs font-semibold text-[#18324F] mb-1.5">
                Patient Name <span className="text-[#C53030] font-bold">*</span>
              </label>
              <input
                type="text"
                id="patient_name"
                name="patient_name"
                disabled={isSubmitting}
                value={formData.patient_name}
                onChange={handleChange}
                placeholder="e.g. Eleanor Vance"
                className={`w-full h-11 px-3.5 rounded-xl text-sm bg-[#F4F7FB] text-[#18324F] border transition-all focus:outline-none focus:bg-white focus:ring-2 disabled:opacity-60 ${
                  errors.patient_name
                    ? 'border-[#F8D2D2] focus:border-[#C53030] focus:ring-[#C53030]/15'
                    : 'border-[#E5EDF5] focus:border-[#3979C9] focus:ring-[#3979C9]/15'
                }`}
              />
              {errors.patient_name && (
                <p className="mt-1 text-xs text-[#C53030] flex items-center gap-1 font-medium">
                  {errors.patient_name}
                </p>
              )}
            </div>

            {/* Field Grid: Doctor Name & Status (Desktop 2-col, Mobile 1-col) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Doctor Name (with dynamic Supabase suggestions + manual entry allowed) */}
              <div>
                <label htmlFor="doctor_name" className="block text-xs font-semibold text-[#18324F] mb-1.5">
                  Doctor Name <span className="text-[#C53030] font-bold">*</span>
                </label>
                <input
                  type="text"
                  id="doctor_name"
                  name="doctor_name"
                  list="doctor-suggestions"
                  disabled={isSubmitting}
                  value={formData.doctor_name}
                  onChange={handleChange}
                  placeholder="Select or enter doctor"
                  className={`w-full h-11 px-3.5 rounded-xl text-sm bg-[#F4F7FB] text-[#18324F] border transition-all focus:outline-none focus:bg-white focus:ring-2 disabled:opacity-60 ${
                    errors.doctor_name
                      ? 'border-[#F8D2D2] focus:border-[#C53030] focus:ring-[#C53030]/15'
                      : 'border-[#E5EDF5] focus:border-[#3979C9] focus:ring-[#3979C9]/15'
                  }`}
                />
                {/* Datalist populated dynamically from actual database records (Task 1) */}
                <datalist id="doctor-suggestions">
                  {doctorSuggestions.map((doc) => (
                    <option key={doc} value={doc} />
                  ))}
                </datalist>
                {errors.doctor_name ? (
                  <p className="mt-1 text-xs text-[#C53030] flex items-center gap-1 font-medium">
                    {errors.doctor_name}
                  </p>
                ) : (
                  <p className="mt-1 text-[11px] text-[#7B8DA3]">
                    Choose from known doctors or type a new doctor name.
                  </p>
                )}
              </div>

              {/* Status */}
              <div>
                <label htmlFor="status" className="block text-xs font-semibold text-[#18324F] mb-1.5">
                  Status <span className="text-[#C53030] font-bold">*</span>
                </label>
                <select
                  id="status"
                  name="status"
                  disabled={isSubmitting}
                  value={formData.status}
                  onChange={handleChange}
                  className={`w-full h-11 px-3.5 rounded-xl text-sm bg-[#F4F7FB] text-[#18324F] border transition-all focus:outline-none focus:bg-white focus:ring-2 disabled:opacity-60 ${
                    errors.status
                      ? 'border-[#F8D2D2] focus:border-[#C53030] focus:ring-[#C53030]/15'
                      : 'border-[#E5EDF5] focus:border-[#3979C9] focus:ring-[#3979C9]/15'
                  }`}
                >
                  <option value="Scheduled">Scheduled</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
                {errors.status && (
                  <p className="mt-1 text-xs text-[#C53030] flex items-center gap-1 font-medium">
                    {errors.status}
                  </p>
                )}
              </div>
            </div>

            {/* Field Grid: Date & Time (Desktop 2-col, Mobile 1-col) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Appointment Date */}
              <div>
                <label htmlFor="appointment_date" className="block text-xs font-semibold text-[#18324F] mb-1.5">
                  Appointment Date <span className="text-[#C53030] font-bold">*</span>
                </label>
                <input
                  type="date"
                  id="appointment_date"
                  name="appointment_date"
                  min={isEdit ? undefined : todayStr}
                  disabled={isSubmitting}
                  value={formData.appointment_date}
                  onChange={handleChange}
                  className={`w-full h-11 px-3.5 rounded-xl text-sm bg-[#F4F7FB] text-[#18324F] border transition-all focus:outline-none focus:bg-white focus:ring-2 disabled:opacity-60 ${
                    errors.appointment_date
                      ? 'border-[#F8D2D2] focus:border-[#C53030] focus:ring-[#C53030]/15'
                      : 'border-[#E5EDF5] focus:border-[#3979C9] focus:ring-[#3979C9]/15'
                  }`}
                />
                {errors.appointment_date && (
                  <p className="mt-1 text-xs text-[#C53030] flex items-center gap-1 font-medium">
                    {errors.appointment_date}
                  </p>
                )}
              </div>

              {/* Appointment Time */}
              <div>
                <label htmlFor="appointment_time" className="block text-xs font-semibold text-[#18324F] mb-1.5">
                  Appointment Time <span className="text-[#C53030] font-bold">*</span>
                </label>
                <input
                  type="time"
                  id="appointment_time"
                  name="appointment_time"
                  disabled={isSubmitting}
                  value={formData.appointment_time}
                  onChange={handleChange}
                  className={`w-full h-11 px-3.5 rounded-xl text-sm bg-[#F4F7FB] text-[#18324F] border transition-all focus:outline-none focus:bg-white focus:ring-2 disabled:opacity-60 ${
                    errors.appointment_time
                      ? 'border-[#F8D2D2] focus:border-[#C53030] focus:ring-[#C53030]/15'
                      : 'border-[#E5EDF5] focus:border-[#3979C9] focus:ring-[#3979C9]/15'
                  }`}
                />
                {errors.appointment_time && (
                  <p className="mt-1 text-xs text-[#C53030] flex items-center gap-1 font-medium">
                    {errors.appointment_time}
                  </p>
                )}
              </div>
            </div>

            {/* Field: Reason for Visit (full width) */}
            <div>
              <label htmlFor="reason" className="block text-xs font-semibold text-[#18324F] mb-1.5">
                Reason for Visit <span className="text-[#C53030] font-bold">*</span>
              </label>
              <textarea
                id="reason"
                name="reason"
                rows={3}
                disabled={isSubmitting}
                value={formData.reason}
                onChange={handleChange}
                placeholder="e.g. Routine blood pressure check, post-op consultation..."
                className={`w-full px-3.5 py-2.5 rounded-xl text-sm bg-[#F4F7FB] text-[#18324F] border transition-all focus:outline-none focus:bg-white focus:ring-2 resize-none disabled:opacity-60 ${
                  errors.reason
                    ? 'border-[#F8D2D2] focus:border-[#C53030] focus:ring-[#C53030]/15'
                    : 'border-[#E5EDF5] focus:border-[#3979C9] focus:ring-[#3979C9]/15'
                }`}
              />
              {errors.reason && (
                <p className="mt-1 text-xs text-[#C53030] flex items-center gap-1 font-medium">
                  {errors.reason}
                </p>
              )}
            </div>
          </form>
        </div>

        {/* Footer (fixed at bottom of modal) */}
        <div className="shrink-0 px-5 sm:px-6 py-4 bg-[#F8FAFC] border-t border-[#EEF3F8] flex items-center justify-end space-x-3">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={onClose}
            className="h-11 px-4 rounded-xl text-xs sm:text-sm font-semibold text-[#7B8DA3] hover:text-[#18324F] hover:bg-[#EEF3F8] border border-[#E5EDF5] transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="appointment-form"
            disabled={isSubmitting}
            className="h-11 inline-flex items-center justify-center space-x-2 px-5 rounded-xl text-xs sm:text-sm font-semibold bg-[#3979C9] hover:bg-[#2D66B0] text-white shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#3979C9]/30 disabled:opacity-60"
          >
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>{isSubmitting ? 'Saving...' : isEdit ? 'Save Changes' : 'Schedule Appointment'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
