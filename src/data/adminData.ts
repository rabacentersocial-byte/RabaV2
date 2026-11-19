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
    id: 'manage_courses',
    titleAr: 'إدارة الكورسات وطلبات التسجيل',
    titleEn: 'Courses & Registration Requests',
    descriptionAr: 'تخصيص الكورسات، تفعيل خيارات السداد، واستقبال وتوجيه طلبات التسجيل في الكورسات',
    descriptionEn: 'Manage courses, activate payment methods, and receive or route course registration requests',
    category: 'services'
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
      'manage_courses',
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
      'manage_courses',
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
      'manage_courses',
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
      'manage_courses',
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

    // Verify user exists in stored list or matches active Google/current session user
    const users = getStoredAdminUsers();
    const user = users.find(u => u.id === sessionData.userId);
    if (user && user.status === 'active') {
      return user;
    }
    const rawCurrent = localStorage.getItem('raba_current_admin_user');
    if (rawCurrent) {
      const current = JSON.parse(rawCurrent) as AdminUser;
      if (current && current.id === sessionData.userId && current.status !== 'suspended') {
        return current;
      }
    }
    return null;
  } catch {
    return null;
  }
};

export const saveStoredAdminSession = (
  user: AdminUser,
  token?: string,
  rememberMe = true
): void => {
  try {
    const sessionToken = token || btoa(`${user.id}:${user.username}:${Date.now()}`);
    const ttlMs = rememberMe ? 7 * 24 * 60 * 60 * 1000 : 12 * 60 * 60 * 1000;
    const sessionData = {
      userId: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      token: sessionToken,
      rememberMe,
      loginAt: new Date().toISOString(),
      expiresAt: Date.now() + ttlMs
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

const tryFirebaseEmailLogin = async (email: string, password: string) => {
  const cleanEmail = email.trim();
  if (!cleanEmail || !cleanEmail.includes('@') || !password || password.length < 6) {
    return null;
  }
  try {
    const [{ getLazyAuth }, { signInWithEmailAndPassword }] = await Promise.all([
      import('../lib/firebase'),
      import('firebase/auth')
    ]);
    const authInstance = await getLazyAuth();
    const cred = await signInWithEmailAndPassword(authInstance, cleanEmail, password);
    return cred.user;
  } catch {
    return null;
  }
};

export const authenticateAdmin = async (
  identifier: string,
  pass: string,
  rememberMe = true
): Promise<AuthResult> => {
  const cleanId = identifier.trim().toLowerCase();
  const cleanPass = pass.trim();

  if (!cleanId || !cleanPass) {
    return { success: false, error: 'يرجى إدخال اسم المستخدم وكلمة المرور' };
  }

  const users = getStoredAdminUsers();
  const matchedUser = users.find(
    u => u.username.toLowerCase() === cleanId || u.email.toLowerCase() === cleanId
  );

  if (matchedUser?.status === 'suspended') {
    return {
      success: false,
      error: 'عذراً، هذا الحساب معطل حالياً من قِبل إدارة النظام. يرجى التواصل مع المدير العام.'
    };
  }

  const candidateEmail = matchedUser?.email || (cleanId.includes('@') ? cleanId : '');
  let serverRejected = false;
  let serverErrorMsg = '';

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
        let finalUser: AdminUser = matchedUser
          ? { ...matchedUser, ...data.user, lastLogin: data.user.lastLogin || 'الآن (متصل)' }
          : data.user;

        if (data.customToken) {
          try {
            const [{ getLazyAuth }, { signInWithCustomToken }] = await Promise.all([
              import('../lib/firebase'),
              import('firebase/auth')
            ]);
            const authInstance = await getLazyAuth();
            const cred = await signInWithCustomToken(authInstance, data.customToken);
            if (cred?.user?.uid) {
              finalUser = { ...finalUser, firebaseUid: cred.user.uid };
            }
          } catch (fbErr) {
            console.warn('[Admin Auth] Firebase custom token sign-in notice:', fbErr);
          }
        } else if (finalUser.email) {
          const fbUser = await tryFirebaseEmailLogin(finalUser.email, cleanPass);
          if (fbUser?.uid) {
            finalUser = { ...finalUser, firebaseUid: fbUser.uid };
          }
        }

        saveStoredAdminSession(finalUser, data.token, rememberMe);
        return {
          success: true,
          user: finalUser,
          token: data.token
        };
      }
    } else if (response.status === 403 || response.status === 429) {
      const errData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errData.error || 'تعذر تسجيل الدخول حالياً'
      };
    } else if (response.status === 401) {
      const errData = await response.json().catch(() => ({}));
      serverRejected = true;
      serverErrorMsg = errData.error || 'اسم المستخدم أو كلمة المرور غير صحيحة';
    }
  } catch (netErr) {
    console.warn('[Admin Auth] Server login request notice, falling back:', netErr);
  }

  // 2. Try Firebase Email/Password Authentication directly (handles dynamically created staff & cloud admins)
  if (candidateEmail) {
    const fbUser = await tryFirebaseEmailLogin(candidateEmail, cleanPass);
    if (fbUser) {
      const { verifyIsFirebaseAdmin, getFirebaseAdminProfile } = await import('../services/firestoreService');
      const [isVerifiedInCloud, cloudProfile] = await Promise.all([
        verifyIsFirebaseAdmin(fbUser),
        getFirebaseAdminProfile(fbUser)
      ]);
      const isLinkedActiveStaff = Boolean(
        matchedUser &&
          matchedUser.status === 'active' &&
          (!matchedUser.firebaseUid || matchedUser.firebaseUid === fbUser.uid)
      );

      if (isVerifiedInCloud || isLinkedActiveStaff) {
        const resolved = authenticateAdminWithGoogle(
          fbUser,
          isVerifiedInCloud || isLinkedActiveStaff,
          rememberMe,
          cloudProfile
        );
        if (resolved) {
          return {
            success: true,
            user: resolved,
            token: btoa(`${resolved.id}:${resolved.username}:${Date.now()}`)
          };
        }
      }
    }
  }

  if (serverRejected && !matchedUser) {
    return {
      success: false,
      error: serverErrorMsg || 'اسم المستخدم أو كلمة المرور غير صحيحة'
    };
  }

  // 3. Offline / Static Preview Fallback (seeded roles in static hosting builds)
  if (!matchedUser) {
    return {
      success: false,
      error: 'اسم المستخدم أو البريد الإلكتروني غير مسجل في النظام'
    };
  }

  const isLegacyDemoMatch =
    (matchedUser.role === 'super_admin' && (cleanPass === 'admin' || cleanPass === 'admin123' || cleanPass === 'raba2025')) ||
    (cleanPass === 'raba' || cleanPass === 'raba123');

  if (!isLegacyDemoMatch) {
    return {
      success: false,
      error: serverErrorMsg || 'كلمة المرور غير صحيحة، يرجى التحقق وإعادة المحاولة'
    };
  }

  const updatedUser: AdminUser = { ...matchedUser, lastLogin: 'الآن (متصل)' };
  const offlineToken = btoa(`${updatedUser.id}:${updatedUser.username}:${Date.now()}`);
  saveStoredAdminSession(updatedUser, offlineToken, rememberMe);

  return {
    success: true,
    user: updatedUser,
    token: offlineToken
  };
};

export const authenticateAdminWithGoogle = (
  firebaseUser: {
    uid: string;
    email?: string | null;
    displayName?: string | null;
    photoURL?: string | null;
  },
  isVerifiedInFirestore = false,
  rememberMe = true,
  cloudAdminProfile?: Partial<AdminUser> | null
): AdminUser | null => {
  const emailLower = (firebaseUser.email || '').trim().toLowerCase();
  const users = getStoredAdminUsers();
  const matchedByUidOrEmail = users.find(
    (u) =>
      (u.firebaseUid && u.firebaseUid === firebaseUser.uid) ||
      (emailLower && u.email?.toLowerCase() === emailLower)
  );

  if (matchedByUidOrEmail?.status === 'suspended' || cloudAdminProfile?.status === 'suspended') {
    return null;
  }

  let resolvedUser: AdminUser | null = null;

  if (matchedByUidOrEmail) {
    resolvedUser = {
      ...matchedByUidOrEmail,
      ...(cloudAdminProfile || {}),
      id: matchedByUidOrEmail.id,
      firebaseUid: firebaseUser.uid,
      lastLogin: 'الآن (متصل سحابياً)',
      avatar: firebaseUser.photoURL || cloudAdminProfile?.avatar || matchedByUidOrEmail.avatar
    };
  } else if (cloudAdminProfile && cloudAdminProfile.role) {
    const preset = ROLE_PRESETS.find((r) => r.role === cloudAdminProfile.role) || ROLE_PRESETS[0];
    resolvedUser = {
      id: cloudAdminProfile.id || firebaseUser.uid,
      firebaseUid: firebaseUser.uid,
      name: cloudAdminProfile.name || firebaseUser.displayName || firebaseUser.email || 'موظف معتمد',
      nameEn: cloudAdminProfile.nameEn || firebaseUser.displayName || firebaseUser.email || 'Authorized Staff',
      username: cloudAdminProfile.username || (firebaseUser.email || 'staff').split('@')[0],
      email: cloudAdminProfile.email || firebaseUser.email || '',
      phone: cloudAdminProfile.phone || '',
      role: cloudAdminProfile.role,
      roleTitleAr: cloudAdminProfile.roleTitleAr || preset.titleAr,
      roleTitleEn: cloudAdminProfile.roleTitleEn || preset.titleEn,
      department: cloudAdminProfile.department || 'المركز',
      status: 'active',
      avatar: firebaseUser.photoURL || cloudAdminProfile.avatar || '',
      permissions: Array.isArray(cloudAdminProfile.permissions) && cloudAdminProfile.permissions.length > 0
        ? cloudAdminProfile.permissions
        : preset.defaultPermissions,
      branchScope: cloudAdminProfile.branchScope,
      assignedBranches: cloudAdminProfile.assignedBranches,
      createdAt: cloudAdminProfile.createdAt || new Date().toISOString().split('T')[0],
      lastLogin: 'الآن (متصل سحابياً)'
    };
  } else if (emailLower === 'rabacentersocial@gmail.com' && isVerifiedInFirestore) {
    resolvedUser = {
      id: firebaseUser.uid,
      firebaseUid: firebaseUser.uid,
      name: firebaseUser.displayName || firebaseUser.email || 'مدير النظام (Google)',
      nameEn: firebaseUser.displayName || firebaseUser.email || 'System Admin',
      username: (firebaseUser.email || 'admin').split('@')[0],
      email: firebaseUser.email || 'rabacentersocial@gmail.com',
      phone: '',
      role: 'super_admin',
      roleTitleAr: 'المدير العام والتنفيذي',
      roleTitleEn: 'Super Administrator',
      department: 'الإدارة التنفيذية العليا',
      status: 'active',
      avatar: firebaseUser.photoURL || '',
      permissions: ROLE_PRESETS[0].defaultPermissions,
      createdAt: new Date().toISOString().split('T')[0],
      lastLogin: 'الآن (متصل سحابياً)'
    };
  }

  if (!resolvedUser) {
    return null;
  }

  const sessionToken = btoa(`${resolvedUser.id}:${resolvedUser.username}:${Date.now()}`);
  saveStoredAdminSession(resolvedUser, sessionToken, rememberMe);
  return resolvedUser;
};
