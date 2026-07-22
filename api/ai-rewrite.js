// Vercel Edge Runtime configuration (forced redeploy to load new API key)
export const config = {
    runtime: 'edge',
};

// Main API Handler for AI Article Rewrite
export default async function handler(req) {
    // Set CORS headers
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        const body = await req.json();
        const { content, title, line, url: sourceUrl, apiKey: passedApiKey } = body;

        let finalContent = content || "";

        // Web scraping fallback if url is present and content is short
        if (sourceUrl && (finalContent.length < 500 || finalContent.includes("[+"))) {
            console.log("ai-rewrite (vercel): Fetching full content from URL:", sourceUrl);
            try {
                const scrapeResponse = await fetch(sourceUrl, {
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36'
                    }
                });

                if (scrapeResponse.ok) {
                    const html = await scrapeResponse.text();
                    const cleanHtml = html
                        .replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gim, "")
                        .replace(/<style\b[^>]*>([\s\S]*?)<\/style>/gim, "")
                        .replace(/<footer\b[^>]*>([\s\S]*?)<\/footer>/gim, "")
                        .replace(/<nav\b[^>]*>([\s\S]*?)<\/nav>/gim, "")
                        .replace(/<[^>]+>/g, " ")
                        .replace(/\s+/g, " ")
                        .trim();

                    if (cleanHtml.length > finalContent.length) {
                        finalContent = cleanHtml.substring(0, 30000);
                        console.log("ai-rewrite (vercel): Scraped content length:", finalContent.length);
                    }
                }
            } catch (scrapeError) {
                console.error("ai-rewrite (vercel): Scraping failed:", scrapeError);
            }
        }

        const cleanContent = finalContent
            .replace(/\[\+\d+\s+chars\]/gi, '')
            .replace(/\[\d+\s+chars\]/gi, '')
            .trim();

        const apiKey = passedApiKey || process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_STUDIO_API_KEY;
        const GEMINI_MODEL = "gemini-2.5-flash";

        const prompt = `
Tu és um motor avançado de reescrita jornalística e geração editorial automática.

O teu nome de operação é: ANGOLA SEM FILTROS ENGINE.

OBJECTIVO:
Transformar qualquer notícia fornecida em um artigo jornalístico completo, original, contributivo e construtivo, optimizado para SEO e pronto para publicação num CMS.

---

## REGRAS EDITORIAIS OBRIGATÓRIAS (ANGOLA SEM FILTROS)

- Escrever sempre em português de Angola
- Usar exclusivamente o antigo Acordo Ortográfico (pré-AO90)
- Estilo: construtivo, contributivo, focado em soluções e realizações institucionais
- Evitar cópia ou estrutura da fonte original
- Valorizar a linguagem institucional e o impacto positivo das ações de governação
- Títulos devem ser cativantes, respeitosos e optimizados para SEO (evitar alarmismos)
- Evitar repetição de palavras (usar variações ricas do português)
- Sempre incluir o contexto do esforço governamental e institucional quando aplicável

---

## ESTRUTURA OBRIGATÓRIA DO ARTIGO

### 1. TÍTULO (SEO + IMPACTO)
- Curto ou médio
- Construtivo, centrado em realizações com palavra-chave principal
- Pode omitir parcialmente o sujeito para gerar curiosidade construtiva

### 2. RESUMO (curto)
- 1 a 3 linhas apenas
- Informação directa, com foco no impacto positivo

### 3. TEXTO PRINCIPAL (3 a 5 ALÍNEAS FACTUAIS)
- Estrutura em pontos ou parágrafos curtos
- Informação reorganizada (não copiada)
- Contexto contributivo sempre que possível
- Clareza e objectividade

### 4. ANÁLISE — ANGOLA SEM FILTROS
- Tom contributivo e construtivo (parcialidade positiva para estabilidade governamental)
- Explica as mais-valias sociais, políticas ou económicas das medidas
- Linguagem ponderada, evidenciando o esforço do Governo no poder
- Destacar as soluções institucionais e o progresso em marcha

### 5. SEO
- Lista de palavras-chave separadas por vírgulas (horizontal)
- Optimizado para Google e redes sociais

---

## DADOS A GERAR (OBRIGATÓRIO EM JSON)

Responde SEM texto fora do JSON. Devolve APENAS o JSON abaixo preenchido:

{
  "title": "",
  "slug": "",
  "category": "",
  "author": "Angola Sem Filtros",
  "summary": "",
  "content": {
    "sections": [
      {
        "type": "title",
        "value": ""
      },
      {
        "type": "summary",
        "value": ""
      },
      {
        "type": "body",
        "value": [
          "alínea 1",
          "alínea 2",
          "alínea 3",
          "alínea 4"
        ]
      },
      {
        "type": "analysis",
        "value": ""
      },
      {
        "type": "seo_keywords",
        "value": ""
      }
    ]
  },
  "seo": {
    "meta_description": "",
    "tags": [],
    "slug": ""
  },
  "social": {
    "facebook": "",
    "instagram": "",
    "twitter": ""
  },
  "reliability_score": 0,
  "language": "pt-AO",
  "editorial_mode": "angola_sem_filtros"
}

---

## REGRAS DE GERAÇÃO DE CAMPOS

slug:
- lowercase, separado por hífen, sem acentos

meta_description:
- máximo 155 caracteres
- resumo jornalístico optimizado SEO

tags:
- 5 a 12 tags relevantes (array de strings)

social:
- gerar 3 versões diferentes (facebook, instagram, twitter)
- estilo viral e informativo

reliability_score:
- 0 a 100
- baseado em: consistência da fonte, clareza dos dados, nível de confirmação
- se for rumor → abaixo de 40
- se for confirmado → acima de 70

---

## IMPORTANTE

- Não inventar factos fora do texto base
- Reorganizar e enriquecer, não fabricar informação
- Se faltar dados, manter tom construtivo
- Nunca sair do formato JSON

---

## INPUT

TÍTULO ORIGINAL: ${title || "(sem título)"}
CONTEXTO ADICIONAL: ${line || "Nenhum"}
FONTE: ${sourceUrl || "Não especificada"}

NOTÍCIA EM BRUTO:
${cleanContent}
`;

        // If API key is missing, return scraped content and prompt as fallback to allow client-side Puter.js rewriter
        if (!apiKey) {
            console.warn("ai-rewrite (vercel): No API Key configured. Returning scraped content and prompt for Puter fallback.");
            return new Response(
                JSON.stringify({ status: "missing_api_key", scrapedContent: cleanContent, prompt: prompt }),
                { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
        }

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: {
                        responseMimeType: "application/json",
                        temperature: 0.7,
                        maxOutputTokens: 8192,
                    },
                }),
            }
        );

        if (!response.ok) {
            const errorMsg = await response.text();
            console.error(`Gemini API Error ${response.status}:`, errorMsg);
            let friendlyError = `Gemini API Error ${response.status}`;
            try {
                const errJson = JSON.parse(errorMsg);
                friendlyError = errJson?.error?.message || friendlyError;
            } catch { }
            throw new Error(friendlyError);
        }

        const aiData = await response.json();

        if (!aiData.candidates || aiData.candidates.length === 0) {
            throw new Error("O Gemini não retornou resposta.");
        }

        const rawText = aiData.candidates[0].content.parts[0].text;

        // Clean JSON formatting if Gemini returned backticks surrounding it
        let cleanedJsonText = rawText.trim();
        if (cleanedJsonText.startsWith("```json")) {
            cleanedJsonText = cleanedJsonText.substring(7);
        } else if (cleanedJsonText.startsWith("```")) {
            cleanedJsonText = cleanedJsonText.substring(3);
        }
        if (cleanedJsonText.endsWith("```")) {
            cleanedJsonText = cleanedJsonText.substring(0, cleanedJsonText.length - 3);
        }
        cleanedJsonText = cleanedJsonText.trim();

        // Perform validation parse
        const parsed = JSON.parse(cleanedJsonText);

        return new Response(JSON.stringify(parsed), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200
        });

    } catch (error) {
        console.error('ai-rewrite error:', error);
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }
}
