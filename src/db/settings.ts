import { db } from './index.ts';
import { siteSettings } from './schema.ts';
import { eq } from 'drizzle-orm';

export async function getDbSetting(key: string): Promise<any | null> {
  try {
    const result = await db.select().from(siteSettings).where(eq(siteSettings.key, key));
    if (result.length > 0) {
      try {
        return JSON.parse(result[0].data);
      } catch {
        return result[0].data;
      }
    }
    return null;
  } catch (error) {
    console.error(`Database query failed for setting ${key}:`, error);
    return null;
  }
}

export async function getAllDbSettings(): Promise<Record<string, any>> {
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
    return map;
  } catch (error) {
    console.error('Database query failed for all settings:', error);
    return {};
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
    return true;
  } catch (error) {
    console.error(`Database save failed for setting ${key}:`, error);
    return false;
  }
}
