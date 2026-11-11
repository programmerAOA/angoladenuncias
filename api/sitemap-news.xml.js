export const config = {
    runtime: 'edge',
};

const SITE_URL = 'https://www.semfiltros.com';
const SITE_NAME = 'Sem Filtros';

function escapeXml(str) {
    if (!str) return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

async function fetchRecentArticles() {
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

    if (!supabaseUrl || !supabaseKey) return [];

    const now = new Date().toISOString();
    const fortyEightHoursAgo = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();

    // Busca artigos publicados nas últimas 48h
    // considera tanto created_at como scheduled_at como data de publicação real
    const url = `${supabaseUrl}/rest/v1/news_articles` +
        `?select=slug,category,created_at,scheduled_at,title,image_url,seo_keywords` +
        `&published=eq.true` +
        `&or=(scheduled_at.is.null,scheduled_at.lte.${now})` +
        `&or=(created_at.gte.${fortyEightHoursAgo},scheduled_at.gte.${fortyEightHoursAgo})` +
        `&slug=not.is.null` +
        `&category=not.is.null` +
        `&order=created_at.desc` +
        `&limit=200`;

    try {
        const response = await fetch(url, {
            headers: {
                'apikey': supabaseKey,
                'Authorization': `Bearer ${supabaseKey}`,
                'Accept': 'application/json',
            },
        });

        if (!response.ok) {
            console.error(`[News Sitemap] Supabase error ${response.status}`);
            return [];
        }

        const data = await response.json();
        return Array.isArray(data) ? data : [];
    } catch (err) {
        console.error('[News Sitemap] Fetch failed:', err);
        return [];
    }
}

export default async function handler(req) {
    try {
        const articles = await fetchRecentArticles();
        const now = new Date().toISOString();

        const getCategorySlug = (cat) =>
            cat ? cat.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-') : 'geral';

        let urls = '';

        articles.forEach(art => {
            if (!art.slug || !art.category) return;

            const catSlug = getCategorySlug(art.category);
            const loc = `${SITE_URL}/${catSlug}/${escapeXml(art.slug)}`;
            // Usa scheduled_at se existir, senão created_at
            const pubDate = art.scheduled_at || art.created_at || now;
            const title = escapeXml(art.title || '');
            const keywords = art.seo_keywords ? escapeXml(art.seo_keywords) : '';

            urls += `
  <url>
    <loc>${loc}</loc>
    <news:news>
      <news:publication>
        <news:name>${escapeXml(SITE_NAME)}</news:name>
        <news:language>pt</news:language>
      </news:publication>
      <news:publication_date>${pubDate}</news:publication_date>
      <news:title>${title}</news:title>${keywords ? `\n      <news:keywords>${keywords}</news:keywords>` : ''}
    </news:news>${art.image_url ? `\n    <image:image>\n      <image:loc>${escapeXml(art.image_url)}</image:loc>\n      <image:title>${title}</image:title>\n    </image:image>` : ''}
  </url>`;
        });

        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls}
</urlset>`;

        return new Response(xml, {
            headers: {
                'Content-Type': 'application/xml; charset=utf-8',
                'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
            },
        });
    } catch (err) {
        console.error('[News Sitemap] Error:', err);
        return new Response(`Error: ${err.message}`, { status: 500 });
    }
}
