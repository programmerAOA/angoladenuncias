export const config = {
    runtime: 'edge',
};

const SITE_URL = 'https://www.semfiltros.com';
const DEFAULT_IMAGE = `${SITE_URL}/logo.png`;
const SITE_NAME = 'Sem Filtros';

function escapeHtml(str) {
    if (!str) return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function buildOgHtml({ title, description, image, url, type = 'article' }) {
    const safeTitle = escapeHtml(title || SITE_NAME);
    const safeDesc = escapeHtml(description || 'Sem Filtros - O seu portal de notícias de confiança sem filtros.');
    const safeImage = image || DEFAULT_IMAGE;
    const safeUrl = url || SITE_URL;

    return `<!DOCTYPE html>
<html lang="pt-AO">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${safeTitle} | ${SITE_NAME}</title>
    <meta name="description" content="${safeDesc}" />

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

    <!-- Redirect real users to the SPA -->
    <meta http-equiv="refresh" content="0;url=${safeUrl}" />
    <link rel="icon" type="image/png" href="/logo.png" />
</head>
<body>
    <p>A redirecionar para <a href="${safeUrl}">${safeTitle}</a>...</p>
</body>
</html>`;
}

async function fetchFromSupabase(table, id, selectFields) {
    const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
        console.error('Missing Supabase environment variables');
        return null;
    }

    const url = `${supabaseUrl}/rest/v1/${table}?id=eq.${id}&select=${selectFields}`;

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

    // Parse the path to determine content type and ID
    const articleMatch = path.match(/^\/article\/([a-f0-9-]+)$/i);
    const opinionMatch = path.match(/^\/opinion\/([a-f0-9-]+)$/i);

    if (!articleMatch && !opinionMatch) {
        // Fallback: return generic OG tags
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

    try {
        if (articleMatch) {
            const id = articleMatch[1];
            const data = await fetchFromSupabase(
                'news_articles',
                id,
                'title,summary,image_url,author'
            );

            if (!data) {
                return new Response(buildOgHtml({
                    title: 'Artigo não encontrado',
                    url: `${SITE_URL}/article/${id}`,
                }), {
                    headers: { 'Content-Type': 'text/html; charset=utf-8' },
                });
            }

            return new Response(buildOgHtml({
                title: data.title,
                description: data.summary || `Artigo por ${data.author} - ${SITE_NAME}`,
                image: data.image_url || DEFAULT_IMAGE,
                url: `${SITE_URL}/article/${id}`,
            }), {
                headers: { 'Content-Type': 'text/html; charset=utf-8' },
            });
        }

        if (opinionMatch) {
            const id = opinionMatch[1];
            const data = await fetchFromSupabase(
                'opinion_articles',
                id,
                'title,author,excerpt,avatar_url'
            );

            if (!data) {
                return new Response(buildOgHtml({
                    title: 'Opinião não encontrada',
                    url: `${SITE_URL}/opinion/${id}`,
                }), {
                    headers: { 'Content-Type': 'text/html; charset=utf-8' },
                });
            }

            return new Response(buildOgHtml({
                title: `"${data.title}" — ${data.author}`,
                description: data.excerpt || `Opinião de ${data.author} - ${SITE_NAME}`,
                image: data.avatar_url || DEFAULT_IMAGE,
                url: `${SITE_URL}/opinion/${id}`,
            }), {
                headers: { 'Content-Type': 'text/html; charset=utf-8' },
            });
        }
    } catch (err) {
        console.error('OG Meta error:', err);
        return new Response(buildOgHtml({
            title: SITE_NAME,
            url: SITE_URL,
        }), {
            headers: { 'Content-Type': 'text/html; charset=utf-8' },
        });
    }
}
