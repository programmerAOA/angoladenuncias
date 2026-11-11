import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

const SITE_URL = "https://www.semfiltros.com";

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
    process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    res.status(500).send("Missing Supabase configuration");
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  const now = new Date().toISOString();

  const { data: opinions, error } = await supabase
    .from("opinion_articles")
    .select("id, slug, title, author, created_at, updated_at, scheduled_at")
    .eq("published", true)
    .or(`scheduled_at.is.null,scheduled_at.lte.${now}`)
    .not("slug", "is", null)
    .order("updated_at", { ascending: false })
    .limit(50000);

  if (error) {
    console.error("Supabase error:", error);
    res.status(500).send("Error fetching opinions");
    return;
  }

  const urls = (opinions || [])
    .filter((o) => o.slug)
    .map((o) => {
      const loc = `${SITE_URL}/opiniao/${escapeXml(o.slug!)}`;
      const lastmod = o.updated_at || o.scheduled_at || o.created_at || now;
      return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
  res.status(200).send(xml);
}
