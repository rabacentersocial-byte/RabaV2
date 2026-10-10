import React from 'react';
import { 
  Award, 
  Briefcase, 
  School, 
  UsersRound, 
  MessageSquareQuote, 
  Sparkles, 
  Languages, 
  ClipboardCheck, 
  Stethoscope, 
  HandHeart, 
  Layers, 
  Scale, 
  TrendingUp, 
  FileText, 
  BarChart3, 
  ShieldCheck, 
  GraduationCap, 
  BookOpen, 
  Activity,
  HeartHandshake,
  Speech,
  LucideIcon
} from 'lucide-react';
import { CourseItem } from '../data/coursesData';

export interface CourseIconOption {
  id: string;
  labelAr: string;
  labelEn: string;
  icon: LucideIcon;
}

export const COURSE_ICON_OPTIONS: CourseIconOption[] = [
  { id: 'award', labelAr: 'اعتماد وبورد (Award)', labelEn: 'Board & Award', icon: Award },
  { id: 'briefcase', labelAr: 'مسار مهني وفني (Career)', labelEn: 'Professional', icon: Briefcase },
  { id: 'school', labelAr: 'دمج وبيئة مدرسية (School)', labelEn: 'School Inclusion', icon: School },
  { id: 'users-round', labelAr: 'إشراف وتدريب فرق (Supervision)', labelEn: 'Supervision & Teams', icon: UsersRound },
  { id: 'message-square-quote', labelAr: 'تواصل وطلب لغوي (Mand & Speech)', labelEn: 'Functional Mand & Speech', icon: MessageSquareQuote },
  { id: 'sparkles', labelAr: 'استقلالية وعناية بالذات (Independence)', labelEn: 'Self-Care & Independence', icon: Sparkles },
  { id: 'languages', labelAr: 'سلوك لغوي وعمليات لفظية (Verbal Behavior)', labelEn: 'Verbal Behavior', icon: Languages },
  { id: 'clipboard-check', labelAr: 'تقييم وتشخيص (Assessment)', labelEn: 'Assessment & Diagnosis', icon: ClipboardCheck },
  { id: 'stethoscope', labelAr: 'تفاعل طبي وسلوكي (Medical)', labelEn: 'Medical & Behavioral', icon: Stethoscope },
  { id: 'hand-heart', labelAr: 'صدمات ورعاية وجدانية (Trauma & Care)', labelEn: 'Trauma & Care', icon: HandHeart },
  { id: 'layers', labelAr: 'اضطرابات مصاحبة (Comorbidities)', labelEn: 'Comorbidities', icon: Layers },
  { id: 'scale', labelAr: 'أخلاقيات المهنة (Ethics)', labelEn: 'Ethics & Standards', icon: Scale },
  { id: 'trending-up', labelAr: 'تطور علاقات PEAK (Relational Training)', labelEn: 'Progress & PEAK', icon: TrendingUp },
  { id: 'file-text', labelAr: 'خطط التدخل السلوكي BIP (Behavior Plans)', labelEn: 'BIP Behavior Plans', icon: FileText },
  { id: 'bar-chart-3', labelAr: 'رسم وتحليل بيانات ABA (Data Graphing)', labelEn: 'Data & Graphing', icon: BarChart3 },
  { id: 'shield-check', labelAr: 'حماية وجودة الممارسة (Shield)', labelEn: 'Shield & Quality', icon: ShieldCheck },
  { id: 'graduation-cap', labelAr: 'أكاديمي وتأهيلي (Academic)', labelEn: 'Academic & Degree', icon: GraduationCap },
  { id: 'book-open', labelAr: 'مناهج وحقائب تدريبية (Curriculum)', labelEn: 'Curriculum & Books', icon: BookOpen },
  { id: 'activity', labelAr: 'نشاط وسلوك حركي (Activity)', labelEn: 'Physical Activity', icon: Activity },
  { id: 'heart-handshake', labelAr: 'شراكة أسرية ومجتمعية (Parent Partnership)', labelEn: 'Parent Partnership', icon: HeartHandshake }
];

const ICONS_MAP: Record<string, LucideIcon> = {
  'award': Award,
  'briefcase': Briefcase,
  'school': School,
  'users-round': UsersRound,
  'message-square-quote': MessageSquareQuote,
  'message-square': MessageSquareQuote,
  'speech': Speech,
  'sparkles': Sparkles,
  'languages': Languages,
  'clipboard-check': ClipboardCheck,
  'stethoscope': Stethoscope,
  'hand-heart': HandHeart,
  'layers': Layers,
  'scale': Scale,
  'trending-up': TrendingUp,
  'file-text': FileText,
  'bar-chart-3': BarChart3,
  'shield-check': ShieldCheck,
  'graduation-cap': GraduationCap,
  'book-open': BookOpen,
  'activity': Activity,
  'heart-handshake': HeartHandshake
};

/**
 * Resolves the most appropriate custom icon for a course based on explicit iconName,
 * course ID, or semantic content keywords.
 */
export function resolveCourseIcon(course?: Partial<CourseItem> | null, explicitIconName?: string): LucideIcon {
  const iconKey = explicitIconName || course?.iconName;
  if (iconKey && ICONS_MAP[iconKey]) {
    return ICONS_MAP[iconKey];
  }

  // Course ID specific mapping
  const id = course?.id || '';
  if (id === 'course-autism-inclusion') return School;
  if (id === 'course-qasp-s') return UsersRound;
  if (id === 'course-mand-training') return MessageSquareQuote;
  if (id === 'course-toilet-training') return Sparkles;
  if (id === 'course-verbal-behavior') return Languages;
  if (id === 'course-specialist-assessment') return ClipboardCheck;
  if (id === 'course-medical-behavioral') return Stethoscope;
  if (id === 'course-trauma-aba') return HandHeart;
  if (id === 'course-comorbidities') return Layers;
  if (id === 'course-qaba-ethics') return Scale;
  if (id === 'course-peak') return TrendingUp;
  if (id === 'course-bip') return FileText;
  if (id === 'course-data-graphing') return BarChart3;

  // Semantic keyword detection
  const text = `${course?.titleAr || ''} ${course?.titleEn || ''} ${course?.categoryAr || ''} ${course?.categoryEn || ''} ${course?.floatingBadgeAr || ''} ${course?.shortTitle || ''}`.toLowerCase();

  if (text.includes('طلب') || text.includes('mand') || text.includes('نطق') || text.includes('كلام') || text.includes('تواصل لغوي')) {
    return MessageSquareQuote;
  }
  if (text.includes('حمام') || text.includes('استقلال') || text.includes('عناية بالذات') || text.includes('independence') || text.includes('toilet')) {
    return Sparkles;
  }
  if (text.includes('صف') || text.includes('مدرس') || text.includes('دمج') || text.includes('school') || text.includes('classroom')) {
    return School;
  }
  if (text.includes('إشراف') || text.includes('مشرف') || text.includes('qasp') || text.includes('supervis')) {
    return UsersRound;
  }
  if (text.includes('لغوي') || text.includes('لغة') || text.includes('verbal') || text.includes('intraverbal') || text.includes('echoic')) {
    return Languages;
  }
  if (text.includes('أخلاق') || text.includes('ethics') || text.includes('معايير')) {
    return Scale;
  }
  if (text.includes('طبي') || text.includes('medical') || text.includes('عضوي') || text.includes('دواء')) {
    return Stethoscope;
  }
  if (text.includes('بيان') || text.includes('رسم') || text.includes('graph') || text.includes('data')) {
    return BarChart3;
  }
  if (text.includes('خطة') || text.includes('تدخل') || text.includes('bip')) {
    return FileText;
  }
  if (text.includes('صدم') || text.includes('trauma') || text.includes('عاطف')) {
    return HandHeart;
  }
  if (text.includes('مصاحب') || text.includes('تشتت') || text.includes('comorbid')) {
    return Layers;
  }
  if (text.includes('peak') || text.includes('علاقات') || text.includes('ارتقاء')) {
    return TrendingUp;
  }
  if (text.includes('فني') || text.includes('abat') || text.includes('ممارس')) {
    return Briefcase;
  }
  if (text.includes('تقييم') || text.includes('تشخيص') || text.includes('assessment') || text.includes('vb-mapp') || text.includes('ablls')) {
    return ClipboardCheck;
  }
  if (text.includes('بورد') || text.includes('qba') || text.includes('اعتماد') || text.includes('شهادة')) {
    return Award;
  }

  return Award;
}

interface CourseCustomIconProps {
  course?: Partial<CourseItem> | null;
  iconName?: string;
  className?: string;
}

export const CourseCustomIcon: React.FC<CourseCustomIconProps> = ({
  course,
  iconName,
  className = 'w-5 h-5'
}) => {
  const IconComponent = resolveCourseIcon(course, iconName);
  return <IconComponent className={className} />;
};
