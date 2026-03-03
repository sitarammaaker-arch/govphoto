'use client';

import { useState, useRef, useCallback } from 'react';
import AdUnit from './AdUnit';

type Preset = {
  id: string;
  label: string;
  description: string;
  minKB: number;
  maxKB: number;
  icon: string;
  width?: number;
  height?: number;
};

const PRESETS: Preset[] = [
  { id: 'ssc_photo',     label: 'SSC Photo',     description: '20–50 KB',    minKB: 20, maxKB: 50,  icon: '📷' },
  { id: 'ssc_signature', label: 'SSC Signature', description: '10–20 KB',    minKB: 10, maxKB: 20,  icon: '✍️' },
  { id: 'passport',      label: 'Passport Size', description: '413×531px',   minKB: 20, maxKB: 50,  icon: '🪪', width: 413, height: 531 },
  { id: 'upsc_photo',    label: 'UPSC Photo',    description: '200×230px',   minKB: 20, maxKB: 300, icon: '🏛️', width: 200, height: 230 },
  { id: 'railway_photo', label: 'Railway Photo', description: '20–50 KB',    minKB: 20, maxKB: 50,  icon: '🚂' },
  { id: 'banking_photo', label: 'Banking Exam',  description: '20–50 KB',    minKB: 20, maxKB: 50,  icon: '🏦' },
  { id: 'custom',        label: 'Custom Size',   description: 'Set your KB', minKB: 10, maxKB: 100, icon: '⚙️' },
];

interface AcceptabilityResult {
  sizeOK: boolean; formatOK: boolean; dimsOK: boolean; whiteBgOK: boolean;
  finalSizeKB: number; width: number; height: number;
  targetMinKB: number; targetMaxKB: number;
}

interface ResizerToolProps {
  postResultAdSlot?: string;
}

export default function ResizerTool({ postResultAdSlot }: ResizerToolProps = {}) {
  const [selectedPreset, setSelectedPreset] = useState<string>('ssc_photo');
  const [customMinKB, setCustomMinKB]       = useState<string>('20');
  const [customMaxKB, setCustomMaxKB]       = useState<string>('50');
  const [customWidth, setCustomWidth]       = useState<string>('');
  const [customHeight, setCustomHeight]     = useState<string>('');
  const [enableWhiteBg, setEnableWhiteBg]   = useState<boolean>(false);
  const [enableTrim, setEnableTrim]         = useState<boolean>(false);
  const [dpi300, setDpi300]                 = useState<boolean>(false);
  const [isDragging, setIsDragging]         = useState<boolean>(false);
  const [originalFile, setOriginalFile]     = useState<File | null>(null);
  const [originalPreview, setOriginalPreview] = useState<string | null>(null);
  const [resultImage, setResultImage]       = useState<string | null>(null);
  const [acceptability, setAcceptability]   = useState<AcceptabilityResult | null>(null);
  const [isProcessing, setIsProcessing]     = useState<boolean>(false);
  const [error, setError]                   = useState<string | null>(null);
  const [originalSizeKB, setOriginalSizeKB] = useState<number>(0);
  const [originalDims, setOriginalDims]     = useState<{ w: number; h: number } | null>(null);

  const fileInputRef  = useRef<HTMLInputElement>(null);
  const prevObjUrlRef = useRef<string | null>(null);
  const prevResultRef = useRef<string | null>(null);

  const readFileInfo = useCallback((file: File) => {
    setOriginalSizeKB(Math.round(file.size / 1024));
    if (prevObjUrlRef.current) URL.revokeObjectURL(prevObjUrlRef.current);
    const objUrl = URL.createObjectURL(file);
    prevObjUrlRef.current = objUrl;
    setOriginalPreview(objUrl);
    const img = new Image();
    img.onload = () => setOriginalDims({ w: img.naturalWidth, h: img.naturalHeight });
    img.src = objUrl;
  }, []);

  const handleFile = useCallback((file: File) => {
    setError(null); setResultImage(null); setAcceptability(null);
    if (prevResultRef.current) { URL.revokeObjectURL(prevResultRef.current); prevResultRef.current = null; }
    if (file.size > 5 * 1024 * 1024) { setError('File too large. Maximum size is 5MB.'); return; }
    if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) { setError('Only JPG and PNG files are supported.'); return; }
    setOriginalFile(file);
    readFileInfo(file);
  }, [readFileInfo]);

  const handleDrop      = useCallback((e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); const f = e.dataTransfer.files; if (f.length > 0) handleFile(f[0]); }, [handleFile]);
  const handleDragOver  = useCallback((e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); }, []);
  const handleDragLeave = useCallback(() => setIsDragging(false), []);
  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => { const f = e.target.files; if (f && f.length > 0) handleFile(f[0]); }, [handleFile]);

  const handleResize = useCallback(async () => {
    if (!originalFile) { setError('Please upload an image first.'); return; }
    setIsProcessing(true); setError(null);
    try {
      const fd = new FormData();
      fd.append('image', originalFile);
      fd.append('preset', selectedPreset);
      fd.append('customMinKB', customMinKB);
      fd.append('customMaxKB', customMaxKB);
      fd.append('customWidth', customWidth);
      fd.append('customHeight', customHeight);
      fd.append('whiteBg', enableWhiteBg.toString());
      fd.append('trimSignature', enableTrim.toString());
      fd.append('dpi300', dpi300.toString());

      const res = await fetch('/api/resize', { method: 'POST', body: fd });
      if (!res.ok) { const err = await res.json().catch(() => ({ error: 'Processing failed' })); throw new Error(err.error || 'Processing failed'); }

      const acceptHeader = res.headers.get('X-Acceptability');
      const acc: AcceptabilityResult = acceptHeader ? JSON.parse(acceptHeader) : null;
      const blob = await res.blob();
      if (prevResultRef.current) URL.revokeObjectURL(prevResultRef.current);
      const resultUrl = URL.createObjectURL(blob);
      prevResultRef.current = resultUrl;
      setResultImage(resultUrl);
      setAcceptability(acc);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setIsProcessing(false);
    }
  }, [originalFile, selectedPreset, customMinKB, customMaxKB, customWidth, customHeight, enableWhiteBg, enableTrim, dpi300]);

  const handleDownload = useCallback(() => {
    if (!resultImage) return;
    if (typeof window !== 'undefined' && (window as unknown as { gtag?: Function }).gtag) {
      (window as unknown as { gtag: Function }).gtag('event', 'download', { event_category: 'image', event_label: selectedPreset });
    }
    const a = document.createElement('a');
    const preset = PRESETS.find((p) => p.id === selectedPreset);
    a.href = resultImage;
    a.download = `signresizer_${preset?.id ?? 'resized'}_${Date.now()}.jpg`;
    a.click();
  }, [resultImage, selectedPreset]);

  const handleReset = useCallback(() => {
    if (prevObjUrlRef.current) { URL.revokeObjectURL(prevObjUrlRef.current); prevObjUrlRef.current = null; }
    if (prevResultRef.current) { URL.revokeObjectURL(prevResultRef.current); prevResultRef.current = null; }
    setOriginalFile(null); setOriginalPreview(null); setResultImage(null);
    setAcceptability(null); setError(null); setOriginalSizeKB(0); setOriginalDims(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, []);

  const activePreset = PRESETS.find((p) => p.id === selectedPreset);

  return (
    <div className="space-y-6">

      {/* ── Step 1: Preset ── */}
      <div className="card p-5 sm:p-6">
        <h2 className="text-xl font-bold text-slate-800 mb-1 flex items-center gap-2">
          <span className="w-7 h-7 rounded-full bg-sky-500 text-white text-sm flex items-center justify-center font-bold">1</span>
          Select Preset
        </h2>
        <p className="text-slate-500 text-sm mb-4">Choose the exam type or set custom size</p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2">
          {PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => setSelectedPreset(preset.id)}
              className={`preset-btn${selectedPreset === preset.id ? ' active' : ''}`}
              aria-pressed={selectedPreset === preset.id}
            >
              <span className="text-2xl">{preset.icon}</span>
              <span className="text-xs font-semibold text-slate-700 leading-tight">{preset.label}</span>
              <span className="text-xs text-sky-600 font-medium">{preset.description}</span>
            </button>
          ))}
        </div>

        {/* Custom Size Panel */}
        {selectedPreset === 'custom' && (
          <div className="mt-4 p-4 bg-sky-50 rounded-xl border border-sky-100 space-y-3">
            <p className="text-sm font-semibold text-sky-800">Custom Size Settings</p>

            {/* KB Row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="min-kb" className="text-xs font-medium text-slate-600 block mb-1">Min Size (KB)</label>
                <input id="min-kb" type="number" value={customMinKB}
                  onChange={(e) => setCustomMinKB(e.target.value)} min="5" max="5000"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400" />
              </div>
              <div>
                <label htmlFor="max-kb" className="text-xs font-medium text-slate-600 block mb-1">Max Size (KB)</label>
                <input id="max-kb" type="number" value={customMaxKB}
                  onChange={(e) => setCustomMaxKB(e.target.value)} min="5" max="5000"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400" />
              </div>
            </div>

            {/* Width & Height Row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="custom-width" className="text-xs font-medium text-slate-600 block mb-1">Width (px)</label>
                <input id="custom-width" type="number" value={customWidth}
                  onChange={(e) => setCustomWidth(e.target.value)} min="1" max="5000"
                  placeholder="Optional"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 placeholder-slate-300" />
              </div>
              <div>
                <label htmlFor="custom-height" className="text-xs font-medium text-slate-600 block mb-1">Height (px)</label>
                <input id="custom-height" type="number" value={customHeight}
                  onChange={(e) => setCustomHeight(e.target.value)} min="1" max="5000"
                  placeholder="Optional"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 placeholder-slate-300" />
              </div>
            </div>
            <p className="text-xs text-slate-400">
              Add width and height for exact dimensions, or keep blank to preserve original ratio.
            </p>
          </div>
        )}

        {/* Advanced Options */}
        <div className="mt-4 pt-4 border-t border-slate-100">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Advanced Options</p>
          <div className="flex flex-wrap gap-4">
            {[
              { id: 'whiteBg', checked: enableWhiteBg, set: setEnableWhiteBg, label: 'White Background' },
              { id: 'trim',    checked: enableTrim,    set: setEnableTrim,    label: 'Trim Whitespace (Signature)' },
              { id: 'dpi300',  checked: dpi300,        set: setDpi300,        label: 'Set DPI to 300' },
            ].map(({ id, checked, set, label }) => (
              <label key={id} className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" id={id} checked={checked}
                  onChange={(e) => set(e.target.checked)}
                  className="w-4 h-4 rounded text-sky-500 border-slate-300 focus:ring-sky-400" />
                <span className="text-sm text-slate-700">{label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* ── Step 2: Upload ── */}
      <div className="card p-5 sm:p-6">
        <h2 className="text-xl font-bold text-slate-800 mb-1 flex items-center gap-2">
          <span className="w-7 h-7 rounded-full bg-sky-500 text-white text-sm flex items-center justify-center font-bold">2</span>
          Upload Image
        </h2>
        <p className="text-slate-500 text-sm mb-4">Drag &amp; drop or click to select. JPG/PNG, max 5MB.</p>

        <div
          onDrop={handleDrop} onDragOver={handleDragOver} onDragLeave={handleDragLeave}
          onClick={() => !originalFile && fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-colors duration-200
            ${isDragging ? 'border-sky-400 bg-sky-50' : originalFile ? 'border-green-300 bg-green-50 cursor-default' : 'border-slate-300 hover:border-sky-400 hover:bg-sky-50 cursor-pointer'}`}
        >
          <input ref={fileInputRef} type="file" accept=".jpg,.jpeg,.png,image/jpeg,image/png"
            onChange={handleFileInput} className="hidden" />

          {originalFile ? (
            <div className="space-y-3">
              <div className="flex items-center justify-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="font-semibold text-slate-800 text-sm">{originalFile.name}</p>
                  <p className="text-xs text-slate-500">
                    {originalSizeKB} KB{originalDims ? ` • ${originalDims.w}×${originalDims.h}px` : ''} • {originalFile.type.split('/')[1].toUpperCase()}
                  </p>
                </div>
              </div>
              <button onClick={(e) => { e.stopPropagation(); handleReset(); }} className="text-xs text-red-500 hover:text-red-700 underline">
                Remove &amp; upload different image
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-sky-50 border-2 border-sky-100 flex items-center justify-center">
                <svg className="w-7 h-7 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-slate-700">Drop image here or <span className="text-sky-600 underline">browse</span></p>
                <p className="text-sm text-slate-400 mt-1">JPG, JPEG, PNG • Max 5MB</p>
              </div>
            </div>
          )}
        </div>

        {error && (
          <div role="alert" className="mt-3 flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
            <svg className="w-5 h-5 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        <button
          onClick={handleResize} disabled={!originalFile || isProcessing}
          className={`mt-4 w-full flex items-center justify-center gap-3 py-4 rounded-xl font-bold text-base transition-colors duration-200
            ${!originalFile || isProcessing ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-sky-500 hover:bg-sky-600 text-white shadow-md active:scale-[0.98]'}`}
        >
          {isProcessing ? (
            <><div className="spinner" />Processing Image...</>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Resize to {activePreset?.id === 'custom' ? `${customMinKB}–${customMaxKB} KB${customWidth && customHeight ? ` • ${customWidth}×${customHeight}px` : ''}` : `${activePreset?.minKB}–${activePreset?.maxKB} KB`}
            </>
          )}
        </button>
      </div>

      {/* ── Step 3: Preview & Download ── */}
      {(originalPreview || resultImage) && (
        <div className="card p-5 sm:p-6">
          <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-sky-500 text-white text-sm flex items-center justify-center font-bold">3</span>
            Preview &amp; Download
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {originalPreview && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Original</p>
                <div className="bg-slate-100 rounded-xl overflow-hidden border border-slate-200" style={{ aspectRatio: '1/1' }}>
                  <img src={originalPreview} alt="Original" className="w-full h-full object-contain" width={300} height={300} decoding="async" />
                </div>
                <div className="flex gap-2 flex-wrap text-xs">
                  <Pill>{originalDims ? `${originalDims.w}×${originalDims.h}` : '—'}</Pill>
                  <Pill>{originalSizeKB} KB</Pill>
                  <Pill>{originalFile?.type.split('/')[1].toUpperCase() ?? '—'}</Pill>
                </div>
              </div>
            )}

            {resultImage && acceptability ? (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Resized Output</p>
                <div className="bg-slate-100 rounded-xl overflow-hidden border border-slate-200" style={{ aspectRatio: '1/1' }}>
                  <img src={resultImage} alt="Resized" className="w-full h-full object-contain" width={300} height={300} decoding="async" />
                </div>
                <div className="flex gap-2 flex-wrap text-xs">
                  <Pill green>{acceptability.width}×{acceptability.height}</Pill>
                  <Pill green>{acceptability.finalSizeKB} KB</Pill>
                  <Pill green>JPG</Pill>
                </div>
              </div>
            ) : isProcessing ? (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Processing…</p>
                <div className="bg-slate-100 rounded-xl border border-slate-200 flex items-center justify-center" style={{ aspectRatio: '1/1' }}>
                  <div className="text-center space-y-3">
                    <div className="w-10 h-10 border-4 border-sky-200 border-t-sky-500 rounded-full mx-auto" style={{ animation: 'spin 0.7s linear infinite' }} />
                    <p className="text-sm text-slate-500">Compressing image…</p>
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          {acceptability && (
            <div className="mt-5 p-4 bg-slate-50 rounded-xl border border-slate-100">
              <p className="text-sm font-bold text-slate-700 mb-3">Acceptability Check</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <CheckItem ok={acceptability.sizeOK}    label="File Size"   detail={`${acceptability.finalSizeKB} KB (${acceptability.targetMinKB}–${acceptability.targetMaxKB} KB)`} />
                <CheckItem ok={acceptability.formatOK}  label="Format"      detail="JPEG/JPG" />
                <CheckItem ok={acceptability.dimsOK}    label="Dimensions"  detail={`${acceptability.width}×${acceptability.height}px`} />
                <CheckItem ok={acceptability.whiteBgOK} label="White BG"    detail={acceptability.whiteBgOK ? 'Detected' : 'Not detected'} warning={!acceptability.whiteBgOK} />
              </div>
            </div>
          )}

          {resultImage && (
            <button onClick={handleDownload}
              className="mt-4 w-full flex items-center justify-center gap-3 py-4 rounded-xl font-bold text-base bg-green-500 hover:bg-green-600 text-white shadow-md transition-colors duration-200 active:scale-[0.98]">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download Resized Image
            </button>
          )}

          {resultImage && postResultAdSlot && (
            <AdUnit slot={postResultAdSlot} format="rectangle" className="ad-post-result" />
          )}
        </div>
      )}
    </div>
  );
}

function Pill({ children, green }: { children: React.ReactNode; green?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full
      ${green ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-slate-100 text-slate-600'}`}>
      {children}
    </span>
  );
}

function CheckItem({ ok, label, detail, warning = false }: { ok: boolean; label: string; detail: string; warning?: boolean }) {
  const isWarning = !ok && warning;
  return (
    <div className={`flex flex-col gap-1 p-3 rounded-lg border
      ${ok ? 'bg-green-50 border-green-100' : isWarning ? 'bg-amber-50 border-amber-100' : 'bg-red-50 border-red-100'}`}>
      <div className="flex items-center gap-1.5">
        {ok ? (
          <svg className="w-4 h-4 text-green-600 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20" style={{ color: isWarning ? '#d97706' : '#dc2626' }}>
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        )}
        <span className={`text-xs font-semibold ${ok ? 'text-green-700' : isWarning ? 'text-amber-700' : 'text-red-700'}`}>{label}</span>
      </div>
      <span className={`text-xs ${ok ? 'text-green-600' : isWarning ? 'text-amber-600' : 'text-red-600'}`}>{detail}</span>
    </div>
  );
}
