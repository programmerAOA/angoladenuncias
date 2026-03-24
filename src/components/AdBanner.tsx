import { useState, useEffect } from "react";
import { Megaphone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface AdBannerProps {
    slot: "banner_top" | "banner_bottom";
}

interface Ad {
    id: string;
    image_url: string | null;
    link_url: string | null;
    title: string;
}

const AdBanner = ({ slot }: AdBannerProps) => {
    const [ad, setAd] = useState<Ad | null>(null);

    useEffect(() => {
        const fetchAd = async () => {
            const { data } = await supabase
                .from("advertisements")
                .select("id, image_url, link_url, title")
                .eq("slot", slot)
                .eq("active", true)
                .order("display_order", { ascending: true })
                .limit(1)
                .single();
            if (data) setAd(data);
        };
        fetchAd();
    }, [slot]);

    const Wrapper = ad?.link_url ? "a" : "div";
    const wrapperProps = ad?.link_url
        ? { href: ad.link_url, target: "_blank", rel: "noopener noreferrer" }
        : {};

    // Both banner_top and banner_bottom are now 1350×300 Wide Banner
    const placeholderHeight = "h-[300px]";

    return (
        <div className="w-full px-4 py-3">
            <div className="relative w-full max-w-[1350px] mx-auto">
                {ad?.image_url ? (
                    <Wrapper {...wrapperProps} className="block group">
                        <img
                            src={ad.image_url}
                            alt={ad.title}
                            className="w-full h-full object-contain rounded-sm border border-border/50 group-hover:opacity-90 transition-opacity aspect-[1350/300] bg-black/5"
                        />
                        <span className="absolute bottom-1 right-2 text-[9px] uppercase tracking-widest text-muted-foreground/60 font-semibold">
                            Publicidade
                        </span>
                    </Wrapper>
                ) : (
                    <div className={`w-full ${placeholderHeight} bg-secondary/50 border border-dashed border-border rounded-sm flex flex-col items-center justify-center gap-2 text-muted-foreground/50`}>
                        <Megaphone className="w-5 h-5" />
                        <span className="text-xs font-semibold uppercase tracking-widest">Publicite Aqui</span>
                        <span className="text-[10px] text-muted-foreground/40">1350 × 300 — Wide Banner</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdBanner;
