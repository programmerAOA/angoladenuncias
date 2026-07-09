import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { formatRelativeDate, withTimeout } from "@/lib/utils";
import { ArrowLeft, Headphones, Quote, Share2, User } from "lucide-react";
import { toast } from "sonner";
import CommentsSection from "@/components/CommentsSection";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import BreakingNewsTicker from "@/components/BreakingNewsTicker";

import { SEOMetadata } from "@/components/SEOMetadata";
import RelatedContent from "@/components/RelatedContent";

const OpinionDetail = () => {
    const { id, slug } = useParams();
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
                let query: any = supabase.from("opinion_articles").select("id, slug, title, author, content, avatar_url, audio_url, created_at, scheduled_at, seo_keywords");

                if (id) {
                    query = query.eq("id", id);
                } else if (slug) {
                    query = query.eq("slug", slug);
                }

                const { data, error } = (await withTimeout((query as any).single())) as any;

                if (error) throw error;
                setOpinion(data);

                // Canonicalize URL if visited via ID
                if (id && data.slug) {
                    navigate(`/opiniao/${data.slug}`, { replace: true });
                }
            } catch (err: any) {
                console.error("Error fetching opinion:", err);
                toast.error("Erro ao carregar a opinião: " + (err.message || "Não encontrada"));
                navigate("/");
            } finally {
                setLoading(false);
            }
        };

        if (id || slug) fetchOpinion();

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
    }, [id, slug, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex flex-col">
                <Header />
                <BreakingNewsTicker
                    headlines={breakingHeadlines}
                    speed={tickerSpeed}
                    onHeadlineClick={(item) => {
                        if (item.slug && item.categorySlug) {
                            navigate(`/${item.categorySlug}/${item.slug}`);
                        }
                    }}
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
                url={opinion.slug
                    ? `https://www.semfiltros.com/opiniao/${opinion.slug}`
                    : `https://www.semfiltros.com${window.location.pathname}`}
                keywords={opinion.seo_keywords ? opinion.seo_keywords.split(',').map((k: string) => k.trim()) : []}
            />
            <Header />
            <BreakingNewsTicker
                headlines={breakingHeadlines}
                speed={tickerSpeed}
                onHeadlineClick={(item) => {
                    if (item.slug && item.categorySlug) {
                        navigate(`/${item.categorySlug}/${item.slug}`);
                    }
                }}
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

                    {opinion.audio_url && (
                        <div className="w-full mb-10 bg-secondary/30 p-4 rounded-lg border border-border">
                            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
                                <Headphones className="w-3 h-3" /> Ouvir esta opinião
                            </p>
                            <audio controls className="w-full h-10 accent-primary">
                                <source src={opinion.audio_url} type="audio/mpeg" />
                                Seu navegador não suporta a reprodução de áudio.
                            </audio>
                        </div>
                    )}

                    <div className="relative">
                        <Quote className="absolute -top-6 -left-6 w-12 h-12 text-primary/10 -z-10" />
                        {(() => {
                            let htmlContent = opinion.content || "";
                            const hasHtml = /<[a-z][\s\S]*>/i.test(htmlContent);

                            if (hasHtml) {
                                if (!/<(?:p|br|div|h[1-6]|ul|ol|li|blockquote|table)[>\s]/i.test(htmlContent)) {
                                    htmlContent = htmlContent
                                        .split(/\n\n+/)
                                        .map((p: string) => `<p>${p.replace(/\n/g, '<br/>')}</p>`)
                                        .join('');
                                }
                                return (
                                    <div
                                        className="prose prose-zinc dark:prose-invert max-w-none w-full
                                            text-foreground leading-relaxed text-xl text-justify font-serif
                                            prose-p:mb-6 prose-p:leading-relaxed prose-p:text-justify
                                            prose-h2:font-heading prose-h2:font-black prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h2:text-primary
                                            prose-h3:font-heading prose-h3:font-bold prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3 prose-h3:text-primary
                                            prose-strong:font-bold prose-strong:text-foreground"
                                        dangerouslySetInnerHTML={{ __html: htmlContent }}
                                    />
                                );
                            } else {
                                return (
                                    <div className="prose prose-zinc dark:prose-invert max-w-none w-full prose-p:mb-6 prose-p:leading-relaxed">
                                        {(htmlContent).split(/\n\n+/).map((para: string, i: number) =>
                                            para.trim() ? <p key={i} className="text-foreground leading-relaxed text-xl text-justify mb-6 font-serif">{para.trim()}</p> : null
                                        )}
                                    </div>
                                );
                            }
                        })()}
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


                <CommentsSection articleId={opinion.id} />
                <RelatedContent currentId={opinion.id} type="opinion" />
            </main>

            <Footer />
        </div>
    );
};

export default OpinionDetail;
