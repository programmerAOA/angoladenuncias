import { useState, useEffect, useCallback, useRef } from "react";
import { Megaphone, ChevronLeft, ChevronRight, Play, ExternalLink, Volume2, VolumeX, Maximize } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Ad {
    id: string;
    video_url: string | null;
    image_url: string | null;
    link_url: string | null;
    title: string;
}

const AdVerticalVideo = () => {
    const [ads, setAds] = useState<Ad[]>([]);
    const [current, setCurrent] = useState(0);
    const [speed, setSpeed] = useState(15000);
    const [isMuted, setIsMuted] = useState(true);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});
    const containerRef = useRef<HTMLDivElement | null>(null);

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
            const slotSpecificKey = `ad_carousel_sidebar_video`;
            const { data: settings } = await supabase
                .from("system_settings")
                .select("value")
                .eq("key", slotSpecificKey)
                .single();

            let targetValue = settings?.value;

            // Fallback to global
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
            }
        };
        fetchAds();
        fetchSettings();
    }, []);

    const goTo = useCallback((dir: number) => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setTimeout(() => setIsTransitioning(false), 600);
        setCurrent((prev) => (prev + dir + ads.length) % ads.length);
    }, [ads.length, isTransitioning]);

    // Rotação automática
    useEffect(() => {
        if (ads.length <= 1) return;
        const interval = setInterval(() => {
            setIsTransitioning(true);
            setTimeout(() => setIsTransitioning(false), 600);
            setCurrent((prev) => (prev + 1) % ads.length);
        }, speed);
        return () => clearInterval(interval);
    }, [ads.length, speed]);

    // Controlar reprodução dos vídeos mp4 diretos
    useEffect(() => {
        ads.forEach((ad, idx) => {
            const videoEl = videoRefs.current[ad.id];
            if (videoEl) {
                videoEl.muted = isMuted;
                if (idx === current) {
                    videoEl.currentTime = 0;
                    videoEl.play().catch(() => { });
                } else {
                    videoEl.pause();
                }
            }
        });
    }, [current, ads, isMuted]);

    // Toggle mute/unmute
    const toggleMute = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsMuted((prev) => !prev);
    }, []);

    // Entrar em tela cheia
    const enterFullscreen = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const currentAd = ads[current];
        if (currentAd) {
            const videoEl = videoRefs.current[currentAd.id];
            if (videoEl) {
                if (videoEl.requestFullscreen) {
                    videoEl.requestFullscreen();
                } else if ((videoEl as any).webkitRequestFullscreen) {
                    (videoEl as any).webkitRequestFullscreen();
                } else if ((videoEl as any).webkitEnterFullscreen) {
                    (videoEl as any).webkitEnterFullscreen();
                }
                return;
            }
        }

        const container = containerRef.current;
        if (container) {
            if (container.requestFullscreen) {
                container.requestFullscreen();
            } else if ((container as any).webkitRequestFullscreen) {
                (container as any).webkitRequestFullscreen();
            }
        }
    }, [ads, current]);

    // ── Estado vazio: Placeholder Premium ──
    if (ads.length === 0) {
        return (
            <div className="relative w-full aspect-[9/16] max-h-[600px] rounded-xl overflow-hidden"
                style={{ background: "linear-gradient(160deg, #0f0f0f 0%, #1a1a2e 40%, #16213e 100%)" }}
            >
                {/* Efeito decorativo */}
                <div className="absolute inset-0">
                    <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-1/3 left-1/3 w-24 h-24 bg-blue-500/8 rounded-full blur-2xl animate-pulse" style={{ animationDelay: "1s" }} />
                </div>

                {/* Moldura decorativa */}
                <div className="absolute inset-3 border border-white/[0.06] rounded-lg" />

                {/* Conteúdo central */}
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6">
                    <div className="w-14 h-14 rounded-2xl bg-white/[0.05] backdrop-blur-sm border border-white/[0.08] flex items-center justify-center shadow-lg">
                        <Play className="w-6 h-6 text-white/40 ml-0.5" />
                    </div>
                    <div className="text-center space-y-2">
                        <p className="text-white/50 text-[11px] font-bold uppercase tracking-[0.2em]">
                            Espaço Publicitário
                        </p>
                        <p className="text-white/25 text-[10px] tracking-wider">
                            Vídeo Vertical · 9:16
                        </p>
                    </div>
                </div>

                {/* Badge */}
                <div className="absolute top-3 right-3">
                    <span className="px-2.5 py-1 rounded-md bg-white/[0.06] backdrop-blur-md text-[8px] uppercase tracking-[0.15em] text-white/40 font-semibold border border-white/[0.06]">
                        Publicidade
                    </span>
                </div>
            </div>
        );
    }

    return (
        <div
            ref={containerRef}
            className="relative w-full aspect-[9/16] max-h-[600px] rounded-xl overflow-hidden shadow-2xl group"
            style={{ background: "#000" }}
        >
            {/* Moldura exterior */}
            <div className="absolute inset-0 rounded-xl pointer-events-none"
                style={{
                    boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.06), 0 8px 32px rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.3)"
                }}
            />

            {/* Slides dos anúncios */}
            {ads.map((ad, idx) => {
                const isActive = idx === current;
                const videoUrl = ad.video_url || "";
                const isDirectVideo = !!videoUrl && (videoUrl.match(/\.(mp4|webm|ogg)(\?|$)/i) || !videoUrl.includes("youtube.com") && !videoUrl.includes("tiktok.com"));

                return (
                    <div
                        key={ad.id}
                        className="absolute inset-0 w-full h-full"
                        style={{
                            opacity: isActive ? 1 : 0,
                            transform: isActive ? "scale(1)" : "scale(1.03)",
                            zIndex: isActive ? 10 : 0,
                            pointerEvents: isActive ? "auto" : "none",
                            transition: "opacity 600ms ease-in-out, transform 600ms ease-in-out",
                        }}
                    >
                        {isDirectVideo ? (
                            <video
                                ref={(el) => (videoRefs.current[ad.id] = el)}
                                src={videoUrl}
                                muted={isMuted}
                                loop
                                playsInline
                                autoPlay
                                className="w-full h-full object-cover pointer-events-none"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center"
                                style={{ background: "linear-gradient(160deg, #0f0f0f 0%, #1a1a2e 40%, #16213e 100%)" }}
                            >
                                {ad.image_url ? (
                                    <img src={ad.image_url} alt={ad.title} className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-white/30 text-xs font-semibold uppercase tracking-wider">{ad.title}</span>
                                )}
                            </div>
                        )}
                    </div>
                );
            })}

            {/* ── Gradient superior ── */}
            <div className="absolute top-0 left-0 right-0 h-16 z-20 pointer-events-none"
                style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, transparent 100%)" }}
            />

            {/* ── Gradient inferior ── */}
            <div className="absolute bottom-0 left-0 right-0 h-24 z-20 pointer-events-none"
                style={{ background: "linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 100%)" }}
            />

            {/* ── Badge Publicidade ── */}
            <div className="absolute top-3 left-3 z-30">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-black/40 backdrop-blur-xl text-[8px] uppercase tracking-[0.15em] text-white/70 font-semibold border border-white/[0.08] shadow-lg">
                    <Megaphone className="w-2.5 h-2.5" />
                    Publicidade
                </span>
            </div>

            {/* ── Controlos: Som + Tela cheia (canto superior direito) ── */}
            <div className="absolute top-3 right-3 z-30 flex items-center gap-1.5">
                {/* Botão Mute/Unmute */}
                <button
                    onClick={toggleMute}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-xl border border-white/[0.08] hover:border-white/[0.15] text-white/70 hover:text-white transition-all duration-200 shadow-lg"
                    title={isMuted ? "Activar som" : "Desactivar som"}
                >
                    {isMuted ? (
                        <VolumeX className="w-3.5 h-3.5" />
                    ) : (
                        <Volume2 className="w-3.5 h-3.5" />
                    )}
                </button>

                {/* Botão Tela Cheia */}
                <button
                    onClick={enterFullscreen}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-xl border border-white/[0.08] hover:border-white/[0.15] text-white/70 hover:text-white transition-all duration-200 shadow-lg"
                    title="Tela cheia"
                >
                    <Maximize className="w-3.5 h-3.5" />
                </button>
            </div>

            {/* ── Título do anunciante ── */}
            {ads[current] && (
                <div className="absolute bottom-0 left-0 right-0 z-25 pointer-events-none px-4 pb-10">
                    <p className="text-white/90 text-sm font-bold leading-snug drop-shadow-lg line-clamp-2">
                        {ads[current].title}
                    </p>
                    {ads[current].link_url && (
                        <span className="inline-flex items-center gap-1 mt-1.5 text-white/50 text-[10px] uppercase tracking-wider font-medium">
                            <ExternalLink className="w-2.5 h-2.5" />
                            Saber mais
                        </span>
                    )}
                </div>
            )}

            {/* ── Link clicável (não intercepta botões z-30) ── */}
            {ads[current]?.link_url ? (
                <a
                    href={ads[current].link_url!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute inset-0 z-20 cursor-pointer"
                />
            ) : (
                <div className="absolute inset-0 z-20" />
            )}

            {/* ── Navegação multi-anúncio ── */}
            {ads.length > 1 && (
                <>
                    <button
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); goTo(-1); }}
                        className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/30 hover:bg-black/60 backdrop-blur-md flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 z-30 text-white/80 hover:text-white border border-white/[0.06] hover:border-white/[0.12] shadow-lg hover:scale-110"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); goTo(1); }}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/30 hover:bg-black/60 backdrop-blur-md flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 z-30 text-white/80 hover:text-white border border-white/[0.06] hover:border-white/[0.12] shadow-lg hover:scale-110"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>

                    {/* Progress Dots */}
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-30">
                        {ads.map((_, i) => (
                            <button
                                key={i}
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCurrent(i); }}
                                className="relative h-1 rounded-full transition-all duration-500 ease-out"
                                style={{
                                    width: i === current ? "20px" : "6px",
                                    backgroundColor: i === current ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.3)",
                                    boxShadow: i === current ? "0 0 8px rgba(255,255,255,0.3)" : "none",
                                }}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default AdVerticalVideo;
