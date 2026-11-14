import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  ShieldCheck, 
  ArrowUp,
  Instagram,
  Youtube,
  Linkedin,
  MessageCircle,
  BookOpen,
  Smartphone,
  Download,
  Sparkles
} from 'lucide-react';
import { RabaLogo } from './RabaLogo';
import { useLanguage } from '../context/LanguageContext';
import { 
  getStoredSocialSettings, 
  getStoredFooterSettings, 
  SocialLinksSettings, 
  FooterSettings 
} from '../data/siteCustomizer';
import { PWAInstallModal, AppleIcon, AndroidIcon } from './PWAInstallModal';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface FooterProps {
  onOpenAdmin?: () => void;
  onOpenBlogPage?: () => void;
}

// Custom SVGs for platforms not directly in standard icons
const XIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" className={`${className} fill-current`} aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const TikTokIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" className={`${className} fill-current`} aria-hidden="true">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-1.01v8.43c0 2.26-.85 4.47-2.43 6.03-1.58 1.57-3.79 2.44-6.05 2.45-3.08.01-6-1.6-7.53-4.22-1.54-2.61-1.39-5.96.38-8.43 1.76-2.47 4.79-3.76 7.79-3.23.01 1.45.01 2.9.01 4.35-1.55-.42-3.29-.12-4.52.84-1.23.96-1.84 2.58-1.56 4.12.28 1.54 1.54 2.76 3.1 3.03 1.56.27 3.19-.38 4.07-1.67.62-.91.86-2.02.85-3.12V.02z" />
  </svg>
);

const SnapchatIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" className={`${className} fill-current`} aria-hidden="true">
    <path d="M12.165 2.004c-3.15 0-5.46 2.378-5.46 5.568 0 .49.07 1.05.21 1.645-.735.14-1.54.49-1.925.875-.385.385-.28 1.015.07 1.47.385.49 1.19.7 1.82.7.21 0 .42-.035.63-.07.21.665.595 1.295 1.12 1.82-1.575.49-3.78 1.715-4.13 3.605-.07.385.14.77.525.875 1.575.455 3.325.28 4.69-.455.56 1.4 1.82 2.03 2.45 2.03.63 0 1.89-.63 2.45-2.03 1.365.735 3.115.91 4.69.455.385-.105.595-.49.525-.875-.35-1.89-2.555-3.115-4.13-3.605.525-.525.91-1.155 1.12-1.82.21.035.42.07.63.07.63 0 1.435-.21 1.82-.7.35-.455.455-1.085.07-1.47-.385-.385-1.19-.735-1.925-.875.14-.595.21-1.155.21-1.645 0-3.19-2.31-5.568-5.46-5.568z" />
  </svg>
);

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin, onOpenBlogPage }) => {
  const { t, isArabic } = useLanguage();
  const { isIOS } = usePWAInstall();
  const [social, setSocial] = useState<SocialLinksSettings>(() => getStoredSocialSettings());
  const [footer, setFooter] = useState<FooterSettings>(() => getStoredFooterSettings());
  const [isPwaModalOpen, setIsPwaModalOpen] = useState(false);
  const [pwaModalTab, setPwaModalTab] = useState<'ios' | 'android'>('android');

  useEffect(() => {
    const handleSocialUpdate = () => setSocial(getStoredSocialSettings());
    const handleFooterUpdate = () => setFooter(getStoredFooterSettings());

    window.addEventListener('raba_social_updated', handleSocialUpdate);
    window.addEventListener('raba_footer_updated', handleFooterUpdate);
    window.addEventListener('raba_persistent_sync_ready', handleSocialUpdate);
    window.addEventListener('raba_persistent_sync_ready', handleFooterUpdate);

    return () => {
      window.removeEventListener('raba_social_updated', handleSocialUpdate);
      window.removeEventListener('raba_footer_updated', handleFooterUpdate);
      window.removeEventListener('raba_persistent_sync_ready', handleSocialUpdate);
      window.removeEventListener('raba_persistent_sync_ready', handleFooterUpdate);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const socialLinks = [
    {
      id: 'x',
      name: isArabic ? 'منصة إكس' : 'X (Twitter)',
      href: social.x || 'https://x.com/rabacenter',
      icon: XIcon,
      hoverClass: 'hover:bg-slate-950 hover:text-white dark:hover:bg-white dark:hover:text-slate-950 border-slate-300 dark:border-white/15',
      badge: '@rabacenter'
    },
    {
      id: 'instagram',
      name: isArabic ? 'إنستغرام' : 'Instagram',
      href: social.instagram || 'https://instagram.com/rabacenter',
      icon: Instagram,
      hoverClass: 'hover:bg-gradient-to-tr hover:from-[#F58529] hover:via-[#DD2A7B] hover:to-[#8134AF] hover:text-white hover:border-transparent border-slate-300 dark:border-white/15',
      badge: '@rabacenter'
    },
    {
      id: 'tiktok',
      name: isArabic ? 'تيك توك' : 'TikTok',
      href: social.tiktok || 'https://tiktok.com/@rabacenter',
      icon: TikTokIcon,
      hoverClass: 'hover:bg-black hover:text-[#00F2FE] hover:border-slate-800 dark:hover:bg-slate-900 border-slate-300 dark:border-white/15',
      badge: '@rabacenter'
    },
    {
      id: 'youtube',
      name: isArabic ? 'يوتيوب' : 'YouTube',
      href: social.youtube || 'https://youtube.com/@rabacenter',
      icon: Youtube,
      hoverClass: 'hover:bg-[#FF0000] hover:text-white hover:border-transparent border-slate-300 dark:border-white/15',
      badge: '@rabacenter'
    },
    {
      id: 'linkedin',
      name: isArabic ? 'لينكد إن' : 'LinkedIn',
      href: social.linkedin || 'https://linkedin.com/company/rabacenter',
      icon: Linkedin,
      hoverClass: 'hover:bg-[#0A66C2] hover:text-white hover:border-transparent border-slate-300 dark:border-white/15',
      badge: 'rabacenter'
    },
    {
      id: 'whatsapp',
      name: isArabic ? 'واتساب' : 'WhatsApp',
      href: social.whatsapp || 'https://wa.me/966575100100',
      icon: MessageCircle,
      hoverClass: 'hover:bg-[#25D366] hover:text-white hover:border-transparent border-slate-300 dark:border-white/15',
      badge: social.phone || '0575100100'
    },
    {
      id: 'snapchat',
      name: isArabic ? 'سناب شات' : 'Snapchat',
      href: social.snapchat || 'https://snapchat.com/add/rabacenter',
      icon: SnapchatIcon,
      hoverClass: 'hover:bg-[#FFFC00] hover:text-slate-950 hover:border-transparent border-slate-300 dark:border-white/15',
      badge: 'rabacenter'
    }
  ];

  return (
    <footer className={`relative overflow-hidden text-slate-700 dark:text-slate-300 pt-16 pb-28 md:pb-12 ${isArabic ? 'text-right' : 'text-left'} transition-colors duration-500 border-t border-slate-200/80 dark:border-white/10 bg-gradient-to-b from-slate-50/70 via-white/50 to-slate-100/90 dark:from-[#0D1B2A]/90 dark:via-[#0B1522]/95 dark:to-[#08101A]/98 backdrop-blur-2xl`}>
      
      {/* 1. Liquid Glass Prismatic Top Horizon Hairline (Curved Light Reflection) */}
      <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#2E86EB]/60 via-40% via-[#FFD23F]/50 via-60% via-[#22C55E]/60 to-transparent pointer-events-none z-20" />
      <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-[720px] max-w-full h-20 bg-gradient-to-b from-[#2E86EB]/20 via-[#22C55E]/10 to-transparent blur-2xl pointer-events-none z-10" />

      {/* 2. Floating Liquid Glass Refractive Caustic Orbs (Aligned with Site 5-Color Spectrum) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
        {/* Electric Blue Orb (Top Right) */}
        <div 
          className="absolute -top-24 -right-16 md:-top-32 md:-right-20 w-[360px] h-[360px] sm:w-[480px] sm:h-[480px] rounded-full blur-[90px] sm:blur-[120px] opacity-40 dark:opacity-35 pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(46, 134, 235, 0.45) 0%, rgba(46, 134, 235, 0.12) 50%, transparent 75%)'
          }}
        />

        {/* Vivid Emerald Health Green Orb (Mid-Left) */}
        <div 
          className="absolute top-1/4 -left-20 sm:-left-32 w-[340px] h-[340px] sm:w-[460px] sm:h-[460px] rounded-full blur-[85px] sm:blur-[115px] opacity-35 dark:opacity-30 pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(34, 197, 94, 0.4) 0%, rgba(34, 197, 94, 0.1) 50%, transparent 75%)'
          }}
        />

        {/* Warm Gold & Magenta Prismatic Glow (Bottom Center) */}
        <div 
          className="absolute -bottom-24 left-1/3 -translate-x-1/2 w-[520px] h-[260px] rounded-full blur-[100px] opacity-30 dark:opacity-25 pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(255, 210, 63, 0.35) 0%, rgba(255, 45, 155, 0.15) 50%, transparent 75%)'
          }}
        />

        {/* Subtle Optical Liquid Mesh Texture */}
        <div 
          className="absolute inset-0 opacity-[0.025] dark:opacity-[0.045] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.7) 1px, transparent 0)`,
            backgroundSize: '32px 32px'
          }}
        />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main 3 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 pb-12 border-b border-slate-200/80 dark:border-white/10">
          
          {/* Col 1: About, Logo & Social Media Icons */}
          <div className="space-y-4">
            <RabaLogo showSubtitle={true} size="md" />

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pt-2 font-medium">
              {isArabic ? (footer.aboutTextAr || t.footer.aboutText) : (footer.aboutTextEn || t.footer.aboutText)}
            </p>

            {/* Social Media Icons Section */}
            <div className="pt-3 space-y-2.5">
              <h5 className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>{isArabic ? 'تابعونا على شبكات التواصل' : 'Follow Us on Social Media'}</span>
              </h5>
              
              <div className="flex flex-wrap items-center gap-2">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.id}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.name}
                      title={`${social.name} (${social.badge})`}
                      className={`w-9 h-9 min-w-[36px] min-h-[36px] sm:w-10 sm:h-10 rounded-xl liquid-glass-btn border border-slate-200/80 dark:border-white/10 bg-white/70 dark:bg-white/[0.05] text-slate-700 dark:text-slate-300 flex items-center justify-center transition-[transform,colors] duration-200 hover:scale-110 active:scale-95 shadow-xs backdrop-blur-md ${social.hoverClass}`}
                    >
                      <Icon className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* PWA Web App Download / Add to Home Screen for Apple & Android */}
            <div className="pt-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <h5 className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-[#2E86EB]" />
                  <span>{isArabic ? 'تطبيق مركز رابا (Web App)' : 'Raba Center Web App'}</span>
                </h5>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-800 dark:text-[#4A9CFF] border border-blue-500/20">
                  {isArabic ? 'آبل وأندرويد' : 'iOS & Android'}
                </span>
              </div>

              {/* Install Card Button */}
              <div className="p-3.5 rounded-2xl liquid-glass-card bg-white/80 dark:bg-white/[0.04] border border-slate-200/90 dark:border-white/10 hover:border-[#2E86EB]/40 transition-colors duration-300 shadow-xs backdrop-blur-md">
                <div className="flex items-center justify-between gap-3 mb-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#2E86EB] to-blue-700 flex items-center justify-center text-white font-black shadow-xs shrink-0">
                      <Download className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-extrabold text-slate-900 dark:text-white leading-tight">
                        {isArabic ? 'تثبيت التطبيق على الجوال' : 'Install on Mobile Device'}
                      </div>
                      <div className="text-[10px] text-slate-600 dark:text-slate-300">
                        {isArabic ? 'إضافة إلى الشاشة الرئيسية كـ تطبيق' : 'Add to Home Screen as Web App'}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setPwaModalTab(isIOS ? 'ios' : 'android');
                      setIsPwaModalOpen(true);
                    }}
                    className="px-3.5 py-2 min-h-[36px] rounded-xl bg-[#1D68C4] hover:bg-[#1554A1] text-white text-xs font-black transition-[transform,background-color] duration-200 cursor-pointer shadow-xs active:scale-95 flex items-center gap-1 shrink-0"
                    title={isArabic ? 'تثبيت التطبيق' : 'Install App'}
                  >
                    <span>{isArabic ? 'تحميل' : 'Install'}</span>
                    <Sparkles className="w-3 h-3" />
                  </button>
                </div>

                {/* Direct Platform Quick Badges (Apple & Android) */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/70 dark:border-white/5">
                  <button
                    type="button"
                    onClick={() => {
                      setPwaModalTab('ios');
                      setIsPwaModalOpen(true);
                    }}
                    className="flex items-center justify-center gap-1.5 py-2 px-2 min-h-[36px] rounded-xl liquid-glass-btn border border-slate-200/70 dark:border-white/10 bg-white dark:bg-white/[0.06] hover:bg-slate-50 dark:hover:bg-white/15 text-slate-800 dark:text-slate-200 text-[11px] font-bold transition-colors cursor-pointer active:scale-95 shadow-xs"
                    aria-label="Apple iOS Web App"
                  >
                    <AppleIcon className="w-3.5 h-3.5 text-slate-800 dark:text-white" />
                    <span>{isArabic ? 'جوالات آبل (iOS)' : 'Apple (iOS)'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setPwaModalTab('android');
                      setIsPwaModalOpen(true);
                    }}
                    className="flex items-center justify-center gap-1.5 py-2 px-2 min-h-[36px] rounded-xl liquid-glass-btn border border-slate-200/70 dark:border-white/10 bg-white dark:bg-white/[0.06] hover:bg-slate-50 dark:hover:bg-white/15 text-slate-800 dark:text-slate-200 text-[11px] font-bold transition-colors cursor-pointer active:scale-95 shadow-xs"
                    aria-label="Android Web App"
                  >
                    <AndroidIcon className="w-3.5 h-3.5 text-emerald-600 dark:text-[#22C55E]" />
                    <span>{isArabic ? 'أندرويد (Android)' : 'Android'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Col 2: Services & Blog Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">{t.footer.programsTitle}</h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
              {/* Blog Link */}
              <li>
                <a 
                  href="#blog-directory" 
                  onClick={(e) => {
                    if (onOpenBlogPage) {
                      e.preventDefault();
                      onOpenBlogPage();
                    }
                  }}
                  className="hover:text-[#2E86EB] dark:hover:text-[#FFD23F] transition-colors flex items-center gap-1.5 font-bold text-[#2E86EB] dark:text-[#4A9CFF] cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>{isArabic ? 'المدونة الطبية والدليل الإكلينيكي' : 'Clinical Blog & Knowledge Guide'}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-blue-500/15 text-blue-800 dark:text-[#4A9CFF] font-black">
                    {isArabic ? 'جديد' : 'NEW'}
                  </span>
                </a>
              </li>
              {/* Shadow Teacher Link */}
              <li>
                <a href="#shadow-teacher" className="hover:text-[#2E86EB] dark:hover:text-[#FFD23F] transition-colors flex items-center gap-1 font-semibold text-slate-800 dark:text-slate-100">
                  <span>{isArabic ? 'خدمة سِوار – معلم الظل والدمج المدرسي (Shadow Teacher)' : 'Sewar Program – School Shadow Teacher Services'}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-[#FFD23F]/20 text-amber-700 dark:text-[#FFD23F] font-bold">
                    {isArabic ? 'مميز' : 'Featured'}
                  </span>
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-[#2E86EB] dark:hover:text-[#4A9CFF] transition-colors inline-block py-0.5">
                  {isArabic ? 'تحليل السلوك التطبيقي (ABA) وتعديل السلوك' : 'Applied Behavior Analysis (ABA) & Behavior Modification'}
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-[#2E86EB] dark:hover:text-[#4A9CFF] transition-colors inline-block py-0.5">
                  {isArabic ? 'التشخيص والتقييم الفردي المقنن' : 'Standardized Diagnostic & Individual Assessment'}
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-[#2E86EB] dark:hover:text-[#4A9CFF] transition-colors inline-block py-0.5">
                  {isArabic ? 'برامج التدخل المبكر لطيف التوحد' : 'Early Intervention Autism Programs'}
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-[#2E86EB] dark:hover:text-[#4A9CFF] transition-colors inline-block py-0.5">
                  {isArabic ? 'جلسات النطق والتخاطب وتطوير التواصل' : 'Speech-Language Pathology & Communication Therapy'}
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-[#2E86EB] dark:hover:text-[#4A9CFF] transition-colors inline-block py-0.5">
                  {isArabic ? 'العلاج الوظيفي والتكامل الحسي' : 'Occupational Therapy & Sensory Integration'}
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-[#2E86EB] dark:hover:text-[#4A9CFF] transition-colors inline-block py-0.5">
                  {isArabic ? 'الدعم النفسي والإرشاد الأسري الشامل' : 'Psychological Counseling & Family Guidance'}
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Center Information */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">{t.footer.contactTitle}</h4>
            <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
              <li className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-lg liquid-glass-btn flex items-center justify-center shrink-0 border border-slate-200/60 dark:border-white/10 text-[#2E86EB] shadow-xs">
                  <MapPin className="w-3.5 h-3.5" />
                </div>
                <span className="pt-1 font-medium">{isArabic ? 'المملكة العربية السعودية' : 'Kingdom of Saudi Arabia'}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg liquid-glass-btn flex items-center justify-center shrink-0 border border-slate-200/60 dark:border-white/10 text-[#2E86EB] shadow-xs">
                  <Phone className="w-3.5 h-3.5" />
                </div>
                <span dir="ltr" className="font-semibold">{footer.phone || t.footer.phone}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg liquid-glass-btn flex items-center justify-center shrink-0 border border-slate-200/60 dark:border-white/10 text-[#2E86EB] shadow-xs">
                  <Mail className="w-3.5 h-3.5" />
                </div>
                <a 
                  href="mailto:info@rabacenters.com" 
                  className="hover:text-[#2E86EB] dark:hover:text-[#4A9CFF] transition-colors font-sans"
                  dir="ltr"
                >
                  info@rabacenters.com
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg liquid-glass-btn flex items-center justify-center shrink-0 border border-slate-200/60 dark:border-white/10 text-[#2E86EB] shadow-xs">
                  <Clock className="w-3.5 h-3.5" />
                </div>
                <span>{isArabic ? (footer.hoursAr || t.footer.hoursDetails) : (footer.hoursEn || t.footer.hoursDetails)}</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar with Links, Back to Top & Admin Access */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-600 dark:text-slate-300">
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6 text-center sm:text-start">
            <p className="font-medium">
              {isArabic ? (footer.copyrightAr || t.footer.copyright) : (footer.copyrightEn || t.footer.copyright)}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <a href="/about" className="hover:text-[#2E86EB] dark:hover:text-[#FFD23F] transition-colors font-semibold">
                {isArabic ? 'من نحن' : 'About Us'}
              </a>
              <span className="text-slate-300 dark:text-white/20 select-none">•</span>
              <a href="/contact" className="hover:text-[#2E86EB] dark:hover:text-[#FFD23F] transition-colors font-semibold">
                {isArabic ? 'اتصل بنا' : 'Contact Us'}
              </a>
              <span className="text-slate-300 dark:text-white/20 select-none">•</span>
              <a href="/terms" className="hover:text-[#2E86EB] dark:hover:text-[#FFD23F] transition-colors font-semibold">
                {isArabic ? 'الشروط والأحكام' : 'Terms of Service'}
              </a>
              <span className="text-slate-300 dark:text-white/20 select-none">•</span>
              <a href="/privacy" className="hover:text-[#2E86EB] dark:hover:text-[#FFD23F] transition-colors font-semibold">
                {isArabic ? 'سياسة الخصوصية' : 'Privacy Policy'}
              </a>
            </div>
            {onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                title={isArabic ? 'لوحة تحكم المنظومة' : 'Staff & Admin Portal'}
                aria-label={isArabic ? 'لوحة تحكم المنظومة' : 'Staff & Admin Portal'}
                className="text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 w-9 h-9 min-w-[36px] min-h-[36px] inline-flex items-center justify-center rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
              </button>
            )}
          </div>
          
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 min-h-[38px] liquid-glass-btn text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white transition-transform cursor-pointer px-3.5 py-2 rounded-xl bg-white/70 dark:bg-white/[0.06] border border-slate-200/80 dark:border-white/10 shadow-xs hover:scale-105 active:scale-95"
            aria-label={isArabic ? 'الرجوع لأعلى الصفحة' : 'Back to top'}
          >
            <span className="font-bold">{t.floating.scrollTop}</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* PWA Install Guide Modal for Apple & Android */}
      <PWAInstallModal
        isOpen={isPwaModalOpen}
        onClose={() => setIsPwaModalOpen(false)}
        defaultTab={pwaModalTab}
      />
    </footer>
  );
};
