import { db, withDbRetry } from './index.ts';
import { appointments } from './schema.ts';

// In-memory cache for appointments with short TTL (15 seconds)
let cachedAppointments: any[] | null = null;
let lastApptsCacheTime = 0;
const APPT_CACHE_TTL_MS = 15_000;

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
    const result = await withDbRetry(() => db.insert(appointments).values(data).returning());
    // Invalidate appointments cache
    cachedAppointments = null;
    return result[0];
  } catch (error) {
    console.error('Database appointment insert failed:', error);
    throw new Error('Failed to record appointment in database', { cause: error });
  }
}

export async function getDbAppointments() {
  if (cachedAppointments && Date.now() - lastApptsCacheTime < APPT_CACHE_TTL_MS) {
    return cachedAppointments;
  }
  try {
    const results = await withDbRetry(() => db.select().from(appointments));
    cachedAppointments = results;
    lastApptsCacheTime = Date.now();
    return results;
  } catch (error) {
    console.error('Database query failed for appointments:', error);
    return cachedAppointments || [];
  }
}

/**
 * High-performance bulk synchronization eliminating N+1 sequential insert queries
 * and preventing duplicate appointment rows across repeated admin syncs.
 */
export async function syncDbAppointments(list: any[]): Promise<boolean> {
  if (!Array.isArray(list) || list.length === 0) return true;
  try {
    const existing = await withDbRetry(() => db.select({
      patientName: appointments.patientName,
      phone: appointments.phone,
      date: appointments.date,
      time: appointments.time,
      service: appointments.service,
    }).from(appointments));

    const existingKeys = new Set(
      existing.map((e) =>
        `${(e.patientName || '').trim()}|${(e.phone || '').trim()}|${(e.date || '').trim()}|${(e.time || '').trim()}|${(e.service || '').trim()}`
      )
    );

    const rows = [];
    for (const appt of list.slice(0, 100)) {
      if (!appt.guardianName && !appt.guardianPhone && !appt.patientName) continue;
      const row = {
        patientName: (appt.childName || appt.guardianName || appt.patientName || 'مستفيد').trim(),
        phone: (appt.guardianPhone || appt.phone || '').trim(),
        specialist: (appt.specialistName || appt.specialist || '').trim(),
        service: (appt.serviceTitle || appt.service || '').trim(),
        date: (appt.date || new Date().toISOString().slice(0, 10)).trim(),
        time: (appt.timeSlot || appt.time || '09:00 ص').trim(),
        status: appt.status || 'pending',
        notes: appt.notes || '',
      };
      const dedupeKey = `${row.patientName}|${row.phone}|${row.date}|${row.time}|${row.service}`;
      if (existingKeys.has(dedupeKey)) continue;
      existingKeys.add(dedupeKey);
      rows.push(row);
    }

    if (rows.length > 0) {
      await withDbRetry(() => db.insert(appointments).values(rows));
    }
    cachedAppointments = null;
    return true;
  } catch (err) {
    console.error('Failed to sync appointments to database table:', err);
    return false;
  }
}
