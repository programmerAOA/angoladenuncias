import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "lucide-react";

interface OpinionHighlight {
    id: string;
    author: string;
    avatar_url: string | null;
    title: string;
}

const OpinionsCarousel = () => {
    const [opinions, setOpinions] = useState<OpinionHighlight[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOpinions = async () => {
            const { data, error } = await supabase
                .from("opinion_articles")
                .select("id, author, avatar_url, title")
                .order("created_at", { ascending: false })
                .limit(10);

            if (data) {
                setOpinions(data);
            }
        };
        fetchOpinions();
    }, []);

    if (opinions.length === 0) return null;

    return (
        <div className="hidden lg:flex items-center gap-6 px-4 py-1 mx-4 border-x border-border/50 overflow-hidden group">
            <div className="flex items-center gap-1.5 whitespace-nowrap text-[10px] font-black uppercase tracking-tighter text-primary/60 vertical-text mr-2">
                <span className="rotate-180" style={{ writingMode: 'vertical-rl' }}>OPINIÃO</span>
            </div>

            <div className="flex items-center gap-5 animate-scroll-subtle hover:pause-scroll">
                {opinions.map((op) => (
                    <div
                        key={op.id}
                        onClick={() => navigate(`/opinion/${op.id}`)}
                        className="flex items-center gap-2.5 cursor-pointer group/item transition-all duration-300 hover:bg-primary/5 px-2 py-1 rounded-full border border-transparent hover:border-primary/10"
                    >
                        <div className="relative">
                            <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-primary/20 transition-transform group-hover/item:scale-110 group-hover/item:border-primary/50">
                                {op.avatar_url ? (
                                    <img src={op.avatar_url} alt={op.author} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-secondary flex items-center justify-center">
                                        <User className="w-4 h-4 text-muted-foreground" />
                                    </div>
                                )}
                            </div>
                            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-primary rounded-full border-2 border-background scale-0 group-hover/item:scale-100 transition-transform" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[11px] font-bold text-foreground leading-tight group-hover/item:text-primary transition-colors truncate max-w-[100px]">
                                {op.author}
                            </span>
                            <span className="text-[9px] text-muted-foreground leading-tight truncate max-w-[120px]">
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
      `}} />
        </div>
    );
};

export default OpinionsCarousel;
