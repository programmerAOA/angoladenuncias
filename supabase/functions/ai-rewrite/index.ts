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

        // Check for OpenAI Key
        const apiKey = Deno.env.get("OPENAI_API_KEY");
        if (!apiKey) {
            console.error("Missing OPENAI_API_KEY");
            return new Response(
                JSON.stringify({ error: "Configuração de IA em falta (OPENAI_API_KEY não encontrada no Supabase)." }),
                { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
        }

        // Clean content from common truncation markers
        let cleanContent = (content || '').replace(/\[\+\d+\s+chars\]/gi, '').replace(/\[\d+\s+chars\]/gi, '').trim();

        const prompt = `
      Você é um jornalista sénior e editor de notícias para um portal de notícias profissional e angolano chamado "Informativa". 
      Sua missão é reescrever a notícia abaixo, adaptando-a à nossa linha editorial.

      LINHA EDITORIAL: "${line}"

      REGRAS FUNDAMENTAIS:
      1. ESTILO: Use um tom profissional, direto e formal.
      2. EXPANSÃO: Transforme snippets curtos em notícias de 3 a 5 parágrafos médios.
      3. FACTOS: Seja fiel aos factos, mas organize-os por ordem de importância (pirâmide invertida).
      4. SEM METADADOS: NÃO inclua disclaimers como "Aqui está a notícia..." ou "Esta é uma versão reestruturada...". Comece diretamente com a notícia.
      5. HTML: O corpo completo deve vir em parágrafos HTML (<p>...</p>).
      6. AVALIAÇÃO: Analise o impacto económico/social e a relevância específica para Angola.

      ESTRUTURA DE RETORNO (JSON):
      {
        "titulo": "Título jornalístico impactante",
        "resumo": "Um resumo executivo de 2 frases",
        "full_content_html": "Corpo da notícia em <p>",
        "impacto": "Breve análise do impacto do evento",
        "relevancia_para_angola": "Explicação do porquê isto é importante para o público angolano",
        "categoria": "Uma das categorias: Política, Economia, Sociedade, Tecnologia, Mundo, Desporto"
      }

      DADOS PARA REESTRUTURAÇÃO:
      TÍTULO ORIGINAL: ${title}
      CONTEÚDO ORIGINAL: ${cleanContent}
    `;

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [
                    { role: "system", content: "Você é um editor sénior angolano. Retorne sempre JSON válido com as chaves: titulo, resumo, full_content_html, impacto, relevancia_para_angola, categoria." },
                    { role: "user", content: prompt }
                ],
                response_format: { type: "json_object" }
            }),
        });

        if (!response.ok) {
            const errorMsg = await response.text();
            throw new Error(`OpenAI API Error: ${response.status} - ${errorMsg}`);
        }

        const aiData = await response.json();

        if (!aiData.choices || aiData.choices.length === 0) {
            throw new Error("A IA não retornou nenhuma resposta válida.");
        }

        const result = JSON.parse(aiData.choices[0].message.content);

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
