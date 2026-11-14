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

export function withTimeout<T>(promise: Promise<T>, timeoutMs = 3000, fallback?: T): Promise<T> {
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
  console.warn(`[Firestore Notice - ${operationType.toUpperCase()}] Collection/Doc: [${path}]:`, errMessage);
  
  if (shouldThrow) {
    throw new Error(JSON.stringify(errInfo));
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
    const snap = await withTimeout(fs.getDoc(docRef), 3000);
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
    const snap = await withTimeout(fs.getDocs(colRef), 3000);
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

export async function saveAppointmentToFirestore(appointment: Appointment): Promise<boolean> {
  const docId = appointment.id || `apt-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const path = `appointments/${docId}`;
  try {
    const { fs, db } = await loadFirestoreCtx();
    const docRef = fs.doc(db, 'appointments', docId);

    let normalizedStatus = appointment.status || 'pending';
    if (!['new', 'pending', 'confirmed', 'completed', 'cancelled'].includes(normalizedStatus)) {
      normalizedStatus = 'pending';
    }

    const payload = sanitizeFirestoreData({
      id: docId,
      referenceNumber: appointment.referenceNumber || `RB-${docId.slice(-6).toUpperCase()}`,
      patientName: (appointment.childName || appointment.guardianName || 'مستفيد').trim(),
      parentName: (appointment.guardianName || 'ولي أمر').trim(),
      phone: (appointment.guardianPhone || '0500000000').trim(),
      guardianEmail: appointment.guardianEmail || '',
      serviceId: appointment.serviceId || 'general',
      serviceName: appointment.serviceTitle || 'استشارة تأهيلية',
      specialistId: appointment.specialistId || 'general',
      specialistName: appointment.specialistName || 'الفريق الاستشاري',
      branch: (appointment as any).branch || 'النرجس',
      date: appointment.date || new Date().toISOString().split('T')[0],
      time: appointment.timeSlot || '10:00 AM',
      status: normalizedStatus,
      notes: appointment.notes || '',
      childAge: typeof appointment.childAge === 'number' ? appointment.childAge : 5,
      requestType: appointment.requestType || 'appointment',
      requestSource: appointment.requestSource || 'الموقع الإلكتروني',
      paymentStatus: appointment.paymentStatus || 'unpaid',
      amount: typeof appointment.amount === 'number' ? appointment.amount : 0,
      createdAt: appointment.createdAt || new Date().toISOString()
    });

    await fs.setDoc(docRef, payload, { merge: true });
    console.log(`[Firestore] Successfully created appointment in Firestore: ${docId}`);

    try {
      fetch('/api/db/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).catch((apiErr) => {
        console.warn('[API Notice] Server API appointment replicate notice:', apiErr?.message || apiErr);
      });
    } catch {
      // non-blocking
    }

    return true;
  } catch (error) {
    console.error(`[Firestore Error - WRITE] Failed to save appointment to ${path}:`, error);
    handleFirestoreError(error, OperationType.WRITE, path);
    return false;
  }
}

export async function saveCustomerRequestToFirestore(request: Appointment): Promise<boolean> {
  const docId = request.id || `req-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const path = `customer_requests/${docId}`;
  try {
    const { fs, db } = await loadFirestoreCtx();
    const docRef = fs.doc(db, 'customer_requests', docId);
    const payload = sanitizeFirestoreData({
      ...request,
      id: docId,
      createdAt: request.createdAt || new Date().toISOString()
    });
    await fs.setDoc(docRef, payload, { merge: true });
    console.log(`[Firestore] Successfully created customer request: ${docId}`);
    return true;
  } catch (error) {
    console.error(`[Firestore Error - WRITE] Failed to save customer request to ${path}:`, error);
    handleFirestoreError(error, OperationType.WRITE, path);
    return false;
  }
}

export async function updateAppointmentStatusInFirestore(appointmentId: string, status: string): Promise<void> {
  const path = `appointments/${appointmentId}`;
  try {
    const { fs, db } = await loadFirestoreCtx();
    const docRef = fs.doc(db, 'appointments', appointmentId);
    await fs.updateDoc(docRef, { status, updatedAt: new Date().toISOString() });
    console.log(`[Firestore] Successfully updated appointment status: ${appointmentId} -> ${status}`);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteAppointmentFromFirestore(appointmentId: string): Promise<void> {
  const path = `appointments/${appointmentId}`;
  try {
    const { fs, db } = await loadFirestoreCtx();
    const docRef = fs.doc(db, 'appointments', appointmentId);
    await fs.deleteDoc(docRef);
    console.log(`[Firestore] Successfully deleted appointment: ${appointmentId}`);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function getAppointmentsFromFirestore(): Promise<Appointment[]> {
  const path = 'appointments';
  try {
    const { fs, db } = await loadFirestoreCtx();
    const colRef = fs.collection(db, 'appointments');
    const snap = await fs.getDocs(colRef);
    const list: Appointment[] = [];
    snap.forEach((d) => {
      const data = d.data();
      const docIdStr = String(d.id || '');
      list.push({
        id: d.id,
        referenceNumber: data.referenceNumber || (docIdStr ? `RABA-${docIdStr.slice(-6)}` : 'RABA-000000'),
        childName: data.patientName || data.childName || '',
        childAge: typeof data.childAge === 'number' ? data.childAge : 5,
        guardianName: data.parentName || data.guardianName || '',
        guardianPhone: data.phone || data.guardianPhone || '',
        guardianEmail: data.guardianEmail || '',
        serviceId: data.serviceId || '',
        serviceTitle: data.serviceName || data.serviceTitle || '',
        specialistId: data.specialistId || '',
        specialistName: data.specialistName || '',
        date: data.date || '',
        timeSlot: data.time || data.timeSlot || '',
        status: data.status || 'pending',
        paymentStatus: data.paymentStatus || 'unpaid',
        paymentMethod: data.paymentMethod || 'mada',
        amount: typeof data.amount === 'number' ? data.amount : 0,
        reminderSettings: data.reminderSettings || { whatsapp: true, sms: false, email: false },
        notes: data.notes || '',
        createdAt: data.createdAt || new Date().toISOString()
      });
    });
    return list;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
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

  loadFirestoreCtx()
    .then(({ fs, db }) => {
      if (cancelled) return;
      const colRef = fs.collection(db, 'appointments');
      realUnsub = fs.onSnapshot(
        colRef,
        (snapshot) => {
          const list: Appointment[] = [];
          snapshot.forEach((d) => {
            const data = d.data();
            const docIdStr = String(d.id || '');
            list.push({
              id: d.id,
              referenceNumber: data.referenceNumber || (docIdStr ? `RABA-${docIdStr.slice(-6)}` : 'RABA-000000'),
              childName: data.patientName || data.childName || '',
              childAge: typeof data.childAge === 'number' ? data.childAge : 5,
              guardianName: data.parentName || data.guardianName || '',
              guardianPhone: data.phone || data.guardianPhone || '',
              guardianEmail: data.guardianEmail || '',
              serviceId: data.serviceId || '',
              serviceTitle: data.serviceName || data.serviceTitle || '',
              specialistId: data.specialistId || '',
              specialistName: data.specialistName || '',
              date: data.date || '',
              timeSlot: data.time || data.timeSlot || '',
              status: data.status || 'pending',
              paymentStatus: data.paymentStatus || 'unpaid',
              paymentMethod: data.paymentMethod || 'mada',
              amount: typeof data.amount === 'number' ? data.amount : 0,
              reminderSettings: data.reminderSettings || { whatsapp: true, sms: false, email: false },
              notes: data.notes || '',
              createdAt: data.createdAt || new Date().toISOString()
            });
          });
          onUpdate(list);
        },
        (error) => {
          console.error('[Firestore Realtime Error] appointments listener error:', error);
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
