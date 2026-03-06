const blogPosts = [
  { title: 'SSC CGL Photo Size 2026', slug: 'ssc-cgl-photo-size-2026-complete-guide', icon: '📋' },
  { title: 'UPSC Photo Requirements 2026', slug: 'upsc-photo-signature-size-requirements', icon: '🏛️' },
  { title: 'Railway RRB Photo Size Guide', slug: 'railway-rrb-ntpc-photo-size-guide', icon: '🚂' },
  { title: 'SBI PO and Clerk Photo Size', slug: 'sbi-po-clerk-photo-size-requirements', icon: '🏦' },
  { title: 'Passport Size Photo in Pixels', slug: 'passport-size-photo-dimensions-pixels', icon: '🛂' },
  { title: 'How to Resize Photo to 20KB', slug: 'resize-photo-20kb-government-forms', icon: '📸' },
];

export default function BlogLinks() {
  return (
    <section className="max-w-4xl mx-auto px-4 py-12">
      <h2 className="text-2xl font-bold text-slate-800 mb-2 text-center">
        Photo Size Guides
      </h2>

      <p className="text-slate-500 text-center mb-8 text-sm">
        Complete requirements for every major government exam
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {blogPosts.map((post) => {
          const url = `/blog/${post.slug}`;

          return (
            <a
              key={post.slug}
              href={url}
              className="flex items-center gap-3 bg-white border border-slate-100 rounded-xl px-4 py-3 hover:border-sky-200 hover:shadow-sm transition-all group"
            >
              <span className="text-xl">{post.icon}</span>

              <span className="text-sm font-semibold text-slate-700 group-hover:text-sky-600 transition-colors leading-snug">
                {post.title}
              </span>

              <span className="ml-auto text-slate-300 group-hover:text-sky-400 transition-colors">
                →
              </span>
            </a>
          );
        })}
      </div>
    </section>
  );
}
