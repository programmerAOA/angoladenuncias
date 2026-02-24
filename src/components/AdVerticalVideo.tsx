import { useState, useEffect, useRef } from "react";
import { Megaphone } from "lucide-react";
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
    const [ad, setAd] = useState<Ad | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const fetchAd = async () => {
            const { data } = await supabase
                .from("advertisements")
                .select("id, video_url, image_url, link_url, title")
                .eq("slot", "sidebar_video")
                .eq("active", true)
                .order("display_order", { ascending: true })
                .limit(1)
                .single();
            if (data) setAd(data);
        };
        fetchAd();
    }, []);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.play().catch(() => { });
        }
    }, [ad]);

    if (!ad) {
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

    const videoUrl = ad.video_url || "";
    const embedUrl = getEmbedUrl(videoUrl);
    const isDirectVideo = videoUrl.match(/\.(mp4|webm|ogg)(\?|$)/i);

    return (
        <div
            className="relative w-full aspect-[9/16] max-h-[500px] overflow-hidden rounded-sm border border-border/50 bg-black"
            style={{ isolation: "isolate" }}
        >
            {embedUrl ? (
                <>
                    {/* Scale up iframe and crop to hide YouTube branding/title */}
                    <div className="absolute inset-0 overflow-hidden">
                        <iframe
                            src={embedUrl}
                            title={ad.title}
                            className="border-0 pointer-events-none"
                            style={{
                                position: "absolute",
                                top: "-10%",
                                left: "-10%",
                                width: "120%",
                                height: "120%",
                            }}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        />
                    </div>
                    {/* Transparent overlay to block all user interaction (no pause, no click) */}
                    {ad.link_url ? (
                        <a
                            href={ad.link_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="absolute inset-0 z-10"
                        />
                    ) : (
                        <div className="absolute inset-0 z-10" />
                    )}
                </>
            ) : isDirectVideo ? (
                <video
                    ref={videoRef}
                    src={videoUrl}
                    autoPlay
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
            <span className="absolute top-1 right-2 text-[9px] uppercase tracking-widest text-white/60 font-semibold drop-shadow z-20">
                Publicidade
            </span>
        </div>
    );
};

export default AdVerticalVideo;
