import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { withTimeout, getYoutubeId } from "@/lib/utils";
import { Play, Clock, Eye, ArrowLeft, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Hls from "hls.js";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

/** Detecta o tipo de URL do vídeo */
const getVideoType = (url: string): "youtube" | "hls" | "direct" | "unknown" => {
    if (!url) return "unknown";
    if (getYoutubeId(url)) return "youtube";
    if (url.includes(".m3u8")) return "hls";
    if (url.match(/\.(mp4|webm|ogg)(\?|$)/i)) return "direct";
    return "unknown";
};

const HlsPlayer = ({ src, title }: { src: string; title: string }) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        if (Hls.isSupported()) {
            const hls = new Hls();
            hls.loadSource(src);
            hls.attachMedia(video);
            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                video.play().catch(() => { });
            });
            return () => hls.destroy();
        } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = src;
            video.addEventListener("loadedmetadata", () => {
                video.play().catch(() => { });
            });
        }
    }, [src]);

    return <video ref={videoRef} controls className="w-full h-full object-contain bg-black" title={title} />;
};

const VideosPage = () => {
    const [videos, setVideos] = useState<any[]>([]);
    const [featuredVideo, setFeaturedVideo] = useState<any>(null);
    const [playing, setPlaying] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchVideos = async () => {
            setLoading(true);
            try {
                const { data, error } = await withTimeout(
                    supabase.from("video_news").select("*").order("created_at", { ascending: false })
                ) as any;
                if (data) {
                    setVideos(data);
                    if (data.length > 0) setFeaturedVideo(data[0]);
                }
            } catch (err) {
                console.error("Error fetching videos:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchVideos();
    }, []);

    const renderPlayer = () => {
        if (!featuredVideo) return null;
        const rawUrl = featuredVideo.video_url || featuredVideo.videoUrl || "";
        const videoType = getVideoType(rawUrl);
        const youtubeId = getYoutubeId(rawUrl);

        if (videoType === "youtube" && youtubeId) {
            return (
                <iframe
                    src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1`}
                    title={featuredVideo.title}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                />
            );
        }
        if (videoType === "hls") return <HlsPlayer src={rawUrl} title={featuredVideo.title} />;

        return <video src={rawUrl} controls autoPlay className="w-full h-full object-contain bg-black" title={featuredVideo.title} />;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex flex-col">
                <Header />
                <div className="flex-1 flex flex-col items-center justify-center">
                    <LoadingSpinner fullScreen />
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="container py-8">
                <button
                    onClick={() => navigate("/")}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Voltar para a página inicial
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Player Area */}
                    <div className="lg:col-span-2">
                        <h1 className="text-2xl font-heading font-black text-foreground mb-6 uppercase tracking-tight">
                            Noticiário em Vídeo
                        </h1>

                        <div className="relative bg-black aspect-video shadow-2xl overflow-hidden group">
                            {playing && featuredVideo ? (
                                renderPlayer()
                            ) : featuredVideo ? (
                                <div onClick={() => setPlaying(true)} className="relative w-full h-full cursor-pointer">
                                    <img
                                        src={featuredVideo.thumbnail_url || featuredVideo.thumbnail || "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1200&q=80"}
                                        alt={featuredVideo.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-20 h-20 bg-primary/90 text-white flex items-center justify-center rounded-full group-hover:scale-110 transition-transform shadow-xl">
                                            <Play className="w-8 h-8 fill-white ml-1" />
                                        </div>
                                    </div>
                                </div>
                            ) : null}
                        </div>

                        {featuredVideo && (
                            <div className="mt-6">
                                <span className="news-category-badge mb-3 inline-block">{featuredVideo.category}</span>
                                <h2 className="text-xl sm:text-2xl font-heading font-bold text-foreground leading-tight">
                                    {featuredVideo.title}
                                </h2>
                                <p className="text-muted-foreground mt-4 text-base leading-relaxed">
                                    {featuredVideo.description}
                                </p>
                                <div className="flex items-center gap-6 mt-4 text-xs text-muted-foreground border-t border-border pt-4">
                                    <span className="flex items-center gap-1.5 font-medium uppercase tracking-wider text-primary">
                                        <Clock className="w-3.5 h-3.5" />
                                        {featuredVideo.duration}
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <Eye className="w-3.5 h-3.5" />
                                        {featuredVideo.views} visualizações
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar / Grid */}
                    <aside className="lg:border-l border-border lg:pl-8">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4 pb-2 border-b border-border">
                            Todos os Vídeos ({videos.length})
                        </h3>
                        <div className="space-y-4 max-h-[800px] overflow-y-auto pr-2 custom-scrollbar">
                            {videos.map((video) => (
                                <button
                                    key={video.id}
                                    onClick={() => {
                                        setFeaturedVideo(video);
                                        setPlaying(true);
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }}
                                    className={`flex gap-3 text-left group p-2 rounded-lg transition-all ${featuredVideo?.id === video.id ? "bg-primary/5 ring-1 ring-primary/20" : "hover:bg-secondary"
                                        }`}
                                >
                                    <div className="relative w-32 h-20 flex-shrink-0 overflow-hidden rounded">
                                        <img
                                            src={video.thumbnail_url || video.thumbnail}
                                            alt={video.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors flex items-center justify-center">
                                            <Play className="w-4 h-4 text-white fill-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col justify-center min-w-0">
                                        <span className="text-[10px] font-bold uppercase tracking-tighter text-primary truncate">
                                            {video.category}
                                        </span>
                                        <h4 className="text-sm font-semibold text-foreground line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                                            {video.title}
                                        </h4>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </aside>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default VideosPage;
