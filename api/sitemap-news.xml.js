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

async function fetchFromSupabase(table, selectFields, filter = '') {
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

    const url = `${supabaseUrl}/rest/v1/${table}?select=${selectFields}${filter}&order=created_at.desc&limit=100`;

    try {
        const response = await fetch(url, {
            headers: {
                'apikey': supabaseKey,
                'Authorization': `Bearer ${supabaseKey}`,
                'Accept': 'application/json',
            },
        });

        if (!response.ok) throw new Error(`Supabase error ${response.status}`);
        const data = await response.json();
        return Array.isArray(data) ? data : [];
    } catch (err) {
        console.error(`[News Sitemap] Fetch failed:`, err);
        return [];
    }
}

export default async function handler(req) {
    try {
        // Only fetch articles from last 48 hours for Google News
        const fortyEightHoursAgo = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();
        const articles = await fetchFromSupabase('news_articles', 'slug,category,created_at,title', `&published=eq.true&created_at=gt.${fortyEightHoursAgo}`);

        const now = new Date().toISOString();
        let urls = '';

        const getCategorySlug = (cat) => cat ? cat.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") : 'geral';

        articles.forEach(art => {
            if (!art.slug) return;
            const catSlug = getCategorySlug(art.category);
            const date = art.created_at || now;
            urls += `
  <url>
    <loc>${SITE_URL}/${catSlug}/${art.slug}</loc>
    <news:news>
      <news:publication>
        <news:name>${escapeXml(SITE_NAME)}</news:name>
        <news:language>pt</news:language>
      </news:publication>
      <news:publication_date>${date}</news:publication_date>
      <news:title>${escapeXml(art.title)}</news:title>
    </news:news>
  </url>`;
        });

        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${urls}
</urlset>`;

        return new Response(xml, {
            headers: { 'Content-Type': 'application/xml; charset=utf-8' },
        });
    } catch (err) {
        return new Response(`Error: ${err.message}`, { status: 500 });
    }
}
