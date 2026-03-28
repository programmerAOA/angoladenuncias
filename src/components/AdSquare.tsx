import { useState, useEffect } from "react";
import { Megaphone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface AdSquareProps {
    slot: string;
}

interface Ad {
    id: string;
    image_url: string | null;
    link_url: string | null;
    title: string;
}

const AdSquare = ({ slot }: AdSquareProps) => {
    const [ad, setAd] = useState<Ad | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAd = async () => {
            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from("advertisements")
                    .select("id, image_url, link_url, title")
                    .eq("slot", slot)
                    .eq("active", true)
                    .order("display_order", { ascending: true })
                    .limit(1)
                    .maybeSingle();

                if (data) setAd(data);
            } catch (err) {
                console.error("Error fetching ad square:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchAd();
    }, [slot]);

    const Wrapper = ad?.link_url ? "a" : "div";
    const wrapperProps = ad?.link_url
        ? { href: ad.link_url, target: "_blank", rel: "noopener noreferrer" }
        : {};

    if (loading) return (
        <div className="w-full aspect-square bg-secondary/20 animate-pulse rounded-sm border border-border/50" />
    );

    return (
        <div className="w-full py-2">
            <div className="relative w-full aspect-square max-w-[300px] mx-auto overflow-hidden rounded-sm border border-border/50 bg-black/5">
                {ad?.image_url ? (
                    <Wrapper {...wrapperProps} className="block w-full h-full group">
                        <img
                            src={ad.image_url}
                            alt={ad.title}
                            className="w-full h-full object-contain group-hover:opacity-90 transition-opacity"
                        />
                        <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-black/40 backdrop-blur-sm text-[9px] uppercase tracking-widest text-white font-semibold shadow-sm z-10">
                            Publicidade
                        </span>
                    </Wrapper>
                ) : (
                    <div className="w-full h-full bg-secondary/50 border border-dashed border-border rounded-sm flex flex-col items-center justify-center gap-2 text-muted-foreground/50">
                        <Megaphone className="w-5 h-5" />
                        <span className="text-[10px] font-semibold uppercase tracking-widest text-center leading-tight">
                            Publicite Aqui<br />
                            <span className="text-[9px] font-normal normal-case">300 × 300</span>
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdSquare;
