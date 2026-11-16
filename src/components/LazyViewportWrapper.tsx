import React, { useState, useEffect, useRef, Suspense } from 'react';

interface SectionSkeletonProps {
  minHeight?: number;
}

export const SectionSkeleton: React.FC<SectionSkeletonProps> = ({ minHeight = 520 }) => (
  <div
    className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col justify-center gap-6 animate-pulse"
    style={{ minHeight: `${minHeight}px` }}
    aria-hidden="true"
  >
    <div className="mx-auto w-44 h-7 rounded-full bg-[#161B26]/[0.06] dark:bg-white/[0.06]" />
    <div className="mx-auto w-80 max-w-[85%] h-9 rounded-2xl bg-[#161B26]/[0.08] dark:bg-white/[0.08]" />
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-4">
      <div className="h-52 rounded-[28px] bg-[#161B26]/[0.05] dark:bg-white/[0.04] border border-[#161B26]/[0.06] dark:border-white/[0.06]" />
      <div className="hidden md:block h-52 rounded-[28px] bg-[#161B26]/[0.05] dark:bg-white/[0.04] border border-[#161B26]/[0.06] dark:border-white/[0.06]" />
      <div className="hidden md:block h-52 rounded-[28px] bg-[#161B26]/[0.05] dark:bg-white/[0.04] border border-[#161B26]/[0.06] dark:border-white/[0.06]" />
    </div>
  </div>
);

interface LazyViewportWrapperProps {
  children: React.ReactNode;
  minHeight?: number;
  sectionId?: string;
  eager?: boolean;
  rootMargin?: string;
  fallback?: React.ReactNode;
}

const isCrawlerUserAgent = (): boolean => {
  if (typeof navigator === 'undefined') return true;
  return /(bot|crawl|spider|googlebot|bingbot|yandex|baiduspider|applebot|slurp|duckduckbot|lighthouse|headlesschrome)/i.test(
    navigator.userAgent || ''
  );
};

const matchesSectionHash = (sectionId?: string): boolean => {
  if (typeof window === 'undefined' || !sectionId) return false;
  const hash = window.location.hash.replace(/^#/, '').toLowerCase();
  if (!hash) return false;
  if (hash === sectionId.toLowerCase()) return true;
  if (hash === 'booking' && (sectionId === 'shadow-teacher' || sectionId === 'packages')) return true;
  if (hash === 'about' && sectionId === 'accreditations-section') return true;
  return false;
};

export const LazyViewportWrapper: React.FC<LazyViewportWrapperProps> = ({
  children,
  minHeight = 600,
  sectionId,
  eager = false,
  rootMargin = '200px 0px',
  fallback,
}) => {
  const [shouldRender, setShouldRender] = useState<boolean>(() => {
    if (eager) return true;
    if (typeof window === 'undefined') return true;
    if (!('IntersectionObserver' in window)) return true;
    if (isCrawlerUserAgent()) return true;
    if (matchesSectionHash(sectionId)) return true;
    return false;
  });

  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (shouldRender) return;

    const handleHashChange = () => {
      if (matchesSectionHash(sectionId)) {
        setShouldRender(true);
      }
    };
    window.addEventListener('hashchange', handleHashChange);

    const target = containerRef.current;
    if (!target || typeof IntersectionObserver === 'undefined') {
      setShouldRender(true);
      return () => window.removeEventListener('hashchange', handleHashChange);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting || entry.boundingClientRect.top <= window.innerHeight + 250) {
            setShouldRender(true);
            observer.disconnect();
            break;
          }
        }
      },
      {
        root: null,
        rootMargin,
        threshold: 0.01,
      }
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [shouldRender, sectionId, rootMargin]);

  const resolvedFallback = fallback ?? <SectionSkeleton minHeight={minHeight} />;

  if (!shouldRender) {
    return (
      <div
        ref={containerRef}
        id={sectionId}
        className="raba-lazy-section-shell"
        style={{
          minHeight: `${minHeight}px`,
          contentVisibility: 'auto',
          containIntrinsicSize: `auto ${minHeight}px`,
        }}
        aria-hidden="true"
      >
        {resolvedFallback}
      </div>
    );
  }

  return <Suspense fallback={resolvedFallback}>{children}</Suspense>;
};
