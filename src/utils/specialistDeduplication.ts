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
      // Merge: keep the most complete version
      const current = result[existingIndex];
      const merged: Specialist = {
        ...current,
        // Prefer longer biography if available
        bio: (item.bio && item.bio.length > (current.bio?.length || 0)) ? item.bio : current.bio,
        bioEn: (item.bioEn && item.bioEn.length > (current.bioEn?.length || 0)) ? item.bioEn : current.bioEn,
        // Prefer clean /images/specialists/ avatar if current doesn't have it or is empty
        avatar: item.avatar && (item.avatar.startsWith('/images/specialists/') || !current.avatar) 
          ? item.avatar 
          : (current.avatar || item.avatar),
        // Prefer higher rating or more reviews
        rating: Math.max(current.rating || 0, item.rating || 0),
        reviewsCount: Math.max(current.reviewsCount || 0, item.reviewsCount || 0),
        experienceYears: Math.max(current.experienceYears || 0, item.experienceYears || 0),
        specialties: (item.specialties && item.specialties.length > (current.specialties?.length || 0)) 
          ? item.specialties 
          : current.specialties,
        certifications: (item.certifications && item.certifications.length > (current.certifications?.length || 0)) 
          ? item.certifications 
          : current.certifications,
      };
      result[existingIndex] = merged;
    } else {
      result.push({ ...item });
      if (normId) seenIds.add(normId);
      if (nameKey) seenNameKeys.add(nameKey);
    }
  }

  return result;
}

/**
 * Deduplicates an array of Doctors, merging duplicate records.
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
        ...current,
        bio: (item.bio && item.bio.length > (current.bio?.length || 0)) ? item.bio : current.bio,
        avatar: item.avatar && (item.avatar.startsWith('/images/specialists/') || !current.avatar)
          ? item.avatar
          : (current.avatar || item.avatar),
        fallbackAvatar: current.fallbackAvatar || item.fallbackAvatar,
        rating: Math.max(current.rating || 0, item.rating || 0),
        reviewCount: Math.max(current.reviewCount || 0, item.reviewCount || 0),
        experienceYears: Math.max(current.experienceYears || 0, item.experienceYears || 0),
        tags: (item.tags && item.tags.length > (current.tags?.length || 0)) ? item.tags : current.tags,
      };
    } else {
      result.push({ ...item });
    }
  }

  return result;
}
