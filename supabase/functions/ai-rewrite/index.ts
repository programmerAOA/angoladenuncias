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
      1. TÍTULO (DESTAQUE): Deve ser extremamente chamativo, directo e optimizado para SEO. Evite títulos institucionais. Ex: "Angola aproxima-se do Japão para acelerar reformas" em vez de "Encontro entre delegações de Angola e Japão".
      2. RESUMO: Um resumo "punchy" e impactante de 2 frases que prenda o leitor.
      3. CONTEÚDO: Redesenhe a notícia totalmente. Não faça apenas um resumo. Use um tom de voz audaz, claro e sem filtros, sem perder o foco nos factos reais.
      4. ANÁLISE: TODA notícia DEVE terminar com uma secção entitulada "Análise – Angola Sem Filtros". Esta secção deve oferecer uma visão crítica, contextual e honesta sobre o impacto real do acontecimento para os angolanos.

      ESTRUTURA DE RETORNO (JSON):
      {
        "titulo": "Título SEO chamativo",
        "resumo": "Resumo impactante",
        "full_content_html": "Notícia completa em HTML (<p>), terminando OBRIGATORIAMENTE com a <br/><strong>Análise – Angola Sem Filtros</strong><br/>[Análise crítica aqui]",
        "factos": "Os factos brutos",
        "contexto": "Histórico e contexto",
        "leitura_critica": "A análise crítica (mesmo texto que vai no final do HTML)",
        "impacto": "Impacto na vida das pessoas",
        "relevancia_para_angola": "Porquê isto importa",
        "categoria": "Política, Economia, Sociedade, Tecnologia, Mundo ou Desporto",
        "seo_keywords": "5-8 palavras-chave"
      }

      EXEMPLO DE ESTILO (Siga este padrão de tom e estrutura):
      Fonte: "Angola e Japão reforçam cooperação no petróleo..."
      Resultado:
      Título: "Angola aproxima-se do Japão para acelerar reformas e reduzir dependência do petróleo"
      Resumo: "Angola quer transformar o Japão num parceiro estratégico central para impulsionar reformas económicas e acelerar a diversificação."
      Análise Sem Filtro: "Angola volta a apostar numa narrativa já conhecida... O desafio está na capacidade interna de execução..."

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

