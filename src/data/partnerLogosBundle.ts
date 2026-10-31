/**
 * Partner Logos Asset Mapping for Raba Center
 * 
 * Maps partner IDs directly to their optimized static vector SVGs and PNG assets in /images/partners/
 * Highly optimized for fast mobile download, HTTP browser caching, and minimal JS bundle footprint.
 */

export const BUNDLED_PARTNER_LOGOS: Record<string, string> = {
  "partner-moi": "/images/partners/partner-moi_custom.webp",
  "partner-state-security": "/images/partners/partner-state-security_custom.webp",
  "partner-national-guard": "/images/partners/partner-national-guard_custom.webp",
  "partner-mngha": "/images/partners/partner-mngha_custom.webp",
  "partner-misa": "/images/partners/partner-misa_custom.webp",
  "partner-mewa": "/images/partners/partner-mewa_custom.webp",
  "partner-dgda": "/images/partners/partner-dgda_custom.webp",
  "partner-sba": "/images/partners/partner-sba_custom.webp",
  "partner-ksu": "/images/partners/partner-ksu_custom.webp",
  "partner-stc": "/images/partners/partner-stc_custom.webp",
  "partner-diriyah": "/images/partners/partner-diriyah_custom.webp",
  "partner-el-seif": "/images/partners/partner-el-seif_custom.webp",
  "partner-emkan": "/images/partners/partner-emkan_custom.webp",
  "partner-tamara": "/images/partners/partner-tamara_custom.webp",
  "partner-autism-families": "/images/partners/autism_families.svg",
  "partner-itizaz": "/images/partners/partner-itizaz_custom.webp",
  "partner-faisaliah": "/images/partners/partner-faisaliah_custom.webp",
  "partner-rais": "/images/partners/partner-rais_custom.webp",
  "partner-roaya": "/images/partners/roaya_company.svg",
  "partner-delta": "/images/partners/partner-delta_custom.webp",
  "partner-my-character": "/images/partners/partner-my-character_custom.webp"
};

/**
 * Returns the optimized static image URL for a given partner ID if available
 */
export function getBundledPartnerLogo(partnerId: string): string | undefined {
  if (partnerId && BUNDLED_PARTNER_LOGOS[partnerId]) {
    return BUNDLED_PARTNER_LOGOS[partnerId];
  }
  return undefined;
}

export default BUNDLED_PARTNER_LOGOS;
