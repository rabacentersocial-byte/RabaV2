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
      {/* 1. Scroll To Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          id="scroll-to-top-btn"
          aria-label={t('floating.scrollTop') || 'الرجوع للأعلى'}
          title={isArabic ? 'الرجوع لأعلى الصفحة' : 'Scroll to top'}
          className="w-10 h-10 sm:w-11 sm:h-11 rounded-full liquid-glass-btn text-[#161B26] dark:text-[#F8FAFC] flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer mb-0.5"
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
          } px-3.5 py-1.5 rounded-full bg-white/95 dark:bg-[#161E2E] text-[#161B26] dark:text-[#F8FAFC] text-xs font-black shadow-xl border border-[#161B26]/10 dark:border-white/15 opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-300 translate-y-0 whitespace-nowrap z-50`}
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
            } w-[calc(100vw-1.5rem)] sm:w-92 max-w-sm glass-modal-dialog overflow-hidden ${
              isArabic ? 'text-right' : 'text-left'
            } z-50 animate-in fade-in slide-in-from-bottom-4 duration-300`}
            dir={direction}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#1668DC] to-[#1152B8] dark:from-[#161E2E] dark:to-[#161E2E] p-4 text-white dark:text-[#F8FAFC] flex items-center justify-between border-b border-white/20 dark:border-white/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 dark:bg-[#2B95FF]/20 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center gap-3 relative z-10">
                <div className="relative">
                  <RabaLogo variant="icon-only" size="sm" />
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#10B981] border-2 border-[#1A73E8] dark:border-[#161E2E] rounded-full shadow-xs" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-black text-sm">{isArabic ? 'مركز رابا - الدعم المباشر' : 'RABA Center - Direct Support'}</h4>
                    <CheckCircle2 className="w-3.5 h-3.5 text-white dark:text-[#2B95FF]" />
                  </div>
                  <p className="text-[11px] opacity-90 flex items-center gap-1 font-semibold mt-0.5">
                    <Clock className="w-3 h-3 text-white dark:text-[#2B95FF]" /> {isArabic ? 'أخصائيو السلوك متاحون للرد السريع' : 'Available for rapid response'}
                  </p>
                </div>
              </div>

              <button 
                onClick={() => setIsWhatsAppOpen(false)}
                className="p-1.5 hover:bg-white/20 rounded-full transition-colors cursor-pointer relative z-10"
                aria-label={isArabic ? 'إغلاق' : 'Close'}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-4 space-y-3.5 max-h-72 overflow-y-auto">
              {/* Greeting Card */}
              <div className="bg-white/75 dark:bg-white/[0.06] p-3.5 rounded-2xl border border-white/80 dark:border-white/10 text-xs text-[#161B26] dark:text-[#F8FAFC] leading-relaxed shadow-xs">
                <div className="flex items-center gap-1.5 text-[#1263D6] dark:text-[#60AFFF] font-black mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#2B95FF]" />
                  <span>{isArabic ? 'مرحباً بك في مركز رابا' : 'Welcome to Raba Center'}</span>
                </div>
                <p className="text-[11px] text-[#4B5563] dark:text-[#94A3B8]">
                  {isArabic 
                    ? 'يسعدنا الرد على جميع استفساراتكم بشأن جلسات تحليل السلوك التطبيقي، تقييمات التوحد، وبرامج الدمج المدرسي.' 
                    : 'We are delighted to assist with ABA sessions, diagnostic assessments, and school inclusion programs.'}
                </p>
              </div>

              {/* Quick Topics Selection */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-black text-[#161B26] dark:text-[#F8FAFC] block">
                  {isArabic ? 'اختر موضوع الاستفسار السريع:' : 'Choose a quick topic:'}
                </span>
                {quickTopics.map((topic, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendWhatsApp(topic)}
                    className={`w-full ${isArabic ? 'text-right' : 'text-left'} text-xs bg-white/70 hover:bg-[#2B95FF]/12 dark:bg-white/[0.06] dark:hover:bg-[#2B95FF]/15 text-[#161B26] dark:text-[#F8FAFC] hover:text-[#1263D6] dark:hover:text-[#60AFFF] p-2.5 rounded-full border border-white/80 hover:border-[#2B95FF]/40 dark:border-white/10 transition-all duration-200 flex items-center justify-between cursor-pointer group/item shadow-2xs`}
                  >
                    <span className="line-clamp-1 font-semibold px-1">{topic}</span>
                    <Send className={`w-3 h-3 text-[#2B95FF] ${isArabic ? 'rotate-180 mr-1.5' : 'ml-1.5'} shrink-0 transition-transform group-hover/item:translate-x-0.5`} />
                  </button>
                ))}
              </div>
            </div>

            {/* Bottom Direct Button */}
            <div className="p-3 border-t border-[#161B26]/[0.08] dark:border-white/10">
              <button
                onClick={() => handleSendWhatsApp()}
                className="w-full py-2.5 bg-gradient-to-r from-[#1668DC] to-[#1152B8] hover:brightness-110 text-white font-black rounded-full text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all duration-200 active:scale-98"
              >
                <MessageCircle className="w-4 h-4 text-white" />
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
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-[#0F766E] via-[#047857] to-[#065F46] hover:from-[#0d6b60] hover:to-[#047857] text-white flex items-center justify-center shadow-xl shadow-emerald-500/35 hover:shadow-2xl hover:shadow-emerald-500/55 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer relative border-2 border-white/80 dark:border-white/30"
        >
          {/* Subtle Outer Ping Ring */}
          <span className="absolute -inset-1 rounded-full bg-[#25D366] opacity-30 group-hover:opacity-75 animate-ping -z-10" />

          {/* Online green indicator badge */}
          <span className="absolute top-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-white dark:border-[#0B0F17] shadow-xs flex items-center justify-center">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          </span>

          <MessageCircle className="w-5 h-5 sm:w-7 sm:h-7 fill-white transition-transform duration-300 group-hover:scale-110" />
        </button>
      </div>

    </aside>
  );
};
