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

        // Domain blacklist to avoid Brazil news leakage in Angola filter
        const brBlacklist = [
            'uol.com.br', 'globo.com', 'terra.com.br', 'r7.com',
            'folha.uol.com.br', 'estadao.com.br', 'ig.com.br', 'metropoles.com',
            'gazetadopovo.com.br', 'cnnbrasil.com.br'
        ];

        if (isAngolaFilter) {
            // Force "Angola" in the query if it's a generic search
            const effectiveQuery = (!searchQuery || cleanQuery === 'notícias' || cleanQuery === 'recentes')
                ? 'Angola'
                : searchQuery;

            // Use search with country parameter if possible, or just strict query
            // country=ao is good but some international news about AO might not have it.
            // We will combine: query with "Angola" + optional country parameter
            url = `${baseUrl}/search?q=${encodeURIComponent(effectiveQuery)}&country=ao&lang=${lang}&max=${maxResults}&sortby=publishedAt&apikey=${apiKey}`;
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

        // Apply domain blacklist if it's the Angola filter
        if (isAngolaFilter) {
            articles = articles.filter((article: any) => {
                const articleUrl = (article.url || '').toLowerCase();
                return !brBlacklist.some(domain => articleUrl.includes(domain));
            });
        }

        const now = new Date();
        const eightHoursInMs = 8 * 60 * 60 * 1000;
        const twentyFourHoursInMs = 24 * 60 * 60 * 1000;

        // First attempt: filter by 8 hours
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

        const results = filteredArticles.map((article: any) => {
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
                info: usingFallback ? "Exibindo notícias das últimas 24h para Angola (nenhum resultado em 8h)." : null
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
