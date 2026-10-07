import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { AnimatedBackground } from './components/AnimatedBackground';
import { Hero } from './components/Hero';
import { StatsBar } from './components/StatsBar';
import { OffersSection } from './components/OffersSection';
import { ServicesSection } from './components/ServicesSection';
import { ShadowTeacherSection } from './components/ShadowTeacherSection';
import { PackagesSection } from './components/PackagesSection';
import { SpecialistsSection } from './components/SpecialistsSection';
import { SpecialistsDirectoryPage } from './components/SpecialistsDirectoryPage';
import { SpecialistCvModal } from './components/SpecialistCvModal';
import { BookingModal } from './components/BookingModal';
import { NotificationCenterModal } from './components/NotificationCenterModal';
import { TestimonialsSection } from './components/TestimonialsSection';
import { BlogSliderSection } from './components/BlogSliderSection';
import { Footer } from './components/Footer';
import { FloatingActions } from './components/FloatingActions';
import { AccreditationsSection } from './components/AccreditationsSection';
import { PartnersSection } from './components/PartnersSection';
import { BranchesSection } from './components/BranchesSection';
import { CoursesSliderSection } from './components/CoursesSliderSection';
import { CourseRegistrationModal } from './components/CourseRegistrationModal';
import { CourseItem } from './data/coursesData';
import { LoginModal } from './components/LoginModal';
import { StoreModal } from './components/StoreModal';
import { VideoModal } from './components/VideoModal';
import { QuickConsultationModal } from './components/QuickConsultationModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminLoginPage } from './components/admin/AdminLoginPage';
import { getStoredAdminSession, clearStoredAdminSession } from './data/adminData';
import { DISPATCH_REQUEST_EVENT } from './data/customerRequests';
import { saveAppointmentToFirestore } from './services/firestoreService';

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

export default function App() {
  // Modules Visibility & Theme Control
  const [modules, setModules] = useState<SiteModulesVisibility>(() => getStoredModulesVisibility());

  useEffect(() => {
    // Apply saved theme colors on startup
    applyGlobalTheme(getStoredThemeSettings());

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
        saveAppointmentToFirestore(req).catch(() => {});
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
                (s.id === 'spec-sara-abdelhamid' && s.name && s.name.includes('يارا'))
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
              (s.id === 'spec-sara-abdelhamid' && s.name && s.name.includes('يارا'))
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
  const [isAdminOpen, setIsAdminOpen] = useState(() => {
    return window.location.hash === '#admin';
  });
  const [isSpecialistsPageOpen, setIsSpecialistsPageOpen] = useState(() => {
    return window.location.hash === '#specialists-directory' || window.location.hash === '#specialists-page';
  });
  const [adminSession, setAdminSession] = useState<AdminUser | null>(() => getStoredAdminSession());
  const [cartCount, setCartCount] = useState(0);
  const [selectedCourseForRegistration, setSelectedCourseForRegistration] = useState<CourseItem | null>(null);
  const [isCourseRegistrationOpen, setIsCourseRegistrationOpen] = useState(false);

  const handleOpenCourseRegistration = (course: CourseItem) => {
    setSelectedCourseForRegistration(course);
    setIsCourseRegistrationOpen(true);
  };

  const handleOpenSpecialistsPage = () => {
    setIsSpecialistsPageOpen(true);
    window.location.hash = '#specialists-directory';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToHome = () => {
    setIsSpecialistsPageOpen(false);
    if (window.location.hash === '#specialists-directory' || window.location.hash === '#specialists-page') {
      window.history.pushState('', document.title, window.location.pathname + window.location.search);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleHashChange = () => {
      setIsAdminOpen(window.location.hash === '#admin');
      setIsSpecialistsPageOpen(
        window.location.hash === '#specialists-directory' || 
        window.location.hash === '#specialists-page'
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

  const handleConfirmBooking = (confirmedAppointment: Appointment) => {
    // Add directly to appointments list (appears instantly in Admin Dashboard) with duplicate protection
    const sanitizedApp = {
      ...confirmedAppointment,
      id: confirmedAppointment.id || `apt-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
    };
    setAppointments((prev) => [sanitizedApp, ...prev.filter(a => a.id !== sanitizedApp.id)]);
    saveAppointmentToFirestore(sanitizedApp).catch(() => {});

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
        <AdminLoginPage
          onLoginSuccess={(user) => {
            setAdminSession(user);
          }}
          onBackToWebsite={() => {
            setIsAdminOpen(false);
            if (window.location.hash === '#admin') {
              window.location.hash = '';
            }
          }}
        />
      );
    }

    return (
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
          if (window.location.hash === '#admin') {
            window.location.hash = '';
          }
        }}
      />
    );
  }

  return (
    <div className="min-h-screen relative flex flex-col font-sans text-slate-900 dark:text-white selection:bg-[#00E5BE] selection:text-slate-950 md:transition-colors md:duration-300 overflow-x-clip w-full max-w-[100vw]" dir="rtl">
      
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
        onGoHome={handleBackToHome}
        unreadCount={unreadCount}
        cartCount={cartCount}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        
        {isSpecialistsPageOpen ? (
          /* Dedicated Specialists Page with Specialty Filter and List Format Display */
          <SpecialistsDirectoryPage
            specialists={specialists}
            onBackToHome={handleBackToHome}
            onViewCv={handleViewCv}
            onBookSpecialist={handleSelectSpecialistForBooking}
          />
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
              <StatsBar />
            )}

            {/* 7. Center Offers & Discounts (from image) */}
            {modules.offers && (
              <OffersSection
                onClaimOffer={handleClaimOffer}
              />
            )}

            {/* 8. Occupational & ABA Therapy Programs */}
            {modules.services && (
              <>
                <ServicesSection
                  onSelectService={handleSelectServiceForBooking}
                />
                {modules.courses && (
                  <CoursesSliderSection
                    onRegisterCourse={handleOpenCourseRegistration}
                  />
                )}
                <ShadowTeacherSection 
                  onSubmitRequest={handleConfirmBooking}
                />
                <PackagesSection
                  onSelectPackage={handleSelectPackageForBooking}
                />
              </>
            )}

            {/* 10. Medical Specialists & CV Exploration */}
            {modules.specialists && (
              <SpecialistsSection
                specialists={specialists}
                onViewCv={handleViewCv}
                onBookSpecialist={handleSelectSpecialistForBooking}
                onOpenSpecialistsPage={handleOpenSpecialistsPage}
              />
            )}

            {/* 11.4. Branches Network Slider (فروع الرياض والخرج) directly above Accreditations */}
            {modules.branches && (
              <BranchesSection />
            )}

            {/* 11.45. Partners Horizontal Slider (شركاء النجاح والرعايات) directly above Accreditations */}
            {modules.partners !== false && (
              <PartnersSection />
            )}

            {/* 11.5. Accreditations & Certifications Section (معترف بنا من) in the footer of the blogs & branches */}
            {modules.accreditations && (
              <AccreditationsSection />
            )}

            {/* 12. Client Testimonials & Success Stories */}
            {modules.reviews && (
              <TestimonialsSection
                testimonials={testimonials}
                onAddTestimonial={(newReview) => setTestimonials((prev) => [newReview, ...prev])}
              />
            )}

            {/* 13. Clinical Blog & Articles Slider (تم نقله هنا مكان قسم المتابعة والتنبيهات) */}
            {modules.blog && (
              <BlogSliderSection
                onOpenBooking={handleOpenBooking}
                onBookSpecialist={handleSelectSpecialistForBooking}
              />
            )}
          </>
        )}

      </main>

      {/* Footer */}
      {modules.footer && (
        <Footer onOpenAdmin={() => setIsAdminOpen(true)} />
      )}

      {/* Multi-Floating Actions (WhatsApp, AI Bot Assistant, Share, Scroll to Top) */}
      <FloatingActions
        onOpenBooking={handleOpenBooking}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenQuickConsult={() => setIsQuickConsultOpen(true)}
      />

      {/* Modals */}
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

    </div>
  );
}
