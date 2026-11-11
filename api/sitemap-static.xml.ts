import type { VercelRequest, VercelResponse } from "@vercel/node";

const SITE_URL = "https://www.semfiltros.com";

// Prioridade decrescente — páginas mais importantes primeiro
const STATIC_PAGES = [
  { path: "/", changefreq: "hourly", priority: "1.0" },
  { path: "/sociedade", changefreq: "hourly", priority: "0.9" },
  { path: "/crimes", changefreq: "hourly", priority: "0.9" },
  { path: "/politica", changefreq: "hourly", priority: "0.9" },
  { path: "/economia", changefreq: "hourly", priority: "0.9" },
  { path: "/internacional", changefreq: "daily", priority: "0.9" },
  { path: "/desporto", changefreq: "daily", priority: "0.9" },
  { path: "/cultura", changefreq: "daily", priority: "0.8" },
  { path: "/tecnologia", changefreq: "daily", priority: "0.8" },
  { path: "/saude", changefreq: "daily", priority: "0.8" },
  { path: "/opinioes", changefreq: "daily", priority: "0.8" },
  { path: "/videos", changefreq: "daily", priority: "0.7" },
  { path: "/edicao-digital", changefreq: "weekly", priority: "0.6" },
  { path: "/publicidade", changefreq: "monthly", priority: "0.4" },
  { path: "/servicos", changefreq: "monthly", priority: "0.5" },
  { path: "/sobre-nos", changefreq: "monthly", priority: "0.5" },
  { path: "/equipa-editorial", changefreq: "monthly", priority: "0.5" },
  { path: "/linha-editorial", changefreq: "monthly", priority: "0.5" },
  { path: "/ficha-tecnica", changefreq: "monthly", priority: "0.4" },
  { path: "/fact-checking", changefreq: "weekly", priority: "0.6" },
  { path: "/correcoes", changefreq: "weekly", priority: "0.5" },
  { path: "/termos", changefreq: "yearly", priority: "0.3" },
  { path: "/privacidade", changefreq: "yearly", priority: "0.3" },
];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const now = new Date().toISOString();

  const urls = STATIC_PAGES.map(
    ({ path, changefreq, priority }) => `  <url>
    <loc>${SITE_URL}${path}</loc>
    <lastmod>${now.split("T")[0]}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
  ).join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, s-maxage=86400, stale-while-revalidate=604800");
  res.status(200).send(xml);
}
