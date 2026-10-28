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
    // Only eagerly initialize Firebase if on admin/login page or if active session exists.
    // For general public visitors, defer to 5s to eliminate TBT and ensure near-100 mobile performance.
    const isAuthRoute = typeof window !== 'undefined' && (
      window.location.hash.includes('admin') || 
      window.location.hash.includes('login') ||
      Boolean(localStorage.getItem('raba_admin_session_auth'))
    );
    const delay = isAuthRoute ? 100 : 5000;

    const initTimer = setTimeout(async () => {
      try {
        const [{ auth }, { onAuthStateChanged }] = await Promise.all([
          import('../lib/firebase'),
          import('firebase/auth')
        ]);

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
    }, delay);

    return () => {
      clearTimeout(initTimer);
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const signInWithGoogle = async () => {
    try {
      const [{ auth, googleAuthProvider }, { signInWithPopup }] = await Promise.all([
        import('../lib/firebase'),
        import('firebase/auth')
      ]);
      await signInWithPopup(auth, googleAuthProvider);
    } catch (err) {
      console.error('Sign-in error:', err);
      throw err;
    }
  };

  const logout = async () => {
    try {
      const [{ auth }, { signOut }] = await Promise.all([
        import('../lib/firebase'),
        import('firebase/auth')
      ]);
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
