import { initializeApp, getApps, getApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';
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

export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Lazy Auth instance: NEVER initialized eagerly on public landing pages.
let _cachedAuth: Auth | null = null;
let _authPromise: Promise<Auth> | null = null;

export async function getLazyAuth(): Promise<Auth> {
  if (_cachedAuth) return _cachedAuth;
  if (!_authPromise) {
    _authPromise = (async () => {
      const { initializeAuth, getAuth, browserLocalPersistence, browserPopupRedirectResolver } = await import('firebase/auth');
      try {
        _cachedAuth = initializeAuth(app, {
          persistence: browserLocalPersistence,
          popupRedirectResolver: browserPopupRedirectResolver,
        });
      } catch {
        _cachedAuth = getAuth(app);
      }
      return _cachedAuth;
    })();
  }
  return _authPromise;
}

// Auth proxy that provides safe synchronous access to currentUser without importing firebase/auth eagerly
export const auth = {
  get currentUser() {
    return _cachedAuth ? _cachedAuth.currentUser : null;
  }
} as any;

export async function getGoogleAuthProvider() {
  const { GoogleAuthProvider } = await import('firebase/auth');
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  return provider;
}

const dbId = firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)'
  ? firebaseConfig.firestoreDatabaseId
  : undefined;

let _cachedDb: Firestore | null = null;
let _dbPromise: Promise<Firestore> | null = null;
let _connectionTested = false;

// Lazy Firestore instance: decouples @firebase/firestore and re2js completely from initial critical bundle
// Returns an awaited Promise guaranteeing initializeApp + initializeFirestore/getFirestore complete before any write/read
export async function getLazyDb(): Promise<Firestore> {
  if (_cachedDb) return _cachedDb;
  if (!_dbPromise) {
    _dbPromise = (async () => {
      const configCheck = validateFirebaseConfig();
      if (!configCheck.isValid) {
        throw new Error(`Firebase configuration is incomplete: missing [${configCheck.missingKeys.join(', ')}]`);
      }

      const { getFirestore, initializeFirestore, setLogLevel, doc, getDocFromServer } = await import('firebase/firestore');
      // Log Firestore SDK errors cleanly in production so connectivity/rules issues are diagnosable
      setLogLevel('error');

      try {
        _cachedDb = initializeFirestore(app, {
          experimentalForceLongPolling: true,
        }, dbId);
      } catch {
        _cachedDb = dbId ? getFirestore(app, dbId) : getFirestore(app);
      }

      if (!_connectionTested && _cachedDb) {
        _connectionTested = true;
        const dbRef = _cachedDb;
        getDocFromServer(doc(dbRef, 'test', 'connection')).catch((error: any) => {
          const msg = error?.message || '';
          if (msg.includes('the client is offline')) {
            console.warn('[Firebase] Firestore client operating offline until connection recovers.');
          }
        });
      }

      return _cachedDb;
    })().catch((err) => {
      _dbPromise = null;
      throw err;
    });
  }
  return _dbPromise;
}

