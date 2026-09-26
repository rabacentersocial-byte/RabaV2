import { db } from './index.ts';
import { specialists } from './schema.ts';
import { eq } from 'drizzle-orm';

export interface SpecialistDbRecord {
  id?: number;
  name: string;
  title: string;
  specialty: string;
  image?: string;
  bio?: string;
  experience?: string;
  rating?: string;
}

export async function getDbSpecialists() {
  try {
    return await db.select().from(specialists);
  } catch (error) {
    console.error('Failed to fetch specialists from database:', error);
    return [];
  }
}

export async function syncDbSpecialists(specialistList: any[]): Promise<boolean> {
  if (!Array.isArray(specialistList) || specialistList.length === 0) return true;
  try {
    // Clear and re-populate specialists table to mirror current list
    await db.delete(specialists);
    for (const spec of specialistList) {
      await db.insert(specialists).values({
        name: spec.name || spec.arabicName || 'أخصائي',
        title: spec.title || '',
        specialty: spec.specialty || spec.specialtyCode || '',
        image: spec.avatar || spec.image || '',
        bio: spec.bio || '',
        experience: spec.experienceYears ? `${spec.experienceYears} سنوات` : '',
        rating: spec.rating ? String(spec.rating) : '5.0',
      });
    }
    return true;
  } catch (error) {
    console.error('Failed to sync specialists to database table:', error);
    return false;
  }
}
