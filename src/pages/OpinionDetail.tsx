import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { formatRelativeDate, withTimeout } from "@/lib/utils";
import { ArrowLeft, Quote, Share2, User } from "lucide-react";
import { toast } from "sonner";
import CommentsSection from "@/components/CommentsSection";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import BreakingNewsTicker from "@/components/BreakingNewsTicker";
import AdSense from "@/components/AdSense";
import { SEOMetadata } from "@/components/SEOMetadata";

const OpinionDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [opinion, setOpinion] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [breakingHeadlines, setBreakingHeadlines] = useState<{ id: string; title: string }[]>([]);
    const [tickerSpeed, setTickerSpeed] = useState(30);

    const handleShare = async () => {
        if (!opinion) return;

        const shareData = {
            title: opinion.title,
            text: `Opinião de ${opinion.author}`,
            url: window.location.href,
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
                toast.success("Opinião partilhada!");
            } else {
                await navigator.clipboard.writeText(window.location.href);
                toast.success("Link copiado para a área de transferência!");
            }
        } catch (err) {
            console.error("Error sharing:", err);
            if ((err as Error).name !== 'AbortError') {
                toast.error("Erro ao partilhar opinião.");
            }
        }
    };

    useEffect(() => {
        const fetchOpinion = async () => {
            setLoading(true);
            try {
                const { data, error } = await withTimeout(
                    supabase.from("opinion_articles").select("id, title, author, content, avatar_url, created_at, scheduled_at, seo_keywords").eq("id", id).single()
                ) as any;

                if (error) throw error;
                setOpinion(data);
            } catch (err: any) {
                console.error("Error fetching opinion:", err);
                toast.error("Erro ao carregar a opinião: " + (err.message || "Não encontrada"));
                navigate("/");
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchOpinion();

        const fetchStaticData = async () => {
            try {
                const { data: breakingRes } = await supabase
                    .from("breaking_news")
                    .select("id, text, active")
                    .eq("active", true)
                    .order("created_at", { ascending: false });

                if (breakingRes && breakingRes.length > 0) {
                    setBreakingHeadlines(breakingRes.map((b: any) => ({ id: b.id, title: b.text, category: "Última Hora" })));
                } else {
                    const now = new Date().toISOString();
                    const { data: latestNews } = await supabase
                        .from("news_articles")
                        .select("id, title, category")
                        .eq("published", true)
                        .or(`scheduled_at.is.null,scheduled_at.lte.${now}`)
                        .order("created_at", { ascending: false })
                        .limit(10);

                    if (latestNews) {
                        setBreakingHeadlines(latestNews.map((n: any) => ({ id: n.id, title: n.title, category: n.category })));
                    }
                }

                const { data: tickerSettings } = await supabase.from("system_settings").select("value").eq("key", "ticker").single();
                if (tickerSettings?.value && typeof tickerSettings.value === 'object') {
                    const value = tickerSettings.value as any;
                    if (value.speed) setTickerSpeed(Number(value.speed));
                }
            } catch (err) {
                console.error("Erro ao carregar dados estáticos:", err);
            }
        };
        fetchStaticData();
    }, [id, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex flex-col">
                <Header />
                <BreakingNewsTicker
                    headlines={breakingHeadlines}
                    speed={tickerSpeed}
                    onHeadlineClick={(id) => navigate(`/article/${id}`)}
                />
                <div className="flex-1 flex flex-col items-center justify-center w-full">
                    <LoadingSpinner fullScreen />
                </div>
                <Footer />
            </div>
        );
    }

    if (!opinion) return null;

    return (
        <div className="min-h-screen bg-background">
            <SEOMetadata
                title={`${opinion.title} | Opinião - Sem Filtros`}
                description={`Opinião de ${opinion.author}: ${opinion.title}`}
                author={opinion.author}
                image={opinion.avatar_url}
                type="article"
                publishedDate={opinion.scheduled_at || opinion.created_at}
                category="Opinião"
                keywords={opinion.seo_keywords ? opinion.seo_keywords.split(',').map((k: string) => k.trim()) : []}
            />
            <Header />
            <BreakingNewsTicker
                headlines={breakingHeadlines}
                speed={tickerSpeed}
                onHeadlineClick={(id) => navigate(`/article/${id}`)}
            />

            <main className="container py-8 max-w-3xl">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-10 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Voltar para a página inicial
                </button>

                <article className="animate-fade-in">
                    <header className="text-center mb-12">
                        <span className="news-category-badge mb-4 inline-block">Opinião</span>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-black tracking-tight text-foreground mb-8 leading-tight italic px-4">
                            "{opinion.title}"
                        </h1>

                        <div className="flex flex-col items-center justify-center gap-4">
                            <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center overflow-hidden border-2 border-primary/20 p-0.5">
                                {opinion.avatar_url ? (
                                    <img src={opinion.avatar_url} alt={opinion.author} className="w-full h-full object-cover rounded-full" />
                                ) : (
                                    <User className="w-10 h-10 text-muted-foreground" />
                                )}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-lg font-bold text-primary">{opinion.author}</span>
                                <span className="text-sm text-muted-foreground">{formatRelativeDate(opinion.scheduled_at || opinion.created_at)}</span>
                            </div>
                        </div>
                    </header>

                    <div className="relative">
                        <Quote className="absolute -top-6 -left-6 w-12 h-12 text-primary/10 -z-10" />
                        <div className="prose prose-zinc dark:prose-invert max-w-none">
                            <div className="text-foreground leading-relaxed text-xl whitespace-pre-wrap space-y-6 font-serif text-justify">
                                {opinion.content}
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 pt-8 border-t border-border flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={handleShare}
                                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group"
                            >
                                <Share2 className="w-4 h-4 group-hover:scale-110 transition-transform" /> Partilhar opinião
                            </button>
                        </div>
                    </div>
                </article>

                <AdSense />
                <CommentsSection articleId={id!} />
            </main>

            <Footer />
        </div>
    );
};

export default OpinionDetail;
