import fs from 'fs';
import path from 'path';
import { 
  DEFAULT_LOGO_SETTINGS, 
  DEFAULT_THEME_SETTINGS, 
  DEFAULT_SOCIAL_SETTINGS, 
  DEFAULT_PROGRAM_PILLARS, 
  DEFAULT_FOOTER_SETTINGS, 
  DEFAULT_MODULES_VISIBILITY 
} from '../src/data/siteCustomizer';
import { DEFAULT_HERO_SLIDES, DEFAULT_HERO_SLIDER_CONFIG } from '../src/data/sliderCustomizer';
import { INITIAL_OFFERS } from '../src/data/offersData';
import { BLOG_POSTS } from '../src/data/blogData';
import { SPECIALISTS, SERVICES } from '../src/data/mockData';
import { DEFAULT_SPECIALIST_SETTINGS, DEFAULT_GLOBAL_CARD_SETTINGS } from '../src/data/specialistCustomizer';
import { ACCREDITATIONS_LIST, DEFAULT_ACCREDITATIONS_SETTINGS } from '../src/data/accreditationsData';
import { INITIAL_ADMIN_USERS } from '../src/data/adminData';

const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const filesToWrite: Record<string, any> = {
  'site_logo.json': DEFAULT_LOGO_SETTINGS,
  'site_theme.json': DEFAULT_THEME_SETTINGS,
  'site_social.json': DEFAULT_SOCIAL_SETTINGS,
  'site_pillars.json': DEFAULT_PROGRAM_PILLARS,
  'site_footer.json': DEFAULT_FOOTER_SETTINGS,
  'site_modules.json': DEFAULT_MODULES_VISIBILITY,
  'hero_slides.json': DEFAULT_HERO_SLIDES,
  'hero_config.json': DEFAULT_HERO_SLIDER_CONFIG,
  'offers.json': INITIAL_OFFERS,
  'blog_posts.json': BLOG_POSTS,
  'specialists.json': SPECIALISTS,
  'specialist_settings.json': DEFAULT_SPECIALIST_SETTINGS,
  'accreditations.json': ACCREDITATIONS_LIST,
  'accreditations_settings.json': DEFAULT_ACCREDITATIONS_SETTINGS,
  'services.json': SERVICES,
  'admin_users.json': INITIAL_ADMIN_USERS
};

for (const [filename, content] of Object.entries(filesToWrite)) {
  const targetPath = path.join(dataDir, filename);
  // Only write if doesn't exist yet so we don't overwrite any existing custom data
  if (!fs.existsSync(targetPath)) {
    fs.writeFileSync(targetPath, JSON.stringify(content, null, 2), 'utf-8');
    console.log(`Created persistent file: data/${filename}`);
  } else {
    console.log(`Persistent file exists: data/${filename}`);
  }
}

console.log('Seeding completed successfully!');
