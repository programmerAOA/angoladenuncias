import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { formatRelativeDate, withTimeout } from "@/lib/utils";
import { ArrowLeft, Quote, Share2, User } from "lucide-react";
import { toast } from "sonner";
import CommentsSection from "@/components/CommentsSection";

const OpinionDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [opinion, setOpinion] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOpinion = async () => {
            setLoading(true);
            try {
                const { data, error } = await withTimeout(
                    supabase.from("opinion_articles").select("*").eq("id", id).single()
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
    }, [id, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!opinion) return null;

    return (
        <div className="min-h-screen bg-background">
            <Header />

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
                                <span className="text-sm text-muted-foreground">{formatRelativeDate(opinion.created_at)}</span>
                            </div>
                        </div>
                    </header>

                    <div className="relative">
                        <Quote className="absolute -top-6 -left-6 w-12 h-12 text-primary/10 -z-10" />
                        <div className="prose prose-zinc dark:prose-invert max-w-none">
                            <div className="text-foreground leading-relaxed text-xl whitespace-pre-wrap space-y-6 font-serif">
                                {opinion.content}
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 pt-8 border-t border-border flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                                <Share2 className="w-4 h-4" /> Partilhar opinião
                            </button>
                        </div>
                    </div>
                </article>

                <CommentsSection articleId={id!} />
            </main>

            <Footer />
        </div>
    );
};

export default OpinionDetail;
