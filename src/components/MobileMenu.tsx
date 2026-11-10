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
        className="md:hidden p-2 rounded-lg hover:bg-surface-muted transition-colors"
        onClick={() => setOpen(!open)}
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
      >
        <svg className="w-6 h-6 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          {open ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {open && (
        <div className="md:hidden absolute top-16 inset-x-0 bg-surface border-t border-border px-4 py-4 space-y-3 shadow-lg z-40">
          <a href="/#tool"         className="block py-2 text-text font-medium hover:text-link" onClick={close}>Resize Tool</a>
          <a href="/#how-it-works" className="block py-2 text-text font-medium hover:text-link" onClick={close}>How It Works</a>
          <a href="/#exams"        className="block py-2 text-text font-medium hover:text-link" onClick={close}>Exam Guide</a>
          <a href="/#faq"          className="block py-2 text-text font-medium hover:text-link" onClick={close}>FAQ</a>
          <a href="/blog"          className="block py-2 text-text font-medium hover:text-link" onClick={close}>Blog</a>
          <a href="/#tool"         className="block w-full text-center bg-primary text-on-primary px-4 py-2.5 rounded-lg font-semibold" onClick={close}>Resize Now →</a>
        </div>
      )}
    </>
  );
}
