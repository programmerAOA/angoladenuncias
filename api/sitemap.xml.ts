import type { VercelRequest, VercelResponse } from "@vercel/node";

const SITE_URL = "https://www.semfiltros.com";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const now = new Date().toISOString();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${SITE_URL}/sitemap-static.xml</loc>
    <lastmod>${now}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${SITE_URL}/sitemap-articles.xml</loc>
    <lastmod>${now}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${SITE_URL}/sitemap-opinions.xml</loc>
    <lastmod>${now}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${SITE_URL}/sitemap-news.xml</loc>
    <lastmod>${now}</lastmod>
  </sitemap>
</sitemapindex>`;

  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
  res.status(200).send(xml);
}
