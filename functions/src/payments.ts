/**
 * Firebase Cloud Functions (v2 HTTPS) — Raba Center Online Payment Verification & Webhooks
 *
 * Security Model:
 * 1. NEVER trusts client URL query parameters (?status=paid) alone.
 * 2. Always verifies the transaction directly against Moyasar's REST API
 *    (`https://api.moyasar.com/v1/payments/{id}`) using the server-side Secret Key
 *    (resolved from Firebase Secret Manager `MOYASAR_SECRET_KEY` or Super-Admin-only
 *    Firestore document `payment_secrets/moyasar`).
 * 3. Validates Moyasar webhook `secret_token` using constant-time comparison (`crypto.timingSafeEqual`).
 * 4. Atomically synchronizes:
 *    - `payments/{paymentId}` -> `status`, `verifiedAt`, `verifiedByServer`, `gatewayPayload`
 *    - `appointments/{appointmentId}` -> `paymentStatus: 'paid'`, `status: 'confirmed'`
 *    - `notifications/{notifId}` -> real-time admin alert ("تم استلام دفعة إلكترونية جديدة")
 */

import * as crypto from 'crypto';
import * as admin from 'firebase-admin';
import { onRequest } from 'firebase-functions/v2/https';
import { defineSecret } from 'firebase-functions/params';

if (!admin.apps.length) {
  admin.initializeApp();
}

const MOYASAR_SECRET_KEY = defineSecret('MOYASAR_SECRET_KEY');
const MOYASAR_WEBHOOK_SECRET = defineSecret('MOYASAR_WEBHOOK_SECRET');

const ALLOWED_ORIGINS = new Set([
  'https://rabacenters.com',
  'https://www.rabacenters.com',
  'http://localhost:3000',
  'http://127.0.0.1:3000'
]);

interface MoyasarPaymentResponse {
  id: string;
  status: 'initiated' | 'paid' | 'failed' | 'authorized' | 'captured' | 'refunded' | 'voided' | string;
  amount: number; // halalas (SAR * 100)
  fee?: number;
  currency: string;
  refunded?: number;
  description?: string;
  source?: {
    type?: string;
    company?: string;
    name?: string;
    number?: string;
    message?: string;
    reference_number?: string;
  };
  metadata?: Record<string, string>;
  created_at?: string;
  updated_at?: string;
}

function getFirestoreDb() {
  const databaseId = process.env.FIRESTORE_DATABASE_ID;
  if (databaseId) {
    return admin.firestore().databaseId === databaseId
      ? admin.firestore()
      : (admin.firestore as any)(admin.app(), databaseId);
  }
  return admin.firestore();
}

function timingSafeCompare(a: string, b: string): boolean {
  if (!a || !b) return false;
  const bufA = Buffer.from(a, 'utf8');
  const bufB = Buffer.from(b, 'utf8');
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

async function resolveServerPaymentSecrets(db: FirebaseFirestore.Firestore): Promise<{
  secretKey: string;
  webhookSecret: string;
}> {
  let secretKey = MOYASAR_SECRET_KEY.value() || process.env.MOYASAR_SECRET_KEY || '';
  let webhookSecret = MOYASAR_WEBHOOK_SECRET.value() || process.env.MOYASAR_WEBHOOK_SECRET || '';

  if (!secretKey || !webhookSecret) {
    try {
      const snap = await db.doc('payment_secrets/moyasar').get();
      if (snap.exists) {
        const data = snap.data() || {};
        if (!secretKey) {
          secretKey = String(data.secretKey || data.liveSecretKey || data.sandboxSecretKey || '').trim();
        }
        if (!webhookSecret) {
          webhookSecret = String(data.webhookSecret || '').trim();
        }
      }
    } catch (err) {
      console.error('[CloudFunctions/Payments] Failed reading payment_secrets/moyasar:', err);
    }
  }

  return { secretKey, webhookSecret };
}

function mapMoyasarStatusToInternal(status: string): 'paid' | 'failed' | 'refunded' | 'pending' {
  const s = String(status || '').toLowerCase();
  if (s === 'paid' || s === 'captured') return 'paid';
  if (s === 'refunded' || s === 'voided') return 'refunded';
  if (s === 'failed') return 'failed';
  return 'pending';
}

function mapMoyasarMethod(source?: MoyasarPaymentResponse['source']): string {
  const type = String(source?.type || '').toLowerCase();
  const company = String(source?.company || '').toLowerCase();
  if (type === 'applepay') return 'applepay';
  if (type === 'stcpay') return 'stcpay';
  if (company === 'mada') return 'mada';
  if (type === 'creditcard') return 'creditcard';
  return 'mada';
}

async function fetchMoyasarPayment(gatewayPaymentId: string, secretKey: string): Promise<MoyasarPaymentResponse> {
  const cleanId = String(gatewayPaymentId || '').trim();
  if (!/^[a-zA-Z0-9_-]{6,120}$/.test(cleanId)) {
    throw new Error('INVALID_GATEWAY_PAYMENT_ID');
  }
  const authHeader = `Basic ${Buffer.from(`${secretKey}:`).toString('base64')}`;
  const response = await fetch(`https://api.moyasar.com/v1/payments/${encodeURIComponent(cleanId)}`, {
    method: 'GET',
    headers: {
      Authorization: authHeader,
      Accept: 'application/json'
    }
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => '');
    throw new Error(`MOYASAR_API_ERROR_${response.status}: ${errText.slice(0, 200)}`);
  }

  return (await response.json()) as MoyasarPaymentResponse;
}

/**
 * Atomically updates `payments/{paymentId}`, linked `appointments/{appointmentId}`,
 * and creates an admin notification inside `notifications/{id}` using a Firestore Transaction.
 */
async function syncVerifiedPaymentToFirestore(
  db: FirebaseFirestore.Firestore,
  moyasarPayment: MoyasarPaymentResponse,
  explicitPaymentId?: string
): Promise<{
  paymentId: string;
  status: 'paid' | 'failed' | 'refunded' | 'pending';
  appointmentId: string;
  amountSar: number;
}> {
  const internalStatus = mapMoyasarStatusToInternal(moyasarPayment.status);
  const meta = moyasarPayment.metadata || {};
  const paymentId = String(explicitPaymentId || meta.paymentId || `pay_${moyasarPayment.id}`).replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 128);
  const amountSar = Math.round(Number(moyasarPayment.amount || 0)) / 100;
  const nowISO = new Date().toISOString();
  const method = mapMoyasarMethod(moyasarPayment.source);
  const cardLast4 = String(moyasarPayment.source?.number || '').slice(-4);
  const cardBrand = String(moyasarPayment.source?.company || moyasarPayment.source?.type || '').toUpperCase();

  let resolvedAppointmentId = String(meta.appointmentId || '').trim();

  await db.runTransaction(async (tx) => {
    const payRef = db.collection('payments').doc(paymentId);
    const paySnap = await tx.get(payRef);
    const existing = paySnap.exists ? paySnap.data() || {} : {};

    if (!resolvedAppointmentId && typeof existing.appointmentId === 'string') {
      resolvedAppointmentId = existing.appointmentId;
    }

    const alreadyPaid = existing.status === 'paid' && existing.verifiedByServer === true;

    const paymentUpdate: Record<string, any> = {
      id: paymentId,
      gatewayPaymentId: moyasarPayment.id,
      provider: 'moyasar',
      method,
      cardBrand,
      cardLast4,
      status: internalStatus,
      gatewayStatus: moyasarPayment.status,
      gatewayMessage: String(moyasarPayment.source?.message || (internalStatus === 'paid' ? 'تم الدفع بنجاح' : '')).slice(0, 500),
      gatewayPayload: {
        id: moyasarPayment.id,
        status: moyasarPayment.status,
        amountHalalas: moyasarPayment.amount,
        currency: moyasarPayment.currency,
        company: moyasarPayment.source?.company || '',
        type: moyasarPayment.source?.type || '',
        referenceNumber: moyasarPayment.source?.reference_number || ''
      },
      verifiedByServer: true,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      ...(internalStatus === 'paid'
        ? {
            verifiedAt: admin.firestore.FieldValue.serverTimestamp(),
            verifiedAtISO: nowISO
          }
        : {})
    };

    if (!paySnap.exists) {
      paymentUpdate.invoiceNumber = `RABA-${new Date().getFullYear()}-${moyasarPayment.id.slice(-6).toUpperCase()}`;
      paymentUpdate.amount = amountSar;
      paymentUpdate.subtotal = amountSar;
      paymentUpdate.vatAmount = 0;
      paymentUpdate.currency = 'SAR';
      paymentUpdate.mode = String(moyasarPayment.id).startsWith('live') ? 'live' : 'sandbox';
      paymentUpdate.clientName = String(meta.clientName || 'ولي أمر مستفيد').slice(0, 150);
      paymentUpdate.clientPhone = String(meta.clientPhone || '0500000000').slice(0, 35);
      paymentUpdate.serviceTitle = String(meta.serviceTitle || moyasarPayment.description || 'خدمة تأهيلية').slice(0, 250);
      paymentUpdate.appointmentId = resolvedAppointmentId;
      paymentUpdate.clientId = String(meta.clientId || '').slice(0, 128);
      paymentUpdate.fileNumber = String(meta.fileNumber || '').slice(0, 50);
      paymentUpdate.createdAt = admin.firestore.FieldValue.serverTimestamp();
      paymentUpdate.createdAtISO = nowISO;
      tx.set(payRef, paymentUpdate, { merge: true });
    } else {
      tx.set(payRef, paymentUpdate, { merge: true });
    }

    // Atomically confirm linked appointment on verified `paid` status
    if (resolvedAppointmentId && (internalStatus === 'paid' || internalStatus === 'refunded')) {
      const aptRef = db.collection('appointments').doc(resolvedAppointmentId);
      const aptSnap = await tx.get(aptRef);
      if (aptSnap.exists) {
        tx.update(aptRef, {
          paymentStatus: internalStatus === 'paid' ? 'paid' : 'refunded',
          ...(internalStatus === 'paid' ? { status: 'confirmed' } : {}),
          paymentMethod: method,
          gatewayPaymentId: moyasarPayment.id,
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
      }
    }

    // Create a single idempotent admin notification on first transition to `paid`
    if (internalStatus === 'paid' && !alreadyPaid) {
      const notifId = `notif_pay_${paymentId}`.slice(0, 128);
      const notifRef = db.collection('notifications').doc(notifId);
      tx.set(
        notifRef,
        {
          id: notifId,
          type: 'payment',
          title: 'تم استلام دفعة إلكترونية جديدة',
          message: `تم استلام مبلغ ${amountSar.toLocaleString('en-US')} ر.س عبر ${cardBrand || method} من ${existing.clientName || meta.clientName || 'عميل'} مقابل ${existing.serviceTitle || meta.serviceTitle || 'خدمة'}`,
          paymentId,
          gatewayPaymentId: moyasarPayment.id,
          appointmentId: resolvedAppointmentId,
          amount: amountSar,
          read: false,
          createdAtISO: nowISO,
          createdAt: admin.firestore.FieldValue.serverTimestamp()
        },
        { merge: true }
      );
    }
  });

  return {
    paymentId,
    status: internalStatus,
    appointmentId: resolvedAppointmentId,
    amountSar
  };
}

/**
 * 1) HTTPS Cloud Function: `verifyMoyasarPayment`
 * Called by `/payment-callback` with `{ gatewayPaymentId, paymentId }`.
 */
export const verifyMoyasarPayment = onRequest(
  {
    region: 'me-central1',
    secrets: [MOYASAR_SECRET_KEY, MOYASAR_WEBHOOK_SECRET],
    timeoutSeconds: 30
  },
  async (req, res) => {
    const origin = String(req.headers.origin || '');
    if (ALLOWED_ORIGINS.has(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Vary', 'Origin');
    }
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
      res.status(204).send('');
      return;
    }
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method Not Allowed' });
      return;
    }

    try {
      const gatewayPaymentId = String(req.body?.gatewayPaymentId || req.body?.id || '').trim();
      const paymentId = String(req.body?.paymentId || req.body?.tx || '').trim();

      if (!gatewayPaymentId) {
        res.status(400).json({ error: 'Missing gatewayPaymentId' });
        return;
      }

      const db = getFirestoreDb();
      const { secretKey } = await resolveServerPaymentSecrets(db);
      if (!secretKey) {
        res.status(503).json({ error: 'Payment gateway secret key is not configured on the server.' });
        return;
      }

      const moyasarPayment = await fetchMoyasarPayment(gatewayPaymentId, secretKey);
      const synced = await syncVerifiedPaymentToFirestore(db, moyasarPayment, paymentId || undefined);

      res.status(200).json({
        success: true,
        verified: true,
        paymentId: synced.paymentId,
        gatewayPaymentId: moyasarPayment.id,
        status: synced.status,
        gatewayStatus: moyasarPayment.status,
        amount: synced.amountSar,
        currency: moyasarPayment.currency || 'SAR',
        method: mapMoyasarMethod(moyasarPayment.source),
        cardBrand: moyasarPayment.source?.company || '',
        cardLast4: String(moyasarPayment.source?.number || '').slice(-4),
        message: moyasarPayment.source?.message || '',
        appointmentId: synced.appointmentId
      });
    } catch (error: any) {
      console.error('[verifyMoyasarPayment] Error:', error);
      res.status(502).json({
        success: false,
        error: 'Failed to verify payment with gateway.'
      });
    }
  }
);

/**
 * 2) HTTPS Cloud Function: `moyasarWebhook`
 * Receives asynchronous Moyasar server-to-server webhook events (`payment_paid`, `payment_failed`, `payment_refunded`).
 * Verifies `secret_token` via timing-safe comparison and re-verifies payment status directly via Moyasar REST API.
 */
export const moyasarWebhook = onRequest(
  {
    region: 'me-central1',
    secrets: [MOYASAR_SECRET_KEY, MOYASAR_WEBHOOK_SECRET],
    timeoutSeconds: 30
  },
  async (req, res) => {
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method Not Allowed' });
      return;
    }

    try {
      const db = getFirestoreDb();
      const { secretKey, webhookSecret } = await resolveServerPaymentSecrets(db);

      if (!webhookSecret || !secretKey) {
        res.status(503).json({ error: 'Webhook secrets are not configured on the server.' });
        return;
      }

      const incomingToken = String(req.body?.secret_token || req.headers['x-moyasar-secret'] || '').trim();
      if (!timingSafeCompare(incomingToken, webhookSecret)) {
        res.status(401).json({ error: 'Invalid webhook secret token' });
        return;
      }

      const gatewayPaymentId = String(req.body?.data?.id || req.body?.id || '').trim();
      if (!gatewayPaymentId) {
        res.status(400).json({ error: 'Missing payment ID in webhook payload' });
        return;
      }

      // Always re-verify against Moyasar REST API before mutating Firestore state
      const verifiedPayment = await fetchMoyasarPayment(gatewayPaymentId, secretKey);
      const synced = await syncVerifiedPaymentToFirestore(db, verifiedPayment);

      res.status(200).json({
        received: true,
        paymentId: synced.paymentId,
        status: synced.status
      });
    } catch (error: any) {
      console.error('[moyasarWebhook] Error:', error);
      res.status(500).json({ error: 'Webhook processing failed' });
    }
  }
);
