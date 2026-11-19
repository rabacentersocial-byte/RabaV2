import { Specialist } from '../types';
import { Doctor } from '../components/DoctorCardSlider';

/**
 * Normalizes Arabic names to handle variations in hamzas, ta marbuta,
 * alif maqsura, titles (د., د/, أ.), and spacing.
 */
export function normalizeSpecialistName(name: string): string {
  if (!name) return '';
  return name
    .toLowerCase()
    .trim()
    // Strip titles and honorific prefixes
    .replace(/^(د[\/\.\s]+|دكتور[ة]?\s+|أ[\/\.\s]+|أستاذ[ة]?\s+|استاذ[ة]?\s+|أخصائي[ة]?\s+|اخصائي[ة]?\s+|الاستاذ[ة]?\s+|الأستاذ[ة]?\s+)/g, '')
    // Normalize alif with hamza / madda
    .replace(/[أإآا]/g, 'ا')
    // Normalize taa marbuta / haa
    .replace(/[ةه]/g, 'ه')
    // Normalize ya / alif maqsura
    .replace(/[يى]/g, 'ي')
    // Strip Arabic harakat/tashkeel
    .replace(/[\u064B-\u0652]/g, '')
    // Collapse consecutive whitespaces
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Returns a compact spaceless key for robust Arabic comparison.
 * e.g., 'محمد عبد الحميد' matches 'محمد عبدالحميد'
 */
export function getSpecialistNameKey(name: string): string {
  return normalizeSpecialistName(name).replace(/\s+/g, '');
}

/**
 * Normalizes specialist ID across formats (doc-, spec-, raw numbers/aliases).
 */
export function normalizeSpecialistId(id: string): string {
  if (!id) return '';
  const clean = id.trim().toLowerCase().replace(/^(doc|spec)-/, '');
  // Known alias for Ahmed Abouzeid
  if (clean === '1' || clean === 'ahmed-abouzeid' || clean === 'ahmed_abouzeid') {
    return 'ahmed-abouzeid';
  }
  return clean;
}

/**
 * Tests if two specialists or doctors represent the same person.
 */
export function isSameSpecialist(
  personA: { id: string; name: string },
  personB: { id: string; name: string }
): boolean {
  if (!personA || !personB) return false;

  const idA = normalizeSpecialistId(personA.id);
  const idB = normalizeSpecialistId(personB.id);
  if (idA && idB && idA === idB) return true;

  const nameKeyA = getSpecialistNameKey(personA.name);
  const nameKeyB = getSpecialistNameKey(personB.name);
  if (nameKeyA && nameKeyB && nameKeyA === nameKeyB) return true;

  // Substring check for extended names (e.g., 'سديم المشاري' vs 'سديم احمد المشاري')
  if (nameKeyA.length >= 6 && nameKeyB.length >= 6) {
    if (nameKeyA.includes(nameKeyB) || nameKeyB.includes(nameKeyA)) {
      return true;
    }
  }

  return false;
}

/**
 * Returns strict user-requested priority sorting index for core specialists:
 * 1. هناء بشير (0)
 * 2. أحمد أبو زيد (1)
 * 3. هشام علي (2)
 * 4. حنين العبيدي (3)
 * 5. عامر قادوس (4)
 * 6. ضحى خالد (5)
 * 7. حشمة المطيري (6)
 * Other specialists: 999
 */
export function getSpecialistPriorityIndex(name: string, id?: string): number {
  if (id) {
    const cleanId = normalizeSpecialistId(id);
    if (cleanId === 'hanaa-basheer') return 0;
    if (cleanId === 'ahmed-abouzeid' || cleanId === '1') return 1;
    if (cleanId === 'hesham-ali') return 2;
    if (cleanId === 'haneen-obaidi') return 3;
    if (cleanId === 'amer-qadoos') return 4;
    if (cleanId === 'doha-khaled') return 5;
    if (cleanId === 'heshmah-mutairi') return 6;
  }
  if (!name) return 999;
  const n = normalizeSpecialistName(name);
  if ((n.includes('هناء') || n.includes('هنا')) && (n.includes('بشير') || n.includes('علي'))) return 0;
  if (n.includes('ابو زيد') || n.includes('ابوزيد') || n.includes('احمد ابو زيد')) return 1;
  if (n.includes('هشام') && (n.includes('علي') || n.includes('سلامه') || n.includes('سلامة'))) return 2;
  if (n.includes('حنين') && (n.includes('العبيدي') || n.includes('عبيدي'))) return 3;
  if (n.includes('عامر') && (n.includes('قادوس') || n.includes('قدوس'))) return 4;
  if ((n.includes('ضحي') || n.includes('ضحى')) && n.includes('خالد')) return 5;
  if ((n.includes('حشمه') || n.includes('حشمة')) && (n.includes('المطيري') || n.includes('مطيري'))) return 6;
  return 999;
}

export function sortSpecialistsByPriority<T extends { name: string; id?: string }>(list: T[]): T[] {
  if (!Array.isArray(list)) return [];
  return [...list].sort((a, b) => {
    const pA = getSpecialistPriorityIndex(a.name, a.id);
    const pB = getSpecialistPriorityIndex(b.name, b.id);
    if (pA !== pB) return pA - pB;
    return 0;
  });
}

/**
 * Deduplicates an array of Specialists, merging duplicates so that the
 * most complete data (richest bio, image, specialties) is preserved.
 */
export function deduplicateSpecialists(list: Specialist[]): Specialist[] {
  if (!Array.isArray(list)) return [];
  const result: Specialist[] = [];
  const seenIds = new Set<string>();
  const seenNameKeys = new Set<string>();

  for (const item of list) {
    if (!item || !item.name) continue;

    const normId = normalizeSpecialistId(item.id);
    const nameKey = getSpecialistNameKey(item.name);

    // Find existing matching record
    const existingIndex = result.findIndex(existing => isSameSpecialist(existing, item));

    if (existingIndex >= 0) {
      // Preserve primary/first (already-edited/stored) record fields, only filling empty fields from fallback
      const current = result[existingIndex];
      const merged: Specialist = {
        ...item,
        ...current,
        bio: current.bio?.trim() ? current.bio : item.bio,
        bioEn: current.bioEn?.trim() ? current.bioEn : item.bioEn,
        avatar: current.avatar?.trim() ? current.avatar : item.avatar,
        rating: current.rating || item.rating || 4.9,
        reviewsCount: current.reviewsCount ?? item.reviewsCount ?? 1,
        experienceYears: current.experienceYears ?? item.experienceYears ?? 1,
        specialties: (current.specialties && current.specialties.length > 0)
          ? current.specialties
          : item.specialties,
        certifications: (current.certifications && current.certifications.length > 0)
          ? current.certifications
          : item.certifications,
      };
      result[existingIndex] = merged;
    } else {
      result.push({ ...item });
      if (normId) seenIds.add(normId);
      if (nameKey) seenNameKeys.add(nameKey);
    }
  }

  return sortSpecialistsByPriority(result);
}

/**
 * Deduplicates an array of Doctors, preserving primary/edited values first and filling missing fallbacks.
 */
export function deduplicateDoctors(list: Doctor[]): Doctor[] {
  if (!Array.isArray(list)) return [];
  const result: Doctor[] = [];

  for (const item of list) {
    if (!item || !item.name) continue;

    const existingIndex = result.findIndex(existing => isSameSpecialist(existing, item));

    if (existingIndex >= 0) {
      const current = result[existingIndex];
      result[existingIndex] = {
        ...item,
        ...current,
        bio: current.bio?.trim() ? current.bio : item.bio,
        avatar: current.avatar?.trim() ? current.avatar : item.avatar,
        image: current.image?.trim() ? current.image : (current.avatar || item.image || item.avatar),
        fallbackAvatar: current.fallbackAvatar || item.fallbackAvatar || item.avatar,
        rating: current.rating || item.rating || 4.9,
        reviewCount: current.reviewCount ?? item.reviewCount ?? 100,
        experienceYears: current.experienceYears ?? item.experienceYears ?? 1,
        tags: (current.tags && current.tags.length > 0) ? current.tags : item.tags,
      };
    } else {
      result.push({ ...item });
    }
  }

  return sortSpecialistsByPriority(result);
}
