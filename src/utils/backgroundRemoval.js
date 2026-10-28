/**
 * AURA Client-Side Background Removal & Alpha Matting Utility
 * 
 * Performs fast, local, client-side background removal using HTML5 Canvas.
 * No data is uploaded to external servers or third-party cloud APIs.
 * Preserves fine details (chair legs, armrests, edges) and supports local IndexedDB caching.
 */

import { getCachedCutout, saveCachedCutout } from './storage';

/**
 * Remove background from an image source (URL, Blob, or File)
 * 
 * @param {string|File|Blob} imageSource Image URL or File object
 * @param {Object} options Configuration options
 * @param {string} options.cacheKey Optional key to check/store in IndexedDB
 * @param {number} options.threshold Color tolerance (0-100, default 28)
 * @param {number} options.feather Edge softness feathering radius (default 12)
 * @param {boolean} options.bypassCache Force re-processing even if cached
 * @param {Function} options.onProgress Progress callback (percent: number, statusText: string)
 * @returns {Promise<{ success: boolean, dataUrl?: string, error?: string, message?: string }>}
 */
export async function removeBackground(imageSource, options = {}) {
  const {
    cacheKey = typeof imageSource === 'string' ? imageSource : null,
    threshold = 28,
    feather = 14,
    bypassCache = false,
    onProgress = () => {},
  } = options;

  // 1. Check IndexedDB cache first
  if (cacheKey && !bypassCache) {
    onProgress(10, 'Checking local cutout cache...');
    try {
      const cached = await getCachedCutout(cacheKey);
      if (cached) {
        onProgress(100, 'Loaded from local cache');
        return { success: true, dataUrl: cached, cached: true };
      }
    } catch {
      // cache miss or error, proceed with processing
    }
  }

  onProgress(20, 'Loading source photograph...');

  return new Promise((resolve) => {
    let objectUrl = null;
    let srcUrl;

    if (typeof imageSource === 'string') {
      srcUrl = imageSource;
    } else if (imageSource instanceof Blob || imageSource instanceof File) {
      objectUrl = URL.createObjectURL(imageSource);
      srcUrl = objectUrl;
    } else {
      return resolve({
        success: false,
        error: 'INVALID_SOURCE',
        message: 'Unsupported image source provided for background removal.',
      });
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = async () => {
      onProgress(40, 'Analyzing image dimensions & color palette...');
      try {
        const naturalW = img.naturalWidth || img.width;
        const naturalH = img.naturalHeight || img.height;

        // Cap dimensions for snappy interactive client-side execution while keeping fine detail
        const maxDim = 1200;
        let targetW = naturalW;
        let targetH = naturalH;
        if (targetW > maxDim || targetH > maxDim) {
          const ratio = Math.min(maxDim / targetW, maxDim / targetH);
          targetW = Math.round(targetW * ratio);
          targetH = Math.round(targetH * ratio);
        }

        const canvas = document.createElement('canvas');
        canvas.width = targetW;
        canvas.height = targetH;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });

        if (!ctx) {
          if (objectUrl) URL.revokeObjectURL(objectUrl);
          return resolve({
            success: false,
            error: 'CANVAS_UNAVAILABLE',
            message: 'Unable to initialize 2D canvas context in this browser.',
          });
        }

        ctx.drawImage(img, 0, 0, targetW, targetH);

        onProgress(60, 'Sampling background boundary colors...');

        let imgData;
        try {
          imgData = ctx.getImageData(0, 0, targetW, targetH);
        } catch (secErr) {
          if (objectUrl) URL.revokeObjectURL(objectUrl);
          return resolve({
            success: false,
            error: 'CORS_RESTRICTED',
            message:
              'External image host restricts browser canvas pixel analysis (CORS). You can use our pre-isolated cutout or upload a transparent PNG cutout directly.',
            originalError: secErr.message,
          });
        }

        const data = imgData.data;
        const totalPixels = targetW * targetH;

        // Sample boundary pixels (4 corners and along outer edges) to determine background color
        const bgSamples = [];
        const sampleStepX = Math.max(1, Math.floor(targetW / 40));
        const sampleStepY = Math.max(1, Math.floor(targetH / 40));

        // Top & bottom rows
        for (let x = 0; x < targetW; x += sampleStepX) {
          const topIdx = x * 4;
          const botIdx = ((targetH - 1) * targetW + x) * 4;
          bgSamples.push([data[topIdx], data[topIdx + 1], data[topIdx + 2]]);
          bgSamples.push([data[botIdx], data[botIdx + 1], data[botIdx + 2]]);
        }
        // Left & right columns
        for (let y = 0; y < targetH; y += sampleStepY) {
          const leftIdx = (y * targetW) * 4;
          const rightIdx = (y * targetW + (targetW - 1)) * 4;
          bgSamples.push([data[leftIdx], data[leftIdx + 1], data[leftIdx + 2]]);
          bgSamples.push([data[rightIdx], data[rightIdx + 1], data[rightIdx + 2]]);
        }

        // Calculate average background RGB
        let sumR = 0, sumG = 0, sumB = 0;
        for (const s of bgSamples) {
          sumR += s[0];
          sumG += s[1];
          sumB += s[2];
        }
        const bgR = sumR / bgSamples.length;
        const bgG = sumG / bgSamples.length;
        const bgB = sumB / bgSamples.length;

        onProgress(75, 'Segmenting furniture silhouette from background...');

        // Boundary-connected mask: 1 = background, 0 = foreground
        const isBg = new Uint8Array(totalPixels);
        const queue = [];

        // Color distance function
        const getColorDist = (idx) => {
          const dr = data[idx] - bgR;
          const dg = data[idx + 1] - bgG;
          const db = data[idx + 2] - bgB;
          return Math.sqrt(dr * dr + dg * dg + db * db);
        };

        // Seed flood fill with perimeter pixels that match background color
        for (let x = 0; x < targetW; x++) {
          const topIdx = x * 4;
          if (getColorDist(topIdx) <= threshold) {
            isBg[x] = 1;
            queue.push(x);
          }
          const botIdx = ((targetH - 1) * targetW + x) * 4;
          const botOffset = (targetH - 1) * targetW + x;
          if (getColorDist(botIdx) <= threshold) {
            isBg[botOffset] = 1;
            queue.push(botOffset);
          }
        }

        for (let y = 0; y < targetH; y++) {
          const leftOffset = y * targetW;
          if (!isBg[leftOffset] && getColorDist(leftOffset * 4) <= threshold) {
            isBg[leftOffset] = 1;
            queue.push(leftOffset);
          }
          const rightOffset = y * targetW + (targetW - 1);
          if (!isBg[rightOffset] && getColorDist(rightOffset * 4) <= threshold) {
            isBg[rightOffset] = 1;
            queue.push(rightOffset);
          }
        }

        // Connected Component Flood Fill from perimeter
        let head = 0;
        while (head < queue.length) {
          const curr = queue[head++];
          const cx = curr % targetW;
          const cy = Math.floor(curr / targetW);

          const neighbors = [
            cx > 0 ? curr - 1 : -1,
            cx < targetW - 1 ? curr + 1 : -1,
            cy > 0 ? curr - targetW : -1,
            cy < targetH - 1 ? curr + targetW : -1,
          ];

          for (const n of neighbors) {
            if (n >= 0 && !isBg[n]) {
              const nIdx = n * 4;
              if (getColorDist(nIdx) <= threshold) {
                isBg[n] = 1;
                queue.push(n);
              }
            }
          }
        }

        onProgress(88, 'Smoothing silhouette edges and refining alpha...');

        // Apply alpha matting with edge feathering
        const featherThreshold = threshold + feather;
        for (let i = 0; i < totalPixels; i++) {
          const pixelIdx = i * 4;
          if (isBg[i] === 1) {
            // Completely transparent background
            data[pixelIdx + 3] = 0;
          } else {
            // Check if near background edge for smooth transition
            const dist = getColorDist(pixelIdx);
            if (dist < featherThreshold && feather > 0) {
              const alphaFactor = (dist - threshold) / feather;
              data[pixelIdx + 3] = Math.round(Math.max(0, Math.min(255, alphaFactor * 255)));
            }
          }
        }

        ctx.putImageData(imgData, 0, 0);

        onProgress(95, 'Finalizing transparent cutout...');

        const resultDataUrl = canvas.toDataURL('image/png');

        // Cache result in IndexedDB
        if (cacheKey) {
          try {
            await saveCachedCutout(cacheKey, resultDataUrl);
          } catch {
            // cache saving non-blocking
          }
        }

        if (objectUrl) URL.revokeObjectURL(objectUrl);
        onProgress(100, 'Background removed successfully.');

        resolve({
          success: true,
          dataUrl: resultDataUrl,
          width: targetW,
          height: targetH,
        });
      } catch (err) {
        if (objectUrl) URL.revokeObjectURL(objectUrl);
        resolve({
          success: false,
          error: 'PROCESSING_ERROR',
          message: err.message || 'Error occurred while removing background.',
        });
      }
    };

    img.onerror = () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
      resolve({
        success: false,
        error: 'LOAD_ERROR',
        message: 'Failed to load image for background removal.',
      });
    };

    img.src = srcUrl;
  });
}

/**
 * Read an uploaded PNG or WebP file as a transparent Data URL
 */
export function readUploadedCutout(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      return reject(new Error('No file provided'));
    }

    const validTypes = ['image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      return reject(new Error('Please upload a transparent PNG or WebP image.'));
    }

    if (file.size > 10 * 1024 * 1024) {
      return reject(new Error('File exceeds 10MB limit.'));
    }

    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = () => reject(new Error('Failed to read image file.'));
    reader.readAsDataURL(file);
  });
}
