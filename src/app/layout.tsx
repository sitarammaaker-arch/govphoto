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
    'Free online tool to resize photo and signature for SSC, UPSC, Railway, Banking exam forms. Resize to 20KB-50KB JPEG instantly. No registration. White background. Works on mobile. Number 1 free govt form photo resizer in India.',
  keywords: [
    'government job photo resize', 'SSC photo size', 'UPSC photo size',
    'railway exam photo', 'signature resize', 'photo 20kb', 'photo 50kb',
    'passport size photo online', 'CET photo size', 'police exam photo',
    'banking exam photo', 'sarkari job photo',
  ],
  openGraph: {
    title: 'SignResizer — Free Photo Resizer for Govt Job Forms',
    description: 'Free tool to resize photo and signature for SSC, UPSC, Railway, and all Indian government exams.',
    url: 'https://www.signresizer.com',
    images: [{ url: 'https://www.signresizer.com/og-image.jpg', width: 1200, height: 630 }],
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
        
      </head>
      <body className="font-body bg-slate-50 text-slate-800 antialiased">
        {children}
      </body>
    </html>
  );
}
