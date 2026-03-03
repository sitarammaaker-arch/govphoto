import { client } from './client'

export interface Post {
  _id: string
  title: string
  slug: { current: string }
  excerpt: string
  publishedAt: string
  body: unknown[]
  coverImage?: { asset: { _ref: string } }
  seoTitle?: string
  seoDescription?: string
}

export async function getAllPosts(): Promise<Post[]> {
  return client.fetch(
    `*[_type == "post"] | order(publishedAt desc) {
      _id, title, slug, excerpt, publishedAt, coverImage, seoTitle, seoDescription
    }`
  )
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  return client.fetch(
    `*[_type == "post" && slug.current == $slug][0] {
      _id, title, slug, excerpt, publishedAt, body, coverImage, seoTitle, seoDescription
    }`,
    { slug }
  )
}
