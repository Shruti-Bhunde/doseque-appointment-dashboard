import { supabase } from './supabase.js'

const APPOINTMENTS_TABLE = 'appointments'

/**
 * Fetch all appointments from Supabase, sorted by appointment date and time.
 * @returns {Promise<Array>} Array of appointment records.
 */
export async function getAppointments() {
  const { data, error } = await supabase
    .from(APPOINTMENTS_TABLE)
    .select('*')
    .order('appointment_date', { ascending: true })
    .order('appointment_time', { ascending: true })

  if (error) {
    throw new Error(`Failed to fetch appointments: ${error.message}`)
  }

  return data || []
}

/**
 * Add a new appointment to the database.
 * @param {Object} appointment - The appointment payload to insert.
 * @returns {Promise<Object>} The inserted appointment record.
 */
export async function addAppointment(appointment) {
  if (!appointment || typeof appointment !== 'object' || Object.keys(appointment).length === 0) {
    throw new Error('Appointment data is required.')
  }

  const { data, error } = await supabase
    .from(APPOINTMENTS_TABLE)
    .insert([appointment])
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to add appointment: ${error.message}`)
  }

  return data
}

/**
 * Update an existing appointment by its ID.
 * @param {string|number} id - The unique ID of the appointment.
 * @param {Object} updates - Fields to update.
 * @returns {Promise<Object>} The updated appointment record.
 */
export async function updateAppointment(id, updates) {
  if (!id) {
    throw new Error('Appointment ID is required to update an appointment.')
  }
  if (!updates || typeof updates !== 'object' || Object.keys(updates).length === 0) {
    throw new Error('Update payload must be a non-empty object.')
  }

  const { data, error } = await supabase
    .from(APPOINTMENTS_TABLE)
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to update appointment (ID: ${id}): ${error.message}`)
  }

  return data
}

/**
 * Cancel an appointment by updating its status to 'Cancelled'.
 * Note: Performs a soft status update; does not delete the row.
 * @param {string|number} id - The unique ID of the appointment to cancel.
 * @returns {Promise<Object>} The updated appointment record with 'Cancelled' status.
 */
export async function cancelAppointment(id) {
  if (!id) {
    throw new Error('Appointment ID is required to cancel an appointment.')
  }

  const { data, error } = await supabase
    .from(APPOINTMENTS_TABLE)
    .update({ status: 'Cancelled' })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to cancel appointment (ID: ${id}): ${error.message}`)
  }

  return data
}
