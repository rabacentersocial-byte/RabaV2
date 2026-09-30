import React from 'react';

interface LogoProps {
  className?: string;
}

export const NafeaLogo: React.FC<LogoProps> = ({ className = 'max-h-full max-w-full object-contain' }) => (
  <svg viewBox="0 0 400 240" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <g transform="translate(200, 75)">
      <circle cx="0" cy="-38" r="9" fill="#0EA5E9" />
      <path d="M-8 -22 C-10 -5, -4 15, 0 25 C4 15, 10 -5, 8 -22 Z" fill="#0EA5E9" />
      <path d="M-8 -18 C-18 -32, -26 -44, -22 -52 C-18 -50, -12 -38, -4 -24 Z" fill="#0284C7" />
      <path d="M-28 -42 C-40 -40, -44 -18, -34 -6 C-26 -16, -20 -30, -28 -42 Z" fill="#84CC16" />
      <circle cx="-38" cy="8" r="4.5" fill="#EF4444" />
      <path d="M-26 12 C-38 14, -40 28, -26 34 C-18 30, -16 20, -26 12 Z" fill="#EAB308" />
      <circle cx="16" cy="-45" r="3.5" fill="#EAB308" />
      <circle cx="34" cy="-28" r="3.5" fill="#84CC16" />
      <path d="M8 8 C14 -8, 32 -6, 32 10 C32 26, 12 36, 8 8 Z" fill="#EF4444" />
    </g>
    <text x="200" y="145" textAnchor="middle" fontFamily="'Tajawal', 'Cairo', sans-serif" fontWeight="900" fontSize="34" fill="#0D5C75">نافع</text>
    <text x="200" y="180" textAnchor="middle" fontFamily="'Tajawal', 'Cairo', sans-serif" fontWeight="800" fontSize="22" fill="#E11D48" letterSpacing="4">بـرامـج</text>
    <text x="200" y="212" textAnchor="middle" fontFamily="'Tajawal', 'Cairo', sans-serif" fontWeight="800" fontSize="22" fill="#2E5A44" letterSpacing="4">نـافـع</text>
  </svg>
);

export const KsuLogo: React.FC<LogoProps> = ({ className = 'max-h-full max-w-full object-contain' }) => (
  <svg viewBox="0 0 400 240" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <rect width="400" height="240" rx="20" fill="#0082C8" />
    <g transform="translate(305, 115) scale(0.85)">
      <path d="M-36 -50 C-10 -58, 10 -58, 36 -50 C38 0, 36 35, 0 65 C-36 35, -38 0, -36 -50 Z" fill="#FFFFFF" />
      <path d="M-1.5 -38 L1.5 -38 L1.5 -22 L-1.5 -22 Z" fill="#0082C8" />
      <path d="M0 -38 C-8 -46, -16 -40, -18 -32 C-10 -35, -4 -32, 0 -38 Z" fill="#0082C8" />
      <path d="M0 -38 C8 -46, 16 -40, 18 -32 C10 -35, 4 -32, 0 -38 Z" fill="#0082C8" />
      <path d="M0 -34 C-10 -38, -18 -30, -14 -22 C-8 -26, -2 -28, 0 -34 Z" fill="#0082C8" />
      <path d="M0 -34 C10 -38, 18 -30, 14 -22 C8 -26, 2 -28, 0 -34 Z" fill="#0082C8" />
      <path d="M-14 -18 Q0 -13 14 -8 L13 -6 Q0 -11 -13 -16 Z" fill="#0082C8" />
      <path d="M14 -18 Q0 -13 -14 -8 L-13 -6 Q0 -11 13 -16 Z" fill="#0082C8" />
      <path d="M-22 5 C-10 0, -2 8, 0 16 C2 8, 10 0, 22 5 C18 18, 10 24, 0 25 C-10 24, -18 18, -22 5 Z" fill="#0082C8" />
      <text x="0" y="44" textAnchor="middle" fontFamily="'Cairo', sans-serif" fontWeight="900" fontSize="13" fill="#0082C8">1957</text>
    </g>
    <g transform="translate(145, 105)">
      <text x="0" y="0" textAnchor="middle" fontFamily="'Tajawal', 'Cairo', sans-serif" fontWeight="900" fontSize="34" fill="#FFFFFF">جامـعـة</text>
      <text x="0" y="32" textAnchor="middle" fontFamily="'Tajawal', 'Cairo', sans-serif" fontWeight="900" fontSize="28" fill="#FFFFFF">الملك سعود</text>
      <text x="0" y="58" textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight="700" fontSize="14" fill="#FFFFFF">King Saud University</text>
    </g>
  </svg>
);

export const MnghaLogo: React.FC<LogoProps> = ({ className = 'max-h-full max-w-full object-contain' }) => (
  <svg viewBox="0 0 440 220" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <g transform="translate(340, 110) scale(0.9)">
      <circle cx="0" cy="0" r="54" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
      <circle cx="0" cy="0" r="48" fill="#B91C1C" />
      <circle cx="0" cy="0" r="40" fill="#FFFFFF" />
      <path d="M-28 6 C-32 -14, -18 -30, 0 -34 C18 -30, 32 -14, 28 6" stroke="#15803D" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M-10 -26 L-14 -18 L-5 -19 L0 -24 L5 -19 L14 -18 L10 -26 Z" fill="#EAB308" stroke="#CA8A04" strokeWidth="1" />
      <rect x="-14" y="-8" width="28" height="16" rx="4" fill="#65A30D" />
      <circle cx="-6" cy="8" r="3" fill="#1F2937" />
      <circle cx="6" cy="8" r="3" fill="#1F2937" />
      <path d="M-34 22 Q0 30 34 22 L30 34 Q0 40 -30 34 Z" fill="#991B1B" />
      <path d="M-34 22 L-42 16 L-38 32 L-30 34 Z" fill="#7F1D1D" />
      <path d="M34 22 L42 16 L38 32 L30 34 Z" fill="#7F1D1D" />
    </g>
    <g transform="translate(155, 65)">
      <text x="0" y="24" textAnchor="middle" fontFamily="'Tajawal', 'Cairo', sans-serif" fontWeight="900" fontSize="26" fill="#0F172A">وزارة الحرس الوطني</text>
      <text x="0" y="60" textAnchor="middle" fontFamily="'Tajawal', 'Cairo', sans-serif" fontWeight="900" fontSize="28" fill="#1E293B">الشـؤون الـصـحـيـة</text>
      <text x="0" y="86" textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight="600" fontSize="11" fill="#475569">Ministry of National Guard Health Affairs</text>
      <text x="0" y="112" textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight="900" fontSize="16" fill="#0F172A" letterSpacing="3">M N G H A</text>
    </g>
  </svg>
);

export const MewaLogo: React.FC<LogoProps> = ({ className = 'max-h-full max-w-full object-contain' }) => (
  <svg viewBox="0 0 420 220" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <g transform="translate(210, 62) scale(0.95)">
      <circle cx="0" cy="0" r="42" fill="#FFFFFF" stroke="#16A34A" strokeWidth="4.5" />
      <path d="M-2.5 -15 L2.5 -15 L2.5 12 L-2.5 12 Z" fill="#15803D" />
      <path d="M0 -15 C-6 -23, -16 -21, -18 -15 C-12 -17, -4 -13, 0 -15 Z" fill="#16A34A" />
      <path d="M0 -15 C6 -23, 16 -21, 18 -15 C12 -17, 4 -13, 0 -15 Z" fill="#16A34A" />
      <path d="M0 -10 C-10 -15, -18 -7, -14 0 C-8 -4, -2 -6, 0 -10 Z" fill="#15803D" />
      <path d="M0 -10 C10 -15, 18 -7, 14 0 C8 -4, 2 -6, 0 -10 Z" fill="#15803D" />
      <path d="M-14 10 Q0 16 14 20 L13 22 Q0 18 -13 12 Z" fill="#15803D" />
      <path d="M14 10 Q0 16 -14 20 L-13 22 Q0 18 13 12 Z" fill="#15803D" />
    </g>
    <g transform="translate(210, 138)">
      <text x="0" y="24" textAnchor="middle" fontFamily="'Tajawal', 'Cairo', sans-serif" fontWeight="900" fontSize="25" fill="#0C3456">وزارة البيئة والمياه والزراعة</text>
      <text x="0" y="52" textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight="700" fontSize="12" fill="#1E293B">Ministry of Environment Water &amp; Agriculture</text>
    </g>
  </svg>
);

export const SbaLogo: React.FC<LogoProps> = ({ className = 'max-h-full max-w-full object-contain' }) => (
  <svg viewBox="0 0 420 220" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <g transform="translate(210, 80) scale(0.95)">
      <path d="M-95 -48 C-80 -48, -60 -40, -60 -24 C-60 -8, -75 -4, -85 0 C-98 4, -108 10, -108 24 C-108 42, -90 48, -72 48 C-60 48, -50 44, -45 38 L-45 22 C-52 28, -62 32, -72 32 C-82 32, -90 28, -90 18 C-90 8, -78 4, -68 0 C-55 -5, -44 -12, -44 -26 C-44 -42, -62 -48, -80 -48 C-90 -48, -100 -45, -105 -40 L-105 -25 C-100 -32, -90 -48, -95 -48 Z" fill="#0C1B33" />
      <polygon points="-108,30 -90,48 -108,48" fill="#84CC16" />
      <path d="M-35 -48 L15 -48 C30 -48, 42 -38, 42 -22 C42 -12, 34 -4, 25 0 C36 4, 46 14, 46 26 C46 42, 32 48, 15 48 L-35 48 Z M-18 -32 L-18 -6 L12 -6 C20 -6, 26 -12, 26 -19 C26 -26, 20 -32, 12 -32 Z M-18 10 L-18 32 L15 32 C24 32, 30 26, 30 21 C30 16, 24 10, 15 10 Z" fill="#0C1B33" />
      <path d="M70 48 L95 -48 L122 48 L103 48 L97 22 L78 22 L72 48 Z M83 6 L93 -30 L101 6 Z" fill="#0C1B33" />
      <polygon points="56,48 70,48 65,30" fill="#84CC16" />
    </g>
    <text x="210" y="152" textAnchor="middle" fontFamily="'Tajawal', 'Cairo', sans-serif" fontWeight="900" fontSize="28" fill="#0C1B33">هيئة الإذاعة و التلفزيون</text>
    <line x1="80" y1="168" x2="340" y2="168" stroke="#84CC16" strokeWidth="2.5" strokeLinecap="round" />
    <text x="210" y="190" textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight="800" fontSize="12" fill="#0C1B33" letterSpacing="2">SAUDI BROADCASTING AUTHORITY</text>
  </svg>
);

export const FaisaliahLogo: React.FC<LogoProps> = ({ className = 'max-h-full max-w-full object-contain' }) => (
  <svg viewBox="0 0 380 240" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <g transform="translate(190, 115) scale(0.95)">
      <path d="M-85 10 C-85 -55, 85 -55, 85 10" fill="none" stroke="#00A3E0" strokeWidth="6" strokeLinecap="round" />
      <path id="arcPathInline" d="M-72 6 C-70 -48, 70 -48, 72 6" fill="none" />
      <text fontFamily="'Tajawal', 'Cairo', sans-serif" fontWeight="900" fontSize="21" fill="#004C87">
        <textPath href="#arcPathInline" startOffset="50%" textAnchor="middle">
          مـــدارس الـفـيـصـلـيـة الأهلية
        </textPath>
      </text>
      <circle cx="-35" cy="-8" r="8" fill="#004C87" />
      <path d="M-45 32 L-20 32 L-30 0 L-48 6 Z" fill="#004C87" />
      <circle cx="22" cy="-6" r="8" fill="#004C87" />
      <path d="M-5 -45 L-2 32 L36 32 L54 -3 Z" fill="#004C87" />
      <path d="M0 34 C-30 30, -65 20, -95 12 L-92 24 C-65 30, -30 40, 0 46 Z" fill="#00A3E0" />
      <path d="M0 46 C-30 40, -65 30, -92 24 L-90 36 C-60 42, -30 52, 0 56 Z" fill="#0082C8" />
      <path d="M0 56 C-30 52, -60 42, -90 36 L-85 50 C-55 56, -25 64, 0 68 Z" fill="#004C87" />
      <path d="M0 34 C30 30, 65 20, 95 12 L92 24 C65 30, 30 40, 0 46 Z" fill="#00A3E0" />
      <path d="M0 46 C30 40, 65 30, 92 24 L90 36 C60 42, 30 52, 0 56 Z" fill="#0082C8" />
      <path d="M0 56 C30 52, 60 42, 90 36 L85 50 C55 56, 25 64, 0 68 Z" fill="#004C87" />
    </g>
  </svg>
);

export const DeltaLogo: React.FC<LogoProps> = ({ className = 'max-h-full max-w-full object-contain' }) => (
  <svg viewBox="0 0 420 200" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <g transform="translate(210, 85)">
      <text x="-95" y="10" textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight="900" fontSize="44" fill="#2E2A72">Delta</text>
      <g transform="translate(0, -6)">
        <path d="M0 -34 L32 20 L-32 20 Z" fill="none" stroke="#70B243" strokeWidth="5" strokeLinejoin="round" />
        <line x1="-34" y1="20" x2="34" y2="20" stroke="#2E2A72" strokeWidth="4" strokeLinecap="round" />
        <circle cx="-2" cy="-14" r="2.5" fill="#2E2A72" />
        <path d="M-6 -6 L10 10" stroke="#2E2A72" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M-10 6 C-14 12, -4 16, 2 16" fill="none" stroke="#2E2A72" strokeWidth="3" />
        <text x="-24" y="-22" fontFamily="sans-serif" fontSize="10" fontWeight="bold" fill="#70B243">®</text>
      </g>
      <text x="95" y="10" textAnchor="middle" fontFamily="'Tajawal', 'Cairo', sans-serif" fontWeight="900" fontSize="52" fill="#2E2A72">دلتا</text>
    </g>
    <g transform="translate(210, 138)">
      <rect x="-160" y="0" width="320" height="26" rx="3" fill="#70B243" />
      <text x="0" y="18" textAnchor="middle" fontFamily="'Tajawal', 'Cairo', sans-serif" fontWeight="800" fontSize="13" fill="#FFFFFF">
        مـخـتـبـرات طـبـيـة &nbsp;|&nbsp; Medical Laboratories
      </text>
    </g>
  </svg>
);

export const DgdaLogo: React.FC<LogoProps> = ({ className = 'max-h-full max-w-full object-contain' }) => (
  <svg viewBox="0 0 340 340" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <g transform="translate(170, 170)">
      <circle cx="0" cy="0" r="148" fill="#FFFFFF" stroke="#006B4D" strokeWidth="4" />
      <circle cx="0" cy="0" r="142" fill="none" stroke="#006B4D" strokeWidth="1.5" />
      <circle cx="0" cy="0" r="112" fill="none" stroke="#006B4D" strokeWidth="2" />
      <g fill="none" stroke="#006B4D" strokeWidth="2.5" strokeLinejoin="round">
        <polygon points="0,-142 8,-122 -8,-122" />
        <polygon points="36,-137 42,-117 26,-121" />
        <polygon points="71,-123 72,-103 57,-110" />
        <polygon points="100,-100 96,-80 84,-90" />
        <polygon points="123,-71 114,-53 105,-66" />
        <polygon points="137,-36 123,-21 118,-37" />
        <polygon points="142,0 124,10 124,-10" />
        <polygon points="137,36 118,37 123,21" />
        <polygon points="123,71 105,66 114,53" />
        <polygon points="100,100 84,90 96,80" />
        <polygon points="71,123 57,110 72,103" />
        <polygon points="36,137 26,121 42,117" />
        <polygon points="0,142 -8,122 8,122" />
        <polygon points="-36,137 -42,117 -26,121" />
        <polygon points="-71,123 -72,103 -57,110" />
        <polygon points="-100,100 -96,80 -84,90" />
        <polygon points="-123,71 -114,53 -105,66" />
        <polygon points="-137,36 -123,21 -118,37" />
        <polygon points="-142,0 -124,-10 -124,10" />
        <polygon points="-137,-36 -118,-37 -123,-21" />
        <polygon points="-123,-71 -105,-66 -114,-53" />
        <polygon points="-100,-100 -84,-90 -96,-80" />
        <polygon points="-71,-123 -57,-110 -72,-103" />
        <polygon points="-36,-137 -26,-121 -42,-117" />
      </g>
      <path id="dgdaArcInline" d="M-90 -55 C-55 -105, 55 -105, 90 -55" fill="none" />
      <text fontFamily="'Tajawal', 'Cairo', sans-serif" fontWeight="900" fontSize="18" fill="#006B4D">
        <textPath href="#dgdaArcInline" startOffset="50%" textAnchor="middle">
          هيئة تطوير بوابة الدرعية
        </textPath>
      </text>
      <g transform="translate(0, -35) scale(0.65)">
        <path d="M-1.5 -18 L1.5 -18 L1.5 5 L-1.5 5 Z" fill="#006B4D" />
        <path d="M0 -18 C-6 -26, -14 -24, -16 -18 C-10 -20, -3 -16, 0 -18 Z" fill="#006B4D" />
        <path d="M0 -18 C6 -26, 14 -24, 16 -18 C10 -20, 3 -16, 0 -18 Z" fill="#006B4D" />
      </g>
      <path d="M-55 18 L-55 6 C-55 2, -45 -2, -35 2 L-35 -10 C-35 -14, -20 -18, -10 -14 L0 -14 C10 -18, 25 -14, 25 -10 L35 0 C45 -4, 55 0, 55 6 L55 18 Z" fill="none" stroke="#006B4D" strokeWidth="2.5" strokeLinejoin="round" />
      <line x1="-50" y1="23" x2="50" y2="23" stroke="#006B4D" strokeWidth="2" />
      <line x1="-45" y1="28" x2="45" y2="28" stroke="#006B4D" strokeWidth="2" />
    </g>
  </svg>
);

export const ElSeifLogo: React.FC<LogoProps> = ({ className = 'max-h-full max-w-full object-contain' }) => (
  <svg viewBox="0 0 540 200" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <g transform="translate(90, 100) scale(0.95)">
      <polygon points="0,-72 68,48 -68,48" fill="#C8102E" stroke="#A00C24" strokeWidth="3" />
      <polygon points="0,-64 60,42 -60,42" fill="#B91C1C" />
      <path d="M0 -54 L12 36 L-12 36 Z" fill="#FFFFFF" opacity="0.9" />
      <polygon points="-40,36 -20,-4 -12,36" fill="#FFFFFF" />
      <polygon points="40,36 20,-4 12,36" fill="#FFFFFF" />
      <polygon points="0,-48 8,24 -8,24" fill="#C8102E" />
      <rect x="-48" y="28" width="96" height="6" fill="#FFFFFF" />
    </g>
    <g transform="translate(350, 75)">
      <text x="0" y="24" textAnchor="middle" fontFamily="'Tajawal', 'Cairo', sans-serif" fontWeight="900" fontSize="36" fill="#1E293B">السيف مهندسون مقاولون</text>
      <text x="0" y="58" textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight="800" fontSize="16" fill="#1E293B">EL SEIF Engineering Contracting</text>
    </g>
  </svg>
);

export const DiriyahLogo: React.FC<LogoProps> = ({ className = 'max-h-full max-w-full object-contain' }) => (
  <svg viewBox="0 0 340 340" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <g transform="translate(170, 170)">
      <circle cx="0" cy="0" r="148" fill="#FFFFFF" stroke="#9A3412" strokeWidth="3.5" />
      <circle cx="0" cy="0" r="142" fill="none" stroke="#9A3412" strokeWidth="1.5" />
      <circle cx="0" cy="0" r="114" fill="none" stroke="#9A3412" strokeWidth="2" />
      <g fill="none" stroke="#9A3412" strokeWidth="2.5" strokeLinejoin="round">
        <polygon points="0,-142 7,-124 -7,-124" />
        <polygon points="36,-137 42,-119 26,-123" />
        <polygon points="71,-123 72,-105 57,-112" />
        <polygon points="100,-100 96,-82 84,-92" />
        <polygon points="123,-71 114,-55 105,-68" />
        <polygon points="137,-36 123,-23 118,-39" />
        <polygon points="142,0 124,9 124,-9" />
        <polygon points="137,36 118,39 123,23" />
        <polygon points="123,71 105,68 114,55" />
        <polygon points="100,100 84,92 96,82" />
        <polygon points="71,123 57,112 72,105" />
        <polygon points="36,137 26,123 42,119" />
        <polygon points="0,142 -7,124 7,124" />
        <polygon points="-36,137 -42,119 -26,123" />
        <polygon points="-71,123 -72,105 -57,112" />
        <polygon points="-100,100 -96,82 -84,92" />
        <polygon points="-123,71 -114,55 -105,68" />
        <polygon points="-137,36 -123,23 -118,39" />
        <polygon points="-142,0 -124,-9 -124,9" />
        <polygon points="-137,-36 -118,-39 -123,-23" />
        <polygon points="-123,-71 -105,-68 -114,-55" />
        <polygon points="-100,-100 -84,-92 -96,-82" />
        <polygon points="-71,-123 -57,-112 -72,-105" />
        <polygon points="-36,-137 -26,-123 -42,-119" />
      </g>
      <path id="diriyahArArcInline" d="M-85 -60 C-50 -105, 50 -105, 85 -60" fill="none" />
      <text fontFamily="'Tajawal', 'Cairo', sans-serif" fontWeight="900" fontSize="21" fill="#9A3412">
        <textPath href="#diriyahArArcInline" startOffset="50%" textAnchor="middle">
          شـركـة الـدرعـيـة
        </textPath>
      </text>
      <path id="diriyahEnArcInline" d="M-95 65 C-55 110, 55 110, 95 65" fill="none" />
      <text fontFamily="'Inter', sans-serif" fontWeight="800" fontSize="16" fill="#9A3412">
        <textPath href="#diriyahEnArcInline" startOffset="50%" textAnchor="middle">
          Diriyah Company
        </textPath>
      </text>
      <path d="M-52 16 L-52 4 C-52 0, -42 -4, -32 0 L-32 -14 C-32 -18, -18 -22, -8 -16 L-2 -16 C8 -22, 22 -18, 22 -14 L30 0 C40 -6, 52 -2, 52 4 L52 16 Z" fill="none" stroke="#9A3412" strokeWidth="2.5" strokeLinejoin="round" />
      <line x1="-50" y1="21" x2="50" y2="21" stroke="#9A3412" strokeWidth="2" />
      <line x1="-45" y1="26" x2="45" y2="26" stroke="#9A3412" strokeWidth="2" />
    </g>
  </svg>
);

export const AutismAlkharjLogo: React.FC<LogoProps> = ({ className = 'max-h-full max-w-full object-contain' }) => (
  <svg viewBox="0 0 460 220" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <g transform="translate(350, 110) scale(0.95)">
      <path d="M-36 -12 L0 -34 L36 -12 L0 10 Z" fill="#007791" stroke="#D97706" strokeWidth="1.5" />
      <path d="M-36 -12 L0 10 L0 44 L-36 22 Z" fill="#0284C7" stroke="#D97706" strokeWidth="1.5" />
      <path d="M0 10 L36 -12 L36 22 L0 44 Z" fill="#0F4C81" stroke="#D97706" strokeWidth="1.5" />
      <circle cx="-16" cy="-22" r="5" fill="#0284C7" stroke="#D97706" strokeWidth="1.5" />
      <circle cx="20" cy="-6" r="5" fill="#007791" stroke="#D97706" strokeWidth="1.5" />
      <path d="M0 44 L-28 26 L0 58 L28 26 Z" fill="#003B5C" stroke="#D97706" strokeWidth="1" />
    </g>
    <g transform="translate(160, 80)">
      <text x="0" y="22" textAnchor="middle" fontFamily="'Tajawal', 'Cairo', sans-serif" fontWeight="900" fontSize="34" fill="#C59B27">جــمــعـيــة</text>
      <text x="0" y="65" textAnchor="middle" fontFamily="'Tajawal', 'Cairo', sans-serif" fontWeight="900" fontSize="44" fill="#005A9C">أُسـر الـتـوحّـد</text>
      <text x="0" y="94" textAnchor="middle" fontFamily="'Tajawal', 'Cairo', sans-serif" fontWeight="800" fontSize="14" fill="#64748B">فـرع الـخـرج &nbsp;|&nbsp; Autism Families</text>
    </g>
  </svg>
);

export const PartnerLogoRenderer: React.FC<{ partnerId: string; logoUrl?: string; name: string }> = ({
  partnerId,
  logoUrl,
  name
}) => {
  // Direct vector render for the 11 official partners
  switch (partnerId) {
    case 'partner-nafea':
      return <NafeaLogo className="max-h-full max-w-full w-auto h-auto object-contain mx-auto" />;
    case 'partner-ksu':
      return <KsuLogo className="max-h-full max-w-full w-auto h-auto object-contain mx-auto" />;
    case 'partner-mngha':
      return <MnghaLogo className="max-h-full max-w-full w-auto h-auto object-contain mx-auto" />;
    case 'partner-mewa':
      return <MewaLogo className="max-h-full max-w-full w-auto h-auto object-contain mx-auto" />;
    case 'partner-sba':
      return <SbaLogo className="max-h-full max-w-full w-auto h-auto object-contain mx-auto" />;
    case 'partner-faisaliah':
      return <FaisaliahLogo className="max-h-full max-w-full w-auto h-auto object-contain mx-auto" />;
    case 'partner-delta':
      return <DeltaLogo className="max-h-full max-w-full w-auto h-auto object-contain mx-auto" />;
    case 'partner-dgda':
      return <DgdaLogo className="max-h-full max-w-full w-auto h-auto object-contain mx-auto" />;
    case 'partner-elseif':
      return <ElSeifLogo className="max-h-full max-w-full w-auto h-auto object-contain mx-auto" />;
    case 'partner-diriyah':
      return <DiriyahLogo className="max-h-full max-w-full w-auto h-auto object-contain mx-auto" />;
    case 'partner-autism-alkharj':
      return <AutismAlkharjLogo className="max-h-full max-w-full w-auto h-auto object-contain mx-auto" />;
    default:
      if (logoUrl) {
        return (
          <img 
            src={logoUrl} 
            alt={name} 
            className="max-h-full max-w-full w-auto h-auto object-contain mx-auto my-auto"
            loading="eager"
            referrerPolicy="no-referrer"
          />
        );
      }
      return null;
  }
};
