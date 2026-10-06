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
  // Specialists 1 to 40 complete static aliases
  '/uploads/1790357520279_________________jpg_jpeg.jpg': '/specialists/cards/spec_01_haneen-obaidi.jpg',
  '/uploads/1790357530423_________________jpg_jpeg.jpg': '/specialists/cards/spec_02_rahaf-doghmani.jpg',
  '/uploads/1790357539758_____________jpg_jpeg.jpg': '/specialists/cards/spec_03_doha-khaled.jpg',
  '/uploads/1790357549806______________jpg_jpeg.jpg': '/specialists/cards/spec_04_manar-wahba.jpg',
  '/uploads/1790357579245_______________jpg_jpeg.jpg': '/specialists/cards/spec_05_ahmed-fathi.jpg',
  '/uploads/1790357588113______________jpg_jpeg.jpg': '/specialists/cards/spec_06_mohamed-atef.jpg',
  '/uploads/1790357598308______________________jpg_jpeg.jpg': '/specialists/cards/spec_07_sadeem-mshari.jpg',
  '/uploads/1790357606704______________jpg_jpeg.jpg': '/specialists/cards/spec_08_maram-mohamed.jpg',
  '/uploads/1790357615959______________jpg_jpeg.jpg': '/specialists/cards/spec_09_ahmed-raad.jpg',
  '/uploads/1790357622619________________jpeg.jpg': '/specialists/cards/spec_10_1.png',
  '/uploads/1790826219680_16_png.png': '/specialists/cards/spec_10_1.png',
  '/uploads/1790826142955_1_png.png': '/specialists/cards/spec_11_mohamed-saad.png',
  '/uploads/1790826125079_2_png.png': '/specialists/cards/spec_12_alzahraa-farag.png',
  '/uploads/1790826321411_3_png.png': '/specialists/cards/spec_13_noura-elbasyouni.png',
  '/uploads/1790826279297_4_png.png': '/specialists/cards/spec_14_asmaa-moustafa.png',
  '/uploads/1790826241596_5_png.png': '/specialists/cards/spec_15_ayman-elhoweity.png',
  '/uploads/1790826439548_6_png.png': '/specialists/cards/spec_16_mohamed-bakry.png',
  '/uploads/1790826509139_7_png.png': '/specialists/cards/spec_17_anwar-elmaghyouli.png',
  '/uploads/1790826577879_9_png.png': '/specialists/cards/spec_18_mohamed-abdelhamid.png',
  '/uploads/1790826687565_10_png.png': '/specialists/cards/spec_19_mohamed-elgayyar.png',
  '/uploads/1790826711609_11_png.png': '/specialists/cards/spec_20_elsaeed-diab.png',
  '/uploads/1790827397368_38_png.png': '/specialists/cards/spec_21_sara-abdelhamid.png',
  '/uploads/1790827426491_50_png.png': '/specialists/cards/spec_22_hanaa-basheer.png',
  '/uploads/1790863548373_12_png.png': '/specialists/cards/spec_23_bayan-alnajem.png',
  '/uploads/1790865956621_13_png.png': '/specialists/cards/spec_24_manar-obeid.png',
  '/uploads/1790865973849_14_png.png': '/specialists/cards/spec_25_salma-abouelfadl.png',
  '/uploads/1790865993782_15_png.png': '/specialists/cards/spec_26_ahmed-sayed.png',
  '/uploads/1790866017691_17_png.png': '/specialists/cards/spec_27_heshmah-mutairi.png',
  '/uploads/1790866040732_19_png.png': '/specialists/cards/spec_28_aseel-yousef.png',
  '/uploads/1790866057132_21_png.png': '/specialists/cards/spec_29_mohammed-shehri-clinical.png',
  '/uploads/1790866075647_22_png.png': '/specialists/cards/spec_30_saad-dosari.png',
  '/uploads/1790866092167_23_png.png': '/specialists/cards/spec_31_fahad-juhani.png',
  '/uploads/1790866107078_24_png.png': '/specialists/cards/spec_32_hala-enazi.png',
  '/uploads/1790866122845_25_png.png': '/specialists/cards/spec_33_taif-subaie.png',
  '/uploads/1790866151823_26_png.png': '/specialists/cards/spec_34_raghad-hawarneh.png',
  '/uploads/1790866167869_27_png.png': '/specialists/cards/spec_35_eman-bahattab.png',
  '/uploads/1790866182582_28_png.png': '/specialists/cards/spec_36_omar-saad-speech.png',
  '/uploads/1790866202949_29_png.png': '/specialists/cards/spec_37_aliah-mutairi.png',
  '/uploads/1790866269363_30_png.png': '/specialists/cards/spec_38_haya-faleh.png',
  '/uploads/1790866288993_31_png.png': '/specialists/cards/spec_39_haya-dosari.png',
  '/uploads/1790866298707_32_png.png': '/specialists/cards/spec_40_renad-otaibi.png',
  '/uploads/1791187379881_60_png.png': '/specialists/cards/spec_60_hesham-ali.png',
  '/uploads/1791187395677_61_png.png': '/specialists/cards/spec_61_amer-qadoos.png',
  '/uploads/1791192101630________________png.png': '/specialists/cards/spec_ahlam-alnoaman.png',
  '/uploads/1791192114276_______________png.png': '/specialists/cards/spec_atheer-alrasheed.png',
  '/uploads/1791192126580____________png.png': '/specialists/cards/spec_tasneem-sabry.png',
  '/uploads/1791192139635__________________png.png': '/specialists/cards/spec_tasneem-abdelaziz.png',
  '/uploads/1791192158941________________png.png': '/specialists/cards/spec_jawaher-ibrahim.png',
  '/uploads/1791192167745___________png.png': '/specialists/cards/spec_hossam-samy.png',
  '/uploads/1791192175779_____________png.png': '/specialists/cards/spec_khaled-alharbi.png',
  '/uploads/1791192184198______________png.png': '/specialists/cards/spec_reema-alhusseini.png',
  '/uploads/1791192194710______________png.png': '/specialists/cards/spec_sultan-alshaye.png',
  '/uploads/1791192202894____________png.png': '/specialists/cards/spec_shaimaa-adel.png',
  '/uploads/1791192213481______________png.png': '/specialists/cards/spec_abdelilah-shakl.png',
  '/uploads/1791192231188_________________png.png': '/specialists/cards/spec_alaa-eldin-nagy.png',
  '/uploads/1791192244901______________png.png': '/specialists/cards/spec_ghalib-alotaibi.png',
  '/uploads/1791192253778__________png.png': '/specialists/cards/spec_kareem-ragab.png',
  '/uploads/1791192261779_____________png.png': '/specialists/cards/spec_marwa-alsharif.png',
  '/uploads/1791192271638_____________png.png': '/specialists/cards/spec_mostafa-mahmoud.png',
  '/uploads/1791192282250_____________png.png': '/specialists/cards/spec_mayar-alsaeed.png',
  '/uploads/1791192291320____________png.png': '/specialists/cards/spec_hala-badran.png',
  '/uploads/1791192301426___________png.png': '/specialists/cards/spec_hind-elsayed.png',
  '/uploads/1791192310187______________png.png': '/specialists/cards/spec_haitham-alzaidan.png',

  // Partners aliases
  '/uploads/1791026786793___jpeg.png': '/images/partners/partner-moi_custom.png',
  '/uploads/1791193458089_19_png.png': '/images/partners/partner-state-security_custom.png',
  '/uploads/1791026921748_images__3__jpeg.png': '/images/partners/partner-state-security_custom.png',
  '/uploads/1791027187602_images__4__jpeg.png': '/images/partners/partner-national-guard_custom.png',
  '/uploads/1791193476456_15_png.png': '/images/partners/partner-mngha_custom.png',
  '/uploads/1791027121841_mngha-news-theme-rollup-new_webp.png': '/images/partners/partner-mngha_custom.png',
  '/uploads/1791027041155_mngha-news-theme-rollup-new_webp.png': '/images/partners/partner-mngha_custom.png',
  '/uploads/1791027283718_images_png.png': '/images/partners/partner-misa_custom.png',
  '/uploads/1791193489878_17_png.png': '/images/partners/partner-mewa_custom.png',
  '/uploads/1791027309246____jpg.png': '/images/partners/partner-mewa_custom.png',
  '/uploads/1791028465545__________________________png.png': '/images/partners/partner-dgda_custom.png',
  '/uploads/1791027404133_images__1__png.png': '/images/partners/partner-sba_custom.png',
  '/uploads/1791193502303_5_png.png': '/images/partners/partner-ksu_custom.png',
  '/uploads/1791028062765____________________jpg.png': '/images/partners/partner-ksu_custom.png',
  '/uploads/1791028087376____jpeg.png': '/images/partners/partner-stc_custom.png',
  '/uploads/1791028117456______________png.png': '/images/partners/partner-diriyah_custom.png',
  '/uploads/1791028131920____jpeg.png': '/images/partners/partner-el-seif_custom.png',
  '/uploads/1791027494176___jpg.png': '/images/partners/partner-el-seif_custom.png',
  '/uploads/1791193512416_2_png.png': '/images/partners/partner-emkan_custom.png',
  '/uploads/1791027474814_images__5__jpeg.png': '/images/partners/partner-emkan_custom.png',
  '/uploads/partner-tamara_logo.png': '/images/partners/partner-tamara_custom.png',
  '/uploads/1791193521800_16_png.png': '/images/partners/partner-itizaz_custom.png',
  '/uploads/1791027693138_nn_webp.png': '/images/partners/partner-itizaz_custom.png',
  '/uploads/1791027763524_images__2__png.png': '/images/partners/partner-faisaliah_custom.png',
  '/uploads/partner-rais_logo.png': '/images/partners/partner-rais_custom.png',
  '/uploads/1791027957093____jpg.png': '/images/partners/partner-delta_custom.png',
  '/uploads/1791193531635_9_png.png': '/images/partners/partner-my-character_custom.png',
  '/uploads/1791028191433________jpeg.png': '/images/partners/partner-my-character_custom.png',

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
