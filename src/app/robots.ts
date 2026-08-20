import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin',
        '/admin/*',
        '/admin-login',
        '/api/admin',
        '/api/admin/*',
        '/api/queue/*',
      ],
    },
    sitemap: 'https://zimrugby.vercel.app/sitemap.xml',
  };
}
