import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  UserCheck, 
  Star, 
  Award, 
  Calendar, 
  Edit3, 
  Plus, 
  CheckCircle2, 
  X,
  Sliders,
  Upload,
  Image as ImageIcon,
  Sparkles,
  Search,
  Filter,
  Eye,
  Check,
  Building2,
  Brain,
  MessageSquare,
  Trash2,
  AlertTriangle,
  FileText,
  Loader2
} from 'lucide-react';
import { Specialist, PermissionId } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { SpecialistImageCustomizerModal } from './SpecialistImageCustomizerModal';
import { 
  getSpecialistImageSetting, 
  getStoredSpecialistSettings,
  updateSpecialistCardSetting,
  removeSpecialistCardSetting
} from '../../data/specialistCustomizer';
import { deduplicateSpecialists } from '../../utils/specialistDeduplication';
import { getSpecialistLogoTheme } from '../../utils/specialistCardThemes';
import { compressImage } from '../../utils/imageCompressor';
import { getResolvedImageUrl, handleImageErrorWithStore } from '../../utils/persistentImageStore';
import { saveSpecialistToFirestore, deleteSpecialistFromFirestore } from '../../services/firestoreService';

interface SpecialistsTabProps {
  specialists: Specialist[];
  onUpdateSpecialists: (updated: Specialist[]) => Promise<boolean> | void;
  hasPermission: (perm: PermissionId) => boolean;
  isSystemAdmin?: boolean;
}

export const SpecialistsTab: React.FC<SpecialistsTabProps> = ({
  specialists,
  onUpdateSpecialists,
  hasPermission,
  isSystemAdmin = false
}) => {
  const { isArabic } = useLanguage();
  
  // Customization & editing states
  const [editingSpecialist, setEditingSpecialist] = useState<Specialist | null>(null);
  const [customizingSpecialist, setCustomizingSpecialist] = useState<Specialist | null>(null);

  // Add Specialist state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newNameEn, setNewNameEn] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newTitleEn, setNewTitleEn] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newCategory, setNewCategory] = useState<'aba' | 'occupational' | 'speech' | 'psychology'>('aba');
  const [newExperienceYears, setNewExperienceYears] = useState(7);
  const [newRating, setNewRating] = useState(5.0);
  const [newIsTopRated, setNewIsTopRated] = useState(true);
  const [newBio, setNewBio] = useState('');
  const [newAvatar, setNewAvatar] = useState('/images/specialists/haneen_obaidi.jpg');
  const [newSpecialties, setNewSpecialties] = useState('تحليل السلوك التطبيقي, التدخل المبكر, تنمية المهارات');
  const [newEducation, setNewEducation] = useState('بكالوريوس في التأهيل والعلوم الطبية التطبيقية');
  const [newCertifications, setNewCertifications] = useState('بورد معتمد في التأهيل والرعاية التخصصية');
  const [isUploadingNewAvatar, setIsUploadingNewAvatar] = useState(false);
  const [isSavingCreate, setIsSavingCreate] = useState(false);
  const addAvatarInputRef = useRef<HTMLInputElement>(null);

  // Delete Specialist state
  const [deletingSpecialist, setDeletingSpecialist] = useState<Specialist | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState<'all' | 'aba' | 'occupational' | 'speech' | 'topRated'>('all');

  // Form states for profile editing
  const [name, setName] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [title, setTitle] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [role, setRole] = useState('');
  const [editCategory, setEditCategory] = useState<'aba' | 'occupational' | 'speech' | 'psychology'>('aba');
  const [experienceYears, setExperienceYears] = useState(10);
  const [rating, setRating] = useState(5.0);
  const [bio, setBio] = useState('');
  const [editSpecialties, setEditSpecialties] = useState('');
  const [editAvatar, setEditAvatar] = useState('');
  const [editIsTopRated, setEditIsTopRated] = useState(false);
  const [isUploadingEditAvatar, setIsUploadingEditAvatar] = useState(false);
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const editAvatarInputRef = useRef<HTMLInputElement>(null);

  // Toast notification feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Re-render trigger when settings change in customizer
  const [settingsVersion, setSettingsVersion] = useState(0);

  useEffect(() => {
    const handleSettingsUpdated = () => {
      setSettingsVersion((v) => v + 1);
    };
    window.addEventListener('raba_specialist_settings_updated', handleSettingsUpdated);
    return () => {
      window.removeEventListener('raba_specialist_settings_updated', handleSettingsUpdated);
    };
  }, []);

  const canManage = hasPermission('manage_specialists');

  const getDepartmentByCategory = (cat: 'aba' | 'occupational' | 'speech' | 'psychology') => {
    if (cat === 'aba') return 'قسم تحليل السلوك التطبيقي والتدخل المبكر';
    if (cat === 'occupational') return 'قسم العلاج الوظيفي والتكامل الحسي';
    if (cat === 'speech') return 'قسم علاج النطق واللغة واضطرابات التواصل';
    return 'قسم الإرشاد النفسي وتعديل السلوك';
  };

  // Open general edit modal
  const handleOpenEdit = (spec: Specialist) => {
    const setting = getSpecialistImageSetting(spec.id, spec);
    setEditingSpecialist(spec);
    setName(spec.name);
    setNameEn(spec.nameEn || '');
    setTitle(spec.title);
    setTitleEn(spec.titleEn || '');
    setRole(spec.role || spec.title);
    const inferredCategory: 'aba' | 'occupational' | 'speech' | 'psychology' =
      spec.category === 'aba' || spec.category === 'occupational' || spec.category === 'speech' || spec.category === 'psychology'
        ? spec.category
        : (spec.title.includes('النطق') || spec.role.includes('النطق')
            ? 'speech'
            : (spec.title.includes('الوظيفي') || spec.role.includes('الوظيفي')
                ? 'occupational'
                : (spec.title.includes('النفسي') || spec.role.includes('النفسي') ? 'psychology' : 'aba')));
    setEditCategory(inferredCategory);
    setExperienceYears(spec.experienceYears);
    setRating(spec.rating || 5.0);
    setBio(spec.bio);
    setEditSpecialties((spec.specialties || []).join(', '));
    setEditAvatar(setting.avatar || spec.avatar);
    setEditIsTopRated(setting.isTopRated ?? spec.isTopRated ?? spec.rating >= 4.9);
  };

  // Save profile changes (preserves licenseNumber & sessionPrice set elsewhere)
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSpecialist || isSavingEdit) return;
    setIsSavingEdit(true);

    try {
      const specialtiesList = editSpecialties
        .split(/[,،]/)
        .map((item) => item.trim())
        .filter(Boolean);

      const finalAvatar = editAvatar.trim() || editingSpecialist.avatar;
      let updatedSpec: Specialist | null = null;

      const updated = specialists.map((s) => {
        if (s.id === editingSpecialist.id) {
          updatedSpec = {
            ...s,
            name: name.trim(),
            nameEn: nameEn.trim() || s.nameEn || name.trim(),
            title: title.trim(),
            titleEn: titleEn.trim() || s.titleEn || title.trim(),
            role: role.trim() || title.trim(),
            roleEn: titleEn.trim() || s.roleEn || role.trim() || title.trim(),
            category: editCategory,
            department: s.category === editCategory && s.department ? s.department : getDepartmentByCategory(editCategory),
            avatar: finalAvatar,
            experienceYears: Math.max(1, Number(experienceYears) || s.experienceYears),
            rating: Math.min(5, Math.max(1, Number(rating) || s.rating || 5.0)),
            bio: bio.trim(),
            specialties: specialtiesList.length > 0 ? specialtiesList : s.specialties,
            isTopRated: editIsTopRated
          };
          return updatedSpec;
        }
        return s;
      });

      await Promise.resolve(onUpdateSpecialists(updated));

      updateSpecialistCardSetting(
        editingSpecialist.id,
        {
          name: name.trim(),
          avatar: finalAvatar,
          isTopRated: editIsTopRated
        },
        { skipSpecialistsSync: true }
      );

      if (updatedSpec) {
        await saveSpecialistToFirestore(updatedSpec).catch(() => false);
      }

      setSettingsVersion((v) => v + 1);
      setEditingSpecialist(null);
      showToast(isArabic ? 'تم تحديث بيانات الأخصائي ومزامنتها مع قاعدة البيانات بنجاح' : 'Specialist profile updated & synced successfully');
    } catch (err) {
      console.error('[SpecialistsTab] Edit save error:', err);
      showToast(isArabic ? 'حدث خطأ أثناء حفظ التعديلات' : 'Failed to save changes');
    } finally {
      setIsSavingEdit(false);
    }
  };

  // Add new specialist handler
  const handleCreateSpecialist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newTitle.trim() || isSavingCreate) return;
    setIsSavingCreate(true);

    try {
      const newId = `spec-${Date.now()}`;
      const specialtiesList = newSpecialties.split(/[,،]/).map((s) => s.trim()).filter(Boolean);
      const educationList = newEducation.split(/[,،]/).map((s) => s.trim()).filter(Boolean);
      const certsList = newCertifications.split(/[,،]/).map((s) => s.trim()).filter(Boolean);
      const finalAvatar = newAvatar.trim() || '/images/specialists/haneen_obaidi.jpg';

      const newSpecialist: Specialist = {
        id: newId,
        name: newName.trim(),
        nameEn: newNameEn.trim() || newName.trim(),
        title: newTitle.trim(),
        titleEn: newTitleEn.trim() || newTitle.trim(),
        role: newRole.trim() || newTitle.trim(),
        roleEn: newTitleEn.trim() || newTitle.trim(),
        category: newCategory,
        department: getDepartmentByCategory(newCategory),
        avatar: finalAvatar,
        experienceYears: Math.max(1, Number(newExperienceYears) || 5),
        licenseNumber: '',
        specialties: specialtiesList.length > 0 ? specialtiesList : ['تأهيل متخصص', 'تدخل مبكر'],
        specialtiesEn: specialtiesList.length > 0 ? specialtiesList : ['Specialized Rehabilitation', 'Early Intervention'],
        education: educationList.length > 0 ? educationList : ['بكالوريوس في العلوم الطبية التطبيقية'],
        educationEn: ['Bachelor of Applied Medical Sciences'],
        bio: newBio.trim() || `أخصائي معتمد في مركز رابا للرعاية النهارية وتأهيل ذوي الإعاقة بخبرة تزيد عن ${newExperienceYears} سنوات.`,
        bioEn: `Certified specialist at Raba Day Care Center with extensive clinical experience.`,
        certifications: certsList.length > 0 ? certsList : ['بورد معتمد في التأهيل والرعاية'],
        certificationsEn: ['Certified Board Accreditation'],
        availableDays: ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'],
        availableDaysEn: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'],
        rating: Math.min(5, Math.max(1, Number(newRating) || 5.0)),
        reviewsCount: 1,
        sessionPrice: 0,
        isTopRated: newIsTopRated
      };

      const updated = [newSpecialist, ...specialists];
      await Promise.resolve(onUpdateSpecialists(updated));

      updateSpecialistCardSetting(
        newId,
        {
          name: newSpecialist.name,
          avatar: finalAvatar,
          displayMode: 'cover',
          focalPosition: 'top',
          zoomLevel: 100,
          isTopRated: newIsTopRated
        },
        { skipSpecialistsSync: true }
      );

      await saveSpecialistToFirestore(newSpecialist).catch(() => false);

      setSettingsVersion((v) => v + 1);
      setIsAddModalOpen(false);
      // Reset form
      setNewName('');
      setNewNameEn('');
      setNewTitle('');
      setNewTitleEn('');
      setNewRole('');
      setNewRating(5.0);
      setNewIsTopRated(true);
      setNewBio('');
      setNewAvatar('/images/specialists/haneen_obaidi.jpg');
      showToast(isArabic ? '✨ تمت إضافة الأخصائي الجديد وحفظه في قواعد البيانات والسلايدر بنجاح' : 'Specialist added & synced to directory & slider');
    } catch (err) {
      console.error('[SpecialistsTab] Create specialist error:', err);
      showToast(isArabic ? 'تعذر حفظ الأخصائي الجديد، يرجى المحاولة مجدداً' : 'Failed to create specialist');
    } finally {
      setIsSavingCreate(false);
    }
  };

  // Delete specialist handler (System Admin only)
  const handleConfirmDelete = async () => {
    if (!deletingSpecialist || !isSystemAdmin || isDeleting) return;
    setIsDeleting(true);

    try {
      const targetId = deletingSpecialist.id;
      const deletedName = deletingSpecialist.name;
      const updated = specialists.filter((s) => s.id !== targetId);

      await Promise.resolve(onUpdateSpecialists(updated));
      removeSpecialistCardSetting(targetId);
      await deleteSpecialistFromFirestore(targetId).catch(() => false);

      setSettingsVersion((v) => v + 1);
      setDeletingSpecialist(null);
      showToast(isArabic ? `تم حذف بطاقة الأخصائي (${deletedName}) من كافة القواعد بنجاح` : `Specialist ${deletedName} deleted permanently`);
    } catch (err) {
      console.error('[SpecialistsTab] Delete error:', err);
      showToast(isArabic ? 'حدث خطأ أثناء الحذف' : 'Failed to delete specialist');
    } finally {
      setIsDeleting(false);
    }
  };

  // Upload & compress avatar for new specialist using /api/sync/upload + IndexedDB
  const handleNewAvatarFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingNewAvatar(true);
    try {
      const uploadedUrlOrData = await compressImage(file, 900, 900, 0.85);
      if (uploadedUrlOrData) {
        setNewAvatar(uploadedUrlOrData);
      }
    } catch (err) {
      console.error('[SpecialistsTab] New avatar upload error:', err);
      showToast(isArabic ? 'تعذر معالجة الصورة المختارة' : 'Failed to process selected image');
    } finally {
      setIsUploadingNewAvatar(false);
      e.target.value = '';
    }
  };

  // Upload & compress avatar inside Edit specialist modal
  const handleEditAvatarFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingEditAvatar(true);
    try {
      const uploadedUrlOrData = await compressImage(file, 900, 900, 0.85);
      if (uploadedUrlOrData) {
        setEditAvatar(uploadedUrlOrData);
      }
    } catch (err) {
      console.error('[SpecialistsTab] Edit avatar upload error:', err);
      showToast(isArabic ? 'تعذر معالجة الصورة المختارة' : 'Failed to process selected image');
    } finally {
      setIsUploadingEditAvatar(false);
      e.target.value = '';
    }
  };

  // Quick toggle for Top Rated status (syncs customizer + specialists array + Firestore)
  const handleToggleTopRated = async (spec: Specialist, currentVal: boolean) => {
    const nextVal = !currentVal;
    const setting = getSpecialistImageSetting(spec.id, spec);

    updateSpecialistCardSetting(
      spec.id,
      {
        name: spec.name,
        avatar: setting.avatar || spec.avatar,
        isTopRated: nextVal
      },
      { skipSpecialistsSync: true }
    );

    let updatedSpec: Specialist | null = null;
    const updatedList = specialists.map((s) => {
      if (s.id === spec.id) {
        updatedSpec = { ...s, isTopRated: nextVal };
        return updatedSpec;
      }
      return s;
    });

    setSettingsVersion((v) => v + 1);
    await Promise.resolve(onUpdateSpecialists(updatedList));
    if (updatedSpec) {
      await saveSpecialistToFirestore(updatedSpec).catch(() => false);
    }
  };

  // Deduplicated unique specialists list
  const uniqueSpecialists = useMemo(() => {
    return deduplicateSpecialists(specialists);
  }, [specialists]);

  // KPI calculations
  const stats = useMemo(() => {
    const total = uniqueSpecialists.length;
    getStoredSpecialistSettings();
    const topRatedCount = uniqueSpecialists.filter((s) => {
      const sett = getSpecialistImageSetting(s.id, s);
      return sett.isTopRated ?? s.isTopRated ?? s.rating >= 4.9;
    }).length;
    const abaCount = uniqueSpecialists.filter(
      (s) => s.category === 'aba' || s.title.includes('ABA') || s.role.includes('ABA')
    ).length;
    const otCount = uniqueSpecialists.filter(
      (s) => s.category === 'occupational' || s.title.includes('الوظيفي') || s.role.includes('الوظيفي')
    ).length;
    const speechCount = uniqueSpecialists.filter(
      (s) => s.category === 'speech' || s.title.includes('النطق') || s.role.includes('النطق')
    ).length;

    return { total, topRatedCount, abaCount, otCount, speechCount };
  }, [uniqueSpecialists, settingsVersion]);

  // Filtered specialists
  const filteredSpecialists = useMemo(() => {
    return uniqueSpecialists.filter((spec) => {
      // Search
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        spec.name.toLowerCase().includes(q) ||
        (spec.nameEn && spec.nameEn.toLowerCase().includes(q)) ||
        spec.title.toLowerCase().includes(q) ||
        spec.role.toLowerCase().includes(q);

      if (!matchesSearch) return false;

      // Department filter
      if (selectedDept === 'all') return true;
      if (selectedDept === 'topRated') {
        const sett = getSpecialistImageSetting(spec.id, spec);
        return sett.isTopRated ?? spec.isTopRated ?? spec.rating >= 4.9;
      }
      if (selectedDept === 'aba') {
        return spec.category === 'aba' || spec.title.includes('ABA') || spec.role.includes('ABA');
      }
      if (selectedDept === 'occupational') {
        return spec.category === 'occupational' || spec.title.includes('الوظيفي') || spec.role.includes('الوظيفي');
      }
      if (selectedDept === 'speech') {
        return spec.category === 'speech' || spec.title.includes('النطق') || spec.role.includes('النطق');
      }
      return true;
    });
  }, [uniqueSpecialists, searchQuery, selectedDept, settingsVersion]);

  return (
    <div className="space-y-6">
      
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white dark:bg-emerald-500 dark:text-slate-950 px-5 py-3 rounded-2xl shadow-2xl text-xs sm:text-sm font-black flex items-center gap-2 animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-slate-950" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Header & Title with Add Specialist Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-xs font-black">
              {isArabic ? 'إدارة الكوادر والتخصيص' : 'Staff & Card Directory'}
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-teal-500/10 text-teal-800 dark:text-teal-300 text-xs font-black">
              {stats.total} {isArabic ? 'أخصائي معتمد' : 'Specialists'}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            {isArabic ? 'إدارة وتخصيص بطاقات الأخصائيين' : 'Specialists & Card Management'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {isArabic 
              ? 'إضافة وحذف وتعديل بطاقات الأخصائيين، رفع صور البوسترات، وضبط المحاذاة والتمييز' 
              : 'Add, delete, and edit specialist cards, upload official photos, and customize cards'}
          </p>
        </div>

        {/* Add Specialist Button */}
        {canManage && (
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="self-start sm:self-auto px-5 py-2.5 rounded-2xl bg-[#0B3B36] hover:bg-[#124d47] dark:bg-[#00E5BE] dark:hover:bg-[#00c9a7] text-white dark:text-slate-950 text-xs sm:text-sm font-black transition-all flex items-center gap-2 shadow-md cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>{isArabic ? 'إضافة أخصائي جديد' : 'Add New Specialist'}</span>
          </button>
        )}
      </div>

      {/* 2. Executive KPI Cards Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl p-3.5 shadow-xs">
          <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
            {isArabic ? 'إجمالي الكادر الطبي' : 'Total Specialists'}
          </span>
          <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            {stats.total}
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl p-3.5 shadow-xs">
          <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
            {isArabic ? 'تحليل السلوك ABA' : 'ABA Specialists'}
          </span>
          <span className="text-xl sm:text-2xl font-black text-[#0B3B36] dark:text-[#00E5BE]">
            {stats.abaCount}
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl p-3.5 shadow-xs">
          <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
            {isArabic ? 'العلاج الوظيفي والتكامل' : 'Occupational & SI'}
          </span>
          <span className="text-xl sm:text-2xl font-black text-teal-700 dark:text-teal-400">
            {stats.otCount}
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl p-3.5 shadow-xs">
          <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
            {isArabic ? 'النطق والتخاطب' : 'Speech & SLP'}
          </span>
          <span className="text-xl sm:text-2xl font-black text-blue-700 dark:text-blue-400">
            {stats.speechCount}
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl p-3.5 shadow-xs col-span-2 sm:col-span-1">
          <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
            {isArabic ? 'الأعلى تقييماً' : 'Top Rated'}
          </span>
          <span className="text-xl sm:text-2xl font-black text-amber-700 dark:text-amber-400 flex items-center gap-1">
            <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
            {stats.topRatedCount}
          </span>
        </div>
      </div>

      {/* 3. Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-white/10 shadow-xs">
        
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 rtl:left-auto rtl:right-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isArabic ? 'بحث بالاسم أو التخصص...' : 'Search by name or specialty...'}
            className="w-full pl-9 rtl:pl-3 rtl:pr-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-white/10 rounded-xl text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-[#00E5BE]/30"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 rtl:right-auto rtl:left-3 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 text-xs font-bold"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
          <button
            onClick={() => setSelectedDept('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              selectedDept === 'all'
                ? 'bg-[#0B3B36] text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            {isArabic ? 'الكل' : 'All'}
          </button>
          <button
            onClick={() => setSelectedDept('aba')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              selectedDept === 'aba'
                ? 'bg-[#0B3B36] text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            {isArabic ? 'تحليل السلوك ABA' : 'ABA'}
          </button>
          <button
            onClick={() => setSelectedDept('occupational')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              selectedDept === 'occupational'
                ? 'bg-[#0B3B36] text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            {isArabic ? 'العلاج الوظيفي' : 'OT'}
          </button>
          <button
            onClick={() => setSelectedDept('speech')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              selectedDept === 'speech'
                ? 'bg-[#0B3B36] text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            {isArabic ? 'التخاطب' : 'Speech'}
          </button>
          <button
            onClick={() => setSelectedDept('topRated')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 ${
              selectedDept === 'topRated'
                ? 'bg-amber-700 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <Star className="w-3 h-3 fill-current" />
            <span>{isArabic ? 'الأعلى تقييماً' : 'Top Rated'}</span>
          </button>
        </div>

      </div>

      {/* 4. Specialist Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSpecialists.map((spec, idx) => {
          const setting = getSpecialistImageSetting(spec.id, spec);
          const rawAvatar = setting.avatar || spec.avatar;
          const activeAvatar = getResolvedImageUrl(rawAvatar);
          const isTop = setting.isTopRated ?? spec.isTopRated ?? spec.rating >= 4.9;
          const theme = getSpecialistLogoTheme(spec, idx);

          return (
            <div
              key={spec.id}
              className={`bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border ${theme.cardBorderHover} shadow-sm hover:shadow-md transition-all flex flex-col justify-between group`}
            >
              <div>
                {/* Top Slim Accent Strip in Logo Color */}
                <div className={`h-1.5 w-full ${theme.topAccentBar}`} />

                {/* Hero Card Image Display with Controls */}
                <div className={`relative h-48 ${theme.photoBg} overflow-hidden border-b border-slate-100 dark:border-white/10 transition-colors`}>
                  <img
                    src={activeAvatar}
                    alt={spec.name}
                    className={`w-full h-full transition-transform duration-300 ${
                      setting.displayMode === 'contain' ? 'object-contain' : 'object-cover'
                    } ${
                      setting.focalPosition === 'top' ? 'object-top' : setting.focalPosition === 'bottom' ? 'object-bottom' : 'object-center'
                    }`}
                    style={{
                      transform: `scale(${setting.zoomLevel / 100})`
                    }}
                    referrerPolicy="no-referrer"
                    onError={(e) => handleImageErrorWithStore(e, rawAvatar, spec.fallbackAvatar || spec.avatar)}
                  />

                  {/* Overlaid Badges */}
                  <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5">
                    {isTop && (
                      <span className="bg-[#0B3B36]/90 backdrop-blur-xs text-white text-[9px] font-black tracking-wider px-2.5 py-1 rounded-full shadow-md uppercase">
                        {isArabic ? 'الأعلى تقييماً' : 'TOP RATED'}
                      </span>
                    )}
                  </div>

                  {/* Upload Specialist Photo / File Button */}
                  <button
                    type="button"
                    onClick={() => setCustomizingSpecialist(spec)}
                    className="absolute bottom-3 right-3 z-10 px-3 py-1.5 rounded-xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-md text-slate-900 dark:text-white hover:bg-[#00E5BE] hover:text-slate-950 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5 text-[#00E5BE] group-hover:text-slate-950" />
                    <span>{isArabic ? 'تخصيص الصورة' : 'Customize Image'}</span>
                  </button>
                </div>

                {/* Card Info Details */}
                <div className="p-5">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h3 className="text-base font-black text-slate-900 dark:text-white leading-tight">
                        {spec.name}
                      </h3>
                      <p className={`text-xs font-bold mt-1 px-2.5 py-0.5 rounded-lg inline-block ${theme.specialtyBadge}`}>
                        {spec.title}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 bg-amber-400/10 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded-full text-xs font-black shrink-0">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>{spec.rating}</span>
                    </div>
                  </div>

                  {/* Quick Metrics (WITHOUT SESSION PRICE AND WITHOUT LICENSE) */}
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl space-y-1 text-xs text-slate-600 dark:text-slate-300 mb-3">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600 dark:text-slate-400 text-[11px]">{isArabic ? 'سنوات الخبرة السريرية:' : 'Experience:'}</span>
                      <span className="font-bold text-[11px] text-slate-900 dark:text-white">{spec.experienceYears} {isArabic ? 'سنوات' : 'years'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600 dark:text-slate-400 text-[11px]">{isArabic ? 'عدد التقييمات:' : 'Reviews:'}</span>
                      <span className="font-bold text-[11px] text-slate-900 dark:text-white">{spec.reviewsCount} {isArabic ? 'تقييم معتمد' : 'reviews'}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {spec.bio}
                  </p>
                </div>
              </div>

              {/* Bottom Action Row with Edit and Delete */}
              <div className="p-4 pt-0 flex items-center justify-between gap-2 border-t border-slate-100 dark:border-white/10 pt-3 mt-1">
                {/* Toggle Top Rated */}
                <button
                  type="button"
                  onClick={() => handleToggleTopRated(spec, isTop)}
                  className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer ${
                    isTop
                      ? 'bg-amber-400/15 text-amber-700 dark:text-amber-300 border border-amber-300/30'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                  title={isArabic ? 'تبديل شارة الأعلى تقييماً' : 'Toggle Top Rated'}
                >
                  <Star className={`w-3 h-3 ${isTop ? 'fill-amber-400 text-amber-400' : ''}`} />
                  <span>{isTop ? (isArabic ? 'مميز' : 'Featured') : (isArabic ? 'عادي' : 'Standard')}</span>
                </button>

                <div className="flex items-center gap-1.5">
                  {/* Edit Profile Details */}
                  {canManage && (
                    <button
                      onClick={() => handleOpenEdit(spec)}
                      className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-[#0B3B36] hover:text-white transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>{isArabic ? 'تعديل' : 'Edit'}</span>
                    </button>
                  )}

                  {/* Delete Specialist Card (System Admin Only) */}
                  {canManage && isSystemAdmin && (
                    <button
                      onClick={() => setDeletingSpecialist(spec)}
                      className="px-2.5 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200/50 dark:border-rose-900/50 hover:bg-rose-600 hover:text-white text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                      title={isArabic ? 'حذف بطاقة الأخصائي' : 'Delete Specialist Card'}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>{isArabic ? 'حذف' : 'Delete'}</span>
                    </button>
                  )}
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* 5. Customizer Modal */}
      {customizingSpecialist && (
        <SpecialistImageCustomizerModal
          specialist={customizingSpecialist}
          isOpen={!!customizingSpecialist}
          onClose={() => setCustomizingSpecialist(null)}
          onSaved={() => {
            setSettingsVersion((v) => v + 1);
          }}
        />
      )}

      {/* 6. Edit Info Modal (Full profile editing with avatar, English names, role, department, specialties, rating) */}
      {editingSpecialist && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm overflow-y-auto animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl p-6 w-full max-w-xl shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-4 mb-5">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <span>{isArabic ? 'تعديل بيانات الأخصائي' : 'Edit Specialist Profile'}</span>
              </h3>
              <button
                type="button"
                onClick={() => setEditingSpecialist(null)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
              {/* Avatar Preview & Upload */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-white/10 flex items-center gap-4">
                <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-200 dark:bg-slate-700 shrink-0 border-2 border-white dark:border-white/20 shadow-sm">
                  <img
                    src={getResolvedImageUrl(editAvatar)}
                    alt={name || 'Preview'}
                    className="w-full h-full object-cover object-top"
                    onError={(e) => handleImageErrorWithStore(e, editAvatar, '/images/specialists/haneen_obaidi.jpg')}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    {isArabic ? 'صورة الأخصائي:' : 'Specialist Photo:'}
                  </span>
                  <div className="flex flex-wrap items-center gap-2">
                    <input
                      type="file"
                      ref={editAvatarInputRef}
                      onChange={handleEditAvatarFileChange}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => editAvatarInputRef.current?.click()}
                      disabled={isUploadingEditAvatar}
                      className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 flex items-center gap-1.5 cursor-pointer shadow-2xs disabled:opacity-60"
                    >
                      {isUploadingEditAvatar ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-[#00E5BE]" />
                      ) : (
                        <Upload className="w-3.5 h-3.5 text-[#00E5BE]" />
                      )}
                      <span>{isUploadingEditAvatar ? (isArabic ? 'جارِ المعالجة والرفع...' : 'Uploading...') : (isArabic ? 'تغيير الصورة من جهازك' : 'Upload New Image')}</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    value={editAvatar}
                    onChange={(e) => setEditAvatar(e.target.value)}
                    placeholder="/images/specialists/..."
                    className="w-full mt-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800 text-[11px] font-mono text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Names */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {isArabic ? 'الاسم الكامل (عربي) *:' : 'Full Name (Arabic) *:'}
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {isArabic ? 'الاسم بالإنجليزية:' : 'Full Name (English):'}
                  </label>
                  <input
                    type="text"
                    value={nameEn}
                    onChange={(e) => setNameEn(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Job Titles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {isArabic ? 'المسمى الوظيفي (عربي) *:' : 'Job Title (Arabic) *:'}
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {isArabic ? 'المسمى الوظيفي (إنجليزي):' : 'Job Title (English):'}
                  </label>
                  <input
                    type="text"
                    value={titleEn}
                    onChange={(e) => setTitleEn(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Role & Department Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {isArabic ? 'الصفة / الدور المختصر (بالبطاقة):' : 'Card Role Badge:'}
                  </label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {isArabic ? 'القسم التأهيلي:' : 'Department Category:'}
                  </label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white"
                  >
                    <option value="aba">{isArabic ? 'تحليل السلوك التطبيقي ABA' : 'ABA Therapy'}</option>
                    <option value="occupational">{isArabic ? 'العلاج الوظيفي والتكامل الحسي' : 'Occupational Therapy'}</option>
                    <option value="speech">{isArabic ? 'علاج النطق واللغة والتخاطب' : 'Speech & Language'}</option>
                    <option value="psychology">{isArabic ? 'الاستشارات النفسية وصعوبات التعلم' : 'Child Psychology'}</option>
                  </select>
                </div>
              </div>

              {/* Experience & Rating */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {isArabic ? 'سنوات الخبرة:' : 'Experience (Years):'}
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={45}
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {isArabic ? 'التقييم (من 5):' : 'Rating (out of 5):'}
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={5}
                    step={0.1}
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {isArabic ? 'النبذة المهنية والسيرة الذاتية:' : 'Bio:'}
                </label>
                <textarea
                  rows={4}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white leading-relaxed"
                  required
                />
              </div>

              {/* Specialties */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {isArabic ? 'مجالات التركيز والتخصصات (مفصولة بفواصل):' : 'Specialties (Comma Separated):'}
                </label>
                <input
                  type="text"
                  value={editSpecialties}
                  onChange={(e) => setEditSpecialties(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white"
                />
              </div>

              {/* Featured Badge Toggle */}
              <label className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={editIsTopRated}
                  onChange={(e) => setEditIsTopRated(e.target.checked)}
                  className="w-4 h-4 rounded text-[#0B3B36] focus:ring-[#00E5BE] cursor-pointer"
                />
                <span>{isArabic ? 'تمييز البطاقة بشارة "الأعلى تقييماً" (TOP RATED)' : 'Feature with "TOP RATED" badge'}</span>
              </label>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setEditingSpecialist(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  {isArabic ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={isSavingEdit || isUploadingEditAvatar}
                  className="px-5 py-2 rounded-xl bg-[#0B3B36] hover:bg-[#082b27] text-white text-xs font-bold cursor-pointer transition-all shadow-xs flex items-center gap-1.5 disabled:opacity-60"
                >
                  {isSavingEdit && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{isSavingEdit ? (isArabic ? 'جاري الحفظ...' : 'Saving...') : (isArabic ? 'حفظ التعديلات' : 'Save Changes')}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. Add New Specialist Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl p-6 w-full max-w-xl shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-4 mb-5">
              <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-600 dark:text-[#00E5BE]" />
                <span>{isArabic ? 'إضافة بطاقة أخصائي جديد' : 'Add New Specialist Card'}</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSpecialist} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
              
              {/* Avatar Preview & Upload */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-white/10 flex items-center gap-4">
                <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-200 dark:bg-slate-700 shrink-0 border-2 border-white dark:border-white/20 shadow-sm">
                  <img
                    src={getResolvedImageUrl(newAvatar)}
                    alt="Preview"
                    className="w-full h-full object-cover object-top"
                    onError={(e) => handleImageErrorWithStore(e, newAvatar, '/images/specialists/haneen_obaidi.jpg')}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    {isArabic ? 'صورة الأخصائي:' : 'Specialist Photo:'}
                  </span>
                  <div className="flex flex-wrap items-center gap-2">
                    <input
                      type="file"
                      ref={addAvatarInputRef}
                      onChange={handleNewAvatarFileChange}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => addAvatarInputRef.current?.click()}
                      disabled={isUploadingNewAvatar}
                      className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <Upload className="w-3.5 h-3.5 text-[#00E5BE]" />
                      <span>{isUploadingNewAvatar ? (isArabic ? 'جارِ الرفع...' : 'Uploading...') : (isArabic ? 'رفع صورة من جهازك' : 'Upload Image')}</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    value={newAvatar}
                    onChange={(e) => setNewAvatar(e.target.value)}
                    placeholder="/images/specialists/..."
                    className="w-full mt-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800 text-[11px] font-mono text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Names */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {isArabic ? 'الاسم الكامل (عربي) *:' : 'Full Name (Arabic) *:'}
                  </label>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="مثال: د. سارة القحطاني"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {isArabic ? 'الاسم بالإنجليزية:' : 'Full Name (English):'}
                  </label>
                  <input
                    type="text"
                    value={newNameEn}
                    onChange={(e) => setNewNameEn(e.target.value)}
                    placeholder="e.g. Dr. Sara Al-Qahtani"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Title & Department */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {isArabic ? 'المسمى الوظيفي والتخصص *:' : 'Job Title & Specialty *:'}
                  </label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="مثال: أخصائية أولى علاج النطق واللغة"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {isArabic ? 'القسم التأهيلي:' : 'Department Category:'}
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white"
                  >
                    <option value="aba">{isArabic ? 'تحليل السلوك التطبيقي ABA' : 'ABA Therapy'}</option>
                    <option value="occupational">{isArabic ? 'العلاج الوظيفي والتكامل الحسي' : 'Occupational Therapy'}</option>
                    <option value="speech">{isArabic ? 'علاج النطق واللغة والتخاطب' : 'Speech & Language'}</option>
                    <option value="psychology">{isArabic ? 'الاستشارات النفسية وصعوبات التعلم' : 'Child Psychology'}</option>
                  </select>
                </div>
              </div>

              {/* Experience Years */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {isArabic ? 'عدد سنوات الخبرة السريرية *:' : 'Clinical Experience (Years) *:'}
                </label>
                <input
                  type="number"
                  min={1}
                  max={40}
                  value={newExperienceYears}
                  onChange={(e) => setNewExperienceYears(Number(e.target.value))}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white"
                  required
                />
              </div>

              {/* Bio */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {isArabic ? 'السيرة الذاتية والنبذة المهنية *:' : 'Professional Bio *:'}
                </label>
                <textarea
                  rows={3}
                  value={newBio}
                  onChange={(e) => setNewBio(e.target.value)}
                  placeholder={isArabic ? 'اكتب نبذة توضح الخبرات السريرية، الجامعات، والشهادات التخصصية للأخصائي...' : 'Enter clinical background, credentials, and achievements...'}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white leading-relaxed"
                  required
                />
              </div>

              {/* Specialties / Tags */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {isArabic ? 'مجالات التركيز والتخصصات (مفصولة بفواصل):' : 'Specialties (Comma Separated):'}
                </label>
                <input
                  type="text"
                  value={newSpecialties}
                  onChange={(e) => setNewSpecialties(e.target.value)}
                  placeholder="مثال: تأخر الكلام, التأتأة, برامج PECS"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white"
                />
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  {isArabic ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={isSavingCreate || isUploadingNewAvatar}
                  className="px-6 py-2 rounded-xl bg-[#0B3B36] hover:bg-[#082b27] dark:bg-[#00E5BE] dark:hover:bg-[#00c9a7] text-white dark:text-slate-950 text-xs font-black cursor-pointer transition-all shadow-md flex items-center gap-1.5 disabled:opacity-60"
                >
                  {isSavingCreate && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{isSavingCreate ? (isArabic ? 'جاري الإضافة والحفظ...' : 'Saving...') : (isArabic ? 'حفظ وإضافة الأخصائي' : 'Save & Add Specialist')}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 8. Delete Confirmation Modal (System Admin Only) */}
      {deletingSpecialist && isSystemAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl p-6 w-full max-w-md shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-600 flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2">
              {isArabic ? 'تأكيد حذف بطاقة الأخصائي' : 'Confirm Specialist Card Deletion'}
            </h3>
            
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
              {isArabic 
                ? `هل أنت متأكد من رغبتك في حذف بطاقة الأخصائي "${deletingSpecialist.name}" نهائياً من دليل الكوادر والسلايدر في الموقع؟` 
                : `Are you sure you want to permanently delete the card for "${deletingSpecialist.name}" from the directory and slider?`}
            </p>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeletingSpecialist(null)}
                disabled={isDeleting}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer disabled:opacity-60"
              >
                {isArabic ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black shadow-md cursor-pointer transition-all flex items-center gap-1.5 disabled:opacity-60"
              >
                {isDeleting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>{isDeleting ? (isArabic ? 'جاري الحذف...' : 'Deleting...') : (isArabic ? 'نعم، حذف البطاقة' : 'Yes, Delete Card')}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
