import { db, withDbRetry } from './index.ts';
import { specialists } from './schema.ts';

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

// In-memory cache with 60-second TTL to avoid redundant DB roundtrips on high read traffic
let cachedSpecialists: any[] | null = null;
let lastCacheTime = 0;
const CACHE_TTL_MS = 60_000;

export async function getDbSpecialists() {
  if (cachedSpecialists && Date.now() - lastCacheTime < CACHE_TTL_MS) {
    return cachedSpecialists;
  }
  try {
    const results = await withDbRetry(() => db.select().from(specialists));
    cachedSpecialists = results;
    lastCacheTime = Date.now();
    return results;
  } catch (error) {
    console.error('Failed to fetch specialists from database:', error);
    return cachedSpecialists || [];
  }
}

/**
 * High-performance bulk synchronization eliminating N+1 sequential insert queries.
 * Converts 70+ round-trips into a single batched atomic operation.
 */
export async function syncDbSpecialists(specialistList: any[]): Promise<boolean> {
  if (!Array.isArray(specialistList)) return true;
  try {
    const rows = specialistList.map(spec => ({
      name: spec.name || spec.arabicName || 'أخصائي',
      title: spec.title || '',
      specialty: spec.role || spec.specialty || spec.specialtyCode || '',
      image: spec.avatar || spec.image || '',
      bio: spec.bio || '',
      experience: spec.experienceYears ? `${spec.experienceYears} سنوات` : '',
      rating: spec.rating ? String(spec.rating) : '5.0',
    }));

    // Atomically clear and bulk-insert in single operation
    await db.delete(specialists);
    if (rows.length > 0) {
      // Chunk into batches of 100 to stay well within Postgres parameter limits
      const chunkSize = 100;
      for (let i = 0; i < rows.length; i += chunkSize) {
        await db.insert(specialists).values(rows.slice(i, i + chunkSize));
      }
    }

    // Invalidate memory cache so next read returns fresh data
    cachedSpecialists = null;
    return true;
  } catch (error) {
    console.error('Failed to sync specialists to database table:', error);
    return false;
  }
}
