import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import NewsCard, { NewsArticle } from "./NewsCard";
import { formatRelativeDate } from "@/lib/utils";

interface RelatedContentProps {
    currentId: string;
    category?: string;
    type?: "news" | "opinion";
}

const RelatedContent = ({ currentId, category, type = "news" }: RelatedContentProps) => {
    const [items, setItems] = useState<NewsArticle[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRelated = async () => {
            setLoading(true);
            try {
                const now = new Date().toISOString();
                if (type === "news") {
                    let query = supabase
                        .from("news_articles")
                        .select("id, slug, title, summary, category, image_url, created_at, author, scheduled_at")
                        .eq("published", true)
                        .neq("id", currentId)
                        .or(`scheduled_at.is.null,scheduled_at.lte.${now}`)
                        .order("created_at", { ascending: false })
                        .limit(3);

                    if (category) {
                        query = query.eq("category", category);
                    }

                    const { data, error } = await query;
                    if (error) throw error;

                    if (data) {
                        setItems(data.map((item: any) => ({
                            id: item.id,
                            slug: item.slug,
                            title: item.title,
                            summary: item.summary,
                            category: item.category,
                            categorySlug: item.category.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-'),
                            image: item.image_url,
                            timestamp: formatRelativeDate(item.scheduled_at || item.created_at),
                            author: item.author
                        })));
                    }
                } else {
                    // Opinion
                    const { data, error } = await supabase
                        .from("opinion_articles")
                        .select("id, slug, title, author, created_at, avatar_url, scheduled_at")
                        .neq("id", currentId)
                        .or(`scheduled_at.is.null,scheduled_at.lte.${now}`)
                        .order("created_at", { ascending: false })
                        .limit(3);

                    if (error) throw error;

                    if (data) {
                        setItems(data.map((item: any) => ({
                            id: item.id,
                            slug: item.slug,
                            title: item.title,
                            summary: `Opinião de ${item.author}`,
                            category: "Opinião",
                            categorySlug: "opiniao",
                            image: item.avatar_url,
                            timestamp: formatRelativeDate(item.scheduled_at || item.created_at),
                            author: item.author
                        })));
                    }
                }
            } catch (err) {
                console.error("Error fetching related content:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchRelated();
    }, [currentId, category, type]);

    if (loading || items.length === 0) return null;

    return (
        <section className="mt-12 pt-8 border-t border-border">
            <div className="flex items-center gap-3 mb-8">
                <h2 className="text-2xl font-heading font-black text-foreground">Conteúdos Relacionados</h2>
                <div className="flex-1 h-px bg-border" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {items.map((item) => (
                    <NewsCard key={item.id} article={item} />
                ))}
            </div>
        </section>
    );
};

export default RelatedContent;
