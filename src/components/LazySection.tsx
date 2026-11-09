import React, { useState, useEffect, useRef } from 'react';

interface LazySectionProps {
  children: React.ReactNode;
  minHeight?: string;
  rootMargin?: string;
  id?: string;
  className?: string;
}

/**
 * Strict "Mount-Once, Never-Unmount" Viewport Section Component (<LazyViewportSection>)
 * 
 * Guarantees:
 * 1. Strictly transitions state ONE WAY (false -> true).
 * 2. As soon as the section intersects or hydrates, observer is disconnected immediately.
 * 3. NEVER unmounts, hides, or re-renders when scrolling in and out of the viewport.
 * 4. Zero `content-visibility: auto` to prevent mobile browsers from dropping cached layer textures on fast scroll.
 * 5. Eliminates layout shifts (CLS = 0) with reserved minHeight until hydration.
 */
export const LazySection: React.FC<LazySectionProps> = ({
  children,
  minHeight = '280px',
  rootMargin = '400px 0px',
  id,
  className
}) => {
  const [hasMounted, setHasMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // If already mounted, never observe again
    if (hasMounted) return;

    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setHasMounted(true);
      return;
    }

    // Fast idle fallback so crawlers and fast readers get full HTML
    let idleId: number | undefined;
    let timerId: ReturnType<typeof setTimeout> | undefined;

    const onTrigger = () => {
      setHasMounted(true);
      if (observer) {
        observer.disconnect();
      }
    };

    if ('requestIdleCallback' in window) {
      idleId = (window as any).requestIdleCallback(onTrigger, { timeout: 1500 });
    } else {
      timerId = setTimeout(onTrigger, 1500);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasMounted(true);
          if (idleId && 'cancelIdleCallback' in window) {
            (window as any).cancelIdleCallback(idleId);
          }
          if (timerId) {
            clearTimeout(timerId);
          }
          observer.disconnect(); // Never unmount or hide again!
        }
      },
      {
        rootMargin,
        threshold: 0.01
      }
    );

    const currentEl = containerRef.current;
    if (currentEl) {
      observer.observe(currentEl);
    }

    return () => {
      if (idleId && 'cancelIdleCallback' in window) {
        (window as any).cancelIdleCallback(idleId);
      }
      if (timerId) {
        clearTimeout(timerId);
      }
      observer.disconnect();
    };
  }, [rootMargin, hasMounted]);

  return (
    <div
      ref={containerRef}
      id={id}
      className={className}
      style={{
        minHeight: hasMounted ? undefined : minHeight,
        // CRITICAL: Absolutely NO content-visibility: auto here!
        // Mobile browsers discard textures of off-screen elements with content-visibility: auto,
        // resulting in blank white/dark delays when scrolling back up.
      }}
    >
      {hasMounted ? children : null}
    </div>
  );
};

export const LazyViewportSection = LazySection;
