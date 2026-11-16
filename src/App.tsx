import React, { useState, useEffect, useRef, Suspense, lazy } from 'react';
import { Navbar } from './components/Navbar';
import { AnimatedBackground } from './components/AnimatedBackground';
import { Hero } from './components/Hero';
import { MobileBottomBar } from './components/MobileBottomBar';
import { LazyViewportWrapper, SectionSkeleton } from './components/LazyViewportWrapper';
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


import { 
  Specialist, 
  ServiceItem, 
  TherapyPackage, 
  Appointment, 
  NotificationItem,
  ParentReview,
  AdminUser
} from './types';
import { 
  getStoredThemeSettings, 
  applyGlobalTheme, 
  getStoredModulesVisibility, 
  SiteModulesVisibility 
} from './data/siteCustomizer';

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

export default function App() {
  // Modules Visibility & Theme Control
  const [modules, setModules] = useState<SiteModulesVisibility>(() => getStoredModulesVisibility());

  // Safe, Smooth Background Hydration: Instant Hero paint, followed by quiet idle mounting
  const [isReadyToHydrate, setIsReadyToHydrate] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const ua = typeof navigator !== 'undefined' ? (navigator.userAgent || '') : '';
      if (/(bot|crawl|spider|googlebot|bingbot|yandex|baiduspider|applebot|slurp|duckduckbot|lighthouse|headlesschrome)/i.test(ua)) {
        return true;
      }
      const hash = window.location.hash.toLowerCase();
      const pathname = window.location.pathname.toLowerCase();
      return (
        hash.startsWith('#admin') ||
        hash.includes('blog') ||
        hash.includes('specialist') ||
        hash.includes('branch') ||
        hash.includes('offer') ||
        hash.includes('service') ||
        hash.includes('shadow-teacher') ||
        hash.includes('sewar') ||
        hash.includes('partner') ||
        hash.includes('testimonial') ||
        hash.includes('review') ||
        pathname === '/shadow-teacher' ||
        pathname === '/shadow-teacher-directory' ||
        pathname === '/sewar' ||
        pathname === '/partners' ||
        pathname === '/partners-directory' ||
        pathname === '/testimonials' ||
        pathname === '/testimonials-directory' ||
        pathname === '/reviews' ||
        Boolean(localStorage.getItem('raba_admin_session_auth'))
      );
    }
    return false;
  });

  useEffect(() => {
    // Apply saved theme colors on startup
    applyGlobalTheme(getStoredThemeSettings());

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
            import('./data/mockData').then(({ SPECIALISTS }) => {
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
            }).catch(() => {});
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
      cleanupBelowFold();
    };
  }, []);

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

  const [testimonials, setTestimonials] = useState<ParentReview[]>(() => {
    try {
      const saved = localStorage.getItem('raba_testimonials_v7');
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  const [specialists, setSpecialists] = useState<Specialist[]>(() => {
    try {
      const saved = localStorage.getItem('raba_specialists');
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  // Save to localStorage (only when hydrated or non-empty so empty defaults don't overwrite cache pre-hydration)
  useEffect(() => {
    if (!didHydrateDefaultsRef.current && specialists.length === 0) return;
    try {
      localStorage.setItem('raba_specialists', JSON.stringify(specialists));
    } catch {
      // ignore
    }
  }, [specialists]);
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

  useEffect(() => {
    if (!didHydrateDefaultsRef.current && testimonials.length === 0) return;
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
  const [isBlogPageOpen, setIsBlogPageOpen] = useState(false);
  const [isShadowTeacherPageOpen, setIsShadowTeacherPageOpen] = useState(false);
  const [isPartnersPageOpen, setIsPartnersPageOpen] = useState(false);
  const [isTestimonialsPageOpen, setIsTestimonialsPageOpen] = useState(false);
  const [activeBlogSlug, setActiveBlogSlug] = useState<string | null>(null);
  const [adminSession, setAdminSession] = useState<AdminUser | null>(() => readInitialAdminSession());
  const [firebaseAdminUid, setFirebaseAdminUid] = useState<string | null>(null);
  const [appointmentsSyncLoading, setAppointmentsSyncLoading] = useState<boolean>(false);
  const [appointmentsSyncError, setAppointmentsSyncError] = useState<string | null>(null);

  const fetchCloudAppointments = React.useCallback(async () => {
    setAppointmentsSyncLoading(true);
    setAppointmentsSyncError(null);
    try {
      const { getLazyAuth } = await import('./lib/firebase');
      const authInstance = await getLazyAuth();
      if (typeof (authInstance as any).authStateReady === 'function') {
        await (authInstance as any).authStateReady();
      }

      if (authInstance.currentUser) {
        const { getAppointmentsFromFirestore } = await import('./services/firestoreService');
        const cloudList = await getAppointmentsFromFirestore();
        setAppointments(cloudList);
        return;
      }

      // Local admin session without Firebase Auth: gracefully sync from Cloud SQL API without triggering unauthenticated Firestore LIST
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
      setAppointmentsSyncError(err?.message || String(err));
    } finally {
      setAppointmentsSyncLoading(false);
    }
  }, []);

  // Lazy-hydrate fallback mockData & specialist deduplication after Hero render / on interactive demand
  useEffect(() => {
    if (didHydrateDefaultsRef.current) return;
    if (!isReadyToHydrate && !isAdminOpen && !isSpecialistsPageOpen && !isNotificationsOpen && !isBookingOpen) {
      return;
    }
    didHydrateDefaultsRef.current = true;
    let cancelled = false;

    Promise.all([
      import('./data/mockData'),
      import('./utils/specialistDeduplication')
    ]).then(([mock, dedup]) => {
      if (cancelled) return;
      const {
        INITIAL_APPOINTMENTS,
        INITIAL_NOTIFICATIONS,
        PARENT_REVIEWS,
        SPECIALISTS
      } = mock;
      const { deduplicateSpecialists } = dedup;

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
      setTestimonials((prev) => (prev.length > 0 ? prev : PARENT_REVIEWS));
      setSpecialists((prev) => {
        if (!prev || prev.length === 0) {
          return deduplicateSpecialists(SPECIALISTS);
        }
        const hasStaleMocks = prev.length !== SPECIALISTS.length ||
          prev.some((s: any) =>
            s.id === 'spec-rawan-tablett' ||
            s.id === 'spec-hossam-malki' ||
            (s.id === 'spec-hanaa-basheer' && (!s.education || s.education.length < 5 || s.category !== 'psychology' || s.experienceYears !== 15)) ||
            (s.id === 'spec-sara-abdelhamid' && s.name && s.name.includes('يارا')) ||
            (s.id === 'spec-sadeem-mshari' && s.experienceYears !== 2)
          );
        return hasStaleMocks ? deduplicateSpecialists(SPECIALISTS) : deduplicateSpecialists(prev);
      });
    }).catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [isReadyToHydrate, isAdminOpen, isSpecialistsPageOpen, isNotificationsOpen, isBookingOpen]);

  // Validate admin session & Firebase Auth state lazily only when admin portal is opened
  useEffect(() => {
    if (!isAdminOpen) return;
    import('./data/adminData')
      .then(({ getStoredAdminSession }) => setAdminSession(getStoredAdminSession()))
      .catch(() => {});

    let cancelled = false;
    let unsubAuth: (() => void) | undefined;
    Promise.all([
      import('./lib/firebase'),
      import('firebase/auth')
    ]).then(async ([{ getLazyAuth }, { onAuthStateChanged }]) => {
      if (cancelled) return;
      const authInstance = await getLazyAuth();
      if (cancelled) return;
      setFirebaseAdminUid(authInstance.currentUser?.uid || null);
      unsubAuth = onAuthStateChanged(authInstance, (user) => {
        if (!cancelled) {
          setFirebaseAdminUid(user?.uid || null);
        }
      });
    }).catch(() => {});

    return () => {
      cancelled = true;
      if (unsubAuth) unsubAuth();
    };
  }, [isAdminOpen]);

  // Fetch & subscribe to live Firestore appointments whenever Admin Dashboard is active
  useEffect(() => {
    if (!isAdminOpen || !adminSession) return;
    let cancelled = false;
    let unsubAppointments: (() => void) | undefined;

    fetchCloudAppointments();

    // Only attach Firestore real-time listener once Firebase Auth is authenticated
    if (!firebaseAdminUid) {
      return () => {
        cancelled = true;
      };
    }

    import('./services/firestoreService')
      .then(({ subscribeAppointments }) => {
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
              setAppointmentsSyncError(err?.message || String(err));
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

  // Check initial route / hash
  useEffect(() => {
    const initialHash = window.location.hash.toLowerCase();
    const initialPath = window.location.pathname.toLowerCase().replace(/\/+$/, '') || '/';
    
    // Dedicated Blog Route Check (/blog, /articles, /blog/<slug>, /articles/<slug>)
    if (
      initialHash === '#blog-directory' ||
      initialHash === '#blog-page' ||
      initialHash === '#articles' ||
      initialHash.startsWith('#blog/') ||
      initialPath === '/blog' ||
      initialPath === '/blog-directory' ||
      initialPath === '/articles' ||
      initialPath.startsWith('/blog/') ||
      initialPath.startsWith('/articles/')
    ) {
      setIsReadyToHydrate(true);
      setIsBlogPageOpen(true);
      if (initialHash.startsWith('#blog/')) {
        setActiveBlogSlug(decodeURIComponent(window.location.hash.replace('#blog/', '')));
      } else if (initialPath.startsWith('/blog/') || initialPath.startsWith('/articles/')) {
        const cleanSlug = window.location.pathname
          .replace(/^\/(?:blog|articles)\//i, '')
          .replace(/\/+$/, '');
        if (cleanSlug) {
          setActiveBlogSlug(decodeURIComponent(cleanSlug));
        }
      }
      return;
    }

    // Dedicated Services Route Check (/services, /services-directory)
    if (
      initialPath === '/services' ||
      initialPath === '/services-directory' ||
      initialPath.startsWith('/services/')
    ) {
      setIsReadyToHydrate(true);
      setIsServicesPageOpen(true);
      return;
    }

    // Dedicated Specialists Route Check (/specialists, /specialists-directory)
    if (
      initialPath === '/specialists' ||
      initialPath === '/specialists-directory' ||
      initialPath.startsWith('/specialist/')
    ) {
      setIsReadyToHydrate(true);
      setIsSpecialistsPageOpen(true);
      return;
    }

    // Dedicated Branches Route Check (/branches, /branches-directory)
    if (
      initialPath === '/branches' ||
      initialPath === '/branches-directory'
    ) {
      setIsReadyToHydrate(true);
      setIsBranchesPageOpen(true);
      return;
    }

    // Dedicated Offers Route Check (/offers, /offers-directory)
    if (
      initialPath === '/offers' ||
      initialPath === '/offers-directory'
    ) {
      setIsReadyToHydrate(true);
      setIsOffersPageOpen(true);
      return;
    }

    // Dedicated Sewar (Shadow Teacher) Route Check
    if (
      initialHash === '#shadow-teacher-directory' ||
      initialHash === '#shadow-teacher-page' ||
      initialHash === '#sewar' ||
      initialPath === '/shadow-teacher' ||
      initialPath === '/shadow-teacher-directory' ||
      initialPath === '/sewar'
    ) {
      setIsReadyToHydrate(true);
      setIsShadowTeacherPageOpen(true);
      return;
    }

    // Dedicated Success Partners Route Check
    if (
      initialHash === '#partners-directory' ||
      initialHash === '#partners-page' ||
      initialPath === '/partners' ||
      initialPath === '/partners-directory'
    ) {
      setIsReadyToHydrate(true);
      setIsPartnersPageOpen(true);
      return;
    }

    // Dedicated Client Testimonials Route Check
    if (
      initialHash === '#testimonials-directory' ||
      initialHash === '#testimonials-page' ||
      initialHash === '#reviews-directory' ||
      initialPath === '/testimonials' ||
      initialPath === '/testimonials-directory' ||
      initialPath === '/reviews'
    ) {
      setIsReadyToHydrate(true);
      setIsTestimonialsPageOpen(true);
      return;
    }

    // Clean Section Routes (/courses, /about, /booking) rendered with 200 OK without 404 or redirect
    if (
      initialPath === '/courses' ||
      initialPath === '/courses-directory' ||
      initialPath.startsWith('/courses/')
    ) {
      setIsReadyToHydrate(true);
      const timer = window.setTimeout(() => {
        const el = document.getElementById('courses');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 250);
      return () => window.clearTimeout(timer);
    }

    if (initialPath === '/about') {
      setIsReadyToHydrate(true);
      const timer = window.setTimeout(() => {
        const el = document.getElementById('about') || document.getElementById('stats-section');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 250);
      return () => window.clearTimeout(timer);
    }

    if (initialPath === '/booking') {
      setIsReadyToHydrate(true);
      setIsBookingOpen(true);
      return;
    }

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
      setIsBlogPageOpen(false);
      setIsShadowTeacherPageOpen(false);
      setIsPartnersPageOpen(false);
      setIsTestimonialsPageOpen(false);
    }
  }, []);

  const handleOpenCourseRegistration = (course: CourseItem) => {
    setSelectedCourseForRegistration(course);
    setIsCourseRegistrationOpen(true);
  };

  const resetAllDirectoryPages = () => {
    setIsSpecialistsPageOpen(false);
    setIsServicesPageOpen(false);
    setIsBranchesPageOpen(false);
    setIsOffersPageOpen(false);
    setIsBlogPageOpen(false);
    setIsShadowTeacherPageOpen(false);
    setIsPartnersPageOpen(false);
    setIsTestimonialsPageOpen(false);
  };

  const handleOpenSpecialistsPage = () => {
    resetAllDirectoryPages();
    setIsSpecialistsPageOpen(true);
    window.location.hash = '#specialists-directory';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenServicesPage = () => {
    resetAllDirectoryPages();
    setIsServicesPageOpen(true);
    window.location.hash = '#services-directory';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenBranchesPage = () => {
    resetAllDirectoryPages();
    setIsBranchesPageOpen(true);
    window.location.hash = '#branches-directory';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenOffersPage = () => {
    resetAllDirectoryPages();
    setIsOffersPageOpen(true);
    window.location.hash = '#offers-directory';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenShadowTeacherPage = () => {
    setIsReadyToHydrate(true);
    resetAllDirectoryPages();
    setIsShadowTeacherPageOpen(true);
    window.location.hash = '#shadow-teacher-directory';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenPartnersPage = () => {
    setIsReadyToHydrate(true);
    resetAllDirectoryPages();
    setIsPartnersPageOpen(true);
    window.location.hash = '#partners-directory';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenTestimonialsPage = () => {
    setIsReadyToHydrate(true);
    resetAllDirectoryPages();
    setIsTestimonialsPageOpen(true);
    window.location.hash = '#testimonials-directory';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenBlogPage = (postSlug?: string) => {
    resetAllDirectoryPages();
    setIsBlogPageOpen(true);
    if (postSlug) {
      setActiveBlogSlug(postSlug);
      window.location.hash = `#blog/${postSlug}`;
    } else {
      setActiveBlogSlug(null);
      window.location.hash = '#blog-directory';
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToHome = () => {
    resetAllDirectoryPages();
    setActiveBlogSlug(null);
    const currentPath = window.location.pathname.toLowerCase().replace(/\/+$/, '') || '/';
    const isStandaloneCleanPath =
      currentPath === '/services' ||
      currentPath === '/services-directory' ||
      currentPath.startsWith('/services/') ||
      currentPath === '/specialists' ||
      currentPath === '/specialists-directory' ||
      currentPath.startsWith('/specialist/') ||
      currentPath === '/courses' ||
      currentPath === '/courses-directory' ||
      currentPath.startsWith('/courses/') ||
      currentPath === '/branches' ||
      currentPath === '/branches-directory' ||
      currentPath === '/about' ||
      currentPath === '/booking' ||
      currentPath === '/offers' ||
      currentPath === '/offers-directory' ||
      currentPath === '/blog' ||
      currentPath === '/blog-directory' ||
      currentPath === '/articles' ||
      currentPath.startsWith('/blog/') ||
      currentPath.startsWith('/articles/') ||
      currentPath === '/shadow-teacher' ||
      currentPath === '/shadow-teacher-directory' ||
      currentPath === '/sewar' ||
      currentPath === '/partners' ||
      currentPath === '/partners-directory' ||
      currentPath === '/testimonials' ||
      currentPath === '/testimonials-directory' ||
      currentPath === '/reviews';
    const cleanTargetPath = isStandaloneCleanPath ? '/' : window.location.pathname;
    if (
      cleanTargetPath !== window.location.pathname ||
      window.location.hash === '#specialists-directory' || 
      window.location.hash === '#specialists-page' ||
      window.location.hash === '#services-directory' ||
      window.location.hash === '#services-page' ||
      window.location.hash === '#branches-directory' ||
      window.location.hash === '#branches-page' ||
      window.location.hash === '#offers-directory' ||
      window.location.hash === '#offers-page' ||
      window.location.hash === '#offers' ||
      window.location.hash === '#activities' ||
      window.location.hash === '#shadow-teacher-directory' ||
      window.location.hash === '#shadow-teacher-page' ||
      window.location.hash === '#sewar' ||
      window.location.hash === '#partners-directory' ||
      window.location.hash === '#partners-page' ||
      window.location.hash === '#testimonials-directory' ||
      window.location.hash === '#testimonials-page' ||
      window.location.hash === '#reviews-directory' ||
      window.location.hash === '#blog-directory' ||
      window.location.hash === '#blog-page' ||
      window.location.hash === '#articles' ||
      window.location.hash.startsWith('#blog/') ||
      (window.location.hash.startsWith('#blog-') && window.location.hash !== '#blog')
    ) {
      window.history.pushState('', document.title, cleanTargetPath + window.location.search);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleHashChange = () => {
      setIsReadyToHydrate(true);
      const hash = window.location.hash.toLowerCase();
      setIsAdminOpen(hash.startsWith('#admin'));
      setIsSpecialistsPageOpen(
        hash === '#specialists-directory' || 
        hash === '#specialists-page'
      );
      setIsServicesPageOpen(
        hash === '#services-directory' || 
        hash === '#services-page'
      );
      setIsBranchesPageOpen(
        hash === '#branches-directory' || 
        hash === '#branches-page'
      );
      setIsOffersPageOpen(
        hash === '#offers-directory' || 
        hash === '#offers-page' ||
        hash === '#offers' ||
        hash === '#activities'
      );
      setIsShadowTeacherPageOpen(
        hash === '#shadow-teacher-directory' ||
        hash === '#shadow-teacher-page' ||
        hash === '#sewar'
      );
      setIsPartnersPageOpen(
        hash === '#partners-directory' ||
        hash === '#partners-page'
      );
      setIsTestimonialsPageOpen(
        hash === '#testimonials-directory' ||
        hash === '#testimonials-page' ||
        hash === '#reviews-directory'
      );
      
      const isBlog = 
        hash === '#blog-directory' ||
        hash === '#blog-page' ||
        hash === '#articles' ||
        hash.startsWith('#blog/') ||
        (hash.startsWith('#blog-') && hash !== '#blog');
      setIsBlogPageOpen(isBlog);
      if (window.location.hash.startsWith('#blog/')) {
        setActiveBlogSlug(window.location.hash.replace('#blog/', ''));
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
    setIsReadyToHydrate(true);
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
          onRefreshAppointments={fetchCloudAppointments}
          reviews={testimonials}
          onUpdateReviews={setTestimonials}
          specialists={specialists}
          onUpdateSpecialists={setSpecialists}
          onLogout={() => {
            setAdminSession(null);
            setFirebaseAdminUid(null);
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
            Promise.all([import('./lib/firebase'), import('firebase/auth')])
              .then(async ([{ getLazyAuth }, { signOut }]) => {
                const authInstance = await getLazyAuth();
                if (authInstance.currentUser) {
                  await signOut(authInstance);
                }
              })
              .catch(() => {});
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
        isServicesPageOpen={isServicesPageOpen}
        isBranchesPageOpen={isBranchesPageOpen}
        isOffersPageOpen={isOffersPageOpen}
        isBlogPageOpen={isBlogPageOpen}
        isShadowTeacherPageOpen={isShadowTeacherPageOpen}
        isPartnersPageOpen={isPartnersPageOpen}
        isTestimonialsPageOpen={isTestimonialsPageOpen}
        unreadCount={unreadCount}
        cartCount={cartCount}
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
        ) : isServicesPageOpen ? (
          /* Dedicated Comprehensive Services Directory Page (Rehab Programs, Courses, Packages & Pricing in Grid) */
          <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center text-[#1263D6] dark:text-[#60AFFF] font-bold">جاري تحميل دليل الخدمات الشامل...</div>}>
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
          <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center text-[#1263D6] dark:text-[#60AFFF] font-bold">جاري تحميل دليل فروع مركز رابا...</div>}>
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
          <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center text-[#1263D6] dark:text-[#60AFFF] font-bold">جاري تحميل صفحة العروض والأنشطة...</div>}>
            <OffersDirectoryPage
              onBackToHome={handleBackToHome}
              onClaimOffer={handleClaimOffer}
              onOpenBooking={(notes) => {
                if (notes) setBookingInitialNotes(notes);
                setIsBookingOpen(true);
              }}
            />
          </Suspense>
        ) : isBlogPageOpen ? (
          /* Dedicated Articles & Clinical Blog Directory Page */
          <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center text-[#1263D6] dark:text-[#60AFFF] font-bold">جاري تحميل المدونة الطبية والدليل المعرفي...</div>}>
            <BlogDirectoryPage
              onBackToHome={handleBackToHome}
              onOpenBooking={(notes) => {
                if (notes) setBookingInitialNotes(notes);
                setIsBookingOpen(true);
              }}
              onBookSpecialist={handleSelectSpecialistForBooking}
              initialPostSlug={activeBlogSlug}
            />
          </Suspense>
        ) : isShadowTeacherPageOpen ? (
          /* Dedicated Sewar (Shadow Teacher) Service Page */
          <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center text-[#1263D6] dark:text-[#60AFFF] font-bold">جاري تحميل صفحة خدمة سِوار (معلم الظل)...</div>}>
            <ShadowTeacherDirectoryPage
              onBackToHome={handleBackToHome}
              onSubmitRequest={handleConfirmBooking}
              onOpenBooking={handleOpenBooking}
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
              onAddTestimonial={(newReview) => setTestimonials((prev) => [newReview, ...prev])}
              onBackToHome={handleBackToHome}
              onOpenBooking={handleOpenBooking}
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
                      onAddTestimonial={(newReview) => setTestimonials((prev) => [newReview, ...prev])}
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

      {/* Footer (Viewport-gated Hydration with CLS-safe Skeleton) */}
      {isReadyToHydrate && modules.footer && (
        <div className="relative z-10">
          <LazyViewportWrapper sectionId="footer" minHeight={420}>
            <Footer 
              onOpenAdmin={() => setIsAdminOpen(true)} 
              onOpenBlogPage={handleOpenBlogPage}
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
        isSpecialistsPageOpen={isSpecialistsPageOpen}
        isServicesPageOpen={isServicesPageOpen}
        isBranchesPageOpen={isBranchesPageOpen}
        isOffersPageOpen={isOffersPageOpen}
      />

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
