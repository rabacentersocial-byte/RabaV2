import { AdminUser, Appointment, BranchAccessScope } from '../types';
import { BranchItem, BRANCHES_DATA, getStoredBranchesData } from '../data/branchesData';

/**
 * Normalizes Arabic/English branch strings for reliable matching across booking forms.
 * Handles Arabic hamza/alef variants (أ إ آ ا), teh marbuta / heh, prefix "فرع ", and punctuation.
 */
export function normalizeBranchText(value?: string | null): string {
  if (!value) return '';
  return value
    .toLowerCase()
    .trim()
    .replace(/[أإآ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/[\-_–—/\\(),.:]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Strips generic words ("فرع", "branch", "رواد الخليج", "rowad al khaleej", "الرياض", "riyadh", etc.)
 * to isolate the distinctive district/branch keyword such as "المغرزات", "النرجس", "الخبر", "obhur".
 */
function extractDistinctiveBranchTokens(branch: BranchItem): string[] {
  const candidates = [
    branch.name,
    branch.nameEn,
    branch.regionBadgeAr,
    branch.regionBadgeEn,
  ].filter(Boolean);

  const cityNormAr = normalizeBranchText(branch.cityNameAr);
  const cityNormEn = normalizeBranchText(branch.cityNameEn);

  const tokens = new Set<string>();

  for (const raw of candidates) {
    const clean = normalizeBranchText(raw)
      .replace(/\bفرع\b/g, '')
      .replace(/\bbranch\b/g, '')
      .replace(/رواد الخليج/g, '')
      .replace(/rowad al khaleej/g, '')
      .replace(/مدارس الفيصليه/g, '')
      .replace(/al faisaliah schools/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (clean && clean !== cityNormAr && clean !== cityNormEn) {
      tokens.add(clean);
    }

    // Also add sub-parts split by dash from original name (e.g. "فرع ابحر الشمالية - رواد الخليج" -> "ابحر الشماليه")
    const firstSegment = normalizeBranchText(raw.split(/\s*[-–—]\s*/)[0])
      .replace(/\bفرع\b/g, '')
      .replace(/\bbranch\b/g, '')
      .trim();
    if (firstSegment && firstSegment.length >= 3) {
      tokens.add(firstSegment);
    }
  }

  // Known city-level single-branch cities where the city name itself uniquely identifies the branch
  const allBranches = BRANCHES_DATA;
  const sameCityCount = allBranches.filter((b) => b.city === branch.city).length;
  if (sameCityCount === 1) {
    if (cityNormAr) tokens.add(cityNormAr);
    if (cityNormEn) tokens.add(cityNormEn);
  }

  return Array.from(tokens).filter((t) => t.length >= 3);
}

/**
 * Resolves clean localized branch display label matching BookingDirectoryPage/ClientPortalPage convention.
 */
export function getCleanBranchDisplayName(branch: BranchItem, isArabic = true): string {
  const rawName = isArabic ? branch.name : (branch.nameEn || branch.name);
  return rawName.split(/\s*[-–—]\s*/)[0].replace(/\s*\([^)]*\)/g, '').trim();
}

/**
 * Checks whether an Appointment record corresponds to a specific BranchItem.
 */
export function doesAppointmentMatchBranch(
  appointment: Appointment,
  branch: BranchItem,
  allBranches: BranchItem[] = BRANCHES_DATA
): boolean {
  if (!appointment || !branch) return false;

  const rawBranch = (appointment.branch || '').trim();
  const rawSource = (appointment.requestSource || '').trim();
  const rawNotes = (appointment.notes || '').trim();

  // Direct ID match
  if (rawBranch && rawBranch === branch.id) return true;

  const normAppBranch = normalizeBranchText(rawBranch);
  const normAppSource = normalizeBranchText(rawSource);
  const normAppNotes = normalizeBranchText(rawNotes);

  const tokens = extractDistinctiveBranchTokens(branch);
  const fullNameNormAr = normalizeBranchText(branch.name);
  const fullNameNormEn = normalizeBranchText(branch.nameEn);
  const cleanNameNormAr = normalizeBranchText(getCleanBranchDisplayName(branch, true));
  const cleanNameNormEn = normalizeBranchText(getCleanBranchDisplayName(branch, false));

  // 1. Primary check on appointment.branch
  if (normAppBranch) {
    if (
      normAppBranch === fullNameNormAr ||
      normAppBranch === fullNameNormEn ||
      normAppBranch === cleanNameNormAr ||
      normAppBranch === cleanNameNormEn
    ) {
      return true;
    }

    for (const token of tokens) {
      if (normAppBranch.includes(token) || (normAppBranch.length >= 4 && token.includes(normAppBranch))) {
        // Guard: if appointment.branch is strictly a generic city name in a multi-branch city (like "الرياض" or "جده"),
        // do NOT match it to one specific branch unless this city only has 1 branch.
        const sameCityCount = allBranches.filter((b) => b.city === branch.city).length;
        const isGenericCityOnly =
          sameCityCount > 1 &&
          (normAppBranch === normalizeBranchText(branch.cityNameAr) ||
            normAppBranch === normalizeBranchText(branch.cityNameEn));
        if (!isGenericCityOnly) {
          return true;
        }
      }
    }
  }

  // 2. Fallback check on requestSource / notes (for branch-specific bookings created from BranchesDirectoryPage)
  const secondaryHaystack = `${normAppSource} ${normAppNotes}`.trim();
  if (secondaryHaystack) {
    if (
      (cleanNameNormAr && secondaryHaystack.includes(cleanNameNormAr)) ||
      (cleanNameNormEn && secondaryHaystack.includes(cleanNameNormEn))
    ) {
      return true;
    }
    for (const token of tokens) {
      // Only match city-level token from notes if it's a single-branch city AND explicitly says "فرع <city>"
      const cityNormAr = normalizeBranchText(branch.cityNameAr);
      if (token === cityNormAr) {
        if (secondaryHaystack.includes(`فرع ${token}`)) return true;
      } else if (secondaryHaystack.includes(token)) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Checks whether an appointment does NOT have a specific clinic branch assigned
 * (e.g., empty branch, "غير محدد", or generic city-only string in a multi-branch city when no branch keyword exists in notes/source).
 */
export function isAppointmentBranchUnassigned(
  appointment: Appointment,
  allBranches: BranchItem[] = BRANCHES_DATA
): boolean {
  const matchedSpecific = allBranches.some((b) => doesAppointmentMatchBranch(appointment, b, allBranches));
  return !matchedSpecific;
}

/**
 * Resolves the effective branch access scope for an AdminUser.
 * Super admins always retain full 'all' branch access.
 */
export function getEffectiveBranchScope(user?: AdminUser | null): BranchAccessScope {
  if (!user || user.role === 'super_admin') return 'all';
  if (!user.branchScope || user.branchScope === 'all') return 'all';
  return user.branchScope;
}

export function isUserBranchScoped(user?: AdminUser | null): boolean {
  return getEffectiveBranchScope(user) !== 'all';
}

export function getUserAssignedBranchItems(
  user?: AdminUser | null,
  allBranches?: BranchItem[]
): BranchItem[] {
  const branches = allBranches && allBranches.length > 0 ? allBranches : getStoredBranchesData();
  if (!user || user.role === 'super_admin' || getEffectiveBranchScope(user) === 'all') {
    return branches;
  }
  const ids = Array.isArray(user.assignedBranches) ? user.assignedBranches : [];
  return branches.filter((b) => ids.includes(b.id));
}

/**
 * Checks whether an admin user has access to general course registration requests.
 */
export function canUserAccessCourseRequests(user?: AdminUser | null): boolean {
  if (!user) return true;
  if (user.status === 'suspended') return false;
  if (user.role === 'super_admin') return true;
  return Array.isArray(user.permissions) && user.permissions.includes('manage_courses');
}

/**
 * Filters a list of appointments according to the user's configured branch visibility permissions
 * and course request routing/RBAC permissions.
 */
export function filterAppointmentsByUserBranchAccess(
  appointments: Appointment[],
  user?: AdminUser | null,
  allBranches?: BranchItem[]
): Appointment[] {
  if (!Array.isArray(appointments)) return [];
  if (!user) return appointments;
  if (user.status === 'suspended') return [];
  if (user.role === 'super_admin') return appointments;

  const perms = Array.isArray(user.permissions) ? user.permissions : [];
  const hasAppointmentsPerm = perms.includes('manage_appointments');
  const hasCoursesPerm = perms.includes('manage_courses');

  const scope = getEffectiveBranchScope(user);
  const branches = allBranches && allBranches.length > 0 ? allBranches : getStoredBranchesData();
  const assignedIds = Array.isArray(user?.assignedBranches) ? user.assignedBranches : [];
  const assignedBranches = branches.filter((b) => assignedIds.includes(b.id));

  return appointments.filter((app) => {
    // Course requests follow course permission / direct coordinator assignment independently of clinic branches
    if (app.requestType === 'course') {
      if (app.assignedToUserId && app.assignedToUserId === user.id) return true;
      return hasCoursesPerm;
    }

    // If user holds manage_courses without manage_appointments, focus view on course requests only
    if (!hasAppointmentsPerm && hasCoursesPerm) {
      return false;
    }

    if (scope === 'all') return true;

    if (assignedBranches.length === 0) {
      // If scoped mode was configured with 0 branches, only unassigned appear for assigned_and_unassigned, or none for assigned_only
      return scope === 'assigned_and_unassigned' ? isAppointmentBranchUnassigned(app, branches) : false;
    }

    const matchesAssigned = assignedBranches.some((b) => doesAppointmentMatchBranch(app, b, branches));
    if (matchesAssigned) return true;
    if (scope === 'assigned_and_unassigned') {
      return isAppointmentBranchUnassigned(app, branches);
    }
    return false;
  });
}
