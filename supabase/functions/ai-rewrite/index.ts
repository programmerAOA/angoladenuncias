import "jsr:@supabase/functions-js/edge-runtime.d.ts";

Deno.serve(async (req) => {
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    };

    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        const { content, title, line } = await req.json();

        // Check for Gemini Key
        const apiKey = Deno.env.get("GEMINI_API_KEY") || Deno.env.get("GOOGLE_AI_STUDIO_API_KEY");
        if (!apiKey) {
            console.error("Missing GEMINI_API_KEY");
            return new Response(
                JSON.stringify({ error: "Configuração de IA em falta (GEMINI_API_KEY não encontrada no Supabase)." }),
                { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
        }

        // Clean content from common truncation markers
        let cleanContent = (content || '').replace(/\[\+\d+\s+chars\]/gi, '').replace(/\[\d+\s+chars\]/gi, '').trim();

        const prompt = `
      Você é um jornalista sénior e editor-chefe do portal "Sem Filtros" em Angola. 
      Sua missão é reescrever a notícia abaixo seguindo RIGOROSAMENTE a nossa linha editorial.

      DIRETRIZES SEM FILTROS:
      - Linguagem directa, clara e sem suavizações artificiais.
      - Análise crítica, contextual e responsável.
      - ZERO neutralidade falsa: se os factos apontam uma direcção, não finja neutralidade.
      - Evite repetição editorial e discursos oficiais reciclados.
      - Separação explícita entre FACTO, CONTEXTO e LEITURA CRÍTICA.
      - Prioridade à informação útil, ignorando conveniência política ou narrativas dominantes.

      ESTRUTURA DE RETORNO (JSON):
      {
        "titulo": "Título directo e impactante",
        "resumo": "Resumo executivo de 2 frases (sem filtros)",
        "full_content_html": "Notícia completa em HTML (<p>), integrando factos, contexto e análise",
        "factos": "Os factos brutos da notícia",
        "contexto": "O porquê disto estar a acontecer e o histórico necessário",
        "leitura_critica": "A análise real do impacto, sem rodeios",
        "impacto": "Impacto imediato na vida das pessoas",
        "relevancia_para_angola": "Porquê isto importa para o público angolano",
        "categoria": "Política, Economia, Sociedade, Tecnologia, Mundo ou Desporto",
        "seo_keywords": "5-8 palavras-chave separadas por vírgula para SEO"
      }

      DADOS PARA PROCESSAMENTO:
      LINHA EDITORIAL ADICIONAL: "${line}"
      TÍTULO ORIGINAL: ${title}
      CONTEÚDO ORIGINAL: ${cleanContent}
    `;

        const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + apiKey, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: prompt }]
                }],
                generationConfig: {
                    responseMimeType: "application/json",
                }
            }),
        });

        if (!response.ok) {
            const errorMsg = await response.text();
            throw new Error(`Gemini API Error: ${response.status} - ${errorMsg}`);
        }

        const aiData = await response.json();

        if (!aiData.candidates || aiData.candidates.length === 0) {
            throw new Error("O Gemini não retornou resposta.");
        }

        const rawText = aiData.candidates[0].content.parts[0].text;
        const result = JSON.parse(rawText);

        return new Response(JSON.stringify(result), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
        });

    } catch (error) {
        console.error('ai-rewrite error:', error);
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 500,
        });
    }
});

