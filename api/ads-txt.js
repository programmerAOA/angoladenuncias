export const config = {
    runtime: 'edge',
};

async function fetchFromSupabase(key) {
    const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "https://qsjhkhiohpfslfkpjoeb.supabase.co";
    const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY || "sb_publishable_-cH7Xx0cAUTgGeK7KLFP4w_a2TLTf9x";

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

const DEFAULT_ADS_TXT = "google.com, pub-4560407429890237, DIRECT, f08c47fec0942fa0";

export default async function handler(req) {
    try {
        const settings = await fetchFromSupabase('site_validation');
        const content = (settings && settings.content) ? settings.content : DEFAULT_ADS_TXT;

        return new Response(content.trim() + "\n", {
            headers: {
                'Content-Type': 'text/plain; charset=utf-8',
                'Cache-Control': 'public, max-age=3600, s-maxage=3600',
            },
        });
    } catch (err) {
        console.error('ads.txt generation error:', err);
        return new Response(DEFAULT_ADS_TXT + "\n", {
            status: 200,
            headers: { 'Content-Type': 'text/plain; charset=utf-8' },
        });
    }
}
