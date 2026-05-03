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
        const geminiApiKey = Deno.env.get('GEMINI_API_KEY') || Deno.env.get('GOOGLE_AI_STUDIO_API_KEY') || "AIzaSyCNTcRuSzZuYn8lbBKsRvl0o3gDxjjqgOs";
        const theNewsApiKey = Deno.env.get('THE_NEWS_API_KEY') || "api_live_vrjtCF3M166VTMXrNjdXE0szDq2MdDnXUYIBNhdz7EZEMOBE2Abj3AKLwf";

        const maxResults = max || 10;
        const now = new Date();
        let searchQuery = (query || '').trim();
        const activeFilter = filter || 'Tudo';

        // 1. Mapping for TheNewsAPI Categories
        const theNewsCategories: Record<string, string> = {
            'Política': 'politics',
            'Economia': 'business',
            'Energia & Petróleo': 'business',
            'Negócios': 'business',
            'Sociedade': 'general',
            'Tecnologia': 'tech',
            'Segurança': 'general',
            'Saúde': 'health',
            'Mundo': 'general',
            'Desporto': 'sports',
            'Angola': 'general',
            'Tudo': 'general'
        };

        // 2. Fetch from TheNewsAPI (Primary - Angolan Localization)
        let allArticles: any[] = [];

        try {
            const category = theNewsCategories[activeFilter] || 'general';
            let theNewsUrl = "https://api.thenewsapi.com/v1/news/all?api_token=" + theNewsApiKey +
                "&locale=ao&language=pt&limit=10";

            if (activeFilter !== 'Tudo' && activeFilter !== 'Angola') {
                theNewsUrl += "&categories=" + category;
            }
            if (searchQuery && searchQuery !== activeFilter && searchQuery !== 'Angola') {
                theNewsUrl += "&search=" + encodeURIComponent(searchQuery);
            }

            const tnResponse = await fetch(theNewsUrl);
            const tnData = await tnResponse.json();

            if (tnData.data && tnData.data.length > 0) {
                allArticles = tnData.data.map((a: any) => ({
                    title: a.title,
                    description: a.snippet,
                    url: a.url,
                    image: a.image_url,
                    publishedAt: a.published_at,
                    source: { name: a.source },
                    detectedLang: 'pt'
                }));
            }
        } catch (err) {
            console.error("TheNewsAPI fetch error:", err);
        }

        // 3. Fallback to GNews (If primary source has few results or fails)
        if (allArticles.length < 5 && gnewsApiKey) {
            const languages = ['pt', 'en']; // Reduced language set for efficiency if it's a fallback
            const fetchPromises = languages.map(lang => {
                let effectiveQuery = searchQuery || (activeFilter !== 'Tudo' ? activeFilter : 'Angola');
                if (!effectiveQuery.toLowerCase().includes('angola')) {
                    effectiveQuery += " Angola";
                }

                const countryParam = (lang === 'pt') ? "&country=ao" : "";
                const url = "https://gnews.io/api/v4/search?q=" + encodeURIComponent(effectiveQuery) +
                    "&lang=" + lang + countryParam + "&max=10&sortby=publishedAt&apikey=" + gnewsApiKey;

                return fetch(url).then(r => r.json()).catch(() => ({ articles: [] }));
            });

            const gnResults = await Promise.all(fetchPromises);
            gnResults.forEach((data, index) => {
                const articles = (data.articles || []).map((a: any) => ({
                    ...a,
                    detectedLang: languages[index]
                }));
                allArticles = [...allArticles, ...articles];
            });
        }

        // 4. Filtering & Deduplication
        const seenUrls = new Set();
        allArticles = allArticles.filter(a => {
            if (!a.url || seenUrls.has(a.url)) return false;
            seenUrls.add(a.url);
            return true;
        });

        allArticles.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
        const finalSelection = allArticles.slice(0, maxResults);

        // 5. Batch Translation via Gemini (Non-PT articles)
        const articlesToTranslate = finalSelection.filter(a => a.detectedLang !== 'pt');

        if (articlesToTranslate.length > 0 && geminiApiKey) {
            try {
                const newsContext = articlesToTranslate.map((a, i) => "[" + i + "] Título: " + a.title + "\nDescrição: " + a.description).join('\n\n');
                const prompt = "Traduza as seguintes notícias para PORTUGUÊS DE ANGOLA. " +
                    "Mantenha o tom jornalístico, directo e profissional ('Sem Filtros'). " +
                    "Retorne apenas um array JSON chamado 'translations' com objetos {translatedTitle, translatedDescription}.\n\n " +
                    "NOTÍCIAS:\n" + newsContext;

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

        // 6. Format Output
        const processedResults = finalSelection.map((a: any) => {
            const pubDate = new Date(a.publishedAt);
            const diffHrs = Math.floor((now.getTime() - pubDate.getTime()) / (1000 * 60 * 60));
            const dateStr = diffHrs < 1 ? 'Agora' : "Há " + diffHrs + "h";

            return {
                title: a.title,
                source: a.source?.name || 'Fonte Global',
                date: dateStr,
                category: activeFilter === 'Tudo' ? 'Geral' : activeFilter,
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

