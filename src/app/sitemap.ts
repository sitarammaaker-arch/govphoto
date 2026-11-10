import { MetadataRoute } from 'next';
import { getAllPosts, type Post } from '@/sanity/queries';
import { SITE_URL } from '@/lib/site';

// Re-read the post list hourly so newly published posts appear without a deploy.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let posts: Post[] = [];
  try {
    posts = await getAllPosts();
  } catch {
    // If the CMS is unreachable, still serve the static pages rather than
    // failing the whole sitemap.
  }

  const latestPost = posts.reduce<string | undefined>((latest, p) => {
    const d = p._updatedAt || p.publishedAt;
    return !latest || d > latest ? d : latest;
  }, undefined);

  return [
    { url: SITE_URL, changeFrequency: 'weekly', priority: 1 },
    {
      url: `${SITE_URL}/blog`,
      lastModified: latestPost ? new Date(latestPost) : undefined,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...posts.map((post) => ({
      url: `${SITE_URL}/blog/${post.slug.current}`,
      lastModified: new Date(post._updatedAt || post.publishedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    { url: `${SITE_URL}/privacy-policy`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE_URL}/disclaimer`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE_URL}/terms`, changeFrequency: 'yearly', priority: 0.3 },
  ];
}
