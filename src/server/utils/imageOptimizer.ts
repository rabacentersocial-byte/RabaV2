import multer from 'multer';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import type { Request, Response, NextFunction } from 'express';

// Define directories
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Multer memory storage configuration (keeps files in memory as Buffer for Sharp processing)
export const imageUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 15 * 1024 * 1024, // 15MB max file size
  },
  fileFilter: (_req, file, cb) => {
    const allowedMimes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
      'image/avif',
      'image/gif',
      'image/svg+xml'
    ];
    const ext = path.extname(file.originalname).toLowerCase();
    const isAllowedExt = ['.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif', '.svg'].includes(ext);
    if (allowedMimes.includes(file.mimetype) || (file.mimetype === 'application/octet-stream' && isAllowedExt)) {
      cb(null, true);
    } else {
      cb(new Error(`نوع الملف غير مدعوم (${file.mimetype}). الصيغ المدعومة: JPEG, PNG, WebP, AVIF, GIF, SVG`));
    }
  }
});

export interface ImageOptimizationOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: 'webp' | 'jpeg' | 'png' | 'avif';
  withoutEnlargement?: boolean;
}

export interface OptimizedImageResult {
  buffer: Buffer;
  format: string;
  mimeType: string;
  width?: number;
  height?: number;
  originalSize: number;
  optimizedSize: number;
  compressionRatio: string;
  filename: string;
  publicUrl: string;
}

/**
 * Optimize an image Buffer using Sharp:
 * - Auto-orients based on EXIF
 * - Resizes to max width 1200px (without enlargement)
 * - Converts to WebP format at 80% quality
 */
export async function optimizeImageBuffer(
  inputBuffer: Buffer,
  originalFilename = 'image.png',
  options: ImageOptimizationOptions = {}
): Promise<OptimizedImageResult> {
  const {
    maxWidth = 1200,
    maxHeight,
    quality = 80,
    format = 'webp',
    withoutEnlargement = true,
  } = options;

  const originalSize = inputBuffer.length;
  const isSvg = originalFilename.toLowerCase().endsWith('.svg') || inputBuffer.slice(0, 100).toString('utf-8').includes('<svg');

  // If SVG, preserve vector format without rasterizing
  if (isSvg) {
    const safeBase = path.basename(originalFilename).replace(/\.[^.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 40) || 'vector';
    const filename = `${Date.now()}_${safeBase}.svg`;
    const filePath = path.join(UPLOADS_DIR, filename);
    fs.writeFileSync(filePath, inputBuffer);

    return {
      buffer: inputBuffer,
      format: 'svg',
      mimeType: 'image/svg+xml',
      originalSize,
      optimizedSize: originalSize,
      compressionRatio: '0.0%',
      filename,
      publicUrl: `/uploads/${filename}`
    };
  }

  // Process raster image with Sharp
  let sharpInstance = sharp(inputBuffer).rotate(); // auto-orient based on EXIF

  sharpInstance = sharpInstance.resize({
    width: maxWidth,
    height: maxHeight,
    fit: sharp.fit.inside,
    withoutEnlargement
  });

  let optimizedBuffer: Buffer;
  let mimeType = 'image/webp';

  switch (format) {
    case 'webp':
      sharpInstance = sharpInstance.webp({ quality, effort: 4 });
      mimeType = 'image/webp';
      break;
    case 'avif':
      sharpInstance = sharpInstance.avif({ quality, effort: 4 });
      mimeType = 'image/avif';
      break;
    case 'jpeg':
      sharpInstance = sharpInstance.jpeg({ quality, progressive: true });
      mimeType = 'image/jpeg';
      break;
    case 'png':
      sharpInstance = sharpInstance.png({ compressionLevel: 8 });
      mimeType = 'image/png';
      break;
    default:
      sharpInstance = sharpInstance.webp({ quality });
      mimeType = 'image/webp';
  }

  optimizedBuffer = await sharpInstance.toBuffer();
  const metadata = await sharp(optimizedBuffer).metadata();

  const safeBase = path.basename(originalFilename).replace(/\.[^.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 40) || 'image';
  const finalFilename = `${Date.now()}_${safeBase}.${format}`;
  const filePath = path.join(UPLOADS_DIR, finalFilename);

  // Write optimized image to public uploads directory
  fs.writeFileSync(filePath, optimizedBuffer);

  const optimizedSize = optimizedBuffer.length;
  const ratio = originalSize > 0 
    ? (((originalSize - optimizedSize) / originalSize) * 100).toFixed(1) + '%'
    : '0%';

  return {
    buffer: optimizedBuffer,
    format,
    mimeType,
    width: metadata.width,
    height: metadata.height,
    originalSize,
    optimizedSize,
    compressionRatio: ratio,
    filename: finalFilename,
    publicUrl: `/uploads/${finalFilename}`
  };
}

/**
 * Express Middleware to handle image upload and automated Sharp optimization
 */
export async function optimizeUploadedImageMiddleware(
  req: Request & { optimizedImage?: OptimizedImageResult },
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'لم يتم استلام أي ملف صورة' });
    }

    const result = await optimizeImageBuffer(req.file.buffer, req.file.originalname, {
      maxWidth: 1200,
      quality: 80,
      format: 'webp',
      withoutEnlargement: true
    });

    req.optimizedImage = result;
    next();
  } catch (err: any) {
    console.error('[ImageOptimizer Middleware Error]:', err);
    return res.status(500).json({
      success: false,
      error: 'فشل معالجة وضغط الصورة عبر محرك Sharp',
      details: err?.message || err
    });
  }
}
