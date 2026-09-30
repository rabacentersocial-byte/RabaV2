import React from 'react';

interface SiwarBraceletIconProps {
  className?: string;
  size?: number;
  variant?: 'outline' | 'filled' | 'ornate';
}

/**
 * Custom SVG Icon representing "سِوار" (The Protective Inclusion Bracelet)
 * Features an elegant interlinked pearl/beaded ring with an emblematic safety charm.
 */
export const SiwarBraceletIcon: React.FC<SiwarBraceletIconProps> = ({ 
  className = "w-5 h-5", 
  size = 20,
  variant = 'ornate'
}) => {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className} 
      width={size} 
      height={size}
      aria-hidden="true"
    >
      {/* Outer subtle glow ring */}
      <ellipse 
        cx="12" 
        cy="11.5" 
        rx="8.5" 
        ry="6" 
        stroke="currentColor" 
        strokeWidth="0.8" 
        strokeOpacity="0.35" 
      />

      {/* Main interlinked bracelet chain band */}
      <ellipse 
        cx="12" 
        cy="11.5" 
        rx="7.5" 
        ry="5" 
        stroke="currentColor" 
        strokeWidth="1.6" 
        strokeDasharray="2.5 2"
        strokeLinecap="round" 
      />

      {/* Connected bracelet beads / pearls along circumference */}
      <circle cx="12" cy="6.5" r="1.5" fill="currentColor" />
      <circle cx="15.8" cy="7.8" r="1.3" fill="currentColor" />
      <circle cx="19" cy="11.5" r="1.5" fill="currentColor" />
      <circle cx="16.5" cy="15" r="1.3" fill="currentColor" />
      <circle cx="13.8" cy="16.3" r="1.3" fill="currentColor" />

      <circle cx="8.2" cy="7.8" r="1.3" fill="currentColor" />
      <circle cx="5" cy="11.5" r="1.5" fill="currentColor" />
      <circle cx="7.5" cy="15" r="1.3" fill="currentColor" />
      <circle cx="10.2" cy="16.3" r="1.3" fill="currentColor" />

      {/* Hanging Heart / Shield Charm (سِوار الأمان والاحتواء) */}
      <path 
        d="M12 16.5 V 19" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
      />
      <path 
        d="M12 19 C10.8 17.8 9.2 18.5 9.2 19.8 C9.2 21.2 12 22.8 12 22.8 C12 22.8 14.8 21.2 14.8 19.8 C14.8 17.8 13.2 17.8 12 19 Z" 
        fill="currentColor" 
      />
    </svg>
  );
};

export default SiwarBraceletIcon;
