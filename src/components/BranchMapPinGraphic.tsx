import React from 'react';

interface BranchMapPinGraphicProps {
  branchName?: string;
  className?: string;
}

export const BranchMapPinGraphic: React.FC<BranchMapPinGraphicProps> = ({ branchName = '', className = '' }) => {
  return (
    <div className={`relative w-full h-full min-h-[200px] flex items-center justify-center overflow-hidden select-none ${className}`}>
      {/* Background radial gradient & ambient bokeh lighting */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1a2c3d] via-[#10202e] to-[#0b141d]" />
      
      {/* Subtle bokeh circles */}
      <div className="absolute top-4 left-6 w-16 h-16 rounded-full bg-cyan-400/10 blur-xl pointer-events-none" />
      <div className="absolute top-8 right-8 w-20 h-20 rounded-full bg-blue-300/10 blur-2xl pointer-events-none" />
      <div className="absolute bottom-6 left-1/3 w-28 h-28 rounded-full bg-teal-400/10 blur-2xl pointer-events-none" />

      {/* SVG 3D Isometric Map and Pin */}
      <svg 
        viewBox="0 0 400 320" 
        className="relative z-10 w-full h-full max-h-[220px] object-contain drop-shadow-2xl"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
      >
        <defs>
          {/* Shadow filters */}
          <filter id="pin-shadow" x="-30%" y="-20%" width="160%" height="160%">
            <feDropShadow dx="0" dy="14" stdDeviation="12" floodColor="#000000" floodOpacity="0.55" />
          </filter>
          <filter id="map-shadow" x="-10%" y="-10%" width="120%" height="130%">
            <feDropShadow dx="0" dy="16" stdDeviation="14" floodColor="#050d14" floodOpacity="0.65" />
          </filter>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          {/* Gradients */}
          <linearGradient id="pinOuterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FB7185" />
            <stop offset="35%" stopColor="#F43F5E" />
            <stop offset="70%" stopColor="#E11D48" />
            <stop offset="100%" stopColor="#BE123C" />
          </linearGradient>

          <linearGradient id="pinGleam" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.45" />
            <stop offset="60%" stopColor="#ffffff" stopOpacity="0.0" />
          </linearGradient>

          <linearGradient id="mapFold1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#e2e8f0" />
            <stop offset="100%" stopColor="#cbd5e1" />
          </linearGradient>
          <linearGradient id="mapFold2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f8fafc" />
            <stop offset="100%" stopColor="#e2e8f0" />
          </linearGradient>
          <linearGradient id="mapFold3" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#cbd5e1" />
            <stop offset="100%" stopColor="#94a3b8" />
          </linearGradient>
          <linearGradient id="mapFold4" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f1f5f9" />
            <stop offset="100%" stopColor="#cbd5e1" />
          </linearGradient>
        </defs>

        {/* 1. Folded Paper Map in Isometric Perspective */}
        <g filter="url(#map-shadow)" transform="translate(0, 10)">
          {/* Fold 1 (Leftmost) */}
          <polygon points="50,225 125,200 125,245 50,265" fill="url(#mapFold1)" />
          {/* Fold 2 */}
          <polygon points="125,200 200,215 200,260 125,245" fill="url(#mapFold2)" />
          {/* Fold 3 */}
          <polygon points="200,215 275,198 275,242 200,260" fill="url(#mapFold3)" />
          {/* Fold 4 (Rightmost) */}
          <polygon points="275,198 350,220 350,255 275,242" fill="url(#mapFold4)" />

          {/* Map Roads & Features */}
          {/* Roads on Fold 1 */}
          <path d="M 65,228 Q 90,212 125,210" stroke="#f59e0b" strokeWidth="4" fill="none" opacity="0.85" />
          <path d="M 80,245 L 125,225" stroke="#38bdf8" strokeWidth="3" fill="none" opacity="0.8" />
          <rect x="70" y="240" width="20" height="10" transform="skewY(-15)" fill="#10b981" opacity="0.6" rx="2" />

          {/* Roads on Fold 2 */}
          <path d="M 125,210 Q 160,212 200,225" stroke="#f59e0b" strokeWidth="4" fill="none" opacity="0.85" />
          <path d="M 125,225 Q 165,230 200,240" stroke="#38bdf8" strokeWidth="3" fill="none" opacity="0.8" />
          <path d="M 155,206 L 175,255" stroke="#ffffff" strokeWidth="3" strokeDasharray="3,2" fill="none" opacity="0.9" />

          {/* Roads on Fold 3 */}
          <path d="M 200,225 Q 240,215 275,208" stroke="#f59e0b" strokeWidth="4" fill="none" opacity="0.85" />
          <path d="M 200,240 Q 235,230 275,220" stroke="#38bdf8" strokeWidth="3" fill="none" opacity="0.8" />
          <rect x="220" y="220" width="24" height="12" transform="skewY(10)" fill="#10b981" opacity="0.6" rx="2" />

          {/* Roads on Fold 4 */}
          <path d="M 275,208 Q 310,212 340,230" stroke="#f59e0b" strokeWidth="4" fill="none" opacity="0.85" />
          <path d="M 275,220 L 335,245" stroke="#ffffff" strokeWidth="2.5" fill="none" opacity="0.8" />

          {/* Target Bullseye on the map under the pin */}
          <ellipse cx="200" cy="245" rx="42" ry="14" fill="#E11D48" opacity="0.3" />
          <ellipse cx="200" cy="245" rx="34" ry="11" fill="none" stroke="#ffffff" strokeWidth="2" opacity="0.85" />
          <ellipse cx="200" cy="245" rx="24" ry="8" fill="#E11D48" opacity="0.6" />
          <ellipse cx="200" cy="245" rx="14" ry="5" fill="none" stroke="#ffffff" strokeWidth="2" />
          <ellipse cx="200" cy="245" rx="6" ry="2.5" fill="#E11D48" />

          {/* Pin Contact Shadow */}
          <ellipse cx="200" cy="244" rx="18" ry="6" fill="#000000" opacity="0.75" />
        </g>

        {/* 2. Upright 3D Location Marker Pin */}
        <g filter="url(#pin-shadow)">
          {/* Main Pin Teardrop Body */}
          <path 
            d="
              M 200,238 
              C 188,215 138,155 138,105 
              C 138,62 166,30 200,30 
              C 234,30 262,62 262,105 
              C 262,155 212,215 200,238 
              Z
            " 
            fill="url(#pinOuterGrad)" 
            stroke="#ffffff"
            strokeWidth="3"
            strokeLinejoin="round"
          />

          {/* Glossy highlight gleam on the pin top */}
          <path 
            d="
              M 144,95 
              C 144,65 168,36 200,36 
              C 232,36 256,65 256,95 
              C 256,80 232,55 200,55 
              C 168,55 144,80 144,95 
              Z
            " 
            fill="url(#pinGleam)" 
          />

          {/* Inner White Badge / Face */}
          <circle cx="200" cy="105" r="48" fill="#ffffff" stroke="#f1f5f9" strokeWidth="2" />

          {/* Inner soft border shadow */}
          <circle cx="200" cy="105" r="46" fill="none" stroke="#e2e8f0" strokeWidth="1.5" />

          {/* RABA Official Puzzle Brain Graphic (Miniaturized & Crisp) */}
          <g transform="translate(182, 68) scale(0.125)">
            {/* 1. Sky Blue */}
            <path 
              fill="#008CD3" 
              stroke="#ffffff" 
              strokeWidth="5"
              d="M 200 45 C 152 44, 114 62, 88 98 C 72 118, 68 138, 72 156 C 76 172, 90 182, 106 182 C 118 182, 126 174, 134 168 C 142 162, 154 164, 160 174 C 166 184, 160 196, 150 200 L 142 202 C 152 216, 172 220, 186 214 C 192 208, 194 198, 190 188 C 186 178, 192 168, 204 168 C 216 168, 224 178, 222 190 L 220 206 L 218 126 C 218 114, 224 104, 236 104 C 248 104, 254 114, 254 126 C 254 138, 246 148, 234 148 L 204 148 L 200 45 Z" 
            />
            {/* 2. Amber / Orange */}
            <path 
              fill="#F8A51D" 
              stroke="#ffffff" 
              strokeWidth="5"
              d="M 200 45 L 204 148 L 234 148 C 246 148, 254 138, 254 126 C 254 114, 248 104, 236 104 C 224 104, 218 114, 218 126 L 220 206 L 242 206 C 244 194, 254 184, 268 184 C 282 184, 290 196, 288 210 C 286 224, 274 232, 260 230 L 250 230 C 264 246, 286 250, 308 244 C 328 234, 338 216, 334 194 C 342 180, 344 160, 338 140 C 330 110, 310 82, 280 64 C 256 50, 228 44, 200 45 Z" 
            />
            {/* 3. Green */}
            <path 
              fill="#00B050" 
              stroke="#ffffff" 
              strokeWidth="5"
              d="M 72 156 C 68 174, 70 196, 78 214 C 90 240, 114 260, 142 268 C 156 272, 170 270, 180 262 L 176 250 C 168 250, 158 244, 156 234 C 154 224, 162 214, 172 212 C 182 210, 192 216, 194 226 L 194 246 C 202 242, 210 234, 214 224 L 220 206 L 186 214 C 172 220, 152 216, 142 202 L 150 200 C 160 196, 166 184, 160 174 C 154 164, 142 162, 134 168 C 126 174, 118 182, 106 182 C 90 182, 76 172, 72 156 Z" 
            />
            {/* 4. Magenta */}
            <path 
              fill="#E5007D" 
              stroke="#ffffff" 
              strokeWidth="5"
              d="M 220 206 L 242 206 C 244 194, 254 184, 268 184 C 282 184, 290 196, 288 210 C 286 224, 274 232, 260 230 L 250 230 C 264 246, 286 250, 308 244 C 316 260, 310 280, 294 294 C 278 308, 254 314, 234 308 C 220 304, 210 294, 204 282 L 194 282 C 190 292, 180 298, 168 296 C 158 294, 150 284, 152 274 C 154 264, 164 258, 174 260 L 180 262 L 194 246 C 202 242, 210 234, 214 224 L 220 206 Z" 
            />
            {/* 5. Stem Yellow */}
            <path 
              fill="#FDE047" 
              stroke="#ffffff" 
              strokeWidth="5"
              d="M 176 250 C 168 250, 158 244, 156 234 C 154 224, 162 214, 172 212 C 182 210, 192 216, 194 226 L 194 282 C 190 292, 180 298, 168 296 C 158 294, 150 284, 152 274 C 154 264, 164 258, 174 260 L 180 262 C 180 284, 174 308, 166 326 C 160 338, 152 344, 144 340 C 136 336, 138 322, 142 312 C 146 302, 142 292, 134 288 C 126 284, 116 290, 114 300 C 112 314, 122 328, 136 338 C 142 344, 140 354, 132 360 C 124 366, 112 364, 108 354 C 100 334, 106 312, 118 292 C 128 276, 142 268, 156 268 L 176 250 Z" 
            />
          </g>

          {/* RABA Official Typography */}
          <text 
            x="200" 
            y="120" 
            textAnchor="middle" 
            fill="#008CD3" 
            fontSize="12" 
            fontWeight="700" 
            fontFamily="system-ui, -apple-system, sans-serif"
            letterSpacing="2.5"
          >
            RABA
          </text>
          <text 
            x="200" 
            y="134" 
            textAnchor="middle" 
            fill="#E5007D" 
            fontSize="10" 
            fontWeight="700" 
            fontFamily="system-ui, -apple-system, sans-serif"
          >
            مركز رابا
          </text>
        </g>
      </svg>

      {/* Decorative Glow on Floor */}
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-48 h-12 bg-pink-500/15 blur-2xl rounded-full pointer-events-none" />
    </div>
  );
};
