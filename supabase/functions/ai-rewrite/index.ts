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
      Você é um jornalista sénior e editor de notícias para um portal em Angola. 
      Sua tarefa é reescrever e EXPANDIR a notícia fornecida.
      
      LINHA EDITORIAL: "${line}"
      
      IMPORTANTE:
      - O conteúdo original pode estar incompleto ou truncado. Sua missão é DESENVOLVER a notícia, criando um texto completo, profissional e informativo.
      - Use seu conhecimento geral para adicionar contexto relevante se necessário, mas mantenha a fidelidade aos factos centrais.
      - O texto final deve ter pelo menos 4 a 6 parágrafos bem estruturados.
      - O tom deve ser adequado para um portal de notícias de prestígio em Angola.
      - REMOVA qualquer menção a "[+... chars]" ou marcadores de truncagem.

      ESTRUTURA DE RETORNO (JSON):
      {
        "title": "Título impactante em Português de Angola",
        "summary": "Um resumo atraente (2-3 frases)",
        "content": "O corpo completo da notícia, dividido em parágrafos HTML (<p>...<p>)"
      }

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
                    { role: "system", content: "Você é um assistente especializado em jornalismo angolano. Você sempre responde com JSON válido." },
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
