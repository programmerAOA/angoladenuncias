import "jsr:@supabase/functions-js/edge-runtime.d.ts";

Deno.serve(async (req) => {
    // CORS header
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    };

    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        const { content, title, line } = await req.json();

        const apiKey = Deno.env.get("OPENAI_API_KEY");

        if (!apiKey) {
            console.error("Missing OPENAI_API_KEY");
            return new Response(
                JSON.stringify({ error: "Configuração de IA em falta (API Key não encontrada)." }),
                { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
        }

        // Prompt engineering based on the requested editorial line
        const prompt = `
      Você é um editor de notícias experiente. Sua tarefa é reescrever a notícia fornecida seguindo a linha editorial: "${line}".
      
      REGRAS:
      1. Mantenha o formato de notícia profissional (Título, Resumo, Conteúdo).
      2. Adapte o tom para ser ${line}.
      3. Não perca os factos principais.
      4. O idioma deve ser Português de Angola.
      5. Retorne um JSON com os campos: "title", "summary", "content".

      TÍTULO ORIGINAL: ${title}
      CONTEÚDO ORIGINAL: ${content}
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
                    { role: "system", content: "Você é um assistente especializado em jornalismo e edição de notícias." },
                    { role: "user", content: prompt }
                ],
                response_format: { type: "json_object" }
            }),
        });

        const aiData = await response.json();
        const result = JSON.parse(aiData.choices[0].message.content);

        return new Response(JSON.stringify(result), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
        });

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
        });
    }
});
