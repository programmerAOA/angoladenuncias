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
    // Fallback para garantir funcionamento caso as variáveis de ambiente não estejam na Vercel
    const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://qsjhkhiohpfslfkpjoeb.supabase.co';
    const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_-cH7Xx0cAUTgGeK7KLFP4w_a2TLTf9x';

    if (!supabaseUrl || !supabaseKey) {
        console.error(`[Sitemap] Missing Supabase config for ${table}`);
        return [];
    }

    const url = `${supabaseUrl}/rest/v1/${table}?select=${selectFields}${filter}&order=created_at.desc&limit=1000`;

    try {
        const response = await fetch(url, {
            headers: {
                'apikey': supabaseKey,
                'Authorization': `Bearer ${supabaseKey}`,
                'Accept': 'application/json',
            },
        });

        if (!response.ok) {
            console.error(`[Sitemap] Supabase error ${response.status} for ${table}`);
            return [];
        }

        const data = await response.json();
        return Array.isArray(data) ? data : [];
    } catch (err) {
        console.error(`[Sitemap] Fetch failed for ${table}:`, err);
        return [];
    }
}

export default async function handler(req) {
    try {
        console.log('[Sitemap] Starting generation...');

        const [articles, opinions] = await Promise.all([
            fetchFromSupabase('news_articles', 'id,created_at,title', '&published=eq.true'),
            fetchFromSupabase('opinion_articles', 'id,created_at,title'),
        ]);

        console.log(`[Sitemap] Results: ${articles.length} articles, ${opinions.length} opinions`);

        const now = new Date().toISOString();
        const fortyEightHoursAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);

        let urls = '';

        // Helper to add URL entries
        const addUrl = (path, priority = '0.5', freq = 'weekly', lastmod = now, newsData = null) => {
            let entry = `
  <url>
    <loc>${SITE_URL}${path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${freq}</changefreq>
    <priority>${priority}</priority>`;

            if (newsData) {
                entry += `
    <news:news>
      <news:publication>
        <news:name>${escapeXml(SITE_NAME)}</news:name>
        <news:language>pt</news:language>
      </news:publication>
      <news:publication_date>${newsData.date}</news:publication_date>
      <news:title>${escapeXml(newsData.title)}</news:title>
    </news:news>`;
            }

            entry += `
  </url>`;
            urls += entry;
        };

        // 1. Homepage
        addUrl('/', '1.0', 'hourly');

        // 2. Static Pages
        const staticPages = [
            { path: '/videos', p: '0.8', f: 'daily' },
            { path: '/opinioes', p: '0.8', f: 'daily' },
            { path: '/edicao-digital', p: '0.7', f: 'weekly' }
        ];
        staticPages.forEach(p => addUrl(p.path, p.p, p.f));

        // 3. Categories
        ['Política', 'Economia', 'Sociedade', 'Internacional'].forEach(cat =>
            addUrl(`/category/${encodeURIComponent(cat)}`, '0.6', 'daily')
        );

        // 4. Articles
        articles.forEach(art => {
            const date = art.created_at || now;
            const isRecent = new Date(date) > fortyEightHoursAgo;
            addUrl(`/article/${art.id}`, '0.9', 'weekly', date, isRecent ? { date, title: art.title } : null);
        });

        // 5. Opinions
        opinions.forEach(op => {
            const date = op.created_at || now;
            addUrl(`/opinion/${op.id}`, '0.8', 'weekly', date);
        });

        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${urls}
</urlset>`;

        return new Response(xml, {
            headers: {
                'Content-Type': 'application/xml; charset=utf-8',
                'Cache-Control': 'public, max-age=3600, s-maxage=3600',
                'X-Content-Type-Options': 'nosniff'
            },
        });
    } catch (err) {
        console.error('[Sitemap] Critical error:', err);
        return new Response(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${SITE_URL}/</loc>
    <priority>1.0</priority>
  </url>
</urlset>`, {
            headers: { 'Content-Type': 'application/xml; charset=utf-8' },
        });
    }
}
