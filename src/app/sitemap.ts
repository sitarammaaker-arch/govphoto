import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://signresizer.com',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: 'https://signresizer.com/privacy-policy',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: 'https://signresizer.com/disclaimer',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: 'https://signresizer.com/terms',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];
}
