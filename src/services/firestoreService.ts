import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  onSnapshot, 
  query, 
  orderBy, 
  limit 
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { Appointment, ParentReview, Specialist } from '../types';

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

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errMessage = error instanceof Error ? error.message : String(error);
  const isPermissionDenied = 
    (error as any)?.code === 'permission-denied' || 
    errMessage.toLowerCase().includes('missing or insufficient permissions') ||
    errMessage.toLowerCase().includes('permission_denied');

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

  if (isPermissionDenied) {
    console.error('Firestore Error: ', JSON.stringify(errInfo));
    throw new Error(JSON.stringify(errInfo));
  } else {
    // Graceful offline warning without unhandled rejection
    console.warn(`Firestore operation [${operationType}] at [${path}] operating in offline/resilient mode:`, errMessage);
  }
}

/**
 * Saves a new appointment booking to Firestore
 */
export async function saveAppointmentToFirestore(appointment: Appointment): Promise<boolean> {
  const docId = appointment.id || `apt-${Date.now()}`;
  const path = `appointments/${docId}`;
  try {
    const docRef = doc(db, 'appointments', docId);
    
    // Sanitize payload matching Firestore schema
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
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    return false;
  }
}

/**
 * Submits a parent review/testimonial to Firestore
 */
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
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    return false;
  }
}

