// WCAG AA color contrast utilities for dynamic partner/offer accents & badges

function parseHex(hex: string): [number, number, number] | null {
  if (!hex || typeof hex !== 'string') return null;
  let clean = hex.trim().replace(/^#/, '');
  if (clean.length === 3) {
    clean = clean
      .split('')
      .map((c) => c + c)
      .join('');
  }
  if (clean.length === 8) {
    clean = clean.slice(0, 6);
  }
  if (!/^[0-9a-fA-F]{6}$/.test(clean)) return null;
  return [
    parseInt(clean.slice(0, 2), 16),
    parseInt(clean.slice(2, 4), 16),
    parseInt(clean.slice(4, 6), 16),
  ];
}

function toHex(r: number, g: number, b: number): string {
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
  return (
    '#' +
    [clamp(r), clamp(g), clamp(b)]
      .map((v) => v.toString(16).padStart(2, '0'))
      .join('')
  );
}

function relativeLuminance(rgb: [number, number, number]): number {
  const linearize = (c: number) => {
    const srgb = c / 255;
    return srgb <= 0.03928 ? srgb / 12.92 : Math.pow((srgb + 0.055) / 1.055, 2.4);
  };
  const [r, g, b] = rgb.map(linearize);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function getContrastRatio(hexA: string, hexB: string): number {
  const rgbA = parseHex(hexA);
  const rgbB = parseHex(hexB);
  if (!rgbA || !rgbB) return 1;
  const lumA = relativeLuminance(rgbA);
  const lumB = relativeLuminance(rgbB);
  const lighter = Math.max(lumA, lumB);
  const darker = Math.min(lumA, lumB);
  return (lighter + 0.05) / (darker + 0.05);
}

function mixRgb(
  base: [number, number, number],
  target: [number, number, number],
  t: number
): [number, number, number] {
  return [
    base[0] + (target[0] - base[0]) * t,
    base[1] + (target[1] - base[1]) * t,
    base[2] + (target[2] - base[2]) * t,
  ];
}

/**
 * Ensures an accent color hex meets WCAG AA (>= 4.5:1) when rendered as text
 * on either dark smoked surfaces (#161C2A) or light frosted/sand surfaces (#F5F2EC).
 */
export function getAccessibleAccentColor(hex: string, isDark: boolean): string {
  const rgb = parseHex(hex);
  if (!rgb) {
    return isDark ? '#60AFFF' : '#1463D6';
  }
  const bgHex = isDark ? '#161C2A' : '#F5F2EC';
  const targetContrast = isDark ? 5.2 : 4.8;
  if (getContrastRatio(hex, bgHex) >= targetContrast) {
    return hex;
  }

  const mixTarget: [number, number, number] = isDark ? [255, 255, 255] : [11, 15, 23];
  let low = 0;
  let high = 1;
  let best = toHex(...mixTarget);

  for (let i = 0; i < 16; i++) {
    const mid = (low + high) / 2;
    const candidate = toHex(...mixRgb(rgb, mixTarget, mid));
    if (getContrastRatio(candidate, bgHex) >= targetContrast) {
      best = candidate;
      high = mid;
    } else {
      low = mid;
    }
  }

  return best;
}

/**
 * Picks high-contrast foreground text color (#FFFFFF or #0F172A) for a given solid background hex.
 */
export function getContrastTextForBg(bgHex: string): '#FFFFFF' | '#0F172A' {
  const rgb = parseHex(bgHex);
  if (!rgb) return '#FFFFFF';
  const whiteContrast = getContrastRatio(bgHex, '#FFFFFF');
  const darkContrast = getContrastRatio(bgHex, '#0F172A');
  return darkContrast > whiteContrast ? '#0F172A' : '#FFFFFF';
}
