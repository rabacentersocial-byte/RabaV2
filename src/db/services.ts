import { db } from './index.ts';
import { services } from './schema.ts';

export async function getDbServices() {
  try {
    return await db.select().from(services);
  } catch (error) {
    console.error('Failed to fetch services from database:', error);
    return [];
  }
}

export async function syncDbServices(servicesList: any[]): Promise<boolean> {
  if (!Array.isArray(servicesList) || servicesList.length === 0) return true;
  try {
    await db.delete(services);
    for (const s of servicesList) {
      await db.insert(services).values({
        title: s.title || s.name || 'خدمة تأهيلية',
        description: s.description || '',
        category: s.category || '',
        icon: s.icon || '',
        price: s.price ? String(s.price) : '',
      });
    }
    return true;
  } catch (error) {
    console.error('Failed to sync services to database table:', error);
    return false;
  }
}
