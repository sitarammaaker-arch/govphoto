import dynamic from 'next/dynamic';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import ResizerTool from '@/components/ResizerTool';
import AdUnit from '@/components/AdUnit';

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

const AD_SLOTS = {
  topBanner: '1111111111',
  postResult: '2222222222',
  midContent: '3333333333',
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

const blogPosts = [
  { title: 'SSC CGL Photo Size 2026', slug: 'ssc-cgl-photo-size-2026-complete-guide', icon: '📋' },
  { title: 'UPSC Photo Requirements 2026', slug: 'upsc-photo-signature-size-requirements', icon: '🏛️' },
  { title: 'Railway RRB Photo Size Guide', slug: 'railway-rrb-ntpc-photo-size-guide', icon: '🚂' },
  { title: 'SBI PO & Clerk Photo Size', slug: 'sbi-po-clerk-photo-size-requirements', icon: '🏦' },
  { title: 'Passport Size Photo in Pixels', slug: 'passport-size-photo-dimensions-pixels', icon: '🛂' },
  { title: 'How to Resize Photo to 20KB', slug: 'resize-photo-20kb-government-forms', icon: '📸' },
]

export default function Home() {
  return (
    <>
      <main className="min-h-screen">
        <Header />
        <HeroSection />

        <AdUnit
          slot={AD_SLOTS.topBanner}
          format="horizontal"
          className="ad-between-sections"
        />

        <section id="tool" className="py-10 sm:py-14 bg-gradient-to-b from-sky-50 to-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <ResizerTool postResultAdSlot={AD_SLOTS.postResult} />
          </div>
        </section>

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

        {/* ── Blog Posts Section ── */}
        <section className="max-w-4xl mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold text-slate-800 mb-2 text-center">
            Photo Size Guides
          </h2>
          <p className="text-slate-500 text-center mb-8 text-sm">
            Complete requirements for every major government exam
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {blogPosts.map((post) => (
              
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="flex items-center gap-3 bg-white border border-slate-100 rounded-xl px-4 py-3 hover:border-sky-200 hover:shadow-sm transition-all group"
              >
                <span className="text-xl">{post.icon}</span>
                <span className="text-sm font-semibold text-slate-700 group-hover:text-sky-600 transition-colors leading-snug">
                  {post.title}
                </span>
                <span className="ml-auto text-slate-300 group-hover:text-sky-400 transition-colors">→</span>
              </a>
            ))}
          </div>
        </section>

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
