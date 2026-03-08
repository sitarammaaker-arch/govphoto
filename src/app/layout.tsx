import type { Metadata } from 'next';
import React from 'react';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'SignResizer — Free Photo & Signature Resizer for Govt Forms',
  description: 'Resize photo to 20KB–50KB and signature to 10KB–20KB for SSC, UPSC, Railway, Banking and all Indian government exam forms. Free, instant, no registration.',
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
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
      <script async src="https://www.googletagmanager.com/gtag/js?id=AW-18001608633"></script>
  <script dangerouslySetInnerHTML={{ __html: `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'AW-18001608633');
  `}} />
  
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="canonical" href="https://www.signresizer.com" />
      </head>
      <body className="font-body bg-slate-50 text-slate-800 antialiased">
        {children}
      </body>
    </html>
  );
}