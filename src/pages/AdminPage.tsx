import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import {
  LayoutDashboard, Newspaper, Video, MessageSquare, Users, Zap, Megaphone,
  Plus, Pencil, Trash2, Eye, EyeOff, LogOut, ArrowLeft, Check, X, Shield, RefreshCw,
  Globe, Bot, Search as SearchIcon, Sparkles, Wand2, Monitor, FileText, Mail, Copy,
  ExternalLink
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { formatRelativeDate, withTimeout } from "@/lib/utils";
import { categories } from "@/constants/categories";

type Tab = "dashboard" | "articles" | "videos" | "opinions" | "breaking" | "users" | "ai-discovery" | "ads" | "stats" | "digital-editions" | "newsletter";

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

interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  email: string | null;
  country: string | null;
  access_count: number | null;
  last_access: string | null;
  created_at: string;
}

interface DigitalEdition {
  id: string;
  title: string;
  edition_date: string;
  description?: string;
  price_aoa: number;
  price_usd: number;
  cover_url?: string;
  pdf_url: string;
  is_free: boolean;
  published: boolean;
  created_at: string;
}

interface SiteVisit {
  id: string;
  country: string | null;
  created_at: string | null;
  device_type: string | null;
  device_model: string | null;
  browser: string | null;
  os: string | null;
  user_email: string | null;
  visitor_id: string | null;
}

const AdminPage = () => {
  const { user, isAdmin, isEditor, allowedCategories, allowedMenus, loading, signOut } = useAuth();
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
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [siteVisits, setSiteVisits] = useState<SiteVisit[]>([]);
  const [dashboardArticles, setDashboardArticles] = useState<Article[]>([]);
  const [stats, setStats] = useState({ articles: 0, videos: 0, opinions: 0, breaking: 0, users: 0, totalVisits: 0, digitalEditions: 0 });
  const [dataLoading, setDataLoading] = useState(false);
  const [editorCategories, setEditorCategories] = useState<Record<string, string[]>>({});
  const [editorMenuPermissions, setEditorMenuPermissions] = useState<Record<string, string[]>>({});
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

  // Digital Editions
  const [digitalEditions, setDigitalEditions] = useState<DigitalEdition[]>([]);
  const [showDigitalForm, setShowDigitalForm] = useState(false);
  const [editingDigital, setEditingDigital] = useState<string | null>(null);
  const [savingDigital, setSavingDigital] = useState(false);
  const [digitalForm, setDigitalForm] = useState({
    title: "",
    description: "",
    edition_date: format(new Date(), "yyyy-MM-dd"),
    price_aoa: 0,
    price_usd: 0,
    is_free: false,
    cover_url: "",
    pdf_url: ""
  });
  const [digitalCoverFile, setDigitalCoverFile] = useState<File | null>(null);
  const [digitalPdfFile, setDigitalPdfFile] = useState<File | null>(null);

  // Newsletter
  const [newsletterLogs, setNewsletterLogs] = useState<any[]>([]);
  const [newsletterForm, setNewsletterForm] = useState({ subject: "", content: "" });
  const [sendingNewsletter, setSendingNewsletter] = useState(false);

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
  const [userSearch, setUserSearch] = useState("");

  // AI Discovery & Adaptation state
  const [discoveryQuery, setDiscoveryQuery] = useState("");
  const [discoveryResults, setDiscoveryResults] = useState<any[]>([]);
  const [isDiscovering, setIsDiscovering] = useState(false);
  const [discoveryFilter, setDiscoveryFilter] = useState("Tudo");
  const [discoveryTime, setDiscoveryTime] = useState("qdr:d2");
  const [aiWorkspace, setAiWorkspace] = useState({
    sourceUrl: "",
    sourceTitle: "",
    sourceContent: "",
    editorialLine: "Informativa",
    adaptedContent: "",
    adaptedTitle: "",
    adaptedSummary: "",
    category: "Geral",
    impacto: "",
    resumo: "",
    relevancia_para_angola: "",
    factos: "",
    contexto: "",
    leitura_critica: ""
  });
  const [isAdapting, setIsAdapting] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate("/auth");
    if (!loading && user && !isAdmin && !isEditor) navigate("/");
  }, [user, isAdmin, loading, navigate]);

  const allCategories = ["Destaque", "Política", "Sociedade", "Economia", "Mundo", "Desporto", "Cultura", "Tecnologia", "Saúde", "Opinião"];
  const displayedCategories = useMemo(() => {
    return isAdmin || (isEditor && allowedCategories.length === 0)
      ? allCategories
      : allCategories.filter(c => allowedCategories.includes(c));
  }, [isAdmin, isEditor, allowedCategories]);

  useEffect(() => {
    if (isAdmin || isEditor) loadData(activeTab);
  }, [activeTab, isAdmin, isEditor]);

  useEffect(() => {
    if (showArticleForm && !editingArticle && !isAdmin && displayedCategories.length > 0) {
      if (!displayedCategories.includes(articleForm.category)) {
        setArticleForm(prev => ({ ...prev, category: displayedCategories[0] }));
      }
    }
  }, [showArticleForm, editingArticle, isAdmin, displayedCategories]);

  // Setup real-time subscriptions
  useEffect(() => {
    if (!isAdmin && !isEditor) return;

    console.log("Setting up comprehensive real-time dashboard...");
    const channel = supabase
      .channel("admin-realtime-v2")
      // Monitor news, videos, and opinions for dashboard stats and tab updates
      .on("postgres_changes", { event: "*", schema: "public", table: "news_articles" }, () => {
        if (activeTab === "articles" || activeTab === "dashboard") loadData(activeTab);
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "video_news" }, () => {
        if (activeTab === "videos" || activeTab === "dashboard") loadData(activeTab);
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "opinion_articles" }, () => {
        if (activeTab === "opinions" || activeTab === "dashboard") loadData(activeTab);
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "breaking_news" }, () => {
        if (activeTab === "breaking" || activeTab === "dashboard") loadData(activeTab);
      })
      // Monitor user profiles for registration stats
      .on("postgres_changes", { event: "*", schema: "public", table: "profiles" }, () => {
        if (activeTab === "users" || activeTab === "dashboard") loadData(activeTab);
      })
      // CRITICAL: Monitor site visits for real-time traffic dashboard
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "site_visits" }, () => {
        if (activeTab === "stats" || activeTab === "dashboard") loadData(activeTab);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAdmin, isEditor, activeTab]);

  const loadData = async (tab: Tab) => {
    console.log("Loading data for tab:", tab);
    setDataLoading(true);
    try {
      if (tab === "articles") {
        console.log("[LoadData] Fetching articles...");
        const { data, error } = await supabase.from("news_articles").select("*").order("created_at", { ascending: false }).limit(200);
        if (error) {
          console.error("Error loading articles:", error);
          toast.error("Erro ao carregar artigos: " + error.message);
        }
        if (data) {
          console.log(`[LoadData] Received ${data.length} articles.`);
          setArticles(data);
        }
      }

      if (tab === "dashboard") {
        // Efficiently fetch counts for dashboard stats
        const results = await Promise.all([
          supabase.from("news_articles").select("*", { count: 'exact', head: true }),
          supabase.from("video_news").select("*", { count: 'exact', head: true }),
          supabase.from("opinion_articles").select("*", { count: 'exact', head: true }),
          supabase.from("breaking_news").select("*", { count: 'exact', head: true }),
          supabase.from("profiles").select("*", { count: 'exact', head: true }),
          supabase.from("site_visits").select("*", { count: 'exact', head: true }),
          supabase.from("digital_editions").select("*", { count: 'exact', head: true })
        ]);

        const errors = results.filter(r => r.error).map(r => r.error?.message);
        if (errors.length > 0) {
          console.error("Errors in dashboard counts:", errors);
        }

        setStats({
          articles: results[0].count || 0,
          videos: results[1].count || 0,
          opinions: results[2].count || 0,
          breaking: results[3].count || 0,
          users: results[4].count || 0,
          totalVisits: results[5].count || 0,
          digitalEditions: results[6].count || 0
        });

        // Also fetch just a few recent articles for the dashboard preview
        const { data: recentArticles, error: recentError } = await supabase.from("news_articles").select("*").order("created_at", { ascending: false }).limit(10);
        if (recentError) console.error("Error loading recent articles:", recentError);
        if (recentArticles) setDashboardArticles(recentArticles);
      }

      if (tab === "videos") {
        const { data, error } = await withTimeout(supabase.from("video_news").select("*").order("created_at", { ascending: false }).limit(100), 20000) as any;
        if (error) {
          console.error("Error loading videos:", error);
          toast.error("Erro ao carregar vídeos: " + error.message);
        }
        if (data) setVideos(data);
      }

      if (tab === "opinions") {
        const { data, error } = await withTimeout(supabase.from("opinion_articles").select("*").order("created_at", { ascending: false }).limit(100), 20000) as any;
        if (error) {
          console.error("Error loading opinions:", error);
          toast.error("Erro ao carregar opiniões: " + error.message);
        }
        if (data) setOpinions(data);
      }

      if (tab === "breaking") {
        const { data, error } = await withTimeout(supabase.from("breaking_news").select("*").order("created_at", { ascending: false }).limit(100), 20000) as any;
        if (error) {
          console.error("Error loading breaking news:", error);
          toast.error("Erro ao carregar notícias: " + error.message);
        }
        if (data) setBreakingNews(data);

        // Load ticker speed
        const { data: settings } = await supabase.from("system_settings").select("value").eq("key", "ticker").single();
        if (settings?.value && typeof settings.value === 'object') {
          const val = settings.value as any;
          if (val.speed) setTickerSpeed(Number(val.speed));
        }
      }

      if (tab === "stats") {
        const { data: visitData, error: visitError } = await withTimeout(supabase.from("site_visits").select("*").order("created_at", { ascending: false }).limit(500), 20000) as any;
        if (visitError) {
          console.error("Error loading visits:", visitError);
          toast.error("Erro ao carregar dados de visitas: " + visitError.message);
        }
        if (visitData) setSiteVisits(visitData);
      }

      if (tab === "users") {
        // Consolidated users logic
        const [profilesRes, rolesRes, catRes, menuRes] = await Promise.all([
          withTimeout(supabase.from("profiles").select("*").order("last_access", { ascending: false }).limit(200), 20000),
          withTimeout(supabase.from("user_roles").select("*"), 20000),
          supabase.from("editor_categories" as any).select("*"),
          supabase.from("editor_menu_permissions" as any).select("*")
        ]) as any[];

        if (profilesRes.error) {
          console.error("Error loading profiles:", profilesRes.error);
          toast.error("Erro ao carregar perfis: " + profilesRes.error.message);
        }
        if (profilesRes.data) setProfiles(profilesRes.data);

        if (rolesRes.error) {
          console.error("Error loading user roles:", rolesRes.error);
          toast.error("Erro ao carregar permissões: " + rolesRes.error.message);
        }
        if (rolesRes.data) setUserRoles(rolesRes.data);

        if (catRes.data) {
          const catMapping: Record<string, string[]> = {};
          catRes.data.forEach((item: any) => {
            if (!catMapping[item.user_id]) catMapping[item.user_id] = [];
            catMapping[item.user_id].push(item.category);
          });
          setEditorCategories(catMapping);
        }

        if (menuRes.data) {
          const menuMapping: Record<string, string[]> = {};
          menuRes.data.forEach((item: any) => {
            if (!menuMapping[item.user_id]) menuMapping[item.user_id] = [];
            menuMapping[item.user_id].push(item.menu_id);
          });
          setEditorMenuPermissions(menuMapping);
        }
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

      if (tab === "digital-editions") {
        const { data, error } = await supabase.from("digital_editions" as any).select("*").order("edition_date", { ascending: false }).limit(100) as any;
        if (error) {
          console.error("Error loading digital editions:", error);
          toast.error("Erro ao carregar edições digitais: " + error.message);
        }
        if (data) setDigitalEditions(data);
      }

      if (tab === "newsletter") {
        const { data, error } = await supabase.from("newsletter_logs" as any).select("*").order("created_at", { ascending: false }).limit(50) as any;
        if (error) {
          console.error("Error loading newsletter logs:", error);
          toast.error("Erro ao carregar histórico de newsletters: " + error.message);
        }
        if (data) setNewsletterLogs(data);
      }
    } catch (err: any) {
      console.error("Unexpected error in loadData:", err);
      toast.error("Erro inesperado ao carregar dados: " + (err.message || "Tente novamente mais tarde."));
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

  const handleSetRole = async (userId: string, role: string) => {
    setDataLoading(true);
    try {
      // Clean up previous roles for this user to avoid confusion
      await supabase.from("user_roles" as any).delete().eq("user_id", userId);

      if (role !== "leitor") {
        const { error } = await supabase.from("user_roles" as any).insert({ user_id: userId, role });
        if (error) throw error;
      }

      toast.success("Estado do utilizador atualizado");
      await loadData("users");
    } catch (err: any) {
      console.error("Error setting role:", err);
      toast.error("Erro ao atualizar função: " + err.message);
    } finally {
      setDataLoading(false);
    }
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copiado!`);
  };

  const uploadFile = async (file: File, bucket: string = "news", returnPath = false) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    if (returnPath) return filePath;

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleSendNewsletter = async () => {
    if (!newsletterForm.subject || !newsletterForm.content) {
      toast.error("Assunto e conteúdo são obrigatórios.");
      return;
    }

    if (!confirm("Tem a certeza que deseja enviar esta newsletter para TODOS os utilizadores? Esta ação pode demorar alguns minutos e não pode ser desfeita.")) {
      return;
    }

    setSendingNewsletter(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-newsletter', {
        body: {
          subject: newsletterForm.subject,
          content: newsletterForm.content
        }
      });

      if (error) {
        let errorMsg = error.message;
        if (error.context) {
          try {
            const bodyText = typeof error.context.text === 'function'
              ? await error.context.text()
              : (error.context.body || "");
            if (bodyText) {
              const body = JSON.parse(bodyText);
              if (body.error) errorMsg = body.error;
            }
          } catch (e) {
            console.error("Could not parse error body:", e);
          }
        }
        throw new Error(errorMsg);
      };

      toast.success(`Newsletter enviada com sucesso para ${data.sent || 0} utilizadores!`);
      setNewsletterForm({ subject: "", content: "" });
      loadData("newsletter");
    } catch (err: any) {
      console.error("Error sending newsletter:", err);
      const msg = err.message || (typeof err === 'string' ? err : "Erro desconhecido");
      toast.error("Erro ao enviar newsletter: " + msg);
    } finally {
      setSendingNewsletter(false);
    }
  };

  const saveArticle = async () => {
    if (!articleForm.title || (!articleForm.content && !articleForm.summary)) {
      toast.error("Título e Conteúdo/Resumo são obrigatórios");
      return;
    }

    setSavingArticle(true);
    console.log("[SaveArticle] Starting...", { articleForm, editingArticle });
    try {
      let currentImageUrl = articleForm.image_url;

      if (articleImageFile) {
        console.log("[SaveArticle] Uploading image...", articleImageFile.name);
        toast.info("A carregar imagem...");
        currentImageUrl = await withTimeout(uploadFile(articleImageFile), 180000);
        console.log("[SaveArticle] Image upload success:", currentImageUrl);
      }

      // Safety check: verify if the category is allowed for this editor
      if (!isAdmin && allowedCategories.length > 0 && !allowedCategories.includes(articleForm.category)) {
        toast.error(`Não tem permissão para publicar na categoria: ${articleForm.category}`);
        setSavingArticle(false);
        return;
      }

      // Filter payload to only include valid columns
      const payload = {
        title: articleForm.title,
        summary: articleForm.summary,
        content: articleForm.content,
        category: articleForm.category,
        author: articleForm.author,
        image_url: currentImageUrl,
        is_hero: articleForm.is_hero,
        is_breaking: articleForm.is_breaking,
        published: true
      };

      console.log("[SaveArticle] Sending payload to DB...", payload);
      console.log("[SaveArticle] Payload size (chars):", JSON.stringify(payload).length);
      toast.info("A gravar artigo...");

      const startTime = Date.now();
      let result;

      if (editingArticle) {
        console.log("[SaveArticle] Updating article:", editingArticle);
        result = await supabase.from("news_articles").update(payload).eq("id", editingArticle);
      } else {
        console.log("[SaveArticle] Inserting new article");
        result = await supabase.from("news_articles").insert(payload);
      }

      const duration = Date.now() - startTime;
      console.log(`[SaveArticle] DB Operation finished in ${duration}ms.`, result);

      if (result.error) {
        console.error("[SaveArticle] Supabase error:", result.error);
        toast.error("Erro ao guardar artigo: " + result.error.message);
      } else if (!result.data) {
        console.warn("[SaveArticle] No data returned from operation.", result);
        toast.error("O artigo não foi guardado. Verifique as suas permissões.");
      } else {
        console.log("[SaveArticle] Success! Data saved:", result.data);
        toast.success("Artigo guardado com sucesso!");

        // Clear form and close
        setShowArticleForm(false);
        setEditingArticle(null);
        setArticleImageFile(null);
        setArticleForm({ title: "", summary: "", content: "", category: "Política", author: "Redacção", image_url: "", is_hero: false, is_breaking: false });

        // Reload data
        loadData("articles");
      }
    } catch (err: any) {
      console.error("[SaveArticle] Unexpected error:", err);
      toast.error("Erro inesperado ao gravar artigo: " + (err?.message || String(err)));
    } finally {
      console.log("[SaveArticle] Finished execution.");
      setSavingArticle(false);
    }
  };

  const saveVideo = async () => {
    if (!videoForm.title || !videoForm.video_url) {
      toast.error("Título e URL do vídeo são obrigatórios");
      return;
    }

    setSavingVideo(true);
    console.log("[SaveVideo] Starting...", { videoForm, editingVideo });
    try {
      let currentThumbnailUrl = videoForm.thumbnail_url;

      if (videoThumbnailFile) {
        console.log("[SaveVideo] Uploading thumbnail...", videoThumbnailFile.name);
        toast.info("A carregar miniatura...");
        currentThumbnailUrl = await withTimeout(uploadFile(videoThumbnailFile), 180000);
        console.log("[SaveVideo] Thumbnail upload success:", currentThumbnailUrl);
      }

      // Filter payload to only include valid columns
      const payload = {
        title: videoForm.title,
        description: videoForm.description,
        video_url: videoForm.video_url,
        thumbnail_url: currentThumbnailUrl,
        duration: videoForm.duration,
        category: videoForm.category,
        published: true
      };

      console.log("[SaveVideo] Sending payload to DB...", payload);
      toast.info("A gravar dados no servidor...");

      const queryBuilder = editingVideo
        ? supabase.from("video_news").update(payload).eq("id", editingVideo).select()
        : supabase.from("video_news").insert(payload).select();

      // Ensure it's a real promise for withTimeout
      const result = await withTimeout(Promise.resolve(queryBuilder), 30000) as any;

      console.log("[SaveVideo] Result from DB:", result);

      if (result.error) {
        console.error("[SaveVideo] Supabase error:", result.error);
        toast.error("Erro ao guardar vídeo: " + result.error.message);
      } else if (!result.data || result.data.length === 0) {
        console.warn("[SaveVideo] Empty data returned");
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
      console.error("[SaveVideo] Unexpected error:", err);
      toast.error("Erro inesperado ao gravar vídeo: " + (err?.message || String(err)));
    } finally {
      console.log("[SaveVideo] Finished execution.");
      setSavingVideo(false);
    }
  };

  const saveOpinion = async () => {
    if (!opinionForm.title || !opinionForm.author) {
      toast.error("Título e autor são obrigatórios");
      return;
    }

    setSavingOpinion(true);
    console.log("[SaveOpinion] Starting...", { opinionForm, editingOpinion });
    try {
      let currentAvatarUrl = opinionForm.avatar_url;

      if (opinionAvatarFile) {
        console.log("[SaveOpinion] Uploading avatar...", opinionAvatarFile.name);
        toast.info("A carregar avatar...");
        currentAvatarUrl = await withTimeout(uploadFile(opinionAvatarFile), 180000);
        console.log("[SaveOpinion] Avatar upload success:", currentAvatarUrl);
      }

      const payload = {
        title: opinionForm.title,
        author: opinionForm.author,
        avatar_url: currentAvatarUrl,
        excerpt: opinionForm.excerpt,
        content: opinionForm.content,
        published: true
      };

      console.log("[SaveOpinion] Sending to DB...", payload);
      toast.info("A gravar opinião...");

      const queryBuilder = editingOpinion
        ? supabase.from("opinion_articles").update(payload).eq("id", editingOpinion).select()
        : supabase.from("opinion_articles").insert(payload).select();

      const result = await withTimeout(Promise.resolve(queryBuilder), 30000) as any;

      console.log("[SaveOpinion] Result:", result);

      if (result.error) {
        console.error("[SaveOpinion] Supabase error:", result.error);
        toast.error("Erro ao guardar opinião: " + result.error.message);
      } else if (!result.data || result.data.length === 0) {
        toast.error("A opinião não foi guardada. Verifique as suas permissões.");
      } else {
        toast.success("Opinião guardada com sucesso!");
        setShowOpinionForm(false);
        setEditingOpinion(null);
        setOpinionAvatarFile(null);
        setOpinionForm({ title: "", author: "", avatar_url: "", excerpt: "", content: "" });
        loadData("opinions");
      }
    } catch (err: any) {
      console.error("[SaveOpinion] Unexpected error:", err);
      toast.error("Erro inesperado ao gravar opinião: " + (err?.message || String(err)));
    } finally {
      console.log("[SaveOpinion] Finished execution.");
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
        toast.success("Velocidade do ticker actualizada!");
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
        toast.success("Velocidade do carrossel de publicidade actualizada!");
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
    console.log("[SaveBreaking] Starting...", breakingForm);
    try {
      const queryBuilder = supabase.from("breaking_news").insert({ text: breakingForm, active: true }).select();

      const result = await withTimeout(Promise.resolve(queryBuilder), 30000) as any;
      console.log("[SaveBreaking] Result:", result);

      if (result.error) {
        console.error("[SaveBreaking] Error:", result.error);
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
      console.error("[SaveBreaking] Unexpected error:", err);
      toast.error("Erro inesperado ao gravar notícia: " + (err?.message || String(err)));
    } finally {
      setSavingBreaking(false);
    }
  };

  const saveDigitalEdition = async () => {
    if (!digitalForm.title) {
      toast.error("O título é obrigatório");
      return;
    }

    setSavingDigital(true);
    console.log("[SaveDigital] Starting...", { digitalForm, editingDigital });
    try {
      let currentCoverUrl = digitalForm.cover_url;
      let currentPdfUrl = digitalForm.pdf_url;

      if (digitalCoverFile) {
        console.log("[SaveDigital] Uploading cover...", digitalCoverFile.name);
        toast.info("A carregar capa...");
        currentCoverUrl = await withTimeout(uploadFile(digitalCoverFile), 180000);
        console.log("[SaveDigital] Cover upload success:", currentCoverUrl);
      }

      if (digitalPdfFile) {
        console.log("[SaveDigital] Uploading PDF...", digitalPdfFile.name);
        toast.info("A carregar PDF...");
        currentPdfUrl = await withTimeout((uploadFile as any)(digitalPdfFile, "digital-editions", true), 300000);
        console.log("[SaveDigital] PDF upload success:", currentPdfUrl);
      }

      const payload = {
        title: digitalForm.title,
        description: digitalForm.description,
        edition_date: digitalForm.edition_date,
        price_aoa: Number(digitalForm.price_aoa),
        price_usd: Number(digitalForm.price_usd),
        is_free: digitalForm.is_free,
        cover_url: currentCoverUrl,
        pdf_url: currentPdfUrl,
        published: true
      };

      console.log("[SaveDigital] Sending to DB...", payload);
      toast.info("A gravar edição digital...");

      const queryBuilder = editingDigital
        ? supabase.from("digital_editions" as any).update(payload).eq("id", editingDigital).select()
        : supabase.from("digital_editions" as any).insert(payload).select();

      const result = await withTimeout(Promise.resolve(queryBuilder), 60000) as any;

      console.log("[SaveDigital] Result:", result);

      if (result.error) {
        console.error("[SaveDigital] Supabase error:", result.error);
        toast.error("Erro ao guardar edição: " + result.error.message);
      } else {
        toast.success("Edição digital guardada com sucesso!");
        setShowDigitalForm(false);
        setEditingDigital(null);
        setDigitalCoverFile(null);
        setDigitalPdfFile(null);
        setDigitalForm({
          title: "",
          description: "",
          edition_date: format(new Date(), "yyyy-MM-dd"),
          price_aoa: 0,
          price_usd: 0,
          is_free: false,
          cover_url: "",
          pdf_url: ""
        });
        loadData("digital-editions");
      }
    } catch (err: any) {
      console.error("[SaveDigital] Unexpected error:", err);
      toast.error("Erro inesperado ao gravar edição: " + (err?.message || String(err)));
    } finally {
      console.log("[SaveDigital] Finished execution.");
      setSavingDigital(false);
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
    setIsDiscovering(true);
    setDiscoveryResults([]); // Clear previous results
    const activeFilter = filterOverride || discoveryFilter;

    // Garantir que a pesquisa é sempre contextualizada com "Angola"
    let queryBase = discoveryQuery.trim();
    let effectiveQuery = "";

    if (!queryBase) {
      // Se o utilizador não digitou nada, usa o filtro + Angola
      effectiveQuery = activeFilter !== 'Tudo' ? `${activeFilter} Angola` : 'Angola';
    } else {
      // Se o utilizador digitou, garante que "Angola" está lá se não for redundante
      if (!queryBase.toLowerCase().includes('angola')) {
        effectiveQuery = `${queryBase} Angola`;
      } else {
        effectiveQuery = queryBase;
      }
    }

    console.log("Discovery: Searching for:", effectiveQuery, "filter:", activeFilter);

    try {
      const { data, error } = await supabase.functions.invoke('news-osint', {
        body: {
          q: effectiveQuery,
          tbs: discoveryTime
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
      // Chamada à Edge Function 'ai-rewrite'
      const { data, error } = await supabase.functions.invoke('ai-rewrite', {
        body: {
          content: aiWorkspace.sourceContent,
          title: aiWorkspace.sourceTitle,
          url: aiWorkspace.sourceUrl
        }
      });

      if (error) throw error;

      setAiWorkspace({
        ...aiWorkspace,
        adaptedTitle: data.titulo || data.title,
        adaptedContent: data.full_content_html || data.content,
        adaptedSummary: data.resumo || data.summary,
        impacto: data.impacto || "",
        relevancia_para_angola: data.relevancia_para_angola || "",
        category: data.categoria || data.category || aiWorkspace.category,
        factos: data.factos || "",
        contexto: data.contexto || "",
        leitura_critica: data.leitura_critica || ""
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

  // Categories logic moved to top

  // If editor has restrictions, ensure the form starts with an allowed category
  useEffect(() => {
    if (isEditor && !isAdmin && allowedCategories.length > 0 && !allowedCategories.includes(articleForm.category)) {
      setArticleForm(f => ({ ...f, category: allowedCategories[0] }));
    }
  }, [allowedCategories, isAdmin, isEditor]);

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
    { id: "digital-editions" as Tab, label: "Jornal Digital", icon: Newspaper },
    { id: "ai-discovery" as Tab, label: "Descoberta IA", icon: Sparkles },
    ...(isAdmin ? [
      { id: "stats" as Tab, label: "Estatísticas", icon: RefreshCw },
      { id: "ads" as Tab, label: "Publicidade", icon: Megaphone },
      { id: "users" as Tab, label: "Utilizadores", icon: Users },
      { id: "newsletter" as Tab, label: "Newsletter", icon: Mail }
    ] : []),
  ].filter(tab => {
    if (isAdmin) return true;
    if (tab.id === "dashboard") return true;
    if (isEditor) {
      // If editor has specific menu permissions, check them
      if (allowedMenus.length > 0) {
        return allowedMenus.includes(tab.id);
      }
      // Default: if no specific permissions but is editor, show articles/videos/opinions/breaking/digital/ai
      return true;
    }
    return false;
  });

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
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                {[
                  { label: "Artigos", value: stats.articles, icon: Newspaper, color: "text-blue-400" },
                  { label: "Vídeos", value: stats.videos, icon: Video, color: "text-purple-400" },
                  { label: "Jornais", value: stats.digitalEditions, icon: Newspaper, color: "text-pink-400" },
                  { label: "Utilizadores", value: stats.users, icon: Users, color: "text-green-400" },
                  { label: "Visitas Reais", value: stats.totalVisits.toLocaleString(), icon: Eye, color: "text-orange-400" },
                ].map(({ label, value, icon: Icon, color }) => (
                  <div key={label} className="bg-card border border-border p-5">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
                      <Icon className={`w-4 h-4 ${color}`} />
                    </div>
                    <div className="text-2xl font-heading font-bold text-foreground">{value}</div>
                  </div>
                ))}
              </div>

              <div className="bg-card border border-border p-5">
                <h3 className="font-heading font-semibold text-foreground mb-4">Últimos artigos</h3>
                <div className="space-y-2">
                  {dashboardArticles.slice(0, 5).map(a => (
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
                  {dashboardArticles.length === 0 && <p className="text-sm text-muted-foreground">Sem artigos ainda.</p>}
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
                        {displayedCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
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
                          <p className="text-[10px] text-muted-foreground mt-1">Apenas para links directos externos</p>
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
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Categoria</label>
                      <select
                        value={videoForm.category || "Vídeo"}
                        onChange={e => setVideoForm(f => ({ ...f, category: e.target.value }))}
                        className="w-full bg-secondary border border-border text-foreground px-3 py-2 text-sm focus:outline-none focus:border-primary"
                      >
                        {displayedCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                      </select>
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

          {/* Stats */}
          {activeTab === "stats" && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-card border border-border p-6 rounded-xl shadow-sm">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                      <Eye className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground uppercase font-bold tracking-wider">Visitas Totais Reais</p>
                      <p className="text-3xl font-heading font-bold text-foreground">{stats.totalVisits.toLocaleString()}</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">Soma de todos os acessos registados no sistema.</p>
                </div>

                <div className="bg-card border border-border p-6 rounded-xl shadow-sm">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                      <Users className="w-6 h-6 text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground uppercase font-bold tracking-wider">Utilizadores Registados</p>
                      <p className="text-3xl font-heading font-bold text-foreground">{stats.users}</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">Utilizadores com perfil criado na plataforma.</p>
                </div>

                <div className="bg-card border border-border p-6 rounded-xl shadow-sm">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center">
                      <Globe className="w-6 h-6 text-orange-400" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground uppercase font-bold tracking-wider">Países/Zonas (Visitantes)</p>
                      <p className="text-3xl font-heading font-bold text-foreground">{new Set(siteVisits.map(v => v.country).filter(Boolean)).size}</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">Diversidade geográfica baseada em todos os acessos.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-card border border-border rounded-xl overflow-hidden">
                  <div className="p-6 border-b border-border bg-secondary/20">
                    <h3 className="font-heading font-bold text-foreground flex items-center gap-2">
                      <Globe className="w-4 h-4 text-primary" /> Distribuição Geográfica
                    </h3>
                  </div>
                  <div className="p-0">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-muted/30">
                          <th className="text-left px-6 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Zona / País</th>
                          <th className="text-right px-6 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Visitas</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(
                          siteVisits.reduce((acc: Record<string, number>, v) => {
                            const c = v.country || "Desconhecido";
                            acc[c] = (acc[c] || 0) + 1;
                            return acc;
                          }, {})
                        )
                          .sort((a, b) => b[1] - a[1])
                          .map(([country, count]) => (
                            <tr key={country} className="border-b border-border/50 hover:bg-secondary/20">
                              <td className="px-6 py-4 text-sm font-medium text-foreground">{country}</td>
                              <td className="px-6 py-4 text-right text-sm text-muted-foreground font-mono">{count}</td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="bg-card border border-border rounded-xl overflow-hidden">
                  <div className="p-6 border-b border-border bg-secondary/20">
                    <h3 className="font-heading font-bold text-foreground flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 text-primary" /> Atividade Recente
                    </h3>
                  </div>
                  <div className="p-0">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-muted/30">
                          <th className="text-left px-6 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Utilizador</th>
                          <th className="text-right px-6 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Último Acesso</th>
                        </tr>
                      </thead>
                      <tbody>
                        {siteVisits
                          .slice(0, 20)
                          .map((v) => (
                            <tr key={v.id} className="border-b border-border/50 hover:bg-secondary/20">
                              <td className="px-6 py-4">
                                <div className="flex flex-col">
                                  <div className="flex items-center gap-2">
                                    {v.user_email ? (
                                      <span className="text-sm font-bold text-blue-400 flex items-center gap-1">
                                        <Users className="w-3 h-3" /> {v.user_email}
                                      </span>
                                    ) : (
                                      <span className="text-sm font-medium text-foreground">Visitante Anónimo</span>
                                    )}
                                    <span className="text-[10px] text-muted-foreground bg-secondary/50 px-1.5 py-0.5 rounded border border-border/50">
                                      {v.country || "Desconhecido"}
                                    </span>
                                    {v.visitor_id && siteVisits.filter(sv => sv.visitor_id === v.visitor_id).length > 1 && (
                                      <span className="text-[10px] bg-green-500/10 text-green-400 px-1.5 py-0.5 rounded-full border border-green-500/20 flex items-center gap-1">
                                        <Zap className="w-2.5 h-2.5" /> Recorrente
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-2 mt-1.5">
                                    <span className="text-[10px] text-muted-foreground flex items-center gap-1 bg-muted/30 px-1.5 py-0.5 rounded">
                                      <Monitor className="w-3 h-3" /> {v.device_type || "—"} • {v.device_model || "—"}
                                    </span>
                                    <span className="text-[10px] text-muted-foreground flex items-center gap-1 bg-muted/30 px-1.5 py-0.5 rounded">
                                      <Globe className="w-3 h-3" /> {v.browser || "—"} • {v.os || "—"}
                                    </span>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-right text-xs text-muted-foreground">
                                {v.created_at ? formatRelativeDate(v.created_at) : "—"}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Users */}
          {activeTab === "users" && (
            <div className="space-y-6">
              <div className="bg-card border border-border p-6 rounded-xl shadow-sm">
                <h3 className="font-heading font-bold text-foreground mb-1">Atribuir função a utilizador</h3>
                <p className="text-xs text-muted-foreground mb-4">Introduza o UUID do utilizador para conceder acesso administrativo ou de edição.</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="md:col-span-2">
                    <input
                      value={newUserEmail}
                      onChange={e => setNewUserEmail(e.target.value)}
                      className="w-full bg-secondary border border-border text-foreground px-3 py-2 text-sm focus:outline-none focus:border-primary rounded-md"
                      placeholder="UUID do utilizador (ex: 550e8400-e29b-...)"
                    />
                  </div>
                  <select
                    value={newUserRole}
                    onChange={e => setNewUserRole(e.target.value as "admin" | "editor")}
                    className="bg-secondary border border-border text-foreground px-3 py-2 text-sm focus:outline-none focus:border-primary rounded-md"
                  >
                    <option value="editor">Editor</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <button
                  onClick={async () => {
                    const cleanUuid = newUserEmail.trim();
                    if (!cleanUuid) {
                      toast.error("Por favor, introduza um UUID válido.");
                      return;
                    }

                    console.log("Assigning role:", newUserRole, "to user:", cleanUuid);
                    setDataLoading(true);
                    try {
                      const { error } = await supabase
                        .from("user_roles" as any)
                        .insert({ user_id: cleanUuid, role: newUserRole });

                      if (error) {
                        console.error("Supabase error:", error);
                        toast.error("Erro ao atribuir função: " + error.message);
                      } else {
                        console.log("Role assigned successfully");
                        toast.success("Função atribuída com sucesso");
                        setNewUserEmail("");
                        await loadData("users");
                      }
                    } catch (err: any) {
                      console.error("Unexpected error assigning role:", err);
                      toast.error("Erro inesperado: " + (err.message || "Erro desconhecido"));
                    } finally {
                      setDataLoading(false);
                    }
                  }}
                  className="mt-4 flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2 text-sm font-bold hover:opacity-90 transition-opacity rounded-md"
                >
                  <Plus className="w-4 h-4" />
                  Atribuir Função
                </button>
              </div>

              <div className="bg-card border border-border p-4 rounded-xl shadow-sm">
                <div className="relative">
                  <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    value={userSearch}
                    onChange={e => setUserSearch(e.target.value)}
                    className="w-full bg-secondary border border-border text-foreground pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-primary rounded-md"
                    placeholder="Filtrar utilizadores por UUID, Email ou Nome..."
                  />
                </div>
              </div>

              <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-muted/30 border-b border-border">
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Utilizador</th>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-muted-foreground hidden lg:table-cell">País/Zona</th>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-muted-foreground hidden sm:table-cell">Acessos</th>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-muted-foreground hidden md:table-cell">Último Acesso</th>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Estado / Categorias</th>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-muted-foreground text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {profiles
                      .filter(p => {
                        const roles = userRoles.filter(r => r.user_id === p.user_id).map(r => r.role);
                        const isUserAdmin = roles.includes("admin");

                        // Ocultar administradores por segurança
                        if (isUserAdmin) return false;

                        // Filtrar por pesquisa
                        if (!userSearch) return true;
                        const query = userSearch.toLowerCase().trim();
                        return (
                          (p.email?.toLowerCase().includes(query)) ||
                          (p.user_id?.toLowerCase().includes(query)) ||
                          (p.full_name?.toLowerCase().includes(query))
                        );
                      })
                      .map(p => {
                        const roles = userRoles.filter(r => r.user_id === p.user_id).map(r => r.role);
                        const role = roles.includes("admin") ? "admin" : (roles.includes("editor") ? "editor" : (roles.includes("user") ? "user" : null));
                        return (
                          <tr key={p.id} className="border-b border-border last:border-0 hover:bg-secondary/20 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-bold text-foreground">{p.full_name || p.email || "Utilizador"}</p>
                                {p.email && (
                                  <button onClick={() => handleCopy(p.email!, "E-mail")} className="text-muted-foreground hover:text-primary transition-colors">
                                    <Copy className="w-3 h-3" />
                                  </button>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <p className="text-[10px] text-muted-foreground font-mono">{p.user_id}</p>
                                <button onClick={() => handleCopy(p.user_id, "ID do utilizador")} className="text-muted-foreground hover:text-primary transition-colors">
                                  <Copy className="w-2.5 h-2.5" />
                                </button>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-xs text-muted-foreground hidden lg:table-cell">{p.country || "Desconhecido"}</td>
                            <td className="px-6 py-4 text-xs text-muted-foreground hidden sm:table-cell font-mono">{p.access_count || 0}</td>
                            <td className="px-6 py-4 text-xs text-muted-foreground hidden md:table-cell">
                              {p.last_access ? formatRelativeDate(p.last_access) : "Nunca"}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex flex-col gap-2">
                                {role ? (
                                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter w-fit ${role === "admin" ? "bg-primary/10 text-primary border border-primary/20" : "bg-blue-500/10 text-blue-400 border border-blue-500/20"}`}>
                                    {role}
                                  </span>
                                ) : (
                                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium uppercase tracking-tighter w-fit">Leitor</span>
                                )}

                                {role === "editor" && (
                                  <>
                                    <label className="text-[8px] font-bold uppercase text-muted-foreground mt-2">Categorias Permitidas</label>
                                    <div className="flex flex-wrap gap-1 mt-1 max-w-[200px]">
                                      {displayedCategories.map(cat => {
                                        const isSelected = editorCategories[p.user_id]?.includes(cat);
                                        return (
                                          <button
                                            key={cat}
                                            onClick={async () => {
                                              try {
                                                if (isSelected) {
                                                  const { error } = await supabase.from("editor_categories" as any).delete().eq("user_id", p.user_id).eq("category", cat);
                                                  if (error) throw error;
                                                  toast.success(`Categoria "${cat}" removida`);
                                                } else {
                                                  const { error } = await supabase.from("editor_categories" as any).insert({ user_id: p.user_id, category: cat });
                                                  if (error) throw error;
                                                  toast.success(`Categoria "${cat}" adicionada`);
                                                }
                                                await loadData("users");
                                              } catch (err: any) {
                                                console.error("Error toggling category:", err);
                                                toast.error("Erro ao atualizar categoria: " + err.message);
                                              }
                                            }}
                                            className={`text-[8px] px-1.5 py-0.5 rounded border transition-colors ${isSelected ? "bg-primary text-primary-foreground border-primary" : "bg-secondary text-muted-foreground border-border hover:border-primary/50"}`}
                                            title={isSelected ? "Remover categoria" : "Adicionar categoria"}
                                          >
                                            {cat}
                                          </button>
                                        );
                                      })}
                                    </div>

                                    <label className="text-[8px] font-bold uppercase text-muted-foreground mt-3">Módulos do Menu</label>
                                    <div className="flex flex-wrap gap-1 mt-1 max-w-[200px]">
                                      {[
                                        { id: "articles", label: "Artigos" },
                                        { id: "videos", label: "Vídeos" },
                                        { id: "opinions", label: "Opinião" },
                                        { id: "breaking", label: "Última Hora" },
                                        { id: "digital-editions", label: "Jornal Digital" },
                                        { id: "ai-discovery", label: "Descoberta IA" }
                                      ].map(menu => {
                                        const isSelected = editorMenuPermissions[p.user_id]?.includes(menu.id);
                                        return (
                                          <button
                                            key={menu.id}
                                            onClick={async () => {
                                              try {
                                                if (isSelected) {
                                                  const { error } = await supabase.from("editor_menu_permissions" as any).delete().eq("user_id", p.user_id).eq("menu_id", menu.id);
                                                  if (error) throw error;
                                                  toast.success(`Acesso a "${menu.label}" removido`);
                                                } else {
                                                  const { error } = await supabase.from("editor_menu_permissions" as any).insert({ user_id: p.user_id, menu_id: menu.id });
                                                  if (error) throw error;
                                                  toast.success(`Acesso a "${menu.label}" concedido`);
                                                }
                                                await loadData("users");
                                              } catch (err: any) {
                                                console.error("Error toggling menu:", err);
                                                toast.error("Erro ao atualizar menu: " + err.message);
                                              }
                                            }}
                                            className={`text-[8px] px-1.5 py-0.5 rounded border transition-colors ${isSelected ? "bg-blue-600 text-white border-blue-600" : "bg-secondary text-muted-foreground border-border hover:border-blue-400"}`}
                                            title={isSelected ? "Remover acesso ao menu" : "Permitir acesso ao menu"}
                                          >
                                            {menu.label}
                                          </button>
                                        );
                                      })}
                                    </div>
                                  </>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <select
                                  className="bg-secondary border border-border text-[10px] px-2 py-1 rounded focus:outline-none"
                                  value={role || "leitor"}
                                  onChange={(e) => handleSetRole(p.user_id, e.target.value)}
                                >
                                  <option value="leitor">Leitor</option>
                                  <option value="editor">Editor</option>
                                  <option value="admin">Admin</option>
                                </select>
                                {role && (
                                  <button
                                    onClick={() => {
                                      const ur = userRoles.find(r => r.user_id === p.user_id);
                                      if (ur) deleteRecord("user_roles", ur.id);
                                    }}
                                    className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full transition-all"
                                    title="Remover permissões"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    {profiles.length === 0 && <tr><td colSpan={6} className="px-6 py-12 text-center text-sm text-muted-foreground">Não foram encontrados perfis de utilizadores.</td></tr>}
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
          {/* Digital Editions */}
          {activeTab === "digital-editions" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-muted-foreground">{digitalEditions.length} edições digitais no total</p>
                <button
                  onClick={() => {
                    setEditingDigital(null);
                    setDigitalForm({
                      title: "",
                      description: "",
                      edition_date: format(new Date(), "yyyy-MM-dd"),
                      price_aoa: 0,
                      price_usd: 0,
                      is_free: false,
                      cover_url: "",
                      pdf_url: ""
                    });
                    setShowDigitalForm(true);
                  }}
                  className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold hover:opacity-90 transition-opacity"
                >
                  <Plus className="w-4 h-4" />
                  Nova edição digital
                </button>
              </div>

              {showDigitalForm && (
                <div className="bg-card border border-border p-6 mb-6">
                  <h3 className="font-heading font-semibold text-foreground mb-4">
                    {editingDigital ? "Editar edição digital" : "Nova edição digital"}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Título *</label>
                      <input
                        value={digitalForm.title}
                        onChange={e => setDigitalForm(f => ({ ...f, title: e.target.value }))}
                        className="w-full bg-secondary border border-border text-foreground px-3 py-2 text-sm focus:outline-none focus:border-primary"
                        placeholder="Edição nº X - JJ/MM/AAAA"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Descrição</label>
                      <textarea
                        value={digitalForm.description}
                        onChange={e => setDigitalForm(f => ({ ...f, description: e.target.value }))}
                        className="w-full bg-secondary border border-border text-foreground px-3 py-2 text-sm focus:outline-none focus:border-primary resize-none"
                        rows={2}
                        placeholder="Breve descrição da edição"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Data da Edição *</label>
                      <input
                        type="date"
                        value={digitalForm.edition_date}
                        onChange={e => setDigitalForm(f => ({ ...f, edition_date: e.target.value }))}
                        className="w-full bg-secondary border border-border text-foreground px-3 py-2 text-sm focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer mt-5">
                        <input
                          type="checkbox"
                          checked={digitalForm.is_free}
                          onChange={e => setDigitalForm(f => ({ ...f, is_free: e.target.checked }))}
                          className="accent-primary"
                        />
                        Edição Gratuita
                      </label>
                    </div>
                    {!digitalForm.is_free && (
                      <>
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Preço (AOA)</label>
                          <input
                            type="number"
                            value={digitalForm.price_aoa}
                            onChange={e => setDigitalForm(f => ({ ...f, price_aoa: Number(e.target.value) }))}
                            className="w-full bg-secondary border border-border text-foreground px-3 py-2 text-sm focus:outline-none focus:border-primary"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Preço (USD)</label>
                          <input
                            type="number"
                            value={digitalForm.price_usd}
                            onChange={e => setDigitalForm(f => ({ ...f, price_usd: Number(e.target.value) }))}
                            className="w-full bg-secondary border border-border text-foreground px-3 py-2 text-sm focus:outline-none focus:border-primary"
                          />
                        </div>
                      </>
                    )}
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Capa da Edição (JPG/PNG) *</label>
                      <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={e => setDigitalCoverFile(e.target.files?.[0] || null)}
                            className="w-full bg-secondary border border-border text-foreground px-3 py-2 text-sm focus:outline-none focus:border-primary file:bg-primary file:text-primary-foreground file:border-0 file:px-3 file:py-1 file:mr-4 file:text-xs file:font-bold file:uppercase file:cursor-pointer"
                          />
                        </div>
                        <div className="flex-1">
                          <input
                            value={digitalForm.cover_url}
                            onChange={e => setDigitalForm(f => ({ ...f, cover_url: e.target.value }))}
                            className="w-full bg-secondary border border-border text-foreground px-3 py-3 text-sm focus:outline-none focus:border-primary"
                            placeholder="Ou URL da capa..."
                          />
                        </div>
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Ficheiro PDF *</label>
                      <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                          <input
                            type="file"
                            accept="application/pdf"
                            onChange={e => setDigitalPdfFile(e.target.files?.[0] || null)}
                            className="w-full bg-secondary border border-border text-foreground px-3 py-2 text-sm focus:outline-none focus:border-primary file:bg-primary file:text-primary-foreground file:border-0 file:px-3 file:py-1 file:mr-4 file:text-xs file:font-bold file:uppercase file:cursor-pointer"
                          />
                        </div>
                        <div className="flex-1">
                          <input
                            value={digitalForm.pdf_url}
                            onChange={e => setDigitalForm(f => ({ ...f, pdf_url: e.target.value }))}
                            className="w-full bg-secondary border border-border text-foreground px-3 py-2 text-sm focus:outline-none focus:border-primary"
                            placeholder="Ou nome do ficheiro no storage..."
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-6">
                    <button
                      onClick={saveDigitalEdition}
                      disabled={savingDigital}
                      className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                      <Check className="w-4 h-4" />
                      {savingDigital ? "A guardar..." : "Guardar Edição"}
                    </button>
                    <button onClick={() => setShowDigitalForm(false)} className="flex items-center gap-2 bg-secondary text-foreground px-4 py-2 text-sm hover:bg-muted transition-colors">
                      <X className="w-4 h-4" />
                      Cancelar
                    </button>
                  </div>
                </div>
              )}

              <div className="bg-card border border-border overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-secondary/30">
                      <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Edição</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Data</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Preço</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Estado</th>
                      <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {digitalEditions.map(edition => (
                      <tr key={edition.id} className="border-b border-border hover:bg-secondary/50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-10 border border-border bg-muted flex-shrink-0 flex items-center justify-center overflow-hidden">
                              {edition.cover_url ? (
                                <img src={edition.cover_url} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <FileText className="w-4 h-4 text-muted-foreground opacity-30" />
                              )}
                            </div>
                            <span className="text-sm font-medium text-foreground">{edition.title}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">
                          {format(new Date(edition.edition_date), "dd/MM/yyyy")}
                        </td>
                        <td className="px-4 py-3 text-xs font-mono">
                          {edition.is_free ? (
                            <span className="text-primary font-bold">GRÁTIS</span>
                          ) : (
                            <span>{edition.price_aoa} Kz / ${edition.price_usd}</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${edition.published ? "bg-green-500/20 text-green-400" : "bg-muted text-muted-foreground"}`}>
                            {edition.published ? "Publicado" : "Rascunho"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => togglePublished("digital_editions", edition.id, edition.published)}
                              className="text-muted-foreground hover:text-foreground transition-colors"
                              title={edition.published ? "Despublicar" : "Publicar"}
                            >
                              {edition.published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                            <button
                              onClick={() => {
                                setEditingDigital(edition.id);
                                setDigitalForm({
                                  title: edition.title,
                                  description: edition.description || "",
                                  edition_date: edition.edition_date,
                                  price_aoa: edition.price_aoa || 0,
                                  price_usd: edition.price_usd || 0,
                                  is_free: !!edition.is_free,
                                  cover_url: edition.cover_url || "",
                                  pdf_url: edition.pdf_url || ""
                                });
                                setShowDigitalForm(true);
                              }}
                              className="text-muted-foreground hover:text-foreground transition-colors"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteRecord("digital_editions", edition.id)}
                              className="text-muted-foreground hover:text-destructive transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {digitalEditions.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center text-sm text-muted-foreground">
                          Sem edições digitais.
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
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mt-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Filtros OSINT:</span>
                    <div className="flex flex-wrap gap-2">
                      {["Tudo", "Angola", "Luanda", "Política Angola", "Economia Angola", "Energia & Petróleo", "Sociedade Angolana", "Negócios Angola", "Relações Internacionais", "Cuanza"].map(f => (
                        <button
                          key={f}
                          onClick={() => {
                            setDiscoveryFilter(f);
                            handleDiscoverNews(f);
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
                  <div className="flex items-center gap-2 md:ml-auto">
                    <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Período:</span>
                    <select
                      value={discoveryTime}
                      onChange={(e) => setDiscoveryTime(e.target.value)}
                      className="bg-secondary border border-border text-xs font-semibold text-foreground px-3 py-1 focus:outline-none focus:border-primary cursor-pointer"
                    >
                      <option value="">Qualquer período</option>
                      <option value="qdr:h1">Última hora</option>
                      <option value="qdr:d1">Últimas 24h</option>
                      <option value="qdr:d2">Últimas 48h</option>
                      <option value="qdr:w1">Última semana</option>
                      <option value="qdr:m1">Último mês</option>
                    </select>
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
                          <div className="flex items-center gap-2">
                            {item.url ? (
                              <a
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[10px] font-bold text-primary uppercase tracking-tighter hover:underline flex items-center gap-1"
                              >
                                {item.source || "Fonte Externa"}
                                <ExternalLink className="w-2 h-2" />
                              </a>
                            ) : (
                              <span className="text-[10px] font-bold text-primary uppercase tracking-tighter">{item.source || "Fonte Externa"}</span>
                            )}
                            {item.isTranslated && (
                              <span className="text-[8px] bg-blue-500/10 text-blue-500 px-1 border border-blue-500/20 rounded-sm font-bold flex items-center gap-1">
                                <Sparkles className="w-2 h-2" /> TRADUZIDO
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-muted-foreground italic">{item.date}</span>
                        </div>
                        <h5 className="text-sm font-bold text-foreground mb-2 leading-tight group-hover:text-primary transition-colors">{item.title}</h5>
                        <p className="text-xs text-muted-foreground line-clamp-2 mb-4">{item.snippet}</p>
                        <button
                          onClick={() => handleAdaptToEditorial(item)}
                          className="w-full flex items-center justify-center gap-2 bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground border border-primary/20 transition-all py-1.5 text-xs font-bold uppercase tracking-wider"
                        >
                          <Wand2 className="w-3.5 h-3.5" />
                          Adaptar para o Modelo Sem Filtros
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
                    <div>
                      {/* Editorial line selection removed as per user request */}
                      <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg mb-6">
                        <p className="text-[10px] font-bold uppercase text-primary mb-1">Modelo Editorial Ativo</p>
                        <p className="text-xs text-muted-foreground">O sistema irá reestruturar a notícia automaticamente seguindo o novo padrão "Sem Filtros".</p>
                      </div>
                    </div>

                    {/* Source Preview */}
                    <div className="space-y-3">
                      <div>
                        <label className="block text-[9px] font-bold uppercase text-muted-foreground mb-1">Título da Fonte (Opcional)</label>
                        <input
                          value={aiWorkspace.sourceTitle}
                          onChange={(e) => setAiWorkspace({ ...aiWorkspace, sourceTitle: e.target.value })}
                          className="w-full bg-secondary border border-border text-foreground px-3 py-1.5 text-xs focus:outline-none focus:border-primary"
                          placeholder="Título da notícia original..."
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold uppercase text-muted-foreground mb-1">Conteúdo da Fonte (Cole aqui)</label>
                        <textarea
                          value={aiWorkspace.sourceContent}
                          onChange={(e) => setAiWorkspace({ ...aiWorkspace, sourceContent: e.target.value })}
                          className="w-full bg-secondary border border-border text-foreground px-3 py-2 text-[11px] focus:outline-none focus:border-primary min-h-[120px] resize-none"
                          placeholder="Cole o texto da notícia original aqui..."
                        />
                      </div>
                    </div>

                    <button
                      onClick={handleGenerateAI}
                      disabled={isAdapting || !aiWorkspace.sourceContent}
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

                          <div className="mt-4">
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-primary mb-2 text-right">Preview do Post Completo</label>
                            <div
                              className="w-full bg-secondary/30 border border-border p-4 rounded text-sm text-foreground prose prose-invert max-w-none min-h-[300px] overflow-auto"
                              dangerouslySetInnerHTML={{ __html: aiWorkspace.adaptedContent }}
                            />
                            <p className="text-[10px] text-muted-foreground mt-2 italic">* O conteúdo acima já inclui a análise crítica final de acordo com o modelo "Sem Filtros".</p>
                          </div>
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
                        else { toast.success(editingAd ? "Anúncio actualizado!" : "Anúncio criado!"); setShowAdForm(false); loadData("ads"); }
                      } catch (err: any) { toast.error("Erro: " + err.message); }
                      finally { setSavingAd(false); }
                    }}
                    disabled={savingAd}
                    className="mt-4 bg-primary text-primary-foreground px-6 py-2 text-sm font-semibold hover:opacity-90 disabled:opacity-50"
                  >
                    {savingAd ? "A guardar..." : (editingAd ? "Actualizar" : "Criar Anúncio")}
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

          {/* Newsletter Panel */}
          {activeTab === "newsletter" && (
            <div className="space-y-6">
              <div className="bg-card border border-border p-6 rounded-xl shadow-sm">
                <h3 className="font-heading font-bold text-foreground mb-4 flex items-center gap-2">
                  <Mail className="w-5 h-5 text-primary" />
                  Enviar Nova Newsletter
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Assunto do E-mail *</label>
                    <input
                      value={newsletterForm.subject}
                      onChange={e => setNewsletterForm({ ...newsletterForm, subject: e.target.value })}
                      className="w-full bg-secondary border border-border text-foreground px-3 py-2 text-sm focus:outline-none focus:border-primary rounded-md"
                      placeholder="Ex: Notícias da Semana - Portal Sem Filtros"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Conteúdo (Suporta HTML) *</label>
                    <textarea
                      value={newsletterForm.content}
                      onChange={e => setNewsletterForm({ ...newsletterForm, content: e.target.value })}
                      className="w-full bg-secondary border border-border text-foreground px-3 py-2 text-sm font-mono focus:outline-none focus:border-primary rounded-md min-h-[300px]"
                      placeholder="<h1>Olá!</h1><p>Esta é a nossa newsletter...</p>"
                    />
                  </div>
                  <button
                    onClick={handleSendNewsletter}
                    disabled={sendingNewsletter}
                    className="mt-4 flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-3 font-heading font-black uppercase tracking-widest text-sm hover:opacity-90 disabled:opacity-50 transition-opacity rounded-md w-full md:w-auto shadow-lg shadow-primary/20"
                  >
                    {sendingNewsletter ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                    {sendingNewsletter ? "A enviar para todos os utilizadores..." : "Enviar Newsletter Agora"}
                  </button>
                </div>
              </div>

              <div className="bg-card border border-border rounded-xl flex flex-col overflow-hidden shadow-sm">
                <div className="p-4 border-b border-border bg-secondary/30">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Últimos Envios</h4>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-muted/10 border-b border-border">
                        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Data do Envio</th>
                        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Assunto</th>
                        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-muted-foreground text-center">Destinatários</th>
                        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {newsletterLogs.map(log => (
                        <tr key={log.id} className="border-b border-border last:border-0 hover:bg-secondary/20 transition-colors">
                          <td className="px-6 py-4 text-xs text-muted-foreground">
                            {format(new Date(log.created_at), "dd/MM/yyyy • HH:mm")}
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-foreground max-w-xs truncate flex items-center gap-2">
                            {log.subject}
                            <button onClick={() => handleCopy(log.subject, "Assunto")} className="text-muted-foreground hover:text-primary transition-colors flex-shrink-0">
                              <Copy className="w-3 h-3" />
                            </button>
                          </td>
                          <td className="px-6 py-4 text-sm font-mono text-center">
                            {log.recipient_count}
                          </td>
                          <td className="px-6 py-4">
                            {log.status === "success" ? (
                              <span className="text-[10px] px-2 py-0.5 rounded bg-green-500/10 text-green-400 font-bold uppercase">Enviado</span>
                            ) : (
                              <span className="text-[10px] px-2 py-0.5 rounded bg-red-500/10 text-red-500 font-bold uppercase" title={log.error_details || "Erro desconhecido"}>Falhou</span>
                            )}
                          </td>
                        </tr>
                      ))}
                      {newsletterLogs.length === 0 && !dataLoading && (
                        <tr>
                          <td colSpan={4} className="px-6 py-8 text-center text-sm text-muted-foreground">
                            Nenhuma newsletter enviada ainda.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminPage;
