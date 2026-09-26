/**
 * Persistent Image & Asset Store using browser IndexedDB.
 * Completely immune to localStorage 5MB quota limitations.
 * Survives hard page reloads, browser restarts, and server container resets.
 * Ensures zero loss of custom uploaded specialist photos, slider graphics, logos, and badges.
 */

const DB_NAME = 'raba_persistent_assets_db';
const DB_VERSION = 1;
const STORE_NAME = 'uploaded_images';

let dbPromise: Promise<IDBDatabase> | null = null;
const IN_MEMORY_IMAGE_CACHE = new Map<string, string>();

function getDb(): Promise<IDBDatabase> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('IndexedDB unavailable in non-browser environment'));
  }

  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      try {
        const request = window.indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;
          if (!db.objectStoreNames.contains(STORE_NAME)) {
            db.createObjectStore(STORE_NAME);
          }
        };

        request.onsuccess = (event) => {
          resolve((event.target as IDBOpenDBRequest).result);
        };

        request.onerror = (event) => {
          console.warn('[PersistentImageStore] Failed to open IndexedDB:', (event.target as IDBOpenDBRequest).error);
          reject((event.target as IDBOpenDBRequest).error);
        };
      } catch (err) {
        reject(err);
      }
    });
  }

  return dbPromise;
}

/**
 * Preloads all persistent images from IndexedDB into memory on application startup
 */
export async function loadPersistentImagesToMemory(): Promise<void> {
  try {
    const images = await getAllPersistentImages();
    for (const [key, val] of Object.entries(images)) {
      IN_MEMORY_IMAGE_CACHE.set(key, val);
      if (key.includes('/')) {
        const filename = key.split('/').pop();
        if (filename) IN_MEMORY_IMAGE_CACHE.set(filename, val);
      }
    }
  } catch (err) {
    console.warn('[PersistentImageStore] Memory preload notice:', err);
  }
}

/**
 * Synchronous image resolver:
 * If an image has been cached in IndexedDB / Memory, returns its dataURL synchronously!
 */
export function getResolvedImageUrl(src?: string): string {
  if (!src) return '';
  if (src.startsWith('data:') || src.startsWith('blob:')) return src;

  if (IN_MEMORY_IMAGE_CACHE.has(src)) {
    return IN_MEMORY_IMAGE_CACHE.get(src)!;
  }

  if (src.includes('/')) {
    const filename = src.split('/').pop();
    if (filename && IN_MEMORY_IMAGE_CACHE.has(filename)) {
      return IN_MEMORY_IMAGE_CACHE.get(filename)!;
    }
  }

  // If a custom base URL is used in production (other than '/')
  const base = (typeof import.meta !== 'undefined' && import.meta.env?.BASE_URL) || '/';
  if (base !== '/' && src.startsWith('/') && !src.startsWith(base)) {
    return `${base.replace(/\/$/, '')}${src}`;
  }

  return src;
}

/**
 * Saves an image or base64 dataUrl under a persistent key or URL
 */
export async function savePersistentImage(keyOrUrl: string, dataUrl: string): Promise<boolean> {
  if (!keyOrUrl || !dataUrl) return false;

  // Cache in memory immediately
  IN_MEMORY_IMAGE_CACHE.set(keyOrUrl, dataUrl);
  if (keyOrUrl.includes('/')) {
    const cleanName = keyOrUrl.split('/').pop();
    if (cleanName) {
      IN_MEMORY_IMAGE_CACHE.set(cleanName, dataUrl);
    }
  }

  try {
    const db = await getDb();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.put(dataUrl, keyOrUrl);

      if (keyOrUrl.includes('/')) {
        const cleanName = keyOrUrl.split('/').pop();
        if (cleanName) {
          store.put(dataUrl, cleanName);
        }
      }

      tx.oncomplete = () => resolve(true);
      tx.onerror = () => resolve(false);
    });
  } catch (err) {
    console.warn('[PersistentImageStore] Save error:', err);
    return false;
  }
}

/**
 * Retrieves a persistent image dataUrl by its URL or key
 */
export async function getPersistentImage(keyOrUrl: string): Promise<string | null> {
  if (!keyOrUrl) return null;

  if (IN_MEMORY_IMAGE_CACHE.has(keyOrUrl)) {
    return IN_MEMORY_IMAGE_CACHE.get(keyOrUrl)!;
  }
  if (keyOrUrl.includes('/')) {
    const cleanName = keyOrUrl.split('/').pop();
    if (cleanName && IN_MEMORY_IMAGE_CACHE.has(cleanName)) {
      return IN_MEMORY_IMAGE_CACHE.get(cleanName)!;
    }
  }

  try {
    const db = await getDb();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(keyOrUrl);

      req.onsuccess = () => {
        if (req.result) {
          const res = req.result as string;
          IN_MEMORY_IMAGE_CACHE.set(keyOrUrl, res);
          resolve(res);
        } else if (keyOrUrl.includes('/')) {
          // Try clean filename fallback
          const cleanName = keyOrUrl.split('/').pop();
          if (cleanName) {
            const req2 = store.get(cleanName);
            req2.onsuccess = () => {
              const res2 = (req2.result as string) || null;
              if (res2) IN_MEMORY_IMAGE_CACHE.set(cleanName, res2);
              resolve(res2);
            };
            req2.onerror = () => resolve(null);
            return;
          }
          resolve(null);
        } else {
          resolve(null);
        }
      };

      req.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

/**
 * Retrieves all stored images as a dictionary
 */
export async function getAllPersistentImages(): Promise<Record<string, string>> {
  try {
    const db = await getDb();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const dict: Record<string, string> = {};

      const req = store.openCursor();
      req.onsuccess = (e) => {
        const cursor = (e.target as IDBRequest<IDBCursorWithValue>).result;
        if (cursor) {
          if (typeof cursor.key === 'string' && typeof cursor.value === 'string') {
            dict[cursor.key] = cursor.value;
          }
          cursor.continue();
        } else {
          resolve(dict);
        }
      };
      req.onerror = () => resolve({});
    });
  } catch {
    return {};
  }
}

/**
 * Global helper for HTML image error events:
 * If an uploaded image returned 404 from server, check IndexedDB before falling back to default!
 */
export async function handleImageErrorWithStore(
  e: React.SyntheticEvent<HTMLImageElement, Event>,
  originalSrc: string,
  fallbackSrc?: string
): Promise<void> {
  const target = e.target as HTMLImageElement;
  if (!target || !originalSrc) return;

  const currentAttempt = Number(target.dataset.retryAttempt || 0);

  // Attempt 1: Try encoded URI if original has special characters
  if (currentAttempt === 0) {
    target.dataset.retryAttempt = '1';
    try {
      const encoded = encodeURI(originalSrc);
      if (encoded !== originalSrc && target.src !== encoded) {
        target.src = encoded;
        return;
      }
    } catch { /* ignore */ }
  }

  // Attempt 2: Try relative path without leading slash
  if (currentAttempt <= 1 && originalSrc.startsWith('/')) {
    target.dataset.retryAttempt = '2';
    const relative = originalSrc.replace(/^\/+/, '');
    if (target.src !== relative) {
      target.src = relative;
      return;
    }
  }

  // Attempt 3: Try looking up from persistent IndexedDB store
  if (currentAttempt <= 2) {
    target.dataset.retryAttempt = '3';
    try {
      const cached = await getPersistentImage(originalSrc);
      if (cached && target.src !== cached) {
        target.src = cached;
        return;
      }
    } catch {
      // ignore
    }
  }

  // Final fallback: Use designated fallback image if provided
  target.dataset.retryAttempt = '4';
  if (fallbackSrc && target.src !== fallbackSrc) {
    target.src = fallbackSrc;
  }
}
