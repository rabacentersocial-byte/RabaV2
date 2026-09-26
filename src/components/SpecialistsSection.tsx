import React from 'react';
import { SPECIALISTS } from '../data/mockData';
import { Specialist } from '../types';
import { DoctorCardSlider, Doctor } from './DoctorCardSlider';

interface SpecialistsSectionProps {
  specialists?: Specialist[];
  onViewCv: (specialist: Specialist) => void;
  onBookSpecialist: (specialist: Specialist) => void;
}

export const SpecialistsSection: React.FC<SpecialistsSectionProps> = ({
  specialists = SPECIALISTS,
  onViewCv,
  onBookSpecialist
}) => {
  const findSpecialist = (doctor: Doctor): Specialist => {
    // 1. Direct ID or partial match
    const docIdClean = doctor.id.replace('doc-', 'spec-');
    const directMatch = specialists.find((s) => s.id === doctor.id || s.id === docIdClean);
    if (directMatch) return directMatch;

    // 1b. Known alias for Ahmed Abouzeid
    if (doctor.id === 'doc-ahmed-abouzeid' || doctor.id === 'spec-ahmed-abouzeid') {
      const ahmedMatch = specialists.find((s) => s.id === 'spec-1' || s.name.includes('أبو زيد'));
      if (ahmedMatch) return ahmedMatch;
    }

    // 2. Name cleaning match (remove 'أ. ' or 'د. ')
    const cleanDocName = doctor.name.replace(/^[أادد]\.?\s*/, '').trim();
    const nameMatch = specialists.find((s) => {
      const cleanSpecName = s.name.replace(/^[أادد]\.?\s*/, '').trim();
      return cleanSpecName.includes(cleanDocName) || cleanDocName.includes(cleanSpecName);
    });

    return nameMatch || specialists[0];
  };

  const handleBookFromDoctorSlider = (doctor: Doctor) => {
    onBookSpecialist(findSpecialist(doctor));
  };

  const handleViewCvFromDoctorSlider = (doctor: Doctor) => {
    onViewCv(findSpecialist(doctor));
  };

  return (
    <section id="specialists" className="py-8 sm:py-12 md:py-20 relative overflow-hidden border-b border-slate-200/80 dark:border-white/10 bg-slate-50/50 dark:bg-slate-950/40">
      <DoctorCardSlider 
        specialists={specialists}
        onBookAppointment={handleBookFromDoctorSlider}
        onViewCv={handleViewCvFromDoctorSlider}
      />
    </section>
  );
};

export default SpecialistsSection;
