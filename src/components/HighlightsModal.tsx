import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogClose, DialogTitle } from "@/components/ui/dialog";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { supabase } from "@/integrations/supabase/client";
import { X, ChevronLeft, ChevronRight, Zap, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getCategorySlug } from "@/constants/categories";

const HighlightsModal = () => {
    const [open, setOpen] = useState(false);
    const [highlights, setHighlights] = useState<any[]>([]);
    const [api, setApi] = useState<any>();
    const [current, setCurrent] = useState(0);
    const [progress, setProgress] = useState(0);
    const navigate = useNavigate();

    const SLIDE_DURATION = 6000; // 6 secundos por slide

    useEffect(() => {
        // Inicializar busca de destaques
        fetchHighlights();
    }, []);

    useEffect(() => {
        if (!api || !open) return;

        api.on("select", () => {
            setCurrent(api.selectedScrollSnap());
            setProgress(0);
        });

        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    // Se for o último slide, fecha o modal automaticamente
                    if (current === highlights.length - 1) {
                        setOpen(false);
                        return 100;
                    }
                    api.scrollNext();
                    return 0;
                }
                return prev + (100 / (SLIDE_DURATION / 100));
            });
        }, 100);

        return () => clearInterval(interval);
    }, [api, open, current, highlights.length]);

    const fetchHighlights = async () => {
        try {
            const categoriesToFetch = ["Política", "Economia", "Internacional", "Sociedade", "Desporto"];
            const now = new Date().toISOString();

            // Buscar os 20 artigos mais recentes de todas as categorias
            const { data: latestArticles, error } = await (supabase
                .from("news_articles")
                .select("id, title, category, image_url, slug, created_at, scheduled_at") as any)
                .eq("published", true)
                .or(`scheduled_at.is.null,scheduled_at.lte.${now}`)
                .order("created_at", { ascending: false })
                .limit(20);

            if (error) throw error;
            if (!latestArticles || latestArticles.length === 0) return;

            // Filtrar para ter no máximo 5 destaques, tentando variar as categorias
            const selectedHighlights: any[] = [];
            const seenCategories = new Set();

            for (const article of latestArticles) {
                if (selectedHighlights.length >= 5) break;

                // Priorizar diversidade de categorias inicialmente
                if (!seenCategories.has(article.category)) {
                    selectedHighlights.push(article);
                    seenCategories.add(article.category);
                }
            }

            // Se ainda não temos 5, preencher com os restantes mais recentes independente da categoria
            if (selectedHighlights.length < 5) {
                for (const article of latestArticles) {
                    if (selectedHighlights.length >= 5) break;
                    if (!selectedHighlights.find(h => h.id === article.id)) {
                        selectedHighlights.push(article);
                    }
                }
            }

            if (selectedHighlights.length > 0) {
                const newestArticle = latestArticles[0];
                const lastSeenId = localStorage.getItem("highlights_last_seen_id");
                const lastSeenDate = localStorage.getItem("highlights_last_seen_date");

                // Só mostrar se o artigo mais recente for diferente do último visto
                // ou se nunca tiver sido mostrado
                const isNewContent = newestArticle.id !== lastSeenId &&
                    (!lastSeenDate || new Date(newestArticle.created_at) > new Date(lastSeenDate));

                if (isNewContent) {
                    setHighlights(selectedHighlights);
                    setOpen(true);

                    // Marcar como visto com o ID e data do conteúdo atual
                    localStorage.setItem("highlights_last_seen_id", newestArticle.id);
                    localStorage.setItem("highlights_last_seen_date", newestArticle.created_at);
                }
            }
        } catch (err) {
            console.error("Error fetching highlights for modal:", err);
        }
    };

    if (highlights.length === 0) return null;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-[85vw] md:max-w-[800px] p-0 overflow-hidden border-none bg-black shadow-[0_0_80px_rgba(0,0,0,0.8)] rounded-3xl flex items-center justify-center animate-in zoom-in-95 duration-500">
                <DialogTitle className="sr-only">Destaques Sem Filtros</DialogTitle>
                <div className="relative w-full h-full overflow-hidden group">
                    {/* Progress indicators at the top */}
                    <div className="absolute top-0 left-0 right-0 z-50 flex gap-1 p-2 sm:p-4 bg-gradient-to-b from-black/80 via-black/40 to-transparent">
                        {highlights.map((_, index) => (
                            <div key={index} className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-[#E31E24] transition-all duration-100 ease-linear shadow-[0_0_8px_rgba(227,30,36,0.8)]"
                                    style={{
                                        width: index === current ? `${progress}%` : index < current ? "100%" : "0%"
                                    }}
                                />
                            </div>
                        ))}
                    </div>

                    <Carousel setApi={setApi} className="w-full">
                        <CarouselContent>
                            {highlights.map((article, index) => (
                                <CarouselItem key={article.id} className="relative aspect-[3/4] sm:aspect-[16/9]">
                                    <div
                                        className="relative w-full h-full cursor-pointer overflow-hidden group/item"
                                        onClick={() => {
                                            setOpen(false);
                                            navigate(`/${getCategorySlug(article.category)}/${article.slug}`);
                                        }}
                                    >
                                        {/* Premium Ken Burns Zoom Effect */}
                                        <div className="absolute inset-0 overflow-hidden">
                                            <img
                                                src={article.image_url}
                                                alt={article.title}
                                                className={`w-full h-full object-cover transition-transform duration-[7000ms] ease-out ${index === current ? "scale-110" : "scale-100"
                                                    }`}
                                            />
                                        </div>

                                        {/* Dynamic Visual Polish Overlays */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/10 group-hover/item:opacity-80 transition-opacity duration-700" />

                                        {/* Content Wrapper */}
                                        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-16 text-left">
                                            <div className="flex items-center gap-2 mb-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
                                                <span className="flex items-center gap-1.5 bg-[#E31E24] text-white text-[9px] sm:text-xs font-black px-3 sm:px-5 py-1 sm:py-2 uppercase tracking-[0.15em] sm:tracking-[0.25em] shadow-[0_8px_20px_rgba(227,30,36,0.4)] rounded-full border border-white/10">
                                                    <Zap className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 fill-white animate-pulse" />
                                                    {article.category}
                                                </span>
                                            </div>

                                            <h2 className="text-white text-xl sm:text-6xl font-heading font-black leading-[1.1] sm:leading-[1.0] tracking-tight sm:tracking-tighter drop-shadow-[0_10px_20px_rgba(0,0,0,0.9)] animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-150 group-hover/item:text-[#E31E24] transition-colors">
                                                {article.title}
                                            </h2>

                                            <div className="mt-6 sm:mt-10 flex items-center gap-4 sm:gap-6 animate-in fade-in slide-in-from-left-8 duration-1000 delay-500">
                                                <div className="h-0.5 w-8 sm:w-16 bg-[#E31E24] shadow-[0_0_10px_rgba(227,30,36,0.8)]" />
                                                <span className="flex items-center gap-1.5 sm:gap-2 text-white/90 text-[10px] sm:text-sm font-black uppercase tracking-[0.1em] sm:tracking-[0.2em] group-hover/item:gap-4 transition-all duration-300">
                                                    Ler agora
                                                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-[#E31E24]" />
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>

                        {/* Premium Navigation */}
                        <div className="absolute inset-y-0 left-0 right-0 px-4 sm:px-6 flex justify-between items-center pointer-events-none group-hover:opacity-100 opacity-0 transition-opacity duration-500">
                            <button
                                onClick={(e) => { e.stopPropagation(); api?.scrollPrev(); }}
                                className="pointer-events-auto w-10 h-10 sm:w-14 sm:h-14 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-xl border border-white/10 text-white hover:bg-[#E31E24] hover:scale-110 transition-all duration-300 shadow-2xl active:scale-95"
                            >
                                <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); api?.scrollNext(); }}
                                className="pointer-events-auto w-10 h-10 sm:w-14 sm:h-14 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-xl border border-white/10 text-white hover:bg-[#E31E24] hover:scale-110 transition-all duration-300 shadow-2xl active:scale-95"
                            >
                                <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
                            </button>
                        </div>
                    </Carousel>

                    {/* Styled Close Button */}
                    <DialogClose className="absolute top-3 sm:top-4 right-3 sm:right-4 text-white/50 hover:text-white p-2 sm:p-3 transition-all z-50 bg-black/30 backdrop-blur-xl rounded-full border border-white/10 hover:border-[#E31E24]/50 group/close shadow-xl active:scale-90">
                        <X className="w-5 h-5 sm:w-7 sm:h-7 group-hover/close:rotate-180 transition-transform duration-500" />
                        <span className="sr-only">Fechar</span>
                    </DialogClose>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default HighlightsModal;
