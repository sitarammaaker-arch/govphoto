import dynamic from 'next/dynamic';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import ResizerTool from '@/components/ResizerTool';
import AdUnit from '@/components/AdUnit';

// ─── Dynamic imports for below-fold sections ──────────────────────────────────
const ExamPresets = dynamic(() => import('@/components/ExamPresets'), {
  loading: () => <SectionSkeleton height={480} />,
  ssr: true,
});

const HowItWorks = dynamic(() => import('@/components/HowItWorks'), {
  loading: () => <SectionSkeleton height={400} />,
  ssr: true,
});

const FAQSection = dynamic(() => import('@/components/FAQSection'), {
  loading: () => <SectionSkeleton height={600} />,
  ssr: true,
});

const Footer = dynamic(() => import('@/components/Footer'), {
  loading: () => null,
  ssr: true,
});

function SectionSkeleton({ height }: { height: number }) {
  return <div className="bg-white" style={{ minHeight: height }} aria-hidden="true" />;
}

// ─── Ad Slot IDs ──────────────────────────────────────────────────────────────
// Replace these values with your real slot IDs from Google AdSense dashboard.
// Format: AdSense dashboard → Ads → By ad unit → Create ad unit → get numeric ID.
const AD_SLOTS = {
  // Placement 1: Between hero and tool.
  // Leaderboard — users who scrolled past the hero are engaged.
  // High viewability, pre-tool. RPM typically strong here.
  topBanner: '1111111111',

  // Placement 2: After the tool result download.
  // Medium Rectangle — user just completed their task (downloaded image).
  // "Post-task" is the highest-intent moment for ad engagement.
  // This slot lives inside ResizerTool and is shown only after a result exists.
  // Slot ID passed via prop to ResizerTool — see ResizerTool.tsx.
  postResult: '2222222222',

  // Placement 3: Between ExamPresets and HowItWorks.
  // In-content horizontal — natural editorial break between two sections.
  // Users in content-reading mode. Good for contextual ads.
  midContent: '3333333333',

  // Placement 4: Above Footer.
  // Wide banner — every page visitor sees this before leaving.
  // "Exit intent" zone — catches users who didn't convert on other placements.
  aboveFooter: '4444444444',
} as const;
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is the photo size for SSC exam forms?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'For SSC exam forms, the photo should be 20KB to 50KB in JPEG format. Dimensions are 3.5cm x 4.5cm with a plain white background.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the signature size for government job forms?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'For most government job forms including SSC, Railway and Banking exams, the signature file should be 10KB to 20KB in JPEG format on a white background.',
      },
    },
    {
      '@type': 'Question',
      name: 'How to reduce photo size to 20KB online?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Upload your photo on SignResizer, select the SSC Photo preset (20-50KB) and click Resize. The tool automatically compresses your photo to the required size.',
      },
    },
    {
      '@type': 'Question',
      name: 'What photo format is required for UPSC application?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'UPSC requires JPEG format with file size between 20KB to 300KB. Dimensions should be 200x230 pixels with a plain white background.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is SignResizer free to use?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, SignResizer is completely free to use. No registration, login or payment required. Images are never stored on the server.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is passport size photo dimensions in pixels?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Passport size photo dimensions are 3.5cm x 4.5cm which equals 413x531 pixels at 300 DPI. For UPSC and banking exams the required size is 200x230 pixels.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I convert PNG to JPG for government forms?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. SignResizer automatically converts PNG images to JPG format as required by most government exam forms. Transparent backgrounds are replaced with white.',
      },
    },
    {
      '@type': 'Question',
      name: 'My photo is above 50KB, how to reduce it?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Upload your photo to SignResizer, select the SSC Photo preset for 20-50KB and click Resize. Smart compression brings the file size down without affecting quality.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does SignResizer store my photos?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. Photos are processed entirely in server memory and deleted immediately after processing. SignResizer has zero data retention.',
      },
    },
    {
      '@type': 'Question',
      name: 'What if my exam has a different size requirement?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Use the Custom Size preset on SignResizer. Enter your required minimum and maximum KB values and the tool will compress your image to fit exactly within that range.',
      },
    },
  ],
}
export default function Home() {
  return (
    <>
    <main className="min-h-screen">
      <Header />
      <HeroSection />

      {/* ── Ad Placement 1: Top Banner ────────────────────────────────────────
          Horizontal leaderboard between hero and tool.
          Psychographic: user is already engaged (scrolled), not yet committed
          to the tool action — naturally pauses here to orient themselves.
          Viewport position: ~400–600px from top on desktop.
          Format: horizontal (728×90 desk / 320×50 mobile) + responsive.    ── */}
      <AdUnit
        slot={AD_SLOTS.topBanner}
        format="horizontal"
        className="ad-between-sections"
      />

      {/* Tool section — no ads inside the critical path */}
      <section id="tool" className="py-10 sm:py-14 bg-gradient-to-b from-sky-50 to-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          {/* Post-result ad slot ID passed in — ResizerTool renders it
              only after a successful resize + download, which is the single
              best moment for ad engagement on this page. */}
          <ResizerTool postResultAdSlot={AD_SLOTS.postResult} />
        </div>
      </section>

      {/* ── Ad Placement 3: Mid-Content ───────────────────────────────────────
          Between Exam Presets and How It Works.
          Psychographic: user is in "learning / researching" mode, not task mode.
          Content ads (exam-related) should match well here.
          Format: horizontal for natural editorial feel.                     ── */}
      <div className="cv-auto">
        <ExamPresets />
      </div>

      <AdUnit
        slot={AD_SLOTS.midContent}
        format="horizontal"
        className="ad-between-sections"
      />

      <div className="cv-auto">
        <HowItWorks />
      </div>

      <div className="cv-auto">
        <FAQSection />
      </div>

      {/* ── Ad Placement 4: Above Footer ──────────────────────────────────────
          Wide banner just before footer.
          Psychographic: user finished reading the page — exit-intent zone.
          All sessions pass through here. Good floor-level RPM.
          Format: rectangle on mobile (more viewable), horizontal on desktop. ── */}
      <AdUnit
        slot={AD_SLOTS.aboveFooter}
        format="rectangle"
        className="ad-above-footer"
      />

      <Footer />
    </main>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
    />
    </>
  );
}
