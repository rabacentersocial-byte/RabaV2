import React, { useEffect } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CalendarCheck,
  Clock,
  FileText,
  Home,
  Lock,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface InfoDirectoryPageProps {
  pageType: 'contact' | 'privacy' | 'terms';
  onBackToHome: () => void;
  onOpenBooking?: () => void;
  onNavigate?: (path: string) => void;
}

export const InfoDirectoryPage: React.FC<InfoDirectoryPageProps> = ({
  pageType,
  onBackToHome,
  onOpenBooking,
  onNavigate,
}) => {
  const { isArabic } = useLanguage();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pageType]);

  const handleLink = (path: string, e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!onNavigate) return;
    e.preventDefault();
    onNavigate(path);
  };

  return (
    <div
      className="min-h-screen pt-6 sm:pt-10 pb-20 relative"
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      {/* Top Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 sm:p-4 rounded-[24px] liquid-glass-card">
          <div className="flex items-center gap-2.5 flex-wrap">
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                onBackToHome();
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full liquid-glass-btn text-xs sm:text-sm font-black text-[#161B26] dark:text-[#F8FAFC] hover:text-[#1263D6] dark:hover:text-[#60AFFF] transition-colors"
            >
              {isArabic ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
              <span>{isArabic ? 'العودة للرئيسية' : 'Back to Home'}</span>
            </a>

            <nav className="hidden sm:flex items-center gap-2 text-xs font-bold text-[#4B5563] dark:text-[#94A3B8]" aria-label="Breadcrumb">
              <Home className="w-3.5 h-3.5 text-[#2B95FF]" />
              <span>/</span>
              <span className="text-[#1263D6] dark:text-[#60AFFF] font-black">
                {pageType === 'contact'
                  ? (isArabic ? 'اتصل بنا' : 'Contact Us')
                  : pageType === 'privacy'
                  ? (isArabic ? 'سياسة الخصوصية' : 'Privacy Policy')
                  : (isArabic ? 'الشروط والأحكام' : 'Terms & Conditions')}
              </span>
            </nav>
          </div>

          {onOpenBooking && (
            <button
              onClick={onOpenBooking}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full warm-pill-cta text-xs font-black shadow-md cursor-pointer"
            >
              <CalendarCheck className="w-3.5 h-3.5" />
              <span>{isArabic ? 'حجز موعد' : 'Book Appointment'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {pageType === 'contact' && (
          <section className="liquid-glass-card rounded-[28px] p-6 sm:p-10 space-y-6">
            <div className="space-y-3 border-b border-[#161B26]/[0.08] dark:border-white/[0.08] pb-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#2B95FF]/12 text-[#1263D6] dark:text-[#60AFFF] text-xs font-black">
                <Phone className="w-3.5 h-3.5" />
                <span>{isArabic ? 'خدمة العملاء والاستقبال' : 'Customer Care'}</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-[#161B26] dark:text-[#F8FAFC]">
                {isArabic ? 'تواصل مع مركز رابا للتأهيل' : 'Contact Raba Rehabilitation Center'}
              </h1>
              <p className="text-xs sm:text-sm text-[#4B5563] dark:text-[#94A3B8] leading-relaxed">
                {isArabic
                  ? 'نرحب بتواصلكم للاستفسار عن البرامج التأهيلية، حجز جلسات التشخيص، أو زيارة فروعنا في المملكة العربية السعودية.'
                  : 'Reach out to us for inquiries about rehabilitation programs, assessment scheduling, or visiting our branches across Saudi Arabia.'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <a
                href="tel:0575100100"
                className="p-5 rounded-2xl liquid-glass-panel flex items-center gap-3.5 hover:border-[#2B95FF]/50 transition-colors"
              >
                <div className="w-11 h-11 rounded-xl bg-[#2B95FF]/15 text-[#1263D6] dark:text-[#60AFFF] flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-[#4B5563] dark:text-[#94A3B8] font-bold">
                    {isArabic ? 'الرقم الموحد للحجوزات' : 'Unified Booking Number'}
                  </div>
                  <div dir="ltr" className="text-base font-black text-[#161B26] dark:text-[#F8FAFC] font-mono">
                    +966 575 100 100
                  </div>
                </div>
              </a>

              <a
                href="mailto:info@rabacenters.com"
                className="p-5 rounded-2xl liquid-glass-panel flex items-center gap-3.5 hover:border-[#8B5CF6]/50 transition-colors"
              >
                <div className="w-11 h-11 rounded-xl bg-[#8B5CF6]/15 text-[#6D28D9] dark:text-[#A78BFA] flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-[#4B5563] dark:text-[#94A3B8] font-bold">
                    {isArabic ? 'البريد الإلكتروني الرسمي' : 'Official Email'}
                  </div>
                  <div dir="ltr" className="text-base font-black text-[#161B26] dark:text-[#F8FAFC]">
                    info@rabacenters.com
                  </div>
                </div>
              </a>

              <a
                href="https://wa.me/966575100100"
                target="_blank"
                rel="noopener noreferrer"
                className="p-5 rounded-2xl liquid-glass-panel flex items-center gap-3.5 hover:border-[#10B981]/50 transition-colors"
              >
                <div className="w-11 h-11 rounded-xl bg-[#10B981]/15 text-[#047857] dark:text-[#34D399] flex items-center justify-center shrink-0">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-[#4B5563] dark:text-[#94A3B8] font-bold">
                    {isArabic ? 'واتساب الاستشارات المباشرة' : 'WhatsApp Direct Care'}
                  </div>
                  <div className="text-sm font-black text-[#047857] dark:text-[#34D399]">
                    {isArabic ? 'ابدأ محادثة فورية' : 'Start Instant Chat'}
                  </div>
                </div>
              </a>

              <a
                href="/branches"
                onClick={(e) => handleLink('/branches', e)}
                className="p-5 rounded-2xl liquid-glass-panel flex items-center gap-3.5 hover:border-[#F59E0B]/50 transition-colors"
              >
                <div className="w-11 h-11 rounded-xl bg-[#F59E0B]/15 text-[#B45309] dark:text-[#FBBF24] flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-[#4B5563] dark:text-[#94A3B8] font-bold">
                    {isArabic ? 'مواقع الفروع بالمملكة' : 'Branch Locations'}
                  </div>
                  <div className="text-sm font-black text-[#161B26] dark:text-[#F8FAFC]">
                    {isArabic ? 'استعرض عناوين الفروع ←' : 'View Branches →'}
                  </div>
                </div>
              </a>
            </div>

            <div className="p-4 rounded-2xl liquid-glass-panel flex items-center gap-3 text-xs sm:text-sm text-[#4B5563] dark:text-[#94A3B8]">
              <Clock className="w-4 h-4 text-[#2B95FF] shrink-0" />
              <span>{isArabic ? 'ساعات العمل الرسمية: من الأحد إلى الخميس (8:00 صباحاً - 9:00 مساءً).' : 'Working Hours: Sunday to Thursday (8:00 AM - 9:00 PM).'}</span>
            </div>
          </section>
        )}

        {pageType === 'privacy' && (
          <section className="liquid-glass-card rounded-[28px] p-6 sm:p-10 space-y-6">
            <div className="space-y-3 border-b border-[#161B26]/[0.08] dark:border-white/[0.08] pb-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#10B981]/12 text-[#047857] dark:text-[#34D399] text-xs font-black">
                <Lock className="w-3.5 h-3.5" />
                <span>{isArabic ? 'حماية سرية البيانات الطبية' : 'Medical Data Confidentiality'}</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-[#161B26] dark:text-[#F8FAFC]">
                {isArabic ? 'سياسة الخصوصية وحماية البيانات' : 'Privacy Policy & Data Protection'}
              </h1>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-[#4B5563] dark:text-[#94A3B8] leading-relaxed">
              <div className="p-4 rounded-2xl liquid-glass-panel space-y-1.5">
                <h2 className="text-sm sm:text-base font-black text-[#161B26] dark:text-[#F8FAFC]">
                  {isArabic ? '1. سرية بيانات المستفيدين وأولياء الأمور' : '1. Beneficiary & Family Confidentiality'}
                </h2>
                <p>
                  {isArabic
                    ? 'يلتزم مركز رابا بأعلى معايير الخصوصية والأنظمة الصحية المعمول بها في المملكة العربية السعودية لحماية كافة المعلومات الشخصية والتقارير التشخيصية والخطط العلاجية.'
                    : 'Raba Center maintains strict confidentiality standards in compliance with Saudi healthcare regulations to protect personal information and diagnostic records.'}
                </p>
              </div>
              <div className="p-4 rounded-2xl liquid-glass-panel space-y-1.5">
                <h2 className="text-sm sm:text-base font-black text-[#161B26] dark:text-[#F8FAFC]">
                  {isArabic ? '2. استخدام بيانات الحجز والتواصل' : '2. Use of Booking & Contact Information'}
                </h2>
                <p>
                  {isArabic
                    ? 'تُستخدم بيانات التواصل المسجلة في نماذج الحجز حصراً لتنسيق المواعيد، إرسال التذكيرات العلاجية، ومتابعة خطة المستفيد دون مشاركتها مع أي طرف ثالث غير مخول.'
                    : 'Contact information submitted through booking forms is used solely for scheduling appointments, therapy reminders, and clinical follow-up.'}
                </p>
              </div>
            </div>
          </section>
        )}

        {pageType === 'terms' && (
          <section className="liquid-glass-card rounded-[28px] p-6 sm:p-10 space-y-6">
            <div className="space-y-3 border-b border-[#161B26]/[0.08] dark:border-white/[0.08] pb-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#2B95FF]/12 text-[#1263D6] dark:text-[#60AFFF] text-xs font-black">
                <FileText className="w-3.5 h-3.5" />
                <span>{isArabic ? 'الضوابط التنظيمية للخدمة' : 'Service Guidelines'}</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-[#161B26] dark:text-[#F8FAFC]">
                {isArabic ? 'الشروط والأحكام' : 'Terms & Conditions'}
              </h1>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-[#4B5563] dark:text-[#94A3B8] leading-relaxed">
              <div className="p-4 rounded-2xl liquid-glass-panel space-y-1.5">
                <h2 className="text-sm sm:text-base font-black text-[#161B26] dark:text-[#F8FAFC]">
                  {isArabic ? '1. سياسة المواعيد والتأكيد' : '1. Scheduling & Confirmation Policy'}
                </h2>
                <p>
                  {isArabic
                    ? 'يتم تأكيد مواعيد التقييم النمائي والجلسات العلاجية عبر فريق التنسيق خلال أوقات الدوام الرسمية، وفي حال الرغبة في تعديل الموعد يُرجى الإشعار قبل 24 ساعة.'
                    : 'Assessment and therapy appointments are confirmed by our coordination team during working hours; rescheduling requires 24-hour prior notice.'}
                </p>
              </div>
              <div className="p-4 rounded-2xl liquid-glass-panel space-y-1.5">
                <h2 className="text-sm sm:text-base font-black text-[#161B26] dark:text-[#F8FAFC]">
                  {isArabic ? '2. الخطط التأهيلية والمعايير الإكلينيكية' : '2. Clinical Standards & Care Plans'}
                </h2>
                <p>
                  {isArabic
                    ? 'تُصمم جميع البرامج العلاجية في مركز رابا بناءً على نتائج التقييم الفردي المعتمدة ووفق إشراف الأخصائيين المرخصين.'
                    : 'All therapy plans at Raba Center are designed based on standardized individual assessments supervised by licensed specialists.'}
                </p>
              </div>
              <div className="p-4 rounded-2xl liquid-glass-panel flex items-center gap-2.5 text-xs font-bold text-[#047857] dark:text-[#34D399]">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>{isArabic ? 'المركز مرخص رسمياً من الجهات الصحية والتأهيلية المختصة في المملكة العربية السعودية.' : 'Officially licensed in the Kingdom of Saudi Arabia.'}</span>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default InfoDirectoryPage;
