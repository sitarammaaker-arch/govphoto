export default function HowItWorks() {
  const steps = [
    {
      step: '01',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
        </svg>
      ),
      title: 'Upload Your Photo',
      description: 'Drag & drop or click to upload your photo or signature. Supports JPG and PNG, up to 5MB.',
    },
    {
      step: '02',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2v-4M9 21H5a2 2 0 01-2-2v-4m0 0h18" />
        </svg>
      ),
      title: 'Choose Exam Preset',
      description: 'Select SSC, UPSC, Railway, or other exam presets. Or set a custom KB range for any specific requirement.',
    },
    {
      step: '03',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
      ),
      title: 'Download Instantly',
      description: 'Click Resize — your image is instantly compressed to the exact required size. Download the JPG file immediately.',
    },
  ];

  return (
    <section id="how-it-works" className="py-14 sm:py-20 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="section-title">How It Works</h2>
          <p className="section-sub">Get your government job photo ready in 3 simple steps</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 relative">
          {/* Connector line (desktop) */}
          <div className="hidden md:block absolute top-14 left-1/3 right-1/3 h-0.5 bg-sky-100 z-0" />

          {steps.map((item, i) => (
            <div key={i} className="relative z-10 flex flex-col items-center text-center group">
              <div className="w-16 h-16 rounded-2xl bg-sky-500 text-white flex items-center justify-center mb-4 shadow-lg shadow-sky-200 group-hover:bg-sky-600 transition-colors">
                {item.icon}
              </div>
              <span className="text-xs font-bold text-sky-400 tracking-widest mb-2">STEP {item.step}</span>
              <h3 className="text-lg font-bold text-slate-800 mb-2">{item.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>

        {/* Security Note */}
        <div className="mt-12 p-5 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
          <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
            <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <div>
            <p className="font-semibold text-slate-800 mb-1">Your Privacy is Protected</p>
            <p className="text-sm text-slate-500">
              Images are processed entirely in memory on our servers. <strong>We never store, save, or share your photos.</strong> Every image is permanently deleted immediately after processing. Zero data retention.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
