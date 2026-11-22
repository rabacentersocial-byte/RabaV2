import type React from 'react';
import type { AdminUser } from '../types';

export type AvatarBgPresetId = 'emerald' | 'sky' | 'teal' | 'indigo' | 'amber' | 'rose';

export interface AvatarBgPreset {
  id: AvatarBgPresetId;
  labelAr: string;
  labelEn: string;
  gradientClass: string;
  swatchClass: string;
}

export const USER_AVATAR_BG_PRESETS: AvatarBgPreset[] = [
  {
    id: 'emerald',
    labelAr: 'زمردي رابا',
    labelEn: 'Raba Emerald',
    gradientClass: 'from-emerald-600 to-teal-900',
    swatchClass: 'bg-gradient-to-br from-emerald-500 to-teal-800',
  },
  {
    id: 'sky',
    labelAr: 'أزرق سماوي',
    labelEn: 'Sky Blue',
    gradientClass: 'from-[#2B95FF] to-[#1263D6]',
    swatchClass: 'bg-gradient-to-br from-[#2B95FF] to-[#1263D6]',
  },
  {
    id: 'teal',
    labelAr: 'أخضر بحري',
    labelEn: 'Deep Teal',
    gradientClass: 'from-teal-500 to-cyan-800',
    swatchClass: 'bg-gradient-to-br from-teal-500 to-cyan-800',
  },
  {
    id: 'indigo',
    labelAr: 'نيلي ملكي',
    labelEn: 'Royal Indigo',
    gradientClass: 'from-indigo-500 to-blue-900',
    swatchClass: 'bg-gradient-to-br from-indigo-500 to-blue-900',
  },
  {
    id: 'amber',
    labelAr: 'ذهبي دافئ',
    labelEn: 'Warm Gold',
    gradientClass: 'from-amber-500 to-orange-700',
    swatchClass: 'bg-gradient-to-br from-amber-500 to-orange-700',
  },
  {
    id: 'rose',
    labelAr: 'وردي مرجاني',
    labelEn: 'Coral Rose',
    gradientClass: 'from-rose-500 to-pink-800',
    swatchClass: 'bg-gradient-to-br from-rose-500 to-pink-800',
  },
];

export function getUserAvatarBgClass(bgColor?: string): string {
  const found = USER_AVATAR_BG_PRESETS.find((p) => p.id === bgColor);
  return found ? found.gradientClass : USER_AVATAR_BG_PRESETS[0].gradientClass;
}

export function getUserAvatarPositionClass(position?: 'top' | 'center' | 'bottom'): string {
  if (position === 'top') return 'object-top';
  if (position === 'bottom') return 'object-bottom';
  return 'object-center';
}

export function getUserAvatarTransformStyle(
  zoom?: number,
  position?: 'top' | 'center' | 'bottom'
): React.CSSProperties | undefined {
  const safeZoom = typeof zoom === 'number' && zoom > 100 ? Math.min(150, Math.max(100, zoom)) : 100;
  if (safeZoom <= 100) return undefined;
  const origin =
    position === 'top' ? 'center top' : position === 'bottom' ? 'center bottom' : 'center center';
  return {
    transform: `scale(${safeZoom / 100})`,
    transformOrigin: origin,
  };
}

export function isSafeAvatarUrl(url: string): boolean {
  const trimmed = url.trim();
  if (!trimmed) return true;
  if (trimmed.startsWith('/')) return !trimmed.startsWith('//');
  if (trimmed.startsWith('data:image/')) {
    return /^data:image\/(png|jpeg|jpg|webp|gif);base64,/i.test(trimmed);
  }
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
}

export function getUserInitials(user?: Pick<AdminUser, 'name' | 'username'> | null, maxChars = 2): string {
  const raw = (user?.name || user?.username || 'م').trim();
  if (!raw) return 'م';
  const parts = raw.split(/\s+/).filter(Boolean);
  if (maxChars >= 2 && parts.length >= 2) {
    // Skip common Arabic honorific prefixes like "د." or "أ."
    const meaningful = parts.filter((p) => !/^(د\.|أ\.|م\.|dr\.|mr\.|ms\.)$/i.test(p));
    const source = meaningful.length >= 2 ? meaningful : parts;
    return `${source[0][0] || ''}${source[1][0] || ''}`.toUpperCase();
  }
  return raw.slice(0, maxChars).toUpperCase();
}
