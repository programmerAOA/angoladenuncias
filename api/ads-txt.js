export const config = {
    runtime: 'edge',
};

async function fetchFromSupabase(key) {
    const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
        console.error('Missing Supabase environment variables');
        return null;
    }

    const url = `${supabaseUrl}/rest/v1/system_settings?select=value&key=eq.${key}&limit=1`;

    try {
        const response = await fetch(url, {
            headers: {
                'apikey': supabaseKey,
                'Authorization': `Bearer ${supabaseKey}`,
                'Accept': 'application/json',
            },
        });

        if (!response.ok) {
            console.error(`Supabase fetch error for settings: ${response.status}`);
            return null;
        }

        const data = await response.json();
        return data.length > 0 ? data[0].value : null;
    } catch (err) {
        console.error(`Supabase fetch exception for settings:`, err);
        return null;
    }
}

export default async function handler(req) {
    try {
        const settings = await fetchFromSupabase('site_validation');

        if (!settings || settings.method !== 'ads.txt' || !settings.content) {
            return new Response('', {
                status: 200,
                headers: { 'Content-Type': 'text/plain; charset=utf-8' },
            });
        }

        return new Response(settings.content, {
            headers: {
                'Content-Type': 'text/plain; charset=utf-8',
                'Cache-Control': 'public, max-age=3600, s-maxage=3600',
            },
        });
    } catch (err) {
        console.error('ads.txt generation error:', err);
        return new Response('', {
            status: 500,
            headers: { 'Content-Type': 'text/plain; charset=utf-8' },
        });
    }
}
