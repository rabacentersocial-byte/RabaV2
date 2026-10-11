import React, { useState, useEffect, useRef } from 'react';
import { 
  Home, 
  Layers, 
  UserCheck, 
  MessageCircle, 
  CalendarCheck,
  Sparkles,
  MapPin
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface MobileBottomBarProps {
  onOpenBooking: () => void;
  onOpenWhatsApp?: () => void;
  onOpenSpecialistsPage?: () => void;
  onOpenServicesPage?: () => void;
  onOpenBranchesPage?: () => void;
  onOpenOffersPage?: () => void;
  onGoHome?: () => void;
  isSpecialistsPageOpen?: boolean;
  isServicesPageOpen?: boolean;
  isBranchesPageOpen?: boolean;
  isOffersPageOpen?: boolean;
}

export const MobileBottomBar: React.FC<MobileBottomBarProps> = ({
  onOpenBooking,
  onOpenWhatsApp,
  onOpenSpecialistsPage,
  onOpenServicesPage,
  onOpenBranchesPage,
  onOpenOffersPage,
  onGoHome,
  isSpecialistsPageOpen = false,
  isServicesPageOpen = false,
  isBranchesPageOpen = false,
  isOffersPageOpen = false
}) => {
  const { isArabic } = useLanguage();
  const [activeTab, setActiveTab] = useState<'home' | 'services' | 'specialists' | 'branches'>(
    isBranchesPageOpen ? 'branches' : isSpecialistsPageOpen ? 'specialists' : isServicesPageOpen ? 'services' : 'home'
  );

  useEffect(() => {
    if (isBranchesPageOpen) {
      setActiveTab('branches');
    } else if (isSpecialistsPageOpen) {
      setActiveTab('specialists');
    } else if (isServicesPageOpen) {
      setActiveTab('services');
    } else {
      setActiveTab('home');
    }
  }, [isBranchesPageOpen, isSpecialistsPageOpen, isServicesPageOpen, isOffersPageOpen]);

  const handleHomeClick = () => {
    setActiveTab('home');
    if ((isSpecialistsPageOpen || isServicesPageOpen || isBranchesPageOpen || isOffersPageOpen) && onGoHome) {
      onGoHome();
    } else {
      const element = document.getElementById('hero');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handleServicesClick = () => {
    setActiveTab('services');
    if (onOpenServicesPage) {
      onOpenServicesPage();
    } else if ((isSpecialistsPageOpen || isBranchesPageOpen) && onGoHome) {
      onGoHome();
      setTimeout(() => {
        const element = document.getElementById('services');
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    } else {
      const element = document.getElementById('services');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleSpecialistsClick = () => {
    setActiveTab('specialists');
    if (onOpenSpecialistsPage && !isSpecialistsPageOpen) {
      onOpenSpecialistsPage();
    } else {
      const element = document.getElementById('specialists');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleBranchesClick = () => {
    setActiveTab('branches');
    if (onOpenBranchesPage && !isBranchesPageOpen) {
      onOpenBranchesPage();
    } else {
      const element = document.getElementById('branches');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <nav
      aria-label="شريط التنقل السفلي للجوال"
      id="mobile-bottom-navigation-bar"
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 translate-y-0 opacity-100 transition-none pointer-events-auto"
      style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 8px)' }}
    >
      {/* Frosted Glass Container with top border & subtle shadow */}
      <div className="mx-2.5 mb-1.5 rounded-2xl bg-white/95 dark:bg-[#071D18]/95 backdrop-blur-2xl border border-slate-200/90 dark:border-white/15 shadow-[0_-8px_30px_rgba(0,0,0,0.12)] dark:shadow-[0_-8px_35px_rgba(0,0,0,0.45)] px-1.5 py-1.5 flex items-center justify-around">
        
        {/* 1. Home */}
        <button
          onClick={handleHomeClick}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer min-w-[56px] min-h-[44px] ${
            activeTab === 'home'
              ? 'text-[#0B3B36] dark:text-[#00E5BE] font-black scale-105'
              : 'text-slate-500 dark:text-slate-400 font-semibold hover:text-slate-800 dark:hover:text-white'
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span className="text-[11px] font-bold tracking-tight">{isArabic ? 'الرئيسية' : 'Home'}</span>
        </button>

        {/* 2. Services / Programs */}
        <button
          onClick={handleServicesClick}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer min-w-[56px] min-h-[44px] ${
            activeTab === 'services'
              ? 'text-[#0B3B36] dark:text-[#00E5BE] font-black scale-105'
              : 'text-slate-500 dark:text-slate-400 font-semibold hover:text-slate-800 dark:hover:text-white'
          }`}
        >
          <Layers className="w-5 h-5 mb-0.5" />
          <span className="text-[11px] font-bold tracking-tight">{isArabic ? 'الخدمات' : 'Services'}</span>
        </button>

        {/* 3. Center CTA: Book Appointment */}
        <button
          onClick={onOpenBooking}
          id="mobile-bottom-book-btn"
          className="flex flex-col items-center justify-center -mt-4 px-3.5 py-1.5 rounded-2xl bg-gradient-to-r from-[#0B3B36] via-[#0D4D46] to-[#00E5BE] text-white shadow-lg shadow-teal-900/30 dark:shadow-teal-500/25 border-2 border-white dark:border-[#071D18] active:scale-95 transition-transform cursor-pointer min-h-[48px]"
        >
          <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center mb-0.5">
            <CalendarCheck className="w-4 h-4 text-white" />
          </div>
          <span className="text-[11px] font-black text-white">{isArabic ? 'احجز الآن' : 'Book'}</span>
        </button>

        {/* 4. Specialists */}
        <button
          onClick={handleSpecialistsClick}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer min-w-[56px] min-h-[44px] ${
            activeTab === 'specialists'
              ? 'text-[#0B3B36] dark:text-[#00E5BE] font-black scale-105'
              : 'text-slate-500 dark:text-slate-400 font-semibold hover:text-slate-800 dark:hover:text-white'
          }`}
        >
          <UserCheck className="w-5 h-5 mb-0.5" />
          <span className="text-[11px] font-bold tracking-tight">{isArabic ? 'الأخصائيين' : 'Specialists'}</span>
        </button>

        {/* 5. Our Branches (replaced WhatsApp) */}
        <button
          onClick={handleBranchesClick}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer min-w-[56px] min-h-[44px] ${
            activeTab === 'branches'
              ? 'text-[#0B3B36] dark:text-[#00E5BE] font-black scale-105'
              : 'text-slate-500 dark:text-slate-400 font-semibold hover:text-slate-800 dark:hover:text-white'
          }`}
        >
          <MapPin className="w-5 h-5 mb-0.5 text-emerald-600 dark:text-[#00E5BE]" />
          <span className="text-[11px] font-bold tracking-tight">{isArabic ? 'فروعنا' : 'Branches'}</span>
        </button>

      </div>
    </nav>
  );
};
