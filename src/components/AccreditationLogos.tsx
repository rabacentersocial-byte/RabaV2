import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * 1. ISO Logo (International Organization for Standardization)
 */
export const IsoLogo: React.FC<LogoProps> = ({ className = 'h-16 w-auto' }) => (
  <svg 
    viewBox="0 0 240 140" 
    className={className}
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label="ISO Logo"
  >
    {/* Globe Grid lines behind ISO */}
    <g className="text-[#00539B] dark:text-[#38BDF8]" stroke="currentColor" strokeWidth="2.8">
      <ellipse cx="120" cy="70" rx="46" ry="46" fill="none" opacity="0.9" />
      <ellipse cx="120" cy="70" rx="30" ry="46" fill="none" opacity="0.85" />
      <ellipse cx="120" cy="70" rx="14" ry="46" fill="none" opacity="0.8" />
      <line x1="74" y1="70" x2="166" y2="70" strokeWidth="2.8" opacity="0.85" />
      <line x1="82" y1="46" x2="158" y2="46" strokeWidth="2.2" opacity="0.8" />
      <line x1="82" y1="94" x2="158" y2="94" strokeWidth="2.2" opacity="0.8" />
    </g>

    {/* Bold ISO Typography with subtle knockout border */}
    <g className="fill-[#00539B] dark:fill-[#38BDF8]">
      {/* Letter I */}
      <rect x="54" y="52" width="22" height="38" rx="2" />
      <rect x="47" y="46" width="36" height="9" rx="2" />
      <rect x="47" y="87" width="36" height="9" rx="2" />

      {/* Letter S */}
      <path 
        d="M138 52 C134 46 126 44 118 44 C104 44 96 52 96 61 C96 73 111 74 122 77 C133 80 137 84 137 91 C137 99 129 105 116 105 C103 105 94 97 92 88 L104 85 C106 91 110 94 116 94 C122 94 125 91 125 87 C125 79 110 78 99 75 C88 72 84 66 84 59 C84 50 93 43 106 43 C117 43 125 48 127 54 Z" 
        fillRule="evenodd"
        transform="translate(1, -2)"
      />

      {/* Letter O */}
      <path 
        d="M166 43 C151 43 141 55 141 71 C141 87 151 99 166 99 C181 99 191 87 191 71 C191 55 181 43 166 43 Z M166 54 C174 54 179 61 179 71 C179 81 174 88 166 88 C158 88 153 81 153 71 C153 61 158 54 166 54 Z" 
        fillRule="evenodd"
      />
    </g>
  </svg>
);

/**
 * 2. IBAO Logo (International Behavioral Analysis Organization)
 * Classic Gold Wreath, 3 Stars, Greco-Roman Column Pedestal, Serif "IBAO"
 */
export const IbaoLogo: React.FC<LogoProps> = ({ className = 'h-16 w-auto' }) => (
  <svg 
    viewBox="0 0 220 140" 
    className={className}
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label="IBAO Logo"
  >
    {/* Golden Gradient Definition */}
    <defs>
      <linearGradient id="goldGradient" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#D4AF37" />
        <stop offset="50%" stopColor="#B8860B" />
        <stop offset="100%" stopColor="#996515" />
      </linearGradient>
    </defs>

    {/* 3 Stars at Top */}
    <g fill="url(#goldGradient)">
      {/* Center Star */}
      <path d="M110 23 L112.5 28.5 L118.5 29 L114 33 L115.5 39 L110 35.5 L104.5 39 L106 33 L101.5 29 L107.5 28.5 Z" />
      {/* Left Star */}
      <path d="M96 26 L98 30.5 L103 31 L99.5 34.5 L100.5 39 L96 36.5 L91.5 39 L92.5 34.5 L89 31 L94 30.5 Z" transform="scale(0.85) translate(16, 6)" />
      {/* Right Star */}
      <path d="M124 26 L126 30.5 L131 31 L127.5 34.5 L128.5 39 L124 36.5 L119.5 39 L120.5 34.5 L117 31 L122 30.5 Z" transform="scale(0.85) translate(22, 6)" />
    </g>

    {/* Laurel Wreath Left & Right */}
    <g stroke="url(#goldGradient)" strokeWidth="2.2" fill="url(#goldGradient)">
      {/* Left Wreath Leaves */}
      <path d="M55 76 C55 54 72 36 92 32" strokeWidth="2" fill="none" />
      <path d="M58 48 C51 51 49 57 53 62 C58 60 62 55 58 48 Z" />
      <path d="M66 38 C59 40 57 47 62 51 C67 48 70 43 66 38 Z" />
      <path d="M78 32 C71 33 68 39 73 44 C78 41 81 37 78 32 Z" />
      <path d="M52 64 C45 68 44 75 49 79 C54 77 57 71 52 64 Z" />
      <path d="M51 81 C46 86 46 93 51 97 C55 94 57 88 51 81 Z" />
      <path d="M56 98 C52 104 54 110 60 113 C63 109 64 103 56 98 Z" />
      <path d="M68 111 C65 116 69 122 75 124 C77 119 76 114 68 111 Z" />

      {/* Right Wreath Leaves */}
      <path d="M165 76 C165 54 148 36 128 32" strokeWidth="2" fill="none" />
      <path d="M162 48 C169 51 171 57 167 62 C162 60 158 55 162 48 Z" />
      <path d="M154 38 C161 40 163 47 158 51 C153 48 150 43 154 38 Z" />
      <path d="M142 32 C149 33 152 39 147 44 C142 41 139 37 142 32 Z" />
      <path d="M168 64 C175 68 176 75 171 79 C166 77 163 71 168 64 Z" />
      <path d="M169 81 C174 86 174 93 169 97 C165 94 163 88 169 81 Z" />
      <path d="M164 98 C168 104 166 110 160 113 C157 109 156 103 164 98 Z" />
      <path d="M152 111 C155 116 151 122 145 124 C143 119 144 114 152 111 Z" />
    </g>

    {/* Serif Wordmark "IBAO" */}
    <text 
      x="110" 
      y="66" 
      fontFamily="Georgia, serif, 'Times New Roman'" 
      fontSize="24" 
      fontWeight="bold" 
      letterSpacing="2" 
      fill="url(#goldGradient)" 
      textAnchor="middle"
    >
      IBAO
    </text>

    {/* Greek Column Pedestal Beneath */}
    <g fill="url(#goldGradient)">
      <rect x="76" y="72" width="68" height="5" rx="1.5" />
      <rect x="80" y="79" width="60" height="3" rx="1" />
      {/* Column vertical flutes */}
      <rect x="84" y="84" width="7" height="24" rx="1" />
      <rect x="95" y="84" width="7" height="24" rx="1" />
      <rect x="106" y="84" width="8" height="24" rx="1" />
      <rect x="118" y="84" width="7" height="24" rx="1" />
      <rect x="129" y="84" width="7" height="24" rx="1" />
      {/* Base */}
      <rect x="80" y="110" width="60" height="4" rx="1" />
      <rect x="74" y="115" width="72" height="6" rx="2" />
    </g>
  </svg>
);

/**
 * 3. QABA Logo (Qualified Applied Behavior Analysis Credentialing Board)
 * Classic Navy Circular Stamp, "BEHAVIORAL HEALTH", "EST. QABA MMXII", "CREDENTIALING"
 */
export const QabaLogo: React.FC<LogoProps> = ({ className = 'h-16 w-auto' }) => (
  <svg 
    viewBox="0 0 160 160" 
    className={className}
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label="QABA Credentialing Board Logo"
  >
    {/* Outer Dotted Seal Ring */}
    <circle cx="80" cy="80" r="74" stroke="#1B3A57" strokeWidth="2.5" strokeDasharray="3 3" className="dark:stroke-sky-400" />
    <circle cx="80" cy="80" r="69" stroke="#1B3A57" strokeWidth="2" className="dark:stroke-sky-400" />

    {/* Curved Text Path: "BEHAVIORAL HEALTH" */}
    <path id="qabaTopCurve" d="M 30,80 A 50,50 0 0,1 130,80" fill="none" />
    <text className="fill-[#1B3A57] dark:fill-sky-300 text-[10px] font-bold tracking-[2px]" textAnchor="middle">
      <textPath href="#qabaTopCurve" startOffset="50%">
        BEHAVIORAL HEALTH
      </textPath>
    </text>

    {/* Middle Banner for "EST. QABA MMXII" */}
    <g className="fill-[#1B3A57] dark:fill-[#1E40AF]">
      {/* Ribbon Left/Right Wings */}
      <path d="M12 70 L28 65 L28 95 L12 90 L18 80 Z" />
      <path d="M148 70 L132 65 L132 95 L148 90 L142 80 Z" />
      {/* Center Banner Box */}
      <rect x="25" y="64" width="110" height="32" rx="3" fill="#1B3A57" className="dark:fill-[#0F2942] stroke-white dark:stroke-white/20" strokeWidth="1.5" />
    </g>

    {/* Center Text inside Ribbon: "EST. QABA MMXII" */}
    <text x="36" y="83" className="fill-white text-[7px] font-sans font-semibold tracking-wider">EST.</text>
    <text x="80" y="86" className="fill-white text-[16px] font-bold tracking-widest text-center" textAnchor="middle">QABA</text>
    <text x="110" y="83" className="fill-white text-[7px] font-sans font-semibold tracking-wider">MMXII</text>

    {/* Curved Text Path Bottom: "CREDENTIALING" */}
    <path id="qabaBottomCurve" d="M 34,80 A 48,48 0 0,0 126,80" fill="none" />
    <text className="fill-[#1B3A57] dark:fill-sky-300 text-[9px] font-bold tracking-[2.5px]" textAnchor="middle">
      <textPath href="#qabaBottomCurve" startOffset="50%">
        CREDENTIALING
      </textPath>
    </text>

    {/* Delicate bead chain detail */}
    <circle cx="80" cy="80" r="54" stroke="#1B3A57" strokeWidth="0.8" strokeDasharray="1.5 2" opacity="0.6" className="dark:stroke-sky-400" />
  </svg>
);

/**
 * 4. BACB Logo (Behavior Analyst Certification Board)
 * Global circular emblem with "BEHAVIOR ANALYST BACB CERTIFICATION BOARD"
 */
export const BacbLogo: React.FC<LogoProps> = ({ className = 'h-16 w-auto' }) => (
  <svg 
    viewBox="0 0 160 160" 
    className={className}
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label="BACB Logo"
  >
    <defs>
      <linearGradient id="bacbSilverGradient" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#94A3B8" />
        <stop offset="35%" stopColor="#CBD5E1" />
        <stop offset="70%" stopColor="#64748B" />
        <stop offset="100%" stopColor="#334155" />
      </linearGradient>
    </defs>

    {/* Outer Ring */}
    <circle cx="80" cy="80" r="74" stroke="#0F2942" strokeWidth="4.5" className="dark:stroke-slate-300" />
    <circle cx="80" cy="80" r="69" stroke="#0F2942" strokeWidth="1.2" className="dark:stroke-slate-300" />

    {/* Upper Circular Text: "BEHAVIOR ANALYST" */}
    <path id="bacbUpperPath" d="M 28,80 A 52,52 0 0,1 132,80" fill="none" />
    <text className="fill-[#0F2942] dark:fill-white text-[9.5px] font-black tracking-[2px]" textAnchor="middle">
      <textPath href="#bacbUpperPath" startOffset="50%">
        BEHAVIOR ANALYST
      </textPath>
    </text>

    {/* Two Side Star/Bullet Accents */}
    <circle cx="23" cy="80" r="2.2" fill="#0F2942" className="dark:fill-white" />
    <circle cx="137" cy="80" r="2.2" fill="#0F2942" className="dark:fill-white" />

    {/* Central Silver Swoosh / Crest */}
    <path 
      d="M 32,80 C 32,60 52,50 80,50 C 108,50 128,60 128,80 C 128,100 108,110 80,110 C 52,110 32,100 32,80 Z" 
      fill="url(#bacbSilverGradient)"
      opacity="0.25"
    />
    <path 
      d="M 36,80 C 45,62 65,58 80,58 C 105,58 124,68 124,80 C 124,92 105,102 80,102 C 60,102 42,94 36,80 Z" 
      stroke="url(#bacbSilverGradient)"
      strokeWidth="6"
      fill="none"
    />

    {/* Bold Serif "BACB" Wordmark */}
    <text 
      x="80" 
      y="88" 
      fontFamily="Georgia, serif, 'Times New Roman'" 
      fontSize="27" 
      fontWeight="900" 
      letterSpacing="1.5" 
      fill="#0F2942" 
      className="dark:fill-white"
      textAnchor="middle"
    >
      BACB
    </text>
    {/* Registered Trademark symbol */}
    <text x="127" y="70" fontSize="7" fill="#0F2942" className="dark:fill-white">®</text>

    {/* Lower Circular Text: "CERTIFICATION BOARD" */}
    <path id="bacbLowerPath" d="M 28,80 A 52,52 0 0,0 132,80" fill="none" />
    <text className="fill-[#0F2942] dark:fill-white text-[8.5px] font-black tracking-[2px]" textAnchor="middle">
      <textPath href="#bacbLowerPath" startOffset="50%">
        CERTIFICATION BOARD
      </textPath>
    </text>
  </svg>
);

/**
 * 5. Council of Health Insurance (مجلس الضمان الصحي - ضمان) Logo
 * Authentic calligraphy "ضمان" + "مجلس الضمان الصحي Council of Health Insurance"
 */
export const DamanLogo: React.FC<LogoProps> = ({ className = 'h-16 w-auto' }) => (
  <svg 
    viewBox="0 0 240 120" 
    className={className}
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label="Council of Health Insurance Daman Logo"
  >
    {/* Calligraphic wordmark "ضمان" */}
    <g className="fill-[#00779E] dark:fill-[#38BDF8]">
      {/* Letter Dhad (ض) */}
      <path d="M52 48 C60 40 76 38 88 44 C98 49 100 58 92 63 C82 70 58 70 42 66 C40 60 44 53 52 48 Z M58 53 C52 57 58 63 68 63 C78 63 84 58 84 53 C84 48 76 46 68 47 C62 47 59 50 58 53 Z" />
      {/* Dot for Dhad */}
      <circle cx="86" cy="32" r="4.5" />

      {/* Letter Meem (م) */}
      <path d="M106 58 C106 48 116 42 126 44 C134 46 137 54 133 60 C128 66 114 66 106 63 Z M116 51 C112 53 113 58 118 58 C124 58 126 54 124 51 C122 48 118 49 116 51 Z" />

      {/* Letter Alif (ا) */}
      <rect x="144" y="24" width="7.5" height="42" rx="3.5" />

      {/* Letter Noon (ن) */}
      <path d="M162 48 C162 65 174 72 188 72 C202 72 214 64 214 48 L206 48 C206 59 198 65 188 65 C178 65 170 59 170 48 Z" />
      {/* Dot for Noon */}
      <circle cx="188" cy="46" r="4.5" />
    </g>

    {/* Arabic text: "مجلس الضمان الصحي" */}
    <text 
      x="130" 
      y="88" 
      fontFamily="system-ui, -apple-system, sans-serif" 
      fontSize="13" 
      fontWeight="bold" 
      fill="#0B3B36" 
      className="dark:fill-slate-100" 
      textAnchor="middle"
    >
      مجلس الضمان الصحي
    </text>

    {/* English text: "Council of Health Insurance" */}
    <text 
      x="130" 
      y="102" 
      fontFamily="system-ui, -apple-system, sans-serif" 
      fontSize="8.5" 
      fontWeight="600" 
      letterSpacing="0.4"
      fill="#00779E" 
      className="dark:fill-sky-400" 
      textAnchor="middle"
    >
      Council of Health Insurance
    </text>
  </svg>
);

/**
 * 6. CBAHI Logo (المركز السعودي لاعتماد المنشآت الصحية)
 * The iconic 4-color overlapping circular loop + "CBAHI" + bilingual title
 */
export const CbahiLogo: React.FC<LogoProps> = ({ className = 'h-16 w-auto' }) => (
  <svg 
    viewBox="0 0 240 120" 
    className={className}
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label="CBAHI Logo"
  >
    {/* Iconic 4-Color Circular Logo Ring */}
    <g transform="translate(36, 50)">
      {/* Top arc (Blue/Teal) */}
      <path d="M0 -22 A 22 22 0 0 1 22 0 L 16 0 A 16 16 0 0 0 0 -16 Z" fill="#007E8A" />
      {/* Right arc (Orange/Gold) */}
      <path d="M22 0 A 22 22 0 0 1 0 22 L 0 16 A 16 16 0 0 0 16 0 Z" fill="#F47920" />
      {/* Bottom arc (Red/Crimson) */}
      <path d="M0 22 A 22 22 0 0 1 -22 0 L -16 0 A 16 16 0 0 0 0 16 Z" fill="#E41F26" />
      {/* Left arc (Green/Emerald) */}
      <path d="M -22 0 A 22 22 0 0 1 0 -22 L 0 -16 A 16 16 0 0 0 -16 0 Z" fill="#009A44" />
      {/* Inner center dot */}
      <circle cx="0" cy="0" r="7" fill="#0B3B36" className="dark:fill-white" />
    </g>

    {/* Bold Typography "CBAHI" */}
    <text 
      x="80" 
      y="54" 
      fontFamily="system-ui, -apple-system, sans-serif" 
      fontSize="24" 
      fontWeight="900" 
      letterSpacing="1"
      fill="#007E8A" 
      className="dark:fill-[#2DD4BF]"
    >
      CBAHI
    </text>

    {/* Arabic text: "المركز السعودي لاعتماد المنشآت الصحية" */}
    <text 
      x="80" 
      y="70" 
      fontFamily="system-ui, -apple-system, sans-serif" 
      fontSize="8.5" 
      fontWeight="bold" 
      fill="#1E293B" 
      className="dark:fill-slate-200"
    >
      المركز السعودي لاعتماد المنشآت الصحية
    </text>

    {/* English text: "Saudi Central Board for Accreditation of Healthcare Institutions" */}
    <text 
      x="80" 
      y="81" 
      fontFamily="system-ui, -apple-system, sans-serif" 
      fontSize="5.5" 
      fontWeight="500" 
      fill="#64748B" 
      className="dark:fill-slate-400"
    >
      Saudi Central Board for Accreditation of Healthcare Institutions
    </text>
  </svg>
);
