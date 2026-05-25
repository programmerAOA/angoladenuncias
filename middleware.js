// Vercel Edge Middleware
// Handles:
// 1. 301 redirects: /article/UUID → /categoria/slug and /opinion/UUID → /opiniao/slug
// 2. SEO meta injection: rewrites bot requests to /api/og-meta
// ORDER IS CRITICAL: redirects first, then bot injection — prevents redirect loops for crawlers.

export const config = {
    matcher: ['/(.*)'],
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

// Paths that should never be redirected or proxied
const SKIP_PATHS = ['/api/', '/assets/', '/_vercel/', '.well-known'];

// UUID regex
const UUID_REGEX = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i;

export default async function middleware(request) {
    const url = new URL(request.url);
    const path = url.pathname;

    // Skip internal/asset paths entirely
    if (SKIP_PATHS.some(p => path.startsWith(p)) || path.includes('.')) {
        return undefined;
    }

    // ─── STEP 1: UUID Redirects (must run before bot detection) ─────────────
    // This ensures Googlebot gets a 301 redirect, not a rewrite to og-meta at the UUID URL
    const articleMatch = path.match(/^\/article\/([^/]+)$/i);
    const opinionMatch = path.match(/^\/opinion\/([^/]+)$/i);

    if (articleMatch || opinionMatch) {
        const rawId = articleMatch ? articleMatch[1] : opinionMatch[1];

        // Only redirect if it looks like a UUID — prevents redirecting slug-based fallback routes
        if (UUID_REGEX.test(rawId)) {
            const table = articleMatch ? 'news_articles' : 'opinion_articles';
            try {
                const supabaseUrl = process.env.VITE_SUPABASE_URL;
                const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

                if (!supabaseUrl || !supabaseKey) {
                    console.error('Middleware: missing Supabase env vars');
                } else {
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

                    if (Array.isArray(data) && data.length > 0) {
                        const item = data[0];
                        const slug = item.slug;

                        // Only redirect if we have a valid slug
                        if (slug) {
                            let targetPath;
                            if (articleMatch) {
                                const category = item.category
                                    ? item.category.toLowerCase()
                                        .normalize('NFD')
                                        .replace(/[\u0300-\u036f]/g, '')
                                        .replace(/\s+/g, '-')
                                    : 'geral';
                                targetPath = `/${category}/${slug}`;
                            } else {
                                targetPath = `/opiniao/${slug}`;
                            }

                            return Response.redirect(new URL(targetPath, request.url), 301);
                        }
                    }
                }
            } catch (err) {
                console.error('Middleware redirect error:', err);
            }
        }
        // If no slug found or not a UUID, allow request to continue to SPA
        return undefined;
    }

    // ─── STEP 2: Bot SEO Injection ───────────────────────────────────────────
    // Only activated for slug-based URLs (crawlers want metadata from those pages)
    const userAgent = (request.headers.get('user-agent') || '').toLowerCase();
    const isBot = BOT_USER_AGENTS.some(bot => userAgent.includes(bot));

    if (isBot) {
        // Rewrite to the OG meta Edge Function, passing the original path
        const rewriteUrl = new URL('/api/og-meta', request.url);
        rewriteUrl.searchParams.set('path', path);

        return fetch(rewriteUrl.toString(), {
            headers: request.headers,
        });
    }

    // ─── STEP 3: Normal users — pass through to SPA ─────────────────────────
    return undefined;
}
