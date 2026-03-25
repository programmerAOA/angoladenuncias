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

    try {
        if (req.method === 'POST') {
            const body = await req.json();
            query = body.q || body.query || query;
        } else {
            const { searchParams } = new URL(req.url);
            query = searchParams.get("q") || query;
        }
    } catch (e) {
        // Fallback to URL params if body parsing fails
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

    const url = `https://serpapi.com/search?engine=google_news&q=${encodeURIComponent(query)}&gl=ao&hl=pt&api_key=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        // Map SerpApi results to the format expected by the frontend
        const results = (data.news_results || []).map((item: any) => ({
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

        return new Response(JSON.stringify({ results, total: results.length }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200,
        });
    } catch (error: any) {
        console.error("SerpApi error:", error);
        return new Response(JSON.stringify({ error: "Erro ao buscar notícias via SerpApi: " + error.message }), {
            status: 500,
            headers: corsHeaders
        });
    }
});
