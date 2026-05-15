import { MetadataRoute } from 'next';

export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api/', '/_next/'],
      },
    ],
    sitemap: 'https://mentariwedding.biz.id/sitemap.xml',
  };
}
