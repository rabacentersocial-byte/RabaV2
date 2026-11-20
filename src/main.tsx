import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { LiveDataProvider } from './context/LiveDataContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import './index.css';

const rootEl = document.getElementById('root');
if (rootEl) {
  let didMount = false;
  const mountReactApp = () => {
    if (didMount) return;
    didMount = true;
    try {
      const root = createRoot(rootEl);
      root.render(
        <StrictMode>
          <ErrorBoundary>
            <ThemeProvider>
              <LanguageProvider>
                <AuthProvider>
                  <LiveDataProvider>
                    <App />
                  </LiveDataProvider>
                </AuthProvider>
              </LanguageProvider>
            </ThemeProvider>
          </ErrorBoundary>
        </StrictMode>,
      );

      // Dismiss overlay splash screen immediately as soon as React mounts
      if (typeof window !== 'undefined' && (window as any).dismissSplash) {
        (window as any).dismissSplash();
      }
    } catch (err) {
      console.error('[main] Fatal render mount error:', err);
      if (typeof window !== 'undefined' && (window as any).showAppError) {
        (window as any).showAppError(err);
      }
    }
  };

  // Keep the pixel-accurate pre-render shell visible until the async production stylesheet applies (zero FOUC)
  const mainCssLink = document.querySelector<HTMLLinkElement>(
    'link[data-raba-main-css="1"], link[as="style"][href*="/assets/"]'
  );
  const isMainCssReady =
    !mainCssLink ||
    mainCssLink.dataset.rabaCssLoaded === '1' ||
    (mainCssLink.rel === 'stylesheet' && Boolean(mainCssLink.sheet));

  if (isMainCssReady) {
    mountReactApp();
  } else if (mainCssLink) {
    const onCssReady = () => {
      if (mainCssLink.rel !== 'stylesheet') {
        mainCssLink.rel = 'stylesheet';
      }
      mainCssLink.dataset.rabaCssLoaded = '1';
      mountReactApp();
    };
    mainCssLink.addEventListener('load', onCssReady, { once: true });
    mainCssLink.addEventListener('error', onCssReady, { once: true });
    // Fail-safe fallback so React always mounts quickly even if stylesheet load events lag
    window.setTimeout(onCssReady, 600);
  }
}

// Safely execute WebMCP, asset store preload, and service worker setup during idle time without bloating critical entry JS
const scheduleIdleWork = (fn: () => void, delayMs = 2000) => {
  if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
    (window as any).requestIdleCallback(fn, { timeout: delayMs + 1000 });
  } else {
    setTimeout(fn, delayMs);
  }
};

scheduleIdleWork(() => {
  import('./utils/webMcp')
    .then(({ initWebMcp }) => initWebMcp())
    .catch((e) => console.warn('[main] WebMCP notice:', e));

  import('./utils/persistentSync')
    .then(({ initPersistentSync }) => initPersistentSync())
    .catch((e) => console.warn('[main] Persistent sync notice:', e));

  // Register PWA service worker only in production so it never intercepts or 404s in Vite dev
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator && !window.location.hash.includes('admin')) {
    try {
      if (import.meta.env.PROD) {
        navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch(() => {});
      } else {
        navigator.serviceWorker
          .getRegistrations()
          .then((regs) => regs.forEach((reg) => reg.unregister().catch(() => {})))
          .catch(() => {});
      }
    } catch {
      // ignore
    }
  }
}, 2000);
