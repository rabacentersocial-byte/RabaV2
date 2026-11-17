export const SITE_URL = 'https://rabacenters.com';

export interface ServiceSeoRouteConfig {
  slug: string;
  serviceId: string;
  title: string;
  description: string;
  h1: string;
  h1En: string;
  faq?: Array<{ question: string; answer: string }>;
}

export interface RouteSeoMeta {
  path: string;
  title: string;
  description: string;
  canonical: string;
  h1: string;
  ogType: 'website' | 'article';
  ogImage?: string;
  jsonLd: Record<string, any>;
}

export const STATIC_SEO_PATHS: string[] = [
  '/services',
  '/services-directory',
  '/specialists',
  '/specialists-directory',
  '/branches',
  '/branches-directory',
  '/shadow-teacher',
  '/shadow-teacher-directory',
  '/sewar',
  '/about',
  '/booking',
  '/offers-directory',
  '/offers',
  '/courses',
  '/courses-directory',
  '/partners',
  '/partners-directory',
  '/testimonials',
  '/testimonials-directory',
  '/reviews',
  '/blog',
  '/blog-directory',
  '/articles',
  '/contact',
  '/privacy',
  '/privacy-policy',
  '/terms',
  '/terms-of-service',
];

export const SERVICE_SEO_ROUTES: ServiceSeoRouteConfig[] = [
  {
    slug: 'aba-therapy',
    serviceId: 'srv-aba',
    title: 'علاج تحليل السلوك التطبيقي ABA للأطفال | مركز رابا',
    description:
      'برنامج تحليل السلوك التطبيقي (ABA) الفردي لتنمية المهارات التواصلية والاستقلالية والحد من السلوكيات التحدية بإشراف أخصائيين معتمدين في مركز رابا.',
    h1: 'علاج تحليل السلوك التطبيقي ABA للأطفال',
    h1En: 'Applied Behavior Analysis (ABA) Therapy',
    faq: [
      {
        question: 'ما هو برنامج تحليل السلوك التطبيقي ABA في مركز رابا؟',
        answer:
          'هو تدخل علاجي علمي قائم على الأدلة يهدف لتنمية المهارات التواصلية والاجتماعية والاستقلالية الذاتية وتعديل السلوك عبر خطة فردية مخصصة لكل طفل.',
      },
      {
        question: 'ما هي الفئة العمرية المناسبة لجلسات ABA؟',
        answer:
          'تبدأ جلسات التدخل المبكر وتحليل السلوك التطبيقي في مركز رابا من عمر سنة ونصف وحتى 14 سنة وفق تقييم نمائي وسلوكي مقنن.',
      },
    ],
  },
  {
    slug: 'developmental-assessment',
    serviceId: 'srv-psychological',
    title: 'التشخيص والتقييم النمائي للأطفال | مركز رابا',
    description:
      'تقييم نمائي ونفسي شامل ومقنن لاضطراب طيف التوحد، فرط الحركة وتشتت الانتباه، ومقاييس الذكاء والقدرات المعرفية مع تقارير معتمدة في مركز رابا.',
    h1: 'التشخيص والتقييم النمائي للأطفال',
    h1En: 'Developmental & Psychological Assessment',
    faq: [
      {
        question: 'ماذا يشمل التقييم النمائي الشامل في مركز رابا؟',
        answer:
          'يشمل مقاييس الذكاء والنمو وتقييم اضطراب طيف التوحد وفرط الحركة وتشتت الانتباه، مع إصدار تقرير تشخيصي معتمد وخطة تدخل واضحة للأسرة.',
      },
    ],
  },
  {
    slug: 'speech-therapy',
    serviceId: 'srv-speech',
    title: 'علاج النطق والتخاطب للأطفال | مركز رابا',
    description:
      'جلسات النطق والتخاطب وعلاج تأخر الكلام والتأتأة وبرامج التواصل البديل والمعزز AAC/PECS للأطفال في مركز رابا للتأهيل.',
    h1: 'علاج النطق والتخاطب للأطفال',
    h1En: 'Speech & Language Therapy',
    faq: [
      {
        question: 'كيف تساعد جلسات التخاطب الأطفال غير الناطقين أو المتأخرين لغوياً؟',
        answer:
          'تعمل الجلسات على بناء الحصيلة اللغوية الاستقبالية والتعبيرية، وتصحيح مخارج الحروف، واستخدام وسائل التواصل المعزز والبديل AAC/PECS عند الحاجة.',
      },
    ],
  },
  {
    slug: 'occupational-therapy',
    serviceId: 'srv-occupational',
    title: 'العلاج الوظيفي والتكامل الحسي | مركز رابا',
    description:
      'برامج العلاج الوظيفي والتكامل الحسي لتطوير المهارات الحركية الدقيقة والاعتماد على النفس وتنظيم الاستجابات الحسية للأطفال في مركز رابا.',
    h1: 'العلاج الوظيفي والتكامل الحسي',
    h1En: 'Occupational Therapy & Sensory Integration',
    faq: [
      {
        question: 'ما أهداف برنامج العلاج الوظيفي للأطفال؟',
        answer:
          'تنمية المهارات الحركية الدقيقة، والتآزر البصري الحركي، ومهارات مسك القلم والاعتماد على النفس في أنشطة الحياة اليومية.',
      },
    ],
  },
  {
    slug: 'sensory-integration',
    serviceId: 'srv-sensory',
    title: 'التكامل الحسي والتنظيم الحسي للأطفال | مركز رابا',
    description:
      'جلسات متخصصة في صالة التكامل الحسي لمعالجة اضطرابات التحسس السمعي والبصري واللمسي وبناء التوازن الحركي للطفل في مركز رابا.',
    h1: 'التكامل الحسي والتنظيم الحسي للأطفال',
    h1En: 'Sensory Integration Program',
  },
  {
    slug: 'learning-difficulties',
    serviceId: 'srv-learning-difficulties',
    title: 'علاج صعوبات التعلم وحل الواجبات | مركز رابا',
    description:
      'برامج تعليمية وعلاجية متخصصة لصعوبات التعلم والقراءة والكتابة ودعم الأطفال لإنجاز واجباتهم المدرسية باستقلالية وثقة في مركز رابا.',
    h1: 'صعوبات التعلم وحل الواجبات',
    h1En: 'Learning Difficulties & Homework Support',
  },
  {
    slug: 'psychological-therapy',
    serviceId: 'srv-psychological',
    title: 'التشخيص والعلاج النفسي للأطفال والأسرة | مركز رابا',
    description:
      'خدمات التقييم النفسي السلوكي والإرشاد الأسري الفردي لتعزيز الصحة النفسية والتكيف العاطفي للأطفال وأسرهم في مركز رابا.',
    h1: 'التشخيص والعلاج النفسي والإرشاد الأسري',
    h1En: 'Psychological Care & Family Guidance',
  },
];

export function getServiceSeoBySlug(slug: string): ServiceSeoRouteConfig | undefined {
  const normalized = slug.toLowerCase().replace(/^\/+|\/+$/g, '');
  return SERVICE_SEO_ROUTES.find((s) => s.slug === normalized);
}

export function getServiceSlugById(serviceId: string): string {
  switch (serviceId) {
    case 'srv-aba':
      return 'aba-therapy';
    case 'srv-speech':
      return 'speech-therapy';
    case 'srv-occupational':
      return 'occupational-therapy';
    case 'srv-sensory':
      return 'sensory-integration';
    case 'srv-learning-difficulties':
      return 'learning-difficulties';
    case 'srv-psychological':
      return 'developmental-assessment';
    default:
      return 'aba-therapy';
  }
}

export interface ArticleSeed {
  slug?: string;
  title?: string;
  excerpt?: string;
  summary?: string;
  content?: string;
  image?: string;
  publishDate?: string;
  updatedAt?: string;
  author?: { name?: string; nameEn?: string; title?: string };
  categoryLabelAr?: string;
  active?: boolean;
}

export interface ArticleJsonLdBundle {
  canonical: string;
  headline: string;
  description: string;
  image: string;
  datePublished: string;
  dateModified: string;
  medicalOrganization: Record<string, any>;
  article: Record<string, any>;
  breadcrumbList: Record<string, any>;
  jsonLd: Record<string, any>;
}

const ARABIC_MONTHS: Record<string, string> = {
  'يناير': '01',
  'فبراير': '02',
  'مارس': '03',
  'أبريل': '04',
  'ابريل': '04',
  'مايو': '05',
  'يونيو': '06',
  'يوليو': '07',
  'أغسطس': '08',
  'اغسطس': '08',
  'سبتمبر': '09',
  'أكتوبر': '10',
  'اكتوبر': '10',
  'نوفمبر': '11',
  'ديسمبر': '12',
};

function normalizeSchemaIsoDate(raw?: string, fallback = '2026-11-14'): string {
  if (!raw || typeof raw !== 'string') return fallback;
  const trimmed = raw.trim();
  if (/^\d{4}-\d{2}-\d{2}/.test(trimmed)) {
    return trimmed.slice(0, 10);
  }
  const arMatch = trimmed.match(/(\d{1,2})\s+([^\s\d]+)\s+(\d{4})/);
  if (arMatch) {
    const day = arMatch[1].padStart(2, '0');
    const month = ARABIC_MONTHS[arMatch[2]];
    const year = arMatch[3];
    if (month) {
      return `${year}-${month}-${day}`;
    }
  }
  const parsed = new Date(trimmed);
  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toISOString().split('T')[0];
  }
  return fallback;
}

const ORG_NODE = {
  '@type': 'MedicalBusiness',
  '@id': `${SITE_URL}/#organization`,
  name: 'مركز رابا للعلاج بتحليل السلوك التطبيقي ABA | RABA CENTER',
  url: `${SITE_URL}/`,
  telephone: '+966575100100',
  email: 'info@rabacenters.com',
  logo: `${SITE_URL}/logo/raba_puzzle_brain.png`,
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'SA',
    addressRegion: 'منطقة الرياض',
    addressLocality: 'الرياض',
  },
};

function makeBreadcrumb(items: Array<{ name: string; url: string }>) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function generateBlogPostJsonLd(
  slug: string,
  blogPosts: ArticleSeed[] = []
): ArticleJsonLdBundle {
  const rawSlug = (slug || '').replace(/^\/(?:blog|articles)\//i, '').replace(/^\/+|\/+$/g, '');
  let decodedSlug = rawSlug;
  try {
    decodedSlug = decodeURIComponent(rawSlug);
  } catch {
    decodedSlug = rawSlug;
  }

  const post = blogPosts.find(
    (p) =>
      p &&
      typeof p.slug === 'string' &&
      (p.slug === decodedSlug || p.slug.toLowerCase() === decodedSlug.toLowerCase())
  );

  const headline = post?.title || 'مقال طبي متخصص | مدونة مركز رابا';
  const description = (
    post?.excerpt ||
    post?.summary ||
    'مقال توعوي وإكلينيكي متخصص من مركز رابا حول تحليل السلوك التطبيقي، التوحد، النطق والتخاطب والعلاج الوظيفي.'
  ).trim();
  const safeSlug = encodeURIComponent(post?.slug || decodedSlug);
  const canonical = `${SITE_URL}/blog/${safeSlug}`;
  const image = post?.image
    ? post.image.startsWith('http')
      ? post.image
      : `${SITE_URL}${post.image.startsWith('/') ? '' : '/'}${post.image}`
    : `${SITE_URL}/favicon-512x512.png`;
  const datePublished = normalizeSchemaIsoDate(post?.publishDate, '2026-11-14');
  const dateModified = normalizeSchemaIsoDate(post?.updatedAt || post?.publishDate, datePublished);

  const medicalOrganization = {
    '@type': 'MedicalOrganization',
    '@id': `${SITE_URL}/#medical-organization`,
    name: 'مركز رابا',
    alternateName: 'Raba Center | مركز رابا للعلاج بتحليل السلوك التطبيقي ABA',
    url: `${SITE_URL}/`,
    logo: {
      '@type': 'ImageObject',
      url: `${SITE_URL}/logo/raba_puzzle_brain.png`,
    },
    telephone: '+966575100100',
    email: 'info@rabacenters.com',
  };

  const article = {
    '@type': 'Article',
    '@id': `${canonical}#article`,
    headline,
    description,
    inLanguage: 'ar',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonical,
    },
    url: canonical,
    image: [image],
    datePublished,
    dateModified,
    author: {
      '@type': 'MedicalOrganization',
      '@id': `${SITE_URL}/#medical-organization`,
      name: 'مركز رابا',
      url: `${SITE_URL}/`,
    },
    publisher: {
      '@type': 'MedicalOrganization',
      '@id': `${SITE_URL}/#medical-organization`,
      name: 'مركز رابا',
      url: `${SITE_URL}/`,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/logo/raba_puzzle_brain.png`,
      },
    },
  };

  const breadcrumbList = makeBreadcrumb([
    { name: 'الرئيسية', url: `${SITE_URL}/` },
    { name: 'المدونة الطبية', url: `${SITE_URL}/blog` },
    { name: headline, url: canonical },
  ]);

  return {
    canonical,
    headline,
    description,
    image,
    datePublished,
    dateModified,
    medicalOrganization,
    article,
    breadcrumbList,
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [medicalOrganization, article, breadcrumbList],
    },
  };
}

export function resolveRouteSeo(pathname: string, blogPosts: ArticleSeed[] = []): RouteSeoMeta {
  const cleanPath = (pathname || '/').split('?')[0].split('#')[0].replace(/\/+$/, '') || '/';
  const lower = cleanPath.toLowerCase();

  // 1. Dynamic Blog / Article route: /blog/:slug or /articles/:slug
  if (lower.startsWith('/blog/') || lower.startsWith('/articles/')) {
    const rawSlug = cleanPath.replace(/^\/(?:blog|articles)\//i, '').replace(/\/+$/, '');
    const bundle = generateBlogPostJsonLd(rawSlug, blogPosts);

    return {
      path: cleanPath,
      title: `${bundle.headline} | مدونة مركز رابا`,
      description: bundle.description.slice(0, 160),
      canonical: bundle.canonical,
      h1: bundle.headline,
      ogType: 'article',
      ogImage: bundle.image,
      jsonLd: bundle.jsonLd,
    };
  }

  // 2. Dynamic Service Detail route: /services/:slug
  if (lower.startsWith('/services/')) {
    const slug = lower.replace(/^\/services\//, '').replace(/\/+$/, '');
    const srv = getServiceSeoBySlug(slug);
    if (srv) {
      const canonical = `${SITE_URL}/services/${srv.slug}`;
      const graph: any[] = [
        ORG_NODE,
        {
          '@type': 'Service',
          '@id': `${canonical}#service`,
          name: srv.h1,
          alternateName: srv.h1En,
          serviceType: srv.h1En,
          description: srv.description,
          url: canonical,
          provider: { '@id': `${SITE_URL}/#organization` },
          areaServed: { '@type': 'Country', name: 'Saudi Arabia' },
        },
        makeBreadcrumb([
          { name: 'الرئيسية', url: `${SITE_URL}/` },
          { name: 'الخدمات الإكلينيكية', url: `${SITE_URL}/services` },
          { name: srv.h1, url: canonical },
        ]),
      ];

      if (srv.faq && srv.faq.length > 0) {
        graph.push({
          '@type': 'FAQPage',
          mainEntity: srv.faq.map((q) => ({
            '@type': 'Question',
            name: q.question,
            acceptedAnswer: { '@type': 'Answer', text: q.answer },
          })),
        });
      }

      return {
        path: cleanPath,
        title: srv.title,
        description: srv.description,
        canonical,
        h1: srv.h1,
        ogType: 'website',
        jsonLd: { '@context': 'https://schema.org', '@graph': graph },
      };
    }
  }

  // 3. Dedicated Standalone Pages
  switch (lower) {
    case '/services':
    case '/services-directory':
      return {
        path: cleanPath,
        title: 'الخدمات الإكلينيكية وبرامج التأهيل الشامل | مركز رابا',
        description:
          'استعرض كافة برامج التأهيل المعتمدة في مركز رابا: تحليل السلوك التطبيقي ABA، علاج النطق والتخاطب، العلاج الوظيفي والتكامل الحسي، والتقييم النفسي.',
        canonical: `${SITE_URL}/services`,
        h1: 'الخدمات الإكلينيكية وبرامج التأهيل الشامل',
        ogType: 'website',
        jsonLd: {
          '@context': 'https://schema.org',
          '@graph': [
            ORG_NODE,
            {
              '@type': 'ItemList',
              name: 'برامج وخدمات مركز رابا التأهيلية',
              itemListElement: SERVICE_SEO_ROUTES.slice(0, 6).map((s, idx) => ({
                '@type': 'ListItem',
                position: idx + 1,
                item: {
                  '@type': 'Service',
                  name: s.h1,
                  description: s.description,
                  url: `${SITE_URL}/services/${s.slug}`,
                  provider: { '@id': `${SITE_URL}/#organization` },
                },
              })),
            },
            makeBreadcrumb([
              { name: 'الرئيسية', url: `${SITE_URL}/` },
              { name: 'الخدمات الإكلينيكية', url: `${SITE_URL}/services` },
            ]),
          ],
        },
      };

    case '/specialists':
    case '/specialists-directory':
      return {
        path: cleanPath,
        title: 'نخبة الأخصائيين | مركز رابا',
        description:
          'تعرّف على الكادر الطبي والتأهيلي المعتمد في مركز رابا من استشاريي تحليل السلوك التطبيقي ABA، النطق والتخاطب، العلاج الوظيفي والتشخيص النفسي.',
        canonical: `${SITE_URL}/specialists`,
        h1: 'نخبة الأخصائيين والكادر الإكلينيكي',
        ogType: 'website',
        jsonLd: {
          '@context': 'https://schema.org',
          '@graph': [
            ORG_NODE,
            {
              '@type': 'MedicalClinic',
              name: 'الكادر الطبي والأخصائيين في مركز رابا',
              url: `${SITE_URL}/specialists`,
              medicalSpecialty: 'Behavioral Therapy & Autism Rehabilitation',
            },
            makeBreadcrumb([
              { name: 'الرئيسية', url: `${SITE_URL}/` },
              { name: 'الأخصائيون', url: `${SITE_URL}/specialists` },
            ]),
          ],
        },
      };

    case '/branches':
    case '/branches-directory':
      return {
        path: cleanPath,
        title: 'فروع مركز رابا | العناوين والحجز والخدمات',
        description:
          'استعرض مواقع وعناوين فروع مركز رابا في الرياض والخرج وساعات العمل وأرقام التواصل والحجز المباشر لأقرب فرع إليك.',
        canonical: `${SITE_URL}/branches`,
        h1: 'فروع مركز رابا في المملكة العربية السعودية',
        ogType: 'website',
        jsonLd: {
          '@context': 'https://schema.org',
          '@graph': [
            {
              ...ORG_NODE,
              '@type': ['MedicalBusiness', 'LocalBusiness'],
              url: `${SITE_URL}/branches`,
            },
            makeBreadcrumb([
              { name: 'الرئيسية', url: `${SITE_URL}/` },
              { name: 'فروعنا بالمملكة', url: `${SITE_URL}/branches` },
            ]),
          ],
        },
      };

    case '/shadow-teacher':
    case '/shadow-teacher-directory':
    case '/sewar':
      return {
        path: cleanPath,
        title: 'خدمة معلم الظل والدمج المدرسي | مركز رابا',
        description:
          'برنامج سِوار المتخصص في توفير معلمات ظل مؤهلات للدمج المدرسي والتربوي ومرافقة الأطفال داخل المدارس وفق خطط فردية معتمدة.',
        canonical: `${SITE_URL}/shadow-teacher`,
        h1: 'خدمة سِوار – معلم الظل والدمج المدرسي',
        ogType: 'website',
        jsonLd: {
          '@context': 'https://schema.org',
          '@graph': [
            ORG_NODE,
            {
              '@type': 'Service',
              name: 'خدمة سِوار لمعلم الظل والدمج المدرسي',
              serviceType: 'School Shadow Teacher & Educational Inclusion',
              provider: { '@id': `${SITE_URL}/#organization` },
              url: `${SITE_URL}/shadow-teacher`,
            },
            {
              '@type': 'FAQPage',
              mainEntity: [
                {
                  '@type': 'Question',
                  name: 'هل تقدمون خدمة معلم الظل (Shadow Teacher) في المدارس؟',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'نعم، يقدم مركز رابا برنامج سِوار المتخصص لتوفير معلمات ظل مؤهلات ومعتمدات للدمج المدرسي ومرافقة الطفل داخل اليوم الدراسي.',
                  },
                },
              ],
            },
            makeBreadcrumb([
              { name: 'الرئيسية', url: `${SITE_URL}/` },
              { name: 'خدمة سِوار (معلم الظل)', url: `${SITE_URL}/shadow-teacher` },
            ]),
          ],
        },
      };

    case '/about':
      return {
        path: cleanPath,
        title: 'عن مركز رابا للتأهيل وتحليل السلوك التطبيقي | من نحن',
        description:
          'مركز رابا من أقدم المراكز المتخصصة في التأهيل ورعاية ذوي الاحتياجات الخاصة في المملكة وفق معايير BACB وISO المعتمدة منذ أكثر من 18 عاماً.',
        canonical: `${SITE_URL}/about`,
        h1: 'عن مركز رابا للتأهيل وتحليل السلوك التطبيقي',
        ogType: 'website',
        jsonLd: {
          '@context': 'https://schema.org',
          '@graph': [
            ORG_NODE,
            {
              '@type': 'AboutPage',
              name: 'عن مركز رابا للتأهيل',
              url: `${SITE_URL}/about`,
              about: { '@id': `${SITE_URL}/#organization` },
            },
            makeBreadcrumb([
              { name: 'الرئيسية', url: `${SITE_URL}/` },
              { name: 'عن المركز', url: `${SITE_URL}/about` },
            ]),
          ],
        },
      };

    case '/booking':
      return {
        path: cleanPath,
        title: 'حجز موعد أو استشارة | مركز رابا',
        description:
          'احجز موعد تقييم نمائي أو جلسة استشارية في أي من فروع مركز رابا بسهولة لاختيار الأخصائي والتوقيت والبرنامج المناسب لطفلك.',
        canonical: `${SITE_URL}/booking`,
        h1: 'حجز موعد أو استشارة طبية',
        ogType: 'website',
        jsonLd: {
          '@context': 'https://schema.org',
          '@graph': [
            ORG_NODE,
            {
              '@type': 'ContactPage',
              name: 'حجز موعد أو استشارة في مركز رابا',
              url: `${SITE_URL}/booking`,
            },
            makeBreadcrumb([
              { name: 'الرئيسية', url: `${SITE_URL}/` },
              { name: 'حجز موعد', url: `${SITE_URL}/booking` },
            ]),
          ],
        },
      };

    case '/offers-directory':
    case '/offers':
      return {
        path: cleanPath,
        title: 'العروض والأنشطة التأهيلية الحصرية | مركز رابا',
        description:
          'اكتشف أحدث العروض العلاجية والأنشطة الموسمية والباقات التأهيلية المخفضة للأطفال في مركز رابا للتأهيل.',
        canonical: `${SITE_URL}/offers-directory`,
        h1: 'العروض والأنشطة التأهيلية الحصرية',
        ogType: 'website',
        jsonLd: {
          '@context': 'https://schema.org',
          '@graph': [
            ORG_NODE,
            {
              '@type': 'OfferCatalog',
              name: 'عروض وباقات مركز رابا',
              url: `${SITE_URL}/offers-directory`,
            },
            makeBreadcrumb([
              { name: 'الرئيسية', url: `${SITE_URL}/` },
              { name: 'العروض والأنشطة', url: `${SITE_URL}/offers-directory` },
            ]),
          ],
        },
      };

    case '/courses':
    case '/courses-directory':
      return {
        path: cleanPath,
        title: 'الدورات التدريبية وورش العمل المعتمدة | مركز رابا',
        description:
          'استعرض الدورات التدريبية التخصصية وورش العمل في تحليل السلوك التطبيقي ABA وتأهيل المختصين وأولياء الأمور في مركز رابا.',
        canonical: `${SITE_URL}/courses`,
        h1: 'الدورات التدريبية وورش العمل المعتمدة',
        ogType: 'website',
        jsonLd: {
          '@context': 'https://schema.org',
          '@graph': [
            ORG_NODE,
            makeBreadcrumb([
              { name: 'الرئيسية', url: `${SITE_URL}/` },
              { name: 'الدورات التدريبية', url: `${SITE_URL}/courses` },
            ]),
          ],
        },
      };

    case '/partners':
    case '/partners-directory':
      return {
        path: cleanPath,
        title: 'شركاء النجاح والجهات الداعمة | مركز رابا',
        description:
          'شركاء النجاح والرعايات المؤسسية والطبية المتعاونة مع مركز رابا لخدمة الأطفال ذوي الاحتياجات الخاصة.',
        canonical: `${SITE_URL}/partners`,
        h1: 'شركاء النجاح والرعايات المؤسسية',
        ogType: 'website',
        jsonLd: {
          '@context': 'https://schema.org',
          '@graph': [
            ORG_NODE,
            makeBreadcrumb([
              { name: 'الرئيسية', url: `${SITE_URL}/` },
              { name: 'شركاء النجاح', url: `${SITE_URL}/partners` },
            ]),
          ],
        },
      };

    case '/testimonials':
    case '/testimonials-directory':
    case '/reviews':
      return {
        path: cleanPath,
        title: 'آراء العملاء وقصص نجاح أطفال رابا | مركز رابا',
        description:
          'اقرأ تجارب وآراء أولياء الأمور الحقيقية حول تطور أطفالهم مع برامج تحليل السلوك التطبيقي والتأهيل في مركز رابا.',
        canonical: `${SITE_URL}/testimonials`,
        h1: 'آراء العملاء وقصص النجاح',
        ogType: 'website',
        jsonLd: {
          '@context': 'https://schema.org',
          '@graph': [
            {
              ...ORG_NODE,
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: '4.9',
                reviewCount: '320',
                bestRating: '5',
              },
            },
            makeBreadcrumb([
              { name: 'الرئيسية', url: `${SITE_URL}/` },
              { name: 'آراء العملاء', url: `${SITE_URL}/testimonials` },
            ]),
          ],
        },
      };

    case '/blog':
    case '/blog-directory':
      return {
        path: cleanPath,
        title: 'المدونة الطبية والدليل المعرفي الشامل | مركز رابا',
        description:
          'مقالات علمية وإكلينيكية موجهة للأسر حول تحليل السلوك التطبيقي ABA، اضطراب طيف التوحد، النطق والتخاطب والعلاج الوظيفي من فريق مركز رابا.',
        canonical: `${SITE_URL}/blog`,
        h1: 'المدونة الطبية والدليل المعرفي الشامل',
        ogType: 'website',
        jsonLd: {
          '@context': 'https://schema.org',
          '@graph': [
            ORG_NODE,
            {
              '@type': 'Blog',
              name: 'المدونة الطبية لمركز رابا',
              url: `${SITE_URL}/blog`,
              publisher: { '@id': `${SITE_URL}/#organization` },
            },
            makeBreadcrumb([
              { name: 'الرئيسية', url: `${SITE_URL}/` },
              { name: 'المدونة الطبية', url: `${SITE_URL}/blog` },
            ]),
          ],
        },
      };

    case '/articles':
      return {
        path: cleanPath,
        title: 'مقالات وأدلة التوحد وعلم النفس | مركز رابا',
        description:
          'مكتبة مقالات وأدلة علمية معتمدة حول التوحد، تحليل السلوك التطبيقي، علم النفس الإكلينيكي وتعديل السلوك للطفل والأسرة.',
        canonical: `${SITE_URL}/articles`,
        h1: 'مقالات وأدلة التوحد وعلم النفس',
        ogType: 'website',
        jsonLd: {
          '@context': 'https://schema.org',
          '@graph': [
            ORG_NODE,
            {
              '@type': 'CollectionPage',
              name: 'مقالات مركز رابا العلمية',
              url: `${SITE_URL}/articles`,
              publisher: { '@id': `${SITE_URL}/#organization` },
            },
            makeBreadcrumb([
              { name: 'الرئيسية', url: `${SITE_URL}/` },
              { name: 'المقالات العلمية', url: `${SITE_URL}/articles` },
            ]),
          ],
        },
      };

    case '/contact':
      return {
        path: cleanPath,
        title: 'تواصل معنا | أرقام الفروع والاستشارات - مركز رابا',
        description:
          'تواصل مع مركز رابا في المملكة العربية السعودية لحجز التقييم النمائي أو الاستفسار عن برامج التأهيل عبر الهاتف 0575100100 أو البريد الرسمي.',
        canonical: `${SITE_URL}/contact`,
        h1: 'تواصل مع مركز رابا للتأهيل',
        ogType: 'website',
        jsonLd: {
          '@context': 'https://schema.org',
          '@graph': [
            ORG_NODE,
            {
              '@type': 'ContactPage',
              name: 'تواصل مع مركز رابا',
              url: `${SITE_URL}/contact`,
            },
            makeBreadcrumb([
              { name: 'الرئيسية', url: `${SITE_URL}/` },
              { name: 'اتصل بنا', url: `${SITE_URL}/contact` },
            ]),
          ],
        },
      };

    case '/privacy':
    case '/privacy-policy':
      return {
        path: cleanPath,
        title: 'سياسة الخصوصية وحماية البيانات | مركز رابا',
        description:
          'سياسة الخصوصية وحماية سرية بيانات المستفيدين وأولياء الأمور في المنصة الإلكترونية لمركز رابا للتأهيل.',
        canonical: `${SITE_URL}/privacy`,
        h1: 'سياسة الخصوصية وحماية البيانات',
        ogType: 'website',
        jsonLd: {
          '@context': 'https://schema.org',
          '@graph': [
            ORG_NODE,
            { '@type': 'WebPage', name: 'سياسة الخصوصية | مركز رابا', url: `${SITE_URL}/privacy` },
            makeBreadcrumb([
              { name: 'الرئيسية', url: `${SITE_URL}/` },
              { name: 'سياسة الخصوصية', url: `${SITE_URL}/privacy` },
            ]),
          ],
        },
      };

    case '/terms':
    case '/terms-of-service':
      return {
        path: cleanPath,
        title: 'الشروط والأحكام وسياسة الاستخدام | مركز رابا',
        description:
          'الشروط والأحكام التنظيمية للاستفادة من خدمات مركز رابا وبرامج التأهيل وحجز المواعيد الإلكترونية.',
        canonical: `${SITE_URL}/terms`,
        h1: 'الشروط والأحكام',
        ogType: 'website',
        jsonLd: {
          '@context': 'https://schema.org',
          '@graph': [
            ORG_NODE,
            { '@type': 'WebPage', name: 'الشروط والأحكام | مركز رابا', url: `${SITE_URL}/terms` },
            makeBreadcrumb([
              { name: 'الرئيسية', url: `${SITE_URL}/` },
              { name: 'الشروط والأحكام', url: `${SITE_URL}/terms` },
            ]),
          ],
        },
      };

    default:
      return {
        path: '/',
        title: 'مركز رابا للعلاج بتحليل السلوك التطبيقي ABA | RABA CENTER',
        description:
          'مركز رابا من أقدم المراكز التي تقدم خدمات التأهيل والدعم لذوي الإحتياجات الخاصة، برامج تحليل السلوك التطبيقي ABA، تشخيص وتقييم مبني على أساس علمي، ودعم نفسي وإرشاد أسري.',
        canonical: `${SITE_URL}/`,
        h1: 'مركز رابا للعلاج بتحليل السلوك التطبيقي ABA',
        ogType: 'website',
        jsonLd: {
          '@context': 'https://schema.org',
          '@graph': [
            ORG_NODE,
            {
              '@type': 'WebSite',
              '@id': `${SITE_URL}/#website`,
              url: `${SITE_URL}/`,
              name: 'مركز رابا للعلاج بتحليل السلوك التطبيقي ABA | RABA CENTER',
              inLanguage: 'ar',
              publisher: { '@id': `${SITE_URL}/#organization` },
            },
            makeBreadcrumb([
              { name: 'الرئيسية', url: `${SITE_URL}/` },
              { name: 'الخدمات الإكلينيكية', url: `${SITE_URL}/services` },
              { name: 'حجز موعد', url: `${SITE_URL}/booking` },
            ]),
          ],
        },
      };
  }
}

function escapeHtmlAttr(str: string): string {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export function injectRouteSeoHtml(
  rawHtml: string,
  reqPath: string,
  blogPosts: ArticleSeed[] = []
): string {
  const cleanPath = (reqPath || '/').split('?')[0].split('#')[0].replace(/\/+$/, '') || '/';
  const lowerPath = cleanPath.toLowerCase();
  const seo = resolveRouteSeo(cleanPath, blogPosts);
  const dynamicJsonLd =
    lowerPath.startsWith('/blog/') || lowerPath.startsWith('/articles/')
      ? generateBlogPostJsonLd(cleanPath, blogPosts).jsonLd
      : seo.jsonLd;

  const escTitle = escapeHtmlAttr(seo.title);
  const escDesc = escapeHtmlAttr(seo.description);
  const escCanonical = escapeHtmlAttr(seo.canonical);
  const escH1 = escapeHtmlAttr(seo.h1);

  let html = rawHtml;
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escTitle}</title>`);
  html = html.replace(
    /<meta\s+[^>]*name=["']description["'][^>]*\/?>/i,
    `<meta name="description" content="${escDesc}" />`
  );
  html = html.replace(
    /<link\s+[^>]*rel=["']canonical["'][^>]*\/?>/i,
    `<link rel="canonical" href="${escCanonical}" />`
  );
  html = html.replace(
    /<meta\s+[^>]*property=["']og:url["'][^>]*\/?>/i,
    `<meta property="og:url" content="${escCanonical}" />`
  );
  html = html.replace(
    /<meta\s+[^>]*property=["']og:title["'][^>]*\/?>/i,
    `<meta property="og:title" content="${escTitle}" />`
  );
  html = html.replace(
    /<meta\s+[^>]*property=["']og:description["'][^>]*\/?>/i,
    `<meta property="og:description" content="${escDesc}" />`
  );
  html = html.replace(
    /<meta\s+[^>]*property=["']og:type["'][^>]*\/?>/i,
    `<meta property="og:type" content="${seo.ogType}" />`
  );
  html = html.replace(
    /<meta\s+[^>]*name=["']twitter:title["'][^>]*\/?>/i,
    `<meta name="twitter:title" content="${escTitle}" />`
  );
  html = html.replace(
    /<meta\s+[^>]*name=["']twitter:description["'][^>]*\/?>/i,
    `<meta name="twitter:description" content="${escDesc}" />`
  );

  if (seo.ogImage) {
    const escImg = escapeHtmlAttr(seo.ogImage);
    html = html.replace(
      /<meta\s+[^>]*property=["']og:image["'][^>]*\/?>/i,
      `<meta property="og:image" content="${escImg}" />`
    );
    html = html.replace(
      /<meta\s+[^>]*name=["']twitter:image["'][^>]*\/?>/i,
      `<meta name="twitter:image" content="${escImg}" />`
    );
  }

  const jsonLdString = JSON.stringify(dynamicJsonLd).replace(/</g, '\\u003c');
  if (/<script\s+[^>]*id=["']raba-structured-data["'][^>]*>[\s\S]*?<\/script>/i.test(html)) {
    html = html.replace(
      /<script\s+[^>]*id=["']raba-structured-data["'][^>]*>[\s\S]*?<\/script>/i,
      `<script id="raba-structured-data" type="application/ld+json">${jsonLdString}</script>`
    );
  }

  // Isolate sub-route static pre-shell so crawlers & view-source see route-specific <h1> without JavaScript
  if (cleanPath !== '/' && cleanPath !== '/index.html') {
    html = html.replace(
      /<section\s+id=["']hero["']\s+class=["']raba-pre-hero["']>[\s\S]*?<\/section>/i,
      `<section class="raba-pre-hero"><div class="raba-pre-container" style="padding: 3rem 0;"><h1 class="raba-pre-h1">${escH1}</h1><p class="raba-pre-sub">${escDesc}</p></div></section>`
    );
  }

  return html;
}
