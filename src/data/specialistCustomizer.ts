import { SpecialistCardCustomization } from '../types';

export interface SpecialistImageSetting {
  id: string;
  name: string;
  avatar: string; // The active avatar (URL or Base64 or local path)
  posterCrop: string; // The official Raba poster crop matching screenshot
  portraitCrop: string; // Square clinical portrait
  fallbackAvatar: string;
  displayMode: 'cover' | 'contain';
  focalPosition: 'top' | 'center' | 'bottom';
  zoomLevel: number; // 100, 105, 110, 115, 120, 125
  isTopRated?: boolean;
  isAvailableToday?: boolean;
  hideSessionPrice?: boolean; // Individual override to hide session fee
}

import { savePersistentModule } from '../utils/persistentSync';
import defaultSyncData from './defaultSyncData.json';

export interface GlobalCardSettings {
  hideAllSessionPrices: boolean; // Hide session prices from all cards in the website
}

export const DEFAULT_GLOBAL_CARD_SETTINGS: GlobalCardSettings = {
  hideAllSessionPrices: false,
};

const GLOBAL_SETTINGS_KEY = 'raba_global_card_settings';

export function getStoredGlobalCardSettings(): GlobalCardSettings {
  try {
    const raw = localStorage.getItem(GLOBAL_SETTINGS_KEY);
    if (!raw) return { ...DEFAULT_GLOBAL_CARD_SETTINGS };
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_GLOBAL_CARD_SETTINGS, ...parsed };
  } catch {
    return { ...DEFAULT_GLOBAL_CARD_SETTINGS };
  }
}

export function saveStoredGlobalCardSettings(settings: GlobalCardSettings): void {
  try {
    localStorage.setItem(GLOBAL_SETTINGS_KEY, JSON.stringify(settings));
  } catch (err) {
    console.error('Failed to save global card settings', err);
  }
  savePersistentModule(GLOBAL_SETTINGS_KEY, settings);
  window.dispatchEvent(new CustomEvent('raba_global_card_settings_updated', { detail: settings }));
}

export function toggleGlobalHideSessionPrices(): boolean {
  const current = getStoredGlobalCardSettings();
  const nextVal = !current.hideAllSessionPrices;
  saveStoredGlobalCardSettings({ ...current, hideAllSessionPrices: nextVal });
  return nextVal;
}

export const DEFAULT_SPECIALIST_SETTINGS: Record<string, SpecialistImageSetting> = {
  'spec-haneen-obaidi': {
    id: 'spec-haneen-obaidi',
    name: 'أ. حنين العبيدي',
    avatar: '/uploads/1790357520279_________________jpg_jpeg.jpg',
    posterCrop: '/uploads/1790357520279_________________jpg_jpeg.jpg',
    portraitCrop: '/uploads/1790357520279_________________jpg_jpeg.jpg',
    fallbackAvatar: '/uploads/1790357520279_________________jpg_jpeg.jpg',
    displayMode: 'cover',
    focalPosition: 'top',
    zoomLevel: 100,
    isTopRated: true,
    isAvailableToday: true,
  },
  'doc-haneen-obaidi': {
    id: 'doc-haneen-obaidi',
    name: 'أ. حنين العبيدي',
    avatar: '/uploads/1790357520279_________________jpg_jpeg.jpg',
    posterCrop: '/uploads/1790357520279_________________jpg_jpeg.jpg',
    portraitCrop: '/uploads/1790357520279_________________jpg_jpeg.jpg',
    fallbackAvatar: '/uploads/1790357520279_________________jpg_jpeg.jpg',
    displayMode: 'cover',
    focalPosition: 'top',
    zoomLevel: 100,
    isTopRated: true,
    isAvailableToday: true,
  },
  'spec-rahaf-doghmani': {
    id: 'spec-rahaf-doghmani',
    name: 'أ. رهف الدغماني',
    avatar: '/uploads/1790357530423_________________jpg_jpeg.jpg',
    posterCrop: '/uploads/1790357530423_________________jpg_jpeg.jpg',
    portraitCrop: '/uploads/1790357530423_________________jpg_jpeg.jpg',
    fallbackAvatar: '/uploads/1790357530423_________________jpg_jpeg.jpg',
    displayMode: 'cover',
    focalPosition: 'top',
    zoomLevel: 100,
    isTopRated: true,
    isAvailableToday: true,
  },
  'doc-rahaf-doghmani': {
    id: 'doc-rahaf-doghmani',
    name: 'أ. رهف الدغماني',
    avatar: '/uploads/1790357530423_________________jpg_jpeg.jpg',
    posterCrop: '/uploads/1790357530423_________________jpg_jpeg.jpg',
    portraitCrop: '/uploads/1790357530423_________________jpg_jpeg.jpg',
    fallbackAvatar: '/uploads/1790357530423_________________jpg_jpeg.jpg',
    displayMode: 'cover',
    focalPosition: 'top',
    zoomLevel: 100,
    isTopRated: true,
    isAvailableToday: true,
  },
  'spec-doha-khaled': {
    id: 'spec-doha-khaled',
    name: 'أ. ضحى خالد',
    avatar: '/uploads/1790357539758_____________jpg_jpeg.jpg',
    posterCrop: '/uploads/1790357539758_____________jpg_jpeg.jpg',
    portraitCrop: '/uploads/1790357539758_____________jpg_jpeg.jpg',
    fallbackAvatar: '/uploads/1790357539758_____________jpg_jpeg.jpg',
    displayMode: 'cover',
    focalPosition: 'top',
    zoomLevel: 100,
    isTopRated: true,
    isAvailableToday: true,
  },
  'doc-doha-khaled': {
    id: 'doc-doha-khaled',
    name: 'أ. ضحى خالد',
    avatar: '/uploads/1790357539758_____________jpg_jpeg.jpg',
    posterCrop: '/uploads/1790357539758_____________jpg_jpeg.jpg',
    portraitCrop: '/uploads/1790357539758_____________jpg_jpeg.jpg',
    fallbackAvatar: '/uploads/1790357539758_____________jpg_jpeg.jpg',
    displayMode: 'cover',
    focalPosition: 'top',
    zoomLevel: 100,
    isTopRated: true,
    isAvailableToday: true,
  },
  'spec-manar-wahba': {
    id: 'spec-manar-wahba',
    name: 'أ. منار وهبه',
    avatar: '/uploads/1790357549806______________jpg_jpeg.jpg',
    posterCrop: '/uploads/1790357549806______________jpg_jpeg.jpg',
    portraitCrop: '/uploads/1790357549806______________jpg_jpeg.jpg',
    fallbackAvatar: '/uploads/1790357549806______________jpg_jpeg.jpg',
    displayMode: 'cover',
    focalPosition: 'top',
    zoomLevel: 100,
    isTopRated: false,
    isAvailableToday: true,
  },
  'doc-manar-wahba': {
    id: 'doc-manar-wahba',
    name: 'أ. منار وهبه',
    avatar: '/uploads/1790357549806______________jpg_jpeg.jpg',
    posterCrop: '/uploads/1790357549806______________jpg_jpeg.jpg',
    portraitCrop: '/uploads/1790357549806______________jpg_jpeg.jpg',
    fallbackAvatar: '/uploads/1790357549806______________jpg_jpeg.jpg',
    displayMode: 'cover',
    focalPosition: 'top',
    zoomLevel: 100,
    isTopRated: false,
    isAvailableToday: true,
  },
  'spec-ahmed-fathi': {
    id: 'spec-ahmed-fathi',
    name: 'أ. أحمد فتحي',
    avatar: '/uploads/1790357579245_______________jpg_jpeg.jpg',
    posterCrop: '/uploads/1790357579245_______________jpg_jpeg.jpg',
    portraitCrop: '/uploads/1790357579245_______________jpg_jpeg.jpg',
    fallbackAvatar: '/uploads/1790357579245_______________jpg_jpeg.jpg',
    displayMode: 'cover',
    focalPosition: 'top',
    zoomLevel: 100,
    isTopRated: false,
    isAvailableToday: true,
  },
  'doc-ahmed-fathi': {
    id: 'doc-ahmed-fathi',
    name: 'أ. أحمد فتحي',
    avatar: '/uploads/1790357579245_______________jpg_jpeg.jpg',
    posterCrop: '/uploads/1790357579245_______________jpg_jpeg.jpg',
    portraitCrop: '/uploads/1790357579245_______________jpg_jpeg.jpg',
    fallbackAvatar: '/uploads/1790357579245_______________jpg_jpeg.jpg',
    displayMode: 'cover',
    focalPosition: 'top',
    zoomLevel: 100,
    isTopRated: false,
    isAvailableToday: true,
  },
  'spec-mohamed-atef': {
    id: 'spec-mohamed-atef',
    name: 'أ. محمد عاطف',
    avatar: '/uploads/1790357588113______________jpg_jpeg.jpg',
    posterCrop: '/uploads/1790357588113______________jpg_jpeg.jpg',
    portraitCrop: '/uploads/1790357588113______________jpg_jpeg.jpg',
    fallbackAvatar: '/uploads/1790357588113______________jpg_jpeg.jpg',
    displayMode: 'cover',
    focalPosition: 'top',
    zoomLevel: 100,
    isTopRated: false,
    isAvailableToday: true,
  },
  'doc-mohamed-atef': {
    id: 'doc-mohamed-atef',
    name: 'أ. محمد عاطف',
    avatar: '/uploads/1790357588113______________jpg_jpeg.jpg',
    posterCrop: '/uploads/1790357588113______________jpg_jpeg.jpg',
    portraitCrop: '/uploads/1790357588113______________jpg_jpeg.jpg',
    fallbackAvatar: '/uploads/1790357588113______________jpg_jpeg.jpg',
    displayMode: 'cover',
    focalPosition: 'top',
    zoomLevel: 100,
    isTopRated: false,
    isAvailableToday: true,
  },
  'spec-sadeem-mshari': {
    id: 'spec-sadeem-mshari',
    name: 'أ. سديم احمد المشاري',
    avatar: '/uploads/1790357598308______________________jpg_jpeg.jpg',
    posterCrop: '/uploads/1790357598308______________________jpg_jpeg.jpg',
    portraitCrop: '/uploads/1790357598308______________________jpg_jpeg.jpg',
    fallbackAvatar: '/uploads/1790357598308______________________jpg_jpeg.jpg',
    displayMode: 'cover',
    focalPosition: 'top',
    zoomLevel: 100,
    isTopRated: true,
    isAvailableToday: true,
  },
  'doc-sadeem-mshari': {
    id: 'doc-sadeem-mshari',
    name: 'أ. سديم احمد المشاري',
    avatar: '/uploads/1790357598308______________________jpg_jpeg.jpg',
    posterCrop: '/uploads/1790357598308______________________jpg_jpeg.jpg',
    portraitCrop: '/uploads/1790357598308______________________jpg_jpeg.jpg',
    fallbackAvatar: '/uploads/1790357598308______________________jpg_jpeg.jpg',
    displayMode: 'cover',
    focalPosition: 'top',
    zoomLevel: 100,
    isTopRated: true,
    isAvailableToday: true,
  },
  'spec-maram-mohamed': {
    id: 'spec-maram-mohamed',
    name: 'أ. مرام محمد',
    avatar: '/uploads/1790357606704______________jpg_jpeg.jpg',
    posterCrop: '/uploads/1790357606704______________jpg_jpeg.jpg',
    portraitCrop: '/uploads/1790357606704______________jpg_jpeg.jpg',
    fallbackAvatar: '/uploads/1790357606704______________jpg_jpeg.jpg',
    displayMode: 'cover',
    focalPosition: 'top',
    zoomLevel: 100,
    isTopRated: false,
    isAvailableToday: true,
  },
  'doc-maram-mohamed': {
    id: 'doc-maram-mohamed',
    name: 'أ. مرام محمد',
    avatar: '/uploads/1790357606704______________jpg_jpeg.jpg',
    posterCrop: '/uploads/1790357606704______________jpg_jpeg.jpg',
    portraitCrop: '/uploads/1790357606704______________jpg_jpeg.jpg',
    fallbackAvatar: '/uploads/1790357606704______________jpg_jpeg.jpg',
    displayMode: 'cover',
    focalPosition: 'top',
    zoomLevel: 100,
    isTopRated: false,
    isAvailableToday: true,
  },
  'spec-ahmed-raad': {
    id: 'spec-ahmed-raad',
    name: 'أ. أحمد رعد',
    avatar: '/uploads/1790357615959______________jpg_jpeg.jpg',
    posterCrop: '/uploads/1790357615959______________jpg_jpeg.jpg',
    portraitCrop: '/uploads/1790357615959______________jpg_jpeg.jpg',
    fallbackAvatar: '/uploads/1790357615959______________jpg_jpeg.jpg',
    displayMode: 'cover',
    focalPosition: 'top',
    zoomLevel: 100,
    isTopRated: false,
    isAvailableToday: true,
  },
  'doc-ahmed-raad': {
    id: 'doc-ahmed-raad',
    name: 'أ. أحمد رعد',
    avatar: '/uploads/1790357615959______________jpg_jpeg.jpg',
    posterCrop: '/uploads/1790357615959______________jpg_jpeg.jpg',
    portraitCrop: '/uploads/1790357615959______________jpg_jpeg.jpg',
    fallbackAvatar: '/uploads/1790357615959______________jpg_jpeg.jpg',
    displayMode: 'cover',
    focalPosition: 'top',
    zoomLevel: 100,
    isTopRated: false,
    isAvailableToday: true,
  },
  'spec-1': {
    id: 'spec-1',
    name: 'أ. أحمد أبو زيد أنور',
    avatar: '/uploads/1790357622619________________jpeg.jpg',
    posterCrop: '/uploads/1790357622619________________jpeg.jpg',
    portraitCrop: '/uploads/1790357622619________________jpeg.jpg',
    fallbackAvatar: '/uploads/1790357622619________________jpeg.jpg',
    displayMode: 'cover',
    focalPosition: 'top',
    zoomLevel: 100,
    isTopRated: true,
    isAvailableToday: true,
  },
  'doc-ahmed-abouzeid': {
    id: 'doc-ahmed-abouzeid',
    name: 'أ. أحمد أبو زيد أنور',
    avatar: '/uploads/1790357622619________________jpeg.jpg',
    posterCrop: '/uploads/1790357622619________________jpeg.jpg',
    portraitCrop: '/uploads/1790357622619________________jpeg.jpg',
    fallbackAvatar: '/uploads/1790357622619________________jpeg.jpg',
    displayMode: 'cover',
    focalPosition: 'top',
    zoomLevel: 100,
    isTopRated: true,
    isAvailableToday: true,
  },
  'spec-ahmed-abouzeid': {
    id: 'spec-ahmed-abouzeid',
    name: 'أ. أحمد أبو زيد أنور',
    avatar: '/uploads/1790357622619________________jpeg.jpg',
    posterCrop: '/uploads/1790357622619________________jpeg.jpg',
    portraitCrop: '/uploads/1790357622619________________jpeg.jpg',
    fallbackAvatar: '/uploads/1790357622619________________jpeg.jpg',
    displayMode: 'cover',
    focalPosition: 'top',
    zoomLevel: 100,
    isTopRated: true,
    isAvailableToday: true,
  },
  'doc-1': {
    id: 'doc-1',
    name: 'أ. أحمد أبو زيد أنور',
    avatar: '/uploads/1790357622619________________jpeg.jpg',
    posterCrop: '/uploads/1790357622619________________jpeg.jpg',
    portraitCrop: '/uploads/1790357622619________________jpeg.jpg',
    fallbackAvatar: '/uploads/1790357622619________________jpeg.jpg',
    displayMode: 'cover',
    focalPosition: 'top',
    zoomLevel: 100,
    isTopRated: true,
    isAvailableToday: true,
  }
};

const STORAGE_KEY = 'raba_specialists_card_customizations';

export function getStoredSpecialistSettings(): Record<string, SpecialistImageSetting> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('raba_specialists_settings');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        return { ...DEFAULT_SPECIALIST_SETTINGS, ...parsed };
      }
    }
    const bundled = (defaultSyncData as any)?.data?.raba_specialists_card_customizations || (defaultSyncData as any)?.data?.raba_specialists_settings;
    if (bundled && typeof bundled === 'object') {
      return { ...DEFAULT_SPECIALIST_SETTINGS, ...bundled };
    }
    return { ...DEFAULT_SPECIALIST_SETTINGS };
  } catch {
    const bundled = (defaultSyncData as any)?.data?.raba_specialists_card_customizations || (defaultSyncData as any)?.data?.raba_specialists_settings;
    if (bundled && typeof bundled === 'object') {
      return { ...DEFAULT_SPECIALIST_SETTINGS, ...bundled };
    }
    return { ...DEFAULT_SPECIALIST_SETTINGS };
  }
}

export function saveStoredSpecialistSettings(settings: Record<string, SpecialistImageSetting>): void {
  try {
    const raw = JSON.stringify(settings);
    const now = Date.now().toString();
    localStorage.setItem(STORAGE_KEY, raw);
    localStorage.setItem('raba_specialists_settings', raw);
    localStorage.setItem(`raba_ts_${STORAGE_KEY}`, now);
    localStorage.setItem('raba_ts_raba_specialists_settings', now);
  } catch (err) {
    console.warn('localStorage quota warning when saving specialist settings:', err);
  }
  savePersistentModule(STORAGE_KEY, settings);
  // Always dispatch the custom event so active in-memory listeners update instantly
  window.dispatchEvent(new CustomEvent('raba_specialist_settings_updated', { detail: settings }));
}

export function updateSpecialistCardSetting(id: string, updates: Partial<SpecialistImageSetting>): void {
  const current = getStoredSpecialistSettings();
  const existing = current[id] || {
    id,
    name: '',
    avatar: '/specialists/poster_ahmed_raad_1790197742838.jpg',
    posterCrop: '/specialists/poster_ahmed_raad_1790197742838.jpg',
    portraitCrop: '/specialists/spec_ahmed_raad_1790197197424.jpg',
    fallbackAvatar: '/specialists/ahmed_raad_poster.jpg',
    displayMode: 'cover',
    focalPosition: 'top',
    zoomLevel: 100,
  };

  const updatedSetting: SpecialistImageSetting = {
    ...existing,
    ...updates,
  };

  current[id] = updatedSetting;

  // Sync dual doc- / spec- ID representation
  const altId = id.startsWith('spec-') ? id.replace('spec-', 'doc-') : id.replace('doc-', 'spec-');
  current[altId] = { ...updatedSetting, id: altId };

  // Special alias sync for Ahmed Abouzeid (spec-1 <-> doc-ahmed-abouzeid <-> spec-ahmed-abouzeid)
  if (id === 'spec-1' || id === 'doc-ahmed-abouzeid' || id === 'spec-ahmed-abouzeid') {
    current['spec-1'] = { ...updatedSetting, id: 'spec-1' };
    current['doc-ahmed-abouzeid'] = { ...updatedSetting, id: 'doc-ahmed-abouzeid' };
    current['spec-ahmed-abouzeid'] = { ...updatedSetting, id: 'spec-ahmed-abouzeid' };
  }

  saveStoredSpecialistSettings(current);

  // Also update raba_specialists array so cards and modals are 100% in sync
  if (updates.avatar) {
    try {
      const rawSpec = localStorage.getItem('raba_specialists');
      if (rawSpec) {
        const specList = JSON.parse(rawSpec);
        if (Array.isArray(specList)) {
          const updatedList = specList.map((s: any) => {
            if (s.id === id || s.id === altId || (id === 'spec-1' && (s.id === 'doc-ahmed-abouzeid' || s.id === 'spec-ahmed-abouzeid'))) {
              return { ...s, avatar: updates.avatar };
            }
            return s;
          });
          localStorage.setItem('raba_specialists', JSON.stringify(updatedList));
          savePersistentModule('raba_specialists', updatedList);
          window.dispatchEvent(new CustomEvent('raba_specialists_updated', { detail: updatedList }));
        }
      }
    } catch {
      // ignore
    }
  }
}

export function resetSpecialistCardSetting(id: string): void {
  const current = getStoredSpecialistSettings();
  if (DEFAULT_SPECIALIST_SETTINGS[id]) {
    current[id] = { ...DEFAULT_SPECIALIST_SETTINGS[id] };
    const altId = id.startsWith('spec-') ? id.replace('spec-', 'doc-') : id.replace('doc-', 'spec-');
    if (DEFAULT_SPECIALIST_SETTINGS[altId]) {
      current[altId] = { ...DEFAULT_SPECIALIST_SETTINGS[altId] };
    }
  } else {
    delete current[id];
  }
  
  if (id === 'spec-1' || id === 'doc-ahmed-abouzeid' || id === 'spec-ahmed-abouzeid') {
    current['spec-1'] = { ...DEFAULT_SPECIALIST_SETTINGS['spec-1'] };
    current['doc-ahmed-abouzeid'] = { ...DEFAULT_SPECIALIST_SETTINGS['doc-ahmed-abouzeid'] };
    current['spec-ahmed-abouzeid'] = { ...DEFAULT_SPECIALIST_SETTINGS['spec-ahmed-abouzeid'] };
  }

  saveStoredSpecialistSettings(current);
}

export function getSpecialistImageSetting(id: string): SpecialistImageSetting {
  const all = getStoredSpecialistSettings();
  if (all[id]) return all[id];
  const altId = id.startsWith('spec-') ? id.replace('spec-', 'doc-') : id.replace('doc-', 'spec-');
  if (all[altId]) return all[altId];
  if (id === 'spec-1' || id === 'doc-ahmed-abouzeid' || id === 'spec-ahmed-abouzeid') {
    return all['doc-ahmed-abouzeid'] || all['spec-1'] || DEFAULT_SPECIALIST_SETTINGS['spec-1'];
  }
  return {
    id,
    name: '',
    avatar: '/uploads/1790357615959______________jpg_jpeg.jpg',
    posterCrop: '/uploads/1790357615959______________jpg_jpeg.jpg',
    portraitCrop: '/uploads/1790357615959______________jpg_jpeg.jpg',
    fallbackAvatar: '/uploads/1790357615959______________jpg_jpeg.jpg',
    displayMode: 'cover',
    focalPosition: 'top',
    zoomLevel: 100,
  };
}

/**
 * Finds custom card settings for any specialist or doctor, using ID, alternate ID,
 * known aliases, or normalized Arabic name matching.
 */
export function findCustomSettingForDoctor(
  doctorOrSpecialist: { id: string; name?: string; arabicName?: string }
): SpecialistImageSetting | null {
  const all = getStoredSpecialistSettings();
  const id = doctorOrSpecialist.id;

  if (all[id]) return all[id];
  
  const altId = id.startsWith('spec-') ? id.replace('spec-', 'doc-') : id.replace('doc-', 'spec-');
  if (all[altId]) return all[altId];

  if (id === 'spec-1' || id === 'doc-ahmed-abouzeid' || id === 'spec-ahmed-abouzeid') {
    return all['doc-ahmed-abouzeid'] || all['spec-1'] || all['spec-ahmed-abouzeid'] || null;
  }

  // Name matching fallback
  const rawName = doctorOrSpecialist.name || doctorOrSpecialist.arabicName || '';
  if (rawName) {
    const cleanSearchName = rawName.replace(/^[أادد]\.?\s*/, '').trim().toLowerCase();
    for (const key of Object.keys(all)) {
      const sett = all[key];
      if (sett && sett.name) {
        const cleanSettName = sett.name.replace(/^[أادد]\.?\s*/, '').trim().toLowerCase();
        if (cleanSettName && (cleanSearchName.includes(cleanSettName) || cleanSettName.includes(cleanSearchName))) {
          return sett;
        }
      }
    }
  }

  return null;
}
