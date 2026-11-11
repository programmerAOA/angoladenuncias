import { useState, useEffect, useRef } from "react";
import { Play, Clock, Eye, Volume2, VolumeX, RefreshCw, WifiOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getYoutubeId } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import Hls from "hls.js";
import AdSquare from "./AdSquare";
import ReactPlayer from "react-player";

const ReactPlayerComponent = ReactPlayer as any;

export interface VideoItem {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  views: string;
  category: string;
  videoUrl?: string;
  video_url?: string;
}

interface VideoSectionProps {
  videos?: any[];
}

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

/** Componente interno para reproduzir HLS com estados visuais */
const HlsPlayer = ({ src, title, muted = true, onError }: { src: string; title: string; muted?: boolean; onError?: () => void }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [streamStatus, setStreamStatus] = useState<'loading' | 'playing' | 'error'>('loading');
  const [retryKey, setRetryKey] = useState(0);

  // Sincronizar muted com o elemento vídeo
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = muted;
    }
  }, [muted]);

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
          console.warn('[HLS] Erro:', data.type, data.details);
          if (data.fatal) {
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                if (retryCount < MAX_RETRIES) {
                  retryCount++;
                  console.log(`[HLS] Tentativa de recuperação ${retryCount}/${MAX_RETRIES}...`);
                  setTimeout(() => {
                    hls.loadSource(src);
                    hls.startLoad();
                  }, RETRY_DELAY * retryCount);
                } else {
                  console.error('[HLS] Falha após todas as tentativas de recuperação');
                  setStreamStatus('error');
                  onError?.();
                }
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                console.log('[HLS] Tentando recuperar erro de media...');
                hls.recoverMediaError();
                break;
              default:
                console.error('[HLS] Erro fatal irrecuperável');
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
        muted={muted}
        autoPlay
        playsInline
        className={`w-full h-full object-contain bg-black ${streamStatus !== 'playing' ? 'hidden' : ''}`}
        title={title}
      />
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

const VideoSection = ({ videos = [] }: VideoSectionProps) => {
  const [featuredVideo, setFeaturedVideo] = useState<any>(null);
  const [playing, setPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [directStatus, setDirectStatus] = useState<'loading'|'playing'|'error'>('loading');
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const navigate = useNavigate();

  const rawUrl = featuredVideo?.video_url || featuredVideo?.videoUrl || "";
  const videoType = getVideoType(rawUrl);
  const isLive = rawUrl.includes('/live/') || rawUrl.includes('youtube.com/live/') || featuredVideo?.category?.toLowerCase() === 'directo' || (videoType === 'hls' && featuredVideo?.category?.toLowerCase() !== 'vídeo') || videoType === 'iframe' || videoType === 'direct';

  // Reset status when a new direct stream URL is loaded
  useEffect(() => {
    if (videoType === 'direct') {
      setDirectStatus('loading');
    }
  }, [rawUrl, videoType]);

  const handlePlay = async () => {
    if (!featuredVideo) return;

    setPlaying(true);

    // Incrementar visualizações na base de dados
    try {
      const { error } = await (supabase.rpc as any)('increment_video_views', { video_id: featuredVideo.id });
      if (error) throw error;

      // Actualizar estado local para reflectir o incremento imediato
      setFeaturedVideo((prev: any) => ({
        ...prev,
        views: String(Number(prev.views || 0) + 1)
      }));
    } catch (err) {
      console.error("Erro ao incrementar visualizações:", err);
    }
  };

  // Sincronizar vídeo em destaque quando a lista de vídeos mudar
  useEffect(() => {
    if (videos.length > 0 && !featuredVideo) {
      setFeaturedVideo(videos[0]);
    }
  }, [videos, featuredVideo]);

  // Autoplay para directos (live streams)
  useEffect(() => {
    if (featuredVideo) {
      setPlaying(true);
    }
  }, [featuredVideo?.id, isLive]);

  if (videos.length === 0 || !featuredVideo) return null;

  // Extrair ID do vídeo se for YouTube
  const youtubeId = getYoutubeId(rawUrl);
  // videoType já calculado acima

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newMuteState = !isMuted;
    setIsMuted(newMuteState);

    if (iframeRef.current && iframeRef.current.contentWindow) {
      const command = newMuteState ? "mute" : "unMute";
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({ event: "command", func: command, args: [] }),
        "*"
      );
    }
  };

  /** Renderiza o player correto com base no tipo de URL */
  const renderPlayer = () => {
    if (isLive) {
      if (youtubeId) {
        return (
          <div className="w-full h-full bg-black flex items-center justify-center relative overflow-hidden group/live">
            <iframe
              ref={iframeRef}
              src={`https://www.youtube.com/embed/${youtubeId}?enablejsapi=1&autoplay=1&mute=1&controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&disablekb=1&fs=0&cc_load_policy=0&cc_lang_pref=off&playsinline=1`}
              title={featuredVideo.title}
              className="w-[125%] h-[128%] -mt-[7%] -mb-[12%] -ml-[12.5%] border-0 pointer-events-none object-cover scale-110"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
            {/* Botão Flutuante Customizado de Volume */}
            <button
              onClick={toggleMute}
              className="absolute bottom-4 right-4 z-30 bg-black/80 hover:bg-primary text-white p-3 rounded-full backdrop-blur-md border border-white/20 transition-all transform hover:scale-110 shadow-xl flex items-center justify-center cursor-pointer pointer-events-auto"
              title={isMuted ? "Activar som" : "Desactivar som"}
            >
              {isMuted ? (
                <VolumeX className="w-5 h-5 text-white" />
              ) : (
                <Volume2 className="w-5 h-5 text-white" />
              )}
            </button>
          </div>
        );
      }

      if (videoType === "hls") {
        return (
          <div className="w-full h-full relative group/live">
            <HlsPlayer
              src={rawUrl}
              title={featuredVideo.title}
              muted={isMuted}
              onError={() => console.error('[VideoSection] HLS stream falhou:', rawUrl)}
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsMuted(!isMuted);
              }}
              className="absolute bottom-4 right-4 z-30 bg-black/80 hover:bg-primary text-white p-3 rounded-full backdrop-blur-md border border-white/20 transition-all transform hover:scale-110 shadow-xl flex items-center justify-center cursor-pointer pointer-events-auto"
              title={isMuted ? "Activar som" : "Desactivar som"}
            >
              {isMuted ? (
                <VolumeX className="w-5 h-5 text-white" />
              ) : (
                <Volume2 className="w-5 h-5 text-white" />
              )}
            </button>
          </div>
        );
      }

      // Vídeo directo ao vivo (fMP4, mp4 de CDN como restream.io)
      if ((videoType as string) === 'direct') {
        return (
          <div className="w-full h-full bg-black flex items-center justify-center relative group/live">
            <ReactPlayerComponent
              url={rawUrl}
              playing={true}
              controls={true}
              muted={isMuted}
              width="100%"
              height="100%"
              style={{ position: 'absolute', top: 0, left: 0 }}
              config={{
                file: {
                  attributes: { crossOrigin: 'anonymous', playsInline: true },
                  forceVideo: true,
                }
              }}
              onReady={() => setDirectStatus('playing')}
              onError={(e: any) => {
                console.error('[VideoSection] Erro no stream directo:', rawUrl, e);
                setDirectStatus('error');
              }}
            />
            {directStatus === 'loading' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 text-white gap-3 z-20">
                <div className="w-8 h-8 border-2 border-white/30 border-t-primary rounded-full animate-spin" />
                <span className="text-xs text-white/60 uppercase tracking-wider">A ligar ao stream...</span>
              </div>
            )}
            {directStatus === 'error' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 text-white gap-4 z-20">
                <WifiOff className="w-10 h-10 text-red-400" />
                <div className="text-center">
                  <p className="text-sm font-semibold text-white/90">Transmissão indisponível</p>
                  <p className="text-xs text-white/50 mt-1">O stream não está acessível de momento</p>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); setDirectStatus('loading'); }}
                  className="flex items-center gap-2 bg-primary hover:bg-primary/80 text-white text-xs font-semibold px-4 py-2 rounded-full transition-all hover:scale-105 pointer-events-auto"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Tentar novamente
                </button>
              </div>
            )}
            <button
              onClick={(e) => { e.stopPropagation(); setIsMuted(!isMuted); }}
              className="absolute bottom-4 right-4 z-30 bg-black/80 hover:bg-primary text-white p-3 rounded-full backdrop-blur-md border border-white/20 transition-all transform hover:scale-110 shadow-xl flex items-center justify-center cursor-pointer pointer-events-auto"
              title={isMuted ? 'Activar som' : 'Desactivar som'}
            >
              {isMuted ? <VolumeX className="w-5 h-5 text-white" /> : <Volume2 className="w-5 h-5 text-white" />}
            </button>
          </div>
        );
      }

      // Iframe embed externo (ex: ssh101.com/securelive)
      if ((videoType as string) === "iframe") {
        return (
          <div className="w-full h-full bg-black flex items-center justify-center relative group/live">
            <iframe
              src={rawUrl}
              title={featuredVideo.title}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
              allowFullScreen
              scrolling="no"
            />
          </div>
        );
      }

      return (
        <div className="w-full h-full bg-black flex items-center justify-center relative group/live">
          <ReactPlayerComponent
            url={rawUrl}
            playing={true}
            controls={false}
            muted={isMuted}
            width="100%"
            height="100%"
            style={{ position: 'absolute', top: 0, left: 0 }}
            onError={() => {
              console.error("Falha ao carregar vídeo:", rawUrl);
            }}
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsMuted(!isMuted);
            }}
            className="absolute bottom-4 right-4 z-30 bg-black/80 hover:bg-primary text-white p-3 rounded-full backdrop-blur-md border border-white/20 transition-all transform hover:scale-110 shadow-xl flex items-center justify-center cursor-pointer pointer-events-auto"
            title={isMuted ? "Activar som" : "Desactivar som"}
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5 text-white" />
            ) : (
              <Volume2 className="w-5 h-5 text-white" />
            )}
          </button>
        </div>
      );
    }

    // 1. Se for YouTube, usamos o Iframe oficial (mais compatível com lives)
    if (youtubeId) {
      return (
        <div className="w-full h-full bg-black flex items-center justify-center relative">
          <iframe
            src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=0&rel=0&modestbranding=1`}
            title={featuredVideo.title}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      );
    }

    // 2. Se for HLS (m3u8), usamos o componente customizado com hls.js
    if (videoType === "hls") {
      return <HlsPlayer src={rawUrl} title={featuredVideo.title} muted={false} />;
    }

    // 3. Se for iframe embed externo
    if ((videoType as string) === "iframe") {
      return (
        <div className="w-full h-full bg-black flex items-center justify-center relative">
          <iframe
            src={rawUrl}
            title={featuredVideo.title}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowFullScreen
            scrolling="no"
          />
        </div>
      );
    }

    // 4. Vídeo directo (mp4, webm, fMP4 de streaming CDN como restream.io)
    if ((videoType as string) === "direct") {
      return (
        <div className="w-full h-full bg-black flex items-center justify-center relative">
          <ReactPlayerComponent
            url={rawUrl}
            playing={true}
            controls={true}
            muted={false}
            width="100%"
            height="100%"
            style={{ position: 'absolute', top: 0, left: 0 }}
            config={{
              file: {
                attributes: {
                  crossOrigin: 'anonymous',
                  playsInline: true,
                },
                forceVideo: true,
              }
            }}
            onError={(e: any) => {
              console.error("[VideoSection] Falha ao carregar vídeo directo:", rawUrl, e);
            }}
          />
        </div>
      );
    }

    // 5. Para outros formatos suportados, usamos ReactPlayer
    return (
      <div className="w-full h-full bg-black flex items-center justify-center relative">
        <ReactPlayerComponent
          url={rawUrl}
          playing={true}
          controls={true}
          muted={false}
          width="100%"
          height="100%"
          style={{ position: 'absolute', top: 0, left: 0 }}
          onError={() => {
            console.error("Falha ao carregar vídeo:", rawUrl);
          }}
        />
      </div>
    );
  };

  return (
    <section id="video-section" className="bg-secondary border-y border-border py-10">
      <div className="container">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <Play className="w-4 h-4 text-primary fill-primary" />
          </div>
          <h2 className="text-xl font-heading font-bold text-foreground">Noticiário em Vídeo Sem Filtros</h2>
          <div className="flex-1 h-px bg-border" />
          <button
            onClick={() => navigate("/videos")}
            className="text-xs font-semibold uppercase tracking-wider text-primary hover:opacity-80 transition-opacity"
          >
            Ver todos
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Featured player */}
          <div className="lg:col-span-2">
            <div className="relative bg-background overflow-hidden group cursor-pointer aspect-video shadow-2xl">
              {playing ? (
                renderPlayer()
              ) : (
                <div onClick={handlePlay} className="relative w-full h-full">
                  <img
                    src={featuredVideo.thumbnail_url || featuredVideo.thumbnail}
                    alt={featuredVideo.title}
                    width={800}
                    height={450}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />

                  {/* Play button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-primary/90 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Play className="w-7 h-7 text-primary-foreground fill-primary-foreground ml-1" />
                    </div>
                  </div>
                </div>
              )}

              {/* Category badge */}
              <div className="absolute top-4 left-4">
                <span className="news-category-badge text-[10px]">{featuredVideo.category}</span>
              </div>

              {/* Info overlay */}
              {!playing && (
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="news-headline text-base sm:text-lg text-foreground line-clamp-2 mb-2">
                    {featuredVideo.title}
                  </h3>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {featuredVideo.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {featuredVideo.views} visualizações
                    </span>
                  </div>
                </div>
              )}
            </div>

            <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
              {featuredVideo.description}
            </p>

            {/* NEW: 2x2 Grid of additional videos below featured */}
            {videos.slice(1, 5).length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                {videos.slice(1, 5).map((video) => (
                  <div
                    key={video.id}
                    onClick={() => {
                      setFeaturedVideo(video);
                      setPlaying(true);
                      window.scrollTo({ top: document.getElementById('video-section')?.offsetTop || 0, behavior: 'smooth' });
                    }}
                    className="group cursor-pointer bg-background/30 p-2 rounded-sm border border-transparent hover:border-primary/20 hover:bg-background/60 transition-all"
                  >
                    <div className="relative aspect-video overflow-hidden mb-2">
                      <img
                        src={video.thumbnail_url || video.thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Play className="w-6 h-6 text-white fill-white" />
                      </div>
                      <span className="absolute bottom-1 right-1 text-[9px] font-mono bg-black/80 text-white px-1">
                        {video.duration}
                      </span>
                    </div>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-primary mb-1 block">
                      {video.category}
                    </span>
                    <h5 className="text-xs font-semibold text-foreground line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                      {video.title}
                    </h5>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Video list */}
          <div className="flex flex-col gap-0">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3 pb-2 border-b border-border">
              Mais vídeos
            </h4>

            {videos.slice(5, 13).map((video) => (
              <button
                key={video.id}
                onClick={() => {
                  setFeaturedVideo(video);
                  setPlaying(true);
                  window.scrollTo({ top: document.getElementById('video-section')?.offsetTop || 0, behavior: 'smooth' });
                }}
                className={`flex gap-3 py-3 border-b border-border last:border-0 text-left group transition-colors hover:bg-background/50 -mx-2 px-2 ${featuredVideo.id === video.id ? "opacity-60" : ""
                  }`}
              >
                {/* Thumbnail */}
                <div className="relative flex-shrink-0 w-28 h-16 overflow-hidden">
                  <img
                    src={video.thumbnail_url || video.thumbnail}
                    alt={video.title}
                    width={200}
                    height={112}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-background/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play className="w-4 h-4 text-primary-foreground fill-primary-foreground" />
                  </div>
                  <span className="absolute bottom-1 right-1 text-[10px] font-mono bg-background/80 text-foreground px-1">
                    {video.duration}
                  </span>
                </div>

                {/* Info */}
                <div className="flex flex-col justify-center min-w-0">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-primary mb-1">
                    {video.category}
                  </span>
                  <h4 className="text-sm font-heading font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors leading-snug">
                    {video.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-muted-foreground">
                    <Eye className="w-3 h-3" />
                    <span>{video.views}</span>
                  </div>
                </div>
              </button>
            ))}

            {/* Ad Space moved to the bottom */}
            <div className="pt-6">
              <AdSquare slot="video_section_sidebar" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoSection;
