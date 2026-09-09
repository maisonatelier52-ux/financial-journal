import { NextResponse } from 'next/server';
import { getAllCategories } from '@/lib/db';

export async function GET() {
  const baseUrl = 'https://www.financial-journal.xyz';
  const categories = getAllCategories();

  const urls = categories.map(cat => `  <url>
    <loc>${baseUrl}/category/${cat.slug}</loc>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}

