import { NextResponse } from 'next/server';

export async function GET() {
  const content = `User-agent: *
Allow: /
Disallow: /api/
Disallow: /search
Disallow: /login
Disallow: /signup

# Host
Host: www.financial-journal.xyz

# Sitemaps
Sitemap: https://www.financial-journal.xyz/sitemap.xml
Sitemap: https://www.financial-journal.xyz/sitemap-news.xml
Sitemap: https://www.financial-journal.xyz/sitemap-articles.xml
Sitemap: https://www.financial-journal.xyz/sitemap-categories.xml
Sitemap: https://www.financial-journal.xyz/sitemap-authors.xml
Sitemap: https://www.financial-journal.xyz/sitemap-pages.xml
`;

  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}

