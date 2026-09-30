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
  BookOpen
} from 'lucide-react';
import { RabaLogo } from './RabaLogo';
import { useLanguage } from '../context/LanguageContext';
import { 
  getStoredSocialSettings, 
  getStoredFooterSettings, 
  SocialLinksSettings, 
  FooterSettings 
} from '../data/siteCustomizer';

interface FooterProps {
  onOpenAdmin?: () => void;
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

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin }) => {
  const { t, isArabic } = useLanguage();
  const [social, setSocial] = useState<SocialLinksSettings>(() => getStoredSocialSettings());
  const [footer, setFooter] = useState<FooterSettings>(() => getStoredFooterSettings());

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
    <footer className={`bg-white/90 dark:bg-slate-950/75 backdrop-blur-2xl text-slate-700 dark:text-slate-300 pt-16 pb-28 md:pb-12 ${isArabic ? 'text-right' : 'text-left'} border-t border-slate-200/90 dark:border-white/15 relative overflow-hidden transition-colors duration-300`}>
      {/* Ambient background glow */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-48 bg-[#00E5BE]/10 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main 3 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 pb-12 border-b border-slate-200 dark:border-white/10">
          
          {/* Col 1: About, Logo & Social Media Icons */}
          <div className="space-y-4">
            <RabaLogo showSubtitle={true} size="md" />

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pt-2">
              {isArabic ? (footer.aboutTextAr || t.footer.aboutText) : (footer.aboutTextEn || t.footer.aboutText)}
            </p>

            <div className="pt-2 flex flex-wrap gap-2">
              <div className="inline-flex items-center gap-2 bg-sky-500/10 dark:bg-white/[0.06] backdrop-blur-md border border-sky-400/30 dark:border-white/15 px-3 py-1.5 rounded-xl text-[11px] text-sky-700 dark:text-[#00E5BE] font-medium shadow-xs">
                <ShieldCheck className="w-4 h-4 text-sky-600 dark:text-[#00E5BE] shrink-0" />
                <span>{isArabic ? (footer.accreditationBadgeAr || t.footer.accreditationBadge) : (footer.accreditationBadgeEn || t.footer.accreditationBadge)}</span>
              </div>
            </div>

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
                      className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 shadow-xs ${social.hoverClass}`}
                    >
                      <Icon className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Col 2: Services & Blog Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">{t.footer.programsTitle}</h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
              {/* Blog Link */}
              <li>
                <a href="#blog" className="hover:text-[#0B3B36] dark:hover:text-[#00ffd2] transition-colors flex items-center gap-1.5 font-bold text-[#0D6D54] dark:text-[#00E5BE]">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>{isArabic ? 'المدونة الطبية والدليل الإكلينيكي' : 'Clinical Blog & Knowledge Guide'}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-teal-500/15 text-teal-800 dark:text-[#00E5BE] font-black">
                    {isArabic ? 'جديد' : 'NEW'}
                  </span>
                </a>
              </li>
              {/* Shadow Teacher Link */}
              <li>
                <a href="#shadow-teacher" className="hover:text-[#0B3B36] dark:hover:text-[#00E5BE] transition-colors flex items-center gap-1 font-semibold text-slate-800 dark:text-slate-100">
                  <span>{isArabic ? 'خدمة سِوار – معلم الظل والدمج المدرسي (Shadow Teacher)' : 'Sewar Program – School Shadow Teacher Services'}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-[#00E5BE]/20 text-[#00897B] dark:text-[#00E5BE] font-bold">
                    {isArabic ? 'مميز' : 'Featured'}
                  </span>
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-[#0D6D54] dark:hover:text-[#00E5BE] transition-colors">
                  {isArabic ? 'تحليل السلوك التطبيقي (ABA) وتعديل السلوك' : 'Applied Behavior Analysis (ABA) & Behavior Modification'}
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-[#0D6D54] dark:hover:text-[#00E5BE] transition-colors">
                  {isArabic ? 'التشخيص والتقييم الفردي المقنن' : 'Standardized Diagnostic & Individual Assessment'}
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-[#0D6D54] dark:hover:text-[#00E5BE] transition-colors">
                  {isArabic ? 'برامج التدخل المبكر لطيف التوحد' : 'Early Intervention Autism Programs'}
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-[#0D6D54] dark:hover:text-[#00E5BE] transition-colors">
                  {isArabic ? 'جلسات النطق والتخاطب وتطوير التواصل' : 'Speech-Language Pathology & Communication Therapy'}
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-[#0D6D54] dark:hover:text-[#00E5BE] transition-colors">
                  {isArabic ? 'العلاج الوظيفي والتكامل الحسي' : 'Occupational Therapy & Sensory Integration'}
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-[#0D6D54] dark:hover:text-[#00E5BE] transition-colors">
                  {isArabic ? 'الدعم النفسي والإرشاد الأسري الشامل' : 'Psychological Counseling & Family Guidance'}
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Center Information */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">{t.footer.contactTitle}</h4>
            <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-sky-600 dark:text-[#00E5BE] shrink-0 mt-0.5" />
                <span>{isArabic ? (footer.addressAr || t.footer.address) : (footer.addressEn || t.footer.address)}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-sky-600 dark:text-[#00E5BE] shrink-0" />
                <span dir="ltr">{footer.phone || t.footer.phone}</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-sky-600 dark:text-[#00E5BE] shrink-0" />
                <span>{footer.email || 'contact@rabacenter.com'}</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-sky-600 dark:text-[#00E5BE] shrink-0" />
                <span>{isArabic ? (footer.hoursAr || t.footer.hoursDetails) : (footer.hoursEn || t.footer.hoursDetails)}</span>
              </li>
            </ul>

            <div className="pt-2">
              <span className="inline-block text-[11px] text-amber-700 dark:text-amber-300 bg-amber-500/10 border border-amber-400/30 px-2.5 py-1 rounded-lg">
                {isArabic ? (footer.officialLicenseAr || t.footer.officialLicense) : (footer.officialLicenseEn || t.footer.officialLicense)}
              </span>
            </div>
          </div>

        </div>

        {/* Bottom Bar with Back to Top & Admin Access */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex flex-wrap items-center gap-4">
            <p>
              {isArabic ? (footer.copyrightAr || t.footer.copyright) : (footer.copyrightEn || t.footer.copyright)}
            </p>
            {onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                className="text-emerald-700 dark:text-emerald-400 hover:underline font-bold flex items-center gap-1 cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{isArabic ? 'لوحة تحكم المنظومة (الإدارة)' : 'Staff & Admin Portal'}</span>
              </button>
            )}
          </div>
          
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer px-3 py-1.5 rounded-lg bg-slate-200/60 dark:bg-white/5 border border-slate-300 dark:border-white/10"
            aria-label={isArabic ? 'الرجوع لأعلى الصفحة' : 'Back to top'}
          >
            <span>{t.floating.scrollTop}</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </footer>
  );
};
