import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { requireAuth, AuthRequest } from './src/middleware/auth.ts';
import { getUsers, getOrCreateUser } from './src/db/users.ts';
import { saveDbSetting, getDbSetting, getAllDbSettings } from './src/db/settings.ts';
import { createDbAppointment, getDbAppointments, syncDbAppointments } from './src/db/appointments.ts';
import { syncDbSpecialists } from './src/db/specialists.ts';
import { syncDbServices } from './src/db/services.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure persistent directories exist
const DATA_DIR = path.join(process.cwd(), 'data');
const PUBLIC_DATA_DIR = path.join(process.cwd(), 'public', 'data');
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');
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
  raba_admin_users: 'admin_users.json'
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

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON and URL-encoded body parser with generous limit for attachments
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // Static uploads directory with auto-restoration from manifest
  app.use('/uploads', express.static(UPLOADS_DIR));
  app.get('/uploads/:filename', async (req: Request, res: Response, next) => {
    const filename = req.params.filename;
    const filePath = path.join(UPLOADS_DIR, filename);
    if (fs.existsSync(filePath)) {
      return res.sendFile(filePath);
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

  // Static data directory (enables fallback fetching of /data/all_sync.json on any server or static host)
  app.use('/data', express.static(PUBLIC_DATA_DIR));

  // Run initial regeneration of all_sync.json on server start
  regenerateAllSyncFile();

  // --- API Endpoints ---

  // Health and Sync Status
  app.get('/api/sync/status', (req: Request, res: Response) => {
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
      res.status(500).json({ error: err.message });
    }
  });

  // Database Connection Status
  app.get('/api/db/status', (req: Request, res: Response) => {
    res.json({
      configured: Boolean(process.env.SQL_HOST && process.env.SQL_DB_NAME),
      engine: 'PostgreSQL Cloud SQL',
      host: process.env.SQL_HOST || 'local',
      database: process.env.SQL_DB_NAME || 'default',
      timestamp: new Date().toISOString()
    });
  });

  // Comprehensive Database & Sync Diagnostics
  app.get('/api/sync/diagnostic', async (req: Request, res: Response) => {
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
          diag.cloudSqlError = dbErr.message;
        }
      }

      res.json({ success: true, diagnostic: diag });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Protected Auth verification and user synchronization
  app.post('/api/auth/sync-user', requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      if (!req.user || !req.user.uid) {
        return res.status(401).json({ error: 'Unauthorized: Missing user info' });
      }
      const { displayName, photoUrl } = req.body;
      const user = await getOrCreateUser(req.user.uid, req.user.email || '', displayName, photoUrl);
      res.json({ success: true, user });
    } catch (error: any) {
      console.error('Failed to sync user to database:', error);
      res.status(500).json({ error: error.message || 'Failed to sync user' });
    }
  });

  // Protected route to list authenticated users
  app.get('/api/users', requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const usersList = await getUsers();
      res.json({ success: true, users: usersList });
    } catch (error: any) {
      console.error('Failed to fetch users:', error);
      res.status(500).json({ error: error.message || 'Failed to fetch users' });
    }
  });

  // Cloud SQL Appointments API
  app.get('/api/db/appointments', async (req: Request, res: Response) => {
    try {
      const appts = await getDbAppointments();
      res.json({ success: true, appointments: appts });
    } catch (error: any) {
      console.error('Failed to fetch appointments:', error);
      res.status(500).json({ error: error.message || 'Failed to fetch appointments' });
    }
  });

  app.post('/api/db/appointments', async (req: Request, res: Response) => {
    try {
      const newAppt = await createDbAppointment(req.body);
      res.json({ success: true, appointment: newAppt });
    } catch (error: any) {
      console.error('Failed to create appointment:', error);
      res.status(500).json({ error: error.message || 'Failed to create appointment' });
    }
  });

  // Get all persistent customizations & data from disk AND Cloud SQL
  app.get('/api/sync/all', async (req: Request, res: Response) => {
    try {
      const result: Record<string, any> = {};

      // 1. Read files from disk
      for (const [key, filename] of Object.entries(STORAGE_FILE_MAP)) {
        const data = readJsonFile(filename, null);
        if (data !== null) {
          result[key] = data;
        }
      }

      // 2. Merge with Cloud SQL site_settings
      if (process.env.SQL_HOST) {
        try {
          const dbSettings = await getAllDbSettings();
          for (const [key, val] of Object.entries(dbSettings)) {
            if (!key.startsWith('upload:') && val !== null && val !== undefined) {
              result[key] = val;
              // Mirror to local disk file so disk stays 100% up to date
              const filename = STORAGE_FILE_MAP[key] || `${key.replace(/[^a-zA-Z0-9_-]/g, '_')}.json`;
              const filePath1 = path.join(DATA_DIR, filename);
              try {
                fs.writeFileSync(filePath1, JSON.stringify(val, null, 2), 'utf-8');
              } catch { /* ignore */ }
            }
          }
        } catch (dbErr) {
          console.error('[Server Sync] Cloud SQL query failed in /api/sync/all:', dbErr);
        }
      }

      res.json({
        success: true,
        data: result,
        timestamp: new Date().toISOString()
      });
    } catch (err: any) {
      console.error('Error fetching all persistent data:', err);
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Save specific item or batch of items to persistent disk files AND Cloud SQL
  app.post('/api/sync/save', async (req: Request, res: Response) => {
    try {
      const { key, data, all } = req.body;

      if (all && typeof all === 'object') {
        const savedKeys: string[] = [];
        for (const [itemKey, itemData] of Object.entries(all)) {
          const filename = STORAGE_FILE_MAP[itemKey] || `${itemKey.replace(/[^a-zA-Z0-9_-]/g, '_')}.json`;
          if (writeJsonFile(filename, itemData)) {
            savedKeys.push(itemKey);
            if (process.env.SQL_HOST) {
              try {
                await saveDbSetting(itemKey, itemData);
                if (itemKey === 'raba_specialists' && Array.isArray(itemData)) await syncDbSpecialists(itemData);
                else if ((itemKey === 'raba_custom_services_v2' || itemKey === 'raba_custom_services_v1') && Array.isArray(itemData)) await syncDbServices(itemData);
                else if (itemKey === 'raba_appointments' && Array.isArray(itemData)) await syncDbAppointments(itemData);
              } catch (e) {
                console.warn(`Notice: Cloud SQL save for ${itemKey} failed:`, e);
              }
            }
          }
        }
        return res.json({
          success: true,
          message: 'All items saved persistently to disk and database',
          savedKeys,
          timestamp: new Date().toISOString()
        });
      }

      if (!key) {
        return res.status(400).json({ success: false, error: 'Missing key parameter' });
      }

      const filename = STORAGE_FILE_MAP[key] || `${key.replace(/[^a-zA-Z0-9_-]/g, '_')}.json`;
      const ok = writeJsonFile(filename, data);
      
      let dbSaved = false;
      if (process.env.SQL_HOST) {
        try {
          dbSaved = await saveDbSetting(key, data);
          if (key === 'raba_specialists' && Array.isArray(data)) await syncDbSpecialists(data);
          else if ((key === 'raba_custom_services_v2' || key === 'raba_custom_services_v1') && Array.isArray(data)) await syncDbServices(data);
          else if (key === 'raba_appointments' && Array.isArray(data)) await syncDbAppointments(data);
        } catch (e) {
          console.warn(`Notice: Cloud SQL save for ${key} failed:`, e);
        }
      }

      if (ok || dbSaved) {
        return res.json({
          success: true,
          message: `Saved ${key} to ${filename} and database`,
          key,
          dbSaved,
          timestamp: new Date().toISOString()
        });
      } else {
        return res.status(500).json({ success: false, error: `Failed to write ${filename}` });
      }
    } catch (err: any) {
      console.error('Error saving persistent data:', err);
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  // One-click Bake all current customizations into static data and Cloud SQL
  app.post('/api/sync/bake', async (req: Request, res: Response) => {
    try {
      const { all } = req.body;
      const bakedKeys: string[] = [];

      if (all && typeof all === 'object') {
        for (const [itemKey, itemData] of Object.entries(all)) {
          const filename = STORAGE_FILE_MAP[itemKey] || `${itemKey.replace(/[^a-zA-Z0-9_-]/g, '_')}.json`;
          if (writeJsonFile(filename, itemData)) {
            bakedKeys.push(itemKey);
            if (process.env.SQL_HOST) {
              saveDbSetting(itemKey, itemData).catch(() => {});
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
      console.error('Error baking persistent data:', err);
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  // Upload attachment file (base64 or dataUrl) with bulletproof decoding & Cloud SQL backup
  app.post('/api/sync/upload', async (req: Request, res: Response) => {
    try {
      const { filename, fileData, mimeType } = req.body;

      if (!fileData) {
        return res.status(400).json({ success: false, error: 'Missing fileData' });
      }

      // Extract base64 payload safely without regex failure on query/charset params
      let base64Content = fileData;
      let extension = 'png';

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
        }
      } else if (filename && filename.includes('.')) {
        const ext = filename.split('.').pop()?.toLowerCase();
        if (ext) extension = ext;
      }

      // Strip all whitespace, newlines, carriage returns
      base64Content = base64Content.replace(/\s+/g, '');

      const safeBaseName = filename 
        ? filename.replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 40) 
        : 'attachment';
      const uniqueFilename = `${Date.now()}_${safeBaseName}.${extension}`;
      const filePath = path.join(UPLOADS_DIR, uniqueFilename);

      const buffer = Buffer.from(base64Content, 'base64');
      fs.writeFileSync(filePath, buffer);
      saveToUploadsManifest(uniqueFilename, base64Content);

      // Save to Cloud SQL so image persists across ephemeral container restarts
      if (process.env.SQL_HOST) {
        saveDbSetting(`upload:${uniqueFilename}`, {
          filename: uniqueFilename,
          base64: base64Content,
          extension,
          sizeBytes: buffer.length,
          createdAt: new Date().toISOString()
        }).catch((err) => {
          console.warn('[Server] Notice: Cloud SQL upload cache save failed:', err);
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
      console.error('Error handling upload:', err);
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  // Full Backup export
  app.get('/api/sync/backup', (req: Request, res: Response) => {
    try {
      const backupData: Record<string, any> = {};
      const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json'));

      files.forEach(file => {
        try {
          const content = fs.readFileSync(path.join(DATA_DIR, file), 'utf-8');
          backupData[file.replace('.json', '')] = JSON.parse(content);
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
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  // Restore from backup
  app.post('/api/sync/restore', (req: Request, res: Response) => {
    try {
      const { backup } = req.body;
      if (!backup || !backup.data) {
        return res.status(400).json({ success: false, error: 'Invalid backup format' });
      }

      const restoredFiles: string[] = [];
      for (const [moduleName, content] of Object.entries(backup.data)) {
        const filename = `${moduleName}.json`;
        if (writeJsonFile(filename, content)) {
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
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  // --- Vite Dev Server Middleware or Production Static Serving ---
  if (process.env.NODE_ENV === 'production') {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Raba Server] Full-Stack server running at http://0.0.0.0:${PORT}`);
    console.log(`[Raba Server] Persistent data dir: ${DATA_DIR}`);
    console.log(`[Raba Server] Uploads dir: ${UPLOADS_DIR}`);
  });
}

startServer().catch(err => {
  console.error('[Raba Server] Fatal error starting server:', err);
  process.exit(1);
});
