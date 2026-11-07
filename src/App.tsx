import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Navbar } from './components/Navbar';
import { AnimatedBackground } from './components/AnimatedBackground';
import { Hero } from './components/Hero';
import { CourseItem } from './data/coursesData';
import { LazySection, LazyViewportSection } from './components/LazySection';
import { getStoredAdminSession, clearStoredAdminSession } from './data/adminData';
import { DISPATCH_REQUEST_EVENT } from './data/customerRequests';

// Helper that retries dynamic imports to handle transient network hiccups, dev-server restarts, and new deployments
function safeImport<T>(factory: () => Promise<T>, retries = 3, interval = 500): Promise<T> {
  return new Promise<T>((resolve) => {
    const attempt = (remaining: number) => {
      factory()
        .then(resolve)
        .catch((error) => {
          if (remaining > 0) {
            setTimeout(() => attempt(remaining - 1), interval);
          } else {
            const isChunkError = 
              error?.message?.includes('Failed to fetch dynamically imported module') ||
              error?.message?.includes('Importing a module script failed') ||
              error?.name === 'TypeError';
            
            if (isChunkError && typeof window !== 'undefined') {
              const lastReload = Number(sessionStorage.getItem('raba_chunk_reload_time') || 0);
              const now = Date.now();
              // Auto-reload once if not reloaded within the last 15 seconds to fetch latest deploy bundle
              if (now - lastReload > 15000) {
                sessionStorage.setItem('raba_chunk_reload_time', String(now));
                window.location.reload();
                return;
              }
            }
            console.warn('[safeImport] Module chunk failed to load, providing fallback:', error);
            // Gracefully resolve with empty component fallback so entire page doesn't crash
            resolve({ default: () => null } as unknown as T);
          }
        });
    };
    attempt(retries);
  });
}

// Lazy-loaded components for optimal mobile bundle splitting, fast paint, and low TBT
const ShadowTeacherSection = lazy<React.ComponentType<any>>(() => safeImport(() => import('./components/ShadowTeacherSection')).then((m: any) => ({ default: m.default || m.ShadowTeacherSection || (() => null) })));
const PackagesSection = lazy<React.ComponentType<any>>(() => safeImport(() => import('./components/PackagesSection')).then((m: any) => ({ default: m.default || m.PackagesSection || (() => null) })));
const SpecialistsSection = lazy<React.ComponentType<any>>(() => safeImport(() => import('./components/SpecialistsSection')).then((m: any) => ({ default: m.default || m.SpecialistsSection || (() => null) })));
const SpecialistsDirectoryPage = lazy<React.ComponentType<any>>(() => safeImport(() => import('./components/SpecialistsDirectoryPage')).then((m: any) => ({ default: m.default || m.SpecialistsDirectoryPage || (() => null) })));
const ServicesDirectoryPage = lazy<React.ComponentType<any>>(() => safeImport(() => import('./components/ServicesDirectoryPage')).then((m: any) => ({ default: m.default || m.ServicesDirectoryPage || (() => null) })));
const BranchesDirectoryPage = lazy<React.ComponentType<any>>(() => safeImport(() => import('./components/BranchesDirectoryPage')).then((m: any) => ({ default: m.default || m.BranchesDirectoryPage || (() => null) })));
const OffersDirectoryPage = lazy<React.ComponentType<any>>(() => safeImport(() => import('./components/OffersDirectoryPage')).then((m: any) => ({ default: m.default || m.OffersDirectoryPage || (() => null) })));
const SpecialistCvModal = lazy<React.ComponentType<any>>(() => safeImport(() => import('./components/SpecialistCvModal')).then((m: any) => ({ default: m.default || m.SpecialistCvModal || (() => null) })));
const BookingModal = lazy<React.ComponentType<any>>(() => safeImport(() => import('./components/BookingModal')).then((m: any) => ({ default: m.default || m.BookingModal || (() => null) })));
const NotificationCenterModal = lazy<React.ComponentType<any>>(() => safeImport(() => import('./components/NotificationCenterModal')).then((m: any) => ({ default: m.default || m.NotificationCenterModal || (() => null) })));
const TestimonialsSection = lazy<React.ComponentType<any>>(() => safeImport(() => import('./components/TestimonialsSection')).then((m: any) => ({ default: m.default || m.TestimonialsSection || (() => null) })));
const BlogSliderSection = lazy<React.ComponentType<any>>(() => safeImport(() => import('./components/BlogSliderSection')).then((m: any) => ({ default: m.default || m.BlogSliderSection || (() => null) })));
const AccreditationsSection = lazy<React.ComponentType<any>>(() => safeImport(() => import('./components/AccreditationsSection')).then((m: any) => ({ default: m.default || m.AccreditationsSection || (() => null) })));
const PartnersSection = lazy<React.ComponentType<any>>(() => safeImport(() => import('./components/PartnersSection')).then((m: any) => ({ default: m.default || m.PartnersSection || (() => null) })));
const BranchesSection = lazy<React.ComponentType<any>>(() => safeImport(() => import('./components/BranchesSection')).then((m: any) => ({ default: m.default || m.BranchesSection || (() => null) })));
const CoursesSliderSection = lazy<React.ComponentType<any>>(() => safeImport(() => import('./components/CoursesSliderSection')).then((m: any) => ({ default: m.default || m.CoursesSliderSection || (() => null) })));
const CourseRegistrationModal = lazy<React.ComponentType<any>>(() => safeImport(() => import('./components/CourseRegistrationModal')).then((m: any) => ({ default: m.default || m.CourseRegistrationModal || (() => null) })));
const LoginModal = lazy<React.ComponentType<any>>(() => safeImport(() => import('./components/LoginModal')).then((m: any) => ({ default: m.default || m.LoginModal || (() => null) })));
const StoreModal = lazy<React.ComponentType<any>>(() => safeImport(() => import('./components/StoreModal')).then((m: any) => ({ default: m.default || m.StoreModal || (() => null) })));
const VideoModal = lazy<React.ComponentType<any>>(() => safeImport(() => import('./components/VideoModal')).then((m: any) => ({ default: m.default || m.VideoModal || (() => null) })));
const QuickConsultationModal = lazy<React.ComponentType<any>>(() => safeImport(() => import('./components/QuickConsultationModal')).then((m: any) => ({ default: m.default || m.QuickConsultationModal || (() => null) })));
const AdminDashboard = lazy<React.ComponentType<any>>(() => safeImport(() => import('./components/admin/AdminDashboard')).then((m: any) => ({ default: m.default || m.AdminDashboard || (() => null) })));
const AdminLoginPage = lazy<React.ComponentType<any>>(() => safeImport(() => import('./components/admin/AdminLoginPage')).then((m: any) => ({ default: m.default || m.AdminLoginPage || (() => null) })));
const StatsBar = lazy<React.ComponentType<any>>(() => safeImport(() => import('./components/StatsBar')).then((m: any) => ({ default: m.default || m.StatsBar || (() => null) })));
const ServicesSection = lazy<React.ComponentType<any>>(() => safeImport(() => import('./components/ServicesSection')).then((m: any) => ({ default: m.default || m.ServicesSection || (() => null) })));
const Footer = lazy<React.ComponentType<any>>(() => safeImport(() => import('./components/Footer')).then((m: any) => ({ default: m.default || m.Footer || (() => null) })));
const FloatingActions = lazy<React.ComponentType<any>>(() => safeImport(() => import('./components/FloatingActions')).then((m: any) => ({ default: m.default || m.FloatingActions || (() => null) })));
const MobileBottomBar = lazy<React.ComponentType<any>>(() => safeImport(() => import('./components/MobileBottomBar')).then((m: any) => ({ default: m.default || m.MobileBottomBar || (() => null) })));


import { 
  INITIAL_APPOINTMENTS, 
  INITIAL_NOTIFICATIONS,
  PARENT_REVIEWS,
  SERVICES,
  THERAPY_PACKAGES,
  SPECIALISTS
} from './data/mockData';
import { 
  Specialist, 
  ServiceItem, 
  TherapyPackage, 
  Appointment, 
  NotificationItem,
  ParentReview,
  AdminUser
} from './types';
import { deduplicateSpecialists } from './utils/specialistDeduplication';
import { savePersistentModule } from './utils/persistentSync';
import { 
  getStoredThemeSettings, 
  applyGlobalTheme, 
  getStoredModulesVisibility, 
  SiteModulesVisibility 
} from './data/siteCustomizer';
import { getStoredTrackingPixels, applyTrackingPixels } from './utils/trackingPixels';

export default function App() {
  // Modules Visibility & Theme Control
  const [modules, setModules] = useState<SiteModulesVisibility>(() => getStoredModulesVisibility());

  useEffect(() => {
    // Apply saved theme colors on startup
    applyGlobalTheme(getStoredThemeSettings());

    // Defer tracking pixels & external analytics until first user interaction OR 4500ms after load
    const scheduleDeferredPixels = () => {
      let executed = false;
      const run = () => {
        if (executed) return;
        executed = true;
        ['scroll', 'mousemove', 'touchstart', 'pointerdown'].forEach(evt => {
          window.removeEventListener(evt, run);
        });
        applyTrackingPixels(getStoredTrackingPixels());
        fetch('/api/tracking-pixels/active')
          .then(res => res.json())
          .then(json => {
            if (json.success && json.data) {
              applyTrackingPixels(json.data);
            }
          })
          .catch(() => {});
      };

      ['scroll', 'mousemove', 'touchstart', 'pointerdown'].forEach(evt => {
        window.addEventListener(evt, run, { passive: true, once: true });
      });

      const timer = setTimeout(run, 4500);
      return () => {
        clearTimeout(timer);
        ['scroll', 'mousemove', 'touchstart', 'pointerdown'].forEach(evt => {
          window.removeEventListener(evt, run);
        });
      };
    };

    const cleanupPixels = scheduleDeferredPixels();

    // Dismiss splash overlay as soon as App component renders
    if (typeof window !== 'undefined' && (window as any).dismissSplash) {
      (window as any).dismissSplash();
    }

    const handleThemeUpdate = () => applyGlobalTheme(getStoredThemeSettings());
    const handleModulesUpdate = () => {
      const next = getStoredModulesVisibility();
      setModules((prev) => {
        if (JSON.stringify(prev) === JSON.stringify(next)) return prev;
        return next;
      });
    };

    window.addEventListener('raba_theme_updated', handleThemeUpdate);
    window.addEventListener('raba_modules_updated', handleModulesUpdate);

    const handleNewRequest = async (e: any) => {
      const req = e?.detail as Appointment;
      if (req) {
        setAppointments((prev) => [req, ...prev.filter(a => a.id !== req.id)]);
        try {
          const { saveAppointmentToFirestore } = await import('./services/firestoreService');
          await saveAppointmentToFirestore(req);
        } catch (err) {
          console.error('[App] Error persisting appointment to Firestore in handleNewRequest:', err);
        }
      }
    };
    const handleNotifsUpdate = (e: any) => {
      if (Array.isArray(e?.detail)) {
        const next = e.detail;
        setNotifications((prev) => {
          if (prev.length === next.length && prev.every((n, i) => n.id === next[i].id)) return prev;
          return next;
        });
      }
    };

    window.addEventListener(DISPATCH_REQUEST_EVENT, handleNewRequest);
    window.addEventListener('raba_notifications_updated', handleNotifsUpdate);

    const handleSpecialistsUpdate = (e: any) => {
      if (Array.isArray(e?.detail)) {
        const next = e.detail;
        setSpecialists((prev) => {
          if (prev.length === next.length && prev.every((s, i) => s.id === next[i].id && s.avatar === next[i].avatar)) {
            return prev;
          }
          return next;
        });
      } else {
        try {
          const saved = localStorage.getItem('raba_specialists');
          if (saved) {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setSpecialists((prev) => {
                if (prev.length === parsed.length && prev.every((s, i) => s.id === parsed[i].id && s.avatar === parsed[i].avatar)) {
                  return prev;
                }
                return parsed;
              });
            }
          }
        } catch { /* ignore */ }
      }
    };

    const handleAppointmentsUpdate = (e: any) => {
      if (Array.isArray(e?.detail)) {
        const next = e.detail;
        setAppointments((prev) => {
          if (prev.length === next.length && prev.every((a, i) => a.id === next[i].id)) return prev;
          return next;
        });
      }
    };

    const handleSyncReady = () => {
      // Re-read theme and modules
      applyGlobalTheme(getStoredThemeSettings());
      const nextMods = getStoredModulesVisibility();
      setModules((prev) => {
        if (JSON.stringify(prev) === JSON.stringify(nextMods)) return prev;
        return nextMods;
      });

      // Re-read specialists gracefully without loop
      try {
        const savedSpec = localStorage.getItem('raba_specialists');
        if (savedSpec) {
          const parsed = JSON.parse(savedSpec);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const hasStaleMocks = parsed.length !== SPECIALISTS.length ||
              parsed.some((s: any) => 
                s.id === 'spec-rawan-tablett' || 
                s.id === 'spec-hossam-malki' ||
                (s.id === 'spec-hanaa-basheer' && (!s.education || s.education.length < 5 || s.category !== 'psychology' || s.experienceYears !== 15)) ||
                (s.id === 'spec-sara-abdelhamid' && s.name && s.name.includes('يارا')) ||
                (s.id === 'spec-sadeem-mshari' && s.experienceYears !== 2)
              );
            const fullList = hasStaleMocks
              ? SPECIALISTS
              : parsed;
            setSpecialists((prev) => {
              if (prev.length === fullList.length && prev.every((s, i) => s.id === fullList[i].id && s.avatar === fullList[i].avatar)) {
                return prev;
              }
              return fullList;
            });
          }
        }
      } catch { /* ignore */ }

      // Re-read appointments gracefully
      try {
        const savedAppt = localStorage.getItem('raba_appointments');
        if (savedAppt) {
          const parsed = JSON.parse(savedAppt);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setAppointments((prev) => {
              if (prev.length === parsed.length && prev.every((a, i) => a.id === parsed[i].id)) return prev;
              return parsed;
            });
          }
        }
      } catch { /* ignore */ }
    };

    window.addEventListener('raba_specialists_updated', handleSpecialistsUpdate);
    window.addEventListener('raba_appointments_updated', handleAppointmentsUpdate);
    window.addEventListener('raba_persistent_sync_ready', handleSyncReady);

    return () => {
      window.removeEventListener('raba_theme_updated', handleThemeUpdate);
      window.removeEventListener('raba_modules_updated', handleModulesUpdate);
      window.removeEventListener(DISPATCH_REQUEST_EVENT, handleNewRequest);
      window.removeEventListener('raba_notifications_updated', handleNotifsUpdate);
      window.removeEventListener('raba_specialists_updated', handleSpecialistsUpdate);
      window.removeEventListener('raba_appointments_updated', handleAppointmentsUpdate);
      window.removeEventListener('raba_persistent_sync_ready', handleSyncReady);
      cleanupPixels();
    };
  }, []);

  // Persistence state
  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    try {
      const saved = localStorage.getItem('raba_appointments') || localStorage.getItem('khotwa_appointments');
      const list: Appointment[] = saved ? JSON.parse(saved) : INITIAL_APPOINTMENTS;
      // Deduplicate by ID to prevent duplicate key warning
      const seen = new Set<string>();
      return list.filter((item) => {
        if (!item || !item.id) return false;
        if (seen.has(item.id)) return false;
        seen.add(item.id);
        return true;
      });
    } catch {
      return INITIAL_APPOINTMENTS;
    }
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem('raba_notifications') || localStorage.getItem('khotwa_notifications');
      return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

  const [testimonials, setTestimonials] = useState<ParentReview[]>(() => {
    try {
      const saved = localStorage.getItem('raba_testimonials_v7');
      return saved ? JSON.parse(saved) : PARENT_REVIEWS;
    } catch {
      return PARENT_REVIEWS;
    }
  });

  const [specialists, setSpecialists] = useState<Specialist[]>(() => {
    try {
      const saved = localStorage.getItem('raba_specialists');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const hasStaleMocks = parsed.length !== SPECIALISTS.length ||
            parsed.some((s: any) => 
              s.id === 'spec-rawan-tablett' || 
              s.id === 'spec-hossam-malki' ||
              (s.id === 'spec-hanaa-basheer' && (!s.education || s.education.length < 5 || s.category !== 'psychology' || s.experienceYears !== 15)) ||
              (s.id === 'spec-sara-abdelhamid' && s.name && s.name.includes('يارا')) ||
              (s.id === 'spec-sadeem-mshari' && s.experienceYears !== 2)
            );
          if (hasStaleMocks) {
            return deduplicateSpecialists(SPECIALISTS);
          }
          return deduplicateSpecialists(parsed);
        }
      }
      return deduplicateSpecialists(SPECIALISTS);
    } catch {
      return deduplicateSpecialists(SPECIALISTS);
    }
  });

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('raba_specialists', JSON.stringify(specialists));
    } catch {
      // ignore
    }
  }, [specialists]);
  useEffect(() => {
    try {
      localStorage.setItem('raba_appointments', JSON.stringify(appointments));
    } catch {
      // ignore
    }
  }, [appointments]);

  useEffect(() => {
    try {
      localStorage.setItem('raba_notifications', JSON.stringify(notifications));
    } catch {
      // ignore
    }
  }, [notifications]);

  useEffect(() => {
    try {
      localStorage.setItem('raba_testimonials_v7', JSON.stringify(testimonials));
    } catch {
      // ignore
    }
  }, [testimonials]);

  // Modal states
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isStoreOpen, setIsStoreOpen] = useState(false);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [isQuickConsultOpen, setIsQuickConsultOpen] = useState(false);
  // Page states - Home page is always the default view on startup/load
  const [isAdminOpen, setIsAdminOpen] = useState(() => {
    return window.location.hash === '#admin';
  });
  const [isSpecialistsPageOpen, setIsSpecialistsPageOpen] = useState(false);
  const [isServicesPageOpen, setIsServicesPageOpen] = useState(false);
  const [isBranchesPageOpen, setIsBranchesPageOpen] = useState(false);
  const [isOffersPageOpen, setIsOffersPageOpen] = useState(false);
  const [adminSession, setAdminSession] = useState<AdminUser | null>(() => getStoredAdminSession());
  const [cartCount, setCartCount] = useState(0);
  const [selectedCourseForRegistration, setSelectedCourseForRegistration] = useState<CourseItem | null>(null);
  const [isCourseRegistrationOpen, setIsCourseRegistrationOpen] = useState(false);

  // Ensure default view on initial mount is strictly the Home page
  useEffect(() => {
    const initialHash = window.location.hash;
    if (
      initialHash === '#specialists-directory' || 
      initialHash === '#specialists-page' ||
      initialHash === '#services-directory' || 
      initialHash === '#services-page' ||
      initialHash === '#branches-directory' || 
      initialHash === '#branches-page' ||
      initialHash === '#offers-directory' ||
      initialHash === '#offers-page' ||
      initialHash === '#offers' ||
      initialHash === '#activities'
    ) {
      window.history.replaceState('', document.title, window.location.pathname + window.location.search);
      setIsSpecialistsPageOpen(false);
      setIsServicesPageOpen(false);
      setIsBranchesPageOpen(false);
      setIsOffersPageOpen(false);
    }
    // Scroll to top of the Home page on initial load
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, []);

  const handleOpenCourseRegistration = (course: CourseItem) => {
    setSelectedCourseForRegistration(course);
    setIsCourseRegistrationOpen(true);
  };

  const handleOpenSpecialistsPage = () => {
    setIsSpecialistsPageOpen(true);
    setIsServicesPageOpen(false);
    setIsBranchesPageOpen(false);
    setIsOffersPageOpen(false);
    window.location.hash = '#specialists-directory';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenServicesPage = () => {
    setIsServicesPageOpen(true);
    setIsSpecialistsPageOpen(false);
    setIsBranchesPageOpen(false);
    setIsOffersPageOpen(false);
    window.location.hash = '#services-directory';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenBranchesPage = () => {
    setIsBranchesPageOpen(true);
    setIsSpecialistsPageOpen(false);
    setIsServicesPageOpen(false);
    setIsOffersPageOpen(false);
    window.location.hash = '#branches-directory';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenOffersPage = () => {
    setIsOffersPageOpen(true);
    setIsSpecialistsPageOpen(false);
    setIsServicesPageOpen(false);
    setIsBranchesPageOpen(false);
    window.location.hash = '#offers-directory';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToHome = () => {
    setIsSpecialistsPageOpen(false);
    setIsServicesPageOpen(false);
    setIsBranchesPageOpen(false);
    setIsOffersPageOpen(false);
    if (
      window.location.hash === '#specialists-directory' || 
      window.location.hash === '#specialists-page' ||
      window.location.hash === '#services-directory' ||
      window.location.hash === '#services-page' ||
      window.location.hash === '#branches-directory' ||
      window.location.hash === '#branches-page' ||
      window.location.hash === '#offers-directory' ||
      window.location.hash === '#offers-page' ||
      window.location.hash === '#offers' ||
      window.location.hash === '#activities'
    ) {
      window.history.pushState('', document.title, window.location.pathname + window.location.search);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleHashChange = () => {
      setIsAdminOpen(window.location.hash.startsWith('#admin'));
      setIsSpecialistsPageOpen(
        window.location.hash === '#specialists-directory' || 
        window.location.hash === '#specialists-page'
      );
      setIsServicesPageOpen(
        window.location.hash === '#services-directory' || 
        window.location.hash === '#services-page'
      );
      setIsBranchesPageOpen(
        window.location.hash === '#branches-directory' || 
        window.location.hash === '#branches-page'
      );
      setIsOffersPageOpen(
        window.location.hash === '#offers-directory' || 
        window.location.hash === '#offers-page' ||
        window.location.hash === '#offers' ||
        window.location.hash === '#activities'
      );
    };
    const handleAuthChange = (e: any) => {
      setAdminSession(e?.detail || getStoredAdminSession());
    };
    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('raba_admin_auth_changed', handleAuthChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('raba_admin_auth_changed', handleAuthChange);
    };
  }, []);
  const [selectedCvSpecialist, setSelectedCvSpecialist] = useState<Specialist | null>(null);

  // Pre-selected items for booking flow
  const [bookingInitialService, setBookingInitialService] = useState<ServiceItem | null>(null);
  const [bookingInitialPackage, setBookingInitialPackage] = useState<TherapyPackage | null>(null);
  const [bookingInitialSpecialist, setBookingInitialSpecialist] = useState<Specialist | null>(null);
  const [bookingInitialNotes, setBookingInitialNotes] = useState<string>('');
  const [bookingInitialDate, setBookingInitialDate] = useState<string>('');

  // Handlers
  const handleOpenBooking = () => {
    setBookingInitialService(null);
    setBookingInitialPackage(null);
    setBookingInitialSpecialist(null);
    setBookingInitialNotes('');
    setBookingInitialDate('');
    setIsBookingOpen(true);
  };

  const handleSelectServiceForBooking = (service: ServiceItem) => {
    setBookingInitialService(service);
    setBookingInitialPackage(null);
    setBookingInitialSpecialist(null);
    setBookingInitialNotes('');
    setBookingInitialDate('');
    setIsBookingOpen(true);
  };

  const handleSelectPackageForBooking = (pkg: TherapyPackage) => {
    setBookingInitialPackage(pkg);
    setBookingInitialService(null);
    setBookingInitialSpecialist(null);
    setBookingInitialNotes('');
    setBookingInitialDate('');
    setIsBookingOpen(true);
  };

  const handleSelectSpecialistForBooking = (specialist: Specialist) => {
    setBookingInitialSpecialist(specialist);
    setBookingInitialService(null);
    setBookingInitialPackage(null);
    setBookingInitialNotes('');
    setBookingInitialDate('');
    setIsBookingOpen(true);
  };

  const handleClaimOffer = (offerTitle: string, discountedPrice?: number) => {
    if (offerTitle.includes('مجاني') || offerTitle.includes('Free') || offerTitle.includes('24/9')) {
      // Saudi National Day 96 Free Day (Thursday 24/09/2026)
      setBookingInitialService(null);
      setBookingInitialPackage(null);
      setBookingInitialSpecialist(null);
      setBookingInitialDate('2026-09-24');
      setBookingInitialNotes('عرض اليوم الوطني السعودي 96: حجز يوم مجاني لجميع العملاء (كود: KSA96-FREE) - الخميس 24/09/2026');
      setIsBookingOpen(true);
    } else if (offerTitle.includes('35%') || offerTitle.includes('الجدد') || offerTitle.includes('New Clients')) {
      // Saudi National Day 96 35% New Clients Offer
      setBookingInitialService(null);
      setBookingInitialPackage(null);
      setBookingInitialSpecialist(null);
      setBookingInitialDate('');
      setBookingInitialNotes('عرض اليوم الوطني السعودي 96: خصم 35% للعملاء الجدد (تسجيل صباحي 08:00 ص - 12:00 م) (كود: KSA96-NEW)');
      setIsBookingOpen(true);
    } else {
      setBookingInitialService(null);
      setBookingInitialPackage(null);
      setBookingInitialSpecialist(null);
      setBookingInitialDate('');
      setBookingInitialNotes(`استفادة من عرض: ${offerTitle}${discountedPrice ? ` (خصم ${discountedPrice}%)` : ''}`);
      setIsBookingOpen(true);
    }
  };

  const handleViewCv = (specialist: Specialist) => {
    setSelectedCvSpecialist(specialist);
  };

  const handleConfirmBooking = async (confirmedAppointment: Appointment) => {
    // Add directly to appointments list (appears instantly in Admin Dashboard) with duplicate protection
    const sanitizedApp = {
      ...confirmedAppointment,
      id: confirmedAppointment.id || `apt-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
    };
    try {
      const { saveAppointmentToFirestore } = await import('./services/firestoreService');
      await saveAppointmentToFirestore(sanitizedApp);
    } catch (err) {
      console.error('[App] Error saving appointment to Firestore in handleConfirmBooking:', err);
    }

    // Create immediate confirmation notification for user
    const newConfirmationNotif: NotificationItem = {
      id: 'notif-' + Date.now(),
      title: `تم استلام طلب حجز: ${confirmedAppointment.serviceTitle}`,
      message: `تم تسجيل طلب حجز جديد للعميل (${confirmedAppointment.guardianName}) - الطفل (${confirmedAppointment.childName}). رقم الحجز: ${confirmedAppointment.referenceNumber}. الموعد: ${confirmedAppointment.date} (${confirmedAppointment.timeSlot}). سيقوم فريق المركز بالتواصل لتأكيد الموعد.`,
      date: 'الآن',
      type: 'confirmation',
      read: false,
      appointmentId: confirmedAppointment.id,
      channel: 'whatsapp'
    };

    setNotifications((prev) => [newConfirmationNotif, ...prev]);
  };

  const handleMarkAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleAddTestNotification = (msg: string, type: 'reminder' | 'confirmation') => {
    const testNotif: NotificationItem = {
      id: 'notif-' + Date.now(),
      title: 'تنبيه آلي تجريبي فوري 🔔',
      message: msg,
      date: 'الآن',
      type,
      read: false,
      channel: 'whatsapp'
    };
    setNotifications((prev) => [testNotif, ...prev]);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  if (isAdminOpen) {
    if (!adminSession) {
      return (
        <Suspense fallback={<div className="min-h-screen bg-[#0D1B2A] flex items-center justify-center text-[#2E86EB] font-bold">جاري تحميل تسجيل الدخول...</div>}>
          <AdminLoginPage
            onLoginSuccess={(user) => {
              setAdminSession(user);
            }}
            onBackToWebsite={() => {
              setIsAdminOpen(false);
              if (window.location.hash.startsWith('#admin')) {
                window.location.hash = '';
              }
            }}
          />
        </Suspense>
      );
    }

    return (
      <Suspense fallback={<div className="min-h-screen bg-[#0D1B2A] flex items-center justify-center text-[#2E86EB] font-bold">جاري تحميل لوحة التحكم...</div>}>
        <AdminDashboard
          appointments={appointments}
          onUpdateAppointments={setAppointments}
          reviews={testimonials}
          onUpdateReviews={setTestimonials}
          specialists={specialists}
          onUpdateSpecialists={setSpecialists}
          onLogout={() => {
            setAdminSession(null);
            clearStoredAdminSession();
          }}
          onClose={() => {
            setIsAdminOpen(false);
            if (window.location.hash.startsWith('#admin')) {
              window.location.hash = '';
            }
          }}
        />
      </Suspense>
    );
  }

  return (
    <div className="min-h-screen relative flex flex-col font-sans text-slate-900 dark:text-white selection:bg-[#00E5BE] selection:text-slate-950 md:transition-colors md:duration-300 overflow-x-clip w-full max-w-[100vw] pb-16 md:pb-0" dir="rtl">
      
      {/* 1. Gentle Animated Background with floating pediatric shapes */}
      <AnimatedBackground />

      {/* 2. Sticky Header */}
      <Navbar
        onOpenBooking={handleOpenBooking}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenLogin={() => setIsLoginOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenStore={() => setIsStoreOpen(true)}
        onOpenSpecialistsPage={handleOpenSpecialistsPage}
        onOpenServicesPage={handleOpenServicesPage}
        onOpenBranchesPage={handleOpenBranchesPage}
        onOpenOffersPage={handleOpenOffersPage}
        onGoHome={handleBackToHome}
        isSpecialistsPageOpen={isSpecialistsPageOpen}
        isServicesPageOpen={isServicesPageOpen}
        isBranchesPageOpen={isBranchesPageOpen}
        isOffersPageOpen={isOffersPageOpen}
        unreadCount={unreadCount}
        cartCount={cartCount}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        
        {isSpecialistsPageOpen ? (
          /* Dedicated Specialists Page with Specialty Filter and Grid Format Display */
          <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center text-teal-500 font-bold">جاري تحميل دليل الأخصائيين...</div>}>
            <SpecialistsDirectoryPage
              specialists={specialists}
              onBackToHome={handleBackToHome}
              onViewCv={handleViewCv}
              onBookSpecialist={handleSelectSpecialistForBooking}
            />
          </Suspense>
        ) : isServicesPageOpen ? (
          /* Dedicated Comprehensive Services Directory Page (Rehab Programs, Courses, Packages & Pricing in Grid) */
          <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center text-teal-500 font-bold">جاري تحميل دليل الخدمات الشامل...</div>}>
            <ServicesDirectoryPage
              onBackToHome={handleBackToHome}
              onSelectService={handleSelectServiceForBooking}
              onSelectPackage={handleSelectPackageForBooking}
              onRegisterCourse={handleOpenCourseRegistration}
              onOpenSpecialistsPage={handleOpenSpecialistsPage}
            />
          </Suspense>
        ) : isBranchesPageOpen ? (
          /* Dedicated Branches Directory Page with Cities Filter and Slider/Grid Switcher */
          <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center text-teal-500 font-bold">جاري تحميل دليل فروع مركز رابا...</div>}>
            <BranchesDirectoryPage
              onBackToHome={handleBackToHome}
              onSelectBranch={(branch) => {
                setBookingInitialNotes(`استفسار وحجز في فرع: ${branch.name} (${branch.cityNameAr})`);
                setIsBookingOpen(true);
              }}
              onOpenBooking={(branchNotes) => {
                if (branchNotes) setBookingInitialNotes(branchNotes);
                setIsBookingOpen(true);
              }}
            />
          </Suspense>
        ) : isOffersPageOpen ? (
          /* Dedicated Offers & Activities Page (Moved from Homepage to Separate Page) */
          <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center text-teal-500 font-bold">جاري تحميل صفحة العروض والأنشطة...</div>}>
            <OffersDirectoryPage
              onBackToHome={handleBackToHome}
              onClaimOffer={handleClaimOffer}
              onOpenBooking={(notes) => {
                if (notes) setBookingInitialNotes(notes);
                setIsBookingOpen(true);
              }}
            />
          </Suspense>
        ) : (
          <>
            {/* 3. Hero Section */}
            {modules.hero && (
              <Hero
                onOpenBooking={handleOpenBooking}
                onOpenNotifications={() => setIsNotificationsOpen(true)}
                onOpenVideo={() => setIsVideoOpen(true)}
                onBookSpecialist={handleSelectSpecialistForBooking}
                onViewCv={handleViewCv}
              />
            )}

            {/* 5. Center Achievements & Statistics Bar (from image) */}
            {modules.stats && (
              <LazySection minHeight="120px">
                <Suspense fallback={null}>
                  <StatsBar />
                </Suspense>
              </LazySection>
            )}

            {/* 8. Occupational & ABA Therapy Programs */}
            {modules.services && (
              <>
                <LazySection minHeight="360px">
                  <Suspense fallback={null}>
                    <ServicesSection
                      onSelectService={handleSelectServiceForBooking}
                    />
                  </Suspense>
                </LazySection>
                {modules.courses && (
                  <LazySection minHeight="280px">
                    <Suspense fallback={null}>
                      <CoursesSliderSection
                        onRegisterCourse={handleOpenCourseRegistration}
                      />
                    </Suspense>
                  </LazySection>
                )}
                <LazySection minHeight="260px">
                  <Suspense fallback={null}>
                    <ShadowTeacherSection 
                      onSubmitRequest={handleConfirmBooking}
                    />
                  </Suspense>
                </LazySection>
                <LazySection minHeight="380px">
                  <Suspense fallback={null}>
                    <PackagesSection
                      onSelectPackage={handleSelectPackageForBooking}
                    />
                  </Suspense>
                </LazySection>
              </>
            )}

            {/* 10. Medical Specialists & CV Exploration */}
            {modules.specialists && (
              <LazySection minHeight="420px">
                <Suspense fallback={null}>
                  <SpecialistsSection
                    specialists={specialists}
                    onViewCv={handleViewCv}
                    onBookSpecialist={handleSelectSpecialistForBooking}
                    onOpenSpecialistsPage={handleOpenSpecialistsPage}
                  />
                </Suspense>
              </LazySection>
            )}

            {/* 11.4. Branches Network Slider (فروع الرياض والخرج) directly above Accreditations */}
            {modules.branches && (
              <LazySection minHeight="320px">
                <Suspense fallback={null}>
                  <BranchesSection onOpenBranchesPage={handleOpenBranchesPage} />
                </Suspense>
              </LazySection>
            )}

            {/* 11.45. Partners Horizontal Slider (شركاء النجاح والرعايات) directly above Accreditations */}
            {modules.partners !== false && (
              <LazySection minHeight="200px">
                <Suspense fallback={null}>
                  <PartnersSection />
                </Suspense>
              </LazySection>
            )}

            {/* 11.5. Accreditations & Certifications Section (معترف بنا من) in the footer of the blogs & branches */}
            {modules.accreditations && (
              <LazySection minHeight="220px">
                <Suspense fallback={null}>
                  <AccreditationsSection />
                </Suspense>
              </LazySection>
            )}

            {/* 12. Client Testimonials & Success Stories */}
            {modules.reviews && (
              <LazySection minHeight="360px">
                <Suspense fallback={null}>
                  <TestimonialsSection
                    testimonials={testimonials}
                    onAddTestimonial={(newReview) => setTestimonials((prev) => [newReview, ...prev])}
                  />
                </Suspense>
              </LazySection>
            )}

            {/* 13. Clinical Blog & Articles Slider */}
            {modules.blog && (
              <LazySection minHeight="360px">
                <Suspense fallback={null}>
                  <BlogSliderSection
                    onOpenBooking={handleOpenBooking}
                    onBookSpecialist={handleSelectSpecialistForBooking}
                  />
                </Suspense>
              </LazySection>
            )}
          </>
        )}

      </main>

      {/* Footer */}
      {modules.footer && (
        <LazySection minHeight="280px">
          <Suspense fallback={null}>
            <Footer onOpenAdmin={() => setIsAdminOpen(true)} />
          </Suspense>
        </LazySection>
      )}

      {/* Multi-Floating Actions & Mobile Bottom Bar wrapped in Suspense for zero main-thread blocking */}
      <Suspense fallback={null}>
        <FloatingActions
          onOpenBooking={handleOpenBooking}
          onOpenNotifications={() => setIsNotificationsOpen(true)}
          onOpenQuickConsult={() => setIsQuickConsultOpen(true)}
        />

        <MobileBottomBar
          onOpenBooking={handleOpenBooking}
          onOpenSpecialistsPage={handleOpenSpecialistsPage}
          onOpenServicesPage={handleOpenServicesPage}
          onOpenBranchesPage={handleOpenBranchesPage}
          onOpenOffersPage={handleOpenOffersPage}
          onGoHome={handleBackToHome}
          isSpecialistsPageOpen={isSpecialistsPageOpen}
          isServicesPageOpen={isServicesPageOpen}
          isBranchesPageOpen={isBranchesPageOpen}
          isOffersPageOpen={isOffersPageOpen}
        />
      </Suspense>

      {/* Modals wrapped in Suspense for zero initial blocking time */}
      <Suspense fallback={null}>
        {/* Quick Consultation Request Modal */}
        <QuickConsultationModal
          isOpen={isQuickConsultOpen}
          onClose={() => setIsQuickConsultOpen(false)}
          onSuccessSubmit={handleConfirmBooking}
        />
        {/* Login Modal */}
        <LoginModal
          isOpen={isLoginOpen}
          onClose={() => setIsLoginOpen(false)}
          onOpenAdmin={() => setIsAdminOpen(true)}
        />

        {/* Store Modal */}
        <StoreModal
          isOpen={isStoreOpen}
          onClose={() => setIsStoreOpen(false)}
          onAddToCart={() => setCartCount((prev) => prev + 1)}
        />

        {/* Course Registration Modal */}
        <CourseRegistrationModal
          course={selectedCourseForRegistration}
          isOpen={isCourseRegistrationOpen}
          onClose={() => {
            setIsCourseRegistrationOpen(false);
            setSelectedCourseForRegistration(null);
          }}
        />

        {/* Video Presentation Modal */}
        <VideoModal
          isOpen={isVideoOpen}
          onClose={() => setIsVideoOpen(false)}
          onBookNow={handleOpenBooking}
        />

        {/* Specialist CV Modal */}
        <SpecialistCvModal
          specialist={selectedCvSpecialist}
          onClose={() => setSelectedCvSpecialist(null)}
          onBookSpecialist={handleSelectSpecialistForBooking}
        />

        {/* Booking Appointment Modal (Direct Booking - No Payment) */}
        <BookingModal
          isOpen={isBookingOpen}
          onClose={() => setIsBookingOpen(false)}
          initialService={bookingInitialService}
          initialPackage={bookingInitialPackage}
          initialSpecialist={bookingInitialSpecialist}
          initialNotes={bookingInitialNotes}
          initialDate={bookingInitialDate}
          onConfirmBooking={handleConfirmBooking}
        />

        {/* Client Automated Session Notifications Center */}
        <NotificationCenterModal
          isOpen={isNotificationsOpen}
          onClose={() => setIsNotificationsOpen(false)}
          notifications={notifications}
          appointments={appointments}
          onMarkAllAsRead={handleMarkAllNotificationsAsRead}
          onAddTestNotification={handleAddTestNotification}
        />
      </Suspense>

    </div>
  );
}
