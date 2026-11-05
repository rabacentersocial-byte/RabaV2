import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

/**
 * Automated Asset Optimization Pipeline
 * Scans public asset directories and creates optimized WebP/AVIF equivalents
 * to minimize image payload sizes and ensure sub-second LCP.
 */

const TARGET_DIRS = [
  path.join(process.cwd(), 'public', 'images'),
  path.join(process.cwd(), 'public', 'images', 'hero'),
  path.join(process.cwd(), 'public', 'images', 'courses'),
  path.join(process.cwd(), 'public', 'specialists'),
  path.join(process.cwd(), 'public', 'logo')
];

async function optimizeDirectory(dir) {
  if (!fs.existsSync(dir)) return;

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      await optimizeDirectory(fullPath);
      continue;
    }

    const ext = path.extname(entry.name).toLowerCase();
    if (!['.jpg', '.jpeg', '.png'].includes(ext)) continue;

    const baseName = path.basename(entry.name, ext);
    const webpPath = path.join(dir, `${baseName}.webp`);

    try {
      const originalStat = fs.statSync(fullPath);

      // If WebP does not exist or original is newer
      if (!fs.existsSync(webpPath) || originalStat.mtime > fs.statSync(webpPath).mtime) {
        await sharp(fullPath)
          .webp({ quality: 80, effort: 6 })
          .toFile(webpPath);

        const newStat = fs.statSync(webpPath);
        const savedPercent = Math.round(((originalStat.size - newStat.size) / originalStat.size) * 100);
        console.log(`[Asset Pipeline] Optimized: ${entry.name} -> ${baseName}.webp (${Math.round(originalStat.size / 1024)}KB -> ${Math.round(newStat.size / 1024)}KB, saved ${savedPercent}%)`);
      }
    } catch (err) {
      console.warn(`[Asset Pipeline] Skipping ${entry.name}:`, err.message);
    }
  }
}

async function main() {
  console.log('[Asset Pipeline] Starting automated next-gen image conversion...');
  for (const dir of TARGET_DIRS) {
    await optimizeDirectory(dir);
  }
  console.log('[Asset Pipeline] Image asset optimization check complete.');
}

main().catch(console.error);
