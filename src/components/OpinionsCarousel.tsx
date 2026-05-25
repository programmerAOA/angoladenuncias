import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "lucide-react";

interface OpinionHighlight {
    id: string;
    slug?: string;
    author: string;
    avatar_url: string | null;
    title: string;
}

const OpinionsCarousel = () => {
    const [opinions, setOpinions] = useState<OpinionHighlight[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOpinions = async () => {
            const now = new Date().toISOString();
            const { data, error } = await supabase
                .from("opinion_articles")
                .select("id, slug, author, avatar_url, title")
                .eq("published", true)
                .or(`scheduled_at.is.null,scheduled_at.lte.${now}`)
                .order("created_at", { ascending: false })
                .limit(10);

            if (data) {
                setOpinions(data as any[]);
            }
        };
        fetchOpinions();
    }, []);

    if (opinions.length === 0) return null;

    return (
        <div className="flex items-center gap-3 px-2 py-1 mx-0 sm:gap-6 sm:px-4 sm:mx-4 sm:border-x border-border/50 overflow-hidden group w-full">
            <div className="flex items-center gap-1.5 whitespace-nowrap text-[9px] sm:text-[10px] font-black uppercase tracking-tighter text-primary/60 vertical-text mr-1 sm:mr-2 shrink-0">
                <span className="rotate-180" style={{ writingMode: 'vertical-rl' }}>OPINIÃO</span>
            </div>

            <div className="flex items-center gap-4 sm:gap-5 w-full overflow-x-auto hide-scrollbar animate-scroll-subtle hover:pause-scroll -mb-4 pb-4 sm:-mb-2 sm:pb-2">
                {opinions.map((op) => (
                    <div
                        key={op.id}
                        onClick={() => navigate(`/opiniao/${op.slug || op.id}`)}
                        className="flex items-center gap-2 sm:gap-2.5 cursor-pointer group/item transition-all duration-300 hover:bg-primary/5 px-2 py-1 rounded-full border border-transparent hover:border-primary/10 shrink-0"
                    >
                        <div className="relative">
                            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden border-2 border-primary/20 transition-transform group-hover/item:scale-110 group-hover/item:border-primary/50">
                                {op.avatar_url ? (
                                    <img src={op.avatar_url} alt={op.author} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-secondary flex items-center justify-center">
                                        <User className="w-4 h-4 text-muted-foreground" />
                                    </div>
                                )}
                            </div>
                            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-primary rounded-full border-2 border-background scale-0 group-hover/item:scale-100 transition-transform" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] sm:text-[11px] font-bold text-foreground leading-tight group-hover/item:text-primary transition-colors truncate w-[80px] sm:max-w-[100px]">
                                {op.author}
                            </span>
                            <span className="text-[8px] sm:text-[9px] text-muted-foreground leading-tight truncate w-[100px] sm:max-w-[120px]">
                                {op.title}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
        @keyframes scroll-subtle {
          0% { transform: translateX(0); }
          50% { transform: translateX(-10px); }
          100% { transform: translateX(0); }
        }
        .animate-scroll-subtle {
          /* Desativado por agora para não distrair, mas pronto para uso caso queira movimento */
        }
        .pause-scroll:hover {
          animation-play-state: paused;
        }
        .hide-scrollbar {
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none; /* Chrome, Safari and Opera */
        }
      `}} />
        </div>
    );
};

export default OpinionsCarousel;
