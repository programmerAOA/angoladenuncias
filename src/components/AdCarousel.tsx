import { useState, useEffect, useCallback } from "react";
import { Megaphone, ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Ad {
    id: string;
    image_url: string | null;
    link_url: string | null;
    title: string;
}

const AdCarousel = () => {
    const [ads, setAds] = useState<Ad[]>([]);
    const [current, setCurrent] = useState(0);
    const [speed, setSpeed] = useState(6000);

    useEffect(() => {
        const fetchAds = async () => {
            const { data } = await supabase
                .from("advertisements")
                .select("id, image_url, link_url, title")
                .eq("slot", "sidebar_carousel")
                .eq("active", true)
                .order("display_order", { ascending: true });
            if (data && data.length > 0) setAds(data);
        };
        const fetchSettings = async () => {
            const { data: settings } = await supabase
                .from("system_settings")
                .select("value")
                .eq("key", "ad_carousel")
                .single();
            if (settings?.value && typeof settings.value === 'object') {
                const val = settings.value as any;
                if (val.speed) setSpeed(Number(val.speed));
            }
        };
        fetchAds();
        fetchSettings();
    }, []);

    // Auto-rotate with dynamic speed
    useEffect(() => {
        if (ads.length <= 1) return;
        const interval = setInterval(() => {
            setCurrent((prev) => (prev + 1) % ads.length);
        }, speed);
        return () => clearInterval(interval);
    }, [ads.length, speed]);

    const goTo = useCallback((dir: number) => {
        setCurrent((prev) => (prev + dir + ads.length) % ads.length);
    }, [ads.length]);

    if (ads.length === 0) {
        return (
            <div className="w-full aspect-square bg-secondary/50 border border-dashed border-border rounded-sm flex flex-col items-center justify-center gap-2 text-muted-foreground/50 mb-6">
                <Megaphone className="w-5 h-5" />
                <span className="text-xs font-semibold uppercase tracking-widest">Publicite Aqui</span>
            </div>
        );
    }

    const ad = ads[current];
    const Wrapper = ad?.link_url ? "a" : "div";
    const wrapperProps = ad?.link_url
        ? { href: ad.link_url, target: "_blank", rel: "noopener noreferrer" }
        : {};

    return (
        <div className="relative w-full mb-6 group">
            <Wrapper {...wrapperProps} className="block">
                <img
                    src={ad.image_url || ""}
                    alt={ad.title}
                    className="w-full aspect-square object-cover rounded-sm border border-border/50"
                />
            </Wrapper>

            {ads.length > 1 && (
                <>
                    <button
                        onClick={() => goTo(-1)}
                        className="absolute left-1 top-1/2 -translate-y-1/2 w-6 h-6 bg-background/80 backdrop-blur-sm flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <ChevronLeft className="w-3 h-3" />
                    </button>
                    <button
                        onClick={() => goTo(1)}
                        className="absolute right-1 top-1/2 -translate-y-1/2 w-6 h-6 bg-background/80 backdrop-blur-sm flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <ChevronRight className="w-3 h-3" />
                    </button>
                    {/* Dots */}
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                        {ads.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrent(i)}
                                className={`w-1.5 h-1.5 rounded-full transition-colors ${i === current ? "bg-primary" : "bg-foreground/30"}`}
                            />
                        ))}
                    </div>
                </>
            )}
            <span className="absolute top-1 right-2 text-[9px] uppercase tracking-widest text-white/60 font-semibold drop-shadow">
                Publicidade
            </span>
        </div>
    );
};

export default AdCarousel;
