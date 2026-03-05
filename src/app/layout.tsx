import type { Metadata } from 'next';
import { Sora } from 'next/font/google';
import './globals.css';

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
  metadataBase: new URL('https://www.signresizer.com'),
  title: {
    default: 'SSC UPSC Railway Photo Resizer — Resize to 20KB Free 2026 | SignResizer',
    template: '%s | SignResizer',
  },
  description:
    'Free online tool to resize photo and signature for SSC, UPSC, Railway, Banking exam forms. Resize to 20KB–50KB JPEG instantly. No registration. White background. Works on mobile. India's #1 govt form photo resizer.',
  keywords: [
    'government job photo resize', 'SSC photo size', 'UPSC photo size',
    'railway exam photo', 'signature resize', 'photo 20kb', 'photo 50kb',
    'passport size photo online', 'CET photo size', 'police exam photo',
    'banking exam photo', 'sarkari job photo',
  ],
  openGraph: {
    title: 'Free Photo & Signature Resizer for Govt Job Forms',
    description: 'Free tool to resize photo and signature for SSC, UPSC, Railway, and all Indian government exams.',
    type: 'website',
    locale: 'en_IN',
    siteName: 'SignResizer',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Resize Photo & Signature for Govt Job Forms | SignResizer',
    description: 'Free online tool for SSC, UPSC, Railway photo & signature resize.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'What is the photo size for SSC exam forms?', acceptedAnswer: { '@type': 'Answer', text: 'For SSC exam forms, the photo should be between 20KB to 50KB in JPEG format, 3.5cm x 4.5cm with a white background.' } },
    { '@type': 'Question', name: 'What is the signature size for government job forms?', acceptedAnswer: { '@type': 'Answer', text: 'For SSC, Railway, and Banking exams the signature file should be 10KB to 20KB in JPEG format on a white background.' } },
    { '@type': 'Question', name: 'How to reduce photo size to 20KB online?', acceptedAnswer: { '@type': 'Answer', text: 'Upload your photo on SignResizer, select the SSC Photo preset (20-50KB), and click Resize.' } },
    { '@type': 'Question', name: 'What photo format is required for UPSC application?', acceptedAnswer: { '@type': 'Answer', text: 'UPSC requires JPEG/JPG format, 20KB to 300KB, dimensions 200x230 pixels with a plain white background.' } },
    { '@type': 'Question', name: 'Is this tool free to use?', acceptedAnswer: { '@type': 'Answer', text: 'Yes, SignResizer is completely free. No registration required. Images are never stored on our servers.' } },
    { '@type': 'Question', name: 'What is passport size photo dimensions in pixels?', acceptedAnswer: { '@type': 'Answer', text: 'Passport size is 3.5cm x 4.5cm — approximately 413x531 pixels at 300 DPI or 200x230 pixels at standard resolution.' } },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={sora.variable}>
      <head>

        {/* ── Google Analytics G-KC96GXG9E2 ── */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-KC96GXG9E2"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-KC96GXG9E2', { page_path: window.location.pathname });
            `,
          }}
        />
{/* ── Google AdSense Verification ── */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5608033229796578"
          crossOrigin="anonymous"
        />

        {/* ── Preconnects ── */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        {/* ── Preconnects ── */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="canonical" href="https://www.signresizer.com" />
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
