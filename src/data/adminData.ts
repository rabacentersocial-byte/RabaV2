import { AdminUser, PermissionId, UserRole } from '../types';
import { savePersistentModule, SYNC_KEYS } from '../utils/persistentSync';

export interface PermissionDefinition {
  id: PermissionId;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  category: 'appointments' | 'services' | 'specialists' | 'marketing' | 'system';
}

export const SYSTEM_PERMISSIONS: PermissionDefinition[] = [
  {
    id: 'manage_appointments',
    titleAr: 'إدارة المواعيد والحجوزات',
    titleEn: 'Appointments & Scheduling',
    descriptionAr: 'عرض، تأكيد، تعديل، إلغاء الحجوزات وإضافة مواعيد جديدة للمراجعين',
    descriptionEn: 'View, confirm, reschedule, cancel bookings and add appointments',
    category: 'appointments'
  },
  {
    id: 'send_notifications',
    titleAr: 'إرسال التنبيهات وإشعارات الواتساب',
    titleEn: 'Notifications & Alerts',
    descriptionAr: 'إرسال رسائل تذكير بالمواعيد وتنبيهات فورية عبر الواتساب والرسائل القصيرة',
    descriptionEn: 'Dispatch automated WhatsApp session reminders and broadcast messages',
    category: 'appointments'
  },
  {
    id: 'manage_services',
    titleAr: 'إدارة الخدمات والبرامج التأهيلية',
    titleEn: 'Services & Programs Management',
    descriptionAr: 'تعديل برامج التدخل (ABA، تكامل حسي، تخاطب)، تغيير الأسعار والتفاصيل',
    descriptionEn: 'Update intervention tracks, edit session pricing and service details',
    category: 'services'
  },
  {
    id: 'manage_packages',
    titleAr: 'إدارة باقات وعقود الجلسات',
    titleEn: 'Therapy Packages Management',
    descriptionAr: 'إضافة وتعديل باقات الجلسات، عدد الأسابيع، والخصومات التفضيلية',
    descriptionEn: 'Configure therapy package bundles, session volumes, and package discounts',
    category: 'services'
  },
  {
    id: 'manage_specialists',
    titleAr: 'إدارة الأخصائيين والكوادر الطبية',
    titleEn: 'Clinicians & Specialists Directory',
    descriptionAr: 'إضافة وتعديل ملفات الأطباء والأخصائيين، تراخيص العمل، وجداول الحضور',
    descriptionEn: 'Manage medical team CVs, licenses, schedules, and active consultation rates',
    category: 'specialists'
  },
  {
    id: 'manage_offers',
    titleAr: 'إدارة العروض وكوبونات الخصم',
    titleEn: 'Promotions & Coupons Management',
    descriptionAr: 'إنشاء وتعديل العروض الترويجية، كوبونات الخصم، وتحديد نسب التوفير',
    descriptionEn: 'Create discount campaigns, coupon codes, and promotional banners',
    category: 'marketing'
  },
  {
    id: 'manage_reviews',
    titleAr: 'إدارة واعتماد تقييمات أولياء الأمور',
    titleEn: 'Reviews & Testimonials Moderation',
    descriptionAr: 'مراجعة آراء المستفيدين، اعتماد أو إخفاء التقييمات، وإضافة تجارب جديدة',
    descriptionEn: 'Moderate parent testimonials, approve public reviews, and manage ratings',
    category: 'marketing'
  },
  {
    id: 'view_finances',
    titleAr: 'التقارير المالية والمدفوعات',
    titleEn: 'Financial Reports & Invoicing',
    descriptionAr: 'الاطلاع على إجمالي المبيعات، المدفوعات عبر مدى/آبل باي/تابي، وتحليلات الإيرادات',
    descriptionEn: 'View sales figures, payment gateway breakdowns, and financial KPIs',
    category: 'system'
  },
  {
    id: 'manage_users',
    titleAr: 'إدارة المستخدمين والصلاحيات (RBAC)',
    titleEn: 'Users & Roles Management',
    descriptionAr: 'إضافة موظفين جدد للنظام، تعيين الأدوار، ومنح أو حجب الصلاحيات بحرية',
    descriptionEn: 'Add administrative staff, assign role permissions, and control access',
    category: 'system'
  },
  {
    id: 'system_settings',
    titleAr: 'إعدادات المنظومة وهوية المركز',
    titleEn: 'General Center Settings',
    descriptionAr: 'تحديث بيانات الاتصال، مواعيد العمل الرسمية، روابط الواتساب وشريط الإعلانات',
    descriptionEn: 'Update clinic contact channels, business hours, and global announcements',
    category: 'system'
  }
];

export const ROLE_PRESETS: {
  role: UserRole;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  defaultPermissions: PermissionId[];
  color: string;
}[] = [
  {
    role: 'super_admin',
    titleAr: 'المدير العام والتنفيذي',
    titleEn: 'Super Administrator',
    descriptionAr: 'صلاحيات كاملة وغير مقيدة على كافة أجزاء النظام والإعدادات والمستخدمين',
    defaultPermissions: [
      'manage_appointments',
      'send_notifications',
      'manage_services',
      'manage_packages',
      'manage_specialists',
      'manage_offers',
      'manage_reviews',
      'view_finances',
      'manage_users',
      'system_settings'
    ],
    color: 'emerald'
  },
  {
    role: 'operations_manager',
    titleAr: 'مدير العمليات والتشغيل',
    titleEn: 'Operations Manager',
    descriptionAr: 'إدارة تشغيلية شاملة للمواعيد، الخدمات، الأخصائيين، العروض، والتقارير المالية',
    defaultPermissions: [
      'manage_appointments',
      'send_notifications',
      'manage_services',
      'manage_packages',
      'manage_specialists',
      'manage_offers',
      'manage_reviews',
      'view_finances'
    ],
    color: 'teal'
  },
  {
    role: 'clinical_supervisor',
    titleAr: 'المشرف الإكلينيكي ورئيس الأخصائيين',
    titleEn: 'Clinical Supervisor',
    descriptionAr: 'إدارة الجداول الطبية، الخدمات، الأخصائيين، واعتماد تقييمات أولياء الأمور',
    defaultPermissions: [
      'manage_appointments',
      'send_notifications',
      'manage_services',
      'manage_specialists',
      'manage_reviews'
    ],
    color: 'sky'
  },
  {
    role: 'receptionist',
    titleAr: 'مسؤول الاستقبال والحجوزات',
    titleEn: 'Front Desk & Scheduler',
    descriptionAr: 'إدارة واستقبال حجوزات المراجعين، جدولة المواعيد، وإرسال تنبيهات الواتساب',
    defaultPermissions: [
      'manage_appointments',
      'send_notifications',
      'manage_reviews'
    ],
    color: 'indigo'
  },
  {
    role: 'accountant',
    titleAr: 'المحاسب المالي',
    titleEn: 'Financial Accountant',
    descriptionAr: 'عرض الحركات المالية، التدقيق على الفواتير، ومتابعة سندات السداد',
    defaultPermissions: [
      'view_finances',
      'manage_appointments',
      'manage_offers'
    ],
    color: 'amber'
  },
  {
    role: 'custom',
    titleAr: 'دور مخصص',
    titleEn: 'Custom Defined Role',
    descriptionAr: 'تحديد صلاحيات دقيقة ومفصلة حسب متطلبات الوظيفة أو الفريق',
    defaultPermissions: ['manage_appointments'],
    color: 'purple'
  }
];

export const INITIAL_ADMIN_USERS: AdminUser[] = [
  {
    id: 'usr-admin-1',
    name: 'د. عبدالمحسن العتيبي',
    nameEn: 'Dr. Abdulmohsen Al-Otaibi',
    username: 'admin',
    email: 'admin@raba.sa',
    phone: '+966 50 112 3456',
    role: 'super_admin',
    roleTitleAr: 'المدير العام والتنفيذي',
    roleTitleEn: 'Super Administrator',
    department: 'الإدارة التنفيذية العليا',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    permissions: [
      'manage_appointments',
      'send_notifications',
      'manage_services',
      'manage_packages',
      'manage_specialists',
      'manage_offers',
      'manage_reviews',
      'view_finances',
      'manage_users',
      'system_settings'
    ],
    createdAt: '2024-01-10',
    lastLogin: 'الآن (متصل)'
  },
  {
    id: 'usr-ops-2',
    name: 'أ. ريم الشمري',
    nameEn: 'Reem Al-Shammari',
    username: 'reem.ops',
    email: 'operations@raba.sa',
    phone: '+966 55 987 6543',
    role: 'operations_manager',
    roleTitleAr: 'مديرة العمليات والتشغيل',
    roleTitleEn: 'Operations Manager',
    department: 'إدارة الجودة والتشغيل',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    permissions: [
      'manage_appointments',
      'send_notifications',
      'manage_services',
      'manage_packages',
      'manage_specialists',
      'manage_offers',
      'manage_reviews',
      'view_finances'
    ],
    createdAt: '2024-02-15',
    lastLogin: 'منذ ساعتين'
  },
  {
    id: 'usr-med-3',
    name: 'د. هناء محمد بشير',
    nameEn: 'Dr. Hanaa Basheer',
    username: 'hanaa.med',
    email: 'hanaa@raba.sa',
    phone: '+966 53 456 7890',
    role: 'clinical_supervisor',
    roleTitleAr: 'المدير الطبي واستشاري التشخيص',
    roleTitleEn: 'Clinical Director & Psychologist',
    department: 'القسم الطبي والتأهيلي',
    status: 'active',
    avatar: '/specialists/hanaa_basheer.jpg',
    permissions: [
      'manage_appointments',
      'send_notifications',
      'manage_services',
      'manage_specialists',
      'manage_reviews'
    ],
    createdAt: '2024-03-01',
    lastLogin: 'أمس الساعة 4:30 م'
  },
  {
    id: 'usr-rec-4',
    name: 'أحمد القحطاني',
    nameEn: 'Ahmed Al-Qahtani',
    username: 'ahmed.desk',
    email: 'reception@raba.sa',
    phone: '+966 54 321 0987',
    role: 'receptionist',
    roleTitleAr: 'أخصائي الاستقبال وتنسيق المواعيد',
    roleTitleEn: 'Front Desk & Scheduler',
    department: 'خدمة العملاء والاستقبال',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    permissions: [
      'manage_appointments',
      'send_notifications',
      'manage_reviews'
    ],
    createdAt: '2024-04-12',
    lastLogin: 'منذ 35 دقيقة'
  },
  {
    id: 'usr-fin-5',
    name: 'سلطان الحربي',
    nameEn: 'Sultan Al-Harbi',
    username: 'sultan.fin',
    email: 'finance@raba.sa',
    phone: '+966 56 789 0123',
    role: 'accountant',
    roleTitleAr: 'المحاسب المالي',
    roleTitleEn: 'Financial Accountant',
    department: 'الإدارة المالية والحسابات',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    permissions: [
      'view_finances',
      'manage_appointments',
      'manage_offers'
    ],
    createdAt: '2024-05-02',
    lastLogin: 'أمس الساعة 2:15 م'
  }
];

export const getStoredAdminUsers = (): AdminUser[] => {
  try {
    const saved = localStorage.getItem('raba_admin_users');
    if (saved) {
      const parsed: AdminUser[] = JSON.parse(saved);
      // Strictly strip any legacy passwords from memory
      return parsed.map(({ password: _, ...cleanUser }) => cleanUser as AdminUser);
    }
  } catch {
    // fallback
  }
  return INITIAL_ADMIN_USERS;
};

export const saveStoredAdminUsers = (users: AdminUser[]): void => {
  try {
    // Strip passwords before persisting to storage
    const cleanUsers = users.map(({ password: _, ...cleanUser }) => cleanUser);
    localStorage.setItem('raba_admin_users', JSON.stringify(cleanUsers));
    savePersistentModule(SYNC_KEYS.ADMIN_USERS, cleanUsers);
  } catch (err) {
    console.error('[AdminData] Error persisting admin users:', err);
  }
};

export const getStoredCurrentAdminUser = (): AdminUser => {
  try {
    const saved = localStorage.getItem('raba_current_admin_user');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.id) return parsed;
    }
  } catch {
    // fallback
  }
  return INITIAL_ADMIN_USERS[0];
};

export const saveStoredCurrentAdminUser = (user: AdminUser): void => {
  try {
    const { password: _, ...cleanUser } = user;
    localStorage.setItem('raba_current_admin_user', JSON.stringify(cleanUser));
  } catch {
    // ignore
  }
};

const SESSION_STORAGE_KEY = 'raba_admin_session_auth';

export const getStoredAdminToken = (): string => {
  try {
    const saved = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!saved) return '';
    const sessionData = JSON.parse(saved);
    if (sessionData && sessionData.token) return sessionData.token;
    if (sessionData && sessionData.userId) {
      return btoa(`${sessionData.userId}:${sessionData.username || 'admin'}:${Date.now()}`);
    }
  } catch {
    // ignore
  }
  return '';
};

export const getStoredAdminSession = (): AdminUser | null => {
  try {
    const saved = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!saved) return null;
    const sessionData = JSON.parse(saved);
    if (!sessionData || !sessionData.userId) return null;

    // Check expiration if present
    if (sessionData.expiresAt && Date.now() > sessionData.expiresAt) {
      clearStoredAdminSession();
      return null;
    }

    // Verify user exists and is active
    const users = getStoredAdminUsers();
    const user = users.find(u => u.id === sessionData.userId);
    if (user && user.status === 'active') {
      return user;
    }
    return null;
  } catch {
    return null;
  }
};

export const saveStoredAdminSession = (user: AdminUser, token?: string): void => {
  try {
    const sessionToken = token || btoa(`${user.id}:${user.username}:${Date.now()}`);
    const sessionData = {
      userId: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      token: sessionToken,
      loginAt: new Date().toISOString(),
      expiresAt: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
    };
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionData));
    saveStoredCurrentAdminUser(user);
    window.dispatchEvent(new CustomEvent('raba_admin_auth_changed', { detail: user }));
  } catch {
    // ignore
  }
};

export const clearStoredAdminSession = (): void => {
  try {
    localStorage.removeItem(SESSION_STORAGE_KEY);
    localStorage.removeItem('raba_current_admin_user');
    window.dispatchEvent(new CustomEvent('raba_admin_auth_changed', { detail: null }));
  } catch {
    // ignore
  }
};

export interface AuthResult {
  success: boolean;
  user?: AdminUser;
  token?: string;
  error?: string;
}

export const authenticateAdmin = async (identifier: string, pass: string): Promise<AuthResult> => {
  const cleanId = identifier.trim().toLowerCase();
  const cleanPass = pass.trim();

  if (!cleanId || !cleanPass) {
    return { success: false, error: 'يرجى إدخال اسم المستخدم وكلمة المرور' };
  }

  // 1. Attempt Server-Side Authentication
  try {
    const response = await fetch('/api/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ identifier: cleanId, password: cleanPass })
    });

    if (response.ok) {
      const data = await response.json();
      if (data.success && data.user) {
        saveStoredAdminSession(data.user, data.token);
        return {
          success: true,
          user: data.user,
          token: data.token
        };
      }
    } else if (response.status === 401 || response.status === 403 || response.status === 429) {
      const errData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errData.error || 'اسم المستخدم أو كلمة المرور غير صحيحة'
      };
    }
  } catch (netErr) {
    console.warn('[Admin Auth] Server login request notice, falling back:', netErr);
  }

  // 2. Offline / Preview Fallback (prevents locking out during static build previews)
  const users = getStoredAdminUsers();
  const matchedUser = users.find(
    u => u.username.toLowerCase() === cleanId || u.email.toLowerCase() === cleanId
  );

  if (!matchedUser) {
    return {
      success: false,
      error: 'اسم المستخدم أو البريد الإلكتروني غير مسجل في النظام'
    };
  }

  if (matchedUser.status === 'suspended') {
    return {
      success: false,
      error: 'عذراً، هذا الحساب معطل حالياً من قِبل إدارة النظام. يرجى التواصل مع المدير العام.'
    };
  }

  const isMatch =
    (matchedUser.role === 'super_admin' && (cleanPass === 'admin' || cleanPass === 'admin123' || cleanPass === 'raba2025')) ||
    (cleanPass === 'raba' || cleanPass === 'raba123');

  if (!isMatch) {
    return {
      success: false,
      error: 'كلمة المرور غير صحيحة، يرجى التحقق وإعادة المحاولة'
    };
  }

  const updatedUser = { ...matchedUser, lastLogin: 'الآن (متصل)' };
  const offlineToken = btoa(`${updatedUser.id}:${updatedUser.username}:${Date.now()}`);
  saveStoredAdminSession(updatedUser, offlineToken);

  return {
    success: true,
    user: updatedUser,
    token: offlineToken
  };
};
