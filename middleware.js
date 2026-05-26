// Vercel Edge Middleware
// Handles 301 redirects from legacy UUID URLs to SEO-friendly slug URLs

// Only run on routes that could be legacy URLs or need bot meta
export const config = {
    matcher: [
        '/article/:id*',
        '/opinion/:id*',
        '/:category/:slug',
        '/opiniao/:slug'
    ],
};

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

const UUID_REGEX = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i;

export default async function middleware(request) {
    const url = new URL(request.url);
    const path = url.pathname;

    // 1. Handle Legacy UUID Redirects
    const articleMatch = path.match(/^\/article\/([^/]+)$/i);
    const opinionMatch = path.match(/^\/opinion\/([^/]+)$/i);

    if ((articleMatch || opinionMatch)) {
        const rawId = articleMatch ? articleMatch[1] : opinionMatch[1];

        if (UUID_REGEX.test(rawId)) {
            const table = articleMatch ? 'news_articles' : 'opinion_articles';
            try {
                const supabaseUrl = process.env.VITE_SUPABASE_URL;
                const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

                if (supabaseUrl && supabaseKey) {
                    const res = await fetch(
                        `${supabaseUrl}/rest/v1/${table}?id=eq.${rawId}&select=slug,category`,
                        {
                            headers: {
                                'apikey': supabaseKey,
                                'Authorization': `Bearer ${supabaseKey}`,
                            }
                        }
                    );

                    const data = await res.json();
                    if (data && data.length > 0) {
                        const item = data[0];
                        if (item.slug) {
                            let targetPath;
                            if (articleMatch) {
                                const category = item.category
                                    ? item.category.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-')
                                    : 'geral';
                                targetPath = `/${category}/${item.slug}`;
                            } else {
                                targetPath = `/opiniao/${item.slug}`;
                            }
                            return Response.redirect(new URL(targetPath, request.url), 301);
                        }
                    }
                }
            } catch (err) {
                console.error('Middleware redirect error:', err);
            }
        }
        return undefined;
    }

    // 2. SEO Injection for Bots (Only for slug-based detail pages)
    const userAgent = (request.headers.get('user-agent') || '').toLowerCase();
    const isBot = BOT_USER_AGENTS.some(bot => userAgent.includes(bot));

    // Only apply bot injection to potential article/opinion pages
    const isDetailPath = /^\/[a-z0-9-]+\/[a-z0-9-]+$/i.test(path) || path.startsWith('/opiniao/');

    if (isBot && isDetailPath) {
        const rewriteUrl = new URL('/api/og-meta', request.url);
        rewriteUrl.searchParams.set('path', path);
        return fetch(rewriteUrl.toString(), {
            headers: request.headers,
        });
    }

    return undefined;
}
