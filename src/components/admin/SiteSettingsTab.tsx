import React, { useState, useEffect } from 'react';
import { 
  Palette, 
  Share2, 
  Layers, 
  Footprints, 
  Layout, 
  Check, 
  RotateCcw, 
  Save, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Edit2,
  Eye,
  EyeOff,
  Phone,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  Globe,
  Sliders,
  X,
  Award,
  Database,
  Megaphone,
  Bell,
  CalendarCheck,
  Gift,
  Info
} from 'lucide-react';
import { AccreditationsSettingsTab } from './AccreditationsSettingsTab';
import { LogoSettingsSubTab } from './LogoSettingsSubTab';
import { PersistentSyncTab } from './PersistentSyncTab';
import { AnnouncementBar } from '../AnnouncementBar';
import { useLanguage } from '../../context/LanguageContext';
import { 
  getStoredThemeSettings, 
  saveStoredThemeSettings, 
  THEME_PRESETS, 
  SiteThemeSettings,
  getStoredSocialSettings,
  saveStoredSocialSettings,
  SocialLinksSettings,
  DEFAULT_SOCIAL_SETTINGS,
  getStoredPillars,
  saveStoredPillars,
  ProgramPillarItem,
  DEFAULT_PROGRAM_PILLARS,
  getStoredFooterSettings,
  saveStoredFooterSettings,
  FooterSettings,
  DEFAULT_FOOTER_SETTINGS,
  getStoredModulesVisibility,
  saveStoredModulesVisibility,
  SiteModulesVisibility,
  DEFAULT_MODULES_VISIBILITY,
  AnnouncementBarSettings,
  AnnouncementStyleVariant,
  AnnouncementCtaAction,
  AnnouncementIconName,
  DEFAULT_ANNOUNCEMENT_BAR_SETTINGS,
  getStoredAnnouncementBarSettings,
  saveStoredAnnouncementBarSettings,
  resetAnnouncementBarSettings
} from '../../data/siteCustomizer';

interface SiteSettingsTabProps {
  hasPermission?: (perm: any) => boolean;
  isSystemAdmin?: boolean;
}

export const SiteSettingsTab: React.FC<SiteSettingsTabProps> = ({ hasPermission, isSystemAdmin = false }) => {
  const { isArabic } = useLanguage();
  const canEditSiteSettings = isSystemAdmin || Boolean(hasPermission?.('system_settings'));

  // Active Sub-Tab
  const [subTab, setSubTab] = useState<'logo' | 'announcement' | 'theme' | 'accreditations' | 'pillars' | 'social' | 'footer' | 'modules' | 'sync'>('logo');
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // 1. Theme State
  const [themeSettings, setThemeSettings] = useState<SiteThemeSettings>(() => getStoredThemeSettings());

  // 2. Social Links State
  const [socialSettings, setSocialSettings] = useState<SocialLinksSettings>(() => getStoredSocialSettings());

  // 3. Pillars State
  const [pillars, setPillars] = useState<ProgramPillarItem[]>(() => getStoredPillars());
  const [editingPillar, setEditingPillar] = useState<ProgramPillarItem | null>(null);
  const [isPillarModalOpen, setIsPillarModalOpen] = useState(false);
  const [isNewPillar, setIsNewPillar] = useState(false);

  // Pillar Modal Form
  const [pillarTitleAr, setPillarTitleAr] = useState('');
  const [pillarTitleEn, setPillarTitleEn] = useState('');
  const [pillarDescAr, setPillarDescAr] = useState('');
  const [pillarDescEn, setPillarDescEn] = useState('');
  const [pillarIcon, setPillarIcon] = useState('UserCheck');
  const [pillarColor, setPillarColor] = useState('text-[#0284C7]');
  const [pillarBgColor, setPillarBgColor] = useState('bg-sky-500/15');
  const [pillarBorderColor, setPillarBorderColor] = useState('border-sky-400/30');

  // 4. Footer State
  const [footerSettings, setFooterSettings] = useState<FooterSettings>(() => getStoredFooterSettings());

  // 5. Modules Visibility State
  const [modulesVisibility, setModulesVisibility] = useState<SiteModulesVisibility>(() => getStoredModulesVisibility());

  // 6. Header Notification / Announcement Bar State
  const [announcementSettings, setAnnouncementSettings] = useState<AnnouncementBarSettings>(() =>
    getStoredAnnouncementBarSettings()
  );

  useEffect(() => {
    const syncAnnouncement = () => {
      setAnnouncementSettings(getStoredAnnouncementBarSettings());
    };
    window.addEventListener('raba_announcement_bar_updated', syncAnnouncement);
    window.addEventListener('raba_persistent_sync_ready', syncAnnouncement);
    return () => {
      window.removeEventListener('raba_announcement_bar_updated', syncAnnouncement);
      window.removeEventListener('raba_persistent_sync_ready', syncAnnouncement);
    };
  }, []);

  const showFeedback = (text: string, type: 'success' | 'error' = 'success') => {
    setFeedbackMsg({ type, text });
    setTimeout(() => setFeedbackMsg(null), 3500);
  };

  // --- Handlers: Theme ---
  const handleSelectPreset = (preset: SiteThemeSettings) => {
    setThemeSettings(preset);
    saveStoredThemeSettings(preset);
    showFeedback(isArabic ? `تم تطبيق ثيم: ${preset.nameAr}` : `Theme applied: ${preset.nameEn}`);
  };

  const handleSaveCustomTheme = (e: React.FormEvent) => {
    e.preventDefault();
    const custom = {
      ...themeSettings,
      id: 'custom-theme',
      nameAr: 'ثيم مخصص',
      nameEn: 'Custom Palette',
      isCustom: true
    };
    setThemeSettings(custom);
    saveStoredThemeSettings(custom);
    showFeedback(isArabic ? 'تم حفظ ألوان الثيم بنجاح' : 'Custom theme saved successfully');
  };

  // --- Handlers: Social ---
  const handleSaveSocial = (e: React.FormEvent) => {
    e.preventDefault();
    saveStoredSocialSettings(socialSettings);
    showFeedback(isArabic ? 'تم تحديث روابط السوشيال ميديا في الفوتر' : 'Social media links updated');
  };

  const handleResetSocial = () => {
    setSocialSettings(DEFAULT_SOCIAL_SETTINGS);
    saveStoredSocialSettings(DEFAULT_SOCIAL_SETTINGS);
    showFeedback(isArabic ? '✓ تمت استعادة الروابط الأصلية بنجاح' : 'Reset to default links');
  };

  // --- Handlers: Pillars ---
  const handleMovePillarUp = (idx: number) => {
    if (idx === 0) return;
    const next = [...pillars];
    const temp = next[idx - 1];
    next[idx - 1] = next[idx];
    next[idx] = temp;
    next.forEach((p, i) => { p.order = i + 1; });
    setPillars(next);
    saveStoredPillars(next);
  };

  const handleMovePillarDown = (idx: number) => {
    if (idx === pillars.length - 1) return;
    const next = [...pillars];
    const temp = next[idx + 1];
    next[idx + 1] = next[idx];
    next[idx] = temp;
    next.forEach((p, i) => { p.order = i + 1; });
    setPillars(next);
    saveStoredPillars(next);
  };

  const handleTogglePillarActive = (id: string) => {
    const next = pillars.map((p) => p.id === id ? { ...p, active: !p.active } : p);
    setPillars(next);
    saveStoredPillars(next);
    showFeedback(isArabic ? 'تم تحديث حالة المحور' : 'Pillar updated');
  };

  const handleDeletePillar = (id: string) => {
    if (!isSystemAdmin) return;
    if (pillars.length <= 1) {
      showFeedback(isArabic ? 'لا يمكن حذف آخر محور' : 'Cannot delete last pillar', 'error');
      return;
    }
    const next = pillars.filter((p) => p.id !== id);
    next.forEach((p, i) => { p.order = i + 1; });
    setPillars(next);
    saveStoredPillars(next);
    showFeedback(isArabic ? 'تم حذف المحور بنجاح' : 'Pillar deleted');
  };

  const handleOpenNewPillar = () => {
    setIsNewPillar(true);
    setEditingPillar(null);
    setPillarTitleAr('');
    setPillarTitleEn('');
    setPillarDescAr('');
    setPillarDescEn('');
    setPillarIcon('UserCheck');
    setPillarColor('text-[#0284C7]');
    setPillarBgColor('bg-sky-500/15');
    setPillarBorderColor('border-sky-400/30');
    setIsPillarModalOpen(true);
  };

  const handleOpenEditPillar = (pillar: ProgramPillarItem) => {
    setIsNewPillar(false);
    setEditingPillar(pillar);
    setPillarTitleAr(pillar.titleAr);
    setPillarTitleEn(pillar.titleEn || '');
    setPillarDescAr(pillar.descAr);
    setPillarDescEn(pillar.descEn || '');
    setPillarIcon(pillar.iconName || 'UserCheck');
    setPillarColor(pillar.color || 'text-[#0284C7]');
    setPillarBgColor(pillar.bgColor || 'bg-sky-500/15');
    setPillarBorderColor(pillar.borderColor || 'border-sky-400/30');
    setIsPillarModalOpen(true);
  };

  const handleSavePillarModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pillarTitleAr.trim()) {
      showFeedback(isArabic ? 'يرجى إدخال عنوان المحور' : 'Title required', 'error');
      return;
    }

    if (isNewPillar) {
      const newP: ProgramPillarItem = {
        id: `pillar-${Date.now()}`,
        titleAr: pillarTitleAr,
        titleEn: pillarTitleEn || pillarTitleAr,
        descAr: pillarDescAr,
        descEn: pillarDescEn || pillarDescAr,
        iconName: pillarIcon,
        color: pillarColor,
        bgColor: pillarBgColor,
        borderColor: pillarBorderColor,
        active: true,
        order: pillars.length + 1
      };
      const next = [...pillars, newP];
      setPillars(next);
      saveStoredPillars(next);
    } else if (editingPillar) {
      const next = pillars.map((p) => {
        if (p.id === editingPillar.id) {
          return {
            ...p,
            titleAr: pillarTitleAr,
            titleEn: pillarTitleEn,
            descAr: pillarDescAr,
            descEn: pillarDescEn,
            iconName: pillarIcon,
            color: pillarColor,
            bgColor: pillarBgColor,
            borderColor: pillarBorderColor
          };
        }
        return p;
      });
      setPillars(next);
      saveStoredPillars(next);
    }

    setIsPillarModalOpen(false);
    showFeedback(isArabic ? 'تم حفظ المحور بنجاح' : 'Pillar saved');
  };

  const handleResetPillars = () => {
    setPillars([...DEFAULT_PROGRAM_PILLARS]);
    saveStoredPillars([...DEFAULT_PROGRAM_PILLARS]);
    showFeedback(isArabic ? '✓ تمت استعادة محاور البرنامج الأصلية' : 'Pillars reset to default');
  };

  // --- Handlers: Footer ---
  const handleSaveFooter = (e: React.FormEvent) => {
    e.preventDefault();
    saveStoredFooterSettings(footerSettings);
    showFeedback(isArabic ? 'تم حفظ إعدادات ونصوص الفوتر' : 'Footer settings saved');
  };

  const handleResetFooter = () => {
    setFooterSettings(DEFAULT_FOOTER_SETTINGS);
    saveStoredFooterSettings(DEFAULT_FOOTER_SETTINGS);
    showFeedback(isArabic ? '✓ تمت استعادة نصوص الفوتر الأصلية' : 'Footer reset to default');
  };

  // --- Handlers: Modules Visibility ---
  const handleToggleModule = (key: keyof SiteModulesVisibility) => {
    const next = { ...modulesVisibility, [key]: !modulesVisibility[key] };
    setModulesVisibility(next);
    saveStoredModulesVisibility(next);
    showFeedback(isArabic ? 'تم تحديث ظهور المديول في الموقع' : 'Module visibility updated');
  };

  const handleResetModules = () => {
    setModulesVisibility(DEFAULT_MODULES_VISIBILITY);
    saveStoredModulesVisibility(DEFAULT_MODULES_VISIBILITY);
    showFeedback(isArabic ? '✓ تم تفعيل واستعادة جميع المديولات' : 'All modules enabled');
  };

  // --- Handlers: Announcement Bar ---
  const handleToggleAnnouncementEnabled = () => {
    if (!canEditSiteSettings) {
      showFeedback(isArabic ? 'ليس لديك صلاحية تعديل شريط الإشعارات' : 'Permission required', 'error');
      return;
    }
    const next: AnnouncementBarSettings = {
      ...announcementSettings,
      enabled: !announcementSettings.enabled,
      updatedAt: new Date().toISOString()
    };
    setAnnouncementSettings(next);
    saveStoredAnnouncementBarSettings(next);
    showFeedback(
      next.enabled
        ? (isArabic ? '✓ تم تفعيل وتنشيط شريط الإشعارات أسفل الهيدر مباشرة' : 'Header notification bar activated')
        : (isArabic ? 'تم إيقاف إظهار شريط الإشعارات أسفل الهيدر' : 'Header notification bar hidden')
    );
  };

  const handleSaveAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEditSiteSettings) {
      showFeedback(isArabic ? 'ليس لديك صلاحية حفظ الإعدادات' : 'Permission required', 'error');
      return;
    }
    if (!announcementSettings.messageAr.trim() && !announcementSettings.messageEn.trim()) {
      showFeedback(isArabic ? 'يرجى إدخال نص الإشعار قبل الحفظ' : 'Please enter an announcement message', 'error');
      return;
    }
    const next: AnnouncementBarSettings = {
      ...announcementSettings,
      updatedAt: new Date().toISOString()
    };
    setAnnouncementSettings(next);
    saveStoredAnnouncementBarSettings(next);
    showFeedback(isArabic ? '✓ تم حفظ وتحديث شريط الإشعارات بنجاح' : 'Announcement bar settings saved');
  };

  const handleResetAnnouncement = () => {
    if (!canEditSiteSettings) return;
    resetAnnouncementBarSettings();
    setAnnouncementSettings(DEFAULT_ANNOUNCEMENT_BAR_SETTINGS);
    showFeedback(isArabic ? '✓ تمت استعادة الإعدادات الافتراضية لشريط الإشعارات' : 'Announcement bar reset to defaults');
  };

  const applyAnnouncementTemplate = (tpl: Partial<AnnouncementBarSettings>) => {
    const next: AnnouncementBarSettings = {
      ...announcementSettings,
      ...tpl
    };
    setAnnouncementSettings(next);
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-teal-500/10 text-teal-700 dark:text-[#00E5BE] text-xs font-black">
              {isArabic ? 'الهوية وإعدادات المنظومة الشاملة' : 'Site Configuration'}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Sliders className="w-6 h-6 text-[#0F766E] dark:text-[#00E5BE]" />
            <span>{isArabic ? 'تخصيص الثيم والمحاور والفوتر ومديولات الموقع' : 'Theme, Pillars, Footer & Modules'}</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {isArabic 
              ? 'التحكم الكامل بلون هوية الموقع، محاور البرنامج، منصات التواصل، تذييل الصفحة، وإظهار/إخفاء أقسام الموقع' 
              : 'Full control over brand colors, program pillars, social links, footer, and section modules'}
          </p>
        </div>
      </div>

      {/* Feedback Toast */}
      {feedbackMsg && (
        <div className={`p-3.5 rounded-2xl text-xs font-black flex items-center gap-2 shadow-lg transition-all animate-in fade-in ${
          feedbackMsg.type === 'success' 
            ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300' 
            : 'bg-rose-500/15 border border-rose-500/30 text-rose-800 dark:text-rose-300'
        }`}>
          {feedbackMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
          <span>{feedbackMsg.text}</span>
        </div>
      )}

      {/* 2. Sub-Tabs Navigation */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-white/10 pb-3">
        {[
          { id: 'logo', label: isArabic ? '✨ هوية وشعار الموقع (Logo)' : '✨ Brand Logo & Text', icon: Sparkles },
          { id: 'announcement', label: isArabic ? '🔔 شريط الإشعارات أسفل الهيدر' : '🔔 Header Notification Bar', icon: Megaphone },
          { id: 'theme', label: isArabic ? '🎨 لون الثيم والهوية' : '🎨 Theme & Colors', icon: Palette },
          { id: 'accreditations', label: isArabic ? '🏅 اعتمادات وشهادات (معترف بنا من)' : '🏅 Accreditations & Badges', icon: Award },
          { id: 'pillars', label: isArabic ? '⭐ محاور برنامجنا' : '⭐ Program Pillars', icon: Layers },
          { id: 'social', label: isArabic ? '📱 روابط السوشيال ميديا' : '📱 Social Links', icon: Share2 },
          { id: 'footer', label: isArabic ? '📄 أجزاء وتذييل الفوتر' : '📄 Footer Content', icon: Footprints },
          { id: 'modules', label: isArabic ? '🧩 مديولات وأقسام الموقع' : '🧩 Site Modules', icon: Layout },
          { id: 'sync', label: isArabic ? '💾 المزامنة السحابية والمرفقات الثابتة' : '💾 Persistent Sync & Storage', icon: Database }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSubTab(tab.id as any)}
              className={`px-4 py-2 rounded-2xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
                subTab === tab.id
                  ? 'bg-[#1463D6] text-white shadow-md scale-102'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.id === 'announcement' && (
                <span
                  className={`w-2 h-2 rounded-full ${
                    announcementSettings.enabled
                      ? 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.9)]'
                      : 'bg-slate-300 dark:bg-slate-600'
                  }`}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* 2.5. SUB-TAB: LOGO & BRAND CUSTOMIZATION (#تخصيص اللوجو والشعار بالكامل) */}
      {/* ========================================================================= */}
      {subTab === 'logo' && (
        <LogoSettingsSubTab onFeedback={showFeedback} />
      )}

      {/* ========================================================================= */}
      {/* 2.8. SUB-TAB: HEADER NOTIFICATION / ANNOUNCEMENT BAR                      */}
      {/* ========================================================================= */}
      {subTab === 'announcement' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Master Activation Card */}
          <div className={`rounded-3xl p-5 sm:p-6 border shadow-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
            announcementSettings.enabled
              ? 'bg-emerald-50/70 dark:bg-emerald-950/25 border-emerald-200 dark:border-emerald-500/30'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-white/10'
          }`}>
            <div className="flex items-start gap-3.5">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                announcementSettings.enabled
                  ? 'bg-emerald-500 text-white shadow-md'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
              }`}>
                <Megaphone className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    {isArabic ? 'تفعيل وتنشيط شريط الإشعارات أسفل الهيدر' : 'Header Notification Bar Activation'}
                  </h3>
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-black ${
                    announcementSettings.enabled
                      ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}>
                    {announcementSettings.enabled
                      ? (isArabic ? 'نشط ومفعل حالياً' : 'Active & Live')
                      : (isArabic ? 'موقوف حالياً' : 'Inactive')}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  {isArabic
                    ? 'يظهر هذا الشريط مباشرة أسفل شريط التنقل العلوي (الهيدر) ويتكيّف تلقائياً مع ثيم الموقع العام (الوضع النهاري والليلي وألوان الهوية).'
                    : 'Appears directly underneath the sticky header and automatically harmonizes with the active site theme.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
              <span className="text-xs font-black text-slate-700 dark:text-slate-300">
                {announcementSettings.enabled
                  ? (isArabic ? 'مفعل' : 'Enabled')
                  : (isArabic ? 'معطل' : 'Disabled')}
              </span>
              <button
                type="button"
                disabled={!canEditSiteSettings}
                onClick={handleToggleAnnouncementEnabled}
                aria-label={isArabic ? 'تفعيل أو تعطيل شريط الإشعارات' : 'Toggle notification bar'}
                className={`w-14 h-8 rounded-full transition-colors p-1 shrink-0 ${
                  !canEditSiteSettings ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                } ${announcementSettings.enabled ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'}`}
              >
                <div className={`w-6 h-6 rounded-full bg-white shadow-sm transition-transform ${
                  announcementSettings.enabled ? 'ltr:translate-x-6 rtl:-translate-x-6' : 'translate-x-0'
                }`} />
              </button>
            </div>
          </div>

          {/* Live Theme-Aligned Preview */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl p-5 sm:p-6 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Eye className="w-4 h-4 text-[#1463D6] dark:text-[#60AFFF]" />
                <span>{isArabic ? 'معاينة حية متوافقة مع الهيدر وثيم الموقع' : 'Live Header & Theme Preview'}</span>
              </h4>
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                {isArabic ? 'تظهر المعاينة شكل الشريط أسفل الهيدر مباشرة' : 'Preview shows exact position beneath header'}
              </span>
            </div>

            <div className="rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden bg-slate-100/80 dark:bg-slate-950/60">
              {/* Mock compact header shell */}
              <div className="h-11 px-4 bg-white/95 dark:bg-[#101622]/95 border-b border-slate-200/80 dark:border-white/10 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                <span className="font-black text-slate-800 dark:text-white">
                  {isArabic ? 'الهيدر الرئيسي للموقع (Raba Center)' : 'Site Main Header (Raba Center)'}
                </span>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800">
                    {isArabic ? 'الخدمات' : 'Services'}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800">
                    {isArabic ? 'الفروع' : 'Branches'}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#1463D6] text-white font-bold">
                    {isArabic ? 'احجز الآن' : 'Book Now'}
                  </span>
                </div>
              </div>

              {/* Actual AnnouncementBar in preview mode */}
              <div className="p-2">
                <AnnouncementBar previewSettings={announcementSettings} isPreview />
              </div>
            </div>
          </div>

          {/* Style Variants + Quick Templates + Editor Form */}
          <form onSubmit={handleSaveAnnouncement} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl p-5 sm:p-6 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-white/10 pb-4">
              <div>
                <h4 className="text-base font-black text-slate-900 dark:text-white">
                  {isArabic ? 'تخصيص المحتوى والتصميم وزر الإجراء' : 'Customize Content, Theme Style & Action'}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {isArabic
                    ? 'اختر نمط العرض المتوافق مع الثيم العام وحدد نص الإشعار والوجهة عند الضغط'
                    : 'Choose a theme-harmonized preset and configure bilingual notice text and action link'}
                </p>
              </div>
              <button
                type="button"
                disabled={!canEditSiteSettings}
                onClick={handleResetAnnouncement}
                className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{isArabic ? 'استعادة الافتراضي' : 'Reset Default'}</span>
              </button>
            </div>

            {/* Style Variants */}
            <div className="space-y-2.5">
              <label className="text-xs font-black text-slate-800 dark:text-slate-200 block">
                {isArabic ? 'نمط المظهر والتوافق مع ثيم الموقع:' : 'Theme Style Preset:'}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  {
                    id: 'theme_glass' as AnnouncementStyleVariant,
                    titleAr: 'زجاجي متوافق مع الثيم',
                    titleEn: 'Theme Adaptive Glass',
                    descAr: 'يستخدم لون الهوية الأساسي ويتغير تلقائياً مع الوضع النهاري والليلي',
                    swatch: 'bg-gradient-to-r from-[#2B95FF]/25 via-white to-[#4A9CFF]/25 dark:via-slate-800 border-[#2B95FF]/40'
                  },
                  {
                    id: 'primary_gradient' as AnnouncementStyleVariant,
                    titleAr: 'تدرج لون الهوية الأساسي',
                    titleEn: 'Brand Primary Gradient',
                    descAr: 'شريط بارز بتدرج اللون الأساسي المحدد في إعدادات الثيم',
                    swatch: 'bg-gradient-to-r from-[#1463D6] to-[#4A9CFF] border-transparent'
                  },
                  {
                    id: 'emerald_clinical' as AnnouncementStyleVariant,
                    titleAr: 'إكلينيكي زمردي (Emerald)',
                    titleEn: 'Emerald Clinical',
                    descAr: 'طابع طبي هادئ ومريح للعين متناسق مع أقسام التأهيل',
                    swatch: 'bg-gradient-to-r from-[#0B3B36] to-[#0E5246] border-transparent'
                  },
                  {
                    id: 'obsidian_gold' as AnnouncementStyleVariant,
                    titleAr: 'داكن فاخر بالذهبي',
                    titleEn: 'Obsidian & Gold',
                    descAr: 'تباين عالٍ للإعلانات المهمة والمبادرات الخاصة',
                    swatch: 'bg-gradient-to-r from-[#141821] to-[#1C2333] border-[#F59E0B]/60'
                  }
                ].map((opt) => {
                  const selected = announcementSettings.styleVariant === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      disabled={!canEditSiteSettings}
                      onClick={() => setAnnouncementSettings({ ...announcementSettings, styleVariant: opt.id })}
                      className={`p-3 rounded-2xl border text-start transition-all cursor-pointer ${
                        selected
                          ? 'border-[#1463D6] ring-2 ring-[#1463D6]/20 bg-blue-50/50 dark:bg-blue-950/20'
                          : 'border-slate-200 dark:border-white/10 bg-slate-50/60 dark:bg-slate-800/40 hover:border-slate-300'
                      }`}
                    >
                      <div className={`h-3 w-full rounded-full border mb-2.5 ${opt.swatch}`} />
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-black text-slate-900 dark:text-white">
                          {isArabic ? opt.titleAr : opt.titleEn}
                        </span>
                        {selected && <Check className="w-3.5 h-3.5 text-[#1463D6] shrink-0" />}
                      </div>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                        {opt.descAr}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Templates */}
            <div className="space-y-2">
              <span className="text-xs font-black text-slate-700 dark:text-slate-300 block">
                {isArabic ? 'قوالب إشعارات سريعة (تعبئة فورية):' : 'Quick Notice Templates:'}
              </span>
              <div className="flex flex-wrap gap-2">
                {[
                  {
                    labelAr: 'فتح باب الحجز والمواعيد',
                    data: {
                      badgeAr: 'إعلان هام',
                      badgeEn: 'Notice',
                      messageAr: 'فتح باب الحجز للفترة المسائية في جميع الفروع — احجز جلسة التقييم المبدئي لطفلك الآن',
                      messageEn: 'Evening session bookings are now open across all branches — Book your child assessment today',
                      iconName: 'calendar' as AnnouncementIconName,
                      ctaAction: 'booking' as AnnouncementCtaAction,
                      ctaTextAr: 'احجز موعدك الآن',
                      ctaTextEn: 'Book Now'
                    }
                  },
                  {
                    labelAr: 'التسجيل في الكورسات المعتمدة',
                    data: {
                      badgeAr: 'دورات معتمدة',
                      badgeEn: 'Courses',
                      messageAr: 'التسجيل متاح الآن في دورات البورد الأمريكي ABAT و QABA مع خيارات سداد وتقسيط مرنة',
                      messageEn: 'Enrollment open for accredited ABAT & QABA courses with flexible payment options',
                      iconName: 'sparkles' as AnnouncementIconName,
                      ctaAction: 'courses' as AnnouncementCtaAction,
                      ctaTextAr: 'استعرض الدورات',
                      ctaTextEn: 'View Courses'
                    }
                  },
                  {
                    labelAr: 'عروض وخصومات التقييم',
                    data: {
                      badgeAr: 'عرض خاص',
                      badgeEn: 'Special Offer',
                      messageAr: 'خصم خاص على باقات التقييم الشامل للتوحد واضطرابات النطق والتخاطب لفترة محدودة',
                      messageEn: 'Limited-time offer on comprehensive autism & speech therapy assessment packages',
                      iconName: 'gift' as AnnouncementIconName,
                      ctaAction: 'offers' as AnnouncementCtaAction,
                      ctaTextAr: 'شاهد العروض',
                      ctaTextEn: 'View Offers'
                    }
                  },
                  {
                    labelAr: 'تفعيل بوابة الأسرة الرقمية',
                    data: {
                      badgeAr: 'بوابة الأسرة',
                      badgeEn: 'Family Portal',
                      messageAr: 'يمكنك الآن متابعة تقارير طفلك والملفات الفرعية وحجز المواعيد مباشرة عبر بوابة الأسرة',
                      messageEn: 'Track your child reports, sub-files, and appointments directly from the Family Portal',
                      iconName: 'bell' as AnnouncementIconName,
                      ctaAction: 'portal' as AnnouncementCtaAction,
                      ctaTextAr: 'دخول البوابة',
                      ctaTextEn: 'Open Portal'
                    }
                  }
                ].map((tpl) => (
                  <button
                    key={tpl.labelAr}
                    type="button"
                    disabled={!canEditSiteSettings}
                    onClick={() => applyAnnouncementTemplate(tpl.data)}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-blue-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/10 text-[11px] font-bold cursor-pointer transition-colors"
                  >
                    + {tpl.labelAr}
                  </button>
                ))}
              </div>
            </div>

            {/* Badge & Icon */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  {isArabic ? 'شارة التنبيه المختصرة (عربي):' : 'Badge Label (AR):'}
                </label>
                <input
                  type="text"
                  disabled={!canEditSiteSettings}
                  value={announcementSettings.badgeAr}
                  onChange={(e) => setAnnouncementSettings({ ...announcementSettings, badgeAr: e.target.value })}
                  placeholder="إعلان هام / جديد"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl p-2.5 text-xs outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  {isArabic ? 'شارة التنبيه المختصرة (إنجليزي):' : 'Badge Label (EN):'}
                </label>
                <input
                  type="text"
                  disabled={!canEditSiteSettings}
                  value={announcementSettings.badgeEn}
                  onChange={(e) => setAnnouncementSettings({ ...announcementSettings, badgeEn: e.target.value })}
                  placeholder="Notice / New"
                  dir="ltr"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl p-2.5 text-xs outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  {isArabic ? 'أيقونة شريط الإشعارات:' : 'Bar Icon:'}
                </label>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {[
                    { id: 'megaphone' as AnnouncementIconName, icon: Megaphone, title: 'مكبر صوت' },
                    { id: 'bell' as AnnouncementIconName, icon: Bell, title: 'جرس' },
                    { id: 'sparkles' as AnnouncementIconName, icon: Sparkles, title: 'بريق' },
                    { id: 'calendar' as AnnouncementIconName, icon: CalendarCheck, title: 'مواعيد' },
                    { id: 'gift' as AnnouncementIconName, icon: Gift, title: 'عرض' },
                    { id: 'info' as AnnouncementIconName, icon: Info, title: 'معلومة' }
                  ].map((item) => {
                    const IconComp = item.icon;
                    const active = announcementSettings.iconName === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        disabled={!canEditSiteSettings}
                        title={item.title}
                        onClick={() => setAnnouncementSettings({ ...announcementSettings, iconName: item.id })}
                        className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all cursor-pointer ${
                          active
                            ? 'bg-[#1463D6] text-white border-[#1463D6] shadow-xs'
                            : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-white/10'
                        }`}
                      >
                        <IconComp className="w-4 h-4" />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Bilingual Message */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  {isArabic ? 'نص الإشعار الرئيسي (بالعربية): *' : 'Notification Message (Arabic): *'}
                </label>
                <textarea
                  rows={2}
                  disabled={!canEditSiteSettings}
                  value={announcementSettings.messageAr}
                  onChange={(e) => setAnnouncementSettings({ ...announcementSettings, messageAr: e.target.value })}
                  placeholder="أدخل نص التنبيه أو الإعلان الذي سيظهر أسفل الهيدر..."
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl p-2.5 text-xs outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  {isArabic ? 'نص الإشعار (بالإنجليزية):' : 'Notification Message (English):'}
                </label>
                <textarea
                  rows={2}
                  dir="ltr"
                  disabled={!canEditSiteSettings}
                  value={announcementSettings.messageEn}
                  onChange={(e) => setAnnouncementSettings({ ...announcementSettings, messageEn: e.target.value })}
                  placeholder="Enter the English announcement text..."
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl p-2.5 text-xs outline-none"
                />
              </div>
            </div>

            {/* CTA Action & Button Text */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  {isArabic ? 'إجراء الزر التفاعلي (CTA):' : 'CTA Button Destination:'}
                </label>
                <select
                  disabled={!canEditSiteSettings}
                  value={announcementSettings.ctaAction}
                  onChange={(e) =>
                    setAnnouncementSettings({
                      ...announcementSettings,
                      ctaAction: e.target.value as AnnouncementCtaAction
                    })
                  }
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl p-2.5 text-xs outline-none"
                >
                  <option value="booking">{isArabic ? 'فتح نافذة حجز موعد' : 'Open Booking Modal'}</option>
                  <option value="courses">{isArabic ? 'صفحة الكورسات والدورات' : 'Courses Page'}</option>
                  <option value="offers">{isArabic ? 'صفحة العروض والباقات' : 'Offers Directory'}</option>
                  <option value="branches">{isArabic ? 'صفحة الفروع والمواقع' : 'Branches Directory'}</option>
                  <option value="portal">{isArabic ? 'بوابة الأسرة' : 'Family Portal'}</option>
                  <option value="whatsapp">{isArabic ? 'تواصل مباشر عبر واتساب' : 'Direct WhatsApp'}</option>
                  <option value="custom_url">{isArabic ? 'رابط مخصص (URL)' : 'Custom URL'}</option>
                  <option value="none">{isArabic ? 'بدون زر إجراء' : 'No CTA Button'}</option>
                </select>
              </div>

              {announcementSettings.ctaAction !== 'none' && (
                <>
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      {isArabic ? 'نص الزر (عربي):' : 'Button Text (AR):'}
                    </label>
                    <input
                      type="text"
                      disabled={!canEditSiteSettings}
                      value={announcementSettings.ctaTextAr}
                      onChange={(e) => setAnnouncementSettings({ ...announcementSettings, ctaTextAr: e.target.value })}
                      placeholder="احجز الآن"
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl p-2.5 text-xs outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      {isArabic ? 'نص الزر (إنجليزي):' : 'Button Text (EN):'}
                    </label>
                    <input
                      type="text"
                      dir="ltr"
                      disabled={!canEditSiteSettings}
                      value={announcementSettings.ctaTextEn}
                      onChange={(e) => setAnnouncementSettings({ ...announcementSettings, ctaTextEn: e.target.value })}
                      placeholder="Book Now"
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl p-2.5 text-xs outline-none"
                    />
                  </div>
                </>
              )}
            </div>

            {announcementSettings.ctaAction === 'custom_url' && (
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  {isArabic ? 'الرابط المخصص (مسار داخلي مثل /services أو رابط خارجي):' : 'Custom URL:'}
                </label>
                <input
                  type="text"
                  dir="ltr"
                  disabled={!canEditSiteSettings}
                  value={announcementSettings.ctaUrl}
                  onChange={(e) => setAnnouncementSettings({ ...announcementSettings, ctaUrl: e.target.value })}
                  placeholder="https://... or /booking"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl p-2.5 text-xs font-mono outline-none"
                />
              </div>
            )}

            {/* Dismissible & Save Footer */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-200 dark:border-white/10">
              <label className="inline-flex items-center gap-2.5 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  disabled={!canEditSiteSettings}
                  checked={announcementSettings.dismissible}
                  onChange={(e) =>
                    setAnnouncementSettings({ ...announcementSettings, dismissible: e.target.checked })
                  }
                  className="w-4 h-4 accent-[#1463D6] rounded"
                />
                <span>{isArabic ? 'السماح للزائر بإخفاء شريط الإشعارات مؤقتاً خلال الجلسة' : 'Allow visitors to dismiss bar during session'}</span>
              </label>

              {canEditSiteSettings && (
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-2xl bg-[#1463D6] hover:bg-[#1152B8] text-white font-black text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{isArabic ? 'حفظ وتطبيق إعدادات شريط الإشعارات' : 'Save Notification Bar Settings'}</span>
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. SUB-TAB: THEME & COLOR PALETTE (#تخصيص لون الثيم العام للموقع بالكامل) */}
      {/* ========================================================================= */}
      {subTab === 'theme' && (
        <div className="space-y-6 animate-in fade-in">
          
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl p-5 shadow-xs space-y-4">
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Palette className="w-5 h-5 text-[#0F766E] dark:text-[#00E5BE]" />
                <span>{isArabic ? 'اختيار باقة ألوان الموقع الجاهزة (Presets)' : 'Ready-made Brand Themes'}</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {isArabic 
                  ? 'اختر لوحة ألوان متناسقة ومصممة خصيصاً للمراكز الطبية والتأهيلية لتطبيقها فوراً على كامل الموقع' 
                  : 'Select an expertly calibrated medical color palette to apply across the whole site instantly'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {THEME_PRESETS.map((preset) => (
                <div
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset)}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                    themeSettings.id === preset.id
                      ? 'border-[#2E86EB] bg-[#2E86EB]/5 dark:bg-[#2E86EB]/10 shadow-md ring-2 ring-[#2E86EB]/30'
                      : 'border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800/60 hover:border-slate-300'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-black text-slate-900 dark:text-white">
                        {isArabic ? preset.nameAr : preset.nameEn}
                      </span>
                      {themeSettings.id === preset.id && (
                        <span className="w-5 h-5 rounded-full bg-[#1463D6] text-white flex items-center justify-center text-[11px] font-black">
                          ✓
                        </span>
                      )}
                    </div>
                  </div>

                  {/* 5 Palette Swatches */}
                  <div className="flex items-center gap-1.5 pt-1">
                    <span className="w-6 h-6 rounded-lg shadow-xs border border-white/20" style={{ backgroundColor: preset.primaryColor }} title="Primary (#2E86EB)" />
                    <span className="w-6 h-6 rounded-lg shadow-xs border border-white/20" style={{ backgroundColor: preset.secondaryColor }} title="Secondary (#FFD23F)" />
                    <span className="w-6 h-6 rounded-lg shadow-xs border border-white/20" style={{ backgroundColor: preset.tertiaryColor || '#22C55E' }} title="Tertiary (#22C55E)" />
                    <span className="w-6 h-6 rounded-lg shadow-xs border border-white/20" style={{ backgroundColor: preset.accentColor }} title="Accent (#FF2D9B)" />
                    <span className="w-6 h-6 rounded-lg shadow-xs border border-white/20" style={{ backgroundColor: preset.neutralColor || '#D9F14A' }} title="Neutral (#D9F14A)" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Custom Hex Color Pickers Form */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#1463D6] dark:text-[#60AFFF]" />
              <span>{isArabic ? 'تخصيص لوحة الألوان الـ 5 المعتمدة (5-Color Palette Editor)' : '5-Color Palette Editor'}</span>
            </h3>

            <form onSubmit={handleSaveCustomTheme} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                
                {/* 1. Primary Color (#2E86EB) */}
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-white/5 space-y-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                    {isArabic ? 'الرئيسي (Primary):' : 'Primary:'}
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={themeSettings.primaryColor}
                      onChange={(e) => setThemeSettings({ ...themeSettings, primaryColor: e.target.value })}
                      className="w-9 h-9 rounded-xl cursor-pointer border-0 bg-transparent shrink-0"
                    />
                    <input
                      type="text"
                      value={themeSettings.primaryColor}
                      onChange={(e) => setThemeSettings({ ...themeSettings, primaryColor: e.target.value })}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl p-2 text-xs font-mono font-bold"
                    />
                  </div>
                </div>

                {/* 2. Secondary Color (#FFD23F) */}
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-white/5 space-y-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                    {isArabic ? 'الثانوي (Secondary):' : 'Secondary:'}
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={themeSettings.secondaryColor}
                      onChange={(e) => setThemeSettings({ ...themeSettings, secondaryColor: e.target.value })}
                      className="w-9 h-9 rounded-xl cursor-pointer border-0 bg-transparent shrink-0"
                    />
                    <input
                      type="text"
                      value={themeSettings.secondaryColor}
                      onChange={(e) => setThemeSettings({ ...themeSettings, secondaryColor: e.target.value })}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl p-2 text-xs font-mono font-bold"
                    />
                  </div>
                </div>

                {/* 3. Tertiary Color (#22C55E) */}
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-white/5 space-y-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                    {isArabic ? 'الثالث (Tertiary):' : 'Tertiary:'}
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={themeSettings.tertiaryColor || '#22C55E'}
                      onChange={(e) => setThemeSettings({ ...themeSettings, tertiaryColor: e.target.value })}
                      className="w-9 h-9 rounded-xl cursor-pointer border-0 bg-transparent shrink-0"
                    />
                    <input
                      type="text"
                      value={themeSettings.tertiaryColor || '#22C55E'}
                      onChange={(e) => setThemeSettings({ ...themeSettings, tertiaryColor: e.target.value })}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl p-2 text-xs font-mono font-bold"
                    />
                  </div>
                </div>

                {/* 4. Accent Color (#FF2D9B) */}
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-white/5 space-y-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                    {isArabic ? 'التمييز (Accent):' : 'Accent:'}
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={themeSettings.accentColor}
                      onChange={(e) => setThemeSettings({ ...themeSettings, accentColor: e.target.value })}
                      className="w-9 h-9 rounded-xl cursor-pointer border-0 bg-transparent shrink-0"
                    />
                    <input
                      type="text"
                      value={themeSettings.accentColor}
                      onChange={(e) => setThemeSettings({ ...themeSettings, accentColor: e.target.value })}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl p-2 text-xs font-mono font-bold"
                    />
                  </div>
                </div>

                {/* 5. Neutral Color (#D9F14A) */}
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-white/5 space-y-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                    {isArabic ? 'المتباين (Neutral):' : 'Neutral:'}
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={themeSettings.neutralColor || '#D9F14A'}
                      onChange={(e) => setThemeSettings({ ...themeSettings, neutralColor: e.target.value })}
                      className="w-9 h-9 rounded-xl cursor-pointer border-0 bg-transparent shrink-0"
                    />
                    <input
                      type="text"
                      value={themeSettings.neutralColor || '#D9F14A'}
                      onChange={(e) => setThemeSettings({ ...themeSettings, neutralColor: e.target.value })}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl p-2 text-xs font-mono font-bold"
                    />
                  </div>
                </div>

              </div>

              {/* Save Theme Button */}
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-[#1668DC] via-[#1463D6] to-[#047857] hover:opacity-95 text-white font-black text-xs shadow-md transition-all cursor-pointer flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{isArabic ? 'حفظ وتطبيق ألوان الباقة' : 'Save & Apply Palette'}</span>
                </button>
              </div>
            </form>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* 3.5 SUB-TAB: ACCREDITATIONS & CERTIFICATIONS (معترف بنا من)               */}
      {/* ========================================================================= */}
      {subTab === 'accreditations' && (
        <AccreditationsSettingsTab 
          onModuleToggle={(key, enabled) => {
            const next = { ...modulesVisibility, [key]: enabled };
            setModulesVisibility(next);
            saveStoredModulesVisibility(next);
            showFeedback(isArabic ? 'تم تحديث حالة ظهور قسم الاعتمادات بالموقع' : 'Accreditations module visibility updated');
          }}
          isModuleEnabled={modulesVisibility.accreditations}
          isSystemAdmin={isSystemAdmin}
        />
      )}

      {/* ========================================================================= */}
      {/* 4. SUB-TAB: PROGRAM PILLARS (# التحكم في الجزء الخاص بمحاور برنامجنا)       */}
      {/* ========================================================================= */}
      {subTab === 'pillars' && (
        <div className="space-y-6 animate-in fade-in">
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#0F766E] dark:text-[#00E5BE]" />
                <span>{isArabic ? 'قائمة محاور برنامجنا التأهيلي' : 'Program Pillars'}</span>
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400">({pillars.length})</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isArabic ? 'تعديل نصوص المحاور، الأيقونات، الألوان، وترتيب ظهورها في الصفحة الرئيسية' : 'Edit titles, descriptions, icons, colors, and order'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleResetPillars}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold cursor-pointer"
              >
                {isArabic ? 'استعادة الافتراضي' : 'Reset'}
              </button>
              <button
                type="button"
                onClick={handleOpenNewPillar}
                className="px-4 py-2 rounded-xl bg-[#0B3B36] hover:bg-[#00E5BE] hover:text-slate-950 text-white text-xs font-black shadow-md cursor-pointer flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>{isArabic ? 'إضافة محور جديد' : 'Add Pillar'}</span>
              </button>
            </div>
          </div>

          {/* Pillars List Cards */}
          <div className="space-y-3">
            {pillars.map((pillar, idx) => (
              <div
                key={pillar.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  pillar.active !== false 
                    ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-white/10 shadow-xs' 
                    : 'bg-slate-50 dark:bg-slate-900/50 border-slate-200/60 opacity-60'
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <span className="w-7 h-7 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center text-xs font-black shrink-0">
                    #{idx + 1}
                  </span>

                  <div className={`w-12 h-12 rounded-xl ${pillar?.bgColor || 'bg-slate-100 dark:bg-slate-800'} border ${pillar?.borderColor || 'border-slate-200 dark:border-white/15'} flex items-center justify-center shrink-0`}>
                    <span className={`text-xs font-black ${pillar?.color || 'text-slate-700 dark:text-slate-200'}`}>{(pillar?.iconName || 'PIL').slice(0, 3)}</span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h4 className="text-sm font-black text-slate-900 dark:text-white truncate">
                        {pillar.titleAr}
                      </h4>
                      {pillar.titleEn && (
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">({pillar.titleEn})</span>
                      )}
                      <span className={`px-2 py-0.2 rounded-full text-[10px] font-black ${
                        pillar.active !== false ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300' : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                      }`}>
                        {pillar.active !== false ? (isArabic ? 'مفعل' : 'Active') : (isArabic ? 'معطل' : 'Disabled')}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                      {pillar.descAr}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => handleMovePillarUp(idx)}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 disabled:opacity-30 cursor-pointer"
                    title={isArabic ? 'تقديم للأمام' : 'Move Up'}
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    disabled={idx === pillars.length - 1}
                    onClick={() => handleMovePillarDown(idx)}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 disabled:opacity-30 cursor-pointer"
                    title={isArabic ? 'تأخير للخلف' : 'Move Down'}
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleTogglePillarActive(pillar.id)}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 cursor-pointer"
                    title={pillar.active !== false ? 'تعطيل' : 'تفعيل'}
                  >
                    {pillar.active !== false ? <Eye className="w-3.5 h-3.5 text-emerald-600" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenEditPillar(pillar)}
                    className="px-3 py-1.5 rounded-xl bg-[#0B3B36] hover:bg-[#00E5BE] hover:text-slate-950 text-white text-xs font-bold cursor-pointer transition-all flex items-center gap-1"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>{isArabic ? 'تعديل' : 'Edit'}</span>
                  </button>

                  {isSystemAdmin && (
                    <button
                      type="button"
                      onClick={() => handleDeletePillar(pillar.id)}
                      className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-600 text-rose-700 dark:text-rose-400 hover:text-white transition-all cursor-pointer"
                      title={isArabic ? 'حذف' : 'Delete'}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Pillar Edit Modal */}
          {isPillarModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3">
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    {isNewPillar ? (isArabic ? 'إضافة محور برنامج جديد' : 'New Program Pillar') : (isArabic ? 'تعديل بيانات المحور' : 'Edit Pillar')}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setIsPillarModalOpen(false)}
                    className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleSavePillarModal} className="space-y-3.5">
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      {isArabic ? 'عنوان المحور بالعربية:' : 'Title (Arabic):'}
                    </label>
                    <input
                      type="text"
                      required
                      value={pillarTitleAr}
                      onChange={(e) => setPillarTitleAr(e.target.value)}
                      placeholder="مثال: تحليل السلوك التطبيقي ABA"
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl p-2.5 text-xs outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      {isArabic ? 'العنوان بالإنجليزية:' : 'Title (English):'}
                    </label>
                    <input
                      type="text"
                      value={pillarTitleEn}
                      onChange={(e) => setPillarTitleEn(e.target.value)}
                      placeholder="Applied Behavior ABA"
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl p-2.5 text-xs outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      {isArabic ? 'وصف المحور بالعربية:' : 'Description (Arabic):'}
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={pillarDescAr}
                      onChange={(e) => setPillarDescAr(e.target.value)}
                      placeholder="وصف تفصيلي لما يقدمه المركز في هذا المحور..."
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl p-2.5 text-xs outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      {isArabic ? 'الأيقونة:' : 'Icon:'}
                    </label>
                    <select
                      value={pillarIcon}
                      onChange={(e) => setPillarIcon(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl p-2.5 text-xs outline-none"
                    >
                      <option value="UserCheck">UserCheck (قيادة وكادر)</option>
                      <option value="Lightbulb">Lightbulb (ابتكار وتطوير)</option>
                      <option value="Heart">Heart (قيم وأثر إنساني)</option>
                      <option value="Star">Star (تميز وسلوك)</option>
                      <option value="Globe">Globe (بيئة ومجتمع)</option>
                      <option value="ShieldCheck">ShieldCheck (أمان واعتماد)</option>
                      <option value="Award">Award (جودة وتكريم)</option>
                      <option value="Sparkles">Sparkles (تألق ورعاية)</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-white/10">
                    <button
                      type="button"
                      onClick={() => setIsPillarModalOpen(false)}
                      className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold cursor-pointer"
                    >
                      {isArabic ? 'إلغاء' : 'Cancel'}
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-[#0B3B36] hover:bg-[#00E5BE] hover:text-slate-950 text-white text-xs font-black shadow-md cursor-pointer transition-all"
                    >
                      {isArabic ? 'حفظ المحور' : 'Save'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

        </div>
      )}

      {/* ================================================================================= */}
      {/* 5. SUB-TAB: SOCIAL LINKS (# تخصيص روابط السوشيال ميديا في الفوتر)                  */}
      {/* ================================================================================= */}
      {subTab === 'social' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl p-5 sm:p-6 shadow-xs space-y-5 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-4">
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Share2 className="w-5 h-5 text-[#0F766E] dark:text-[#00E5BE]" />
                <span>{isArabic ? 'تخصيص روابط شبكات التواصل الاجتماعي في الفوتر' : 'Social Media Links Customization'}</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {isArabic ? 'تعديل روابط منصات السوشيال ميديا التي تظهر في تذييل الموقع وأزرار التواصل' : 'Configure destination URLs for all footer social buttons'}
              </p>
            </div>

            <button
              type="button"
              onClick={handleResetSocial}
              className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold cursor-pointer"
            >
              {isArabic ? 'استعادة الافتراضي' : 'Reset'}
            </button>
          </div>

          <form onSubmit={handleSaveSocial} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* WhatsApp */}
              <div>
                <label className="text-xs font-black text-slate-700 dark:text-slate-300 block mb-1">
                  {isArabic ? 'رابط الواتساب (WhatsApp Direct Link):' : 'WhatsApp URL:'}
                </label>
                <input
                  type="text"
                  value={socialSettings.whatsapp}
                  onChange={(e) => setSocialSettings({ ...socialSettings, whatsapp: e.target.value })}
                  placeholder="https://wa.me/966575100100"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl p-2.5 text-xs font-mono"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="text-xs font-black text-slate-700 dark:text-slate-300 block mb-1">
                  {isArabic ? 'رقم الهاتف للاتصال والواتساب:' : 'Contact Phone Number:'}
                </label>
                <input
                  type="text"
                  value={socialSettings.phone}
                  onChange={(e) => setSocialSettings({ ...socialSettings, phone: e.target.value })}
                  placeholder="0575100100"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl p-2.5 text-xs font-mono"
                />
              </div>

              {/* X (Twitter) */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  {isArabic ? 'رابط منصة إكس (X / Twitter):' : 'X (Twitter) URL:'}
                </label>
                <input
                  type="text"
                  value={socialSettings.x}
                  onChange={(e) => setSocialSettings({ ...socialSettings, x: e.target.value })}
                  placeholder="https://x.com/rabacenter"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl p-2.5 text-xs font-mono"
                />
              </div>

              {/* Instagram */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  {isArabic ? 'رابط إنستغرام (Instagram):' : 'Instagram URL:'}
                </label>
                <input
                  type="text"
                  value={socialSettings.instagram}
                  onChange={(e) => setSocialSettings({ ...socialSettings, instagram: e.target.value })}
                  placeholder="https://instagram.com/rabacenter"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl p-2.5 text-xs font-mono"
                />
              </div>

              {/* TikTok */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  {isArabic ? 'رابط تيك توك (TikTok):' : 'TikTok URL:'}
                </label>
                <input
                  type="text"
                  value={socialSettings.tiktok}
                  onChange={(e) => setSocialSettings({ ...socialSettings, tiktok: e.target.value })}
                  placeholder="https://tiktok.com/@rabacenter"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl p-2.5 text-xs font-mono"
                />
              </div>

              {/* YouTube */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  {isArabic ? 'رابط قناة يوتيوب (YouTube):' : 'YouTube URL:'}
                </label>
                <input
                  type="text"
                  value={socialSettings.youtube}
                  onChange={(e) => setSocialSettings({ ...socialSettings, youtube: e.target.value })}
                  placeholder="https://youtube.com/@rabacenter"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl p-2.5 text-xs font-mono"
                />
              </div>

              {/* LinkedIn */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  {isArabic ? 'رابط صفحة لينكد إن (LinkedIn):' : 'LinkedIn URL:'}
                </label>
                <input
                  type="text"
                  value={socialSettings.linkedin}
                  onChange={(e) => setSocialSettings({ ...socialSettings, linkedin: e.target.value })}
                  placeholder="https://linkedin.com/company/rabacenter"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl p-2.5 text-xs font-mono"
                />
              </div>

              {/* Snapchat */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  {isArabic ? 'رابط سناب شات (Snapchat):' : 'Snapchat URL:'}
                </label>
                <input
                  type="text"
                  value={socialSettings.snapchat}
                  onChange={(e) => setSocialSettings({ ...socialSettings, snapchat: e.target.value })}
                  placeholder="https://snapchat.com/add/rabacenter"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl p-2.5 text-xs font-mono"
                />
              </div>

            </div>

            <div className="flex justify-end pt-3 border-t border-slate-200 dark:border-white/10">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-2xl bg-[#0B3B36] hover:bg-[#00E5BE] hover:text-slate-950 text-white font-black text-xs shadow-md transition-all cursor-pointer flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>{isArabic ? 'حفظ روابط التواصل' : 'Save Social Links'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. SUB-TAB: FOOTER CONTENT (#التخصيص و التعديل بأجزاء الفوتر)              */}
      {/* ========================================================================= */}
      {subTab === 'footer' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl p-5 sm:p-6 shadow-xs space-y-5 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-4">
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Footprints className="w-5 h-5 text-[#0F766E] dark:text-[#00E5BE]" />
                <span>{isArabic ? 'تخصيص وتعديل أجزاء ومحتوى الفوتر' : 'Footer Content Customization'}</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {isArabic ? 'التحكم بنص نبذة المركز، بيانات الاتصال، التراخيص الرسمية، وحقوق النشر' : 'Customize center about text, contact info, licenses, and copyright'}
              </p>
            </div>

            <button
              type="button"
              onClick={handleResetFooter}
              className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold cursor-pointer"
            >
              {isArabic ? 'استعادة الافتراضي' : 'Reset'}
            </button>
          </div>

          <form onSubmit={handleSaveFooter} className="space-y-4">
            
            {/* About text */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-700 dark:text-slate-300 block">
                {isArabic ? 'نص نبذة المركز في الفوتر (عربي):' : 'About Center Text (Arabic):'}
              </label>
              <textarea
                rows={3}
                value={footerSettings.aboutTextAr}
                onChange={(e) => setFooterSettings({ ...footerSettings, aboutTextAr: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl p-2.5 text-xs outline-none"
              />
            </div>

            {/* Address & Hours */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  {isArabic ? 'العنوان والموقع الجغرافي:' : 'Address:'}
                </label>
                <input
                  type="text"
                  value={footerSettings.addressAr}
                  onChange={(e) => setFooterSettings({ ...footerSettings, addressAr: e.target.value })}
                  placeholder="المملكة العربية السعودية، الرياض - حي الصحافة"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl p-2.5 text-xs outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  {isArabic ? 'أوقات وساعات العمل:' : 'Working Hours:'}
                </label>
                <input
                  type="text"
                  value={footerSettings.hoursAr}
                  onChange={(e) => setFooterSettings({ ...footerSettings, hoursAr: e.target.value })}
                  placeholder="الأحد - الخميس: 8:00 ص - 8:00 م"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl p-2.5 text-xs outline-none"
                />
              </div>
            </div>

            {/* Email & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  {isArabic ? 'البريد الإلكتروني الرسمي:' : 'Official Email:'}
                </label>
                <input
                  type="email"
                  value={footerSettings.email}
                  onChange={(e) => setFooterSettings({ ...footerSettings, email: e.target.value })}
                  placeholder="info@rabacenters.com"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl p-2.5 text-xs font-mono outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  {isArabic ? 'شعار الاعتماد الرسمي (Accreditation Badge):' : 'Accreditation Badge Text:'}
                </label>
                <input
                  type="text"
                  value={footerSettings.accreditationBadgeAr}
                  onChange={(e) => setFooterSettings({ ...footerSettings, accreditationBadgeAr: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl p-2.5 text-xs outline-none"
                />
              </div>
            </div>

            {/* License & Quality Protocols */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  {isArabic ? 'بيان الترخيص الرسمي من وزارة الصحة:' : 'MOH Official License Text:'}
                </label>
                <input
                  type="text"
                  value={footerSettings.officialLicenseAr}
                  onChange={(e) => setFooterSettings({ ...footerSettings, officialLicenseAr: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl p-2.5 text-xs outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  {isArabic ? 'نص بروتوكولات الجودة والاعتمادات:' : 'Quality Protocols Description:'}
                </label>
                <input
                  type="text"
                  value={footerSettings.qualityProtocolsAr}
                  onChange={(e) => setFooterSettings({ ...footerSettings, qualityProtocolsAr: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl p-2.5 text-xs outline-none"
                />
              </div>
            </div>

            {/* Copyright Statement */}
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                {isArabic ? 'نص حقوق الملكية والنشر:' : 'Copyright Statement:'}
              </label>
              <input
                type="text"
                value={footerSettings.copyrightAr}
                onChange={(e) => setFooterSettings({ ...footerSettings, copyrightAr: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl p-2.5 text-xs outline-none"
              />
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-200 dark:border-white/10">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-2xl bg-[#0B3B36] hover:bg-[#00E5BE] hover:text-slate-950 text-white font-black text-xs shadow-md transition-all cursor-pointer flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>{isArabic ? 'حفظ إعدادات الفوتر' : 'Save Footer Settings'}</span>
              </button>
            </div>

          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. SUB-TAB: SITE MODULES VISIBILITY (#التحكم في جميع المديولات داخل الموقع) */}
      {/* ========================================================================= */}
      {subTab === 'modules' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl p-5 sm:p-6 shadow-xs space-y-5 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-4">
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Layout className="w-5 h-5 text-[#0F766E] dark:text-[#00E5BE]" />
                <span>{isArabic ? 'التحكم في ظهور مديولات وأقسام الموقع الرئيسية' : 'Site Modules Visibility Control'}</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {isArabic ? 'إظهار أو إخفاء أي قسم أو مديول في الموقع بنقرة زر واحدة' : 'Enable or disable any section module on the website instantly'}
              </p>
            </div>

            <button
              type="button"
              onClick={handleResetModules}
              className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold cursor-pointer"
            >
              {isArabic ? 'تفعيل الكل' : 'Enable All'}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {/* Synchronized Header Notification Bar Toggle */}
            <div
              className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                announcementSettings.enabled
                  ? 'bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-500/30'
                  : 'bg-slate-100/50 dark:bg-slate-900/30 border-dashed border-slate-300 dark:border-white/5 opacity-75'
              }`}
            >
              <div className="min-w-0 flex-1">
                <span className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Megaphone className="w-3.5 h-3.5 text-[#1463D6] dark:text-[#60AFFF] shrink-0" />
                  <span>{isArabic ? 'شريط الإشعارات أسفل الهيدر' : 'Header Notification Bar'}</span>
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5 block">
                  {isArabic ? 'شريط تنبيهات تفاعلي متوافق مع ثيم الموقع أسفل الهيدر' : 'Theme-aligned announcement bar directly below the header'}
                </span>
              </div>

              <button
                type="button"
                disabled={!canEditSiteSettings}
                onClick={handleToggleAnnouncementEnabled}
                className={`w-11 h-6 rounded-full transition-colors cursor-pointer relative p-0.5 shrink-0 ${
                  announcementSettings.enabled ? 'bg-[#00E5BE]' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                  announcementSettings.enabled ? 'ltr:translate-x-5 rtl:-translate-x-5' : 'translate-x-0'
                }`} />
              </button>
            </div>

            {[
              { key: 'hero', labelAr: 'سلايدر العرض الرئيسي (Hero Section)', descAr: 'البانر الترحيبي والصورة الدائرية ونموذج التواصل السريع' },
              { key: 'accreditations', labelAr: 'اعتمادات وشهادات (معترف بنا من)', descAr: 'شريط جهات الاعتماد الرسمية (ISO, IBAO, QABA, BACB, ضمان, سباهي CBAHI)' },
              { key: 'branches', labelAr: 'فروعنا المعتمدة بالمملكة (Branches)', descAr: 'فروع الرياض، الخبر، الأحساء، الخرج مع خرائط Google وروابط الواتساب المباشرة' },
              { key: 'pillars', labelAr: 'محاور برنامجنا (Program Pillars)', descAr: 'بطاقات التميز الإكلينيكي والابتكار وقيم المركز' },
              { key: 'stats', labelAr: 'شريط الإحصائيات والأرقام (Stats Bar)', descAr: 'الأرقام التقديرية وساعات التدخل ومعدلات الرضا' },
              { key: 'services', labelAr: 'الخدمات وباقات التأهيل ومعلم الظل', descAr: 'برامج ABA والتخاطب والعلاج الوظيفي والدمج المدرسي' },
              { key: 'courses', labelAr: 'سلايدر الكورسات والدورات ومنصة رابا التعليمية', descAr: 'دورات تأهيل البورد QABA, ABAT, CEUs, وورش العمل الإكلينيكية' },
              { key: 'specialists', labelAr: 'الكوادر الطبية واستكشاف السير الذاتية', descAr: 'سلايدر الأخصائيين والشهادات وحجز المواعيد معهم' },
              { key: 'offers', labelAr: 'عروض وخصومات التأهيل (Offers)', descAr: 'باقات الخصم الخاصة والتقييم المجاني' },
              { key: 'blog', labelAr: 'سلايدر المدونات والمقالات الطبية (Blog)', descAr: 'المقالات المعرفية والإرشادات الأسرية' },
              { key: 'reviews', labelAr: 'تقييمات وتجارب أولياء الأمور (Reviews)', descAr: 'قصص النجاح وتقييمات العائلات الموثقة' },
              { key: 'footer', labelAr: 'تذييل الصفحة (Footer)', descAr: 'روابط السوشيال ميديا والتواصل والاعتمادات الرسمية' }
            ].map((mod) => {
              const isVisible = modulesVisibility[mod.key as keyof SiteModulesVisibility];
              return (
                <div
                  key={mod.key}
                  className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                    isVisible
                      ? 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-white/10'
                      : 'bg-slate-100/50 dark:bg-slate-900/30 border-dashed border-slate-300 dark:border-white/5 opacity-60'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <span className="text-xs font-black text-slate-900 dark:text-white block">
                      {mod.labelAr}
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                      {mod.descAr}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleToggleModule(mod.key as keyof SiteModulesVisibility)}
                    className={`w-11 h-6 rounded-full transition-colors cursor-pointer relative p-0.5 shrink-0 ${
                      isVisible ? 'bg-[#00E5BE]' : 'bg-slate-300 dark:bg-slate-700'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                      isVisible ? 'ltr:translate-x-5 rtl:-translate-x-5' : 'translate-x-0'
                    }`} />
                  </button>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* 8. Sub-Tab: Persistent Cloud & File Storage Sync */}
      {subTab === 'sync' && (
        <PersistentSyncTab onFeedback={showFeedback} />
      )}

    </div>
  );
};
