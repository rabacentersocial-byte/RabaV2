import React from 'react';
import { SPECIALISTS } from '../data/mockData';
import { Specialist } from '../types';
import { DoctorCardSlider, Doctor } from './DoctorCardSlider';
import { isSameSpecialist } from '../utils/specialistDeduplication';

interface SpecialistsSectionProps {
  specialists?: Specialist[];
  onViewCv: (specialist: Specialist) => void;
  onBookSpecialist: (specialist: Specialist) => void;
  onOpenSpecialistsPage?: () => void;
}

export const SpecialistsSection: React.FC<SpecialistsSectionProps> = ({
  specialists = SPECIALISTS,
  onViewCv,
  onBookSpecialist,
  onOpenSpecialistsPage
}) => {
  const findSpecialist = (doctor: Doctor): Specialist => {
    // 1. Direct or normalized match across ID & Name
    const matched = specialists.find((s) => isSameSpecialist(s, doctor));
    if (matched) return matched;

    // 2. Comprehensive fallback: build a full Specialist representation directly from doctor's data
    return {
      id: doctor.id.startsWith('spec-') ? doctor.id : `spec-${doctor.id.replace('doc-', '')}`,
      name: doctor.name,
      nameEn: doctor.nameEn || doctor.name,
      role: doctor.specialty || doctor.title,
      roleEn: doctor.specialtyEn || doctor.titleEn || doctor.title,
      title: doctor.title,
      titleEn: doctor.titleEn || doctor.title,
      licenseNumber: '',
      avatar: doctor.avatar,
      bio: doctor.bio || `أخصائي معتمد في مركز رابا للرعاية النهارية وتأهيل ذوي الإعاقة. يمتلك خبرة سريرية متقدمة في تطبيق الخطط التأهيلية الفردية المبنية على الأدلة والقياس الدقيق للنتائج وتطوير مهارات الأطفال التكيفية والتواصلية.`,
      bioEn: `Certified specialist at Raba Day Care Center with extensive clinical experience in evidence-based individual therapy plans and adaptive skill development.`,
      rating: doctor.rating || 4.9,
      reviewsCount: doctor.reviewCount || 120,
      experienceYears: doctor.experienceYears || 5,
      education: ['بكالوريوس في التأهيل والعلوم الطبية التطبيقية'],
      educationEn: ['Bachelor of Rehabilitation & Applied Medical Sciences'],
      certifications: ['بورد معتمد في التأهيل والرعاية التخصصية', 'ترخيص الهيئة السعودية للتخصصات الصحية'],
      certificationsEn: ['Certified Board Accreditation', 'Saudi Commission for Health Specialties (SCFHS)'],
      specialties: doctor.tags || ['تأهيل متخصص', 'تدخل مبكر', 'خطط فردية'],
      specialtiesEn: ['Specialized Rehabilitation', 'Early Intervention', 'Individual Treatment Plans'],
      availableDays: ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'],
      availableDaysEn: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'],
      sessionPrice: 0,
    };
  };

  const handleBookFromDoctorSlider = (doctor: Doctor) => {
    onBookSpecialist(findSpecialist(doctor));
  };

  const handleViewCvFromDoctorSlider = (doctor: Doctor) => {
    onViewCv(findSpecialist(doctor));
  };

  return (
    <section id="specialists" className="py-8 sm:py-12 md:py-20 relative overflow-hidden border-b border-slate-200/80 dark:border-white/10 bg-transparent transition-colors">
      <DoctorCardSlider 
        specialists={specialists}
        onBookAppointment={handleBookFromDoctorSlider}
        onViewCv={handleViewCvFromDoctorSlider}
        onOpenSpecialistsPage={onOpenSpecialistsPage}
      />
    </section>
  );
};

export default SpecialistsSection;
