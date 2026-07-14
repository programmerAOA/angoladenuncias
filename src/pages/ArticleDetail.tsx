import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { formatRelativeDate, withTimeout } from "@/lib/utils";
import { ArrowLeft, User, Calendar, Share2, Headphones, ExternalLink, ChevronRight, Home } from "lucide-react";
import { toast } from "sonner";
import CommentsSection from "@/components/CommentsSection";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { SEOMetadata } from "@/components/SEOMetadata";

import BreakingNewsTicker from "@/components/BreakingNewsTicker";
import RelatedContent from "@/components/RelatedContent";

const ArticleDetail = () => {
    const { id, slug } = useParams();
    const navigate = useNavigate();
    const [article, setArticle] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [breakingHeadlines, setBreakingHeadlines] = useState<{ id: string; title: string }[]>([]);
    const [tickerSpeed, setTickerSpeed] = useState(30);

    const handleShare = async () => {
        if (!article) return;

        const shareData = {
            title: article.title,
            text: article.summary || article.title,
            url: window.location.href,
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
                toast.success("Artigo partilhado!");
            } else {
                await navigator.clipboard.writeText(window.location.href);
                toast.success("Link copiado para a área de transferência!");
            }
        } catch (err) {
            console.error("Error sharing:", err);
            // Don't show error if user cancelled share menu
            if ((err as Error).name !== 'AbortError') {
                toast.error("Erro ao partilhar artigo.");
            }
        }
    };

    useEffect(() => {
        const fetchArticle = async () => {
            setLoading(true);
            try {
                let query = supabase.from("news_articles").select("id, slug, title, summary, content, category, image_url, audio_url, created_at, author, scheduled_at, seo_keywords, source_name, source_url");

                if (id) {
                    query = query.eq("id", id);
                } else if (slug) {
                    query = (query as any).eq("slug", slug);
                }

                const { data, error } = (await withTimeout((query as any).single())) as any;

                if (error) throw error;
                setArticle(data);

                // Canonicalize: if visited via legacy /article/UUID, redirect to slug URL
                if (id && data.slug && data.category) {
                    const catSlug = data.category.toLowerCase()
                        .normalize('NFD')
                        .replace(/[\u0300-\u036f]/g, '')
                        .replace(/\s+/g, '-');
                    navigate(`/${catSlug}/${data.slug}`, { replace: true });
                }
            } catch (err: any) {
                console.error("Error fetching article:", err);
                toast.error("Erro ao carregar o artigo: " + (err.message || "Não encontrado"));
                navigate("/");
            } finally {
                setLoading(false);
            }
        };

        if (id || slug) fetchArticle();

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

    if (!article) return null;

    return (
        <div className="min-h-screen bg-background">
            <SEOMetadata
                title={`${article.title} | Sem Filtros`}
                description={article.summary || article.title}
                author={article.author}
                image={article.image_url}
                type="article"
                publishedDate={article.scheduled_at || article.created_at}
                category={article.category}
                url={article.slug && article.category
                    ? `https://www.semfiltros.com/${article.category.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-')}/${article.slug}`
                    : `https://www.semfiltros.com${window.location.pathname}`}
                keywords={article.seo_keywords ? article.seo_keywords.split(',').map((k: string) => k.trim()) : []}
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

            <main className="container py-8 max-w-4xl">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-4 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Voltar
                </button>

                {/* Visual Breadcrumbs */}
                <nav aria-label="breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground mb-6">
                    <button onClick={() => navigate("/")} className="flex items-center gap-1 hover:text-primary transition-colors">
                        <Home className="w-3 h-3" /> Início
                    </button>
                    <ChevronRight className="w-3 h-3" />
                    {article.category && (
                        <>
                        <button
                            onClick={() => navigate(`/${article.category.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-')}`)}
                            className="hover:text-primary transition-colors capitalize"
                        >
                            {article.category}
                        </button>
                        <ChevronRight className="w-3 h-3" />
                        </>
                    )}
                    <span className="text-foreground/60 line-clamp-1 max-w-[200px]">{article.title}</span>
                </nav>

                <article className="animate-fade-in flex flex-col items-center">
                    <span className="news-category-badge mb-4 inline-block">{article.category}</span>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-black tracking-tight text-foreground mb-6 leading-tight text-center">
                        {article.title}
                    </h1>

                    <div className="flex flex-wrap items-center justify-center gap-4 mb-8 pb-6 border-b border-border w-full">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                                <User className="w-4 h-4 text-muted-foreground" />
                            </div>
                            <span className="text-sm font-semibold text-foreground">{article.author}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            <span className="text-sm">{formatRelativeDate(article.scheduled_at || article.created_at)}</span>
                        </div>
                        {article.source_name && (
                            <div className="flex items-center gap-1.5 text-muted-foreground">
                                <ExternalLink className="w-3.5 h-3.5" />
                                {article.source_url ? (
                                    <a
                                        href={article.source_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs hover:text-primary transition-colors underline underline-offset-2"
                                    >
                                        Fonte: {article.source_name}
                                    </a>
                                ) : (
                                    <span className="text-xs">Fonte: {article.source_name}</span>
                                )}
                            </div>
                        )}
                        <button
                            onClick={handleShare}
                            className="text-muted-foreground hover:text-primary transition-colors p-2 rounded-full hover:bg-primary/10"
                            title="Partilhar artigo"
                        >
                            <Share2 className="w-5 h-5" />
                        </button>
                    </div>

                    {article.audio_url && (
                        <div className="w-full mb-8 bg-secondary/30 p-4 rounded-lg border border-border">
                            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
                                <Headphones className="w-3 h-3" /> Ouvir esta matéria
                            </p>
                            <audio controls className="w-full h-10 accent-primary">
                                <source src={article.audio_url} type="audio/mpeg" />
                                Seu navegador não suporta a reprodução de áudio.
                            </audio>
                        </div>
                    )}

                    {article.image_url && (
                        <div className="mb-8">
                            <img
                                src={article.image_url}
                                alt={article.title}
                                className="w-full aspect-video object-cover shadow-xl"
                            />
                            {article.summary && (
                                <p className="mt-4 text-lg font-medium text-muted-foreground border-l-4 border-primary pl-4 py-2 italic bg-secondary/30">
                                    {article.summary}
                                </p>
                            )}
                        </div>
                    )}

                    {(() => {
                        let htmlContent = article.content || "";
                        const hasHtml = /<[a-z][\s\S]*>/i.test(htmlContent);

                        if (hasHtml) {
                            // If it has HTML but no block-level tags (like <p>, <div>, <br>), 
                            // it means it's plain text mixed with inline HTML (like <span>).
                            // We need to convert newlines to paragraphs so they don't collapse.
                            if (!/<(?:p|br|div|h[1-6]|ul|ol|li|blockquote|table)[>\s]/i.test(htmlContent)) {
                                htmlContent = htmlContent
                                    .split(/\n\n+/)
                                    .map((p: string) => `<p>${p.replace(/\n/g, '<br/>')}</p>`)
                                    .join('');
                            }
                            return (
                                <div
                                    className="prose prose-zinc dark:prose-invert max-w-none w-full
                                        text-foreground leading-relaxed text-lg text-justify
                                        prose-p:mb-5 prose-p:leading-relaxed prose-p:text-justify
                                        prose-h2:font-heading prose-h2:font-black prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h2:text-primary
                                        prose-h3:font-heading prose-h3:font-bold prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3 prose-h3:text-primary
                                        prose-strong:font-black prose-strong:text-foreground"
                                    dangerouslySetInnerHTML={{ __html: htmlContent }}
                                />
                            );
                        } else {
                            return (
                                <div className="prose prose-zinc dark:prose-invert max-w-none w-full prose-p:mb-5 prose-p:leading-relaxed">
                                    {(htmlContent).split(/\n\n+/).map((para: string, i: number) =>
                                        para.trim() ? <p key={i} className="text-foreground leading-relaxed text-lg text-justify mb-5">{para.trim()}</p> : null
                                    )}
                                </div>
                            );
                        }
                    })()}
                </article>


                <CommentsSection articleId={article.id} />
                <RelatedContent currentId={article.id} category={article.category} type="news" />
            </main>

            <Footer />
        </div>
    );
};

export default ArticleDetail;
