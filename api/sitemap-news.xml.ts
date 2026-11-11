import { createClient } from "@supabase/supabase-js";

const SITE_URL = "https://www.semfiltros.com";
const PUBLICATION_NAME = "Sem Filtros";
const PUBLICATION_LANGUAGE = "pt";

// Google News Sitemap: apenas notícias das últimas 48 horas
const NEWS_WINDOW_HOURS = 48;

function getCategorySlug(category: string): string {
  return category
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-");
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export default async function handler(req: Request): Promise<Response> {
  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || "";
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    "";

  if (!supabaseUrl || !supabaseKey) {
    return new Response("Missing Supabase configuration", { status: 500 });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  const now = new Date();
  const windowStart = new Date(now.getTime() - NEWS_WINDOW_HOURS * 60 * 60 * 1000).toISOString();
  const nowIso = now.toISOString();

  const { data: articles, error } = await supabase
    .from("news_articles")
    .select("id, slug, title, category, created_at, scheduled_at, image_url, seo_keywords")
    .eq("published", true)
    .or(`scheduled_at.is.null,scheduled_at.lte.${nowIso}`)
    .gte("created_at", windowStart)
    .not("slug", "is", null)
    .not("category", "is", null)
    .order("created_at", { ascending: false })
    .limit(1000);

  if (error) {
    console.error("Supabase error:", error);
    return new Response("Error fetching news articles", { status: 500 });
  }

  const urls = (articles || [])
    .filter((a) => a.slug && a.category)
    .map((a) => {
      const catSlug = getCategorySlug(a.category!);
      const loc = `${SITE_URL}/${catSlug}/${escapeXml(a.slug!)}`;
      const pubDate = a.scheduled_at || a.created_at || nowIso;
      const title = escapeXml(a.title || "");
      const keywords = a.seo_keywords ? escapeXml(a.seo_keywords) : "";

      return `  <url>
    <loc>${loc}</loc>
    <news:news>
      <news:publication>
        <news:name>${escapeXml(PUBLICATION_NAME)}</news:name>
        <news:language>${PUBLICATION_LANGUAGE}</news:language>
      </news:publication>
      <news:publication_date>${pubDate}</news:publication_date>
      <news:title>${title}</news:title>${keywords ? `\n      <news:keywords>${keywords}</news:keywords>` : ""}
    </news:news>${
      a.image_url
        ? `\n    <image:image>\n      <image:loc>${escapeXml(a.image_url)}</image:loc>\n      <image:title>${title}</image:title>\n    </image:image>`
        : ""
    }
  </url>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls}
</urlset>`;

  return new Response(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      // Cache curto — Google News deve ser actualizado a cada 5 min
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
    },
  });
}
