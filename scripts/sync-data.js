import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const DATA_DIR = path.join(rootDir, 'data');
const PUBLIC_DATA_DIR = path.join(rootDir, 'public', 'data');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(PUBLIC_DATA_DIR)) {
  fs.mkdirSync(PUBLIC_DATA_DIR, { recursive: true });
}

// Canonical Storage Key to File mapping (avoids duplicate payloads for legacy aliases)
const STORAGE_FILE_MAP = {
  raba_site_logo_v3: 'site_logo.json',
  raba_site_theme_v1: 'site_theme.json',
  raba_social_links_v1: 'site_social.json',
  raba_program_pillars_v1: 'site_pillars.json',
  raba_footer_settings_v1: 'site_footer.json',
  raba_site_modules_v1: 'site_modules.json',
  raba_hero_slides_v2: 'hero_slides.json',
  raba_hero_slider_config_v2: 'hero_config.json',
  raba_offers_data: 'offers.json',
  raba_blog_posts_v1: 'blog_posts.json',
  raba_specialists: 'specialists.json',
  raba_specialists_card_customizations: 'specialist_settings.json',
  raba_global_card_settings: 'global_card_settings.json',
  raba_accreditations: 'accreditations.json',
  raba_accreditations_settings: 'accreditations_settings.json',
  raba_custom_services_v2: 'services.json',
  raba_appointments: 'appointments.json',
  raba_notifications: 'notifications.json',
  raba_branches_data_v1: 'branches.json',
  raba_courses_data_v1: 'courses.json',
  raba_partners_list_v7: 'partners.json',
  raba_partners_settings_v7: 'partners_settings.json',
  raba_admin_users: 'admin_users.json'
};

// Copy all JSON files from data/ to public/data/
const dataFiles = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json'));
const combinedData = {};

for (const file of dataFiles) {
  try {
    const srcPath = path.join(DATA_DIR, file);
    const destPath = path.join(PUBLIC_DATA_DIR, file);
    const content = fs.readFileSync(srcPath, 'utf-8');
    let parsed = JSON.parse(content);

    // Security Hardening: Never leak admin passwords in public/data or bundled client sync data
    if (file === 'admin_users.json' && Array.isArray(parsed)) {
      parsed = parsed.map((user) => {
        const { password, ...safeUser } = user;
        return safeUser;
      });
      fs.writeFileSync(destPath, JSON.stringify(parsed, null, 2), 'utf-8');
    } else {
      fs.writeFileSync(destPath, content, 'utf-8');
    }

    // Parse and map to storage keys
    for (const [storageKey, mappedFile] of Object.entries(STORAGE_FILE_MAP)) {
      if (mappedFile === file) {
        combinedData[storageKey] = parsed;
      }
    }
  } catch (err) {
    console.error(`Error copying ${file} to public/data:`, err);
  }
}

// Write combined all_sync.json into public/data and src/data/
const allSyncPath = path.join(PUBLIC_DATA_DIR, 'all_sync.json');
const defaultSyncPath = path.join(rootDir, 'src', 'data', 'defaultSyncData.json');
const syncPayload = JSON.stringify({
  success: true,
  timestamp: new Date().toISOString(),
  data: combinedData
}, null, 2);

fs.writeFileSync(allSyncPath, syncPayload, 'utf-8');
try {
  fs.writeFileSync(defaultSyncPath, syncPayload, 'utf-8');
} catch (e) {
  console.warn('Could not write to src/data/defaultSyncData.json:', e);
}

console.log(`[Sync-Data] Synchronized ${dataFiles.length} files to public/data and src/data/defaultSyncData.json successfully.`);
