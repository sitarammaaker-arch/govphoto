import Link from 'next/link'
import { getAllPosts } from '@/sanity/queries'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog — Photo & Signature Tips for Govt Job Forms | SignResizer',
  description: 'Learn about photo and signature size requirements for SSC, UPSC, Railway, Banking and all Indian government exams.',
}

export const revalidate = 60

export default async function BlogPage() {
  const posts = await getAllPosts()

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <Link href="/" className="text-sky-600 text-sm font-medium hover:underline mb-4 inline-block">
            ← Back to SignResizer
          </Link>
          <h1 className="text-3xl font-bold text-slate-800 mt-2">Blog</h1>
          <p className="text-slate-500 mt-2">
            Photo &amp; signature guides for SSC, UPSC, Railway and all government exams
          </p>
        </div>
      </div>

      {/* Posts Grid */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        {posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-slate-400 text-lg">No posts yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2">
            {posts.map((post) => (
              <Link
                key={post._id}
                href={`/blog/${post.slug.current}`}
                className="bg-white rounded-2xl border border-slate-100 p-6 hover:border-sky-200 hover:shadow-md transition-all duration-200 group"
              >
                <p className="text-xs text-slate-400 mb-2">
                  {new Date(post.publishedAt).toLocaleDateString('en-IN', {
                    day: 'numeric', month: 'long', year: 'numeric',
                  })}
                </p>
                <h2 className="text-lg font-bold text-slate-800 group-hover:text-sky-600 transition-colors leading-snug mb-2">
                  {post.title}
                </h2>
                <p className="text-sm text-slate-500 line-clamp-3">{post.excerpt}</p>
                <span className="inline-block mt-4 text-sm font-semibold text-sky-600 group-hover:underline">
                  Read more →
                </span>
              </Link>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="mt-12 bg-sky-50 border border-sky-100 rounded-2xl p-6 text-center">
          <p className="font-bold text-slate-800 mb-1">Need to resize your photo right now?</p>
          <p className="text-sm text-slate-500 mb-4">Use our free tool — no registration required</p>
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
