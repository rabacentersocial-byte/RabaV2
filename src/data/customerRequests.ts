import { Appointment, CustomerRequestType, StoreOrderItem, NotificationItem } from '../types';
import { savePersistentModule } from '../utils/persistentSync';

export const DISPATCH_REQUEST_EVENT = 'raba_new_customer_request';

export function generateRequestReference(type: CustomerRequestType): string {
  const prefixMap: Record<CustomerRequestType, string> = {
    appointment: 'RB',
    package: 'PKG',
    shadow_teacher: 'ST',
    national_day_offer: 'ND96',
    quick_consultation: 'QC',
    store_order: 'ORD'
  };
  const prefix = prefixMap[type] || 'REQ';
  const num = Math.floor(100000 + Math.random() * 900000);
  return `${prefix}-${num}`;
}

export function saveAndBroadcastCustomerRequest(request: Appointment): Appointment {
  try {
    // 1. Retrieve existing appointments from localStorage
    const saved = localStorage.getItem('raba_appointments') || localStorage.getItem('khotwa_appointments');
    const list: Appointment[] = saved ? JSON.parse(saved) : [];
    
    // 2. Prepend new request
    const updated = [request, ...list.filter(a => a.id !== request.id)];
    localStorage.setItem('raba_appointments', JSON.stringify(updated));
    savePersistentModule('raba_appointments', updated);

    // 3. Create Admin Notification Item
    const savedNotifs = localStorage.getItem('raba_notifications') || localStorage.getItem('khotwa_notifications');
    const notifsList: NotificationItem[] = savedNotifs ? JSON.parse(savedNotifs) : [];

    let notifTitle = 'طلب عميل جديد وارد عبر الموقع';
    if (request.requestType === 'shadow_teacher') {
      notifTitle = `طلب خدمة معلم ظل جديد: ${request.guardianName}`;
    } else if (request.requestType === 'store_order') {
      notifTitle = `طلب شراء جديد من متجر رابا (#${request.referenceNumber})`;
    } else if (request.requestType === 'quick_consultation') {
      notifTitle = `طلب استشارة مجانية واتصال: ${request.guardianName}`;
    } else if (request.requestType === 'national_day_offer') {
      notifTitle = `طلب استفادة من عرض اليوم الوطني: ${request.guardianName}`;
    } else if (request.requestType === 'package') {
      notifTitle = `طلب باقة تأهيلية جديدة: ${request.serviceTitle}`;
    } else {
      notifTitle = `حجز جديد: ${request.guardianName || request.childName}`;
    }

    const newNotif: NotificationItem = {
      id: 'notif-' + Date.now(),
      title: notifTitle,
      message: `العميل: ${request.guardianName} (${request.guardianPhone}). الخدمة: ${request.serviceTitle}. المرجع: ${request.referenceNumber}. الملاحظات: ${request.notes || 'لا توجد'}`,
      date: 'الآن',
      type: 'confirmation',
      read: false,
      appointmentId: request.id,
      channel: 'system'
    };

    const updatedNotifs = [newNotif, ...notifsList];
    localStorage.setItem('raba_notifications', JSON.stringify(updatedNotifs));
    savePersistentModule('raba_notifications', updatedNotifs);

    // 4. Asynchronously persist to Firestore & Backend API
    import('../services/firestoreService').then(m => {
      m.saveAppointmentToFirestore(request).catch(err => {
        console.error('[CustomerRequests] Error saving appointment to Firestore:', err);
      });
      if (request.requestType === 'quick_consultation' || request.requestType === 'shadow_teacher') {
        m.saveCustomerRequestToFirestore(request).catch(() => {});
      }
    }).catch(err => {
      console.error('[CustomerRequests] Failed to import firestoreService:', err);
    });

    // 5. Dispatch custom window events
    window.dispatchEvent(new CustomEvent(DISPATCH_REQUEST_EVENT, { detail: request }));
    window.dispatchEvent(new CustomEvent('raba_notifications_updated', { detail: updatedNotifs }));

    return request;
  } catch (err) {
    console.error('Error saving customer request:', err);
    return request;
  }
}

/**
 * Async version of saveAndBroadcastCustomerRequest that awaits database persistence
 * and returns true only if the record was successfully saved to Firestore or backend.
 */
export async function saveAndBroadcastCustomerRequestAsync(request: Appointment): Promise<boolean> {
  // Update local storage and UI events first for instant reactivity
  saveAndBroadcastCustomerRequest(request);

  try {
    const { saveAppointmentToFirestore } = await import('../services/firestoreService');
    const firestoreSuccess = await saveAppointmentToFirestore(request);
    return firestoreSuccess;
  } catch (err) {
    console.error('[CustomerRequests] Async persistence error:', err);
    return false;
  }
}

export interface DispatchCustomerRequestPayload {
  clientName: string;
  childName?: string;
  phone: string;
  email?: string;
  serviceType: string;
  sourcePage?: string;
  notes?: string;
  city?: string;
}

export function dispatchCustomerRequest(payload: DispatchCustomerRequestPayload): Appointment {
  const req: Appointment = {
    id: 'req-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
    childName: payload.childName || payload.clientName,
    childAge: 0,
    serviceId: 'service-custom',
    serviceTitle: payload.serviceType,
    specialistId: 'spec-general',
    specialistName: 'مركز رابا للتأهيل',
    date: new Date().toISOString().split('T')[0],
    timeSlot: 'طلب جديد',
    guardianName: payload.clientName,
    guardianPhone: payload.phone,
    guardianEmail: payload.email || '',
    notes: payload.notes || payload.sourcePage || '',
    status: 'pending',
    requestType: 'appointment',
    referenceNumber: generateRequestReference('appointment'),
    paymentStatus: 'unpaid',
    amount: 0,
    reminderSettings: {
      whatsapp: true,
      sms: false,
      email: true
    },
    createdAt: new Date().toISOString(),
    city: payload.city || 'الرياض'
  };

  return saveAndBroadcastCustomerRequest(req);
}

export async function dispatchCustomerRequestAsync(payload: DispatchCustomerRequestPayload): Promise<Appointment> {
  const req = dispatchCustomerRequest(payload);
  await saveAndBroadcastCustomerRequestAsync(req);
  return req;
}

export function getCustomerWhatsAppMessage(request: Appointment, isArabic = true): string {
  const centerPhone = '966575100100';

  let text = '';
  switch (request.requestType) {
    case 'shadow_teacher':
      text = isArabic
        ? `السلام عليكم ورحمة الله، أود تأكيد طلبي لـ «خدمة سِوار» (معلم الظل والدمج المدرسي والتربوي Shadow Teacher) بمركز رابا للأطفال.\n🔖 رقم الطلب: ${request.referenceNumber}\n👤 ولي الأمر: ${request.guardianName}\n📱 الجوال: ${request.guardianPhone}\n📍 المدينة: ${request.city || 'الرياض'}\nأرجو إفادتي بالخطوة القادمة وتحديد موعد المقابلة والتقييم.`
        : `Hello, I submitted a Sewar Program request (School Shadow Teacher) at Raba Center. Ref: ${request.referenceNumber}, Parent: ${request.guardianName}, Phone: ${request.guardianPhone}, City: ${request.city || 'Riyadh'}. Please confirm next steps.`;
      break;

    case 'store_order':
      const itemsList = request.orderItems?.map(i => `• ${i.name} (كمية: ${i.quantity}) - ${i.price * i.quantity} ر.س`).join('\n') || '';
      text = isArabic
        ? `السلام عليكم، قمت بطلب منتجات من متجر رابا التعليمي والتأهيلي:\n🔖 رقم الطلب: ${request.referenceNumber}\n👤 المستلم: ${request.guardianName}\n📱 الجوال: ${request.guardianPhone}\n📍 عنوان التوصيل: ${request.shippingAddress || 'الرياض'}\n💳 الإجمالي: ${request.amount} ريال (${request.paymentMethod === 'cod' ? 'دفع عند الاستلام' : 'تحويل/بطاقة'})\nالمنتجات المطلوبة:\n${itemsList}\nأرجو تأكيد الشحن والتوصيل.`
        : `Hello, I placed a store order at Raba Store. Ref: ${request.referenceNumber}, Recipient: ${request.guardianName}, Phone: ${request.guardianPhone}, Total: ${request.amount} SAR. Please confirm shipping.`;
      break;

    case 'quick_consultation':
      text = isArabic
        ? `السلام عليكم، قمت بطلب استشارة أولية مجانية واتصال هاتفي من الأخصائي بمركز رابا:\n🔖 المرجع: ${request.referenceNumber}\n👤 الاسم: ${request.guardianName}\n📱 رقم التواصل: ${request.guardianPhone}\n🎯 موضوع الاستشارة: ${request.serviceTitle}\n⏰ الوقت المفضل للاتصال: ${request.preferredCallTime || 'صباحاً أو مساءً'}\nأرجو الاتصال بي في أقرب وقت متاح.`
        : `Hello, I requested a free callback consultation from Raba Center specialists. Ref: ${request.referenceNumber}, Name: ${request.guardianName}, Phone: ${request.guardianPhone}. Topic: ${request.serviceTitle}.`;
      break;

    case 'national_day_offer':
      text = isArabic
        ? `السلام عليكم، أود تأكيد استفادتي من عروض اليوم الوطني 96 بمركز رابا:\n🔖 رقم الحجز: ${request.referenceNumber}\n👤 الاسم: ${request.guardianName}\n📱 الجوال: ${request.guardianPhone}\n🎁 العرض: ${request.serviceTitle}\n🎟️ كود الخصم: ${request.couponCode || 'KSA96'}\nأرجو تأكيد الاستفادة وتحديد موعد الحضور.`
        : `Hello, I claimed the Saudi National Day 96 offer at Raba Center. Ref: ${request.referenceNumber}, Name: ${request.guardianName}, Code: ${request.couponCode}. Please confirm.`;
      break;

    case 'package':
      text = isArabic
        ? `السلام عليكم، قمت بطلب الاشتراك في باقة تأهيلية بمركز رابا:\n🔖 رقم الطلب: ${request.referenceNumber}\n👤 ولي الأمر: ${request.guardianName}\n📱 الجوال: ${request.guardianPhone}\n👶 الطفل: ${request.childName} (${request.childAge} سنوات)\n📦 الباقة: ${request.serviceTitle}\n💳 القيمة: ${request.amount} ر.س\nأرجو تأكيد حجز الباقة وجدول الجلسات.`
        : `Hello, I requested to subscribe to therapy package: ${request.serviceTitle}. Ref: ${request.referenceNumber}, Name: ${request.guardianName}. Please confirm.`;
      break;

    default:
      text = isArabic
        ? `السلام عليكم، قمت بحجز موعد جديد في مركز رابا:\n🔖 رقم الحجز: ${request.referenceNumber}\n👤 ولي الأمر: ${request.guardianName}\n📱 الجوال: ${request.guardianPhone}\n👶 الطفل: ${request.childName}\n🎯 الجلسة: ${request.serviceTitle}\n👨‍⚕️ الأخصائي: ${request.specialistName}\n📅 الموعد: ${request.date} (${request.timeSlot})\nأرجو تأكيد الموعد والتفاصيل.`
        : `Hello, I booked an appointment at Raba Center. Ref: ${request.referenceNumber}, Name: ${request.guardianName}, Service: ${request.serviceTitle}, Date: ${request.date} ${request.timeSlot}. Please confirm.`;
      break;
  }

  return `https://wa.me/${centerPhone}?text=${encodeURIComponent(text)}`;
}
