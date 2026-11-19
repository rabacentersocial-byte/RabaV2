import React, { useState, useEffect, useRef } from 'react';
import { 
  GraduationCap, 
  Plus, 
  Trash2, 
  Edit2, 
  Copy, 
  ArrowUp, 
  ArrowDown, 
  Eye, 
  EyeOff, 
  Check, 
  RotateCcw, 
  Save, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  X,
  Upload,
  Clock,
  Award,
  BookOpen,
  MessageCircle,
  Layers,
  Sun,
  Moon,
  Camera,
  Palette,
  Phone,
  ListPlus,
  MinusCircle,
  Play,
  Star,
  ShieldCheck,
  CreditCard,
  GitBranch,
  UserCheck,
  Lock
} from 'lucide-react';
import { AdminUser, PermissionId } from '../../types';
import { getStoredAdminUsers } from '../../data/adminData';
import { useLanguage } from '../../context/LanguageContext';
import { compressImage } from '../../utils/imageCompressor';
import { getAccessibleAccentColor } from '../../utils/colorContrast';
import { 
  CourseItem, 
  CoursesSectionSettings, 
  COURSES_DATA, 
  DEFAULT_COURSES_SETTINGS, 
  getStoredCoursesData, 
  saveStoredCoursesData, 
  getStoredCoursesSettings, 
  saveStoredCoursesSettings 
} from '../../data/coursesData';
import { CourseCustomIcon, COURSE_ICON_OPTIONS, resolveCourseIcon } from '../CourseCustomIcon';
import { getCourseLogoTheme } from '../../utils/courseLogoThemes';

interface CoursesManagementTabProps {
  hasPermission?: (perm: PermissionId) => boolean;
  isSystemAdmin?: boolean;
  adminUsers?: AdminUser[];
  onNavigateTab?: (tab: string) => void;
}

const ACCENT_COLOR_PRESETS = [
  { name: 'وردي فوشيا (QBA)', hex: '#E11D48' },
  { name: 'تيل زمردي (ABAT)', hex: '#00E5BE' },
  { name: 'كهرماني ذهبي (CEUs)', hex: '#F59E0B' },
  { name: 'أزرق سماوي (مهارات)', hex: '#38BDF8' },
  { name: 'بنفسجي ملكي', hex: '#8B5CF6' },
  { name: 'أخضر عشبي', hex: '#10B981' }
];

export const CoursesManagementTab: React.FC<CoursesManagementTabProps> = ({
  hasPermission,
  isSystemAdmin = false,
  adminUsers,
  onNavigateTab
}) => {
  const { isArabic } = useLanguage();

  const [courses, setCourses] = useState<CourseItem[]>(() => getStoredCoursesData());
  const [settings, setSettings] = useState<CoursesSectionSettings>(() => getStoredCoursesSettings());

  // Feedback State
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<CourseItem | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<CourseItem>>({
    titleAr: '',
    titleEn: '',
    shortTitle: '',
    hoursBadgeAr: '',
    hoursBadgeEn: '',
    hoursCount: 40,
    ribbonTagAr: 'منصة رابا التعليمية',
    ribbonTagEn: 'RABA Academy',
    categoryAr: '',
    categoryEn: '',
    badgeColor: '#E5007D',
    tagHighlightAr: '',
    tagHighlightEn: '',
    descriptionAr: '',
    descriptionEn: '',
    featuresAr: [''],
    featuresEn: [''],
    priceDisplayAr: '',
    priceDisplayEn: '',
    accentColor: '#00E5BE',
    targetAudienceAr: '',
    targetAudienceEn: '',
    order: 1,
    isActive: true,
    cardCoverUrl: ''
  });

  // Modal Preview Theme (Light vs Dark)
  const [previewTheme, setPreviewTheme] = useState<'dark' | 'light'>('dark');

  // Cover image input ref
  const coverFileInputRef = useRef<HTMLInputElement>(null);

  const triggerSuccess = (msg: string) => {
    setFeedbackMessage(msg);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2600);
  };

  const handleOpenAddModal = () => {
    setEditingCourse(null);
    setFormData({
      id: `course-${Date.now()}`,
      titleAr: '',
      titleEn: '',
      shortTitle: '',
      hoursBadgeAr: '40 ساعة تدريبية معتمدة',
      hoursBadgeEn: '40 Certified Training Hours',
      hoursCount: 40,
      ribbonTagAr: 'منصة رابا التعليمية',
      ribbonTagEn: 'RABA Academy',
      categoryAr: 'اعتماد البورد العالمي QABA',
      categoryEn: 'QABA International Certification',
      badgeColor: '#E5007D',
      tagHighlightAr: 'شهادة معتمدة دولياً ومسار مهني',
      tagHighlightEn: 'Internationally Accredited Certificate',
      descriptionAr: 'برنامج تدريبي تطبيقي متكامل يهدف إلى تزويدك بالمعارف والمهارات الإكلينيكية وفق أحدث المعايير الدولية.',
      descriptionEn: 'Comprehensive practical training program designed to equip you with clinical competencies according to international standards.',
      featuresAr: [
        'ساعات تدريبية معتمدة دولياً ومستوفية للمتطلبات',
        'تدريب عملي وتطبيقات ميدانية محاكية',
        'إشراف ومتابعة من كوادر معتمدة دولياً',
        'شهادة إتمام معتمدة ومسار مهني معترف به'
      ],
      featuresEn: [
        'Accredited curriculum meeting international criteria',
        'Hands-on field applications and simulation',
        'Mentorship by board-certified clinical supervisors',
        'Recognized certificate and career advancement'
      ],
      priceDisplayAr: 'شامل المادة العلمية والتدريب',
      priceDisplayEn: 'Includes Curriculum & Materials',
      accentColor: '#00E5BE',
      targetAudienceAr: 'الأخصائيون، الخريجون الجدد، ومقدمو الرعاية المهتمون بمجال السلوك والتأهيل',
      targetAudienceEn: 'Therapists, recent graduates, and special educators',
      order: courses.length + 1,
      isActive: true,
      cardCoverUrl: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: CourseItem) => {
    setEditingCourse(item);
    setFormData({
      ...item,
      featuresAr: item.featuresAr && item.featuresAr.length > 0 ? [...item.featuresAr] : [''],
      featuresEn: item.featuresEn && item.featuresEn.length > 0 ? [...item.featuresEn] : [''],
      isActive: item.isActive !== false
    });
    setIsModalOpen(true);
  };

  const handleDuplicateCourse = (item: CourseItem) => {
    const duplicated: CourseItem = {
      ...item,
      id: `course-${Date.now()}`,
      titleAr: `${item.titleAr} (نسخة جديدة)`,
      titleEn: `${item.titleEn} (Copy)`,
      shortTitle: `${item.shortTitle} (نسخة)`,
      order: courses.length + 1,
      isActive: true
    };
    const updated = [...courses, duplicated];
    setCourses(updated);
    saveStoredCoursesData(updated);
    triggerSuccess(isArabic ? 'تم تكرار الكورس بنجاح، يمكنك الآن تعديله!' : 'Course duplicated successfully!');
  };

  const handleDeleteCourse = (id: string) => {
    if (!isSystemAdmin) return;
    if (!window.confirm(isArabic ? 'هل أنت متأكد من حذف هذا الكورس نهائياً؟' : 'Are you sure you want to delete this course?')) {
      return;
    }
    const updated = courses.filter(c => c.id !== id);
    setCourses(updated);
    saveStoredCoursesData(updated);
    triggerSuccess(isArabic ? 'تم حذف الكورس بنجاح.' : 'Course deleted.');
  };

  const handleToggleActive = (id: string) => {
    const updated = courses.map(c => 
      c.id === id ? { ...c, isActive: c.isActive === false ? true : false } : c
    );
    setCourses(updated);
    saveStoredCoursesData(updated);
    triggerSuccess(isArabic ? 'تم تحديث حالة الظهور.' : 'Visibility updated.');
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= courses.length) return;

    const listCopy = [...courses];
    const temp = listCopy[index];
    listCopy[index] = listCopy[targetIndex];
    listCopy[targetIndex] = temp;

    // re-assign order
    const reordered = listCopy.map((item, idx) => ({ ...item, order: idx + 1 }));
    setCourses(reordered);
    saveStoredCoursesData(reordered);
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const url = await compressImage(file, 800, 300, 0.85, false);
      setFormData(prev => ({ ...prev, cardCoverUrl: url }));
    } catch (err) {
      console.error('Failed to compress cover image:', err);
    } finally {
      setIsUploading(false);
      if (coverFileInputRef.current) coverFileInputRef.current.value = '';
    }
  };

  // Dynamic Features List handlers
  const handleFeatureChange = (index: number, val: string, lang: 'ar' | 'en') => {
    if (lang === 'ar') {
      const updated = [...(formData.featuresAr || [])];
      updated[index] = val;
      setFormData(prev => ({ ...prev, featuresAr: updated }));
    } else {
      const updated = [...(formData.featuresEn || [])];
      updated[index] = val;
      setFormData(prev => ({ ...prev, featuresEn: updated }));
    }
  };

  const handleAddFeature = (lang: 'ar' | 'en') => {
    if (lang === 'ar') {
      setFormData(prev => ({ ...prev, featuresAr: [...(prev.featuresAr || []), ''] }));
    } else {
      setFormData(prev => ({ ...prev, featuresEn: [...(prev.featuresEn || []), ''] }));
    }
  };

  const handleRemoveFeature = (index: number, lang: 'ar' | 'en') => {
    if (editingCourse && !isSystemAdmin) return;
    if (lang === 'ar') {
      const updated = (formData.featuresAr || []).filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, featuresAr: updated.length > 0 ? updated : [''] }));
    } else {
      const updated = (formData.featuresEn || []).filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, featuresEn: updated.length > 0 ? updated : [''] }));
    }
  };

  // Save Modal Form
  const handleSaveCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.titleAr?.trim()) return;

    // Filter out blank features
    const cleanedFeaturesAr = (formData.featuresAr || []).filter(f => f.trim().length > 0);
    const cleanedFeaturesEn = (formData.featuresEn || []).filter(f => f.trim().length > 0);

    let updatedList: CourseItem[];
    if (editingCourse) {
      updatedList = courses.map(c => 
        c.id === editingCourse.id ? { 
          ...(c as CourseItem), 
          ...(formData as CourseItem),
          featuresAr: cleanedFeaturesAr.length > 0 ? cleanedFeaturesAr : ['محتوى تدريبي وتطبيقي معتمد'],
          featuresEn: cleanedFeaturesEn.length > 0 ? cleanedFeaturesEn : ['Accredited practical training']
        } : c
      );
    } else {
      const newCourse: CourseItem = {
        id: formData.id || `course-${Date.now()}`,
        titleAr: formData.titleAr || '',
        titleEn: formData.titleEn || formData.titleAr || '',
        shortTitle: formData.shortTitle || formData.titleAr || '',
        hoursBadgeAr: formData.hoursBadgeAr || '40 ساعة تدريبية معتمدة',
        hoursBadgeEn: formData.hoursBadgeEn || '40 Certified Training Hours',
        hoursCount: Number(formData.hoursCount) || 40,
        ribbonTagAr: formData.ribbonTagAr || 'منصة رابا التعليمية',
        ribbonTagEn: formData.ribbonTagEn || 'RABA Academy',
        categoryAr: formData.categoryAr || 'اعتماد البورد العالمي QABA',
        categoryEn: formData.categoryEn || 'QABA International Certification',
        badgeColor: formData.badgeColor || '#E5007D',
        tagHighlightAr: formData.tagHighlightAr || 'شهادة معتمدة دولياً ومسار مهني',
        tagHighlightEn: formData.tagHighlightEn || 'Internationally Accredited Certificate',
        descriptionAr: formData.descriptionAr || '',
        descriptionEn: formData.descriptionEn || formData.descriptionAr || '',
        featuresAr: cleanedFeaturesAr.length > 0 ? cleanedFeaturesAr : ['محتوى تدريبي وتطبيقي معتمد'],
        featuresEn: cleanedFeaturesEn.length > 0 ? cleanedFeaturesEn : ['Accredited practical training'],
        priceDisplayAr: formData.priceDisplayAr || 'شامل المادة العلمية والتدريب',
        priceDisplayEn: formData.priceDisplayEn || 'Includes Training & Materials',
        accentColor: formData.accentColor || '#00E5BE',
        targetAudienceAr: formData.targetAudienceAr || '',
        targetAudienceEn: formData.targetAudienceEn || '',
        order: courses.length + 1,
        isActive: formData.isActive !== false,
        cardCoverUrl: formData.cardCoverUrl || ''
      };
      updatedList = [...courses, newCourse];
    }

    setCourses(updatedList);
    saveStoredCoursesData(updatedList);
    setIsModalOpen(false);
    triggerSuccess(isArabic ? 'تم حفظ وتحديث بطاقة الكورس بنجاح!' : 'Course card saved successfully!');
  };

  // Save Section Settings
  const handleSaveSettings = () => {
    saveStoredCoursesSettings(settings);
    triggerSuccess(isArabic ? 'تم حفظ وتحديث إعدادات قسم الكورسات بنجاح!' : 'Section settings saved!');
  };

  const resolvedAdminUsers = React.useMemo(
    () => (adminUsers && adminUsers.length > 0 ? adminUsers : getStoredAdminUsers()),
    [adminUsers]
  );

  // Users eligible to receive routed course requests (active super_admin OR holds 'manage_courses')
  const courseCoordinatorCandidates = React.useMemo(
    () =>
      resolvedAdminUsers.filter(
        (u) =>
          u.status === 'active' &&
          (u.role === 'super_admin' || (Array.isArray(u.permissions) && u.permissions.includes('manage_courses')))
      ),
    [resolvedAdminUsers]
  );

  const canConfigurePayments = isSystemAdmin || Boolean(hasPermission?.('system_settings'));
  const canConfigureRouting = isSystemAdmin || Boolean(hasPermission?.('manage_users')) || Boolean(hasPermission?.('manage_courses'));

  const handleTogglePaymentOption = (key: 'tamara' | 'emkan' | 'cash') => {
    if (!canConfigurePayments) return;
    const currentOpts = settings.paymentOptions || { tamara: true, emkan: true, cash: true };
    const nextSettings: CoursesSectionSettings = {
      ...settings,
      paymentOptions: {
        tamara: currentOpts.tamara !== false,
        emkan: currentOpts.emkan !== false,
        cash: currentOpts.cash !== false,
        [key]: !(currentOpts[key] !== false)
      }
    };
    setSettings(nextSettings);
    saveStoredCoursesSettings(nextSettings);
    triggerSuccess(
      isArabic
        ? 'تم تحديث حالة خيار السداد في نموذج التسجيل مباشرة!'
        : 'Course registration payment option updated!'
    );
  };

  const handleChangeRoutingMode = (mode: 'all_authorized' | 'specific_user') => {
    if (!canConfigureRouting) return;
    const firstCandidate = courseCoordinatorCandidates[0];
    const currentAssignedId = settings.courseRouting?.assignedUserId;
    const matchedUser =
      courseCoordinatorCandidates.find((u) => u.id === currentAssignedId) || firstCandidate;

    const nextSettings: CoursesSectionSettings = {
      ...settings,
      courseRouting:
        mode === 'specific_user' && matchedUser
          ? {
              mode: 'specific_user',
              assignedUserId: matchedUser.id,
              assignedUserName: matchedUser.name,
              assignedUserEmail: matchedUser.email
            }
          : {
              mode: 'all_authorized',
              assignedUserId: '',
              assignedUserName: '',
              assignedUserEmail: ''
            }
    };
    setSettings(nextSettings);
    saveStoredCoursesSettings(nextSettings);
    triggerSuccess(
      isArabic ? 'تم تحديث آلية توجيه طلبات الكورسات بنجاح!' : 'Course request routing updated!'
    );
  };

  const handleSelectCoordinator = (userId: string) => {
    if (!canConfigureRouting) return;
    const user = courseCoordinatorCandidates.find((u) => u.id === userId);
    const nextSettings: CoursesSectionSettings = {
      ...settings,
      courseRouting: user
        ? {
            mode: 'specific_user',
            assignedUserId: user.id,
            assignedUserName: user.name,
            assignedUserEmail: user.email
          }
        : {
            mode: 'all_authorized',
            assignedUserId: '',
            assignedUserName: '',
            assignedUserEmail: ''
          }
    };
    setSettings(nextSettings);
    saveStoredCoursesSettings(nextSettings);
    triggerSuccess(
      isArabic
        ? `تم تعيين «${user?.name || ''}» مسؤولاً عن استلام طلبات الكورسات!`
        : `Course requests routed to ${user?.name || 'authorized staff'}!`
    );
  };

  // Restore Defaults
  const handleRestoreDefaults = () => {
    if (!window.confirm(isArabic ? `هل تريد استعادة الكورسات المعتمدة (${COURSES_DATA.length} كورساً) والإعدادات الأصلية؟` : `Restore default ${COURSES_DATA.length} accredited courses and settings?`)) {
      return;
    }
    setCourses(COURSES_DATA);
    saveStoredCoursesData(COURSES_DATA);
    setSettings(DEFAULT_COURSES_SETTINGS);
    saveStoredCoursesSettings(DEFAULT_COURSES_SETTINGS);
    triggerSuccess(isArabic ? 'تمت استعادة الكورسات الافتراضية بنجاح!' : 'Defaults restored!');
  };

  return (
    <div className="space-y-8" dir={isArabic ? 'rtl' : 'ltr'}>
      
      {/* Top Banner / Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800/40 text-teal-600 dark:text-[#00E5BE] flex items-center justify-center shrink-0 shadow-xs">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {isArabic ? 'إدارة وتخصيص بطاقات الكورسات والدورات' : 'Courses & Training Modules Management'}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-100 dark:bg-teal-900/60 text-teal-800 dark:text-teal-200">
                {courses.length} {isArabic ? 'كورس' : 'Courses'}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
              {isArabic 
                ? 'إضافة وتعديل بطاقات البرامج التدريبية المعتمدة (QBA, ABAT, CEUs)، الساعات، المزايا، الأسعار، وألوان البطاقات مع معاينة حية.' 
                : 'Add and customize accredited training course cards, hours, clinical features, badges, and card styling with live preview.'}
            </p>
          </div>
        </div>

        {/* Top Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-center">
          <button
            onClick={handleRestoreDefaults}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{isArabic ? 'استعادة الافتراضي' : 'Reset Defaults'}</span>
          </button>

          <button
            onClick={handleOpenAddModal}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black text-slate-950 bg-gradient-to-r from-emerald-400 to-[#00E5BE] hover:from-emerald-300 hover:to-[#00E5BE] shadow-sm hover:shadow-md transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{isArabic ? 'إضافة كورس جديد' : 'Add New Course'}</span>
          </button>
        </div>
      </div>

      {/* Floating Save Feedback */}
      {saveSuccess && (
        <div className="fixed bottom-6 end-6 z-50 flex items-center gap-2 bg-emerald-700 text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-2xl shadow-xl border border-emerald-400/40 animate-in fade-in slide-in-from-bottom-3 duration-300">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{feedbackMessage}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION HEADER & TEXTS CONFIGURATION                                      */}
      {/* ========================================================================= */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {isArabic ? 'إعدادات عنوان ونصوص قسم الكورسات ورقم الواتساب' : 'Section Titles & Inquiries WhatsApp'}
            </h3>
          </div>
          <button
            onClick={handleSaveSettings}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 transition-colors cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isArabic ? 'حفظ إعدادات القسم' : 'Save Section Settings'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Section Badge Text */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              {isArabic ? 'شارة القسم العلوية (بالعربي)' : 'Top Section Badge (Arabic)'}
            </label>
            <input
              type="text"
              value={settings.badgeAr}
              onChange={(e) => setSettings({ ...settings, badgeAr: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              {isArabic ? 'شارة القسم العلوية (بالإنجليزي)' : 'Top Section Badge (English)'}
            </label>
            <input
              type="text"
              value={settings.badgeEn}
              onChange={(e) => setSettings({ ...settings, badgeEn: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none"
            />
          </div>

          {/* Main Title Parts */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              {isArabic ? 'عنوان القسم (الجزء الأول بالعربي)' : 'Main Title Part 1 (Arabic)'}
            </label>
            <input
              type="text"
              value={settings.titlePart1Ar}
              onChange={(e) => setSettings({ ...settings, titlePart1Ar: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              {isArabic ? 'النص الملوّن والبارز بالعنوان (تدرج لوني فخم)' : 'Title Highlighted Keyword (Cyan Gradient)'}
            </label>
            <input
              type="text"
              value={settings.titleHighlightAr}
              onChange={(e) => setSettings({ ...settings, titleHighlightAr: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-teal-300 dark:border-teal-500/40 bg-teal-50/30 dark:bg-teal-950/20 text-sm font-bold text-teal-800 dark:text-[#00E5BE] focus:ring-2 focus:ring-teal-500 outline-none"
            />
          </div>

          {/* Subtitle Arabic */}
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              {isArabic ? 'الوصف التعريفي للقسم (بالعربي)' : 'Section Subtitle (Arabic)'}
            </label>
            <textarea
              rows={2}
              value={settings.subtitleAr}
              onChange={(e) => setSettings({ ...settings, subtitleAr: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none resize-none"
            />
          </div>

          {/* WhatsApp Direct Inquiries Number */}
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              {isArabic ? 'رقم الواتساب المخصص لاستفسارات وتسجيل الكورسات (مع الرمز الدولي بدون +)' : 'WhatsApp Number for Course Inquiries (with country code, e.g. 966575100100):'}
            </label>
            <div className="flex items-center gap-2 max-w-md">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center border border-emerald-200 dark:border-emerald-800/40 shrink-0">
                <Phone className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={settings.whatsappNumber}
                onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value.replace(/[^0-9]/g, '') })}
                placeholder="966575100100"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800 text-sm font-mono text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ADMIN PAYMENT / INSTALLMENT ACTIVATION & COURSE REQUEST ROUTING           */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        
        {/* 1. Payment & Installment Options Toggle Card */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 shadow-xs space-y-5">
          <div className="flex items-start justify-between gap-3 border-b border-slate-100 dark:border-white/10 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/40 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {isArabic ? 'تفعيل خيارات السداد والتقسيط بالكورسات' : 'Course Payment & Installment Toggles'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {isArabic
                    ? 'تنشيط أو إيقاف طرق الدفع والتقسيط الظاهرة للمتدربين في نموذج التسجيل.'
                    : 'Enable or disable payment and installment options in the course registration modal.'}
                </p>
              </div>
            </div>
            {!canConfigurePayments && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 text-[11px] font-bold shrink-0">
                <Lock className="w-3 h-3" />
                <span>{isArabic ? 'للأدمن فقط' : 'Admin Only'}</span>
              </span>
            )}
          </div>

          <div className="space-y-3">
            {[
              {
                key: 'tamara' as const,
                titleAr: 'تقسيط تمارا (Tamara)',
                titleEn: 'Tamara Installments',
                descAr: 'تقسيط الرسوم على دفعات شهرية بدون فوائد',
                descEn: 'Split course fees into interest-free installments',
                logo: '/assets/tamara-logo.svg',
                badgeColor: 'amber'
              },
              {
                key: 'emkan' as const,
                titleAr: 'تمويل إمكان (Emkan)',
                titleEn: 'Emkan Financing',
                descAr: 'خيار التمويل الميسر عبر منصة إمكان',
                descEn: 'Flexible financing option via Emkan',
                logo: '/assets/emkan-logo.svg',
                badgeColor: 'emerald'
              },
              {
                key: 'cash' as const,
                titleAr: 'سداد مباشر / تحويل بنكي',
                titleEn: 'Direct Payment / Bank Transfer',
                descAr: 'الدفع المباشر أو التحويل على حساب المركز الرسمي',
                descEn: 'Direct clinic payment or official bank transfer',
                logo: null,
                badgeColor: 'cyan'
              }
            ].map((opt) => {
              const isEnabled = settings.paymentOptions?.[opt.key] !== false;
              return (
                <div
                  key={opt.key}
                  className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 transition-all ${
                    isEnabled
                      ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-700/40'
                      : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-white/10 opacity-75'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-14 h-10 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 flex items-center justify-center p-1.5 shrink-0">
                      {opt.logo ? (
                        <img src={opt.logo} alt={opt.titleEn} className="h-4 object-contain" />
                      ) : (
                        <CreditCard className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs sm:text-sm font-black text-slate-900 dark:text-white truncate">
                        {isArabic ? opt.titleAr : opt.titleEn}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        {isArabic ? opt.descAr : opt.descEn}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={!canConfigurePayments}
                    onClick={() => handleTogglePaymentOption(opt.key)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all shrink-0 flex items-center gap-1.5 ${
                      !canConfigurePayments
                        ? 'opacity-50 cursor-not-allowed bg-slate-200 dark:bg-slate-700 text-slate-600'
                        : isEnabled
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs cursor-pointer'
                        : 'bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 cursor-pointer'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${isEnabled ? 'bg-white' : 'bg-slate-400'}`} />
                    <span>{isEnabled ? (isArabic ? 'نشط ومفعّل' : 'Active') : (isArabic ? 'معطّل' : 'Disabled')}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. Course Request Routing & Permission Coordinator Card */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 shadow-xs space-y-5">
          <div className="flex items-start justify-between gap-3 border-b border-slate-100 dark:border-white/10 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                <GitBranch className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {isArabic ? 'توجيه طلبات التسجيل في الكورسات للمسؤول' : 'Course Requests Coordinator Routing'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {isArabic
                    ? 'حدد المسؤول أو المستخدم المصرح له باستلام ومتابعة طلبات تسجيل الكورسات الواردة.'
                    : 'Assign incoming course registration requests automatically to an authorized coordinator.'}
                </p>
              </div>
            </div>
          </div>

          {/* Mode Toggle */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <button
              type="button"
              disabled={!canConfigureRouting}
              onClick={() => handleChangeRoutingMode('all_authorized')}
              className={`p-3 rounded-2xl border text-start transition-all ${
                (settings.courseRouting?.mode || 'all_authorized') === 'all_authorized'
                  ? 'bg-[#0B3B36] text-white border-[#0B3B36] shadow-xs'
                  : 'bg-slate-50 dark:bg-slate-800/50 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-white/10 hover:border-teal-400'
              } ${!canConfigureRouting ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div className="text-xs font-black">
                {isArabic ? 'جميع المصرح لهم بالكورسات' : 'All Authorized Users'}
              </div>
              <div className={`text-[10px] mt-1 ${
                (settings.courseRouting?.mode || 'all_authorized') === 'all_authorized'
                  ? 'text-emerald-100/85'
                  : 'text-slate-500 dark:text-slate-400'
              }`}>
                {isArabic
                  ? 'تظهر الطلبات لكل مستخدم يمتلك صلاحية «إدارة الكورسات»'
                  : 'Visible to any user with Course Management permission'}
              </div>
            </button>

            <button
              type="button"
              disabled={!canConfigureRouting}
              onClick={() => handleChangeRoutingMode('specific_user')}
              className={`p-3 rounded-2xl border text-start transition-all ${
                settings.courseRouting?.mode === 'specific_user'
                  ? 'bg-[#0B3B36] text-white border-[#0B3B36] shadow-xs'
                  : 'bg-slate-50 dark:bg-slate-800/50 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-white/10 hover:border-teal-400'
              } ${!canConfigureRouting ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div className="text-xs font-black">
                {isArabic ? 'توجيه مباشر لمسؤول محدد' : 'Route to Specific Coordinator'}
              </div>
              <div className={`text-[10px] mt-1 ${
                settings.courseRouting?.mode === 'specific_user'
                  ? 'text-emerald-100/85'
                  : 'text-slate-500 dark:text-slate-400'
              }`}>
                {isArabic
                  ? 'إسناد تلقائي لكل طلب تسجيل جديد لموظف معين'
                  : 'Auto-assign every new course request to a designated user'}
              </div>
            </button>
          </div>

          {/* Specific Assignee Selector */}
          {settings.courseRouting?.mode === 'specific_user' && (
            <div className="space-y-2 p-3.5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/25 border border-indigo-200 dark:border-indigo-800/40">
              <label className="block text-xs font-bold text-indigo-950 dark:text-indigo-200 flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>{isArabic ? 'المسؤول المعين لاستقبال طلبات الكورسات:' : 'Assigned Course Requests Officer:'}</span>
              </label>
              <select
                disabled={!canConfigureRouting}
                value={settings.courseRouting?.assignedUserId || ''}
                onChange={(e) => handleSelectCoordinator(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-indigo-200 dark:border-indigo-700/50 bg-white dark:bg-slate-900 text-xs font-bold text-slate-900 dark:text-white outline-none cursor-pointer"
              >
                <option value="">
                  {isArabic ? '— اختر المسؤول المخول —' : '— Select Authorized Staff —'}
                </option>
                {courseCoordinatorCandidates.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({isArabic ? u.roleTitleAr : u.roleTitleEn})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Eligible Users Summary & Quick Link to RBAC Users Tab */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="space-y-0.5">
              <div className="font-bold text-slate-800 dark:text-slate-200">
                {isArabic
                  ? `المستخدمون المصرح لهم بالكورسات حالياً: (${courseCoordinatorCandidates.length})`
                  : `Users with Course Requests Permission: (${courseCoordinatorCandidates.length})`}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                {courseCoordinatorCandidates.map((u) => u.name).join('، ') || (isArabic ? 'لا يوجد' : 'None')}
              </div>
            </div>
            {onNavigateTab && (
              <button
                type="button"
                onClick={() => onNavigateTab('users')}
                className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/15 text-[11px] font-bold text-indigo-700 dark:text-indigo-300 hover:border-indigo-400 cursor-pointer shrink-0"
              >
                {isArabic ? 'منح الصلاحية لمستخدم ↗' : 'Grant Permission ↗'}
              </button>
            )}
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* COURSES LIST TABLE & CARDS                                                */}
      {/* ========================================================================= */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-white/10 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-teal-600 dark:text-[#00E5BE]" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {isArabic ? 'بطاقات الكورسات الحالية في السلايدر' : 'Current Courses in Slider'}
            </h3>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {isArabic ? 'يمكنك إعادة ترتيب الكورسات ⇅ أو تعديل وتخصيص محتواها وشكل بطاقاتها.' : 'Reorder courses ⇅ or click edit to customize cards.'}
          </span>
        </div>

        <div className="space-y-3">
          {courses.map((course, index) => {
            return (
              <div
                key={course.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  course.isActive !== false
                    ? 'bg-slate-50/70 dark:bg-slate-800/50 border-slate-200/80 dark:border-white/10 hover:border-teal-300 dark:hover:border-teal-700/60'
                    : 'bg-slate-100/50 dark:bg-slate-900/40 border-dashed border-slate-300 dark:border-white/5 opacity-60'
                }`}
              >
                {/* Left: Thumbnail & Course Info */}
                <div className="flex items-center gap-3.5 min-w-0">
                  
                  {/* Badge & Hours Badge Indicator */}
                  <div 
                    className="w-14 h-14 rounded-2xl flex flex-col items-center justify-center p-1.5 shrink-0 shadow-xs border border-white/20 text-center relative overflow-hidden"
                    style={{ backgroundColor: course.accentColor || '#00E5BE' }}
                  >
                    <span className="text-[11px] font-black text-slate-950 leading-none">
                      {course.hoursCount || 40}
                    </span>
                    <span className="text-[9px] font-bold text-slate-900 leading-tight mt-0.5">
                      {isArabic ? 'ساعة' : 'Hrs'}
                    </span>
                  </div>

                  {/* Title & Metadata */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm sm:text-base font-black text-slate-900 dark:text-white truncate">
                        {course.titleAr}
                      </h4>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-pink-100 dark:bg-pink-950/60 text-pink-700 dark:text-pink-300">
                        {course.ribbonTagAr || 'منصة رابا'}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 truncate max-w-[200px]">
                        {course.tagHighlightAr}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 truncate">
                      {course.categoryAr} • {course.hoursBadgeAr} • {course.featuresAr?.length || 0} {isArabic ? 'مزايا تدريبية' : 'features'}
                    </p>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-1.5 self-end md:self-center shrink-0">
                  
                  {/* Move Up */}
                  <button
                    onClick={() => handleMove(index, 'up')}
                    disabled={index === 0}
                    className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                    title={isArabic ? 'تحريك لأعلى' : 'Move Up'}
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>

                  {/* Move Down */}
                  <button
                    onClick={() => handleMove(index, 'down')}
                    disabled={index === courses.length - 1}
                    className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                    title={isArabic ? 'تحريك لأسفل' : 'Move Down'}
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>

                  {/* Duplicate */}
                  <button
                    onClick={() => handleDuplicateCourse(course)}
                    className="p-2 rounded-lg text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-950/40 transition-colors cursor-pointer"
                    title={isArabic ? 'تكرار الكورس (نسخ)' : 'Duplicate Course'}
                  >
                    <Copy className="w-4 h-4" />
                  </button>

                  {/* Active Toggle */}
                  <button
                    onClick={() => handleToggleActive(course.id)}
                    className={`p-2 rounded-lg transition-colors cursor-pointer ${
                      course.isActive !== false
                        ? 'text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                    title={course.isActive !== false ? (isArabic ? 'إخفاء من السلايدر' : 'Hide') : (isArabic ? 'إظهار بالسلايدر' : 'Show')}
                  >
                    {course.isActive !== false ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>

                  {/* Edit Full Course Card */}
                  <button
                    onClick={() => handleOpenEditModal(course)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 transition-colors cursor-pointer"
                    title={isArabic ? 'تعديل وتخصيص البطاقة' : 'Edit & Customize'}
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>{isArabic ? 'تعديل وتخصيص' : 'Edit'}</span>
                  </button>

                  {/* Delete (System Admin Only) */}
                  {isSystemAdmin && (
                    <button
                      onClick={() => handleDeleteCourse(course.id)}
                      className="p-2 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                      title={isArabic ? 'حذف الكورس' : 'Delete'}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}

                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ADD / EDIT / CUSTOMIZE COURSE MODAL WITH LIVE CARD PREVIEW                */}
      {/* ========================================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="relative w-full max-w-5xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-6">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-white/10 bg-slate-50/60 dark:bg-slate-800/50">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-[#00E5BE] flex items-center justify-center border border-teal-200/60 dark:border-teal-800/40">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    {editingCourse 
                      ? (isArabic ? 'تعديل وتخصيص بطاقة الكورس' : 'Edit & Customize Course Card') 
                      : (isArabic ? 'إضافة كورس تدريبي جديد' : 'Add New Training Course')}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {isArabic ? 'خصص العنوان، الساعات، الشارات، المزايا الإكلينيكية، والألوان مع معاينة حية فورية.' : 'Customize title, hours, clinical features, badges, and card styling with real-time preview.'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: 2 Columns on Desktop */}
            <div className="p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 max-h-[76vh] overflow-y-auto">
              
              {/* Left Column: Form (7 cols) */}
              <form onSubmit={handleSaveCourse} noValidate id="course-customize-form" className="lg:col-span-7 space-y-5">
                
                {/* 1. TITLES */}
                <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/80 dark:border-white/10 space-y-3">
                  <h4 className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-teal-600 dark:text-[#00E5BE]" />
                    <span>{isArabic ? 'عناوين وتسمية الكورس:' : 'Course Titles & Naming:'}</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        {isArabic ? 'عنوان الكورس الرئيسي (بالعربي) *' : 'Main Course Title (Arabic) *'}
                      </label>
                      <input
                        type="text"
                        required
                        placeholder={isArabic ? 'مثال: كورس محلل سلوكي مؤهل (QBA)' : 'e.g. QBA Course'}
                        value={formData.titleAr || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, titleAr: e.target.value }))}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800 text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        {isArabic ? 'عنوان الكورس (بالإنجليزي)' : 'Course Title (English)'}
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Qualified Behavior Analyst Course"
                        value={formData.titleEn || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, titleEn: e.target.value }))}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        {isArabic ? 'الاسم المختصر (لنموذج التسجيل)' : 'Short Title (For Modal)'}
                      </label>
                      <input
                        type="text"
                        placeholder={isArabic ? 'مثال: محلل سلوكي مؤهل QBA' : 'e.g. QBA'}
                        value={formData.shortTitle || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, shortTitle: e.target.value }))}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. HOURS & BADGES */}
                <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/80 dark:border-white/10 space-y-3">
                  <h4 className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-cyan-500" />
                    <span>{isArabic ? 'شارات الاعتماد وساعات التدريب:' : 'Training Hours & Accreditation Badges:'}</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        {isArabic ? 'نص شارة الساعات (بالعربي) *' : 'Hours Badge Label (Arabic) *'}
                      </label>
                      <input
                        type="text"
                        required
                        placeholder={isArabic ? 'مثال: 270 ساعة تدريبية معتمدة' : 'e.g. 270 Hours'}
                        value={formData.hoursBadgeAr || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, hoursBadgeAr: e.target.value }))}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500 font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        {isArabic ? 'عدد الساعات التدريبية (رقم)' : 'Hours Count (Number)'}
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="1000"
                        value={formData.hoursCount || 40}
                        onChange={(e) => setFormData(prev => ({ ...prev, hoursCount: Number(e.target.value) }))}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500 font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        {isArabic ? 'شارة المنصة العلوية (بالعربي)' : 'Platform Ribbon Tag (Arabic)'}
                      </label>
                      <input
                        type="text"
                        placeholder={isArabic ? 'مثال: منصة رابا التعليمية' : 'e.g. RABA Academy'}
                        value={formData.ribbonTagAr || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, ribbonTagAr: e.target.value }))}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        {isArabic ? 'تصنيف الاعتماد الدولي' : 'Accreditation Category'}
                      </label>
                      <input
                        type="text"
                        placeholder={isArabic ? 'مثال: اعتماد البورد العالمي QABA' : 'e.g. QABA Certification'}
                        value={formData.categoryAr || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, categoryAr: e.target.value }))}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        {isArabic ? 'شارة التمييز الذهبية (Tag Highlight)' : 'Golden Highlight Tag'}
                      </label>
                      <input
                        type="text"
                        placeholder={isArabic ? 'مثال: يشمل أيضاً: VB-MAPP - ABLLS-R - PEAK' : 'e.g. Includes Assessment Tools'}
                        value={formData.tagHighlightAr || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, tagHighlightAr: e.target.value }))}
                        className="w-full px-3 py-2 rounded-xl border border-amber-300 dark:border-amber-600/40 bg-amber-50/50 dark:bg-amber-950/20 text-xs font-bold text-amber-900 dark:text-amber-200 outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. ACCENT COLOR & COVER BANNER */}
                <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/80 dark:border-white/10 space-y-3">
                  <h4 className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Palette className="w-4 h-4 text-emerald-500" />
                    <span>{isArabic ? 'ألوان التمييز وصورة الغلاف:' : 'Accent Colors & Optional Cover Banner:'}</span>
                  </h4>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        {isArabic ? 'لون التمييز الأساسي للبطاقة (Accent Color):' : 'Card Accent Color:'}
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={formData.accentColor || '#00E5BE'}
                          onChange={(e) => setFormData(prev => ({ ...prev, accentColor: e.target.value }))}
                          className="w-9 h-9 rounded-xl border-0 p-0 cursor-pointer overflow-hidden bg-transparent shrink-0"
                        />
                        <input
                          type="text"
                          value={formData.accentColor || '#00E5BE'}
                          onChange={(e) => setFormData(prev => ({ ...prev, accentColor: e.target.value }))}
                          className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white font-mono outline-none"
                        />
                      </div>

                      {/* Swatches */}
                      <div className="flex flex-wrap items-center gap-1.5 mt-2">
                        <span className="text-[10px] text-slate-600 dark:text-slate-400 font-bold">{isArabic ? 'ألوان جاهزة:' : 'Presets:'}</span>
                        {ACCENT_COLOR_PRESETS.map((colorItem) => (
                          <button
                            key={colorItem.hex}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, accentColor: colorItem.hex }))}
                            className="w-5 h-5 rounded-full border border-white dark:border-slate-800 shadow-xs hover:scale-110 transition-transform cursor-pointer"
                            style={{ backgroundColor: colorItem.hex }}
                            title={colorItem.name}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Optional Card Top Cover Banner */}
                    <div className="pt-2 border-t border-slate-200/60 dark:border-white/5">
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                          {isArabic ? 'صورة غلاف علوية للبطاقة (اختياري - Cover Banner):' : 'Optional Card Top Cover Banner:'}
                        </label>
                        {formData.cardCoverUrl && (
                          <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, cardCoverUrl: '' }))}
                            className="text-[11px] font-bold text-rose-600 hover:underline cursor-pointer"
                          >
                            {isArabic ? 'إزالة الغلاف' : 'Remove'}
                          </button>
                        )}
                      </div>

                      <input
                        ref={coverFileInputRef}
                        type="file"
                        accept="image/png, image/jpeg, image/webp"
                        onChange={handleCoverUpload}
                        className="hidden"
                      />

                      <div className="flex flex-col sm:flex-row items-center gap-2">
                        <button
                          type="button"
                          disabled={isUploading}
                          onClick={() => coverFileInputRef.current?.click()}
                          className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 hover:bg-slate-50 transition-colors cursor-pointer shrink-0"
                        >
                          <Camera className="w-3.5 h-3.5" />
                          <span>{isUploading ? (isArabic ? 'جارٍ الرفع...' : 'Uploading...') : (isArabic ? 'رفع صورة غلاف' : 'Upload Cover')}</span>
                        </button>

                        <input
                          type="text"
                          placeholder={isArabic ? 'أو الصق رابط صورة الغلاف هنا (https://... أو /uploads/...)' : 'Or paste banner URL...'}
                          value={formData.cardCoverUrl || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, cardCoverUrl: e.target.value }))}
                          className="w-full flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white outline-none"
                        />
                      </div>
                    </div>

                    {/* Custom Course Content Icon Picker */}
                    <div className="pt-3 border-t border-slate-200/60 dark:border-white/5 space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                          {isArabic ? 'أيقونة محتوى الكورس المخصصة:' : 'Custom Course Content Icon:'}
                        </label>
                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#0a3530] dark:text-[#2dd4bf] bg-white dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
                          <CourseCustomIcon course={formData} className="w-3.5 h-3.5" />
                          <span>{isArabic ? 'الأيقونة الحالية' : 'Active Icon'}</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-h-48 overflow-y-auto p-1.5 border border-slate-200/80 dark:border-white/10 rounded-xl bg-white dark:bg-slate-900/60">
                        {COURSE_ICON_OPTIONS.map((opt) => {
                          const IconComp = opt.icon;
                          const isSelected = formData.iconName === opt.id || (!formData.iconName && resolveCourseIcon(formData) === IconComp);
                          return (
                            <button
                              key={opt.id}
                              type="button"
                              onClick={() => setFormData(prev => ({ ...prev, iconName: opt.id }))}
                              className={`flex items-center gap-2 p-2 rounded-lg text-start transition-all cursor-pointer text-xs ${
                                isSelected
                                  ? 'bg-[#edf7f4] dark:bg-teal-950/70 border border-[#2dd4bf] text-[#0a3530] dark:text-[#2dd4bf] font-bold shadow-2xs'
                                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/80 border border-transparent'
                              }`}
                            >
                              <div className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 ${
                                isSelected ? 'bg-[#0a3530] text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                              }`}>
                                <IconComp className="w-3.5 h-3.5" />
                              </div>
                              <span className="truncate text-[11px]">{isArabic ? opt.labelAr : opt.labelEn}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4. DESCRIPTION & CLINICAL FEATURES */}
                <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/80 dark:border-white/10 space-y-3">
                  <h4 className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>{isArabic ? 'الوصف والمزايا الإكلينيكية للكورس:' : 'Description & Clinical Features:'}</span>
                  </h4>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {isArabic ? 'وصف الكورس (بالعربي) *' : 'Course Description (Arabic) *'}
                    </label>
                    <textarea
                      rows={3}
                      required
                      placeholder={isArabic ? 'اكتب نبذة تعريفية شاملة عن الكورس وأهدافه...' : 'Write course overview...'}
                      value={formData.descriptionAr || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, descriptionAr: e.target.value }))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500 leading-relaxed resize-none"
                    />
                  </div>

                  {/* Dynamic Bullet Points / Features */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        {isArabic ? 'المزايا والنقاط المميزة بالبطاقة (Features):' : 'Key Features Bullet Points:'}
                      </label>
                      <button
                        type="button"
                        onClick={() => handleAddFeature('ar')}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold text-teal-700 dark:text-[#00E5BE] bg-teal-50 dark:bg-teal-950/40 hover:bg-teal-100 transition-colors cursor-pointer"
                      >
                        <ListPlus className="w-3.5 h-3.5" />
                        <span>{isArabic ? '+ إضافة ميزة' : '+ Add Feature'}</span>
                      </button>
                    </div>

                    <div className="space-y-2">
                      {(formData.featuresAr || []).map((feat, fIdx) => (
                        <div key={fIdx} className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-[#00E5BE] shrink-0" />
                          <input
                            type="text"
                            placeholder={`${isArabic ? 'الميزة' : 'Feature'} ${fIdx + 1}`}
                            value={feat}
                            onChange={(e) => handleFeatureChange(fIdx, e.target.value, 'ar')}
                            className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white outline-none focus:ring-1 focus:ring-teal-500"
                          />
                          {(formData.featuresAr || []).length > 1 && (!editingCourse || isSystemAdmin) && (
                            <button
                              type="button"
                              onClick={() => handleRemoveFeature(fIdx, 'ar')}
                              className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors cursor-pointer"
                              title={isArabic ? 'حذف هذه النقطة' : 'Remove item'}
                            >
                              <MinusCircle className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Target Audience & Price Note */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        {isArabic ? 'الفئة المستهدفة' : 'Target Audience'}
                      </label>
                      <input
                        type="text"
                        placeholder={isArabic ? 'مثال: أخصائيو التربية الخاصة وعلم النفس' : 'e.g. Special educators'}
                        value={formData.targetAudienceAr || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, targetAudienceAr: e.target.value }))}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        {isArabic ? 'ملاحظة الرسوم / الاعتماد' : 'Price / Tuition Display Note'}
                      </label>
                      <input
                        type="text"
                        placeholder={isArabic ? 'مثال: شامل المنهج المعتمد والاختبارات' : 'e.g. Includes materials'}
                        value={formData.priceDisplayAr || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, priceDisplayAr: e.target.value }))}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* 5. VISIBILITY TOGGLE */}
                <div className="pt-2 flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isActive !== false}
                      onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                      className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 cursor-pointer"
                    />
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      {isArabic ? 'تفعيل وإظهار الكورس في الموقع والسلايدر' : 'Active & Visible in Website Slider'}
                    </span>
                  </label>
                </div>

              </form>

              {/* Right Column: LIVE REAL-TIME CARD PREVIEW (5 cols) */}
              <div className="lg:col-span-5 flex flex-col items-center justify-start p-5 rounded-3xl bg-slate-100/70 dark:bg-slate-950/60 border border-slate-200/80 dark:border-white/10 relative">
                
                {/* Preview Controls Header */}
                <div className="w-full flex items-center justify-between mb-4 border-b border-slate-200/60 dark:border-white/10 pb-3">
                  <div className="flex items-center gap-1.5 text-xs font-black text-slate-800 dark:text-slate-200">
                    <Eye className="w-4 h-4 text-teal-600" />
                    <span>{isArabic ? 'معاينة حية لشكل بطاقة الكورس' : 'Live Card Preview'}</span>
                  </div>

                  {/* Dark/Light Preview Toggle */}
                  <div className="flex items-center bg-white dark:bg-slate-900 rounded-xl p-0.5 border border-slate-200 dark:border-white/10 shadow-2xs">
                    <button
                      type="button"
                      onClick={() => setPreviewTheme('light')}
                      className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                        previewTheme === 'light' ? 'bg-amber-100 text-amber-900 shadow-2xs' : 'text-slate-600 dark:text-slate-400'
                      }`}
                      title={isArabic ? 'معاينة بالوضع النهاري' : 'Light Preview'}
                    >
                      <Sun className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewTheme('dark')}
                      className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                        previewTheme === 'dark' ? 'bg-slate-800 text-slate-100 shadow-2xs' : 'text-slate-600 dark:text-slate-400'
                      }`}
                      title={isArabic ? 'معاينة بالوضع الليلي' : 'Dark Preview'}
                    >
                      <Moon className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* THE ACTUAL LIVE COURSE CARD */}
                {(() => {
                  const previewLogoTheme = getCourseLogoTheme(formData);
                  const isDarkPreview = previewTheme === 'dark';
                  const previewAccent = getAccessibleAccentColor(previewLogoTheme.accentHex, isDarkPreview);
                  return (
                    <div className={`w-full max-w-[360px] p-2 rounded-3xl transition-colors duration-300 ${isDarkPreview ? 'bg-slate-950' : 'bg-slate-100'}`}>
                      <div
                        className={`rounded-[32px] overflow-hidden border transition-all duration-300 flex flex-col justify-between shadow-xl relative ${
                          isDarkPreview 
                            ? 'bg-[#121c24] border-slate-800 text-white' 
                            : 'bg-white border-[#dceee8] text-slate-900'
                        }`}
                      >
                        {/* Top Header Section: Distinct Logo Color Container */}
                        <div
                          className={`p-5 pt-6 pb-5 rounded-t-[32px] border-b relative ${
                            isDarkPreview ? 'bg-white/[0.04] border-white/10' : 'border-[#161B26]/[0.06]'
                          }`}
                          style={!isDarkPreview ? { backgroundColor: `${previewLogoTheme.accentHex}14` } : undefined}
                        >
                          {/* Top Row: Floating Pill Badge & Icon Button */}
                          <div className="flex items-center justify-between gap-2">
                            <span
                              className={`text-[11px] font-bold px-3 py-1 rounded-full shadow-xs ${
                                isDarkPreview
                                  ? 'bg-[#1E293B] text-[#F8FAFC] border border-white/15'
                                  : 'bg-[#1463D6] text-white'
                              }`}
                            >
                              {formData.floatingBadgeAr || 'الأكثر طلباً'}
                            </span>

                            <div
                              className={`w-9 h-9 rounded-xl border shadow-xs flex items-center justify-center ${
                                isDarkPreview ? 'bg-slate-900 border-white/15' : 'bg-white border-[#161B26]/10'
                              }`}
                              style={{ color: previewAccent }}
                            >
                              <CourseCustomIcon course={formData} className="w-4 h-4" />
                            </div>
                          </div>

                          {/* Category Kicker */}
                          <div
                            className="text-[11px] font-extrabold tracking-wide mt-3 mb-1"
                            style={{ color: previewAccent }}
                          >
                            {formData.categoryAr || 'التقييم والتشخيص النمائي'}
                          </div>

                          {/* Title */}
                          <h3 className={`text-xl font-black leading-[1.3] tracking-tight ${isDarkPreview ? 'text-white' : 'text-slate-900'}`}>
                            {formData.titleAr || 'عنوان الكورس التدريبي'}
                          </h3>
                        </div>

                        {/* Lower Section */}
                        <div className="p-5 pt-4 rounded-b-[32px] flex-1 flex flex-col justify-between space-y-3.5">
                          <div className="space-y-3">
                            {/* Price Row */}
                            <div className="flex items-baseline gap-1.5 pt-0.5">
                              <span className={`text-3xl font-black leading-none ${isDarkPreview ? 'text-[#F8FAFC]' : 'text-[#161B26]'}`}>
                                {formData.currentPrice || formData.priceDisplayAr || '650'}
                              </span>
                              <span className={`text-base font-bold ${isDarkPreview ? 'text-[#94A3B8]' : 'text-[#4B5563]'}`}>
                                {isArabic ? 'ريال' : 'SAR'}
                              </span>
                              {formData.originalPrice && (
                                <span className={`text-xs font-semibold line-through mr-1 ${isDarkPreview ? 'text-slate-400' : 'text-slate-600'}`}>
                                  {formData.originalPrice} {isArabic ? 'ريال' : 'SAR'}
                                </span>
                              )}
                            </div>

                            {/* Hours Badge */}
                            <div>
                              <div className={`inline-flex items-center gap-1.5 py-1 px-3 rounded-xl border text-xs font-bold ${
                                isDarkPreview
                                  ? 'bg-white/[0.06] border-white/10 text-[#F8FAFC]'
                                  : 'bg-slate-50 border-[#161B26]/10 text-[#161B26]'
                              }`}>
                                <Clock className="w-3.5 h-3.5" style={{ color: previewAccent }} />
                                <span>{formData.hoursBadgeAr || '40 ساعة تدريبية معتمدة'}</span>
                              </div>
                            </div>

                            {/* Sub-note */}
                            <div className={`flex items-center gap-1.5 text-[11px] font-semibold ${isDarkPreview ? 'text-amber-300' : 'text-amber-800'}`}>
                              <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                              <span className="truncate">{formData.tagHighlightAr || 'شهادة معتمدة دولياً ومسار مهني'}</span>
                            </div>

                            {/* Description */}
                            <p className={`text-xs leading-relaxed line-clamp-2 ${isDarkPreview ? 'text-slate-300' : 'text-slate-600'}`}>
                              {formData.descriptionAr || 'وصف ونبذة تعريفية عن الكورس ومخرجاته التدريبية المعتمدة...'}
                            </p>

                            {/* Features list */}
                            <div className={`space-y-2 pt-2.5 border-t ${isDarkPreview ? 'border-slate-800' : 'border-slate-100'}`}>
                              {(formData.featuresAr || []).filter(f => f.trim().length > 0).slice(0, 4).map((feat, idx) => (
                                <div key={idx} className={`flex items-start gap-2 text-xs font-medium ${isDarkPreview ? 'text-slate-200' : 'text-slate-700'}`}>
                                  <span
                                    className={`w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${isDarkPreview ? 'bg-white/10' : 'bg-[#161B26]/8'}`}
                                    style={{ color: previewAccent }}
                                  >
                                    <Check className="w-2 h-2 stroke-[3]" />
                                  </span>
                                  <span className="leading-snug">{feat}</span>
                                </div>
                              ))}
                            </div>

                            {/* Instructor & Accreditation Note */}
                            <div className={`text-[11px] font-medium pt-1 flex items-center gap-1.5 flex-wrap ${isDarkPreview ? 'text-slate-300' : 'text-slate-600'}`}>
                              <span>{isArabic ? 'بإشراف نخبة من الأخصائيين المعتمدين' : 'Supervised by Certified Specialists'}</span>
                              <span>·</span>
                              <span>{formData.accreditationBadgeAr || 'اعتماد دولي'}</span>
                            </div>
                          </div>

                          {/* Action Button */}
                          <div className="pt-2">
                            <button
                              type="button"
                              className="w-full bg-[#1463D6] hover:bg-[#1152B8] text-white text-xs font-bold py-3 px-4 rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                              <span>{isArabic ? 'حجز الكورس' : 'Book Course'}</span>
                            </button>
                          </div>
                        </div>

                      </div>
                    </div>
                  );
                })()}

                <div className="mt-4 text-center">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    {isArabic ? 'هكذا ستظهر البطاقة تماماً في سلايدر الكورسات للمستخدمين.' : 'This is exactly how the card appears on the live website.'}
                  </span>
                </div>

              </div>

            </div>

            {/* Modal Footer / Save Actions */}
            <div className="flex items-center justify-between p-4 px-6 border-t border-slate-100 dark:border-white/10 bg-slate-50/70 dark:bg-slate-800/40">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {isArabic ? 'يتم حفظ وتطبيق التعديل مباشرة على السلايدر وقاعدة البيانات.' : 'Changes sync directly with slider & persistent storage.'}
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
                >
                  {isArabic ? 'إلغاء' : 'Cancel'}
                </button>

                <button
                  type="submit"
                  form="course-customize-form"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black text-slate-950 bg-gradient-to-r from-emerald-400 to-[#00E5BE] hover:from-emerald-300 hover:to-[#00E5BE] shadow-sm hover:shadow-md cursor-pointer transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingCourse ? (isArabic ? 'حفظ التعديلات' : 'Save Changes') : (isArabic ? 'إضافة الكورس' : 'Add Course')}</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default CoursesManagementTab;
