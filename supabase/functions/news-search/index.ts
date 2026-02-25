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
        const openaiApiKey = Deno.env.get('OPENAI_API_KEY');

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

        // 1. Keyword mapping for filters across languages (Expanded for better GNews coverage)
        const filterKeywords: Record<string, Record<string, string>> = {
            'Política': { pt: 'política angolana', en: 'politics africa', es: 'política áfrica', fr: 'politique afrique' },
            'Economia': { pt: 'economia pib', en: 'economy gdp', es: 'economía pib', fr: 'économie pib' },
            'Energia & Petróleo': { pt: 'petróleo energia', en: 'oil energy', es: 'petróleo energía', fr: 'pétrole énergie' },
            'Negócios': { pt: 'negócios empresas', en: 'business company', es: 'negocios empresas', fr: 'affaires entreprises' },
            'Sociedade': { pt: 'sociedade notícias', en: 'society news', es: 'sociedad noticias', fr: 'société' },
            'Tecnologia': { pt: 'tecnologia digital', en: 'technology digital', es: 'tecnología digital', fr: 'technologie digital' },
            'Segurança': { pt: 'segurança polícia', en: 'security police', es: 'seguridad policía', fr: 'sécurité police' },
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

            // If query is empty, use the translated keyword for the active filter
            if (!effectiveQuery) {
                const keywords = filterKeywords[activeFilter] || filterKeywords['Tudo'];
                effectiveQuery = keywords[lang] || keywords['pt'];

                // For Angola filter, always ensure "Angola" is in the query even if language is different
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

        // 3. Filtering & Fallback
        const seenUrls = new Set();
        allArticles = allArticles.filter(a => {
            if (seenUrls.has(a.url)) return false;
            seenUrls.add(a.url);
            return true;
        });

        const intervals = [
            24 * 60 * 60 * 1000,      // 24h
            3 * 24 * 60 * 60 * 1000,  // 3 days
            7 * 24 * 60 * 60 * 1000   // 7 days
        ];

        let filteredArticles: any[] = [];
        let appliedInterval = 0;

        for (const ms of intervals) {
            filteredArticles = allArticles.filter(a => {
                const pubDate = new Date(a.publishedAt);
                return (now.getTime() - pubDate.getTime()) <= ms;
            });
            if (filteredArticles.length >= 3) {
                appliedInterval = ms;
                break;
            }
        }

        if (filteredArticles.length === 0) {
            filteredArticles = allArticles;
        }

        filteredArticles.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
        const finalSelection = filteredArticles.slice(0, maxResults);

        // 4. Batch Translation (Non-PT articles)
        const articlesToTranslate = finalSelection.filter(a => a.detectedLang !== 'pt');

        if (articlesToTranslate.length > 0 && openaiApiKey) {
            try {
                // Safer string concatenation for deployment
                const newsContext = articlesToTranslate.map((a, i) => "[" + i + "] Título: " + a.title + "\nDescrição: " + a.description).join('\n\n');
                const prompt = "Traduza as seguintes notícias para PORTUGUÊS DE ANGOLA. " +
                    "Mantenha o tom jornalístico e profissional. " +
                    "Mantenha nomes próprios e termos técnicos se fizer sentido. " +
                    "Retorne apenas um array JSON de objetos com {translatedTitle, translatedDescription}.\n\n" +
                    "NOTÍCIAS:\n" + newsContext;

                const aiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${openaiApiKey}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        model: "gpt-4o-mini",
                        messages: [
                            { role: "system", content: "Você é um tradutor especializado em jornalismo. Retorne apenas JSON." },
                            { role: "user", content: prompt }
                        ],
                        response_format: { type: "json_object" }
                    }),
                });

                if (aiResponse.ok) {
                    const aiData = await aiResponse.json();
                    const translationsMap = JSON.parse(aiData.choices[0].message.content);
                    const translations = translationsMap.translations || translationsMap.results || Object.values(translationsMap)[0] || [];

                    // If JSON structure is slightly different, we try to map by index
                    articlesToTranslate.forEach((article, idx) => {
                        const t = Array.isArray(translations) ? translations[idx] : null;
                        if (t) {
                            article.title = t.translatedTitle || article.title;
                            article.description = t.translatedDescription || article.description;
                            article.isTranslated = true;
                        }
                    });
                }
            } catch (err) {
                console.error("Translation error:", err);
            }
        }

        // 5. Format Output
        const processedResults = finalSelection.map((a: any) => {
            let category = activeFilter === 'Tudo' ? 'Geral' : activeFilter;
            const text = `${a.title} ${a.description}`.toLowerCase();

            // Auto-categorize if "Tudo"
            if (activeFilter === 'Tudo') {
                if (text.includes('polític') || text.includes('governo')) category = 'Política';
                else if (text.includes('econom') || text.includes('finanç') || text.includes('pib')) category = 'Economia';
                else if (text.includes('petróleo') || text.includes('energia') || text.includes('combustí')) category = 'Energia & Petróleo';
                else if (text.includes('tecnologia') || text.includes('digital') || text.includes('ia ')) category = 'Tecnologia';
                else if (text.includes('seguranç') || text.includes('polícia') || text.includes('militar')) category = 'Segurança';
                else if (text.includes('negócio') || text.includes('empresa') || text.includes('mercado')) category = 'Negócios';
                else if (text.includes('sociedade') || text.includes('social') || text.includes('povo')) category = 'Sociedade';
                else if (text.includes('angola')) category = 'Angola';
            }

            const pubDate = new Date(a.publishedAt);
            const diffDays = Math.floor((now.getTime() - pubDate.getTime()) / (1000 * 60 * 60 * 24));
            const diffHrs = Math.floor((now.getTime() - pubDate.getTime()) / (1000 * 60 * 60));

            let dateStr = 'Agora';
            if (diffDays > 0) dateStr = `Há ${diffDays}d`;
            else if (diffHrs > 0) dateStr = `Há ${diffHrs}h`;

            return {
                title: a.title,
                source: a.source?.name || 'Fonte Global',
                date: dateStr,
                category: category,
                snippet: a.description || '',
                content: a.description || '', // GNews mostly provides snippets
                url: a.url,
                image: a.image || '',
                isTranslated: a.isTranslated || false,
                originalLang: a.detectedLang
            };
        });

        let info = appliedInterval > 24 * 3600 * 1000
            ? `Exibindo resultados dos últimos ${Math.round(appliedInterval / 86400000)} dias para garantir volume.`
            : null;

        return new Response(
            JSON.stringify({ results: processedResults, total: processedResults.length, info }),
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
