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

export const KNOWN_STATIC_ALIASES: Record<string, string> = {
  // Specialists
  '/uploads/1790357520279_________________jpg_jpeg.jpg': '/images/specialists/haneen_obaidi.jpg',
  '/uploads/1790357530423_________________jpg_jpeg.jpg': '/images/specialists/rahaf_doghmani.jpg',
  '/uploads/1790357539758_____________jpg_jpeg.jpg': '/images/specialists/doha_khaled.jpg',
  '/uploads/1790357549806______________jpg_jpeg.jpg': '/images/specialists/manar_wahba.jpg',
  '/uploads/1790357579245_______________jpg_jpeg.jpg': '/images/specialists/ahmed_fathi.jpg',
  '/uploads/1790357588113______________jpg_jpeg.jpg': '/images/specialists/mohamed_atef.jpg',
  '/uploads/1790357598308______________________jpg_jpeg.jpg': '/images/specialists/sadeem_mshari.jpg',
  '/uploads/1790357606704______________jpg_jpeg.jpg': '/images/specialists/maram_mohamed.jpg',
  '/uploads/1790357615959______________jpg_jpeg.jpg': '/images/specialists/ahmed_raad.jpg',
  '/uploads/1790357622619________________jpeg.jpg': '/images/specialists/ahmed_abouzeid.jpg',
  // Hero
  '/uploads/1790357979807_Screenshot_2569-09-23_at_2_25_17_AM_png.png': '/images/hero/slide_1_haneen.png',
  '/uploads/1790358006694________________jpeg.jpg': '/images/hero/slide_2_ahmed.jpg',
  '/uploads/1790358033686_Screenshot_2569-09-23_at_2_25_29_AM_png.png': '/images/hero/slide_3_rahaf.png',
  '/uploads/1790358050734_Screenshot_2569-09-23_at_2_26_05_AM_png.png': '/images/hero/slide_4_doha.png',
  '/uploads/1790358074567_Screenshot_2569-09-23_at_2_27_08_AM_png.png': '/images/hero/slide_5_manar.png',
  '/uploads/1790358094657_Screenshot_2569-09-22_at_2_07_53_PM_png.png': '/images/hero/slide_6_fathi.png',
  '/uploads/1790358114735_Screenshot_2569-09-23_at_2_25_47_AM_png.png': '/images/hero/slide_7_specialist.png',
  '/uploads/1790358142609_Screenshot_2569-09-23_at_2_26_16_AM_png.png': '/images/hero/slide_8_specialist.png',
  // Accreditations
  '/uploads/1790357652181_ISO-Logo_webp.jpg': '/images/accreditations/iso_logo.jpg',
  '/uploads/1790357668910_ibao_webp.jpg': '/images/accreditations/ibao_logo.jpg',
  '/uploads/1790357681328_qaba_webp.jpg': '/images/accreditations/qaba_logo.jpg',
  '/uploads/1790357693975_IMG_6729_jpg.jpg': '/images/accreditations/cert_1.jpg',
  '/uploads/1790357709799_IMG_6728_png_jpeg.jpg': '/images/accreditations/cert_2.jpg',
  // Logo
  '/uploads/1790358266500_logo_transparent_transparent_png.png': '/logo/raba_puzzle_brain.png',
};

/**
 * Synchronous image resolver:
 * If an image has been cached in IndexedDB / Memory, returns its dataURL synchronously!
 */
export function getResolvedImageUrl(src?: string): string {
  if (!src) return '';
  if (src.startsWith('data:') || src.startsWith('blob:')) return src;

  // Direct alias match to permanent bundled asset
  if (KNOWN_STATIC_ALIASES[src]) {
    return KNOWN_STATIC_ALIASES[src];
  }

  if (IN_MEMORY_IMAGE_CACHE.has(src)) {
    return IN_MEMORY_IMAGE_CACHE.get(src)!;
  }

  if (src.includes('/')) {
    const filename = src.split('/').pop();
    if (filename) {
      const aliasKey = `/uploads/${filename}`;
      if (KNOWN_STATIC_ALIASES[aliasKey]) {
        return KNOWN_STATIC_ALIASES[aliasKey];
      }
      if (IN_MEMORY_IMAGE_CACHE.has(filename)) {
        return IN_MEMORY_IMAGE_CACHE.get(filename)!;
      }
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

  // Attempt 1: Direct permanent static asset alias
  if (currentAttempt === 0) {
    target.dataset.retryAttempt = '1';
    const alias = KNOWN_STATIC_ALIASES[originalSrc] || (originalSrc.includes('/') ? KNOWN_STATIC_ALIASES[`/uploads/${originalSrc.split('/').pop()}`] : undefined);
    if (alias && target.src !== alias) {
      target.src = alias;
      return;
    }
  }

  // Attempt 2: Try looking up from persistent IndexedDB store
  if (currentAttempt <= 1) {
    target.dataset.retryAttempt = '2';
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

  // Attempt 3: Try encoded URI if original has special characters
  if (currentAttempt <= 2) {
    target.dataset.retryAttempt = '3';
    try {
      const encoded = encodeURI(originalSrc);
      if (encoded !== originalSrc && target.src !== encoded) {
        target.src = encoded;
        return;
      }
    } catch { /* ignore */ }
  }

  // Final fallback: Use designated fallback image or alias
  target.dataset.retryAttempt = '4';
  const resolvedFallback = fallbackSrc ? (KNOWN_STATIC_ALIASES[fallbackSrc] || fallbackSrc) : undefined;
  if (resolvedFallback && target.src !== resolvedFallback) {
    target.src = resolvedFallback;
  }
}
