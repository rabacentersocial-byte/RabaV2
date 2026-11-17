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
  onNavigate?: (path: string) => void;
  currentPath?: string;
  isSpecialistsPageOpen?: boolean;
  isServicesPageOpen?: boolean;
  isBranchesPageOpen?: boolean;
  isOffersPageOpen?: boolean;
}

export const MobileBottomBar: React.FC<MobileBottomBarProps> = ({
  onOpenBooking,
  onOpenSpecialistsPage,
  onOpenServicesPage,
  onOpenBranchesPage,
  onGoHome,
  onNavigate,
  currentPath = '/',
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
    if (isBranchesPageOpen || currentPath.startsWith('/branches')) {
      setActiveTab('branches');
    } else if (isSpecialistsPageOpen || currentPath.startsWith('/specialists') || currentPath.startsWith('/specialist/')) {
      setActiveTab('specialists');
    } else if (isServicesPageOpen || currentPath === '/services' || currentPath.startsWith('/services/')) {
      setActiveTab('services');
    } else {
      setActiveTab('home');
    }
  }, [isBranchesPageOpen, isSpecialistsPageOpen, isServicesPageOpen, isOffersPageOpen, currentPath]);

  const handleHomeClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    setActiveTab('home');
    if (onGoHome) {
      onGoHome();
    } else if (onNavigate) {
      onNavigate('/');
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleServicesClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    setActiveTab('services');
    if (onOpenServicesPage) {
      onOpenServicesPage();
    } else if (onNavigate) {
      onNavigate('/services');
    }
  };

  const handleSpecialistsClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    setActiveTab('specialists');
    if (onOpenSpecialistsPage) {
      onOpenSpecialistsPage();
    } else if (onNavigate) {
      onNavigate('/specialists');
    }
  };

  const handleBranchesClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    setActiveTab('branches');
    if (onOpenBranchesPage) {
      onOpenBranchesPage();
    } else if (onNavigate) {
      onNavigate('/branches');
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
        <a
          href="/"
          onClick={handleHomeClick}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-full transition-colors cursor-pointer min-w-[56px] min-h-[44px] ${
            activeTab === 'home'
              ? 'text-[#1263D6] dark:text-[#60AFFF] font-black scale-105'
              : 'text-[#4B5563] dark:text-[#94A3B8] font-semibold hover:text-[#161B26] dark:hover:text-[#F8FAFC]'
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span className="text-[11px] font-bold tracking-tight">{isArabic ? 'الرئيسية' : 'Home'}</span>
        </a>

        {/* 2. Services / Programs */}
        <a
          href="/services"
          onClick={handleServicesClick}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-full transition-colors cursor-pointer min-w-[56px] min-h-[44px] ${
            activeTab === 'services'
              ? 'text-[#1263D6] dark:text-[#60AFFF] font-black scale-105'
              : 'text-[#4B5563] dark:text-[#94A3B8] font-semibold hover:text-[#161B26] dark:hover:text-[#F8FAFC]'
          }`}
        >
          <Layers className="w-5 h-5 mb-0.5" />
          <span className="text-[11px] font-bold tracking-tight">{isArabic ? 'الخدمات' : 'Services'}</span>
        </a>

        {/* 3. Center CTA */}
        <button
          onClick={onOpenBooking}
          id="mobile-bottom-book-btn"
          className="flex flex-col items-center justify-center -mt-4 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#1668DC] to-[#1152B8] hover:brightness-110 text-white shadow-lg border-2 border-[#F5F2EC] dark:border-[#0B0F17] active:scale-95 transition-all cursor-pointer min-h-[48px] group"
        >
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mb-0.5">
            <CalendarCheck className="w-4 h-4 text-white transition-colors" />
          </div>
          <span className="text-[11px] font-black">{isArabic ? 'احجز الآن' : 'Book'}</span>
        </button>

        {/* 4. Specialists */}
        <a
          href="/specialists"
          onClick={handleSpecialistsClick}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-full transition-colors cursor-pointer min-w-[56px] min-h-[44px] ${
            activeTab === 'specialists'
              ? 'text-[#1263D6] dark:text-[#60AFFF] font-black scale-105'
              : 'text-[#4B5563] dark:text-[#94A3B8] font-semibold hover:text-[#161B26] dark:hover:text-[#F8FAFC]'
          }`}
        >
          <UserCheck className="w-5 h-5 mb-0.5" />
          <span className="text-[11px] font-bold tracking-tight">{isArabic ? 'الأخصائيين' : 'Specialists'}</span>
        </a>

        {/* 5. Our Branches */}
        <a
          href="/branches"
          onClick={handleBranchesClick}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-full transition-colors cursor-pointer min-w-[56px] min-h-[44px] ${
            activeTab === 'branches'
              ? 'text-[#1263D6] dark:text-[#60AFFF] font-black scale-105'
              : 'text-[#4B5563] dark:text-[#94A3B8] font-semibold hover:text-[#161B26] dark:hover:text-[#F8FAFC]'
          }`}
        >
          <MapPin className="w-5 h-5 mb-0.5 text-[#10B981]" />
          <span className="text-[11px] font-bold tracking-tight">{isArabic ? 'فروعنا' : 'Branches'}</span>
        </a>

      </div>
    </nav>
  );
};
