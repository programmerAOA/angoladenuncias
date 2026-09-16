import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    let query = "angola";
    let tbs = "qdr:d2"; // Padrão: últimas 48 horas

    try {
        if (req.method === 'POST') {
            const body = await req.json();
            query = body.q || body.query || query;
            if (body.tbs !== undefined) tbs = body.tbs;
        } else {
            const { searchParams } = new URL(req.url);
            query = searchParams.get("q") || query;
            if (searchParams.get("tbs")) tbs = searchParams.get("tbs")!;
        }
    } catch (_e) {
        const { searchParams } = new URL(req.url);
        query = searchParams.get("q") || query;
    }

    const apiKey = Deno.env.get("SERPAPI_KEY");
    if (!apiKey) {
        return new Response(JSON.stringify({ error: "SERPAPI_KEY não configurada no Supabase" }), {
            status: 500,
            headers: corsHeaders
        });
    }

    // tbs dinâmico: qdr:h1 (1h), qdr:d1 (24h/data actual), qdr:d2 (48h), qdr:w1 (1 semana), qdr:m1 (1 mês), "" (qualquer)
    const tbsParam = tbs ? `&tbs=${encodeURIComponent(tbs)}` : "";
    const serpUrl = `https://serpapi.com/search?engine=google_news&q=${encodeURIComponent(query)}&gl=ao&hl=pt${tbsParam}&api_key=${apiKey}`;

    // ── Helper: Calculate max age in hours from tbs param ───────────────
    const getMaxAgeHours = (tbsFilter: string): number => {
        if (tbsFilter === 'qdr:d1') return 24; // Data actual (hoje / 24h)
        if (tbsFilter === 'qdr:d2') return 48; // Últimas 48 horas
        if (tbsFilter === 'qdr:h1') return 1;
        if (tbsFilter === 'qdr:w1') return 168; // 7 dias
        if (tbsFilter === 'qdr:m1') return 720; // 30 dias
        return 0; // Sem filtro
    };

    // ── Helper: fetch Maka Mavulo RSS and filter by query & date ─────────
    const fetchMakaMavulo = async (searchQuery: string, tbsFilter: string): Promise<any[]> => {
        try {
            const rssResponse = await fetch("https://makamavulo.com/feed/", {
                headers: { 'User-Agent': 'AngolaNews-OSINT/1.0' }
            });
            if (!rssResponse.ok) return [];

            const rssText = await rssResponse.text();

            const itemRegex = /<item>([\s\S]*?)<\/item>/g;
            const titleRegex = /<title><!\[CDATA\[(.*?)\]\]><\/title>|<title>(.*?)<\/title>/;
            const linkRegex = /<link>(.*?)<\/link>/;
            const pubDateRegex = /<pubDate>(.*?)<\/pubDate>/;
            const descRegex = /<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>|<description>([\s\S]*?)<\/description>/;
            const mediaRegex = /<media:content[^>]+url="([^"]+)"|<enclosure[^>]+url="([^"]+)"|<img[^>]+src="([^"]+)"/;

            const cleanedQuery = searchQuery.replace(/site:makamavulo\.com/gi, "").trim();
            const keywords = cleanedQuery
                .toLowerCase()
                .split(/\s+/)
                .filter((k: string) => k.length > 2 && k !== 'angola' && k !== 'makamavulo' && k !== 'makamavulo.com');

            const now = Date.now();
            const maxAgeHours = getMaxAgeHours(tbsFilter);

            const results: any[] = [];
            let match;

            while ((match = itemRegex.exec(rssText)) !== null) {
                const itemXml = match[1];

                const titleMatch = titleRegex.exec(itemXml);
                const title = (titleMatch?.[1] || titleMatch?.[2] || "").trim();

                const linkMatch = linkRegex.exec(itemXml);
                const url = (linkMatch?.[1] || "").trim();

                const pubDateMatch = pubDateRegex.exec(itemXml);
                const pubDateStr = (pubDateMatch?.[1] || "").trim();

                const itemDate = pubDateStr ? new Date(pubDateStr) : new Date();
                const itemTime = itemDate.getTime();

                // Filtrar por data se houver limite de tempo ativo
                if (maxAgeHours > 0 && (now - itemTime) > (maxAgeHours * 60 * 60 * 1000)) {
                    continue;
                }

                const descMatch = descRegex.exec(itemXml);
                const rawDesc = (descMatch?.[1] || descMatch?.[2] || "").trim();
                const snippet = rawDesc
                    .replace(/<[^>]+>/g, " ")
                    .replace(/O conteúdo .+ aparece primeiro em .+\./g, "")
                    .replace(/\s+/g, " ")
                    .trim()
                    .substring(0, 300);

                const mediaMatch = mediaRegex.exec(itemXml);
                const image = mediaMatch?.[1] || mediaMatch?.[2] || mediaMatch?.[3] || "";

                if (!title || !url) continue;

                const isGeneric = keywords.length === 0;
                const titleLower = title.toLowerCase();
                const snippetLower = snippet.toLowerCase();
                const hasMatch = isGeneric || keywords.some((k: string) => titleLower.includes(k) || snippetLower.includes(k));

                if (hasMatch) {
                    results.push({
                        title,
                        source: "Maka Mavulo",
                        date: itemDate.toISOString(),
                        category: "Geral",
                        snippet,
                        content: snippet,
                        url,
                        image,
                        isTranslated: false,
                        reliability: 85
                    });
                }
            }

            return results;
        } catch (err) {
            console.error("Maka Mavulo RSS error:", err);
            return [];
        }
    };

    // ── Helper: fetch Correio Kianda RSS and filter by query & date ──────
    const fetchCorreioKianda = async (searchQuery: string, tbsFilter: string): Promise<any[]> => {
        try {
            const rssResponse = await fetch("https://correiokianda.info/feed/", {
                headers: { 'User-Agent': 'AngolaNews-OSINT/1.0' }
            });
            if (!rssResponse.ok) return [];

            const rssText = await rssResponse.text();

            const itemRegex = /<item>([\s\S]*?)<\/item>/g;
            const titleRegex = /<title><!\[CDATA\[(.*?)\]\]><\/title>|<title>(.*?)<\/title>/;
            const linkRegex = /<link>(.*?)<\/link>/;
            const pubDateRegex = /<pubDate>(.*?)<\/pubDate>/;
            const descRegex = /<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>|<description>([\s\S]*?)<\/description>/;
            const mediaRegex = /<media:content[^>]+url="([^"]+)"|<enclosure[^>]+url="([^"]+)"/;

            const keywords = searchQuery
                .toLowerCase()
                .split(/\s+/)
                .filter((k: string) => k.length > 2 && k !== 'angola');

            const now = Date.now();
            const maxAgeHours = getMaxAgeHours(tbsFilter);

            const results: any[] = [];
            let match;

            while ((match = itemRegex.exec(rssText)) !== null) {
                const itemXml = match[1];

                const titleMatch = titleRegex.exec(itemXml);
                const title = (titleMatch?.[1] || titleMatch?.[2] || "").trim();

                const linkMatch = linkRegex.exec(itemXml);
                const url = (linkMatch?.[1] || "").trim();

                const pubDateMatch = pubDateRegex.exec(itemXml);
                const pubDateStr = (pubDateMatch?.[1] || "").trim();

                const itemDate = pubDateStr ? new Date(pubDateStr) : new Date();
                const itemTime = itemDate.getTime();

                if (maxAgeHours > 0 && (now - itemTime) > (maxAgeHours * 60 * 60 * 1000)) {
                    continue;
                }

                const descMatch = descRegex.exec(itemXml);
                const rawDesc = (descMatch?.[1] || descMatch?.[2] || "").trim();
                const snippet = rawDesc
                    .replace(/<[^>]+>/g, " ")
                    .replace(/O conteúdo .+ aparece primeiro em .+\./g, "")
                    .replace(/\s+/g, " ")
                    .trim()
                    .substring(0, 300);

                const mediaMatch = mediaRegex.exec(itemXml);
                const image = mediaMatch?.[1] || mediaMatch?.[2] || "";

                if (!title || !url) continue;

                // If no specific keywords, show all (generic Angola search)
                const isGeneric = keywords.length === 0;
                const titleLower = title.toLowerCase();
                const snippetLower = snippet.toLowerCase();
                const hasMatch = isGeneric || keywords.some((k: string) => titleLower.includes(k) || snippetLower.includes(k));

                if (hasMatch) {
                    results.push({
                        title,
                        source: "Correio Kianda",
                        date: itemDate.toISOString(),
                        category: "Geral",
                        snippet,
                        content: snippet,
                        url,
                        image,
                        isTranslated: false,
                        reliability: 78
                    });
                }
            }

            return results;
        } catch (err) {
            console.error("Correio Kianda RSS error:", err);
            return [];
        }
    };

    try {
        // Fetch SerpApi, Maka Mavulo RSS and Correio Kianda in parallel
        const [serpResponse, makaMavuloResults, kiandaResults] = await Promise.all([
            fetch(serpUrl),
            fetchMakaMavulo(query, tbs),
            fetchCorreioKianda(query, tbs)
        ]);

        const data = await serpResponse.json();

        // Map SerpApi results
        const newsResults = data.news_results || [];
        const serpResults = newsResults.map((item: any) => ({
            title: item.title,
            source: item.source?.name || "Google News",
            date: item.date || "Recente",
            category: "Geral",
            snippet: item.snippet || "",
            content: item.snippet || "",
            url: item.link,
            image: item.thumbnail || "",
            isTranslated: false
        }));

        // Merge results: Maka Mavulo first if requested or general, then SerpApi, then Correio Kianda
        const seenUrls = new Set<string>();
        const isMakaMavuloSearch = query.toLowerCase().includes("makamavulo");

        const combined = isMakaMavuloSearch
            ? [...makaMavuloResults, ...serpResults, ...kiandaResults]
            : [...serpResults, ...makaMavuloResults, ...kiandaResults];

        const merged = combined.filter((item: any) => {
            if (!item.url || seenUrls.has(item.url)) return false;
            seenUrls.add(item.url);
            return true;
        });

        return new Response(JSON.stringify({ results: merged, total: merged.length }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200,
        });
    } catch (error: any) {
        console.error("SerpApi error:", error);
        return new Response(JSON.stringify({ error: "Erro ao buscar notícias: " + error.message }), {
            status: 500,
            headers: corsHeaders
        });
    }
});
