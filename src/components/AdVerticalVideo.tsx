import { useState, useEffect, useCallback, useRef } from "react";
import { Megaphone, ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Ad {
    id: string;
    video_url: string | null;
    image_url: string | null;
    link_url: string | null;
    title: string;
}

/** Extrair embed URL para Shorts/TikTok — autoplay muted loop, no UI */
const getEmbedUrl = (url: string): string | null => {
    if (!url) return null;
    const params = "autoplay=1&mute=1&loop=1&controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&disablekb=1&fs=0&playsinline=1";
    // YouTube Shorts
    const shortsMatch = url.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/);
    if (shortsMatch) return `https://www.youtube.com/embed/${shortsMatch[1]}?${params}&playlist=${shortsMatch[1]}`;
    // YouTube normal
    const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
    if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}?${params}&playlist=${ytMatch[1]}`;
    // TikTok
    const tiktokMatch = url.match(/tiktok\.com\/@[^\/]+\/video\/(\d+)/);
    if (tiktokMatch) return `https://www.tiktok.com/embed/v2/${tiktokMatch[1]}`;
    return null;
};

const AdVerticalVideo = () => {
    const [ads, setAds] = useState<Ad[]>([]);
    const [current, setCurrent] = useState(0);
    const [speed, setSpeed] = useState(15000);
    const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});

    useEffect(() => {
        const fetchAds = async () => {
            const { data } = await supabase
                .from("advertisements")
                .select("id, video_url, image_url, link_url, title")
                .eq("slot", "sidebar_video")
                .eq("active", true)
                .order("display_order", { ascending: true });
            if (data && data.length > 0) setAds(data);
        };
        const fetchSettings = async () => {
            const { data } = await supabase
                .from("system_settings")
                .select("value")
                .eq("key", "ad_carousel")
                .single();
            if (data?.value && typeof data.value === 'object') {
                const val = data.value as any;
                if (val.speed) setSpeed(Number(val.speed));
            }
        };
        fetchAds();
        fetchSettings();
    }, []);

    const goTo = useCallback((dir: number) => {
        setCurrent((prev) => (prev + dir + ads.length) % ads.length);
    }, [ads.length]);

    // Intervalo de Rotação
    useEffect(() => {
        if (ads.length <= 1) return;
        const interval = setInterval(() => {
            setCurrent((prev) => (prev + 1) % ads.length);
        }, speed);
        return () => clearInterval(interval);
    }, [ads.length, speed]);

    // Reproduzir apenas o vídeo mp4 direto que está ativo
    useEffect(() => {
        ads.forEach((ad, idx) => {
            const videoEl = videoRefs.current[ad.id];
            if (videoEl) {
                if (idx === current) {
                    videoEl.currentTime = 0;
                    videoEl.play().catch(() => { });
                } else {
                    videoEl.pause();
                }
            }
        });
    }, [current, ads]);

    if (ads.length === 0) {
        return (
            <div className="w-full aspect-[9/16] max-h-[500px] bg-secondary/50 border border-dashed border-border rounded-sm flex flex-col items-center justify-center gap-2 text-muted-foreground/50">
                <Megaphone className="w-5 h-5" />
                <span className="text-xs font-semibold uppercase tracking-widest text-center leading-tight">
                    Publicite Aqui<br />
                    <span className="text-[10px] font-normal normal-case">Formato Vídeo Vertical</span>
                </span>
            </div>
        );
    }

    return (
        <div
            className="relative w-full aspect-[9/16] max-h-[500px] overflow-hidden rounded-sm border border-border/50 bg-black group"
            style={{ isolation: "isolate" }}
        >
            {ads.map((ad, idx) => {
                const isActive = idx === current;
                const videoUrl = ad.video_url || "";
                const embedUrl = getEmbedUrl(videoUrl);
                const isDirectVideo = videoUrl.match(/\.(mp4|webm|ogg)(\?|$)/i);

                const Wrapper = ad.link_url ? "a" : "div";
                const wrapperProps = ad.link_url
                    ? { href: ad.link_url, target: "_blank", rel: "noopener noreferrer" }
                    : {};

                return (
                    <Wrapper
                        key={ad.id}
                        {...wrapperProps}
                        className={`absolute inset-0 w-full h-full block transition-opacity duration-700 ease-in-out ${isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"}`}
                    >
                        {embedUrl ? (
                            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                                <iframe
                                    src={embedUrl}
                                    title={ad.title}
                                    className="border-0"
                                    style={{ position: "absolute", top: "-10%", left: "-10%", width: "120%", height: "120%" }}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                />
                            </div>
                        ) : isDirectVideo ? (
                            <video
                                ref={(el) => (videoRefs.current[ad.id] = el)}
                                src={videoUrl}
                                muted
                                loop
                                playsInline
                                className="w-full h-full object-cover pointer-events-none"
                            />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-b from-zinc-800 to-zinc-900 flex items-center justify-center">
                                {ad.image_url ? (
                                    <img src={ad.image_url} alt={ad.title} className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-white/40 text-xs font-semibold uppercase">{ad.title}</span>
                                )}
                            </div>
                        )}
                    </Wrapper>
                );
            })}

            {/* Transparent overlay for interactions */}
            {ads[current].link_url ? (
                <a
                    href={ads[current].link_url!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute inset-0 z-20 pointer-events-auto"
                />
            ) : (
                <div className="absolute inset-0 z-20 pointer-events-auto" />
            )}

            {/* Navigation Elements */}
            {ads.length > 1 && (
                <>
                    <button
                        onClick={(e) => { e.preventDefault(); goTo(-1); }}
                        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-background/50 hover:bg-background/80 backdrop-blur-md flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-all z-30 text-foreground"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                        onClick={(e) => { e.preventDefault(); goTo(1); }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-background/50 hover:bg-background/80 backdrop-blur-md flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-all z-30 text-foreground"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>

                    {/* Progress Dots */}
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-30 bg-black/40 px-2 py-1 rounded-full backdrop-blur-sm shadow-xl">
                        {ads.map((_, i) => (
                            <button
                                key={i}
                                onClick={(e) => { e.preventDefault(); setCurrent(i); }}
                                className={`h-1.5 rounded-full transition-all duration-300 ${i === current ? "w-4 bg-primary" : "w-1.5 bg-white/50 hover:bg-white/80"}`}
                            />
                        ))}
                    </div>
                </>
            )}

            <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-black/40 backdrop-blur-sm text-[9px] uppercase tracking-widest text-white font-semibold shadow-sm z-30">
                Publicidade
            </span>
        </div>
    );
};

export default AdVerticalVideo;
