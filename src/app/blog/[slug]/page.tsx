import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getPostBySlug, getAllPosts, type Post } from '@/sanity/queries'
import type { Metadata } from 'next'
import { PortableText } from '@portabletext/react'
import AdUnit from '@/components/AdUnit'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { SITE_URL, SITE_NAME, OG_IMAGE } from '@/lib/site'

export const revalidate = 60

const BLOG_AD_SLOTS = {
  midArticle: '2041092902',
  endArticle: '1401041066',
} as const

// Only insert a mid-article ad when there's enough content on either side
// of it — short posts just get the end-of-article ad.
const MIN_BLOCKS_FOR_MID_AD = 6

const RELATED_POST_COUNT = 6

// Slug words that say nothing about the topic ("ssc-cgl-photo-size-2026" is
// about "ssc" and "cgl", not "photo" or "size").
const GENERIC_SLUG_WORDS = new Set([
  'photo', 'signature', 'size', 'guide', 'complete', 'requirements', 'exam',
  'government', 'forms', 'form', 'to', 'at', 'for', 'vs', 'and', 'the', 'in',
])

function slugTopics(slug: string): string[] {
  return slug
    .split('-')
    .filter((word) => word && !/^\d+$/.test(word) && !GENERIC_SLUG_WORDS.has(word))
}

/**
 * Posts that share topic words with the current slug come first (SSC CGL →
 * other SSC posts); the rest of the list is filled with the newest posts.
 * `allPosts` arrives newest-first and Array.sort is stable, so ties keep
 * that order.
 */
function pickRelatedPosts(currentSlug: string, allPosts: Post[]): Post[] {
  const topics = new Set(slugTopics(currentSlug))
  return allPosts
    .filter((p) => p.slug.current !== currentSlug)
    .map((post) => ({
      post,
      shared: slugTopics(post.slug.current).filter((w) => topics.has(w)).length,
    }))
    .sort((a, b) => b.shared - a.shared)
    .slice(0, RELATED_POST_COUNT)
    .map(({ post }) => post)
}

export async function generateStaticParams() {
  const posts = await getAllPosts()
  return posts.map((p) => ({ slug: p.slug.current }))
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) return {}

  const title = post.seoTitle || `${post.title} | SignResizer Blog`
  const description = post.seoDescription || post.excerpt
  const url = `${SITE_URL}/blog/${slug}`

  return {
    title,
    description,
    alternates: {
      canonical: `/blog/${slug}`,
    },
    // Without these, the post inherits the homepage's Open Graph tags
    // (including og:url), so every shared post looked like the homepage.
    openGraph: {
      title,
      description,
      url,
      type: 'article',
      locale: 'en_IN',
      siteName: SITE_NAME,
      publishedTime: post.publishedAt,
      modifiedTime: post._updatedAt || post.publishedAt,
      images: [{ url: OG_IMAGE, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}

export default async function PostPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const [post, allPosts] = await Promise.all([getPostBySlug(slug), getAllPosts()])
  if (!post) notFound()

  const url = `${SITE_URL}/blog/${slug}`
  const relatedPosts = pickRelatedPosts(slug, allPosts)

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.seoDescription || post.excerpt,
    datePublished: post.publishedAt,
    dateModified: post._updatedAt || post.publishedAt,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    image: OG_IMAGE,
    inLanguage: 'en-IN',
    author: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/android-chrome-512x512.png` },
    },
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}/blog` },
      { '@type': 'ListItem', position: 3, name: post.title, item: url },
    ],
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-bg">

        {/* Header */}
        <div className="bg-surface border-b border-border py-8">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <nav aria-label="Breadcrumb" className="text-sm text-muted">
              <Link href="/" className="text-link font-medium hover:underline">Home</Link>
              <span aria-hidden="true" className="mx-2">/</span>
              <Link href="/blog" className="text-link font-medium hover:underline">Blog</Link>
            </nav>
            <p className="text-xs text-muted mt-4">
              <time dateTime={post.publishedAt}>
                {new Date(post.publishedAt).toLocaleDateString('en-IN', {
                  day: 'numeric', month: 'long', year: 'numeric',
                })}
              </time>
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold text-text mt-2 leading-snug">
              {post.title}
            </h1>
            <p className="text-muted mt-3 text-base leading-relaxed">{post.excerpt}</p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
          <article className="bg-surface rounded-2xl border border-border p-6 sm:p-10 max-w-none prose prose-slate prose-lg prose-headings:font-extrabold prose-headings:text-text prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4 prose-h2:pb-2 prose-h2:border-b prose-h2:border-border prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3 prose-h3:text-link prose-p:text-muted prose-p:leading-8 prose-p:mb-4 prose-li:text-muted prose-li:leading-7 prose-ul:my-4 prose-ol:my-4 prose-strong:text-text prose-strong:font-bold prose-a:text-link prose-a:no-underline hover:prose-a:underline">
            {post.body && post.body.length >= MIN_BLOCKS_FOR_MID_AD ? (
              <>
                <PortableText
                  value={post.body.slice(0, Math.ceil(post.body.length / 2)) as Parameters<typeof PortableText>[0]['value']}
                />
                <div className="not-prose">
                  <AdUnit
                    slot={BLOG_AD_SLOTS.midArticle}
                    format="in-article"
                    className="ad-mid-article"
                  />
                </div>
                <PortableText
                  value={post.body.slice(Math.ceil(post.body.length / 2)) as Parameters<typeof PortableText>[0]['value']}
                />
              </>
            ) : (
              post.body && (
                <PortableText value={post.body as Parameters<typeof PortableText>[0]['value']} />
              )
            )}
          </article>

          <AdUnit
            slot={BLOG_AD_SLOTS.endArticle}
            format="rectangle"
            className="ad-end-article"
          />

          {/* CTA */}
          <div className="mt-8 bg-primary-soft border border-border rounded-2xl p-6 text-center">
            <p className="font-bold text-text mb-1">Ready to resize your photo?</p>
            <p className="text-sm text-muted mb-4">
              Use our free tool for SSC, UPSC, Railway and all government exams
            </p>
            <Link
              href="/#tool"
              className="inline-block bg-primary hover:bg-primary-hover text-on-primary font-bold px-6 py-3 rounded-xl transition-colors"
            >
              Resize Photo Free →
            </Link>
          </div>

          {/* Related guides — internal links so readers (and crawlers) can
              reach the other exam guides from every post. */}
          {relatedPosts.length > 0 && (
            <section aria-labelledby="related-guides" className="mt-10">
              <h2 id="related-guides" className="text-xl font-bold text-text mb-4">
                Related photo &amp; signature guides
              </h2>
              <ul className="grid gap-3 sm:grid-cols-2">
                {relatedPosts.map((related) => (
                  <li key={related._id}>
                    <Link
                      href={`/blog/${related.slug.current}`}
                      className="block h-full bg-surface rounded-xl border border-border p-4 text-sm font-semibold text-text hover:border-primary hover:text-link transition-colors"
                    >
                      {related.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

      </main>
      <Footer />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  )
}
