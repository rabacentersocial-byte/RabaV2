import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext.tsx';
import { updateTabFavicon } from './data/siteCustomizer';
import { initPersistentSync, hydratePersistentData } from './utils/persistentSync';
import './index.css';

// Instant synchronous hydration for incognito/private mode
hydratePersistentData();

// Initialize tab favicon with brand logo
updateTabFavicon();

// Initialize full-stack persistent synchronization with server disk
initPersistentSync();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  </StrictMode>,
);
