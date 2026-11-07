import React, { useState } from 'react';
import { 
  GraduationCap, 
  CheckCircle2, 
  Send, 
  User, 
  Phone as PhoneIcon, 
  MapPin,
  MessageCircle,
  Sparkles,
  Award,
  Clock,
  ShieldCheck,
  Heart
} from 'lucide-react';
import { SiwarBraceletIcon } from './SiwarBraceletIcon';
import { useLanguage } from '../context/LanguageContext';
import confetti from 'canvas-confetti';
import { Appointment } from '../types';
import { 
  generateRequestReference, 
  saveAndBroadcastCustomerRequest,
  saveAndBroadcastCustomerRequestAsync,
  getCustomerWhatsAppMessage 
} from '../data/customerRequests';

const SEWAR_AVAILABLE_CITIES = [
  { id: 'riyadh', nameAr: 'الرياض', nameEn: 'Riyadh' },
  { id: 'jeddah', nameAr: 'جدة', nameEn: 'Jeddah' },
  { id: 'kharj', nameAr: 'الخرج', nameEn: 'Al-Kharj' },
  { id: 'ahsa', nameAr: 'الاحساء', nameEn: 'Al-Ahsa' },
  { id: 'khobar', nameAr: 'الخبر', nameEn: 'Al-Khobar' },
];

interface ShadowTeacherSectionProps {
  onSubmitRequest?: (request: Appointment) => void;
}

export const ShadowTeacherSection: React.FC<ShadowTeacherSectionProps> = ({
  onSubmitRequest
}) => {
  const { language } = useLanguage();
  const isArabic = language === 'ar';

  const [formData, setFormData] = useState({
    name: '',
    city: 'الرياض',
    phone: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedRequest, setSubmittedRequest] = useState<Appointment | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const benefits = [
    {
      text: isArabic 
        ? 'دعم أكاديمي وسلوكي فردي' 
        : 'Individualized academic and behavioral support',
      sub: isArabic 
        ? 'خطة تدخل مخصصة وفق أهداف الطفل الأكاديمية والسلوكية' 
        : 'Tailored intervention aligned with child’s IEP goals'
    },
    {
      text: isArabic 
        ? 'تعزيز ثقته بنفسه وتحفيزه على التعلم' 
        : 'Boosting self-confidence and inspiring love for learning',
      sub: isArabic 
        ? 'استراتيجيات تعزيز إيجابي مستمرة لبناء الاستقلالية' 
        : 'Continuous positive reinforcement to foster independence'
    },
    {
      text: isArabic 
        ? 'مساعدة في التفاعل الاجتماعي داخل المدرسة' 
        : 'Facilitating social engagement with peers at school',
      sub: isArabic 
        ? 'تسهيل التواصل واللعب التشاركي وبناء الصداقات الصفية' 
        : 'Facilitating reciprocal play and classroom peer relationships'
    },
    {
      text: isArabic 
        ? 'تسهيل عملية الفهم والاستيعاب بطريقة تناسب احتياجاته' 
        : 'Adapting educational concepts to match their learning pace',
      sub: isArabic 
        ? 'تبسيط المهام الصفية وإتاحة الوسائل البصرية المساعدة' 
        : 'Task simplification, visual schedules, and assistive cues'
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.name.trim()) {
      setErrorMessage(isArabic ? 'يرجى إدخال اسم المستفيد / ولي الأمر' : 'Please enter the name');
      return;
    }
    const cleanDigits = formData.phone.replace(/\D/g, '');
    if (!formData.phone.trim() || cleanDigits.length < 9) {
      setErrorMessage(isArabic ? 'يرجى إدخال رقم جوال صحيح للتواصل (مثال: 05XXXXXXXX)' : 'Please enter a valid phone number');
      return;
    }

    setIsSubmitting(true);

    const ref = generateRequestReference('shadow_teacher');
    
    const newRequest: Appointment = {
      id: `req-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      referenceNumber: ref,
      childName: isArabic ? `طفل (${formData.name})` : `Child of (${formData.name})`,
      childAge: 6,
      guardianName: formData.name.trim(),
      guardianPhone: formData.phone.trim(),
      guardianEmail: 'sewar@rabacenter.com',
      serviceId: 'srv-shadow-teacher',
      serviceTitle: isArabic ? 'خدمة سِوار – معلم الظل المدرسي (Shadow Teacher)' : 'Sewar Service – School Shadow Teacher',
      specialistId: 'spec-inclusion',
      specialistName: isArabic ? 'فريق الدمج المدرسي ومعلمي الظل' : 'School Inclusion & Shadow Teacher Team',
      date: new Date().toISOString().split('T')[0],
      timeSlot: isArabic ? 'الفترة الصباحية (الدوام المدرسي)' : 'Morning School Shift',
      notes: isArabic 
        ? `طلب تسجيل خدمة سِوار (معلم ظل مدرسي) من الموقع. المدينة: ${formData.city}`
        : `Sewar Shadow Teacher application from website. City: ${formData.city}`,
      city: formData.city,
      status: 'new', // Flagged as new request in Admin Dashboard
      paymentStatus: 'unpaid',
      amount: 0,
      reminderSettings: {
        whatsapp: true,
        sms: true,
        email: true
      },
      createdAt: new Date().toISOString(),
      requestType: 'shadow_teacher',
      requestSource: `استمارة خدمة سِوار - ${formData.city}`,
      readByAdmin: false
    };

    try {
      await saveAndBroadcastCustomerRequestAsync(newRequest);

      if (onSubmitRequest) {
        onSubmitRequest(newRequest);
      }

      setSubmittedRequest(newRequest);
      setIsSubmitted(true);

      try {
        confetti({
          particleCount: 65,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {
        // ignore
      }
    } catch (err: any) {
      console.error('[ShadowTeacherSection Error]:', err);
      setErrorMessage(
        isArabic
          ? 'عذراً، تعذر إرسال طلب خدمة سِوار إلى قاعدة البيانات. يرجى التحقق من اتصالك والمحاولة مجدداً.'
          : 'Failed to record Sewar request in database. Please check your connection and try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsAppDirect = () => {
    if (submittedRequest) {
      window.open(getCustomerWhatsAppMessage(submittedRequest, isArabic), '_blank');
    } else {
      const message = isArabic
        ? `السلام عليكم، أود حجز واستفسار عن خدمة سِوار (معلم الظل والدمج المدرسي Shadow Teacher) بمركز رابا للأطفال.\nالاسم: ${formData.name || 'ولي أمر'}\nالمدينة: ${formData.city || 'الرياض'}\nرقم الهاتف: ${formData.phone || 'غير محدد'}`
        : `Hello, I would like to inquire and book Sewar Service (School Shadow Teacher) at Raba Center.\nName: ${formData.name || 'Parent'}\nCity: ${formData.city || 'Riyadh'}\nPhone: ${formData.phone || 'N/A'}`;
      window.open(`https://wa.me/966575100100?text=${encodeURIComponent(message)}`, '_blank');
    }
  };

  return (
    <section 
      id="shadow-teacher" 
      className="py-10 sm:py-20 relative overflow-hidden transition-colors duration-300 border-b border-slate-200/80 dark:border-white/10"
    >
      {/* Subtle decorative background glows using 5-color palette */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-[#2E86EB]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-[#FF2D9B]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Pill Badge & Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-5 sm:mb-8">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-[#2E86EB]/10 border border-[#2E86EB]/30 text-[#2E86EB] text-[11px] sm:text-sm font-bold shadow-xs mb-2 sm:mb-3">
            <SiwarBraceletIcon className="w-3.5 h-3.5 text-[#2E86EB] animate-pulse" />
            <span>{isArabic ? 'سِوار الأمان والدمج المدرسي' : 'Sewar Protective Inclusion'}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
            <span>{isArabic ? 'خدمة سِوار المعتمدة' : 'Sewar Certified Program'}</span>
          </div>

          <div className="flex items-center justify-center gap-2 sm:gap-3">
            <div className="hidden sm:flex w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-[#2E86EB]/15 border border-[#2E86EB]/30 items-center justify-center text-[#2E86EB] shadow-xs shrink-0">
              <SiwarBraceletIcon className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <h2 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-snug">
              {isArabic ? 'خدمة سِوار — معلم الظل والدمج التعليمي والمدرسي' : 'Sewar Service — School Shadow Teacher & Inclusion'}
            </h2>
            <div className="hidden sm:flex w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-[#2E86EB]/15 border border-[#2E86EB]/30 items-center justify-center text-[#2E86EB] shadow-xs shrink-0">
              <SiwarBraceletIcon className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* THE ENCIRCLING BRACELET FRAME (سِوار الأمان والاحتواء المحيط بالقسم) */}
        {/* ========================================================================= */}
        <div className="relative rounded-2xl sm:rounded-[36px] md:rounded-[48px] p-3 sm:p-6 md:p-8 pb-9 sm:pb-10 bg-gradient-to-b from-[#2E86EB]/[0.05] via-transparent to-[#FF2D9B]/[0.04] border sm:border-2 border-dashed border-[#2E86EB]/40 dark:border-[#2E86EB]/35 shadow-[0_10px_40px_rgba(46,134,235,0.08)]">
          
          {/* Top Bracelet Clasp Ornament (ميدالية وقفل سِوار الأمان) */}
          <div className="absolute -top-3.5 sm:-top-4 left-1/2 -translate-x-1/2 px-3 sm:px-5 py-0.5 sm:py-1 rounded-full bg-white dark:bg-[#0D1B2A] border sm:border-2 border-[#2E86EB]/60 shadow-md flex items-center gap-1.5 sm:gap-2 z-20">
            <SiwarBraceletIcon className="w-3.5 sm:w-5 h-3.5 sm:h-5 text-[#2E86EB] animate-pulse shrink-0" />
            <span className="text-[10px] sm:text-xs font-black tracking-wider text-[#2E86EB] whitespace-nowrap">
              {isArabic ? 'سِوار الأمان والاحتواء المدرسي' : 'Sewar School Protection Bracelet'}
            </span>
          </div>

          {/* Bracelet Decorative Pearl Beads at the 4 Corners (5 Palette Swatches) */}
          <div className="absolute top-2 sm:top-3 end-2 sm:end-3 flex items-center gap-1 sm:gap-1.5 pointer-events-none opacity-80">
            <span className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-[#2E86EB] shadow-xs ring-2 ring-[#2E86EB]/30 animate-pulse" />
            <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-[#FFD23F]" />
            <span className="w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full bg-[#22C55E]" />
          </div>
          <div className="absolute top-2 sm:top-3 start-2 sm:start-3 flex items-center gap-1 sm:gap-1.5 pointer-events-none opacity-80">
            <span className="w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full bg-[#FF2D9B]" />
            <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-[#D9F14A]" />
            <span className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-[#2E86EB] shadow-xs ring-2 ring-[#2E86EB]/30 animate-pulse" />
          </div>
          <div className="absolute bottom-2 sm:bottom-3 end-2 sm:end-3 flex items-center gap-1 sm:gap-1.5 pointer-events-none opacity-80">
            <span className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-[#22C55E] shadow-xs ring-2 ring-[#22C55E]/30" />
            <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-[#FFD23F]" />
            <span className="w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full bg-[#2E86EB]" />
          </div>
          <div className="absolute bottom-2 sm:bottom-3 start-2 sm:start-3 flex items-center gap-1 sm:gap-1.5 pointer-events-none opacity-80">
            <span className="w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full bg-[#FF2D9B]" />
            <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-[#D9F14A]" />
            <span className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-[#2E86EB] shadow-xs ring-2 ring-[#2E86EB]/30" />
          </div>

          {/* Featured Visual Image Banner */}
          <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-md sm:shadow-xl border border-slate-200/80 dark:border-white/10 group bg-slate-100 dark:bg-slate-800 mb-3.5 sm:mb-8">
            <img
              src="/images/shadow_teacher.webp"
              alt={isArabic ? 'أخصائية معلم الظل مع طفلة في بيئة تعليمية' : 'Shadow teacher with child in classroom'}
              width={640}
              height={280}
              className="w-full h-[160px] sm:h-[260px] md:h-[320px] object-cover object-center group-hover:scale-[1.01] transition-transform duration-700"
              loading="lazy"
              decoding="async"
            />
            
            {/* Subtle gradient vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />

            {/* Overlay Badges */}
            <div className="absolute top-2.5 sm:top-4 start-2.5 sm:start-4 flex flex-wrap gap-1.5 sm:gap-2">
              <span className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-bold text-slate-800 dark:text-white shadow-xs border border-slate-100 dark:border-white/10 flex items-center gap-1 sm:gap-1.5">
                <ShieldCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#2E86EB]" />
                {isArabic ? 'إشراف سريري مباشر' : 'Direct Clinical Supervision'}
              </span>
              <span className="bg-[#2E86EB] text-white px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-black shadow-xs flex items-center gap-1 sm:gap-1.5">
                <Award className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#FFD23F]" />
                {isArabic ? 'معايير BACB الدولية' : 'BACB Global Standards'}
              </span>
            </div>

            <div className="absolute bottom-2.5 sm:bottom-4 end-2.5 sm:end-4">
              <span className="bg-slate-900/85 backdrop-blur-md text-white px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-semibold flex items-center gap-1 sm:gap-1.5 border border-white/10">
                <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#FFD23F]" />
                {isArabic ? 'دوام مدرسي كامل / جزئي' : 'Full / Part-time Schooling'}
              </span>
            </div>
          </div>

          {/* 2-Column Balanced Grid: Introductory Text & Benefits (Col 1) beside Compact Form (Col 2) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 sm:gap-6 lg:gap-8 items-stretch">
            
            {/* Column 1: Service Introductory Text & "Why Shadow Teacher?" (7 cols on lg) */}
            <div className="lg:col-span-7 flex flex-col justify-between bg-white/80 dark:bg-slate-900/70 backdrop-blur-md rounded-2xl sm:rounded-3xl p-3.5 sm:p-7 border border-slate-200/80 dark:border-white/10 shadow-xs sm:shadow-sm">
              
              {/* Core Narrative Text */}
              <div className="space-y-2.5 sm:space-y-4">
                <div className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-[#2E86EB] bg-[#2E86EB]/10 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl border border-[#2E86EB]/25 shadow-2xs">
                  <SiwarBraceletIcon className="w-3.5 h-3.5 text-[#2E86EB] animate-pulse" />
                  <span>{isArabic ? 'عن خدمة سِوار ورسالتنا' : 'About Sewar Service'}</span>
                </div>
                <p className="text-slate-700 dark:text-slate-200 text-xs sm:text-base md:text-lg leading-relaxed font-medium">
                  {isArabic ? (
                    <>
                      لأن ابنك هو <span className="font-bold text-[#2E86EB]">محور اهتمامنا</span>، ولأننا نحرص على توفير كل ما يحتاجه لتحقيق أفضل تقدم ممكن، نقدم لكم <span className="font-bold text-slate-900 dark:text-white">خدمة سِوار</span> لتوفير معلم ظل متخصص (<span className="font-bold text-slate-900 dark:text-white">Shadow Teacher</span>)، يكون معه خطوة بخطوة لدعمه ومساعدته على تجاوز التحديات داخل الفصل الدراسي.
                    </>
                  ) : (
                    <>
                      Because your child is at the core of our focus, and we are committed to providing everything they need to achieve their best progress, we present <span className="font-bold text-slate-900 dark:text-white">Sewar Service</span> to provide a dedicated <span className="font-bold text-slate-900 dark:text-white">Shadow Teacher</span>, walking with them step-by-step to support and empower them inside the classroom.
                    </>
                  )}
                </p>
              </div>

              {/* Subheading Question & Benefits */}
              <div className="pt-3 sm:pt-5 mt-3 sm:mt-4 border-t border-slate-200/60 dark:border-white/10">
                <h3 className="text-xs sm:text-base md:text-lg font-black text-slate-900 dark:text-white flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3.5">
                  <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FFD23F]" />
                  <span>
                    {isArabic 
                      ? 'لماذا تحتاج إلى Shadow Teacher لطفلك ؟' 
                      : 'Why does your child need a Shadow Teacher?'}
                  </span>
                </h3>

                {/* Benefits Checklist 2x2 Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2.5">
                  {benefits.map((item, index) => (
                    <div 
                      key={index}
                      className="flex items-start gap-2 p-2 sm:p-2.5 rounded-lg sm:rounded-xl bg-slate-50/90 dark:bg-slate-800/50 border border-slate-100 dark:border-white/5 hover:border-[#2E86EB]/30 transition-colors"
                    >
                      <div className="w-4 h-4 sm:w-5 sm:h-5 rounded sm:rounded-md bg-[#22C55E]/15 text-[#22C55E] flex items-center justify-center shrink-0 mt-0.5 text-[10px] sm:text-xs font-black">
                        ✓
                      </div>
                      <div>
                        <div className="text-[11px] sm:text-sm font-bold text-slate-900 dark:text-white leading-tight">
                          {item.text}
                        </div>
                        <div className="text-[10px] sm:text-[11px] text-slate-600 dark:text-slate-300 mt-0.5 leading-snug">
                          {item.sub}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Column 2: Compact Form Beside Introductory Text (5 cols on lg) */}
            <div className="lg:col-span-5 flex flex-col justify-center mb-3 sm:mb-0">
              <div className="rounded-2xl sm:rounded-3xl p-3.5 sm:p-6 shadow-xl transition-all relative overflow-hidden bg-gradient-to-br from-[#0D1B2A] via-[#102035] to-[#0A1422] border border-[#2E86EB]/30 text-white">
                
                {/* Decorative subtle brand glows */}
                <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-[#2E86EB]/20 rounded-full blur-2xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-32 h-32 bg-[#FF2D9B]/15 rounded-full blur-2xl pointer-events-none" />

                {/* Form Title & Subtitle */}
                <div className="text-center mb-3 sm:mb-4 relative z-10">
                  <div className="inline-flex items-center justify-center gap-1.5 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-[#2E86EB]/20 text-[#3B92F5] text-[10px] sm:text-[11px] font-bold mb-1 sm:mb-1.5 border border-[#2E86EB]/35 shadow-xs">
                    <SiwarBraceletIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#2E86EB]" />
                    <span>{isArabic ? 'سِوار الأمان — حجز مباشر' : 'Sewar Direct Booking'}</span>
                  </div>
                  <h3 className="text-base sm:text-2xl font-black text-white tracking-tight flex items-center justify-center gap-1.5 sm:gap-2">
                    <SiwarBraceletIcon className="w-4 h-4 sm:w-5 sm:h-5 text-[#FFD23F]" />
                    <span>{isArabic ? 'احجز خدمة سِوار الآن' : 'Book Sewar Service Now'}</span>
                  </h3>
                  <p className="text-[10px] sm:text-xs text-slate-300 mt-0.5 font-medium">
                    {isArabic 
                      ? 'تقييم شامل ومطابقة معلم الظل الأنسب لبيئة طفلك المدرسية عبر خدمة سِوار' 
                      : 'Comprehensive assessment & matching the ideal shadow teacher via Sewar service'}
                  </p>
                </div>

                {/* Success State */}
                {isSubmitted ? (
                  <div
                    className="bg-white/95 dark:bg-[#0D1B2A]/95 backdrop-blur-md rounded-2xl p-4 sm:p-5 text-center shadow-lg border border-white/20 space-y-2.5 sm:space-y-3 my-1 sm:my-2 text-slate-900 dark:text-white transition-all duration-300 animate-in fade-in zoom-in-95"
                  >
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#22C55E]/15 border border-[#22C55E]/30 text-[#22C55E] rounded-full flex items-center justify-center mx-auto shadow-inner">
                      <CheckCircle2 className="w-6 h-6 sm:w-7 sm:h-7" />
                    </div>
                    <div>
                      <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                        {isArabic ? 'تم استلام طلبكم في خدمة سِوار بنجاح!' : 'Sewar Request Received Successfully!'}
                      </h4>
                      {submittedRequest && (
                        <div className="my-2 p-2 sm:p-2.5 bg-slate-50 dark:bg-white/5 border border-[#2E86EB]/30 rounded-xl text-center space-y-1">
                          <div className="flex items-center justify-between text-[11px] sm:text-xs px-1 text-slate-700 dark:text-slate-300">
                            <span className="text-slate-600 dark:text-slate-300">{isArabic ? 'المدينة المحددة:' : 'Selected City:'}</span>
                            <span className="font-bold text-[#2E86EB] flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              <span>{submittedRequest.city || 'الرياض'}</span>
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-[11px] sm:text-xs px-1 pt-1 border-t border-slate-200/60 dark:border-white/10">
                            <span className="text-[10px] text-slate-600 dark:text-slate-300 block">{isArabic ? 'الرقم المرجعي للطلب:' : 'Reference Number:'}</span>
                            <span className="font-mono font-black text-[#2E86EB] dark:text-[#3B92F5] text-xs sm:text-sm tracking-wider">
                              {submittedRequest.referenceNumber}
                            </span>
                          </div>
                        </div>
                      )}
                      <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                        {isArabic 
                          ? 'تم تسجيل طلبكم بنجاح في نظام مركز رابا، وسيتواصل معكم منسق خدمة سِوار (معلم الظل والدمج المدرسي) لترتيب التقييم والمطابقة.' 
                          : 'Our Sewar inclusion coordinator will contact you shortly to arrange the initial assessment.'}
                      </p>
                    </div>

                    <div className="flex flex-col gap-1.5 sm:gap-2 pt-1">
                      <button
                        onClick={handleWhatsAppDirect}
                        className="w-full bg-[#25D366] hover:bg-[#20ba59] text-white font-bold py-2 sm:py-2.5 px-3 rounded-lg sm:rounded-xl flex items-center justify-center gap-1.5 text-xs shadow-md transition-all active:scale-98 cursor-pointer"
                      >
                        <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span>{isArabic ? 'متابعة فورية عبر واتساب' : 'Direct Follow-up on WhatsApp'}</span>
                      </button>

                      <button
                        onClick={() => {
                          setIsSubmitted(false);
                          setFormData({ name: '', city: 'الرياض', phone: '' });
                        }}
                        className="text-[10px] sm:text-[11px] text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-medium underline py-0.5 cursor-pointer"
                      >
                        {isArabic ? 'إرسال طلب إضافي' : 'Submit another request'}
                      </button>
                    </div>
                  </div>
                ) : (
                    /* Compact Booking Form */
                    <form onSubmit={handleSubmit} className="space-y-2 sm:space-y-3 relative z-10">
                      
                      {errorMessage && (
                        <div className="p-2 sm:p-2.5 bg-rose-500/20 text-rose-200 text-[11px] sm:text-xs font-bold rounded-lg sm:rounded-xl border border-rose-400/40 backdrop-blur-sm">
                          {errorMessage}
                        </div>
                      )}

                      {/* Field 1: Name */}
                      <div>
                        <label htmlFor="sewar-parent-name" className="block text-[11px] sm:text-xs font-bold text-slate-200 mb-0.5 sm:mb-1">
                          {isArabic ? 'الإسم' : 'Name'}
                        </label>
                        <div className="relative">
                          <input
                            id="sewar-parent-name"
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder={isArabic ? 'اسم الطفل أو ولي الأمر' : 'Child or Parent Name'}
                            className={`w-full bg-white/95 dark:bg-slate-950/90 text-slate-900 dark:text-white placeholder-slate-400 rounded-lg sm:rounded-xl px-3 sm:px-3.5 py-2 sm:py-2.5 ${isArabic ? 'pl-9 sm:pl-10' : 'pr-9 sm:pr-10'} text-xs sm:text-sm shadow-sm border border-white/20 focus:border-[#2E86EB] focus:ring-2 focus:ring-[#2E86EB]/30 outline-none transition-all h-9.5 sm:h-11`}
                          />
                          <User className={`w-3.5 h-3.5 text-slate-400 absolute top-1/2 -translate-y-1/2 pointer-events-none ${isArabic ? 'left-3 sm:left-3.5' : 'right-3 sm:right-3.5'}`} />
                        </div>
                      </div>

                      {/* Row 2: City & Phone (2 columns) */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
                        
                        {/* Field 2: Branch / City Selection */}
                        <div>
                          <label htmlFor="branch-select" className="block text-[11px] sm:text-xs font-bold text-slate-200 mb-0.5 sm:mb-1">
                            {isArabic ? 'الفرع / المدينة' : 'Branch / City'} <span className="text-[#2E86EB]">*</span>
                          </label>
                          <div className="relative">
                            <select
                              id="branch-select"
                              aria-label={isArabic ? 'اختر الفرع' : 'Select Branch'}
                              required
                              value={formData.city}
                              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                              className={`w-full bg-white/95 dark:bg-slate-950/90 text-slate-900 dark:text-white rounded-lg sm:rounded-xl px-3 sm:px-3.5 py-2 sm:py-2.5 ${isArabic ? 'pl-9 sm:pl-10' : 'pr-9 sm:pr-10'} text-xs sm:text-sm shadow-sm border border-white/20 focus:border-[#2E86EB] focus:ring-2 focus:ring-[#2E86EB]/30 outline-none transition-all cursor-pointer h-9.5 sm:h-11`}
                            >
                              {SEWAR_AVAILABLE_CITIES.map((c) => (
                                <option 
                                  key={c.id} 
                                  value={c.nameAr}
                                  className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
                                >
                                  {isArabic ? c.nameAr : c.nameEn}
                                </option>
                              ))}
                            </select>
                            <MapPin className={`w-3.5 h-3.5 text-slate-400 absolute top-1/2 -translate-y-1/2 pointer-events-none ${isArabic ? 'left-3 sm:left-3.5' : 'right-3 sm:right-3.5'}`} />
                          </div>
                        </div>

                        {/* Field 3: Phone */}
                        <div>
                          <label htmlFor="sewar-phone" className="block text-[11px] sm:text-xs font-bold text-slate-200 mb-0.5 sm:mb-1">
                            {isArabic ? 'رقم الجوال' : 'Phone'}
                          </label>
                          <div className="relative" dir="ltr">
                            <input
                              id="sewar-phone"
                              type="tel"
                              required
                              value={formData.phone}
                              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                              placeholder="+966 5X XXX XXXX"
                              className="w-full bg-white/95 dark:bg-slate-950/90 text-slate-900 dark:text-white placeholder-slate-400 rounded-lg sm:rounded-xl px-3 sm:px-3.5 py-2 sm:py-2.5 pr-9 sm:pr-10 text-xs sm:text-sm shadow-sm border border-white/20 focus:border-[#2E86EB] focus:ring-2 focus:ring-[#2E86EB]/30 outline-none transition-all font-mono text-left h-9.5 sm:h-11"
                            />
                            <PhoneIcon className="w-3.5 h-3.5 text-slate-400 absolute right-3 sm:right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                          </div>
                        </div>

                      </div>

                      {/* Compact Submit Button (5-color Palette Gradient) */}
                      <div className="pt-1">
                        <button
                          type="submit"
                          aria-label={isArabic ? 'إرسال طلب حجز خدمة سوار معلم الظل' : 'Submit Sewar shadow teacher booking request'}
                          disabled={isSubmitting}
                          className="w-full bg-gradient-to-r from-[#2E86EB] via-[#3B92F5] to-[#22C55E] hover:opacity-95 active:scale-[0.98] text-white font-black min-h-[48px] px-4 sm:px-5 rounded-lg sm:rounded-xl shadow-[0_8px_20px_rgba(46,134,235,0.35)] transition-all duration-200 flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm cursor-pointer disabled:opacity-60"
                        >
                          {isSubmitting ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          ) : (
                            <>
                              <Send className="w-3.5 h-3.5" />
                              <span>{isArabic ? 'إرسال الآن' : 'Submit Now'}</span>
                            </>
                          )}
                        </button>
                      </div>

                    </form>
                  )}
              </div>
            </div>

          </div>

          {/* Bottom Bracelet Charm (ميدالية سِوار الاحتواء السفلية) */}
          <div className="absolute -bottom-3.5 sm:-bottom-4 left-1/2 -translate-x-1/2 px-3 sm:px-4 py-1 rounded-full bg-white dark:bg-[#0D1B2A] border border-[#2E86EB]/50 shadow-md flex items-center justify-center gap-1.5 z-20 text-[9.5px] sm:text-xs font-bold text-slate-700 dark:text-slate-200 whitespace-nowrap max-w-[95vw]">
            <Heart className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#FF2D9B] fill-current shrink-0" />
            <span className="whitespace-nowrap font-bold">
              {isArabic ? 'سِوار الأمان — خطوة بخطوة مع طفلك' : 'Sewar Bracelet — Step by Step with Your Child'}
            </span>
          </div>
        </div>

      </div>
    </section>
  );
};

export default ShadowTeacherSection;
