/**
 * Partner Logos Asset Mapping for Raba Center
 * 
 * Maps partner IDs directly to their optimized static vector SVGs and PNG assets in /images/partners/
 * Highly optimized for fast mobile download, HTTP browser caching, and minimal JS bundle footprint.
 */

export const BUNDLED_PARTNER_LOGOS: Record<string, string> = {
  "partner-moi": "/images/partners/partner-moi_custom.png",
  "partner-state-security": "/images/partners/partner-state-security_custom.png",
  "partner-national-guard": "/images/partners/partner-national-guard_custom.png",
  "partner-mngha": "/images/partners/partner-mngha_custom.png",
  "partner-misa": "/images/partners/partner-misa_custom.png",
  "partner-mewa": "/images/partners/partner-mewa_custom.png",
  "partner-dgda": "/images/partners/partner-dgda_custom.png",
  "partner-sba": "/images/partners/partner-sba_custom.png",
  "partner-ksu": "/images/partners/partner-ksu_custom.png",
  "partner-stc": "/images/partners/partner-stc_custom.png",
  "partner-diriyah": "/images/partners/partner-diriyah_custom.png",
  "partner-el-seif": "/images/partners/partner-el-seif_custom.png",
  "partner-emkan": "/images/partners/partner-emkan_custom.png",
  "partner-tamara": "/images/partners/partner-tamara_custom.png",
  "partner-autism-families": "/images/partners/autism_families.svg",
  "partner-itizaz": "/images/partners/partner-itizaz_custom.png",
  "partner-faisaliah": "/images/partners/partner-faisaliah_custom.png",
  "partner-rais": "/images/partners/partner-rais_custom.png",
  "partner-roaya": "/images/partners/roaya_company.svg",
  "partner-delta": "/images/partners/partner-delta_custom.png",
  "partner-my-character": "/images/partners/partner-my-character_custom.png"
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
