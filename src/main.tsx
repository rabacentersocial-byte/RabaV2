import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { updateTabFavicon } from './data/siteCustomizer';
import { initPersistentSync, hydratePersistentData } from './utils/persistentSync';
import { initWebMcp } from './utils/webMcp';
import './index.css';

console.log('[Raba main] Initializing core modules...');

// Initialize WebMCP tools for in-browser AI agents
try {
  initWebMcp();
} catch (e) {
  console.warn('[main] WebMCP notice:', e);
}

// Pre-hydrate persistent data synchronously before React renders so incognito mode has instant data
try {
  hydratePersistentData();
} catch (e) {
  console.warn('[main] Pre-mount hydration notice:', e);
}

const rootEl = document.getElementById('root');
if (rootEl) {
  let didMount = false;
  const mountReactApp = () => {
    if (didMount) return;
    didMount = true;
    try {
      console.log('[Raba main] Mounting React tree into #root...');
      const root = createRoot(rootEl);
      root.render(
        <StrictMode>
          <ErrorBoundary>
            <ThemeProvider>
              <LanguageProvider>
                <AuthProvider>
                  <App />
                </AuthProvider>
              </LanguageProvider>
            </ThemeProvider>
          </ErrorBoundary>
        </StrictMode>,
      );
      console.log('[Raba main] React tree successfully dispatched to renderer.');

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
    // Fail-safe fallback so React always mounts even if a network proxy strips stylesheet events
    window.setTimeout(onCssReady, 1500);
  }
}

// Safely execute initial background sync and favicon setup during idle time without blocking main thread mount
const scheduleIdleWork = (fn: () => void, delayMs = 2500) => {
  if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
    (window as any).requestIdleCallback(fn, { timeout: delayMs + 1000 });
  } else {
    setTimeout(fn, delayMs);
  }
};

scheduleIdleWork(() => {
  try {
    updateTabFavicon();
  } catch (e) {
    console.warn('[main] Favicon notice:', e);
  }

  try {
    initPersistentSync();
  } catch (e) {
    console.warn('[main] Persistent sync notice:', e);
  }

  // Register PWA service worker during idle time so it never blocks FCP, LCP, or TBT
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator && !window.location.hash.includes('admin')) {
    try {
      navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch(() => {});
    } catch {
      // ignore
    }
  }
}, 3000);
