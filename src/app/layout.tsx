import type { Metadata } from 'next';
import { Sora } from 'next/font/google';
import './globals.css';

// Load only 3 weights instead of 7 (was Sora 5 + Noto Serif 2).
// adjustFontFallback generates size-matched system font metrics → zero CLS.
const sora = Sora({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['400', '600', '700'],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', '-apple-system', 'sans-serif'],
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  metadataBase: new URL('https://signresizer.com'),
  title: {
    default: ''Resize Photo & Signature for Govt Job Forms | SignResizer',
    template: '%s | SignResizer',   
  },
  description:
    'Free online tool to resize photo and signature for SSC, Railway, CET, UPSC and other government exams. Make photo 20KB, 50KB instantly. No registration needed.',
  keywords: [
    'government job photo resize', 'SSC photo size', 'UPSC photo size',
    'railway exam photo', 'signature resize', 'photo 20kb', 'photo 50kb',
    'passport size photo online', 'CET photo size', 'police exam photo',
    'banking exam photo', 'sarkari job photo',
  ],
  openGraph: {
    title: 'Resize Photo & Signature for Government Job Forms',
    description: 'Free tool to resize photo and signature for SSC, UPSC, Railway, and all Indian government exams.',
    type: 'website', locale: 'en_IN', siteName: 'SignResizer',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Resize Photo & Signature for Govt Job Forms',
    description: 'Free online tool for SSC, UPSC, Railway photo & signature resize.',
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'What is the photo size for SSC exam forms?', acceptedAnswer: { '@type': 'Answer', text: 'For SSC exam forms, the photo should be between 20KB to 50KB in JPEG format, 3.5cm x 4.5cm with a white background.' } },
    { '@type': 'Question', name: 'What is the signature size for government job forms?', acceptedAnswer: { '@type': 'Answer', text: 'For SSC, Railway, and Banking exams the signature file should be 10KB to 20KB in JPEG format on a white background.' } },
    { '@type': 'Question', name: 'How to reduce photo size to 20KB online?', acceptedAnswer: { '@type': 'Answer', text: 'Upload your photo on Sign Resizer, select the SSC Photo preset (20-50KB), and click Resize. The tool automatically compresses your photo to the required size.' } },
    { '@type': 'Question', name: 'What photo format is required for UPSC application?', acceptedAnswer: { '@type': 'Answer', text: 'UPSC requires JPEG/JPG format, 20KB to 300KB, dimensions 200x230 pixels with a plain white background.' } },
    { '@type': 'Question', name: 'Is this tool free to use?', acceptedAnswer: { '@type': 'Answer', text: 'Yes, Sign Resizer is completely free. No registration required. Images are never stored on our servers.' } },
    { '@type': 'Question', name: 'What is passport size photo dimensions in pixels?', acceptedAnswer: { '@type': 'Answer', text: 'Passport size is 3.5cm x 4.5cm — approximately 413x531 pixels at 300 DPI or 200x230 pixels at standard resolution.' } },
  ],
};

const ADSENSE_ID = process.env.NEXT_PUBLIC_ADSENSE_ID;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={sora.variable}>
      <head>
        {/* ── Preconnects ─────────────────────────────────────────────────── */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Preconnect to AdSense CDN so the first ad request is fast.
            Only added when publisher ID is configured. */}
        {ADSENSE_ID && (
          <>
            <link rel="dns-prefetch" href="//pagead2.googlesyndication.com" />
            <link rel="dns-prefetch" href="//googleads.g.doubleclick.net" />
            <link rel="preconnect" href="https://pagead2.googlesyndication.com" crossOrigin="anonymous" />
          </>
        )}

        {/* ── AdSense Script ───────────────────────────────────────────────
            Loaded with `async` — never blocks parsing or LCP.
            strategy="afterInteractive" equivalent: script sits below
            all critical resources in the <head> and the async attr
            means it fetches in parallel and executes when ready.
            Only injected when NEXT_PUBLIC_ADSENSE_ID is set, so
            development builds stay completely ad-free.              ── */}
        {ADSENSE_ID && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_ID}`}
            crossOrigin="anonymous"
          />
        )}

        {/* ── Metadata ────────────────────────────────────────────────────── */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="canonical" href="https://signresizer.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      </head>
      <body className="font-body bg-slate-50 text-slate-800 antialiased">
        {children}
      </body>
    </html>
  );
}
