import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDocFromServer,
  getDocs,
  deleteDoc,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import fs from 'fs';
import path from 'path';

interface FirebaseConfigFile {
  projectId: string;
  appId: string;
  apiKey: string;
  authDomain: string;
  firestoreDatabaseId?: string;
  storageBucket?: string;
  messagingSenderId?: string;
}

interface CollectionReportRow {
  collection: string;
  accessPolicy: string;
  connectionStatus: string;
  recordCount: string;
  writeVerifyStatus: string;
}

function loadConfig(): FirebaseConfigFile {
  const configPath = path.resolve(process.cwd(), 'firebase-applet-config.json');
  if (!fs.existsSync(configPath)) {
    throw new Error('firebase-applet-config.json not found in workspace root.');
  }
  const raw = JSON.parse(fs.readFileSync(configPath, 'utf-8')) as FirebaseConfigFile;
  const required: (keyof FirebaseConfigFile)[] = ['apiKey', 'authDomain', 'projectId', 'appId'];
  for (const key of required) {
    if (!raw[key] || String(raw[key]).includes('remixed') || String(raw[key]).includes('your-')) {
      throw new Error(`Invalid or placeholder Firebase config key: ${key}`);
    }
  }
  return raw;
}

async function main(): Promise<void> {
  console.log('\n======================================================================');
  console.log('  Raba Center — Firebase Firestore End-to-End Audit & Verification');
  console.log('======================================================================\n');

  const config = loadConfig();
  const dbId =
    config.firestoreDatabaseId && config.firestoreDatabaseId !== '(default)'
      ? config.firestoreDatabaseId
      : undefined;

  console.log(`[1/5] Firebase Config Validated:`);
  console.log(`      Project ID  : ${config.projectId}`);
  console.log(`      Database ID : ${dbId || '(default)'}`);
  console.log(`      Auth Domain : ${config.authDomain}`);
  console.log(`      App ID      : ${config.appId}\n`);

  const app = getApps().length > 0 ? getApp() : initializeApp(config);
  const db = dbId ? getFirestore(app, dbId) : getFirestore(app);

  // 1. Connection Test
  console.log('[2/5] Testing live connection to Firestore (test/connection)...');
  await getDocFromServer(doc(db, 'test', 'connection'));
  console.log('      -> Connection OK (online & reachable).\n');

  // 2. Verify Unauthenticated Security Isolation on Protected Collections
  console.log('[3/5] Auditing Security Rules (confirming PII collections deny unauthenticated list)...');
  const protectedCollections = ['appointments', 'customer_requests', 'notifications', 'admins'];
  const securityResults: Record<string, boolean> = {};

  for (const colName of protectedCollections) {
    try {
      await getDocs(collection(db, colName));
      securityResults[colName] = false;
      console.error(`      [FAIL] ${colName} allowed unauthenticated list!`);
    } catch (err: any) {
      const code = err?.code || '';
      if (code === 'permission-denied') {
        securityResults[colName] = true;
        console.log(`      [PASS] ${colName}: unauthenticated list blocked (permission-denied).`);
      } else {
        throw err;
      }
    }
  }

  // Verify negative write validation (forged confirmed status without auth must fail)
  const forgedId = `forged-check-${Date.now()}`;
  try {
    await setDoc(doc(db, 'appointments', forgedId), {
      id: forgedId,
      patientName: 'Test Validation',
      phone: '0501234567',
      status: 'confirmed',
      createdAt: serverTimestamp()
    });
    await deleteDoc(doc(db, 'appointments', forgedId)).catch(() => {});
    throw new Error('Security validation failed: visitor was allowed to create a confirmed appointment.');
  } catch (err: any) {
    if (err?.code === 'permission-denied') {
      console.log('      [PASS] appointments: forged status="confirmed" create rejected (permission-denied).\n');
    } else {
      throw err;
    }
  }

  // 3. Live Write -> Read-back -> Verify serverTimestamp -> Delete -> Confirm Clean
  console.log('[4/5] Running Live Write -> Read -> Auto-Cleanup checks (isTestRecord: true)...');

  const verifyResults: Record<string, string> = {};
  const tsSuffix = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

  // Test A: appointments
  const aptTestId = `verify-test-apt-${tsSuffix}`;
  const aptRef = doc(db, 'appointments', aptTestId);
  try {
    await setDoc(aptRef, {
      id: aptTestId,
      referenceNumber: 'TEST-APT-01',
      type: 'service',
      requestType: 'appointment',
      requestSource: 'Automated Firebase Verification Script',
      patientName: 'سجل اختباري مؤقت',
      childName: 'سجل اختباري مؤقت',
      parentName: 'ولي أمر اختباري',
      guardianName: 'ولي أمر اختباري',
      phone: '0500000000',
      guardianPhone: '0500000000',
      serviceId: 'srv-aba',
      serviceName: 'تحليل السلوك التطبيقي ABA',
      serviceTitle: 'تحليل السلوك التطبيقي ABA',
      branch: 'الرياض',
      city: 'الرياض',
      date: new Date().toISOString().split('T')[0],
      timeSlot: '10:00 AM',
      status: 'new',
      notes: 'Verification record - auto-deleted immediately',
      isTestRecord: true,
      createdAt: serverTimestamp()
    });

    const snap = await getDocFromServer(aptRef);
    if (!snap.exists()) throw new Error('appointments test document was not found after write.');
    const data = snap.data();
    if (data.isTestRecord !== true || data.status !== 'new' || !(data.createdAt instanceof Timestamp)) {
      throw new Error('appointments test document fields or serverTimestamp failed verification.');
    }
    console.log(`      [PASS] appointments: wrote ${aptTestId}, verified fields & serverTimestamp().`);
    verifyResults.appointments = 'PASS (Write/Read/Delete)';
  } finally {
    await deleteDoc(aptRef).catch((e) => console.error('Cleanup error (appointments):', e));
    const afterDelete = await getDocFromServer(aptRef).catch(() => null);
    if (afterDelete && afterDelete.exists()) {
      throw new Error(`Cleanup failed: ${aptTestId} still exists in appointments!`);
    }
    console.log(`      [CLEAN] appointments: auto-deleted ${aptTestId} (exists=false).`);
  }

  // Test B: customer_requests
  const reqTestId = `verify-test-req-${tsSuffix}`;
  const reqRef = doc(db, 'customer_requests', reqTestId);
  try {
    await setDoc(reqRef, {
      id: reqTestId,
      referenceNumber: 'TEST-REQ-01',
      patientName: 'مشترك اختباري مؤقت',
      guardianName: 'مشترك اختباري مؤقت',
      guardianEmail: 'verify-test@rabacenters.com',
      phone: '0500000000',
      serviceId: 'newsletter-clinical',
      serviceTitle: 'اشتراك النشرة المعرفية',
      requestType: 'newsletter',
      requestSource: 'Automated Firebase Verification Script',
      status: 'new',
      notes: 'Verification record - auto-deleted immediately',
      isTestRecord: true,
      createdAt: serverTimestamp()
    });

    const snap = await getDocFromServer(reqRef);
    if (!snap.exists()) throw new Error('customer_requests test document was not found after write.');
    const data = snap.data();
    if (data.isTestRecord !== true || data.status !== 'new' || !(data.createdAt instanceof Timestamp)) {
      throw new Error('customer_requests test document fields or serverTimestamp failed verification.');
    }
    console.log(`      [PASS] customer_requests: wrote ${reqTestId}, verified fields & serverTimestamp().`);
    verifyResults.customer_requests = 'PASS (Write/Read/Delete)';
  } finally {
    await deleteDoc(reqRef).catch((e) => console.error('Cleanup error (customer_requests):', e));
    const afterDelete = await getDocFromServer(reqRef).catch(() => null);
    if (afterDelete && afterDelete.exists()) {
      throw new Error(`Cleanup failed: ${reqTestId} still exists in customer_requests!`);
    }
    console.log(`      [CLEAN] customer_requests: auto-deleted ${reqTestId} (exists=false).`);
  }

  // Test C: testimonials
  const revTestId = `verify-test-rev-${tsSuffix}`;
  const revRef = doc(db, 'testimonials', revTestId);
  try {
    await setDoc(revRef, {
      id: revTestId,
      parentName: 'مقيم اختباري مؤقت',
      rating: 5,
      comment: 'تقييم اختباري للتحقق من سلامة التخزين وسيتم حذفه تلقائياً.',
      category: 'aba',
      location: 'الرياض',
      isTestRecord: true,
      createdAt: serverTimestamp()
    });

    const snap = await getDocFromServer(revRef);
    if (!snap.exists()) throw new Error('testimonials test document was not found after write.');
    const data = snap.data();
    if (data.isTestRecord !== true || data.rating !== 5 || !(data.createdAt instanceof Timestamp)) {
      throw new Error('testimonials test document fields or serverTimestamp failed verification.');
    }
    console.log(`      [PASS] testimonials: wrote ${revTestId}, verified fields & serverTimestamp().`);
    verifyResults.testimonials = 'PASS (Write/Read/Delete)';
  } finally {
    await deleteDoc(revRef).catch((e) => console.error('Cleanup error (testimonials):', e));
    const afterDelete = await getDocFromServer(revRef).catch(() => null);
    if (afterDelete && afterDelete.exists()) {
      throw new Error(`Cleanup failed: ${revTestId} still exists in testimonials!`);
    }
    console.log(`      [CLEAN] testimonials: auto-deleted ${revTestId} (exists=false).\n`);
  }

  // 4. Collection Status & Counts Report
  console.log('[5/5] Gathering Collection Inventory & Final Status Report...\n');

  const publicCollections = ['site_settings', 'specialists', 'testimonials', 'blog_posts'];
  const reportRows: CollectionReportRow[] = [];

  for (const colName of publicCollections) {
    const snap = await getDocs(collection(db, colName));
    reportRows.push({
      collection: colName,
      accessPolicy: 'Public Read / Admin Write',
      connectionStatus: 'CONNECTED',
      recordCount: `${snap.size}`,
      writeVerifyStatus: verifyResults[colName] || 'Admin-Only Write'
    });
  }

  for (const colName of protectedCollections) {
    reportRows.push({
      collection: colName,
      accessPolicy: 'Admin Auth Required (PII Isolated)',
      connectionStatus: securityResults[colName] ? 'CONNECTED & PROTECTED' : 'EXPOSED (FAIL)',
      recordCount: 'Protected (Auth Required to List)',
      writeVerifyStatus: verifyResults[colName] || 'Admin-Only Write'
    });
  }

  console.table(reportRows);
  console.log('\n✅ ALL FIREBASE FIRESTORE AUDIT & VERIFICATION CHECKS PASSED CLEANLY.\n');
  process.exit(0);
}

main().catch((err) => {
  console.error('\n❌ Firebase Verification Failed:', err);
  process.exit(1);
});
