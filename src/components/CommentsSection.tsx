import { useState, useEffect, useContext } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AuthContext } from "@/contexts/AuthContext";
import { formatRelativeDate } from "@/lib/utils";
import { MessageSquare, Send, Trash2, User as UserIcon } from "lucide-react";
import { toast } from "sonner";

interface Comment {
    id: string;
    content: string;
    created_at: string;
    user_id: string | null;
    user_name: string | null;
}

interface CommentsSectionProps {
    articleId: string;
}

const CommentsSection = ({ articleId }: CommentsSectionProps) => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState("");
    const [anonName, setAnonName] = useState("");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const { user, isAdmin } = useContext(AuthContext);

    const fetchComments = async () => {
        try {
            const { data, error } = await (supabase
                .from("article_comments")
                .select("*")
                .eq("article_id", articleId)
                .order("created_at", { ascending: false }) as any);

            if (error) throw error;
            setComments((data as any[]) || []);
        } catch (err: any) {
            console.error("Error fetching comments:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (articleId) fetchComments();
    }, [articleId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!newComment.trim()) return;

        // Se não estiver logado, precisa de um nome
        if (!user && !anonName.trim()) {
            toast.error("Por favor, insira o seu nome para comentar.");
            return;
        }

        setSubmitting(true);
        try {
            const { error } = await (supabase.from("article_comments").insert({
                article_id: articleId,
                user_id: user ? user.id : null,
                user_name: user ? (user.user_metadata?.full_name || user.email) : anonName.trim(),
                content: newComment.trim(),
            }) as any);

            if (error) throw error;

            setNewComment("");
            if (!user) setAnonName("");
            toast.success("Comentário publicado!");
            fetchComments();
        } catch (err: any) {
            console.error("Error posting comment:", err);
            toast.error("Erro ao publicar comentário.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (commentId: string) => {
        if (!confirm("Tem a certeza que deseja remover este comentário?")) return;

        try {
            const { error } = await (supabase
                .from("article_comments")
                .delete()
                .eq("id", commentId) as any);

            if (error) throw error;
            toast.success("Comentário removido.");
            setComments(comments.filter(c => c.id !== commentId));
        } catch (err) {
            toast.error("Erro ao remover comentário.");
        }
    };

    return (
        <section className="mt-16 border-t border-border pt-12 animate-fade-in px-4">
            <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-2xl font-heading font-black uppercase tracking-tight text-foreground">
                    Comentários ({comments.length})
                </h2>
            </div>

            {/* Comment Form */}
            <div className="bg-secondary/50 p-6 rounded-xl border border-border mb-10">
                <form onSubmit={handleSubmit} className="space-y-4">
                    {!user && (
                        <div className="mb-4">
                            <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">
                                O seu Nome
                            </label>
                            <input
                                type="text"
                                value={anonName}
                                onChange={(e) => setAnonName(e.target.value)}
                                placeholder="Como deseja ser chamado?"
                                className="w-full sm:w-1/2 bg-background border border-border rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                                required={!user}
                            />
                        </div>
                    )}

                    {user && (
                        <div className="flex items-center gap-2 mb-2 text-xs font-bold text-primary uppercase tracking-widest">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            Ligado como: {user.user_metadata?.full_name || user.email}
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">
                            A sua Opinião
                        </label>
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Escreva aqui o seu comentário..."
                            className="w-full bg-background border border-border rounded-lg p-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none min-h-[100px] resize-none"
                            required
                        />
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="bg-primary text-primary-foreground px-8 py-3 rounded-lg text-sm font-bold uppercase tracking-wider flex items-center gap-2 hover:opacity-90 transition-all disabled:opacity-50"
                        >
                            {submitting ? "A publicar..." : "Publicar"}
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                </form>
            </div>

            {/* Comments List */}
            <div className="space-y-6">
                {loading ? (
                    <div className="flex justify-center py-10">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                ) : comments.length > 0 ? (
                    comments.map((comment) => (
                        <div key={comment.id} className="group pb-6 border-b border-border last:border-0">
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center border border-border">
                                        <UserIcon className="w-5 h-5 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-foreground">
                                            {comment.user_name || "Anónimo"}
                                        </h4>
                                        <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">
                                            {formatRelativeDate(comment.created_at)}
                                        </span>
                                    </div>
                                </div>
                                {(isAdmin || (user && user.id === comment.user_id)) && (
                                    <button
                                        onClick={() => handleDelete(comment.id)}
                                        className="p-2 text-muted-foreground hover:text-destructive transition-colors rounded-lg hover:bg-destructive/10"
                                        title="Remover comentário"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                            <div className="text-sm text-foreground/80 leading-relaxed pl-13 whitespace-pre-wrap">
                                {comment.content}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-16 border-2 border-dashed border-border rounded-2xl bg-secondary/20">
                        <p className="text-muted-foreground text-sm font-medium italic">
                            Ainda não há comentários. Seja o primeiro a participar!
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default CommentsSection;
