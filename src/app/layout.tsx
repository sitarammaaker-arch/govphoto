import type { Metadata } from 'next';
import React from 'react';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import DeferredThirdParty from '@/components/DeferredThirdParty';

// Display face for h1–h3 only (see globals.css). Body text uses the system
// font, so this is the single font download on the site.
const displayFont = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['700', '800'],
  variable: '--font-display',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.signresizer.com'),
  title: 'SignResizer — Free Photo & Signature Resizer for Govt Forms',
  description: 'Resize photo to 20KB–50KB and signature to 10KB–20KB for SSC, UPSC, Railway, Banking and all Indian government exam forms. Free, instant, no registration.',
  alternates: {
    canonical: '/',
  },
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
    images: [{ url: 'https://www.signresizer.com/og-image.png', width: 1200, height: 630 }],
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
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const adsensePublisherId = process.env.NEXT_PUBLIC_ADSENSE_ID;

  return (
    <html lang="en" className={displayFont.variable}>
      <head>
        {/* gtag stub only — the library itself is loaded after first paint by
            <DeferredThirdParty>; calls queue in dataLayer until then. */}
        <script dangerouslySetInnerHTML={{ __html: `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'AW-18001608633');
    gtag('config', 'G-KC96GXG9E2');
  `}} />

        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="font-body bg-bg text-text antialiased">
        {children}
        <DeferredThirdParty adsenseId={adsensePublisherId} />
      </body>
    </html>
  );
}
