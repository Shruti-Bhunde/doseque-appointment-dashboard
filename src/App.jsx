import { useState, useEffect, useMemo, useCallback } from 'react'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import SummaryCards from './components/SummaryCards'
import AppointmentTable from './components/AppointmentTable'
import AppointmentForm from './components/AppointmentForm'
import ConfirmDialog from './components/ConfirmDialog'
import Toast from './components/Toast'
import {
  getAppointments,
  addAppointment,
  updateAppointment,
  cancelAppointment,
} from './lib/appointmentService'

export default function App() {
  // Navigation & Modal UI states
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeNav, setActiveNav] = useState('dashboard')
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [editingAppointment, setEditingAppointment] = useState(null)
  const [cancellingAppointment, setCancellingAppointment] = useState(null)
  const [isCancelling, setIsCancelling] = useState(false)

  // Feedback & Notification state
  const [toast, setToast] = useState(null)

  // Filter & Search states
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')

  // Real Supabase Data & Fetch states
  const [appointments, setAppointments] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [fetchError, setFetchError] = useState(null)

  // Fetch appointments from Supabase database
  const loadAppointments = useCallback(async () => {
    setIsLoading(true)
    setFetchError(null)
    try {
      const data = await getAppointments()
      setAppointments(data)
    } catch (err) {
      console.error('Failed to load appointments:', err)
      setFetchError(err.message || 'Unable to connect to Supabase database.')
      setToast({
        type: 'error',
        message: err.message || 'Failed to load appointments from database.',
      })
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Initial load on mount
  useEffect(() => {
    loadAppointments()
  }, [loadAppointments])

  // Extract distinct doctor suggestions dynamically from fetched Supabase appointments (Task 1)
  const doctorSuggestions = useMemo(() => {
    const doctors = appointments
      .map((apt) => apt.doctor_name?.trim())
      .filter(Boolean)
    return [...new Set(doctors)].sort()
  }, [appointments])

  // Calculate summary counts dynamically from actual Supabase records
  const summaryCounts = useMemo(() => {
    return {
      total: appointments.length,
      scheduled: appointments.filter((apt) => apt.status === 'Scheduled').length,
      completed: appointments.filter((apt) => apt.status === 'Completed').length,
      cancelled: appointments.filter((apt) => apt.status === 'Cancelled').length,
    }
  }, [appointments])

  // Filter appointments by search term and status tab
  const filteredAppointments = useMemo(() => {
    return appointments.filter((apt) => {
      const patient = apt.patient_name || apt.patient || ''
      const matchesSearch = patient
        .toLowerCase()
        .includes(searchTerm.trim().toLowerCase())

      const matchesStatus =
        statusFilter === 'All' || apt.status.toLowerCase() === statusFilter.toLowerCase()

      return matchesSearch && matchesStatus
    })
  }, [appointments, searchTerm, statusFilter])

  // Handle opening Add Modal
  const handleOpenAddModal = () => {
    setEditingAppointment(null)
    setIsFormModalOpen(true)
  }

  // Handle opening Edit Modal
  const handleOpenEditModal = (appointment) => {
    setEditingAppointment(appointment)
    setIsFormModalOpen(true)
  }

  // Handle Add or Edit Submission
  const handleSaveAppointment = async (formData, id) => {
    if (id) {
      // Edit existing appointment
      await updateAppointment(id, formData)
      setToast({
        type: 'success',
        message: `Appointment for ${formData.patient_name} updated successfully.`,
      })
    } else {
      // Create new appointment
      await addAppointment(formData)
      setToast({
        type: 'success',
        message: `Appointment for ${formData.patient_name} scheduled successfully.`,
      })
    }
    // Refresh records and counts from Supabase
    await loadAppointments()
  }

  // Handle Cancel Confirmation
  const handleConfirmCancel = async () => {
    if (!cancellingAppointment) return
    setIsCancelling(true)
    try {
      await cancelAppointment(cancellingAppointment.id)
      setToast({
        type: 'success',
        message: `Appointment for ${cancellingAppointment.patient_name} has been cancelled.`,
      })
      setCancellingAppointment(null)
      await loadAppointments()
    } catch (err) {
      setToast({
        type: 'error',
        message: err.message || 'Failed to cancel appointment.',
      })
    } finally {
      setIsCancelling(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F4F7FB] flex text-[#18324F] font-sans antialiased">
      {/* Sidebar Navigation */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeNav={activeNav}
        onNavSelect={setActiveNav}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          onOpenSidebar={() => setSidebarOpen(true)}
          onAddAppointment={handleOpenAddModal}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto">
          {/* Summary Cards */}
          <SummaryCards counts={summaryCounts} />

          {/* Appointment Management Table & Controls */}
          <AppointmentTable
            appointments={filteredAppointments}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            onEditAppointment={handleOpenEditModal}
            onCancelAppointment={(apt) => setCancellingAppointment(apt)}
            isLoading={isLoading}
            error={fetchError}
            onRetry={loadAppointments}
          />
        </main>
      </div>

      {/* Add / Edit Appointment Form Modal */}
      <AppointmentForm
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false)
          setEditingAppointment(null)
        }}
        onSubmit={handleSaveAppointment}
        initialData={editingAppointment}
        doctorSuggestions={doctorSuggestions}
        existingAppointments={appointments}
      />

      {/* Cancel Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(cancellingAppointment)}
        patientName={cancellingAppointment?.patient_name}
        onConfirm={handleConfirmCancel}
        onClose={() => setCancellingAppointment(null)}
        isLoading={isCancelling}
      />

      {/* Toast Notifications */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  )
}
