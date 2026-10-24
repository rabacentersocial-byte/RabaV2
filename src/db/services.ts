import { db } from './index.ts';
import { services } from './schema.ts';

// In-memory cache for services with 60-second TTL
let cachedServices: any[] | null = null;
let lastServicesCacheTime = 0;
const SERVICES_CACHE_TTL_MS = 60_000;

export async function getDbServices() {
  if (cachedServices && Date.now() - lastServicesCacheTime < SERVICES_CACHE_TTL_MS) {
    return cachedServices;
  }
  try {
    const results = await db.select().from(services);
    cachedServices = results;
    lastServicesCacheTime = Date.now();
    return results;
  } catch (error) {
    console.error('Failed to fetch services from database:', error);
    return cachedServices || [];
  }
}

/**
 * Bulk synchronization eliminating N+1 sequential insert queries.
 */
export async function syncDbServices(servicesList: any[]): Promise<boolean> {
  if (!Array.isArray(servicesList) || servicesList.length === 0) return true;
  try {
    const rows = servicesList.map(s => ({
      title: s.title || s.name || 'خدمة تأهيلية',
      description: s.description || '',
      category: s.category || '',
      icon: s.icon || '',
      price: s.price ? String(s.price) : '',
    }));

    await db.delete(services);
    if (rows.length > 0) {
      await db.insert(services).values(rows);
    }

    cachedServices = null;
    return true;
  } catch (error) {
    console.error('Failed to sync services to database table:', error);
    return false;
  }
}
