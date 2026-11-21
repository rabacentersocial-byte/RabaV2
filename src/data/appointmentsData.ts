import { Appointment, NotificationItem } from "../types";

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-001',
    referenceNumber: 'REF-84291',
    childName: 'سلطان محمد الشمري',
    childAge: 5,
    guardianName: 'محمد الشمري',
    guardianPhone: '0551234567',
    guardianEmail: 'm.alshammari@example.com',
    serviceId: 'srv-occupational',
    serviceTitle: 'العلاج الوظيفي والتكامل الحسي',
    specialistId: 'spec-1',
    specialistName: 'د. نورة العتيبي',
    date: '2026-09-20',
    timeSlot: '10:00 صباحاً - 10:45 صباحاً',
    notes: 'يعاني من حساسية مفرطة للأصوات ومسك القلم بطريقة غير سليمة',
    status: 'confirmed',
    paymentStatus: 'paid',
    paymentMethod: 'mada',
    amount: 280,
    reminderSettings: {
      whatsapp: true,
      sms: true,
      email: true,
      intervals: ['24h', '2h', '30m']
    },
    createdAt: '2026-09-17'
  },
  {
    id: 'apt-002',
    referenceNumber: 'REF-92104',
    childName: 'ريما عبدالله الحربي',
    childAge: 4,
    guardianName: 'عبدالله الحربي',
    guardianPhone: '0509876543',
    guardianEmail: 'a.alharbi@example.com',
    serviceId: 'srv-speech',
    serviceTitle: 'علاج اضطرابات النطق والتخاطب',
    specialistId: 'spec-3',
    specialistName: 'د. سارة المنصور',
    date: '2026-09-21',
    timeSlot: '04:30 مساءً - 05:15 مساءً',
    notes: 'تأخر في تكوين الجمل وصعوبة نطق حرف الراء والكاف',
    status: 'confirmed',
    paymentStatus: 'paid',
    paymentMethod: 'apple_pay',
    amount: 290,
    reminderSettings: {
      whatsapp: true,
      sms: true,
      email: false,
      intervals: ['24h', '2h']
    },
    createdAt: '2026-09-18'
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'تذكير بموعد جلسة العلاج الوظيفي القادمة',
    message: 'عزيزي ولي الأمر، نود تذكيركم بموعد جلسة الطفل (سلطان) مع د. نورة العتيبي غداً في تمام الساعة 10:00 صباحاً. يرجى الحضور قبل الموعد بـ 10 دقائق.',
    date: 'منذ 10 دقائق',
    type: 'reminder',
    read: false,
    appointmentId: 'apt-001',
    channel: 'whatsapp'
  },
  {
    id: 'notif-2',
    title: 'تم تأكيد حجز الموعد بنجاح ورقم السداد',
    message: 'تم استلام وتأكيد سداد جلسة التخاطب للطفلة (ريما) بنجاح عبر مدى. رقم الحجز: REF-92104. نتمنى لها كل التوفيق.',
    date: 'منذ ساعتين',
    type: 'confirmation',
    read: true,
    appointmentId: 'apt-002',
    channel: 'sms'
  },
  {
    id: 'notif-3',
    title: 'تقرير تطور المهارات الحركية الدقيقة جاهز',
    message: 'قام أخصائي العلاج الوظيفي بإيداع تقرير جلسات المتابعة لهذا الأسبوع. يمكنك الاطلاع على توصيات التمارين المنزلية.',
    date: 'أمس',
    type: 'report',
    read: true,
    channel: 'system'
  }
];


export const TIME_SLOTS = [
  '09:00 ص - 09:45 ص',
  '10:00 ص - 10:45 ص',
  '11:00 ص - 11:45 ص',
  '04:00 م - 04:45 م',
  '05:00 م - 05:45 م',
  '06:00 م - 06:45 م',
  '07:00 م - 07:45 م'
];

