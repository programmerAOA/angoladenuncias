import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { categories } from "@/constants/categories";
import { toSlug } from "@/lib/utils";
import {
  Sparkles,
  Settings,
  Search,
  Wand2,
  Send,
  LogOut,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Sliders,
  Globe,
  Key,
  Database,
  ArrowRight,
  Radio,
  Image as ImageIcon
} from "lucide-react";
import { toast } from "sonner";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function MobileAdminPage() {
  const { user, isAdmin, isEditor, signOut, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<"ai-generator" | "settings">("ai-generator");

  // Login local state se não logado
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Estados do Gerador IA
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [discoveryResults, setDiscoveryResults] = useState<any[]>([]);
  const [isAdapting, setIsAdapting] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  // Artigo em edição
  const [editorialArticle, setEditorialArticle] = useState({
    title: "",
    summary: "",
    content: "",
    category: "Sociedade",
    imageUrl: "",
    sourceUrl: "",
    sourceName: "",
    editorialLine: "Investigativo, rigoroso, independente e sem censura. Foco no interesse público angolano.",
    isBreaking: false,
    isHero: false
  });

  // Configurações do Sistema
  const [geminiApiKey, setGeminiApiKey] = useState("");
  const [tickerSpeed, setTickerSpeed] = useState(30);
  const [adsTxtContent, setAdsTxtContent] = useState("");
  const [isLoadingSettings, setIsLoadingSettings] = useState(false);
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  // Carregar configurações ao abrir a aba
  useEffect(() => {
    if ((isAdmin || isEditor) && activeTab === "settings") {
      loadSettings();
    }
  }, [isAdmin, isEditor, activeTab]);

  const loadSettings = async () => {
    setIsLoadingSettings(true);
    try {
      // 1. Chave Gemini em site_config ou system_settings
      const { data: configData } = await supabase
        .from("system_settings")
        .select("value")
        .eq("key", "gemini_api_key")
        .maybeSingle();
      if (configData?.value) setGeminiApiKey(String(configData.value));

      // 2. Ticker Speed
      const { data: tickerData } = await supabase
        .from("system_settings")
        .select("value")
        .eq("key", "ticker")
        .maybeSingle();
      if (tickerData?.value && typeof tickerData.value === "object") {
        const val = tickerData.value as any;
        if (val.speed) setTickerSpeed(Number(val.speed));
      }

      // 3. Ads.txt
      const { data: adsData } = await supabase
        .from("system_settings")
        .select("value")
        .eq("key", "site_validation")
        .maybeSingle();
      if (adsData?.value && typeof adsData.value === "object") {
        const val = adsData.value as any;
        if (val.content) setAdsTxtContent(val.content);
      }
    } catch (err: any) {
      console.error("Erro ao carregar configurações:", err);
    } finally {
      setIsLoadingSettings(false);
    }
  };

  const handleSaveSettings = async () => {
    setIsSavingSettings(true);
    try {
      // Salvar Chave Gemini
      await supabase.from("system_settings").upsert({
        key: "gemini_api_key",
        value: geminiApiKey,
        updated_at: new Date().toISOString()
      });

      // Salvar Ticker
      await supabase.from("system_settings").upsert({
        key: "ticker",
        value: { speed: tickerSpeed },
        updated_at: new Date().toISOString()
      });

      // Salvar ads.txt se preenchido
      if (adsTxtContent) {
        await supabase.from("system_settings").upsert({
          key: "site_validation",
          value: { method: "ads.txt", content: adsTxtContent },
          updated_at: new Date().toISOString()
        });
      }

      toast.success("Configurações gravadas com sucesso!");
    } catch (err: any) {
      toast.error("Erro ao gravar: " + (err.message || "Tente novamente"));
    } finally {
      setIsSavingSettings(false);
    }
  };

  // Login no app
  const handleMobileLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      toast.error("Preencha todos os campos.");
      return;
    }
    setIsLoggingIn(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword
      });
      if (error) throw error;
      toast.success("Sessão iniciada com sucesso!");
    } catch (err: any) {
      toast.error("Falha no login: " + (err.message || "Credenciais inválidas"));
    } finally {
      setIsLoggingIn(false);
    }
  };

  // 1. Pesquisa OSINT de Notícias
  const handleSearchOSINT = async () => {
    if (!searchQuery.trim()) {
      toast.warning("Digite um tema ou termo de pesquisa.");
      return;
    }
    setIsSearching(true);
    setDiscoveryResults([]);

    try {
      // Tentar via endpoint de descoberta ou buscar tópicos relevantes
      const res = await fetch("/api/ai-discovery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery })
      });

      if (res.ok) {
        const data = await res.json();
        if (data?.results && data.results.length > 0) {
          setDiscoveryResults(data.results);
          toast.success(`${data.results.length} notícias encontradas!`);
          return;
        }
      }

      // Fallback: usar Puter.js / IA para simular busca estruturada de fatos
      const puter = (window as any).puter;
      if (puter?.ai) {
        const prompt = `Actua como jornalista de investigação angolano. Com base no tema "${searchQuery}", lista 3 fatos ou notícias recentes verificáveis em formato JSON array:
[{"title": "título factual", "snippet": "resumo com detalhes, entidades e datas", "category": "Sociedade", "url": "https://fonte-exemplo.com"}]
Devolve APENAS o JSON válido.`;
        const aiRes = await puter.ai.chat(prompt, { model: "gemini-2.5-flash" });
        const text = typeof aiRes === "string" ? aiRes : aiRes?.message?.content || "";
        const jsonMatch = text.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          setDiscoveryResults(parsed);
          toast.success("Tópicos gerados via IA!");
          return;
        }
      }

      toast.info("Nenhum resultado retornado. Tente outras palavras.");
    } catch (err: any) {
      toast.error("Erro na pesquisa: " + (err.message || "Tente novamente"));
    } finally {
      setIsSearching(false);
    }
  };

  // 2. Reescrita com IA
  const handleRewriteWithAI = async (itemTitle: string, itemContent: string, itemUrl?: string) => {
    setIsAdapting(true);
    toast.info("A reescrever a matéria com o tom editorial Sem Filtros...");

    try {
      const prompt = `És o Editor-Chefe do portal independente angolano 'Sem Filtros'.
Reescreve a notícia a seguir no nosso tom editorial: rigoroso, sem censura, factual, direto e com análise crítica do interesse público angolano.

Título original: ${itemTitle}
Conteúdo/Fonte: ${itemContent}
Link original: ${itemUrl || ""}

Formato de resposta OBRIGATÓRIO em JSON:
{
  "title": "Título forte, cativante e factual em português de Angola",
  "summary": "Resumo de 2 frases diretas para o leitor e redes sociais",
  "content": "<p>Primeiro parágrafo direto.</p><p>Segundo parágrafo com contexto...</p><h3>Análise – Angola Sem Filtros</h3><p>Análise crítica independente...</p>",
  "category": "Sociedade",
  "seo_keywords": "palavra1, palavra2, angola"
}
Responde APENAS com o JSON.`;

      let generatedJson: any = null;

      // Tentar via /api/ai-rewrite
      try {
        const res = await fetch("/api/ai-rewrite", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content: itemContent,
            title: itemTitle,
            line: editorialArticle.editorialLine,
            url: itemUrl,
            apiKey: geminiApiKey
          })
        });
        if (res.ok) {
          const data = await res.json();
          if (data?.title) generatedJson = data;
        }
      } catch (e) {
        console.warn("Endpoint /api/ai-rewrite inacessível, usando IA de fallback...");
      }

      // Fallback via Puter.js
      if (!generatedJson) {
        const puter = (window as any).puter;
        if (puter?.ai) {
          const aiRes = await puter.ai.chat(prompt, { model: "gemini-2.5-flash" });
          const text = typeof aiRes === "string" ? aiRes : aiRes?.message?.content || "";
          const match = text.match(/\{[\s\S]*\}/);
          if (match) {
            generatedJson = JSON.parse(match[0]);
          }
        }
      }

      if (generatedJson) {
        setEditorialArticle(prev => ({
          ...prev,
          title: generatedJson.title || itemTitle,
          summary: generatedJson.summary || "",
          content: generatedJson.content || itemContent,
          category: generatedJson.category || prev.category,
          sourceUrl: itemUrl || prev.sourceUrl,
          sourceName: prev.sourceName || "Agência"
        }));
        toast.success("Matéria reescrita com sucesso! Pronta para revisão e publicação.");
      } else {
        throw new Error("Não foi possível gerar a resposta com a IA.");
      }
    } catch (err: any) {
      toast.error("Erro na geração: " + (err.message || "Tente novamente"));
    } finally {
      setIsAdapting(false);
    }
  };

  // 3. Publicar Artigo
  const handlePublishArticle = async (publishNow = true) => {
    if (!editorialArticle.title.trim()) {
      toast.error("O título é obrigatório.");
      return;
    }
    if (!editorialArticle.content.trim()) {
      toast.error("O conteúdo da notícia é obrigatório.");
      return;
    }

    setIsPublishing(true);
    try {
      const slug = toSlug(editorialArticle.title);
      const now = new Date().toISOString();

      const articlePayload = {
        title: editorialArticle.title.trim(),
        slug: slug,
        summary: editorialArticle.summary.trim() || null,
        content: editorialArticle.content.trim(),
        category: editorialArticle.category,
        image_url: editorialArticle.imageUrl.trim() || "https://www.semfiltros.com/logo.png",
        author: user?.user_metadata?.full_name || "Redacção Sem Filtros",
        published: publishNow,
        created_at: now,
        updated_at: now,
        source_name: editorialArticle.sourceName || null,
        source_url: editorialArticle.sourceUrl || null,
        is_breaking: editorialArticle.isBreaking,
        is_hero: editorialArticle.isHero
      };

      const { data, error } = await supabase
        .from("news_articles")
        .insert(articlePayload)
        .select("id, slug, category")
        .single();

      if (error) throw error;

      toast.success(publishNow ? "Notícia publicada no portal com sucesso!" : "Rascunho guardado!");

      // Limpar formulário
      setEditorialArticle({
        title: "",
        summary: "",
        content: "",
        category: "Sociedade",
        imageUrl: "",
        sourceUrl: "",
        sourceName: "",
        editorialLine: "Investigativo, rigoroso, independente e sem censura. Foco no interesse público angolano.",
        isBreaking: false,
        isHero: false
      });
    } catch (err: any) {
      console.error("Erro ao publicar:", err);
      toast.error("Erro ao salvar: " + (err.message || "Erro desconhecido"));
    } finally {
      setIsPublishing(false);
    }
  };

  // Ecrã de carregamento
  if (authLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center p-4">
        <LoadingSpinner />
        <p className="mt-4 text-xs text-zinc-400">A iniciar o Sem Filtros Mobile...</p>
      </div>
    );
  }

  // Ecrã de Login para não autenticados
  if (!user || (!isAdmin && !isEditor)) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex flex-col justify-center px-6 py-12">
        <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
          <div className="w-16 h-16 bg-red-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-red-600/30 mb-4">
            <Radio className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-black font-heading tracking-tight">Sem Filtros Mobile</h2>
          <p className="mt-1 text-sm text-zinc-400">Acesso Restrito: Redação e Configurações</p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl">
          <form onSubmit={handleMobileLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                Email
              </label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={e => setLoginEmail(e.target.value)}
                placeholder="redacao@semfiltros.com"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                Senha
              </label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={e => setLoginPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500"
              />
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-red-600/20 transition-all flex items-center justify-center gap-2 mt-2"
            >
              {isLoggingIn ? <LoadingSpinner /> : <>Entrar no Aplicativo <ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col pb-24">
      {/* Top Header Mobile */}
      <header className="sticky top-0 z-40 bg-zinc-900/90 backdrop-blur-md border-b border-zinc-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center font-black text-xs text-white">
            SF
          </div>
          <div>
            <h1 className="text-sm font-bold leading-none">Sem Filtros</h1>
            <span className="text-[10px] text-zinc-400 uppercase tracking-widest">
              {activeTab === "ai-generator" ? "Gerador IA" : "Configurações"}
            </span>
          </div>
        </div>

        <button
          onClick={() => signOut()}
          className="p-2 text-zinc-400 hover:text-red-400 transition-colors rounded-lg bg-zinc-800/60"
          title="Terminar Sessão"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </header>

      {/* Conteúdo Principal */}
      <main className="flex-1 p-4 max-w-lg mx-auto w-full space-y-6">
        {/* ABA: GERADOR DE NOTÍCIAS COM IA */}
        {activeTab === "ai-generator" && (
          <div className="space-y-6 animate-fade-in">
            {/* Bloco 1: Pesquisa OSINT & Fatos */}
            <section className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-red-500" />
                <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-200">
                  Descoberta & Pauta Inteligente
                </h2>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleSearchOSINT()}
                  placeholder="Ex: Luanda, Sonangol, Tribunal, BNA..."
                  className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                />
                <button
                  onClick={handleSearchOSINT}
                  disabled={isSearching}
                  className="bg-red-600 active:bg-red-700 text-white px-3.5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-red-600/20"
                >
                  {isSearching ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
                  Pesquisar
                </button>
              </div>

              {/* Resultados da Pesquisa */}
              {discoveryResults.length > 0 && (
                <div className="mt-4 space-y-2.5 max-h-60 overflow-y-auto pr-1">
                  {discoveryResults.map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-zinc-950 border border-zinc-800/80 rounded-xl p-3 flex flex-col justify-between gap-2 hover:border-zinc-700 transition-colors"
                    >
                      <div>
                        <h3 className="text-xs font-bold text-zinc-200 line-clamp-2">{item.title}</h3>
                        <p className="text-[11px] text-zinc-400 mt-1 line-clamp-2">{item.snippet || item.content}</p>
                      </div>
                      <button
                        onClick={() => handleRewriteWithAI(item.title, item.snippet || item.content || item.title, item.url)}
                        disabled={isAdapting}
                        className="self-end bg-zinc-800 hover:bg-red-600 active:bg-red-700 text-white text-[11px] font-semibold px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition-all"
                      >
                        <Wand2 className="w-3 h-3 text-red-400" />
                        Reescrever com IA
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Bloco 2: Formulário / Revisão Editorial */}
            <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 space-y-4 shadow-sm">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                  <Wand2 className="w-3.5 h-3.5 text-red-500" /> Redação Editorial
                </span>
                {isAdapting && (
                  <span className="text-[11px] text-amber-400 flex items-center gap-1">
                    <RefreshCw className="w-3 h-3 animate-spin" /> A redigir...
                  </span>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 uppercase mb-1">Título</label>
                <input
                  type="text"
                  value={editorialArticle.title}
                  onChange={e => setEditorialArticle({ ...editorialArticle, title: e.target.value })}
                  placeholder="Título da matéria..."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-400 uppercase mb-1">Categoria</label>
                  <select
                    value={editorialArticle.category}
                    onChange={e => setEditorialArticle({ ...editorialArticle, category: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500 capitalize"
                  >
                    {categories.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-zinc-400 uppercase mb-1">Fonte</label>
                  <input
                    type="text"
                    value={editorialArticle.sourceName}
                    onChange={e => setEditorialArticle({ ...editorialArticle, sourceName: e.target.value })}
                    placeholder="Ex: Angop, BNA..."
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 uppercase mb-1">URL da Imagem</label>
                <input
                  type="url"
                  value={editorialArticle.imageUrl}
                  onChange={e => setEditorialArticle({ ...editorialArticle, imageUrl: e.target.value })}
                  placeholder="https://.../imagem.jpg"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 uppercase mb-1">Resumo / Lead</label>
                <textarea
                  rows={2}
                  value={editorialArticle.summary}
                  onChange={e => setEditorialArticle({ ...editorialArticle, summary: e.target.value })}
                  placeholder="Resumo executivo da matéria..."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-red-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 uppercase mb-1">Corpo da Matéria (HTML ou Texto)</label>
                <textarea
                  rows={6}
                  value={editorialArticle.content}
                  onChange={e => setEditorialArticle({ ...editorialArticle, content: e.target.value })}
                  placeholder="Texto completo da investigação ou notícia..."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>

              {/* Botões de Ação */}
              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => handlePublishArticle(false)}
                  disabled={isPublishing}
                  className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold py-3 px-3 rounded-xl text-xs transition-colors"
                >
                  Salvar Rascunho
                </button>

                <button
                  type="button"
                  onClick={() => handlePublishArticle(true)}
                  disabled={isPublishing}
                  className="flex-1 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold py-3 px-3 rounded-xl text-xs shadow-lg shadow-red-600/30 flex items-center justify-center gap-1.5 transition-all"
                >
                  {isPublishing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                  Publicar Agora
                </button>
              </div>
            </section>
          </div>
        )}

        {/* ABA: CONFIGURAÇÕES DO SISTEMA */}
        {activeTab === "settings" && (
          <div className="space-y-6 animate-fade-in">
            <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4 shadow-sm">
              <div className="flex items-center gap-2 pb-2 border-b border-zinc-800">
                <Sliders className="w-4 h-4 text-red-500" />
                <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-200">
                  Parâmetros do Portal
                </h2>
              </div>

              {isLoadingSettings ? (
                <div className="py-8 flex justify-center">
                  <LoadingSpinner />
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1 flex items-center gap-1.5">
                      <Key className="w-3.5 h-3.5 text-amber-400" /> Chave de API Google Gemini
                    </label>
                    <input
                      type="password"
                      value={geminiApiKey}
                      onChange={e => setGeminiApiKey(e.target.value)}
                      placeholder="AIzaSy..."
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                    />
                    <span className="text-[10px] text-zinc-500 mt-1 block">
                      Usada para gerar e reescrever as notícias com IA diretamente no aplicativo.
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">
                      Velocidade do Ticker de Notícias ({tickerSpeed}s)
                    </label>
                    <input
                      type="range"
                      min="10"
                      max="60"
                      value={tickerSpeed}
                      onChange={e => setTickerSpeed(Number(e.target.value))}
                      className="w-full accent-red-600 cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1 flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-blue-400" /> Conteúdo do Ads.txt (AdSense)
                    </label>
                    <textarea
                      rows={3}
                      value={adsTxtContent}
                      onChange={e => setAdsTxtContent(e.target.value)}
                      placeholder="google.com, pub-4560407429890237, DIRECT, f08c47fec0942fa0"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-red-500 font-mono"
                    />
                  </div>

                  <button
                    onClick={handleSaveSettings}
                    disabled={isSavingSettings}
                    className="w-full bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold py-3 px-4 rounded-xl text-xs shadow-lg shadow-red-600/20 flex items-center justify-center gap-2 transition-all mt-4"
                  >
                    {isSavingSettings ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                    Guardar Configurações
                  </button>
                </>
              )}
            </section>
          </div>
        )}
      </main>

      {/* Bottom Navigation Bar Fixa Estilo Mobile App Nativo */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-zinc-900/95 backdrop-blur-lg border-t border-zinc-800 px-6 py-2.5 flex justify-around items-center">
        <button
          onClick={() => setActiveTab("ai-generator")}
          className={`flex flex-col items-center gap-1 transition-all ${
            activeTab === "ai-generator" ? "text-red-500 scale-105" : "text-zinc-500 hover:text-zinc-300"
          }`}
        >
          <Sparkles className="w-5 h-5" />
          <span className="text-[10px] font-bold">Gerador IA</span>
        </button>

        <button
          onClick={() => setActiveTab("settings")}
          className={`flex flex-col items-center gap-1 transition-all ${
            activeTab === "settings" ? "text-red-500 scale-105" : "text-zinc-500 hover:text-zinc-300"
          }`}
        >
          <Settings className="w-5 h-5" />
          <span className="text-[10px] font-bold">Configurações</span>
        </button>
      </nav>
    </div>
  );
}
