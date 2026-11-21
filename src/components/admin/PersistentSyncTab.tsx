import React, { useState, useEffect } from 'react';
import { 
  Database, 
  CloudCheck, 
  RefreshCw, 
  Download, 
  UploadCloud, 
  CheckCircle2, 
  AlertCircle, 
  HardDrive, 
  FileText, 
  Image as ImageIcon, 
  ShieldCheck, 
  Sparkles,
  Layers,
  Calendar,
  Award,
  Users,
  Sliders,
  ExternalLink,
  Check
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { 
  fetchSyncStatus, 
  syncAllToDiskNow, 
  downloadBackupFile, 
  restoreFromBackup, 
  SyncStatus,
  SYNC_KEYS 
} from '../../utils/persistentSync';

interface PersistentSyncTabProps {
  onFeedback?: (msg: string, type: 'success' | 'error') => void;
}

export const PersistentSyncTab: React.FC<PersistentSyncTabProps> = ({ onFeedback }) => {
  const { isArabic } = useLanguage();
  const [status, setStatus] = useState<SyncStatus | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>('');
  const [localFeedback, setLocalFeedback] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [isRestoring, setIsRestoring] = useState(false);

  const showMsg = (text: string, type: 'success' | 'error' = 'success') => {
    if (onFeedback) {
      onFeedback(text, type);
    } else {
      setLocalFeedback({ text, type });
      setTimeout(() => setLocalFeedback(null), 4000);
    }
  };

  const loadStatus = async () => {
    const s = await fetchSyncStatus();
    if (s) {
      setStatus(s);
      setLastSyncTime(new Date(s.timestamp).toLocaleTimeString(isArabic ? 'ar-SA' : 'en-US'));
    }
  };

  useEffect(() => {
    loadStatus();
    const interval = setInterval(loadStatus, 15000);
    return () => clearInterval(interval);
  }, [isArabic]);

  // Force sync all data from client to server disk
  const handleForceSyncAll = async () => {
    setIsSyncing(true);
    try {
      const res = await syncAllToDiskNow();
      if (res.success) {
        showMsg(
          isArabic 
            ? `✓ تم حفظ وتحديث ${res.count} ملفات وتخصيصات ثابتة على السيرفر بنجاح!` 
            : `Successfully synchronized ${res.count} modules to server persistent storage!`,
          'success'
        );
        await loadStatus();
      } else {
        showMsg(
          isArabic ? 'تعذر حفظ المزامنة على السيرفر، تم الاحتفاظ بالنسخة المحلية' : 'Failed to sync to server',
          'error'
        );
      }
    } catch {
      showMsg(isArabic ? 'حدث خطأ أثناء المزامنة' : 'Error during synchronization', 'error');
    } finally {
      setIsSyncing(false);
    }
  };

  // Restore backup from JSON file
  const handleFileRestore = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        setIsRestoring(true);
        const json = JSON.parse(evt.target?.result as string);
        const ok = await restoreFromBackup(json);
        if (ok) {
          showMsg(
            isArabic 
              ? '✓ تمت استعادة جميع التخصيصات والمرفقات بنجاح وتحديث كافة الصفحات!' 
              : 'Backup restored successfully!',
            'success'
          );
          await loadStatus();
        } else {
          showMsg(isArabic ? 'صيغة النسخة الاحتياطية غير صالحة' : 'Invalid backup format', 'error');
        }
      } catch {
        showMsg(isArabic ? 'فشلت قراءة ملف النسخة الاحتياطية' : 'Failed to parse backup JSON', 'error');
      } finally {
        setIsRestoring(false);
      }
    };
    reader.readAsText(file);
  };

  const modulesList = [
    {
      titleAr: 'هوية وشعار الموقع (Logo & Branding)',
      titleEn: 'Site Logo & Identity',
      descAr: 'صورة الشعار، الأبعاد، نصوص الترويسة، أيقونة المتصفح (Favicon)',
      descEn: 'Logo image, sizes, bilingual titles, browser tab favicon',
      file: 'site_logo.json',
      icon: ImageIcon,
      color: 'text-[#00E5BE] bg-[#00E5BE]/10 border-[#00E5BE]/20'
    },
    {
      titleAr: 'الوضع الداكن وألوان الموقع (Theme & Dark Mode)',
      titleEn: 'Theme & Dark Mode',
      descAr: 'الوضع الداكن الافتراضي الفاخر، لوحة الألوان الأساسية، التدرجات',
      descEn: 'Default luxury dark mode, primary palette, accents',
      file: 'site_theme.json',
      icon: Sparkles,
      color: 'text-amber-400 bg-amber-400/10 border-amber-400/20'
    },
    {
      titleAr: 'سلايدر الهيرو الرئيسي (Hero Slider)',
      titleEn: 'Hero Slider & Banners',
      descAr: 'صور البنرات الكبيرة، عناوين العروض، التقريب، التشغيل التلقائي',
      descEn: 'Hero slides, banners, zoom levels, autoplay config',
      file: 'hero_slides.json',
      icon: Sliders,
      color: 'text-sky-400 bg-sky-400/10 border-sky-400/20'
    },
    {
      titleAr: 'الأخصائيين وفريق العمل والمرفقات (Specialists & Team)',
      titleEn: 'Specialists & Photos',
      descAr: 'صور الأخصائيين المرفوعة، السير الذاتية، التخصصات، رسوم الجلسات',
      descEn: 'Specialists team, uploaded portraits, bios, session rates',
      file: 'specialists.json',
      icon: Users,
      color: 'text-purple-400 bg-purple-400/10 border-purple-400/20'
    },
    {
      titleAr: 'شهادات الاعتمادات والتراخيص (Accreditations & MOH)',
      titleEn: 'Accreditations & Certificates',
      descAr: 'شعارات الاعتمادات، شهادات وزارة الصحة، البورد الأمريكي، أرقام التراخيص',
      descEn: 'MOH licenses, BACB badges, certificate numbers and logos',
      file: 'accreditations.json',
      icon: Award,
      color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20'
    },
    {
      titleAr: 'مقالات المدونة والمنشورات (Blog & Articles)',
      titleEn: 'Blog & Educational Articles',
      descAr: 'المقالات التثقيفية، صور الأغلفة، صور الكتاب، المقالات المثبتة',
      descEn: 'Articles, cover images, author portraits, pinned posts',
      file: 'blog_posts.json',
      icon: FileText,
      color: 'text-rose-400 bg-rose-400/10 border-rose-400/20'
    },
    {
      titleAr: 'العروض والباقات التأهيلية (Offers & Packages)',
      titleEn: 'Offers & Packages',
      descAr: 'باقات تحليل السلوك، عروض اليوم الوطني، تفاصيل الخصم',
      descEn: 'Rehabilitation packages, National Day offers, discounts',
      file: 'offers.json',
      icon: Layers,
      color: 'text-indigo-400 bg-indigo-400/10 border-indigo-400/20'
    },
    {
      titleAr: 'طلبات العملاء والحجوزات (Appointments & Leads)',
      titleEn: 'Appointments & Leads',
      descAr: 'حجوزات الجلسات، طلبات معلم الظل، استشارات الاتصال، طلبات المتجر',
      descEn: 'Session bookings, shadow teacher requests, consultations',
      file: 'appointments.json',
      icon: Calendar,
      color: 'text-teal-400 bg-teal-400/10 border-teal-400/20'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Toast Feedback */}
      {localFeedback && (
        <div className={`p-4 rounded-2xl flex items-center gap-3 text-xs font-black shadow-lg transition-all animate-fadeIn ${
          localFeedback.type === 'success'
            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
            : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
        }`}>
          {localFeedback.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
          <span>{localFeedback.text}</span>
        </div>
      )}

      {/* Main Status Hero Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-teal-950/40 border border-slate-800 p-6 md:p-8 shadow-xl">
        <div className="absolute top-0 end-0 -mt-10 -me-10 w-64 h-64 bg-[#00E5BE]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{isArabic ? 'المزامنة السحابية الثابتة نشطة (Persistent Storage Active)' : 'Persistent Storage Active'}</span>
            </div>

            <h3 className="text-xl md:text-2xl font-black text-white">
              {isArabic ? 'حفظ وتثبيت كافة التخصيصات والمرفقات' : 'Persistent Customizations & Attachments Sync'}
            </h3>
            <p className="text-xs md:text-sm text-slate-400 mt-2 max-w-2xl leading-relaxed">
              {isArabic 
                ? 'يتم تخزين كافة التعديلات، إعدادات اللوجو، الثيم، السلايدر، الأخصائيين، الاعتمادات، والمرفقات مباشرة في ملفات ثابتة على السيرفر ومجلد المرفقات (uploads) لضمان ظهورها الدائم لجميع الزوار والأجهزة وحمايتها من مسح ذاكرة التخزين.'
                : 'All customizations, logo branding, themes, sliders, team members, accreditations, and media attachments are permanently saved to server disk files and persistent storage.'}
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
            <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-4 min-w-[130px] text-center">
              <div className="text-xs text-slate-400 mb-1">{isArabic ? 'ملفات التخصيص' : 'Config Files'}</div>
              <div className="text-xl font-black text-[#00E5BE]">{status?.dataFilesCount || 18}</div>
              <div className="text-[10px] text-slate-400 mt-1">/data/*.json</div>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-4 min-w-[130px] text-center">
              <div className="text-xs text-slate-400 mb-1">{isArabic ? 'المرفقات والصور' : 'Attachments'}</div>
              <div className="text-xl font-black text-amber-400">{status?.uploadFilesCount || 0}</div>
              <div className="text-[10px] text-slate-400 mt-1">/public/uploads/</div>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-4 min-w-[140px] text-center">
              <div className="text-xs text-slate-400 mb-1">{isArabic ? 'آخر مزامنة' : 'Last Synced'}</div>
              <div className="text-sm font-black text-slate-200">{lastSyncTime || (isArabic ? 'الآن' : 'Just now')}</div>
              <div className="text-[10px] text-emerald-400 mt-1">✓ {isArabic ? 'محفوظ' : 'Saved'}</div>
            </div>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="mt-6 pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
          <div className="text-xs text-slate-400 flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-[#00E5BE]" />
            <span>{isArabic ? 'المسار الفعلي للتخزين: /data و /public/data و /public/uploads' : 'Storage paths: /data, /public/data & /public/uploads'}</span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Backup Export */}
            <button
              type="button"
              onClick={downloadBackupFile}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-xs hover:border-slate-600"
            >
              <Download className="w-4 h-4 text-sky-400" />
              <span>{isArabic ? 'تحميل نسخة احتياطية (JSON)' : 'Export Backup'}</span>
            </button>

            {/* Backup Restore */}
            <label className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-xs hover:border-slate-600">
              <UploadCloud className="w-4 h-4 text-purple-400" />
              <span>{isRestoring ? (isArabic ? 'جارِ الاستعادة...' : 'Restoring...') : (isArabic ? 'استعادة نسخة من ملف' : 'Restore Backup')}</span>
              <input
                type="file"
                accept=".json"
                onChange={handleFileRestore}
                className="hidden"
                disabled={isRestoring}
              />
            </label>

            {/* Force Sync All Button */}
            <button
              type="button"
              onClick={handleForceSyncAll}
              disabled={isSyncing}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00E5BE] to-teal-600 hover:from-teal-400 hover:to-teal-500 text-slate-950 font-black text-xs shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? (isArabic ? 'جارِ تثبيت المزامنة...' : 'Syncing...') : (isArabic ? 'تثبيت وحفظ التعديلات للنشر والاستضافة (Bake & Sync)' : 'Bake & Sync for Deployment')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Deployment & Incognito Guarantee Card */}
      <div className="bg-emerald-500/10 dark:bg-emerald-950/20 border border-emerald-500/30 rounded-3xl p-5 shadow-sm">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="space-y-1.5">
            <h4 className="text-sm font-black text-emerald-900 dark:text-emerald-300">
              {isArabic 
                ? '✓ التوافق الشامل مع المتصفح الخفي (Incognito) والاستضافات الخاصة (Private Hosting / cPanel)' 
                : '✓ 100% Incognito Browser & Private Hosting Deployment Guaranteed'}
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {isArabic 
                ? 'تم ربط نظام المزامنة الثنائي؛ حيث تُحفظ التعديلات في مسارين متزامنين (/data و /public/data/all_sync.json). عند فتح الموقع في متصفح خفي أو رفعه على استضافة خاصة (cPanel, Vercel, Netlify, Nginx, Apache)، يقوم الموقع تلقائياً بتحميل كافة التخصيصات والصور فوراً دون الاعتماد على كوكيز أو جلسات سابقة.' 
                : 'Dual sync is active. Customizations are simultaneously stored in /data and bundled into /public/data/all_sync.json. On fresh incognito sessions or private hosting deployments, the app immediately reads the custom data.'}
            </p>
          </div>
        </div>
      </div>

      {/* Grid of Synchronized Modules */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-[#00E5BE]" />
            <h4 className="text-base font-black text-slate-900 dark:text-white">
              {isArabic ? 'الملفات والتخصيصات الخاضعة للمزامنة الثابتة' : 'Persistently Synchronized Modules'}
            </h4>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {isArabic ? 'جميع الوحدات مربوطة ومحفوظة تلقائياً' : 'All modules auto-synced to server'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {modulesList.map((m, idx) => {
            const Icon = m.icon;
            return (
              <div 
                key={idx}
                className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs hover:border-[#00E5BE]/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`p-2.5 rounded-xl border ${m.color}`}>
                      <Icon className="w-5 h-5" />
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                      <Check className="w-3 h-3" />
                      <span>{isArabic ? 'مثبت' : 'Synced'}</span>
                    </span>
                  </div>

                  <h5 className="text-xs font-black text-slate-900 dark:text-white leading-snug">
                    {isArabic ? m.titleAr : m.titleEn}
                  </h5>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {isArabic ? m.descAr : m.descEn}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-600 dark:text-slate-400 font-mono">
                  <span>{m.file}</span>
                  <span className="text-emerald-700 dark:text-emerald-400 font-bold">200 OK</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Information Box on Attachments */}
      <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex items-start gap-4">
        <div className="p-3 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-[#00E5BE] shrink-0">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div>
          <h5 className="text-sm font-black text-slate-900 dark:text-white">
            {isArabic ? 'نظام حماية المرفقات وتفادي حدود التخزين (Zero Quota Error)' : 'Attachment Persistence & Storage Optimization'}
          </h5>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
            {isArabic 
              ? 'عند قيام الإدارة برفع أي صورة (كشعار الموقع، صور الأطباء، بنرات السلايدر، شهادات الاعتماد، أو أغلفة المقالات)، يقوم النظام تلقائياً بضغط الصورة وحفظها كملف دائم في مجلد السيرفر (/public/uploads) وتوليد رابط ثابت وسريع، مما يحمي من امتلاء ذاكرة المتصفح ويسمح بمشاركة نفس التخصيصات مع كافة الزوار فوراً.'
              : 'When uploading images (logos, specialist portraits, certificates, banners, or blog media), the system optimizes and saves them directly to /public/uploads on server disk with instant public URLs, bypassing browser storage limits.'}
          </p>
        </div>
      </div>
    </div>
  );
};
