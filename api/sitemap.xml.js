export const config = {
    runtime: 'edge',
};

const SITE_URL = 'https://semfiltros.vercel.app';

function escapeXml(str) {
    if (!str) return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

async function fetchAllFromSupabase(table, selectFields, filter = '') {
    const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
        console.error('Missing Supabase environment variables');
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
            console.error(`Supabase fetch error for ${table}: ${response.status}`);
            return [];
        }

        return await response.json();
    } catch (err) {
        console.error(`Supabase fetch exception for ${table}:`, err);
        return [];
    }
}

export default async function handler(req) {
    try {
        // Fetch all content in parallel
        const [articles, opinions, videos] = await Promise.all([
            fetchAllFromSupabase('news_articles', 'id,created_at,category', '&published=eq.true'),
            fetchAllFromSupabase('opinion_articles', 'id,created_at'),
            fetchAllFromSupabase('video_news', 'id,created_at'),
        ]);

        const now = new Date().toISOString();

        let urls = '';

        // Homepage
        urls += `
    <url>
        <loc>${SITE_URL}/</loc>
        <lastmod>${now}</lastmod>
        <changefreq>hourly</changefreq>
        <priority>1.0</priority>
    </url>`;

        // Static pages
        const staticPages = [
            { path: '/videos', priority: '0.8', freq: 'daily' },
            { path: '/opinioes', priority: '0.8', freq: 'daily' },
            { path: '/edicao-digital', priority: '0.7', freq: 'weekly' },
            { path: '/publicidade', priority: '0.3', freq: 'monthly' },
            { path: '/termos', priority: '0.2', freq: 'yearly' },
            { path: '/privacidade', priority: '0.2', freq: 'yearly' },
        ];

        for (const page of staticPages) {
            urls += `
    <url>
        <loc>${SITE_URL}${page.path}</loc>
        <changefreq>${page.freq}</changefreq>
        <priority>${page.priority}</priority>
    </url>`;
        }

        // Category pages
        const categories = ['Política', 'Economia', 'Sociedade', 'Internacional', 'Desporto', 'Cultura', 'Tecnologia', 'Saúde', 'Educação', 'Justiça'];
        for (const cat of categories) {
            urls += `
    <url>
        <loc>${SITE_URL}/category/${encodeURIComponent(cat)}</loc>
        <changefreq>daily</changefreq>
        <priority>0.6</priority>
    </url>`;
        }

        // Articles
        for (const article of articles) {
            const lastmod = article.created_at || now;
            urls += `
    <url>
        <loc>${SITE_URL}/article/${article.id}</loc>
        <lastmod>${lastmod}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.9</priority>
    </url>`;
        }

        // Opinions
        for (const opinion of opinions) {
            const lastmod = opinion.created_at || now;
            urls += `
    <url>
        <loc>${SITE_URL}/opinion/${opinion.id}</loc>
        <lastmod>${lastmod}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
    </url>`;
        }

        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}
</urlset>`;

        return new Response(xml, {
            headers: {
                'Content-Type': 'application/xml; charset=utf-8',
                'Cache-Control': 'public, max-age=3600, s-maxage=3600',
            },
        });
    } catch (err) {
        console.error('Sitemap generation error:', err);
        // Return a minimal sitemap on error
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
