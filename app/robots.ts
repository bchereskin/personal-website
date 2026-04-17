import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/', '/shared/', '/secure/'],
    },
    sitemap: 'https://www.brettchereskin.com/sitemap.xml',
  };
}
