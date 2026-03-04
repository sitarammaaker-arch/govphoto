import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getPostBySlug, getAllPosts } from '@/sanity/queries'
import type { Metadata } from 'next'
import { PortableText } from '@portabletext/react'

export const revalidate = 60

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
  return {
    title: post.seoTitle || `${post.title} | SignResizer Blog`,
    description: post.seoDescription || post.excerpt,
  }
}

export default async function PostPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) notFound()

  return (
    <main className="min-h-screen bg-slate-50">

      {/* Header */}
      <div className="bg-white border-b border-slate-100 py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <Link href="/blog" className="text-sky-600 text-sm font-medium hover:underline mb-4 inline-block">
            ← Back to Blog
          </Link>
          <p className="text-xs text-slate-400 mt-2">
            {new Date(post.publishedAt).toLocaleDateString('en-IN', {
              day: 'numeric', month: 'long', year: 'numeric',
            })}
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mt-2 leading-snug">
            {post.title}
          </h1>
          <p className="text-slate-500 mt-3">{post.excerpt}</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <article className="className="bg-white rounded-2xl border border-slate-100 p-6 sm:p-10 max-w-none
  prose prose-slate prose-lg
  prose-headings:font-extrabold prose-headings:text-slate-800 prose-headings:tracking-tight
  prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-5 prose-h2:pb-2 prose-h2:border-b prose-h2:border-slate-100
  prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3 prose-h3:text-sky-700
  prose-p:text-slate-600 prose-p:leading-8 prose-p:mb-5
  prose-li:text-slate-600 prose-li:leading-8 prose-li:my-1
  prose-ul:my-5 prose-ul:pl-6
  prose-ol:my-5 prose-ol:pl-6
  prose-strong:text-slate-800 prose-strong:font-bold
  prose-a:text-sky-600 prose-a:font-medium prose-a:no-underline hover:prose-a:underline
  prose-blockquote:border-sky-400 prose-blockquote:bg-sky-50 prose-blockquote:rounded-lg prose-blockquote:px-4">
          {post.body && (
            <PortableText value={post.body as Parameters<typeof PortableText>[0]['value']} />
          )}
        </article>

        {/* CTA */}
        <div className="mt-8 bg-sky-50 border border-sky-100 rounded-2xl p-6 text-center">
          <p className="font-bold text-slate-800 mb-1">Ready to resize your photo?</p>
          <p className="text-sm text-slate-500 mb-4">
            Use our free tool for SSC, UPSC, Railway and all government exams
          </p>
          <Link
            href="/"
            className="inline-block bg-sky-500 hover:bg-sky-600 text-white font-bold px-6 py-3 rounded-xl transition-colors"
          >
            Resize Photo Free →
          </Link>
        </div>
      </div>

    </main>
  )
}
