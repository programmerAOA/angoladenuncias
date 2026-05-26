export const config = {
    runtime: 'edge',
};

const SITE_URL = 'https://www.semfiltros.com';
const SITE_NAME = 'Sem Filtros';

async function fetchFromSupabase(table, selectFields, filter = '') {
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

    const url = `${supabaseUrl}/rest/v1/${table}?select=${selectFields}${filter}&order=created_at.desc&limit=2000`;

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
        return [];
    }
}

export default async function handler(req) {
    try {
        const now = new Date().toISOString();
        const [articles, opinions] = await Promise.all([
            fetchFromSupabase('news_articles', 'slug,category,created_at', `&published=eq.true&or=(scheduled_at.is.null,scheduled_at.lte.${now})`),
            fetchFromSupabase('opinion_articles', 'slug,created_at', `&published=eq.true&or=(scheduled_at.is.null,scheduled_at.lte.${now})`),
        ]);


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
        ['/videos', '/opinioes', '/edicao-digital', '/publicidade', '/servicos', '/linha-editorial', '/ficha-tecnica', '/privacidade', '/termos'].forEach(p => addUrl(p, '0.8', 'daily'));

        // Function to create category slug
        const getCategorySlug = (cat) => cat ? cat.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") : 'geral';

        // Categories
        ['Política', 'Economia', 'Sociedade', 'Internacional', 'Mundo', 'Desporto', 'Cultura', 'Tecnologia', 'Saúde'].forEach(cat =>
            addUrl(`/${getCategorySlug(cat)}`, '0.7', 'daily')
        );

        // Articles
        articles.forEach(art => {
            const catSlug = getCategorySlug(art.category);
            if (art.slug) {
                addUrl(`/${catSlug}/${art.slug}`, '0.9', 'weekly', art.created_at || now);
            }
        });

        // Opinions
        opinions.forEach(op => {
            if (op.slug) {
                addUrl(`/opiniao/${op.slug}`, '0.8', 'weekly', op.created_at || now);
            }
        });

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
