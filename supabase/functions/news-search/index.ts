import "jsr:@supabase/functions-js/edge-runtime.d.ts";

Deno.serve(async (req: Request) => {
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    };

    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        const { query, filter, max } = await req.json();
        const apiKey = Deno.env.get('GNEWS_API_KEY');

        if (!apiKey) {
            return new Response(
                JSON.stringify({ error: 'GNEWS_API_KEY não configurada.' }),
                { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
        }

        let searchQuery = (query || '').trim();
        const cleanQuery = searchQuery.toLowerCase();

        const isAngolaFilter = filter === 'Angola' || !filter;
        const maxResults = max || 10;
        const now = new Date();
        const eightHoursInMs = 8 * 60 * 60 * 1000;
        const twentyFourHoursInMs = 24 * 60 * 60 * 1000;

        // --- 1. Fetch from GNews ---
        const baseUrl = 'https://gnews.io/api/v4';
        const lang = 'pt';
        let gnewsUrl = '';

        if (isAngolaFilter) {
            let effectiveQuery = searchQuery;
            if (!cleanQuery.includes('angola')) {
                effectiveQuery = searchQuery ? `Angola ${searchQuery}` : 'Angola';
            }
            gnewsUrl = `${baseUrl}/search?q=${encodeURIComponent(effectiveQuery)}&country=ao&lang=${lang}&max=20&sortby=publishedAt&apikey=${apiKey}`;
        } else {
            let filterPrefix = '';
            if (filter === 'Política') filterPrefix = ' política';
            if (filter === 'Finanças') filterPrefix = ' economia finanças';
            const q = encodeURIComponent(searchQuery + filterPrefix);
            gnewsUrl = `${baseUrl}/search?q=${q}&lang=${lang}&max=${maxResults}&sortby=publishedAt&apikey=${apiKey}`;
        }

        const gnewsResponse = await fetch(gnewsUrl);
        const gnewsData = await gnewsResponse.json();
        let gnewsArticles = gnewsData.articles || [];

        // Blacklist/Whitelist logic for GNews
        const blacklist = [
            'uol.com.br', 'globo.com', 'terra.com.br', 'r7.com',
            'folha.uol.com.br', 'estadao.com.br', 'ig.com.br', 'metropoles.com',
            'gazetadopovo.com.br', 'cnnbrasil.com.br', 'lance.com.br', 'espn.com.br',
            'jn.pt', 'publico.pt', 'dn.pt', 'sicnoticias.pt', 'rtp.pt', 'iol.pt',
            'maisfutebol.iol.pt', 'record.pt', 'abola.pt', 'ojogo.pt'
        ];
        const angolaWhitelist = ['angop.ao', 'jornaldeangola.ao', 'novojornal.co.ao', 'club-k.net', 'angola24horas.com'];

        if (isAngolaFilter) {
            gnewsArticles = gnewsArticles.filter((article: any) => {
                const url = (article.url || '').toLowerCase();
                const title = (article.title || '').toLowerCase();
                const isBlacklisted = blacklist.some(d => url.includes(d));
                if (isBlacklisted) return false;
                const isWhitelisted = angolaWhitelist.some(d => url.includes(d));
                if (isWhitelisted) return true;
                return title.includes('angola') || (article.description || '').toLowerCase().includes('angola');
            });
        }

        // --- 2. Fetch from Opera News RSS (if Angola filter) ---
        let operaArticles: any[] = [];
        if (isAngolaFilter) {
            try {
                const operaRssUrl = "https://blogs.opera.com/mobile/category/opera-news/feed/";
                const rss2JsonUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(operaRssUrl)}`;
                const operaResponse = await fetch(rss2JsonUrl);
                const operaData = await operaResponse.json();

                if (operaData.status === 'ok') {
                    operaArticles = (operaData.items || []).map((item: any) => ({
                        title: item.title,
                        description: item.description || item.content,
                        content: item.content || item.description,
                        url: item.link,
                        image: item.enclosure?.link || item.thumbnail || '',
                        publishedAt: item.pubDate,
                        source: { name: 'Opera News' }
                    }));
                    console.log(`Fetched ${operaArticles.length} articles from Opera News RSS`);
                }
            } catch (e) {
                console.error('Error fetching Opera News RSS:', e);
            }
        }

        // --- 3. Merge and Filter by Time ---
        let combinedArticles = [...operaArticles, ...gnewsArticles];

        // Deduplicate by URL
        const seenUrls = new Set();
        combinedArticles = combinedArticles.filter(a => {
            if (seenUrls.has(a.url)) return false;
            seenUrls.add(a.url);
            return true;
        });

        // Time window filtering
        let filtered = combinedArticles.filter((a: any) => {
            if (!a.publishedAt) return false;
            const pubDate = new Date(a.publishedAt);
            return (now.getTime() - pubDate.getTime()) <= eightHoursInMs;
        });

        let info = null;
        if (filtered.length === 0 && combinedArticles.length > 0) {
            filtered = combinedArticles.filter((a: any) => {
                const pubDate = new Date(a.publishedAt);
                return (now.getTime() - pubDate.getTime()) <= twentyFourHoursInMs;
            });
            if (filtered.length > 0) {
                info = "Exibindo notícias das últimas 24h (nenhum resultado em 8h).";
            }
        }

        // Sort by date (newest first)
        filtered.sort((a: any, b: any) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

        // --- 4. Format Results ---
        const results = filtered.slice(0, maxResults).map((article: any) => {
            let category = 'Geral';
            const text = `${article.title} ${article.description}`.toLowerCase();
            if (text.includes('polític') || text.includes('governo')) category = 'Política';
            else if (text.includes('econom') || text.includes('finanç')) category = 'Finanças';
            else if (text.includes('futebol') || text.includes('desporto')) category = 'Desporto';

            const pubDate = new Date(article.publishedAt);
            const diffHrs = Math.floor((now.getTime() - pubDate.getTime()) / (1000 * 60 * 60));
            const dateStr = diffHrs < 1 ? 'Agora' : `Há ${diffHrs}h`;

            return {
                title: article.title,
                source: article.source?.name || 'Fonte',
                date: dateStr,
                category: category,
                snippet: article.description || '',
                content: article.content || article.description || '',
                url: article.url,
                image: article.image || ''
            };
        });

        return new Response(
            JSON.stringify({ results, total: results.length, info }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        );

    } catch (error) {
        console.error('Error:', error);
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }
});
