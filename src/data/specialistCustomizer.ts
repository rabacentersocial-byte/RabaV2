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
    "name": "أ. حنين العبيدي",
    "avatar": "/specialists/cards/spec_01_haneen-obaidi.jpg",
    "posterCrop": "/specialists/cards/spec_01_haneen-obaidi.jpg",
    "portraitCrop": "/specialists/cards/spec_01_haneen-obaidi.jpg",
    "fallbackAvatar": "/specialists/cards/spec_01_haneen-obaidi.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": true,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "doc-haneen-obaidi": {
    "id": "doc-haneen-obaidi",
    "name": "أ. حنين العبيدي",
    "avatar": "/specialists/cards/spec_01_haneen-obaidi.jpg",
    "posterCrop": "/specialists/cards/spec_01_haneen-obaidi.jpg",
    "portraitCrop": "/specialists/cards/spec_01_haneen-obaidi.jpg",
    "fallbackAvatar": "/specialists/cards/spec_01_haneen-obaidi.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": true,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "spec-rahaf-doghmani": {
    "id": "spec-rahaf-doghmani",
    "name": "أ. رهف الدغماني",
    "avatar": "/specialists/cards/spec_02_rahaf-doghmani.jpg",
    "posterCrop": "/specialists/cards/spec_02_rahaf-doghmani.jpg",
    "portraitCrop": "/specialists/cards/spec_02_rahaf-doghmani.jpg",
    "fallbackAvatar": "/specialists/cards/spec_02_rahaf-doghmani.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": true,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "doc-rahaf-doghmani": {
    "id": "doc-rahaf-doghmani",
    "name": "أ. رهف الدغماني",
    "avatar": "/specialists/cards/spec_02_rahaf-doghmani.jpg",
    "posterCrop": "/specialists/cards/spec_02_rahaf-doghmani.jpg",
    "portraitCrop": "/specialists/cards/spec_02_rahaf-doghmani.jpg",
    "fallbackAvatar": "/specialists/cards/spec_02_rahaf-doghmani.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": true,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "spec-doha-khaled": {
    "id": "spec-doha-khaled",
    "name": "أ. ضحى خالد",
    "avatar": "/specialists/cards/spec_03_doha-khaled.jpg",
    "posterCrop": "/specialists/cards/spec_03_doha-khaled.jpg",
    "portraitCrop": "/specialists/cards/spec_03_doha-khaled.jpg",
    "fallbackAvatar": "/specialists/cards/spec_03_doha-khaled.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": true,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "doc-doha-khaled": {
    "id": "doc-doha-khaled",
    "name": "أ. ضحى خالد",
    "avatar": "/specialists/cards/spec_03_doha-khaled.jpg",
    "posterCrop": "/specialists/cards/spec_03_doha-khaled.jpg",
    "portraitCrop": "/specialists/cards/spec_03_doha-khaled.jpg",
    "fallbackAvatar": "/specialists/cards/spec_03_doha-khaled.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": true,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "spec-manar-wahba": {
    "id": "spec-manar-wahba",
    "name": "أ. منار وهبه",
    "avatar": "/specialists/cards/spec_04_manar-wahba.jpg",
    "posterCrop": "/specialists/cards/spec_04_manar-wahba.jpg",
    "portraitCrop": "/specialists/cards/spec_04_manar-wahba.jpg",
    "fallbackAvatar": "/specialists/cards/spec_04_manar-wahba.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "doc-manar-wahba": {
    "id": "doc-manar-wahba",
    "name": "أ. منار وهبه",
    "avatar": "/specialists/cards/spec_04_manar-wahba.jpg",
    "posterCrop": "/specialists/cards/spec_04_manar-wahba.jpg",
    "portraitCrop": "/specialists/cards/spec_04_manar-wahba.jpg",
    "fallbackAvatar": "/specialists/cards/spec_04_manar-wahba.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "spec-ahmed-fathi": {
    "id": "spec-ahmed-fathi",
    "name": "أ. أحمد فتحي",
    "avatar": "/specialists/cards/spec_05_ahmed-fathi.jpg",
    "posterCrop": "/specialists/cards/spec_05_ahmed-fathi.jpg",
    "portraitCrop": "/specialists/cards/spec_05_ahmed-fathi.jpg",
    "fallbackAvatar": "/specialists/cards/spec_05_ahmed-fathi.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "doc-ahmed-fathi": {
    "id": "doc-ahmed-fathi",
    "name": "أ. أحمد فتحي",
    "avatar": "/specialists/cards/spec_05_ahmed-fathi.jpg",
    "posterCrop": "/specialists/cards/spec_05_ahmed-fathi.jpg",
    "portraitCrop": "/specialists/cards/spec_05_ahmed-fathi.jpg",
    "fallbackAvatar": "/specialists/cards/spec_05_ahmed-fathi.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "spec-mohamed-atef": {
    "id": "spec-mohamed-atef",
    "name": "أ. محمد عاطف",
    "avatar": "/specialists/cards/spec_06_mohamed-atef.jpg",
    "posterCrop": "/specialists/cards/spec_06_mohamed-atef.jpg",
    "portraitCrop": "/specialists/cards/spec_06_mohamed-atef.jpg",
    "fallbackAvatar": "/specialists/cards/spec_06_mohamed-atef.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "doc-mohamed-atef": {
    "id": "doc-mohamed-atef",
    "name": "أ. محمد عاطف",
    "avatar": "/specialists/cards/spec_06_mohamed-atef.jpg",
    "posterCrop": "/specialists/cards/spec_06_mohamed-atef.jpg",
    "portraitCrop": "/specialists/cards/spec_06_mohamed-atef.jpg",
    "fallbackAvatar": "/specialists/cards/spec_06_mohamed-atef.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "spec-sadeem-mshari": {
    "id": "spec-sadeem-mshari",
    "name": "أ. سديم احمد المشاري",
    "avatar": "/specialists/cards/spec_07_sadeem-mshari.jpg",
    "posterCrop": "/specialists/cards/spec_07_sadeem-mshari.jpg",
    "portraitCrop": "/specialists/cards/spec_07_sadeem-mshari.jpg",
    "fallbackAvatar": "/specialists/cards/spec_07_sadeem-mshari.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": true,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "doc-sadeem-mshari": {
    "id": "doc-sadeem-mshari",
    "name": "أ. سديم احمد المشاري",
    "avatar": "/specialists/cards/spec_07_sadeem-mshari.jpg",
    "posterCrop": "/specialists/cards/spec_07_sadeem-mshari.jpg",
    "portraitCrop": "/specialists/cards/spec_07_sadeem-mshari.jpg",
    "fallbackAvatar": "/specialists/cards/spec_07_sadeem-mshari.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": true,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "spec-maram-mohamed": {
    "id": "spec-maram-mohamed",
    "name": "أ. مرام محمد",
    "avatar": "/specialists/cards/spec_08_maram-mohamed.jpg",
    "posterCrop": "/specialists/cards/spec_08_maram-mohamed.jpg",
    "portraitCrop": "/specialists/cards/spec_08_maram-mohamed.jpg",
    "fallbackAvatar": "/specialists/cards/spec_08_maram-mohamed.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "doc-maram-mohamed": {
    "id": "doc-maram-mohamed",
    "name": "أ. مرام محمد",
    "avatar": "/specialists/cards/spec_08_maram-mohamed.jpg",
    "posterCrop": "/specialists/cards/spec_08_maram-mohamed.jpg",
    "portraitCrop": "/specialists/cards/spec_08_maram-mohamed.jpg",
    "fallbackAvatar": "/specialists/cards/spec_08_maram-mohamed.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "spec-ahmed-raad": {
    "id": "spec-ahmed-raad",
    "name": "أ. أحمد رعد",
    "avatar": "/specialists/cards/spec_09_ahmed-raad.jpg",
    "posterCrop": "/specialists/cards/spec_09_ahmed-raad.jpg",
    "portraitCrop": "/specialists/cards/spec_09_ahmed-raad.jpg",
    "fallbackAvatar": "/specialists/cards/spec_09_ahmed-raad.jpg",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "doc-ahmed-raad": {
    "id": "doc-ahmed-raad",
    "name": "أ. أحمد رعد",
    "avatar": "/specialists/cards/spec_09_ahmed-raad.jpg",
    "posterCrop": "/specialists/cards/spec_09_ahmed-raad.jpg",
    "portraitCrop": "/specialists/cards/spec_09_ahmed-raad.jpg",
    "fallbackAvatar": "/specialists/cards/spec_09_ahmed-raad.jpg",
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
    "avatar": "/specialists/cards/spec_10_1.png",
    "posterCrop": "/specialists/cards/spec_10_1.png",
    "portraitCrop": "/specialists/cards/spec_10_1.png",
    "fallbackAvatar": "/specialists/cards/spec_10_1.png",
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
    "avatar": "/specialists/cards/spec_10_1.png",
    "posterCrop": "/specialists/cards/spec_10_1.png",
    "portraitCrop": "/specialists/cards/spec_10_1.png",
    "fallbackAvatar": "/specialists/cards/spec_10_1.png",
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
    "avatar": "/specialists/cards/spec_10_1.png",
    "posterCrop": "/specialists/cards/spec_10_1.png",
    "portraitCrop": "/specialists/cards/spec_10_1.png",
    "fallbackAvatar": "/specialists/cards/spec_10_1.png",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": true,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "doc-1": {
    "id": "doc-1",
    "name": "أ. أحمد أبو زيد أنور",
    "avatar": "/specialists/cards/spec_10_1.png",
    "posterCrop": "/specialists/cards/spec_10_1.png",
    "portraitCrop": "/specialists/cards/spec_10_1.png",
    "fallbackAvatar": "/specialists/cards/spec_10_1.png",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": true,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "spec-alzahraa-farag": {
    "id": "spec-alzahraa-farag",
    "name": "",
    "avatar": "/specialists/cards/spec_12_alzahraa-farag.png",
    "posterCrop": "/specialists/cards/spec_12_alzahraa-farag.png",
    "portraitCrop": "/specialists/cards/spec_12_alzahraa-farag.png",
    "fallbackAvatar": "/specialists/cards/spec_12_alzahraa-farag.png",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "doc-alzahraa-farag": {
    "id": "doc-alzahraa-farag",
    "name": "",
    "avatar": "/specialists/cards/spec_12_alzahraa-farag.png",
    "posterCrop": "/specialists/cards/spec_12_alzahraa-farag.png",
    "portraitCrop": "/specialists/cards/spec_12_alzahraa-farag.png",
    "fallbackAvatar": "/specialists/cards/spec_12_alzahraa-farag.png",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "spec-mohamed-saad": {
    "id": "spec-mohamed-saad",
    "name": "",
    "avatar": "/specialists/cards/spec_11_mohamed-saad.png",
    "posterCrop": "/specialists/cards/spec_11_mohamed-saad.png",
    "portraitCrop": "/specialists/cards/spec_11_mohamed-saad.png",
    "fallbackAvatar": "/specialists/cards/spec_11_mohamed-saad.png",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "doc-mohamed-saad": {
    "id": "doc-mohamed-saad",
    "name": "",
    "avatar": "/specialists/cards/spec_11_mohamed-saad.png",
    "posterCrop": "/specialists/cards/spec_11_mohamed-saad.png",
    "portraitCrop": "/specialists/cards/spec_11_mohamed-saad.png",
    "fallbackAvatar": "/specialists/cards/spec_11_mohamed-saad.png",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "spec-ayman-elhoweity": {
    "id": "spec-ayman-elhoweity",
    "name": "",
    "avatar": "/specialists/cards/spec_15_ayman-elhoweity.png",
    "posterCrop": "/specialists/cards/spec_15_ayman-elhoweity.png",
    "portraitCrop": "/specialists/cards/spec_15_ayman-elhoweity.png",
    "fallbackAvatar": "/specialists/cards/spec_15_ayman-elhoweity.png",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "doc-ayman-elhoweity": {
    "id": "doc-ayman-elhoweity",
    "name": "",
    "avatar": "/specialists/cards/spec_15_ayman-elhoweity.png",
    "posterCrop": "/specialists/cards/spec_15_ayman-elhoweity.png",
    "portraitCrop": "/specialists/cards/spec_15_ayman-elhoweity.png",
    "fallbackAvatar": "/specialists/cards/spec_15_ayman-elhoweity.png",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "spec-asmaa-moustafa": {
    "id": "spec-asmaa-moustafa",
    "name": "",
    "avatar": "/specialists/cards/spec_14_asmaa-moustafa.png",
    "posterCrop": "/specialists/cards/spec_14_asmaa-moustafa.png",
    "portraitCrop": "/specialists/cards/spec_14_asmaa-moustafa.png",
    "fallbackAvatar": "/specialists/cards/spec_14_asmaa-moustafa.png",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "doc-asmaa-moustafa": {
    "id": "doc-asmaa-moustafa",
    "name": "",
    "avatar": "/specialists/cards/spec_14_asmaa-moustafa.png",
    "posterCrop": "/specialists/cards/spec_14_asmaa-moustafa.png",
    "portraitCrop": "/specialists/cards/spec_14_asmaa-moustafa.png",
    "fallbackAvatar": "/specialists/cards/spec_14_asmaa-moustafa.png",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "spec-noura-elbasyouni": {
    "id": "spec-noura-elbasyouni",
    "name": "",
    "avatar": "/specialists/cards/spec_13_noura-elbasyouni.png",
    "posterCrop": "/specialists/cards/spec_13_noura-elbasyouni.png",
    "portraitCrop": "/specialists/cards/spec_13_noura-elbasyouni.png",
    "fallbackAvatar": "/specialists/cards/spec_13_noura-elbasyouni.png",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "doc-noura-elbasyouni": {
    "id": "doc-noura-elbasyouni",
    "name": "",
    "avatar": "/specialists/cards/spec_13_noura-elbasyouni.png",
    "posterCrop": "/specialists/cards/spec_13_noura-elbasyouni.png",
    "portraitCrop": "/specialists/cards/spec_13_noura-elbasyouni.png",
    "fallbackAvatar": "/specialists/cards/spec_13_noura-elbasyouni.png",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "spec-mohamed-bakry": {
    "id": "spec-mohamed-bakry",
    "name": "",
    "avatar": "/specialists/cards/spec_16_mohamed-bakry.png",
    "posterCrop": "/specialists/cards/spec_16_mohamed-bakry.png",
    "portraitCrop": "/specialists/cards/spec_16_mohamed-bakry.png",
    "fallbackAvatar": "/specialists/cards/spec_16_mohamed-bakry.png",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "doc-mohamed-bakry": {
    "id": "doc-mohamed-bakry",
    "name": "",
    "avatar": "/specialists/cards/spec_16_mohamed-bakry.png",
    "posterCrop": "/specialists/cards/spec_16_mohamed-bakry.png",
    "portraitCrop": "/specialists/cards/spec_16_mohamed-bakry.png",
    "fallbackAvatar": "/specialists/cards/spec_16_mohamed-bakry.png",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "spec-anwar-elmaghyouli": {
    "id": "spec-anwar-elmaghyouli",
    "name": "",
    "avatar": "/specialists/cards/spec_17_anwar-elmaghyouli.png",
    "posterCrop": "/specialists/cards/spec_17_anwar-elmaghyouli.png",
    "portraitCrop": "/specialists/cards/spec_17_anwar-elmaghyouli.png",
    "fallbackAvatar": "/specialists/cards/spec_17_anwar-elmaghyouli.png",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "doc-anwar-elmaghyouli": {
    "id": "doc-anwar-elmaghyouli",
    "name": "",
    "avatar": "/specialists/cards/spec_17_anwar-elmaghyouli.png",
    "posterCrop": "/specialists/cards/spec_17_anwar-elmaghyouli.png",
    "portraitCrop": "/specialists/cards/spec_17_anwar-elmaghyouli.png",
    "fallbackAvatar": "/specialists/cards/spec_17_anwar-elmaghyouli.png",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "spec-mohamed-abdelhamid": {
    "id": "spec-mohamed-abdelhamid",
    "name": "",
    "avatar": "/specialists/cards/spec_18_mohamed-abdelhamid.png",
    "posterCrop": "/specialists/cards/spec_18_mohamed-abdelhamid.png",
    "portraitCrop": "/specialists/cards/spec_18_mohamed-abdelhamid.png",
    "fallbackAvatar": "/specialists/cards/spec_18_mohamed-abdelhamid.png",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "doc-mohamed-abdelhamid": {
    "id": "doc-mohamed-abdelhamid",
    "name": "",
    "avatar": "/specialists/cards/spec_18_mohamed-abdelhamid.png",
    "posterCrop": "/specialists/cards/spec_18_mohamed-abdelhamid.png",
    "portraitCrop": "/specialists/cards/spec_18_mohamed-abdelhamid.png",
    "fallbackAvatar": "/specialists/cards/spec_18_mohamed-abdelhamid.png",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "spec-mohamed-elgayyar": {
    "id": "spec-mohamed-elgayyar",
    "name": "",
    "avatar": "/specialists/cards/spec_19_mohamed-elgayyar.png",
    "posterCrop": "/specialists/cards/spec_19_mohamed-elgayyar.png",
    "portraitCrop": "/specialists/cards/spec_19_mohamed-elgayyar.png",
    "fallbackAvatar": "/specialists/cards/spec_19_mohamed-elgayyar.png",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "doc-mohamed-elgayyar": {
    "id": "doc-mohamed-elgayyar",
    "name": "",
    "avatar": "/specialists/cards/spec_19_mohamed-elgayyar.png",
    "posterCrop": "/specialists/cards/spec_19_mohamed-elgayyar.png",
    "portraitCrop": "/specialists/cards/spec_19_mohamed-elgayyar.png",
    "fallbackAvatar": "/specialists/cards/spec_19_mohamed-elgayyar.png",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "spec-elsaeed-diab": {
    "id": "spec-elsaeed-diab",
    "name": "",
    "avatar": "/specialists/cards/spec_20_elsaeed-diab.png",
    "posterCrop": "/specialists/cards/spec_20_elsaeed-diab.png",
    "portraitCrop": "/specialists/cards/spec_20_elsaeed-diab.png",
    "fallbackAvatar": "/specialists/cards/spec_20_elsaeed-diab.png",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "doc-elsaeed-diab": {
    "id": "doc-elsaeed-diab",
    "name": "",
    "avatar": "/specialists/cards/spec_20_elsaeed-diab.png",
    "posterCrop": "/specialists/cards/spec_20_elsaeed-diab.png",
    "portraitCrop": "/specialists/cards/spec_20_elsaeed-diab.png",
    "fallbackAvatar": "/specialists/cards/spec_20_elsaeed-diab.png",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "spec-sara-abdelhamid": {
    "id": "spec-sara-abdelhamid",
    "name": "",
    "avatar": "/specialists/cards/spec_21_sara-abdelhamid.png",
    "posterCrop": "/specialists/cards/spec_21_sara-abdelhamid.png",
    "portraitCrop": "/specialists/cards/spec_21_sara-abdelhamid.png",
    "fallbackAvatar": "/specialists/cards/spec_21_sara-abdelhamid.png",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "doc-sara-abdelhamid": {
    "id": "doc-sara-abdelhamid",
    "name": "",
    "avatar": "/specialists/cards/spec_21_sara-abdelhamid.png",
    "posterCrop": "/specialists/cards/spec_21_sara-abdelhamid.png",
    "portraitCrop": "/specialists/cards/spec_21_sara-abdelhamid.png",
    "fallbackAvatar": "/specialists/cards/spec_21_sara-abdelhamid.png",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "spec-hanaa-basheer": {
    "id": "spec-hanaa-basheer",
    "name": "",
    "avatar": "/specialists/cards/spec_22_hanaa-basheer.png",
    "posterCrop": "/specialists/cards/spec_22_hanaa-basheer.png",
    "portraitCrop": "/specialists/cards/spec_22_hanaa-basheer.png",
    "fallbackAvatar": "/specialists/cards/spec_22_hanaa-basheer.png",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "doc-hanaa-basheer": {
    "id": "doc-hanaa-basheer",
    "name": "",
    "avatar": "/specialists/cards/spec_22_hanaa-basheer.png",
    "posterCrop": "/specialists/cards/spec_22_hanaa-basheer.png",
    "portraitCrop": "/specialists/cards/spec_22_hanaa-basheer.png",
    "fallbackAvatar": "/specialists/cards/spec_22_hanaa-basheer.png",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "spec-bayan-alnajem": {
    "id": "spec-bayan-alnajem",
    "name": "",
    "avatar": "/specialists/cards/spec_23_bayan-alnajem.png",
    "posterCrop": "/specialists/cards/spec_23_bayan-alnajem.png",
    "portraitCrop": "/specialists/cards/spec_23_bayan-alnajem.png",
    "fallbackAvatar": "/specialists/cards/spec_23_bayan-alnajem.png",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "doc-bayan-alnajem": {
    "id": "doc-bayan-alnajem",
    "name": "",
    "avatar": "/specialists/cards/spec_23_bayan-alnajem.png",
    "posterCrop": "/specialists/cards/spec_23_bayan-alnajem.png",
    "portraitCrop": "/specialists/cards/spec_23_bayan-alnajem.png",
    "fallbackAvatar": "/specialists/cards/spec_23_bayan-alnajem.png",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "spec-manar-obeid": {
    "id": "spec-manar-obeid",
    "name": "",
    "avatar": "/specialists/cards/spec_24_manar-obeid.png",
    "posterCrop": "/specialists/cards/spec_24_manar-obeid.png",
    "portraitCrop": "/specialists/cards/spec_24_manar-obeid.png",
    "fallbackAvatar": "/specialists/cards/spec_24_manar-obeid.png",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "doc-manar-obeid": {
    "id": "doc-manar-obeid",
    "name": "",
    "avatar": "/specialists/cards/spec_24_manar-obeid.png",
    "posterCrop": "/specialists/cards/spec_24_manar-obeid.png",
    "portraitCrop": "/specialists/cards/spec_24_manar-obeid.png",
    "fallbackAvatar": "/specialists/cards/spec_24_manar-obeid.png",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "spec-salma-abouelfadl": {
    "id": "spec-salma-abouelfadl",
    "name": "",
    "avatar": "/specialists/cards/spec_25_salma-abouelfadl.png",
    "posterCrop": "/specialists/cards/spec_25_salma-abouelfadl.png",
    "portraitCrop": "/specialists/cards/spec_25_salma-abouelfadl.png",
    "fallbackAvatar": "/specialists/cards/spec_25_salma-abouelfadl.png",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "doc-salma-abouelfadl": {
    "id": "doc-salma-abouelfadl",
    "name": "",
    "avatar": "/specialists/cards/spec_25_salma-abouelfadl.png",
    "posterCrop": "/specialists/cards/spec_25_salma-abouelfadl.png",
    "portraitCrop": "/specialists/cards/spec_25_salma-abouelfadl.png",
    "fallbackAvatar": "/specialists/cards/spec_25_salma-abouelfadl.png",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "spec-ahmed-sayed": {
    "id": "spec-ahmed-sayed",
    "name": "",
    "avatar": "/specialists/cards/spec_26_ahmed-sayed.png",
    "posterCrop": "/specialists/cards/spec_26_ahmed-sayed.png",
    "portraitCrop": "/specialists/cards/spec_26_ahmed-sayed.png",
    "fallbackAvatar": "/specialists/cards/spec_26_ahmed-sayed.png",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "doc-ahmed-sayed": {
    "id": "doc-ahmed-sayed",
    "name": "",
    "avatar": "/specialists/cards/spec_26_ahmed-sayed.png",
    "posterCrop": "/specialists/cards/spec_26_ahmed-sayed.png",
    "portraitCrop": "/specialists/cards/spec_26_ahmed-sayed.png",
    "fallbackAvatar": "/specialists/cards/spec_26_ahmed-sayed.png",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "spec-heshmah-mutairi": {
    "id": "spec-heshmah-mutairi",
    "name": "",
    "avatar": "/specialists/cards/spec_27_heshmah-mutairi.png",
    "posterCrop": "/specialists/cards/spec_27_heshmah-mutairi.png",
    "portraitCrop": "/specialists/cards/spec_27_heshmah-mutairi.png",
    "fallbackAvatar": "/specialists/cards/spec_27_heshmah-mutairi.png",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "doc-heshmah-mutairi": {
    "id": "doc-heshmah-mutairi",
    "name": "",
    "avatar": "/specialists/cards/spec_27_heshmah-mutairi.png",
    "posterCrop": "/specialists/cards/spec_27_heshmah-mutairi.png",
    "portraitCrop": "/specialists/cards/spec_27_heshmah-mutairi.png",
    "fallbackAvatar": "/specialists/cards/spec_27_heshmah-mutairi.png",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "spec-aseel-yousef": {
    "id": "spec-aseel-yousef",
    "name": "",
    "avatar": "/specialists/cards/spec_28_aseel-yousef.png",
    "posterCrop": "/specialists/cards/spec_28_aseel-yousef.png",
    "portraitCrop": "/specialists/cards/spec_28_aseel-yousef.png",
    "fallbackAvatar": "/specialists/cards/spec_28_aseel-yousef.png",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "doc-aseel-yousef": {
    "id": "doc-aseel-yousef",
    "name": "",
    "avatar": "/specialists/cards/spec_28_aseel-yousef.png",
    "posterCrop": "/specialists/cards/spec_28_aseel-yousef.png",
    "portraitCrop": "/specialists/cards/spec_28_aseel-yousef.png",
    "fallbackAvatar": "/specialists/cards/spec_28_aseel-yousef.png",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "spec-mohammed-shehri-clinical": {
    "id": "spec-mohammed-shehri-clinical",
    "name": "",
    "avatar": "/specialists/cards/spec_29_mohammed-shehri-clinical.png",
    "posterCrop": "/specialists/cards/spec_29_mohammed-shehri-clinical.png",
    "portraitCrop": "/specialists/cards/spec_29_mohammed-shehri-clinical.png",
    "fallbackAvatar": "/specialists/cards/spec_29_mohammed-shehri-clinical.png",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "doc-mohammed-shehri-clinical": {
    "id": "doc-mohammed-shehri-clinical",
    "name": "",
    "avatar": "/specialists/cards/spec_29_mohammed-shehri-clinical.png",
    "posterCrop": "/specialists/cards/spec_29_mohammed-shehri-clinical.png",
    "portraitCrop": "/specialists/cards/spec_29_mohammed-shehri-clinical.png",
    "fallbackAvatar": "/specialists/cards/spec_29_mohammed-shehri-clinical.png",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "spec-saad-dosari": {
    "id": "spec-saad-dosari",
    "name": "",
    "avatar": "/specialists/cards/spec_30_saad-dosari.png",
    "posterCrop": "/specialists/cards/spec_30_saad-dosari.png",
    "portraitCrop": "/specialists/cards/spec_30_saad-dosari.png",
    "fallbackAvatar": "/specialists/cards/spec_30_saad-dosari.png",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "doc-saad-dosari": {
    "id": "doc-saad-dosari",
    "name": "",
    "avatar": "/specialists/cards/spec_30_saad-dosari.png",
    "posterCrop": "/specialists/cards/spec_30_saad-dosari.png",
    "portraitCrop": "/specialists/cards/spec_30_saad-dosari.png",
    "fallbackAvatar": "/specialists/cards/spec_30_saad-dosari.png",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "spec-fahad-juhani": {
    "id": "spec-fahad-juhani",
    "name": "",
    "avatar": "/specialists/cards/spec_31_fahad-juhani.png",
    "posterCrop": "/specialists/cards/spec_31_fahad-juhani.png",
    "portraitCrop": "/specialists/cards/spec_31_fahad-juhani.png",
    "fallbackAvatar": "/specialists/cards/spec_31_fahad-juhani.png",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "doc-fahad-juhani": {
    "id": "doc-fahad-juhani",
    "name": "",
    "avatar": "/specialists/cards/spec_31_fahad-juhani.png",
    "posterCrop": "/specialists/cards/spec_31_fahad-juhani.png",
    "portraitCrop": "/specialists/cards/spec_31_fahad-juhani.png",
    "fallbackAvatar": "/specialists/cards/spec_31_fahad-juhani.png",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "spec-hala-enazi": {
    "id": "spec-hala-enazi",
    "name": "",
    "avatar": "/specialists/cards/spec_32_hala-enazi.png",
    "posterCrop": "/specialists/cards/spec_32_hala-enazi.png",
    "portraitCrop": "/specialists/cards/spec_32_hala-enazi.png",
    "fallbackAvatar": "/specialists/cards/spec_32_hala-enazi.png",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "doc-hala-enazi": {
    "id": "doc-hala-enazi",
    "name": "",
    "avatar": "/specialists/cards/spec_32_hala-enazi.png",
    "posterCrop": "/specialists/cards/spec_32_hala-enazi.png",
    "portraitCrop": "/specialists/cards/spec_32_hala-enazi.png",
    "fallbackAvatar": "/specialists/cards/spec_32_hala-enazi.png",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "spec-taif-subaie": {
    "id": "spec-taif-subaie",
    "name": "",
    "avatar": "/specialists/cards/spec_33_taif-subaie.png",
    "posterCrop": "/specialists/cards/spec_33_taif-subaie.png",
    "portraitCrop": "/specialists/cards/spec_33_taif-subaie.png",
    "fallbackAvatar": "/specialists/cards/spec_33_taif-subaie.png",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "doc-taif-subaie": {
    "id": "doc-taif-subaie",
    "name": "",
    "avatar": "/specialists/cards/spec_33_taif-subaie.png",
    "posterCrop": "/specialists/cards/spec_33_taif-subaie.png",
    "portraitCrop": "/specialists/cards/spec_33_taif-subaie.png",
    "fallbackAvatar": "/specialists/cards/spec_33_taif-subaie.png",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "spec-raghad-hawarneh": {
    "id": "spec-raghad-hawarneh",
    "name": "",
    "avatar": "/specialists/cards/spec_34_raghad-hawarneh.png",
    "posterCrop": "/specialists/cards/spec_34_raghad-hawarneh.png",
    "portraitCrop": "/specialists/cards/spec_34_raghad-hawarneh.png",
    "fallbackAvatar": "/specialists/cards/spec_34_raghad-hawarneh.png",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "doc-raghad-hawarneh": {
    "id": "doc-raghad-hawarneh",
    "name": "",
    "avatar": "/specialists/cards/spec_34_raghad-hawarneh.png",
    "posterCrop": "/specialists/cards/spec_34_raghad-hawarneh.png",
    "portraitCrop": "/specialists/cards/spec_34_raghad-hawarneh.png",
    "fallbackAvatar": "/specialists/cards/spec_34_raghad-hawarneh.png",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "spec-eman-bahattab": {
    "id": "spec-eman-bahattab",
    "name": "",
    "avatar": "/specialists/cards/spec_35_eman-bahattab.png",
    "posterCrop": "/specialists/cards/spec_35_eman-bahattab.png",
    "portraitCrop": "/specialists/cards/spec_35_eman-bahattab.png",
    "fallbackAvatar": "/specialists/cards/spec_35_eman-bahattab.png",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "doc-eman-bahattab": {
    "id": "doc-eman-bahattab",
    "name": "",
    "avatar": "/specialists/cards/spec_35_eman-bahattab.png",
    "posterCrop": "/specialists/cards/spec_35_eman-bahattab.png",
    "portraitCrop": "/specialists/cards/spec_35_eman-bahattab.png",
    "fallbackAvatar": "/specialists/cards/spec_35_eman-bahattab.png",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "spec-omar-saad-speech": {
    "id": "spec-omar-saad-speech",
    "name": "",
    "avatar": "/specialists/cards/spec_36_omar-saad-speech.png",
    "posterCrop": "/specialists/cards/spec_36_omar-saad-speech.png",
    "portraitCrop": "/specialists/cards/spec_36_omar-saad-speech.png",
    "fallbackAvatar": "/specialists/cards/spec_36_omar-saad-speech.png",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "doc-omar-saad-speech": {
    "id": "doc-omar-saad-speech",
    "name": "",
    "avatar": "/specialists/cards/spec_36_omar-saad-speech.png",
    "posterCrop": "/specialists/cards/spec_36_omar-saad-speech.png",
    "portraitCrop": "/specialists/cards/spec_36_omar-saad-speech.png",
    "fallbackAvatar": "/specialists/cards/spec_36_omar-saad-speech.png",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "spec-aliah-mutairi": {
    "id": "spec-aliah-mutairi",
    "name": "",
    "avatar": "/specialists/cards/spec_37_aliah-mutairi.png",
    "posterCrop": "/specialists/cards/spec_37_aliah-mutairi.png",
    "portraitCrop": "/specialists/cards/spec_37_aliah-mutairi.png",
    "fallbackAvatar": "/specialists/cards/spec_37_aliah-mutairi.png",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "doc-aliah-mutairi": {
    "id": "doc-aliah-mutairi",
    "name": "",
    "avatar": "/specialists/cards/spec_37_aliah-mutairi.png",
    "posterCrop": "/specialists/cards/spec_37_aliah-mutairi.png",
    "portraitCrop": "/specialists/cards/spec_37_aliah-mutairi.png",
    "fallbackAvatar": "/specialists/cards/spec_37_aliah-mutairi.png",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "spec-haya-faleh": {
    "id": "spec-haya-faleh",
    "name": "",
    "avatar": "/specialists/cards/spec_38_haya-faleh.png",
    "posterCrop": "/specialists/cards/spec_38_haya-faleh.png",
    "portraitCrop": "/specialists/cards/spec_38_haya-faleh.png",
    "fallbackAvatar": "/specialists/cards/spec_38_haya-faleh.png",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "doc-haya-faleh": {
    "id": "doc-haya-faleh",
    "name": "",
    "avatar": "/specialists/cards/spec_38_haya-faleh.png",
    "posterCrop": "/specialists/cards/spec_38_haya-faleh.png",
    "portraitCrop": "/specialists/cards/spec_38_haya-faleh.png",
    "fallbackAvatar": "/specialists/cards/spec_38_haya-faleh.png",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "spec-haya-dosari": {
    "id": "spec-haya-dosari",
    "name": "",
    "avatar": "/specialists/cards/spec_39_haya-dosari.png",
    "posterCrop": "/specialists/cards/spec_39_haya-dosari.png",
    "portraitCrop": "/specialists/cards/spec_39_haya-dosari.png",
    "fallbackAvatar": "/specialists/cards/spec_39_haya-dosari.png",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  },
  "doc-haya-dosari": {
    "id": "doc-haya-dosari",
    "name": "",
    "avatar": "/specialists/cards/spec_39_haya-dosari.png",
    "posterCrop": "/specialists/cards/spec_39_haya-dosari.png",
    "portraitCrop": "/specialists/cards/spec_39_haya-dosari.png",
    "fallbackAvatar": "/specialists/cards/spec_39_haya-dosari.png",
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
    "avatar": "/specialists/cards/spec_40_renad-otaibi.png",
    "posterCrop": "/specialists/cards/spec_40_renad-otaibi.png",
    "portraitCrop": "/specialists/cards/spec_40_renad-otaibi.png",
    "fallbackAvatar": "/specialists/cards/spec_40_renad-otaibi.png",
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
    "avatar": "/specialists/cards/spec_40_renad-otaibi.png",
    "posterCrop": "/specialists/cards/spec_40_renad-otaibi.png",
    "portraitCrop": "/specialists/cards/spec_40_renad-otaibi.png",
    "fallbackAvatar": "/specialists/cards/spec_40_renad-otaibi.png",
    "displayMode": "cover",
    "focalPosition": "top",
    "zoomLevel": 100,
    "isTopRated": false,
    "isAvailableToday": true,
    "hideSessionPrice": false
  }
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
