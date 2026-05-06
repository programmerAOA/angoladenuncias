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

export default function middleware(request) {
    const userAgent = (request.headers.get('user-agent') || '').toLowerCase();
    const url = new URL(request.url);

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
