export interface SpecialistCardCustomization {
  customAvatar?: string;
  displayMode?: 'cover' | 'contain';
  focalPosition?: 'top' | 'center' | 'bottom';
  zoomLevel?: number;
  isTopRated?: boolean;
  isAvailableToday?: boolean;
}

export interface Specialist {
  id: string;
  name: string;
  nameEn?: string;
  title: string;
  titleEn?: string;
  role: string;
  roleEn?: string;
  category?: 'all' | 'aba' | 'occupational' | 'speech' | 'psychology' | string;
  department?: string;
  avatar: string;
  image?: string;
  cardImage?: string;
  fallbackAvatar?: string;
  isTopRated?: boolean;
  orderIndex?: number;
  posterCrop?: string;
  portraitCrop?: string;
  focalPosition?: string;
  zoomLevel?: number;
  experienceYears: number;
  licenseNumber: string;
  specialties: string[];
  specialtiesEn?: string[];
  education: string[];
  educationEn?: string[];
  bio: string;
  bioEn?: string;
  certifications: string[];
  certificationsEn?: string[];
  availableDays: string[];
  availableDaysEn?: string[];
  rating: number;
  reviewsCount: number;
  sessionPrice: number;
  cardCustomization?: SpecialistCardCustomization;
}

export interface ServiceItem {
  id: string;
  title: string;
  titleEn?: string;
  category: 'occupational' | 'speech' | 'behavior' | 'physical' | 'early_intervention' | 'aba' | 'learning' | 'sensory' | 'psychological';
  categoryAr: string;
  categoryEn?: string;
  description: string;
  descriptionEn?: string;
  benefits: string[];
  benefitsEn?: string[];
  targetAges: string;
  targetAgesEn?: string;
  durationMinutes: number;
  iconName: string;
  image: string;
  featured?: boolean;
  sessionPrice?: number;
  assessmentPrice?: number;
  originalPrice?: number;
  priceDisplayAr?: string;
  priceDisplayEn?: string;
  showPrice?: boolean;
}

export interface TherapyPackage {
  id: string;
  name: string;
  nameEn?: string;
  badge?: string;
  badgeEn?: string;
  tagline: string;
  taglineEn?: string;
  category?: 'all' | 'summer' | 'assessment' | 'sensory' | 'speech' | 'aba';
  categoryTitle?: string;
  categoryTitleEn?: string;
  categoryCode?: string;
  categoryCodeEn?: string;
  sessionsCount: number;
  durationWeeks: number;
  durationText?: string;
  durationTextEn?: string;
  price: number;
  originalPrice?: number;
  features: string[];
  featuresEn?: string[];
  recommendedFor: string;
  recommendedForEn?: string;
  popular?: boolean;
  colorTheme: string;
  isSummer?: boolean;
  sessionDurationText?: string;
  sessionDurationTextEn?: string;
  disclaimerText?: string;
  disclaimerTextEn?: string;
  installmentText?: string;
  installmentTextEn?: string;
}

export type CustomerRequestType = 
  | 'appointment'          // حجز جلسة عيادة
  | 'package'              // باقة تأهيلية
  | 'course'               // تسجيل كورس / دورة تدريبية
  | 'shadow_teacher'       // طلب خدمة معلم ظل
  | 'national_day_offer'   // عرض اليوم الوطني 96
  | 'quick_consultation'   // استشارة سريعة / اتصال هاتفي
  | 'store_order';         // طلب منتجات من المتجر

export interface StoreOrderItem {
  id: string;
  name: string;
  nameEn?: string;
  price: number;
  quantity: number;
}

export interface Appointment {
  id: string;
  referenceNumber: string;
  childName: string;
  childAge: number;
  guardianName: string;
  guardianPhone: string;
  guardianEmail: string;
  serviceId: string;
  serviceTitle: string;
  specialistId: string;
  specialistName: string;
  date: string;
  timeSlot: string;
  notes?: string;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled' | 'contacted' | 'new';
  paymentStatus: 'paid' | 'unpaid' | 'installment';
  paymentMethod?: 'mada' | 'apple_pay' | 'visa' | 'tabby' | 'cod' | 'bank_transfer' | 'tamara' | 'emkan';
  amount: number;
  reminderSettings: {
    whatsapp: boolean;
    sms: boolean;
    email: boolean;
    intervals?: string[];
  };
  createdAt: string;
  createdAtISO?: string;
  updatedAt?: string;

  // Enriched Customer Request fields:
  type?: string;
  requestType?: CustomerRequestType;
  requestSource?: string;
  branch?: string;
  city?: string;
  childBirthDate?: string;
  couponCode?: string;
  orderItems?: StoreOrderItem[];
  shippingAddress?: string;
  preferredCallTime?: string;
  adminNotes?: string;
  readByAdmin?: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'appointment_reminder' | 'payment_due' | 'report_ready' | 'system' | 'reminder' | 'confirmation' | 'report';
  timestamp?: string;
  date?: string;
  read: boolean;
  appointmentId?: string;
  actionUrl?: string;
  channel?: 'whatsapp' | 'sms' | 'system' | 'email';
}

export interface ParentReview {
  id: string;
  parentName: string;
  parentNameEn?: string;
  childName?: string;
  childNameEn?: string;
  childIssue?: string;
  childIssueEn?: string;
  avatar?: string;
  rating: number;
  date: string;
  dateEn?: string;
  role?: string;
  roleEn?: string;
  location?: string;
  locationEn?: string;
  category?: string;
  categoryEn?: string;
  treatedBy?: string;
  treatedByEn?: string;
  content?: string;
  contentEn?: string;
  comment?: string;
  commentEn?: string;
  specialistName?: string;
  specialistNameEn?: string;
  serviceTitle?: string;
  serviceTitleEn?: string;
  improvementDuration?: string;
  improvementDurationEn?: string;
  childAge?: number | string;
  milestoneAchieved?: string;
  isVerifiedParent?: boolean;
  verified?: boolean;
  verifiedBeneficiary?: boolean;
  isAnonymous?: boolean;
}

export type PermissionId = 
  | 'manage_appointments'   // إدارة المواعيد والحجوزات
  | 'manage_services'       // إدارة الخدمات وتعديل الأسعار
  | 'manage_packages'       // إدارة باقات التأهيل
  | 'manage_specialists'    // إدارة الأخصائيين والكوادر
  | 'manage_offers'         // إدارة العروض وكوبونات الخصم
  | 'manage_reviews'        // إدارة واعتماد آراء وتقييمات العملاء
  | 'manage_users'          // إدارة المستخدمين والصلاحيات
  | 'view_finances'         // عرض التقارير المالية والإيرادات
  | 'send_notifications'    // إرسال الإشعارات وتنبيهات الواتساب
  | 'system_settings';      // إعدادات المركز العامة

export type UserRole = 
  | 'super_admin'           // المدير العام والتنفيذي
  | 'operations_manager'    // مدير العمليات
  | 'clinical_supervisor'   // المشرف الطبي والإكلينيكي
  | 'receptionist'          // موظف الاستقبال والمواعيد
  | 'accountant'            // المحاسب المالي
  | 'custom';               // دور مخصص

export interface AdminUser {
  id: string;
  name: string;
  nameEn?: string;
  username: string;
  email: string;
  phone: string;
  role: UserRole;
  roleTitleAr: string;
  roleTitleEn: string;
  department: string;
  status: 'active' | 'suspended';
  avatar?: string;
  password?: string;
  permissions: PermissionId[];
  createdAt: string;
  lastLogin?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  titleEn?: string;
  slug: string;
  excerpt: string;
  excerptEn?: string;
  content: string[];
  contentEn?: string[];
  category: 'autism' | 'occupational' | 'speech' | 'aba' | 'family_guidance';
  categoryTitle: string;
  categoryTitleEn?: string;
  categoryColor: string; // e.g. 'sky' | 'emerald' | 'amber' | 'rose' | 'purple'
  author: {
    id?: string;
    name: string;
    nameEn?: string;
    role: string;
    roleEn?: string;
    avatar: string;
  };
  image: string;
  readTimeMinutes: number;
  publishDate: string;
  publishDateEn?: string;
  viewsCount: number;
  likesCount: number;
  tags: string[];
  tagsEn?: string[];
  keyTakeaways: string[];
  keyTakeawaysEn?: string[];
  status?: 'published' | 'draft';
  isSliderFeatured?: boolean;
  order?: number;
}

export interface OfferTerm {
  textAr: string;
  textEn: string;
}

export interface OfferCustomStyling {
  bgGradientFrom?: string;   // Start background hex/rgba
  bgGradientVia?: string;    // Middle background hex/rgba
  bgGradientTo?: string;     // End background hex/rgba
  borderColor?: string;      // Card border color
  borderHoverColor?: string; // Card border hover color
  accentColor?: string;      // Primary highlight / accent color (e.g. #00E5BE)
  badgeBgColor?: string;     // Badge pill background
  badgeTextColor?: string;   // Badge pill text color
  ribbonBgColor?: string;    // Ribbon background color
  ribbonTextColor?: string;  // Ribbon text color
  glowColor?: string;        // Ambient glow color
  subcardBg?: string;        // Inner details card background
  subcardBorder?: string;    // Inner details card border
  textColor?: string;        // Main text color
  themePreset?: 'emerald' | 'teal' | 'indigo' | 'amber' | 'rose' | 'navy' | 'custom';
}

export interface OfferData {
  id: string;
  titleAr: string;
  titleEn: string;
  subtitleAr: string;
  subtitleEn: string;
  badgeAr: string;
  badgeEn: string;
  couponCode: string;
  targetDate: string;
  dateLabelAr: string;
  dateLabelEn: string;
  discountType: 'percentage' | 'free_day' | 'fixed_amount';
  discountValue: number;
  theme?: 'emerald' | 'teal' | 'indigo' | 'amber' | 'rose' | 'navy' | 'custom';
  isNationalDay?: boolean;
  active: boolean;
  descriptionAr?: string;
  descriptionEn?: string;
  terms?: OfferTerm[];

  // Detailed Customization Extensions
  ribbonAr?: string;             // e.g. 'لجميع عملائنا' أو 'للعملاء الجدد'
  ribbonEn?: string;
  headerTagAr?: string;          // e.g. 'عزّنا بطبعنا'
  headerTagEn?: string;
  headerTagSubAr?: string;       // e.g. 'اليوم الوطني 96'
  headerTagSubEn?: string;
  graphicType?: 'falcon' | 'gift' | 'percent' | 'sparkles' | 'award';
  graphicUrl?: string;
  showCountdown?: boolean;       // whether to display countdown timer (default true)
  claimButtonTextAr?: string;    // e.g. 'الاستفادة من العرض الآن'
  claimButtonTextEn?: string;
  phone?: string;                // e.g. '966550000000'
  styling?: OfferCustomStyling;  // Detailed color & card style customizer
}

export interface TrackingPixelItem {
  id: string;
  is_active: boolean;
}

export interface TrackingScriptItem {
  script: string;
  is_active: boolean;
}

export interface TrackingPixelsConfig {
  meta: TrackingPixelItem;
  tiktok: TrackingPixelItem;
  snapchat: TrackingPixelItem;
  gtm: TrackingPixelItem;
  custom_head: TrackingScriptItem;
  custom_body: TrackingScriptItem;
}

export const DEFAULT_TRACKING_PIXELS: TrackingPixelsConfig = {
  meta: { id: '', is_active: false },
  tiktok: { id: '', is_active: false },
  snapchat: { id: '', is_active: false },
  gtm: { id: '', is_active: false },
  custom_head: { script: '', is_active: false },
  custom_body: { script: '', is_active: false }
};

