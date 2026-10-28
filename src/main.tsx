import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { updateTabFavicon } from './data/siteCustomizer';
import { initPersistentSync, hydratePersistentData } from './utils/persistentSync';
import './index.css';

console.log('[Raba main] Initializing core modules...');

// Pre-hydrate persistent data synchronously before React renders so incognito mode has instant data
try {
  hydratePersistentData();
} catch (e) {
  console.warn('[main] Pre-mount hydration notice:', e);
}

const rootEl = document.getElementById('root');
if (rootEl) {
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
}, 2200);
