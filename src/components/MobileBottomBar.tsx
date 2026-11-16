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
      <div className="mx-2.5 mb-1.5 rounded-[28px] bg-[rgba(255,255,255,0.80)] dark:bg-[rgba(22,28,42,0.85)] backdrop-blur-2xl border border-[#161B26]/[0.08] dark:border-white/[0.08] shadow-[0_20px_40px_-15px_rgba(22,27,38,0.14)] dark:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.60)] px-1.5 py-1.5 flex items-center justify-around">
        
        {/* 1. Home */}
        <button
          onClick={handleHomeClick}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-full transition-colors cursor-pointer min-w-[56px] min-h-[44px] ${
            activeTab === 'home'
              ? 'text-[#1263D6] dark:text-[#60AFFF] font-black scale-105'
              : 'text-[#4B5563] dark:text-[#94A3B8] font-semibold hover:text-[#161B26] dark:hover:text-[#F8FAFC]'
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span className="text-[11px] font-bold tracking-tight">{isArabic ? 'الرئيسية' : 'Home'}</span>
        </button>

        {/* 2. Services / Programs */}
        <button
          onClick={handleServicesClick}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-full transition-colors cursor-pointer min-w-[56px] min-h-[44px] ${
            activeTab === 'services'
              ? 'text-[#1263D6] dark:text-[#60AFFF] font-black scale-105'
              : 'text-[#4B5563] dark:text-[#94A3B8] font-semibold hover:text-[#161B26] dark:hover:text-[#F8FAFC]'
          }`}
        >
          <Layers className="w-5 h-5 mb-0.5" />
          <span className="text-[11px] font-bold tracking-tight">{isArabic ? 'الخدمات' : 'Services'}</span>
        </button>

        {/* 3. Center CTA */}
        <button
          onClick={onOpenBooking}
          id="mobile-bottom-book-btn"
          className="flex flex-col items-center justify-center -mt-4 px-3.5 py-1.5 rounded-full bg-[#141821] hover:bg-[#2B95FF] text-white dark:bg-[#F5F2EC] dark:hover:bg-[#2B95FF] dark:text-[#141821] dark:hover:text-white shadow-lg border-2 border-[#F5F2EC] dark:border-[#0B0F17] active:scale-95 transition-all cursor-pointer min-h-[48px] group"
        >
          <div className="w-8 h-8 rounded-full bg-[#2B95FF]/20 flex items-center justify-center mb-0.5">
            <CalendarCheck className="w-4 h-4 text-[#2B95FF] group-hover:text-white transition-colors" />
          </div>
          <span className="text-[11px] font-black">{isArabic ? 'احجز الآن' : 'Book'}</span>
        </button>

        {/* 4. Specialists */}
        <button
          onClick={handleSpecialistsClick}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-full transition-colors cursor-pointer min-w-[56px] min-h-[44px] ${
            activeTab === 'specialists'
              ? 'text-[#1263D6] dark:text-[#60AFFF] font-black scale-105'
              : 'text-[#4B5563] dark:text-[#94A3B8] font-semibold hover:text-[#161B26] dark:hover:text-[#F8FAFC]'
          }`}
        >
          <UserCheck className="w-5 h-5 mb-0.5" />
          <span className="text-[11px] font-bold tracking-tight">{isArabic ? 'الأخصائيين' : 'Specialists'}</span>
        </button>

        {/* 5. Our Branches */}
        <button
          onClick={handleBranchesClick}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-full transition-colors cursor-pointer min-w-[56px] min-h-[44px] ${
            activeTab === 'branches'
              ? 'text-[#1263D6] dark:text-[#60AFFF] font-black scale-105'
              : 'text-[#4B5563] dark:text-[#94A3B8] font-semibold hover:text-[#161B26] dark:hover:text-[#F8FAFC]'
          }`}
        >
          <MapPin className="w-5 h-5 mb-0.5 text-[#10B981]" />
          <span className="text-[11px] font-bold tracking-tight">{isArabic ? 'فروعنا' : 'Branches'}</span>
        </button>

      </div>
    </nav>
  );
};
