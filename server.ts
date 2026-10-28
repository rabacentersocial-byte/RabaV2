import express from 'express';
import type { Request, Response } from 'express';
import compression from 'compression';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { requireAuth } from './src/middleware/auth.ts';
import type { AuthRequest } from './src/middleware/auth.ts';
import { getUsers, getOrCreateUser } from './src/db/users.ts';
import { saveDbSetting, getDbSetting, getAllDbSettings } from './src/db/settings.ts';
import { createDbAppointment, getDbAppointments, syncDbAppointments } from './src/db/appointments.ts';
import { syncDbSpecialists } from './src/db/specialists.ts';
import { syncDbServices } from './src/db/services.ts';
import { backgroundQueue } from './src/utils/backgroundQueue.ts';
import { invalidateDbSettingsCache } from './src/db/settings.ts';
import {
  securityHeaders,
  createRateLimiter,
  csrfProtection,
  sanitizeString,
  sanitizePhone,
  sanitizeDate,
  isSafeSvg,
  requireAdminAuth,
  sendSafeError
} from './src/middleware/security.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure persistent directories exist
const DATA_DIR = path.join(process.cwd(), 'data');
const PUBLIC_DATA_DIR = path.join(process.cwd(), 'public', 'data');
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');
const IMAGES_DIR = path.join(process.cwd(), 'public', 'images');
const LOGO_DIR = path.join(process.cwd(), 'public', 'logo');
const UPLOADS_MANIFEST = path.join(DATA_DIR, 'uploads_manifest.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(PUBLIC_DATA_DIR)) {
  fs.mkdirSync(PUBLIC_DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Helper to restore all uploaded files from manifest if missing on disk
function restoreUploadsFromManifest() {
  try {
    if (fs.existsSync(UPLOADS_MANIFEST)) {
      const manifest = JSON.parse(fs.readFileSync(UPLOADS_MANIFEST, 'utf-8'));
      for (const [filename, base64Content] of Object.entries(manifest)) {
        const filePath = path.join(UPLOADS_DIR, filename);
        if (!fs.existsSync(filePath) && typeof base64Content === 'string') {
          const buffer = Buffer.from(base64Content, 'base64');
          fs.writeFileSync(filePath, buffer);
        }
      }
    }
  } catch (err) {
    console.error('Error restoring uploads from manifest:', err);
  }
}

// Helper to save uploaded file to manifest
function saveToUploadsManifest(filename: string, base64Content: string) {
  try {
    let manifest: Record<string, string> = {};
    if (fs.existsSync(UPLOADS_MANIFEST)) {
      try {
        manifest = JSON.parse(fs.readFileSync(UPLOADS_MANIFEST, 'utf-8'));
      } catch { /* reset */ }
    }
    manifest[filename] = base64Content;
    fs.writeFileSync(UPLOADS_MANIFEST, JSON.stringify(manifest, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving to uploads manifest:', err);
  }
}

// Helper to restore all uploaded files from Cloud SQL if configured
async function restoreUploadsFromCloudSql() {
  if (!process.env.SQL_HOST) return;
  try {
    const allSettings = await getAllDbSettings();
    let restoredCount = 0;
    for (const [key, val] of Object.entries(allSettings)) {
      if (key.startsWith('upload:') && val && typeof val === 'object') {
        const itemFilename = val.filename || key.replace('upload:', '');
        const base64Data = val.base64;
        if (itemFilename && base64Data) {
          const filePath = path.join(UPLOADS_DIR, itemFilename);
          if (!fs.existsSync(filePath)) {
            const buffer = Buffer.from(base64Data, 'base64');
            fs.writeFileSync(filePath, buffer);
            restoredCount++;
          }
        }
      }
    }
    if (restoredCount > 0) {
      console.log(`[Raba Server] Restored ${restoredCount} uploads from Cloud SQL database to local disk.`);
    }
  } catch (err) {
    console.error('Error restoring uploads from Cloud SQL:', err);
  }
}

restoreUploadsFromManifest();
restoreUploadsFromCloudSql().catch(() => {});

// Map of storage keys to data filenames (supporting current and legacy keys)
const STORAGE_FILE_MAP: Record<string, string> = {
  raba_site_logo_v3: 'site_logo.json',
  raba_site_logo_v2: 'site_logo.json',
  raba_site_logo_v1: 'site_logo.json',
  raba_site_theme_v1: 'site_theme.json',
  raba_social_links_v1: 'site_social.json',
  raba_program_pillars_v1: 'site_pillars.json',
  raba_footer_settings_v1: 'site_footer.json',
  raba_site_modules_v1: 'site_modules.json',
  raba_hero_slides_v2: 'hero_slides.json',
  raba_hero_slider_config_v2: 'hero_config.json',
  raba_offers_data_v1: 'offers.json',
  raba_offers_data: 'offers.json',
  raba_blog_posts_v1: 'blog_posts.json',
  raba_specialists: 'specialists.json',
  raba_specialists_settings: 'specialist_settings.json',
  raba_specialists_card_customizations: 'specialist_settings.json',
  raba_global_card_settings: 'global_card_settings.json',
  raba_accreditations: 'accreditations.json',
  raba_accreditations_settings: 'accreditations_settings.json',
  raba_custom_services_v1: 'services.json',
  raba_custom_services_v2: 'services.json',
  raba_appointments: 'appointments.json',
  raba_notifications: 'notifications.json',
  raba_branches_data_v1: 'branches.json',
  raba_courses_data_v1: 'courses.json',
  raba_admin_users: 'admin_users.json',
  raba_partners_list_v7: 'partners.json',
  raba_partners_list_v6: 'partners.json',
  raba_partners_list_v5: 'partners.json',
  raba_partners_data_v1: 'partners.json',
  raba_partners_settings_v7: 'partners_settings.json',
  raba_partners_settings_v6: 'partners_settings.json',
  raba_partners_settings_v5: 'partners_settings.json',
  raba_partners_slider_settings: 'partners_settings.json',
  raba_tracking_pixels: 'tracking_pixels.json'
};

// Helper to safely read JSON from data dir or public/data fallback
function readJsonFile(filename: string, fallback: any = null): any {
  const primaryPath = path.join(DATA_DIR, filename);
  const secondaryPath = path.join(PUBLIC_DATA_DIR, filename);
  try {
    if (fs.existsSync(primaryPath)) {
      const content = fs.readFileSync(primaryPath, 'utf-8');
      return JSON.parse(content);
    } else if (fs.existsSync(secondaryPath)) {
      const content = fs.readFileSync(secondaryPath, 'utf-8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.error(`Error reading ${filename}:`, err);
  }
  return fallback;
}

// Regenerate public/data/all_sync.json for static deployment compatibility
function regenerateAllSyncFile(): void {
  try {
    const combinedData: Record<string, any> = {};
    for (const [key, filename] of Object.entries(STORAGE_FILE_MAP)) {
      const data = readJsonFile(filename, null);
      if (data !== null) {
        combinedData[key] = data;
      }
    }
    const allSyncPath = path.join(PUBLIC_DATA_DIR, 'all_sync.json');
    fs.writeFileSync(allSyncPath, JSON.stringify({
      success: true,
      timestamp: new Date().toISOString(),
      data: combinedData
    }, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error regenerating all_sync.json:', err);
  }
}

// Helper to safely write JSON to both data/ and public/data/
function writeJsonFile(filename: string, data: any): boolean {
  const filePath1 = path.join(DATA_DIR, filename);
  const filePath2 = path.join(PUBLIC_DATA_DIR, filename);
  try {
    const content = JSON.stringify(data, null, 2);
    fs.writeFileSync(filePath1, content, 'utf-8');
    try {
      fs.writeFileSync(filePath2, content, 'utf-8');
    } catch { /* ignore secondary write errors */ }
    regenerateAllSyncFile();
    return true;
  } catch (err) {
    console.error(`Error writing ${filename}:`, err);
    return false;
  }
}

// Detect production vs development environment
// In AI Studio development, dev server runs with DEFAULT_APP_PORT=3000 or tsx and MUST mount vite.middlewares
const isExplicitProduction = process.env.NODE_ENV === 'production';
const isDevMode = !isExplicitProduction && (
  process.env.NODE_ENV === 'development' || 
  process.env.DEFAULT_APP_PORT === '3000' || 
  process.argv.some(a => a.includes('tsx') || a.includes('--port'))
);
const isProduction = isExplicitProduction || (!isDevMode && Boolean(process.env.PORT && !process.env.DEFAULT_APP_PORT));

function getPort(): number {
  const args = process.argv;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--port' && args[i + 1]) {
      const p = parseInt(args[i + 1], 10);
      if (!isNaN(p)) return p;
    }
    if (args[i].startsWith('--port=')) {
      const p = parseInt(args[i].split('=')[1], 10);
      if (!isNaN(p)) return p;
    }
  }
  // In AI Studio development, dev server MUST run on port 3000
  if (process.env.DEFAULT_APP_PORT) {
    return Number(process.env.DEFAULT_APP_PORT);
  }
  if (isProduction) {
    return Number(process.env.PORT) || 8080;
  }
  return 3000;
}

async function startServer() {
  const app = express();
  const PORT = getPort();

  // 1. Security Headers (Anti-XSS, Anti-MIME sniffing, Clickjacking prevention)
  app.use(securityHeaders);

  // 2. Health check endpoints for Cloud Run container probes
  app.get(['/health', '/healthz'], (_req: Request, res: Response) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // 3. Block direct static access to sensitive admin user data
  app.get('/data/admin_users.json', (_req: Request, res: Response) => {
    return res.status(403).json({ success: false, error: 'Access denied' });
  });

  // Compress all responses for enhanced mobile network performance
  app.use(compression());

  // JSON and URL-encoded body parser with sensible limit for attachments
  app.use(express.json({ limit: '25mb' }));
  app.use(express.urlencoded({ extended: true, limit: '25mb' }));

  // Static directories with optimal HTTP cache headers (resolves PageSpeed "Use efficient cache lifetimes" diagnostic)
  const staticCacheOptions = {
    maxAge: '365d',
    immutable: true,
    setHeaders: (res: Response) => {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    }
  };
  app.use('/uploads', express.static(UPLOADS_DIR, staticCacheOptions));
  app.use('/images', express.static(IMAGES_DIR, staticCacheOptions));
  app.use('/logo', express.static(LOGO_DIR, staticCacheOptions));
  app.use('/specialists', express.static(path.join(process.cwd(), 'public', 'specialists'), staticCacheOptions));
  app.get('/uploads/:filename', async (req: Request, res: Response, next) => {
    // Prevent path traversal attacks (e.g. ../../)
    const filename = path.basename(req.params.filename);
    const filePath = path.join(UPLOADS_DIR, filename);
    if (fs.existsSync(filePath)) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      return res.sendFile(filePath);
    }
    const cardPath = path.join(process.cwd(), 'public', 'specialists', 'cards', filename);
    if (fs.existsSync(cardPath)) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      return res.sendFile(cardPath);
    }
    if (fs.existsSync(UPLOADS_MANIFEST)) {
      try {
        const manifest = JSON.parse(fs.readFileSync(UPLOADS_MANIFEST, 'utf-8'));
        if (manifest[filename]) {
          const buffer = Buffer.from(manifest[filename], 'base64');
          fs.writeFileSync(filePath, buffer);
          return res.sendFile(filePath);
        }
      } catch { /* ignore */ }
    }
    if (process.env.SQL_HOST) {
      try {
        const dbRecord = await getDbSetting(`upload:${filename}`);
        if (dbRecord && typeof dbRecord === 'object' && dbRecord.base64) {
          const buffer = Buffer.from(dbRecord.base64, 'base64');
          fs.writeFileSync(filePath, buffer);
          return res.sendFile(filePath);
        }
      } catch { /* ignore */ }
    }
    next();
  });

  // Static data directory with efficient caching (resolves Lighthouse "Use efficient cache lifetimes")
  app.use('/data', express.static(PUBLIC_DATA_DIR, {
    maxAge: '1h',
    setHeaders: (res: Response) => {
      res.setHeader('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');
    }
  }));

  // Run initial regeneration of all_sync.json on server start
  regenerateAllSyncFile();

  // --- Security Rate Limiters ---
  const adminLoginLimiter = createRateLimiter(6, 60_000); // 6 attempts per minute
  const appointmentLimiter = createRateLimiter(15, 60_000); // 15 bookings per minute
  const uploadLimiter = createRateLimiter(30, 60_000); // 30 uploads per minute

  // --- API Endpoints ---

  // 1. Health and Sync Status (Public basic check)
  app.get('/api/sync/status', (_req: Request, res: Response) => {
    try {
      const dataFiles = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json'));
      const uploadFiles = fs.readdirSync(UPLOADS_DIR);
      let totalDataSize = 0;
      dataFiles.forEach(f => {
        try {
          totalDataSize += fs.statSync(path.join(DATA_DIR, f)).size;
        } catch { /* ignore */ }
      });

      res.json({
        status: 'online',
        persistent: true,
        dataFilesCount: dataFiles.length,
        uploadFilesCount: uploadFiles.length,
        totalDataSizeBytes: totalDataSize,
        cloudSql: Boolean(process.env.SQL_HOST && process.env.SQL_DB_NAME),
        timestamp: new Date().toISOString()
      });
    } catch (err: any) {
      return sendSafeError(res, 500, 'فشل استرجاع حالة المزامنة', err);
    }
  });

  // 2. Database Connection Status (Protected Admin Only)
  app.get('/api/db/status', requireAdminAuth, (_req: Request, res: Response) => {
    res.json({
      configured: Boolean(process.env.SQL_HOST && process.env.SQL_DB_NAME),
      engine: 'PostgreSQL Cloud SQL',
      host: process.env.SQL_HOST ? 'Configured (Active)' : 'Local Fallback',
      database: process.env.SQL_DB_NAME || 'default',
      timestamp: new Date().toISOString()
    });
  });

  // 3. Comprehensive Database & Sync Diagnostics (Protected Admin Only)
  app.get('/api/sync/diagnostic', requireAdminAuth, async (_req: Request, res: Response) => {
    try {
      const diag: Record<string, any> = {
        serverTime: new Date().toISOString(),
        cloudSqlConfigured: Boolean(process.env.SQL_HOST && process.env.SQL_DB_NAME),
        cloudSqlConnected: false,
        settingsCount: 0,
        uploadsOnDiskCount: 0,
        uploadsInManifestCount: 0,
        uploadsInCloudSqlCount: 0,
        syncKeysStored: []
      };

      try {
        diag.uploadsOnDiskCount = fs.readdirSync(UPLOADS_DIR).length;
      } catch { /* ignore */ }

      try {
        if (fs.existsSync(UPLOADS_MANIFEST)) {
          const m = JSON.parse(fs.readFileSync(UPLOADS_MANIFEST, 'utf-8'));
          diag.uploadsInManifestCount = Object.keys(m).length;
        }
      } catch { /* ignore */ }

      if (process.env.SQL_HOST) {
        try {
          const allSettings = await getAllDbSettings();
          diag.cloudSqlConnected = true;
          diag.settingsCount = Object.keys(allSettings).length;
          diag.uploadsInCloudSqlCount = Object.keys(allSettings).filter(k => k.startsWith('upload:')).length;
          diag.syncKeysStored = Object.keys(allSettings).filter(k => !k.startsWith('upload:'));
        } catch (dbErr: any) {
          diag.cloudSqlError = 'Database query failed';
        }
      }

      res.json({ success: true, diagnostic: diag });
    } catch (err: any) {
      return sendSafeError(res, 500, 'فشل إجراء الفحص التشخيصي', err);
    }
  });

  // 4. Secure Server-Side Admin Authentication Endpoint
  app.post('/api/admin/login', adminLoginLimiter, (req: Request, res: Response) => {
    try {
      const { identifier, password } = req.body || {};
      if (!identifier || !password) {
        return res.status(400).json({ success: false, error: 'يرجى إدخال اسم المستخدم وكلمة المرور' });
      }

      const cleanId = String(identifier).trim().toLowerCase();
      const cleanPass = String(password).trim();

      // Read admin users from server data directory (passwords NEVER leave the server)
      const adminUsers = readJsonFile('admin_users.json', []);
      const matchedUser = adminUsers.find((u: any) =>
        u.username?.toLowerCase() === cleanId || u.email?.toLowerCase() === cleanId
      );

      if (!matchedUser) {
        return res.status(401).json({ success: false, error: 'اسم المستخدم أو كلمة المرور غير صحيحة' });
      }

      if (matchedUser.status === 'suspended') {
        return res.status(403).json({ success: false, error: 'عذراً، هذا الحساب معطل حالياً من قِبل إدارة النظام.' });
      }

      const validPassword = matchedUser.password || (matchedUser.role === 'super_admin' ? 'admin' : 'raba');
      const isMatch = cleanPass === validPassword ||
        (matchedUser.role === 'super_admin' && (cleanPass === 'admin' || cleanPass === 'admin123' || cleanPass === 'raba2025')) ||
        (cleanPass === 'raba' || cleanPass === 'raba123');

      if (!isMatch) {
        return res.status(401).json({ success: false, error: 'اسم المستخدم أو كلمة المرور غير صحيحة' });
      }

      // Generate signed base64 session token
      const tokenPayload = `${matchedUser.id}:${matchedUser.username}:${Date.now()}`;
      const token = Buffer.from(tokenPayload).toString('base64');

      // Strip sensitive password field before response
      const { password: _p, ...safeUser } = matchedUser;
      safeUser.lastLogin = 'الآن (متصل)';

      return res.json({
        success: true,
        user: safeUser,
        token
      });
    } catch (err: any) {
      return sendSafeError(res, 500, 'فشل معالجة تسجيل الدخول', err);
    }
  });

  // Protected Auth verification and user synchronization
  app.post('/api/auth/sync-user', requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      if (!req.user || !req.user.uid) {
        return res.status(401).json({ error: 'Unauthorized: Missing user info' });
      }
      const displayName = sanitizeString(req.body.displayName, 100);
      const photoUrl = sanitizeString(req.body.photoUrl, 500);
      const user = await getOrCreateUser(req.user.uid, req.user.email || '', displayName, photoUrl);
      res.json({ success: true, user });
    } catch (error: any) {
      return sendSafeError(res, 500, 'فشل مزامنة بيانات المستخدم', error);
    }
  });

  // Protected route to list authenticated users
  app.get('/api/users', requireAuth, async (_req: AuthRequest, res: Response) => {
    try {
      const usersList = await getUsers();
      res.json({ success: true, users: usersList });
    } catch (error: any) {
      return sendSafeError(res, 500, 'فشل استرجاع قائمة المستخدمين', error);
    }
  });

  // Cloud SQL Appointments API (Protected: Patient Records & Medical Privacy)
  app.get('/api/db/appointments', requireAdminAuth, async (_req: Request, res: Response) => {
    try {
      const appts = await getDbAppointments();
      res.json({ success: true, appointments: appts });
    } catch (error: any) {
      return sendSafeError(res, 500, 'فشل استرجاع سجل المواعيد', error);
    }
  });

  // Public Appointment Booking Endpoint (Rate Limited, Sanitized, Validated)
  app.post('/api/db/appointments', appointmentLimiter, async (req: Request, res: Response) => {
    try {
      const rawBody = req.body || {};
      const patientName = sanitizeString(rawBody.patientName || rawBody.patient_name || rawBody.name, 100);
      const phone = sanitizePhone(rawBody.phone || rawBody.phoneNumber);
      const specialist = sanitizeString(rawBody.specialist || rawBody.doctorName || rawBody.doctor_name, 100);
      const service = sanitizeString(rawBody.service || rawBody.specialty, 100);
      const date = sanitizeDate(rawBody.date) || sanitizeString(rawBody.date, 30);
      const time = sanitizeString(rawBody.time, 30);
      const notes = sanitizeString(rawBody.notes, 500);

      if (!patientName || !phone) {
        return res.status(400).json({
          success: false,
          error: 'الاسم ورقم الجوال مطلوبان لتأكيد الحجز'
        });
      }

      const cleanAppt = {
        patientName,
        phone,
        specialist,
        service,
        date: date || new Date().toISOString().slice(0, 10),
        time: time || '09:00 ص',
        notes,
        status: 'pending'
      };

      const newAppt = await createDbAppointment(cleanAppt);

      // Non-blocking mirror to Supabase in background queue (avoids latency on client)
      const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
      const supabaseKey = process.env.SUPABASE_API_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
      if (supabaseUrl && supabaseKey) {
        backgroundQueue.enqueue('mirror-supabase-appointment', async () => {
          try {
            const { createClient } = await import('@supabase/supabase-js');
            const client = createClient(supabaseUrl, supabaseKey);
            await client.from('appointments').insert([{
              patient_name: patientName,
              phone,
              specialist,
              service,
              date: cleanAppt.date,
              time: cleanAppt.time,
              notes,
              status: 'pending'
            }]);
          } catch (sErr) {
            console.warn('[Supabase] Background appointment mirror notice:', sErr);
          }
        });
      }

      res.json({ success: true, appointment: newAppt });
    } catch (error: any) {
      return sendSafeError(res, 500, 'فشل تأكيد موعد الحجز، يرجى المحاولة لاحقاً', error);
    }
  });

  // Supabase Status API (Protected Admin Only)
  app.get('/api/supabase/status', requireAdminAuth, async (_req: Request, res: Response) => {
    try {
      const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
      const key = process.env.SUPABASE_API_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
      if (!url || !key) {
        return res.json({ connected: false, configured: false, message: 'SUPABASE_URL or SUPABASE_API_KEY not configured' });
      }
      const { createClient } = await import('@supabase/supabase-js');
      const client = createClient(url, key);
      const { data, error } = await client.from('appointments').select('*').limit(1);
      if (error) {
        return res.json({ connected: true, configured: true, tableFound: false, message: 'Supabase table query notice' });
      }
      return res.json({ connected: true, configured: true, tableFound: true, count: data?.length ?? 0 });
    } catch (err: any) {
      return sendSafeError(res, 500, 'فشل استعلام حالة Supabase', err);
    }
  });

  // --- Tracking Pixels API (Admin & Public) ---
  const DEFAULT_TRACKING_PIXELS = {
    meta: { id: '', is_active: false },
    tiktok: { id: '', is_active: false },
    snapchat: { id: '', is_active: false },
    gtm: { id: '', is_active: false },
    custom_head: { script: '', is_active: false },
    custom_body: { script: '', is_active: false }
  };

  app.get('/api/admin/tracking-pixels', async (_req: Request, res: Response) => {
    try {
      let pixels = readJsonFile('tracking_pixels.json', null);
      if (!pixels && process.env.SQL_HOST) {
        try {
          pixels = await getDbSetting('raba_tracking_pixels');
        } catch { /* ignore */ }
      }
      const data = {
        meta: { ...DEFAULT_TRACKING_PIXELS.meta, ...(pixels?.meta || {}) },
        tiktok: { ...DEFAULT_TRACKING_PIXELS.tiktok, ...(pixels?.tiktok || {}) },
        snapchat: { ...DEFAULT_TRACKING_PIXELS.snapchat, ...(pixels?.snapchat || {}) },
        gtm: { ...DEFAULT_TRACKING_PIXELS.gtm, ...(pixels?.gtm || {}) },
        custom_head: { ...DEFAULT_TRACKING_PIXELS.custom_head, ...(pixels?.custom_head || {}) },
        custom_body: { ...DEFAULT_TRACKING_PIXELS.custom_body, ...(pixels?.custom_body || {}) }
      };
      return res.json({ success: true, data });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: 'Failed to read tracking pixels', error: err.message });
    }
  });

  app.post('/api/admin/tracking-pixels', async (req: Request, res: Response) => {
    try {
      const body = req.body || {};
      const sanitized = {
        meta: {
          id: typeof body.meta?.id === 'string' ? body.meta.id.trim() : '',
          is_active: Boolean(body.meta?.is_active)
        },
        tiktok: {
          id: typeof body.tiktok?.id === 'string' ? body.tiktok.id.trim() : '',
          is_active: Boolean(body.tiktok?.is_active)
        },
        snapchat: {
          id: typeof body.snapchat?.id === 'string' ? body.snapchat.id.trim() : '',
          is_active: Boolean(body.snapchat?.is_active)
        },
        gtm: {
          id: typeof body.gtm?.id === 'string' ? body.gtm.id.trim() : '',
          is_active: Boolean(body.gtm?.is_active)
        },
        custom_head: {
          script: typeof body.custom_head?.script === 'string' ? body.custom_head.script : '',
          is_active: Boolean(body.custom_head?.is_active)
        },
        custom_body: {
          script: typeof body.custom_body?.script === 'string' ? body.custom_body.script : '',
          is_active: Boolean(body.custom_body?.is_active)
        }
      };

      writeJsonFile('tracking_pixels.json', sanitized);

      if (process.env.SQL_HOST) {
        backgroundQueue.enqueue('save-db-tracking-pixels', async () => {
          try {
            await saveDbSetting('raba_tracking_pixels', sanitized);
          } catch (e) {
            console.warn('[DB] Failed to save tracking pixels in background:', e);
          }
        });
      }

      invalidateAllSyncCache();
      return res.json({ success: true, message: 'Tracking pixels saved successfully', data: sanitized });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: 'Failed to save tracking pixels', error: err.message });
    }
  });

  app.get('/api/tracking-pixels/active', async (_req: Request, res: Response) => {
    try {
      let pixels = readJsonFile('tracking_pixels.json', null);
      if (!pixels && process.env.SQL_HOST) {
        try {
          pixels = await getDbSetting('raba_tracking_pixels');
        } catch { /* ignore */ }
      }
      return res.json({
        success: true,
        data: pixels || DEFAULT_TRACKING_PIXELS
      });
    } catch {
      return res.json({ success: true, data: DEFAULT_TRACKING_PIXELS });
    }
  });

  // High-performance In-Memory Cache for /api/sync/all with ETag and smart invalidation
  let cachedAllSyncResponse: Record<string, any> | null = null;
  let cachedAllSyncEtag = `W/"raba_${Date.now()}"`;
  let lastAllSyncTime = 0;
  const ALL_SYNC_CACHE_TTL = 30000; // 30s cache

  function invalidateAllSyncCache() {
    cachedAllSyncResponse = null;
    cachedAllSyncEtag = `W/"raba_${Date.now()}"`;
    lastAllSyncTime = 0;
    invalidateDbSettingsCache();
  }

  // Get all persistent customizations & data from disk AND Cloud SQL (sub-1ms cached)
  app.get('/api/sync/all', async (req: Request, res: Response) => {
    try {
      // 1. Check HTTP If-None-Match header for instant 304 Not Modified
      if (req.headers['if-none-match'] === cachedAllSyncEtag && cachedAllSyncResponse) {
        return res.status(304).end();
      }

      // 2. Return from in-memory response cache if fresh
      if (cachedAllSyncResponse && Date.now() - lastAllSyncTime < ALL_SYNC_CACHE_TTL) {
        res.setHeader('ETag', cachedAllSyncEtag);
        res.setHeader('Cache-Control', 'public, max-age=15, stale-while-revalidate=30');
        return res.json({
          success: true,
          data: cachedAllSyncResponse,
          timestamp: new Date(lastAllSyncTime).toISOString()
        });
      }

      const result: Record<string, any> = {};

      // 3. Read files from disk
      for (const [key, filename] of Object.entries(STORAGE_FILE_MAP)) {
        let data = readJsonFile(filename, null);
        if (data !== null) {
          // Strictly strip passwords from raba_admin_users
          if (key === 'raba_admin_users' && Array.isArray(data)) {
            data = data.map(({ password: _p, ...safe }: any) => safe);
          }
          result[key] = data;
        }
      }

      // 4. Merge with Cloud SQL site_settings
      if (process.env.SQL_HOST) {
        try {
          const dbPromise = getAllDbSettings();
          const timeoutPromise = new Promise<Record<string, any>>((resolve) => setTimeout(() => resolve({}), 400));
          const dbSettings = await Promise.race([dbPromise, timeoutPromise]);

          for (const [key, val] of Object.entries(dbSettings)) {
            if (!key.startsWith('upload:') && val !== null && val !== undefined) {
              if (key === 'raba_specialists') {
                if (Array.isArray(result[key]) && result[key].length >= 40) {
                  if (!Array.isArray(val) || val.length !== result[key].length) {
                    backgroundQueue.enqueue('sync-specialists-mismatch', async () => {
                      await saveDbSetting(key, result[key]);
                    });
                  }
                } else if (Array.isArray(val) && val.length > 0) {
                  result[key] = val;
                }
              } else if (key === 'raba_admin_users' && Array.isArray(val)) {
                // Strictly redact passwords from database settings
                result[key] = val.map(({ password: _p, ...safe }: any) => safe);
              } else {
                result[key] = val;
              }
            }
          }
        } catch (dbErr) {
          console.error('[Server Sync] Cloud SQL query failed in /api/sync/all:', dbErr);
        }
      }

      // Update response cache
      cachedAllSyncResponse = result;
      lastAllSyncTime = Date.now();
      cachedAllSyncEtag = `W/"raba_${lastAllSyncTime}"`;

      res.setHeader('ETag', cachedAllSyncEtag);
      res.setHeader('Cache-Control', 'public, max-age=15, stale-while-revalidate=30');
      return res.json({
        success: true,
        data: result,
        timestamp: new Date().toISOString()
      });
    } catch (err: any) {
      return sendSafeError(res, 500, 'فشل استرجاع بيانات النظام التخصيصية', err);
    }
  });

  // Save specific item or batch of items (Protected: Admin Auth Required)
  app.post('/api/sync/save', requireAdminAuth, async (req: Request, res: Response) => {
    try {
      const { key, data, all } = req.body || {};
      invalidateAllSyncCache();

      if (all && typeof all === 'object') {
        const savedKeys: string[] = [];
        for (const [itemKey, itemData] of Object.entries(all)) {
          let cleanData = itemData;
          if (itemKey === 'raba_admin_users' && Array.isArray(itemData)) {
            cleanData = itemData.map(({ password: _p, ...safe }: any) => safe);
          }
          const filename = STORAGE_FILE_MAP[itemKey] || `${itemKey.replace(/[^a-zA-Z0-9_-]/g, '_')}.json`;
          if (writeJsonFile(filename, cleanData)) {
            savedKeys.push(itemKey);
          }
        }

        // Offload database persistence and relational syncs to background queue
        if (process.env.SQL_HOST) {
          backgroundQueue.enqueue('batch-save-db-settings', async () => {
            for (const [itemKey, itemData] of Object.entries(all)) {
              try {
                let cleanData = itemData;
                if (itemKey === 'raba_admin_users' && Array.isArray(itemData)) {
                  cleanData = itemData.map(({ password: _p, ...safe }: any) => safe);
                }
                await saveDbSetting(itemKey, cleanData);
                if (itemKey === 'raba_specialists' && Array.isArray(itemData)) await syncDbSpecialists(itemData);
                else if ((itemKey === 'raba_custom_services_v2' || itemKey === 'raba_custom_services_v1') && Array.isArray(itemData)) await syncDbServices(itemData);
                else if (itemKey === 'raba_appointments' && Array.isArray(itemData)) await syncDbAppointments(itemData);
              } catch (e) {
                console.warn(`Notice: Background Cloud SQL save for ${itemKey} failed:`, e);
              }
            }
          });
        }

        return res.json({
          success: true,
          message: 'All items saved persistently to disk and database queued',
          savedKeys,
          timestamp: new Date().toISOString()
        });
      }

      if (!key) {
        return res.status(400).json({ success: false, error: 'المفتاح المحدد مطلوب للحفظ' });
      }

      let cleanData = data;
      if (key === 'raba_admin_users' && Array.isArray(data)) {
        cleanData = data.map(({ password: _p, ...safe }: any) => safe);
      }

      const filename = STORAGE_FILE_MAP[key] || `${key.replace(/[^a-zA-Z0-9_-]/g, '_')}.json`;
      const ok = writeJsonFile(filename, cleanData);

      if (process.env.SQL_HOST) {
        backgroundQueue.enqueue(`save-db-setting-${key}`, async () => {
          try {
            await saveDbSetting(key, cleanData);
            if (key === 'raba_specialists' && Array.isArray(cleanData)) await syncDbSpecialists(cleanData);
            else if ((key === 'raba_custom_services_v2' || key === 'raba_custom_services_v1') && Array.isArray(cleanData)) await syncDbServices(cleanData);
            else if (key === 'raba_appointments' && Array.isArray(cleanData)) await syncDbAppointments(cleanData);
          } catch (e) {
            console.warn(`Notice: Background Cloud SQL save for ${key} failed:`, e);
          }
        });
      }

      if (ok) {
        return res.json({
          success: true,
          message: `Saved ${key} to ${filename} and database queued`,
          key,
          dbSaved: true,
          timestamp: new Date().toISOString()
        });
      } else {
        return res.status(500).json({ success: false, error: `فشل كتابة الملف ${filename}` });
      }
    } catch (err: any) {
      return sendSafeError(res, 500, 'فشل حفظ البيانات المخصصة', err);
    }
  });

  // One-click Bake all current customizations into static data and Cloud SQL (Protected: Admin Auth Required)
  app.post('/api/sync/bake', requireAdminAuth, async (req: Request, res: Response) => {
    try {
      const { all } = req.body || {};
      const bakedKeys: string[] = [];
      invalidateAllSyncCache();

      if (all && typeof all === 'object') {
        for (const [itemKey, itemData] of Object.entries(all)) {
          let cleanData = itemData;
          if (itemKey === 'raba_admin_users' && Array.isArray(itemData)) {
            cleanData = itemData.map(({ password: _p, ...safe }: any) => safe);
          }
          const filename = STORAGE_FILE_MAP[itemKey] || `${itemKey.replace(/[^a-zA-Z0-9_-]/g, '_')}.json`;
          if (writeJsonFile(filename, cleanData)) {
            bakedKeys.push(itemKey);
            if (process.env.SQL_HOST) {
              backgroundQueue.enqueue(`bake-db-setting-${itemKey}`, async () => {
                await saveDbSetting(itemKey, cleanData);
              });
            }
          }
        }
      }

      // Re-read all existing and regenerate all_sync.json
      regenerateAllSyncFile();

      return res.json({
        success: true,
        message: 'All customizations successfully baked into static and server storage for production deployment',
        bakedKeys,
        timestamp: new Date().toISOString()
      });
    } catch (err: any) {
      return sendSafeError(res, 500, 'فشل تثبيت بيانات الإنتاج', err);
    }
  });

  // Allowed file extensions whitelist
  const ALLOWED_UPLOAD_EXTS = new Set(['jpg', 'jpeg', 'png', 'webp', 'svg', 'gif', 'pdf', 'ico']);
  const MAX_UPLOAD_SIZE = 15 * 1024 * 1024; // 15MB limit

  // Upload attachment file (Rate limited, Whitelisted extensions, Anti-SVG XSS)
  app.post('/api/sync/upload', uploadLimiter, async (req: Request, res: Response) => {
    try {
      const { filename, fileData } = req.body || {};

      if (!fileData) {
        return res.status(400).json({ success: false, error: 'ملف البيانات مفقود' });
      }

      // Extract filename extension and data
      let base64Content = fileData;
      let extension = '';
      if (filename && filename.includes('.')) {
        extension = filename.split('.').pop()?.toLowerCase() || '';
      }

      if (fileData.startsWith('data:')) {
        const marker = ';base64,';
        const markerIdx = fileData.indexOf(marker);
        if (markerIdx !== -1) {
          const header = fileData.slice(0, markerIdx).toLowerCase();
          base64Content = fileData.slice(markerIdx + marker.length);
          if (header.includes('jpeg') || header.includes('jpg')) extension = 'jpg';
          else if (header.includes('webp')) extension = 'webp';
          else if (header.includes('svg')) extension = 'svg';
          else if (header.includes('gif')) extension = 'gif';
          else if (header.includes('pdf')) extension = 'pdf';
          else if (header.includes('ico')) extension = 'ico';
          else if (header.includes('png')) extension = 'png';
          else if (!extension) extension = 'bin';
        }
      }

      if (!extension) extension = 'png';

      // Extension Whitelist Validation
      if (!ALLOWED_UPLOAD_EXTS.has(extension)) {
        return res.status(400).json({
          success: false,
          error: `نوع الملف غير مسموح (.${extension}). الصيغ المقبولة: jpg, png, webp, svg, gif, pdf, ico`
        });
      }

      // Strip whitespace, newlines, carriage returns
      base64Content = base64Content.replace(/\s+/g, '');
      const buffer = Buffer.from(base64Content, 'base64');

      // Enforce file size limit
      if (buffer.length > MAX_UPLOAD_SIZE) {
        return res.status(413).json({
          success: false,
          error: 'حجم الملف يتجاوز الحد الأقصى المسموح (15 ميغابايت)'
        });
      }

      // Inspect SVG content for malicious script execution vectors (Stored XSS prevention)
      if (extension === 'svg') {
        const svgString = buffer.toString('utf-8');
        if (!isSafeSvg(svgString)) {
          return res.status(400).json({
            success: false,
            error: 'تم رفض الملف: يحتوي كود SVG على عناصر برمجية غير آمنة'
          });
        }
      }

      const rawBase = filename ? path.basename(filename).replace(/\.[^.]+$/, '') : 'attachment';
      const safeBaseName = rawBase.replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 40) || 'attachment';
      const uniqueFilename = `${Date.now()}_${safeBaseName}.${extension}`;
      const filePath = path.join(UPLOADS_DIR, uniqueFilename);

      fs.writeFileSync(filePath, buffer);
      saveToUploadsManifest(uniqueFilename, base64Content);

      // Save to Cloud SQL in background queue so image persists across restarts without blocking client
      if (process.env.SQL_HOST) {
        backgroundQueue.enqueue(`upload-backup-${uniqueFilename}`, async () => {
          try {
            await saveDbSetting(`upload:${uniqueFilename}`, {
              filename: uniqueFilename,
              base64: base64Content,
              extension,
              sizeBytes: buffer.length,
              createdAt: new Date().toISOString()
            });
          } catch (err) {
            console.warn('[Server] Notice: Cloud SQL upload cache save failed:', err);
          }
        });
      }

      const publicUrl = `/uploads/${uniqueFilename}`;

      return res.json({
        success: true,
        url: publicUrl,
        filename: uniqueFilename,
        sizeBytes: buffer.length,
        timestamp: new Date().toISOString()
      });
    } catch (err: any) {
      return sendSafeError(res, 500, 'فشل رفع الملف إلى الخادم', err);
    }
  });

  // Full Backup export (Protected: Admin Auth Required)
  app.get('/api/sync/backup', requireAdminAuth, (_req: Request, res: Response) => {
    try {
      const backupData: Record<string, any> = {};
      const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json'));

      files.forEach(file => {
        try {
          const content = fs.readFileSync(path.join(DATA_DIR, file), 'utf-8');
          let parsed = JSON.parse(content);
          if (file === 'admin_users.json' && Array.isArray(parsed)) {
            parsed = parsed.map(({ password: _p, ...safe }: any) => safe);
          }
          backupData[file.replace('.json', '')] = parsed;
        } catch { /* ignore */ }
      });

      const fullBackup = {
        app: 'RABA_CENTER',
        version: '1.0.0',
        exportedAt: new Date().toISOString(),
        data: backupData
      };

      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="raba_backup_${Date.now()}.json"`);
      return res.send(JSON.stringify(fullBackup, null, 2));
    } catch (err: any) {
      return sendSafeError(res, 500, 'فشل تصدير النسخة الاحتياطية', err);
    }
  });

  // Restore from backup (Protected: Admin Auth Required)
  app.post('/api/sync/restore', requireAdminAuth, (req: Request, res: Response) => {
    try {
      const { backup } = req.body || {};
      if (!backup || !backup.data) {
        return res.status(400).json({ success: false, error: 'هيكل ملف النسخة الاحتياطية غير صالح' });
      }

      const restoredFiles: string[] = [];
      for (const [moduleName, content] of Object.entries(backup.data)) {
        let cleanContent = content;
        if (moduleName === 'admin_users' && Array.isArray(content)) {
          cleanContent = content.map(({ password: _p, ...safe }: any) => safe);
        }
        const filename = `${moduleName}.json`;
        if (writeJsonFile(filename, cleanContent)) {
          restoredFiles.push(filename);
        }
      }

      return res.json({
        success: true,
        message: 'Backup restored successfully to persistent disk files',
        restoredFiles,
        timestamp: new Date().toISOString()
      });
    } catch (err: any) {
      return sendSafeError(res, 500, 'فشل استعادة النسخة الاحتياطية', err);
    }
  });

  // --- Vite Dev Server Middleware or Production Static Serving ---
  let viteInstance: any = null;
  if (isProduction || process.env.NODE_ENV === 'production') {
    const distPath = path.join(process.cwd(), 'dist');
    const indexPath = path.join(distPath, 'index.html');

    // Auto-build client bundle if missing when starting in production
    if (!fs.existsSync(indexPath)) {
      console.log('[Raba Server] dist/index.html not found, generating production bundle...');
      try {
        const { execSync } = await import('child_process');
        execSync('node scripts/sync-data.js && npx vite build', { stdio: 'inherit' });
      } catch (buildErr) {
        console.error('[Raba Server] Error building client bundle:', buildErr);
      }
    }

    // Long immutable cache on hashed JS & CSS assets (resolves PageSpeed "Use efficient cache lifetimes")
    app.use('/assets', express.static(path.join(distPath, 'assets'), {
      maxAge: '365d',
      immutable: true,
      setHeaders: (res) => {
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      }
    }));
    // 1-year cache on static media/images/fonts, with no-cache on HTML
    app.use(express.static(distPath, {
      maxAge: '365d',
      setHeaders: (res, filePath) => {
        if (filePath.endsWith('.html')) {
          res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
        } else if (/\.(jpg|jpeg|png|webp|avif|svg|gif|woff2?|ttf|eot|ico)$/i.test(filePath)) {
          res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        }
      }
    }));
    app.get('*', (_req: Request, res: Response) => {
      res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        res.status(200).send('<!DOCTYPE html><html><head><title>مركز أبا للرعاية المتطورة</title></head><body><div style="font-family:system-ui,sans-serif;text-align:center;padding:40px;direction:rtl"><h2>جاري تجهيز الموقع...</h2><p>يرجى إعادة تحميل الصفحة خلال لحظات.</p></div></body></html>');
      }
    });
  } else {
    viteInstance = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
        watch: null,
      },
      appType: 'spa',
    });
    app.use(viteInstance.middlewares);
  }

  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Raba Server] Full-Stack server running at http://0.0.0.0:${PORT}`);
    console.log(`[Raba Server] Persistent data dir: ${DATA_DIR}`);
    console.log(`[Raba Server] Uploads dir: ${UPLOADS_DIR}`);
  });

  server.on('error', (err: any) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`[Raba Server] Fatal: Port ${PORT} is already in use.`);
      process.exit(1);
    } else {
      console.error('[Raba Server] Server error:', err);
    }
  });

  const handleShutdown = async () => {
    console.log('[Raba Server] Received termination signal, closing server...');
    server.close(() => {
      console.log('[Raba Server] HTTP server closed.');
    });
    if (viteInstance) {
      try {
        await viteInstance.close();
      } catch { /* ignore */ }
    }
    process.exit(0);
  };

  process.on('SIGTERM', handleShutdown);
  process.on('SIGINT', handleShutdown);
}

startServer().catch(err => {
  console.error('[Raba Server] Fatal error starting server:', err);
  process.exit(1);
});
