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
        const { content, title, line, url: sourceUrl } = await req.json();

        // Volta a usar Gemini, obrigatoriamente a versão 2.5-flash porque a chave tem quota 0 para o 2.0
        const apiKey = Deno.env.get("GEMINI_API_KEY") || Deno.env.get("GOOGLE_AI_STUDIO_API_KEY");
        const GEMINI_MODEL = "gemini-2.5-flash";

        if (!apiKey) {
            console.error("Missing GEMINI_API_KEY");
            return new Response(
                JSON.stringify({ error: "Chave de API Gemini não configurada." }),
                { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
        }

        let finalContent = content || "";

        if (sourceUrl && (finalContent.length < 500 || finalContent.includes("[+"))) {
            console.log("AI-Rewrite: Fetching full content from URL:", sourceUrl);
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
                        console.log("AI-Rewrite: Scraped content length:", finalContent.length);
                    }
                }
            } catch (scrapeError) {
                console.error("AI-Rewrite: Scraping failed:", scrapeError);
            }
        }

        const cleanContent = finalContent
            .replace(/\[\+\d+\s+chars\]/gi, '')
            .replace(/\[\d+\s+chars\]/gi, '')
            .trim();

        const prompt = `
Tu és um motor avançado de reescrita jornalística e geração editorial automática.

O teu nome de operação é: ANGOLA SEM FILTROS ENGINE.

OBJECTIVO:
Transformar qualquer notícia fornecida em um artigo jornalístico completo, original, contributivo e construtivo, optimizado para SEO e pronto para publicação num CMS.

---

## NORMA LINGUÍSTICA E GRAMATICAL OBRIGATÓRIA (PORTUGUÊS DE ANGOLA - ANTIGO ACORDO ORTOGRÁFICO AO45)
O texto DEVE ser redigido com absoluto rigor gramatical na norma culta de Angola, utilizando ESTRITAMENTE o Antigo Acordo Ortográfico (pré-AO90 / Acordo de 1945 em vigor em Angola):

1. CONSOANTES MUDAS / ETIMOLÓGICAS OBRIGATÓRIAS (manter imperativamente 'c' e 'p'):
   - É terminantemente proibido suprimir as consoantes 'c' e 'p' nas palavras onde tradicionalmente existiam.
   - Escrever SEMPRE:
     * acção, reacção, infracção, fracção, tracção, correcção, direcção, protecção
     * actual, actualmente, actualizar, actualidade
     * actor, actriz, actuação
     * afectado, afectar, afectação
     * carácter, características
     * colectivo, colectividade
     * contacto, contactos, contactar
     * directo, directamente, directiva, director, directório
     * eléctrico, electricidade, electrificação
     * exacto, exactamente, exactidão
     * inspector, inspecção, inspectivo
     * lectivo, ano lectivo
     * objecção, objectivo, objectividade
     * óptimo, optimismo, optimizar
     * adopção, adoptar, adoptivo
     * apto, aptidão
     * corrupto, corrupção
     * recepção, receptor, recepcionista
     * sector, sectores, sectorial
     * aspecto, aspectos
     * projecto, projectos, projectar
     * táctica, táctico
     * trajecto, trajectória
   - NUNCA usar grafias pós-AO90 como "ação", "atual", "direto", "setor", "projeto", "ótimo", etc.

2. ACENTUAÇÃO GRÁFICA TRADICIONAL (PRÉ-AO90):
   - Acentuar os ditongos abertos paroxítonos: idéia, estréia, assembléia, paranóico, heróico, apóia, jibóia, jóia, bóia.
   - Manter acento circunflexo nos verbos com 'ee' no plural: crêem, dêem, lêem, vêem, prevêem, descrêem.
   - Manter acento circunflexo no hiato 'oo': vôo, vôos, enjôo, zôo.
   - Manter acentos diferenciais: pára (verbo parar) vs. para (preposição); pêlo (substantivo) vs. pelo (contração); pólo (substantivo).

3. REGRAS DE HIFENIZAÇÃO DO AO45:
   - Manter hífen com prefixos como auto-, contra-, extra-, infra-, intra-, neo-, proto-, pseudo-, semi-, supra-, ultra- diante de vogal, h, r e s: ex. auto-estrada, anti-social, contra-revolução, ultra-som, micro-ondas.

4. RIGOR GRAMATICAL, SINTÁCTICO E VOCABULÁRIO DE ANGOLA:
   - Perfeita concordância nominal e verbal (sem erros de género, número ou tempo verbal).
   - Regência verbal culta e precisa.
   - Colocação pronominal formal segundo a norma culta angolana (evitar iniciar frases com pronomes oblíquos; preferir ênclise em início de orações: "Verificou-se...", "Aponta-se...").
   - Vocabulário e terminologia de Angola: moeda Kwanza / Kwanzas (Kz), equipa (não equipe), utilizador (não usuário), registar (não cadastrar), governo provincial, administração municipal, comuna, cidadãos angolanos.
   - Parágrafos concisos, fluidos, sem redundâncias e sem quebras de linha artificiais ou tags vazias.

---

## REGRAS EDITORIAIS OBRIGATÓRIAS (ANGOLA SEM FILTROS)

- Escrever sempre em português de Angola no antigo Acordo Ortográfico
- Estilo: crítico, independente, transparente, rigoroso e comprometido com a verdade
- Prioridade Absoluta: salvaguardar o bem-estar do povo de Angola e o interesse público em primeiro lugar
- Evitar cópia ou reprodução acrítica de discursos oficiais e comunicados institucionais
- Escrutinar os actos de governação, apontando falhas, contradições, problemas sociais e a eficácia real das políticas públicas
- Títulos devem ser incisivos, transparentes e captar o impacto real dos acontecimentos na vida dos cidadãos
- Evitar repetição de palavras e termos vagos (usar linguagem precisa, firme e clara)
- Exigir responsabilidade e prestação de contas dos gestores e instituições públicas

---

## ESTRUTURA OBRIGATÓRIA DO ARTIGO

### 1. TÍTULO (SEO + IMPACTO POPULAR)
- Curto ou médio
- Incisivo, focado na realidade dos factos e no impacto directo para o povo angolano

### 2. RESUMO (curto)
- 1 a 3 linhas apenas
- Informação directa, objectiva e sem rodeios sobre o acontecimento

### 3. TEXTO PRINCIPAL (3 a 5 ALÍNEAS FACTUAIS)
- Estrutura em pontos ou parágrafos limpos e directos (sem quebras artificiais nem espaços excessivos)
- Factos reorganizados com clareza, imparcialidade e rigor investigativo
- Destacar dados concretos, consequências sociais e declarações relevantes

### 4. ANÁLISE — ANGOLA SEM FILTROS
- Análise sem filtros, profundamente crítica, transparente e desassombrada
- Questionar os interesses em jogo, avaliar se as medidas servem verdadeiramente o povo ou apenas elites
- Identificar riscos, omissões, corrupção ou incompetência administrativa quando aplicável
- Propor o escrutínio público e a defesa intransigente dos direitos e do bem-estar dos cidadãos angolanos

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

        console.log(`AI-Rewrite: Sending prompt to Gemini (${GEMINI_MODEL})...`);

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=` + apiKey,
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
            } catch { /* ignore parse errors */ }
            throw new Error(friendlyError);
        }

        const aiData = await response.json();

        if (!aiData.candidates || aiData.candidates.length === 0) {
            throw new Error("O Gemini não retornou resposta.");
        }

        const rawText = aiData.candidates[0].content.parts[0].text;
        console.log("AI-Rewrite: Raw Gemini response length:", rawText.length);

        let result: any;
        try {
            result = JSON.parse(rawText);
        } catch (parseErr) {
            const jsonMatch = rawText.match(/```(?:json)?\s*([\s\S]*?)```/);
            if (jsonMatch) {
                result = JSON.parse(jsonMatch[1].trim());
            } else {
                throw new Error("Falha ao interpretar resposta JSON da IA: " + parseErr.message);
            }
        }

        const sections = result.content?.sections || [];

        const getSection = (type: string) => sections.find((s: any) => s.type === type);
        const bodySection = getSection("body");
        const bodyLines: string[] = Array.isArray(bodySection?.value)
            ? bodySection.value
            : [bodySection?.value || ""];

        const fullContentHtml = [
            ...bodyLines.filter((l: string) => l && l.trim()).map((line: string) => `<p>${line.trim()}</p>`),
            `<h3>Análise — Angola Sem Filtros</h3>`,
            `<p>${(getSection("analysis")?.value || "").trim()}</p>`,
        ].filter(Boolean).join("\n");

        const normalized = {
            titulo: result.title,
            resumo: result.summary,
            full_content_html: fullContentHtml,
            categoria: result.category,
            autor: result.author || "Angola Sem Filtros",
            seo_keywords: result.seo?.tags?.join(", ") || getSection("seo_keywords")?.value || "",
            factos: bodyLines.join(" | "),
            contexto: "",
            leitura_critica: getSection("analysis")?.value || "",
            impacto: "",
            relevancia_para_angola: getSection("analysis")?.value || "",
            slug: result.slug || result.seo?.slug || "",
            meta_description: result.seo?.meta_description || "",
            tags: result.seo?.tags || [],
            social_facebook: result.social?.facebook || "",
            social_instagram: result.social?.instagram || "",
            social_twitter: result.social?.twitter || "",
            reliability_score: result.reliability_score ?? 70,
            language: result.language || "pt-AO",
            editorial_mode: result.editorial_mode || "angola_sem_filtros",
            raw: result,
        };

        console.log("AI-Rewrite: Success. Reliability score:", normalized.reliability_score);

        return new Response(JSON.stringify(normalized), {
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
