export const config = {
    runtime: 'edge',
};

const SITE_URL = 'https://www.semfiltros.com';
const SITE_NAME = 'Sem Filtros';

async function fetchFromSupabase(table, selectFields, filter = '') {
    const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://qsjhkhiohpfslfkpjoeb.supabase.co';
    const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_-cH7Xx0cAUTgGeK7KLFP4w_a2TLTf9x';

    const url = `${supabaseUrl}/rest/v1/${table}?select=${selectFields}${filter}&order=created_at.desc&limit=1000`;

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
        console.error(`[Sitemap] Fetch failed for ${table}:`, err);
        throw err; // Propagate error
    }
}

export default async function handler(req) {
    try {
        const [articles, opinions] = await Promise.all([
            fetchFromSupabase('news_articles', 'id,created_at', '&published=eq.true'),
            fetchFromSupabase('opinion_articles', 'id,created_at'),
        ]);

        const now = new Date().toISOString();
        let urls = '';

        const addUrl = (path, priority = '0.5', freq = 'weekly', lastmod = now) => {
            urls += `
  <url>
    <loc>${SITE_URL}${path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${freq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
        };

        addUrl('/', '1.0', 'hourly');

        // Static Pages
        ['/videos', '/opinioes', '/edicao-digital'].forEach(p => addUrl(p, '0.8', 'daily'));

        // Function to create category slug matching the frontend getCategorySlug
        const getCategorySlug = (cat) => cat.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

        // Categories
        ['Política', 'Economia', 'Sociedade', 'Internacional'].forEach(cat =>
            addUrl(`/${getCategorySlug(cat)}`, '0.6', 'daily')
        );

        // Articles
        articles.forEach(art => addUrl(`/article/${art.id}`, '0.9', 'weekly', art.created_at || now));

        // Opinions
        opinions.forEach(op => addUrl(`/opinion/${op.id}`, '0.8', 'weekly', op.created_at || now));

        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

        return new Response(xml, {
            headers: { 'Content-Type': 'application/xml; charset=utf-8' },
        });
    } catch (err) {
        return new Response(`Error: ${err.message}`, { status: 500 });
    }
}
