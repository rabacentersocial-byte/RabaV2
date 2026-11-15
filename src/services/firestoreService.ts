import type { Unsubscribe } from 'firebase/firestore';
import { auth, getLazyDb } from '../lib/firebase';
import { Appointment, ParentReview, Specialist, BlogPost, AdminUser } from '../types';

async function loadFirestoreCtx() {
  const [fs, db] = await Promise.all([
    import('firebase/firestore'),
    getLazyDb()
  ]);
  return { fs, db };
}

async function ensureFirebaseUser() {
  const { getLazyAuth } = await import('../lib/firebase');
  const authInstance = await getLazyAuth();
  if (typeof (authInstance as any).authStateReady === 'function') {
    await (authInstance as any).authStateReady();
  }
  return authInstance.currentUser;
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function withTimeout<T>(promise: Promise<T>, timeoutMs = 10000, fallback?: T): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((resolve, reject) => {
      setTimeout(() => {
        if (fallback !== undefined) {
          resolve(fallback);
        } else {
          reject(new Error(`Firestore operation timed out after ${timeoutMs}ms`));
        }
      }, timeoutMs);
    })
  ]);
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null, shouldThrow = false) {
  const errMessage = error instanceof Error ? error.message : String(error);
  
  const errInfo: FirestoreErrorInfo = {
    error: errMessage,
    authInfo: {
      userId: auth?.currentUser?.uid || null,
      email: auth?.currentUser?.email || null,
      emailVerified: auth?.currentUser?.emailVerified || null,
      isAnonymous: auth?.currentUser?.isAnonymous || null,
      tenantId: auth?.currentUser?.tenantId || null,
      providerInfo: auth?.currentUser?.providerData?.map((provider: any) => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };

  // Safe diagnostic logging without breaking application render
  if (shouldThrow) {
    console.error(`[Firestore Error - ${operationType.toUpperCase()}] Collection/Doc: [${path}]:`, errInfo);
    throw new Error(JSON.stringify(errInfo));
  } else {
    console.warn(`[Firestore Notice - ${operationType.toUpperCase()}] Collection/Doc: [${path}]:`, errMessage);
  }
}

/**
 * Recursively removes any keys with `undefined` values from an object.
 * In Firestore Web SDK v9/v10, passing `undefined` anywhere inside a document payload
 * throws an unhandled "Unsupported field value: undefined" exception that crashes writes in production.
 */
export function sanitizeFirestoreData<T>(obj: T): T {
  if (obj === null || obj === undefined) {
    return null as any;
  }
  if (Array.isArray(obj)) {
    return obj
      .filter((item) => item !== undefined)
      .map((item) => (typeof item === 'object' && item !== null ? sanitizeFirestoreData(item) : item)) as any;
  }
  if (typeof obj === 'object') {
    if (obj instanceof Date) return obj as any;
    const clean: Record<string, any> = {};
    for (const [key, value] of Object.entries(obj)) {
      if (value !== undefined) {
        clean[key] = (typeof value === 'object' && value !== null)
          ? sanitizeFirestoreData(value)
          : value;
      }
    }
    return clean as any;
  }
  return obj;
}

// ============================================================================
// 1. DYNAMIC SITE SETTINGS (Synchronized with Admin Dashboard & Visitor UI)
// ============================================================================

export async function saveSiteSettingToFirestore(key: string, data: any): Promise<void> {
  const path = `site_settings/${key}`;
  if (!auth.currentUser) {
    return;
  }
  try {
    const { fs, db } = await loadFirestoreCtx();
    const docRef = fs.doc(db, 'site_settings', key);
    await fs.setDoc(docRef, sanitizeFirestoreData({
      key,
      data,
      updatedAt: new Date().toISOString()
    }), { merge: true });
    console.log(`[Firestore] Successfully saved site setting: ${key}`);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path, false);
  }
}

export async function deleteSiteSettingFromFirestore(key: string): Promise<void> {
  const path = `site_settings/${key}`;
  if (!auth.currentUser) {
    return;
  }
  try {
    const { fs, db } = await loadFirestoreCtx();
    const docRef = fs.doc(db, 'site_settings', key);
    await fs.deleteDoc(docRef);
    console.log(`[Firestore] Successfully deleted site setting: ${key}`);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path, false);
  }
}

export async function getSiteSettingFromFirestore(key: string): Promise<any | null> {
  const path = `site_settings/${key}`;
  try {
    const { fs, db } = await loadFirestoreCtx();
    const docRef = fs.doc(db, 'site_settings', key);
    const snap = await withTimeout(fs.getDoc(docRef), 10000);
    if (!snap.exists()) {
      return null;
    }
    const val = snap.data();
    return val?.data !== undefined ? val.data : val;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path, false);
    return null;
  }
}

export async function getAllSiteSettingsFromFirestore(): Promise<Record<string, any>> {
  const path = 'site_settings';
  try {
    const { fs, db } = await loadFirestoreCtx();
    const colRef = fs.collection(db, 'site_settings');
    const snap = await withTimeout(fs.getDocs(colRef), 10000);
    const result: Record<string, any> = {};
    snap.forEach((d) => {
      const docData = d.data();
      result[d.id] = docData?.data !== undefined ? docData.data : docData;
    });
    return result;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path, false);
    return {};
  }
}

export function subscribeSiteSettings(
  onUpdate: (settings: Record<string, any>) => void,
  onError?: (err: any) => void
): Unsubscribe {
  const path = 'site_settings';
  let cancelled = false;
  let realUnsub: Unsubscribe | null = null;

  loadFirestoreCtx()
    .then(({ fs, db }) => {
      if (cancelled) return;
      const colRef = fs.collection(db, 'site_settings');
      realUnsub = fs.onSnapshot(
        colRef,
        (snapshot) => {
          const data: Record<string, any> = {};
          snapshot.forEach((d) => {
            const docData = d.data();
            data[d.id] = docData?.data !== undefined ? docData.data : docData;
          });
          onUpdate(data);
        },
        (error) => {
          console.warn('[Firestore Realtime Notice] site_settings listener info:', error?.message || error);
          if (onError) onError(error);
          handleFirestoreError(error, OperationType.LIST, path, false);
        }
      );
    })
    .catch((err) => {
      if (onError) onError(err);
    });

  return () => {
    cancelled = true;
    if (realUnsub) realUnsub();
  };
}

// ============================================================================
// 2. SPECIALISTS (CRUD & Realtime)
// ============================================================================

export async function saveSpecialistToFirestore(specialist: Specialist): Promise<void> {
  const docId = specialist.id;
  const path = `specialists/${docId}`;
  if (!auth.currentUser) {
    return;
  }
  try {
    const { fs, db } = await loadFirestoreCtx();
    const docRef = fs.doc(db, 'specialists', docId);
    await fs.setDoc(docRef, sanitizeFirestoreData(specialist), { merge: true });
    console.log(`[Firestore] Successfully saved specialist: ${specialist.name} (${docId})`);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteSpecialistFromFirestore(specialistId: string): Promise<void> {
  const path = `specialists/${specialistId}`;
  if (!auth.currentUser) {
    return;
  }
  try {
    const { fs, db } = await loadFirestoreCtx();
    const docRef = fs.doc(db, 'specialists', specialistId);
    await fs.deleteDoc(docRef);
    console.log(`[Firestore] Successfully deleted specialist: ${specialistId}`);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function getSpecialistsFromFirestore(): Promise<Specialist[]> {
  const path = 'specialists';
  try {
    const { fs, db } = await loadFirestoreCtx();
    const colRef = fs.collection(db, 'specialists');
    const snap = await withTimeout(fs.getDocs(colRef), 3000);
    const list: Specialist[] = [];
    snap.forEach((d) => {
      list.push(d.data() as Specialist);
    });
    return list;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path, false);
    return [];
  }
}

export function subscribeSpecialists(
  onUpdate: (specialists: Specialist[]) => void,
  onError?: (err: any) => void
): Unsubscribe {
  const path = 'specialists';
  let cancelled = false;
  let realUnsub: Unsubscribe | null = null;

  loadFirestoreCtx()
    .then(({ fs, db }) => {
      if (cancelled) return;
      const colRef = fs.collection(db, 'specialists');
      realUnsub = fs.onSnapshot(
        colRef,
        (snapshot) => {
          const list: Specialist[] = [];
          snapshot.forEach((d) => {
            list.push(d.data() as Specialist);
          });
          onUpdate(list);
        },
        (error) => {
          console.error('[Firestore Realtime Error] specialists listener error:', error);
          if (onError) onError(error);
          handleFirestoreError(error, OperationType.LIST, path);
        }
      );
    })
    .catch((err) => {
      if (onError) onError(err);
    });

  return () => {
    cancelled = true;
    if (realUnsub) realUnsub();
  };
}

// ============================================================================
// 3. APPOINTMENTS (Booking & Status Tracking)
// ============================================================================

function normalizeTimestampToISO(val: any, fallbackISO?: string): string {
  if (!val) return fallbackISO || new Date().toISOString();
  if (typeof val === 'string') return val;
  if (val instanceof Date) return val.toISOString();
  if (typeof val?.toDate === 'function') {
    try {
      return val.toDate().toISOString();
    } catch {
      return fallbackISO || new Date().toISOString();
    }
  }
  if (typeof val?.seconds === 'number') {
    return new Date(val.seconds * 1000).toISOString();
  }
  return fallbackISO || new Date().toISOString();
}

function resolveRequestTypeFromDoc(data: Record<string, any>): Appointment['requestType'] {
  if (data.requestType) return data.requestType;
  switch (data.type) {
    case 'sewar':
      return 'shadow_teacher';
    case 'course':
      return 'course';
    case 'consultation':
      return 'quick_consultation';
    case 'national_day':
      return 'national_day_offer';
    case 'store_order':
      return 'store_order';
    case 'package':
      return 'package';
    default:
      return 'appointment';
  }
}

function resolveUnifiedType(appointment: Appointment): string {
  if (appointment.type) return appointment.type;
  switch (appointment.requestType) {
    case 'course':
      return 'course';
    case 'shadow_teacher':
      return 'sewar';
    case 'package':
      return 'package';
    case 'quick_consultation':
      return 'consultation';
    case 'store_order':
      return 'store_order';
    case 'national_day_offer':
      return 'national_day';
    default:
      return 'service';
  }
}

function mapDocToAppointment(docId: string, data: Record<string, any>): Appointment {
  const docIdStr = String(docId || '');
  const createdAtISO = normalizeTimestampToISO(data.createdAt, data.createdAtISO);
  return {
    id: docId,
    referenceNumber: data.referenceNumber || (docIdStr ? `RABA-${docIdStr.slice(-6).toUpperCase()}` : 'RABA-000000'),
    childName: data.childName || data.patientName || '',
    childAge: typeof data.childAge === 'number' ? data.childAge : 0,
    childBirthDate: data.childBirthDate || undefined,
    guardianName: data.guardianName || data.parentName || '',
    guardianPhone: data.guardianPhone || data.phone || '',
    guardianEmail: data.guardianEmail || '',
    serviceId: data.serviceId || '',
    serviceTitle: data.serviceTitle || data.serviceName || '',
    specialistId: data.specialistId || '',
    specialistName: data.specialistName || '',
    branch: data.branch || data.city || '',
    city: data.city || data.branch || '',
    date: data.date || '',
    timeSlot: data.timeSlot || data.time || '',
    status: data.status || 'pending',
    paymentStatus: data.paymentStatus || 'unpaid',
    paymentMethod: data.paymentMethod || 'mada',
    amount: typeof data.amount === 'number' ? data.amount : 0,
    reminderSettings: data.reminderSettings || { whatsapp: true, sms: false, email: false },
    notes: data.notes || '',
    adminNotes: data.adminNotes || '',
    type: data.type || undefined,
    requestType: resolveRequestTypeFromDoc(data),
    requestSource: data.requestSource || '',
    couponCode: data.couponCode || '',
    orderItems: Array.isArray(data.orderItems) ? data.orderItems : undefined,
    shippingAddress: data.shippingAddress || '',
    preferredCallTime: data.preferredCallTime || '',
    readByAdmin: Boolean(data.readByAdmin),
    createdAt: createdAtISO,
    createdAtISO: data.createdAtISO || createdAtISO,
    updatedAt: data.updatedAt ? normalizeTimestampToISO(data.updatedAt) : undefined
  };
}

export function sortAppointmentsNewestFirst(list: Appointment[]): Appointment[] {
  return [...list].sort((a, b) => {
    const timeA = Date.parse(a.createdAtISO || a.createdAt || '') || 0;
    const timeB = Date.parse(b.createdAtISO || b.createdAt || '') || 0;
    if (timeB !== timeA) return timeB - timeA;
    return String(b.id || '').localeCompare(String(a.id || ''));
  });
}

export async function saveAppointmentToFirestore(appointment: Appointment): Promise<boolean> {
  const rawId = appointment.id || `apt-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const docId = rawId.replace(/[^a-zA-Z0-9_\-]/g, '-').slice(0, 128);
  const path = `appointments/${docId}`;

  try {
    const { fs, db } = await loadFirestoreCtx();
    const docRef = fs.doc(db, 'appointments', docId);

    let normalizedStatus = appointment.status || 'new';
    if (!['new', 'pending', 'contacted', 'confirmed', 'completed', 'cancelled'].includes(normalizedStatus)) {
      normalizedStatus = 'new';
    }

    const createdAtISO = appointment.createdAt || new Date().toISOString();
    const sanitizedFields = sanitizeFirestoreData({
      id: docId,
      referenceNumber: appointment.referenceNumber || `RB-${docId.slice(-6).toUpperCase()}`,
      type: resolveUnifiedType(appointment),
      requestType: appointment.requestType || 'appointment',
      requestSource: appointment.requestSource || 'الموقع الإلكتروني',
      patientName: (appointment.childName || appointment.guardianName || 'مستفيد').trim().slice(0, 150),
      childName: (appointment.childName || appointment.guardianName || 'مستفيد').trim().slice(0, 150),
      childAge: typeof appointment.childAge === 'number' ? appointment.childAge : 0,
      childBirthDate: appointment.childBirthDate || '',
      parentName: (appointment.guardianName || 'ولي أمر').trim().slice(0, 150),
      guardianName: (appointment.guardianName || 'ولي أمر').trim().slice(0, 150),
      phone: (appointment.guardianPhone || '').trim().slice(0, 35),
      guardianPhone: (appointment.guardianPhone || '').trim().slice(0, 35),
      guardianEmail: (appointment.guardianEmail || '').trim().slice(0, 120),
      serviceId: (appointment.serviceId || 'general').slice(0, 120),
      serviceName: (appointment.serviceTitle || 'استشارة تأهيلية').trim().slice(0, 200),
      serviceTitle: (appointment.serviceTitle || 'استشارة تأهيلية').trim().slice(0, 200),
      specialistId: (appointment.specialistId || 'general').slice(0, 120),
      specialistName: (appointment.specialistName || 'الفريق الاستشاري').trim().slice(0, 150),
      branch: (appointment.branch || appointment.city || 'الرياض').trim().slice(0, 100),
      city: (appointment.city || appointment.branch || 'الرياض').trim().slice(0, 100),
      date: (appointment.date || new Date().toISOString().split('T')[0]).slice(0, 50),
      time: (appointment.timeSlot || '10:00 AM').slice(0, 80),
      timeSlot: (appointment.timeSlot || '10:00 AM').slice(0, 80),
      status: normalizedStatus,
      paymentStatus: appointment.paymentStatus || 'unpaid',
      paymentMethod: appointment.paymentMethod || 'mada',
      amount: typeof appointment.amount === 'number' ? appointment.amount : 0,
      notes: (appointment.notes || '').slice(0, 2000),
      adminNotes: (appointment.adminNotes || '').slice(0, 2000),
      couponCode: (appointment.couponCode || '').slice(0, 60),
      orderItems: Array.isArray(appointment.orderItems) ? appointment.orderItems : [],
      shippingAddress: (appointment.shippingAddress || '').slice(0, 300),
      preferredCallTime: (appointment.preferredCallTime || '').slice(0, 100),
      readByAdmin: Boolean(appointment.readByAdmin),
      reminderSettings: appointment.reminderSettings || { whatsapp: true, sms: false, email: false },
      createdAtISO
    });

    // Attach serverTimestamp() AFTER sanitizeFirestoreData so the FieldValue sentinel is preserved intact
    const payload = {
      ...sanitizedFields,
      createdAt: fs.serverTimestamp()
    };

    await fs.setDoc(docRef, payload, { merge: true });
    console.log(`[Firestore] Successfully saved appointment in Firestore: ${docId}`);

    // Non-blocking best-effort mirror to local Express/Cloud SQL API (silent on static hosting)
    try {
      fetch('/api/db/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...sanitizedFields, createdAt: createdAtISO })
      }).catch(() => {});
    } catch {
      // non-blocking
    }

    return true;
  } catch (error) {
    console.error(`[Firestore Error - WRITE] Failed to save appointment to ${path}:`, error);
    handleFirestoreError(error, OperationType.WRITE, path, true);
    return false;
  }
}

export async function saveCustomerRequestToFirestore(request: Appointment): Promise<boolean> {
  const rawId = request.id || `req-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const docId = rawId.replace(/[^a-zA-Z0-9_\-]/g, '-').slice(0, 128);
  const path = `customer_requests/${docId}`;
  try {
    const { fs, db } = await loadFirestoreCtx();
    const docRef = fs.doc(db, 'customer_requests', docId);
    const createdAtISO = request.createdAt || new Date().toISOString();
    const sanitized = sanitizeFirestoreData({
      ...request,
      id: docId,
      createdAtISO
    });
    await fs.setDoc(docRef, { ...sanitized, createdAt: fs.serverTimestamp() }, { merge: true });
    console.log(`[Firestore] Successfully created customer request: ${docId}`);
    return true;
  } catch (error) {
    console.error(`[Firestore Error - WRITE] Failed to save customer request to ${path}:`, error);
    handleFirestoreError(error, OperationType.WRITE, path, true);
    return false;
  }
}

export async function updateAppointmentFieldsInFirestore(
  appointmentId: string,
  fields: Partial<Appointment>
): Promise<void> {
  const path = `appointments/${appointmentId}`;
  const currentUser = await ensureFirebaseUser();
  if (!currentUser) {
    return;
  }
  try {
    const { fs, db } = await loadFirestoreCtx();
    const docRef = fs.doc(db, 'appointments', appointmentId);
    const cleanPatch = sanitizeFirestoreData({ ...fields });
    await fs.updateDoc(docRef, {
      ...cleanPatch,
      updatedAt: fs.serverTimestamp()
    });
    console.log(`[Firestore] Successfully updated appointment ${appointmentId}`);
  } catch (error) {
    console.error(`[Firestore Error - UPDATE] Failed to update ${path}:`, error);
    handleFirestoreError(error, OperationType.UPDATE, path, true);
  }
}

export async function updateAppointmentStatusInFirestore(appointmentId: string, status: string): Promise<void> {
  await updateAppointmentFieldsInFirestore(appointmentId, {
    status: status as Appointment['status'],
    readByAdmin: true
  });
}

export async function deleteAppointmentFromFirestore(appointmentId: string): Promise<void> {
  const path = `appointments/${appointmentId}`;
  const currentUser = await ensureFirebaseUser();
  if (!currentUser) {
    return;
  }
  try {
    const { fs, db } = await loadFirestoreCtx();
    const docRef = fs.doc(db, 'appointments', appointmentId);
    await fs.deleteDoc(docRef);
    console.log(`[Firestore] Successfully deleted appointment: ${appointmentId}`);
  } catch (error) {
    console.error(`[Firestore Error - DELETE] Failed to delete ${path}:`, error);
    handleFirestoreError(error, OperationType.DELETE, path, true);
  }
}

export async function getAppointmentsFromFirestore(): Promise<Appointment[]> {
  const path = 'appointments';
  const currentUser = await ensureFirebaseUser();
  if (!currentUser) {
    return [];
  }
  try {
    const { fs, db } = await loadFirestoreCtx();
    const colRef = fs.collection(db, 'appointments');
    let snap;

    try {
      const orderedQuery = fs.query(colRef, fs.orderBy('createdAt', 'desc'));
      snap = await withTimeout(fs.getDocs(orderedQuery), 8000);
    } catch (queryErr: any) {
      const code = queryErr?.code || '';
      const msg = String(queryErr?.message || '');
      if (code === 'failed-precondition' || msg.includes('index')) {
        snap = await withTimeout(fs.getDocs(colRef), 8000);
      } else {
        throw queryErr;
      }
    }

    const list: Appointment[] = [];
    snap.forEach((d) => {
      list.push(mapDocToAppointment(d.id, d.data()));
    });
    return sortAppointmentsNewestFirst(list);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path, true);
    return [];
  }
}

export function subscribeAppointments(
  onUpdate: (appointments: Appointment[]) => void,
  onError?: (err: any) => void
): Unsubscribe {
  const path = 'appointments';
  let cancelled = false;
  let realUnsub: Unsubscribe | null = null;

  const attachListener = (fs: any, db: any, useOrderBy: boolean) => {
    if (cancelled) return;
    if (realUnsub) {
      realUnsub();
      realUnsub = null;
    }

    const colRef = fs.collection(db, 'appointments');
    const targetRef = useOrderBy ? fs.query(colRef, fs.orderBy('createdAt', 'desc')) : colRef;

    realUnsub = fs.onSnapshot(
      targetRef,
      (snapshot: any) => {
        const list: Appointment[] = [];
        snapshot.forEach((d: any) => {
          list.push(mapDocToAppointment(d.id, d.data()));
        });
        onUpdate(sortAppointmentsNewestFirst(list));
      },
      (error: any) => {
        const code = error?.code || '';
        const msg = String(error?.message || '');
        if (useOrderBy && (code === 'failed-precondition' || msg.includes('index'))) {
          console.warn('[Firestore Realtime] Missing index for orderBy(createdAt), falling back to client-side sort');
          attachListener(fs, db, false);
          return;
        }
        console.error('[Firestore Realtime Error] appointments listener error:', error);
        if (onError) onError(error);
        handleFirestoreError(error, OperationType.LIST, path, false);
      }
    );
  };

  Promise.all([ensureFirebaseUser(), loadFirestoreCtx()])
    .then(([currentUser, { fs, db }]) => {
      if (cancelled || !currentUser) return;
      attachListener(fs, db, true);
    })
    .catch((err) => {
      if (onError) onError(err);
    });

  return () => {
    cancelled = true;
    if (realUnsub) realUnsub();
  };
}

// ============================================================================
// 4. TESTIMONIALS & REVIEWS
// ============================================================================

export async function saveTestimonialToFirestore(review: ParentReview): Promise<boolean> {
  const docId = review.id || `rev-${Date.now()}`;
  const path = `testimonials/${docId}`;
  try {
    const { fs, db } = await loadFirestoreCtx();
    const docRef = fs.doc(db, 'testimonials', docId);

    const payload = sanitizeFirestoreData({
      id: docId,
      parentName: review.parentName || 'ولي أمر مستفيد',
      parentNameEn: review.parentNameEn || 'Beneficiary Parent',
      rating: Number(review.rating) || 5,
      comment: review.comment || '',
      category: review.category || 'general',
      specialistName: review.specialistName || '',
      location: review.location || 'الرياض',
      date: review.date || 'اليوم',
      isAnonymous: Boolean(review.isAnonymous),
      avatar: review.avatar || ''
    });

    await fs.setDoc(docRef, payload, { merge: true });
    console.log(`[Firestore] Successfully saved review: ${docId}`);
    return true;
  } catch (error) {
    console.error(`[Firestore Error - WRITE] Failed to save testimonial to ${path}:`, error);
    handleFirestoreError(error, OperationType.WRITE, path);
    return false;
  }
}

export async function deleteTestimonialFromFirestore(reviewId: string): Promise<void> {
  const path = `testimonials/${reviewId}`;
  try {
    const { fs, db } = await loadFirestoreCtx();
    const docRef = fs.doc(db, 'testimonials', reviewId);
    await fs.deleteDoc(docRef);
    console.log(`[Firestore] Successfully deleted testimonial: ${reviewId}`);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function getTestimonialsFromFirestore(): Promise<ParentReview[]> {
  const path = 'testimonials';
  try {
    const { fs, db } = await loadFirestoreCtx();
    const colRef = fs.collection(db, 'testimonials');
    const snap = await fs.getDocs(colRef);
    const list: ParentReview[] = [];
    snap.forEach((d) => {
      list.push(d.data() as ParentReview);
    });
    return list;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
}

export function subscribeTestimonials(
  onUpdate: (testimonials: ParentReview[]) => void,
  onError?: (err: any) => void
): Unsubscribe {
  const path = 'testimonials';
  let cancelled = false;
  let realUnsub: Unsubscribe | null = null;

  loadFirestoreCtx()
    .then(({ fs, db }) => {
      if (cancelled) return;
      const colRef = fs.collection(db, 'testimonials');
      realUnsub = fs.onSnapshot(
        colRef,
        (snapshot) => {
          const list: ParentReview[] = [];
          snapshot.forEach((d) => {
            list.push(d.data() as ParentReview);
          });
          onUpdate(list);
        },
        (error) => {
          console.error('[Firestore Realtime Error] testimonials listener error:', error);
          if (onError) onError(error);
          handleFirestoreError(error, OperationType.LIST, path);
        }
      );
    })
    .catch((err) => {
      if (onError) onError(err);
    });

  return () => {
    cancelled = true;
    if (realUnsub) realUnsub();
  };
}

// ============================================================================
// 5. BLOG POSTS
// ============================================================================

export async function saveBlogPostToFirestore(post: BlogPost): Promise<void> {
  const docId = post.id || `post-${Date.now()}`;
  const path = `blog_posts/${docId}`;
  if (!auth.currentUser) {
    return;
  }
  try {
    const { fs, db } = await loadFirestoreCtx();
    const docRef = fs.doc(db, 'blog_posts', docId);
    await fs.setDoc(docRef, sanitizeFirestoreData({ ...post, id: docId }), { merge: true });
    console.log(`[Firestore] Successfully saved blog post: ${docId}`);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteBlogPostFromFirestore(postId: string): Promise<void> {
  const path = `blog_posts/${postId}`;
  if (!auth.currentUser) {
    return;
  }
  try {
    const { fs, db } = await loadFirestoreCtx();
    const docRef = fs.doc(db, 'blog_posts', postId);
    await fs.deleteDoc(docRef);
    console.log(`[Firestore] Successfully deleted blog post: ${postId}`);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// ============================================================================
// 6. ADMIN USERS & ACCOUNTS (RBAC System)
// ============================================================================

export async function saveAdminUserToFirestore(user: AdminUser): Promise<boolean> {
  const docId = user.id;
  const path = `admins/${docId}`;
  if (!auth.currentUser) {
    return false;
  }
  try {
    const { fs, db } = await loadFirestoreCtx();
    const docRef = fs.doc(db, 'admins', docId);
    const { password: _, ...cleanUser } = user;
    await fs.setDoc(docRef, sanitizeFirestoreData({
      ...cleanUser,
      updatedAt: new Date().toISOString()
    }), { merge: true });
    console.log(`[Firestore] Successfully saved admin user: ${user.username} (${docId})`);
    return true;
  } catch (error) {
    console.error(`[Firestore Error - WRITE] Failed to save admin user to ${path}:`, error);
    handleFirestoreError(error, OperationType.WRITE, path);
    return false;
  }
}

export async function deleteAdminUserFromFirestore(userId: string): Promise<boolean> {
  const path = `admins/${userId}`;
  if (!auth.currentUser) {
    return false;
  }
  try {
    const { fs, db } = await loadFirestoreCtx();
    const docRef = fs.doc(db, 'admins', userId);
    await fs.deleteDoc(docRef);
    console.log(`[Firestore] Successfully deleted admin user: ${userId}`);
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
    return false;
  }
}

export async function getAdminUsersFromFirestore(): Promise<AdminUser[]> {
  const path = 'admins';
  const currentUser = await ensureFirebaseUser();
  if (!currentUser) {
    return [];
  }
  try {
    const { fs, db } = await loadFirestoreCtx();
    const colRef = fs.collection(db, 'admins');
    const snap = await withTimeout(fs.getDocs(colRef), 3000);
    const list: AdminUser[] = [];
    snap.forEach((d) => {
      list.push(d.data() as AdminUser);
    });
    return list;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path, false);
    return [];
  }
}
