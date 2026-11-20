import React, { useState, useEffect, useMemo } from 'react';
import { 
  DollarSign, 
  Tag, 
  Percent, 
  Sparkles, 
  Check, 
  CheckCircle2, 
  RotateCcw, 
  Edit3, 
  Layers, 
  GraduationCap, 
  UserCheck, 
  SlidersHorizontal, 
  AlertCircle, 
  Calculator,
  Search,
  ArrowRight,
  ArrowLeft,
  Calendar,
  Clock,
  Zap,
  Save,
  CreditCard,
  AlertTriangle
} from 'lucide-react';
import { TherapyPackage, ServiceItem, Specialist, PermissionId } from '../../types';
import { CourseItem, getStoredCoursesData, saveStoredCoursesData } from '../../data/coursesData';
import { getStoredPackages, saveStoredPackages, getStoredServices, saveStoredServices, THERAPY_PACKAGES, SERVICES, SPECIALISTS } from '../../data/mockData';
import { useLanguage } from '../../context/LanguageContext';
import { useLiveDataOptional } from '../../context/LiveDataContext';
import { savePersistentModule } from '../../utils/persistentSync';
import { getResolvedImageUrl, handleImageErrorWithStore } from '../../utils/persistentImageStore';
import {
  saveSpecialistToFirestore,
  syncPackagesCollectionToFirestore,
  syncServicesCollectionToFirestore,
  syncCoursesCollectionToFirestore,
  saveFinanceRecordToFirestore
} from '../../services/firestoreService';
import { TamaraLogo, EmkanLogo } from '../InstallmentLogos';

interface PricingManagementTabProps {
  packages?: TherapyPackage[];
  services?: ServiceItem[];
  specialists?: Specialist[];
  onUpdatePackages?: (updated: TherapyPackage[]) => void;
  onUpdateServices?: (updated: ServiceItem[]) => void;
  onUpdateSpecialists?: (updated: Specialist[]) => void;
  hasPermission?: (perm: PermissionId) => boolean;
}

export const PricingManagementTab: React.FC<PricingManagementTabProps> = ({
  packages: propsPackages,
  services: propsServices,
  specialists: propsSpecialists,
  onUpdatePackages,
  onUpdateServices,
  onUpdateSpecialists,
  hasPermission
}) => {
  const { isArabic } = useLanguage();
  const liveData = useLiveDataOptional();

  // Active section tab
  const [activeSection, setActiveSection] = useState<'packages' | 'services' | 'courses' | 'specialists' | 'global'>('packages');

  // Search and filter queries
  const [searchQuery, setSearchQuery] = useState('');

  // Local editable datasets
  const [packagesList, setPackagesList] = useState<TherapyPackage[]>(() => propsPackages || getStoredPackages());
  const [servicesList, setServicesList] = useState<ServiceItem[]>(() => propsServices || getStoredServices());
  const [coursesList, setCoursesList] = useState<CourseItem[]>(() => getStoredCoursesData());
  const [specialistsList, setSpecialistsList] = useState<Specialist[]>(() => {
    if (propsSpecialists && propsSpecialists.length > 0) return propsSpecialists;
    try {
      const saved = localStorage.getItem('raba_specialists');
      return saved ? JSON.parse(saved) : SPECIALISTS;
    } catch {
      return SPECIALISTS;
    }
  });

  // Global settings state
  const [currencySymbol, setCurrencySymbol] = useState<'ر.س' | 'SAR'>(() => {
    return (localStorage.getItem('raba_currency_symbol') as any) || 'ر.س';
  });
  const [isVatInclusive, setIsVatInclusive] = useState<boolean>(() => {
    return localStorage.getItem('raba_vat_inclusive') !== 'false';
  });
  const [installmentNote, setInstallmentNote] = useState<string>(() => {
    return localStorage.getItem('raba_installment_note') || 'تقسيط ميسر حتى 4 دفعات بدون فوائد عبر تمارا أو تابي أو إمكان';
  });

  // Bulk discount & reset confirmation modal states
  const [bulkDiscountPercentage, setBulkDiscountPercentage] = useState<number>(10);
  const [isBulkDiscountModalOpen, setIsBulkDiscountModalOpen] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  // Editing state for Package
  const [editingPackageId, setEditingPackageId] = useState<string | null>(null);
  const [packageFormData, setPackageFormData] = useState<Partial<TherapyPackage>>({});

  // Editing state for Service
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [serviceFormData, setServiceFormData] = useState<Partial<ServiceItem>>({});

  // Editing state for Course
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const [courseFormData, setCourseFormData] = useState<Partial<CourseItem>>({});

  // Editing state for Specialist
  const [editingSpecialistId, setEditingSpecialistId] = useState<string | null>(null);
  const [specialistPriceInput, setSpecialistPriceInput] = useState<number>(350);

  // Success Feedback Toast
  const [saveToast, setSaveToast] = useState<string | null>(null);

  const showSuccessFeedback = (msg: string) => {
    setSaveToast(msg);
    setTimeout(() => setSaveToast(null), 3500);
  };

  // Hydrate from real-time LiveDataContext & parent props when no inline editor is active
  useEffect(() => {
    if (editingPackageId) return;
    if (liveData?.isAuthoritativePackages && liveData.packages) {
      setPackagesList(liveData.packages);
    } else if (propsPackages) {
      setPackagesList(propsPackages);
    }
  }, [propsPackages, liveData?.packages, liveData?.isAuthoritativePackages, editingPackageId]);

  useEffect(() => {
    if (editingServiceId) return;
    if (liveData?.isAuthoritativeServices && liveData.services) {
      setServicesList(liveData.services);
    } else if (propsServices) {
      setServicesList(propsServices);
    }
  }, [propsServices, liveData?.services, liveData?.isAuthoritativeServices, editingServiceId]);

  useEffect(() => {
    if (editingCourseId) return;
    if (liveData?.isAuthoritativeCourses && liveData.courses) {
      setCoursesList(liveData.courses);
    }
  }, [liveData?.courses, liveData?.isAuthoritativeCourses, editingCourseId]);

  useEffect(() => {
    if (editingSpecialistId) return;
    if (liveData?.isAuthoritativeSpecialists && liveData.specialists) {
      setSpecialistsList(liveData.specialists);
    } else if (propsSpecialists) {
      setSpecialistsList(propsSpecialists);
    }
  }, [propsSpecialists, liveData?.specialists, liveData?.isAuthoritativeSpecialists, editingSpecialistId]);

  useEffect(() => {
    if (!liveData?.pricingGlobalSettings) return;
    if (liveData.pricingGlobalSettings.currencySymbol) {
      setCurrencySymbol(liveData.pricingGlobalSettings.currencySymbol === 'SAR' ? 'SAR' : 'ر.س');
    }
    if (liveData.pricingGlobalSettings.isVatInclusive !== undefined) {
      setIsVatInclusive(Boolean(liveData.pricingGlobalSettings.isVatInclusive));
    }
    if (liveData.pricingGlobalSettings.installmentNote) {
      setInstallmentNote(liveData.pricingGlobalSettings.installmentNote);
    }
  }, [liveData?.pricingGlobalSettings]);

  useEffect(() => {
    const syncSpecialists = () => {
      if (editingSpecialistId) return;
      try {
        const raw = localStorage.getItem('raba_specialists');
        if (!raw) return;
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setSpecialistsList((prev) => (JSON.stringify(prev) === JSON.stringify(parsed) ? prev : parsed));
        }
      } catch {
        // ignore
      }
    };
    window.addEventListener('raba_specialists_updated', syncSpecialists);
    window.addEventListener('raba_persistent_sync_ready', syncSpecialists);
    return () => {
      window.removeEventListener('raba_specialists_updated', syncSpecialists);
      window.removeEventListener('raba_persistent_sync_ready', syncSpecialists);
    };
  }, [editingSpecialistId]);

  // ----------------------------------------------------
  // Package Management Handlers
  // ----------------------------------------------------
  const handleStartEditPackage = (pkg: TherapyPackage) => {
    setEditingPackageId(pkg.id);
    setPackageFormData({
      price: pkg.price,
      originalPrice: pkg.originalPrice || pkg.price,
      sessionsCount: pkg.sessionsCount,
      durationWeeks: pkg.durationWeeks,
      installmentText: pkg.installmentText || 'متاح التقسيط عبر تمارا',
      badge: pkg.badge || '',
      tagline: pkg.tagline || ''
    });
  };

  const handleSavePackagePricing = (packageId: string) => {
    const updated = packagesList.map((p) => {
      if (p.id === packageId) {
        const newPrice = Number(packageFormData.price) || p.price;
        const newOriginal = Number(packageFormData.originalPrice) || newPrice;
        return {
          ...p,
          price: newPrice,
          originalPrice: newOriginal,
          sessionsCount: Number(packageFormData.sessionsCount) || p.sessionsCount,
          durationWeeks: Number(packageFormData.durationWeeks) || p.durationWeeks,
          installmentText: packageFormData.installmentText ?? p.installmentText,
          badge: packageFormData.badge ?? p.badge,
          tagline: packageFormData.tagline ?? p.tagline
        };
      }
      return p;
    });

    setPackagesList(updated);
    saveStoredPackages(updated);
    void syncPackagesCollectionToFirestore(updated);
    if (onUpdatePackages) onUpdatePackages(updated);

    setEditingPackageId(null);
    showSuccessFeedback(isArabic ? '✓ تم تحديث سعر الباقة وحفظه بنجاح!' : '✓ Package price updated successfully!');
  };

  // Apply bulk discount to all packages
  const handleApplyBulkDiscountToPackages = () => {
    if (bulkDiscountPercentage <= 0 || bulkDiscountPercentage > 90) return;
    const factor = (100 - bulkDiscountPercentage) / 100;

    const updated = packagesList.map(p => {
      const base = p.originalPrice || p.price;
      const discounted = Math.round(base * factor / 10) * 10; // Round to nearest 10
      return {
        ...p,
        originalPrice: base,
        price: discounted,
        badge: isArabic ? `خصم ${bulkDiscountPercentage}%` : `${bulkDiscountPercentage}% OFF`
      };
    });

    setPackagesList(updated);
    saveStoredPackages(updated);
    void syncPackagesCollectionToFirestore(updated);
    if (onUpdatePackages) onUpdatePackages(updated);
    setIsBulkDiscountModalOpen(false);
    showSuccessFeedback(isArabic ? `✓ تم تطبيق خصم ${bulkDiscountPercentage}% على جميع الباقات!` : `✓ Applied ${bulkDiscountPercentage}% discount to all packages!`);
  };

  // Reset packages to defaults
  const handleResetPackagesToDefault = () => {
    setIsResetConfirmOpen(true);
  };

  const handleConfirmResetPackages = () => {
    setPackagesList(THERAPY_PACKAGES);
    saveStoredPackages(THERAPY_PACKAGES);
    void syncPackagesCollectionToFirestore(THERAPY_PACKAGES);
    if (onUpdatePackages) onUpdatePackages(THERAPY_PACKAGES);
    setIsResetConfirmOpen(false);
    showSuccessFeedback(isArabic ? '✓ تم استعادة أسعار الباقات الافتراضية' : '✓ Reset to default packages');
  };

  // ----------------------------------------------------
  // Service Management Handlers
  // ----------------------------------------------------
  const handleStartEditService = (srv: ServiceItem) => {
    setEditingServiceId(srv.id);
    setServiceFormData({
      sessionPrice: srv.sessionPrice || 280,
      assessmentPrice: srv.assessmentPrice || 450,
      originalPrice: srv.originalPrice || 350,
      priceDisplayAr: srv.priceDisplayAr || '',
      showPrice: srv.showPrice !== false
    });
  };

  const handleSaveServicePricing = (serviceId: string) => {
    const updated = servicesList.map((s) => {
      if (s.id === serviceId) {
        return {
          ...s,
          sessionPrice: Number(serviceFormData.sessionPrice) || 280,
          assessmentPrice: Number(serviceFormData.assessmentPrice) || 450,
          originalPrice: Number(serviceFormData.originalPrice) || 350,
          priceDisplayAr: serviceFormData.priceDisplayAr || '',
          showPrice: serviceFormData.showPrice !== false
        };
      }
      return s;
    });

    setServicesList(updated);
    saveStoredServices(updated);
    void syncServicesCollectionToFirestore(updated);
    if (onUpdateServices) onUpdateServices(updated);

    setEditingServiceId(null);
    showSuccessFeedback(isArabic ? '✓ تم تحديث تسعير الخدمة بنجاح!' : '✓ Service pricing updated successfully!');
  };

  // ----------------------------------------------------
  // Course Management Handlers
  // ----------------------------------------------------
  const handleStartEditCourse = (course: CourseItem) => {
    setEditingCourseId(course.id);
    setCourseFormData({
      currentPrice: course.currentPrice || 650,
      originalPrice: course.originalPrice || 900,
      priceDisplayAr: course.priceDisplayAr || `${course.currentPrice || 650} ر.س`,
      priceDisplayEn: course.priceDisplayEn || `${course.currentPrice || 650} SAR`
    });
  };

  const handleSaveCoursePricing = (courseId: string) => {
    const updated = coursesList.map((c) => {
      if (c.id === courseId) {
        const curPrice = Number(courseFormData.currentPrice) || c.currentPrice || 650;
        const origPrice = Number(courseFormData.originalPrice) || c.originalPrice || 900;
        return {
          ...c,
          currentPrice: curPrice,
          originalPrice: origPrice,
          priceDisplayAr: courseFormData.priceDisplayAr || `${curPrice} ر.س`,
          priceDisplayEn: courseFormData.priceDisplayEn || `${curPrice} SAR`
        };
      }
      return c;
    });

    setCoursesList(updated);
    saveStoredCoursesData(updated);
    void syncCoursesCollectionToFirestore(updated);
    setEditingCourseId(null);
    showSuccessFeedback(isArabic ? '✓ تم تحديث سعر الدورة التدريبية بنجاح!' : '✓ Course price updated successfully!');
  };

  // ----------------------------------------------------
  // Specialist Management Handlers
  // ----------------------------------------------------
  const handleStartEditSpecialist = (spec: Specialist) => {
    setEditingSpecialistId(spec.id);
    setSpecialistPriceInput(spec.sessionPrice || 350);
  };

  const handleSaveSpecialistPricing = async (specId: string) => {
    let updatedSpec: Specialist | null = null;
    const updated = specialistsList.map((s) => {
      if (s.id === specId) {
        updatedSpec = {
          ...s,
          sessionPrice: Number(specialistPriceInput) || 350
        };
        return updatedSpec;
      }
      return s;
    });

    setSpecialistsList(updated);
    try {
      localStorage.setItem('raba_specialists', JSON.stringify(updated));
      localStorage.setItem('raba_ts_raba_specialists', Date.now().toString());
      window.dispatchEvent(new Event('raba_specialists_updated'));
    } catch {
      // ignore
    }
    if (onUpdateSpecialists) onUpdateSpecialists(updated);

    setEditingSpecialistId(null);
    showSuccessFeedback(isArabic ? '✓ تم تحديث سعر جلسة الأخصائي بنجاح!' : '✓ Specialist session price updated!');

    await savePersistentModule('raba_specialists', updated);
    if (updatedSpec) {
      await saveSpecialistToFirestore(updatedSpec).catch(() => false);
    }
  };

  // ----------------------------------------------------
  // Global Settings Handlers
  // ----------------------------------------------------
  const handleSaveGlobalSettings = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        currencySymbol,
        isVatInclusive,
        installmentNote
      };
      localStorage.setItem('raba_currency_symbol', currencySymbol);
      localStorage.setItem('raba_vat_inclusive', String(isVatInclusive));
      localStorage.setItem('raba_installment_note', installmentNote);
      savePersistentModule('raba_pricing_global_settings', payload);
      void saveFinanceRecordToFirestore('pricing_global_settings', payload);
      showSuccessFeedback(isArabic ? '✓ تم حفظ إعدادات العملة والتقسيط العامة بنجاح!' : '✓ Global pricing settings saved!');
    } catch (err) {
      console.error(err);
    }
  };

  // Filtered lists for search
  const filteredPackages = useMemo(() => {
    if (!searchQuery.trim()) return packagesList;
    const q = searchQuery.toLowerCase();
    return packagesList.filter(p => p.name.toLowerCase().includes(q) || (p.tagline && p.tagline.toLowerCase().includes(q)));
  }, [packagesList, searchQuery]);

  const filteredServices = useMemo(() => {
    if (!searchQuery.trim()) return servicesList;
    const q = searchQuery.toLowerCase();
    return servicesList.filter(s => s.title.toLowerCase().includes(q) || s.categoryAr.toLowerCase().includes(q));
  }, [servicesList, searchQuery]);

  const filteredCourses = useMemo(() => {
    if (!searchQuery.trim()) return coursesList;
    const q = searchQuery.toLowerCase();
    return coursesList.filter(c => c.titleAr.toLowerCase().includes(q));
  }, [coursesList, searchQuery]);

  const filteredSpecialists = useMemo(() => {
    if (!searchQuery.trim()) return specialistsList;
    const q = searchQuery.toLowerCase();
    return specialistsList.filter(s => s.name.toLowerCase().includes(q) || s.role.toLowerCase().includes(q));
  }, [specialistsList, searchQuery]);

  return (
    <div className="space-y-6">
      
      {/* Floating Success Notification */}
      {saveToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#0B3B36] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2 border border-emerald-400/40 text-xs font-black animate-in fade-in slide-in-from-top-4 duration-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{saveToast}</span>
        </div>
      )}

      {/* Top Header Card */}
      <div className="bg-gradient-to-r from-[#0B3B36] via-[#0E4842] to-[#042824] rounded-3xl p-6 sm:p-7 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -left-12 -top-12 w-48 h-48 bg-[#00E5BE]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[11px] font-bold text-teal-200 border border-white/10">
              <DollarSign className="w-3.5 h-3.5 text-[#00E5BE]" />
              <span>{isArabic ? 'منظومة التسعير المباشر لمركز رابا' : 'Raba Direct Pricing Hub'}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              {isArabic ? 'إدارة وتخصيص الأسعار والباقات' : 'Pricing & Packages Management'}
            </h2>
            <p className="text-xs sm:text-sm text-teal-100/80 max-w-2xl leading-relaxed">
              {isArabic 
                ? 'تحكم شامل وفوري في أسعار باقات التأهيل، برامج الجلسات، الكورسات التدريبية، وجلسات الأخصائيين، مع إمكانية تطبيق خصومات فورية وإعدادات التقسيط.'
                : 'Complete control over therapy packages, clinical sessions, training courses, and specialist fees with instant site-wide sync.'}
            </p>
          </div>

          {/* Quick Actions Buttons */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => setIsBulkDiscountModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-[#00E5BE] hover:bg-[#00ffd2] text-slate-950 font-black text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <Percent className="w-4 h-4" />
              <span>{isArabic ? 'تطبيق خصم جماعي' : 'Bulk Discount'}</span>
            </button>
            <button
              onClick={handleResetPackagesToDefault}
              className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/15 transition-all flex items-center gap-1.5 cursor-pointer"
              title={isArabic ? 'استعادة أسعار الباقات الافتراضية' : 'Reset Packages'}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{isArabic ? 'استعادة الافتراضي' : 'Reset'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center justify-between gap-3 border-b border-slate-200 dark:border-white/10 pb-3 overflow-x-auto">
        <div className="flex items-center gap-2">
          
          {/* Packages Tab */}
          <button
            onClick={() => { setActiveSection('packages'); setSearchQuery(''); }}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
              activeSection === 'packages'
                ? 'bg-[#0B3B36] text-white shadow-md'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 hover:bg-slate-50'
            }`}
          >
            <Layers className="w-4 h-4 text-teal-400" />
            <span>{isArabic ? `باقات التأهيل المكثفة (${packagesList.length})` : `Packages (${packagesList.length})`}</span>
          </button>

          {/* Clinical Services Tab */}
          <button
            onClick={() => { setActiveSection('services'); setSearchQuery(''); }}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
              activeSection === 'services'
                ? 'bg-[#0B3B36] text-white shadow-md'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 hover:bg-slate-50'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>{isArabic ? `برامج التأهيل والجلسات (${servicesList.length})` : `Services (${servicesList.length})`}</span>
          </button>

          {/* Courses Tab */}
          <button
            onClick={() => { setActiveSection('courses'); setSearchQuery(''); }}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
              activeSection === 'courses'
                ? 'bg-[#0B3B36] text-white shadow-md'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 hover:bg-slate-50'
            }`}
          >
            <GraduationCap className="w-4 h-4 text-emerald-400" />
            <span>{isArabic ? `الكورسات والدورات (${coursesList.length})` : `Courses (${coursesList.length})`}</span>
          </button>

          {/* Specialists Tab */}
          <button
            onClick={() => { setActiveSection('specialists'); setSearchQuery(''); }}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
              activeSection === 'specialists'
                ? 'bg-[#0B3B36] text-white shadow-md'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 hover:bg-slate-50'
            }`}
          >
            <UserCheck className="w-4 h-4 text-sky-400" />
            <span>{isArabic ? `جلسات الأخصائيين (${specialistsList.length})` : `Specialists (${specialistsList.length})`}</span>
          </button>

          {/* Global Settings Tab */}
          <button
            onClick={() => { setActiveSection('global'); setSearchQuery(''); }}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
              activeSection === 'global'
                ? 'bg-[#0B3B36] text-white shadow-md'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 hover:bg-slate-50'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4 text-purple-400" />
            <span>{isArabic ? 'إعدادات العملة والتقسيط' : 'Global Settings'}</span>
          </button>
        </div>

        {/* Search input for list views */}
        {activeSection !== 'global' && (
          <div className="relative min-w-[200px] max-w-xs">
            <Search className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder={isArabic ? 'بحث في الأسعار...' : 'Search items...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-8 pl-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none"
            />
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 1. THERAPY PACKAGES SECTION                                        */}
      {/* ------------------------------------------------------------------ */}
      {activeSection === 'packages' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/20 border border-teal-200/80 dark:border-teal-800/30 text-xs text-teal-900 dark:text-teal-200 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-teal-600 shrink-0" />
              <span>{isArabic ? 'يتم احتساب نسبة التوفير وسعر الجلسة الواحدة تلقائياً وعرضها للمستفيدين في صفحة الخدمات وصفحة الباقات.' : 'Session prices and savings percentage are automatically calculated.'}</span>
            </div>
            <span className="font-bold text-[11px] bg-white dark:bg-slate-900 px-2.5 py-1 rounded-lg border border-teal-200 dark:border-teal-800">
              {filteredPackages.length} {isArabic ? 'باقة متاحة' : 'Packages'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredPackages.map((pkg) => {
              const isEditing = editingPackageId === pkg.id;
              const originalPrice = pkg.originalPrice || pkg.price;
              const savings = originalPrice > pkg.price ? originalPrice - pkg.price : 0;
              const savingsPercent = originalPrice > pkg.price ? Math.round((savings / originalPrice) * 100) : 0;
              const pricePerSession = pkg.sessionsCount > 0 ? Math.round(pkg.price / pkg.sessionsCount) : 0;

              return (
                <div
                  key={pkg.id}
                  className={`bg-white dark:bg-slate-900 rounded-3xl p-5 border transition-all shadow-sm flex flex-col justify-between ${
                    isEditing 
                      ? 'border-[#00E5BE] ring-2 ring-[#00E5BE]/20' 
                      : 'border-slate-200 dark:border-white/10 hover:border-teal-500/50'
                  }`}
                >
                  <div className="space-y-3">
                    
                    {/* Card Top Header */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-black px-3 py-1 rounded-full bg-teal-500/10 text-teal-700 dark:text-teal-300">
                        {pkg.sessionsCount} {isArabic ? 'جلسة' : 'Sessions'} · {pkg.durationWeeks} {isArabic ? 'أسابيع' : 'w'}
                      </span>
                      {pkg.badge && (
                        <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/20">
                          {pkg.badge}
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-black text-slate-900 dark:text-white leading-tight">
                      {pkg.name}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {pkg.tagline}
                    </p>

                    {/* Pricing Display / Form */}
                    {isEditing ? (
                      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-white/10 space-y-3 text-xs">
                        <div className="grid grid-cols-2 gap-2.5">
                          <div>
                            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                              {isArabic ? 'السعر الحالي (ر.س):' : 'Current Price (SAR):'}
                            </label>
                            <input
                              type="number"
                              value={packageFormData.price ?? ''}
                              onChange={(e) => setPackageFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
                              className="w-full p-2 rounded-xl border border-teal-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-black outline-none"
                            />
                          </div>

                          <div>
                            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                              {isArabic ? 'قبل الخصم (ر.س):' : 'Original Price:'}
                            </label>
                            <input
                              type="number"
                              value={packageFormData.originalPrice ?? ''}
                              onChange={(e) => setPackageFormData(prev => ({ ...prev, originalPrice: Number(e.target.value) }))}
                              className="w-full p-2 rounded-xl border border-slate-300 dark:border-white/10 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold outline-none"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2.5">
                          <div>
                            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                              {isArabic ? 'عدد الجلسات:' : 'Sessions Count:'}
                            </label>
                            <input
                              type="number"
                              value={packageFormData.sessionsCount ?? ''}
                              onChange={(e) => setPackageFormData(prev => ({ ...prev, sessionsCount: Number(e.target.value) }))}
                              className="w-full p-2 rounded-xl border border-slate-300 dark:border-white/10 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none"
                            />
                          </div>

                          <div>
                            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                              {isArabic ? 'شارة العرض (Badge):' : 'Badge:'}
                            </label>
                            <input
                              type="text"
                              value={packageFormData.badge ?? ''}
                              onChange={(e) => setPackageFormData(prev => ({ ...prev, badge: e.target.value }))}
                              placeholder={isArabic ? 'مثال: باقات الصيف' : 'e.g. Summer'}
                              className="w-full p-2 rounded-xl border border-slate-300 dark:border-white/10 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                            {isArabic ? 'نص التقسيط:' : 'Installment Note:'}
                          </label>
                          <input
                            type="text"
                            value={packageFormData.installmentText ?? ''}
                            onChange={(e) => setPackageFormData(prev => ({ ...prev, installmentText: e.target.value }))}
                            placeholder={isArabic ? 'مثال: متاح التقسيط عبر تمارا' : 'e.g. Installments via Tamara'}
                            className="w-full p-2 rounded-xl border border-slate-300 dark:border-white/10 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none"
                          />
                        </div>

                        <div className="flex items-center gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => handleSavePackagePricing(pkg.id)}
                            className="flex-1 py-2 rounded-xl bg-[#0B3B36] hover:bg-[#082925] text-white font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-sm transition-all"
                          >
                            <Save className="w-3.5 h-3.5" />
                            <span>{isArabic ? 'حفظ السعر' : 'Save'}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingPackageId(null)}
                            className="px-3 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs cursor-pointer"
                          >
                            {isArabic ? 'إلغاء' : 'Cancel'}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="p-3.5 rounded-2xl bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-teal-950/30 dark:to-emerald-950/20 border border-teal-200/80 dark:border-teal-800/40 space-y-2">
                        <div className="flex items-baseline justify-between">
                          <div>
                            <span className="text-[10px] text-slate-600 dark:text-slate-400 font-bold block">{isArabic ? 'السعر الحالي المعتمد' : 'Current Price'}</span>
                            <div className="flex items-baseline gap-1.5">
                              <span className="text-2xl font-black text-[#0B3B36] dark:text-[#00E5BE]">
                                {pkg.price}
                              </span>
                              <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
                                {currencySymbol}
                              </span>
                            </div>
                          </div>

                          {originalPrice > pkg.price && (
                            <div className="text-left">
                              <span className="text-[10px] text-slate-600 dark:text-slate-400 line-through block">
                                {originalPrice} {currencySymbol}
                              </span>
                              <span className="text-xs font-black text-emerald-700 dark:text-emerald-400">
                                {isArabic ? `توفير ${savings} ${currencySymbol} (${savingsPercent}%)` : `Save ${savingsPercent}%`}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Calculated Unit Price */}
                        <div className="pt-2 border-t border-teal-200/50 dark:border-teal-800/30 flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400">
                          <span>{isArabic ? 'تكلفة الجلسة الواحدة:' : 'Per Session:'}</span>
                          <span className="font-black text-teal-800 dark:text-teal-300">
                            {pricePerSession} {currencySymbol}
                          </span>
                        </div>
                      </div>
                    )}

                  </div>

                  {/* Footer actions */}
                  {!isEditing && (
                    <div className="pt-4 mt-4 border-t border-slate-100 dark:border-white/10 flex items-center justify-between">
                      <span className="text-[11px] text-slate-600 dark:text-slate-400">
                        {pkg.installmentText || (isArabic ? 'متاح التقسيط الميسر' : 'Installments available')}
                      </span>
                      <button
                        onClick={() => handleStartEditPackage(pkg)}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-[#0B3B36] hover:text-white text-slate-700 dark:text-slate-200 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>{isArabic ? 'تخصيص السعر' : 'Edit Price'}</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* 2. CLINICAL SERVICES & INDIVIDUAL SESSIONS SECTION                 */}
      {/* ------------------------------------------------------------------ */}
      {activeSection === 'services' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-800/30 text-xs text-amber-900 dark:text-amber-200 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{isArabic ? 'تحديد أسعار الجلسات الفردية لكل برنامج تأهيلي وتكلفة جلسة التقييم والتشخيص الأولي.' : 'Configure single session and initial assessment prices for clinical programs.'}</span>
            </div>
            <span className="font-bold text-[11px] bg-white dark:bg-slate-900 px-2.5 py-1 rounded-lg border border-amber-200 dark:border-amber-800">
              {filteredServices.length} {isArabic ? 'برنامج علاجي' : 'Programs'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredServices.map((srv) => {
              const isEditing = editingServiceId === srv.id;
              const sessionPrice = srv.sessionPrice || 280;
              const assessmentPrice = srv.assessmentPrice || 450;

              return (
                <div
                  key={srv.id}
                  className={`bg-white dark:bg-slate-900 rounded-3xl p-5 border transition-all shadow-sm flex flex-col justify-between ${
                    isEditing 
                      ? 'border-amber-500 ring-2 ring-amber-500/20' 
                      : 'border-slate-200 dark:border-white/10 hover:border-amber-500/40'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
                        {srv.categoryAr}
                      </span>
                      <span className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{srv.durationMinutes} {isArabic ? 'دقيقة' : 'min'}</span>
                      </span>
                    </div>

                    <h3 className="text-base font-black text-slate-900 dark:text-white">
                      {srv.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {srv.description}
                    </p>

                    {isEditing ? (
                      <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-white/10 space-y-3 text-xs">
                        <div className="grid grid-cols-2 gap-2.5">
                          <div>
                            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                              {isArabic ? 'سعر الجلسة الفردية:' : 'Session Price:'}
                            </label>
                            <input
                              type="number"
                              value={serviceFormData.sessionPrice ?? ''}
                              onChange={(e) => setServiceFormData(prev => ({ ...prev, sessionPrice: Number(e.target.value) }))}
                              className="w-full p-2 rounded-xl border border-amber-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold outline-none"
                            />
                          </div>

                          <div>
                            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                              {isArabic ? 'جلسة التقييم الأولي:' : 'Assessment Price:'}
                            </label>
                            <input
                              type="number"
                              value={serviceFormData.assessmentPrice ?? ''}
                              onChange={(e) => setServiceFormData(prev => ({ ...prev, assessmentPrice: Number(e.target.value) }))}
                              className="w-full p-2 rounded-xl border border-slate-300 dark:border-white/10 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold outline-none"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                            {isArabic ? 'نص مخصص للسعر (اختياري):' : 'Custom Display Text:'}
                          </label>
                          <input
                            type="text"
                            value={serviceFormData.priceDisplayAr ?? ''}
                            onChange={(e) => setServiceFormData(prev => ({ ...prev, priceDisplayAr: e.target.value }))}
                            placeholder={isArabic ? 'مثال: يبدأ من 280 ر.س' : 'e.g. Starts from 280 SAR'}
                            className="w-full p-2 rounded-xl border border-slate-300 dark:border-white/10 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none"
                          />
                        </div>

                        <div className="flex items-center gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => handleSaveServicePricing(srv.id)}
                            className="flex-1 py-2 rounded-xl bg-[#0B3B36] hover:bg-[#082925] text-white font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <Save className="w-3.5 h-3.5" />
                            <span>{isArabic ? 'حفظ السعر' : 'Save'}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingServiceId(null)}
                            className="px-3 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs cursor-pointer"
                          >
                            {isArabic ? 'إلغاء' : 'Cancel'}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-white/5 space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-600 dark:text-slate-400 font-bold">{isArabic ? 'سعر الجلسة العلاجية:' : 'Session Fee:'}</span>
                          <span className="font-black text-base text-[#0B3B36] dark:text-[#00E5BE]">
                            {sessionPrice} {currencySymbol}
                          </span>
                        </div>
                        <div className="flex items-center justify-between pt-1.5 border-t border-slate-200/50 dark:border-white/5">
                          <span className="text-slate-600 dark:text-slate-400 font-bold">{isArabic ? 'التقييم والتشخيص الأولي:' : 'Initial Evaluation:'}</span>
                          <span className="font-bold text-slate-800 dark:text-slate-200">
                            {assessmentPrice} {currencySymbol}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {!isEditing && (
                    <div className="pt-4 mt-4 border-t border-slate-100 dark:border-white/10 flex justify-end">
                      <button
                        onClick={() => handleStartEditService(srv)}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-amber-700 hover:text-white text-slate-700 dark:text-slate-200 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>{isArabic ? 'تعديل السعر' : 'Edit Fee'}</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* 3. COURSES & WORKSHOPS SECTION                                     */}
      {/* ------------------------------------------------------------------ */}
      {activeSection === 'courses' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-800/30 text-xs text-emerald-900 dark:text-emerald-200 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{isArabic ? 'تحديد أسعار الكورسات والدورات التدريبية المعتمدة مع السعر قبل الخصم ونصوص التقسيط.' : 'Manage course enrollment fees, original prices, and installment displays.'}</span>
            </div>
            <span className="font-bold text-[11px] bg-white dark:bg-slate-900 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800">
              {filteredCourses.length} {isArabic ? 'دورة تدريبية' : 'Courses'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredCourses.map((course) => {
              const isEditing = editingCourseId === course.id;
              const curPrice = course.currentPrice || 650;
              const origPrice = course.originalPrice || 900;

              return (
                <div
                  key={course.id}
                  className={`bg-white dark:bg-slate-900 rounded-3xl p-5 border transition-all shadow-sm flex flex-col justify-between ${
                    isEditing 
                      ? 'border-emerald-500 ring-2 ring-emerald-500/20' 
                      : 'border-slate-200 dark:border-white/10 hover:border-emerald-500/40'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-teal-500/10 text-teal-700 dark:text-teal-300">
                        {course.hoursBadgeAr || `${course.hoursCount} ساعة`}
                      </span>
                      {course.ribbonTagAr && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {course.ribbonTagAr}
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-black text-slate-900 dark:text-white leading-tight">
                      {course.titleAr}
                    </h3>

                    {isEditing ? (
                      <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-white/10 space-y-3 text-xs">
                        <div className="grid grid-cols-2 gap-2.5">
                          <div>
                            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                              {isArabic ? 'السعر الحالي (ر.س):' : 'Current Price:'}
                            </label>
                            <input
                              type="number"
                              value={courseFormData.currentPrice ?? ''}
                              onChange={(e) => setCourseFormData(prev => ({ ...prev, currentPrice: Number(e.target.value) }))}
                              className="w-full p-2 rounded-xl border border-emerald-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold outline-none"
                            />
                          </div>

                          <div>
                            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                              {isArabic ? 'قبل الخصم (ر.س):' : 'Original Price:'}
                            </label>
                            <input
                              type="number"
                              value={courseFormData.originalPrice ?? ''}
                              onChange={(e) => setCourseFormData(prev => ({ ...prev, originalPrice: Number(e.target.value) }))}
                              className="w-full p-2 rounded-xl border border-slate-300 dark:border-white/10 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold outline-none"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                            {isArabic ? 'نص عرض السعر:' : 'Display Text:'}
                          </label>
                          <input
                            type="text"
                            value={courseFormData.priceDisplayAr ?? ''}
                            onChange={(e) => setCourseFormData(prev => ({ ...prev, priceDisplayAr: e.target.value }))}
                            className="w-full p-2 rounded-xl border border-slate-300 dark:border-white/10 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none"
                          />
                        </div>

                        <div className="flex items-center gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => handleSaveCoursePricing(course.id)}
                            className="flex-1 py-2 rounded-xl bg-[#0B3B36] hover:bg-[#082925] text-white font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <Save className="w-3.5 h-3.5" />
                            <span>{isArabic ? 'حفظ السعر' : 'Save'}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingCourseId(null)}
                            className="px-3 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs cursor-pointer"
                          >
                            {isArabic ? 'إلغاء' : 'Cancel'}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="p-3 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/30 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-slate-600 dark:text-slate-400 block">{isArabic ? 'سعر التسجيل' : 'Fee'}</span>
                          <span className="text-xl font-black text-[#0B3B36] dark:text-[#00E5BE]">
                            {curPrice} {currencySymbol}
                          </span>
                        </div>
                        {origPrice > curPrice && (
                          <div className="text-left">
                            <span className="text-xs text-slate-600 dark:text-slate-400 line-through block">{origPrice} {currencySymbol}</span>
                            <span className="text-[11px] font-black text-emerald-700 dark:text-emerald-400">{isArabic ? 'خصم متاح' : 'Discount'}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {!isEditing && (
                    <div className="pt-4 mt-4 border-t border-slate-100 dark:border-white/10 flex justify-end">
                      <button
                        onClick={() => handleStartEditCourse(course)}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-700 hover:text-white text-slate-700 dark:text-slate-200 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>{isArabic ? 'تعديل السعر' : 'Edit Fee'}</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* 4. SPECIALISTS SESSION FEES SECTION                                */}
      {/* ------------------------------------------------------------------ */}
      {activeSection === 'specialists' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-sky-50 dark:bg-sky-950/20 border border-sky-200/80 dark:border-sky-800/30 text-xs text-sky-900 dark:text-sky-200 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-sky-600 shrink-0" />
              <span>{isArabic ? 'تخصيص تسعيرة الجلسة الاستشارية والتأهيلية لكل أخصائي والموضحة في بطاقة الأخصائي ونموذج الحجز.' : 'Configure consultation session rates per specialist.'}</span>
            </div>
            <span className="font-bold text-[11px] bg-white dark:bg-slate-900 px-2.5 py-1 rounded-lg border border-sky-200 dark:border-sky-800">
              {filteredSpecialists.length} {isArabic ? 'أخصائي' : 'Specialists'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredSpecialists.map((spec) => {
              const isEditing = editingSpecialistId === spec.id;
              const currentPrice = spec.sessionPrice || 350;

              return (
                <div
                  key={spec.id}
                  className={`bg-white dark:bg-slate-900 rounded-3xl p-5 border transition-all shadow-sm flex flex-col justify-between ${
                    isEditing 
                      ? 'border-sky-500 ring-2 ring-sky-500/20' 
                      : 'border-slate-200 dark:border-white/10 hover:border-sky-500/40'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 overflow-hidden border border-slate-200 dark:border-white/10 shrink-0">
                        <img 
                          src={getResolvedImageUrl(spec.avatar)} 
                          alt={spec.name} 
                          className="w-full h-full object-cover" 
                          onError={(e) => handleImageErrorWithStore(e, spec.avatar, '/images/specialists/specialist_1.jpg')}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-sm font-black text-slate-900 dark:text-white truncate">
                          {spec.name}
                        </h4>
                        <p className="text-xs text-slate-600 dark:text-slate-400 truncate">
                          {spec.title}
                        </p>
                      </div>
                    </div>

                    {isEditing ? (
                      <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-white/10 space-y-2.5 text-xs">
                        <div>
                          <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                            {isArabic ? 'سعر الجلسة مع هذا الأخصائي (ر.س):' : 'Session Price (SAR):'}
                          </label>
                          <input
                            type="number"
                            value={specialistPriceInput}
                            onChange={(e) => setSpecialistPriceInput(Number(e.target.value))}
                            className="w-full p-2 rounded-xl border border-sky-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-black outline-none"
                          />
                        </div>

                        <div className="flex items-center gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => handleSaveSpecialistPricing(spec.id)}
                            className="flex-1 py-2 rounded-xl bg-[#0B3B36] hover:bg-[#082925] text-white font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <Save className="w-3.5 h-3.5" />
                            <span>{isArabic ? 'حفظ السعر' : 'Save'}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingSpecialistId(null)}
                            className="px-3 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs cursor-pointer"
                          >
                            {isArabic ? 'إلغاء' : 'Cancel'}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="p-3 rounded-2xl bg-sky-50/60 dark:bg-sky-950/20 border border-sky-200 dark:border-sky-800/30 flex items-center justify-between text-xs">
                        <span className="text-slate-600 dark:text-slate-400 font-bold">{isArabic ? 'سعر الجلسة:' : 'Session Rate:'}</span>
                        <span className="text-base font-black text-[#0B3B36] dark:text-[#00E5BE]">
                          {currentPrice} {currencySymbol}
                        </span>
                      </div>
                    )}
                  </div>

                  {!isEditing && (
                    <div className="pt-3 mt-3 border-t border-slate-100 dark:border-white/10 flex justify-end">
                      <button
                        onClick={() => handleStartEditSpecialist(spec)}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-sky-700 hover:text-white text-slate-700 dark:text-slate-200 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>{isArabic ? 'تعديل السعر' : 'Edit Rate'}</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* 5. GLOBAL SETTINGS & INSTALLMENTS SECTION                          */}
      {/* ------------------------------------------------------------------ */}
      {activeSection === 'global' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-white/10 shadow-sm space-y-6">
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
              {isArabic ? 'إعدادات العملة وضريبة القيمة المضافة ونظام التقسيط' : 'Currency, Tax & Installment Settings'}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              {isArabic ? 'تخصيص الرمز المعتمد لعرض الأسعار وسياسة ضريبة القيمة المضافة وخيارات تمارا وتابي' : 'Configure currency display, VAT disclaimer, and installment options.'}
            </p>
          </div>

          <form onSubmit={handleSaveGlobalSettings} className="space-y-5 text-xs max-w-2xl">
            
            {/* Currency Choice */}
            <div>
              <label className="font-bold text-slate-800 dark:text-slate-200 block mb-2">
                {isArabic ? 'رمز العملة الرئيسي المعروض بالموقع:' : 'Primary Currency Symbol:'}
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setCurrencySymbol('ر.س')}
                  className={`p-3 rounded-2xl border text-center font-black cursor-pointer transition-all ${
                    currencySymbol === 'ر.س'
                      ? 'bg-[#0B3B36] text-white border-[#0B3B36] shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/10'
                  }`}
                >
                  <span className="text-base block">ر.س</span>
                  <span className={`text-[10px] font-normal mt-0.5 block ${currencySymbol === 'ر.س' ? 'text-slate-200' : 'text-slate-600 dark:text-slate-400'}`}>ريال سعودي (باللغة العربية)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCurrencySymbol('SAR')}
                  className={`p-3 rounded-2xl border text-center font-black cursor-pointer transition-all ${
                    currencySymbol === 'SAR'
                      ? 'bg-[#0B3B36] text-white border-[#0B3B36] shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/10'
                  }`}
                >
                  <span className="text-base block">SAR</span>
                  <span className={`text-[10px] font-normal mt-0.5 block ${currencySymbol === 'SAR' ? 'text-slate-200' : 'text-slate-600 dark:text-slate-400'}`}>Saudi Riyal (International)</span>
                </button>
              </div>
            </div>

            {/* VAT Inclusive Checkbox */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-white/10 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200 block">
                  {isArabic ? 'الأسعار شاملة ضريبة القيمة المضافة (15%):' : 'VAT Inclusive (15%):'}
                </span>
                <span className="text-[11px] text-slate-600 dark:text-slate-400">
                  {isArabic ? 'إظهار عبارة (شامل الضريبة) أسفل كروت الباقات والخدمات' : 'Display VAT inclusive note on price cards'}
                </span>
              </div>
              <input
                type="checkbox"
                checked={isVatInclusive}
                onChange={(e) => setIsVatInclusive(e.target.checked)}
                className="w-5 h-5 accent-[#0B3B36] rounded cursor-pointer"
              />
            </div>

            {/* Installment Note Input */}
            <div>
              <label className="font-bold text-slate-800 dark:text-slate-200 block mb-1">
                {isArabic ? 'رسالة التقسيط الموحدة على كروت الباقات:' : 'Unified Installment Note:'}
              </label>
              <input
                type="text"
                value={installmentNote}
                onChange={(e) => setInstallmentNote(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-white/15 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold outline-none"
              />
            </div>

            {/* Supported Payment Logos Preview */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-white/10 space-y-2">
              <span className="font-bold text-slate-700 dark:text-slate-300 block">
                {isArabic ? 'شركاء التقسيط والدفع المعتمدون بالواجهة:' : 'Supported Installment Providers:'}
              </span>
              <div className="flex items-center gap-3 pt-1">
                <TamaraLogo className="h-6 w-auto" />
                <EmkanLogo className="h-6 w-auto" />
                <span className="text-[11px] text-slate-600 dark:text-slate-400 font-bold">
                  {isArabic ? 'تمارا · تابي · إمكان · مدى' : 'Tamara · Tabby · Emkan · Mada'}
                </span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#0B3B36] hover:bg-[#082925] text-white font-black rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-md transition-all active:scale-95"
              >
                <Save className="w-4 h-4" />
                <span>{isArabic ? 'حفظ الإعدادات العامة للأسعار' : 'Save Global Settings'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* BULK DISCOUNT MODAL                                                */}
      {/* ------------------------------------------------------------------ */}
      {isBulkDiscountModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 dark:border-white/10 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-[#00E5BE]">
                <Percent className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  {isArabic ? 'تطبيق خصم جماعي على الباقات' : 'Apply Bulk Discount'}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {isArabic ? 'تطبيق نسبة خصم فورية على جميع باقات التأهيل' : 'Apply percentage discount across all packages'}
                </p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  {isArabic ? 'نسبة الخصم المئوية (%):' : 'Discount Percentage (%):'}
                </label>
                <div className="flex items-center gap-2">
                  {[10, 15, 20, 25, 30].map(pct => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => setBulkDiscountPercentage(pct)}
                      className={`flex-1 py-2 rounded-xl font-bold text-xs cursor-pointer border transition-all ${
                        bulkDiscountPercentage === pct
                          ? 'bg-[#0B3B36] text-white border-[#0B3B36]'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-transparent'
                      }`}
                    >
                      {pct}%
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  {isArabic ? 'أو أدخل نسبة مخصصة:' : 'Or custom percentage:'}
                </label>
                <input
                  type="number"
                  min="1"
                  max="90"
                  value={bulkDiscountPercentage}
                  onChange={(e) => setBulkDiscountPercentage(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-white/15 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-black text-sm outline-none"
                />
              </div>

              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-200 border border-amber-200 dark:border-amber-800/30 text-[11px] leading-relaxed">
                {isArabic 
                  ? 'سيتم حساب السعر المخفض تلقائياً وتقريبه لأقرب 10 ر.س مع الاحتفاظ بالسعر الأصلي لحساب نسبة التوفير.'
                  : 'Discounted prices will be calculated automatically retaining the original price.'}
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2 text-xs">
              <button
                type="button"
                onClick={() => setIsBulkDiscountModalOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold cursor-pointer"
              >
                {isArabic ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleApplyBulkDiscountToPackages}
                className="px-5 py-2.5 rounded-xl bg-[#0B3B36] hover:bg-[#082925] text-white font-black cursor-pointer shadow-md"
              >
                {isArabic ? 'تطبيق الخصم الآن' : 'Apply Discount'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* RESET PACKAGES CONFIRMATION MODAL                                  */}
      {/* ------------------------------------------------------------------ */}
      {isResetConfirmOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setIsResetConfirmOpen(false)}
        >
          <div
            className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-sm w-full border border-slate-200 dark:border-white/15 shadow-2xl text-center space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto border border-amber-500/20">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="space-y-1.5">
              <h4 className="text-base font-black text-slate-900 dark:text-white">
                {isArabic ? 'استعادة أسعار الباقات الافتراضية' : 'Reset Package Prices'}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {isArabic
                  ? 'هل تريد استعادة أسعار الباقات الافتراضية المعتمدة ومزامنتها مع قاعدة البيانات؟'
                  : 'Reset all therapy packages to default prices and sync to Firestore?'}
              </p>
            </div>
            <div className="flex items-center gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setIsResetConfirmOpen(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                {isArabic ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleConfirmResetPackages}
                className="flex-1 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-black shadow-md cursor-pointer"
              >
                {isArabic ? 'تأكيد الاستعادة' : 'Confirm Reset'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default PricingManagementTab;
