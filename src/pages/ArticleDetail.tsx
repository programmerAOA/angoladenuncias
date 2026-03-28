import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { formatRelativeDate, withTimeout } from "@/lib/utils";
import { ArrowLeft, User, Calendar, Share2 } from "lucide-react";
import { toast } from "sonner";
import CommentsSection from "@/components/CommentsSection";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

const ArticleDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [article, setArticle] = useState<any>(null);
    const [loading, setLoading] = useState(true);

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
                const { data, error } = await withTimeout(
                    supabase.from("news_articles").select("id, title, summary, content, category, image_url, created_at, author").eq("id", id).single()
                ) as any;

                if (error) throw error;
                setArticle(data);
            } catch (err: any) {
                console.error("Error fetching article:", err);
                toast.error("Erro ao carregar o artigo: " + (err.message || "Não encontrado"));
                navigate("/");
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchArticle();
    }, [id, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center">
                <Header />
                <div className="flex-1 flex flex-col items-center justify-center w-full">
                    <LoadingSpinner fullScreen />
                </div>
            </div>
        );
    }

    if (!article) return null;

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="container py-8 max-w-4xl">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Voltar
                </button>

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
                            <span className="text-sm">{formatRelativeDate(article.created_at)}</span>
                        </div>
                        <button
                            onClick={handleShare}
                            className="text-muted-foreground hover:text-primary transition-colors p-2 rounded-full hover:bg-primary/10"
                            title="Partilhar artigo"
                        >
                            <Share2 className="w-5 h-5" />
                        </button>
                    </div>

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

                    <div className="prose prose-zinc dark:prose-invert max-w-none">
                        <div className="text-foreground leading-relaxed text-lg whitespace-pre-wrap space-y-4 text-justify">
                            {article.content}
                        </div>
                    </div>
                </article>

                <CommentsSection articleId={id!} />
            </main>

            <Footer />
        </div>
    );
};

export default ArticleDetail;
