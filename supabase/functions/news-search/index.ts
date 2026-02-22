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

        const searchQuery = query || 'Angola';
        const baseUrl = 'https://gnews.io/api/v4';
        const lang = 'pt';

        // We fetch the most recent ones first WITHOUT the strict 'from' filter to avoid empty results from API.
        // We will filter them internally to respect the 8h requirement.
        const commonParams = `&lang=${lang}&max=10&sortby=publishedAt&apikey=${apiKey}`;

        let url = '';
        switch (filter) {
            case 'Angola':
                // Removed country=ao to increase chances of finding news in the last 8h
                url = `${baseUrl}/search?q=${encodeURIComponent(searchQuery)}${commonParams}`;
                break;
            case 'Mundo':
                url = `${baseUrl}/search?q=${encodeURIComponent(searchQuery)}${commonParams}`;
                break;
            case 'Política':
                url = `${baseUrl}/search?q=${encodeURIComponent(searchQuery + ' política')}${commonParams}`;
                break;
            case 'Finanças':
                url = `${baseUrl}/search?q=${encodeURIComponent(searchQuery + ' economia finanças')}${commonParams}`;
                break;
            default:
                url = `${baseUrl}/search?q=${encodeURIComponent(searchQuery)}${commonParams}`;
                break;
        }

        console.log(`Searching: ${searchQuery} | Filter: ${filter}`);
        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) {
            return new Response(
                JSON.stringify({ error: 'Erro na API GNews: ' + response.status, detail: data }),
                { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
        }

        const articles = data.articles || [];
        const now = new Date();
        const eightHoursInMs = 8 * 60 * 60 * 1000;

        // Filter articles to only include those within the last 8 hours
        const filteredArticles = articles.filter((article: any) => {
            if (!article.publishedAt) return false;
            const pubDate = new Date(article.publishedAt);
            return (now.getTime() - pubDate.getTime()) <= eightHoursInMs;
        });

        console.log(`GNews total: ${articles.length} | Within 8h: ${filteredArticles.length}`);

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
            const diffHours = Math.floor((now.getTime() - pubDate.getTime()) / (1000 * 60 * 60));
            const dateStr = diffHours < 1 ? 'Agora' : `Há ${diffHours}h`;

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
            JSON.stringify({ results: results, total: results.length }),
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
