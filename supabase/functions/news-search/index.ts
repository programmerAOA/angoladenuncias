import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req: Request) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        const { query, filter, max } = await req.json();
        const gnewsApiKey = Deno.env.get('GNEWS_API_KEY');
        const geminiApiKey = Deno.env.get('GEMINI_API_KEY') || Deno.env.get('GOOGLE_AI_STUDIO_API_KEY');

        if (!gnewsApiKey) {
            return new Response(
                JSON.stringify({ error: 'GNEWS_API_KEY não configurada.' }),
                { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
        }

        const maxResults = max || 10;
        const now = new Date();

        let searchQuery = (query || '').trim();
        const activeFilter = filter || 'Tudo';

        // 1. Keyword mapping for filters across languages
        const filterKeywords: Record<string, Record<string, string>> = {
            'Política': { pt: 'política angolana', en: 'politics africa', es: 'política áfrica', fr: 'politique afrique' },
            'Economia': { pt: 'economia pib', en: 'economy gdp', es: 'economía pib', fr: 'économie pib' },
            'Energia & Petróleo': { pt: 'petróleo energia', en: 'oil energy', es: 'petróleo energía', fr: 'pétrole énergie' },
            'Negócios': { pt: 'negócios empresas', en: 'business company', es: 'negocios empresas', fr: 'affaires entreprises' },
            'Sociedade': { pt: 'sociedade notícias', en: 'society news', es: 'sociedad noticias', fr: 'société' },
            'Tecnologia': { pt: 'tecnologia digital', en: 'technology digital', es: 'tecnología digital', fr: 'technologie digital' },
            'Segurança': { pt: 'segurança polícia', en: 'security police', es: 'seguridad polícia', fr: 'sécurité police' },
            'Saúde': { pt: 'saúde notícias', en: 'health news', es: 'salud noticias', fr: 'santé' },
            'Mundo': { pt: 'mundo notícias', en: 'world news', es: 'mundo noticias', fr: 'monde' },
            'Desporto': { pt: 'desporto notícias', en: 'sports news', es: 'deportes noticias', fr: 'actualités sportives' },
            'Angola': { pt: 'Angola', en: 'Angola', es: 'Angola', fr: 'Angola' },
            'Tudo': { pt: 'notícias', en: 'news', es: 'noticias', fr: 'actualités' }
        };

        // 2. Fetch from GNews (Multi-language)
        const languages = ['pt', 'en', 'es', 'fr'];
        const fetchPromises = languages.map(lang => {
            let effectiveQuery = searchQuery;
            if (!effectiveQuery) {
                const keywords = filterKeywords[activeFilter] || filterKeywords['Tudo'];
                effectiveQuery = keywords[lang] || keywords['pt'];
                if (activeFilter === 'Angola' && !effectiveQuery.toLowerCase().includes('angola')) {
                    effectiveQuery = `Angola ${effectiveQuery}`;
                }
            }
            const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(effectiveQuery)}&lang=${lang}&max=10&sortby=publishedAt&apikey=${gnewsApiKey}`;
            return fetch(url).then(r => r.json()).catch(err => {
                console.error(`GNews fetch error (${lang}):`, err);
                return { articles: [] };
            });
        });

        const results = await Promise.all(fetchPromises);
        let allArticles: any[] = [];
        results.forEach((data, index) => {
            const articles = (data.articles || []).map((a: any) => ({
                ...a,
                detectedLang: languages[index]
            }));
            allArticles = [...allArticles, ...articles];
        });

        // 3. Filtering & Deduplication
        const seenUrls = new Set();
        allArticles = allArticles.filter(a => {
            if (seenUrls.has(a.url)) return false;
            seenUrls.add(a.url);
            return true;
        });

        allArticles.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
        const finalSelection = allArticles.slice(0, maxResults);

        // 4. Batch Translation via Gemini (Non-PT articles)
        const articlesToTranslate = finalSelection.filter(a => a.detectedLang !== 'pt');

        if (articlesToTranslate.length > 0 && geminiApiKey) {
            try {
                const newsContext = articlesToTranslate.map((a, i) => `[${i}] Título: ${a.title}\nDescrição: ${a.description}`).join('\n\n');
                const prompt = `Traduza as seguintes notícias para PORTUGUÊS DE ANGOLA. 
                    Mantenha o tom jornalístico, directo e profissional ("Sem Filtros").
                    Retorne apenas um array JSON chamado "translations" com objetos {translatedTitle, translatedDescription}.\n\n
                    NOTÍCIAS:\n${newsContext}`;

                const aiResponse = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + geminiApiKey, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: prompt }] }],
                        generationConfig: { responseMimeType: "application/json" }
                    }),
                });

                if (aiResponse.ok) {
                    const aiData = await aiResponse.json();
                    const rawText = aiData.candidates[0].content.parts[0].text;
                    const result = JSON.parse(rawText);
                    const translations = result.translations || [];

                    articlesToTranslate.forEach((article, idx) => {
                        const t = translations[idx];
                        if (t) {
                            article.title = t.translatedTitle || article.title;
                            article.description = t.translatedDescription || article.description;
                            article.isTranslated = true;
                        }
                    });
                }
            } catch (err) {
                console.error("Gemini translation error:", err);
            }
        }

        // 5. Format Output
        const processedResults = finalSelection.map((a: any) => {
            let category = activeFilter === 'Tudo' ? 'Geral' : activeFilter;
            const pubDate = new Date(a.publishedAt);
            const diffHrs = Math.floor((now.getTime() - pubDate.getTime()) / (1000 * 60 * 60));
            const dateStr = diffHrs < 1 ? 'Agora' : `Há ${diffHrs}h`;

            return {
                title: a.title,
                source: a.source?.name || 'Fonte Global',
                date: dateStr,
                category: category,
                snippet: a.description || '',
                content: a.description || '',
                url: a.url,
                image: a.image || '',
                isTranslated: a.isTranslated || false,
                originalLang: a.detectedLang
            };
        });

        return new Response(
            JSON.stringify({ results: processedResults, total: processedResults.length }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        );

    } catch (error: any) {
        console.error('news-search error:', error);
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }
});

