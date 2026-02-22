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

        const baseUrl = 'https://gnews.io/api/v4';
        const lang = 'pt';
        const maxResults = 10;

        let url = '';
        const isAngolaFilter = filter === 'Angola' || !filter;

        // Domain blacklist (Mostly Brazilian and non-Angolan Portuguese sources)
        const blacklist = [
            'uol.com.br', 'globo.com', 'terra.com.br', 'r7.com',
            'folha.uol.com.br', 'estadao.com.br', 'ig.com.br', 'metropoles.com',
            'gazetadopovo.com.br', 'cnnbrasil.com.br', 'lance.com.br', 'espn.com.br',
            'jn.pt', 'publico.pt', 'dn.pt', 'sicnoticias.pt', 'rtp.pt', 'iol.pt',
            'maisfutebol.iol.pt', 'record.pt', 'abola.pt', 'ojogo.pt'
        ];

        // Whitelist for Angola priority
        const angolaWhitelist = [
            'angop.ao', 'jornaldeangola.ao', 'novojornal.co.ao', 'expansao.co.ao',
            'angola24horas.com', 'club-k.net', 'folha8.net', 'jornalf8.net',
            'angonoticias.com', 'platinaline.com', 'angorussia.com',
            'operanewsapp.com', 'portal-ao.operanewsapp.com', 'imparcialpress.net',
            'angolahoje.ao', 'menha.ao', 'valor-economico.co.ao', 'verangola.net',
            'tpa.ao', 'rna.ao'
        ];

        if (isAngolaFilter) {
            // For Angola, we strictly require "Angola" in the query if not present
            let effectiveQuery = searchQuery;
            if (!cleanQuery.includes('angola')) {
                effectiveQuery = searchQuery ? `Angola ${searchQuery}` : 'Angola';
            }

            // We still use country=ao as a hint, but we will filter results manually
            url = `${baseUrl}/search?q=${encodeURIComponent(effectiveQuery)}&country=ao&lang=${lang}&max=${maxResults * 2}&sortby=publishedAt&apikey=${apiKey}`;
            console.log(`Searching strictly for Angola: ${effectiveQuery}`);
        } else {
            // Regular search for other filters
            let filterPrefix = '';
            if (filter === 'Política') filterPrefix = ' política';
            if (filter === 'Finanças') filterPrefix = ' economia finanças';

            const q = encodeURIComponent(searchQuery + filterPrefix);
            url = `${baseUrl}/search?q=${q}&lang=${lang}&max=${maxResults}&sortby=publishedAt&apikey=${apiKey}`;
            console.log(`Regular search: ${searchQuery} | filter: ${filter}`);
        }

        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) {
            return new Response(
                JSON.stringify({ error: 'Erro na API GNews: ' + response.status, detail: data }),
                { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
        }

        let articles = data.articles || [];

        // Filtering and Prioritization logic
        if (isAngolaFilter) {
            // 1. Filter out obvious Brazilian/Portuguese non-Angolan domains
            articles = articles.filter((article: any) => {
                const articleUrl = (article.url || '').toLowerCase();
                const articleTitle = (article.title || '').toLowerCase();
                const siteName = (article.source?.name || '').toLowerCase();

                const isBlacklisted = blacklist.some(domain => articleUrl.includes(domain));
                if (isBlacklisted) return false;

                // 2. If it's in the whitelist, it's definitely in
                const isWhitelisted = angolaWhitelist.some(domain => articleUrl.includes(domain));
                if (isWhitelisted) return true;

                // 3. If not in whitelist, it MUST mention Angola in title or be from a relevant source
                // This avoids generic "Jornalista" news from random PT/BR sites that slipped through
                const mentionsAngola = articleTitle.includes('angola') || (article.description || '').toLowerCase().includes('angola');

                return mentionsAngola;
            });

            // Sort to prioritize whitelisted domains (Opera News, etc.)
            articles.sort((a: any, b: any) => {
                const urlA = (a.url || '').toLowerCase();
                const urlB = (b.url || '').toLowerCase();
                const isAWhitelisted = angolaWhitelist.some(domain => urlA.includes(domain));
                const isBWhitelisted = angolaWhitelist.some(domain => urlB.includes(domain));

                if (isAWhitelisted && !isBWhitelisted) return -1;
                if (!isAWhitelisted && isBWhitelisted) return 1;
                return 0; // Maintain date sort for same priority
            });
        }

        const now = new Date();
        const eightHoursInMs = 8 * 60 * 60 * 1000;
        const twentyFourHoursInMs = 24 * 60 * 60 * 1000;

        // Time window filtering
        let filteredArticles = articles.filter((article: any) => {
            if (!article.publishedAt) return false;
            const pubDate = new Date(article.publishedAt);
            return (now.getTime() - pubDate.getTime()) <= eightHoursInMs;
        });

        let usingFallback = false;
        // Fallback: if 8h is empty, try 24h
        if (filteredArticles.length === 0 && articles.length > 0) {
            filteredArticles = articles.filter((article: any) => {
                const pubDate = new Date(article.publishedAt);
                return (now.getTime() - pubDate.getTime()) <= twentyFourHoursInMs;
            });
            if (filteredArticles.length > 0) {
                usingFallback = true;
            }
        }

        // Limit to requested max
        const finalArticles = filteredArticles.slice(0, max || maxResults);

        const results = finalArticles.map((article: any) => {
            let category = 'Geral';
            const titleLower = (article.title || '').toLowerCase();
            const descLower = (article.description || '').toLowerCase();
            const combined = titleLower + ' ' + descLower;

            if (combined.includes('polític') || combined.includes('governo') || combined.includes('presidente') || combined.includes('parlamento') || combined.includes('eleição') || combined.includes('deputado')) {
                category = 'Política';
            } else if (combined.includes('econom') || combined.includes('finanç') || combined.includes('banco') || combined.includes('inflação') || combined.includes('petróleo') || combined.includes('kwanza')) {
                category = 'Economia';
            } else if (combined.includes('desport') || combined.includes('futebol') || combined.includes('seleção') || combined.includes('girabola')) {
                category = 'Desporto';
            } else if (combined.includes('tecnolog') || combined.includes('digital') || combined.includes('internet')) {
                category = 'Tecnologia';
            } else if (combined.includes('saúde') || combined.includes('hospital') || combined.includes('doença') || combined.includes('médic')) {
                category = 'Saúde';
            } else if (combined.includes('cultur') || combined.includes('music') || combined.includes('festival') || combined.includes('cinema')) {
                category = 'Cultura';
            } else if (combined.includes('socied') || combined.includes('educação') || combined.includes('escola') || combined.includes('juventude')) {
                category = 'Sociedade';
            }

            const pubDate = new Date(article.publishedAt);
            const diffHrs = Math.floor((now.getTime() - pubDate.getTime()) / (1000 * 60 * 60));
            const dateStr = diffHrs < 1 ? 'Agora' : `Há ${diffHrs}h`;

            return {
                title: article.title || 'Sem título',
                source: article.source?.name || 'Fonte Desconhecida',
                date: dateStr,
                category: category,
                snippet: article.description || '',
                content: article.content || article.description || '',
                url: article.url || '',
                image: article.image || ''
            };
        });

        return new Response(
            JSON.stringify({
                results: results,
                total: results.length,
                info: usingFallback ? "Exibindo notícias das últimas 24h (priorizando fontes de Angola)." : null
            }),
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
