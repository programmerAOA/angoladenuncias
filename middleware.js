// Vercel Edge Middleware
// Handles 301 redirects from legacy UUID URLs to SEO-friendly slug URLs
// and injects dynamic Open Graph previews for social bots (WhatsApp, Facebook, etc.)

export const config = {
    matcher: [
        '/article/:id*',
        '/opinion/:id*',
        '/:category/:slug*',
        '/opiniao/:slug*'
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
    'applebot',
    'googlebot',
    'google-inspectiontool',
    'bingbot',
    'embedly',
    'quora link preview',
    'showyoubot',
    'outbrain',
    'pinterest',
    'vkshare',
    'w3c_validator',
    'iframely',
    'skypeuripreview',
];

const UUID_REGEX = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i;
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "https://qsjhkhiohpfslfkpjoeb.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY || "sb_publishable_-cH7Xx0cAUTgGeK7KLFP4w_a2TLTf9x";

export default async function middleware(request) {
    const url = new URL(request.url);
    const path = url.pathname;
    const userAgent = (request.headers.get('user-agent') || '').toLowerCase();
    const isBot = BOT_USER_AGENTS.some(bot => userAgent.includes(bot));

    // 1. Social Bot SEO / Open Graph preview interception
    const cleanPath = path.replace(/\/+$/, '');
    const isDetailPath = /^\/[a-z0-9_-]+\/[a-z0-9_-]+/i.test(cleanPath) ||
        cleanPath.startsWith('/opiniao/') ||
        cleanPath.startsWith('/article/') ||
        cleanPath.startsWith('/opinion/');

    if (isBot && isDetailPath) {
        const rewriteUrl = new URL('/api/og-meta', request.url);
        rewriteUrl.searchParams.set('path', cleanPath);
        return fetch(rewriteUrl.toString(), {
            headers: {
                'user-agent': userAgent,
                'accept': 'text/html',
            },
        });
    }

    // 2. Handle Legacy UUID Redirects (for human visitors)
    const articleMatch = path.match(/^\/article\/([^/]+)$/i);
    const opinionMatch = path.match(/^\/opinion\/([^/]+)$/i);

    if ((articleMatch || opinionMatch)) {
        const rawId = articleMatch ? articleMatch[1] : opinionMatch[1];

        if (UUID_REGEX.test(rawId)) {
            const table = articleMatch ? 'news_articles' : 'opinion_articles';
            try {
                if (SUPABASE_URL && SUPABASE_KEY) {
                    const res = await fetch(
                        `${SUPABASE_URL}/rest/v1/${table}?id=eq.${rawId}&select=slug,category`,
                        {
                            headers: {
                                'apikey': SUPABASE_KEY,
                                'Authorization': `Bearer ${SUPABASE_KEY}`,
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

    return undefined;
}
