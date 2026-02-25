import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import {
  LayoutDashboard, Newspaper, Video, MessageSquare, Users, Zap, Megaphone,
  Plus, Pencil, Trash2, Eye, EyeOff, LogOut, ArrowLeft, Check, X, Shield, RefreshCw,
  Globe, Bot, Search as SearchIcon, Sparkles, Wand2
} from "lucide-react";
import { toast } from "sonner";
import { formatRelativeDate, withTimeout } from "@/lib/utils";

type Tab = "dashboard" | "articles" | "videos" | "opinions" | "breaking" | "users" | "ai-discovery" | "ads";

interface Article {
  id: string;
  title: string;
  summary?: string;
  content?: string;
  category: string;
  image_url?: string;
  author: string | null;
  is_hero?: boolean | null;
  is_breaking?: boolean | null;
  published: boolean | null;
  views: number | null;
  created_at: string;
}

interface VideoItem {
  id: string;
  title: string;
  description?: string;
  video_url: string;
  thumbnail_url?: string;
  duration: string | null;
  category: string | null;
  published: boolean | null;
  views: number | null;
  created_at: string;
}

interface BreakingItem {
  id: string;
  text: string;
  active: boolean | null;
  created_at: string;
}

interface Opinion {
  id: string;
  title: string;
  author: string;
  content?: string;
  excerpt?: string;
  avatar_url?: string;
  published: boolean | null;
  created_at: string;
}

interface UserRole {
  id: string;
  user_id: string;
  role: string;
}

const AdminPage = () => {
  const { user, isAdmin, isEditor, loading, signOut } = useAuth();
  const navigate = useNavigate();

  // Capture global errors and show as toasts
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const originalOnError = window.onerror;
      window.onerror = (message) => {
        console.error("Global error caught:", message);
        toast.error("Erro detectado: " + message);
        if (originalOnError) return originalOnError(message);
        return false;
      };
      return () => { window.onerror = originalOnError; };
    }
  }, []);
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [articles, setArticles] = useState<Article[]>([]);
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [opinions, setOpinions] = useState<Opinion[]>([]);
  const [breakingNews, setBreakingNews] = useState<BreakingItem[]>([]);
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [stats, setStats] = useState({ articles: 0, videos: 0, opinions: 0, breaking: 0 });
  const [dataLoading, setDataLoading] = useState(false);
  const [savingArticle, setSavingArticle] = useState(false);
  const [savingVideo, setSavingVideo] = useState(false);
  const [savingOpinion, setSavingOpinion] = useState(false);
  const [savingBreaking, setSavingBreaking] = useState(false);
  const [tickerSpeed, setTickerSpeed] = useState(30);
  const [adCarouselSpeed, setAdCarouselSpeed] = useState(6);
  const [savingSettings, setSavingSettings] = useState(false);

  // Ads
  const [advertisements, setAdvertisements] = useState<any[]>([]);
  const [showAdForm, setShowAdForm] = useState(false);
  const [editingAd, setEditingAd] = useState<string | null>(null);
  const [savingAd, setSavingAd] = useState(false);
  const [adForm, setAdForm] = useState({ slot: "banner_top", title: "", image_url: "", video_url: "", link_url: "", display_order: 0 });


  // Article form
  const [articleForm, setArticleForm] = useState({ title: "", summary: "", content: "", category: "Política", author: "Redacção", image_url: "", is_hero: false, is_breaking: false });
  const [articleImageFile, setArticleImageFile] = useState<File | null>(null);
  const [editingArticle, setEditingArticle] = useState<string | null>(null);
  const [showArticleForm, setShowArticleForm] = useState(false);

  // Video form
  const [videoForm, setVideoForm] = useState({ title: "", description: "", video_url: "", thumbnail_url: "", duration: "", category: "Vídeo" });
  const [videoThumbnailFile, setVideoThumbnailFile] = useState<File | null>(null);
  const [editingVideo, setEditingVideo] = useState<string | null>(null);
  const [showVideoForm, setShowVideoForm] = useState(false);

  // Opinion form
  const [opinionForm, setOpinionForm] = useState({ title: "", author: "", content: "", excerpt: "", avatar_url: "" });
  const [opinionAvatarFile, setOpinionAvatarFile] = useState<File | null>(null);
  const [editingOpinion, setEditingOpinion] = useState<string | null>(null);
  const [showOpinionForm, setShowOpinionForm] = useState(false);

  // Breaking form
  const [breakingForm, setBreakingForm] = useState("");
  const [showBreakingForm, setShowBreakingForm] = useState(false);

  // User role form
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserRole, setNewUserRole] = useState<"admin" | "editor">("editor");

  // AI Discovery & Adaptation state
  const [discoveryQuery, setDiscoveryQuery] = useState("");
  const [discoveryResults, setDiscoveryResults] = useState<any[]>([]);
  const [isDiscovering, setIsDiscovering] = useState(false);
  const [discoveryFilter, setDiscoveryFilter] = useState("Tudo");
  const [aiWorkspace, setAiWorkspace] = useState({
    sourceUrl: "",
    sourceTitle: "",
    sourceContent: "",
    editorialLine: "Informativa",
    adaptedContent: "",
    adaptedTitle: "",
    adaptedSummary: "",
    category: "Geral"
  });
  const [isAdapting, setIsAdapting] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate("/auth");
    if (!loading && user && !isAdmin && !isEditor) navigate("/");
  }, [user, isAdmin, loading, navigate]);

  useEffect(() => {
    if (isAdmin || isEditor) loadData(activeTab);
  }, [activeTab, isAdmin, isEditor]);

  const loadData = async (tab: Tab) => {
    console.log("Loading data for tab:", tab);
    setDataLoading(true);
    try {
      if (tab === "dashboard" || tab === "articles") {
        const { data, error } = await withTimeout(supabase.from("news_articles").select("*").order("created_at", { ascending: false }), 20000) as any;
        if (error) {
          console.error("Error loading articles:", error);
          toast.error("Erro ao carregar artigos: " + error.message);
        }
        if (data) {
          setArticles(data);
          if (tab === "dashboard") setStats(s => ({ ...s, articles: data.length }));
        }
      }
      if (tab === "dashboard" || tab === "videos") {
        const { data, error } = await withTimeout(supabase.from("video_news").select("*").order("created_at", { ascending: false }), 20000) as any;
        if (error) {
          console.error("Error loading videos:", error);
          toast.error("Erro ao carregar vídeos: " + error.message);
        }
        if (data) {
          setVideos(data);
          if (tab === "dashboard") setStats(s => ({ ...s, videos: data.length }));
        }
      }
      if (tab === "dashboard" || tab === "opinions") {
        const { data, error } = await withTimeout(supabase.from("opinion_articles").select("*").order("created_at", { ascending: false }), 20000) as any;
        if (error) {
          console.error("Error loading opinions:", error);
          toast.error("Erro ao carregar opiniões: " + error.message);
        }
        if (data) {
          setOpinions(data);
          if (tab === "dashboard") setStats(s => ({ ...s, opinions: data.length }));
        }
      }
      if (tab === "breaking") {
        const { data, error } = await withTimeout(supabase.from("breaking_news").select("*").order("created_at", { ascending: false }), 20000) as any;
        if (error) {
          console.error("Error loading breaking news:", error);
          toast.error("Erro ao carregar notícias: " + error.message);
        }
        if (data) {
          console.log("Breaking news loaded:", data);
          setBreakingNews(data);
        }

        // Load ticker speed
        const { data: settings } = await supabase.from("system_settings").select("value").eq("key", "ticker").single();
        if (settings?.value && typeof settings.value === 'object') {
          const val = settings.value as any;
          if (val.speed) setTickerSpeed(Number(val.speed));
        }
      }
      if (tab === "users") {
        const { data, error } = await withTimeout(supabase.from("user_roles").select("*"), 20000) as any;
        if (error) {
          console.error("Error loading user roles:", error);
          toast.error("Erro ao carregar perfis: " + error.message);
        }
        if (data) setUserRoles(data);
      }
      if (tab === "ads") {
        const { data, error } = await supabase.from("advertisements").select("*").order("slot").order("display_order");
        if (error) {
          console.error("Error loading ads:", error);
          toast.error("Erro ao carregar publicidade: " + error.message);
        }
        if (data) setAdvertisements(data);

        // Load ad carousel speed
        const { data: adSettings } = await supabase.from("system_settings").select("value").eq("key", "ad_carousel").single();
        if (adSettings?.value && typeof adSettings.value === 'object') {
          const val = adSettings.value as any;
          if (val.speed) setAdCarouselSpeed(Number(val.speed) / 1000);
        }
      }
    } catch (err) {
      console.error("Unexpected error in loadData:", err);
      toast.error("Erro inesperado ao carregar dados.");
    } finally {
      setDataLoading(false);
    }
  };

  const togglePublished = async (table: string, id: string, current: boolean | null) => {
    const { error } = await supabase.from(table as any).update({ published: !current }).eq("id", id);
    if (error) {
      toast.error("Erro ao alterar estado: " + error.message);
    } else {
      toast.success("Estado alterado com sucesso");
      loadData(activeTab);
    }
  };

  const deleteRecord = async (table: string, id: string) => {
    if (!confirm("Tem a certeza que quer eliminar este registo?")) return;
    const { error } = await supabase.from(table as any).delete().eq("id", id);
    if (error) {
      toast.error("Erro ao eliminar: " + error.message);
    } else {
      toast.success("Eliminado com sucesso");
      loadData(activeTab);
    }
  };

  const uploadFile = async (file: File, bucket: string = "news") => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError, data } = await supabase.storage
      .from(bucket)
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const saveArticle = async () => {
    if (!articleForm.title) {
      toast.error("O título é obrigatório");
      return;
    }

    setSavingArticle(true);
    console.log("Save Article: Starting...", articleForm, editingArticle);
    try {
      let currentImageUrl = articleForm.image_url;

      if (articleImageFile) {
        console.log("Save Article: Uploading file...", articleImageFile.name);
        toast.info("A carregar imagem (isso pode demorar em ligações lentas)...");
        currentImageUrl = await withTimeout(uploadFile(articleImageFile));
        console.log("Save Article: Upload success, URL:", currentImageUrl);
      }

      const payload = { ...articleForm, image_url: currentImageUrl, published: true };
      console.log("Save Article: Sending payload to DB...", payload);

      const query = editingArticle
        ? supabase.from("news_articles").update(payload).eq("id", editingArticle).select()
        : supabase.from("news_articles").insert(payload).select();

      const result = await withTimeout(query) as any;

      console.log("Save article result:", result);

      if (result.error) {
        console.error("Supabase error saving article:", result.error);
        toast.error("Erro ao guardar artigo: " + result.error.message);
      } else if (!result.data || result.data.length === 0) {
        toast.error("O artigo não foi guardado. Verifique as suas permissões.");
      } else {
        toast.success("Artigo guardado com sucesso!");
        setShowArticleForm(false);
        setEditingArticle(null);
        setArticleImageFile(null);
        setArticleForm({ title: "", summary: "", content: "", category: "Política", author: "Redacção", image_url: "", is_hero: false, is_breaking: false });
        loadData("articles");
      }
    } catch (err: any) {
      console.error("Unexpected error in saveArticle:", err);
      toast.error("Erro inesperado: " + (err?.message || String(err)));
    } finally {
      setSavingArticle(false);
    }
  };

  const saveVideo = async () => {
    if (!videoForm.title || !videoForm.video_url) {
      toast.error("Título e URL do vídeo são obrigatórios");
      return;
    }

    setSavingVideo(true);
    console.log("Save Video: Starting...", videoForm, editingVideo);
    try {
      let currentThumbnailUrl = videoForm.thumbnail_url;

      if (videoThumbnailFile) {
        console.log("Save Video: Uploading thumbnail...", videoThumbnailFile.name);
        toast.info("A carregar miniatura...");
        currentThumbnailUrl = await withTimeout(uploadFile(videoThumbnailFile));
        console.log("Save Video: Thumbnail upload success:", currentThumbnailUrl);
      }

      const payload = { ...videoForm, thumbnail_url: currentThumbnailUrl, published: true };
      console.log("Save Video: Sending payload to DB...", payload);

      const query = editingVideo
        ? supabase.from("video_news").update(payload).eq("id", editingVideo).select()
        : supabase.from("video_news").insert(payload).select();

      const result = await withTimeout(query) as any;

      console.log("Save video result:", result);

      if (result.error) {
        console.error("Supabase error saving video:", result.error);
        toast.error("Erro ao guardar vídeo: " + result.error.message);
      } else if (!result.data || result.data.length === 0) {
        toast.error("O vídeo não foi guardado. Verifique as suas permissões.");
      } else {
        toast.success("Vídeo guardado com sucesso!");
        setShowVideoForm(false);
        setEditingVideo(null);
        setVideoThumbnailFile(null);
        setVideoForm({ title: "", description: "", video_url: "", thumbnail_url: "", duration: "", category: "Vídeo" });
        loadData("videos");
      }
    } catch (err: any) {
      console.error("Unexpected error in saveVideo:", err);
      toast.error("Erro inesperado: " + (err?.message || String(err)));
    } finally {
      setSavingVideo(false);
    }
  };

  const saveOpinion = async () => {
    if (!opinionForm.title || !opinionForm.author) {
      toast.error("Título e autor são obrigatórios");
      return;
    }

    setSavingOpinion(true);
    console.log("Save Opinion: Starting...", opinionForm, editingOpinion);
    try {
      let currentAvatarUrl = opinionForm.avatar_url;

      if (opinionAvatarFile) {
        console.log("Save Opinion: Uploading avatar...", opinionAvatarFile.name);
        toast.info("A carregar avatar...");
        currentAvatarUrl = await withTimeout(uploadFile(opinionAvatarFile));
        console.log("Save Opinion: Avatar upload success:", currentAvatarUrl);
      }

      const payload = { ...opinionForm, avatar_url: currentAvatarUrl, published: true };
      console.log("Save Opinion: Sending payload to DB...", payload);

      const query = editingOpinion
        ? supabase.from("opinion_articles").update(payload).eq("id", editingOpinion).select()
        : supabase.from("opinion_articles").insert(payload).select();

      const result = await withTimeout(query) as any;

      console.log("Save opinion result:", result);

      if (result.error) {
        console.error("Supabase error saving opinion:", result.error);
        toast.error("Erro ao guardar opinião: " + result.error.message);
      } else if (!result.data || result.data.length === 0) {
        toast.error("A opinião não foi guardada. Verifique as suas permissões.");
      } else {
        toast.success("Artigo de opinião guardado com sucesso!");
        setShowOpinionForm(false);
        setEditingOpinion(null);
        setOpinionAvatarFile(null);
        setOpinionForm({ title: "", author: "", content: "", excerpt: "", avatar_url: "" });
        loadData("opinions");
      }
    } catch (err: any) {
      console.error("Unexpected error in saveOpinion:", err);
      toast.error("Erro inesperado: " + (err?.message || String(err)));
    } finally {
      setSavingOpinion(false);
    }
  };

  const saveTickerSpeed = async () => {
    setSavingSettings(true);
    try {
      const { error } = await supabase
        .from("system_settings")
        .update({ value: { speed: tickerSpeed } })
        .eq("key", "ticker");

      if (error) {
        toast.error("Erro ao salvar velocidade: " + error.message);
      } else {
        toast.success("Velocidade do ticker atualizada!");
      }
    } catch (err: any) {
      toast.error("Erro inesperado: " + err.message);
    } finally {
      setSavingSettings(false);
    }
  };

  const saveAdCarouselSpeed = async () => {
    setSavingSettings(true);
    try {
      const { error } = await supabase
        .from("system_settings")
        .update({ value: { speed: adCarouselSpeed * 1000 } })
        .eq("key", "ad_carousel");

      if (error) {
        toast.error("Erro ao salvar velocidade do carrossel: " + error.message);
      } else {
        toast.success("Velocidade do carrossel de publicidade atualizada!");
      }
    } catch (err: any) {
      toast.error("Erro inesperado: " + err.message);
    } finally {
      setSavingSettings(false);
    }
  };

  const saveBreaking = async () => {
    if (!breakingForm) {
      toast.error("O texto é obrigatório");
      return;
    }

    setSavingBreaking(true);
    console.log("Saving breaking news...", breakingForm);
    try {
      const query = supabase.from("breaking_news").insert({ text: breakingForm, active: true }).select();
      const result = await withTimeout(query) as any;
      console.log("Save breaking news result:", result);
      if (result.error) {
        console.error("Supabase error saving breaking news:", result.error);
        toast.error("Erro ao adicionar notícia: " + result.error.message);
      } else if (!result.data || result.data.length === 0) {
        toast.error("A notícia não foi guardada. Verifique as suas permissões.");
      } else {
        toast.success("Notícia de última hora adicionada!");
        setShowBreakingForm(false);
        setBreakingForm("");
        loadData("breaking");
      }
    } catch (err: any) {
      console.error("Unexpected error in saveBreaking:", err);
      toast.error("Erro inesperado: " + (err?.message || String(err)));
    } finally {
      setSavingBreaking(false);
    }
  };

  const toggleBreaking = async (id: string, current: boolean | null) => {
    const { error } = await supabase.from("breaking_news").update({ active: !current }).eq("id", id);
    if (error) {
      toast.error("Erro ao alterar estado: " + error.message);
    } else {
      toast.success("Estado alterado");
      loadData("breaking");
    }
  };

  const handleDiscoverNews = async (filterOverride?: string) => {
    if (!discoveryQuery.trim()) return;
    setIsDiscovering(true);
    const activeFilter = filterOverride || discoveryFilter;
    console.log("Discovery: Searching for:", discoveryQuery, "filter:", activeFilter);
    try {
      const { data, error } = await supabase.functions.invoke('news-search', {
        body: {
          query: discoveryQuery,
          filter: activeFilter,
          max: 10
        }
      });

      if (error) throw error;

      if (data?.results && data.results.length > 0) {
        setDiscoveryResults(data.results);
        toast.success(`Pesquisa OSINT concluída com ${data.results.length} resultados.`);
      } else {
        setDiscoveryResults([]);
        toast.info("Nenhum resultado encontrado. Tente outra pesquisa.");
      }
    } catch (err: any) {
      console.error("Discovery error:", err);
      toast.error("Erro na descoberta de notícias: " + (err?.message || "Erro desconhecido"));
    } finally {
      setIsDiscovering(false);
    }
  };

  const handleAdaptToEditorial = (item: any) => {
    setAiWorkspace({
      ...aiWorkspace,
      sourceTitle: item.title,
      sourceContent: item.content || item.snippet,
      sourceUrl: item.url || "",
      adaptedContent: "",
      adaptedTitle: "",
      adaptedSummary: "",
      category: item.category || "Geral"
    });
    toast.info("Notícia enviada para o espaço de trabalho IA.");
  };

  const handleGenerateAI = async () => {
    if (!aiWorkspace.sourceContent) return;
    setIsAdapting(true);
    console.log("AI: Generating rewrite with line:", aiWorkspace.editorialLine);

    try {
      // Chamada à futura Edge Function 'ai-rewrite'
      const { data, error } = await supabase.functions.invoke('ai-rewrite', {
        body: {
          content: aiWorkspace.sourceContent,
          title: aiWorkspace.sourceTitle,
          line: aiWorkspace.editorialLine
        }
      });

      if (error) throw error;

      setAiWorkspace({
        ...aiWorkspace,
        adaptedTitle: data.title,
        adaptedContent: data.content,
        adaptedSummary: data.summary
      });
      toast.success("Notícia reestruturada com sucesso pela IA!");
    } catch (err: any) {
      console.error("AI Error:", err);
      toast.warning("A IA não está disponível. Verifique se a OPENAI_API_KEY está configurada no Supabase.");
      // Fallback: usar o conteúdo original como base para edição manual
      await new Promise(r => setTimeout(r, 500));
      setAiWorkspace({
        ...aiWorkspace,
        adaptedTitle: aiWorkspace.sourceTitle,
        adaptedContent: aiWorkspace.sourceContent,
        adaptedSummary: aiWorkspace.sourceContent.substring(0, 200) + (aiWorkspace.sourceContent.length > 200 ? "..." : "")
      });
    } finally {
      setIsAdapting(false);
    }
  };

  const handleFinalizeAIArticle = () => {
    // Preencher o formulário de artigos com os dados da IA
    setArticleForm({
      title: aiWorkspace.adaptedTitle,
      summary: aiWorkspace.adaptedSummary || "Notícia adaptada via IA.",
      content: aiWorkspace.adaptedContent,
      category: aiWorkspace.category,
      author: "Redacção / IA",
      image_url: "",
      is_hero: false,
      is_breaking: false
    });
    setActiveTab("articles");
    setShowArticleForm(true);
    toast.success("Dados transferidos para o formulário de publicação.");
  };

  const categories = ["Política", "Sociedade", "Economia", "Mundo", "Desporto", "Cultura", "Tecnologia", "Saúde", "Opinião"];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <div className="text-muted-foreground text-sm mb-4 animate-pulse">A verificar permissões...</div>
        <button
          onClick={() => { localStorage.clear(); window.location.reload(); }}
          className="text-xs text-primary underline hoverline"
        >
          Demora muito? Clique aqui para reiniciar sessão
        </button>
      </div>
    );
  }

  if (!isAdmin && !isEditor) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 text-center">
        <Shield className="w-12 h-12 text-destructive mb-4" />
        <h1 className="text-xl font-bold text-foreground mb-2">Acesso Negado</h1>
        <p className="text-muted-foreground text-sm mb-6 max-w-xs">
          Não tem permissões de administrador ou editor. Se acabou de as receber, experimente reiniciar a sessão.
        </p>
        <div className="flex flex-col gap-3">
          <button
            onClick={() => navigate("/")}
            className="bg-primary text-primary-foreground px-6 py-2 text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            Voltar ao Início
          </button>
          <button
            onClick={() => { localStorage.clear(); window.location.reload(); }}
            className="text-xs text-muted-foreground underline"
          >
            Limpar cache e reiniciar
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "dashboard" as Tab, label: "Dashboard", icon: LayoutDashboard },
    { id: "articles" as Tab, label: "Artigos", icon: Newspaper },
    { id: "videos" as Tab, label: "Vídeos", icon: Video },
    { id: "opinions" as Tab, label: "Opinião", icon: MessageSquare },
    { id: "breaking" as Tab, label: "Última Hora", icon: Zap },
    { id: "ai-discovery" as Tab, label: "Descoberta IA", icon: Sparkles },
    ...(isAdmin ? [
      { id: "ads" as Tab, label: "Publicidade", icon: Megaphone },
      { id: "users" as Tab, label: "Utilizadores", icon: Users }
    ] : []),
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border flex flex-col flex-shrink-0">
        {/* Logo */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-2 mb-1">
            <Shield className="w-4 h-4 text-primary" />
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">Admin</span>
          </div>
          <h1 className="font-heading text-xl font-black tracking-tight text-foreground uppercase">Sem Filtros</h1>
          <p className="text-xs text-muted-foreground mt-0.5 truncate">{user?.email}</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {tabs.map(({ id, label, icon: Icon }) => (
              <li key={id}>
                <button
                  onClick={() => setActiveTab(id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-colors ${activeTab === id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Bottom actions */}
        <div className="mt-6 pt-6 border-t border-border space-y-2">
          <button
            onClick={() => { localStorage.clear(); window.location.reload(); }}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors uppercase tracking-wider font-semibold"
          >
            <RefreshCw className="w-4 h-4" />
            Reiniciar Sessão
          </button>
          <button
            onClick={async () => { await signOut(); navigate("/"); }}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wider font-semibold"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-card border-b border-border px-8 py-4 sticky top-0 z-10">
          <h2 className="font-heading text-lg font-bold text-foreground capitalize">
            {tabs.find(t => t.id === activeTab)?.label}
          </h2>
        </div>

        <div className="p-8">
          {/* Dashboard */}
          {activeTab === "dashboard" && (
            <div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                  { label: "Artigos", value: articles.length, icon: Newspaper, color: "text-blue-400" },
                  { label: "Vídeos", value: videos.length, icon: Video, color: "text-purple-400" },
                  { label: "Última Hora", value: breakingNews.length, icon: Zap, color: "text-primary" },
                  { label: "Utilizadores", value: userRoles.length, icon: Users, color: "text-green-400" },
                ].map(({ label, value, icon: Icon, color }) => (
                  <div key={label} className="bg-card border border-border p-5">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
                      <Icon className={`w-4 h-4 ${color}`} />
                    </div>
                    <div className="text-3xl font-heading font-bold text-foreground">{value}</div>
                  </div>
                ))}
              </div>

              <div className="bg-card border border-border p-5">
                <h3 className="font-heading font-semibold text-foreground mb-4">Últimos artigos</h3>
                <div className="space-y-2">
                  {articles.slice(0, 5).map(a => (
                    <div key={a.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                      <div>
                        <p className="text-sm text-foreground line-clamp-1">{a.title}</p>
                        <p className="text-xs text-muted-foreground">{a.category} · {a.author}</p>
                      </div>
                      <span className={`text-xs px-2 py-0.5 ${a.published ? "bg-green-500/20 text-green-400" : "bg-muted text-muted-foreground"}`}>
                        {a.published ? "Publicado" : "Rascunho"}
                      </span>
                    </div>
                  ))}
                  {articles.length === 0 && <p className="text-sm text-muted-foreground">Sem artigos ainda.</p>}
                </div>
              </div>
            </div>
          )}

          {/* Articles */}
          {activeTab === "articles" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-muted-foreground">{articles.length} artigos no total</p>
                <button
                  onClick={() => { setShowArticleForm(true); setEditingArticle(null); }}
                  className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold hover:opacity-90 transition-opacity"
                >
                  <Plus className="w-4 h-4" />
                  Novo artigo
                </button>
              </div>

              {/* Article form */}
              {showArticleForm && (
                <div className="bg-card border border-border p-6 mb-6">
                  <h3 className="font-heading font-semibold text-foreground mb-4">
                    {editingArticle ? "Editar artigo" : "Novo artigo"}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Título *</label>
                      <input
                        value={articleForm.title}
                        onChange={e => setArticleForm(f => ({ ...f, title: e.target.value }))}
                        className="w-full bg-secondary border border-border text-foreground px-3 py-2 text-sm focus:outline-none focus:border-primary"
                        placeholder="Título do artigo"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Resumo</label>
                      <textarea
                        value={articleForm.summary}
                        onChange={e => setArticleForm(f => ({ ...f, summary: e.target.value }))}
                        className="w-full bg-secondary border border-border text-foreground px-3 py-2 text-sm focus:outline-none focus:border-primary resize-none"
                        rows={3}
                        placeholder="Resumo do artigo"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Categoria</label>
                      <select
                        value={articleForm.category}
                        onChange={e => setArticleForm(f => ({ ...f, category: e.target.value }))}
                        className="w-full bg-secondary border border-border text-foreground px-3 py-2 text-sm focus:outline-none focus:border-primary"
                      >
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Autor</label>
                      <input
                        value={articleForm.author}
                        onChange={e => setArticleForm(f => ({ ...f, author: e.target.value }))}
                        className="w-full bg-secondary border border-border text-foreground px-3 py-2 text-sm focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Imagem do Artigo</label>
                      <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={e => setArticleImageFile(e.target.files?.[0] || null)}
                            className="w-full bg-secondary border border-border text-foreground px-3 py-2 text-sm focus:outline-none focus:border-primary file:bg-primary file:text-primary-foreground file:border-0 file:px-3 file:py-1 file:mr-4 file:text-xs file:font-bold file:uppercase file:cursor-pointer"
                          />
                          <p className="text-[10px] text-muted-foreground mt-1">Selecione um ficheiro para carregar para o servidor (recomendado)</p>
                        </div>
                        <div className="flex-1">
                          <input
                            value={articleForm.image_url}
                            onChange={e => setArticleForm(f => ({ ...f, image_url: e.target.value }))}
                            className="w-full bg-secondary border border-border text-foreground px-3 py-2 text-sm focus:outline-none focus:border-primary"
                            placeholder="Ou cole o URL da imagem da internet..."
                          />
                          <p className="text-[10px] text-muted-foreground mt-1">Apenas para links diretos externos</p>
                        </div>
                      </div>
                      {(articleImageFile || articleForm.image_url) && (
                        <div className="mt-4 p-2 border border-dashed border-border rounded bg-secondary/30 flex items-center gap-4">
                          <img
                            src={articleImageFile ? URL.createObjectURL(articleImageFile) : articleForm.image_url}
                            alt="Preview"
                            className="w-20 h-12 object-cover rounded"
                          />
                          <span className="text-xs text-muted-foreground">Pré-visualização da imagem</span>
                        </div>
                      )}
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Conteúdo</label>
                      <textarea
                        value={articleForm.content}
                        onChange={e => setArticleForm(f => ({ ...f, content: e.target.value }))}
                        className="w-full bg-secondary border border-border text-foreground px-3 py-2 text-sm focus:outline-none focus:border-primary resize-none"
                        rows={10}
                        placeholder="Conteúdo completo do artigo"
                      />
                    </div>
                    <div className="flex items-center gap-6">
                      <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
                        <input type="checkbox" checked={articleForm.is_hero} onChange={e => setArticleForm(f => ({ ...f, is_hero: e.target.checked }))} className="accent-primary" />
                        Destaque principal
                      </label>
                      <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
                        <input type="checkbox" checked={articleForm.is_breaking} onChange={e => setArticleForm(f => ({ ...f, is_breaking: e.target.checked }))} className="accent-primary" />
                        Última hora
                      </label>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-4">
                    <button
                      onClick={saveArticle}
                      disabled={savingArticle}
                      className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                      <Check className="w-4 h-4" />
                      {savingArticle ? "A guardar..." : "Guardar"}
                    </button>
                    <button onClick={() => setShowArticleForm(false)} className="flex items-center gap-2 bg-secondary text-foreground px-4 py-2 text-sm hover:bg-muted transition-colors">
                      <X className="w-4 h-4" />
                      Cancelar
                    </button>
                  </div>
                </div>
              )}

              {/* Articles table */}
              <div className="bg-card border border-border overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Título</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden md:table-cell">Categoria</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden lg:table-cell">Autor</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Estado</th>
                      <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {articles.map(article => (
                      <tr key={article.id} className="border-b border-border hover:bg-secondary/50 transition-colors">
                        <td className="px-4 py-3 text-sm text-foreground max-w-xs">
                          <span className="line-clamp-1">{article.title}</span>
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          <span className="text-xs bg-secondary text-muted-foreground px-2 py-0.5">{article.category}</span>
                        </td>
                        <td className="px-4 py-3 text-xs text-muted-foreground hidden lg:table-cell">{article.author}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2 py-0.5 ${article.published ? "bg-green-500/20 text-green-400" : "bg-muted text-muted-foreground"}`}>
                            {article.published ? "Publicado" : "Rascunho"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => togglePublished("news_articles", article.id, article.published)}
                              className="text-muted-foreground hover:text-foreground transition-colors"
                              title={article.published ? "Despublicar" : "Publicar"}
                            >
                              {article.published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                            <button
                              onClick={() => {
                                setEditingArticle(article.id);
                                setArticleForm({
                                  title: article.title,
                                  summary: article.summary || "",
                                  content: article.content || "",
                                  category: article.category,
                                  author: article.author || "Redacção",
                                  image_url: article.image_url || "",
                                  is_hero: !!article.is_hero,
                                  is_breaking: !!article.is_breaking
                                });
                                setShowArticleForm(true);
                              }}
                              className="text-muted-foreground hover:text-foreground transition-colors"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteRecord("news_articles", article.id)}
                              className="text-muted-foreground hover:text-destructive transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {articles.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center text-sm text-muted-foreground">
                          Sem artigos. Crie o primeiro artigo.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Videos */}
          {activeTab === "videos" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-muted-foreground">{videos.length} vídeos no total</p>
                <button
                  onClick={() => { setShowVideoForm(true); setEditingVideo(null); }}
                  className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold hover:opacity-90 transition-opacity"
                >
                  <Plus className="w-4 h-4" />
                  Novo vídeo
                </button>
              </div>

              {showVideoForm && (
                <div className="bg-card border border-border p-6 mb-6">
                  <h3 className="font-heading font-semibold text-foreground mb-4">
                    {editingVideo ? "Editar vídeo" : "Novo vídeo"}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Título *</label>
                      <input value={videoForm.title} onChange={e => setVideoForm(f => ({ ...f, title: e.target.value }))} className="w-full bg-secondary border border-border text-foreground px-3 py-2 text-sm focus:outline-none focus:border-primary" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">URL do vídeo (YouTube/Vimeo) *</label>
                      <input value={videoForm.video_url} onChange={e => setVideoForm(f => ({ ...f, video_url: e.target.value }))} className="w-full bg-secondary border border-border text-foreground px-3 py-2 text-sm focus:outline-none focus:border-primary" placeholder="https://youtube.com/watch?v=..." />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Miniatura do Vídeo</label>
                      <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={e => setVideoThumbnailFile(e.target.files?.[0] || null)}
                            className="w-full bg-secondary border border-border text-foreground px-3 py-2 text-sm focus:outline-none focus:border-primary file:bg-primary file:text-primary-foreground file:border-0 file:px-3 file:py-1 file:mr-4 file:text-xs file:font-bold file:uppercase file:cursor-pointer"
                          />
                          <p className="text-[10px] text-muted-foreground mt-1">Selecione uma imagem para a miniatura</p>
                        </div>
                        <div className="flex-1">
                          <input
                            value={videoForm.thumbnail_url}
                            onChange={e => setVideoForm(f => ({ ...f, thumbnail_url: e.target.value }))}
                            className="w-full bg-secondary border border-border text-foreground px-3 py-2 text-sm focus:outline-none focus:border-primary"
                            placeholder="Ou URL da miniatura..."
                          />
                        </div>
                      </div>
                      {(videoThumbnailFile || videoForm.thumbnail_url) && (
                        <div className="mt-4 p-2 border border-dashed border-border rounded bg-secondary/30 flex items-center gap-4">
                          <img
                            src={videoThumbnailFile ? URL.createObjectURL(videoThumbnailFile) : videoForm.thumbnail_url}
                            alt="Preview"
                            className="w-20 h-11 object-cover rounded"
                          />
                          <span className="text-xs text-muted-foreground">Pré-visualização da miniatura</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Duração (ex: 12:34)</label>
                      <input value={videoForm.duration} onChange={e => setVideoForm(f => ({ ...f, duration: e.target.value }))} className="w-full bg-secondary border border-border text-foreground px-3 py-2 text-sm focus:outline-none focus:border-primary" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Descrição</label>
                      <textarea value={videoForm.description} onChange={e => setVideoForm(f => ({ ...f, description: e.target.value }))} className="w-full bg-secondary border border-border text-foreground px-3 py-2 text-sm focus:outline-none focus:border-primary resize-none" rows={2} />
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-4">
                    <button
                      onClick={saveVideo}
                      disabled={savingVideo}
                      className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold hover:opacity-90 disabled:opacity-50"
                    >
                      <Check className="w-4 h-4" />
                      {savingVideo ? "A guardar..." : "Guardar"}
                    </button>
                    <button onClick={() => setShowVideoForm(false)} className="flex items-center gap-2 bg-secondary text-foreground px-4 py-2 text-sm hover:bg-muted">
                      <X className="w-4 h-4" /> Cancelar
                    </button>
                  </div>
                </div>
              )}

              <div className="bg-card border border-border overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Título</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden md:table-cell">Duração</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Estado</th>
                      <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {videos.map(v => (
                      <tr key={v.id} className="border-b border-border hover:bg-secondary/50">
                        <td className="px-4 py-3 text-sm text-foreground"><span className="line-clamp-1">{v.title}</span></td>
                        <td className="px-4 py-3 text-xs text-muted-foreground hidden md:table-cell">{v.duration || "—"}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2 py-0.5 ${v.published ? "bg-green-500/20 text-green-400" : "bg-muted text-muted-foreground"}`}>
                            {v.published ? "Publicado" : "Rascunho"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => togglePublished("video_news", v.id, v.published)} className="text-muted-foreground hover:text-foreground transition-colors" title={v.published ? "Despublicar" : "Publicar"}>
                              {v.published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                            <button
                              onClick={() => {
                                setEditingVideo(v.id);
                                setVideoForm({
                                  title: v.title,
                                  description: v.description || "",
                                  video_url: v.video_url,
                                  thumbnail_url: v.thumbnail_url || "",
                                  duration: v.duration || "",
                                  category: v.category || "Vídeo"
                                });
                                setShowVideoForm(true);
                              }}
                              className="text-muted-foreground hover:text-foreground transition-colors"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button onClick={() => deleteRecord("video_news", v.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {videos.length === 0 && (
                      <tr><td colSpan={4} className="px-4 py-8 text-center text-sm text-muted-foreground">Sem vídeos ainda.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Breaking news */}
          {activeTab === "breaking" && (
            <div>
              <div className="bg-card border border-border p-6 mb-8">
                <h3 className="font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-primary" />
                  Configurações do Ticker
                </h3>
                <div className="flex flex-col sm:flex-row items-end gap-4">
                  <div className="flex-1 max-w-xs">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Velocidade (segundos por ciclo)</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min="10"
                        max="120"
                        step="5"
                        value={tickerSpeed}
                        onChange={e => setTickerSpeed(Number(e.target.value))}
                        className="flex-1 accent-primary"
                      />
                      <span className="text-sm font-mono font-bold text-primary w-12 text-center">{tickerSpeed}s</span>
                    </div>
                  </div>
                  <button
                    onClick={saveTickerSpeed}
                    disabled={savingSettings}
                    className="bg-primary text-primary-foreground px-6 py-2 text-sm font-semibold hover:opacity-90 disabled:opacity-50 h-10"
                  >
                    {savingSettings ? "A guardar..." : "Salvar Velocidade"}
                  </button>
                </div>
                <p className="text-[10px] text-muted-foreground mt-3">Quanto menor o valor, mais rápido as notícias deslizam.</p>
              </div>

              <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-muted-foreground">Notícias de última hora ativas no ticker</p>
                <button onClick={() => setShowBreakingForm(true)} className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold hover:opacity-90">
                  <Plus className="w-4 h-4" /> Nova notícia
                </button>
              </div>

              {showBreakingForm && (
                <div className="bg-card border border-border p-6 mb-6">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Texto da notícia *</label>
                  <input value={breakingForm} onChange={e => setBreakingForm(e.target.value)} className="w-full bg-secondary border border-border text-foreground px-3 py-2 text-sm focus:outline-none focus:border-primary mb-3" placeholder="Texto que aparece no ticker..." />
                  <div className="flex gap-3">
                    <button
                      onClick={saveBreaking}
                      disabled={savingBreaking}
                      className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold hover:opacity-90 disabled:opacity-50"
                    >
                      <Check className="w-4 h-4" />
                      {savingBreaking ? "A adicionar..." : "Adicionar"}
                    </button>
                    <button onClick={() => setShowBreakingForm(false)} className="flex items-center gap-2 bg-secondary text-foreground px-4 py-2 text-sm hover:bg-muted">
                      <X className="w-4 h-4" /> Cancelar
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                {breakingNews.map(item => (
                  <div key={item.id} className="flex items-center justify-between bg-card border border-border px-4 py-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${item.active ? "bg-primary animate-pulse" : "bg-muted-foreground"}`} />
                      <span className="text-sm text-foreground line-clamp-1">{item.text}</span>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                      <button onClick={() => toggleBreaking(item.id, item.active)} className={`text-xs px-2 py-1 transition-colors ${item.active ? "bg-green-500/20 text-green-400 hover:bg-red-500/20 hover:text-red-400" : "bg-muted text-muted-foreground hover:bg-green-500/20 hover:text-green-400"}`}>
                        {item.active ? "Ativo" : "Inativo"}
                      </button>
                      <button onClick={() => deleteRecord("breaking_news", item.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
                {breakingNews.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">Sem notícias de última hora.</p>}
              </div>
            </div>
          )}

          {/* Users */}
          {activeTab === "users" && (
            <div>
              <div className="bg-card border border-border p-6 mb-6">
                <h3 className="font-heading font-semibold text-foreground mb-1">Atribuir função a utilizador</h3>
                <p className="text-xs text-muted-foreground mb-4">Introduza o UUID do utilizador (visível no Cloud → Utilizadores)</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="md:col-span-2">
                    <input
                      value={newUserEmail}
                      onChange={e => setNewUserEmail(e.target.value)}
                      className="w-full bg-secondary border border-border text-foreground px-3 py-2 text-sm focus:outline-none focus:border-primary"
                      placeholder="UUID do utilizador"
                    />
                  </div>
                  <select
                    value={newUserRole}
                    onChange={e => setNewUserRole(e.target.value as "admin" | "editor")}
                    className="bg-secondary border border-border text-foreground px-3 py-2 text-sm focus:outline-none focus:border-primary"
                  >
                    <option value="editor">Editor</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <button
                  onClick={async () => {
                    if (!newUserEmail) return;
                    setDataLoading(true);
                    try {
                      const { error } = await supabase.from("user_roles").insert({ user_id: newUserEmail, role: newUserRole });
                      if (error) toast.error("Erro: " + error.message);
                      else {
                        toast.success("Função atribuída com sucesso");
                        setNewUserEmail("");
                        loadData("users");
                      }
                    } catch (err) {
                      console.error("Error assigning role:", err);
                      toast.error("Erro inesperado ao atribuir função.");
                    } finally {
                      setDataLoading(false);
                    }
                  }}
                  className="mt-3 flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold hover:opacity-90"
                >
                  <Plus className="w-4 h-4" />
                  Atribuir função
                </button>
              </div>

              <div className="bg-card border border-border overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">User ID</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Função</th>
                      <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userRoles.map(ur => (
                      <tr key={ur.id} className="border-b border-border hover:bg-secondary/50">
                        <td className="px-4 py-3 text-xs text-muted-foreground font-mono">{ur.user_id}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2 py-0.5 uppercase font-semibold tracking-wider ${ur.role === "admin" ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground"}`}>
                            {ur.role}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button onClick={() => deleteRecord("user_roles", ur.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {userRoles.length === 0 && <tr><td colSpan={3} className="px-4 py-8 text-center text-sm text-muted-foreground">Sem utilizadores com funções atribuídas.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Opinions */}
          {activeTab === "opinions" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-muted-foreground">{opinions.length} artigos de opinião no total</p>
                <button
                  onClick={() => { setShowOpinionForm(true); setEditingOpinion(null); }}
                  className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold hover:opacity-90 transition-opacity"
                >
                  <Plus className="w-4 h-4" />
                  Novo artigo de opinião
                </button>
              </div>

              {/* Opinion form */}
              {showOpinionForm && (
                <div className="bg-card border border-border p-6 mb-6">
                  <h3 className="font-heading font-semibold text-foreground mb-4">
                    {editingOpinion ? "Editar opinião" : "Novo artigo de opinião"}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Título *</label>
                      <input
                        value={opinionForm.title}
                        onChange={e => setOpinionForm(f => ({ ...f, title: e.target.value }))}
                        className="w-full bg-secondary border border-border text-foreground px-3 py-2 text-sm focus:outline-none focus:border-primary"
                        placeholder="Título da opinião"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Avatar do Autor</label>
                      <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={e => setOpinionAvatarFile(e.target.files?.[0] || null)}
                            className="w-full bg-secondary border border-border text-foreground px-3 py-2 text-sm focus:outline-none focus:border-primary file:bg-primary file:text-primary-foreground file:border-0 file:px-3 file:py-1 file:mr-4 file:text-xs file:font-bold file:uppercase file:cursor-pointer"
                          />
                        </div>
                        <div className="flex-1">
                          <input
                            value={opinionForm.avatar_url}
                            onChange={e => setOpinionForm(f => ({ ...f, avatar_url: e.target.value }))}
                            className="w-full bg-secondary border border-border text-foreground px-3 py-2 text-sm focus:outline-none focus:border-primary"
                            placeholder="Ou URL do avatar..."
                          />
                        </div>
                      </div>
                      {(opinionAvatarFile || opinionForm.avatar_url) && (
                        <div className="mt-4 p-2 border border-dashed border-border rounded bg-secondary/30 flex items-center gap-4">
                          <img
                            src={opinionAvatarFile ? URL.createObjectURL(opinionAvatarFile) : opinionForm.avatar_url}
                            alt="Preview"
                            className="w-12 h-12 object-cover rounded-full"
                          />
                          <span className="text-xs text-muted-foreground">Pré-visualização do avatar</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Autor *</label>
                      <input
                        value={opinionForm.author}
                        onChange={e => setOpinionForm(f => ({ ...f, author: e.target.value }))}
                        className="w-full bg-secondary border border-border text-foreground px-3 py-2 text-sm focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Avatar URL</label>
                      <input
                        value={opinionForm.avatar_url}
                        onChange={e => setOpinionForm(f => ({ ...f, avatar_url: e.target.value }))}
                        className="w-full bg-secondary border border-border text-foreground px-3 py-2 text-sm focus:outline-none focus:border-primary"
                        placeholder="https://..."
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Excerto (Opcional)</label>
                      <textarea
                        value={opinionForm.excerpt}
                        onChange={e => setOpinionForm(f => ({ ...f, excerpt: e.target.value }))}
                        className="w-full bg-secondary border border-border text-foreground px-3 py-2 text-sm focus:outline-none focus:border-primary resize-none"
                        rows={2}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Conteúdo</label>
                      <textarea
                        value={opinionForm.content}
                        onChange={e => setOpinionForm(f => ({ ...f, content: e.target.value }))}
                        className="w-full bg-secondary border border-border text-foreground px-3 py-2 text-sm focus:outline-none focus:border-primary resize-none"
                        rows={10}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-4">
                    <button
                      onClick={saveOpinion}
                      disabled={savingOpinion}
                      className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                      <Check className="w-4 h-4" />
                      {savingOpinion ? "A guardar..." : "Guardar"}
                    </button>
                    <button onClick={() => setShowOpinionForm(false)} className="flex items-center gap-2 bg-secondary text-foreground px-4 py-2 text-sm hover:bg-muted transition-colors">
                      <X className="w-4 h-4" />
                      Cancelar
                    </button>
                  </div>
                </div>
              )}

              {/* Opinions table */}
              <div className="bg-card border border-border overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Título</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Autor</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Estado</th>
                      <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {opinions.map(op => (
                      <tr key={op.id} className="border-b border-border hover:bg-secondary/50 transition-colors">
                        <td className="px-4 py-3 text-sm text-foreground max-w-xs">
                          <span className="line-clamp-1">{op.title}</span>
                        </td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">{op.author}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2 py-0.5 ${op.published ? "bg-green-500/20 text-green-400" : "bg-muted text-muted-foreground"}`}>
                            {op.published ? "Publicado" : "Rascunho"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => togglePublished("opinion_articles", op.id, op.published)}
                              className="text-muted-foreground hover:text-foreground transition-colors"
                              title={op.published ? "Despublicar" : "Publicar"}
                            >
                              {op.published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                            <button
                              onClick={() => {
                                setEditingOpinion(op.id);
                                setOpinionForm({
                                  title: op.title,
                                  author: op.author,
                                  content: op.content || "",
                                  excerpt: op.excerpt || "",
                                  avatar_url: op.avatar_url || ""
                                });
                                setShowOpinionForm(true);
                              }}
                              className="text-muted-foreground hover:text-foreground transition-colors"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteRecord("opinion_articles", op.id)}
                              className="text-muted-foreground hover:text-destructive transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {opinions.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-4 py-8 text-center text-sm text-muted-foreground">
                          Sem artigos de opinião.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* AI Discovery & News OSINT */}
          {activeTab === "ai-discovery" && (
            <div className="space-y-6">
              <div className="bg-card border border-border p-6">
                <h3 className="font-heading text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                  <SearchIcon className="w-5 h-5 text-primary" />
                  Pesquisa Inteligente de Notícias (OSINT)
                </h3>
                <div className="flex gap-2">
                  <input
                    value={discoveryQuery}
                    onChange={(e) => setDiscoveryQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleDiscoverNews()}
                    placeholder="Pesquise por temas ou fontes (ex: 'Economia Angola' ou 'Notícias de Luanda')..."
                    className="flex-1 bg-secondary border border-border text-foreground px-4 py-2 text-sm focus:outline-none focus:border-primary"
                  />
                  <button
                    onClick={() => handleDiscoverNews()}
                    disabled={isDiscovering}
                    className="bg-primary text-primary-foreground px-6 py-2 text-sm font-semibold hover:opacity-90 transition-opacity flex items-center gap-2 disabled:opacity-50"
                  >
                    {isDiscovering ? <RefreshCw className="w-4 h-4 animate-spin" /> : <SearchIcon className="w-4 h-4" />}
                    Pesquisar
                  </button>
                </div>
                <div className="flex items-center gap-4 mt-3">
                  <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Filtros OSINT:</span>
                  <div className="flex gap-2">
                    {["Tudo", "Angola", "Mundo", "Política", "Finanças"].map(f => (
                      <button
                        key={f}
                        onClick={() => {
                          setDiscoveryFilter(f);
                          if (discoveryQuery.trim()) handleDiscoverNews(f);
                        }}
                        className={`text-[10px] px-2 py-0.5 border transition-colors uppercase font-bold tracking-tighter ${discoveryFilter === f
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-secondary text-muted-foreground border-border hover:border-primary/50"
                          }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Workspace for AI Adaptation */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Discovery Results */}
                <div className="bg-card border border-border overflow-hidden h-[600px] flex flex-col">
                  <div className="p-4 border-b border-border bg-secondary/30 flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                      <Globe className="w-3.5 h-3.5" />
                      Resultados da Descoberta
                    </h4>
                    <span className="text-[10px] text-muted-foreground">{discoveryResults.length} resultados encontrados</span>
                  </div>
                  <div className="flex-1 overflow-auto p-4 space-y-4">
                    {discoveryResults.map((item, idx) => (
                      <div key={idx} className="bg-secondary/20 border border-border p-4 rounded hover:border-primary/30 transition-all group">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-[10px] font-bold text-primary uppercase tracking-tighter">{item.source || "Fonte Externa"}</span>
                          <span className="text-[10px] text-muted-foreground italic">{item.date}</span>
                        </div>
                        <h5 className="text-sm font-bold text-foreground mb-2 leading-tight group-hover:text-primary transition-colors">{item.title}</h5>
                        <p className="text-xs text-muted-foreground line-clamp-2 mb-4">{item.snippet}</p>
                        <button
                          onClick={() => handleAdaptToEditorial(item)}
                          className="w-full flex items-center justify-center gap-2 bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground border border-primary/20 transition-all py-1.5 text-xs font-bold uppercase tracking-wider"
                        >
                          <Wand2 className="w-3.5 h-3.5" />
                          Adaptar Linha Editorial
                        </button>
                      </div>
                    ))}
                    {!isDiscovering && discoveryResults.length === 0 && (
                      <div className="h-full flex flex-col items-center justify-center text-center p-8">
                        <Globe className="w-8 h-8 text-muted/30 mb-2" />
                        <p className="text-sm text-muted-foreground">Utilize o campo de pesquisa acima para descobrir notícias recentes de diversas fontes.</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* AI Adaptation Workspace */}
                <div className="bg-card border border-border overflow-hidden h-[600px] flex flex-col">
                  <div className="p-4 border-b border-border bg-secondary/30 flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-primary" />
                      Espaço de Trabalho IA
                    </h4>
                    {aiWorkspace.sourceTitle && (
                      <button
                        onClick={() => setAiWorkspace({ ...aiWorkspace, sourceTitle: "", sourceContent: "", adaptedContent: "", adaptedTitle: "", adaptedSummary: "" })}
                        className="text-[10px] font-bold uppercase text-destructive hover:underline"
                      >
                        Limpar
                      </button>
                    )}
                  </div>
                  <div className="flex-1 overflow-auto p-4 space-y-6">
                    {/* Linha Editorial Selector */}
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Linha Editorial Desejada</label>
                      <div className="grid grid-cols-2 gap-2">
                        {["Informativa", "Investigativa", "Crítica", "Formal", "Popular", "Analítica"].map(line => (
                          <button
                            key={line}
                            onClick={() => setAiWorkspace({ ...aiWorkspace, editorialLine: line })}
                            className={`px-3 py-2 text-xs font-semibold border transition-all ${aiWorkspace.editorialLine === line ? "bg-primary text-primary-foreground border-primary" : "bg-secondary border-border text-muted-foreground hover:border-primary/50"}`}
                          >
                            {line}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Source Preview */}
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Original (Fonte)</label>
                      <div className="p-3 bg-secondary/10 border border-border rounded">
                        <h6 className="text-xs font-bold mb-1">{aiWorkspace.sourceTitle || "Nenhuma notícia selecionada"}</h6>
                        <p className="text-[11px] text-muted-foreground italic h-24 overflow-auto">{aiWorkspace.sourceContent || "Selecione uma notícia dos resultados ou cole o texto aqui..."}</p>
                      </div>
                    </div>

                    <button
                      onClick={handleGenerateAI}
                      disabled={isAdapting || !aiWorkspace.sourceTitle}
                      className="w-full flex items-center justify-center gap-3 bg-primary text-primary-foreground py-3 font-heading font-black uppercase tracking-widest text-sm hover:opacity-90 transition-opacity disabled:opacity-50 shadow-lg shadow-primary/20"
                    >
                      {isAdapting ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Bot className="w-5 h-5" />}
                      {isAdapting ? "A Reestruturar Notícia..." : "Gerar com IA / Reestruturar"}
                    </button>

                    {/* AI Result */}
                    {aiWorkspace.adaptedContent && (
                      <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                        <div className="border-t border-border pt-4">
                          <label className="block text-[10px] font-bold uppercase tracking-widest text-primary mb-2">Resultado da IA (Revisar)</label>
                          <input
                            value={aiWorkspace.adaptedTitle}
                            onChange={(e) => setAiWorkspace({ ...aiWorkspace, adaptedTitle: e.target.value })}
                            className="w-full bg-secondary border border-border text-foreground px-3 py-2 text-sm font-bold mb-2 focus:outline-none focus:border-primary"
                            placeholder="Título adaptado..."
                          />
                          <textarea
                            value={aiWorkspace.adaptedContent}
                            onChange={(e) => setAiWorkspace({ ...aiWorkspace, adaptedContent: e.target.value })}
                            className="w-full bg-secondary border border-border text-foreground px-3 py-2 text-xs focus:outline-none focus:border-primary min-h-[200px]"
                            placeholder="Conteúdo reestruturado..."
                          />
                        </div>
                        <button
                          onClick={handleFinalizeAIArticle}
                          className="w-full bg-green-600 text-white py-2.5 font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-green-700 transition-colors"
                        >
                          <Check className="w-4 h-4" />
                          Encaminhar para Publicação
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Ads management */}
          {activeTab === "ads" && (
            <div>
              <div className="bg-card border border-border p-6 mb-8">
                <h3 className="font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-primary" />
                  Configuração de Exibição
                </h3>
                <div className="flex flex-col sm:flex-row items-end gap-4">
                  <div className="flex-1 max-w-xs">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Velocidade do Carrossel (segundos)</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min="3"
                        max="20"
                        step="1"
                        value={adCarouselSpeed}
                        onChange={e => setAdCarouselSpeed(Number(e.target.value))}
                        className="flex-1 accent-primary"
                      />
                      <span className="text-sm font-mono font-bold text-primary w-12 text-center">{adCarouselSpeed}s</span>
                    </div>
                  </div>
                  <button
                    onClick={saveAdCarouselSpeed}
                    disabled={savingSettings}
                    className="bg-primary text-primary-foreground px-6 py-2 text-sm font-semibold hover:opacity-90 disabled:opacity-50 h-10"
                  >
                    {savingSettings ? "A guardar..." : "Salvar Configuração"}
                  </button>
                </div>
                <p className="text-[10px] text-muted-foreground mt-3">Define quanto tempo cada anúncio permanece visível no carrossel lateral.</p>
              </div>

              <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-muted-foreground">Gerir espaços publicitários do site</p>
                <button onClick={() => { setShowAdForm(true); setEditingAd(null); setAdForm({ slot: "banner_top", title: "", image_url: "", video_url: "", link_url: "", display_order: 0 }); }} className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold hover:opacity-90">
                  <Plus className="w-4 h-4" /> Novo Anúncio
                </button>
              </div>

              {showAdForm && (
                <div className="bg-card border border-border p-6 mb-8 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-heading font-semibold text-foreground">{editingAd ? "Editar Anúncio" : "Novo Anúncio"}</h3>
                    <button onClick={() => setShowAdForm(false)}><X className="w-4 h-4 text-muted-foreground" /></button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Posição</label>
                      <select value={adForm.slot} onChange={e => setAdForm({ ...adForm, slot: e.target.value })} className="w-full bg-secondary border border-border text-foreground px-3 py-2 text-sm">
                        <option value="banner_top">Banner Topo</option>
                        <option value="banner_bottom">Banner Final</option>
                        <option value="sidebar_carousel">Carrossel Lateral</option>
                        <option value="sidebar_video">Vídeo Vertical</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Título</label>
                      <input value={adForm.title} onChange={e => setAdForm({ ...adForm, title: e.target.value })} className="w-full bg-secondary border border-border text-foreground px-3 py-2 text-sm" placeholder="Nome do anúncio" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">URL da Imagem</label>
                      <input value={adForm.image_url} onChange={e => setAdForm({ ...adForm, image_url: e.target.value })} className="w-full bg-secondary border border-border text-foreground px-3 py-2 text-sm" placeholder="https://..." />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">URL do Vídeo (Shorts/TikTok)</label>
                      <input value={adForm.video_url} onChange={e => setAdForm({ ...adForm, video_url: e.target.value })} className="w-full bg-secondary border border-border text-foreground px-3 py-2 text-sm" placeholder="https://youtube.com/shorts/..." />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Link de Destino</label>
                      <input value={adForm.link_url} onChange={e => setAdForm({ ...adForm, link_url: e.target.value })} className="w-full bg-secondary border border-border text-foreground px-3 py-2 text-sm" placeholder="https://..." />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Ordem</label>
                      <input type="number" value={adForm.display_order} onChange={e => setAdForm({ ...adForm, display_order: Number(e.target.value) })} className="w-full bg-secondary border border-border text-foreground px-3 py-2 text-sm" />
                    </div>
                  </div>
                  <button
                    onClick={async () => {
                      if (!adForm.title) { toast.error("Título obrigatório"); return; }
                      setSavingAd(true);
                      try {
                        const payload = { ...adForm, active: true };
                        const { error } = editingAd
                          ? await supabase.from("advertisements").update(payload).eq("id", editingAd)
                          : await supabase.from("advertisements").insert(payload);
                        if (error) { toast.error("Erro: " + error.message); }
                        else { toast.success(editingAd ? "Anúncio atualizado!" : "Anúncio criado!"); setShowAdForm(false); loadData("ads"); }
                      } catch (err: any) { toast.error("Erro: " + err.message); }
                      finally { setSavingAd(false); }
                    }}
                    disabled={savingAd}
                    className="mt-4 bg-primary text-primary-foreground px-6 py-2 text-sm font-semibold hover:opacity-90 disabled:opacity-50"
                  >
                    {savingAd ? "A guardar..." : (editingAd ? "Atualizar" : "Criar Anúncio")}
                  </button>
                </div>
              )}

              {/* Ads list grouped by slot */}
              {["banner_top", "banner_bottom", "sidebar_carousel", "sidebar_video"].map(slot => {
                const slotAds = advertisements.filter(a => a.slot === slot);
                const labels: Record<string, string> = { banner_top: "Banner Topo", banner_bottom: "Banner Final", sidebar_carousel: "Carrossel Lateral", sidebar_video: "Vídeo Vertical" };
                return (
                  <div key={slot} className="mb-8">
                    <h3 className="text-sm font-heading font-bold text-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                      <Megaphone className="w-3.5 h-3.5 text-primary" />
                      {labels[slot]}
                      <span className="text-xs font-normal text-muted-foreground">({slotAds.length})</span>
                    </h3>
                    {slotAds.length === 0 ? (
                      <p className="text-xs text-muted-foreground italic">Nenhum anúncio nesta posição.</p>
                    ) : (
                      <div className="bg-card border border-border overflow-hidden">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-border bg-secondary/50">
                              <th className="px-4 py-2 text-left text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Título</th>
                              <th className="px-4 py-2 text-left text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Estado</th>
                              <th className="px-4 py-2 text-right text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Ações</th>
                            </tr>
                          </thead>
                          <tbody>
                            {slotAds.map(ad => (
                              <tr key={ad.id} className="border-b border-border last:border-0 hover:bg-secondary/30">
                                <td className="px-4 py-3">
                                  <span className="text-sm font-medium text-foreground">{ad.title}</span>
                                  {ad.image_url && <img src={ad.image_url} alt="" className="mt-1 h-8 rounded-sm opacity-60" />}
                                </td>
                                <td className="px-4 py-3">
                                  <span className={`text-xs px-2 py-0.5 ${ad.active ? "bg-green-500/20 text-green-400" : "bg-muted text-muted-foreground"}`}>
                                    {ad.active ? "Ativo" : "Inativo"}
                                  </span>
                                </td>
                                <td className="px-4 py-3">
                                  <div className="flex items-center justify-end gap-2">
                                    <button onClick={async () => { await supabase.from("advertisements").update({ active: !ad.active }).eq("id", ad.id); toast.success("Estado alterado"); loadData("ads"); }} className="text-muted-foreground hover:text-foreground" title={ad.active ? "Desativar" : "Ativar"}>
                                      {ad.active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                    <button onClick={() => { setEditingAd(ad.id); setAdForm({ slot: ad.slot, title: ad.title, image_url: ad.image_url || "", video_url: ad.video_url || "", link_url: ad.link_url || "", display_order: ad.display_order || 0 }); setShowAdForm(true); }} className="text-muted-foreground hover:text-foreground">
                                      <Pencil className="w-4 h-4" />
                                    </button>
                                    <button onClick={async () => { if (confirm("Eliminar anúncio?")) { await supabase.from("advertisements").delete().eq("id", ad.id); toast.success("Anúncio eliminado"); loadData("ads"); } }} className="text-muted-foreground hover:text-destructive">
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminPage;
