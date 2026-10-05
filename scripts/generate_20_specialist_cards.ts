import fs from 'fs';
import path from 'path';

interface CardData {
  filename: string;
  name: string;
  title: string;
  gender: 'male' | 'female' | 'female_niqab';
  badgeColor: string;
  badgeTextColor: string;
  bullets: string[];
}

const CARDS: CardData[] = [
  {
    filename: 'spec_33_ahlam-noaman.svg',
    name: 'أحلام النعمان',
    title: 'أخصائية النطق والتخاطب',
    gender: 'female_niqab',
    badgeColor: '#0ea5e9',
    badgeTextColor: '#ffffff',
    bullets: [
      'حاصلة على درجة البكالوريوس من جامعة عين شمس',
      'حاصلة على دبلوم التوحد من جامعة القاهرة',
      'حاصلة على دبلومة التربية الخاصة من جامعة القاهرة',
      'حاصلة على دبلومة صعوبات التعلم من جامعة القاهرة',
      'حاصلة على دبلومة إعداد أخصائي تربية خاصة',
      'حاصلة على دورة تخصصية في العلاج الحركي اللمسي للنطق والكلام OPT',
      'حاصلة على ترخيص الهيئة السعودية للتخصصات الصحية',
      'خبرة عملية أكثر من ١٧ سنة'
    ]
  },
  {
    filename: 'spec_35_karim-ragab.svg',
    name: 'كريم رجب',
    title: 'أخصائي النطق والتخاطب',
    gender: 'male',
    badgeColor: '#0ea5e9',
    badgeTextColor: '#ffffff',
    bullets: [
      'حاصل على بكالوريوس العلوم في التربية الخاصة من جامعة مصر للعلوم',
      'حاصل على دبلومة التخاطب لمدة عام من مركز الإشراق الطبي',
      'حاصل على دبلومة التخاطب من جامعة الأزهر',
      'حاصل على شهادة ٤٠ ساعة لفني تحليل السلوك التطبيقي',
      'خبرة عملية أكثر من ٣ سنوات'
    ]
  },
  {
    filename: 'spec_36_reema-hussaini.svg',
    name: 'ريمه الحسيني',
    title: 'أخصائية نفسية',
    gender: 'female_niqab',
    badgeColor: '#8b5cf6',
    badgeTextColor: '#ffffff',
    bullets: [
      'حاصلة على بكالوريوس علم النفس من جامعة الإمام محمد بن سعود الإسلامية',
      'حاصلة على شهادة مشرف توحد ممارس QASP-S من منظمة QABA',
      'حاصلة على تصنيف مهني من الهيئة السعودية للتخصصات الصحية',
      'خبرة أكثر من ١٠ سنوات'
    ]
  },
  {
    filename: 'spec_37_tasneem-abdelaziz.svg',
    name: 'تسنيم عبدالعزيز',
    title: 'اخصائية ABA',
    gender: 'female',
    badgeColor: '#10b981',
    badgeTextColor: '#ffffff',
    bullets: [
      'حاصلة على بكالوريوس العلوم الصحية من جامعة الرباط الوطني',
      'حاصلة على رخصة ABAT من البورد الامريكي QABA',
      'حاصلة على دورة أسس التشخيص والعلاج للإضطرابات النفسية بمركز مطمئنة',
      'خبرة عملية أكثر من ١٠ سنوات'
    ]
  },
  {
    filename: 'spec_39_sultan-shaye.svg',
    name: 'سلطان الشايع',
    title: 'أخصائي العلاج الوظيفي',
    gender: 'male',
    badgeColor: '#f59e0b',
    badgeTextColor: '#ffffff',
    bullets: [
      'حاصل على بكالوريوس العلوم التطبيقيه من جامعة الملك سعود تخصص علاج وظيفي',
      'خبرة أكثر من ٣ سنوات'
    ]
  },
  {
    filename: 'spec_41_hossam-samy.svg',
    name: 'حسام سامي',
    title: 'أخصائي النطق والتخاطب',
    gender: 'male',
    badgeColor: '#0ea5e9',
    badgeTextColor: '#ffffff',
    bullets: [
      'حاصل علي بكالوريوس العلوم في التربيه الخاصه من جامعة مصر للعلوم',
      'حاصل علي دبلومة مهنية في إضطرابات التواصل من جامعة القاهرة',
      'حاصل علي دبلومه خاصه في التربية الخاصة من جامعة القاهرة',
      'خبرة عملية أكثر من ٧ سنوات'
    ]
  },
  {
    filename: 'spec_42_haitham-zaidan.svg',
    name: 'هيثم الزيدان',
    title: 'أخصائي ABA',
    gender: 'male',
    badgeColor: '#10b981',
    badgeTextColor: '#ffffff',
    bullets: [
      'حاصل على بكالوريوس علم النفس من جامعه الإمام محمد بن سعود الاسلامية',
      'حاصل على شهادة فني تحليل سلوك تطبيقي ABAT',
      'خبرة عملية أكثر من سنة'
    ]
  },
  {
    filename: 'spec_44_jawaher-ibrahim.svg',
    name: 'جواهر إبراهيم',
    title: 'أخصائية نفسية',
    gender: 'female_niqab',
    badgeColor: '#8b5cf6',
    badgeTextColor: '#ffffff',
    bullets: [
      'حاصلة على بكالوريوس علم النفس من جامعة الملك سعود',
      'مصنفة من الهيئة السعودية للتخصصات الصحية كأخصائية نفسية',
      'حاصلة على شهادة ABAT في تحليل السلوك التطبيقي',
      'حاصلة على دورة ABAT لمدة 40 ساعة',
      'حاصلة على دورات في العلاج المعرفي السلوكي CBT',
      'خبرة عملية أكثر من ٣ سنوات'
    ]
  },
  {
    filename: 'spec_45_mayar-saeed.svg',
    name: 'ميار السعيد',
    title: 'أخصائية النطق والتخاطب',
    gender: 'female_niqab',
    badgeColor: '#0ea5e9',
    badgeTextColor: '#ffffff',
    bullets: [
      'حاصلة على بكالوريوس التربيه الخاصه تخصص إعاقة عقلية من جامعة الإمام',
      'حاصلة على دوره نطق وتخاطب ٧٠ ساعه من أكادمية علم النفس',
      'خبرة عملية أكثر من ٧ سنوات'
    ]
  },
  {
    filename: 'spec_46_shaimaa-adel.svg',
    name: 'شيماء عادل',
    title: 'أخصائية النطق والتخاطب',
    gender: 'female',
    badgeColor: '#0ea5e9',
    badgeTextColor: '#ffffff',
    bullets: [
      'حاصلة على درجة البكالوريوس من جامعة الإسكندرية',
      'حاصلة على دراسات عليا علوم إعاقة مسار اضطرابات نطق وتخاطب من جامعة الزقازيق',
      'حاصلة على الرخصة المهنية في النطق والتخاطب من هيئة التقويم والقياس',
      'حاصلة على رخصة مشرف توحد سلوكي معتمد دولياً QASP-S',
      'خبرة عملية أكثر من ١٨ سنة'
    ]
  },
  {
    filename: 'spec_47_ghalib-otaibi.svg',
    name: 'غالب العتيبي',
    title: 'أخصائي ABA',
    gender: 'male',
    badgeColor: '#10b981',
    badgeTextColor: '#ffffff',
    bullets: [
      'حاصل على بكالوريوس علم النفس من جامعة الإمام محمد بن سعود الاسلامية',
      'حاصل على دورات في إختبارات الذكاء للأطفال',
      'معتمد كأخصائي تحليل سلوك تطبيقي من QABA',
      'مصنف من الهيئة السعوديه للتخصصات الصحيه',
      'خبرة عملية أكثر من سنتين'
    ]
  },
  {
    filename: 'spec_48_atheer-alrasheed.svg',
    name: 'اثير آل رشيد',
    title: 'أخصائية ABA',
    gender: 'female_niqab',
    badgeColor: '#10b981',
    badgeTextColor: '#ffffff',
    bullets: [
      'حاصلة على بكالوريوس علم النفس من جامعة الإمام محمد بن سعود الاسلامية',
      'حاصلة على تصنيف هيئة التخصصات الصحيه',
      'حاصلة على رخصة ABAT فني تحليل سلوك تطبيقي',
      'حاصلة على دورة فعالية العلاج الطبي ومدى تاثيره على ذوي إضطرابات طيف التوحد',
      'خبرة عملية أكثر من ٣ سنوات'
    ]
  },
  {
    filename: 'spec_49_khaled-harbi.svg',
    name: 'خالد الحربي',
    title: 'أخصائي ABA',
    gender: 'male',
    badgeColor: '#10b981',
    badgeTextColor: '#ffffff',
    bullets: [
      'حاصل على بكالوريوس علم النفس الإكلينيكي من جامعة الملك سعود',
      'حاصل على رخصة ABAT فني تحليل سلوك تطبيقي',
      'حاصل على رخصة اخصائي نفسي مساعد من هيئة التخصصات الصحية',
      'خبرة عملية أكثر من سنتين'
    ]
  },
  {
    filename: 'spec_51_marwa-alsharif.svg',
    name: 'مروة الشريف',
    title: 'مشرفة أكاديمية',
    gender: 'female',
    badgeColor: '#0ea5e9',
    badgeTextColor: '#ffffff',
    bullets: [
      'حاصلة على بكالوريوس التربية الخاصة من المعهد العالي للتربية المختصة',
      'حاصلة على دورة في التعامل مع أطفال طيف التوحد',
      'خبرة عملية أكثر من ٤ سنوات'
    ]
  },
  {
    filename: 'spec_52_hala-badran.svg',
    name: 'هالة بدران',
    title: 'أخصائية النطق والتخاطب',
    gender: 'female',
    badgeColor: '#0ea5e9',
    badgeTextColor: '#ffffff',
    bullets: [
      'حاصلة علي ليسانس آداب علم النفس من جامعة الزقازيق',
      'حاصلة علي ماجستير في التوحد من جامعة الزقازيق',
      'حاصلة علي دبلومة مهنية تخصص نطق وتواصل من جامعة عين شمس',
      'حاصلة علي دبلومة تدريبية في النطق والتخاطب من جامعة عين شمس',
      'حاصلة علي دبلومة في علم النفس الإكلينكي من جامعة بنها',
      'خبرة عملية أكثر من ٢٠ سنة'
    ]
  },
  {
    filename: 'spec_53_hend-alsayed.svg',
    name: 'هند السيد',
    title: 'أخصائية النطق والتخاطب',
    gender: 'female',
    badgeColor: '#0ea5e9',
    badgeTextColor: '#ffffff',
    bullets: [
      'حاصلة على درجة البكالوريوس من جامعة القاهرة',
      'حاصلة على دبلوم عام تربوي من جامعة طنطا',
      'حاصلة على دبلومة تخاطب ٣٠٠ ساعة من جامعة عين شمس',
      'حاصلة على دبلومة في التوحد من جامعة عين شمس',
      'حاصلة على دبلومة صعوبات تعلم مع د/لبنى الشرقاوى',
      'خبرة عملية أكثر من ١٢ سنة'
    ]
  },
  {
    filename: 'spec_54_tasneem-sabry.svg',
    name: 'د. تسنيم صبري',
    title: 'مشرفة قسم الـ ABA',
    gender: 'female',
    badgeColor: '#10b981',
    badgeTextColor: '#ffffff',
    bullets: [
      'حاصلة على بكالوريوس التربية والتربية الخاصة من جامعة قناة السويس',
      'حاصلة على الماجستير المهني من جامعة القاهرة',
      'حاصلة على الدكتوراه المهني من جامعة القاهرة',
      'حاصلة على دبلوم التوحد وإضطرابات النطق من الجامعه الامريكية',
      'حاصلة على دبلوم صعوبات التعلم والعلاج الوظيفي من الجامعة الامريكية',
      'حاصلة على إعتماد في تحليل السلوك التطبيقي من QABA',
      'خبرة عملية أكثر من ٨ سنوات'
    ]
  },
  {
    filename: 'spec_55_mostafa-mahmoud.svg',
    name: 'مصطفى محمود',
    title: 'أخصائي ABA',
    gender: 'male',
    badgeColor: '#10b981',
    badgeTextColor: '#ffffff',
    bullets: [
      'حاصل علي درجة الـ ليسانس من جامعة أسيوط',
      'حاصل علي اعتماد ABAT من البورد الأمريكي كفني تحليل سلوك تطبيقي',
      'حاصل على اعتماد QASP-S كمشرف خدمات توحد معتمد من البورد الأمريكي',
      'حاصل على VB-MAPP برنامج تقييم معالم تطور السلوك اللفظي',
      'خبرة عملية أكثر من ٤ سنوات'
    ]
  },
  {
    filename: 'spec_58_alaa-nagy.svg',
    name: 'علاء الدين ناجي',
    title: 'أخصائي ABA',
    gender: 'male',
    badgeColor: '#10b981',
    badgeTextColor: '#ffffff',
    bullets: [
      'حاصل على ليسانس آداب وتربية قسم تربية خاصة من جامعة العريش',
      'حاصل على دبلومة مهنية في التربية الخاصة من جامعة العريش',
      'حاصل على إعتماد البورد الأمريكي ABAT',
      'خبرة عملية أكثر من ٨ سنوات'
    ]
  },
  {
    filename: 'spec_59_abdelilah-shaql.svg',
    name: 'عبدالاله شقل',
    title: 'أخصائي العلاج الوظيفي',
    gender: 'male',
    badgeColor: '#f59e0b',
    badgeTextColor: '#ffffff',
    bullets: [
      'حاصل على بكالوريوس العلاج الوظيفي من جامعة الملك سعود بن عبدالعزيز للعلوم الصحية',
      'حاصل على شهادة Floortime 101',
      'حاصل على ترخيص الهيئة السعودية للتخصصات الصحية',
      'متخصص في علاج المشاكل الحسية والتحديات النمائية لدى الاطفال ومشاكل الأكل',
      'خبرة عملية أكثر من ٣ سنوات'
    ]
  }
];

function generateSvgCard(card: CardData): string {
  const avatarPath = card.gender === 'male'
    ? `
      <!-- Male Specialist Portrait Vector -->
      <circle cx="337" cy="270" r="145" fill="#f1f5f9"/>
      <path d="M290 200 Q337 170 385 200 Q385 240 337 265 Q290 240 290 200 Z" fill="#292524"/>
      <circle cx="337" cy="235" r="48" fill="#fcd34d"/>
      <path d="M305 240 Q337 255 370 240 Q370 270 337 275 Q305 270 305 240 Z" fill="#1c1917" opacity="0.3"/>
      <!-- Lab Coat -->
      <path d="M245 415 Q265 295 337 295 Q410 295 430 415 Z" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/>
      <path d="M315 295 L337 360 L360 295 Z" fill="#0284c7"/>
      <path d="M300 310 L337 415 L375 310" stroke="#94a3b8" stroke-width="2" fill="none"/>
    `
    : card.gender === 'female_niqab'
    ? `
      <!-- Female Specialist in Niqab -->
      <circle cx="337" cy="270" r="145" fill="#f1f5f9"/>
      <!-- Black Headscarf & Niqab -->
      <path d="M260 200 Q337 150 415 200 Q430 330 337 350 Q245 330 260 200 Z" fill="#18181b"/>
      <!-- Eye opening -->
      <ellipse cx="337" cy="225" rx="42" ry="12" fill="#fcd34d"/>
      <ellipse cx="320" cy="225" rx="7" ry="5" fill="#18181b"/>
      <ellipse cx="355" cy="225" rx="7" ry="5" fill="#18181b"/>
      <!-- White Coat -->
      <path d="M245 415 Q265 315 337 315 Q410 315 430 415 Z" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/>
    `
    : `
      <!-- Female Specialist in Hijab -->
      <circle cx="337" cy="270" r="145" fill="#f1f5f9"/>
      <!-- Hijab -->
      <path d="M270 190 Q337 155 405 190 Q425 320 337 340 Q250 320 270 190 Z" fill="#18181b"/>
      <ellipse cx="337" cy="235" rx="42" ry="48" fill="#fcd34d"/>
      <ellipse cx="322" cy="230" rx="5" ry="4" fill="#18181b"/>
      <ellipse cx="352" cy="230" rx="5" ry="4" fill="#18181b"/>
      <path d="M327 255 Q337 265 347 255" stroke="#be185d" stroke-width="3" fill="none" stroke-linecap="round"/>
      <!-- White Coat -->
      <path d="M245 415 Q265 315 337 315 Q410 315 430 415 Z" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/>
    `;

  const bulletsSvg = card.bullets.map((b, i) => {
    const y = 620 + i * 28;
    return `
      <g>
        <circle cx="585" cy="${y - 5}" r="3.5" fill="#ffffff"/>
        <text x="568" y="${y}" font-family="system-ui, -apple-system, sans-serif" font-size="14.5" font-weight="600" fill="#ffffff" text-anchor="start" direction="rtl">${b}</text>
      </g>
    `;
  }).join('\n');

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 675 900" width="675" height="900" direction="rtl">
  <defs>
    <!-- Background Gradients -->
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#f8fafc"/>
      <stop offset="100%" stop-color="#edf2f7"/>
    </linearGradient>
    <linearGradient id="cardGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#0284c7"/>
      <stop offset="35%" stop-color="#0369a1"/>
      <stop offset="100%" stop-color="#0c4a6e"/>
    </linearGradient>
    <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#00E5BE"/>
      <stop offset="50%" stop-color="#ec4899"/>
      <stop offset="100%" stop-color="#38bdf8"/>
    </linearGradient>
    <!-- Grid pattern -->
    <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
      <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#cbd5e1" stroke-width="0.75" opacity="0.6"/>
    </pattern>
    <filter id="cardShadow" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="0" dy="16" stdDeviation="20" flood-color="#0f172a" flood-opacity="0.25"/>
    </filter>
  </defs>

  <!-- Background Canvas -->
  <rect width="675" height="900" fill="url(#bgGrad)"/>
  <rect width="675" height="900" fill="url(#grid)"/>

  <!-- Logo Top Left -->
  <g transform="translate(60, 48)">
    <circle cx="36" cy="18" r="16" fill="#00E5BE"/>
    <circle cx="48" cy="28" r="14" fill="#3b82f6"/>
    <circle cx="24" cy="32" r="14" fill="#ec4899"/>
    <circle cx="36" cy="42" r="12" fill="#eab308"/>
    <text x="36" y="74" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="18" fill="#0284c7" text-anchor="middle" letter-spacing="2">RABA</text>
    <text x="36" y="92" font-family="system-ui, -apple-system, sans-serif" font-weight="800" font-size="14" fill="#0284c7" text-anchor="middle">مركز رابا</text>
    <text x="36" y="105" font-family="system-ui, -apple-system, sans-serif" font-weight="600" font-size="7.5" fill="#64748b" text-anchor="middle">للعلاج بتحليل السلوك التطبيقي</text>
  </g>

  <!-- Main Card Body -->
  <g filter="url(#cardShadow)">
    <rect x="75" y="235" width="525" height="570" rx="36" fill="url(#cardGrad)"/>
  </g>

  <!-- Decorative Waves in Card Upper Area -->
  <g opacity="0.18" transform="translate(75, 275)">
    <path d="M 0 30 Q 30 10, 60 30 T 120 30 T 180 30 T 240 30 T 300 30 T 360 30 T 420 30 T 480 30 T 525 30" fill="none" stroke="#ffffff" stroke-width="4"/>
    <path d="M 0 50 Q 30 30, 60 50 T 120 50 T 180 50 T 240 50 T 300 50 T 360 50 T 420 50 T 480 50 T 525 50" fill="none" stroke="#ffffff" stroke-width="4"/>
    <path d="M 0 70 Q 30 50, 60 70 T 120 70 T 180 70 T 240 70 T 300 70 T 360 70 T 420 70 T 480 70 T 525 70" fill="none" stroke="#ffffff" stroke-width="4"/>
  </g>

  <!-- Central Specialist Portrait Circle -->
  <g>
    <!-- Outer Glow Ring -->
    <circle cx="337.5" cy="270" r="162" fill="none" stroke="url(#ringGrad)" stroke-width="7"/>
    <!-- Inner border -->
    <circle cx="337.5" cy="270" r="154" fill="#0369a1" stroke="#ffffff" stroke-width="3"/>
    <!-- Clip Path for portrait -->
    <clipPath id="portraitClip_${card.filename.replace(/[^a-zA-Z0-9]/g, '')}">
      <circle cx="337.5" cy="270" r="150"/>
    </clipPath>
    <g clip-path="url(#portraitClip_${card.filename.replace(/[^a-zA-Z0-9]/g, '')})">
      ${avatarPath}
    </g>
  </g>

  <!-- Specialist Name -->
  <text x="337.5" y="475" font-family="system-ui, -apple-system, sans-serif" font-size="34" font-weight="900" fill="#facc15" text-anchor="middle" letter-spacing="-0.5">${card.name}</text>

  <!-- Role / Title Pill Badge -->
  <g transform="translate(337.5, 520)">
    <rect x="-140" y="-22" width="280" height="44" rx="22" fill="#0284c7" fill-opacity="0.85" stroke="#38bdf8" stroke-width="1.5"/>
    <text x="0" y="6" font-family="system-ui, -apple-system, sans-serif" font-size="17" font-weight="800" fill="#ffffff" text-anchor="middle">${card.title}</text>
  </g>

  <!-- Qualifications Bullet List -->
  <g transform="translate(0, -25)">
    ${bulletsSvg}
  </g>

  <!-- Footer Social & Web -->
  <g transform="translate(337.5, 845)">
    <!-- Social Icons Container -->
    <rect x="-135" y="-14" width="85" height="28" rx="6" fill="#ffffff" stroke="#94a3b8" stroke-width="1.5"/>
    <text x="-92" y="5" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="bold" fill="#0284c7" text-anchor="middle">𝕏 📷 🎵 ▶</text>
    <text x="-35" y="0" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="800" fill="#0f172a" text-anchor="start">rabacenter</text>
    <text x="-35" y="16" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="700" fill="#0284c7" text-anchor="start">rabacenters.com</text>
  </g>

  <!-- Corner Graphic Swirl Bottom Left -->
  <path d="M 0 840 Q 60 780, 110 840 T 30 900" fill="none" stroke="#38bdf8" stroke-width="10" stroke-linecap="round" opacity="0.85"/>
</svg>`;
}

const targetDir = path.join(process.cwd(), 'public', 'specialists', 'cards');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

CARDS.forEach(card => {
  const filePath = path.join(targetDir, card.filename);
  const svg = generateSvgCard(card);
  fs.writeFileSync(filePath, svg, 'utf8');
  console.log('Saved card:', card.filename);
});

console.log('Successfully generated all 20 cards!');
