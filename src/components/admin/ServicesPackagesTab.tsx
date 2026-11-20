import React, { useState } from 'react';
import {
  Plus,
  Edit3,
  Trash2,
  Clock,
  Eye,
  EyeOff,
  X,
  AlertTriangle
} from 'lucide-react';
import { ServiceItem, TherapyPackage, PermissionId } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface ServicesPackagesTabProps {
  services: ServiceItem[];
  packages: TherapyPackage[];
  onUpdateServices: (updated: ServiceItem[]) => void;
  onUpdatePackages: (updated: TherapyPackage[]) => void;
  hasPermission: (perm: PermissionId) => boolean;
  isSystemAdmin?: boolean;
}

export const ServicesPackagesTab: React.FC<ServicesPackagesTabProps> = ({
  services,
  packages,
  onUpdateServices,
  onUpdatePackages,
  hasPermission,
  isSystemAdmin = false
}) => {
  const { isArabic } = useLanguage();

  const [activeSubTab, setActiveSubTab] = useState<'services' | 'packages'>('services');
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [isAddingService, setIsAddingService] = useState(false);
  const [editingPackage, setEditingPackage] = useState<TherapyPackage | null>(null);
  const [isAddingPackage, setIsAddingPackage] = useState(false);
  const [confirmDeleteItem, setConfirmDeleteItem] = useState<{ type: 'service' | 'package'; id: string; name: string } | null>(null);

  const canManageServices = hasPermission('manage_services');
  const canManagePackages = hasPermission('manage_packages');

  // Form states for Service Add/Edit
  const [srvTitle, setSrvTitle] = useState('');
  const [srvTitleEn, setSrvTitleEn] = useState('');
  const [srvCategoryKey, setSrvCategoryKey] = useState<ServiceItem['category']>('aba');
  const [srvCategory, setSrvCategory] = useState('');
  const [srvDesc, setSrvDesc] = useState('');
  const [srvDuration, setSrvDuration] = useState(45);
  const [srvTargetAges, setSrvTargetAges] = useState('');
  const [srvActive, setSrvActive] = useState(true);

  // Form states for Package Add/Edit
  const [pkgName, setPkgName] = useState('');
  const [pkgNameEn, setPkgNameEn] = useState('');
  const [pkgCategory, setPkgCategory] = useState<TherapyPackage['category']>('aba');
  const [pkgPrice, setPkgPrice] = useState(1200);
  const [pkgOriginalPrice, setPkgOriginalPrice] = useState(1600);
  const [pkgSessions, setPkgSessions] = useState(12);
  const [pkgWeeks, setPkgWeeks] = useState(4);
  const [pkgTagline, setPkgTagline] = useState('');
  const [pkgActive, setPkgActive] = useState(true);

  const handleOpenAddService = () => {
    setIsAddingService(true);
    setEditingService(null);
    setSrvTitle('');
    setSrvTitleEn('');
    setSrvCategoryKey('aba');
    setSrvCategory(isArabic ? 'تحليل السلوك التطبيقي' : 'ABA Therapy');
    setSrvDesc('');
    setSrvDuration(45);
    setSrvTargetAges(isArabic ? '2 - 14 سنة' : '2 - 14 Years');
    setSrvActive(true);
  };

  const handleOpenEditService = (srv: ServiceItem) => {
    setIsAddingService(false);
    setEditingService(srv);
    setSrvTitle(srv.title);
    setSrvTitleEn(srv.titleEn || '');
    setSrvCategoryKey(srv.category || 'aba');
    setSrvCategory(srv.categoryAr);
    setSrvDesc(srv.description);
    setSrvDuration(srv.durationMinutes);
    setSrvTargetAges(srv.targetAges);
    setSrvActive(srv.active !== false && srv.isActive !== false);
  };

  const handleSaveService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!srvTitle.trim()) return;

    if (isAddingService) {
      const newService: ServiceItem = {
        id: `srv-${Date.now()}`,
        title: srvTitle.trim(),
        titleEn: srvTitleEn.trim() || srvTitle.trim(),
        category: srvCategoryKey,
        categoryAr: srvCategory.trim() || 'برنامج تأهيلي',
        categoryEn: srvCategoryKey.toUpperCase(),
        iconName: 'Sparkles',
        description: srvDesc.trim() || srvTitle.trim(),
        descriptionEn: srvDesc.trim() || srvTitleEn.trim() || srvTitle.trim(),
        benefits: [],
        benefitsEn: [],
        durationMinutes: Math.max(15, Number(srvDuration) || 45),
        targetAges: srvTargetAges.trim() || '2 - 14 سنة',
        image: '/images/hero/card_1_aba.webp',
        active: srvActive,
        isActive: srvActive,
        order: services.length + 1
      };
      onUpdateServices([...services, newService]);
      setIsAddingService(false);
      return;
    }

    if (!editingService) return;
    const updated = services.map((s) =>
      s.id === editingService.id
        ? {
            ...s,
            title: srvTitle.trim(),
            titleEn: srvTitleEn.trim() || s.titleEn || srvTitle.trim(),
            category: srvCategoryKey,
            categoryAr: srvCategory.trim(),
            description: srvDesc,
            durationMinutes: Number(srvDuration) || 45,
            targetAges: srvTargetAges,
            active: srvActive,
            isActive: srvActive
          }
        : s
    );
    onUpdateServices(updated);
    setEditingService(null);
  };

  const handleToggleServiceActive = (srvId: string) => {
    const updated = services.map((s) => {
      if (s.id !== srvId) return s;
      const next = !(s.active !== false && s.isActive !== false);
      return { ...s, active: next, isActive: next };
    });
    onUpdateServices(updated);
  };

  const handleOpenAddPackage = () => {
    setIsAddingPackage(true);
    setEditingPackage(null);
    setPkgName('');
    setPkgNameEn('');
    setPkgCategory('aba');
    setPkgPrice(1200);
    setPkgOriginalPrice(1600);
    setPkgSessions(12);
    setPkgWeeks(4);
    setPkgTagline('');
    setPkgActive(true);
  };

  const handleOpenEditPackage = (pkg: TherapyPackage) => {
    setIsAddingPackage(false);
    setEditingPackage(pkg);
    setPkgName(pkg.name);
    setPkgNameEn(pkg.nameEn || '');
    setPkgCategory(pkg.category || 'aba');
    setPkgPrice(pkg.price);
    setPkgOriginalPrice(pkg.originalPrice || pkg.price + 400);
    setPkgSessions(pkg.sessionsCount);
    setPkgWeeks(pkg.durationWeeks);
    setPkgTagline(pkg.tagline);
    setPkgActive(pkg.active !== false && pkg.isActive !== false);
  };

  const handleSavePackage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pkgName.trim()) return;

    if (isAddingPackage) {
      const newPackage: TherapyPackage = {
        id: `pkg-${Date.now()}`,
        name: pkgName.trim(),
        nameEn: pkgNameEn.trim() || pkgName.trim(),
        tagline: pkgTagline.trim() || pkgName.trim(),
        taglineEn: pkgTagline.trim() || pkgNameEn.trim() || pkgName.trim(),
        category: pkgCategory,
        sessionsCount: Math.max(1, Number(pkgSessions) || 12),
        durationWeeks: Math.max(1, Number(pkgWeeks) || 4),
        price: Math.max(0, Number(pkgPrice) || 0),
        originalPrice: Math.max(0, Number(pkgOriginalPrice) || Number(pkgPrice) || 0),
        features: [],
        featuresEn: [],
        recommendedFor: 'الأطفال والمستفيدون حسب التقييم الإكلينيكي',
        recommendedForEn: 'Recommended based on clinical evaluation',
        colorTheme: 'blue',
        active: pkgActive,
        isActive: pkgActive,
        order: packages.length + 1
      };
      onUpdatePackages([...packages, newPackage]);
      setIsAddingPackage(false);
      return;
    }

    if (!editingPackage) return;
    const updated = packages.map((p) =>
      p.id === editingPackage.id
        ? {
            ...p,
            name: pkgName.trim(),
            nameEn: pkgNameEn.trim() || p.nameEn || pkgName.trim(),
            category: pkgCategory,
            price: Number(pkgPrice),
            originalPrice: Number(pkgOriginalPrice),
            sessionsCount: Number(pkgSessions),
            durationWeeks: Number(pkgWeeks),
            tagline: pkgTagline,
            active: pkgActive,
            isActive: pkgActive
          }
        : p
    );
    onUpdatePackages(updated);
    setEditingPackage(null);
  };

  const handleTogglePackageActive = (pkgId: string) => {
    const updated = packages.map((p) => {
      if (p.id !== pkgId) return p;
      const next = !(p.active !== false && p.isActive !== false);
      return { ...p, active: next, isActive: next };
    });
    onUpdatePackages(updated);
  };

  const executeConfirmedDelete = () => {
    if (!confirmDeleteItem || !isSystemAdmin) {
      setConfirmDeleteItem(null);
      return;
    }
    if (confirmDeleteItem.type === 'service') {
      onUpdateServices(services.filter((s) => s.id !== confirmDeleteItem.id));
    } else {
      onUpdatePackages(packages.filter((p) => p.id !== confirmDeleteItem.id));
    }
    setConfirmDeleteItem(null);
  };

  return (
    <div className="space-y-6">
      {/* Sub-tabs header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-white/10 pb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubTab('services')}
            className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'services'
                ? 'bg-[#0B3B36] text-white shadow-md'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10'
            }`}
          >
            {isArabic ? `البرامج العلاجية والخدمات (${services.length})` : `Clinical Services (${services.length})`}
          </button>
          <button
            onClick={() => setActiveSubTab('packages')}
            className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'packages'
                ? 'bg-[#0B3B36] text-white shadow-md'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10'
            }`}
          >
            {isArabic ? `باقات التأهيل المكثفة (${packages.length})` : `Therapy Packages (${packages.length})`}
          </button>
        </div>

        <div>
          {activeSubTab === 'services' && canManageServices && (
            <button
              onClick={handleOpenAddService}
              className="px-4 py-2.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{isArabic ? 'إضافة برنامج / خدمة جديدة' : 'Add Service'}</span>
            </button>
          )}
          {activeSubTab === 'packages' && canManagePackages && (
            <button
              onClick={handleOpenAddPackage}
              className="px-4 py-2.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{isArabic ? 'إضافة باقة جديدة' : 'Add Package'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Services List */}
      {activeSubTab === 'services' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((srv) => {
            const isActive = srv.active !== false && srv.isActive !== false;
            return (
              <div
                key={srv.id}
                className={`bg-white dark:bg-slate-900 rounded-3xl p-6 border shadow-xs flex flex-col justify-between transition-all ${
                  isActive
                    ? 'border-slate-200 dark:border-white/10'
                    : 'border-rose-300/60 dark:border-rose-500/30 opacity-75'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
                      {srv.categoryAr}
                    </span>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                          isActive
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300'
                            : 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300'
                        }`}
                      >
                        {isActive ? (isArabic ? 'نشط' : 'Active') : (isArabic ? 'مخفي' : 'Inactive')}
                      </span>
                      <span className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{srv.durationMinutes} {isArabic ? 'دقيقة' : 'min'}</span>
                      </span>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                    {srv.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed mb-4">
                    {srv.description}
                  </p>

                  <div className="text-[11px] text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl">
                    <span className="font-bold text-slate-700 dark:text-slate-300">{isArabic ? 'الفئة العمرية: ' : 'Target: '}</span>
                    {srv.targetAges}
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 dark:border-white/10 flex flex-wrap items-center justify-between gap-2">
                  {canManageServices && (
                    <button
                      onClick={() => handleToggleServiceActive(srv.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                        isActive
                          ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300 hover:bg-amber-100'
                          : 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100'
                      }`}
                    >
                      {isActive ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      <span>{isActive ? (isArabic ? 'إخفاء' : 'Hide') : (isArabic ? 'تنشيط' : 'Show')}</span>
                    </button>
                  )}

                  <div className="flex items-center gap-1.5">
                    {canManageServices && (
                      <button
                        onClick={() => handleOpenEditService(srv)}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-emerald-700 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>{isArabic ? 'تعديل' : 'Edit'}</span>
                      </button>
                    )}
                    {isSystemAdmin && canManageServices && (
                      <button
                        onClick={() => setConfirmDeleteItem({ type: 'service', id: srv.id, name: srv.title })}
                        className="p-1.5 rounded-xl bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-600 hover:text-white transition-all cursor-pointer"
                        title={isArabic ? 'حذف نهائي' : 'Delete'}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Packages List */}
      {activeSubTab === 'packages' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {packages.map((pkg) => {
            const isActive = pkg.active !== false && pkg.isActive !== false;
            return (
              <div
                key={pkg.id}
                className={`bg-white dark:bg-slate-900 rounded-3xl p-6 border shadow-xs flex flex-col justify-between transition-all ${
                  isActive
                    ? 'border-slate-200 dark:border-white/10'
                    : 'border-rose-300/60 dark:border-rose-500/30 opacity-75'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-teal-500/10 text-teal-700 dark:text-teal-300">
                      {pkg.sessionsCount} {isArabic ? 'جلسة تأهيلية' : 'Sessions'}
                    </span>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                          isActive
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300'
                            : 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300'
                        }`}
                      >
                        {isActive ? (isArabic ? 'نشط' : 'Active') : (isArabic ? 'مخفي' : 'Inactive')}
                      </span>
                      <span className="text-xs text-slate-600 dark:text-slate-400">
                        {pkg.durationWeeks} {isArabic ? 'أسابيع' : 'Weeks'}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                    {pkg.name}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mb-4">
                    {pkg.tagline}
                  </p>

                  <div className="p-3 bg-emerald-50/70 dark:bg-emerald-950/20 rounded-2xl border border-emerald-200 dark:border-emerald-800/30 flex items-center justify-between mb-3">
                    <div>
                      <div className="text-[10px] text-slate-600 dark:text-slate-400">{isArabic ? 'سعر الباقة بعد الخصم' : 'Package Price'}</div>
                      <div className="text-xl font-black text-[#0B3B36] dark:text-[#2DD4BF]">
                        {pkg.price} {isArabic ? 'ر.س' : 'SAR'}
                      </div>
                    </div>
                    {pkg.originalPrice && (
                      <div className="text-xs text-slate-600 dark:text-slate-400 line-through">
                        {pkg.originalPrice} {isArabic ? 'ر.س' : 'SAR'}
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-white/10 flex flex-wrap items-center justify-between gap-2">
                  {canManagePackages && (
                    <button
                      onClick={() => handleTogglePackageActive(pkg.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                        isActive
                          ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300 hover:bg-amber-100'
                          : 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100'
                      }`}
                    >
                      {isActive ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      <span>{isActive ? (isArabic ? 'إخفاء' : 'Hide') : (isArabic ? 'تنشيط' : 'Show')}</span>
                    </button>
                  )}

                  <div className="flex items-center gap-1.5">
                    {canManagePackages && (
                      <button
                        onClick={() => handleOpenEditPackage(pkg)}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-emerald-700 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>{isArabic ? 'تعديل' : 'Edit'}</span>
                      </button>
                    )}
                    {isSystemAdmin && canManagePackages && (
                      <button
                        onClick={() => setConfirmDeleteItem({ type: 'package', id: pkg.id, name: pkg.name })}
                        className="p-1.5 rounded-xl bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-600 hover:text-white transition-all cursor-pointer"
                        title={isArabic ? 'حذف نهائي' : 'Delete'}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ADD / EDIT SERVICE MODAL */}
      {(editingService || isAddingService) && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 space-y-4 border border-slate-200 dark:border-white/15" dir={isArabic ? 'rtl' : 'ltr'}>
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-white/10">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {isAddingService ? (isArabic ? 'إضافة برنامج / خدمة جديدة' : 'Add Service') : (isArabic ? 'تعديل تفاصيل البرنامج' : 'Edit Service')}
              </h3>
              <button
                onClick={() => {
                  setEditingService(null);
                  setIsAddingService(false);
                }}
                className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5 text-slate-500 dark:text-slate-300" />
              </button>
            </div>
            <form onSubmit={handleSaveService} className="space-y-3 text-xs">
              <div>
                <label className="font-bold block mb-1 text-slate-700 dark:text-slate-200">{isArabic ? 'اسم البرنامج (عربي) *:' : 'Title (AR) *:'}</label>
                <input required type="text" value={srvTitle} onChange={(e) => setSrvTitle(e.target.value)} className="w-full p-2.5 border border-slate-200 dark:border-white/15 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white" />
              </div>
              <div>
                <label className="font-bold block mb-1 text-slate-700 dark:text-slate-200">{isArabic ? 'اسم البرنامج (إنجليزي):' : 'Title (EN):'}</label>
                <input type="text" value={srvTitleEn} onChange={(e) => setSrvTitleEn(e.target.value)} className="w-full p-2.5 border border-slate-200 dark:border-white/15 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold block mb-1 text-slate-700 dark:text-slate-200">{isArabic ? 'التصنيف:' : 'Category Key:'}</label>
                  <select
                    value={srvCategoryKey}
                    onChange={(e) => setSrvCategoryKey(e.target.value as ServiceItem['category'])}
                    className="w-full p-2.5 border border-slate-200 dark:border-white/15 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="aba">ABA</option>
                    <option value="speech">{isArabic ? 'النطق والتخاطب' : 'Speech'}</option>
                    <option value="occupational">{isArabic ? 'العلاج الوظيفي' : 'Occupational'}</option>
                    <option value="sensory">{isArabic ? 'التكامل الحسي' : 'Sensory'}</option>
                    <option value="learning">{isArabic ? 'صعوبات التعلم' : 'Learning'}</option>
                    <option value="psychological">{isArabic ? 'نفسي' : 'Psychological'}</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold block mb-1 text-slate-700 dark:text-slate-200">{isArabic ? 'اسم القسم:' : 'Section Label:'}</label>
                  <input type="text" value={srvCategory} onChange={(e) => setSrvCategory(e.target.value)} className="w-full p-2.5 border border-slate-200 dark:border-white/15 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold block mb-1 text-slate-700 dark:text-slate-200">{isArabic ? 'مدة الجلسة (دقائق):' : 'Duration (min):'}</label>
                  <input type="number" value={srvDuration} onChange={(e) => setSrvDuration(Number(e.target.value))} className="w-full p-2.5 border border-slate-200 dark:border-white/15 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white" />
                </div>
                <div>
                  <label className="font-bold block mb-1 text-slate-700 dark:text-slate-200">{isArabic ? 'الفئات المستهدفة:' : 'Target Ages:'}</label>
                  <input type="text" value={srvTargetAges} onChange={(e) => setSrvTargetAges(e.target.value)} className="w-full p-2.5 border border-slate-200 dark:border-white/15 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white" />
                </div>
              </div>
              <div>
                <label className="font-bold block mb-1 text-slate-700 dark:text-slate-200">{isArabic ? 'الوصف التوضيحي:' : 'Description:'}</label>
                <textarea rows={3} value={srvDesc} onChange={(e) => setSrvDesc(e.target.value)} className="w-full p-2.5 border border-slate-200 dark:border-white/15 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white" />
              </div>
              <label className="flex items-center gap-2 font-bold text-slate-700 dark:text-slate-200 cursor-pointer pt-1">
                <input type="checkbox" checked={srvActive} onChange={(e) => setSrvActive(e.target.checked)} className="rounded accent-emerald-600" />
                <span>{isArabic ? 'إظهار الخدمة في الواجهة الأمامية (نشطة)' : 'Visible on public storefront (Active)'}</span>
              </label>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditingService(null);
                    setIsAddingService(false);
                  }}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  {isArabic ? 'إلغاء' : 'Cancel'}
                </button>
                <button type="submit" className="px-5 py-2 bg-[#0B3B36] hover:bg-[#0D4A43] text-white font-bold rounded-xl cursor-pointer">
                  {isArabic ? 'حفظ' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD / EDIT PACKAGE MODAL */}
      {(editingPackage || isAddingPackage) && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 space-y-4 border border-slate-200 dark:border-white/15" dir={isArabic ? 'rtl' : 'ltr'}>
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-white/10">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {isAddingPackage ? (isArabic ? 'إضافة باقة جديدة' : 'Add Package') : (isArabic ? 'تعديل الباقة والأسعار' : 'Edit Package')}
              </h3>
              <button
                onClick={() => {
                  setEditingPackage(null);
                  setIsAddingPackage(false);
                }}
                className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5 text-slate-500 dark:text-slate-300" />
              </button>
            </div>
            <form onSubmit={handleSavePackage} className="space-y-3 text-xs">
              <div>
                <label className="font-bold block mb-1 text-slate-700 dark:text-slate-200">{isArabic ? 'اسم الباقة (عربي) *:' : 'Package Name (AR) *:'}</label>
                <input required type="text" value={pkgName} onChange={(e) => setPkgName(e.target.value)} className="w-full p-2.5 border border-slate-200 dark:border-white/15 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold block mb-1 text-slate-700 dark:text-slate-200">{isArabic ? 'اسم الباقة (إنجليزي):' : 'Name (EN):'}</label>
                  <input type="text" value={pkgNameEn} onChange={(e) => setPkgNameEn(e.target.value)} className="w-full p-2.5 border border-slate-200 dark:border-white/15 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white" />
                </div>
                <div>
                  <label className="font-bold block mb-1 text-slate-700 dark:text-slate-200">{isArabic ? 'التصنيف:' : 'Category:'}</label>
                  <select
                    value={pkgCategory}
                    onChange={(e) => setPkgCategory(e.target.value as TherapyPackage['category'])}
                    className="w-full p-2.5 border border-slate-200 dark:border-white/15 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="aba">ABA</option>
                    <option value="speech">{isArabic ? 'النطق والتخاطب' : 'Speech'}</option>
                    <option value="sensory">{isArabic ? 'العلاج الحسي والوظيفي' : 'Sensory'}</option>
                    <option value="assessment">{isArabic ? 'التقييم والتشخيص' : 'Assessment'}</option>
                    <option value="summer">{isArabic ? 'باقات الصيف' : 'Summer'}</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold block mb-1 text-slate-700 dark:text-slate-200">{isArabic ? 'السعر المخفض (ر.س):' : 'Price (SAR):'}</label>
                  <input type="number" min={0} value={pkgPrice} onChange={(e) => setPkgPrice(Number(e.target.value))} className="w-full p-2.5 border border-slate-200 dark:border-white/15 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white" />
                </div>
                <div>
                  <label className="font-bold block mb-1 text-slate-700 dark:text-slate-200">{isArabic ? 'السعر الأصلي (ر.س):' : 'Original Price:'}</label>
                  <input type="number" min={0} value={pkgOriginalPrice} onChange={(e) => setPkgOriginalPrice(Number(e.target.value))} className="w-full p-2.5 border border-slate-200 dark:border-white/15 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold block mb-1 text-slate-700 dark:text-slate-200">{isArabic ? 'عدد الجلسات:' : 'Sessions Count:'}</label>
                  <input type="number" min={1} value={pkgSessions} onChange={(e) => setPkgSessions(Number(e.target.value))} className="w-full p-2.5 border border-slate-200 dark:border-white/15 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white" />
                </div>
                <div>
                  <label className="font-bold block mb-1 text-slate-700 dark:text-slate-200">{isArabic ? 'المدة (أسابيع):' : 'Weeks Duration:'}</label>
                  <input type="number" min={1} value={pkgWeeks} onChange={(e) => setPkgWeeks(Number(e.target.value))} className="w-full p-2.5 border border-slate-200 dark:border-white/15 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white" />
                </div>
              </div>
              <div>
                <label className="font-bold block mb-1 text-slate-700 dark:text-slate-200">{isArabic ? 'الوصف المختصر:' : 'Tagline:'}</label>
                <input type="text" value={pkgTagline} onChange={(e) => setPkgTagline(e.target.value)} className="w-full p-2.5 border border-slate-200 dark:border-white/15 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white" />
              </div>
              <label className="flex items-center gap-2 font-bold text-slate-700 dark:text-slate-200 cursor-pointer pt-1">
                <input type="checkbox" checked={pkgActive} onChange={(e) => setPkgActive(e.target.checked)} className="rounded accent-emerald-600" />
                <span>{isArabic ? 'إظهار الباقة في الواجهة الأمامية (نشطة)' : 'Visible on public storefront (Active)'}</span>
              </label>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditingPackage(null);
                    setIsAddingPackage(false);
                  }}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  {isArabic ? 'إلغاء' : 'Cancel'}
                </button>
                <button type="submit" className="px-5 py-2 bg-[#0B3B36] hover:bg-[#0D4A43] text-white font-bold rounded-xl cursor-pointer">
                  {isArabic ? 'حفظ التعديلات' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* INLINE DELETE CONFIRMATION MODAL */}
      {confirmDeleteItem && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-sm w-full p-6 space-y-4 border border-rose-200 dark:border-rose-500/30 shadow-2xl" dir={isArabic ? 'rtl' : 'ltr'}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 dark:bg-rose-500/20 text-rose-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-black text-slate-900 dark:text-white">
                  {isArabic ? 'تأكيد الحذف النهائي' : 'Confirm Deletion'}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {isArabic
                    ? `هل أنت متأكد من حذف "${confirmDeleteItem.name}" نهائياً من قاعدة البيانات؟`
                    : `Permanently delete "${confirmDeleteItem.name}"?`}
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setConfirmDeleteItem(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                {isArabic ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={executeConfirmedDelete}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white cursor-pointer"
              >
                {isArabic ? 'حذف نهائي' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesPackagesTab;
