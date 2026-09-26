import React, { useState, useEffect, useMemo } from 'react';
import { 
  UserCheck, 
  Star, 
  Award, 
  Calendar, 
  DollarSign, 
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
  MessageSquare
} from 'lucide-react';
import { Specialist, PermissionId } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { SpecialistImageCustomizerModal } from './SpecialistImageCustomizerModal';
import { 
  getSpecialistImageSetting, 
  getStoredSpecialistSettings,
  updateSpecialistCardSetting,
  getStoredGlobalCardSettings,
  saveStoredGlobalCardSettings,
  GlobalCardSettings
} from '../../data/specialistCustomizer';

interface SpecialistsTabProps {
  specialists: Specialist[];
  onUpdateSpecialists: (updated: Specialist[]) => void;
  hasPermission: (perm: PermissionId) => boolean;
}

export const SpecialistsTab: React.FC<SpecialistsTabProps> = ({
  specialists,
  onUpdateSpecialists,
  hasPermission
}) => {
  const { isArabic } = useLanguage();
  
  // Customization & editing states
  const [editingSpecialist, setEditingSpecialist] = useState<Specialist | null>(null);
  const [customizingSpecialist, setCustomizingSpecialist] = useState<Specialist | null>(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState<'all' | 'aba' | 'occupational' | 'speech' | 'topRated'>('all');

  // Form states for profile editing
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [role, setRole] = useState('');
  const [sessionPrice, setSessionPrice] = useState(280);
  const [licenseNumber, setLicenseNumber] = useState('');
  const [experienceYears, setExperienceYears] = useState(10);
  const [bio, setBio] = useState('');

  // Global Card Pricing state
  const [globalCardSettings, setGlobalCardSettings] = useState<GlobalCardSettings>(() => getStoredGlobalCardSettings());

  // Re-render trigger when settings change in customizer
  const [settingsVersion, setSettingsVersion] = useState(0);

  useEffect(() => {
    const handleSettingsUpdated = () => {
      setSettingsVersion((v) => v + 1);
    };
    const handleGlobalUpdated = (e: any) => {
      if (e?.detail) {
        setGlobalCardSettings(e.detail);
      } else {
        setGlobalCardSettings(getStoredGlobalCardSettings());
      }
    };
    window.addEventListener('raba_specialist_settings_updated', handleSettingsUpdated);
    window.addEventListener('raba_global_card_settings_updated', handleGlobalUpdated);
    return () => {
      window.removeEventListener('raba_specialist_settings_updated', handleSettingsUpdated);
      window.removeEventListener('raba_global_card_settings_updated', handleGlobalUpdated);
    };
  }, []);

  const handleToggleGlobalHidePrice = () => {
    const nextVal = !globalCardSettings.hideAllSessionPrices;
    const nextSettings = { ...globalCardSettings, hideAllSessionPrices: nextVal };
    setGlobalCardSettings(nextSettings);
    saveStoredGlobalCardSettings(nextSettings);
  };

  const canManage = hasPermission('manage_specialists');

  // Open general edit modal
  const handleOpenEdit = (spec: Specialist) => {
    setEditingSpecialist(spec);
    setName(spec.name);
    setTitle(spec.title);
    setRole(spec.role);
    setSessionPrice(spec.sessionPrice);
    setLicenseNumber(spec.licenseNumber);
    setExperienceYears(spec.experienceYears);
    setBio(spec.bio);
  };

  // Save profile changes
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSpecialist) return;
    const updated = specialists.map((s) => s.id === editingSpecialist.id ? {
      ...s,
      name,
      title,
      role,
      sessionPrice: Number(sessionPrice),
      licenseNumber,
      experienceYears: Number(experienceYears),
      bio
    } : s);
    onUpdateSpecialists(updated);
    setEditingSpecialist(null);
  };

  // Quick toggle for Top Rated status
  const handleToggleTopRated = (spec: Specialist, currentVal: boolean) => {
    updateSpecialistCardSetting(spec.id, { isTopRated: !currentVal });
    setSettingsVersion((v) => v + 1);
  };

  // KPI calculations
  const stats = useMemo(() => {
    const total = specialists.length;
    const allSettings = getStoredSpecialistSettings();
    const topRatedCount = specialists.filter((s) => {
      const sett = allSettings[s.id];
      return sett ? sett.isTopRated : s.rating >= 4.9;
    }).length;
    const abaCount = specialists.filter((s) => s.title.includes('ABA') || s.role.includes('ABA')).length;
    const otCount = specialists.filter((s) => s.title.includes('الوظيفي') || s.role.includes('الوظيفي')).length;
    const speechCount = specialists.filter((s) => s.title.includes('النطق') || s.role.includes('النطق')).length;

    return { total, topRatedCount, abaCount, otCount, speechCount };
  }, [specialists, settingsVersion]);

  // Filtered specialists
  const filteredSpecialists = useMemo(() => {
    const allSettings = getStoredSpecialistSettings();
    return specialists.filter((spec) => {
      // Search
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        spec.name.toLowerCase().includes(q) ||
        spec.title.toLowerCase().includes(q) ||
        spec.role.toLowerCase().includes(q) ||
        spec.licenseNumber.toLowerCase().includes(q);

      if (!matchesSearch) return false;

      // Department filter
      if (selectedDept === 'all') return true;
      if (selectedDept === 'topRated') {
        const sett = allSettings[spec.id];
        return sett ? sett.isTopRated : spec.rating >= 4.9;
      }
      if (selectedDept === 'aba') {
        return spec.title.includes('ABA') || spec.role.includes('ABA');
      }
      if (selectedDept === 'occupational') {
        return spec.title.includes('الوظيفي') || spec.role.includes('الوظيفي');
      }
      if (selectedDept === 'speech') {
        return spec.title.includes('النطق') || spec.role.includes('النطق');
      }
      return true;
    });
  }, [specialists, searchQuery, selectedDept, settingsVersion]);

  return (
    <div className="space-y-6">
      
      {/* 1. Header & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-xs font-black">
              {isArabic ? 'إدارة المظهر والكوادر' : 'Staff & Appearance Management'}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            {isArabic ? 'إدارة وتخصيص بطاقات الأخصائيين المعالجين' : 'Specialists & Card Customization'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {isArabic 
              ? 'تخصيص صور البوسترات الرسمية، ضبط المحاذاة، رفع صور جديدة، وتعديل التراخيص والرسوم' 
              : 'Customize official card poster crops, fit/zoom, upload new photos, and edit fees'}
          </p>
        </div>
      </div>

      {/* 2. Executive KPI Cards Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl p-3.5 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 block mb-1">
            {isArabic ? 'إجمالي الكادر الطبي' : 'Total Specialists'}
          </span>
          <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            {stats.total}
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl p-3.5 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 block mb-1">
            {isArabic ? 'تحليل السلوك ABA' : 'ABA Specialists'}
          </span>
          <span className="text-xl sm:text-2xl font-black text-[#0B3B36] dark:text-[#00E5BE]">
            {stats.abaCount}
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl p-3.5 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 block mb-1">
            {isArabic ? 'العلاج الوظيفي والتكامل' : 'Occupational & SI'}
          </span>
          <span className="text-xl sm:text-2xl font-black text-teal-600 dark:text-teal-400">
            {stats.otCount}
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl p-3.5 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 block mb-1">
            {isArabic ? 'النطق والتخاطب' : 'Speech & SLP'}
          </span>
          <span className="text-xl sm:text-2xl font-black text-blue-600 dark:text-blue-400">
            {stats.speechCount}
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl p-3.5 shadow-xs col-span-2 sm:col-span-1">
          <span className="text-[11px] font-bold text-slate-400 block mb-1">
            {isArabic ? 'الأعلى تقييماً' : 'Top Rated'}
          </span>
          <span className="text-xl sm:text-2xl font-black text-amber-500 flex items-center gap-1">
            <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
            {stats.topRatedCount}
          </span>
        </div>
      </div>

      {/* Global Card Pricing & Visibility Settings Banner */}
      <div className="bg-gradient-to-l from-teal-500/10 via-emerald-500/5 to-transparent dark:from-teal-950/40 dark:via-slate-900 border border-teal-500/30 rounded-3xl p-4 sm:p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-[#0B3B36] text-white dark:bg-[#00E5BE] dark:text-slate-950 shadow-sm shrink-0">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                {isArabic ? 'إخفاء سعر الجلسة من جميع البطاقات' : 'Hide Session Price from All Cards'}
              </h3>
              <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${
                globalCardSettings.hideAllSessionPrices
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300/40'
                  : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
              }`}>
                {globalCardSettings.hideAllSessionPrices 
                  ? (isArabic ? 'مفعل (الأسعار مخفية)' : 'Active (Hidden)')
                  : (isArabic ? 'معطل (الأسعار ظاهرة)' : 'Inactive (Visible)')}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
              {isArabic 
                ? 'عند التفعيل، لن يظهر السعر المالي على بطاقات الأخصائيين في الموقع العام أو السير الذاتية، وسيظهر بدلاً منه "حسب التقييم".' 
                : 'When active, numeric session prices are hidden across all doctor cards and replaced with "Upon Consult".'}
            </p>
          </div>
        </div>

        <div className="shrink-0 flex items-center">
          <button
            type="button"
            onClick={handleToggleGlobalHidePrice}
            className={`w-full sm:w-auto px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2.5 shadow-md cursor-pointer ${
              globalCardSettings.hideAllSessionPrices
                ? 'bg-[#00E5BE] text-slate-950 hover:brightness-105 ring-2 ring-[#00E5BE]/40'
                : 'bg-[#0B3B36] text-white hover:bg-[#0d4741] dark:bg-slate-800 dark:text-white dark:border dark:border-white/15'
            }`}
          >
            <div className={`w-2.5 h-2.5 rounded-full ${globalCardSettings.hideAllSessionPrices ? 'bg-slate-950 animate-pulse' : 'bg-white/80'}`} />
            <span>
              {globalCardSettings.hideAllSessionPrices 
                ? (isArabic ? 'إلغاء الإخفاء وإظهار الأسعار' : 'Show All Session Prices') 
                : (isArabic ? 'إخفاء سعر الجلسة من جميع البطاقات الآن' : 'Hide Session Price from All Cards')}
            </span>
          </button>
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
            placeholder={isArabic ? 'بحث بالاسم، التخصص، أو رقم الترخيص...' : 'Search by name, role, or license...'}
            className="w-full pl-9 rtl:pl-3 rtl:pr-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-white/10 rounded-xl text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-[#00E5BE]/30"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 rtl:right-auto rtl:left-3 text-slate-400 hover:text-slate-600 text-xs font-bold"
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
                ? 'bg-amber-500 text-white shadow-xs'
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
        {filteredSpecialists.map((spec) => {
          const setting = getSpecialistImageSetting(spec.id);
          const activeAvatar = setting.avatar;
          const isTop = setting.isTopRated ?? spec.rating >= 4.9;

          return (
            <div
              key={spec.id}
              className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Hero Card Image Display with Controls */}
                <div className="relative h-48 bg-slate-100 dark:bg-slate-800 overflow-hidden border-b border-slate-100 dark:border-white/10">
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
                    <span>{isArabic ? 'رفع صورة أو ملف' : 'Upload Photo / File'}</span>
                  </button>
                </div>

                {/* Card Info Details */}
                <div className="p-5">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h3 className="text-base font-black text-slate-900 dark:text-white leading-tight">
                        {spec.name}
                      </h3>
                      <p className="text-xs text-emerald-700 dark:text-emerald-400 font-bold mt-0.5">
                        {spec.title}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 bg-amber-400/10 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-full text-xs font-black shrink-0">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>{spec.rating}</span>
                    </div>
                  </div>

                  {/* Quick Metrics */}
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl space-y-1.5 text-xs text-slate-600 dark:text-slate-300 mb-3">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-[11px]">{isArabic ? 'رقم الترخيص:' : 'License:'}</span>
                      <span className="font-mono font-bold text-slate-800 dark:text-slate-200 text-[11px]">{spec.licenseNumber}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-[11px]">{isArabic ? 'سنوات الخبرة:' : 'Experience:'}</span>
                      <span className="font-bold text-[11px]">{spec.experienceYears} {isArabic ? 'سنوات' : 'years'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-[11px]">{isArabic ? 'سعر الجلسة:' : 'Session Fee:'}</span>
                      {globalCardSettings.hideAllSessionPrices || setting.hideSessionPrice ? (
                        <span className="text-[10px] font-bold text-amber-700 dark:text-amber-300 bg-amber-500/10 dark:bg-amber-500/20 px-2 py-0.5 rounded-md border border-amber-500/30">
                          {isArabic ? 'مخفي من البطاقة (حسب التقييم)' : 'Hidden (Upon Consult)'}
                        </span>
                      ) : (
                        <span className="font-black text-emerald-700 dark:text-emerald-300">{spec.sessionPrice} ر.س</span>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {spec.bio}
                  </p>
                </div>
              </div>

              {/* Bottom Action Row */}
              <div className="p-4 pt-0 flex items-center justify-between gap-2 border-t border-slate-100 dark:border-white/10 pt-3 mt-1">
                {/* Toggle Top Rated */}
                <button
                  type="button"
                  onClick={() => handleToggleTopRated(spec, isTop)}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer ${
                    isTop
                      ? 'bg-amber-400/15 text-amber-700 dark:text-amber-300 border border-amber-300/30'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                  }`}
                  title={isArabic ? 'تبديل شارة الأعلى تقييماً' : 'Toggle Top Rated'}
                >
                  <Star className={`w-3 h-3 ${isTop ? 'fill-amber-400 text-amber-400' : ''}`} />
                  <span>{isTop ? (isArabic ? 'مميز' : 'Featured') : (isArabic ? 'عادي' : 'Standard')}</span>
                </button>

                {/* Edit Profile Details */}
                {canManage && (
                  <button
                    onClick={() => handleOpenEdit(spec)}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-[#0B3B36] hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>{isArabic ? 'تعديل البيانات' : 'Edit Info'}</span>
                  </button>
                )}
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

      {/* 6. Edit Info Modal */}
      {editingSpecialist && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl p-6 w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-4 mb-5">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <span>{isArabic ? 'تعديل بيانات الأخصائي' : 'Edit Specialist Profile'}</span>
              </h3>
              <button
                onClick={() => setEditingSpecialist(null)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:bg-slate-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {isArabic ? 'الاسم الكامل:' : 'Full Name:'}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {isArabic ? 'المسمى الوظيفي:' : 'Job Title:'}
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
                    {isArabic ? 'رقم الترخيص:' : 'License Number:'}
                  </label>
                  <input
                    type="text"
                    value={licenseNumber}
                    onChange={(e) => setLicenseNumber(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800 text-xs font-mono font-medium text-slate-900 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {isArabic ? 'سعر الجلسة (ر.س):' : 'Session Price (SAR):'}
                  </label>
                  <input
                    type="number"
                    value={sessionPrice}
                    onChange={(e) => setSessionPrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {isArabic ? 'سنوات الخبرة:' : 'Experience (Years):'}
                  </label>
                  <input
                    type="number"
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {isArabic ? 'النبذة المهنية:' : 'Bio:'}
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setEditingSpecialist(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  {isArabic ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0B3B36] hover:bg-[#082b27] text-white text-xs font-bold cursor-pointer transition-all shadow-xs"
                >
                  {isArabic ? 'حفظ التعديلات' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
