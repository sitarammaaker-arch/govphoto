'use client';
// Isolated client component so Header can remain a Server Component.
// The JS for this tiny toggle (< 500 bytes) loads independently.
import { useState } from 'react';

export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <>
      <button
        className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
        onClick={() => setOpen(!open)}
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
      >
        <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          {open ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {open && (
        <div className="md:hidden absolute top-16 inset-x-0 bg-white border-t border-slate-100 px-4 py-4 space-y-3 shadow-lg z-40">
          <a href="#tool"         className="block py-2 text-slate-700 font-medium hover:text-sky-600" onClick={close}>Resize Tool</a>
          <a href="#how-it-works" className="block py-2 text-slate-700 font-medium hover:text-sky-600" onClick={close}>How It Works</a>
          <a href="#exams"        className="block py-2 text-slate-700 font-medium hover:text-sky-600" onClick={close}>Exam Guide</a>
          <a href="#faq"          className="block py-2 text-slate-700 font-medium hover:text-sky-600" onClick={close}>FAQ</a>
          <a href="#tool"         className="block w-full text-center bg-sky-500 text-white px-4 py-2.5 rounded-lg font-semibold" onClick={close}>Resize Now →</a>
        </div>
      )}
    </>
  );
}
