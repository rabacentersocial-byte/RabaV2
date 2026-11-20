import { useEffect, useRef, useState } from 'react';
import type { Unsubscribe } from 'firebase/firestore';
import { getLazyAuth, getLazyDb } from '../lib/firebase';

export interface RealtimeDocumentResult<T> {
  data: T | null;
  loading: boolean;
  exists: boolean;
  error: Error | null;
  fromCache: boolean;
}

export interface UseRealtimeDocumentOptions<T> {
  fallback?: T;
  enabled?: boolean;
  requireAuth?: boolean;
  unwrapSettingData?: boolean;
  transform?: (raw: any, id: string) => T;
}

export interface RealtimeCollectionResult<T> {
  data: T[];
  loading: boolean;
  empty: boolean;
  error: Error | null;
  fromCache: boolean;
}

export interface UseRealtimeCollectionOptions<T> {
  fallback?: T[];
  enabled?: boolean;
  requireAuth?: boolean;
  orderByField?: string;
  orderDirection?: 'asc' | 'desc';
  transformDoc?: (id: string, data: any) => T | null;
}

/**
 * Subscribes to a single Firestore document in real time via `onSnapshot`.
 * Starts in a clean `loading: true` state with zero stale `localStorage` reads,
 * hydrates directly from `docSnap.data()`, logs explicit production diagnostics on errors,
 * and tears down its listener on unmount.
 */
export function useRealtimeDocument<T = Record<string, any>>(
  collectionName: string,
  docId: string | null | undefined,
  options: UseRealtimeDocumentOptions<T> = {}
): RealtimeDocumentResult<T> {
  const {
    fallback,
    enabled = true,
    requireAuth = false,
    unwrapSettingData = false,
  } = options;

  const transformRef = useRef(options.transform);
  transformRef.current = options.transform;

  const fallbackRef = useRef(fallback);
  fallbackRef.current = fallback;

  const [state, setState] = useState<RealtimeDocumentResult<T>>({
    data: null,
    loading: Boolean(enabled && docId),
    exists: false,
    error: null,
    fromCache: false,
  });

  useEffect(() => {
    if (!enabled || !docId) {
      setState({
        data: fallbackRef.current !== undefined ? fallbackRef.current : null,
        loading: false,
        exists: false,
        error: null,
        fromCache: false,
      });
      return;
    }

    let cancelled = false;
    let docUnsub: Unsubscribe | null = null;
    let authUnsub: (() => void) | null = null;

    setState((prev) => ({
      ...prev,
      loading: true,
      error: null,
    }));

    const attachDocListener = async () => {
      try {
        const [fs, db] = await Promise.all([
          import('firebase/firestore'),
          getLazyDb(),
        ]);
        if (cancelled) return;

        const docRef = fs.doc(db, collectionName, docId);
        docUnsub = fs.onSnapshot(
          docRef,
          (docSnap) => {
            if (cancelled) return;
            const fromCache = Boolean(docSnap.metadata?.fromCache);

            if (!docSnap.exists()) {
              setState({
                data: fallbackRef.current !== undefined ? fallbackRef.current : null,
                loading: false,
                exists: false,
                error: null,
                fromCache,
              });
              return;
            }

            const rawDoc = docSnap.data();
            const unwrapped =
              unwrapSettingData && rawDoc && rawDoc.data !== undefined
                ? rawDoc.data
                : rawDoc;
            const resolved = transformRef.current
              ? transformRef.current(unwrapped, docSnap.id)
              : (unwrapped as T);

            setState({
              data: resolved,
              loading: false,
              exists: true,
              error: null,
              fromCache,
            });
          },
          (error) => {
            console.error(
              '[Firestore Live Sync Error]:',
              (error as any)?.code || 'unknown',
              (error as any)?.message || error
            );
            if (cancelled) return;
            setState({
              data: fallbackRef.current !== undefined ? fallbackRef.current : null,
              loading: false,
              exists: false,
              error: error instanceof Error ? error : new Error(String(error)),
              fromCache: false,
            });
          }
        );
      } catch (err: any) {
        console.error(
          '[Firestore Live Sync Error]:',
          err?.code || 'init-failed',
          err?.message || err
        );
        if (cancelled) return;
        setState({
          data: fallbackRef.current !== undefined ? fallbackRef.current : null,
          loading: false,
          exists: false,
          error: err instanceof Error ? err : new Error(String(err)),
          fromCache: false,
        });
      }
    };

    if (requireAuth) {
      getLazyAuth()
        .then(async (authInstance) => {
          if (cancelled) return;
          if (typeof (authInstance as any).authStateReady === 'function') {
            await (authInstance as any).authStateReady();
          }
          if (cancelled) return;

          if (authInstance.currentUser) {
            await attachDocListener();
          } else {
            setState({
              data: fallbackRef.current !== undefined ? fallbackRef.current : null,
              loading: false,
              exists: false,
              error: null,
              fromCache: false,
            });
          }

          const { onAuthStateChanged } = await import('firebase/auth');
          if (cancelled) return;
          authUnsub = onAuthStateChanged(authInstance, (fbUser) => {
            if (cancelled) return;
            if (docUnsub) {
              docUnsub();
              docUnsub = null;
            }
            if (fbUser) {
              void attachDocListener();
            } else {
              setState({
                data: fallbackRef.current !== undefined ? fallbackRef.current : null,
                loading: false,
                exists: false,
                error: null,
                fromCache: false,
              });
            }
          });
        })
        .catch((err) => {
          console.error(
            '[Firestore Live Sync Error]:',
            err?.code || 'auth-failed',
            err?.message || err
          );
        });
    } else {
      void attachDocListener();
    }

    return () => {
      cancelled = true;
      if (docUnsub) docUnsub();
      if (authUnsub) authUnsub();
    };
  }, [collectionName, docId, enabled, requireAuth, unwrapSettingData]);

  return state;
}

/**
 * Subscribes to a Firestore collection in real time via `onSnapshot`.
 * Starts in a clean `loading: true` state with `data: []`, hydrates exclusively from
 * `querySnapshot.docs`, logs explicit production diagnostics on errors, and properly
 * unsubscribes on unmount.
 */
export function useRealtimeCollection<T = Record<string, any>>(
  collectionName: string,
  options: UseRealtimeCollectionOptions<T> = {}
): RealtimeCollectionResult<T> {
  const {
    fallback,
    enabled = true,
    requireAuth = false,
    orderByField,
    orderDirection = 'asc',
  } = options;

  const transformDocRef = useRef(options.transformDoc);
  transformDocRef.current = options.transformDoc;

  const fallbackRef = useRef(fallback);
  fallbackRef.current = fallback;

  const [state, setState] = useState<RealtimeCollectionResult<T>>({
    data: [],
    loading: Boolean(enabled && collectionName),
    empty: true,
    error: null,
    fromCache: false,
  });

  useEffect(() => {
    if (!enabled || !collectionName) {
      const fb = fallbackRef.current ?? [];
      setState({
        data: fb,
        loading: false,
        empty: fb.length === 0,
        error: null,
        fromCache: false,
      });
      return;
    }

    let cancelled = false;
    let colUnsub: Unsubscribe | null = null;
    let authUnsub: (() => void) | null = null;

    setState((prev) => ({
      ...prev,
      loading: true,
      error: null,
    }));

    const attachColListener = async (useOrderBy: boolean) => {
      try {
        const [fs, db] = await Promise.all([
          import('firebase/firestore'),
          getLazyDb(),
        ]);
        if (cancelled) return;

        if (colUnsub) {
          colUnsub();
          colUnsub = null;
        }

        const colRef = fs.collection(db, collectionName);
        const targetQuery =
          useOrderBy && orderByField
            ? fs.query(colRef, fs.orderBy(orderByField, orderDirection))
            : colRef;

        colUnsub = fs.onSnapshot(
          targetQuery,
          (querySnapshot) => {
            if (cancelled) return;
            const fromCache = Boolean(querySnapshot.metadata?.fromCache);

            const items: T[] = [];
            querySnapshot.docs.forEach((docSnap) => {
              const raw = docSnap.data();
              if (transformDocRef.current) {
                const mapped = transformDocRef.current(docSnap.id, raw);
                if (mapped !== null) items.push(mapped);
              } else {
                items.push({ id: docSnap.id, ...raw } as T);
              }
            });

            if (items.length === 0 && fallbackRef.current && fallbackRef.current.length > 0) {
              setState({
                data: fallbackRef.current,
                loading: false,
                empty: true,
                error: null,
                fromCache,
              });
              return;
            }

            setState({
              data: items,
              loading: false,
              empty: querySnapshot.empty,
              error: null,
              fromCache,
            });
          },
          (error) => {
            const code = (error as any)?.code || 'unknown';
            const message = (error as any)?.message || String(error);
            if (
              useOrderBy &&
              orderByField &&
              (code === 'failed-precondition' || message.toLowerCase().includes('index'))
            ) {
              void attachColListener(false);
              return;
            }
            console.error('[Firestore Live Sync Error]:', code, message);
            if (cancelled) return;
            const fb = fallbackRef.current ?? [];
            setState({
              data: fb,
              loading: false,
              empty: fb.length === 0,
              error: error instanceof Error ? error : new Error(message),
              fromCache: false,
            });
          }
        );
      } catch (err: any) {
        console.error(
          '[Firestore Live Sync Error]:',
          err?.code || 'init-failed',
          err?.message || err
        );
        if (cancelled) return;
        const fb = fallbackRef.current ?? [];
        setState({
          data: fb,
          loading: false,
          empty: fb.length === 0,
          error: err instanceof Error ? err : new Error(String(err)),
          fromCache: false,
        });
      }
    };

    if (requireAuth) {
      getLazyAuth()
        .then(async (authInstance) => {
          if (cancelled) return;
          if (typeof (authInstance as any).authStateReady === 'function') {
            await (authInstance as any).authStateReady();
          }
          if (cancelled) return;

          if (authInstance.currentUser) {
            await attachColListener(Boolean(orderByField));
          } else {
            const fb = fallbackRef.current ?? [];
            setState({
              data: fb,
              loading: false,
              empty: fb.length === 0,
              error: null,
              fromCache: false,
            });
          }

          const { onAuthStateChanged } = await import('firebase/auth');
          if (cancelled) return;
          authUnsub = onAuthStateChanged(authInstance, (fbUser) => {
            if (cancelled) return;
            if (colUnsub) {
              colUnsub();
              colUnsub = null;
            }
            if (fbUser) {
              void attachColListener(Boolean(orderByField));
            } else {
              const fb = fallbackRef.current ?? [];
              setState({
                data: fb,
                loading: false,
                empty: fb.length === 0,
                error: null,
                fromCache: false,
              });
            }
          });
        })
        .catch((err) => {
          console.error(
            '[Firestore Live Sync Error]:',
            err?.code || 'auth-failed',
            err?.message || err
          );
        });
    } else {
      void attachColListener(Boolean(orderByField));
    }

    return () => {
      cancelled = true;
      if (colUnsub) colUnsub();
      if (authUnsub) authUnsub();
    };
  }, [collectionName, enabled, requireAuth, orderByField, orderDirection]);

  return state;
}
