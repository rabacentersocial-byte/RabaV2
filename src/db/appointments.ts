import { db } from './index.ts';
import { appointments } from './schema.ts';

export async function createDbAppointment(data: {
  patientName: string;
  phone: string;
  specialist?: string;
  service?: string;
  date: string;
  time: string;
  status?: string;
  notes?: string;
}) {
  try {
    const result = await db.insert(appointments).values(data).returning();
    return result[0];
  } catch (error) {
    console.error('Database appointment insert failed:', error);
    throw new Error('Failed to record appointment in database', { cause: error });
  }
}

export async function getDbAppointments() {
  try {
    return await db.select().from(appointments);
  } catch (error) {
    console.error('Database query failed for appointments:', error);
    throw new Error('Failed to fetch appointments from database', { cause: error });
  }
}

export async function syncDbAppointments(list: any[]): Promise<boolean> {
  if (!Array.isArray(list) || list.length === 0) return true;
  try {
    for (const appt of list.slice(0, 50)) {
      if (!appt.guardianName || !appt.guardianPhone) continue;
      await db.insert(appointments).values({
        patientName: appt.childName || appt.guardianName || 'مستفيد',
        phone: appt.guardianPhone || '',
        specialist: appt.specialistName || '',
        service: appt.serviceTitle || '',
        date: appt.date || new Date().toISOString().slice(0, 10),
        time: appt.timeSlot || '09:00 ص',
        status: appt.status || 'pending',
        notes: appt.notes || '',
      });
    }
    return true;
  } catch (err) {
    console.error('Failed to sync appointments to database table:', err);
    return false;
  }
}
