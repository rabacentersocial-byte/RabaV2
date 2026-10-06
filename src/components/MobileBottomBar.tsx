import React, { useState, useEffect, useRef } from 'react';
import { 
  Home, 
  Layers, 
  UserCheck, 
  MessageCircle, 
  CalendarCheck,
  Sparkles
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface MobileBottomBarProps {
  onOpenBooking: () => void;
  onOpenWhatsApp?: () => void;
}

export const MobileBottomBar: React.FC<MobileBottomBarProps> = ({
  onOpenBooking,
  onOpenWhatsApp
}) => {
  const { isArabic } = useLanguage();
  const [activeTab, setActiveTab] = useState<'home' | 'services' | 'specialists' | 'chat'>('home');
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollYRef = useRef(0);

  // Keep bottom bar steadily visible for rock-solid UI stability
  useEffect(() => {
    setIsVisible(true);
  }, []);

  const scrollToSection = (id: string, tab: 'home' | 'services' | 'specialists') => {
    setActiveTab(tab);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -70;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleWhatsAppClick = () => {
    setActiveTab('chat');
    if (onOpenWhatsApp) {
      onOpenWhatsApp();
    } else {
      const msg = encodeURIComponent('السلام عليكم، أود الاستفسار عن برامج وجلسات مركز رابا لتأهيل الطفل');
      window.open(`https://wa.me/966575100100?text=${msg}`, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <nav
      aria-label="شريط التنقل السفلي للجوال"
      id="mobile-bottom-navigation-bar"
      className={`md:hidden fixed bottom-0 left-0 right-0 z-50 transition-all duration-300 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
      }`}
    >
      {/* Frosted Glass Container with top border & subtle shadow */}
      <div className="mx-3 mb-2 rounded-2xl bg-white/95 dark:bg-[#071D18]/95 backdrop-blur-2xl border border-slate-200/90 dark:border-white/15 shadow-[0_-8px_30px_rgba(0,0,0,0.12)] dark:shadow-[0_-8px_35px_rgba(0,0,0,0.45)] px-2 py-1.5 flex items-center justify-around">
        
        {/* 1. Home */}
        <button
          onClick={() => scrollToSection('hero', 'home')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
            activeTab === 'home'
              ? 'text-[#0B3B36] dark:text-[#00E5BE] font-black scale-105'
              : 'text-slate-500 dark:text-slate-400 font-semibold hover:text-slate-800 dark:hover:text-white'
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">{isArabic ? 'الرئيسية' : 'Home'}</span>
        </button>

        {/* 2. Services / Programs */}
        <button
          onClick={() => scrollToSection('services', 'services')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
            activeTab === 'services'
              ? 'text-[#0B3B36] dark:text-[#00E5BE] font-black scale-105'
              : 'text-slate-500 dark:text-slate-400 font-semibold hover:text-slate-800 dark:hover:text-white'
          }`}
        >
          <Layers className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">{isArabic ? 'البرامج' : 'Programs'}</span>
        </button>

        {/* 3. Center CTA: Book Appointment */}
        <button
          onClick={onOpenBooking}
          id="mobile-bottom-book-btn"
          className="flex flex-col items-center justify-center -mt-5 px-3 py-1.5 rounded-2xl bg-gradient-to-r from-[#0B3B36] via-[#0D4D46] to-[#00E5BE] text-white shadow-lg shadow-teal-900/30 dark:shadow-teal-500/25 border-2 border-white dark:border-[#071D18] active:scale-95 transition-transform cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center mb-0.5">
            <CalendarCheck className="w-5 h-5 text-white" />
          </div>
          <span className="text-[10px] font-black text-white">{isArabic ? 'احجز الآن' : 'Book'}</span>
        </button>

        {/* 4. Specialists */}
        <button
          onClick={() => scrollToSection('specialists', 'specialists')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
            activeTab === 'specialists'
              ? 'text-[#0B3B36] dark:text-[#00E5BE] font-black scale-105'
              : 'text-slate-500 dark:text-slate-400 font-semibold hover:text-slate-800 dark:hover:text-white'
          }`}
        >
          <UserCheck className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">{isArabic ? 'الأخصائيين' : 'Specialists'}</span>
        </button>

        {/* 5. WhatsApp Support */}
        <button
          onClick={handleWhatsAppClick}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
            activeTab === 'chat'
              ? 'text-emerald-600 dark:text-[#10B981] font-black scale-105'
              : 'text-slate-500 dark:text-slate-400 font-semibold hover:text-emerald-600 dark:hover:text-emerald-400'
          }`}
        >
          <MessageCircle className="w-5 h-5 mb-0.5 text-emerald-500 dark:text-emerald-400" />
          <span className="text-[10px] tracking-tight">{isArabic ? 'واتساب' : 'WhatsApp'}</span>
        </button>

      </div>
    </nav>
  );
};
