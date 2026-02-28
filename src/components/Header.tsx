// Server Component — no 'use client'. Only MobileMenu is client-side.
// Removed backdrop-blur-sm (forces compositor layer on every scroll frame).
// Removed bg-white/95 opacity — solid bg-white is compositor-friendly.
import Link from 'next/link';
import MobileMenu from './MobileMenu';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between relative">
        {/* Logo — Server-rendered, zero JS */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-sky-500 flex items-center justify-center shadow-md group-hover:bg-sky-600 transition-colors">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <span className="font-bold text-sky-700 text-lg leading-none block">GovPhoto</span>
            <span className="text-xs text-slate-400 leading-none">Resizer</span>
          </div>
        </Link>

        {/* Desktop nav — pure HTML, no JS */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600" aria-label="Main navigation">
          <a href="#tool"         className="hover:text-sky-600 transition-colors">Resize Tool</a>
          <a href="#how-it-works" className="hover:text-sky-600 transition-colors">How It Works</a>
          <a href="#exams"        className="hover:text-sky-600 transition-colors">Exam Guide</a>
          <a href="#faq"          className="hover:text-sky-600 transition-colors">FAQ</a>
          <a href="#tool"         className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg transition-colors shadow-sm">
            Resize Now →
          </a>
        </nav>

        {/* Mobile menu button + dropdown — only part that needs JS */}
        <MobileMenu />
      </div>
    </header>
  );
}
