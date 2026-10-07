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
import { db } from '../lib/firebase';
import { Appointment, ParentReview, Specialist } from '../types';

/**
 * Saves a new appointment booking to Firestore
 */
export async function saveAppointmentToFirestore(appointment: Appointment): Promise<boolean> {
  try {
    const docId = appointment.id || `apt-${Date.now()}`;
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
    console.warn('Could not save appointment to Firestore (offline fallback enabled):', error);
    return false;
  }
}

/**
 * Submits a parent review/testimonial to Firestore
 */
export async function saveTestimonialToFirestore(review: ParentReview): Promise<boolean> {
  try {
    const docId = review.id || `rev-${Date.now()}`;
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
    console.warn('Could not save testimonial to Firestore:', error);
    return false;
  }
}
