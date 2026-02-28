// ── Pure Server Component — ZERO client JS ────────────────────────────────────
// Removed 'use client' + useState accordion.
// Replaced with native HTML <details>/<summary> — works without JavaScript,
// is keyboard-accessible by default, and ships 0 bytes of client JS.
// CSS chevron and transitions are handled in globals.css (.faq-item class).

const faqs = [
  { q: 'What is the photo size for SSC exam forms?',
    a: 'For SSC (Staff Selection Commission) exam forms, the photo should be between 20KB to 50KB in JPEG format. The dimensions are typically 3.5cm × 4.5cm (passport size) with a plain white background. Our tool automatically compresses your photo to meet these exact requirements.' },
  { q: 'What is the signature size for government job forms?',
    a: 'For most government job forms including SSC, Railway, and Banking exams, the signature file should be between 10KB to 20KB in JPEG format on a white background. The signature should be clear and on a white or off-white background.' },
  { q: 'How to reduce photo size to 20KB online?',
    a: 'Upload your photo on GovPhoto Resizer, select the "SSC Photo" preset (20–50KB), and click Resize. The tool automatically compresses your photo to the required size while maintaining quality. You can then download the resized JPG instantly.' },
  { q: 'What photo format is required for UPSC application?',
    a: 'UPSC requires JPEG/JPG format with file size between 20KB to 300KB. Dimensions should be 200×230 pixels with a plain white or off-white background. Our UPSC preset handles all these requirements automatically.' },
  { q: 'Is this tool free to use?',
    a: 'Yes, GovPhoto Resizer is completely free to use. No registration, login, or payment required. Your images are processed securely in memory and are never stored on our servers.' },
  { q: 'What is passport size photo dimensions in pixels?',
    a: 'Passport size photo dimensions are 3.5cm × 4.5cm, which is approximately 413×531 pixels at 300 DPI or 200×230 pixels at standard screen resolution. Our tool can output the exact required pixel dimensions.' },
  { q: 'Can I convert PNG to JPG for government forms?',
    a: 'Yes! Our tool automatically converts PNG images to JPG/JPEG format as required by most government exam forms. Any transparent background is replaced with white during the conversion.' },
  { q: 'My photo is too large (above 50KB), how to reduce it?',
    a: 'Simply upload your photo, select the appropriate preset (e.g., SSC Photo for 20–50KB), and click Resize. Our algorithm uses smart compression to bring the file size down to the required range without significantly affecting image quality.' },
  { q: 'Does the tool store my photos?',
    a: 'No. Your photos are processed entirely in server memory and deleted immediately after processing. We do not store, save, or share any images you upload. This is a zero data retention system.' },
  { q: 'What if my exam has a different size requirement?',
    a: 'Use the "Custom Size" preset! Enter your required minimum and maximum KB values, and the tool will compress your image to fit exactly within that range.' },
];

export default function FAQSection() {
  return (
    <section id="faq" className="py-14 sm:py-20 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="section-title">Frequently Asked Questions</h2>
          <p className="section-sub">Common questions about photo &amp; signature requirements for government job forms</p>
        </div>

        {/* Native <details>/<summary> — accessible, zero-JS accordion */}
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <details key={i} className="faq-item" {...(i === 0 ? { open: true } : {})}>
              <summary>
                <h3 className="font-semibold text-slate-800 text-sm sm:text-base pr-2">{faq.q}</h3>
              </summary>
              <div className="faq-answer">
                <p>{faq.a}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
