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
    const [transition, setTransition] = useState<"fade" | "slide">("fade");
    const [isTransitioning, setIsTransitioning] = useState(false);

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
                if (val.transition) setTransition(val.transition);
            }
        };
        fetchAds();
        fetchSettings();
    }, []);

    // Auto-rotate with dynamic speed
    useEffect(() => {
        if (ads.length <= 1) return;
        const interval = setInterval(() => {
            handleNext();
        }, speed);
        return () => clearInterval(interval);
    }, [ads.length, speed]);

    const handleNext = useCallback(() => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setCurrent((prev) => (prev + 1) % ads.length);
        setTimeout(() => setIsTransitioning(false), 600);
    }, [ads.length, isTransitioning]);

    const goTo = useCallback((dir: number) => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setCurrent((prev) => (prev + dir + ads.length) % ads.length);
        setTimeout(() => setIsTransitioning(false), 600);
    }, [ads.length, isTransitioning]);

    if (ads.length === 0) {
        return (
            <div className="w-full aspect-square bg-secondary/50 border border-dashed border-border rounded-sm flex flex-col items-center justify-center gap-2 text-muted-foreground/50 mb-6 font-sans">
                <Megaphone className="w-5 h-5" />
                <span className="text-xs font-semibold uppercase tracking-widest text-center">
                    Publicite Aqui<br />
                    <span className="text-[10px] font-normal normal-case">300 × 300 — Sidebar Square</span>
                </span>
            </div>
        );
    }

    return (
        <div className="relative w-full mb-6 group overflow-hidden rounded-sm border border-border/50 bg-black/5 aspect-square">
            {/* Wrapper para Transições */}
            <div
                className={`w-full h-full ${transition === 'slide' ? 'flex transition-transform duration-500 ease-in-out' : 'relative'}`}
                style={transition === 'slide' ? { transform: `translateX(-${current * 100}%)` } : {}}
            >
                {ads.map((ad, i) => {
                    const Wrapper = ad?.link_url ? "a" : "div";
                    const wrapperProps = ad?.link_url
                        ? { href: ad.link_url, target: "_blank", rel: "noopener noreferrer" }
                        : {};

                    return (
                        <div
                            key={ad.id}
                            className={`${transition === 'slide' ? 'w-full h-full flex-shrink-0' : 'absolute inset-0 w-full h-full transition-opacity duration-500 ease-in-out'}`}
                            style={transition === 'fade' ? { opacity: i === current ? 1 : 0, zIndex: i === current ? 1 : 0 } : {}}
                        >
                            <Wrapper {...wrapperProps} className="block w-full h-full">
                                <img
                                    src={ad.image_url || ""}
                                    alt={ad.title}
                                    className="w-full h-full object-contain"
                                />
                            </Wrapper>
                        </div>
                    );
                })}
            </div>

            {ads.length > 1 && (
                <>
                    <button
                        onClick={(e) => { e.preventDefault(); goTo(-1); }}
                        className="absolute left-1 top-1/2 -translate-y-1/2 w-6 h-6 bg-background/80 backdrop-blur-sm flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    >
                        <ChevronLeft className="w-3 h-3" />
                    </button>
                    <button
                        onClick={(e) => { e.preventDefault(); goTo(1); }}
                        className="absolute right-1 top-1/2 -translate-y-1/2 w-6 h-6 bg-background/80 backdrop-blur-sm flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    >
                        <ChevronRight className="w-3 h-3" />
                    </button>
                    {/* Dots */}
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
                        {ads.map((_, i) => (
                            <button
                                key={i}
                                onClick={(e) => { e.preventDefault(); setCurrent(i); }}
                                className={`w-1.5 h-1.5 rounded-full transition-colors ${i === current ? "bg-primary" : "bg-foreground/30"}`}
                            />
                        ))}
                    </div>
                </>
            )}
            <span className="absolute top-1 right-2 text-[9px] uppercase tracking-widest text-white/60 font-semibold drop-shadow z-10">
                Publicidade
            </span>
        </div>
    );
};

export default AdCarousel;
