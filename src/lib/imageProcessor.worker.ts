/**
 * Web Worker entry point for processImage().
 *
 * The resize/compress pipeline in clientImageProcessor.ts can run up to
 * 12 synchronous encode passes (the binary-search-to-target-KB loop) plus
 * pixel-level scans (trim, white-background detection). Running that on the
 * main thread blocks input handling and risks a poor INP (Interaction to
 * Next Paint) score on real devices. This worker moves that work off the
 * main thread; clientImageProcessor.ts itself is unchanged either way since
 * it is built entirely on OffscreenCanvas, which works identically in both
 * contexts.
 *
 * `self` is intentionally typed via the "dom" lib (not "webworker") to
 * avoid a lib conflict with the rest of this Next.js project's tsconfig —
 * casting to `Worker` gives the right shape (postMessage/onmessage) for a
 * dedicated worker's global scope without pulling in a second lib set.
 */

import { processImage, type ResizeOptions, type ProcessResult } from './clientImageProcessor';

export interface WorkerRequest {
  file: File;
  options: ResizeOptions;
}

export type WorkerResponse =
  | { ok: true; blob: Blob; acceptability: ProcessResult['acceptability'] }
  | { ok: false; error: string };

const ctx = self as unknown as Worker;

ctx.onmessage = async (event: MessageEvent<WorkerRequest>) => {
  const { file, options } = event.data;
  try {
    const { blob, acceptability } = await processImage(file, options);
    const response: WorkerResponse = { ok: true, blob, acceptability };
    ctx.postMessage(response);
  } catch (err) {
    const response: WorkerResponse = {
      ok: false,
      error: err instanceof Error ? err.message : 'Image processing failed.',
    };
    ctx.postMessage(response);
  }
};
