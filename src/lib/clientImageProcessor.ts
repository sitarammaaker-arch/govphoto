/**
 * Client-side replacement for the old `/api/resize` Vercel Function.
 *
 * Mirrors the exact behaviour of the previous server-side pipeline
 * (see git history of src/app/api/resize/route.ts) so that presets,
 * acceptability checks and output shape are unchanged for the UI:
 *   - trim signature whitespace (bounding-box trim vs white, threshold 10)
 *   - flatten transparency / force white background
 *   - resize ('fill' when both width+height given, 'inside' when only one)
 *   - binary-search quality to hit a target KB range
 *   - fall back to a scaled-down re-encode if still too big
 *   - patch DPI (density) into the output file's own metadata
 *   - sample-based white-background detection on the final output
 *
 * Nothing here talks to a server — everything runs in the browser via
 * Canvas2D. No image ever leaves the visitor's device.
 */

export interface ResizeOptions {
  targetMinKB: number;
  targetMaxKB: number;
  width?: number;
  height?: number;
  dpi?: number;
  whiteBg?: boolean;
  trimSignature?: boolean;
  outputFormat?: string; // 'jpg' | 'jpeg' | 'png' | 'webp' | 'pdf'
}

export interface AcceptabilityResult {
  sizeOK: boolean;
  formatOK: boolean;
  dimsOK: boolean;
  whiteBgOK: boolean;
  finalSizeKB: number;
  width: number;
  height: number;
  targetMinKB: number;
  targetMaxKB: number;
}

export interface ProcessResult {
  blob: Blob;
  acceptability: AcceptabilityResult;
}

const TRIM_THRESHOLD = 10;
const WHITE_DETECT_THRESHOLD = 240;

// ── Small utilities ─────────────────────────────────────────────────────

function canvasToBlob(canvas: HTMLCanvasElement, mime: string, quality?: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('canvas.toBlob returned null'))),
      mime,
      quality
    );
  });
}

async function blobToArrayBuffer(blob: Blob): Promise<ArrayBuffer> {
  return blob.arrayBuffer();
}

function makeCanvas(width: number, height: number): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = Math.max(1, Math.round(width));
  c.height = Math.max(1, Math.round(height));
  return c;
}

function getCtx(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('2D canvas context unavailable');
  return ctx;
}

// ── Decode ───────────────────────────────────────────────────────────────

async function decodeToCanvas(file: File | Blob): Promise<HTMLCanvasElement> {
  // createImageBitmap avoids the extra <img> decode round-trip and honours
  // EXIF orientation the same way the browser's native decoder does.
  const bitmap = await createImageBitmap(file);
  const canvas = makeCanvas(bitmap.width, bitmap.height);
  const ctx = getCtx(canvas);
  ctx.drawImage(bitmap, 0, 0);
  bitmap.close();
  return canvas;
}

// ── Trim (signature whitespace removal) ────────────────────────────────
// Reproduces sharp's `.trim({ background: '#ffffff', threshold })`:
// find the bounding box of all pixels that differ from the background
// by more than `threshold` on any channel, and crop to it.

function trimToBoundingBox(canvas: HTMLCanvasElement, threshold = TRIM_THRESHOLD): HTMLCanvasElement {
  const { width, height } = canvas;
  const ctx = getCtx(canvas);
  const { data } = ctx.getImageData(0, 0, width, height);

  let minX = width, minY = height, maxX = -1, maxY = -1;

  for (let y = 0; y < height; y++) {
    const rowStart = y * width * 4;
    for (let x = 0; x < width; x++) {
      const idx = rowStart + x * 4;
      const r = data[idx], g = data[idx + 1], b = data[idx + 2];
      const diff = Math.max(Math.abs(r - 255), Math.abs(g - 255), Math.abs(b - 255));
      if (diff > threshold) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  // Nothing differed from white (e.g. a blank scan) — behave like sharp
  // and leave the image untouched rather than crop to nothing.
  if (maxX < 0 || maxY < 0) return canvas;

  const cropW = maxX - minX + 1;
  const cropH = maxY - minY + 1;
  if (cropW === width && cropH === height) return canvas;

  const out = makeCanvas(cropW, cropH);
  getCtx(out).drawImage(canvas, minX, minY, cropW, cropH, 0, 0, cropW, cropH);
  return out;
}

// ── Flatten transparency onto white ─────────────────────────────────────

function flattenOnWhite(canvas: HTMLCanvasElement): HTMLCanvasElement {
  const out = makeCanvas(canvas.width, canvas.height);
  const ctx = getCtx(out);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, out.width, out.height);
  ctx.drawImage(canvas, 0, 0);
  return out;
}

function hasAlphaChannel(canvas: HTMLCanvasElement): boolean {
  const ctx = getCtx(canvas);
  const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
  for (let i = 3; i < data.length; i += 4) {
    if (data[i] !== 255) return true;
  }
  return false;
}

// ── Resize ───────────────────────────────────────────────────────────────
// width+height given  -> 'fill'   (stretch to exact size, matches sharp fit:'fill')
// only one given      -> 'inside' (scale preserving aspect to fit within the bound)
// neither given        -> no-op

function resizeCanvas(canvas: HTMLCanvasElement, width?: number, height?: number): HTMLCanvasElement {
  if (!width && !height) return canvas;

  let targetW: number;
  let targetH: number;

  if (width && height) {
    targetW = width;
    targetH = height;
  } else {
    const srcW = canvas.width;
    const srcH = canvas.height;
    const scale = width ? width / srcW : (height as number) / srcH;
    targetW = Math.round(srcW * scale);
    targetH = Math.round(srcH * scale);
  }

  if (targetW === canvas.width && targetH === canvas.height) return canvas;

  const out = makeCanvas(targetW, targetH);
  const ctx = getCtx(out);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(canvas, 0, 0, targetW, targetH);
  return out;
}

// ── DPI metadata patching ───────────────────────────────────────────────
// Canvas encoders never expose a "set density" option, so we patch the
// encoded bytes directly after the fact — same end result as sharp's
// withMetadata({ density }).

// Builds a minimal EXIF APP1 segment carrying XResolution/YResolution/
// ResolutionUnit — this is the *actual* format the old sharp-based server
// used for DPI (verified by inspecting its output: sharp's withMetadata()
// writes EXIF resolution tags, not a JFIF density field), so we replicate
// it here for real parity rather than relying on JFIF density alone.
function buildExifApp1Segment(dpi: number): Uint8Array {
  const tiff = new Uint8Array(66);
  const dv = new DataView(tiff.buffer);
  tiff[0] = 0x49; tiff[1] = 0x49; // 'II' little-endian
  dv.setUint16(2, 42, true);
  dv.setUint32(4, 8, true); // IFD0 offset

  dv.setUint16(8, 3, true); // 3 entries
  // XResolution: tag 0x011A, type 5 (RATIONAL), count 1, data offset 50
  dv.setUint16(10, 0x011a, true); dv.setUint16(12, 5, true); dv.setUint32(14, 1, true); dv.setUint32(18, 50, true);
  // YResolution: tag 0x011B, type 5 (RATIONAL), count 1, data offset 58
  dv.setUint16(22, 0x011b, true); dv.setUint16(24, 5, true); dv.setUint32(26, 1, true); dv.setUint32(30, 58, true);
  // ResolutionUnit: tag 0x0128, type 3 (SHORT), count 1, value 2 (inches), inline
  dv.setUint16(34, 0x0128, true); dv.setUint16(36, 3, true); dv.setUint32(38, 1, true); dv.setUint16(42, 2, true);
  dv.setUint32(46, 0, true); // next IFD offset = none

  dv.setUint32(50, dpi, true); dv.setUint32(54, 1, true); // XResolution = dpi/1
  dv.setUint32(58, dpi, true); dv.setUint32(62, 1, true); // YResolution = dpi/1

  const exifHeader = new Uint8Array([0x45, 0x78, 0x69, 0x66, 0x00, 0x00]); // "Exif\0\0"
  const segLen = 2 + exifHeader.length + tiff.length; // length field counts itself
  const out = new Uint8Array(2 + 2 + exifHeader.length + tiff.length);
  out[0] = 0xff; out[1] = 0xe1;
  out[2] = (segLen >> 8) & 0xff; out[3] = segLen & 0xff;
  out.set(exifHeader, 4);
  out.set(tiff, 4 + exifHeader.length);
  return out;
}

function patchJpegDensity(bytes: Uint8Array, dpi: number): Uint8Array {
  if (bytes.length < 20 || bytes[0] !== 0xff || bytes[1] !== 0xd8) return bytes; // not a JPEG

  let out = bytes;
  let insertAt = 2; // right after SOI, unless a JFIF APP0 is found (then after it)

  // Look for an existing JFIF APP0 marker right after SOI:
  //   [2]FF [3]E0  [4-5]len  [6-10]"JFIF\0"  [11-12]ver  [13]units  [14-15]Xden  [16-17]Yden
  if (
    bytes[2] === 0xff && bytes[3] === 0xe0 &&
    bytes[6] === 0x4a && bytes[7] === 0x46 && bytes[8] === 0x49 && bytes[9] === 0x46 && bytes[10] === 0x00
  ) {
    const patched = bytes.slice();
    patched[13] = 0x01; // units = dots per inch
    patched[14] = (dpi >> 8) & 0xff; patched[15] = dpi & 0xff; // Xdensity
    patched[16] = (dpi >> 8) & 0xff; patched[17] = dpi & 0xff; // Ydensity
    const app0Len = (bytes[4] << 8) | bytes[5];
    insertAt = 2 + 2 + app0Len; // marker(2) + length-field-and-payload
    out = patched;
  } else {
    // No JFIF segment present — insert a fresh minimal one right after SOI.
    const app0 = new Uint8Array([
      0xff, 0xe0, 0x00, 0x10, // APP0, length 16
      0x4a, 0x46, 0x49, 0x46, 0x00, // "JFIF\0"
      0x01, 0x02, // version 1.2
      0x01, // units = DPI
      (dpi >> 8) & 0xff, dpi & 0xff, // Xdensity
      (dpi >> 8) & 0xff, dpi & 0xff, // Ydensity
      0x00, 0x00, // no thumbnail
    ]);
    const withApp0 = new Uint8Array(bytes.length + app0.length);
    withApp0.set(bytes.slice(0, 2), 0); // SOI
    withApp0.set(app0, 2);
    withApp0.set(bytes.slice(2), 2 + app0.length);
    out = withApp0;
    insertAt = 2 + app0.length;
  }

  // Insert the EXIF APP1 block right after the (now guaranteed) APP0.
  const app1 = buildExifApp1Segment(dpi);
  const withApp1 = new Uint8Array(out.length + app1.length);
  withApp1.set(out.slice(0, insertAt), 0);
  withApp1.set(app1, insertAt);
  withApp1.set(out.slice(insertAt), insertAt + app1.length);
  return withApp1;
}

const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c >>> 0;
  }
  return table;
})();

function crc32(data: Uint8Array): number {
  let c = 0xffffffff;
  for (let i = 0; i < data.length; i++) c = CRC_TABLE[(c ^ data[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function patchPngDensity(bytes: Uint8Array, dpi: number): Uint8Array {
  const sig = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
  for (let i = 0; i < 8; i++) if (bytes[i] !== sig[i]) return bytes; // not a PNG

  // IHDR is always the first chunk, length always 13 -> total chunk size 8+13+4 = 25 bytes.
  const ihdrEnd = 8 + 25;
  if (bytes[12] !== 0x49 || bytes[13] !== 0x48 || bytes[14] !== 0x44 || bytes[15] !== 0x52) return bytes; // no IHDR where expected

  const ppm = Math.round(dpi / 0.0254); // pixels per metre
  const data = new Uint8Array(9);
  const dv = new DataView(data.buffer);
  dv.setUint32(0, ppm);       // x pixels per unit
  dv.setUint32(4, ppm);       // y pixels per unit
  data[8] = 1;                 // unit specifier: 1 = metre

  const type = new Uint8Array([0x70, 0x48, 0x59, 0x73]); // "pHYs"
  const crcInput = new Uint8Array(type.length + data.length);
  crcInput.set(type, 0);
  crcInput.set(data, type.length);
  const crc = crc32(crcInput);

  const chunk = new Uint8Array(4 + 4 + 9 + 4);
  const chunkView = new DataView(chunk.buffer);
  chunkView.setUint32(0, 9); // length of data
  chunk.set(type, 4);
  chunk.set(data, 8);
  chunkView.setUint32(17, crc);

  const out = new Uint8Array(bytes.length + chunk.length);
  out.set(bytes.slice(0, ihdrEnd), 0);
  out.set(chunk, ihdrEnd);
  out.set(bytes.slice(ihdrEnd), ihdrEnd + chunk.length);
  return out;
}

async function applyDensity(blob: Blob, format: string, dpi: number): Promise<Blob> {
  if (format !== 'png' && format !== 'jpg' && format !== 'jpeg') return blob; // webp: skipped, see README caveat
  const buf = new Uint8Array(await blobToArrayBuffer(blob));
  const patched = format === 'png' ? patchPngDensity(buf, dpi) : patchJpegDensity(buf, dpi);
  return new Blob([patched.buffer as ArrayBuffer], { type: blob.type });
}

// ── White-background detection on the final output ─────────────────────
// Same 8-point corner/edge sample as the old server code.

function detectWhiteBackground(canvas: HTMLCanvasElement): boolean {
  const sample = makeCanvas(100, 100);
  const sctx = getCtx(sample);
  sctx.fillStyle = '#ffffff';
  sctx.fillRect(0, 0, 100, 100);
  sctx.drawImage(canvas, 0, 0, 100, 100);
  const { data } = sctx.getImageData(0, 0, 100, 100);

  const points: [number, number][] = [
    [0, 0], [99, 0], [0, 99], [99, 99],
    [50, 0], [0, 50], [99, 50], [50, 99],
  ];

  let whiteCount = 0;
  for (const [x, y] of points) {
    const idx = (y * 100 + x) * 4;
    if (data[idx] > WHITE_DETECT_THRESHOLD && data[idx + 1] > WHITE_DETECT_THRESHOLD && data[idx + 2] > WHITE_DETECT_THRESHOLD) {
      whiteCount++;
    }
  }
  return whiteCount >= 6;
}

// ── Encoding + binary-search-to-target-size ─────────────────────────────

const MIME_MAP: Record<string, string> = {
  jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp', pdf: 'image/jpeg',
};

async function encodeAt(canvas: HTMLCanvasElement, format: string, quality: number): Promise<Blob> {
  const mime = MIME_MAP[format] || 'image/jpeg';
  if (format === 'png') return canvasToBlob(canvas, mime); // PNG is lossless; no quality knob
  return canvasToBlob(canvas, mime, quality / 100);
}

async function compressToTargetSize(
  canvas: HTMLCanvasElement,
  format: string,
  targetMinKB: number,
  targetMaxKB: number
): Promise<Blob> {
  const targetMaxBytes = targetMaxKB * 1024;
  const targetMinBytes = targetMinKB * 1024;

  let lo = 1, hi = 95;
  let bestBlob: Blob | null = null;
  let currentQuality = 80;

  for (let attempt = 0; attempt < 12; attempt++) {
    const testBlob = await encodeAt(canvas, format, currentQuality);
    const size = testBlob.size;

    if (size <= targetMaxBytes && size >= targetMinBytes) {
      bestBlob = testBlob;
      break;
    }

    if (size <= targetMaxBytes) {
      lo = currentQuality;
      bestBlob = testBlob;
    } else {
      hi = currentQuality;
    }

    if (format === 'png') { bestBlob = testBlob; break; } // quality has no effect; one pass is enough

    currentQuality = Math.floor((lo + hi) / 2);

    if (hi - lo <= 1) {
      if (!bestBlob) bestBlob = testBlob;
      break;
    }
  }

  if (!bestBlob) bestBlob = await encodeAt(canvas, format, 70); // shouldn't happen, mirrors server fallback

  // Still too big -> scale down and re-encode once, same as the old server logic.
  if (bestBlob.size > targetMaxBytes) {
    const scaleFactor = Math.sqrt(targetMaxBytes / bestBlob.size) * 0.9;
    const newW = Math.max(1, Math.floor(canvas.width * scaleFactor));
    const newH = Math.max(1, Math.floor(canvas.height * scaleFactor));
    const smaller = makeCanvas(newW, newH);
    getCtx(smaller).drawImage(canvas, 0, 0, newW, newH);
    const q = format === 'png' ? undefined : 60;
    bestBlob = await encodeAt(smaller, format, q ?? 60);
    canvas.width = newW; canvas.height = newH; // caller reads final dims off `canvas`
    getCtx(canvas).drawImage(smaller, 0, 0);
  }

  return bestBlob;
}

// ── Main entry point ────────────────────────────────────────────────────

export async function processImage(file: File, options: ResizeOptions): Promise<ProcessResult> {
  const {
    targetMinKB, targetMaxKB, width, height,
    dpi = 96, whiteBg = false, trimSignature = false,
    outputFormat = 'jpg',
  } = options;

  let canvas = await decodeToCanvas(file);
  const originalWidth = canvas.width;
  const originalHeight = canvas.height;

  if (trimSignature) canvas = trimToBoundingBox(canvas, TRIM_THRESHOLD);

  const needsFlatten = whiteBg || (file.type === 'image/png' && hasAlphaChannel(canvas));
  if (needsFlatten) canvas = flattenOnWhite(canvas);

  canvas = resizeCanvas(canvas, width, height);

  const format = (outputFormat === 'pdf' ? 'jpg' : outputFormat) || 'jpg';
  let outBlob = await compressToTargetSize(canvas, format, targetMinKB, targetMaxKB);
  outBlob = await applyDensity(outBlob, format, dpi);

  const finalWidth = canvas.width;
  const finalHeight = canvas.height;
  const whiteBgOK = detectWhiteBackground(canvas);

  const finalSizeKB = Math.round(outBlob.size / 1024);
  const sizeOK = finalSizeKB >= targetMinKB && finalSizeKB <= targetMaxKB;
  const dimsOK = width && height ? finalWidth === width && finalHeight === height : true;

  void originalWidth; void originalHeight; // kept for parity/debugging, not required by the UI today

  const acceptability: AcceptabilityResult = {
    sizeOK,
    formatOK: true,
    dimsOK,
    whiteBgOK,
    finalSizeKB,
    width: finalWidth,
    height: finalHeight,
    targetMinKB,
    targetMaxKB,
  };

  return { blob: outBlob, acceptability };
}
