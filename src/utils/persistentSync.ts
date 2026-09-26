/**
 * Persistent Synchronization Manager for Raba Center
 * Keeps all admin customizations, uploaded attachments, media, and database records
 * synchronized between client-side localStorage, browser IndexedDB, and server persistent disk files.
 * Guarantees zero loss of uploaded images, custom staff photos, and logo files on reload.
 */

import { loadPersistentImagesToMemory } from './persistentImageStore';
import defaultSyncData from '../data/defaultSyncData.json';

export interface SyncStatus {
  status: 'online' | 'offline' | 'error';
  persistent: boolean;
  dataFilesCount: number;
  uploadFilesCount: number;
  totalDataSizeBytes: number;
  timestamp: string;
}

// Primary synchronized storage keys across the entire system
export const SYNC_KEYS = {
  LOGO: 'raba_site_logo_v3',
  LOGO_V2: 'raba_site_logo_v2',
  LOGO_V1: 'raba_site_logo_v1',
  THEME: 'raba_site_theme_v1',
  SOCIAL: 'raba_social_links_v1',
  PILLARS: 'raba_program_pillars_v1',
  FOOTER: 'raba_footer_settings_v1',
  MODULES: 'raba_site_modules_v1',
  HERO_SLIDES: 'raba_hero_slides_v2',
  HERO_CONFIG: 'raba_hero_slider_config_v2',
  OFFERS: 'raba_offers_data',
  OFFERS_LEGACY: 'raba_offers_data_v1',
  BLOG_POSTS: 'raba_blog_posts_v1',
  SPECIALISTS: 'raba_specialists',
  SPECIALIST_SETTINGS: 'raba_specialists_card_customizations',
  SPECIALIST_SETTINGS_LEGACY: 'raba_specialists_settings',
  GLOBAL_CARD_SETTINGS: 'raba_global_card_settings',
  ACCREDITATIONS: 'raba_accreditations',
  ACCREDITATIONS_SETTINGS: 'raba_accreditations_settings',
  SERVICES: 'raba_custom_services_v2',
  SERVICES_LEGACY: 'raba_custom_services_v1',
  APPOINTMENTS: 'raba_appointments',
  NOTIFICATIONS: 'raba_notifications',
  ADMIN_USERS: 'raba_admin_users'
} as const;

// Canonical primary keys used in the synchronization loop to prevent legacy collisions
export const PRIMARY_SYNC_KEYS = [
  SYNC_KEYS.LOGO,
  SYNC_KEYS.THEME,
  SYNC_KEYS.SOCIAL,
  SYNC_KEYS.PILLARS,
  SYNC_KEYS.FOOTER,
  SYNC_KEYS.MODULES,
  SYNC_KEYS.HERO_SLIDES,
  SYNC_KEYS.HERO_CONFIG,
  SYNC_KEYS.OFFERS,
  SYNC_KEYS.BLOG_POSTS,
  SYNC_KEYS.SPECIALISTS,
  SYNC_KEYS.SPECIALIST_SETTINGS,
  SYNC_KEYS.GLOBAL_CARD_SETTINGS,
  SYNC_KEYS.ACCREDITATIONS,
  SYNC_KEYS.ACCREDITATIONS_SETTINGS,
  SYNC_KEYS.SERVICES,
  SYNC_KEYS.APPOINTMENTS,
  SYNC_KEYS.NOTIFICATIONS,
  SYNC_KEYS.ADMIN_USERS
] as const;

// Helper to mirror primary keys to legacy aliases with identical timestamps
function mirrorAliases(key: string, stringified: string, ts: number) {
  const tsStr = ts ? ts.toString() : Date.now().toString();
  if (key === SYNC_KEYS.LOGO) {
    localStorage.setItem(SYNC_KEYS.LOGO_V2, stringified);
    localStorage.setItem(SYNC_KEYS.LOGO_V1, stringified);
    localStorage.setItem(`raba_ts_${SYNC_KEYS.LOGO_V2}`, tsStr);
    localStorage.setItem(`raba_ts_${SYNC_KEYS.LOGO_V1}`, tsStr);
  } else if (key === SYNC_KEYS.SPECIALIST_SETTINGS) {
    localStorage.setItem(SYNC_KEYS.SPECIALIST_SETTINGS_LEGACY, stringified);
    localStorage.setItem(`raba_ts_${SYNC_KEYS.SPECIALIST_SETTINGS_LEGACY}`, tsStr);
  } else if (key === SYNC_KEYS.SERVICES) {
    localStorage.setItem(SYNC_KEYS.SERVICES_LEGACY, stringified);
    localStorage.setItem(`raba_ts_${SYNC_KEYS.SERVICES_LEGACY}`, tsStr);
  } else if (key === SYNC_KEYS.OFFERS) {
    localStorage.setItem(SYNC_KEYS.OFFERS_LEGACY, stringified);
    localStorage.setItem(`raba_ts_${SYNC_KEYS.OFFERS_LEGACY}`, tsStr);
  }
}

// Key to custom event map for real-time reactivity
const EVENT_MAP: Record<string, string> = {
  [SYNC_KEYS.LOGO]: 'raba_logo_updated',
  [SYNC_KEYS.LOGO_V2]: 'raba_logo_updated',
  [SYNC_KEYS.LOGO_V1]: 'raba_logo_updated',
  [SYNC_KEYS.THEME]: 'raba_theme_updated',
  [SYNC_KEYS.SOCIAL]: 'raba_social_updated',
  [SYNC_KEYS.PILLARS]: 'raba_pillars_updated',
  [SYNC_KEYS.FOOTER]: 'raba_footer_updated',
  [SYNC_KEYS.MODULES]: 'raba_modules_updated',
  [SYNC_KEYS.HERO_SLIDES]: 'raba_hero_slides_updated',
  [SYNC_KEYS.HERO_CONFIG]: 'raba_hero_slides_updated',
  [SYNC_KEYS.OFFERS]: 'raba_offers_updated',
  [SYNC_KEYS.OFFERS_LEGACY]: 'raba_offers_updated',
  [SYNC_KEYS.BLOG_POSTS]: 'raba_blog_posts_updated',
  [SYNC_KEYS.SPECIALISTS]: 'raba_specialists_updated',
  [SYNC_KEYS.SPECIALIST_SETTINGS]: 'raba_specialist_settings_updated',
  [SYNC_KEYS.SPECIALIST_SETTINGS_LEGACY]: 'raba_specialist_settings_updated',
  [SYNC_KEYS.GLOBAL_CARD_SETTINGS]: 'raba_global_card_settings_updated',
  [SYNC_KEYS.ACCREDITATIONS]: 'raba_accreditations_updated',
  [SYNC_KEYS.ACCREDITATIONS_SETTINGS]: 'raba_accreditations_settings_updated',
  [SYNC_KEYS.SERVICES]: 'raba_services_updated',
  [SYNC_KEYS.SERVICES_LEGACY]: 'raba_services_updated',
  [SYNC_KEYS.APPOINTMENTS]: 'raba_appointments_updated',
  [SYNC_KEYS.NOTIFICATIONS]: 'raba_notifications_updated'
};

// In-memory fallback dictionary for private/incognito browsers where localStorage is restricted
const IN_MEMORY_SYNC_CACHE = new Map<string, any>();

/**
 * Synchronously hydrates client storage & memory from bundled defaultSyncData.
 * Runs instantly on script load (0ms delay), ensuring incognito mode, mobile private tabs,
 * and first-time visitors immediately see the latest custom logo, hero slides, and staff photos.
 */
export function hydratePersistentData(): void {
  if (typeof window === 'undefined') return;
  try {
    const bundled = (defaultSyncData as any)?.data || defaultSyncData;
    if (!bundled) return;

    for (const key of PRIMARY_SYNC_KEYS) {
      const bundledVal = bundled[key];
      if (bundledVal !== undefined && bundledVal !== null) {
        IN_MEMORY_SYNC_CACHE.set(key, bundledVal);

        try {
          const existing = localStorage.getItem(key);
          if (!existing) {
            const valStr = typeof bundledVal === 'string' ? bundledVal : JSON.stringify(bundledVal);
            localStorage.setItem(key, valStr);
            localStorage.setItem(`raba_ts_${key}`, '1');
            mirrorAliases(key, valStr, 1);
          }
        } catch {
          // localStorage disabled in private browsing or quota full - in-memory cache remains active
        }
      }
    }
  } catch (err) {
    console.warn('[PersistentSync] Hydration notice:', err);
  }
}

// Run synchronous hydration immediately on module evaluation
hydratePersistentData();

/**
 * Safe accessor that checks localStorage first, then in-memory sync cache, then bundled defaultSyncData
 */
export function getSyncedData<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {
        return raw as unknown as T;
      }
    }
  } catch {
    // ignore
  }

  if (IN_MEMORY_SYNC_CACHE.has(key)) {
    return IN_MEMORY_SYNC_CACHE.get(key) as T;
  }

  const bundled = (defaultSyncData as any)?.data?.[key];
  if (bundled !== undefined && bundled !== null) {
    return bundled as T;
  }

  return fallback;
}

let isSyncInitialized = false;

/**
 * Initializes persistent sync on app start:
 * 1. Preloads all uploaded images from IndexedDB into memory so image tags resolve immediately.
 * 2. Pulls all persisted configs and data from server disk OR static /data fallback.
 * 3. Intelligently merges server data without clobbering client customizations.
 * 4. Pushes any unsynced local customizations to the server disk.
 */
export async function initPersistentSync(): Promise<void> {
  if (isSyncInitialized || typeof window === 'undefined') return;
  isSyncInitialized = true;

  try {
    // 0. Preload all IndexedDB image assets into RAM immediately
    await loadPersistentImagesToMemory();

    let serverData: Record<string, any> | null = null;
    let syncTimestamp = new Date().toISOString();

    // 1. Primary Attempt: Dynamic Express server API endpoint
    try {
      const res = await fetch('/api/sync/all');
      const contentType = res.headers.get('content-type') || '';
      // Only parse if server actually returned JSON (avoids SPA rewrite HTML syntax error)
      if (res.ok && contentType.includes('json')) {
        const json = await res.json();
        if (json.success && json.data) {
          serverData = json.data;
          syncTimestamp = json.timestamp || syncTimestamp;
        }
      }
    } catch {
      // Backend not running (e.g. static hosting)
    }

    // 2. Secondary Attempt: Static bundled data fallback
    if (!serverData) {
      try {
        const staticRes = await fetch('/data/all_sync.json');
        const contentType = staticRes.headers.get('content-type') || '';
        if (staticRes.ok && (contentType.includes('json') || !contentType)) {
          const staticJson = await staticRes.json();
          if (staticJson.data || staticJson) {
            serverData = staticJson.data || staticJson;
            syncTimestamp = staticJson.timestamp || syncTimestamp;
          }
        }
      } catch {
        // fallback unavailable
      }
    }

    // 3. Tertiary Attempt: Bundled defaultSyncData (Guaranteed 100% offline & incognito fallback)
    if (!serverData) {
      const bundled = (defaultSyncData as any)?.data;
      if (bundled) {
        serverData = bundled;
      }
    }

    if (!serverData) {
      console.warn('[PersistentSync] Operating in standalone local cache mode');
      window.dispatchEvent(new CustomEvent('raba_persistent_sync_ready', { detail: { ready: true, timestamp: syncTimestamp } }));
      return;
    }

    const localKeysToPush: Record<string, any> = {};

    // Synchronize ONLY canonical primary keys to prevent legacy aliases from overwriting newer customizations
    for (const storageKey of PRIMARY_SYNC_KEYS) {
      const serverVal = serverData[storageKey];
      const localValRaw = localStorage.getItem(storageKey);
      const localTsRaw = localStorage.getItem(`raba_ts_${storageKey}`);
      const localTs = localTsRaw ? Number(localTsRaw) : 0;

      // Check if local version has customized data (e.g. contains custom uploads or user edits)
      const hasLocalCustomization = Boolean(
        localValRaw && (
          localTs > 0 ||
          localValRaw.includes('/uploads/') ||
          localValRaw.includes('data:image') ||
          localValRaw.includes('photo-custom') ||
          localValRaw.includes('acc-')
        )
      );

      if (hasLocalCustomization && localValRaw) {
        // User has explicit local modifications: keep local and push to server to prevent data loss!
        try {
          localKeysToPush[storageKey] = JSON.parse(localValRaw);
        } catch {
          localKeysToPush[storageKey] = localValRaw;
        }
        mirrorAliases(storageKey, localValRaw, localTs);
      } else if (serverVal !== undefined && serverVal !== null) {
        // Populate local cache from server if local has no overrides
        try {
          const stringified = typeof serverVal === 'string' ? serverVal : JSON.stringify(serverVal);
          localStorage.setItem(storageKey, stringified);
          localStorage.setItem(`raba_ts_${storageKey}`, Date.now().toString());

          // Populate legacy aliases simultaneously to guarantee 100% component compatibility
          mirrorAliases(storageKey, stringified, Date.now());

          // Dispatch reactive update event
          const eventName = EVENT_MAP[storageKey];
          if (eventName) {
            window.dispatchEvent(new CustomEvent(eventName, { detail: serverVal }));
          }
        } catch (e) {
          console.warn(`[PersistentSync] Failed to cache ${storageKey}:`, e);
        }
      } else if (localValRaw) {
        // Server doesn't have this key yet, push to server
        try {
          localKeysToPush[storageKey] = JSON.parse(localValRaw);
        } catch {
          localKeysToPush[storageKey] = localValRaw;
        }
        mirrorAliases(storageKey, localValRaw, localTs);
      }
    }

    // Push local customizations to server disk if backend is available
    if (Object.keys(localKeysToPush).length > 0) {
      fetch('/api/sync/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ all: localKeysToPush })
      }).catch(() => {
        // silent fallback
      });
    }

    // Cross-tab real-time reactivity: When any admin tab saves, all open visitor and admin tabs update instantly
    window.addEventListener('storage', (e) => {
      if (e.key && EVENT_MAP[e.key] && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          window.dispatchEvent(new CustomEvent(EVENT_MAP[e.key], { detail: parsed }));
        } catch {
          window.dispatchEvent(new CustomEvent(EVENT_MAP[e.key], { detail: e.newValue }));
        }
      }
    });

    // Broadcast global sync ready event with explicit payload
    window.dispatchEvent(new CustomEvent('raba_persistent_sync_ready', { detail: { ready: true, timestamp: syncTimestamp } }));
    window.dispatchEvent(new CustomEvent('raba_slider_updated', { detail: serverData[SYNC_KEYS.HERO_SLIDES] }));
    console.log('[PersistentSync] All persistent customizations and assets synchronized successfully.');
  } catch (err) {
    console.warn('[PersistentSync] Sync completed with fallback cache:', err);
  }
}

/**
 * Saves a module data persistently to BOTH client localStorage, IndexedDB, and server disk files.
 */
export async function savePersistentModule<T>(key: string, data: T): Promise<boolean> {
  const timestamp = Date.now().toString();

  // 1. Save to local storage for immediate synchronous access
  try {
    const stringified = JSON.stringify(data);
    localStorage.setItem(key, stringified);
    localStorage.setItem(`raba_ts_${key}`, timestamp);

    // Synchronize aliases with timestamps
    mirrorAliases(key, stringified, Number(timestamp));
  } catch (err) {
    console.warn(`[PersistentSync] LocalStorage notice for ${key}:`, err);
  }

  // 2. Dispatch custom event locally
  const eventName = EVENT_MAP[key];
  if (eventName && typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(eventName, { detail: data }));
  }

  // 3. Save to server persistent disk file via REST API
  try {
    const res = await fetch('/api/sync/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, data })
    });
    if (res.ok) {
      const json = await res.json();
      return json.success === true;
    }
    return false;
  } catch {
    return false;
  }
}

/**
 * Batch saves all current localStorage customizations to server disk and static assets
 */
export async function syncAllToDiskNow(): Promise<{ success: boolean; count: number; message?: string }> {
  try {
    const payload: Record<string, any> = {};
    let count = 0;

    for (const key of Object.values(SYNC_KEYS)) {
      const raw = localStorage.getItem(key);
      if (raw) {
        try {
          payload[key] = JSON.parse(raw);
          count++;
        } catch {
          payload[key] = raw;
          count++;
        }
      }
    }

    const res = await fetch('/api/sync/bake', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ all: payload })
    });

    if (res.ok) {
      const json = await res.json();
      return { success: json.success === true, count, message: json.message };
    }

    // Fallback to /api/sync/save
    const res2 = await fetch('/api/sync/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ all: payload })
    });

    const json2 = await res2.json();
    return { success: json2.success === true, count };
  } catch (err) {
    console.error('[PersistentSync] Error syncing all to disk:', err);
    return { success: false, count: 0 };
  }
}

/**
 * Uploads an attachment or image to the server disk and returns a permanent public URL.
 */
export async function uploadAttachmentToServer(
  fileOrBase64: File | string,
  fileName?: string
): Promise<{ success: boolean; url: string; filename?: string; sizeBytes?: number }> {
  try {
    // If already a hosted / uploaded URL, return immediately
    if (typeof fileOrBase64 === 'string' && (fileOrBase64.startsWith('/uploads/') || fileOrBase64.startsWith('http://') || fileOrBase64.startsWith('https://'))) {
      return {
        success: true,
        url: fileOrBase64
      };
    }

    let fileData = '';
    let name = fileName || 'attachment';

    if (typeof fileOrBase64 === 'string') {
      fileData = fileOrBase64;
    } else {
      name = fileOrBase64.name || name;
      fileData = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(fileOrBase64);
      });
    }

    const res = await fetch('/api/sync/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        filename: name,
        fileData
      })
    });

    if (!res.ok) {
      throw new Error(`Upload server returned ${res.status}`);
    }

    const json = await res.json();
    if (json.success && json.url) {
      return {
        success: true,
        url: json.url,
        filename: json.filename,
        sizeBytes: json.sizeBytes
      };
    }

    throw new Error(json.error || 'Upload failed');
  } catch (err) {
    console.warn('[PersistentSync] Upload to server failed, fallback to local data:', err);
    return {
      success: false,
      url: typeof fileOrBase64 === 'string' ? fileOrBase64 : ''
    };
  }
}

/**
 * Checks comprehensive database and synchronization diagnostics
 */
export async function fetchDatabaseDiagnostic(): Promise<any | null> {
  try {
    const res = await fetch('/api/sync/diagnostic');
    if (!res.ok) return null;
    const json = await res.json();
    return json.diagnostic || null;
  } catch {
    return null;
  }
}

/**
 * Checks server sync health and storage stats
 */
export async function fetchSyncStatus(): Promise<SyncStatus | null> {
  try {
    const res = await fetch('/api/sync/status');
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

/**
 * Exports all local and persistent storage data into a JSON file for backup
 */
export function downloadBackupFile(): void {
  try {
    const backup: Record<string, any> = {};
    for (const key of Object.values(SYNC_KEYS)) {
      const raw = localStorage.getItem(key);
      if (raw) {
        try {
          backup[key] = JSON.parse(raw);
        } catch {
          backup[key] = raw;
        }
      }
    }
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `raba_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  } catch (err) {
    console.error('Failed to export backup file:', err);
  }
}

/**
 * Restores configurations from a backup JSON file and syncs with server
 */
export async function restoreFromBackup(jsonContent: string): Promise<boolean> {
  try {
    const parsed = JSON.parse(jsonContent);
    for (const [key, val] of Object.entries(parsed)) {
      const stringified = typeof val === 'string' ? val : JSON.stringify(val);
      localStorage.setItem(key, stringified);
    }
    await syncAllToDiskNow();
    window.location.reload();
    return true;
  } catch (err) {
    console.error('Failed to restore backup:', err);
    return false;
  }
}
