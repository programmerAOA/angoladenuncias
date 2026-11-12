export const config = {
    runtime: 'edge',
};

const SITE_URL = 'https://www.semfiltros.com';
const DEFAULT_IMAGE = `${SITE_URL}/logo.png`;
const SITE_NAME = 'Sem Filtros';

const DEFAULT_KEYWORDS = [
    "notícias de angola hoje",
    "últimas notícias angola",
    "atualidade angolana",
    "política angola atual",
    "economia angola notícias",
    "notícias em tempo real angola"
].join(", ");

const VALID_CATEGORIES = {
    'sociedade': 'Sociedade',
    'politica': 'Política',
    'economia': 'Economia',
    'mundo': 'Mundo',
    'desporto': 'Desporto',
    'cultura': 'Cultura',
    'tecnologia': 'Tecnologia',
    'saude': 'Saúde',
    'opinioes': 'Opinião',
    'internacional': 'Internacional'
};

function escapeHtml(str) {
    if (!str) return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function buildOgHtml({ title, description, image, url, type = 'article', category, author, publishedDate, keywords }) {
    const safeTitle = escapeHtml(title || SITE_NAME);
    const safeDesc = escapeHtml(description || 'Sem Filtros - O seu portal de notícias de confiança sem filtros.');
    let safeImage = (image || DEFAULT_IMAGE).trim();
    if (safeImage.startsWith('//')) {
        safeImage = `https:${safeImage}`;
    } else if (safeImage.startsWith('/')) {
        safeImage = `${SITE_URL}${safeImage}`;
    }
    const safeUrl = url || SITE_URL;
    const safeKeywords = keywords || DEFAULT_KEYWORDS;

    // Structured Data (JSON-LD)
    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Organization",
                "@id": `${SITE_URL}/#organization`,
                "name": SITE_NAME,
                "url": SITE_URL,
                "logo": {
                    "@type": "ImageObject",
                    "url": DEFAULT_IMAGE
                }
            },
            {
                "@type": "WebSite",
                "@id": `${SITE_URL}/#website`,
                "url": SITE_URL,
                "name": SITE_NAME,
                "publisher": { "@id": `${SITE_URL}/#organization` }
            }
        ]
    };

    if (type === 'article') {
        jsonLd["@graph"].push({
            "@type": "NewsArticle",
            "headline": safeTitle,
            "description": safeDesc,
            "image": [safeImage],
            "datePublished": publishedDate || new Date().toISOString(),
            "author": {
                "@type": "Person",
                "name": author || SITE_NAME
            },
            "publisher": { "@id": `${SITE_URL}/#organization` },
            "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": safeUrl
            }
        });

        jsonLd["@graph"].push({
            "@type": "BreadcrumbList",
            "itemListElement": [
                {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Home",
                    "item": SITE_URL
                },
                {
                    "@type": "ListItem",
                    "position": 2,
                    "name": category || "Notícias",
                    "item": safeUrl
                }
            ]
        });
    }

    return `<!DOCTYPE html>
<html lang="pt-AO">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${safeTitle} | ${SITE_NAME}</title>
    <meta name="description" content="${safeDesc}" />
    <meta name="keywords" content="${safeKeywords}" />
    <meta name="robots" content="index, follow" />

    <!-- Open Graph / WhatsApp / Facebook -->
    <meta property="og:type" content="${type}" />
    <meta property="og:site_name" content="${SITE_NAME}" />
    <meta property="og:title" content="${safeTitle}" />
    <meta property="og:description" content="${safeDesc}" />
    <meta property="og:image" content="${safeImage}" />
    <meta property="og:image:secure_url" content="${safeImage}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="${safeTitle}" />
    <meta property="og:url" content="${safeUrl}" />
    <meta property="og:locale" content="pt_AO" />

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@SemFiltros" />
    <meta name="twitter:title" content="${safeTitle}" />
    <meta name="twitter:description" content="${safeDesc}" />
    <meta name="twitter:image" content="${safeImage}" />
    <meta name="twitter:image:alt" content="${safeTitle}" />

    <link rel="canonical" href="${safeUrl}" />
    <link rel="icon" type="image/png" href="/logo.png" />
    <meta http-equiv="refresh" content="0;url=${safeUrl}" />
    <script>window.location.replace("${safeUrl}");</script>
    
    <script type="application/ld+json">
        ${JSON.stringify(jsonLd)}
    </script>
</head>
<body>
    <p>A carregar <a href="${safeUrl}">${safeTitle}</a>...</p>
</body>
</html>`;
}

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "https://qsjhkhiohpfslfkpjoeb.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY || "sb_publishable_-cH7Xx0cAUTgGeK7KLFP4w_a2TLTf9x";

async function fetchFromSupabase(table, filterField, filterValue, selectFields) {
    if (!SUPABASE_URL || !SUPABASE_KEY || !filterValue) {
        return null;
    }

    const encodedVal = encodeURIComponent(filterValue);
    const url = `${SUPABASE_URL}/rest/v1/${table}?${filterField}=eq.${encodedVal}&select=${selectFields}&limit=1`;

    try {
        const response = await fetch(url, {
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Accept': 'application/json',
            },
        });

        if (!response.ok) {
            console.error(`Supabase fetch error for ${filterValue}: ${response.status}`);
            return null;
        }

        const data = await response.json();
        return Array.isArray(data) && data.length > 0 ? data[0] : null;
    } catch (err) {
        console.error('Supabase fetch exception:', err);
        return null;
    }
}

export default async function handler(req) {
    const url = new URL(req.url);
    const rawPath = url.searchParams.get('path') || '';
    const cleanPath = (rawPath.split('?')[0] || '').replace(/^\/+/, '').replace(/\/+$/, '');
    const segments = cleanPath.split('/').filter(Boolean);

    try {
        // 1. Category Pages (e.g. /politica, /sociedade)
        if (segments.length === 1) {
            const catKey = segments[0].toLowerCase();
            if (VALID_CATEGORIES[catKey]) {
                return new Response(buildOgHtml({
                    title: `Notícias sobre ${VALID_CATEGORIES[catKey]} - ${SITE_NAME}`,
                    description: `Acompanhe as últimas notícias e reportagens de ${VALID_CATEGORIES[catKey]} no ${SITE_NAME}. Jornalismo de investigação independente e actualizações em tempo real.`,
                    url: `${SITE_URL}/${catKey}`,
                    type: 'website',
                }), {
                    headers: { 'Content-Type': 'text/html; charset=utf-8' },
                });
            }
        }

        // 2. Direct Legacy Article /article/:id or /article/:slug
        if (segments[0] === 'article' && segments[1]) {
            const val = segments[1];
            let data = await fetchFromSupabase(
                'news_articles',
                'id',
                val,
                'slug,title,summary,image_url,author,category,created_at,scheduled_at,seo_keywords'
            );
            if (!data) {
                data = await fetchFromSupabase(
                    'news_articles',
                    'slug',
                    val,
                    'slug,title,summary,image_url,author,category,created_at,scheduled_at,seo_keywords'
                );
            }
            if (data) {
                const categorySlug = data.category
                    ? data.category.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-')
                    : 'geral';
                const canonicalUrl = data.slug ? `${SITE_URL}/${categorySlug}/${data.slug}` : `${SITE_URL}/article/${val}`;
                return new Response(buildOgHtml({
                    title: data.title,
                    description: data.summary || `Artigo por ${data.author} - ${SITE_NAME}`,
                    image: data.image_url,
                    url: canonicalUrl,
                    type: 'article',
                    author: data.author,
                    category: data.category,
                    publishedDate: data.scheduled_at || data.created_at,
                    keywords: data.seo_keywords
                }), {
                    headers: { 'Content-Type': 'text/html; charset=utf-8' },
                });
            }
        }

        // 3. Opinion Articles /opinion/:id or /opiniao/:slug
        if ((segments[0] === 'opinion' || segments[0] === 'opiniao') && segments[1]) {
            const val = segments[1];
            let data = await fetchFromSupabase(
                'opinion_articles',
                'slug',
                val,
                'slug,title,author,excerpt,avatar_url,created_at,scheduled_at,seo_keywords'
            );
            if (!data) {
                data = await fetchFromSupabase(
                    'opinion_articles',
                    'id',
                    val,
                    'slug,title,author,excerpt,avatar_url,created_at,scheduled_at,seo_keywords'
                );
            }
            if (data) {
                const canonicalUrl = `${SITE_URL}/opiniao/${data.slug || val}`;
                return new Response(buildOgHtml({
                    title: `"${data.title}" — ${data.author}`,
                    description: data.excerpt || `Opinião de ${data.author} - ${SITE_NAME}`,
                    image: data.avatar_url,
                    url: canonicalUrl,
                    type: 'article',
                    author: data.author,
                    category: 'Opinião',
                    publishedDate: data.scheduled_at || data.created_at,
                    keywords: data.seo_keywords
                }), {
                    headers: { 'Content-Type': 'text/html; charset=utf-8' },
                });
            }
        }

        // 4. Category + Article Slug (e.g. /politica/titulo-do-artigo)
        if (segments.length >= 2) {
            const articleSlug = segments[segments.length - 1];
            let data = await fetchFromSupabase(
                'news_articles',
                'slug',
                articleSlug,
                'slug,title,summary,image_url,author,category,created_at,scheduled_at,seo_keywords'
            );
            if (!data) {
                data = await fetchFromSupabase(
                    'news_articles',
                    'id',
                    articleSlug,
                    'slug,title,summary,image_url,author,category,created_at,scheduled_at,seo_keywords'
                );
            }
            if (data) {
                const categorySlug = data.category
                    ? data.category.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-')
                    : segments[0];
                const canonicalUrl = `${SITE_URL}/${categorySlug}/${data.slug || articleSlug}`;
                return new Response(buildOgHtml({
                    title: data.title,
                    description: data.summary || `Artigo por ${data.author} - ${SITE_NAME}`,
                    image: data.image_url,
                    url: canonicalUrl,
                    type: 'article',
                    author: data.author,
                    category: data.category,
                    publishedDate: data.scheduled_at || data.created_at,
                    keywords: data.seo_keywords
                }), {
                    headers: { 'Content-Type': 'text/html; charset=utf-8' },
                });
            }
        }
    } catch (err) {
        console.error('OG Meta error:', err);
    }

    // Default Fallback
    return new Response(buildOgHtml({
        title: SITE_NAME,
        description: 'Sem Filtros - O seu portal de notícias de confiança sem filtros.',
        image: DEFAULT_IMAGE,
        url: SITE_URL,
        type: 'website',
    }), {
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
}
