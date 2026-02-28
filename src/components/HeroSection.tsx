// Pure Server Component — zero client JS. All animations are CSS-only.
// Removed: backdrop-blur-sm (×3), animate-pulse, transition-all, shadow-2xl hover
// These were causing compositing layers and continuous main-thread work.
export default function HeroSection() {
  return (
    <section
      className="relative bg-sky-800 text-white overflow-hidden"
      /* Explicit min-height prevents CLS if a parent resizes during hydration */
      style={{ minHeight: '420px' }}
    >
      {/* Lightweight CSS-only decorative layer — no JS, no paint cost */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at 20% 30%, rgba(56,189,248,0.15) 0%, transparent 55%), radial-gradient(ellipse at 80% 70%, rgba(14,165,233,0.1) 0%, transparent 55%)',
          }}
        />
        {/* SVG wave — inlined, no network request */}
        <svg
          className="absolute bottom-0 left-0 w-full"
          viewBox="0 0 1440 80"
          fill="none"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M0 80L360 40C720 0 1080 0 1440 40V80H0Z"
            fill="rgba(255,255,255,0.04)"
          />
        </svg>
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-14 sm:py-20 text-center">
        {/* Status badge — no backdrop-blur, CSS statusPulse instead of animate-pulse */}
        <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-5 text-sky-100">
          <span className="status-dot" aria-hidden="true" />
          Free Tool — No Registration Required
        </div>

        {/* LCP element — H1. Explicit font-size prevents reflow. */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4">
          Resize Photo &amp; Signature for
          <span className="block text-sky-300 mt-1">Government Job Forms in Seconds</span>
        </h1>

        <p className="text-sky-100 text-lg sm:text-xl mb-7 max-w-2xl mx-auto">
          SSC, UPSC, Railway, CET, Police &amp; Banking Exams Supported
        </p>

        {/* Exam pills — static spans, no JS */}
        <div className="flex flex-wrap justify-center gap-2 mb-8" aria-label="Supported exams">
          {['SSC', 'UPSC', 'Railway', 'CET', 'Police', 'Banking', 'IB', 'NTA'].map((exam) => (
            <span
              key={exam}
              className="bg-white/10 border border-white/15 text-white text-sm px-3 py-1 rounded-full"
            >
              {exam}
            </span>
          ))}
        </div>

        {/* CTA — transition-colors only (no layout/paint) */}
        <a
          href="#tool"
          className="inline-flex items-center gap-3 bg-white text-sky-700 hover:bg-sky-50 font-bold text-lg px-8 py-4 rounded-2xl shadow-lg transition-colors duration-200 active:scale-95"
          style={{ willChange: 'transform' }}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          Upload &amp; Resize Now
        </a>

        {/* Trust badges — static, no JS */}
        <ul className="mt-8 flex flex-wrap justify-center gap-5 text-sky-200 text-sm list-none p-0">
          {[
            ['✓', '100% Free'],
            ['✓', 'No Image Storage'],
            ['✓', 'Instant Download'],
            ['✓', 'JPG Output'],
          ].map(([icon, label]) => (
            <li key={label} className="flex items-center gap-1.5">
              <span className="text-green-400 font-bold">{icon}</span>
              {label}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
