import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { withTimeout, getYoutubeId } from "@/lib/utils";
import { Play, Clock, Eye, ArrowLeft, Loader2, Volume2, VolumeX, RefreshCw, WifiOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Hls from "hls.js";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

/** Detecta o tipo de URL do vídeo */
const getVideoType = (url: string): "youtube" | "hls" | "direct" | "iframe" | "unknown" => {
    if (!url) return "unknown";
    if (getYoutubeId(url)) return "youtube";
    if (url.includes(".m3u8")) return "hls";
    // Domínios de streaming conhecidos (fMP4 ao vivo via HTTP)
    if (
        url.match(/\.(mp4|webm|ogg)(\?|$)/i) ||
        url.includes('restream.io') ||
        url.includes('bozztv.com') ||
        url.includes('akamaized.net') ||
        url.includes('cdn.livestream')
    ) return "direct";
    // URLs de embed externo (páginas web com player integrado)
    if (url.match(/\.(php|html|asp)(\?|$)/i) || url.includes('/embed/') || url.includes('/player/') || url.includes('/securelive/') || url.includes('/live/player')) return "iframe";
    return "unknown";
};

/** Componente robusto para reproduzir HLS com estados visuais */
const HlsPlayer = ({ src, title, muted = false, onError }: { src: string; title: string; muted?: boolean; onError?: () => void }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const hlsRef = useRef<Hls | null>(null);
    const [isMuted, setIsMuted] = useState(muted);
    const [streamStatus, setStreamStatus] = useState<'loading' | 'playing' | 'error'>('loading');
    const [retryKey, setRetryKey] = useState(0);

    // Sincronizar muted com o elemento vídeo
    useEffect(() => {
        const video = videoRef.current;
        if (video) {
            video.muted = isMuted;
        }
    }, [isMuted]);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        setStreamStatus('loading');
        let retryCount = 0;
        const MAX_RETRIES = 5;
        const RETRY_DELAY = 3000;

        const initHls = () => {
            if (hlsRef.current) {
                hlsRef.current.destroy();
                hlsRef.current = null;
            }

            if (Hls.isSupported()) {
                const hls = new Hls({
                    enableWorker: true,
                    lowLatencyMode: true,
                    backBufferLength: 90,
                    liveSyncDurationCount: 3,
                    liveMaxLatencyDurationCount: 10,
                    manifestLoadingTimeOut: 15000,
                    manifestLoadingMaxRetry: 6,
                    levelLoadingTimeOut: 15000,
                    fragLoadingTimeOut: 20000,
                });
                hlsRef.current = hls;

                hls.loadSource(src);
                hls.attachMedia(video);

                hls.on(Hls.Events.MANIFEST_PARSED, () => {
                    retryCount = 0;
                    setStreamStatus('playing');
                    video.play().catch(() => { });
                });

                hls.on(Hls.Events.ERROR, (_event, data) => {
                    console.warn('[HLS VideosPage] Erro:', data.type, data.details);
                    if (data.fatal) {
                        switch (data.type) {
                            case Hls.ErrorTypes.NETWORK_ERROR:
                                if (retryCount < MAX_RETRIES) {
                                    retryCount++;
                                    console.log(`[HLS VideosPage] Tentativa de recuperação ${retryCount}/${MAX_RETRIES}...`);
                                    setTimeout(() => {
                                        hls.loadSource(src);
                                        hls.startLoad();
                                    }, RETRY_DELAY * retryCount);
                                } else {
                                    console.error('[HLS VideosPage] Falha após todas as tentativas de recuperação');
                                    setStreamStatus('error');
                                    onError?.();
                                }
                                break;
                            case Hls.ErrorTypes.MEDIA_ERROR:
                                console.log('[HLS VideosPage] Tentando recuperar erro de media...');
                                hls.recoverMediaError();
                                break;
                            default:
                                console.error('[HLS VideosPage] Erro fatal irrecuperável');
                                hls.destroy();
                                setStreamStatus('error');
                                onError?.();
                                break;
                        }
                    }
                });

                return () => {
                    hls.destroy();
                    hlsRef.current = null;
                };
            } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = src;
                video.addEventListener("loadedmetadata", () => {
                    setStreamStatus('playing');
                    video.play().catch(() => { });
                });
                video.addEventListener("error", () => {
                    setStreamStatus('error');
                    onError?.();
                });
            }
        };

        const cleanup = initHls();
        return () => {
            cleanup?.();
            if (hlsRef.current) {
                hlsRef.current.destroy();
                hlsRef.current = null;
            }
        };
    }, [src, retryKey]);

    const handleRetry = () => {
        setStreamStatus('loading');
        setRetryKey(k => k + 1);
    };

    return (
        <div className="relative w-full h-full bg-black">
            <video
                ref={videoRef}
                controls={streamStatus === 'playing'}
                muted={isMuted}
                autoPlay
                playsInline
                className={`w-full h-full object-contain bg-black ${streamStatus !== 'playing' ? 'hidden' : ''}`}
                title={title}
            />
            {streamStatus === 'playing' && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsMuted(!isMuted);
                    }}
                    className="absolute bottom-14 right-4 z-30 bg-black/80 hover:bg-primary text-white p-2.5 rounded-full backdrop-blur-md border border-white/20 transition-all transform hover:scale-110 shadow-xl flex items-center justify-center cursor-pointer"
                    title={isMuted ? "Activar som" : "Desactivar som"}
                >
                    {isMuted ? (
                        <VolumeX className="w-4 h-4 text-white" />
                    ) : (
                        <Volume2 className="w-4 h-4 text-white" />
                    )}
                </button>
            )}
            {streamStatus === 'loading' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 text-white gap-3">
                    <div className="w-8 h-8 border-2 border-white/30 border-t-primary rounded-full animate-spin" />
                    <span className="text-xs text-white/60 uppercase tracking-wider">A ligar ao stream...</span>
                </div>
            )}
            {streamStatus === 'error' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 text-white gap-4">
                    <WifiOff className="w-10 h-10 text-red-400" />
                    <div className="text-center">
                        <p className="text-sm font-semibold text-white/90">Transmissão indisponível</p>
                        <p className="text-xs text-white/50 mt-1">O stream não está acessível de momento</p>
                    </div>
                    <button
                        onClick={handleRetry}
                        className="flex items-center gap-2 bg-primary hover:bg-primary/80 text-white text-xs font-semibold px-4 py-2 rounded-full transition-all hover:scale-105"
                    >
                        <RefreshCw className="w-3.5 h-3.5" />
                        Tentar novamente
                    </button>
                </div>
            )}
        </div>
    );
};

const VideosPage = () => {
    const [videos, setVideos] = useState<any[]>([]);
    const [featuredVideo, setFeaturedVideo] = useState<any>(null);
    const [playing, setPlaying] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const handlePlay = async (video: any = null) => {
        const targetVideo = video || featuredVideo;
        if (!targetVideo) return;

        setPlaying(true);
        if (video) setFeaturedVideo(video);

        // Incrementar visualizações na base de dados
        try {
            const { error } = await (supabase.rpc as any)('increment_video_views', { video_id: targetVideo.id });
            if (error) throw error;

            // Actualizar estado local
            setVideos(prev => prev.map(v =>
                v.id === targetVideo.id ? { ...v, views: String(Number(v.views || 0) + 1) } : v
            ));
            if (featuredVideo?.id === targetVideo.id) {
                setFeaturedVideo((prev: any) => ({ ...prev, views: String(Number(prev.views || 0) + 1) }));
            }
        } catch (err) {
            console.error("Erro ao incrementar visualizações:", err);
        }
    };

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
        if (videoType === "hls") return <HlsPlayer src={rawUrl} title={featuredVideo.title} onError={() => console.error('[VideosPage] HLS stream falhou:', rawUrl)} />;

        // Iframe embed externo (ex: ssh101.com/securelive)
        if (videoType === "iframe") {
            return (
                <iframe
                    src={rawUrl}
                    title={featuredVideo.title}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                    allowFullScreen
                    scrolling="no"
                />
            );
        }

        // Vídeo directo (mp4, webm, fMP4 de streaming CDN)
        if (videoType === "direct") {
            return (
                <div className="w-full h-full bg-black flex items-center justify-center relative">
                    <video
                        src={rawUrl}
                        controls
                        autoPlay
                        playsInline
                        crossOrigin="anonymous"
                        className="w-full h-full object-contain bg-black"
                        title={featuredVideo.title}
                        onError={(e) => console.error('[VideosPage] Erro ao reproduzir vídeo directo:', rawUrl, e)}
                    />
                </div>
            );
        }

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
                                <div onClick={() => handlePlay()} className="relative w-full h-full cursor-pointer">
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
                                        handlePlay(video);
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
