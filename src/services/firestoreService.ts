import { 
  collection, 
  doc, 
  setDoc, 
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs, 
  onSnapshot, 
  query, 
  orderBy, 
  limit,
  Unsubscribe
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { Appointment, ParentReview, Specialist, BlogPost } from '../types';

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
      providerInfo: auth?.currentUser?.providerData?.map(provider => ({
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

// ============================================================================
// 1. DYNAMIC SITE SETTINGS (Synchronized with Admin Dashboard & Visitor UI)
// ============================================================================

/**
 * Saves or updates a site setting in the 'site_settings' collection
 */
export async function saveSiteSettingToFirestore(key: string, data: any): Promise<void> {
  const path = `site_settings/${key}`;
  // Direct client-side write requires an authenticated Firebase session as enforced by firestore.rules
  if (!auth.currentUser) {
    return;
  }
  try {
    const docRef = doc(db, 'site_settings', key);
    await setDoc(docRef, {
      key,
      data,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    console.log(`[Firestore] Successfully saved site setting: ${key}`);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path, false);
  }
}

/**
 * Deletes a site setting from the 'site_settings' collection
 */
export async function deleteSiteSettingFromFirestore(key: string): Promise<void> {
  const path = `site_settings/${key}`;
  if (!auth.currentUser) {
    return;
  }
  try {
    const docRef = doc(db, 'site_settings', key);
    await deleteDoc(docRef);
    console.log(`[Firestore] Successfully deleted site setting: ${key}`);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path, false);
  }
}

/**
 * Fetches a single site setting from Firestore with strict 3000ms timeout
 */
export async function getSiteSettingFromFirestore(key: string): Promise<any | null> {
  const path = `site_settings/${key}`;
  try {
    const docRef = doc(db, 'site_settings', key);
    const snap = await withTimeout(getDoc(docRef), 3000);
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

/**
 * Fetches all site settings from Firestore with strict 3000ms timeout and safe fallback
 */
export async function getAllSiteSettingsFromFirestore(): Promise<Record<string, any>> {
  const path = 'site_settings';
  try {
    const colRef = collection(db, 'site_settings');
    const snap = await withTimeout(getDocs(colRef), 3000);
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

/**
 * Real-time listener for site_settings changes (Instant Visitor Reflection)
 */
export function subscribeSiteSettings(
  onUpdate: (settings: Record<string, any>) => void,
  onError?: (err: any) => void
): Unsubscribe {
  const path = 'site_settings';
  const colRef = collection(db, 'site_settings');
  return onSnapshot(
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
    const docRef = doc(db, 'specialists', docId);
    await setDoc(docRef, specialist, { merge: true });
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
    const docRef = doc(db, 'specialists', specialistId);
    await deleteDoc(docRef);
    console.log(`[Firestore] Successfully deleted specialist: ${specialistId}`);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function getSpecialistsFromFirestore(): Promise<Specialist[]> {
  const path = 'specialists';
  try {
    const colRef = collection(db, 'specialists');
    const snap = await withTimeout(getDocs(colRef), 3000);
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
  const colRef = collection(db, 'specialists');
  return onSnapshot(
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
}

// ============================================================================
// 3. APPOINTMENTS (Booking & Status Tracking)
// ============================================================================

export async function saveAppointmentToFirestore(appointment: Appointment): Promise<boolean> {
  const docId = appointment.id || `apt-${Date.now()}`;
  const path = `appointments/${docId}`;
  try {
    const docRef = doc(db, 'appointments', docId);
    
    const payload = {
      id: docId,
      patientName: appointment.childName || appointment.guardianName || 'مستفيد',
      parentName: appointment.guardianName || 'ولي أمر',
      phone: appointment.guardianPhone || '0500000000',
      serviceId: appointment.serviceId || 'general',
      serviceName: appointment.serviceTitle || 'استشارة تأهيلية',
      specialistId: appointment.specialistId || 'general',
      specialistName: appointment.specialistName || 'الفريق الاستشاري',
      branch: (appointment as any).branch || 'النرجس',
      date: appointment.date || new Date().toISOString().split('T')[0],
      time: appointment.timeSlot || '10:00 AM',
      status: appointment.status || 'pending',
      notes: appointment.notes || '',
      createdAt: new Date().toISOString()
    };

    await setDoc(docRef, payload, { merge: true });
    console.log(`[Firestore] Successfully created appointment: ${docId}`);
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    return false;
  }
}

export async function updateAppointmentStatusInFirestore(appointmentId: string, status: string): Promise<void> {
  const path = `appointments/${appointmentId}`;
  try {
    const docRef = doc(db, 'appointments', appointmentId);
    await updateDoc(docRef, { status, updatedAt: new Date().toISOString() });
    console.log(`[Firestore] Successfully updated appointment status: ${appointmentId} -> ${status}`);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteAppointmentFromFirestore(appointmentId: string): Promise<void> {
  const path = `appointments/${appointmentId}`;
  try {
    const docRef = doc(db, 'appointments', appointmentId);
    await deleteDoc(docRef);
    console.log(`[Firestore] Successfully deleted appointment: ${appointmentId}`);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function getAppointmentsFromFirestore(): Promise<Appointment[]> {
  const path = 'appointments';
  try {
    const colRef = collection(db, 'appointments');
    const snap = await getDocs(colRef);
    const list: Appointment[] = [];
    snap.forEach((d) => {
      const data = d.data();
      list.push({
        id: d.id,
        referenceNumber: data.referenceNumber || `RABA-${d.id.slice(-6)}`,
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
  const colRef = collection(db, 'appointments');
  return onSnapshot(
    colRef,
    (snapshot) => {
      const list: Appointment[] = [];
      snapshot.forEach((d) => {
        const data = d.data();
        list.push({
          id: d.id,
          referenceNumber: data.referenceNumber || `RABA-${d.id.slice(-6)}`,
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
}

// ============================================================================
// 4. TESTIMONIALS & REVIEWS
// ============================================================================

export async function saveTestimonialToFirestore(review: ParentReview): Promise<boolean> {
  const docId = review.id || `rev-${Date.now()}`;
  const path = `testimonials/${docId}`;
  try {
    const docRef = doc(db, 'testimonials', docId);

    const payload = {
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
    };

    await setDoc(docRef, payload, { merge: true });
    console.log(`[Firestore] Successfully saved review: ${docId}`);
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    return false;
  }
}

export async function deleteTestimonialFromFirestore(reviewId: string): Promise<void> {
  const path = `testimonials/${reviewId}`;
  try {
    const docRef = doc(db, 'testimonials', reviewId);
    await deleteDoc(docRef);
    console.log(`[Firestore] Successfully deleted testimonial: ${reviewId}`);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function getTestimonialsFromFirestore(): Promise<ParentReview[]> {
  const path = 'testimonials';
  try {
    const colRef = collection(db, 'testimonials');
    const snap = await getDocs(colRef);
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
  const colRef = collection(db, 'testimonials');
  return onSnapshot(
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
    const docRef = doc(db, 'blog_posts', docId);
    await setDoc(docRef, { ...post, id: docId }, { merge: true });
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
    const docRef = doc(db, 'blog_posts', postId);
    await deleteDoc(docRef);
    console.log(`[Firestore] Successfully deleted blog post: ${postId}`);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}
