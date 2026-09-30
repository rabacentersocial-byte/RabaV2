import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GraduationCap, 
  CheckCircle2, 
  Send, 
  Calendar, 
  User, 
  Phone as PhoneIcon, 
  Mail, 
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
    birthDate: '',
    phone: '',
    email: '',
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

  const handleSubmit = (e: React.FormEvent) => {
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
    
    // Estimate age from birthdate if provided
    let approxAge = 6;
    if (formData.birthDate) {
      const birthYear = new Date(formData.birthDate).getFullYear();
      if (!isNaN(birthYear) && birthYear > 1990) {
        approxAge = Math.max(1, 2026 - birthYear);
      }
    }

    const newRequest: Appointment = {
      id: `req-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      referenceNumber: ref,
      childName: isArabic ? `طفل (${formData.name})` : `Child of (${formData.name})`,
      childAge: approxAge,
      guardianName: formData.name.trim(),
      guardianPhone: formData.phone.trim(),
      guardianEmail: formData.email.trim() || 'shadow.teacher@customer.com',
      serviceId: 'srv-shadow-teacher',
      serviceTitle: isArabic ? 'خدمة سِوار – معلم الظل المدرسي (Shadow Teacher)' : 'Sewar Service – School Shadow Teacher',
      specialistId: 'spec-inclusion',
      specialistName: isArabic ? 'فريق الدمج المدرسي ومعلمي الظل' : 'School Inclusion & Shadow Teacher Team',
      date: new Date().toISOString().split('T')[0],
      timeSlot: isArabic ? 'الفترة الصباحية (الدوام المدرسي)' : 'Morning School Shift',
      notes: isArabic 
        ? `طلب تسجيل خدمة سِوار (معلم ظل مدرسي) من الموقع. المدينة: ${formData.city} - تاريخ ميلاد الطفل: ${formData.birthDate || 'غير محدد'} - البريد: ${formData.email || 'غير محدد'}`
        : `Sewar Shadow Teacher application from website. City: ${formData.city}, Child birthdate: ${formData.birthDate || 'N/A'}, Email: ${formData.email || 'N/A'}`,
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
      childBirthDate: formData.birthDate || undefined,
      readByAdmin: false
    };

    saveAndBroadcastCustomerRequest(newRequest);

    if (onSubmitRequest) {
      onSubmitRequest(newRequest);
    }

    setTimeout(() => {
      setIsSubmitting(false);
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
    }, 600);
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
      className="py-16 sm:py-24 relative overflow-hidden transition-colors duration-300"
    >
      {/* Subtle decorative background glows */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-[#00E5BE]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-[#D2B2A4]/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Pill Badge & Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#00E5BE]/10 border border-[#00E5BE]/30 text-[#00897B] dark:text-[#00E5BE] text-xs sm:text-sm font-bold shadow-sm mb-3">
            <SiwarBraceletIcon className="w-4 h-4 text-[#00897B] dark:text-[#00E5BE] animate-pulse" />
            <span>{isArabic ? 'سِوار الأمان والدمج المدرسي' : 'Sewar Protective Inclusion'}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#00E5BE]" />
            <span>{isArabic ? 'خدمة سِوار المعتمدة' : 'Sewar Certified Program'}</span>
          </div>

          <div className="flex items-center justify-center gap-3">
            <div className="hidden sm:flex w-10 h-10 rounded-2xl bg-[#00E5BE]/15 border border-[#00E5BE]/30 items-center justify-center text-[#00897B] dark:text-[#00E5BE] shadow-xs shrink-0">
              <SiwarBraceletIcon className="w-6 h-6" />
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              {isArabic ? 'خدمة سِوار — معلم الظل والدمج التعليمي والمدرسي' : 'Sewar Service — School Shadow Teacher & Inclusion'}
            </h2>
            <div className="hidden sm:flex w-10 h-10 rounded-2xl bg-[#00E5BE]/15 border border-[#00E5BE]/30 items-center justify-center text-[#00897B] dark:text-[#00E5BE] shadow-xs shrink-0">
              <SiwarBraceletIcon className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* THE ENCIRCLING BRACELET FRAME (سِوار الأمان والاحتواء المحيط بالقسم) */}
        {/* ========================================================================= */}
        <div className="relative rounded-[36px] sm:rounded-[48px] p-3 sm:p-6 md:p-8 bg-gradient-to-b from-[#00E5BE]/[0.05] via-transparent to-[#D2B2A4]/[0.06] border-2 border-dashed border-[#00E5BE]/40 dark:border-[#00E5BE]/35 shadow-[0_10px_40px_rgba(0,229,190,0.08)]">
          
          {/* Top Bracelet Clasp Ornament (ميدالية وقفل سِوار الأمان) */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 sm:px-5 py-1 sm:py-1.5 rounded-full bg-white dark:bg-slate-900 border-2 border-[#00E5BE]/60 shadow-lg flex items-center gap-2 z-20">
            <SiwarBraceletIcon className="w-4 sm:w-5 h-4 sm:h-5 text-[#00897B] dark:text-[#00E5BE] animate-pulse shrink-0" />
            <span className="text-[11px] sm:text-xs font-black tracking-wider text-[#00897B] dark:text-[#00E5BE] whitespace-nowrap">
              {isArabic ? 'سِوار الأمان والاحتواء المدرسي' : 'Sewar School Protection Bracelet'}
            </span>
          </div>

          {/* Bracelet Decorative Pearl Beads at the 4 Corners */}
          <div className="absolute top-3 end-3 flex items-center gap-1.5 pointer-events-none opacity-80">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00E5BE] shadow-xs ring-2 ring-[#00E5BE]/30 animate-pulse" />
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#00E5BE]" />
          </div>
          <div className="absolute top-3 start-3 flex items-center gap-1.5 pointer-events-none opacity-80">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00E5BE]" />
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#00E5BE] shadow-xs ring-2 ring-[#00E5BE]/30 animate-pulse" />
          </div>
          <div className="absolute bottom-3 end-3 flex items-center gap-1.5 pointer-events-none opacity-80">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00E5BE] shadow-xs ring-2 ring-[#00E5BE]/30" />
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#00E5BE]" />
          </div>
          <div className="absolute bottom-3 start-3 flex items-center gap-1.5 pointer-events-none opacity-80">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00E5BE]" />
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#00E5BE] shadow-xs ring-2 ring-[#00E5BE]/30" />
          </div>

          {/* Featured Visual Image Banner */}
          <div className="relative rounded-3xl overflow-hidden shadow-xl border border-slate-200/80 dark:border-white/10 group bg-slate-100 dark:bg-slate-800 mb-8">
          <img
            src="/images/shadow_teacher.jpg"
            alt={isArabic ? 'أخصائية معلم الظل مع طفلة في بيئة تعليمية' : 'Shadow teacher with child in classroom'}
            className="w-full h-[240px] sm:h-[300px] md:h-[350px] object-cover object-center group-hover:scale-[1.01] transition-transform duration-700"
            referrerPolicy="no-referrer"
          />
          
          {/* Subtle gradient vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none" />

          {/* Overlay Badges */}
          <div className="absolute top-4 start-4 flex flex-wrap gap-2">
            <span className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold text-slate-800 dark:text-white shadow-md border border-slate-100 dark:border-white/10 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#00E5BE]" />
              {isArabic ? 'إشراف سريري مباشر' : 'Direct Clinical Supervision'}
            </span>
            <span className="bg-[#00E5BE] text-slate-950 px-3 py-1.5 rounded-full text-xs font-black shadow-md flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5" />
              {isArabic ? 'معايير BACB الدولية' : 'BACB Global Standards'}
            </span>
          </div>

          <div className="absolute bottom-4 end-4">
            <span className="bg-slate-900/85 backdrop-blur-md text-white px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-white/10">
              <Clock className="w-3.5 h-3.5 text-[#00E5BE]" />
              {isArabic ? 'دوام مدرسي كامل / جزئي' : 'Full / Part-time Schooling'}
            </span>
          </div>
        </div>

        {/* 2-Column Balanced Grid: Introductory Text & Benefits (Col 1) beside Compact Form (Col 2) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          
          {/* Column 1: Service Introductory Text & "Why Shadow Teacher?" (7 cols on lg) */}
          <div className="lg:col-span-7 flex flex-col justify-between bg-white/80 dark:bg-slate-900/70 backdrop-blur-md rounded-3xl p-6 sm:p-7 border border-slate-200/80 dark:border-white/10 shadow-sm">
            
            {/* Core Narrative Text (Exact text requested by user) */}
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-[#00897B] dark:text-[#00E5BE] bg-[#00E5BE]/10 px-3 py-1.5 rounded-xl border border-[#00E5BE]/25 shadow-xs">
                <SiwarBraceletIcon className="w-4 h-4 text-[#00897B] dark:text-[#00E5BE] animate-pulse" />
                <span>{isArabic ? 'عن خدمة سِوار ورسالتنا' : 'About Sewar Service'}</span>
              </div>
              <p className="text-slate-700 dark:text-slate-200 text-base sm:text-lg leading-relaxed font-medium">
                {isArabic ? (
                  <>
                    لأن ابنك هو <span className="font-bold text-[#00897B] dark:text-[#00E5BE]">محور اهتمامنا</span>، ولأننا نحرص على توفير كل ما يحتاجه لتحقيق أفضل تقدم ممكن، نقدم لكم <span className="font-bold text-slate-900 dark:text-white">خدمة سِوار</span> لتوفير معلم ظل متخصص (<span className="font-bold text-slate-900 dark:text-white">Shadow Teacher</span>)، يكون معه خطوة بخطوة لدعمه ومساعدته على تجاوز التحديات داخل الفصل الدراسي.
                  </>
                ) : (
                  <>
                    Because your child is at the core of our focus, and we are committed to providing everything they need to achieve their best progress, we present <span className="font-bold text-slate-900 dark:text-white">Sewar Service</span> to provide a dedicated <span className="font-bold text-slate-900 dark:text-white">Shadow Teacher</span>, walking with them step-by-step to support and empower them inside the classroom.
                  </>
                )}
              </p>
            </div>

            {/* Subheading Question & Benefits */}
            <div className="pt-5 mt-4 border-t border-slate-200/60 dark:border-white/10">
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2 mb-3.5">
                <Sparkles className="w-4 h-4 text-[#00E5BE]" />
                <span>
                  {isArabic 
                    ? 'لماذا تحتاج إلى Shadow Teacher لطفلك ؟' 
                    : 'Why does your child need a Shadow Teacher?'}
                </span>
              </h3>

              {/* Benefits Checklist 2x2 Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {benefits.map((item, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.08 }}
                    className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50/90 dark:bg-slate-800/50 border border-slate-100 dark:border-white/5 hover:border-[#00E5BE]/30 transition-colors"
                  >
                    <div className="w-5 h-5 rounded-md bg-[#00E5BE]/15 text-[#00897B] dark:text-[#00E5BE] flex items-center justify-center shrink-0 mt-0.5 text-xs font-black">
                      ✓
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-tight">
                        {item.text}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                        {item.sub}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

          </div>

          {/* Column 2: Compact Form Beside Introductory Text (5 cols on lg) */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <div className="rounded-3xl p-5 sm:p-6 shadow-xl transition-all relative overflow-hidden bg-gradient-to-br from-[#0B3B36] via-[#0E4A44] to-[#072421] dark:from-[#09221F] dark:via-[#0B2C27] dark:to-[#061815] border border-[#00E5BE]/30 text-white">
              
              {/* Decorative subtle brand glows */}
              <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-[#00E5BE]/15 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-32 h-32 bg-[#F59E0B]/10 rounded-full blur-2xl pointer-events-none" />

              {/* Form Title & Subtitle */}
              <div className="text-center mb-4 relative z-10">
                <div className="inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-full bg-[#00E5BE]/20 text-[#00E5BE] text-[11px] font-bold mb-1.5 border border-[#00E5BE]/35 shadow-xs">
                  <SiwarBraceletIcon className="w-3.5 h-3.5" />
                  <span>{isArabic ? 'سِوار الأمان — حجز مباشر' : 'Sewar Direct Booking'}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center justify-center gap-2">
                  <SiwarBraceletIcon className="w-5 h-5 text-[#00E5BE]" />
                  <span>{isArabic ? 'احجز خدمة سِوار الآن' : 'Book Sewar Service Now'}</span>
                </h3>
                <p className="text-[11px] sm:text-xs text-emerald-100/80 mt-0.5 font-medium">
                  {isArabic 
                    ? 'تقييم شامل ومطابقة معلم الظل الأنسب لبيئة طفلك المدرسية عبر خدمة سِوار' 
                    : 'Comprehensive assessment & matching the ideal shadow teacher via Sewar service'}
                </p>
              </div>

              {/* Success State */}
              <AnimatePresence>
                {isSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl p-5 text-center shadow-lg border border-white/40 space-y-3 my-2 text-slate-900 dark:text-white"
                  >
                    <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-inner">
                      <CheckCircle2 className="w-7 h-7" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-slate-900 dark:text-white">
                        {isArabic ? 'تم استلام طلبكم في خدمة سِوار بنجاح!' : 'Sewar Request Received Successfully!'}
                      </h4>
                      {submittedRequest && (
                        <div className="my-2 p-2.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-center space-y-1">
                          <div className="flex items-center justify-between text-xs px-1 text-slate-700 dark:text-slate-300">
                            <span className="text-slate-500 dark:text-slate-400">{isArabic ? 'المدينة المحددة:' : 'Selected City:'}</span>
                            <span className="font-bold text-emerald-700 dark:text-[#00E5BE] flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              <span>{submittedRequest.city || 'الرياض'}</span>
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-xs px-1 pt-1 border-t border-emerald-500/20">
                            <span className="text-[10px] text-slate-500 dark:text-slate-400 block">{isArabic ? 'الرقم المرجعي للطلب:' : 'Reference Number:'}</span>
                            <span className="font-mono font-black text-emerald-700 dark:text-emerald-400 text-sm tracking-wider">
                              {submittedRequest.referenceNumber}
                            </span>
                          </div>
                        </div>
                      )}
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                        {isArabic 
                          ? 'تم تسجيل طلبكم بنجاح في نظام مركز رابا، وسيتواصل معكم منسق خدمة سِوار (معلم الظل والدمج المدرسي) لترتيب التقييم والمطابقة.' 
                          : 'Our Sewar inclusion coordinator will contact you shortly to arrange the initial assessment.'}
                      </p>
                    </div>

                    <div className="flex flex-col gap-2 pt-1">
                      <button
                        onClick={handleWhatsAppDirect}
                        className="w-full bg-[#25D366] hover:bg-[#20ba59] text-white font-bold py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 text-xs shadow-md transition-all active:scale-98 cursor-pointer"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>{isArabic ? 'متابعة فورية عبر واتساب' : 'Direct Follow-up on WhatsApp'}</span>
                      </button>

                      <button
                        onClick={() => {
                          setIsSubmitted(false);
                          setFormData({ name: '', city: 'الرياض', birthDate: '', phone: '', email: '' });
                        }}
                        className="text-[11px] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium underline py-0.5 cursor-pointer"
                      >
                        {isArabic ? 'إرسال طلب إضافي' : 'Submit another request'}
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  /* Compact Booking Form */
                  <form onSubmit={handleSubmit} className="space-y-3 relative z-10">
                    
                    {errorMessage && (
                      <div className="p-2.5 bg-rose-500/20 text-rose-200 text-xs font-bold rounded-xl border border-rose-400/40 backdrop-blur-sm">
                        {errorMessage}
                      </div>
                    )}

                    {/* Field 1: Name */}
                    <div>
                      <label className="block text-xs font-bold text-emerald-100 mb-1">
                        {isArabic ? 'الإسم' : 'Name'}
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder={isArabic ? 'اسم الطفل أو ولي الأمر' : 'Child or Parent Name'}
                          className="w-full bg-white/95 dark:bg-slate-950/90 text-slate-900 dark:text-white placeholder-slate-400 rounded-xl px-3.5 py-2 sm:py-2.5 text-xs sm:text-sm shadow-sm border border-white/20 focus:border-[#00E5BE] focus:ring-2 focus:ring-[#00E5BE]/30 outline-none transition-all"
                        />
                        <User className={`w-3.5 h-3.5 text-slate-400 absolute top-1/2 -translate-y-1/2 ${isArabic ? 'left-3' : 'right-3'}`} />
                      </div>
                    </div>

                    {/* Row 2: City & Phone (2 columns) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      
                      {/* Field 2: City Selection */}
                      <div>
                        <label className="block text-xs font-bold text-emerald-100 mb-1">
                          {isArabic ? 'المدينة' : 'City'} <span className="text-[#00E5BE]">*</span>
                        </label>
                        <div className="relative">
                          <select
                            required
                            value={formData.city}
                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                            className="w-full bg-white/95 dark:bg-slate-950/90 text-slate-900 dark:text-white rounded-xl px-3 py-2 sm:py-2.5 text-xs sm:text-sm shadow-sm border border-white/20 focus:border-[#00E5BE] focus:ring-2 focus:ring-[#00E5BE]/30 outline-none transition-all cursor-pointer"
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
                          <MapPin className={`w-3.5 h-3.5 text-slate-400 absolute top-1/2 -translate-y-1/2 pointer-events-none ${isArabic ? 'left-2.5' : 'right-2.5'}`} />
                        </div>
                      </div>

                      {/* Field 3: Phone */}
                      <div>
                        <label className="block text-xs font-bold text-emerald-100 mb-1">
                          {isArabic ? 'رقم الجوال' : 'Phone'}
                        </label>
                        <div className="relative" dir="ltr">
                          <input
                            type="tel"
                            required
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            placeholder="+966 5X XXX XXXX"
                            className="w-full bg-white/95 dark:bg-slate-950/90 text-slate-900 dark:text-white placeholder-slate-400 rounded-xl px-3 py-2 sm:py-2.5 text-xs sm:text-sm shadow-sm border border-white/20 focus:border-[#00E5BE] focus:ring-2 focus:ring-[#00E5BE]/30 outline-none transition-all font-mono text-left"
                          />
                          <PhoneIcon className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2" />
                        </div>
                      </div>

                    </div>

                    {/* Row 3: Date of Birth & Email (2 columns) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      
                      {/* Field 4: Date of Birth */}
                      <div>
                        <label className="block text-xs font-bold text-emerald-100 mb-1">
                          {isArabic ? 'تاريخ الميلاد' : 'Date of Birth'}
                        </label>
                        <div className="relative">
                          <input
                            type="date"
                            value={formData.birthDate}
                            onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                            className="w-full bg-white/95 dark:bg-slate-950/90 text-slate-900 dark:text-white placeholder-slate-400 rounded-xl px-3 py-2 sm:py-2.5 text-xs sm:text-sm shadow-sm border border-white/20 focus:border-[#00E5BE] focus:ring-2 focus:ring-[#00E5BE]/30 outline-none transition-all"
                          />
                          <Calendar className={`w-3.5 h-3.5 text-slate-400 absolute top-1/2 -translate-y-1/2 pointer-events-none ${isArabic ? 'left-2.5' : 'right-2.5'}`} />
                        </div>
                      </div>

                      {/* Field 5: Email */}
                      <div>
                        <label className="block text-xs font-bold text-emerald-100 mb-1">
                          {isArabic ? 'البريد الإلكتروني' : 'Email Address'}
                        </label>
                        <div className="relative">
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="example@domain.com"
                            className="w-full bg-white/95 dark:bg-slate-950/90 text-slate-900 dark:text-white placeholder-slate-400 rounded-xl px-3 py-2 sm:py-2.5 text-xs sm:text-sm shadow-sm border border-white/20 focus:border-[#00E5BE] focus:ring-2 focus:ring-[#00E5BE]/30 outline-none transition-all"
                          />
                          <Mail className={`w-3.5 h-3.5 text-slate-400 absolute top-1/2 -translate-y-1/2 ${isArabic ? 'left-2.5' : 'right-2.5'}`} />
                        </div>
                      </div>

                    </div>

                    {/* Compact Submit Button (Raba Brand Teal Gradient) */}
                    <div className="pt-1.5">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-gradient-to-r from-[#00E5BE] to-[#00bfa5] hover:from-[#26ffd8] hover:to-[#00d6b9] active:scale-[0.98] text-slate-950 font-black py-2.5 sm:py-3 px-5 rounded-xl shadow-[0_8px_20px_rgba(0,229,190,0.35)] transition-all duration-200 flex items-center justify-center gap-2 text-sm cursor-pointer disabled:opacity-60"
                      >
                        {isSubmitting ? (
                          <div className="w-4 h-4 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />
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
              </AnimatePresence>

            </div>
          </div>

        </div>

          {/* Bottom Bracelet Charm (ميدالية سِوار الاحتواء السفلية) */}
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-white dark:bg-slate-900 border border-[#00E5BE]/40 shadow-xs flex items-center gap-1.5 z-10 text-[10px] font-bold text-slate-500 dark:text-slate-400">
            <Heart className="w-3 h-3 text-[#00E5BE] fill-current" />
            <span>{isArabic ? 'سِوار الأمان — خطوة بخطوة مع طفلك' : 'Sewar Bracelet — Step by Step with Your Child'}</span>
          </div>
        </div>

      </div>
    </section>
  );
};
