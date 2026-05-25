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
    const safeImage = image || DEFAULT_IMAGE;
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

    <!-- Open Graph -->
    <meta property="og:type" content="${type}" />
    <meta property="og:site_name" content="${SITE_NAME}" />
    <meta property="og:title" content="${safeTitle}" />
    <meta property="og:description" content="${safeDesc}" />
    <meta property="og:image" content="${safeImage}" />
    <meta property="og:url" content="${safeUrl}" />

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@SemFiltros" />
    <meta name="twitter:title" content="${safeTitle}" />
    <meta name="twitter:description" content="${safeDesc}" />
    <meta name="twitter:image" content="${safeImage}" />

    <link rel="canonical" href="${safeUrl}" />
    <link rel="icon" type="image/png" href="/logo.png" />
    
    <script type="application/ld+json">
        ${JSON.stringify(jsonLd)}
    </script>
</head>
<body>
    <p>A carregar <a href="${safeUrl}">${safeTitle}</a>...</p>
</body>
</html>`;
}

async function fetchFromSupabase(table, filterField, filterValue, selectFields) {
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
        console.error('Missing Supabase environment variables');
        return null;
    }

    const url = `${supabaseUrl}/rest/v1/${table}?${filterField}=eq.${filterValue}&select=${selectFields}`;

    try {
        const response = await fetch(url, {
            headers: {
                'apikey': supabaseKey,
                'Authorization': `Bearer ${supabaseKey}`,
                'Accept': 'application/json',
            },
        });

        if (!response.ok) {
            console.error(`Supabase fetch error: ${response.status}`);
            return null;
        }

        const data = await response.json();
        return data && data.length > 0 ? data[0] : null;
    } catch (err) {
        console.error('Supabase fetch exception:', err);
        return null;
    }
}

export default async function handler(req) {
    const url = new URL(req.url);
    const path = url.searchParams.get('path') || '';

    // Legacy Redirects Check (Middleware should handle this, but as fallback)
    const legacyArticleMatch = path.match(/^\/article\/([a-f0-9-]+)$/i);
    const legacyOpinionMatch = path.match(/^\/opinion\/([a-f0-9-]+)$/i);

    // New Slug-based paths
    const articleSlugMatch = path.match(/^\/([a-z0-9-]+)\/([a-z0-9-]+)$/i);
    const opinionSlugMatch = path.match(/^\/opiniao\/([a-z0-9-]+)$/i);
    const categoryMatch = path.match(/^\/([a-z0-9-]+)$/i);

    try {
        // 1. Category Pages
        if (categoryMatch && !legacyArticleMatch && !legacyOpinionMatch && !articleSlugMatch && !opinionSlugMatch) {
            const slug = categoryMatch[1].toLowerCase();
            if (VALID_CATEGORIES[slug]) {
                return new Response(buildOgHtml({
                    title: `Notícias sobre ${VALID_CATEGORIES[slug]} - ${SITE_NAME}`,
                    description: `Acompanhe as últimas notícias e reportagens de ${VALID_CATEGORIES[slug]} no ${SITE_NAME}. Jornalismo de investigação independente e atualizações em tempo real.`,
                    url: `${SITE_URL}/${slug}`,
                    type: 'website',
                }), {
                    headers: { 'Content-Type': 'text/html; charset=utf-8' },
                });
            }
        }

        // 2. News Articles (UUID or Slug)
        if (legacyArticleMatch || articleSlugMatch) {
            const filterField = legacyArticleMatch ? 'id' : 'slug';
            const filterValue = legacyArticleMatch ? legacyArticleMatch[1] : articleSlugMatch[2];

            const data = await fetchFromSupabase(
                'news_articles',
                filterField,
                filterValue,
                'title,summary,image_url,author,category,created_at,scheduled_at,seo_keywords'
            );

            if (data) {
                const categorySlug = data.category ? data.category.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") : 'geral';
                return new Response(buildOgHtml({
                    title: data.title,
                    description: data.summary || `Artigo por ${data.author} - ${SITE_NAME}`,
                    image: data.image_url,
                    url: legacyArticleMatch ? `${SITE_URL}/article/${filterValue}` : `${SITE_URL}/${categorySlug}/${data.slug}`,
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

        // 3. Opinion Articles (UUID or Slug)
        if (legacyOpinionMatch || opinionSlugMatch) {
            const filterField = legacyOpinionMatch ? 'id' : 'slug';
            const filterValue = legacyOpinionMatch ? legacyOpinionMatch[1] : opinionSlugMatch[1];

            const data = await fetchFromSupabase(
                'opinion_articles',
                filterField,
                filterValue,
                'title,author,excerpt,avatar_url,created_at,scheduled_at,seo_keywords'
            );

            if (data) {
                return new Response(buildOgHtml({
                    title: `"${data.title}" — ${data.author}`,
                    description: data.excerpt || `Opinião de ${data.author} - ${SITE_NAME}`,
                    image: data.avatar_url,
                    url: legacyOpinionMatch ? `${SITE_URL}/opinion/${filterValue}` : `${SITE_URL}/opiniao/${data.slug}`,
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
