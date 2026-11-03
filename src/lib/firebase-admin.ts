import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import fs from 'fs';
import path from 'path';

let localFirebaseConfig: any = {};
try {
  const configPath = path.resolve(process.cwd(), 'firebase-applet-config.json');
  if (fs.existsSync(configPath)) {
    localFirebaseConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  }
} catch {
  // ignore
}

const projectId = 
  process.env.FIREBASE_PROJECT_ID || 
  process.env.PROJECT_ID || 
  process.env.GCP_PROJECT ||
  localFirebaseConfig?.projectId || 
  'tidal-antonym-5cb1c';

const clientEmail = 
  process.env.FIREBASE_CLIENT_EMAIL || 
  process.env.CLIENT_EMAIL;

const privateKeyRaw = 
  process.env.FIREBASE_PRIVATE_KEY || 
  process.env.PRIVATE_KEY;

const privateKey = privateKeyRaw ? privateKeyRaw.replace(/\\n/g, '\n') : undefined;

const databaseId = 
  process.env.FIREBASE_DATABASE_ID || 
  localFirebaseConfig?.firestoreDatabaseId || 
  'ai-studio-aba-997fb578-7190-4c0a-be4e-598b912acba8';

let app: App;

if (!getApps().length) {
  if (clientEmail && privateKey) {
    app = initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey,
      }),
      projectId,
    });
    console.log(`[Firebase Admin] Initialized with Service Account (${clientEmail}) for project: ${projectId}`);
  } else {
    app = initializeApp({
      projectId,
    });
    console.log(`[Firebase Admin] Initialized with Project ID: ${projectId} (ADC/Environment Mode)`);
  }
} else {
  app = getApps()[0];
}

export const adminAuth = getAuth(app);

// Initialize Firestore targeting the specific provisioned database
export const adminDb: Firestore = databaseId && databaseId !== '(default)'
  ? getFirestore(app, databaseId)
  : getFirestore(app);

console.log(`[Firebase Admin] Firestore targeting database: ${databaseId || '(default)'}`);

/**
 * Checks if Firebase Admin is configured and operational
 */
export function isFirestoreAdminConfigured(): boolean {
  return Boolean(clientEmail && privateKey);
}

/**
 * Fetches a single setting document from the Firestore 'site_settings' collection
 */
export async function getAdminFirestoreSetting(key: string): Promise<any | null> {
  if (!isFirestoreAdminConfigured()) {
    return null;
  }
  try {
    const docRef = adminDb.collection('site_settings').doc(key);
    const snap = await docRef.get();
    if (!snap.exists) {
      return null;
    }
    const docData = snap.data();
    return docData?.data !== undefined ? docData.data : docData;
  } catch (error: any) {
    console.warn(`[Firebase Admin] Notice reading site_setting '${key}':`, error.message);
    return null;
  }
}

/**
 * Persists a setting document to the Firestore 'site_settings' collection
 */
export async function saveAdminFirestoreSetting(key: string, data: any): Promise<boolean> {
  if (!isFirestoreAdminConfigured()) {
    return false;
  }
  try {
    const docRef = adminDb.collection('site_settings').doc(key);
    await docRef.set({
      key,
      data,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    return true;
  } catch (error: any) {
    console.warn(`[Firebase Admin] Notice writing site_setting '${key}':`, error.message);
    return false;
  }
}

/**
 * Deletes a setting document from the Firestore 'site_settings' collection
 */
export async function deleteAdminFirestoreSetting(key: string): Promise<boolean> {
  if (!isFirestoreAdminConfigured()) {
    return false;
  }
  try {
    const docRef = adminDb.collection('site_settings').doc(key);
    await docRef.delete();
    return true;
  } catch (error: any) {
    console.warn(`[Firebase Admin] Notice deleting site_setting '${key}':`, error.message);
    return false;
  }
}

/**
 * Fetches all settings documents from the Firestore 'site_settings' collection
 */
export async function getAllAdminFirestoreSettings(): Promise<Record<string, any>> {
  if (!isFirestoreAdminConfigured()) {
    return {};
  }
  try {
    const snapshot = await adminDb.collection('site_settings').get();
    const result: Record<string, any> = {};
    snapshot.forEach(docSnap => {
      const docData = docSnap.data();
      result[docSnap.id] = docData?.data !== undefined ? docData.data : docData;
    });
    return result;
  } catch (error: any) {
    console.warn('[Firebase Admin] Notice reading all site_settings from Firestore:', error.message);
    return {};
  }
}
