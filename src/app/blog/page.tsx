import Link from 'next/link'
import { getAllPosts } from '@/sanity/queries'
import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { SITE_URL, SITE_NAME, OG_IMAGE } from '@/lib/site'

const BLOG_TITLE = 'Blog — Photo & Signature Tips for Govt Job Forms | SignResizer'
const BLOG_DESCRIPTION = 'Learn about photo and signature size requirements for SSC, UPSC, Railway, Banking and all Indian government exams.'

export const metadata: Metadata = {
  title: BLOG_TITLE,
  description: BLOG_DESCRIPTION,
  alternates: {
    canonical: '/blog',
  },
  // Without these, /blog inherits the homepage's Open Graph tags and og:url.
  openGraph: {
    title: BLOG_TITLE,
    description: BLOG_DESCRIPTION,
    url: `${SITE_URL}/blog`,
    type: 'website',
    locale: 'en_IN',
    siteName: SITE_NAME,
    images: [{ url: OG_IMAGE, width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: BLOG_TITLE,
    description: BLOG_DESCRIPTION,
  },
}

export const revalidate = 60

export default async function BlogPage() {
  const posts = await getAllPosts()

  return (
    <>
    <Header />
    <main className="min-h-screen bg-bg">
      {/* Header */}
      <div className="bg-surface border-b border-border py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <Link href="/" className="text-link text-sm font-medium hover:underline mb-4 inline-block">
            ← Back to SignResizer
          </Link>
          <h1 className="text-3xl font-bold text-text mt-2">Blog</h1>
          <p className="text-muted mt-2">
            Photo &amp; signature guides for SSC, UPSC, Railway and all government exams
          </p>
        </div>
      </div>

      {/* Posts Grid */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        {posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-subtle text-lg">No posts yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2">
            {posts.map((post) => (
              <Link
                key={post._id}
                href={`/blog/${post.slug.current}`}
                className="bg-surface rounded-2xl border border-border p-6 hover:border-primary hover:shadow-md transition-all duration-200 group"
              >
                <p className="text-xs text-subtle mb-2">
                  {new Date(post.publishedAt).toLocaleDateString('en-IN', {
                    day: 'numeric', month: 'long', year: 'numeric',
                  })}
                </p>
                <h2 className="text-lg font-bold text-text group-hover:text-link transition-colors leading-snug mb-2">
                  {post.title}
                </h2>
                <p className="text-sm text-muted line-clamp-3">{post.excerpt}</p>
                <span className="inline-block mt-4 text-sm font-semibold text-link group-hover:underline">
                  Read more →
                </span>
              </Link>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="mt-12 bg-primary-soft border border-border rounded-2xl p-6 text-center">
          <p className="font-bold text-text mb-1">Need to resize your photo right now?</p>
          <p className="text-sm text-muted mb-4">Use our free tool — no registration required</p>
          <Link
            href="/"
            className="inline-block bg-primary hover:bg-primary-hover text-on-primary font-bold px-6 py-3 rounded-xl transition-colors"
          >
            Resize Photo Free →
          </Link>
        </div>
      </div>
    </main>
    <Footer />
    </>
  )
}
