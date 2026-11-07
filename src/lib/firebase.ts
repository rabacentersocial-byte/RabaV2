import { initializeApp, getApps, getApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import { 
  getFirestore, 
  initializeFirestore, 
  setLogLevel 
} from 'firebase/firestore';
import localConfig from '../../firebase-applet-config.json';

// Configure Firebase via import.meta.env with fallback to firebase-applet-config.json
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || localConfig?.apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || localConfig?.authDomain,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || localConfig?.projectId,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || localConfig?.storageBucket,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || localConfig?.messagingSenderId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || localConfig?.appId,
  firestoreDatabaseId: import.meta.env.VITE_FIREBASE_DATABASE_ID || localConfig?.firestoreDatabaseId,
};

// Startup environment validation check: Logs explicit notice if production keys are undefined or default placeholders
export function validateFirebaseConfig(): { isValid: boolean; missingKeys: string[] } {
  const criticalKeys: (keyof typeof firebaseConfig)[] = ['apiKey', 'authDomain', 'projectId', 'appId'];
  const missing = criticalKeys.filter(
    (key) => !firebaseConfig[key] || firebaseConfig[key] === 'your-api-key' || firebaseConfig[key] === 'your-project-id'
  );

  if (missing.length > 0) {
    console.warn(
      `⚠️ [Firebase Production Config Notice] Missing or placeholder environment variables: [${missing.join(', ')}]. ` +
      `Ensure VITE_FIREBASE_* variables are set in production or included in firebase-applet-config.json.`
    );
    return { isValid: false, missingKeys: missing };
  }
  return { isValid: true, missingKeys: [] };
}

// Perform synchronous startup validation
validateFirebaseConfig();

// Silence internal Firestore retry transport logs
setLogLevel('silent');

export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Lazy Auth instance: NEVER initialized eagerly on public landing pages.
// Using browserLocalPersistence without browserPopupRedirectResolver prevents the 93 KiB iframe.js from being injected!
let _cachedAuth: Auth | null = null;

export async function getLazyAuth(): Promise<Auth> {
  if (!_cachedAuth) {
    const { initializeAuth, browserLocalPersistence } = await import('firebase/auth');
    _cachedAuth = initializeAuth(app, {
      persistence: browserLocalPersistence
    });
  }
  return _cachedAuth;
}

// Auth proxy that provides safe synchronous access to currentUser without importing firebase/auth eagerly
export const auth = {
  get currentUser() {
    return _cachedAuth ? _cachedAuth.currentUser : null;
  }
} as any;

export async function getGoogleAuthProvider() {
  const { GoogleAuthProvider } = await import('firebase/auth');
  return new GoogleAuthProvider();
}

const dbId = firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)'
  ? firebaseConfig.firestoreDatabaseId
  : undefined;

// Configure Firestore with auto-detect long polling for maximum reliability across iframes and sandboxed environments
function initDb() {
  try {
    return initializeFirestore(app, {
      experimentalAutoDetectLongPolling: true,
    }, dbId);
  } catch {
    return dbId ? getFirestore(app, dbId) : getFirestore(app);
  }
}

export const db = initDb();

