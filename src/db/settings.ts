import { db } from './index.ts';
import { siteSettings } from './schema.ts';
import { eq } from 'drizzle-orm';

// In-memory cache for Cloud SQL settings with TTL & instant invalidation
let cachedSettingsMap: Record<string, any> | null = null;
let lastSettingsCacheTime = 0;
const SETTINGS_CACHE_TTL_MS = 30_000;

export async function getDbSetting(key: string): Promise<any | null> {
  // Check memory cache first
  if (cachedSettingsMap && Date.now() - lastSettingsCacheTime < SETTINGS_CACHE_TTL_MS) {
    if (cachedSettingsMap[key] !== undefined) {
      return cachedSettingsMap[key];
    }
  }

  try {
    const result = await db.select().from(siteSettings).where(eq(siteSettings.key, key));
    if (result.length > 0) {
      let parsed: any;
      try {
        parsed = JSON.parse(result[0].data);
      } catch {
        parsed = result[0].data;
      }
      if (cachedSettingsMap) {
        cachedSettingsMap[key] = parsed;
      }
      return parsed;
    }
    return null;
  } catch (error) {
    console.error(`Database query failed for setting ${key}:`, error);
    return null;
  }
}

export async function getAllDbSettings(): Promise<Record<string, any>> {
  if (cachedSettingsMap && Date.now() - lastSettingsCacheTime < SETTINGS_CACHE_TTL_MS) {
    return cachedSettingsMap;
  }

  try {
    const results = await db.select().from(siteSettings);
    const map: Record<string, any> = {};
    for (const row of results) {
      try {
        map[row.key] = JSON.parse(row.data);
      } catch {
        map[row.key] = row.data;
      }
    }
    cachedSettingsMap = map;
    lastSettingsCacheTime = Date.now();
    return map;
  } catch (error) {
    console.error('Database query failed for all settings:', error);
    return cachedSettingsMap || {};
  }
}

export async function saveDbSetting(key: string, data: any): Promise<boolean> {
  try {
    const serialized = typeof data === 'string' ? data : JSON.stringify(data);
    await db.insert(siteSettings)
      .values({
        key,
        data: serialized,
      })
      .onConflictDoUpdate({
        target: siteSettings.key,
        set: {
          data: serialized,
          updatedAt: new Date(),
        },
      });

    // Update in-memory cache immediately
    if (cachedSettingsMap) {
      cachedSettingsMap[key] = data;
      lastSettingsCacheTime = Date.now();
    }
    return true;
  } catch (error) {
    console.error(`Database save failed for setting ${key}:`, error);
    return false;
  }
}

export function invalidateDbSettingsCache(): void {
  cachedSettingsMap = null;
  lastSettingsCacheTime = 0;
}
