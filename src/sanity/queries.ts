import { client } from './client'

export interface Post {
  _id: string
  title: string
  slug: { current: string }
  excerpt: string
  publishedAt: string
  _updatedAt?: string
  body: unknown[]
  coverImage?: { asset: { _ref: string } }
  seoTitle?: string
  seoDescription?: string
}

export async function getAllPosts(): Promise<Post[]> {
  return client.fetch(
        `*[_type == "post" && publishedAt <= now()] | order(publishedAt desc) {
      _id, title, slug, excerpt, publishedAt, _updatedAt, coverImage, seoTitle, seoDescription
    }`
  )
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  return client.fetch(
        `*[_type == "post" && slug.current == $slug && publishedAt <= now()][0] {
      _id, title, slug, excerpt, publishedAt, _updatedAt, body, coverImage, seoTitle, seoDescription
    }`,
    { slug }
  )
}
