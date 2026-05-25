// Vercel Edge Middleware
// Detects social media crawlers and rewrites requests to the OG meta serverless function
// For non-Next.js projects, we use the standard Web API

const BOT_USER_AGENTS = [
    'facebookexternalhit',
    'facebot',
    'whatsapp',
    'twitterbot',
    'linkedinbot',
    'slackbot',
    'telegrambot',
    'discordbot',
    'googlebot',
    'bingbot',
    'embedly',
    'quora link preview',
    'showyoubot',
    'outbrain',
    'pinterest',
    'vkshare',
    'w3c_validator',
    'iframely',
];

export const config = {
    matcher: ['/(.*)'],
};

export default async function middleware(request) {
    const userAgent = (request.headers.get('user-agent') || '').toLowerCase();
    const url = new URL(request.url);
    const path = url.pathname;

    // 1. Handle Redirects from legacy UUID URLs to SEO-friendly slug URLs
    const articleMatch = path.match(/^\/article\/([a-f0-9-]{36})$/i);
    const opinionMatch = path.match(/^\/opinion\/([a-f0-9-]{36})$/i);

    if (articleMatch || opinionMatch) {
        const id = articleMatch ? articleMatch[1] : opinionMatch[1];
        const table = articleMatch ? 'news_articles' : 'opinion_articles';

        try {
            const supabaseUrl = process.env.VITE_SUPABASE_URL;
            const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

            const response = await fetch(
                `${supabaseUrl}/rest/v1/${table}?id=eq.${id}&select=slug,category`,
                {
                    headers: {
                        'apikey': supabaseKey,
                        'Authorization': `Bearer ${supabaseKey}`,
                    }
                }
            );

            const data = await response.json();
            if (data && data.length > 0) {
                const item = data[0];
                const slug = item.slug;
                const category = item.category ? item.category.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") : 'geral';

                const targetPath = articleMatch ? `/${category}/${slug}` : `/opiniao/${slug}`;
                return Response.redirect(new URL(targetPath, request.url), 301);
            }
        } catch (err) {
            console.error('Middleware redirect error:', err);
        }
    }

    // 2. SEO Injection for Bots
    // Check if the request is from a known crawler/bot
    const isBot = BOT_USER_AGENTS.some(bot => userAgent.includes(bot));

    if (isBot) {
        // Rewrite to the OG meta API function, passing the original path
        const rewriteUrl = new URL('/api/og-meta', request.url);
        rewriteUrl.searchParams.set('path', url.pathname);

        return fetch(rewriteUrl.toString(), {
            headers: request.headers,
        });
    }

    // For normal users, continue to the SPA (return undefined = no-op)
    return undefined;
}

// Check if the request is from a known crawler/bot
const isBot = BOT_USER_AGENTS.some(bot => userAgent.includes(bot));

if (isBot) {
    // Rewrite to the OG meta API function, passing the original path
    const rewriteUrl = new URL('/api/og-meta', request.url);
    rewriteUrl.searchParams.set('path', url.pathname);

    return fetch(rewriteUrl.toString(), {
        headers: request.headers,
    });
}

// For normal users, continue to the SPA (return undefined = no-op)
return undefined;
}
