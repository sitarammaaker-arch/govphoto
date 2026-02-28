import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';

export const runtime = 'nodejs';
export const maxDuration = 30;

interface ResizeOptions {
  targetMinKB: number;
  targetMaxKB: number;
  width?: number;
  height?: number;
  dpi?: number;
  whiteBg?: boolean;
  trimSignature?: boolean;
}

async function compressToTargetSize(
  inputBuffer: Buffer,
  options: ResizeOptions
): Promise<{ buffer: Buffer; info: sharp.OutputInfo; metadata: sharp.Metadata }> {
  const { targetMinKB, targetMaxKB, width, height, dpi = 96, whiteBg = false, trimSignature = false } = options;

  const targetMaxBytes = targetMaxKB * 1024;
  const targetMinBytes = targetMinKB * 1024;

  // Get original metadata
  const metadata = await sharp(inputBuffer).metadata();

  // Start with a pipeline
  let pipeline = sharp(inputBuffer);

  // Trim whitespace for signatures
  if (trimSignature) {
    pipeline = pipeline.trim({ background: '#ffffff', threshold: 10 });
  }

  // Add white background if requested or if PNG with transparency
  if (whiteBg || metadata.hasAlpha) {
    pipeline = pipeline.flatten({ background: { r: 255, g: 255, b: 255 } });
  }

  // Resize if dimensions specified
  if (width && height) {
    pipeline = pipeline.resize(width, height, {
      fit: 'fill',
      withoutEnlargement: false,
    });
  } else if (width || height) {
    pipeline = pipeline.resize(width, height, {
      fit: 'inside',
      withoutEnlargement: false,
    });
  }

  // Set DPI
  const density = dpi;

  // Binary search for the right quality
  let lo = 1;
  let hi = 95;
  let bestBuffer: Buffer | null = null;
  let bestInfo: sharp.OutputInfo | null = null;

  // First pass at quality 85
  let currentQuality = 80;

  for (let attempt = 0; attempt < 12; attempt++) {
    const testBuffer = await pipeline
      .clone()
      .withMetadata({ density })
      .jpeg({ quality: currentQuality, mozjpeg: true })
      .toBuffer({ resolveWithObject: true });

    const size = testBuffer.info.size;

    if (size <= targetMaxBytes && size >= targetMinBytes) {
      // Perfect range
      bestBuffer = testBuffer.data;
      bestInfo = testBuffer.info;
      break;
    }

    if (size <= targetMaxBytes) {
      // Under target max - try increasing quality within range
      lo = currentQuality;
      bestBuffer = testBuffer.data;
      bestInfo = testBuffer.info;
    } else {
      // Over target - reduce quality
      hi = currentQuality;
    }

    currentQuality = Math.floor((lo + hi) / 2);

    if (hi - lo <= 1) {
      // Converged - use best we have
      if (!bestBuffer) {
        bestBuffer = testBuffer.data;
        bestInfo = testBuffer.info;
      }
      break;
    }
  }

  // If still too large after quality reduction, resize down
  if (bestInfo && bestInfo.size > targetMaxBytes) {
    const scaleFactor = Math.sqrt(targetMaxBytes / bestInfo.size) * 0.9;
    const newWidth = width
      ? Math.floor(width * scaleFactor)
      : Math.floor((metadata.width || 200) * scaleFactor);
    const newHeight = height
      ? Math.floor(height * scaleFactor)
      : Math.floor((metadata.height || 200) * scaleFactor);

    const resized = await pipeline
      .clone()
      .resize(newWidth, newHeight)
      .withMetadata({ density })
      .jpeg({ quality: 60, mozjpeg: true })
      .toBuffer({ resolveWithObject: true });

    bestBuffer = resized.data;
    bestInfo = resized.info;
  }

  if (!bestBuffer || !bestInfo) {
    const fallback = await pipeline
      .clone()
      .withMetadata({ density })
      .jpeg({ quality: 70, mozjpeg: true })
      .toBuffer({ resolveWithObject: true });
    bestBuffer = fallback.data;
    bestInfo = fallback.info;
  }

  return { buffer: bestBuffer, info: bestInfo, metadata };
}

function detectWhiteBackground(
  pixelData: Buffer,
  width: number,
  height: number
): boolean {
  // Sample corner and edge pixels to detect white background
  const threshold = 240;
  const samplePoints = [
    [0, 0], [width - 1, 0], [0, height - 1], [width - 1, height - 1],
    [Math.floor(width / 2), 0], [0, Math.floor(height / 2)],
    [width - 1, Math.floor(height / 2)], [Math.floor(width / 2), height - 1],
  ];

  let whiteCount = 0;
  const channels = 3; // RGB

  for (const [x, y] of samplePoints) {
    const idx = (y * width + x) * channels;
    const r = pixelData[idx];
    const g = pixelData[idx + 1];
    const b = pixelData[idx + 2];
    if (r > threshold && g > threshold && b > threshold) {
      whiteCount++;
    }
  }

  return whiteCount >= 6;
}

// Placeholder for face-centered crop (future feature)
async function faceCenteredCrop(
  _inputBuffer: Buffer,
  _targetWidth: number,
  _targetHeight: number
): Promise<Buffer> {
  // Future: integrate face detection API (e.g., AWS Rekognition or face-api.js)
  // For now, center-crop the image
  throw new Error('Face detection not yet implemented');
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('image') as File | null;
    const preset = formData.get('preset') as string | null;
    const customMinKB = formData.get('customMinKB') as string | null;
    const customMaxKB = formData.get('customMaxKB') as string | null;
    const enableWhiteBg = formData.get('whiteBg') === 'true';
    const enableTrim = formData.get('trimSignature') === 'true';
    const dpi300 = formData.get('dpi300') === 'true';

    if (!file) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large. Max 5MB allowed.' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Only JPG and PNG files are supported.' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const inputBuffer = Buffer.from(arrayBuffer);

    // Define preset configurations
    const presets: Record<string, ResizeOptions> = {
      ssc_photo: { targetMinKB: 20, targetMaxKB: 50, whiteBg: true, dpi: dpi300 ? 300 : 96 },
      ssc_signature: { targetMinKB: 10, targetMaxKB: 20, trimSignature: true, dpi: dpi300 ? 300 : 96 },
      passport: { targetMinKB: 20, targetMaxKB: 50, width: 413, height: 531, whiteBg: true, dpi: dpi300 ? 300 : 96 },
      upsc_photo: { targetMinKB: 20, targetMaxKB: 300, width: 200, height: 230, whiteBg: true, dpi: dpi300 ? 300 : 96 },
      railway_photo: { targetMinKB: 20, targetMaxKB: 50, whiteBg: true, dpi: dpi300 ? 300 : 96 },
      banking_photo: { targetMinKB: 20, targetMaxKB: 50, whiteBg: true, dpi: dpi300 ? 300 : 96 },
      custom: {
        targetMinKB: parseInt(customMinKB || '20'),
        targetMaxKB: parseInt(customMaxKB || '50'),
        whiteBg: enableWhiteBg,
        trimSignature: enableTrim,
        dpi: dpi300 ? 300 : 96,
      },
    };

    const selectedPreset = preset && presets[preset] ? presets[preset] : presets.ssc_photo;

    if (preset === 'custom') {
      selectedPreset.whiteBg = enableWhiteBg;
      selectedPreset.trimSignature = enableTrim;
    }

    // Process the image
    const { buffer: outputBuffer, info, metadata } = await compressToTargetSize(
      inputBuffer,
      selectedPreset
    );

    // Check white background on output
    let hasWhiteBackground = false;
    try {
      const { data: pixelData } = await sharp(outputBuffer)
        .resize(100, 100)
        .removeAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true });
      hasWhiteBackground = detectWhiteBackground(pixelData, 100, 100);
    } catch {
      hasWhiteBackground = false;
    }

    // Build acceptability report
    const finalSizeKB = Math.round(info.size / 1024);
    const sizeOK = finalSizeKB >= selectedPreset.targetMinKB && finalSizeKB <= selectedPreset.targetMaxKB;
    const formatOK = true; // Always JPG output
    const dimsOK = selectedPreset.width && selectedPreset.height
      ? info.width === selectedPreset.width && info.height === selectedPreset.height
      : true;

    const acceptability = {
      sizeOK,
      formatOK,
      dimsOK,
      whiteBgOK: hasWhiteBackground,
      finalSizeKB,
      width: info.width,
      height: info.height,
      targetMinKB: selectedPreset.targetMinKB,
      targetMaxKB: selectedPreset.targetMaxKB,
      originalWidth: metadata.width,
      originalHeight: metadata.height,
      originalFormat: metadata.format,
    };

    // Return binary JPEG directly instead of base64-in-JSON.
    // This saves ~33% payload size (base64 encoding adds 33% overhead).
    // Acceptability metadata travels in a custom response header.
    // Client uses URL.createObjectURL(blob) — no base64 decode needed.
    return new Response(new Uint8Array(outputBuffer), {
      status: 200,
      headers: {
        'Content-Type':       'image/jpeg',
        'Content-Length':     String(outputBuffer.length),
        // Safely JSON-encode metadata in header (< 4KB, well within limits)
        'X-Acceptability':    JSON.stringify({
          sizeOK,
          formatOK,
          dimsOK,
          whiteBgOK: hasWhiteBackground,
          finalSizeKB,
          width:        info.width,
          height:       info.height,
          targetMinKB:  selectedPreset.targetMinKB,
          targetMaxKB:  selectedPreset.targetMaxKB,
        }),
        // Allow client to read the custom header
        'Access-Control-Expose-Headers': 'X-Acceptability',
        // Never cache processed images
        'Cache-Control':      'no-store',
      },
    });
  } catch (error) {
    console.error('Image processing error:', error);
    return NextResponse.json(
      { error: 'Failed to process image. Please try again.' },
      { status: 500 }
    );
  }
}
