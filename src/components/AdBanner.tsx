import { useState, useEffect, useCallback } from "react";
import { Megaphone, ChevronLeft, ChevronRight } from "lucide-react";
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
                .eq("slot", slot)
                .eq("active", true)
                .order("display_order", { ascending: true });

            if (data && data.length > 0) {
                setAds(data);
            }
        };

        const fetchSettings = async () => {
            const slotSpecificKey = `ad_carousel_${slot}`;
            const { data: settings } = await supabase
                .from("system_settings")
                .select("value")
                .eq("key", slotSpecificKey)
                .single();

            let targetValue = settings?.value;

            // Fallback to global if slot-specific not found
            if (!targetValue) {
                const { data: globalSettings } = await supabase
                    .from("system_settings")
                    .select("value")
                    .eq("key", "ad_carousel")
                    .single();
                targetValue = globalSettings?.value;
            }

            if (targetValue && typeof targetValue === 'object') {
                const val = targetValue as any;
                if (val.speed) setSpeed(Number(val.speed));
                if (val.transition) setTransition(val.transition);
            }
        };

        fetchAds();
        fetchSettings();
    }, [slot]);

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
            <div className="w-full px-4 py-3" style={{ minHeight: '120px' }}>
                <div className="relative w-full max-w-[1350px] mx-auto h-[100px] sm:h-[200px] md:h-[300px] bg-secondary/50 border border-dashed border-border rounded-sm flex flex-col items-center justify-center gap-2 text-muted-foreground/50 font-sans">
                    <Megaphone className="w-5 h-5" />
                    <span className="text-xs font-semibold uppercase tracking-widest">Publicite Aqui</span>
                    <span className="text-[10px] text-muted-foreground/40">1350 × 300 — Wide Banner</span>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full px-4 py-3">
            <div className="relative w-full max-w-[1350px] mx-auto group overflow-hidden rounded-sm border border-border/50 bg-black/5 aspect-[1350/300]">
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
                                style={transition === 'fade' ? { opacity: i === current ? 1 : 0, zIndex: i === current ? 1 : 1 } : {}}
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
                            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-background/80 backdrop-blur-sm flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-20 hover:bg-primary hover:text-white"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                            onClick={(e) => { e.preventDefault(); goTo(1); }}
                            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-background/80 backdrop-blur-sm flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-20 hover:bg-primary hover:text-white"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                        {/* Dots */}
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
                            {ads.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={(e) => { e.preventDefault(); setCurrent(i); }}
                                    className={`w-2 h-2 rounded-full transition-all ${i === current ? "bg-primary w-4" : "bg-foreground/30"}`}
                                />
                            ))}
                        </div>
                    </>
                )}
                <span className="absolute top-2 right-4 text-[10px] uppercase tracking-widest text-white/70 font-bold drop-shadow-md z-20">
                    Publicidade
                </span>
            </div>
        </div>
    );
};

export default AdBanner;
