import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User } from 'firebase/auth';

interface AuthContextType {
  user: User | null;
  idToken: string | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  idToken: null,
  loading: false,
  signInWithGoogle: async () => {},
  logout: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [idToken, setIdToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    // CRITICAL: Public landing visitors NEVER load firebase/auth or iframe.js
    // Only load if on admin/login page or if active session exists.
    const isAuthRoute = typeof window !== 'undefined' && (
      window.location.hash.includes('admin') || 
      window.location.hash.includes('login') ||
      Boolean(localStorage.getItem('raba_admin_session_auth'))
    );

    if (!isAuthRoute) {
      return;
    }

    const initTimer = setTimeout(async () => {
      try {
        const [{ getLazyAuth }, { onAuthStateChanged }] = await Promise.all([
          import('../lib/firebase'),
          import('firebase/auth')
        ]);
        const auth = await getLazyAuth();

        unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
          setUser(currentUser);
          if (currentUser) {
            try {
              const token = await currentUser.getIdToken();
              setIdToken(token);

              // Synchronize user record to backend Cloud SQL database
              await fetch('/api/auth/sync-user', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  displayName: currentUser.displayName,
                  photoUrl: currentUser.photoURL,
                }),
              });
            } catch (err) {
              console.error('Failed to sync auth token or user to backend:', err);
            }
          } else {
            setIdToken(null);
          }
          setLoading(false);
        });
      } catch (err) {
        console.warn('[AuthContext] Deferred Firebase Auth notice:', err);
      }
    }, 200);

    return () => {
      clearTimeout(initTimer);
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const signInWithGoogle = async () => {
    try {
      const [{ getLazyAuth, getGoogleAuthProvider }, { signInWithPopup }] = await Promise.all([
        import('../lib/firebase'),
        import('firebase/auth')
      ]);
      const auth = await getLazyAuth();
      const googleAuthProvider = await getGoogleAuthProvider();
      await signInWithPopup(auth, googleAuthProvider);
    } catch (err) {
      console.error('Sign-in error:', err);
      throw err;
    }
  };

  const logout = async () => {
    try {
      const [{ getLazyAuth }, { signOut }] = await Promise.all([
        import('../lib/firebase'),
        import('firebase/auth')
      ]);
      const auth = await getLazyAuth();
      await signOut(auth);
      setIdToken(null);
    } catch (err) {
      console.error('Sign-out error:', err);
      throw err;
    }
  };

  return (
    <AuthContext.Provider value={{ user, idToken, loading, signInWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
