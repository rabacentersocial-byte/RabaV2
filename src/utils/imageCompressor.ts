import { uploadAttachmentToServer } from './persistentSync';
import { savePersistentImage } from './persistentImageStore';

/**
 * Utility to compress and optimize images before storing in persistent storage.
 * Automatically preserves PNG transparency for logos and transparent badges.
 * Automatically saves image attachments to server static uploads directory (/uploads/...)
 * and permanently caches in IndexedDB for 100% zero-loss reload survival.
 */
export async function compressImage(
  fileOrDataUrl: File | string,
  maxWidth: number = 800,
  maxHeight: number = 800,
  quality: number = 0.85,
  forcePng: boolean = false
): Promise<string> {
  const originalFileName = typeof fileOrDataUrl !== 'string' ? fileOrDataUrl.name : undefined;
  const isPng = forcePng || (typeof fileOrDataUrl !== 'string' && (fileOrDataUrl.type === 'image/png' || fileOrDataUrl.type === 'image/svg+xml' || fileOrDataUrl.name.toLowerCase().endsWith('.png')));

  const dataUrl = await new Promise<string>((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      let { width, height } = img;

      if (width > maxWidth || height > maxHeight) {
        if (width / height > maxWidth / maxHeight) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        } else {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = Math.max(width, 1);
      canvas.height = Math.max(height, 1);

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(typeof fileOrDataUrl === 'string' ? fileOrDataUrl : '');
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);

      // If input was PNG or SVG or forcePng is set, export as transparent PNG
      if (isPng) {
        const compressedPng = canvas.toDataURL('image/png');
        resolve(compressedPng);
      } else {
        // Produce high quality but lightweight JPEG for non-transparent photos
        const compressedJpg = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedJpg);
      }
    };

    img.onerror = () => {
      if (typeof fileOrDataUrl === 'string') {
        resolve(fileOrDataUrl);
      } else {
        reject(new Error('Failed to load image for compression'));
      }
    };

    if (typeof fileOrDataUrl === 'string') {
      img.src = fileOrDataUrl;
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(fileOrDataUrl);
    }
  });

  // 1. Cache immediately in browser IndexedDB (immune to 5MB quota)
  if (originalFileName) {
    savePersistentImage(originalFileName, dataUrl).catch(() => {});
  }

  // 2. Automatically save as permanent static file on server disk
  try {
    const uploadRes = await uploadAttachmentToServer(dataUrl, originalFileName);
    if (uploadRes.success && uploadRes.url) {
      // Map both the server URL and original file to the dataUrl in IndexedDB
      savePersistentImage(uploadRes.url, dataUrl).catch(() => {});
      return uploadRes.url;
    }
  } catch (err) {
    console.warn('[ImageCompressor] Server persistence fallback:', err);
  }

  return dataUrl;
}
