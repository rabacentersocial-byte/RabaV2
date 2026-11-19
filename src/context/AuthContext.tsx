import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
import type { User } from 'firebase/auth';
import type { ClientProfile } from '../types';

interface AuthContextType {
  user: User | null;
  idToken: string | null;
  clientProfile: ClientProfile | null;
  loading: boolean;
  profileLoading: boolean;
  authReady: boolean;
  signInWithGoogle: () => Promise<User>;
  signInWithEmail: (email: string, password: string) => Promise<User>;
  registerWithEmail: (email: string, password: string) => Promise<User>;
  sendPasswordReset: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshClientProfile: () => Promise<ClientProfile | null>;
  setClientProfile: React.Dispatch<React.SetStateAction<ClientProfile | null>>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  idToken: null,
  clientProfile: null,
  loading: false,
  profileLoading: false,
  authReady: false,
  signInWithGoogle: async () => {
    throw new Error('AuthProvider not initialized');
  },
  signInWithEmail: async () => {
    throw new Error('AuthProvider not initialized');
  },
  registerWithEmail: async () => {
    throw new Error('AuthProvider not initialized');
  },
  sendPasswordReset: async () => {},
  logout: async () => {},
  refreshClientProfile: async () => null,
  setClientProfile: () => {},
});

const CLIENT_SESSION_KEY = 'raba_client_session';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [idToken, setIdToken] = useState<string | null>(null);
  const [clientProfile, setClientProfile] = useState<ClientProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return (
      window.location.pathname.toLowerCase().startsWith('/portal') ||
      window.location.hash.toLowerCase().includes('login') ||
      Boolean(localStorage.getItem(CLIENT_SESSION_KEY))
    );
  });
  const [profileLoading, setProfileLoading] = useState<boolean>(false);
  const [authReady, setAuthReady] = useState<boolean>(false);

  const authUnsubRef = useRef<(() => void) | null>(null);
  const profileUnsubRef = useRef<(() => void) | null>(null);
  const authInitStartedRef = useRef<boolean>(false);

  const attachProfileListener = useCallback(async (uid: string) => {
    if (profileUnsubRef.current) {
      profileUnsubRef.current();
      profileUnsubRef.current = null;
    }
    setProfileLoading(true);
    try {
      const { getClientProfileFromFirestore, subscribeClientProfile } = await import('../services/firestoreService');
      const initial = await getClientProfileFromFirestore(uid);
      setClientProfile(initial);
      setProfileLoading(false);

      profileUnsubRef.current = subscribeClientProfile(
        uid,
        (profile) => {
          setClientProfile(profile);
          setProfileLoading(false);
        },
        () => {
          setProfileLoading(false);
        }
      );
    } catch {
      setProfileLoading(false);
    }
  }, []);

  const ensureAuthListener = useCallback(async () => {
    if (authInitStartedRef.current) return;
    authInitStartedRef.current = true;
    try {
      const [{ getLazyAuth }, { onAuthStateChanged }] = await Promise.all([
        import('../lib/firebase'),
        import('firebase/auth'),
      ]);
      const auth = await getLazyAuth();

      if (typeof (auth as any).authStateReady === 'function') {
        await (auth as any).authStateReady();
      }

      authUnsubRef.current = onAuthStateChanged(auth, async (currentUser) => {
        setUser(currentUser);
        setAuthReady(true);
        setLoading(false);

        if (currentUser) {
          try {
            localStorage.setItem(CLIENT_SESSION_KEY, '1');
          } catch {
            // ignore
          }

          attachProfileListener(currentUser.uid);

          try {
            const token = await currentUser.getIdToken();
            setIdToken(token);

            // Best-effort sync to Express backend if running
            fetch('/api/auth/sync-user', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                displayName: currentUser.displayName,
                photoUrl: currentUser.photoURL,
              }),
            }).catch(() => {});
          } catch (err) {
            console.warn('[AuthContext] Token retrieval notice:', err);
          }
        } else {
          if (profileUnsubRef.current) {
            profileUnsubRef.current();
            profileUnsubRef.current = null;
          }
          setClientProfile(null);
          setProfileLoading(false);
          setIdToken(null);
          try {
            localStorage.removeItem(CLIENT_SESSION_KEY);
          } catch {
            // ignore
          }
        }
      });
    } catch (err) {
      authInitStartedRef.current = false;
      setLoading(false);
      setAuthReady(true);
      console.warn('[AuthContext] Deferred Firebase Auth notice:', err);
    }
  }, [attachProfileListener]);

  useEffect(() => {
    const isAuthContextActive =
      typeof window !== 'undefined' &&
      (window.location.pathname.toLowerCase().startsWith('/portal') ||
        window.location.hash.toLowerCase().includes('admin') ||
        window.location.hash.toLowerCase().includes('login') ||
        Boolean(localStorage.getItem('raba_admin_session_auth')) ||
        Boolean(localStorage.getItem(CLIENT_SESSION_KEY)));

    if (!isAuthContextActive) {
      return;
    }

    const timer = setTimeout(() => {
      ensureAuthListener();
    }, 50);

    return () => {
      clearTimeout(timer);
      if (authUnsubRef.current) {
        authUnsubRef.current();
        authUnsubRef.current = null;
      }
      if (profileUnsubRef.current) {
        profileUnsubRef.current();
        profileUnsubRef.current = null;
      }
      authInitStartedRef.current = false;
    };
  }, [ensureAuthListener]);

  const signInWithGoogle = async (): Promise<User> => {
    await ensureAuthListener();
    const [{ getLazyAuth, getGoogleAuthProvider }, { signInWithPopup }] = await Promise.all([
      import('../lib/firebase'),
      import('firebase/auth'),
    ]);
    const auth = await getLazyAuth();
    const googleAuthProvider = await getGoogleAuthProvider();
    const cred = await signInWithPopup(auth, googleAuthProvider);
    setUser(cred.user);
    try {
      localStorage.setItem(CLIENT_SESSION_KEY, '1');
    } catch {
      // ignore
    }
    return cred.user;
  };

  const signInWithEmail = async (email: string, password: string): Promise<User> => {
    await ensureAuthListener();
    const [{ getLazyAuth }, { signInWithEmailAndPassword }] = await Promise.all([
      import('../lib/firebase'),
      import('firebase/auth'),
    ]);
    const auth = await getLazyAuth();
    const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
    setUser(cred.user);
    try {
      localStorage.setItem(CLIENT_SESSION_KEY, '1');
    } catch {
      // ignore
    }
    return cred.user;
  };

  const registerWithEmail = async (email: string, password: string): Promise<User> => {
    await ensureAuthListener();
    const [{ getLazyAuth }, { createUserWithEmailAndPassword }] = await Promise.all([
      import('../lib/firebase'),
      import('firebase/auth'),
    ]);
    const auth = await getLazyAuth();
    const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
    setUser(cred.user);
    try {
      localStorage.setItem(CLIENT_SESSION_KEY, '1');
    } catch {
      // ignore
    }
    return cred.user;
  };

  const sendPasswordReset = async (email: string): Promise<void> => {
    const [{ getLazyAuth }, { sendPasswordResetEmail }] = await Promise.all([
      import('../lib/firebase'),
      import('firebase/auth'),
    ]);
    const auth = await getLazyAuth();
    await sendPasswordResetEmail(auth, email.trim());
  };

  const refreshClientProfile = async (): Promise<ClientProfile | null> => {
    if (!user?.uid) return null;
    setProfileLoading(true);
    try {
      const { getClientProfileFromFirestore } = await import('../services/firestoreService');
      const profile = await getClientProfileFromFirestore(user.uid);
      setClientProfile(profile);
      return profile;
    } finally {
      setProfileLoading(false);
    }
  };

  const logout = async () => {
    try {
      const [{ getLazyAuth }, { signOut }] = await Promise.all([
        import('../lib/firebase'),
        import('firebase/auth'),
      ]);
      const auth = await getLazyAuth();
      await signOut(auth);
      if (profileUnsubRef.current) {
        profileUnsubRef.current();
        profileUnsubRef.current = null;
      }
      setUser(null);
      setClientProfile(null);
      setIdToken(null);
      try {
        localStorage.removeItem(CLIENT_SESSION_KEY);
      } catch {
        // ignore
      }
    } catch (err) {
      console.error('Sign-out error:', err);
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        idToken,
        clientProfile,
        loading,
        profileLoading,
        authReady,
        signInWithGoogle,
        signInWithEmail,
        registerWithEmail,
        sendPasswordReset,
        logout,
        refreshClientProfile,
        setClientProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
