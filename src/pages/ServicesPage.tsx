import { useState, useEffect } from "react";
import React from "react";
import { supabase } from "@/integrations/supabase/client";

const ServicesPage = () => {
  const [views, setViews] = useState(12500);

  useEffect(() => {
    const fetchViews = async () => {
      let realViewsCount = 0;
      try {
        // 1. Visitas globais (site_visits)
        const { count } = await supabase.from('site_visits').select('*', { count: 'exact', head: true });
        if (count) realViewsCount += count;

        // 2. Visualizações de Vídeos
        const { data: videos } = await supabase.from('video_news').select('views');
        if (videos) {
          realViewsCount += videos.reduce((acc, curr) => acc + (curr.views || 0), 0);
        }

        // 3. Visualizações de Notícias
        const { data: news } = await supabase.from('news_articles').select('views');
        if (news) {
          realViewsCount += news.reduce((acc, curr) => acc + (curr.views || 0), 0);
        }

      } catch (err) {
        console.error("Erro ao buscar visualizações reais:", err);
      }
      let storedViews = localStorage.getItem('simulated_base_views');
      let baseViews = storedViews ? parseInt(storedViews) : 12500;

      // Apenas adicionar o salto randômico inicial uma vez por sessão simulada
      if (!storedViews) {
        baseViews = baseViews + Math.floor(Math.random() * 50);
        localStorage.setItem('simulated_base_views', baseViews.toString());
      }

      const totalViews = baseViews + realViewsCount;
      setViews(totalViews);
    };

    fetchViews();

    // Carregar API do YouTube
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    return () => {
      // Limpeza opcional se necessário
    };
  }, []);

  useEffect(() => {
    // Incremento automático de +3 por minuto
    const interval = setInterval(() => {
      setViews(prev => prev + 3);

      // Atualizar apenas a base simulada no localStorage
      const currentStored = parseInt(localStorage.getItem('simulated_base_views') || '12500');
      localStorage.setItem('simulated_base_views', (currentStored + 3).toString());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#f5f5f5] font-sans selection:bg-primary/30">
      <style dangerouslySetInnerHTML={{
        __html: `
        .services-header {
          background: linear-gradient(90deg, #000, #c00);
          color: #fff;
          padding: 60px 40px;
          text-align: center;
        }

        .services-header h1 {
          margin: 0;
          font-size: clamp(2rem, 5vw, 3rem);
          font-weight: 900;
          letter-spacing: -0.05em;
          text-transform: uppercase;
        }

        .services-btn {
          display: inline-block;
          margin-top: 30px;
          padding: 14px 32px;
          background: #00a651;
          color: #fff;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(0, 166, 81, 0.4);
        }

        .services-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 166, 81, 0.6);
          background: #008f45;
        }

        .services-section {
          padding: 60px 20px;
          max-width: 1200px;
          margin: auto;
        }

        .services-h2 {
          text-align: center;
          margin-bottom: 40px;
          font-size: 2.5rem;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: -0.02em;
          color: #1a1a1a;
        }

        .services-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 25px;
          justify-content: center;
        }

        .services-card {
          background: #fff;
          padding: 30px;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.05);
          text-align: center;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(0,0,0,0.03);
          flex: 1 1 300px;
          max-width: 360px;
        }

        .services-card:hover {
          transform: translateY(-12px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.12);
          border-color: rgba(204, 0, 0, 0.1);
        }

        .services-card h3 {
          margin-bottom: 12px;
          font-weight: 800;
          font-size: 1.25rem;
        }

        .services-card .details {
          opacity: 0;
          font-size: 14px;
          margin-top: 15px;
          color: #666;
          transition: all 0.3s ease;
          line-height: 1.5;
        }

        .services-card:hover .details {
          opacity: 1;
        }

        .services-price {
          font-size: 24px;
          color: #cc0000;
          font-weight: 800;
        }

        .services-live {
          background: #0a0a0a;
          color: #fff;
          text-align: center;
          padding: 80px 20px;
          border-radius: 40px;
          margin: 40px 20px;
          position: relative;
          overflow: hidden;
        }
        
        .services-live::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at center, rgba(204, 0, 0, 0.1) 0%, transparent 70%);
          pointer-events: none;
        }

        .services-live h2 {
          color: #ff0000;
          font-size: 2.5rem;
          margin-bottom: 10px;
        }

        .services-youtube-container {
          position: relative;
          max-width: 900px;
          margin: 40px auto 0;
          background: #000;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 30px 60px rgba(0,0,0,0.5);
          border: 1px solid rgba(255,255,255,0.1);
        }

        .services-youtube-container iframe {
          width: 100%;
          aspect-ratio: 16/9;
          border: none;
        }

        .services-whatsapp-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 70px;
          height: 70px;
          background: #25D366;
          border-radius: 50%;
          font-size: 32px;
          color: white;
          text-decoration: none;
          box-shadow: 0 10px 25px rgba(37, 211, 102, 0.4);
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .services-whatsapp-icon:hover {
          transform: scale(1.15) rotate(10deg);
          box-shadow: 0 15px 30px rgba(37, 211, 102, 0.6);
        }

        .services-contacts-grid {
          display: flex;
          justify-content: center;
          gap: 60px;
          flex-wrap: wrap;
          margin-top: 40px;
          padding-bottom: 80px;
        }

        .services-contact-item {
          text-align: center;
        }

        .services-contact-item a {
          color: #00a651;
          text-decoration: none;
          font-weight: 800;
          font-size: 1.1rem;
        }

        .services-footer {
          background: #000;
          color: #fff;
          text-align: center;
          padding: 60px 20px;
        }

        @media (max-width: 768px) {
          .services-header h1 {
            font-size: 2rem;
          }
          
          .services-section {
            padding: 40px 20px;
          }
          
          .services-h2 {
            font-size: 1.8rem;
          }
        }
      `}} />

      <header className="services-header">
        <a href="/">
          <img src="/logo.png" alt="Logo Sem Filtros" className="mx-auto mb-6 h-20 md:h-28 object-contain" />
        </a>
        <h1>ANGOLA SEM FILTROS</h1>
        <p className="text-white/80 text-lg md:text-xl font-medium max-w-2xl mx-auto mt-2">
          Portal de Notícias, Publicidade e Transmissão em Directo
        </p>
        <div className="flex justify-center gap-4 mt-8">
          <a href="#contacto" className="services-btn !mt-0">ANUNCIAR AGORA</a>
          <a href="/" className="services-btn !mt-0 !bg-white !text-black hover:!bg-gray-100 flex items-center gap-2">
            PÁGINA PRINCIPAL
          </a>
        </div>
      </header>

      <section className="services-section">
        <h2 className="services-h2">Publicidade no Portal</h2>
        <div className="services-grid">
          <div className="services-card">
            <h3>Banner Topo (1350x300)</h3>
            <p className="services-price">150.000 KZ / Mês</p>
            <div className="details">Exibição na parte superior do site com máxima visibilidade. Ideal para campanhas principais.</div>
          </div>
          <div className="services-card">
            <h3>Banner Final (1350x300)</h3>
            <p className="services-price">100.000 KZ / Mês</p>
            <div className="details">Exibição no final das páginas, reforçando a mensagem ao utilizador.</div>
          </div>
          <div className="services-card">
            <h3>Banner Lateral (300x300)</h3>
            <p className="services-price">85.000 KZ / Mês</p>
            <div className="details">Banner fixo nas laterais do site com visualização contínua.</div>
          </div>
          <div className="services-card">
            <h3>Carrossel Lateral (300x300)</h3>
            <p className="services-price">120.000 KZ / Mês</p>
            <div className="details">Rotação automática de anúncios com maior dinamismo e visibilidade.</div>
          </div>
          <div className="services-card">
            <h3>Vídeo Vertical (30s)</h3>
            <p className="services-price">200.000 KZ / Mês</p>
            <div className="details">Vídeo publicitário até 60 segundos exibido em formato moderno tiktok + divulgação no canal @vemsabertv.</div>
          </div>
        </div>
      </section>

      <section className="services-section">
        <h2 className="services-h2">Cobertura de Eventos</h2>
        <div className="services-grid">
          <div className="services-card">
            <h3>Fotografia + Publicação</h3>
            <p className="services-price">380.000 KZ</p>
            <div className="details">Cobertura até 2 horas com entrega de 20 fotografias editadas + publicação no portal com 10 fotografias.</div>
          </div>
          <div className="services-card">
            <h3>Vídeo/Entrevista</h3>
            <p className="services-price">370.000 KZ</p>
            <div className="details">Cobertura até 1 hora com gravação de vídeo ou entrevistas + edição de até 10 minutos e publicação.</div>
          </div>
          <div className="services-card">
            <h3>Completo (Foto + Vídeo)</h3>
            <p className="services-price">750.000 KZ</p>
            <div className="details">Cobertura total até 2 horas com fotos + vídeo + publicação completa no portal.</div>
          </div>
        </div>
      </section>

      <section className="services-live">
        <h2 className="font-heading">🔴 Transmissão ao Vivo</h2>
        <p className="text-white/60 mb-8">Transmita o seu evento directamente no nosso portal</p>
        <div className="services-grid">
          <div className="services-card !bg-white/5 !text-white !border-white/10 hover:!bg-white/10">
            <h3>Live até 1 hora</h3>
            <p className="services-price">280.000 KZ</p>
            <div className="details !text-white/70">Transmissão ao vivo até 1h com integração OBS/YouTube no portal.</div>
          </div>
          <div className="services-card !bg-white/5 !text-white !border-white/10 hover:!bg-white/10">
            <h3>Live com menos de 30min + Destaque</h3>
            <p className="services-price">200.000 KZ</p>
            <div className="details !text-white/70">Live até 30min com destaque na homepage durante a transmissão.</div>
          </div>
          <div className="services-card !bg-white/5 !text-white !border-white/10 hover:!bg-white/10">
            <h3>Pacote Completo</h3>
            <p className="services-price">450.000 KZ</p>
            <div className="details !text-white/70">Live + cobertura foto e vídeo + destaque total no portal.</div>
          </div>
        </div>
      </section>

      <section className="services-section text-center pt-0">
        <h2 className="services-h2">🔴 Assista em Directo</h2>
        <p className="text-muted-foreground mb-8">Transmissão ao vivo integrada no portal</p>
        <div className="services-youtube-container">
          <iframe
            src="https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=1&mute=0&controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&disablekb=1&fs=0&cc_load_policy=0&playsinline=1&widgetid=1"
            title="Live Angola Sem Filtros"
            allow="autoplay; accelerometer; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ pointerEvents: 'none' }}
          ></iframe>
        </div>
      </section>

      <section className="services-section bg-white/50 rounded-3xl mx-4 mb-20 border border-black/5">
        <h2 className="services-h2">📊 Audiência do Portal</h2>
        <div className="flex flex-col items-center">
          <div className="bg-white px-12 py-8 rounded-2xl shadow-xl shadow-black/5 border border-black/5 text-center">
            <h3 className="text-muted-foreground uppercase text-xs font-bold tracking-widest mb-2">Visualizações Totais</h3>
            <p className="text-5xl font-black text-[#cc0000] tabular-nums tracking-tighter" id="views">
              {views.toLocaleString()}
            </p>
            <p className="text-[10px] text-muted-foreground mt-4 font-medium uppercase italic">Atualizado em tempo real</p>
          </div>
        </div>
      </section>

      <section id="contacto" className="services-section text-center">
        <h2 className="services-h2">Contactos</h2>
        <div className="services-contacts-grid">
          <div className="services-contact-item">
            <p className="text-muted-foreground uppercase text-[10px] font-bold tracking-widest mb-2">Email Geral</p>
            <a href="mailto:angolasemfiltros@gmail.com" className="hover:underline transition-all">
              angolasemfiltros@gmail.com
            </a>
          </div>
          <div className="services-contact-item">
            <p className="text-muted-foreground uppercase text-[10px] font-bold tracking-widest mb-6">WhatsApp Business</p>
            <a href="https://wa.me/244952679780?text=Olá! Gostaria de anunciar no Angola Sem Filtros."
              className="services-whatsapp-icon"
              target="_blank"
              rel="noreferrer"
              title="WhatsApp Business">
              📱
            </a>
          </div>
        </div>
      </section>

      <footer className="services-footer">
        <img src="/logo.png" alt="Logo Sem Filtros" className="mx-auto h-16 mb-6 object-contain grayscale brightness-200 opacity-50" />
        <p className="text-white/40 text-sm">© 2026 Sem Filtros - Todos os direitos reservados</p>
        <p className="mt-4"><a href="/" className="text-white/20 hover:text-white/40 text-xs transition-colors">semfiltros.vercel.app</a></p>
      </footer>
    </div>
  );
};

export default ServicesPage;
