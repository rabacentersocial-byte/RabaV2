import React, { useState, useEffect } from 'react';
import { 
  MessageCircle, 
  ArrowUp, 
  X, 
  Send, 
  Clock, 
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { RabaLogo } from './RabaLogo';
import { useLanguage } from '../context/LanguageContext';

interface FloatingActionsProps {
  onOpenBooking?: () => void;
  onOpenNotifications?: () => void;
  onOpenQuickConsult?: () => void;
}

export const FloatingActions: React.FC<FloatingActionsProps> = ({ 
  onOpenQuickConsult
}) => {
  const { t, isArabic, direction } = useLanguage();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const quickTopics = isArabic ? [
    'استفسار عن برامج تحليل السلوك التطبيقي (ABA)',
    'حجز موعد تقييم وتشخيص شامل لطفلي',
    'الاستفسار عن باقات التأهيل والتدخل المبكر',
    'جلسات العلاج الوظيفي وتعديل السلوك'
  ] : [
    'Inquire about Applied Behavior Analysis (ABA)',
    'Book a comprehensive diagnostic evaluation',
    'Ask about rehabilitation & early boost packages',
    'Occupational therapy & sensory integration sessions'
  ];

  const handleSendWhatsApp = (text?: string) => {
    const defaultMsg = isArabic 
      ? 'السلام عليكم ورحمة الله وبركاته، أود الاستفسار عن خدمات وبرامج مركز رابا للعلاج بتحليل السلوك التطبيقي ABA'
      : 'Hello, I would like to inquire about Raba Center programs and ABA therapy services.';
    const msg = text || defaultMsg;
    const url = `https://wa.me/966575100100?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    setIsWhatsAppOpen(false);
  };

  return (
    <aside 
      aria-label={isArabic ? 'إجراءات التواصل السريع' : 'Quick Contact Actions'}
      className={`fixed bottom-[5.5rem] sm:bottom-6 ${isArabic ? 'left-3.5 sm:left-6' : 'right-3.5 sm:right-6'} z-40 flex flex-col items-center gap-3 transition-all duration-300`}
    >
      {/* 1. Scroll To Top Button (Appears gracefully on scroll) */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          id="scroll-to-top-btn"
          aria-label={t('floating.scrollTop') || 'الرجوع للأعلى'}
          title={isArabic ? 'الرجوع لأعلى الصفحة' : 'Scroll to top'}
          className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/80 dark:border-white/20 text-slate-700 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer hover:border-emerald-400 dark:hover:border-[#00E5BE]/50 mb-0.5"
        >
          <ArrowUp className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 hover:-translate-y-0.5" />
        </button>
      )}

      {/* 2. Enhanced WhatsApp Floating Button & Smart Chat Box */}
      <div className="relative group flex items-center">
        {/* Hover Pill Tooltip */}
        <div 
          className={`hidden lg:flex items-center gap-2 absolute ${
            isArabic ? 'left-full ml-3' : 'right-full mr-3'
          } px-3.5 py-1.5 rounded-xl bg-slate-900/90 dark:bg-white/95 text-white dark:text-slate-900 text-xs font-black shadow-xl backdrop-blur-md border border-white/10 dark:border-slate-800/10 opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-300 translate-y-0 whitespace-nowrap z-50`}
        >
          <span className="w-2 h-2 rounded-full bg-[#25D366] inline-block animate-ping" />
          <span>{isArabic ? 'تواصل فوري عبر واتساب' : 'Chat via WhatsApp'}</span>
        </div>

        {/* WhatsApp Popup Card */}
        {isWhatsAppOpen && (
          <div 
            id="whatsapp-chat-popup"
            className={`fixed sm:absolute bottom-24 sm:bottom-16 ${
              isArabic ? 'left-3 sm:left-0' : 'right-3 sm:right-0'
            } w-[calc(100vw-1.5rem)] sm:w-92 max-w-sm bg-white dark:bg-[#0D1B2A] text-slate-900 dark:text-white rounded-3xl shadow-[0_20px_70px_rgba(0,0,0,0.35)] dark:shadow-[0_20px_70px_rgba(0,0,0,0.8)] border border-slate-200 dark:border-white/15 overflow-hidden ${
              isArabic ? 'text-right' : 'text-left'
            } z-50 animate-in fade-in slide-in-from-bottom-4 duration-300`}
            dir={direction}
          >
            {/* Header with Raba Brand Palette */}
            <div className="bg-gradient-to-r from-[#0B3B36] via-[#0E4943] to-[#0284C7] p-4 text-white flex items-center justify-between border-b border-white/15 relative overflow-hidden">
              {/* Subtle brand glow behind header */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#00E5BE]/20 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center gap-3 relative z-10">
                <div className="relative">
                  <RabaLogo variant="icon-only" size="sm" />
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#00E5BE] border-2 border-slate-900 rounded-full shadow-xs" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-black text-sm text-white">{isArabic ? 'مركز رابا - الدعم المباشر' : 'RABA Center - Direct Support'}</h4>
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#00E5BE]" />
                  </div>
                  <p className="text-[11px] text-teal-200 flex items-center gap-1 font-semibold mt-0.5">
                    <Clock className="w-3 h-3" /> {isArabic ? 'أخصائيو السلوك متاحون للرد السريع' : 'Available for rapid response'}
                  </p>
                </div>
              </div>

              <button 
                onClick={() => setIsWhatsAppOpen(false)}
                className="p-1.5 hover:bg-white/20 rounded-xl text-teal-100 hover:text-white transition-colors cursor-pointer relative z-10"
                aria-label={isArabic ? 'إغلاق' : 'Close'}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-4 space-y-3.5 max-h-72 overflow-y-auto bg-slate-50/50 dark:bg-slate-900/30">
              {/* Greeting Card */}
              <div className="bg-white dark:bg-slate-800/80 p-3.5 rounded-2xl border border-slate-200/80 dark:border-white/10 text-xs text-slate-700 dark:text-slate-200 leading-relaxed shadow-xs">
                <div className="flex items-center gap-1.5 text-emerald-600 dark:text-[#00E5BE] font-black mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isArabic ? 'مرحباً بك في مركز رابا' : 'Welcome to Raba Center'}</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300">
                  {isArabic 
                    ? 'يسعدنا الرد على جميع استفساراتكم بشأن جلسات تحليل السلوك التطبيقي، تقييمات التوحد، وبرامج الدمج المدرسي.' 
                    : 'We are delighted to assist with ABA sessions, diagnostic assessments, and school inclusion programs.'}
                </p>
              </div>

              {/* Quick Topics Selection */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-black text-slate-700 dark:text-slate-300 block">
                  {isArabic ? 'اختر موضوع الاستفسار السريع:' : 'Choose a quick topic:'}
                </span>
                {quickTopics.map((topic, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendWhatsApp(topic)}
                    className={`w-full ${isArabic ? 'text-right' : 'text-left'} text-xs bg-white hover:bg-emerald-50 dark:bg-slate-800/70 dark:hover:bg-[#00E5BE]/10 text-slate-800 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-emerald-300 p-2.5 rounded-xl border border-slate-200/90 hover:border-emerald-400 dark:border-white/10 dark:hover:border-[#00E5BE]/40 transition-all duration-200 flex items-center justify-between cursor-pointer group/item shadow-2xs`}
                  >
                    <span className="line-clamp-1 font-semibold">{topic}</span>
                    <Send className={`w-3 h-3 text-emerald-600 dark:text-[#00E5BE] ${isArabic ? 'rotate-180 mr-1.5' : 'ml-1.5'} shrink-0 transition-transform group-hover/item:translate-x-0.5`} />
                  </button>
                ))}
              </div>
            </div>

            {/* Bottom Direct Button */}
            <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-white/10">
              <button
                onClick={() => handleSendWhatsApp()}
                className="w-full py-2.5 bg-gradient-to-r from-[#25D366] via-[#20ba59] to-[#059669] hover:brightness-105 text-white font-black rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-600/25 cursor-pointer transition-all duration-200 border border-white/20 active:scale-98"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>{isArabic ? 'بدء المحادثة المباشرة في واتساب' : 'Start WhatsApp Conversation'}</span>
              </button>
            </div>
          </div>
        )}

        {/* The Action Button */}
        <button
          onClick={() => setIsWhatsAppOpen(!isWhatsAppOpen)}
          id="floating-whatsapp-btn"
          aria-label={isArabic ? 'محادثة واتساب' : 'WhatsApp Chat'}
          title={isArabic ? 'تواصل معنا مباشرة عبر واتساب' : 'Chat via WhatsApp'}
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-[#128C7E] via-[#25D366] to-[#20ba59] hover:from-[#0d6b60] hover:to-[#25D366] text-white flex items-center justify-center shadow-xl shadow-emerald-500/35 hover:shadow-2xl hover:shadow-emerald-500/55 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer relative border-2 border-white/80 dark:border-white/30"
        >
          {/* Subtle Outer Ping Ring */}
          <span className="absolute -inset-1 rounded-full bg-[#25D366] opacity-30 group-hover:opacity-75 animate-ping -z-10" />

          {/* Online green indicator badge */}
          <span className="absolute top-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-white dark:border-slate-900 shadow-xs flex items-center justify-center">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          </span>

          <MessageCircle className="w-5 h-5 sm:w-7 sm:h-7 fill-white transition-transform duration-300 group-hover:scale-110" />
        </button>
      </div>

    </aside>
  );
};
