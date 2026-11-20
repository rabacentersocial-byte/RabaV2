import type { Unsubscribe } from 'firebase/firestore';
import { auth, getLazyDb } from '../lib/firebase';
import {
  Appointment,
  ParentReview,
  Specialist,
  BlogPost,
  AdminUser,
  ClientProfile,
  FamilyMember,
  MemberRecord,
  MemberRecordCategory,
  MemberReportType,
  ServiceItem,
  TherapyPackage,
  OfferData
} from '../types';
import type { HeroSlideItem, HeroSliderConfig } from '../data/sliderCustomizer';
import type { CourseItem } from '../data/coursesData';
import type { AccreditationItem } from '../data/accreditationsData';
import type { PartnerItem } from '../data/partnersData';

async function loadFirestoreCtx() {
  const [fs, db] = await Promise.all([
    import('firebase/firestore'),
    getLazyDb()
  ]);
  return { fs, db };
}

export async function testFirestoreConnection(): Promise<boolean> {
  try {
    const { fs, db } = await loadFirestoreCtx();
    await fs.getDocFromServer(fs.doc(db, 'test', 'connection'));
    return true;
  } catch (error: any) {
    const code = error?.code || 'unknown';
    const message = error?.message || String(error);
    if (message.includes('the client is offline')) {
      console.error('[Firestore Live Sync Error]:', code, 'Client is offline - check network or Firestore config');
    } else {
      console.error('[Firestore Live Sync Error]:', code, message);
    }
    return false;
  }
}

async function ensureFirebaseUser() {
  const { getLazyAuth } = await import('../lib/firebase');
  const authInstance = await getLazyAuth();
  if (typeof (authInstance as any).authStateReady === 'function') {
    await (authInstance as any).authStateReady();
  }
  return authInstance.currentUser;
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function withTimeout<T>(promise: Promise<T>, timeoutMs = 10000, fallback?: T): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((resolve, reject) => {
      setTimeout(() => {
        if (fallback !== undefined) {
          resolve(fallback);
        } else {
          reject(new Error(`Firestore operation timed out after ${timeoutMs}ms`));
        }
      }, timeoutMs);
    })
  ]);
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null, shouldThrow = false) {
  const errMessage = error instanceof Error ? error.message : String(error);
  
  const errInfo: FirestoreErrorInfo = {
    error: errMessage,
    authInfo: {
      userId: auth?.currentUser?.uid || null,
      email: auth?.currentUser?.email || null,
      emailVerified: auth?.currentUser?.emailVerified || null,
      isAnonymous: auth?.currentUser?.isAnonymous || null,
      tenantId: auth?.currentUser?.tenantId || null,
      providerInfo: auth?.currentUser?.providerData?.map((provider: any) => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };

  // Safe diagnostic logging without breaking application render
  if (shouldThrow) {
    console.error(`[Firestore Error - ${operationType.toUpperCase()}] Collection/Doc: [${path}]:`, errInfo);
    throw new Error(JSON.stringify(errInfo));
  } else {
    console.warn(`[Firestore Notice - ${operationType.toUpperCase()}] Collection/Doc: [${path}]:`, errMessage);
  }
}

export interface FormattedFirestoreError {
  message: string;
  rawError: string;
  isPermissionDenied: boolean;
  isNetwork: boolean;
  isPrecondition: boolean;
}

/**
 * Parses raw Firestore errors (including JSON-serialized FirestoreErrorInfo thrown by handleFirestoreError)
 * into clean, localized UI messages so raw developer JSON or English permission dumps never appear in the UI.
 */
export function formatFirestoreUiError(
  error: unknown,
  isArabic = true,
  fallbackAr = 'حدث خطأ أثناء الاتصال بقاعدة البيانات السحابية.',
  fallbackEn = 'A cloud database error occurred.'
): FormattedFirestoreError {
  let rawMessage = error instanceof Error ? error.message : String(error || '');
  const rawCode = typeof (error as any)?.code === 'string' ? (error as any).code : '';

  if (rawMessage.trim().startsWith('{')) {
    try {
      const parsed = JSON.parse(rawMessage);
      if (parsed && typeof parsed.error === 'string') {
        rawMessage = parsed.error;
      }
    } catch {
      // Keep original string if not valid JSON
    }
  }

  const lower = `${rawCode} ${rawMessage}`.toLowerCase();
  const isPermissionDenied =
    lower.includes('permission-denied') ||
    lower.includes('missing or insufficient permissions') ||
    lower.includes('insufficient permissions');
  const isNetwork =
    lower.includes('unavailable') ||
    lower.includes('offline') ||
    lower.includes('timed out') ||
    lower.includes('network');
  const isPrecondition =
    lower.includes('failed-precondition') ||
    lower.includes('requires an index');

  if (isPermissionDenied) {
    return {
      rawError: rawMessage,
      isPermissionDenied: true,
      isNetwork: false,
      isPrecondition: false,
      message: isArabic
        ? 'جلسة Firebase الحالية لا تملك صلاحيات الإدارة السحابية. يرجى تفعيل المزامنة السحابية باستخدام حساب المدير المعتمد (rabacentersocial@gmail.com).'
        : 'Current Firebase session lacks admin permissions. Please activate Cloud Sync using the authorized Admin account (rabacentersocial@gmail.com).',
    };
  }

  if (isNetwork) {
    return {
      rawError: rawMessage,
      isPermissionDenied: false,
      isNetwork: true,
      isPrecondition: false,
      message: isArabic
        ? 'تعذر الاتصال بقاعدة البيانات السحابية حالياً. يرجى التحقق من اتصال الإنترنت وإعادة المحاولة.'
        : 'Unable to reach Cloud Firestore right now. Please check your internet connection and retry.',
    };
  }

  if (isPrecondition) {
    return {
      rawError: rawMessage,
      isPermissionDenied: false,
      isNetwork: false,
      isPrecondition: true,
      message: isArabic
        ? 'يتطلب هذا الاستعلام تهيئة فهرس في قاعدة البيانات. يرجى المحاولة مرة أخرى.'
        : 'This query requires a database index precondition. Please retry.',
    };
  }

  return {
    rawError: rawMessage,
    isPermissionDenied: false,
    isNetwork: false,
    isPrecondition: false,
    message: isArabic ? fallbackAr : fallbackEn,
  };
}

/**
 * Verifies whether the currently authenticated Firebase user satisfies `isAdmin()` in firestore.rules
 * (either verified primary admin email rabacentersocial@gmail.com or an active document in /admins/{uid}).
 * Prevents non-admin client/family portal sessions from triggering admin Firestore list queries.
 */
export async function verifyIsFirebaseAdmin(
  user?: { uid?: string; email?: string | null; emailVerified?: boolean } | null
): Promise<boolean> {
  try {
    const targetUser = user !== undefined ? user : await ensureFirebaseUser();
    if (!targetUser || !targetUser.uid) {
      return false;
    }

    const emailLower = (targetUser.email || '').trim().toLowerCase();
    if (emailLower === 'rabacentersocial@gmail.com' && Boolean(targetUser.emailVerified)) {
      return true;
    }

    const { fs, db } = await loadFirestoreCtx();
    const adminDocRef = fs.doc(db, 'admins', targetUser.uid);
    const snap = await withTimeout(fs.getDoc(adminDocRef), 4000);
    if (snap.exists()) {
      const data = snap.data();
      return data?.status !== 'suspended';
    }
    return false;
  } catch {
    return false;
  }
}

export async function getFirebaseAdminProfile(
  user?: { uid?: string; email?: string | null; emailVerified?: boolean } | null
): Promise<Partial<AdminUser> | null> {
  try {
    const targetUser = user !== undefined ? user : await ensureFirebaseUser();
    if (!targetUser || !targetUser.uid) {
      return null;
    }

    const { fs, db } = await loadFirestoreCtx();
    const adminDocRef = fs.doc(db, 'admins', targetUser.uid);
    const snap = await withTimeout(fs.getDoc(adminDocRef), 4000);
    if (snap.exists()) {
      const data = snap.data() as Partial<AdminUser>;
      if (data?.status === 'suspended') {
        return null;
      }
      return { ...data, firebaseUid: targetUser.uid };
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Recursively removes any keys with `undefined` values from an object.
 * In Firestore Web SDK v9/v10, passing `undefined` anywhere inside a document payload
 * throws an unhandled "Unsupported field value: undefined" exception that crashes writes in production.
 */
export function sanitizeFirestoreData<T>(obj: T): T {
  if (obj === null || obj === undefined) {
    return null as any;
  }
  if (Array.isArray(obj)) {
    return obj
      .filter((item) => item !== undefined)
      .map((item) => (typeof item === 'object' && item !== null ? sanitizeFirestoreData(item) : item)) as any;
  }
  if (typeof obj === 'object') {
    if (obj instanceof Date) return obj as any;
    const clean: Record<string, any> = {};
    for (const [key, value] of Object.entries(obj)) {
      if (value !== undefined) {
        clean[key] = (typeof value === 'object' && value !== null)
          ? sanitizeFirestoreData(value)
          : value;
      }
    }
    return clean as any;
  }
  return obj;
}

// ============================================================================
// 1. DYNAMIC SITE SETTINGS (Synchronized with Admin Dashboard & Visitor UI)
// ============================================================================

export function isValidFirestoreRuleId(id: string): boolean {
  return typeof id === 'string' && id.length >= 1 && id.length <= 128 && /^[a-zA-Z0-9_-]+$/.test(id);
}

export function sanitizeFirestoreDocId(id: string, fallbackPrefix = 'item'): string {
  const cleaned = String(id || '')
    .trim()
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 128);
  return cleaned || `${fallbackPrefix}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
}

export function resolveFirestoreDocId(rawId: string | undefined | null, fallbackPrefix = 'item'): string {
  if (rawId && isValidFirestoreRuleId(rawId)) {
    return rawId;
  }
  return sanitizeFirestoreDocId(rawId || '', fallbackPrefix);
}

/**
 * Strips giant inline base64 data URIs from collection-wide blob arrays before writing to
 * a single `site_settings` document so we never breach Firestore's 1MB document limit.
 */
function prepareSiteSettingPayloadForFirestore(key: string, data: any): any {
  if (key === 'raba_specialists' && Array.isArray(data)) {
    const roughSize = JSON.stringify(data).length;
    if (roughSize > 850_000) {
      return data.map((s: any) => {
        if (!s || typeof s !== 'object') return s;
        const copy = { ...s };
        if (typeof copy.avatar === 'string' && copy.avatar.startsWith('data:') && copy.avatar.length > 35_000) {
          copy.avatar = copy.fallbackAvatar && !String(copy.fallbackAvatar).startsWith('data:') ? copy.fallbackAvatar : '';
        }
        return copy;
      });
    }
  }
  if (key === 'raba_specialists_card_customizations' && data && typeof data === 'object') {
    const roughSize = JSON.stringify(data).length;
    if (roughSize > 850_000) {
      const trimmed: Record<string, any> = {};
      for (const [k, v] of Object.entries(data)) {
        if (v && typeof v === 'object') {
          const item = { ...(v as Record<string, any>) };
          if (typeof item.avatar === 'string' && item.avatar.startsWith('data:') && item.avatar.length > 35_000) {
            item.avatar = item.fallbackAvatar && !String(item.fallbackAvatar).startsWith('data:') ? item.fallbackAvatar : '';
          }
          trimmed[k] = item;
        }
      }
      return trimmed;
    }
  }
  return data;
}

export async function saveSiteSettingToFirestore(key: string, data: any): Promise<boolean> {
  const safeKey = sanitizeFirestoreDocId(key);
  const path = `site_settings/${safeKey}`;
  try {
    const fbUser = await ensureFirebaseUser();
    if (!fbUser) {
      return false;
    }
    const { fs, db } = await loadFirestoreCtx();
    const docRef = fs.doc(db, 'site_settings', safeKey);
    const preparedData = prepareSiteSettingPayloadForFirestore(safeKey, data);
    const cleanPayload = sanitizeFirestoreData({
      key: safeKey,
      data: preparedData,
      updatedAtISO: new Date().toISOString()
    });
    // Attach serverTimestamp() AFTER sanitizeFirestoreData so the FieldValue sentinel is preserved
    await fs.setDoc(docRef, {
      ...cleanPayload,
      updatedAt: fs.serverTimestamp()
    }, { merge: true });
    console.log(`[Firestore] Successfully saved site setting: ${safeKey}`);
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path, false);
    return false;
  }
}

export const saveAdminSiteSetting = saveSiteSettingToFirestore;

export async function markCollectionAuthoritative(collectionKey: string): Promise<boolean> {
  const safeKey = sanitizeFirestoreDocId(collectionKey, 'col');
  const path = 'site_settings/raba_collection_authority';
  try {
    const fbUser = await ensureFirebaseUser();
    if (!fbUser) return false;
    const isAdminUser = await verifyIsFirebaseAdmin(fbUser);
    if (!isAdminUser) return false;
    const { fs, db } = await loadFirestoreCtx();
    const docRef = fs.doc(db, 'site_settings', 'raba_collection_authority');
    await fs.setDoc(
      docRef,
      {
        key: 'raba_collection_authority',
        data: { [safeKey]: true },
        updatedAtISO: new Date().toISOString(),
        updatedAt: fs.serverTimestamp()
      },
      { merge: true }
    );
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path, false);
    return false;
  }
}

export async function deleteSiteSettingFromFirestore(key: string): Promise<boolean> {
  const safeKey = sanitizeFirestoreDocId(key);
  const path = `site_settings/${safeKey}`;
  try {
    const fbUser = await ensureFirebaseUser();
    if (!fbUser) {
      return false;
    }
    const { fs, db } = await loadFirestoreCtx();
    const docRef = fs.doc(db, 'site_settings', safeKey);
    await fs.deleteDoc(docRef);
    console.log(`[Firestore] Successfully deleted site setting: ${safeKey}`);
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path, false);
    return false;
  }
}

export async function getSiteSettingFromFirestore(key: string): Promise<any | null> {
  const safeKey = sanitizeFirestoreDocId(key);
  const path = `site_settings/${safeKey}`;
  try {
    const { fs, db } = await loadFirestoreCtx();
    const docRef = fs.doc(db, 'site_settings', safeKey);
    const snap = await withTimeout(fs.getDoc(docRef), 10000);
    if (!snap.exists()) {
      return null;
    }
    const val = snap.data();
    return val?.data !== undefined ? val.data : val;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path, false);
    return null;
  }
}

export async function getAllSiteSettingsFromFirestore(): Promise<Record<string, any>> {
  const path = 'site_settings';
  try {
    const { fs, db } = await loadFirestoreCtx();
    const colRef = fs.collection(db, 'site_settings');
    const snap = await withTimeout(fs.getDocs(colRef), 10000);
    const result: Record<string, any> = {};
    snap.forEach((d) => {
      const docData = d.data();
      result[d.id] = docData?.data !== undefined ? docData.data : docData;
    });
    return result;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path, false);
    return {};
  }
}

export function subscribeSiteSettings(
  onUpdate: (settings: Record<string, any>) => void,
  onError?: (err: any) => void
): Unsubscribe {
  const path = 'site_settings';
  let cancelled = false;
  let realUnsub: Unsubscribe | null = null;

  loadFirestoreCtx()
    .then(({ fs, db }) => {
      if (cancelled) return;
      const colRef = fs.collection(db, 'site_settings');
      realUnsub = fs.onSnapshot(
        colRef,
        (snapshot) => {
          const data: Record<string, any> = {};
          snapshot.forEach((d) => {
            const docData = d.data();
            data[d.id] = docData?.data !== undefined ? docData.data : docData;
          });
          onUpdate(data);
        },
        (error) => {
          console.error('[Firestore Live Sync Error]:', (error as any)?.code || 'unknown', (error as any)?.message || error);
          if (onError) onError(error);
          handleFirestoreError(error, OperationType.LIST, path, false);
        }
      );
    })
    .catch((err) => {
      console.error('[Firestore Live Sync Error]:', err?.code || 'init-failed', err?.message || err);
      if (onError) onError(err);
    });

  return () => {
    cancelled = true;
    if (realUnsub) realUnsub();
  };
}

// ============================================================================
// 2. SPECIALISTS (CRUD & Realtime)
// ============================================================================

export async function saveSpecialistToFirestore(specialist: Specialist): Promise<boolean> {
  const docId = resolveFirestoreDocId(specialist.id, 'spec');
  const path = `specialists/${docId}`;
  try {
    const fbUser = await ensureFirebaseUser();
    if (!fbUser) {
      return false;
    }
    const isAdminUser = await verifyIsFirebaseAdmin(fbUser);
    if (!isAdminUser) {
      return false;
    }
    const { fs, db } = await loadFirestoreCtx();
    const docRef = fs.doc(db, 'specialists', docId);
    const cleanPayload = sanitizeFirestoreData({
      ...specialist,
      id: docId,
      name: (specialist.name || specialist.nameEn || 'أخصائي').trim().slice(0, 200),
      bio: (specialist.bio || '').slice(0, 5000),
      active: specialist.active !== false,
      isActive: specialist.isActive !== false && specialist.active !== false,
      updatedAtISO: new Date().toISOString()
    });
    await withTimeout(
      fs.setDoc(docRef, {
        ...cleanPayload,
        updatedAt: fs.serverTimestamp()
      }, { merge: true }),
      10000
    );
    console.log(`[Firestore] Successfully saved specialist: ${specialist.name} (${docId})`);
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path, false);
    return false;
  }
}

export async function deleteSpecialistFromFirestore(specialistId: string): Promise<boolean> {
  const docId = resolveFirestoreDocId(specialistId, 'spec');
  const path = `specialists/${docId}`;
  try {
    const fbUser = await ensureFirebaseUser();
    if (!fbUser) {
      return false;
    }
    const isAdminUser = await verifyIsFirebaseAdmin(fbUser);
    if (!isAdminUser) {
      return false;
    }
    const { fs, db } = await loadFirestoreCtx();
    const idsToDelete = new Set<string>();
    if (isValidFirestoreRuleId(specialistId)) idsToDelete.add(specialistId);
    idsToDelete.add(docId);
    if (docId.startsWith('spec-')) idsToDelete.add(docId.replace('spec-', 'doc-'));
    if (docId.startsWith('doc-')) idsToDelete.add(docId.replace('doc-', 'spec-'));

    for (const targetId of idsToDelete) {
      if (isValidFirestoreRuleId(targetId)) {
        const docRef = fs.doc(db, 'specialists', targetId);
        await withTimeout(fs.deleteDoc(docRef), 10000);
      }
    }
    console.log(`[Firestore] Successfully deleted specialist: ${docId}`);
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path, false);
    return false;
  }
}

export async function syncSpecialistsCollectionToFirestore(specialists: Specialist[]): Promise<boolean> {
  const path = 'specialists';
  try {
    const fbUser = await ensureFirebaseUser();
    if (!fbUser) return false;
    const isAdminUser = await verifyIsFirebaseAdmin(fbUser);
    if (!isAdminUser) return false;

    const { fs, db } = await loadFirestoreCtx();
    const colRef = fs.collection(db, 'specialists');
    const keepIds = new Set<string>();

    await Promise.all(
      specialists.map((spec, idx) => {
        const docId = resolveFirestoreDocId(spec.id, 'spec');
        keepIds.add(docId);
        const docRef = fs.doc(db, 'specialists', docId);
        const cleanPayload = sanitizeFirestoreData({
          ...spec,
          id: docId,
          name: (spec.name || spec.nameEn || 'أخصائي').trim().slice(0, 200),
          bio: (spec.bio || '').slice(0, 5000),
          orderIndex: spec.orderIndex !== undefined ? spec.orderIndex : idx,
          active: spec.active !== false,
          isActive: spec.isActive !== false && spec.active !== false,
          updatedAtISO: new Date().toISOString()
        });
        return fs.setDoc(docRef, { ...cleanPayload, updatedAt: fs.serverTimestamp() }, { merge: true });
      })
    );

    const snap = await withTimeout(fs.getDocs(colRef), 8000);
    await Promise.all(
      snap.docs
        .filter((d) => !keepIds.has(d.id))
        .map(async (d) => {
          try {
            await fs.deleteDoc(d.ref);
          } catch (delErr: any) {
            if (delErr?.code !== 'permission-denied') throw delErr;
          }
        })
    );

    await markCollectionAuthoritative('specialists');
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path, false);
    return false;
  }
}

export async function getSpecialistsFromFirestore(): Promise<Specialist[]> {
  const path = 'specialists';
  try {
    const { fs, db } = await loadFirestoreCtx();
    const colRef = fs.collection(db, 'specialists');
    const snap = await withTimeout(fs.getDocs(colRef), 5000);
    const list: Specialist[] = [];
    snap.forEach((d) => {
      const data = d.data() as Specialist;
      if (data && data.name) {
        list.push({ ...data, id: data.id || d.id });
      }
    });
    return list;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path, false);
    return [];
  }
}

export function subscribeSpecialists(
  onUpdate: (specialists: Specialist[]) => void,
  onError?: (err: any) => void
): Unsubscribe {
  const path = 'specialists';
  let cancelled = false;
  let realUnsub: Unsubscribe | null = null;

  loadFirestoreCtx()
    .then(({ fs, db }) => {
      if (cancelled) return;
      const colRef = fs.collection(db, 'specialists');
      realUnsub = fs.onSnapshot(
        colRef,
        (snapshot) => {
          const list: Specialist[] = [];
          snapshot.forEach((d) => {
            const data = d.data() as Specialist;
            if (data && data.name) {
              list.push({ ...data, id: data.id || d.id });
            }
          });
          onUpdate(list);
        },
        (error) => {
          console.error('[Firestore Live Sync Error]:', (error as any)?.code || 'unknown', (error as any)?.message || error);
          if (onError) onError(error);
          handleFirestoreError(error, OperationType.LIST, path, false);
        }
      );
    })
    .catch((err) => {
      console.error('[Firestore Live Sync Error]:', err?.code || 'init-failed', err?.message || err);
      if (onError) onError(err);
    });

  return () => {
    cancelled = true;
    if (realUnsub) realUnsub();
  };
}

// ============================================================================
// 3. APPOINTMENTS (Booking & Status Tracking)
// ============================================================================

function normalizeTimestampToISO(val: any, fallbackISO?: string): string {
  if (!val) return fallbackISO || new Date().toISOString();
  if (typeof val === 'string') return val;
  if (val instanceof Date) return val.toISOString();
  if (typeof val?.toDate === 'function') {
    try {
      return val.toDate().toISOString();
    } catch {
      return fallbackISO || new Date().toISOString();
    }
  }
  if (typeof val?.seconds === 'number') {
    return new Date(val.seconds * 1000).toISOString();
  }
  return fallbackISO || new Date().toISOString();
}

function resolveRequestTypeFromDoc(data: Record<string, any>): Appointment['requestType'] {
  if (data.requestType) return data.requestType;
  switch (data.type) {
    case 'sewar':
      return 'shadow_teacher';
    case 'course':
      return 'course';
    case 'consultation':
      return 'quick_consultation';
    case 'national_day':
      return 'national_day_offer';
    case 'store_order':
      return 'store_order';
    case 'package':
      return 'package';
    default:
      return 'appointment';
  }
}

function resolveUnifiedType(appointment: Appointment): string {
  if (appointment.type) return appointment.type;
  switch (appointment.requestType) {
    case 'course':
      return 'course';
    case 'shadow_teacher':
      return 'sewar';
    case 'package':
      return 'package';
    case 'quick_consultation':
      return 'consultation';
    case 'store_order':
      return 'store_order';
    case 'national_day_offer':
      return 'national_day';
    default:
      return 'service';
  }
}

function mapDocToAppointment(docId: string, data: Record<string, any>): Appointment {
  const docIdStr = String(docId || '');
  const createdAtISO = normalizeTimestampToISO(data.createdAt, data.createdAtISO);
  return {
    id: docId,
    referenceNumber: data.referenceNumber || (docIdStr ? `RABA-${docIdStr.slice(-6).toUpperCase()}` : 'RABA-000000'),
    childName: data.childName || data.patientName || '',
    childAge: typeof data.childAge === 'number' ? data.childAge : 0,
    childBirthDate: data.childBirthDate || undefined,
    guardianName: data.guardianName || data.parentName || '',
    guardianPhone: data.guardianPhone || data.phone || '',
    guardianEmail: data.guardianEmail || '',
    serviceId: data.serviceId || '',
    serviceTitle: data.serviceTitle || data.serviceName || '',
    specialistId: data.specialistId || '',
    specialistName: data.specialistName || '',
    branch: data.branch || '',
    city: data.city || '',
    country: data.country || '',
    qualification: data.qualification || '',
    assignedToUserId: data.assignedToUserId || undefined,
    assignedToUserName: data.assignedToUserName || undefined,
    assignedToUserEmail: data.assignedToUserEmail || undefined,
    date: data.date || '',
    timeSlot: data.timeSlot || data.time || '',
    status: data.status || 'pending',
    paymentStatus: data.paymentStatus || 'unpaid',
    paymentMethod: data.paymentMethod || 'mada',
    amount: typeof data.amount === 'number' ? data.amount : 0,
    reminderSettings: data.reminderSettings || { whatsapp: true, sms: false, email: false },
    notes: data.notes || '',
    adminNotes: data.adminNotes || '',
    type: data.type || undefined,
    requestType: resolveRequestTypeFromDoc(data),
    requestSource: data.requestSource || '',
    couponCode: data.couponCode || '',
    orderItems: Array.isArray(data.orderItems) ? data.orderItems : undefined,
    shippingAddress: data.shippingAddress || '',
    preferredCallTime: data.preferredCallTime || '',
    readByAdmin: Boolean(data.readByAdmin),
    userId: data.userId || '',
    clientId: data.clientId || data.userId || '',
    familyMemberId: data.familyMemberId || undefined,
    familyMemberName: data.familyMemberName || undefined,
    createdAt: createdAtISO,
    createdAtISO: data.createdAtISO || createdAtISO,
    updatedAt: data.updatedAt ? normalizeTimestampToISO(data.updatedAt) : undefined
  };
}

export function sortAppointmentsNewestFirst(list: Appointment[]): Appointment[] {
  return [...list].sort((a, b) => {
    const timeA = Date.parse(a.createdAtISO || a.createdAt || '') || 0;
    const timeB = Date.parse(b.createdAtISO || b.createdAt || '') || 0;
    if (timeB !== timeA) return timeB - timeA;
    return String(b.id || '').localeCompare(String(a.id || ''));
  });
}

export async function saveAppointmentToFirestore(appointment: Appointment): Promise<boolean> {
  const rawId = appointment.id || `apt-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const docId = rawId.replace(/[^a-zA-Z0-9_\-]/g, '-').slice(0, 128);
  const path = `appointments/${docId}`;

  try {
    const { fs, db } = await loadFirestoreCtx();
    const docRef = fs.doc(db, 'appointments', docId);

    let normalizedStatus = appointment.status || 'new';
    if (!['new', 'pending', 'contacted', 'confirmed', 'completed', 'cancelled'].includes(normalizedStatus)) {
      normalizedStatus = 'new';
    }

    const createdAtISO = appointment.createdAt || new Date().toISOString();
    const sanitizedFields = sanitizeFirestoreData({
      id: docId,
      referenceNumber: appointment.referenceNumber || `RB-${docId.slice(-6).toUpperCase()}`,
      type: resolveUnifiedType(appointment),
      requestType: appointment.requestType || 'appointment',
      requestSource: appointment.requestSource || 'الموقع الإلكتروني',
      patientName: (appointment.childName || appointment.guardianName || 'مستفيد').trim().slice(0, 150),
      childName: (appointment.childName || appointment.guardianName || 'مستفيد').trim().slice(0, 150),
      childAge: typeof appointment.childAge === 'number' ? appointment.childAge : 0,
      childBirthDate: appointment.childBirthDate || '',
      parentName: (appointment.guardianName || 'ولي أمر').trim().slice(0, 150),
      guardianName: (appointment.guardianName || 'ولي أمر').trim().slice(0, 150),
      phone: (appointment.guardianPhone || '').trim().slice(0, 35),
      guardianPhone: (appointment.guardianPhone || '').trim().slice(0, 35),
      guardianEmail: (appointment.guardianEmail || '').trim().slice(0, 120),
      serviceId: (appointment.serviceId || 'general').slice(0, 120),
      serviceName: (appointment.serviceTitle || 'استشارة تأهيلية').trim().slice(0, 200),
      serviceTitle: (appointment.serviceTitle || 'استشارة تأهيلية').trim().slice(0, 200),
      specialistId: (appointment.specialistId || 'general').slice(0, 120),
      specialistName: (appointment.specialistName || 'الفريق الاستشاري').trim().slice(0, 150),
      branch: (appointment.branch || '').trim().slice(0, 100),
      city: (appointment.city || '').trim().slice(0, 100),
      country: (appointment.country || '').trim().slice(0, 100),
      qualification: (appointment.qualification || '').trim().slice(0, 200),
      ...(appointment.assignedToUserId ? { assignedToUserId: String(appointment.assignedToUserId).slice(0, 128) } : {}),
      ...(appointment.assignedToUserName ? { assignedToUserName: String(appointment.assignedToUserName).trim().slice(0, 150) } : {}),
      ...(appointment.assignedToUserEmail ? { assignedToUserEmail: String(appointment.assignedToUserEmail).trim().slice(0, 150) } : {}),
      date: (appointment.date || new Date().toISOString().split('T')[0]).slice(0, 50),
      time: (appointment.timeSlot || '10:00 AM').slice(0, 80),
      timeSlot: (appointment.timeSlot || '10:00 AM').slice(0, 80),
      status: normalizedStatus,
      paymentStatus: appointment.paymentStatus || 'unpaid',
      paymentMethod: appointment.paymentMethod || 'mada',
      amount: typeof appointment.amount === 'number' ? appointment.amount : 0,
      notes: (appointment.notes || '').slice(0, 2000),
      adminNotes: (appointment.adminNotes || '').slice(0, 2000),
      couponCode: (appointment.couponCode || '').slice(0, 60),
      orderItems: Array.isArray(appointment.orderItems) ? appointment.orderItems : [],
      shippingAddress: (appointment.shippingAddress || '').slice(0, 300),
      preferredCallTime: (appointment.preferredCallTime || '').slice(0, 100),
      readByAdmin: Boolean(appointment.readByAdmin),
      reminderSettings: appointment.reminderSettings || { whatsapp: true, sms: false, email: false },
      userId: (appointment.userId || auth?.currentUser?.uid || '').slice(0, 128),
      clientId: (appointment.clientId || appointment.userId || auth?.currentUser?.uid || '').slice(0, 128),
      ...(appointment.familyMemberId ? { familyMemberId: String(appointment.familyMemberId).slice(0, 128) } : {}),
      ...(appointment.familyMemberName ? { familyMemberName: String(appointment.familyMemberName).trim().slice(0, 150) } : {}),
      createdAtISO
    });

    // Attach serverTimestamp() AFTER sanitizeFirestoreData so the FieldValue sentinel is preserved intact
    const payload = {
      ...sanitizedFields,
      createdAt: fs.serverTimestamp()
    };

    await fs.setDoc(docRef, payload, { merge: true });
    console.log(`[Firestore] Successfully saved appointment in Firestore: ${docId}`);

    // Non-blocking best-effort mirror to local Express/Cloud SQL API (silent on static hosting)
    try {
      fetch('/api/db/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...sanitizedFields, createdAt: createdAtISO })
      }).catch(() => {});
    } catch {
      // non-blocking
    }

    return true;
  } catch (error) {
    console.error(`[Firestore Error - WRITE] Failed to save appointment to ${path}:`, error);
    handleFirestoreError(error, OperationType.WRITE, path, true);
    return false;
  }
}

export async function saveCustomerRequestToFirestore(request: Appointment): Promise<boolean> {
  const rawId = request.id || `req-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const docId = rawId.replace(/[^a-zA-Z0-9_\-]/g, '-').slice(0, 128);
  const path = `customer_requests/${docId}`;
  try {
    const { fs, db } = await loadFirestoreCtx();
    const docRef = fs.doc(db, 'customer_requests', docId);
    let normalizedStatus = request.status || 'new';
    if (!['new', 'pending', 'contacted', 'confirmed', 'completed', 'cancelled'].includes(normalizedStatus)) {
      normalizedStatus = 'new';
    }
    const createdAtISO = request.createdAt || new Date().toISOString();
    const sanitized = sanitizeFirestoreData({
      ...request,
      id: docId,
      referenceNumber: request.referenceNumber || `REQ-${docId.slice(-6).toUpperCase()}`,
      patientName: (request.childName || request.guardianName || 'مستفيد').trim().slice(0, 150),
      guardianName: (request.guardianName || 'ولي أمر').trim().slice(0, 150),
      phone: (request.guardianPhone || '').trim().slice(0, 35),
      guardianPhone: (request.guardianPhone || '').trim().slice(0, 35),
      guardianEmail: (request.guardianEmail || '').trim().slice(0, 120),
      serviceId: (request.serviceId || 'general').slice(0, 120),
      serviceName: (request.serviceTitle || 'طلب تواصل').trim().slice(0, 200),
      serviceTitle: (request.serviceTitle || 'طلب تواصل').trim().slice(0, 200),
      branch: (request.branch || request.city || 'الرياض').trim().slice(0, 100),
      city: (request.city || request.branch || 'الرياض').trim().slice(0, 100),
      country: (request.country || '').trim().slice(0, 100),
      qualification: (request.qualification || '').trim().slice(0, 200),
      ...(request.assignedToUserId ? { assignedToUserId: String(request.assignedToUserId).slice(0, 128) } : {}),
      ...(request.assignedToUserName ? { assignedToUserName: String(request.assignedToUserName).trim().slice(0, 150) } : {}),
      ...(request.assignedToUserEmail ? { assignedToUserEmail: String(request.assignedToUserEmail).trim().slice(0, 150) } : {}),
      requestType: request.requestType || 'contact',
      requestSource: (request.requestSource || 'الموقع الإلكتروني').slice(0, 150),
      notes: (request.notes || '').slice(0, 2000),
      status: normalizedStatus,
      createdAtISO
    });
    await fs.setDoc(docRef, { ...sanitized, createdAt: fs.serverTimestamp() }, { merge: true });
    console.log(`[Firestore] Successfully created customer request: ${docId}`);
    return true;
  } catch (error) {
    console.error(`[Firestore Error - WRITE] Failed to save customer request to ${path}:`, error);
    handleFirestoreError(error, OperationType.WRITE, path, true);
    return false;
  }
}

export async function updateAppointmentFieldsInFirestore(
  appointmentId: string,
  fields: Partial<Appointment>
): Promise<void> {
  const path = `appointments/${appointmentId}`;
  const currentUser = await ensureFirebaseUser();
  if (!currentUser) {
    return;
  }
  try {
    const { fs, db } = await loadFirestoreCtx();
    const docRef = fs.doc(db, 'appointments', appointmentId);
    const cleanPatch = sanitizeFirestoreData({ ...fields });
    await fs.updateDoc(docRef, {
      ...cleanPatch,
      updatedAt: fs.serverTimestamp()
    });
    console.log(`[Firestore] Successfully updated appointment ${appointmentId}`);
  } catch (error) {
    console.error(`[Firestore Error - UPDATE] Failed to update ${path}:`, error);
    handleFirestoreError(error, OperationType.UPDATE, path, true);
  }
}

export async function updateAppointmentStatusInFirestore(appointmentId: string, status: string): Promise<void> {
  await updateAppointmentFieldsInFirestore(appointmentId, {
    status: status as Appointment['status'],
    readByAdmin: true
  });
}

export async function deleteAppointmentFromFirestore(appointmentId: string): Promise<void> {
  const path = `appointments/${appointmentId}`;
  const currentUser = await ensureFirebaseUser();
  if (!currentUser) {
    return;
  }
  try {
    const { fs, db } = await loadFirestoreCtx();
    const docRef = fs.doc(db, 'appointments', appointmentId);
    await fs.deleteDoc(docRef);
    console.log(`[Firestore] Successfully deleted appointment: ${appointmentId}`);
  } catch (error) {
    console.error(`[Firestore Error - DELETE] Failed to delete ${path}:`, error);
    handleFirestoreError(error, OperationType.DELETE, path, true);
  }
}

export async function getAppointmentsFromFirestore(): Promise<Appointment[]> {
  const path = 'appointments';
  const currentUser = await ensureFirebaseUser();
  if (!currentUser) {
    return [];
  }
  try {
    const { fs, db } = await loadFirestoreCtx();
    const colRef = fs.collection(db, 'appointments');
    let snap;

    try {
      const orderedQuery = fs.query(colRef, fs.orderBy('createdAt', 'desc'));
      snap = await withTimeout(fs.getDocs(orderedQuery), 8000);
    } catch (queryErr: any) {
      const code = queryErr?.code || '';
      const msg = String(queryErr?.message || '');
      if (code === 'failed-precondition' || msg.includes('index')) {
        snap = await withTimeout(fs.getDocs(colRef), 8000);
      } else {
        throw queryErr;
      }
    }

    const list: Appointment[] = [];
    snap.forEach((d) => {
      list.push(mapDocToAppointment(d.id, d.data()));
    });
    return sortAppointmentsNewestFirst(list);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path, true);
    return [];
  }
}

export function subscribeAppointments(
  onUpdate: (appointments: Appointment[]) => void,
  onError?: (err: any) => void
): Unsubscribe {
  const path = 'appointments';
  let cancelled = false;
  let realUnsub: Unsubscribe | null = null;

  const attachListener = (fs: any, db: any, useOrderBy: boolean) => {
    if (cancelled) return;
    if (realUnsub) {
      realUnsub();
      realUnsub = null;
    }

    const colRef = fs.collection(db, 'appointments');
    const targetRef = useOrderBy ? fs.query(colRef, fs.orderBy('createdAt', 'desc')) : colRef;

    realUnsub = fs.onSnapshot(
      targetRef,
      (snapshot: any) => {
        const list: Appointment[] = [];
        snapshot.forEach((d: any) => {
          list.push(mapDocToAppointment(d.id, d.data()));
        });
        onUpdate(sortAppointmentsNewestFirst(list));
      },
      (error: any) => {
        const code = error?.code || '';
        const msg = String(error?.message || '');
        if (useOrderBy && (code === 'failed-precondition' || msg.includes('index'))) {
          console.warn('[Firestore Realtime] Missing index for orderBy(createdAt), falling back to client-side sort');
          attachListener(fs, db, false);
          return;
        }
        console.error('[Firestore Live Sync Error]:', code || 'unknown', msg || error);
        if (onError) onError(error);
        handleFirestoreError(error, OperationType.LIST, path, false);
      }
    );
  };

  Promise.all([ensureFirebaseUser(), loadFirestoreCtx()])
    .then(([currentUser, { fs, db }]) => {
      if (cancelled || !currentUser) return;
      attachListener(fs, db, true);
    })
    .catch((err) => {
      console.error('[Firestore Live Sync Error]:', err?.code || 'init-failed', err?.message || err);
      if (onError) onError(err);
    });

  return () => {
    cancelled = true;
    if (realUnsub) realUnsub();
  };
}

// ============================================================================
// 4. TESTIMONIALS & REVIEWS
// ============================================================================

export async function saveTestimonialToFirestore(review: ParentReview): Promise<boolean> {
  const docId = resolveFirestoreDocId(review.id, 'rev');
  const path = `testimonials/${docId}`;
  try {
    const { fs, db } = await loadFirestoreCtx();
    const docRef = fs.doc(db, 'testimonials', docId);

    const sanitizedPayload = sanitizeFirestoreData({
      ...review,
      id: docId,
      parentName: (review.parentName || 'ولي أمر مستفيد').trim().slice(0, 100),
      parentNameEn: (review.parentNameEn || 'Beneficiary Parent').trim().slice(0, 100),
      rating: Math.min(5, Math.max(1, Number(review.rating) || 5)),
      comment: (review.comment || review.content || 'تقييم متميز').trim().slice(0, 1500),
      category: (review.category || 'general').slice(0, 80),
      specialistName: (review.specialistName || '').slice(0, 120),
      location: (review.location || 'الرياض').slice(0, 100),
      date: (review.date || 'اليوم').slice(0, 50),
      isAnonymous: Boolean(review.isAnonymous),
      active: review.active !== false,
      isActive: review.isActive !== false && review.active !== false,
      avatar: (review.avatar || '').slice(0, 300),
      createdAtISO: (review as any).createdAtISO || new Date().toISOString(),
      updatedAtISO: new Date().toISOString()
    });

    await fs.setDoc(docRef, {
      ...sanitizedPayload,
      createdAt: fs.serverTimestamp(),
      updatedAt: fs.serverTimestamp()
    }, { merge: true });
    console.log(`[Firestore] Successfully saved review: ${docId}`);
    return true;
  } catch (error) {
    console.error(`[Firestore Error - WRITE] Failed to save testimonial to ${path}:`, error);
    handleFirestoreError(error, OperationType.WRITE, path, false);
    return false;
  }
}

export async function deleteTestimonialFromFirestore(reviewId: string): Promise<boolean> {
  const docId = resolveFirestoreDocId(reviewId, 'rev');
  const path = `testimonials/${docId}`;
  try {
    const fbUser = await ensureFirebaseUser();
    if (!fbUser) return false;
    const isAdminUser = await verifyIsFirebaseAdmin(fbUser);
    if (!isAdminUser) return false;
    const { fs, db } = await loadFirestoreCtx();
    const docRef = fs.doc(db, 'testimonials', docId);
    await fs.deleteDoc(docRef);
    console.log(`[Firestore] Successfully deleted testimonial: ${docId}`);
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path, false);
    return false;
  }
}

export async function syncTestimonialsCollectionToFirestore(reviews: ParentReview[]): Promise<boolean> {
  const path = 'testimonials';
  try {
    const fbUser = await ensureFirebaseUser();
    if (!fbUser) return false;
    const isAdminUser = await verifyIsFirebaseAdmin(fbUser);
    if (!isAdminUser) return false;

    const { fs, db } = await loadFirestoreCtx();
    const colRef = fs.collection(db, 'testimonials');
    const keepIds = new Set<string>();

    await Promise.all(
      reviews.map((review) => {
        const docId = resolveFirestoreDocId(review.id, 'rev');
        keepIds.add(docId);
        const docRef = fs.doc(db, 'testimonials', docId);
        const sanitizedPayload = sanitizeFirestoreData({
          ...review,
          id: docId,
          parentName: (review.parentName || 'ولي أمر مستفيد').trim().slice(0, 100),
          parentNameEn: (review.parentNameEn || 'Beneficiary Parent').trim().slice(0, 100),
          rating: Math.min(5, Math.max(1, Number(review.rating) || 5)),
          comment: (review.comment || review.content || 'تقييم متميز').trim().slice(0, 1500),
          category: (review.category || 'general').slice(0, 80),
          specialistName: (review.specialistName || '').slice(0, 120),
          location: (review.location || 'الرياض').slice(0, 100),
          date: (review.date || 'اليوم').slice(0, 50),
          isAnonymous: Boolean(review.isAnonymous),
          active: review.active !== false,
          isActive: review.isActive !== false && review.active !== false,
          avatar: (review.avatar || '').slice(0, 300),
          updatedAtISO: new Date().toISOString()
        });
        return fs.setDoc(docRef, {
          ...sanitizedPayload,
          createdAt: fs.serverTimestamp(),
          updatedAt: fs.serverTimestamp()
        }, { merge: true });
      })
    );

    const snap = await withTimeout(fs.getDocs(colRef), 8000);
    await Promise.all(
      snap.docs
        .filter((d) => !keepIds.has(d.id))
        .map(async (d) => {
          try {
            await fs.deleteDoc(d.ref);
          } catch (delErr: any) {
            if (delErr?.code !== 'permission-denied') throw delErr;
          }
        })
    );

    await markCollectionAuthoritative('testimonials');
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path, false);
    return false;
  }
}

export async function getTestimonialsFromFirestore(): Promise<ParentReview[]> {
  const path = 'testimonials';
  try {
    const { fs, db } = await loadFirestoreCtx();
    const colRef = fs.collection(db, 'testimonials');
    const snap = await fs.getDocs(colRef);
    const list: ParentReview[] = [];
    snap.forEach((d) => {
      list.push(d.data() as ParentReview);
    });
    return list;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
}

export function subscribeTestimonials(
  onUpdate: (testimonials: ParentReview[]) => void,
  onError?: (err: any) => void
): Unsubscribe {
  const path = 'testimonials';
  let cancelled = false;
  let realUnsub: Unsubscribe | null = null;

  loadFirestoreCtx()
    .then(({ fs, db }) => {
      if (cancelled) return;
      const colRef = fs.collection(db, 'testimonials');
      realUnsub = fs.onSnapshot(
        colRef,
        (snapshot) => {
          const list: ParentReview[] = [];
          snapshot.forEach((d) => {
            const data = d.data() as ParentReview;
            list.push({ ...data, id: data.id || d.id });
          });
          onUpdate(list);
        },
        (error) => {
          console.error('[Firestore Live Sync Error]:', (error as any)?.code || 'unknown', (error as any)?.message || error);
          if (onError) onError(error);
          handleFirestoreError(error, OperationType.LIST, path);
        }
      );
    })
    .catch((err) => {
      console.error('[Firestore Live Sync Error]:', err?.code || 'init-failed', err?.message || err);
      if (onError) onError(err);
    });

  return () => {
    cancelled = true;
    if (realUnsub) realUnsub();
  };
}

// ============================================================================
// 5. BLOG POSTS
// ============================================================================

export async function saveBlogPostToFirestore(post: BlogPost): Promise<boolean> {
  const docId = resolveFirestoreDocId(post.id, 'post');
  const path = `blog_posts/${docId}`;
  const currentUser = await ensureFirebaseUser();
  if (!currentUser) {
    return false;
  }
  const isAdminUser = await verifyIsFirebaseAdmin(currentUser);
  if (!isAdminUser) {
    return false;
  }
  try {
    const { fs, db } = await loadFirestoreCtx();
    const docRef = fs.doc(db, 'blog_posts', docId);
    const cleanPayload = sanitizeFirestoreData({
      ...post,
      id: docId,
      title: (post.title || post.titleEn || 'مقال توعوي').trim().slice(0, 400),
      category: (post.category || 'family_guidance').trim().slice(0, 100),
      status: post.status === 'draft' ? 'draft' : 'published',
      isSliderFeatured: post.isSliderFeatured !== false,
      updatedAtISO: new Date().toISOString()
    });
    await fs.setDoc(docRef, {
      ...cleanPayload,
      updatedAt: fs.serverTimestamp()
    }, { merge: true });
    console.log(`[Firestore] Successfully saved blog post: ${docId}`);
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path, false);
    return false;
  }
}

export async function deleteBlogPostFromFirestore(postId: string): Promise<boolean> {
  const docId = resolveFirestoreDocId(postId, 'post');
  const path = `blog_posts/${docId}`;
  const currentUser = await ensureFirebaseUser();
  if (!currentUser) {
    return false;
  }
  const isAdminUser = await verifyIsFirebaseAdmin(currentUser);
  if (!isAdminUser) {
    return false;
  }
  try {
    const { fs, db } = await loadFirestoreCtx();
    const docRef = fs.doc(db, 'blog_posts', docId);
    await fs.deleteDoc(docRef);
    console.log(`[Firestore] Successfully deleted blog post: ${docId}`);
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path, false);
    return false;
  }
}

export async function syncBlogPostsCollectionToFirestore(posts: BlogPost[]): Promise<boolean> {
  const path = 'blog_posts';
  try {
    const fbUser = await ensureFirebaseUser();
    if (!fbUser) return false;
    const isAdminUser = await verifyIsFirebaseAdmin(fbUser);
    if (!isAdminUser) return false;

    const { fs, db } = await loadFirestoreCtx();
    const colRef = fs.collection(db, 'blog_posts');
    const keepIds = new Set<string>();

    await Promise.all(
      posts.map((post, idx) => {
        const docId = resolveFirestoreDocId(post.id, 'post');
        keepIds.add(docId);
        const docRef = fs.doc(db, 'blog_posts', docId);
        const cleanPayload = sanitizeFirestoreData({
          ...post,
          id: docId,
          title: (post.title || post.titleEn || 'مقال توعوي').trim().slice(0, 400),
          category: (post.category || 'family_guidance').trim().slice(0, 100),
          status: post.status === 'draft' ? 'draft' : 'published',
          isSliderFeatured: post.isSliderFeatured !== false,
          order: post.order !== undefined ? post.order : idx + 1,
          updatedAtISO: new Date().toISOString()
        });
        return fs.setDoc(docRef, { ...cleanPayload, updatedAt: fs.serverTimestamp() }, { merge: true });
      })
    );

    const snap = await withTimeout(fs.getDocs(colRef), 8000);
    await Promise.all(
      snap.docs
        .filter((d) => !keepIds.has(d.id))
        .map(async (d) => {
          try {
            await fs.deleteDoc(d.ref);
          } catch (delErr: any) {
            if (delErr?.code !== 'permission-denied') throw delErr;
          }
        })
    );

    await markCollectionAuthoritative('blog_posts');
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path, false);
    return false;
  }
}

export function subscribeBlogPosts(
  onUpdate: (posts: BlogPost[]) => void,
  onError?: (err: any) => void
): Unsubscribe {
  const path = 'blog_posts';
  let cancelled = false;
  let realUnsub: Unsubscribe | null = null;

  loadFirestoreCtx()
    .then(({ fs, db }) => {
      if (cancelled) return;
      const colRef = fs.collection(db, 'blog_posts');
      realUnsub = fs.onSnapshot(
        colRef,
        (snapshot) => {
          const list: BlogPost[] = [];
          snapshot.forEach((d) => {
            const data = d.data() as BlogPost;
            if (data && (data.title || data.id)) {
              list.push({ ...data, id: data.id || d.id });
            }
          });
          onUpdate(list);
        },
        (error) => {
          console.error('[Firestore Live Sync Error]:', (error as any)?.code || 'unknown', (error as any)?.message || error);
          if (onError) onError(error);
          handleFirestoreError(error, OperationType.LIST, path, false);
        }
      );
    })
    .catch((err) => {
      console.error('[Firestore Live Sync Error]:', err?.code || 'init-failed', err?.message || err);
      if (onError) onError(err);
    });

  return () => {
    cancelled = true;
    if (realUnsub) realUnsub();
  };
}

// ============================================================================
// 5b. DEDICATED PUBLIC & FINANCE COLLECTIONS (services, packages, sliders,
//     courses, accreditations, partners, offers, finance)
// ============================================================================

async function syncGenericCollection<T extends { id?: string }>(
  collectionName: string,
  items: T[],
  fallbackPrefix: string,
  mapPayload: (item: T, docId: string, idx: number) => Record<string, any>,
  excludeDocIds: string[] = []
): Promise<boolean> {
  try {
    const fbUser = await ensureFirebaseUser();
    if (!fbUser) return false;
    const isAdminUser = await verifyIsFirebaseAdmin(fbUser);
    if (!isAdminUser) return false;

    const { fs, db } = await loadFirestoreCtx();
    const colRef = fs.collection(db, collectionName);
    const keepIds = new Set<string>(excludeDocIds);

    await Promise.all(
      items.map((item, idx) => {
        const docId = resolveFirestoreDocId(item.id, fallbackPrefix);
        keepIds.add(docId);
        const docRef = fs.doc(db, collectionName, docId);
        const cleanPayload = sanitizeFirestoreData({
          ...mapPayload(item, docId, idx),
          id: docId,
          updatedAtISO: new Date().toISOString()
        });
        return fs.setDoc(docRef, { ...cleanPayload, updatedAt: fs.serverTimestamp() }, { merge: true });
      })
    );

    const snap = await withTimeout(fs.getDocs(colRef), 8000);
    await Promise.all(
      snap.docs
        .filter((d) => !keepIds.has(d.id))
        .map(async (d) => {
          try {
            await fs.deleteDoc(d.ref);
          } catch (delErr: any) {
            if (delErr?.code !== 'permission-denied') throw delErr;
          }
        })
    );

    await markCollectionAuthoritative(collectionName);
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, collectionName, false);
    return false;
  }
}

function subscribeGenericCollection<T>(
  collectionName: string,
  onUpdate: (items: T[]) => void,
  onError?: (err: any) => void,
  filterFn?: (docId: string, data: any) => boolean
): Unsubscribe {
  let cancelled = false;
  let realUnsub: Unsubscribe | null = null;

  loadFirestoreCtx()
    .then(({ fs, db }) => {
      if (cancelled) return;
      const colRef = fs.collection(db, collectionName);
      realUnsub = fs.onSnapshot(
        colRef,
        (snapshot) => {
          const list: T[] = [];
          snapshot.forEach((d) => {
            const data = d.data() as any;
            if (!filterFn || filterFn(d.id, data)) {
              list.push({ ...data, id: data?.id || d.id } as T);
            }
          });
          onUpdate(list);
        },
        (error) => {
          console.error('[Firestore Live Sync Error]:', (error as any)?.code || 'unknown', (error as any)?.message || error);
          if (onError) onError(error);
          handleFirestoreError(error, OperationType.LIST, collectionName, false);
        }
      );
    })
    .catch((err) => {
      console.error('[Firestore Live Sync Error]:', err?.code || 'init-failed', err?.message || err);
      if (onError) onError(err);
    });

  return () => {
    cancelled = true;
    if (realUnsub) realUnsub();
  };
}

// --- SERVICES ---
const mapServiceDoc = (srv: ServiceItem, docId: string, idx = 0) => ({
  ...srv,
  id: docId,
  title: (srv.title || srv.titleEn || 'خدمة تأهيلية').trim().slice(0, 300),
  ...(srv.titleEn !== undefined ? { titleEn: String(srv.titleEn).trim().slice(0, 300) } : {}),
  description: (srv.description || '').slice(0, 5000),
  active: srv.active !== false,
  isActive: srv.isActive !== false && srv.active !== false,
  order: srv.order !== undefined ? srv.order : idx + 1
});

export async function saveServiceToFirestore(service: ServiceItem): Promise<boolean> {
  const docId = resolveFirestoreDocId(service.id, 'srv');
  try {
    const fbUser = await ensureFirebaseUser();
    if (!fbUser || !(await verifyIsFirebaseAdmin(fbUser))) return false;
    const { fs, db } = await loadFirestoreCtx();
    await fs.setDoc(
      fs.doc(db, 'services', docId),
      { ...sanitizeFirestoreData(mapServiceDoc(service, docId)), updatedAtISO: new Date().toISOString(), updatedAt: fs.serverTimestamp() },
      { merge: true }
    );
    await markCollectionAuthoritative('services');
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `services/${docId}`, false);
    return false;
  }
}

export async function deleteServiceFromFirestore(serviceId: string): Promise<boolean> {
  const docId = resolveFirestoreDocId(serviceId, 'srv');
  try {
    const fbUser = await ensureFirebaseUser();
    if (!fbUser || !(await verifyIsFirebaseAdmin(fbUser))) return false;
    const { fs, db } = await loadFirestoreCtx();
    await fs.deleteDoc(fs.doc(db, 'services', docId));
    await markCollectionAuthoritative('services');
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `services/${docId}`, false);
    return false;
  }
}

export async function syncServicesCollectionToFirestore(services: ServiceItem[]): Promise<boolean> {
  return syncGenericCollection('services', services, 'srv', mapServiceDoc);
}

export function subscribeServices(onUpdate: (items: ServiceItem[]) => void, onError?: (err: any) => void): Unsubscribe {
  return subscribeGenericCollection<ServiceItem>('services', (list) => {
    onUpdate([...list].sort((a, b) => (a.order ?? 999) - (b.order ?? 999)));
  }, onError);
}

// --- PACKAGES ---
const mapPackageDoc = (pkg: TherapyPackage, docId: string, idx = 0) => ({
  ...pkg,
  id: docId,
  name: (pkg.name || pkg.nameEn || 'باقة تأهيلية').trim().slice(0, 300),
  ...(pkg.nameEn !== undefined ? { nameEn: String(pkg.nameEn).trim().slice(0, 300) } : {}),
  price: Math.min(1000000, Math.max(0, Number(pkg.price) || 0)),
  active: pkg.active !== false,
  isActive: pkg.isActive !== false && pkg.active !== false,
  order: pkg.order !== undefined ? pkg.order : idx + 1
});

export async function savePackageToFirestore(pkg: TherapyPackage): Promise<boolean> {
  const docId = resolveFirestoreDocId(pkg.id, 'pkg');
  try {
    const fbUser = await ensureFirebaseUser();
    if (!fbUser || !(await verifyIsFirebaseAdmin(fbUser))) return false;
    const { fs, db } = await loadFirestoreCtx();
    await fs.setDoc(
      fs.doc(db, 'packages', docId),
      { ...sanitizeFirestoreData(mapPackageDoc(pkg, docId)), updatedAtISO: new Date().toISOString(), updatedAt: fs.serverTimestamp() },
      { merge: true }
    );
    await markCollectionAuthoritative('packages');
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `packages/${docId}`, false);
    return false;
  }
}

export async function deletePackageFromFirestore(packageId: string): Promise<boolean> {
  const docId = resolveFirestoreDocId(packageId, 'pkg');
  try {
    const fbUser = await ensureFirebaseUser();
    if (!fbUser || !(await verifyIsFirebaseAdmin(fbUser))) return false;
    const { fs, db } = await loadFirestoreCtx();
    await fs.deleteDoc(fs.doc(db, 'packages', docId));
    await markCollectionAuthoritative('packages');
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `packages/${docId}`, false);
    return false;
  }
}

export async function syncPackagesCollectionToFirestore(packages: TherapyPackage[]): Promise<boolean> {
  return syncGenericCollection('packages', packages, 'pkg', mapPackageDoc);
}

export function subscribePackages(onUpdate: (items: TherapyPackage[]) => void, onError?: (err: any) => void): Unsubscribe {
  return subscribeGenericCollection<TherapyPackage>('packages', (list) => {
    onUpdate([...list].sort((a, b) => (a.order ?? 999) - (b.order ?? 999)));
  }, onError);
}

// --- SLIDERS ---
const mapSliderDoc = (slide: HeroSlideItem, docId: string, idx = 0) => {
  const safeSrc = typeof slide.src === 'string' && slide.src.length <= 200000
    ? slide.src
    : '';
  return {
    ...slide,
    id: docId,
    titleAr: (slide.titleAr || '').slice(0, 400),
    titleEn: (slide.titleEn || '').slice(0, 400),
    src: safeSrc,
    active: slide.active !== false,
    order: slide.order !== undefined ? slide.order : idx + 1
  };
};

export async function saveSliderToFirestore(slide: HeroSlideItem): Promise<boolean> {
  const docId = resolveFirestoreDocId(slide.id, 'slide');
  try {
    const fbUser = await ensureFirebaseUser();
    if (!fbUser || !(await verifyIsFirebaseAdmin(fbUser))) return false;
    const { fs, db } = await loadFirestoreCtx();
    await fs.setDoc(
      fs.doc(db, 'sliders', docId),
      { ...sanitizeFirestoreData(mapSliderDoc(slide, docId)), updatedAtISO: new Date().toISOString(), updatedAt: fs.serverTimestamp() },
      { merge: true }
    );
    await markCollectionAuthoritative('sliders');
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `sliders/${docId}`, false);
    return false;
  }
}

export async function saveSliderConfigToFirestore(config: HeroSliderConfig): Promise<boolean> {
  try {
    const fbUser = await ensureFirebaseUser();
    if (!fbUser || !(await verifyIsFirebaseAdmin(fbUser))) return false;
    const { fs, db } = await loadFirestoreCtx();
    await fs.setDoc(
      fs.doc(db, 'sliders', 'slider_config'),
      { ...sanitizeFirestoreData({ ...config, id: 'slider_config', isConfigDoc: true }), updatedAtISO: new Date().toISOString(), updatedAt: fs.serverTimestamp() },
      { merge: true }
    );
    await markCollectionAuthoritative('sliders');
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'sliders/slider_config', false);
    return false;
  }
}

export async function deleteSliderFromFirestore(slideId: string): Promise<boolean> {
  const docId = resolveFirestoreDocId(slideId, 'slide');
  try {
    const fbUser = await ensureFirebaseUser();
    if (!fbUser || !(await verifyIsFirebaseAdmin(fbUser))) return false;
    const { fs, db } = await loadFirestoreCtx();
    await fs.deleteDoc(fs.doc(db, 'sliders', docId));
    await markCollectionAuthoritative('sliders');
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `sliders/${docId}`, false);
    return false;
  }
}

export async function syncSlidersCollectionToFirestore(slides: HeroSlideItem[], config?: HeroSliderConfig): Promise<boolean> {
  const ok = await syncGenericCollection('sliders', slides, 'slide', mapSliderDoc, ['slider_config']);
  if (config) {
    await saveSliderConfigToFirestore(config);
  }
  return ok;
}

export function subscribeSliders(
  onUpdate: (payload: { slides: HeroSlideItem[]; config?: HeroSliderConfig }) => void,
  onError?: (err: any) => void
): Unsubscribe {
  let cancelled = false;
  let realUnsub: Unsubscribe | null = null;

  loadFirestoreCtx()
    .then(({ fs, db }) => {
      if (cancelled) return;
      const colRef = fs.collection(db, 'sliders');
      realUnsub = fs.onSnapshot(
        colRef,
        (snapshot) => {
          const slides: HeroSlideItem[] = [];
          let config: HeroSliderConfig | undefined;
          snapshot.forEach((d) => {
            const data = d.data() as any;
            if (d.id === 'slider_config' || data?.isConfigDoc) {
              config = {
                autoplay: data.autoplay !== undefined ? Boolean(data.autoplay) : true,
                intervalSeconds: Number(data.intervalSeconds) || 4,
                showBadges: data.showBadges !== undefined ? Boolean(data.showBadges) : true,
                glowEffect: data.glowEffect !== undefined ? Boolean(data.glowEffect) : true
              };
            } else {
              slides.push({ ...data, id: data?.id || d.id } as HeroSlideItem);
            }
          });
          slides.sort((a, b) => (a.order || 0) - (b.order || 0));
          onUpdate({ slides, config });
        },
        (error) => {
          console.error('[Firestore Live Sync Error]:', (error as any)?.code || 'unknown', (error as any)?.message || error);
          if (onError) onError(error);
          handleFirestoreError(error, OperationType.LIST, 'sliders', false);
        }
      );
    })
    .catch((err) => {
      console.error('[Firestore Live Sync Error]:', err?.code || 'init-failed', err?.message || err);
      if (onError) onError(err);
    });

  return () => {
    cancelled = true;
    if (realUnsub) realUnsub();
  };
}

// --- COURSES ---
const mapCourseDoc = (course: CourseItem, docId: string, idx = 0) => ({
  ...course,
  id: docId,
  titleAr: (course.titleAr || course.titleEn || 'دورة تدريبية').trim().slice(0, 300),
  titleEn: (course.titleEn || course.titleAr || 'Training Course').trim().slice(0, 300),
  isActive: course.isActive !== false,
  active: course.isActive !== false,
  order: course.order !== undefined ? course.order : idx + 1
});

export async function saveCourseToFirestore(course: CourseItem): Promise<boolean> {
  const docId = resolveFirestoreDocId(course.id, 'course');
  try {
    const fbUser = await ensureFirebaseUser();
    if (!fbUser || !(await verifyIsFirebaseAdmin(fbUser))) return false;
    const { fs, db } = await loadFirestoreCtx();
    await fs.setDoc(
      fs.doc(db, 'courses', docId),
      { ...sanitizeFirestoreData(mapCourseDoc(course, docId)), updatedAtISO: new Date().toISOString(), updatedAt: fs.serverTimestamp() },
      { merge: true }
    );
    await markCollectionAuthoritative('courses');
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `courses/${docId}`, false);
    return false;
  }
}

export async function deleteCourseFromFirestore(courseId: string): Promise<boolean> {
  const docId = resolveFirestoreDocId(courseId, 'course');
  try {
    const fbUser = await ensureFirebaseUser();
    if (!fbUser || !(await verifyIsFirebaseAdmin(fbUser))) return false;
    const { fs, db } = await loadFirestoreCtx();
    await fs.deleteDoc(fs.doc(db, 'courses', docId));
    await markCollectionAuthoritative('courses');
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `courses/${docId}`, false);
    return false;
  }
}

export async function syncCoursesCollectionToFirestore(courses: CourseItem[]): Promise<boolean> {
  return syncGenericCollection('courses', courses, 'course', mapCourseDoc);
}

export function subscribeCourses(onUpdate: (items: CourseItem[]) => void, onError?: (err: any) => void): Unsubscribe {
  return subscribeGenericCollection<CourseItem>('courses', (list) => {
    onUpdate([...list].sort((a, b) => (a.order || 999) - (b.order || 999)));
  }, onError);
}

// --- ACCREDITATIONS ---
const mapAccreditationDoc = (acc: AccreditationItem, docId: string, idx = 0) => ({
  ...acc,
  id: docId,
  nameAr: (acc.nameAr || acc.nameEn || 'اعتماد').trim().slice(0, 300),
  nameEn: (acc.nameEn || acc.nameAr || 'Accreditation').trim().slice(0, 300),
  active: acc.active !== false,
  order: acc.order !== undefined ? acc.order : idx + 1
});

export async function saveAccreditationToFirestore(acc: AccreditationItem): Promise<boolean> {
  const docId = resolveFirestoreDocId(acc.id, 'acc');
  try {
    const fbUser = await ensureFirebaseUser();
    if (!fbUser || !(await verifyIsFirebaseAdmin(fbUser))) return false;
    const { fs, db } = await loadFirestoreCtx();
    await fs.setDoc(
      fs.doc(db, 'accreditations', docId),
      { ...sanitizeFirestoreData(mapAccreditationDoc(acc, docId)), updatedAtISO: new Date().toISOString(), updatedAt: fs.serverTimestamp() },
      { merge: true }
    );
    await markCollectionAuthoritative('accreditations');
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `accreditations/${docId}`, false);
    return false;
  }
}

export async function deleteAccreditationFromFirestore(accId: string): Promise<boolean> {
  const docId = resolveFirestoreDocId(accId, 'acc');
  try {
    const fbUser = await ensureFirebaseUser();
    if (!fbUser || !(await verifyIsFirebaseAdmin(fbUser))) return false;
    const { fs, db } = await loadFirestoreCtx();
    await fs.deleteDoc(fs.doc(db, 'accreditations', docId));
    await markCollectionAuthoritative('accreditations');
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `accreditations/${docId}`, false);
    return false;
  }
}

export async function syncAccreditationsCollectionToFirestore(items: AccreditationItem[]): Promise<boolean> {
  return syncGenericCollection('accreditations', items, 'acc', mapAccreditationDoc);
}

export function subscribeAccreditations(onUpdate: (items: AccreditationItem[]) => void, onError?: (err: any) => void): Unsubscribe {
  return subscribeGenericCollection<AccreditationItem>('accreditations', (list) => {
    onUpdate([...list].sort((a, b) => (a.order || 999) - (b.order || 999)));
  }, onError);
}

// --- PARTNERS ---
const mapPartnerDoc = (partner: PartnerItem, docId: string, idx = 0) => ({
  ...partner,
  id: docId,
  name: (partner.name || partner.nameEn || 'شريك').trim().slice(0, 300),
  nameEn: (partner.nameEn || partner.name || 'Partner').trim().slice(0, 300),
  isActive: partner.isActive !== false,
  active: partner.isActive !== false,
  order: partner.order !== undefined ? partner.order : idx + 1
});

export async function savePartnerToFirestore(partner: PartnerItem): Promise<boolean> {
  const docId = resolveFirestoreDocId(partner.id, 'partner');
  try {
    const fbUser = await ensureFirebaseUser();
    if (!fbUser || !(await verifyIsFirebaseAdmin(fbUser))) return false;
    const { fs, db } = await loadFirestoreCtx();
    await fs.setDoc(
      fs.doc(db, 'partners', docId),
      { ...sanitizeFirestoreData(mapPartnerDoc(partner, docId)), updatedAtISO: new Date().toISOString(), updatedAt: fs.serverTimestamp() },
      { merge: true }
    );
    await markCollectionAuthoritative('partners');
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `partners/${docId}`, false);
    return false;
  }
}

export async function deletePartnerFromFirestore(partnerId: string): Promise<boolean> {
  const docId = resolveFirestoreDocId(partnerId, 'partner');
  try {
    const fbUser = await ensureFirebaseUser();
    if (!fbUser || !(await verifyIsFirebaseAdmin(fbUser))) return false;
    const { fs, db } = await loadFirestoreCtx();
    await fs.deleteDoc(fs.doc(db, 'partners', docId));
    await markCollectionAuthoritative('partners');
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `partners/${docId}`, false);
    return false;
  }
}

export async function syncPartnersCollectionToFirestore(partners: PartnerItem[]): Promise<boolean> {
  return syncGenericCollection('partners', partners, 'partner', mapPartnerDoc);
}

export function subscribePartners(onUpdate: (items: PartnerItem[]) => void, onError?: (err: any) => void): Unsubscribe {
  return subscribeGenericCollection<PartnerItem>('partners', (list) => {
    onUpdate([...list].sort((a, b) => (a.order || 999) - (b.order || 999)));
  }, onError);
}

// --- OFFERS ---
const mapOfferDoc = (offer: OfferData, docId: string) => ({
  ...offer,
  id: docId,
  titleAr: (offer.titleAr || offer.titleEn || 'عرض خاص').trim().slice(0, 300),
  titleEn: (offer.titleEn || offer.titleAr || 'Special Offer').trim().slice(0, 300),
  active: offer.active !== false
});

export async function saveOfferToFirestore(offer: OfferData): Promise<boolean> {
  const docId = resolveFirestoreDocId(offer.id, 'offer');
  try {
    const fbUser = await ensureFirebaseUser();
    if (!fbUser || !(await verifyIsFirebaseAdmin(fbUser))) return false;
    const { fs, db } = await loadFirestoreCtx();
    await fs.setDoc(
      fs.doc(db, 'offers', docId),
      { ...sanitizeFirestoreData(mapOfferDoc(offer, docId)), updatedAtISO: new Date().toISOString(), updatedAt: fs.serverTimestamp() },
      { merge: true }
    );
    await markCollectionAuthoritative('offers');
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `offers/${docId}`, false);
    return false;
  }
}

export async function deleteOfferFromFirestore(offerId: string): Promise<boolean> {
  const docId = resolveFirestoreDocId(offerId, 'offer');
  try {
    const fbUser = await ensureFirebaseUser();
    if (!fbUser || !(await verifyIsFirebaseAdmin(fbUser))) return false;
    const { fs, db } = await loadFirestoreCtx();
    await fs.deleteDoc(fs.doc(db, 'offers', docId));
    await markCollectionAuthoritative('offers');
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `offers/${docId}`, false);
    return false;
  }
}

export async function syncOffersCollectionToFirestore(offers: OfferData[]): Promise<boolean> {
  return syncGenericCollection('offers', offers, 'offer', mapOfferDoc);
}

export function subscribeOffers(onUpdate: (items: OfferData[]) => void, onError?: (err: any) => void): Unsubscribe {
  return subscribeGenericCollection<OfferData>('offers', onUpdate, onError);
}

// --- FINANCE (Admin-Only Read & Write) ---
export async function saveFinanceRecordToFirestore(
  recordId: string,
  data: Record<string, any>
): Promise<boolean> {
  const docId = resolveFirestoreDocId(recordId, 'fin');
  try {
    const fbUser = await ensureFirebaseUser();
    if (!fbUser || !(await verifyIsFirebaseAdmin(fbUser))) return false;
    const { fs, db } = await loadFirestoreCtx();
    const cleanPayload = sanitizeFirestoreData({
      ...data,
      id: docId,
      ...(data.currencySymbol !== undefined ? { currencySymbol: String(data.currencySymbol).slice(0, 20) } : {}),
      ...(data.installmentNote !== undefined ? { installmentNote: String(data.installmentNote).slice(0, 500) } : {}),
      updatedAtISO: new Date().toISOString()
    });
    await fs.setDoc(
      fs.doc(db, 'finance', docId),
      { ...cleanPayload, updatedAt: fs.serverTimestamp() },
      { merge: true }
    );
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `finance/${docId}`, false);
    return false;
  }
}

export function subscribeFinanceRecords(
  onUpdate: (records: Record<string, any>) => void,
  onError?: (err: any) => void
): Unsubscribe {
  let cancelled = false;
  let realUnsub: Unsubscribe | null = null;

  Promise.all([ensureFirebaseUser(), loadFirestoreCtx()])
    .then(async ([fbUser, { fs, db }]) => {
      if (cancelled || !fbUser) return;
      const isAdminUser = await verifyIsFirebaseAdmin(fbUser);
      if (cancelled || !isAdminUser) return;
      const colRef = fs.collection(db, 'finance');
      realUnsub = fs.onSnapshot(
        colRef,
        (snapshot) => {
          const map: Record<string, any> = {};
          snapshot.forEach((d) => {
            map[d.id] = { ...d.data(), id: d.id };
          });
          onUpdate(map);
        },
        (error) => {
          console.error('[Firestore Live Sync Error]:', (error as any)?.code || 'unknown', (error as any)?.message || error);
          if (onError) onError(error);
          handleFirestoreError(error, OperationType.LIST, 'finance', false);
        }
      );
    })
    .catch((err) => {
      console.error('[Firestore Live Sync Error]:', err?.code || 'init-failed', err?.message || err);
      if (onError) onError(err);
    });

  return () => {
    cancelled = true;
    if (realUnsub) realUnsub();
  };
}

// ============================================================================
// 6. ADMIN USERS & ACCOUNTS (RBAC System)
// ============================================================================

export async function saveAdminUserToFirestore(
  user: AdminUser,
  explicitFirebaseUid?: string
): Promise<boolean> {
  const docId = user.id;
  const resolvedUid = (explicitFirebaseUid || user.firebaseUid || '').trim();
  const path = `admins/${resolvedUid || docId}`;
  const currentFbUser = await ensureFirebaseUser();
  if (!currentFbUser) {
    return false;
  }
  try {
    const { fs, db } = await loadFirestoreCtx();
    const { password: _, ...cleanUser } = user;
    const cleanPayload = sanitizeFirestoreData({
      ...cleanUser,
      ...(resolvedUid ? { firebaseUid: resolvedUid } : {}),
      updatedAtISO: new Date().toISOString()
    });
    const payload = {
      ...cleanPayload,
      updatedAt: fs.serverTimestamp()
    };

    await fs.setDoc(fs.doc(db, 'admins', docId), payload, { merge: true });

    // Crucial: firestore.rules checks exists(/admins/$(request.auth.uid)), so also store under firebaseUid
    if (resolvedUid && resolvedUid !== docId && /^[a-zA-Z0-9_-]+$/.test(resolvedUid)) {
      await fs.setDoc(fs.doc(db, 'admins', resolvedUid), payload, { merge: true });
    }

    console.log(`[Firestore] Successfully saved admin user: ${user.username} (${docId}${resolvedUid ? ` / uid:${resolvedUid}` : ''})`);
    return true;
  } catch (error) {
    console.error(`[Firestore Error - WRITE] Failed to save admin user to ${path}:`, error);
    handleFirestoreError(error, OperationType.WRITE, path, false);
    return false;
  }
}

export async function deleteAdminUserFromFirestore(
  userId: string,
  firebaseUid?: string
): Promise<boolean> {
  const path = `admins/${userId}`;
  const currentFbUser = await ensureFirebaseUser();
  if (!currentFbUser) {
    return false;
  }
  try {
    const { fs, db } = await loadFirestoreCtx();
    await fs.deleteDoc(fs.doc(db, 'admins', userId));
    if (firebaseUid && firebaseUid !== userId && /^[a-zA-Z0-9_-]+$/.test(firebaseUid)) {
      await fs.deleteDoc(fs.doc(db, 'admins', firebaseUid)).catch(() => {});
    }
    console.log(`[Firestore] Successfully deleted admin user: ${userId}`);
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path, false);
    return false;
  }
}

export async function getAdminUsersFromFirestore(): Promise<AdminUser[]> {
  const path = 'admins';
  const currentUser = await ensureFirebaseUser();
  if (!currentUser) {
    return [];
  }
  try {
    const { fs, db } = await loadFirestoreCtx();
    const colRef = fs.collection(db, 'admins');
    const snap = await withTimeout(fs.getDocs(colRef), 3000);
    const list: AdminUser[] = [];
    snap.forEach((d) => {
      list.push(d.data() as AdminUser);
    });
    return list;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path, false);
    return [];
  }
}

// ============================================================================
// 7. CLIENT PROFILES & FAMILY PORTAL (clients/{uid})
// ============================================================================

export function generateClientFileNumber(): string {
  const tsPart = String(Date.now()).slice(-4);
  const randPart = String(Math.floor(10 + Math.random() * 89));
  return `FILE-${tsPart}${randPart}`;
}

function sanitizeFamilyMembers(members: FamilyMember[] | undefined): FamilyMember[] {
  if (!Array.isArray(members)) return [];
  return members
    .filter((m) => m && typeof m.name === 'string' && m.name.trim().length > 0)
    .slice(0, 20)
    .map((m, idx) => {
      const cleanSubFile = (m.subFileNumber || `SUB-${String(idx + 1).padStart(2, '0')}`).trim().slice(0, 40);
      return {
        id: (m.id || `fam-${Date.now()}-${idx}`).slice(0, 64),
        name: m.name.trim().slice(0, 150),
        relation: (m.relation || 'طفل مستفيد').trim().slice(0, 80),
        dob: (m.dob || '').trim().slice(0, 30),
        ...(m.gender === 'male' || m.gender === 'female' ? { gender: m.gender } : {}),
        subFileNumber: cleanSubFile,
        ...(typeof m.notes === 'string' && m.notes.trim() ? { notes: m.notes.trim().slice(0, 500) } : {})
      };
    });
}

function mapDocToClientProfile(docId: string, data: Record<string, any>): ClientProfile {
  const createdAtISO = normalizeTimestampToISO(data.createdAt, data.createdAtISO);
  return {
    uid: data.uid || docId,
    fileNumber: data.fileNumber || `FILE-${docId.slice(-6).toUpperCase()}`,
    fullName: data.fullName || '',
    phone: data.phone || '',
    email: data.email || '',
    gender: data.gender === 'female' ? 'female' : 'male',
    dob: data.dob || '',
    familyMembers: Array.isArray(data.familyMembers) ? data.familyMembers : [],
    role: 'client',
    status: data.status === 'suspended' ? 'suspended' : 'active',
    adminNotes: data.adminNotes || '',
    ...(typeof data.suspensionReason === 'string' && data.suspensionReason ? { suspensionReason: data.suspensionReason } : {}),
    ...(typeof data.suspendedAt === 'string' && data.suspendedAt ? { suspendedAt: data.suspendedAt } : {}),
    ...(typeof data.suspendedBy === 'string' && data.suspendedBy ? { suspendedBy: data.suspendedBy } : {}),
    createdAt: createdAtISO,
    createdAtISO: data.createdAtISO || createdAtISO,
    updatedAt: data.updatedAt ? normalizeTimestampToISO(data.updatedAt) : undefined
  };
}

export function sortClientsNewestFirst(list: ClientProfile[]): ClientProfile[] {
  return [...list].sort((a, b) => {
    const timeA = Date.parse(a.createdAtISO || a.createdAt || '') || 0;
    const timeB = Date.parse(b.createdAtISO || b.createdAt || '') || 0;
    if (timeB !== timeA) return timeB - timeA;
    return String(a.fullName || '').localeCompare(String(b.fullName || ''));
  });
}

export async function getClientProfileFromFirestore(uid: string): Promise<ClientProfile | null> {
  if (!uid) return null;
  const path = `clients/${uid}`;
  try {
    const { fs, db } = await loadFirestoreCtx();
    const docRef = fs.doc(db, 'clients', uid);
    const snap = await withTimeout(fs.getDoc(docRef), 10000);
    if (!snap.exists()) return null;
    return mapDocToClientProfile(snap.id, snap.data());
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path, false);
    return null;
  }
}

export interface CreateClientProfileInput {
  fullName: string;
  phone: string;
  email: string;
  gender: 'male' | 'female';
  dob: string;
  familyMembers?: FamilyMember[];
}

export async function createClientProfileInFirestore(
  uid: string,
  input: CreateClientProfileInput
): Promise<ClientProfile> {
  const path = `clients/${uid}`;
  const currentUser = await ensureFirebaseUser();
  if (!currentUser || currentUser.uid !== uid) {
    throw new Error('User must be authenticated to create a client profile.');
  }

  try {
    const { fs, db } = await loadFirestoreCtx();
    const docRef = fs.doc(db, 'clients', uid);
    const fileNumber = generateClientFileNumber();
    const createdAtISO = new Date().toISOString();
    const sanitizedMembers = sanitizeFamilyMembers(input.familyMembers);

    const normalizedGender: 'male' | 'female' = input.gender === 'female' ? 'female' : 'male';
    const basePayload: Omit<ClientProfile, 'createdAt' | 'updatedAt'> = {
      uid,
      fileNumber,
      fullName: input.fullName.trim().slice(0, 150),
      phone: input.phone.trim().slice(0, 35),
      email: input.email.trim().slice(0, 150),
      gender: normalizedGender,
      dob: input.dob.trim().slice(0, 30),
      familyMembers: sanitizedMembers,
      role: 'client',
      status: 'active',
      adminNotes: '',
      createdAtISO
    };

    await fs.setDoc(docRef, {
      ...sanitizeFirestoreData(basePayload),
      createdAt: fs.serverTimestamp(),
      updatedAt: fs.serverTimestamp()
    });

    return {
      ...basePayload,
      createdAt: createdAtISO,
      updatedAt: createdAtISO
    };
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path, true);
    throw error;
  }
}

export interface AdminCreateClientProfileInput extends CreateClientProfileInput {
  adminNotes?: string;
  status?: 'active' | 'suspended';
  suspensionReason?: string;
  suspendedBy?: string;
}

export async function adminCreateClientProfileInFirestore(
  input: AdminCreateClientProfileInput
): Promise<ClientProfile> {
  const currentUser = await ensureFirebaseUser();
  if (!currentUser) {
    throw new Error('Authentication required to create a client file.');
  }

  const docId = `client-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  const path = `clients/${docId}`;

  try {
    const { fs, db } = await loadFirestoreCtx();
    const docRef = fs.doc(db, 'clients', docId);
    const fileNumber = generateClientFileNumber();
    const createdAtISO = new Date().toISOString();
    const sanitizedMembers = sanitizeFamilyMembers(input.familyMembers);
    const normalizedGender: 'male' | 'female' = input.gender === 'female' ? 'female' : 'male';
    const status: 'active' | 'suspended' = input.status === 'suspended' ? 'suspended' : 'active';

    const basePayload: Omit<ClientProfile, 'createdAt' | 'updatedAt'> = {
      uid: docId,
      fileNumber,
      fullName: input.fullName.trim().slice(0, 150),
      phone: input.phone.trim().slice(0, 35),
      email: input.email.trim().slice(0, 150),
      gender: normalizedGender,
      dob: input.dob.trim().slice(0, 30),
      familyMembers: sanitizedMembers,
      role: 'client',
      status,
      adminNotes: (input.adminNotes || '').trim().slice(0, 4000),
      ...(status === 'suspended' && input.suspensionReason?.trim()
        ? {
            suspensionReason: input.suspensionReason.trim().slice(0, 1000),
            suspendedAt: createdAtISO,
            suspendedBy: (input.suspendedBy || 'الإدارة').trim().slice(0, 150),
          }
        : {}),
      createdAtISO
    };

    await fs.setDoc(docRef, {
      ...sanitizeFirestoreData(basePayload),
      createdAt: fs.serverTimestamp(),
      updatedAt: fs.serverTimestamp()
    });

    return {
      ...basePayload,
      createdAt: createdAtISO,
      updatedAt: createdAtISO
    };
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path, true);
    throw error;
  }
}

export async function updateClientProfileInFirestore(
  uid: string,
  patch: Partial<
    Pick<
      ClientProfile,
      | 'fullName'
      | 'phone'
      | 'email'
      | 'gender'
      | 'dob'
      | 'familyMembers'
      | 'status'
      | 'adminNotes'
      | 'suspensionReason'
      | 'suspendedAt'
      | 'suspendedBy'
    >
  >
): Promise<void> {
  const path = `clients/${uid}`;
  const currentUser = await ensureFirebaseUser();
  if (!currentUser) {
    throw new Error('Authentication required to update client profile.');
  }

  try {
    const { fs, db } = await loadFirestoreCtx();
    const docRef = fs.doc(db, 'clients', uid);
    const cleanPatch: Record<string, any> = {};

    if (patch.fullName !== undefined) cleanPatch.fullName = patch.fullName.trim().slice(0, 150);
    if (patch.phone !== undefined) cleanPatch.phone = patch.phone.trim().slice(0, 35);
    if (patch.email !== undefined) cleanPatch.email = patch.email.trim().slice(0, 150);
    if (patch.gender !== undefined) cleanPatch.gender = patch.gender === 'female' ? 'female' : 'male';
    if (patch.dob !== undefined) cleanPatch.dob = patch.dob.trim().slice(0, 30);
    if (patch.familyMembers !== undefined) cleanPatch.familyMembers = sanitizeFamilyMembers(patch.familyMembers);
    if (patch.status !== undefined) cleanPatch.status = patch.status === 'suspended' ? 'suspended' : 'active';
    if (patch.adminNotes !== undefined) cleanPatch.adminNotes = patch.adminNotes.slice(0, 4000);
    if (patch.suspensionReason !== undefined) cleanPatch.suspensionReason = patch.suspensionReason.trim().slice(0, 1000);
    if (patch.suspendedAt !== undefined) cleanPatch.suspendedAt = patch.suspendedAt.trim().slice(0, 50);
    if (patch.suspendedBy !== undefined) cleanPatch.suspendedBy = patch.suspendedBy.trim().slice(0, 150);

    await fs.updateDoc(docRef, {
      ...sanitizeFirestoreData(cleanPatch),
      updatedAt: fs.serverTimestamp()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path, true);
    throw error;
  }
}

export async function deleteClientProfileFromFirestore(uid: string): Promise<void> {
  if (!uid) return;
  const path = `clients/${uid}`;
  const currentUser = await ensureFirebaseUser();
  if (!currentUser) {
    throw new Error('Authentication required to delete client file.');
  }

  try {
    const { fs, db } = await loadFirestoreCtx();
    const subColRef = fs.collection(db, 'clients', uid, 'member_records');
    const subSnap = await fs.getDocs(subColRef);
    for (const subDoc of subSnap.docs) {
      await fs.deleteDoc(subDoc.ref);
    }
    const docRef = fs.doc(db, 'clients', uid);
    await fs.deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path, true);
    throw error;
  }
}

export function subscribeClientProfile(
  uid: string,
  onUpdate: (profile: ClientProfile | null) => void,
  onError?: (err: any) => void
): Unsubscribe {
  const path = `clients/${uid}`;
  let cancelled = false;
  let realUnsub: Unsubscribe | null = null;

  Promise.all([ensureFirebaseUser(), loadFirestoreCtx()])
    .then(([currentUser, { fs, db }]) => {
      if (cancelled || !currentUser || !uid) return;
      const docRef = fs.doc(db, 'clients', uid);
      realUnsub = fs.onSnapshot(
        docRef,
        (snapshot: any) => {
          if (cancelled) return;
          if (!snapshot.exists()) {
            onUpdate(null);
          } else {
            onUpdate(mapDocToClientProfile(snapshot.id, snapshot.data()));
          }
        },
        (error: any) => {
          console.error('[Firestore Live Sync Error]:', error?.code || 'unknown', error?.message || error);
          if (onError) onError(error);
          handleFirestoreError(error, OperationType.GET, path, false);
        }
      );
    })
    .catch((err) => {
      console.error('[Firestore Live Sync Error]:', err?.code || 'init-failed', err?.message || err);
      if (onError) onError(err);
    });

  return () => {
    cancelled = true;
    if (realUnsub) realUnsub();
  };
}

export async function getAllClientsFromFirestore(): Promise<ClientProfile[]> {
  const path = 'clients';
  const currentUser = await ensureFirebaseUser();
  if (!currentUser) return [];

  try {
    const { fs, db } = await loadFirestoreCtx();
    const colRef = fs.collection(db, 'clients');
    let snap;

    try {
      const orderedQuery = fs.query(colRef, fs.orderBy('createdAt', 'desc'));
      snap = await withTimeout(fs.getDocs(orderedQuery), 8000);
    } catch (queryErr: any) {
      const code = queryErr?.code || '';
      const msg = String(queryErr?.message || '');
      if (code === 'failed-precondition' || msg.includes('index')) {
        snap = await withTimeout(fs.getDocs(colRef), 8000);
      } else {
        throw queryErr;
      }
    }

    const list: ClientProfile[] = [];
    snap.forEach((d) => {
      list.push(mapDocToClientProfile(d.id, d.data()));
    });
    return sortClientsNewestFirst(list);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path, true);
    return [];
  }
}

export function subscribeAllClients(
  onUpdate: (clients: ClientProfile[]) => void,
  onError?: (err: any) => void
): Unsubscribe {
  const path = 'clients';
  let cancelled = false;
  let realUnsub: Unsubscribe | null = null;

  const attachListener = (fs: any, db: any, useOrderBy: boolean) => {
    if (cancelled) return;
    if (realUnsub) {
      realUnsub();
      realUnsub = null;
    }

    const colRef = fs.collection(db, 'clients');
    const targetRef = useOrderBy ? fs.query(colRef, fs.orderBy('createdAt', 'desc')) : colRef;

    realUnsub = fs.onSnapshot(
      targetRef,
      (snapshot: any) => {
        const list: ClientProfile[] = [];
        snapshot.forEach((d: any) => {
          list.push(mapDocToClientProfile(d.id, d.data()));
        });
        onUpdate(sortClientsNewestFirst(list));
      },
      (error: any) => {
        const code = error?.code || '';
        const msg = String(error?.message || '');
        if (useOrderBy && (code === 'failed-precondition' || msg.includes('index'))) {
          attachListener(fs, db, false);
          return;
        }
        console.error('[Firestore Live Sync Error]:', code || 'unknown', msg || error);
        if (onError) onError(error);
        handleFirestoreError(error, OperationType.LIST, path, false);
      }
    );
  };

  Promise.all([ensureFirebaseUser(), loadFirestoreCtx()])
    .then(([currentUser, { fs, db }]) => {
      if (cancelled || !currentUser) return;
      attachListener(fs, db, true);
    })
    .catch((err) => {
      console.error('[Firestore Live Sync Error]:', err?.code || 'init-failed', err?.message || err);
      if (onError) onError(err);
    });

  return () => {
    cancelled = true;
    if (realUnsub) realUnsub();
  };
}

export async function getClientAppointmentsFromFirestore(clientUid: string): Promise<Appointment[]> {
  if (!clientUid) return [];
  const path = `appointments?userId=${clientUid}`;
  const currentUser = await ensureFirebaseUser();
  if (!currentUser) return [];

  try {
    const { fs, db } = await loadFirestoreCtx();
    const colRef = fs.collection(db, 'appointments');
    let snap;

    try {
      const orderedQuery = fs.query(
        colRef,
        fs.where('userId', '==', clientUid),
        fs.orderBy('createdAt', 'desc')
      );
      snap = await withTimeout(fs.getDocs(orderedQuery), 8000);
    } catch (queryErr: any) {
      const code = queryErr?.code || '';
      const msg = String(queryErr?.message || '');
      if (code === 'failed-precondition' || msg.includes('index')) {
        const fallbackQuery = fs.query(colRef, fs.where('userId', '==', clientUid));
        snap = await withTimeout(fs.getDocs(fallbackQuery), 8000);
      } else {
        throw queryErr;
      }
    }

    const list: Appointment[] = [];
    snap.forEach((d) => {
      list.push(mapDocToAppointment(d.id, d.data()));
    });
    return sortAppointmentsNewestFirst(list);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path, false);
    return [];
  }
}

export function subscribeClientAppointments(
  clientUid: string,
  onUpdate: (appointments: Appointment[]) => void,
  onError?: (err: any) => void
): Unsubscribe {
  const path = `appointments?userId=${clientUid}`;
  let cancelled = false;
  let realUnsub: Unsubscribe | null = null;

  const attachListener = (fs: any, db: any, useOrderBy: boolean) => {
    if (cancelled) return;
    if (realUnsub) {
      realUnsub();
      realUnsub = null;
    }

    const colRef = fs.collection(db, 'appointments');
    const targetRef = useOrderBy
      ? fs.query(colRef, fs.where('userId', '==', clientUid), fs.orderBy('createdAt', 'desc'))
      : fs.query(colRef, fs.where('userId', '==', clientUid));

    realUnsub = fs.onSnapshot(
      targetRef,
      (snapshot: any) => {
        const list: Appointment[] = [];
        snapshot.forEach((d: any) => {
          list.push(mapDocToAppointment(d.id, d.data()));
        });
        onUpdate(sortAppointmentsNewestFirst(list));
      },
      (error: any) => {
        const code = error?.code || '';
        const msg = String(error?.message || '');
        if (useOrderBy && (code === 'failed-precondition' || msg.includes('index'))) {
          attachListener(fs, db, false);
          return;
        }
        console.error('[Firestore Live Sync Error]:', code || 'unknown', msg || error);
        if (onError) onError(error);
        handleFirestoreError(error, OperationType.LIST, path, false);
      }
    );
  };

  Promise.all([ensureFirebaseUser(), loadFirestoreCtx()])
    .then(([currentUser, { fs, db }]) => {
      if (cancelled || !currentUser || !clientUid) return;
      attachListener(fs, db, true);
    })
    .catch((err) => {
      console.error('[Firestore Live Sync Error]:', err?.code || 'init-failed', err?.message || err);
      if (onError) onError(err);
    });

  return () => {
    cancelled = true;
    if (realUnsub) realUnsub();
  };
}

// ============================================================================
// 8. PER-MEMBER REPORTS & SUB-FILES (clients/{uid}/member_records/{recordId})
// ============================================================================

const VALID_MEMBER_REPORT_TYPES: MemberReportType[] = [
  'developmental_assessment',
  'aba_progress',
  'speech_therapy',
  'occupational_therapy',
  'iep_plan',
  'medical_file',
  'school_report',
  'other',
];

function mapDocToMemberRecord(docId: string, clientUid: string, data: Record<string, any>): MemberRecord {
  const createdAtISO = normalizeTimestampToISO(data.createdAt, data.createdAtISO);
  const reportType: MemberReportType = VALID_MEMBER_REPORT_TYPES.includes(data.reportType)
    ? data.reportType
    : 'other';
  const recordCategory: MemberRecordCategory = data.recordCategory === 'subfile' ? 'subfile' : 'report';

  return {
    id: data.id || docId,
    clientUid: data.clientUid || clientUid,
    familyMemberId: data.familyMemberId || '',
    familyMemberName: data.familyMemberName || '',
    recordCategory,
    reportType,
    title: data.title || '',
    summary: data.summary || '',
    recommendations: data.recommendations || '',
    specialistName: data.specialistName || '',
    reportDate: data.reportDate || createdAtISO.slice(0, 10),
    fileUrl: data.fileUrl || '',
    fileName: data.fileName || '',
    authorRole: data.authorRole === 'admin' ? 'admin' : 'client',
    createdByUid: data.createdByUid || '',
    createdAt: createdAtISO,
    createdAtISO: data.createdAtISO || createdAtISO,
    updatedAt: data.updatedAt ? normalizeTimestampToISO(data.updatedAt) : undefined
  };
}

export function sortMemberRecordsNewestFirst(list: MemberRecord[]): MemberRecord[] {
  return [...list].sort((a, b) => {
    const dateCompare = String(b.reportDate || '').localeCompare(String(a.reportDate || ''));
    if (dateCompare !== 0) return dateCompare;
    const timeA = Date.parse(a.createdAtISO || a.createdAt || '') || 0;
    const timeB = Date.parse(b.createdAtISO || b.createdAt || '') || 0;
    return timeB - timeA;
  });
}

export async function getMemberRecordsFromFirestore(clientUid: string): Promise<MemberRecord[]> {
  if (!clientUid) return [];
  const path = `clients/${clientUid}/member_records`;
  const currentUser = await ensureFirebaseUser();
  if (!currentUser) return [];

  try {
    const { fs, db } = await loadFirestoreCtx();
    const colRef = fs.collection(db, 'clients', clientUid, 'member_records');
    const snap = await withTimeout(fs.getDocs(colRef), 8000);
    const list: MemberRecord[] = [];
    snap.forEach((d) => {
      list.push(mapDocToMemberRecord(d.id, clientUid, d.data()));
    });
    return sortMemberRecordsNewestFirst(list);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path, false);
    return [];
  }
}

export function subscribeMemberRecords(
  clientUid: string,
  onUpdate: (records: MemberRecord[]) => void,
  onError?: (err: any) => void
): Unsubscribe {
  const path = `clients/${clientUid}/member_records`;
  let cancelled = false;
  let realUnsub: Unsubscribe | null = null;

  Promise.all([ensureFirebaseUser(), loadFirestoreCtx()])
    .then(([currentUser, { fs, db }]) => {
      if (cancelled || !currentUser || !clientUid) return;
      const colRef = fs.collection(db, 'clients', clientUid, 'member_records');
      realUnsub = fs.onSnapshot(
        colRef,
        (snapshot: any) => {
          if (cancelled) return;
          const list: MemberRecord[] = [];
          snapshot.forEach((d: any) => {
            list.push(mapDocToMemberRecord(d.id, clientUid, d.data()));
          });
          onUpdate(sortMemberRecordsNewestFirst(list));
        },
        (error: any) => {
          console.error('[Firestore Live Sync Error]:', error?.code || 'unknown', error?.message || error);
          if (onError) onError(error);
          handleFirestoreError(error, OperationType.LIST, path, false);
        }
      );
    })
    .catch((err) => {
      console.error('[Firestore Live Sync Error]:', err?.code || 'init-failed', err?.message || err);
      if (onError) onError(err);
    });

  return () => {
    cancelled = true;
    if (realUnsub) realUnsub();
  };
}

export interface CreateMemberRecordInput {
  id?: string;
  familyMemberId: string;
  familyMemberName: string;
  recordCategory: MemberRecordCategory;
  reportType: MemberReportType;
  title: string;
  summary: string;
  recommendations?: string;
  specialistName?: string;
  reportDate: string;
  fileUrl?: string;
  fileName?: string;
  authorRole: 'admin' | 'client';
}

export async function createMemberRecordInFirestore(
  clientUid: string,
  input: CreateMemberRecordInput
): Promise<MemberRecord> {
  const currentUser = await ensureFirebaseUser();
  if (!currentUser) {
    throw new Error('Authentication required to create member record.');
  }

  const rawId = input.id || `rec-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const docId = rawId.replace(/[^a-zA-Z0-9_\-]/g, '-').slice(0, 128);
  const path = `clients/${clientUid}/member_records/${docId}`;

  const reportType: MemberReportType = VALID_MEMBER_REPORT_TYPES.includes(input.reportType)
    ? input.reportType
    : 'other';

  try {
    const { fs, db } = await loadFirestoreCtx();
    const docRef = fs.doc(db, 'clients', clientUid, 'member_records', docId);
    const createdAtISO = new Date().toISOString();

    const basePayload = sanitizeFirestoreData({
      id: docId,
      clientUid: clientUid.slice(0, 128),
      familyMemberId: input.familyMemberId.trim().slice(0, 128),
      familyMemberName: input.familyMemberName.trim().slice(0, 150),
      recordCategory: input.recordCategory === 'subfile' ? 'subfile' : 'report',
      reportType,
      title: input.title.trim().slice(0, 200),
      summary: (input.summary || '').trim().slice(0, 6000),
      ...(input.recommendations?.trim() ? { recommendations: input.recommendations.trim().slice(0, 4000) } : {}),
      ...(input.specialistName?.trim() ? { specialistName: input.specialistName.trim().slice(0, 150) } : {}),
      reportDate: (input.reportDate || createdAtISO.slice(0, 10)).trim().slice(0, 30),
      ...(input.fileUrl?.trim() ? { fileUrl: input.fileUrl.trim().slice(0, 1000) } : {}),
      ...(input.fileName?.trim() ? { fileName: input.fileName.trim().slice(0, 250) } : {}),
      authorRole: input.authorRole === 'admin' ? 'admin' : 'client',
      createdByUid: currentUser.uid.slice(0, 128),
      createdAtISO
    });

    await fs.setDoc(docRef, {
      ...basePayload,
      createdAt: fs.serverTimestamp(),
      updatedAt: fs.serverTimestamp()
    });

    return {
      ...(basePayload as any),
      createdAt: createdAtISO,
      updatedAt: createdAtISO
    };
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path, true);
    throw error;
  }
}

export async function updateMemberRecordInFirestore(
  clientUid: string,
  recordId: string,
  patch: Partial<Pick<MemberRecord, 'familyMemberId' | 'familyMemberName' | 'reportType' | 'title' | 'summary' | 'recommendations' | 'specialistName' | 'reportDate' | 'fileUrl' | 'fileName'>>
): Promise<void> {
  const currentUser = await ensureFirebaseUser();
  if (!currentUser) {
    throw new Error('Authentication required to update member record.');
  }
  const path = `clients/${clientUid}/member_records/${recordId}`;

  try {
    const { fs, db } = await loadFirestoreCtx();
    const docRef = fs.doc(db, 'clients', clientUid, 'member_records', recordId);
    const cleanPatch: Record<string, any> = {};

    if (patch.familyMemberId !== undefined) cleanPatch.familyMemberId = patch.familyMemberId.trim().slice(0, 128);
    if (patch.familyMemberName !== undefined) cleanPatch.familyMemberName = patch.familyMemberName.trim().slice(0, 150);
    if (patch.reportType !== undefined) {
      cleanPatch.reportType = VALID_MEMBER_REPORT_TYPES.includes(patch.reportType) ? patch.reportType : 'other';
    }
    if (patch.title !== undefined) cleanPatch.title = patch.title.trim().slice(0, 200);
    if (patch.summary !== undefined) cleanPatch.summary = patch.summary.trim().slice(0, 6000);
    if (patch.recommendations !== undefined) cleanPatch.recommendations = patch.recommendations.trim().slice(0, 4000);
    if (patch.specialistName !== undefined) cleanPatch.specialistName = patch.specialistName.trim().slice(0, 150);
    if (patch.reportDate !== undefined) cleanPatch.reportDate = patch.reportDate.trim().slice(0, 30);
    if (patch.fileUrl !== undefined) cleanPatch.fileUrl = patch.fileUrl.trim().slice(0, 1000);
    if (patch.fileName !== undefined) cleanPatch.fileName = patch.fileName.trim().slice(0, 250);

    await fs.updateDoc(docRef, {
      ...sanitizeFirestoreData(cleanPatch),
      updatedAt: fs.serverTimestamp()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path, true);
    throw error;
  }
}

export async function deleteMemberRecordFromFirestore(clientUid: string, recordId: string): Promise<void> {
  const currentUser = await ensureFirebaseUser();
  if (!currentUser) {
    throw new Error('Authentication required to delete member record.');
  }
  const path = `clients/${clientUid}/member_records/${recordId}`;

  try {
    const { fs, db } = await loadFirestoreCtx();
    const docRef = fs.doc(db, 'clients', clientUid, 'member_records', recordId);
    await fs.deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path, true);
    throw error;
  }
}


