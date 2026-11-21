import React, { useState, useEffect, useRef, Suspense, lazy } from 'react';
import { Navbar } from './components/Navbar';
import { AnnouncementBar } from './components/AnnouncementBar';
import { AnimatedBackground } from './components/AnimatedBackground';
import { Hero } from './components/Hero';
import { MobileBottomBar } from './components/MobileBottomBar';
import { LazyViewportWrapper, SectionSkeleton } from './components/LazyViewportWrapper';
import { BookingModal } from './components/BookingModal';
import { BookingDirectoryPage } from './components/BookingDirectoryPage';
import { CourseItem } from './data/coursesData';
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
const BlogDirectoryPage = lazy<React.ComponentType<any>>(() => safeImport(() => import('./components/BlogDirectoryPage')).then((m: any) => ({ default: m.default || m.BlogDirectoryPage || (() => null) })));
const ShadowTeacherDirectoryPage = lazy<React.ComponentType<any>>(() => safeImport(() => import('./components/ShadowTeacherDirectoryPage')).then((m: any) => ({ default: m.default || m.ShadowTeacherDirectoryPage || (() => null) })));
const PartnersDirectoryPage = lazy<React.ComponentType<any>>(() => safeImport(() => import('./components/PartnersDirectoryPage')).then((m: any) => ({ default: m.default || m.PartnersDirectoryPage || (() => null) })));
const TestimonialsDirectoryPage = lazy<React.ComponentType<any>>(() => safeImport(() => import('./components/TestimonialsDirectoryPage')).then((m: any) => ({ default: m.default || m.TestimonialsDirectoryPage || (() => null) })));
const SpecialistCvModal = lazy<React.ComponentType<any>>(() => safeImport(() => import('./components/SpecialistCvModal')).then((m: any) => ({ default: m.default || m.SpecialistCvModal || (() => null) })));
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
const ServiceDetailPage = lazy<React.ComponentType<any>>(() => safeImport(() => import('./components/ServiceDetailPage')).then((m: any) => ({ default: m.default || m.ServiceDetailPage || (() => null) })));
const BranchDetailPage = lazy<React.ComponentType<any>>(() => safeImport(() => import('./components/BranchDetailPage')).then((m: any) => ({ default: m.default || m.BranchDetailPage || (() => null) })));
const AboutDirectoryPage = lazy<React.ComponentType<any>>(() => safeImport(() => import('./components/AboutDirectoryPage')).then((m: any) => ({ default: m.default || m.AboutDirectoryPage || (() => null) })));
const CoursesDirectoryPage = lazy<React.ComponentType<any>>(() => safeImport(() => import('./components/CoursesDirectoryPage')).then((m: any) => ({ default: m.default || m.CoursesDirectoryPage || (() => null) })));
const InfoDirectoryPage = lazy<React.ComponentType<any>>(() => safeImport(() => import('./components/InfoDirectoryPage')).then((m: any) => ({ default: m.default || m.InfoDirectoryPage || (() => null) })));
const ClientPortalPage = lazy<React.ComponentType<any>>(() => safeImport(() => import('./components/ClientPortalPage')).then((m: any) => ({ default: m.default || m.ClientPortalPage || (() => null) })));
import { resolveRouteSeo, getServiceSeoBySlug, getBranchSeoBySlug, generateBlogPostJsonLd } from './data/seoRoutes';


import { 
  Specialist, 
  ServiceItem, 
  TherapyPackage, 
  Appointment, 
  NotificationItem,
  AdminUser
} from './types';
import { useLiveData } from './context/LiveDataContext';

const readInitialAdminSession = (): AdminUser | null => {
  if (typeof window === 'undefined') return null;
  try {
    const rawSession = localStorage.getItem('raba_admin_session_auth');
    if (!rawSession) return null;
    const session = JSON.parse(rawSession);
    if (session?.expiresAt && Date.now() > session.expiresAt) return null;
    const rawUser = localStorage.getItem('raba_current_admin_user');
    if (!rawUser) return null;
    const user = JSON.parse(rawUser) as AdminUser;
    return user && user.status !== 'suspended' ? user : null;
  } catch {
    return null;
  }
};

const normalizePathname = (rawPath: string): string => {
  const clean = (rawPath || '/').split('?')[0].split('#')[0].replace(/\/+$/, '');
  return clean || '/';
};

const mapLegacyHashToPath = (hash: string): string | null => {
  const lower = (hash || '').toLowerCase();
  if (!lower || lower.startsWith('#admin')) return null;
  if (lower.startsWith('#blog/')) {
    const slug = hash.slice('#blog/'.length).replace(/^\/+|\/+$/g, '');
    return slug ? `/blog/${slug}` : '/blog';
  }
  if (lower === '#blog-directory' || lower === '#blog-page' || lower === '#blog') return '/blog';
  if (lower === '#articles') return '/articles';
  if (lower === '#specialists-directory' || lower === '#specialists-page' || lower === '#specialists') return '/specialists';
  if (lower === '#services-directory' || lower === '#services-page' || lower === '#services') return '/services';
  if (lower === '#branches-directory' || lower === '#branches-page' || lower === '#branches') return '/branches';
  if (lower === '#offers-directory' || lower === '#offers-page' || lower === '#offers' || lower === '#activities') return '/offers-directory';
  if (lower === '#shadow-teacher-directory' || lower === '#shadow-teacher-page' || lower === '#shadow-teacher' || lower === '#sewar') return '/shadow-teacher';
  if (lower === '#partners-directory' || lower === '#partners-page' || lower === '#partners') return '/partners';
  if (lower === '#testimonials-directory' || lower === '#testimonials-page' || lower === '#testimonials' || lower === '#reviews-directory' || lower === '#reviews') return '/testimonials';
  if (lower === '#courses') return '/courses';
  if (lower === '#about') return '/about';
  if (lower === '#booking' || lower === '#bookings' || lower === '#book' || lower === '#appointment' || lower === '#appointments' || lower === '#booking-form') return '/booking';
  if (lower === '#portal' || lower === '#family-portal') return '/portal';
  return null;
};

const getInitialRoutePath = (): string => {
  if (typeof window === 'undefined') return '/';
  const mapped = mapLegacyHashToPath(window.location.hash);
  if (mapped) return mapped;
  return normalizePathname(window.location.pathname);
};

export default function App() {
  // Real-time Firestore state from centralized LiveDataContext
  const { modules, specialists, testimonials, blogPosts, trackingPixels, loadingSettings } = useLiveData();

  // Safe, Smooth Background Hydration: Instant Hero paint on '/', immediate hydration on all sub-routes & crawlers
  const [isReadyToHydrate, setIsReadyToHydrate] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const ua = typeof navigator !== 'undefined' ? (navigator.userAgent || '') : '';
      if (/(bot|crawl|spider|googlebot|bingbot|yandex|baiduspider|applebot|slurp|duckduckbot|lighthouse|headlesschrome)/i.test(ua)) {
        return true;
      }
      const hash = window.location.hash.toLowerCase();
      return (
        getInitialRoutePath() !== '/' ||
        hash.startsWith('#admin') ||
        Boolean(localStorage.getItem('raba_admin_session_auth'))
      );
    }
    return false;
  });

  useEffect(() => {

    // Schedule hydration during browser idle time or right after initial paint
    let idleId: number | any;
    let timerId: any;

    const triggerHydration = () => {
      setIsReadyToHydrate(true);
      ['scroll', 'touchstart', 'wheel', 'mousemove', 'keydown'].forEach(evt => {
        window.removeEventListener(evt, triggerHydration);
      });
    };

    if ('requestIdleCallback' in window) {
      idleId = (window as any).requestIdleCallback(
        () => triggerHydration(),
        { timeout: 800 } // Guarantees mounting even on slow devices without user interaction
      );
    } else {
      timerId = setTimeout(triggerHydration, 300);
    }

    // Early trigger if user interacts before idle timeout
    ['scroll', 'touchstart', 'wheel', 'mousemove', 'keydown'].forEach(evt => {
      window.addEventListener(evt, triggerHydration, { passive: true, once: true });
    });

    const cleanupBelowFold = () => {
      if (idleId && 'cancelIdleCallback' in window) {
        (window as any).cancelIdleCallback(idleId);
      }
      if (timerId) {
        clearTimeout(timerId);
      }
      ['scroll', 'touchstart', 'wheel', 'mousemove', 'keydown'].forEach(evt => {
        window.removeEventListener(evt, triggerHydration);
      });
    };

    // Defer tracking pixels & external analytics until first interaction + browser idle (protects INP < 200ms)
    const scheduleDeferredPixels = () => {
      let executed = false;
      let pixelIdleId: number | any;
      let pixelTimerId: any;

      const loadPixels = () => {
        import('./utils/trackingPixels')
          .then(({ getStoredTrackingPixels, applyTrackingPixels }) => {
            applyTrackingPixels(getStoredTrackingPixels());
            return fetch('/api/tracking-pixels/active')
              .then(res => res.json())
              .then(json => {
                if (json.success && json.data) {
                  applyTrackingPixels(json.data);
                }
              });
          })
          .catch(() => {});
      };

      const run = () => {
        if (executed) return;
        executed = true;
        ['scroll', 'mousemove', 'touchstart', 'pointerdown', 'wheel'].forEach(evt => {
          window.removeEventListener(evt, run);
        });
        if ('requestIdleCallback' in window) {
          pixelIdleId = (window as any).requestIdleCallback(loadPixels, { timeout: 2500 });
        } else {
          pixelTimerId = setTimeout(loadPixels, 1500);
        }
      };

      ['scroll', 'mousemove', 'touchstart', 'pointerdown', 'wheel'].forEach(evt => {
        window.addEventListener(evt, run, { passive: true, once: true });
      });

      return () => {
        if (pixelIdleId && 'cancelIdleCallback' in window) {
          (window as any).cancelIdleCallback(pixelIdleId);
        }
        if (pixelTimerId) {
          clearTimeout(pixelTimerId);
        }
        ['scroll', 'mousemove', 'touchstart', 'pointerdown', 'wheel'].forEach(evt => {
          window.removeEventListener(evt, run);
        });
      };
    };

    const cleanupPixels = scheduleDeferredPixels();

    // Dismiss splash overlay as soon as App component renders
    if (typeof window !== 'undefined' && (window as any).dismissSplash) {
      (window as any).dismissSplash();
    }

    const handleNewRequest = (e: any) => {
      const req = e?.detail as Appointment;
      if (req) {
        setAppointments((prev) => [req, ...prev.filter(a => a.id !== req.id)]);
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

    const handleAppointmentsUpdate = (e: any) => {
      if (Array.isArray(e?.detail)) {
        const next = e.detail;
        setAppointments((prev) => {
          if (prev.length === next.length && prev.every((a, i) => a.id === next[i].id)) return prev;
          return next;
        });
      }
    };

    window.addEventListener(DISPATCH_REQUEST_EVENT, handleNewRequest);
    window.addEventListener('raba_notifications_updated', handleNotifsUpdate);
    window.addEventListener('raba_appointments_updated', handleAppointmentsUpdate);

    return () => {
      window.removeEventListener(DISPATCH_REQUEST_EVENT, handleNewRequest);
      window.removeEventListener('raba_notifications_updated', handleNotifsUpdate);
      window.removeEventListener('raba_appointments_updated', handleAppointmentsUpdate);
      cleanupPixels();
      cleanupBelowFold();
    };
  }, []);

  // Reactive live tracking pixels update whenever Firestore site_settings pushes changes
  useEffect(() => {
    if (loadingSettings) return;
    import('./utils/trackingPixels')
      .then(({ applyTrackingPixels }) => {
        applyTrackingPixels(trackingPixels);
      })
      .catch(() => {});
  }, [loadingSettings, trackingPixels]);

  const didHydrateDefaultsRef = useRef(false);

  // Persistence state (initialized synchronously from localStorage; defaults hydrated lazily out of critical bundle)
  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    try {
      const saved = localStorage.getItem('raba_appointments') || localStorage.getItem('khotwa_appointments');
      if (!saved) return [];
      const list: Appointment[] = JSON.parse(saved);
      if (!Array.isArray(list)) return [];
      const seen = new Set<string>();
      return list.filter((item) => {
        if (!item || !item.id || seen.has(item.id)) return false;
        seen.add(item.id);
        return true;
      });
    } catch {
      return [];
    }
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem('raba_notifications') || localStorage.getItem('khotwa_notifications');
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  // Save appointments & notifications to localStorage
  useEffect(() => {
    if (!didHydrateDefaultsRef.current && appointments.length === 0) return;
    try {
      localStorage.setItem('raba_appointments', JSON.stringify(appointments));
    } catch {
      // ignore
    }
  }, [appointments]);

  useEffect(() => {
    if (!didHydrateDefaultsRef.current && notifications.length === 0) return;
    try {
      localStorage.setItem('raba_notifications', JSON.stringify(notifications));
    } catch {
      // ignore
    }
  }, [notifications]);

  // Modal states
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isStoreOpen, setIsStoreOpen] = useState(false);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [isQuickConsultOpen, setIsQuickConsultOpen] = useState(false);
  // Page states - Derived strictly from clean currentPath URL
  const [isAdminOpen, setIsAdminOpen] = useState(() => {
    return typeof window !== 'undefined' && window.location.hash === '#admin';
  });
  const [currentPath, setCurrentPath] = useState<string>(() => getInitialRoutePath());

  const lowerPath = currentPath.toLowerCase();
  const serviceDetailSlug = lowerPath.startsWith('/services/') ? lowerPath.slice('/services/'.length) : null;
  const isServiceDetailPageOpen = Boolean(serviceDetailSlug && getServiceSeoBySlug(serviceDetailSlug));
  const isServicesPageOpen = lowerPath === '/services' || lowerPath === '/services-directory' || (lowerPath.startsWith('/services/') && !isServiceDetailPageOpen);
  const isSpecialistsPageOpen = lowerPath === '/specialists' || lowerPath === '/specialists-directory' || lowerPath.startsWith('/specialist/');
  const branchDetailSlugRaw = lowerPath.startsWith('/branches/') ? lowerPath.slice('/branches/'.length) : null;
  const branchDetailConfig = branchDetailSlugRaw ? getBranchSeoBySlug(branchDetailSlugRaw) : undefined;
  const isBranchDetailPageOpen = Boolean(branchDetailConfig);
  const isBranchesPageOpen = lowerPath === '/branches' || lowerPath === '/branches-directory' || (lowerPath.startsWith('/branches/') && !isBranchDetailPageOpen);
  const isOffersPageOpen = lowerPath === '/offers' || lowerPath === '/offers-directory';
  const isCoursesPageOpen = lowerPath === '/courses' || lowerPath === '/courses-directory' || lowerPath.startsWith('/courses/');
  const isAboutPageOpen = lowerPath === '/about';
  const isBookingPageOpen =
    lowerPath === '/booking' ||
    lowerPath === '/bookings' ||
    lowerPath === '/book' ||
    lowerPath === '/appointment' ||
    lowerPath === '/appointments' ||
    lowerPath === '/booking-form';
  const isShadowTeacherPageOpen = lowerPath === '/shadow-teacher' || lowerPath === '/shadow-teacher-directory' || lowerPath === '/sewar';
  const isPartnersPageOpen = lowerPath === '/partners' || lowerPath === '/partners-directory';
  const isTestimonialsPageOpen = lowerPath === '/testimonials' || lowerPath === '/testimonials-directory' || lowerPath === '/reviews';
  const isBlogPageOpen = lowerPath === '/blog' || lowerPath === '/blog-directory' || lowerPath === '/articles' || lowerPath.startsWith('/blog/') || lowerPath.startsWith('/articles/');
  const isContactPageOpen = lowerPath === '/contact';
  const isPrivacyPageOpen = lowerPath === '/privacy' || lowerPath === '/privacy-policy';
  const isTermsPageOpen = lowerPath === '/terms' || lowerPath === '/terms-of-service';
  const isPortalPageOpen = lowerPath === '/portal';

  const activeBlogSlug = React.useMemo(() => {
    if (lowerPath.startsWith('/blog/') || lowerPath.startsWith('/articles/')) {
      const raw = currentPath.replace(/^\/(?:blog|articles)\//i, '').replace(/\/+$/, '');
      if (!raw) return null;
      try {
        return decodeURIComponent(raw);
      } catch {
        return raw;
      }
    }
    return null;
  }, [currentPath, lowerPath]);

  const [adminSession, setAdminSession] = useState<AdminUser | null>(() => readInitialAdminSession());
  const [firebaseAdminUid, setFirebaseAdminUid] = useState<string | null>(null);
  const [firebaseAdminEmail, setFirebaseAdminEmail] = useState<string | null>(null);
  const [appointmentsSyncLoading, setAppointmentsSyncLoading] = useState<boolean>(false);
  const [appointmentsSyncError, setAppointmentsSyncError] = useState<string | null>(null);

  const fetchCloudAppointments = React.useCallback(async () => {
    setAppointmentsSyncLoading(true);
    setAppointmentsSyncError(null);
    try {
      const [{ getLazyAuth }, { ensureAdminCloudSession, verifyIsFirebaseAdmin, getAppointmentsFromFirestore }] = await Promise.all([
        import('./lib/firebase'),
        import('./services/firestoreService'),
      ]);
      const authInstance = await getLazyAuth();
      if (typeof (authInstance as any).authStateReady === 'function') {
        await (authInstance as any).authStateReady();
      }

      let currentFbUser = authInstance.currentUser;
      let isVerifiedAdmin = currentFbUser ? await verifyIsFirebaseAdmin(currentFbUser) : false;

      if (!isVerifiedAdmin && adminSession) {
        const autoFbUser = await ensureAdminCloudSession(adminSession);
        if (autoFbUser) {
          currentFbUser = autoFbUser;
          isVerifiedAdmin = await verifyIsFirebaseAdmin(autoFbUser);
        }
      }

      setFirebaseAdminEmail(currentFbUser?.email || null);

      if (isVerifiedAdmin && currentFbUser) {
        setFirebaseAdminUid(currentFbUser.uid);
        const cloudList = await getAppointmentsFromFirestore();
        setAppointments(cloudList);
        return;
      }

      setFirebaseAdminUid(null);

      // Local/non-admin session without Firebase Admin Auth: gracefully sync from Cloud SQL API without triggering unauthenticated Firestore LIST
      try {
        const [{ getAdminHeaders }, { sortAppointmentsNewestFirst }] = await Promise.all([
          import('./utils/persistentSync'),
          import('./services/firestoreService')
        ]);
        const resp = await fetch('/api/db/appointments', { headers: getAdminHeaders() });
        if (resp.ok) {
          const data = await resp.json();
          if (data?.success && Array.isArray(data.appointments) && data.appointments.length > 0) {
            const dbMapped: Appointment[] = data.appointments.map((row: any) => ({
              id: String(row.id || `apt-db-${Date.now()}`),
              referenceNumber: `RB-${String(row.id || '000000').slice(-6).toUpperCase()}`,
              childName: row.patientName || row.patient_name || '',
              childAge: 0,
              guardianName: row.patientName || row.patient_name || '',
              guardianPhone: row.phone || '',
              serviceId: 'general',
              serviceTitle: row.service || 'جلسة تأهيلية',
              specialistId: 'general',
              specialistName: row.specialist || 'أخصائي المركز',
              date: row.date || '',
              timeSlot: row.time || '',
              status: (row.status as Appointment['status']) || 'pending',
              paymentStatus: 'unpaid',
              paymentMethod: 'mada',
              amount: 0,
              reminderSettings: { whatsapp: true, sms: false, email: false },
              notes: row.notes || '',
              createdAt: row.createdAt || new Date().toISOString()
            }));
            setAppointments((prev) => {
              const existingIds = new Set(prev.map((a) => a.id));
              const merged = [...prev];
              for (const item of dbMapped) {
                if (!existingIds.has(item.id)) {
                  merged.push(item);
                }
              }
              return sortAppointmentsNewestFirst(merged);
            });
          }
        }
      } catch {
        // Non-blocking fallback when static preview has no Express backend
      }
    } catch (err: any) {
      console.error('[App] Failed to fetch appointments from Firestore:', err);
      import('./services/firestoreService')
        .then(({ formatFirestoreUiError }) => {
          setAppointmentsSyncError(formatFirestoreUiError(err, true).message);
        })
        .catch(() => {
          setAppointmentsSyncError('تعذر مزامنة الحجوزات من قاعدة البيانات السحابية.');
        });
    } finally {
      setAppointmentsSyncLoading(false);
    }
  }, [adminSession]);

  // Lazy-hydrate appointments/notifications defaults after Hero render / on interactive demand
  useEffect(() => {
    if (didHydrateDefaultsRef.current) return;
    if (!isReadyToHydrate && !isAdminOpen && !isSpecialistsPageOpen && !isNotificationsOpen && !isBookingOpen) {
      return;
    }
    didHydrateDefaultsRef.current = true;
    let cancelled = false;

    import('./data/mockData')
      .then((mock) => {
        if (cancelled) return;
        const { INITIAL_APPOINTMENTS, INITIAL_NOTIFICATIONS } = mock;

        if (!isAdminOpen) {
          setAppointments((prev) => {
            if (prev.length > 0) return prev;
            const seen = new Set<string>();
            return INITIAL_APPOINTMENTS.filter((item) => {
              if (!item || !item.id || seen.has(item.id)) return false;
              seen.add(item.id);
              return true;
            });
          });
        }

        setNotifications((prev) => (prev.length > 0 ? prev : INITIAL_NOTIFICATIONS));
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [isReadyToHydrate, isAdminOpen, isSpecialistsPageOpen, isNotificationsOpen, isBookingOpen]);

  // Automatically hydrate & persist Firebase Admin Auth state via onAuthStateChanged whenever Admin Dashboard is active
  useEffect(() => {
    if (!isAdminOpen) return;
    import('./data/adminData')
      .then(({ getStoredAdminSession }) => setAdminSession(getStoredAdminSession()))
      .catch(() => {});

    let cancelled = false;
    let unsubAuth: (() => void) | undefined;
    let didAttemptSilentProvision = false;

    Promise.all([
      import('./lib/firebase'),
      import('firebase/auth'),
      import('./services/firestoreService'),
    ]).then(async ([{ getLazyAuth }, { onAuthStateChanged }, { verifyIsFirebaseAdmin, ensureAdminCloudSession }]) => {
      if (cancelled) return;
      const authInstance = await getLazyAuth();
      if (typeof (authInstance as any).authStateReady === 'function') {
        await (authInstance as any).authStateReady();
      }
      if (cancelled) return;

      const evaluateUser = async (fbUser: any) => {
        if (cancelled) return;
        setFirebaseAdminEmail(fbUser?.email || null);

        if (fbUser) {
          const ok = await verifyIsFirebaseAdmin(fbUser);
          if (!cancelled && ok) {
            setFirebaseAdminUid(fbUser.uid);
            return;
          }
        }

        // Silent automatic cloud auth provisioning for active admin sessions (zero manual linking)
        if (!didAttemptSilentProvision && adminSession && adminSession.status !== 'suspended') {
          didAttemptSilentProvision = true;
          const provisionedUser = await ensureAdminCloudSession(adminSession);
          if (!cancelled && provisionedUser) {
            const okAfter = await verifyIsFirebaseAdmin(provisionedUser);
            if (!cancelled) {
              setFirebaseAdminEmail(provisionedUser.email || adminSession.email || null);
              setFirebaseAdminUid(okAfter ? provisionedUser.uid : provisionedUser.uid);
            }
            return;
          }
        }

        if (!cancelled) {
          setFirebaseAdminUid(null);
        }
      };

      await evaluateUser(authInstance.currentUser);
      if (cancelled) return;
      unsubAuth = onAuthStateChanged(authInstance, (user) => {
        evaluateUser(user);
      });
    }).catch(() => {});

    return () => {
      cancelled = true;
      if (unsubAuth) unsubAuth();
    };
  }, [isAdminOpen, adminSession?.id]);

  // Immediately stream live Firestore appointments the millisecond Admin Dashboard mounts
  useEffect(() => {
    if (!isAdminOpen || !adminSession) return;
    let cancelled = false;
    let unsubAppointments: (() => void) | undefined;

    fetchCloudAppointments();

    import('./services/firestoreService')
      .then(async ({ ensureAdminCloudSession, subscribeAppointments, formatFirestoreUiError }) => {
        if (cancelled) return;
        if (!firebaseAdminUid) {
          await ensureAdminCloudSession(adminSession);
        }
        if (cancelled) return;
        unsubAppointments = subscribeAppointments(
          (cloudList) => {
            if (!cancelled) {
              setAppointments(cloudList);
              setAppointmentsSyncError(null);
            }
          },
          (err) => {
            if (!cancelled) {
              console.error('[Firestore Live Sync Error]:', err?.code || 'unknown', err?.message || err);
              setAppointmentsSyncError(formatFirestoreUiError(err, true).message);
            }
          }
        );
      })
      .catch(() => {});

    return () => {
      cancelled = true;
      if (unsubAppointments) unsubAppointments();
    };
  }, [isAdminOpen, adminSession?.id, firebaseAdminUid, fetchCloudAppointments]);
  const [cartCount, setCartCount] = useState(0);
  const [selectedCourseForRegistration, setSelectedCourseForRegistration] = useState<CourseItem | null>(null);
  const [isCourseRegistrationOpen, setIsCourseRegistrationOpen] = useState(false);

  const navigateTo = React.useCallback((targetPath: string, opts?: { replace?: boolean }) => {
    const normalized = normalizePathname(targetPath);
    setIsReadyToHydrate(true);
    setIsBookingOpen(false);
    setIsAdminOpen(false);

    if (typeof window !== 'undefined') {
      const nextUrl = normalized + window.location.search;
      if (opts?.replace) {
        window.history.replaceState('', document.title, nextUrl);
      } else if (normalizePathname(window.location.pathname) !== normalized || window.location.hash) {
        window.history.pushState('', document.title, nextUrl);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setCurrentPath(normalized);
  }, []);

  // Canonicalize legacy hash routes on boot to clean URLs
  useEffect(() => {
    const mapped = mapLegacyHashToPath(window.location.hash);
    if (mapped) {
      navigateTo(mapped, { replace: true });
    }
  }, [navigateTo]);

  // Synchronize Document Title, Meta Description, Canonical, OpenGraph & JSON-LD per route using live blogPosts
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const seo = resolveRouteSeo(currentPath, blogPosts);
    document.title = seo.title;

    const setMetaTag = (selector: string, attr: 'name' | 'property', key: string, content: string) => {
      let el = document.querySelector(selector) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    setMetaTag('meta[name="description"]', 'name', 'description', seo.description);
    setMetaTag('meta[property="og:url"]', 'property', 'og:url', seo.canonical);
    setMetaTag('meta[property="og:title"]', 'property', 'og:title', seo.title);
    setMetaTag('meta[property="og:description"]', 'property', 'og:description', seo.description);
    setMetaTag('meta[property="og:type"]', 'property', 'og:type', seo.ogType);
    if (seo.ogImage) {
      setMetaTag('meta[property="og:image"]', 'property', 'og:image', seo.ogImage);
      setMetaTag('meta[name="twitter:image"]', 'name', 'twitter:image', seo.ogImage);
    }
    setMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', seo.title);
    setMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', seo.description);

    let canonicalEl = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonicalEl) {
      canonicalEl = document.createElement('link');
      canonicalEl.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalEl);
    }
    canonicalEl.setAttribute('href', seo.canonical);

    const lowerRoute = currentPath.toLowerCase();
    const dynamicJsonLd =
      lowerRoute.startsWith('/blog/') || lowerRoute.startsWith('/articles/')
        ? generateBlogPostJsonLd(currentPath, blogPosts).jsonLd
        : seo.jsonLd;

    let ldEl = document.getElementById('raba-structured-data') as HTMLScriptElement | null;
    if (!ldEl) {
      ldEl = document.createElement('script');
      ldEl.id = 'raba-structured-data';
      ldEl.type = 'application/ld+json';
      document.head.appendChild(ldEl);
    }
    ldEl.textContent = JSON.stringify(dynamicJsonLd);
  }, [currentPath, blogPosts]);

  const handleOpenCourseRegistration = (course: CourseItem) => {
    setSelectedCourseForRegistration(course);
    setIsCourseRegistrationOpen(true);
  };

  const handleOpenSpecialistsPage = () => navigateTo('/specialists');
  const handleOpenServicesPage = () => navigateTo('/services');
  const handleOpenBranchesPage = () => navigateTo('/branches');
  const handleOpenOffersPage = () => navigateTo('/offers-directory');
  const handleOpenShadowTeacherPage = () => navigateTo('/shadow-teacher');
  const handleOpenPartnersPage = () => navigateTo('/partners');
  const handleOpenTestimonialsPage = () => navigateTo('/testimonials');
  const handleOpenBlogPage = (postSlug?: string) => {
    navigateTo(postSlug ? `/blog/${postSlug}` : '/blog');
  };
  const handleBackToHome = () => navigateTo('/');

  useEffect(() => {
    const handlePopState = () => {
      setIsReadyToHydrate(true);
      const hash = window.location.hash.toLowerCase();
      setIsAdminOpen(hash.startsWith('#admin'));
      const mapped = mapLegacyHashToPath(window.location.hash);
      setCurrentPath(mapped || normalizePathname(window.location.pathname));
    };

    const handleHashChange = () => {
      setIsReadyToHydrate(true);
      const hash = window.location.hash.toLowerCase();
      if (hash.startsWith('#admin')) {
        setIsAdminOpen(true);
        return;
      }
      setIsAdminOpen(false);
      const mapped = mapLegacyHashToPath(window.location.hash);
      if (mapped) {
        navigateTo(mapped, { replace: true });
      }
    };

    const handleAuthChange = (e: any) => {
      if (e?.detail !== undefined) {
        setAdminSession(e.detail);
      } else {
        import('./data/adminData')
          .then(({ getStoredAdminSession }) => setAdminSession(getStoredAdminSession()))
          .catch(() => setAdminSession(readInitialAdminSession()));
      }
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('raba_admin_auth_changed', handleAuthChange);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('raba_admin_auth_changed', handleAuthChange);
    };
  }, [navigateTo]);
  const [selectedCvSpecialist, setSelectedCvSpecialist] = useState<Specialist | null>(null);

  // Pre-selected items for booking flow
  const [bookingInitialService, setBookingInitialService] = useState<ServiceItem | null>(null);
  const [bookingInitialPackage, setBookingInitialPackage] = useState<TherapyPackage | null>(null);
  const [bookingInitialSpecialist, setBookingInitialSpecialist] = useState<Specialist | null>(null);
  const [bookingInitialNotes, setBookingInitialNotes] = useState<string>('');
  const [bookingInitialDate, setBookingInitialDate] = useState<string>('');

  // Handlers
  const handleOpenBooking = () => {
    setIsReadyToHydrate(true);
    setBookingInitialService(null);
    setBookingInitialPackage(null);
    setBookingInitialSpecialist(null);
    setBookingInitialNotes('');
    setBookingInitialDate('');
    if (isBookingPageOpen) {
      const formEl = document.getElementById('booking-directory-form');
      if (formEl) {
        formEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }
    setIsBookingOpen(true);
  };

  const handleOpenBookingWithNotes = (notes?: string) => {
    setIsReadyToHydrate(true);
    setBookingInitialService(null);
    setBookingInitialPackage(null);
    setBookingInitialSpecialist(null);
    setBookingInitialDate('');
    setBookingInitialNotes(notes || '');
    setIsBookingOpen(true);
  };

  const handleSelectServiceForBooking = (service?: ServiceItem | null) => {
    setIsReadyToHydrate(true);
    setBookingInitialService(service || null);
    setBookingInitialPackage(null);
    setBookingInitialSpecialist(null);
    setBookingInitialNotes('');
    setBookingInitialDate('');
    setIsBookingOpen(true);
  };

  const handleSelectPackageForBooking = (pkg?: TherapyPackage | null) => {
    setIsReadyToHydrate(true);
    setBookingInitialPackage(pkg || null);
    setBookingInitialService(null);
    setBookingInitialSpecialist(null);
    setBookingInitialNotes('');
    setBookingInitialDate('');
    setIsBookingOpen(true);
  };

  const handleSelectSpecialistForBooking = (specialist?: Specialist | null) => {
    setIsReadyToHydrate(true);
    setBookingInitialSpecialist(specialist || null);
    setBookingInitialService(null);
    setBookingInitialPackage(null);
    setBookingInitialNotes('');
    setBookingInitialDate('');
    setIsBookingOpen(true);
  };

  const handleClaimOffer = (offerTitle: string, discountedPrice?: number) => {
    setIsReadyToHydrate(true);
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

  const handleConfirmBooking = (confirmedAppointment: Appointment) => {
    // Firestore persistence already completed by the submitting modal/form before calling this callback.
    // Update React state with duplicate protection.
    const sanitizedApp = {
      ...confirmedAppointment,
      id: confirmedAppointment.id || `apt-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
    };
    setAppointments((prev) => [sanitizedApp, ...prev.filter(a => a.id !== sanitizedApp.id)]);

    // Create immediate confirmation notification for user (avoiding duplicate entry for same appointmentId)
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

    setNotifications((prev) =>
      prev.some((n) => n.appointmentId === confirmedAppointment.id)
        ? prev
        : [newConfirmationNotif, ...prev]
    );
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
        <Suspense fallback={<div className="min-h-screen bg-[#F5F2EC] dark:bg-[#0B0F17] flex items-center justify-center text-[#1263D6] dark:text-[#60AFFF] font-bold">جاري تحميل تسجيل الدخول...</div>}>
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
      <Suspense fallback={<div className="min-h-screen bg-[#F5F2EC] dark:bg-[#0B0F17] flex items-center justify-center text-[#1263D6] dark:text-[#60AFFF] font-bold">جاري تحميل لوحة التحكم...</div>}>
        <AdminDashboard
          appointments={appointments}
          onUpdateAppointments={setAppointments}
          isSyncingAppointments={appointmentsSyncLoading}
          appointmentsSyncError={appointmentsSyncError}
          isFirebaseAuthenticated={Boolean(firebaseAdminUid)}
          firebaseAuthEmail={firebaseAdminEmail}
          onRefreshAppointments={fetchCloudAppointments}
          reviews={testimonials}
          onUpdateReviews={async (updatedReviews: any) => {
            try {
              const [{ syncTestimonialsCollectionToFirestore }, { savePersistentModule }] = await Promise.all([
                import('./services/firestoreService'),
                import('./utils/persistentSync')
              ]);
              const [colOk, modOk] = await Promise.all([
                syncTestimonialsCollectionToFirestore(updatedReviews),
                savePersistentModule('raba_testimonials', updatedReviews)
              ]);
              return colOk || modOk;
            } catch (err) {
              console.error('[App] Failed to sync reviews:', err);
              return false;
            }
          }}
          specialists={specialists}
          onUpdateSpecialists={async (updatedSpecialists: Specialist[]) => {
            try {
              const [{ syncSpecialistsCollectionToFirestore }, { savePersistentModule }] = await Promise.all([
                import('./services/firestoreService'),
                import('./utils/persistentSync')
              ]);
              const [colOk, modOk] = await Promise.all([
                syncSpecialistsCollectionToFirestore(updatedSpecialists),
                savePersistentModule('raba_specialists', updatedSpecialists)
              ]);
              return colOk || modOk;
            } catch (err) {
              console.error('[App] Failed to sync specialists:', err);
              return false;
            }
          }}
          onLogout={() => {
            setAdminSession(null);
            setFirebaseAdminUid(null);
            setFirebaseAdminEmail(null);
            Promise.all([
              import('./lib/firebase'),
              import('firebase/auth')
            ])
              .then(async ([{ getLazyAuth }, { signOut }]) => {
                const authInstance = await getLazyAuth();
                await signOut(authInstance);
              })
              .catch(() => {});
            import('./data/adminData')
              .then(({ clearStoredAdminSession }) => clearStoredAdminSession())
              .catch(() => {
                try {
                  localStorage.removeItem('raba_admin_session_auth');
                  localStorage.removeItem('raba_current_admin_user');
                } catch {
                  // ignore
                }
              });
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
    <div className="min-h-screen relative flex flex-col font-sans text-[#161B26] dark:text-[#F8FAFC] selection:bg-[#1463D6] selection:text-white md:transition-colors md:duration-300 overflow-x-clip w-full max-w-[100vw] pb-16 md:pb-0" dir="rtl">
      
      {/* 1. Gentle Animated Background with floating pediatric shapes */}
      <AnimatedBackground />

      {/* 2. Sticky Header */}
      <Navbar
        onOpenBooking={handleOpenBooking}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenLogin={() => setIsLoginOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenPortal={() => navigateTo('/portal')}
        onOpenStore={() => setIsStoreOpen(true)}
        onOpenSpecialistsPage={handleOpenSpecialistsPage}
        onOpenServicesPage={handleOpenServicesPage}
        onOpenBranchesPage={handleOpenBranchesPage}
        onOpenOffersPage={handleOpenOffersPage}
        onOpenBlogPage={handleOpenBlogPage}
        onOpenShadowTeacherPage={handleOpenShadowTeacherPage}
        onOpenPartnersPage={handleOpenPartnersPage}
        onOpenTestimonialsPage={handleOpenTestimonialsPage}
        onGoHome={handleBackToHome}
        isSpecialistsPageOpen={isSpecialistsPageOpen}
        isServicesPageOpen={isServicesPageOpen || isServiceDetailPageOpen}
        isBranchesPageOpen={isBranchesPageOpen || isBranchDetailPageOpen}
        isOffersPageOpen={isOffersPageOpen}
        isBlogPageOpen={isBlogPageOpen}
        isShadowTeacherPageOpen={isShadowTeacherPageOpen}
        isPartnersPageOpen={isPartnersPageOpen}
        isTestimonialsPageOpen={isTestimonialsPageOpen}
        currentPath={currentPath}
        onNavigate={navigateTo}
        unreadCount={unreadCount}
        cartCount={cartCount}
      />

      {/* 2.5. Theme-Aligned Header Notification / Announcement Bar */}
      <AnnouncementBar
        onOpenBooking={handleOpenBooking}
        onOpenOffersPage={handleOpenOffersPage}
        onOpenBranchesPage={handleOpenBranchesPage}
        onOpenPortal={() => navigateTo('/portal')}
        onNavigate={navigateTo}
      />

      {/* Main Content Area */}
      <main className="flex-1 relative z-10">
        
        {isSpecialistsPageOpen ? (
          /* Dedicated Specialists Page with Specialty Filter and Grid Format Display */
          <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center text-[#1263D6] dark:text-[#60AFFF] font-bold">جاري تحميل دليل الأخصائيين...</div>}>
            <SpecialistsDirectoryPage
              specialists={specialists}
              onBackToHome={handleBackToHome}
              onViewCv={handleViewCv}
              onBookSpecialist={handleSelectSpecialistForBooking}
            />
          </Suspense>
        ) : isServiceDetailPageOpen && serviceDetailSlug ? (
          /* Dedicated Single Clinical Service Detail Page (/services/:slug) */
          <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center text-[#1263D6] dark:text-[#60AFFF] font-bold">جاري تحميل تفاصيل البرنامج العلاجي...</div>}>
            <ServiceDetailPage
              serviceSlug={serviceDetailSlug}
              onBackToHome={handleBackToHome}
              onNavigate={navigateTo}
              onSelectService={handleSelectServiceForBooking}
            />
          </Suspense>
        ) : isServicesPageOpen ? (
          /* Dedicated Comprehensive Services Directory Page (Rehab Programs, Courses, Packages & Pricing in Grid) */
          <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center text-[#1263D6] dark:text-[#60AFFF] font-bold">جاري تحميل دليل الخدمات الشامل...</div>}>
            <ServicesDirectoryPage
              onBackToHome={handleBackToHome}
              onSelectService={handleSelectServiceForBooking}
              onSelectPackage={handleSelectPackageForBooking}
              onRegisterCourse={handleOpenCourseRegistration}
              onOpenSpecialistsPage={handleOpenSpecialistsPage}
              onOpenServiceDetail={(slug) => navigateTo(`/services/${slug}`)}
            />
          </Suspense>
        ) : isBranchDetailPageOpen && branchDetailConfig ? (
          /* Dedicated Local SEO Branch Detail Page (/branches/riyadh | /branches/alkharj) */
          <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center text-[#1263D6] dark:text-[#60AFFF] font-bold">جاري تحميل صفحة الفرع والخدمات الإكلينيكية...</div>}>
            <BranchDetailPage
              branchSlug={branchDetailConfig.slug}
              onBackToHome={handleBackToHome}
              onNavigate={navigateTo}
              onOpenBooking={handleOpenBookingWithNotes}
            />
          </Suspense>
        ) : isBranchesPageOpen ? (
          /* Dedicated Branches Directory Page with Cities Filter and Slider/Grid Switcher */
          <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center text-[#1263D6] dark:text-[#60AFFF] font-bold">جاري تحميل دليل فروع مركز رابا...</div>}>
            <BranchesDirectoryPage
              onBackToHome={handleBackToHome}
              onNavigate={navigateTo}
              onSelectBranch={(branch) => {
                handleOpenBookingWithNotes(`استفسار وحجز في فرع: ${branch.name} (${branch.cityNameAr})`);
              }}
              onOpenBooking={handleOpenBookingWithNotes}
            />
          </Suspense>
        ) : isOffersPageOpen ? (
          /* Dedicated Offers & Activities Page (Moved from Homepage to Separate Page) */
          <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center text-[#1263D6] dark:text-[#60AFFF] font-bold">جاري تحميل صفحة العروض والأنشطة...</div>}>
            <OffersDirectoryPage
              onBackToHome={handleBackToHome}
              onClaimOffer={handleClaimOffer}
              onOpenBooking={handleOpenBookingWithNotes}
            />
          </Suspense>
        ) : isCoursesPageOpen ? (
          /* Dedicated Accredited Training Courses Directory Page (/courses) */
          <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center text-[#1263D6] dark:text-[#60AFFF] font-bold">جاري تحميل صفحة الدورات التدريبية المعتمدة...</div>}>
            <CoursesDirectoryPage
              onBackToHome={handleBackToHome}
              onRegisterCourse={handleOpenCourseRegistration}
              onOpenBooking={handleOpenBooking}
            />
          </Suspense>
        ) : isAboutPageOpen ? (
          /* Dedicated About Raba Center Page (/about) */
          <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center text-[#1263D6] dark:text-[#60AFFF] font-bold">جاري تحميل صفحة التعريف بمركز رابا...</div>}>
            <AboutDirectoryPage
              onBackToHome={handleBackToHome}
              onOpenBooking={handleOpenBooking}
            />
          </Suspense>
        ) : isBookingPageOpen ? (
          /* Dedicated Standalone Booking Page (/booking) - Statically imported for guaranteed immediate rendering */
          <BookingDirectoryPage
            onBackToHome={handleBackToHome}
            onConfirmBooking={handleConfirmBooking}
            initialService={bookingInitialService}
            initialPackage={bookingInitialPackage}
            initialSpecialist={bookingInitialSpecialist}
            initialNotes={bookingInitialNotes}
            initialDate={bookingInitialDate}
            onNavigate={navigateTo}
          />
        ) : isBlogPageOpen ? (
          /* Dedicated Articles & Clinical Blog Directory Page */
          <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center text-[#1263D6] dark:text-[#60AFFF] font-bold">جاري تحميل المدونة الطبية والدليل المعرفي...</div>}>
            <BlogDirectoryPage
              onBackToHome={handleBackToHome}
              onOpenBooking={handleOpenBookingWithNotes}
              onBookSpecialist={handleSelectSpecialistForBooking}
              initialPostSlug={activeBlogSlug}
              onNavigate={navigateTo}
              onPostChange={(slug) => navigateTo(slug ? `/blog/${slug}` : '/blog')}
            />
          </Suspense>
        ) : isShadowTeacherPageOpen ? (
          /* Dedicated Sewar (Shadow Teacher) Service Page */
          <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center text-[#1263D6] dark:text-[#60AFFF] font-bold">جاري تحميل صفحة خدمة سِوار (معلم الظل)...</div>}>
            <ShadowTeacherDirectoryPage
              onBackToHome={handleBackToHome}
              onSubmitRequest={handleConfirmBooking}
              onOpenBooking={handleOpenBooking}
              onNavigate={navigateTo}
            />
          </Suspense>
        ) : isPartnersPageOpen ? (
          /* Dedicated Success Partners Directory Page */
          <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center text-[#1263D6] dark:text-[#60AFFF] font-bold">جاري تحميل صفحة شركاء النجاح...</div>}>
            <PartnersDirectoryPage
              onBackToHome={handleBackToHome}
              onOpenBooking={handleOpenBooking}
            />
          </Suspense>
        ) : isTestimonialsPageOpen ? (
          /* Dedicated Client Reviews & Testimonials Page */
          <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center text-[#1263D6] dark:text-[#60AFFF] font-bold">جاري تحميل صفحة آراء العملاء...</div>}>
            <TestimonialsDirectoryPage
              testimonials={testimonials}
              onBackToHome={handleBackToHome}
              onOpenBooking={handleOpenBooking}
            />
          </Suspense>
        ) : isContactPageOpen ? (
          <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center text-[#1263D6] dark:text-[#60AFFF] font-bold">جاري تحميل صفحة التواصل...</div>}>
            <InfoDirectoryPage
              pageType="contact"
              onBackToHome={handleBackToHome}
              onOpenBooking={handleOpenBooking}
              onNavigate={navigateTo}
            />
          </Suspense>
        ) : isPrivacyPageOpen ? (
          <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center text-[#1263D6] dark:text-[#60AFFF] font-bold">جاري تحميل سياسة الخصوصية...</div>}>
            <InfoDirectoryPage
              pageType="privacy"
              onBackToHome={handleBackToHome}
              onOpenBooking={handleOpenBooking}
              onNavigate={navigateTo}
            />
          </Suspense>
        ) : isPortalPageOpen ? (
          <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center text-[#1263D6] dark:text-[#60AFFF] font-bold">جاري تحميل بوابة الأسرة...</div>}>
            <ClientPortalPage
              onBackToHome={handleBackToHome}
              onOpenLogin={() => setIsLoginOpen(true)}
              onOpenBooking={handleOpenBooking}
            />
          </Suspense>
        ) : isTermsPageOpen ? (
          <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center text-[#1263D6] dark:text-[#60AFFF] font-bold">جاري تحميل الشروط والأحكام...</div>}>
            <InfoDirectoryPage
              pageType="terms"
              onBackToHome={handleBackToHome}
              onOpenBooking={handleOpenBooking}
              onNavigate={navigateTo}
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

            {/* Safe, Smooth Sequential Hydration: Instant Hero paint, idle primary services, viewport-gated heavy sections */}
            {!isReadyToHydrate ? (
              <SectionSkeleton minHeight={720} />
            ) : (
              <>
                {/* 5. Center Achievements & Statistics Bar */}
                {modules.stats && (
                  <Suspense fallback={<SectionSkeleton minHeight={180} />}>
                    <StatsBar />
                  </Suspense>
                )}

                {/* 8. Occupational & ABA Therapy Programs */}
                {modules.services && (
                  <>
                    <Suspense fallback={<SectionSkeleton minHeight={680} />}>
                      <ServicesSection
                        onSelectService={handleSelectServiceForBooking}
                        onOpenServiceDetail={(slug) => navigateTo(`/services/${slug}`)}
                      />
                    </Suspense>
                    {modules.courses && (
                      <LazyViewportWrapper sectionId="courses" minHeight={640}>
                        <CoursesSliderSection
                          onRegisterCourse={handleOpenCourseRegistration}
                        />
                      </LazyViewportWrapper>
                    )}
                    <LazyViewportWrapper sectionId="shadow-teacher" minHeight={680}>
                      <ShadowTeacherSection 
                        onSubmitRequest={handleConfirmBooking}
                      />
                    </LazyViewportWrapper>
                    <LazyViewportWrapper sectionId="packages" minHeight={680}>
                      <PackagesSection
                        onSelectPackage={handleSelectPackageForBooking}
                      />
                    </LazyViewportWrapper>
                  </>
                )}

                {/* 10. Medical Specialists & CV Exploration */}
                {modules.specialists && (
                  <LazyViewportWrapper sectionId="specialists" minHeight={640}>
                    <SpecialistsSection
                      specialists={specialists}
                      onViewCv={handleViewCv}
                      onBookSpecialist={handleSelectSpecialistForBooking}
                      onOpenSpecialistsPage={handleOpenSpecialistsPage}
                    />
                  </LazyViewportWrapper>
                )}

                {/* 11.4. Branches Network Slider (فروع الرياض والخرج) */}
                {modules.branches && (
                  <LazyViewportWrapper sectionId="branches" minHeight={600}>
                    <BranchesSection onOpenBranchesPage={handleOpenBranchesPage} />
                  </LazyViewportWrapper>
                )}

                {/* 11.45. Partners Horizontal Slider (شركاء النجاح والرعايات) */}
                {modules.partners !== false && (
                  <LazyViewportWrapper sectionId="partners" minHeight={560}>
                    <PartnersSection />
                  </LazyViewportWrapper>
                )}

                {/* 11.5. Accreditations & Certifications Section (معترف بنا من) */}
                {modules.accreditations && (
                  <LazyViewportWrapper sectionId="accreditations-section" minHeight={220}>
                    <AccreditationsSection />
                  </LazyViewportWrapper>
                )}

                {/* 12. Client Testimonials & Success Stories */}
                {modules.reviews && (
                  <LazyViewportWrapper sectionId="testimonials" minHeight={620}>
                    <TestimonialsSection
                      testimonials={testimonials}
                    />
                  </LazyViewportWrapper>
                )}

                {/* 13. Clinical Blog & Articles Slider */}
                {modules.blog && (
                  <LazyViewportWrapper sectionId="blog" minHeight={660}>
                    <BlogSliderSection
                      onOpenBooking={handleOpenBooking}
                      onBookSpecialist={handleSelectSpecialistForBooking}
                      onOpenBlogPage={handleOpenBlogPage}
                    />
                  </LazyViewportWrapper>
                )}
              </>
            )}
          </>
        )}

      </main>

      {/* Footer (Viewport-gated Hydration with CLS-safe Skeleton; eager on sub-routes) */}
      {isReadyToHydrate && modules.footer && (
        <div className="relative z-10">
          <LazyViewportWrapper sectionId="footer" minHeight={420} eager={currentPath !== '/'}>
            <Footer 
              onOpenAdmin={() => setIsAdminOpen(true)} 
              onOpenBlogPage={handleOpenBlogPage}
              onNavigate={navigateTo}
              onOpenBranchesPage={handleOpenBranchesPage}
              onOpenBooking={handleOpenBooking}
            />
          </LazyViewportWrapper>
        </div>
      )}

      {/* Floating Actions & Mobile Bottom Bar rendered immediately to avoid hydration pop-in */}
      <Suspense fallback={null}>
        <FloatingActions
          onOpenBooking={handleOpenBooking}
          onOpenNotifications={() => setIsNotificationsOpen(true)}
          onOpenQuickConsult={() => setIsQuickConsultOpen(true)}
        />
      </Suspense>

      <MobileBottomBar
        onOpenBooking={handleOpenBooking}
        onOpenSpecialistsPage={handleOpenSpecialistsPage}
        onOpenServicesPage={handleOpenServicesPage}
        onOpenBranchesPage={handleOpenBranchesPage}
        onOpenOffersPage={handleOpenOffersPage}
        onGoHome={handleBackToHome}
        onNavigate={navigateTo}
        currentPath={currentPath}
        isSpecialistsPageOpen={isSpecialistsPageOpen}
        isServicesPageOpen={isServicesPageOpen || isServiceDetailPageOpen}
        isBranchesPageOpen={isBranchesPageOpen || isBranchDetailPageOpen}
        isOffersPageOpen={isOffersPageOpen}
      />

      {/* Booking Appointment Modal (Statically imported & portaled - zero Suspense blocking) */}
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

      {/* Secondary Modals isolated in individual conditional Suspense boundaries */}
      {isQuickConsultOpen && (
        <Suspense fallback={null}>
          <QuickConsultationModal
            isOpen={isQuickConsultOpen}
            onClose={() => setIsQuickConsultOpen(false)}
            onSuccessSubmit={handleConfirmBooking}
          />
        </Suspense>
      )}

      {isLoginOpen && (
        <Suspense fallback={null}>
          <LoginModal
            isOpen={isLoginOpen}
            onClose={() => setIsLoginOpen(false)}
            onOpenAdmin={() => setIsAdminOpen(true)}
            onOpenPortal={() => navigateTo('/portal')}
          />
        </Suspense>
      )}

      {isStoreOpen && (
        <Suspense fallback={null}>
          <StoreModal
            isOpen={isStoreOpen}
            onClose={() => setIsStoreOpen(false)}
            onAddToCart={() => setCartCount((prev) => prev + 1)}
          />
        </Suspense>
      )}

      {isCourseRegistrationOpen && (
        <Suspense fallback={null}>
          <CourseRegistrationModal
            course={selectedCourseForRegistration}
            isOpen={isCourseRegistrationOpen}
            onClose={() => {
              setIsCourseRegistrationOpen(false);
              setSelectedCourseForRegistration(null);
            }}
          />
        </Suspense>
      )}

      {isVideoOpen && (
        <Suspense fallback={null}>
          <VideoModal
            isOpen={isVideoOpen}
            onClose={() => setIsVideoOpen(false)}
            onBookNow={handleOpenBooking}
          />
        </Suspense>
      )}

      {Boolean(selectedCvSpecialist) && (
        <Suspense fallback={null}>
          <SpecialistCvModal
            specialist={selectedCvSpecialist}
            onClose={() => setSelectedCvSpecialist(null)}
            onBookSpecialist={handleSelectSpecialistForBooking}
          />
        </Suspense>
      )}

      {isNotificationsOpen && (
        <Suspense fallback={null}>
          <NotificationCenterModal
            isOpen={isNotificationsOpen}
            onClose={() => setIsNotificationsOpen(false)}
            notifications={notifications}
            appointments={appointments}
            onMarkAllAsRead={handleMarkAllNotificationsAsRead}
            onAddTestNotification={handleAddTestNotification}
          />
        </Suspense>
      )}

    </div>
  );
}
