import React, { useState } from 'react';
import { 
  Briefcase, 
  Layers, 
  Plus, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  DollarSign, 
  Tag,
  Sparkles,
  X
} from 'lucide-react';
import { ServiceItem, TherapyPackage, PermissionId } from '../../types';
import { SERVICES, THERAPY_PACKAGES } from '../../data/mockData';
import { useLanguage } from '../../context/LanguageContext';

interface ServicesPackagesTabProps {
  services: ServiceItem[];
  packages: TherapyPackage[];
  onUpdateServices: (updated: ServiceItem[]) => void;
  onUpdatePackages: (updated: TherapyPackage[]) => void;
  hasPermission: (perm: PermissionId) => boolean;
}

export const ServicesPackagesTab: React.FC<ServicesPackagesTabProps> = ({
  services,
  packages,
  onUpdateServices,
  onUpdatePackages,
  hasPermission
}) => {
  const { isArabic } = useLanguage();

  const [activeSubTab, setActiveSubTab] = useState<'services' | 'packages'>('services');
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [editingPackage, setEditingPackage] = useState<TherapyPackage | null>(null);

  const canManageServices = hasPermission('manage_services');
  const canManagePackages = hasPermission('manage_packages');

  // Form states for Service Edit
  const [srvTitle, setSrvTitle] = useState('');
  const [srvCategory, setSrvCategory] = useState('');
  const [srvDesc, setSrvDesc] = useState('');
  const [srvDuration, setSrvDuration] = useState(45);
  const [srvTargetAges, setSrvTargetAges] = useState('');

  // Form states for Package Edit
  const [pkgName, setPkgName] = useState('');
  const [pkgPrice, setPkgPrice] = useState(1200);
  const [pkgOriginalPrice, setPkgOriginalPrice] = useState(1600);
  const [pkgSessions, setPkgSessions] = useState(12);
  const [pkgWeeks, setPkgWeeks] = useState(4);
  const [pkgTagline, setPkgTagline] = useState('');

  const handleOpenEditService = (srv: ServiceItem) => {
    setEditingService(srv);
    setSrvTitle(srv.title);
    setSrvCategory(srv.categoryAr);
    setSrvDesc(srv.description);
    setSrvDuration(srv.durationMinutes);
    setSrvTargetAges(srv.targetAges);
  };

  const handleSaveService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;
    const updated = services.map((s) => s.id === editingService.id ? {
      ...s,
      title: srvTitle,
      categoryAr: srvCategory,
      description: srvDesc,
      durationMinutes: srvDuration,
      targetAges: srvTargetAges
    } : s);
    onUpdateServices(updated);
    setEditingService(null);
  };

  const handleOpenEditPackage = (pkg: TherapyPackage) => {
    setEditingPackage(pkg);
    setPkgName(pkg.name);
    setPkgPrice(pkg.price);
    setPkgOriginalPrice(pkg.originalPrice || pkg.price + 400);
    setPkgSessions(pkg.sessionsCount);
    setPkgWeeks(pkg.durationWeeks);
    setPkgTagline(pkg.tagline);
  };

  const handleSavePackage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPackage) return;
    const updated = packages.map((p) => p.id === editingPackage.id ? {
      ...p,
      name: pkgName,
      price: Number(pkgPrice),
      originalPrice: Number(pkgOriginalPrice),
      sessionsCount: Number(pkgSessions),
      durationWeeks: Number(pkgWeeks),
      tagline: pkgTagline
    } : p);
    onUpdatePackages(updated);
    setEditingPackage(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Sub-tabs header */}
      <div className="flex items-center justify-between gap-4 border-b border-slate-200 dark:border-white/10 pb-4">
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
      </div>

      {/* Services List */}
      {activeSubTab === 'services' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((srv) => (
            <div
              key={srv.id}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-white/10 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
                    {srv.categoryAr}
                  </span>
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{srv.durationMinutes} {isArabic ? 'دقيقة' : 'min'}</span>
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                  {srv.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed mb-4">
                  {srv.description}
                </p>

                <div className="text-[11px] text-slate-500 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl">
                  <span className="font-bold text-slate-700 dark:text-slate-300">{isArabic ? 'الفئة العمرية: ' : 'Target: '}</span>
                  {srv.targetAges}
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 dark:border-white/10 flex justify-end">
                {canManageServices && (
                  <button
                    onClick={() => handleOpenEditService(srv)}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-emerald-500 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>{isArabic ? 'تعديل الخدمة' : 'Edit'}</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Packages List */}
      {activeSubTab === 'packages' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-white/10 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-teal-500/10 text-teal-700 dark:text-teal-300">
                    {pkg.sessionsCount} {isArabic ? 'جلسة تأهيلية' : 'Sessions'}
                  </span>
                  <span className="text-xs text-slate-500">
                    {pkg.durationWeeks} {isArabic ? 'أسابيع' : 'Weeks'}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                  {pkg.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                  {pkg.tagline}
                </p>

                <div className="p-3 bg-emerald-50/70 dark:bg-emerald-950/20 rounded-2xl border border-emerald-200 dark:border-emerald-800/30 flex items-center justify-between mb-3">
                  <div>
                    <div className="text-[10px] text-slate-500">{isArabic ? 'سعر الباقة بعد الخصم' : 'Package Price'}</div>
                    <div className="text-xl font-black text-[#0B3B36] dark:text-[#2DD4BF]">
                      {pkg.price} {isArabic ? 'ر.س' : 'SAR'}
                    </div>
                  </div>
                  {pkg.originalPrice && (
                    <div className="text-xs text-slate-400 line-through">
                      {pkg.originalPrice} {isArabic ? 'ر.س' : 'SAR'}
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-white/10 flex justify-end">
                {canManagePackages && (
                  <button
                    onClick={() => handleOpenEditPackage(pkg)}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-emerald-500 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>{isArabic ? 'تعديل الباقة والأسعار' : 'Edit'}</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* EDIT SERVICE MODAL */}
      {editingService && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 space-y-4 border border-slate-200 dark:border-white/15" dir={isArabic ? 'rtl' : 'ltr'}>
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-white/10">
              <h3 className="text-base font-bold">{isArabic ? 'تعديل تفاصيل البرنامج' : 'Edit Service'}</h3>
              <button onClick={() => setEditingService(null)} className="p-1.5 rounded-full hover:bg-slate-100">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            <form onSubmit={handleSaveService} className="space-y-3 text-xs">
              <div>
                <label className="font-bold block mb-1">{isArabic ? 'اسم البرنامج:' : 'Title:'}</label>
                <input type="text" value={srvTitle} onChange={(e) => setSrvTitle(e.target.value)} className="w-full p-2.5 border rounded-xl bg-slate-50 dark:bg-slate-800" />
              </div>
              <div>
                <label className="font-bold block mb-1">{isArabic ? 'القسم:' : 'Category:'}</label>
                <input type="text" value={srvCategory} onChange={(e) => setSrvCategory(e.target.value)} className="w-full p-2.5 border rounded-xl bg-slate-50 dark:bg-slate-800" />
              </div>
              <div>
                <label className="font-bold block mb-1">{isArabic ? 'مدة الجلسة (بالدقائق):' : 'Duration (min):'}</label>
                <input type="number" value={srvDuration} onChange={(e) => setSrvDuration(Number(e.target.value))} className="w-full p-2.5 border rounded-xl bg-slate-50 dark:bg-slate-800" />
              </div>
              <div>
                <label className="font-bold block mb-1">{isArabic ? 'الفئات المستهدفة:' : 'Target Ages:'}</label>
                <input type="text" value={srvTargetAges} onChange={(e) => setSrvTargetAges(e.target.value)} className="w-full p-2.5 border rounded-xl bg-slate-50 dark:bg-slate-800" />
              </div>
              <div>
                <label className="font-bold block mb-1">{isArabic ? 'الوصف التوضيحي:' : 'Description:'}</label>
                <textarea rows={3} value={srvDesc} onChange={(e) => setSrvDesc(e.target.value)} className="w-full p-2.5 border rounded-xl bg-slate-50 dark:bg-slate-800" />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setEditingService(null)} className="px-4 py-2 rounded-xl text-slate-500 hover:bg-slate-100">{isArabic ? 'إلغاء' : 'Cancel'}</button>
                <button type="submit" className="px-5 py-2 bg-[#0B3B36] text-white font-bold rounded-xl">{isArabic ? 'حفظ' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT PACKAGE MODAL */}
      {editingPackage && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 space-y-4 border border-slate-200 dark:border-white/15" dir={isArabic ? 'rtl' : 'ltr'}>
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-white/10">
              <h3 className="text-base font-bold">{isArabic ? 'تعديل الباقة والأسعار' : 'Edit Package'}</h3>
              <button onClick={() => setEditingPackage(null)} className="p-1.5 rounded-full hover:bg-slate-100">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            <form onSubmit={handleSavePackage} className="space-y-3 text-xs">
              <div>
                <label className="font-bold block mb-1">{isArabic ? 'اسم الباقة:' : 'Package Name:'}</label>
                <input type="text" value={pkgName} onChange={(e) => setPkgName(e.target.value)} className="w-full p-2.5 border rounded-xl bg-slate-50 dark:bg-slate-800" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold block mb-1">{isArabic ? 'السعر المخفض (ر.س):' : 'Price (SAR):'}</label>
                  <input type="number" value={pkgPrice} onChange={(e) => setPkgPrice(Number(e.target.value))} className="w-full p-2.5 border rounded-xl bg-slate-50 dark:bg-slate-800" />
                </div>
                <div>
                  <label className="font-bold block mb-1">{isArabic ? 'السعر الأصلي (ر.س):' : 'Original Price:'}</label>
                  <input type="number" value={pkgOriginalPrice} onChange={(e) => setPkgOriginalPrice(Number(e.target.value))} className="w-full p-2.5 border rounded-xl bg-slate-50 dark:bg-slate-800" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold block mb-1">{isArabic ? 'عدد الجلسات:' : 'Sessions Count:'}</label>
                  <input type="number" value={pkgSessions} onChange={(e) => setPkgSessions(Number(e.target.value))} className="w-full p-2.5 border rounded-xl bg-slate-50 dark:bg-slate-800" />
                </div>
                <div>
                  <label className="font-bold block mb-1">{isArabic ? 'المدة (أسابيع):' : 'Weeks Duration:'}</label>
                  <input type="number" value={pkgWeeks} onChange={(e) => setPkgWeeks(Number(e.target.value))} className="w-full p-2.5 border rounded-xl bg-slate-50 dark:bg-slate-800" />
                </div>
              </div>
              <div>
                <label className="font-bold block mb-1">{isArabic ? 'الوصف المختصر:' : 'Tagline:'}</label>
                <input type="text" value={pkgTagline} onChange={(e) => setPkgTagline(e.target.value)} className="w-full p-2.5 border rounded-xl bg-slate-50 dark:bg-slate-800" />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setEditingPackage(null)} className="px-4 py-2 rounded-xl text-slate-500 hover:bg-slate-100">{isArabic ? 'إلغاء' : 'Cancel'}</button>
                <button type="submit" className="px-5 py-2 bg-[#0B3B36] text-white font-bold rounded-xl">{isArabic ? 'حفظ التعديلات' : 'Save Changes'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default ServicesPackagesTab;
