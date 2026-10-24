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
  hideAllSessionPrices: true,
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

const STORAGE_KEY = 'raba_specialists_card_customizations';

export const DEFAULT_SPECIALIST_SETTINGS: Record<string, SpecialistImageSetting> = {
  "spec-haneen-obaidi": {
    "id": "spec-haneen-obaidi",
    "name": "حنين العبيدي",
    "avatar": "/uploads/1790357520279_________________jpg_jpeg.jpg",
    "posterCrop": "/specialists/poster_haneen_obaidi_1790197758317.jpg",
    "portraitCrop": "/specialists/spec_haneen_obaidi_1790197216150.jpg",
    "fallbackAvatar": "/specialists/haneen_obaidi_poster.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": true,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "doc-haneen-obaidi": {
    "id": "doc-haneen-obaidi",
    "name": "حنين العبيدي",
    "avatar": "/uploads/1790357520279_________________jpg_jpeg.jpg",
    "posterCrop": "/specialists/poster_haneen_obaidi_1790197758317.jpg",
    "portraitCrop": "/specialists/spec_haneen_obaidi_1790197216150.jpg",
    "fallbackAvatar": "/specialists/haneen_obaidi_poster.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": true,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "spec-rahaf-doghmani": {
    "id": "spec-rahaf-doghmani",
    "name": "رهف الدغماني",
    "avatar": "/uploads/1790357530423_________________jpg_jpeg.jpg",
    "posterCrop": "/specialists/poster_rahaf_doghmani_1790197765782.jpg",
    "portraitCrop": "/specialists/spec_rahaf_doghmani_1790197226544.jpg",
    "fallbackAvatar": "/specialists/rahaf_doghmani_poster.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": true,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "doc-rahaf-doghmani": {
    "id": "doc-rahaf-doghmani",
    "name": "رهف الدغماني",
    "avatar": "/uploads/1790357530423_________________jpg_jpeg.jpg",
    "posterCrop": "/specialists/poster_rahaf_doghmani_1790197765782.jpg",
    "portraitCrop": "/specialists/spec_rahaf_doghmani_1790197226544.jpg",
    "fallbackAvatar": "/specialists/rahaf_doghmani_poster.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": true,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "spec-doha-khaled": {
    "id": "spec-doha-khaled",
    "name": "ضحى خالد",
    "avatar": "/uploads/1790357539758_____________jpg_jpeg.jpg",
    "posterCrop": "/specialists/poster_doha_khaled_1790197784055.jpg",
    "portraitCrop": "/specialists/spec_doha_khaled_1790197246850.jpg",
    "fallbackAvatar": "/specialists/doha_khaled_poster.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": true,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "doc-doha-khaled": {
    "id": "doc-doha-khaled",
    "name": "ضحى خالد",
    "avatar": "/uploads/1790357539758_____________jpg_jpeg.jpg",
    "posterCrop": "/specialists/poster_doha_khaled_1790197784055.jpg",
    "portraitCrop": "/specialists/spec_doha_khaled_1790197246850.jpg",
    "fallbackAvatar": "/specialists/doha_khaled_poster.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": true,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "spec-manar-wahba": {
    "id": "spec-manar-wahba",
    "name": "منار وهبه",
    "avatar": "/uploads/1790357549806______________jpg_jpeg.jpg",
    "posterCrop": "/specialists/poster_manar_wahba_1790197794286.jpg",
    "portraitCrop": "/specialists/spec_manar_wahba_1790197276842.jpg",
    "fallbackAvatar": "/specialists/manar_wahba_poster.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "doc-manar-wahba": {
    "id": "doc-manar-wahba",
    "name": "منار وهبه",
    "avatar": "/uploads/1790357549806______________jpg_jpeg.jpg",
    "posterCrop": "/specialists/poster_manar_wahba_1790197794286.jpg",
    "portraitCrop": "/specialists/spec_manar_wahba_1790197276842.jpg",
    "fallbackAvatar": "/specialists/manar_wahba_poster.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "spec-ahmed-fathi": {
    "id": "spec-ahmed-fathi",
    "name": "أحمد فتحي",
    "avatar": "/uploads/1790357579245_______________jpg_jpeg.jpg",
    "posterCrop": "/specialists/poster_ahmed_fathi_1790197750721.jpg",
    "portraitCrop": "/specialists/spec_ahmed_fathi_1790197207910.jpg",
    "fallbackAvatar": "/specialists/ahmed_fathi_poster.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "doc-ahmed-fathi": {
    "id": "doc-ahmed-fathi",
    "name": "أحمد فتحي",
    "avatar": "/uploads/1790357579245_______________jpg_jpeg.jpg",
    "posterCrop": "/specialists/poster_ahmed_fathi_1790197750721.jpg",
    "portraitCrop": "/specialists/spec_ahmed_fathi_1790197207910.jpg",
    "fallbackAvatar": "/specialists/ahmed_fathi_poster.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "spec-mohamed-atef": {
    "id": "spec-mohamed-atef",
    "name": "محمد عاطف",
    "avatar": "/uploads/1790357588113______________jpg_jpeg.jpg",
    "posterCrop": "/specialists/poster_mohamed_atef_1790197803776.jpg",
    "portraitCrop": "/specialists/spec_mohamed_atef_1790197255945.jpg",
    "fallbackAvatar": "/specialists/mohamed_atef_poster.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "doc-mohamed-atef": {
    "id": "doc-mohamed-atef",
    "name": "محمد عاطف",
    "avatar": "/uploads/1790357588113______________jpg_jpeg.jpg",
    "posterCrop": "/specialists/poster_mohamed_atef_1790197803776.jpg",
    "portraitCrop": "/specialists/spec_mohamed_atef_1790197255945.jpg",
    "fallbackAvatar": "/specialists/mohamed_atef_poster.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "spec-sadeem-mshari": {
    "id": "spec-sadeem-mshari",
    "name": "سديم احمد المشاري",
    "avatar": "/uploads/1790357598308______________________jpg_jpeg.jpg",
    "posterCrop": "/specialists/poster_sadeem_mshari_1790197812611.jpg",
    "portraitCrop": "/specialists/spec_sadeem_mshari_1790197236144.jpg",
    "fallbackAvatar": "/specialists/sadeem_mshari_poster.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": true,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "doc-sadeem-mshari": {
    "id": "doc-sadeem-mshari",
    "name": "سديم احمد المشاري",
    "avatar": "/uploads/1790357598308______________________jpg_jpeg.jpg",
    "posterCrop": "/specialists/poster_sadeem_mshari_1790197812611.jpg",
    "portraitCrop": "/specialists/spec_sadeem_mshari_1790197236144.jpg",
    "fallbackAvatar": "/specialists/sadeem_mshari_poster.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": true,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "spec-maram-mohamed": {
    "id": "spec-maram-mohamed",
    "name": "مرام محمد",
    "avatar": "/uploads/1790357606704______________jpg_jpeg.jpg",
    "posterCrop": "/specialists/poster_maram_mohamed_1790197821665.jpg",
    "portraitCrop": "/specialists/spec_maram_mohamed_1790197265873.jpg",
    "fallbackAvatar": "/specialists/maram_mohamed_poster.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "doc-maram-mohamed": {
    "id": "doc-maram-mohamed",
    "name": "مرام محمد",
    "avatar": "/uploads/1790357606704______________jpg_jpeg.jpg",
    "posterCrop": "/specialists/poster_maram_mohamed_1790197821665.jpg",
    "portraitCrop": "/specialists/spec_maram_mohamed_1790197265873.jpg",
    "fallbackAvatar": "/specialists/maram_mohamed_poster.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "spec-ahmed-raad": {
    "id": "spec-ahmed-raad",
    "name": "أحمد رعد",
    "avatar": "/uploads/1790357615959______________jpg_jpeg.jpg",
    "posterCrop": "/specialists/poster_ahmed_raad_1790197742838.jpg",
    "portraitCrop": "/specialists/spec_ahmed_raad_1790197197424.jpg",
    "fallbackAvatar": "/specialists/ahmed_raad_poster.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "doc-ahmed-raad": {
    "id": "doc-ahmed-raad",
    "name": "أحمد رعد",
    "avatar": "/uploads/1790357615959______________jpg_jpeg.jpg",
    "posterCrop": "/specialists/poster_ahmed_raad_1790197742838.jpg",
    "portraitCrop": "/specialists/spec_ahmed_raad_1790197197424.jpg",
    "fallbackAvatar": "/specialists/ahmed_raad_poster.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "spec-1": {
    "id": "spec-1",
    "name": "أ. أحمد أبو زيد أنور",
    "avatar": "/uploads/1790826219680_16_png.png",
    "posterCrop": "/specialists/ahmed_abouzeid.jpg",
    "portraitCrop": "/specialists/ahmed_abouzeid.jpg",
    "fallbackAvatar": "/specialists/ahmed_abouzeid.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": true,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "doc-ahmed-abouzeid": {
    "id": "doc-ahmed-abouzeid",
    "name": "أ. أحمد أبو زيد أنور",
    "avatar": "/uploads/1790826219680_16_png.png",
    "posterCrop": "/specialists/ahmed_abouzeid.jpg",
    "portraitCrop": "/specialists/ahmed_abouzeid.jpg",
    "fallbackAvatar": "/specialists/ahmed_abouzeid.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": true,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "spec-ahmed-abouzeid": {
    "id": "spec-ahmed-abouzeid",
    "name": "أ. أحمد أبو زيد أنور",
    "avatar": "/uploads/1790826219680_16_png.png",
    "posterCrop": "/specialists/ahmed_abouzeid.jpg",
    "portraitCrop": "/specialists/ahmed_abouzeid.jpg",
    "fallbackAvatar": "/specialists/ahmed_abouzeid.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": true,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "doc-1": {
    "id": "doc-1",
    "name": "احمد أبو زيد أنور",
    "avatar": "/uploads/1790826219680_16_png.png",
    "posterCrop": "/specialists/ahmed_abouzeid.jpg",
    "portraitCrop": "/specialists/ahmed_abouzeid.jpg",
    "fallbackAvatar": "/specialists/ahmed_abouzeid.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": true,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "spec-alzahraa-farag": {
    "id": "spec-alzahraa-farag",
    "name": "الزهراء فرج",
    "avatar": "/uploads/1790826125079_2_png.png",
    "posterCrop": "/specialists/poster_ahmed_raad_1790197742838.jpg",
    "portraitCrop": "/specialists/spec_ahmed_raad_1790197197424.jpg",
    "fallbackAvatar": "/specialists/ahmed_raad_poster.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "doc-alzahraa-farag": {
    "id": "doc-alzahraa-farag",
    "name": "الزهراء فرج",
    "avatar": "/uploads/1790826125079_2_png.png",
    "posterCrop": "/specialists/poster_ahmed_raad_1790197742838.jpg",
    "portraitCrop": "/specialists/spec_ahmed_raad_1790197197424.jpg",
    "fallbackAvatar": "/specialists/ahmed_raad_poster.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "spec-mohamed-saad": {
    "id": "spec-mohamed-saad",
    "name": "محمد سعد",
    "avatar": "/uploads/1790826142955_1_png.png",
    "posterCrop": "/specialists/poster_ahmed_raad_1790197742838.jpg",
    "portraitCrop": "/specialists/spec_ahmed_raad_1790197197424.jpg",
    "fallbackAvatar": "/specialists/ahmed_raad_poster.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "doc-mohamed-saad": {
    "id": "doc-mohamed-saad",
    "name": "محمد سعد",
    "avatar": "/uploads/1790826142955_1_png.png",
    "posterCrop": "/specialists/poster_ahmed_raad_1790197742838.jpg",
    "portraitCrop": "/specialists/spec_ahmed_raad_1790197197424.jpg",
    "fallbackAvatar": "/specialists/ahmed_raad_poster.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "spec-ayman-elhoweity": {
    "id": "spec-ayman-elhoweity",
    "name": "أيمن عطية الحويطي",
    "avatar": "/uploads/1790826241596_5_png.png",
    "posterCrop": "/specialists/poster_ahmed_raad_1790197742838.jpg",
    "portraitCrop": "/specialists/spec_ahmed_raad_1790197197424.jpg",
    "fallbackAvatar": "/specialists/ahmed_raad_poster.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "doc-ayman-elhoweity": {
    "id": "doc-ayman-elhoweity",
    "name": "أيمن عطية الحويطي",
    "avatar": "/uploads/1790826241596_5_png.png",
    "posterCrop": "/specialists/poster_ahmed_raad_1790197742838.jpg",
    "portraitCrop": "/specialists/spec_ahmed_raad_1790197197424.jpg",
    "fallbackAvatar": "/specialists/ahmed_raad_poster.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "spec-asmaa-moustafa": {
    "id": "spec-asmaa-moustafa",
    "name": "أسماء مصطفى",
    "avatar": "/uploads/1790826279297_4_png.png",
    "posterCrop": "/specialists/poster_ahmed_raad_1790197742838.jpg",
    "portraitCrop": "/specialists/spec_ahmed_raad_1790197197424.jpg",
    "fallbackAvatar": "/specialists/ahmed_raad_poster.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "doc-asmaa-moustafa": {
    "id": "doc-asmaa-moustafa",
    "name": "أسماء مصطفى",
    "avatar": "/uploads/1790826279297_4_png.png",
    "posterCrop": "/specialists/poster_ahmed_raad_1790197742838.jpg",
    "portraitCrop": "/specialists/spec_ahmed_raad_1790197197424.jpg",
    "fallbackAvatar": "/specialists/ahmed_raad_poster.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "spec-noura-elbasyouni": {
    "id": "spec-noura-elbasyouni",
    "name": "د/ نورا البسيوني",
    "avatar": "/uploads/1790826321411_3_png.png",
    "posterCrop": "/specialists/poster_ahmed_raad_1790197742838.jpg",
    "portraitCrop": "/specialists/spec_ahmed_raad_1790197197424.jpg",
    "fallbackAvatar": "/specialists/ahmed_raad_poster.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "doc-noura-elbasyouni": {
    "id": "doc-noura-elbasyouni",
    "name": "د/ نورا البسيوني",
    "avatar": "/uploads/1790826321411_3_png.png",
    "posterCrop": "/specialists/poster_ahmed_raad_1790197742838.jpg",
    "portraitCrop": "/specialists/spec_ahmed_raad_1790197197424.jpg",
    "fallbackAvatar": "/specialists/ahmed_raad_poster.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "spec-mohamed-bakry": {
    "id": "spec-mohamed-bakry",
    "name": "محمد بكري",
    "avatar": "/uploads/1790826439548_6_png.png",
    "posterCrop": "/specialists/poster_ahmed_raad_1790197742838.jpg",
    "portraitCrop": "/specialists/spec_ahmed_raad_1790197197424.jpg",
    "fallbackAvatar": "/specialists/ahmed_raad_poster.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "doc-mohamed-bakry": {
    "id": "doc-mohamed-bakry",
    "name": "محمد بكري",
    "avatar": "/uploads/1790826439548_6_png.png",
    "posterCrop": "/specialists/poster_ahmed_raad_1790197742838.jpg",
    "portraitCrop": "/specialists/spec_ahmed_raad_1790197197424.jpg",
    "fallbackAvatar": "/specialists/ahmed_raad_poster.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "spec-anwar-elmaghyouli": {
    "id": "spec-anwar-elmaghyouli",
    "name": "أنوار المغيولي",
    "avatar": "/uploads/1790826509139_7_png.png",
    "posterCrop": "/specialists/poster_ahmed_raad_1790197742838.jpg",
    "portraitCrop": "/specialists/spec_ahmed_raad_1790197197424.jpg",
    "fallbackAvatar": "/specialists/ahmed_raad_poster.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "doc-anwar-elmaghyouli": {
    "id": "doc-anwar-elmaghyouli",
    "name": "أنوار المغيولي",
    "avatar": "/uploads/1790826509139_7_png.png",
    "posterCrop": "/specialists/poster_ahmed_raad_1790197742838.jpg",
    "portraitCrop": "/specialists/spec_ahmed_raad_1790197197424.jpg",
    "fallbackAvatar": "/specialists/ahmed_raad_poster.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "spec-mohamed-abdelhamid": {
    "id": "spec-mohamed-abdelhamid",
    "name": "محمد عبد الحميد",
    "avatar": "/uploads/1790826577879_9_png.png",
    "posterCrop": "/specialists/poster_ahmed_raad_1790197742838.jpg",
    "portraitCrop": "/specialists/spec_ahmed_raad_1790197197424.jpg",
    "fallbackAvatar": "/specialists/ahmed_raad_poster.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "doc-mohamed-abdelhamid": {
    "id": "doc-mohamed-abdelhamid",
    "name": "محمد عبد الحميد",
    "avatar": "/uploads/1790826577879_9_png.png",
    "posterCrop": "/specialists/poster_ahmed_raad_1790197742838.jpg",
    "portraitCrop": "/specialists/spec_ahmed_raad_1790197197424.jpg",
    "fallbackAvatar": "/specialists/ahmed_raad_poster.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "spec-mohamed-elgayyar": {
    "id": "spec-mohamed-elgayyar",
    "name": "محمد الجيار",
    "avatar": "/uploads/1790826687565_10_png.png",
    "posterCrop": "/specialists/poster_ahmed_raad_1790197742838.jpg",
    "portraitCrop": "/specialists/spec_ahmed_raad_1790197197424.jpg",
    "fallbackAvatar": "/specialists/ahmed_raad_poster.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "doc-mohamed-elgayyar": {
    "id": "doc-mohamed-elgayyar",
    "name": "محمد الجيار",
    "avatar": "/uploads/1790826687565_10_png.png",
    "posterCrop": "/specialists/poster_ahmed_raad_1790197742838.jpg",
    "portraitCrop": "/specialists/spec_ahmed_raad_1790197197424.jpg",
    "fallbackAvatar": "/specialists/ahmed_raad_poster.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "spec-elsaeed-diab": {
    "id": "spec-elsaeed-diab",
    "name": "السعيد دياب",
    "avatar": "/uploads/1790826711609_11_png.png",
    "posterCrop": "/specialists/poster_ahmed_raad_1790197742838.jpg",
    "portraitCrop": "/specialists/spec_ahmed_raad_1790197197424.jpg",
    "fallbackAvatar": "/specialists/ahmed_raad_poster.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "doc-elsaeed-diab": {
    "id": "doc-elsaeed-diab",
    "name": "السعيد دياب",
    "avatar": "/uploads/1790826711609_11_png.png",
    "posterCrop": "/specialists/poster_ahmed_raad_1790197742838.jpg",
    "portraitCrop": "/specialists/spec_ahmed_raad_1790197197424.jpg",
    "fallbackAvatar": "/specialists/ahmed_raad_poster.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "spec-sara-abdelhamid": {
    "id": "spec-sara-abdelhamid",
    "name": "سارة عبد الحميد",
    "avatar": "/uploads/1790827397368_38_png.png",
    "posterCrop": "/specialists/poster_ahmed_raad_1790197742838.jpg",
    "portraitCrop": "/specialists/spec_ahmed_raad_1790197197424.jpg",
    "fallbackAvatar": "/specialists/ahmed_raad_poster.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "doc-sara-abdelhamid": {
    "id": "doc-sara-abdelhamid",
    "name": "سارة عبد الحميد",
    "avatar": "/uploads/1790827397368_38_png.png",
    "posterCrop": "/specialists/poster_ahmed_raad_1790197742838.jpg",
    "portraitCrop": "/specialists/spec_ahmed_raad_1790197197424.jpg",
    "fallbackAvatar": "/specialists/ahmed_raad_poster.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "spec-hanaa-basheer": {
    "id": "spec-hanaa-basheer",
    "name": "د. هناء بشير",
    "avatar": "/uploads/1790827426491_50_png.png",
    "posterCrop": "/specialists/poster_ahmed_raad_1790197742838.jpg",
    "portraitCrop": "/specialists/spec_ahmed_raad_1790197197424.jpg",
    "fallbackAvatar": "/specialists/ahmed_raad_poster.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "doc-hanaa-basheer": {
    "id": "doc-hanaa-basheer",
    "name": "د. هناء بشير",
    "avatar": "/uploads/1790827426491_50_png.png",
    "posterCrop": "/specialists/poster_ahmed_raad_1790197742838.jpg",
    "portraitCrop": "/specialists/spec_ahmed_raad_1790197197424.jpg",
    "fallbackAvatar": "/specialists/ahmed_raad_poster.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "spec-bayan-alnajem": {
    "id": "spec-bayan-alnajem",
    "name": "بيان الناجم",
    "avatar": "/uploads/1790863548373_12_png.png",
    "posterCrop": "/specialists/poster_ahmed_raad_1790197742838.jpg",
    "portraitCrop": "/specialists/spec_ahmed_raad_1790197197424.jpg",
    "fallbackAvatar": "/specialists/ahmed_raad_poster.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "doc-bayan-alnajem": {
    "id": "doc-bayan-alnajem",
    "name": "بيان الناجم",
    "avatar": "/uploads/1790863548373_12_png.png",
    "posterCrop": "/specialists/poster_ahmed_raad_1790197742838.jpg",
    "portraitCrop": "/specialists/spec_ahmed_raad_1790197197424.jpg",
    "fallbackAvatar": "/specialists/ahmed_raad_poster.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "spec-manar-obeid": {
    "id": "spec-manar-obeid",
    "name": "منار عبيد",
    "avatar": "/uploads/1790865956621_13_png.png",
    "posterCrop": "/specialists/poster_ahmed_raad_1790197742838.jpg",
    "portraitCrop": "/specialists/spec_ahmed_raad_1790197197424.jpg",
    "fallbackAvatar": "/specialists/ahmed_raad_poster.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "doc-manar-obeid": {
    "id": "doc-manar-obeid",
    "name": "منار عبيد",
    "avatar": "/uploads/1790865956621_13_png.png",
    "posterCrop": "/specialists/poster_ahmed_raad_1790197742838.jpg",
    "portraitCrop": "/specialists/spec_ahmed_raad_1790197197424.jpg",
    "fallbackAvatar": "/specialists/ahmed_raad_poster.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "spec-salma-abouelfadl": {
    "id": "spec-salma-abouelfadl",
    "name": "سلمى أبو الفضل",
    "avatar": "/uploads/1790865973849_14_png.png",
    "posterCrop": "/specialists/poster_ahmed_raad_1790197742838.jpg",
    "portraitCrop": "/specialists/spec_ahmed_raad_1790197197424.jpg",
    "fallbackAvatar": "/specialists/ahmed_raad_poster.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "doc-salma-abouelfadl": {
    "id": "doc-salma-abouelfadl",
    "name": "سلمى أبو الفضل",
    "avatar": "/uploads/1790865973849_14_png.png",
    "posterCrop": "/specialists/poster_ahmed_raad_1790197742838.jpg",
    "portraitCrop": "/specialists/spec_ahmed_raad_1790197197424.jpg",
    "fallbackAvatar": "/specialists/ahmed_raad_poster.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "spec-ahmed-sayed": {
    "id": "spec-ahmed-sayed",
    "name": "أحمد سيد",
    "avatar": "/uploads/1790865993782_15_png.png",
    "posterCrop": "/specialists/poster_ahmed_raad_1790197742838.jpg",
    "portraitCrop": "/specialists/spec_ahmed_raad_1790197197424.jpg",
    "fallbackAvatar": "/specialists/ahmed_raad_poster.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "doc-ahmed-sayed": {
    "id": "doc-ahmed-sayed",
    "name": "أحمد سيد",
    "avatar": "/uploads/1790865993782_15_png.png",
    "posterCrop": "/specialists/poster_ahmed_raad_1790197742838.jpg",
    "portraitCrop": "/specialists/spec_ahmed_raad_1790197197424.jpg",
    "fallbackAvatar": "/specialists/ahmed_raad_poster.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "spec-heshmah-mutairi": {
    "id": "spec-heshmah-mutairi",
    "name": "حشمة المطيري",
    "avatar": "/uploads/1790866017691_17_png.png",
    "posterCrop": "/specialists/poster_ahmed_raad_1790197742838.jpg",
    "portraitCrop": "/specialists/spec_ahmed_raad_1790197197424.jpg",
    "fallbackAvatar": "/specialists/ahmed_raad_poster.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "doc-heshmah-mutairi": {
    "id": "doc-heshmah-mutairi",
    "name": "حشمة المطيري",
    "avatar": "/uploads/1790866017691_17_png.png",
    "posterCrop": "/specialists/poster_ahmed_raad_1790197742838.jpg",
    "portraitCrop": "/specialists/spec_ahmed_raad_1790197197424.jpg",
    "fallbackAvatar": "/specialists/ahmed_raad_poster.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "spec-aseel-yousef": {
    "id": "spec-aseel-yousef",
    "name": "أسيل يوسف",
    "avatar": "/uploads/1790866040732_19_png.png",
    "posterCrop": "/specialists/poster_ahmed_raad_1790197742838.jpg",
    "portraitCrop": "/specialists/spec_ahmed_raad_1790197197424.jpg",
    "fallbackAvatar": "/specialists/ahmed_raad_poster.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "doc-aseel-yousef": {
    "id": "doc-aseel-yousef",
    "name": "أسيل يوسف",
    "avatar": "/uploads/1790866040732_19_png.png",
    "posterCrop": "/specialists/poster_ahmed_raad_1790197742838.jpg",
    "portraitCrop": "/specialists/spec_ahmed_raad_1790197197424.jpg",
    "fallbackAvatar": "/specialists/ahmed_raad_poster.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "spec-mohammed-shehri-clinical": {
    "id": "spec-mohammed-shehri-clinical",
    "name": "محمد الشهري",
    "avatar": "/uploads/1790866057132_21_png.png",
    "posterCrop": "/specialists/poster_ahmed_raad_1790197742838.jpg",
    "portraitCrop": "/specialists/spec_ahmed_raad_1790197197424.jpg",
    "fallbackAvatar": "/specialists/ahmed_raad_poster.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "doc-mohammed-shehri-clinical": {
    "id": "doc-mohammed-shehri-clinical",
    "name": "محمد الشهري",
    "avatar": "/uploads/1790866057132_21_png.png",
    "posterCrop": "/specialists/poster_ahmed_raad_1790197742838.jpg",
    "portraitCrop": "/specialists/spec_ahmed_raad_1790197197424.jpg",
    "fallbackAvatar": "/specialists/ahmed_raad_poster.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "spec-saad-dosari": {
    "id": "spec-saad-dosari",
    "name": "سعد الدوسري",
    "avatar": "/uploads/1790866075647_22_png.png",
    "posterCrop": "/specialists/poster_ahmed_raad_1790197742838.jpg",
    "portraitCrop": "/specialists/spec_ahmed_raad_1790197197424.jpg",
    "fallbackAvatar": "/specialists/ahmed_raad_poster.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "doc-saad-dosari": {
    "id": "doc-saad-dosari",
    "name": "سعد الدوسري",
    "avatar": "/uploads/1790866075647_22_png.png",
    "posterCrop": "/specialists/poster_ahmed_raad_1790197742838.jpg",
    "portraitCrop": "/specialists/spec_ahmed_raad_1790197197424.jpg",
    "fallbackAvatar": "/specialists/ahmed_raad_poster.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "spec-fahad-juhani": {
    "id": "spec-fahad-juhani",
    "name": "فهد الجهني",
    "avatar": "/uploads/1790866092167_23_png.png",
    "posterCrop": "/specialists/poster_ahmed_raad_1790197742838.jpg",
    "portraitCrop": "/specialists/spec_ahmed_raad_1790197197424.jpg",
    "fallbackAvatar": "/specialists/ahmed_raad_poster.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "doc-fahad-juhani": {
    "id": "doc-fahad-juhani",
    "name": "فهد الجهني",
    "avatar": "/uploads/1790866092167_23_png.png",
    "posterCrop": "/specialists/poster_ahmed_raad_1790197742838.jpg",
    "portraitCrop": "/specialists/spec_ahmed_raad_1790197197424.jpg",
    "fallbackAvatar": "/specialists/ahmed_raad_poster.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "spec-hala-enazi": {
    "id": "spec-hala-enazi",
    "name": "هلا العنزي",
    "avatar": "/uploads/1790866107078_24_png.png",
    "posterCrop": "/specialists/poster_ahmed_raad_1790197742838.jpg",
    "portraitCrop": "/specialists/spec_ahmed_raad_1790197197424.jpg",
    "fallbackAvatar": "/specialists/ahmed_raad_poster.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "doc-hala-enazi": {
    "id": "doc-hala-enazi",
    "name": "هلا العنزي",
    "avatar": "/uploads/1790866107078_24_png.png",
    "posterCrop": "/specialists/poster_ahmed_raad_1790197742838.jpg",
    "portraitCrop": "/specialists/spec_ahmed_raad_1790197197424.jpg",
    "fallbackAvatar": "/specialists/ahmed_raad_poster.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "spec-taif-subaie": {
    "id": "spec-taif-subaie",
    "name": "طيف السبيعي",
    "avatar": "/uploads/1790866122845_25_png.png",
    "posterCrop": "/specialists/poster_ahmed_raad_1790197742838.jpg",
    "portraitCrop": "/specialists/spec_ahmed_raad_1790197197424.jpg",
    "fallbackAvatar": "/specialists/ahmed_raad_poster.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "doc-taif-subaie": {
    "id": "doc-taif-subaie",
    "name": "طيف السبيعي",
    "avatar": "/uploads/1790866122845_25_png.png",
    "posterCrop": "/specialists/poster_ahmed_raad_1790197742838.jpg",
    "portraitCrop": "/specialists/spec_ahmed_raad_1790197197424.jpg",
    "fallbackAvatar": "/specialists/ahmed_raad_poster.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "spec-raghad-hawarneh": {
    "id": "spec-raghad-hawarneh",
    "name": "رغد حوارنه",
    "avatar": "/uploads/1790866151823_26_png.png",
    "posterCrop": "/specialists/poster_ahmed_raad_1790197742838.jpg",
    "portraitCrop": "/specialists/spec_ahmed_raad_1790197197424.jpg",
    "fallbackAvatar": "/specialists/ahmed_raad_poster.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "doc-raghad-hawarneh": {
    "id": "doc-raghad-hawarneh",
    "name": "رغد حوارنه",
    "avatar": "/uploads/1790866151823_26_png.png",
    "posterCrop": "/specialists/poster_ahmed_raad_1790197742838.jpg",
    "portraitCrop": "/specialists/spec_ahmed_raad_1790197197424.jpg",
    "fallbackAvatar": "/specialists/ahmed_raad_poster.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "spec-eman-bahattab": {
    "id": "spec-eman-bahattab",
    "name": "إيمان باحطاب",
    "avatar": "/uploads/1790866167869_27_png.png",
    "posterCrop": "/specialists/poster_ahmed_raad_1790197742838.jpg",
    "portraitCrop": "/specialists/spec_ahmed_raad_1790197197424.jpg",
    "fallbackAvatar": "/specialists/ahmed_raad_poster.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "doc-eman-bahattab": {
    "id": "doc-eman-bahattab",
    "name": "إيمان باحطاب",
    "avatar": "/uploads/1790866167869_27_png.png",
    "posterCrop": "/specialists/poster_ahmed_raad_1790197742838.jpg",
    "portraitCrop": "/specialists/spec_ahmed_raad_1790197197424.jpg",
    "fallbackAvatar": "/specialists/ahmed_raad_poster.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "spec-omar-saad-speech": {
    "id": "spec-omar-saad-speech",
    "name": "عمر سعد",
    "avatar": "/uploads/1790866182582_28_png.png",
    "posterCrop": "/specialists/poster_ahmed_raad_1790197742838.jpg",
    "portraitCrop": "/specialists/spec_ahmed_raad_1790197197424.jpg",
    "fallbackAvatar": "/specialists/ahmed_raad_poster.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "doc-omar-saad-speech": {
    "id": "doc-omar-saad-speech",
    "name": "عمر سعد",
    "avatar": "/uploads/1790866182582_28_png.png",
    "posterCrop": "/specialists/poster_ahmed_raad_1790197742838.jpg",
    "portraitCrop": "/specialists/spec_ahmed_raad_1790197197424.jpg",
    "fallbackAvatar": "/specialists/ahmed_raad_poster.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "spec-aliah-mutairi": {
    "id": "spec-aliah-mutairi",
    "name": "عاليه المطيري",
    "avatar": "/uploads/1790866202949_29_png.png",
    "posterCrop": "/specialists/poster_ahmed_raad_1790197742838.jpg",
    "portraitCrop": "/specialists/spec_ahmed_raad_1790197197424.jpg",
    "fallbackAvatar": "/specialists/ahmed_raad_poster.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "doc-aliah-mutairi": {
    "id": "doc-aliah-mutairi",
    "name": "عاليه المطيري",
    "avatar": "/uploads/1790866202949_29_png.png",
    "posterCrop": "/specialists/poster_ahmed_raad_1790197742838.jpg",
    "portraitCrop": "/specialists/spec_ahmed_raad_1790197197424.jpg",
    "fallbackAvatar": "/specialists/ahmed_raad_poster.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "spec-haya-faleh": {
    "id": "spec-haya-faleh",
    "name": "هياء الفالح",
    "avatar": "/uploads/1790866269363_30_png.png",
    "posterCrop": "/specialists/poster_ahmed_raad_1790197742838.jpg",
    "portraitCrop": "/specialists/spec_ahmed_raad_1790197197424.jpg",
    "fallbackAvatar": "/specialists/ahmed_raad_poster.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "doc-haya-faleh": {
    "id": "doc-haya-faleh",
    "name": "هياء الفالح",
    "avatar": "/uploads/1790866269363_30_png.png",
    "posterCrop": "/specialists/poster_ahmed_raad_1790197742838.jpg",
    "portraitCrop": "/specialists/spec_ahmed_raad_1790197197424.jpg",
    "fallbackAvatar": "/specialists/ahmed_raad_poster.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "spec-haya-dosari": {
    "id": "spec-haya-dosari",
    "name": "هياء الدوسري",
    "avatar": "/uploads/1790866288993_31_png.png",
    "posterCrop": "/specialists/poster_ahmed_raad_1790197742838.jpg",
    "portraitCrop": "/specialists/spec_ahmed_raad_1790197197424.jpg",
    "fallbackAvatar": "/specialists/ahmed_raad_poster.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "doc-haya-dosari": {
    "id": "doc-haya-dosari",
    "name": "هياء الدوسري",
    "avatar": "/uploads/1790866288993_31_png.png",
    "posterCrop": "/specialists/poster_ahmed_raad_1790197742838.jpg",
    "portraitCrop": "/specialists/spec_ahmed_raad_1790197197424.jpg",
    "fallbackAvatar": "/specialists/ahmed_raad_poster.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "spec-renad-otaibi": {
    "id": "spec-renad-otaibi",
    "name": "",
    "avatar": "/uploads/1790866298707_32_png.png",
    "posterCrop": "/specialists/poster_ahmed_raad_1790197742838.jpg",
    "portraitCrop": "/specialists/spec_ahmed_raad_1790197197424.jpg",
    "fallbackAvatar": "/specialists/ahmed_raad_poster.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "doc-renad-otaibi": {
    "id": "doc-renad-otaibi",
    "name": "",
    "avatar": "/uploads/1790866298707_32_png.png",
    "posterCrop": "/specialists/poster_ahmed_raad_1790197742838.jpg",
    "portraitCrop": "/specialists/spec_ahmed_raad_1790197197424.jpg",
    "fallbackAvatar": "/specialists/ahmed_raad_poster.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "spec-hesham-ali": {
    "id": "spec-hesham-ali",
    "name": "هشام علي",
    "avatar": "/uploads/1791187379881_60_png.png",
    "posterCrop": "/specialists/poster_ahmed_raad_1790197742838.jpg",
    "portraitCrop": "/specialists/spec_ahmed_raad_1790197197424.jpg",
    "fallbackAvatar": "/specialists/ahmed_raad_poster.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "doc-hesham-ali": {
    "id": "doc-hesham-ali",
    "name": "هشام علي",
    "avatar": "/uploads/1791187379881_60_png.png",
    "posterCrop": "/specialists/poster_ahmed_raad_1790197742838.jpg",
    "portraitCrop": "/specialists/spec_ahmed_raad_1790197197424.jpg",
    "fallbackAvatar": "/specialists/ahmed_raad_poster.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "spec-amer-qadoos": {
    "id": "spec-amer-qadoos",
    "name": "عامر قادوس",
    "avatar": "/uploads/1791187395677_61_png.png",
    "posterCrop": "/specialists/poster_ahmed_raad_1790197742838.jpg",
    "portraitCrop": "/specialists/spec_ahmed_raad_1790197197424.jpg",
    "fallbackAvatar": "/specialists/ahmed_raad_poster.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "doc-amer-qadoos": {
    "id": "doc-amer-qadoos",
    "name": "عامر قادوس",
    "avatar": "/uploads/1791187395677_61_png.png",
    "posterCrop": "/specialists/poster_ahmed_raad_1790197742838.jpg",
    "portraitCrop": "/specialists/spec_ahmed_raad_1790197197424.jpg",
    "fallbackAvatar": "/specialists/ahmed_raad_poster.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "spec-ahlam-alnoaman": {
    "id": "spec-ahlam-alnoaman",
    "name": "أحلام النعمان",
    "avatar": "/uploads/1791192101630________________png.png",
    "posterCrop": "/specialists/poster_ahmed_raad_1790197742838.jpg",
    "portraitCrop": "/specialists/spec_ahmed_raad_1790197197424.jpg",
    "fallbackAvatar": "/specialists/ahmed_raad_poster.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "doc-ahlam-alnoaman": {
    "id": "doc-ahlam-alnoaman",
    "name": "أحلام النعمان",
    "avatar": "/uploads/1791192101630________________png.png",
    "posterCrop": "/specialists/poster_ahmed_raad_1790197742838.jpg",
    "portraitCrop": "/specialists/spec_ahmed_raad_1790197197424.jpg",
    "fallbackAvatar": "/specialists/ahmed_raad_poster.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "spec-atheer-alrasheed": {
    "id": "spec-atheer-alrasheed",
    "name": "اثير آل رشيد",
    "avatar": "/uploads/1791192114276_______________png.png",
    "posterCrop": "/specialists/poster_ahmed_raad_1790197742838.jpg",
    "portraitCrop": "/specialists/spec_ahmed_raad_1790197197424.jpg",
    "fallbackAvatar": "/specialists/ahmed_raad_poster.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "doc-atheer-alrasheed": {
    "id": "doc-atheer-alrasheed",
    "name": "اثير آل رشيد",
    "avatar": "/uploads/1791192114276_______________png.png",
    "posterCrop": "/specialists/poster_ahmed_raad_1790197742838.jpg",
    "portraitCrop": "/specialists/spec_ahmed_raad_1790197197424.jpg",
    "fallbackAvatar": "/specialists/ahmed_raad_poster.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "spec-tasneem-sabry": {
    "id": "spec-tasneem-sabry",
    "name": "د. تسنيم صبري",
    "avatar": "/uploads/1791192126580____________png.png",
    "posterCrop": "/specialists/poster_ahmed_raad_1790197742838.jpg",
    "portraitCrop": "/specialists/spec_ahmed_raad_1790197197424.jpg",
    "fallbackAvatar": "/specialists/ahmed_raad_poster.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "doc-tasneem-sabry": {
    "id": "doc-tasneem-sabry",
    "name": "د. تسنيم صبري",
    "avatar": "/uploads/1791192126580____________png.png",
    "posterCrop": "/specialists/poster_ahmed_raad_1790197742838.jpg",
    "portraitCrop": "/specialists/spec_ahmed_raad_1790197197424.jpg",
    "fallbackAvatar": "/specialists/ahmed_raad_poster.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "spec-tasneem-abdelaziz": {
    "id": "spec-tasneem-abdelaziz",
    "name": "تسنيم عبد العزيز",
    "avatar": "/uploads/1791192139635__________________png.png",
    "posterCrop": "/specialists/poster_ahmed_raad_1790197742838.jpg",
    "portraitCrop": "/specialists/spec_ahmed_raad_1790197197424.jpg",
    "fallbackAvatar": "/specialists/ahmed_raad_poster.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "doc-tasneem-abdelaziz": {
    "id": "doc-tasneem-abdelaziz",
    "name": "تسنيم عبد العزيز",
    "avatar": "/uploads/1791192139635__________________png.png",
    "posterCrop": "/specialists/poster_ahmed_raad_1790197742838.jpg",
    "portraitCrop": "/specialists/spec_ahmed_raad_1790197197424.jpg",
    "fallbackAvatar": "/specialists/ahmed_raad_poster.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "spec-jawaher-ibrahim": {
    "id": "spec-jawaher-ibrahim",
    "name": "جواهر إبراهيم",
    "avatar": "/uploads/1791192158941________________png.png",
    "posterCrop": "/specialists/poster_ahmed_raad_1790197742838.jpg",
    "portraitCrop": "/specialists/spec_ahmed_raad_1790197197424.jpg",
    "fallbackAvatar": "/specialists/ahmed_raad_poster.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "doc-jawaher-ibrahim": {
    "id": "doc-jawaher-ibrahim",
    "name": "جواهر إبراهيم",
    "avatar": "/uploads/1791192158941________________png.png",
    "posterCrop": "/specialists/poster_ahmed_raad_1790197742838.jpg",
    "portraitCrop": "/specialists/spec_ahmed_raad_1790197197424.jpg",
    "fallbackAvatar": "/specialists/ahmed_raad_poster.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "spec-hossam-samy": {
    "id": "spec-hossam-samy",
    "name": "حسام سامي",
    "avatar": "/uploads/1791192167745___________png.png",
    "posterCrop": "/specialists/poster_ahmed_raad_1790197742838.jpg",
    "portraitCrop": "/specialists/spec_ahmed_raad_1790197197424.jpg",
    "fallbackAvatar": "/specialists/ahmed_raad_poster.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "doc-hossam-samy": {
    "id": "doc-hossam-samy",
    "name": "حسام سامي",
    "avatar": "/uploads/1791192167745___________png.png",
    "posterCrop": "/specialists/poster_ahmed_raad_1790197742838.jpg",
    "portraitCrop": "/specialists/spec_ahmed_raad_1790197197424.jpg",
    "fallbackAvatar": "/specialists/ahmed_raad_poster.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "spec-khaled-alharbi": {
    "id": "spec-khaled-alharbi",
    "name": "خالد الحربي",
    "avatar": "/uploads/1791192175779_____________png.png",
    "posterCrop": "/specialists/poster_ahmed_raad_1790197742838.jpg",
    "portraitCrop": "/specialists/spec_ahmed_raad_1790197197424.jpg",
    "fallbackAvatar": "/specialists/ahmed_raad_poster.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "doc-khaled-alharbi": {
    "id": "doc-khaled-alharbi",
    "name": "خالد الحربي",
    "avatar": "/uploads/1791192175779_____________png.png",
    "posterCrop": "/specialists/poster_ahmed_raad_1790197742838.jpg",
    "portraitCrop": "/specialists/spec_ahmed_raad_1790197197424.jpg",
    "fallbackAvatar": "/specialists/ahmed_raad_poster.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "spec-reema-alhusseini": {
    "id": "spec-reema-alhusseini",
    "name": "ريمه الحسيني",
    "avatar": "/uploads/1791192184198______________png.png",
    "posterCrop": "/specialists/poster_ahmed_raad_1790197742838.jpg",
    "portraitCrop": "/specialists/spec_ahmed_raad_1790197197424.jpg",
    "fallbackAvatar": "/specialists/ahmed_raad_poster.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "doc-reema-alhusseini": {
    "id": "doc-reema-alhusseini",
    "name": "ريمه الحسيني",
    "avatar": "/uploads/1791192184198______________png.png",
    "posterCrop": "/specialists/poster_ahmed_raad_1790197742838.jpg",
    "portraitCrop": "/specialists/spec_ahmed_raad_1790197197424.jpg",
    "fallbackAvatar": "/specialists/ahmed_raad_poster.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "spec-sultan-alshaye": {
    "id": "spec-sultan-alshaye",
    "name": "سلطان الشايع",
    "avatar": "/uploads/1791192194710______________png.png",
    "posterCrop": "/specialists/poster_ahmed_raad_1790197742838.jpg",
    "portraitCrop": "/specialists/spec_ahmed_raad_1790197197424.jpg",
    "fallbackAvatar": "/specialists/ahmed_raad_poster.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "doc-sultan-alshaye": {
    "id": "doc-sultan-alshaye",
    "name": "سلطان الشايع",
    "avatar": "/uploads/1791192194710______________png.png",
    "posterCrop": "/specialists/poster_ahmed_raad_1790197742838.jpg",
    "portraitCrop": "/specialists/spec_ahmed_raad_1790197197424.jpg",
    "fallbackAvatar": "/specialists/ahmed_raad_poster.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "spec-shaimaa-adel": {
    "id": "spec-shaimaa-adel",
    "name": "شيماء عادل",
    "avatar": "/uploads/1791192202894____________png.png",
    "posterCrop": "/specialists/poster_ahmed_raad_1790197742838.jpg",
    "portraitCrop": "/specialists/spec_ahmed_raad_1790197197424.jpg",
    "fallbackAvatar": "/specialists/ahmed_raad_poster.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "doc-shaimaa-adel": {
    "id": "doc-shaimaa-adel",
    "name": "شيماء عادل",
    "avatar": "/uploads/1791192202894____________png.png",
    "posterCrop": "/specialists/poster_ahmed_raad_1790197742838.jpg",
    "portraitCrop": "/specialists/spec_ahmed_raad_1790197197424.jpg",
    "fallbackAvatar": "/specialists/ahmed_raad_poster.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "spec-abdelilah-shakl": {
    "id": "spec-abdelilah-shakl",
    "name": "عبدالاله شقل",
    "avatar": "/uploads/1791192213481______________png.png",
    "posterCrop": "/specialists/poster_ahmed_raad_1790197742838.jpg",
    "portraitCrop": "/specialists/spec_ahmed_raad_1790197197424.jpg",
    "fallbackAvatar": "/specialists/ahmed_raad_poster.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "doc-abdelilah-shakl": {
    "id": "doc-abdelilah-shakl",
    "name": "عبدالاله شقل",
    "avatar": "/uploads/1791192213481______________png.png",
    "posterCrop": "/specialists/poster_ahmed_raad_1790197742838.jpg",
    "portraitCrop": "/specialists/spec_ahmed_raad_1790197197424.jpg",
    "fallbackAvatar": "/specialists/ahmed_raad_poster.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "spec-alaa-eldin-nagy": {
    "id": "spec-alaa-eldin-nagy",
    "name": "علاء الدين ناجي",
    "avatar": "/uploads/1791192231188_________________png.png",
    "posterCrop": "/specialists/poster_ahmed_raad_1790197742838.jpg",
    "portraitCrop": "/specialists/spec_ahmed_raad_1790197197424.jpg",
    "fallbackAvatar": "/specialists/ahmed_raad_poster.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "doc-alaa-eldin-nagy": {
    "id": "doc-alaa-eldin-nagy",
    "name": "علاء الدين ناجي",
    "avatar": "/uploads/1791192231188_________________png.png",
    "posterCrop": "/specialists/poster_ahmed_raad_1790197742838.jpg",
    "portraitCrop": "/specialists/spec_ahmed_raad_1790197197424.jpg",
    "fallbackAvatar": "/specialists/ahmed_raad_poster.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "spec-ghalib-alotaibi": {
    "id": "spec-ghalib-alotaibi",
    "name": "غالب العتيبي",
    "avatar": "/uploads/1791192244901______________png.png",
    "posterCrop": "/specialists/poster_ahmed_raad_1790197742838.jpg",
    "portraitCrop": "/specialists/spec_ahmed_raad_1790197197424.jpg",
    "fallbackAvatar": "/specialists/ahmed_raad_poster.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "doc-ghalib-alotaibi": {
    "id": "doc-ghalib-alotaibi",
    "name": "غالب العتيبي",
    "avatar": "/uploads/1791192244901______________png.png",
    "posterCrop": "/specialists/poster_ahmed_raad_1790197742838.jpg",
    "portraitCrop": "/specialists/spec_ahmed_raad_1790197197424.jpg",
    "fallbackAvatar": "/specialists/ahmed_raad_poster.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "spec-kareem-ragab": {
    "id": "spec-kareem-ragab",
    "name": "كريم رجب",
    "avatar": "/uploads/1791192253778__________png.png",
    "posterCrop": "/specialists/poster_ahmed_raad_1790197742838.jpg",
    "portraitCrop": "/specialists/spec_ahmed_raad_1790197197424.jpg",
    "fallbackAvatar": "/specialists/ahmed_raad_poster.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "doc-kareem-ragab": {
    "id": "doc-kareem-ragab",
    "name": "كريم رجب",
    "avatar": "/uploads/1791192253778__________png.png",
    "posterCrop": "/specialists/poster_ahmed_raad_1790197742838.jpg",
    "portraitCrop": "/specialists/spec_ahmed_raad_1790197197424.jpg",
    "fallbackAvatar": "/specialists/ahmed_raad_poster.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "spec-marwa-alsharif": {
    "id": "spec-marwa-alsharif",
    "name": "مروة الشريف",
    "avatar": "/uploads/1791192261779_____________png.png",
    "posterCrop": "/specialists/poster_ahmed_raad_1790197742838.jpg",
    "portraitCrop": "/specialists/spec_ahmed_raad_1790197197424.jpg",
    "fallbackAvatar": "/specialists/ahmed_raad_poster.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "doc-marwa-alsharif": {
    "id": "doc-marwa-alsharif",
    "name": "مروة الشريف",
    "avatar": "/uploads/1791192261779_____________png.png",
    "posterCrop": "/specialists/poster_ahmed_raad_1790197742838.jpg",
    "portraitCrop": "/specialists/spec_ahmed_raad_1790197197424.jpg",
    "fallbackAvatar": "/specialists/ahmed_raad_poster.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "spec-mostafa-mahmoud": {
    "id": "spec-mostafa-mahmoud",
    "name": "مصطفى محمود",
    "avatar": "/uploads/1791192271638_____________png.png",
    "posterCrop": "/specialists/poster_ahmed_raad_1790197742838.jpg",
    "portraitCrop": "/specialists/spec_ahmed_raad_1790197197424.jpg",
    "fallbackAvatar": "/specialists/ahmed_raad_poster.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "doc-mostafa-mahmoud": {
    "id": "doc-mostafa-mahmoud",
    "name": "مصطفى محمود",
    "avatar": "/uploads/1791192271638_____________png.png",
    "posterCrop": "/specialists/poster_ahmed_raad_1790197742838.jpg",
    "portraitCrop": "/specialists/spec_ahmed_raad_1790197197424.jpg",
    "fallbackAvatar": "/specialists/ahmed_raad_poster.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "spec-mayar-alsaeed": {
    "id": "spec-mayar-alsaeed",
    "name": "ميار السعيد",
    "avatar": "/uploads/1791192282250_____________png.png",
    "posterCrop": "/specialists/poster_ahmed_raad_1790197742838.jpg",
    "portraitCrop": "/specialists/spec_ahmed_raad_1790197197424.jpg",
    "fallbackAvatar": "/specialists/ahmed_raad_poster.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "doc-mayar-alsaeed": {
    "id": "doc-mayar-alsaeed",
    "name": "ميار السعيد",
    "avatar": "/uploads/1791192282250_____________png.png",
    "posterCrop": "/specialists/poster_ahmed_raad_1790197742838.jpg",
    "portraitCrop": "/specialists/spec_ahmed_raad_1790197197424.jpg",
    "fallbackAvatar": "/specialists/ahmed_raad_poster.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "spec-hala-badran": {
    "id": "spec-hala-badran",
    "name": "هالة بدران",
    "avatar": "/uploads/1791192291320____________png.png",
    "posterCrop": "/specialists/poster_ahmed_raad_1790197742838.jpg",
    "portraitCrop": "/specialists/spec_ahmed_raad_1790197197424.jpg",
    "fallbackAvatar": "/specialists/ahmed_raad_poster.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "doc-hala-badran": {
    "id": "doc-hala-badran",
    "name": "هالة بدران",
    "avatar": "/uploads/1791192291320____________png.png",
    "posterCrop": "/specialists/poster_ahmed_raad_1790197742838.jpg",
    "portraitCrop": "/specialists/spec_ahmed_raad_1790197197424.jpg",
    "fallbackAvatar": "/specialists/ahmed_raad_poster.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "spec-hind-elsayed": {
    "id": "spec-hind-elsayed",
    "name": "هند السيد",
    "avatar": "/uploads/1791192301426___________png.png",
    "posterCrop": "/specialists/poster_ahmed_raad_1790197742838.jpg",
    "portraitCrop": "/specialists/spec_ahmed_raad_1790197197424.jpg",
    "fallbackAvatar": "/specialists/ahmed_raad_poster.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "doc-hind-elsayed": {
    "id": "doc-hind-elsayed",
    "name": "هند السيد",
    "avatar": "/uploads/1791192301426___________png.png",
    "posterCrop": "/specialists/poster_ahmed_raad_1790197742838.jpg",
    "portraitCrop": "/specialists/spec_ahmed_raad_1790197197424.jpg",
    "fallbackAvatar": "/specialists/ahmed_raad_poster.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "spec-haitham-alzaidan": {
    "id": "spec-haitham-alzaidan",
    "name": "هيثم الزيدان",
    "avatar": "/uploads/1791192310187______________png.png",
    "posterCrop": "/specialists/poster_ahmed_raad_1790197742838.jpg",
    "portraitCrop": "/specialists/spec_ahmed_raad_1790197197424.jpg",
    "fallbackAvatar": "/specialists/ahmed_raad_poster.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "doc-haitham-alzaidan": {
    "id": "doc-haitham-alzaidan",
    "name": "هيثم الزيدان",
    "avatar": "/uploads/1791192310187______________png.png",
    "posterCrop": "/specialists/poster_ahmed_raad_1790197742838.jpg",
    "portraitCrop": "/specialists/spec_ahmed_raad_1790197197424.jpg",
    "fallbackAvatar": "/specialists/ahmed_raad_poster.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "doc-yara-abouhamda": {
    "id": "doc-yara-abouhamda",
    "name": "يارا أبو حمده",
    "avatar": "/specialists/cards/spec_21_yara-abouhamda.png",
    "posterCrop": "/specialists/cards/spec_21_yara-abouhamda.png",
    "portraitCrop": "/specialists/cards/spec_21_yara-abouhamda.png",
    "fallbackAvatar": "/specialists/cards/spec_21_yara-abouhamda.png",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "spec-yara-abouhamda": {
    "id": "spec-yara-abouhamda",
    "name": "يارا أبو حمده",
    "avatar": "/specialists/cards/spec_21_yara-abouhamda.png",
    "posterCrop": "/specialists/cards/spec_21_yara-abouhamda.png",
    "portraitCrop": "/specialists/cards/spec_21_yara-abouhamda.png",
    "fallbackAvatar": "/specialists/cards/spec_21_yara-abouhamda.png",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "spec-hajar-mohamed": {
    "id": "spec-hajar-mohamed",
    "name": "هاجر محمد",
    "avatar": "/specialists/cards/spec_hajar_mohamed.jpg",
    "posterCrop": "/specialists/cards/spec_hajar_mohamed.jpg",
    "portraitCrop": "/specialists/cards/spec_hajar_mohamed.jpg",
    "fallbackAvatar": "/specialists/cards/spec_hajar_mohamed.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "doc-hajar-mohamed": {
    "id": "doc-hajar-mohamed",
    "name": "هاجر محمد",
    "avatar": "/specialists/cards/spec_hajar_mohamed.jpg",
    "posterCrop": "/specialists/cards/spec_hajar_mohamed.jpg",
    "portraitCrop": "/specialists/cards/spec_hajar_mohamed.jpg",
    "fallbackAvatar": "/specialists/cards/spec_hajar_mohamed.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "spec-dina-abdullah": {
    "id": "spec-dina-abdullah",
    "name": "دينا عبدالله",
    "avatar": "/specialists/cards/spec_dina_abdullah.jpg",
    "posterCrop": "/specialists/cards/spec_dina_abdullah.jpg",
    "portraitCrop": "/specialists/cards/spec_dina_abdullah.jpg",
    "fallbackAvatar": "/specialists/cards/spec_dina_abdullah.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "doc-dina-abdullah": {
    "id": "doc-dina-abdullah",
    "name": "دينا عبدالله",
    "avatar": "/specialists/cards/spec_dina_abdullah.jpg",
    "posterCrop": "/specialists/cards/spec_dina_abdullah.jpg",
    "portraitCrop": "/specialists/cards/spec_dina_abdullah.jpg",
    "fallbackAvatar": "/specialists/cards/spec_dina_abdullah.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "spec-alaa-zayed": {
    "id": "spec-alaa-zayed",
    "name": "علاء زايد",
    "avatar": "/specialists/cards/spec_alaa_zayed.jpg",
    "posterCrop": "/specialists/cards/spec_alaa_zayed.jpg",
    "portraitCrop": "/specialists/cards/spec_alaa_zayed.jpg",
    "fallbackAvatar": "/specialists/cards/spec_alaa_zayed.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "doc-alaa-zayed": {
    "id": "doc-alaa-zayed",
    "name": "علاء زايد",
    "avatar": "/specialists/cards/spec_alaa_zayed.jpg",
    "posterCrop": "/specialists/cards/spec_alaa_zayed.jpg",
    "portraitCrop": "/specialists/cards/spec_alaa_zayed.jpg",
    "fallbackAvatar": "/specialists/cards/spec_alaa_zayed.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "spec-rakan-otaibi": {
    "id": "spec-rakan-otaibi",
    "name": "راكان العتيبي",
    "avatar": "/specialists/cards/spec_rakan_otaibi.jpg",
    "posterCrop": "/specialists/cards/spec_rakan_otaibi.jpg",
    "portraitCrop": "/specialists/cards/spec_rakan_otaibi.jpg",
    "fallbackAvatar": "/specialists/cards/spec_rakan_otaibi.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "doc-rakan-otaibi": {
    "id": "doc-rakan-otaibi",
    "name": "راكان العتيبي",
    "avatar": "/specialists/cards/spec_rakan_otaibi.jpg",
    "posterCrop": "/specialists/cards/spec_rakan_otaibi.jpg",
    "portraitCrop": "/specialists/cards/spec_rakan_otaibi.jpg",
    "fallbackAvatar": "/specialists/cards/spec_rakan_otaibi.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "spec-mohamed-youssef": {
    "id": "spec-mohamed-youssef",
    "name": "محمد يوسف",
    "avatar": "/specialists/cards/spec_mohamed_youssef.jpg",
    "posterCrop": "/specialists/cards/spec_mohamed_youssef.jpg",
    "portraitCrop": "/specialists/cards/spec_mohamed_youssef.jpg",
    "fallbackAvatar": "/specialists/cards/spec_mohamed_youssef.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "doc-mohamed-youssef": {
    "id": "doc-mohamed-youssef",
    "name": "محمد يوسف",
    "avatar": "/specialists/cards/spec_mohamed_youssef.jpg",
    "posterCrop": "/specialists/cards/spec_mohamed_youssef.jpg",
    "portraitCrop": "/specialists/cards/spec_mohamed_youssef.jpg",
    "fallbackAvatar": "/specialists/cards/spec_mohamed_youssef.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "spec-islam-ibrahim": {
    "id": "spec-islam-ibrahim",
    "name": "اسلام ابراهيم",
    "avatar": "/specialists/cards/spec_islam_ibrahim.jpg",
    "posterCrop": "/specialists/cards/spec_islam_ibrahim.jpg",
    "portraitCrop": "/specialists/cards/spec_islam_ibrahim.jpg",
    "fallbackAvatar": "/specialists/cards/spec_islam_ibrahim.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "doc-islam-ibrahim": {
    "id": "doc-islam-ibrahim",
    "name": "اسلام ابراهيم",
    "avatar": "/specialists/cards/spec_islam_ibrahim.jpg",
    "posterCrop": "/specialists/cards/spec_islam_ibrahim.jpg",
    "portraitCrop": "/specialists/cards/spec_islam_ibrahim.jpg",
    "fallbackAvatar": "/specialists/cards/spec_islam_ibrahim.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "spec-maryam-zahrani": {
    "id": "spec-maryam-zahrani",
    "name": "مريم الزهراني",
    "avatar": "/specialists/cards/spec_maryam_zahrani.jpg",
    "posterCrop": "/specialists/cards/spec_maryam_zahrani.jpg",
    "portraitCrop": "/specialists/cards/spec_maryam_zahrani.jpg",
    "fallbackAvatar": "/specialists/cards/spec_maryam_zahrani.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "doc-maryam-zahrani": {
    "id": "doc-maryam-zahrani",
    "name": "مريم الزهراني",
    "avatar": "/specialists/cards/spec_maryam_zahrani.jpg",
    "posterCrop": "/specialists/cards/spec_maryam_zahrani.jpg",
    "portraitCrop": "/specialists/cards/spec_maryam_zahrani.jpg",
    "fallbackAvatar": "/specialists/cards/spec_maryam_zahrani.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "spec-abrar-qahtani": {
    "id": "spec-abrar-qahtani",
    "name": "أبرار القحطاني",
    "avatar": "/specialists/cards/spec_abrar_qahtani.jpg",
    "posterCrop": "/specialists/cards/spec_abrar_qahtani.jpg",
    "portraitCrop": "/specialists/cards/spec_abrar_qahtani.jpg",
    "fallbackAvatar": "/specialists/cards/spec_abrar_qahtani.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "doc-abrar-qahtani": {
    "id": "doc-abrar-qahtani",
    "name": "أبرار القحطاني",
    "avatar": "/specialists/cards/spec_abrar_qahtani.jpg",
    "posterCrop": "/specialists/cards/spec_abrar_qahtani.jpg",
    "portraitCrop": "/specialists/cards/spec_abrar_qahtani.jpg",
    "fallbackAvatar": "/specialists/cards/spec_abrar_qahtani.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
};

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
    avatar: '/images/specialists/ahmed_raad.jpg',
    posterCrop: '/images/specialists/ahmed_raad.jpg',
    portraitCrop: '/images/specialists/ahmed_raad.jpg',
    fallbackAvatar: '/images/specialists/ahmed_raad.jpg',
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
