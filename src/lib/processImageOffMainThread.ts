/**
 * Public entry point ResizerTool.tsx should call instead of importing
 * processImage() from clientImageProcessor.ts directly.
 *
 * Runs the resize/compress pipeline inside a Web Worker (imageProcessor.worker.ts)
 * so the main thread stays free to respond to input while an image is being
 * processed — protects INP (Interaction to Next Paint), a Core Web Vitals /
 * ranking signal, from the up-to-12-pass compression loop.
 *
 * Falls back to running processImage() directly on the main thread — same
 * module, identical output — if Workers aren't usable in this browser
 * (construction fails) or the worker errors out, so functionality never
 * regresses even on an unusual browser.
 */

import { processImage, type ResizeOptions, type ProcessResult } from './clientImageProcessor';
import type { WorkerRequest, WorkerResponse } from './imageProcessor.worker';

let worker: Worker | null = null;
let workerUnavailable = false;

function getWorker(): Worker | null {
  if (workerUnavailable) return null;
  if (worker) return worker;
  if (typeof Worker === 'undefined') {
    workerUnavailable = true;
    return null;
  }
  try {
    worker = new Worker(new URL('./imageProcessor.worker.ts', import.meta.url));
    return worker;
  } catch {
    workerUnavailable = true;
    return null;
  }
}

export async function processImageOffMainThread(file: File, options: ResizeOptions): Promise<ProcessResult> {
  const w = getWorker();
  if (!w) return processImage(file, options);

  return new Promise<ProcessResult>((resolve, reject) => {
    const cleanup = () => {
      w.removeEventListener('message', handleMessage);
      w.removeEventListener('error', handleError);
    };

    const handleMessage = (event: MessageEvent<WorkerResponse>) => {
      cleanup();
      const data = event.data;
      if (data.ok) resolve({ blob: data.blob, acceptability: data.acceptability });
      else reject(new Error(data.error));
    };

    const handleError = () => {
      cleanup();
      // The worker itself failed to run (e.g. an unsupported environment) —
      // retry this one call on the main thread rather than surfacing an
      // opaque worker error, and stop trying to use a worker going forward.
      workerUnavailable = true;
      worker = null;
      processImage(file, options).then(resolve, reject);
    };

    w.addEventListener('message', handleMessage);
    w.addEventListener('error', handleError);

    const request: WorkerRequest = { file, options };
    w.postMessage(request);
  });
}
