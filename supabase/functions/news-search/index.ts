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

        const maxResults = max || 10;
        let searchQuery = query || 'Angola';

        // Calcular data de 8 horas atrás
        const eightHoursAgo = new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString();

        const baseUrl = 'https://gnews.io/api/v4';
        const lang = 'pt';
        let url = '';

        const commonParams = `&lang=${lang}&max=${maxResults}&from=${eightHoursAgo}&apikey=${apiKey}`;

        switch (filter) {
            case 'Angola':
                url = `${baseUrl}/search?q=${encodeURIComponent(searchQuery)}&country=ao${commonParams}`;
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

        console.log('GNews URL (with 8h filter):', url.replace(apiKey, '***'));

        const response = await fetch(url);
        const rawText = await response.text();

        if (!response.ok) {
            console.error('GNews API error status:', response.status, rawText);
            return new Response(
                JSON.stringify({ error: 'Erro na API de notícias: ' + response.status }),
                { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
        }

        const data = JSON.parse(rawText);
        const articles = data.articles || [];

        const results = articles.map((article: any) => {
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

            let dateStr = 'Agora';
            if (article.publishedAt) {
                const pubDate = new Date(article.publishedAt);
                const now = new Date();
                const diffMs = now.getTime() - pubDate.getTime();
                const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

                if (diffHours < 1) {
                    dateStr = 'Agora';
                } else {
                    dateStr = `Há ${diffHours}h`;
                }
            }

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
            JSON.stringify({ results: results, total: data.totalArticles || results.length }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        );

    } catch (error) {
        console.error('Error in news-search:', error);
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }
});
