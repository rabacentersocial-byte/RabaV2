import { uploadAttachmentToServer } from './persistentSync';
import { savePersistentImage } from './persistentImageStore';

/**
 * Utility to automatically remove solid or fake-transparency checkerboard backgrounds from images.
 * Uses an HTML5 Canvas to inspect corner pixels, detect background patterns (white, off-white,
 * or grey/white checkerboard grids), flood-fill from boundaries, and export as a clean transparent PNG.
 */
export async function removeBackgroundFromImage(
  fileOrDataUrl: File | string,
  tolerance: number = 32
): Promise<string> {
  const originalFileName = typeof fileOrDataUrl !== 'string' ? fileOrDataUrl.name : 'logo_transparent.png';

  const transparentPngDataUrl = await new Promise<string>((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      const width = img.naturalWidth || img.width;
      const height = img.naturalHeight || img.height;

      const canvas = document.createElement('canvas');
      canvas.width = Math.max(width, 1);
      canvas.height = Math.max(height, 1);

      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) {
        resolve(typeof fileOrDataUrl === 'string' ? fileOrDataUrl : '');
        return;
      }

      ctx.drawImage(img, 0, 0);

      const imgData = ctx.getImageData(0, 0, width, height);
      const data = imgData.data;

      // Helper: check if a pixel is neutral background (white, light grey, or checkerboard square)
      function isBackgroundPixel(r: number, g: number, b: number, a: number): boolean {
        if (a < 20) return true; // Already transparent

        // Pure white or near-white
        if (r > 240 && g > 240 && b > 240) return true;

        // Light grey checkerboard tiles (typically around 190-245 with low saturation)
        const maxVal = Math.max(r, g, b);
        const minVal = Math.min(r, g, b);
        const diff = maxVal - minVal;

        // Neutral grayscale checkerboard square (diff is very small)
        if (diff <= 14 && minVal >= 180) {
          return true;
        }

        return false;
      }

      // BFS Flood-fill from borders to only remove background and never touch interior content
      const visited = new Uint8Array(width * height);
      const queue: number[] = [];

      // Push all boundary pixels that match background criteria
      for (let x = 0; x < width; x++) {
        // Top edge
        const topIdx = (0 * width + x) * 4;
        if (isBackgroundPixel(data[topIdx], data[topIdx + 1], data[topIdx + 2], data[topIdx + 3])) {
          visited[0 * width + x] = 1;
          queue.push(x, 0);
        }
        // Bottom edge
        const btmIdx = ((height - 1) * width + x) * 4;
        if (isBackgroundPixel(data[btmIdx], data[btmIdx + 1], data[btmIdx + 2], data[btmIdx + 3])) {
          visited[(height - 1) * width + x] = 1;
          queue.push(x, height - 1);
        }
      }

      for (let y = 1; y < height - 1; y++) {
        // Left edge
        const leftIdx = (y * width + 0) * 4;
        if (isBackgroundPixel(data[leftIdx], data[leftIdx + 1], data[leftIdx + 2], data[leftIdx + 3])) {
          visited[y * width + 0] = 1;
          queue.push(0, y);
        }
        // Right edge
        const rightIdx = (y * width + (width - 1)) * 4;
        if (isBackgroundPixel(data[rightIdx], data[rightIdx + 1], data[rightIdx + 2], data[rightIdx + 3])) {
          visited[y * width + (width - 1)] = 1;
          queue.push(width - 1, y);
        }
      }

      let head = 0;
      while (head < queue.length) {
        const x = queue[head++];
        const y = queue[head++];
        const pIndex = (y * width + x) * 4;

        // Clear alpha
        data[pIndex + 3] = 0;

        // Check 4-directional neighbors
        const neighbors = [
          [x + 1, y],
          [x - 1, y],
          [x, y + 1],
          [x, y - 1]
        ];

        for (let i = 0; i < neighbors.length; i++) {
          const nx = neighbors[i][0];
          const ny = neighbors[i][1];

          if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
            const nCoord = ny * width + nx;
            if (!visited[nCoord]) {
              visited[nCoord] = 1;
              const nIdx = nCoord * 4;
              if (isBackgroundPixel(data[nIdx], data[nIdx + 1], data[nIdx + 2], data[nIdx + 3])) {
                queue.push(nx, ny);
              }
            }
          }
        }
      }

      // Put transparent pixels back to canvas
      ctx.putImageData(imgData, 0, 0);

      // Export as high quality transparent PNG
      const pngData = canvas.toDataURL('image/png');
      resolve(pngData);
    };

    img.onerror = () => {
      if (typeof fileOrDataUrl === 'string') {
        resolve(fileOrDataUrl);
      } else {
        reject(new Error('Failed to load image for background removal'));
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

  // 1. Cache immediately in IndexedDB
  savePersistentImage(originalFileName, transparentPngDataUrl).catch(() => {});

  // 2. Automatically save as permanent static file on server
  try {
    const uploadRes = await uploadAttachmentToServer(transparentPngDataUrl, originalFileName.replace(/\.[^/.]+$/, '') + '_transparent.png');
    if (uploadRes.success && uploadRes.url) {
      savePersistentImage(uploadRes.url, transparentPngDataUrl).catch(() => {});
      return uploadRes.url;
    }
  } catch (err) {
    console.warn('[BackgroundRemover] Server persistence fallback:', err);
  }

  return transparentPngDataUrl;
}
