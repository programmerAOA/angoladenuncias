import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { Printer, ArrowLeft, Type, ZoomIn, ZoomOut, Megaphone, Plus } from "lucide-react";
import { toast } from "sonner";

/* ─────────────────────────── Types ─────────────────────────── */
interface Article {
  id: string;
  title: string;
  summary: string | null;
  content: string;
  category: string;
  author: string | null;
  image_url: string | null;
  created_at: string;
}

interface Opinion {
  id: string;
  title: string;
  excerpt: string | null;
  content: string;
  author: string;
  avatar_url: string | null;
  created_at: string;
}

interface Ad {
  id: string;
  title: string;
  image_url: string;
  link_url: string | null;
  slot: string;
}

/* ─────────────────────────── Constants ─────────────────────── */
const categoryColors: Record<string, string> = {
  "POLÍTICA":      "#b91c1c",
  "ECONOMIA":      "#1d4ed8",
  "SOCIEDADE":     "#047857",
  "DESPORTO":      "#7c3aed",
  "INTERNACIONAL": "#0891b2",
  "CULTURA":       "#b45309",
  "SAÚDE":         "#059669",
  "TECNOLOGIA":    "#6d28d9",
  "EDUCAÇÃO":      "#0369a1",
  "OPINIÃO":       "#9f1239",
};

const getCategoryColor = (category: string) =>
  categoryColors[category?.toUpperCase()] ?? "#b91c1c";

// Newspaper-specific ad slots (insert these in the admin under "slot" field)
const AD_SLOTS = {
  FULL:    "newspaper_full",    // Whole page ad (A4 full — 180×257mm usable)
  HALF_H:  "newspaper_half_h",  // Half page horizontal (180×120mm)
  BANNER:  "newspaper_banner",  // Banner strip (180×60mm)
  // Also pulls from existing web ad slots as fallback
  BANNER_TOP:    "banner_top",
  BANNER_BOTTOM: "banner_bottom",
  SQUARE:        "square_sidebar",
};

/* ─────────────── Ad placeholder component (print-safe) ─────── */
const AdPlaceholder = ({ label, dims, color = "#b91c1c" }: { label: string; dims: string; color?: string }) => {
  const [imgId] = useState(() => Math.floor(Math.random() * 3) + 1);
  return (
    <div style={{
      position: "relative",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      background: `${color}06`,
      width: "100%", height: "100%", minHeight: "80px", overflow: "hidden"
    }}>
      <img src={`/ads/placeholder_${imgId}.png`} alt="" style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.95 }} />
      <div style={{ position: "absolute", top: 0, right: 0, background: "rgba(0,0,0,0.7)", color: "#fff", fontSize: "7px", padding: "3px 6px", textTransform: "uppercase", letterSpacing: "0.1em", borderBottomLeftRadius: "4px" }}>
        {label} / Publicidade
      </div>
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: `linear-gradient(to top, rgba(0,0,0,0.8), transparent)`, padding: "10px 8px 4px 8px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <span style={{ fontSize: "8.5px", color: "#fff", fontStyle: "italic", fontWeight: 500 }}>
          Dimensão: {dims}
        </span>
        <span style={{ fontSize: "8.5px", color: "#fff", fontWeight: 700 }}>
          publicidade@angolasemfiltros.com
        </span>
      </div>
    </div>
  );
};

/* ─────────────── Ad image component ───────────────────────── */
const AdImage = ({ ad, style }: { ad: Ad; style?: React.CSSProperties }) => {
  const inner = (
    <img
      src={ad.image_url}
      alt={ad.title}
      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", ...style }}
    />
  );
  if (ad.link_url) {
    return (
      <a href={ad.link_url} target="_blank" rel="noopener noreferrer" style={{ display: "block", width: "100%", height: "100%" }}>
        {inner}
      </a>
    );
  }
  return inner;
};

/* ─────────────────────────── Main Component ────────────────── */
const DigitalNewspaperTemplate = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [news, setNews] = useState<Article[]>([]);
  const [opinions, setOpinions] = useState<Opinion[]>([]);
  const [ads, setAds] = useState<Ad[]>([]);
  const [fontScale, setFontScale] = useState<number>(0.9);
  const [editionNo, setEditionNo] = useState<string>("");

  useEffect(() => {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const pastDaysOfYear = (now.getTime() - startOfYear.getTime()) / 86400000;
    const weekNumber = Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7);
    setEditionNo(`Edição Nº ${weekNumber}/${now.getFullYear()}`);

    const loadData = async () => {
      try {
        setLoading(true);

        const [newsRes, opRes, adRes] = await Promise.all([
          supabase
            .from("news_articles")
            .select("id, title, summary, content, category, author, image_url, created_at")
            .eq("published", true)
            .order("created_at", { ascending: false })
            .limit(30),
          supabase
            .from("opinion_articles")
            .select("id, title, excerpt, content, author, avatar_url, created_at")
            .order("created_at", { ascending: false })
            .limit(1),
          supabase
            .from("advertisements")
            .select("id, title, image_url, link_url, slot")
            .eq("active", true)
            .order("display_order", { ascending: true }),
        ]);

        if (newsRes.error) throw newsRes.error;
        if (opRes.error) throw opRes.error;

        setNews(newsRes.data || []);
        setOpinions(opRes.data || []);
        setAds((adRes.data as Ad[]) || []);
      } catch (err: any) {
        console.error("Error loading newspaper content:", err);
        toast.error("Erro ao carregar matérias: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  /* ── Helpers ── */
  const stripHtml = (html: string) => html.replace(/<[^>]*>/g, "");

  // Get ads by slot (round-robin if multiple)
  const adsBySlot = (slot: string): Ad[] => ads.filter(a => a.slot === slot);

  // Get the first ad matching any of the provided slots (fallback chain)
  const getAd = (slots: string[], index = 0): Ad | null => {
    for (const slot of slots) {
      const pool = adsBySlot(slot);
      if (pool.length > 0) return pool[index % pool.length];
    }
    return null;
  };

  const handlePrint = () => window.print();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <LoadingSpinner fullScreen />
        <p className="text-muted-foreground text-sm mt-4">A compor edição digital colorida...</p>
      </div>
    );
  }

  /* ── Layout data ── */
  // Objectivo: Reduzir para um máximo de 12 páginas totais.
  // Página 1: Capa (usa 4 artigos principais)
  const capaArticles = news.slice(0, 4);

  // Opinião: reservamos apenas 1 página de opinião
  const maxOpinions = Math.min(opinions.length, 1);
  const existingOpinions = opinions.slice(0, maxOpinions);

  // Artigos Internos: preenchem o espaço entre a Capa e a Opinião.
  // Queremos 12 - 1(capa) - maxOpinions = X páginas internas.
  const targetInternalCount = 11 - maxOpinions;
  const internalArticles = news.slice(0, targetInternalCount);

  // We use a minimum of 1 page per section when there are no articles
  // but only show actual ad/placeholder — no empty white pages
  const totalPages =
    1 +
    Math.max(internalArticles.length, 1) + 
    (existingOpinions.length > 0 ? existingOpinions.length : 1);

  /* ────────────────── Render page footer ────────────────── */
  const PageFooter = ({ page, section, color = "#78716c" }: { page: number; section: string; color?: string }) => (
    <div style={{ borderTop: `2px solid ${color}`, marginTop: "8px", paddingTop: "3px", display: "flex", justifyContent: "space-between" }}>
      <span className="nyt-sans" style={{ fontSize: "8.5px", color: "#78716c", textTransform: "uppercase" }}>Edição Semanal</span>
      <span className="nyt-sans" style={{ fontSize: "8.5px", color, fontWeight: 700, textTransform: "uppercase" }}>{section}</span>
      <span className="nyt-sans" style={{ fontSize: "8.5px", color: "#78716c", textTransform: "uppercase" }}>Página {page}</span>
    </div>
  );

  /* ────────────────── Running header ────────────────── */
  const RunningHeader = ({ section, page, color = "#78716c" }: { section: string; page: number; color?: string }) => (
    <>
      <div className="section-bar color-bg" style={{ background: `linear-gradient(90deg,${color} 0%,${color}cc 100%)`, height: "3px", marginBottom: "6px" }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #d4d4d8", paddingBottom: "4px", marginBottom: "10px" }}>
        <span className="nyt-sans" style={{ fontSize: "9px", color: "#78716c", textTransform: "uppercase", letterSpacing: "0.08em" }}>ANGOLA SEM FILTROS</span>
        <span className="nyt-sans" style={{ fontSize: "9px", fontWeight: 700, color, textTransform: "uppercase", letterSpacing: "0.06em", background: `${color}15`, padding: "1px 8px" }}>
          {section}
        </span>
        <span className="nyt-sans" style={{ fontSize: "9px", color: "#78716c", textTransform: "uppercase", letterSpacing: "0.08em" }}>Página {page}</span>
      </div>
    </>
  );

  /* ────────────────── Full Ad Page ────────────────── */
  const FullAdPage = ({ pageNum, adIndex }: { pageNum: number; adIndex: number }) => {
    const ad = getAd([AD_SLOTS.FULL, AD_SLOTS.BANNER_TOP, AD_SLOTS.BANNER_BOTTOM, AD_SLOTS.SQUARE], adIndex);
    const accentColor = "#b91c1c";

    return (
      <div className="newspaper-page">
        <RunningHeader section="PUBLICIDADE" page={pageNum} color={accentColor} />

        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "10px", overflow: "hidden" }}>
          {ad ? (
            /* Full page ad image */
            <div style={{ flex: 1, overflow: "hidden", border: `2px solid ${accentColor}30` }}>
              <AdImage ad={ad} style={{ objectFit: "contain" }} />
              <div style={{ textAlign: "center", paddingTop: "4px" }}>
                <span className="nyt-sans" style={{ fontSize: "8px", color: "#78716c", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  Publicidade · {ad.title}
                </span>
              </div>
            </div>
          ) : (
            /* Fallback: show two placeholder halves with dimension info */
            <>
              <div style={{ flex: 1 }}>
                <AdPlaceholder
                  label="Meia Página Superior (slot: newspaper_half_h)"
                  dims="180 × 120 mm · JPEG/PNG 1800×1200px · 300 DPI"
                  color={accentColor}
                />
              </div>
              <div style={{ height: "1px", background: `${accentColor}20` }} />
              <div style={{ flex: 1 }}>
                <AdPlaceholder
                  label="Meia Página Inferior (slot: newspaper_half_h)"
                  dims="180 × 120 mm · JPEG/PNG 1800×1200px · 300 DPI"
                  color="#1d4ed8"
                />
              </div>
            </>
          )}
        </div>

        <PageFooter page={pageNum} section="PUBLICIDADE" color={accentColor} />
      </div>
    );
  };

  /* ════════════════════ RENDER ════════════════════ */
  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-950 antialiased font-serif">
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;0,800;0,900;1,700;1,800&family=Source+Sans+3:wght@300;400;600;700&display=swap');

        @media screen {
          .newspaper-page {
            width: 210mm;
            min-height: 297mm;
            height: 297mm;
            margin: 30px auto;
            padding: 14mm 14mm 12mm 14mm;
            background: #fffcf8;
            box-shadow: 0 10px 30px -5px rgba(0,0,0,0.18), 0 4px 10px -4px rgba(0,0,0,0.10);
            position: relative;
            box-sizing: border-box;
            border: 1px solid #e4e4e7;
            overflow: hidden;
            display: flex;
            flex-direction: column;
          }
          .print-control-bar {
            display: flex;
            position: sticky;
            top: 0;
            z-index: 50;
            background: rgba(255,255,255,0.96);
            backdrop-filter: blur(10px);
            border-bottom: 1px solid #e4e4e7;
          }
        }

        @media print {
          @page { size: A4 portrait; margin: 0; }
          body {
            background: white !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
            margin: 0 !important; padding: 0 !important;
          }
          .print-control-bar { display: none !important; }
          .newspaper-page {
            width: 210mm !important; height: 297mm !important;
            padding: 14mm 14mm 12mm 14mm !important;
            page-break-after: always !important; break-after: page !important;
            box-sizing: border-box !important; background: #fffcf8 !important;
            box-shadow: none !important; border: none !important;
            overflow: hidden !important; display: flex !important; flex-direction: column !important;
          }
          .cat-badge, .section-bar, .accent-bar, .color-bg {
            -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important;
          }
        }

        /* Typography */
        .nyt-title  { font-family: 'Playfair Display', Times, serif; font-weight: 900; letter-spacing: -0.02em; }
        .nyt-italic { font-family: 'Playfair Display', Georgia, serif; font-style: italic; font-weight: 700; }
        .nyt-body   { font-family: 'Source Sans 3', Georgia, sans-serif; text-align: justify; text-justify: inter-word; line-height: 1.5; }
        .nyt-sans   { font-family: 'Source Sans 3', Arial, sans-serif; }
        .newspaper-cols-3 { column-count: 3; column-gap: 18px; column-rule: 1px solid #d4d4d8; }
        .newspaper-cols-2 { column-count: 2; column-gap: 22px; column-rule: 1px dashed #d4d4d8; }
        .clamp-hero     { display: -webkit-box; -webkit-line-clamp: 16; -webkit-box-orient: vertical; overflow: hidden; }
        .clamp-sec      { display: -webkit-box; -webkit-line-clamp: 9;  -webkit-box-orient: vertical; overflow: hidden; }
        .clamp-internal { display: -webkit-box; -webkit-line-clamp: 36; -webkit-box-orient: vertical; overflow: hidden; }
        .clamp-opinion  { display: -webkit-box; -webkit-line-clamp: 38; -webkit-box-orient: vertical; overflow: hidden; }
      `}} />

      {/* ====== CONTROL BAR ====== */}
      <div className="print-control-bar w-full py-3 px-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/admin")}
            className="flex items-center gap-2 hover:bg-zinc-100 text-zinc-700 px-3 py-1.5 text-xs font-semibold rounded transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Voltar ao Painel
          </button>
          <div className="h-5 w-px bg-zinc-300" />
          <span className="text-xs text-zinc-500 nyt-sans uppercase font-bold tracking-wider">
            {editionNo} · {totalPages} páginas · Colorido
          </span>
        </div>

        <div className="flex items-center gap-5">
          {/* Ad slots hint */}
          <div className="hidden md:flex items-center gap-1 bg-amber-50 border border-amber-200 rounded px-3 py-1.5">
            <Megaphone className="w-3 h-3 text-amber-600" />
            <span className="text-[10px] text-amber-700 font-semibold">
              Slots: <code className="font-mono text-[9px]">newspaper_full</code> · <code className="font-mono text-[9px]">newspaper_half_h</code> · <code className="font-mono text-[9px]">newspaper_quarter</code>
            </span>
            <button
              onClick={() => navigate("/admin")}
              className="ml-1 flex items-center gap-0.5 text-[9px] text-amber-600 hover:underline"
            >
              <Plus className="w-3 h-3" /> Gerir
            </button>
          </div>

          <div className="flex items-center gap-2">
            <Type className="w-4 h-4 text-zinc-500" />
            <span className="text-xs text-zinc-500 nyt-sans mr-1">Texto:</span>
            <button onClick={() => setFontScale(s => Math.max(0.65, s - 0.05))} className="p-1 hover:bg-zinc-100 rounded text-zinc-700" title="Diminuir">
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono font-bold w-11 text-center text-zinc-700">{Math.round(fontScale * 100)}%</span>
            <button onClick={() => setFontScale(s => Math.min(1.3, s + 0.05))} className="p-1 hover:bg-zinc-100 rounded text-zinc-700" title="Aumentar">
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 bg-[#b91c1c] text-white px-5 py-2 text-xs font-bold uppercase tracking-wider hover:bg-[#991b1b] transition-all shadow-md rounded"
          >
            <Printer className="w-4 h-4" /> Imprimir / PDF
          </button>
        </div>
      </div>

      {/* ====== PAGES ====== */}
      <div style={{ fontSize: `${fontScale}rem` }}>

        {/* ==================== PAGE 1: CAPA COLORIDA ==================== */}
        <div className="newspaper-page">
          <div className="accent-bar color-bg" style={{ background: "linear-gradient(90deg,#b91c1c 0%,#ef4444 100%)", height: "4px", marginBottom: "6px", borderRadius: "1px" }} />

          {/* Info bar */}
          <div className="flex justify-between items-center text-[9px] uppercase tracking-widest nyt-sans border-b border-zinc-300 pb-1 mb-3" style={{ color: "#6b7280" }}>
            <span>Luanda, Angola</span>
            <span>Edição Semanal Digital</span>
            <span>{format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: pt })}</span>
          </div>

          {/* Masthead */}
          <div className="pb-3 mb-3" style={{ borderBottom: "4px double #1c1917" }}>
            <div className="flex justify-start mb-2">
              <img src="/logo.png" alt="Logo" style={{ height: "40px", objectFit: "contain" }} />
            </div>
            <div className="text-center">
              <h1 className="nyt-title uppercase select-none" style={{ fontSize: "54px", letterSpacing: "-1px", color: "#1c1917", lineHeight: 1 }}>
                ANGOLA SEM FILTROS
              </h1>
            </div>
            <div className="flex justify-between items-center text-[9px] uppercase tracking-widest nyt-sans border-t border-zinc-400 mt-2 pt-1 font-semibold" style={{ color: "#57534e" }}>
              <span>{editionNo}</span>
              <span style={{ color: "#b91c1c" }}>"A Verdade Sem Compromissos"</span>
              <span>AOA 500 / USD 2.00</span>
            </div>
          </div>

          {/* CAPA body */}
          {capaArticles.length > 0 ? (
            <div className="flex-1 flex flex-col overflow-hidden gap-3">
              {/* HERO — artigo 1 */}
              {capaArticles[0] && (() => {
                const catColor = getCategoryColor(capaArticles[0].category);
                return (
                  <div style={{ borderBottom: "2px solid #e4e4e7", paddingBottom: "10px" }}>
                    <div className="cat-badge color-bg" style={{ display: "inline-block", background: catColor, color: "#fff", fontSize: "9px", fontWeight: 700, letterSpacing: "0.08em", padding: "2px 8px", textTransform: "uppercase", marginBottom: "6px" }}>
                      {capaArticles[0].category}
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: "12px" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        {capaArticles[0].image_url && (
                          <div style={{ width: "100%", aspectRatio: "4/3", overflow: "hidden", border: `2px solid ${catColor}`, flexShrink: 0 }}>
                            <img src={capaArticles[0].image_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          </div>
                        )}
                        <p className="nyt-sans" style={{ fontSize: "9px", color: "#78716c", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                          {capaArticles[0].author || "Redação Angola Sem Filtros"}
                        </p>
                        {/* Logo + branding block para preencher espaço residual na coluna esquerda */}
                        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "6px", borderTop: `1px solid ${catColor}30`, paddingTop: "10px", minHeight: "80px" }}>
                          <img src="/logo.png" alt="Angola Sem Filtros" style={{ width: "80%", maxHeight: "70px", objectFit: "contain", opacity: 0.85 }} />
                          <span className="nyt-sans" style={{ fontSize: "7.5px", color: "#78716c", textTransform: "uppercase", letterSpacing: "0.12em", textAlign: "center" }}>
                            A Verdade Sem Compromissos
                          </span>
                          <span className="nyt-sans" style={{ fontSize: "7px", color: `${catColor}90`, textAlign: "center", letterSpacing: "0.06em" }}>
                            angolasemfiltros.com
                          </span>
                        </div>
                      </div>
                      <div style={{ width: "1px", background: "#d4d4d8" }} />
                      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                        <h2 className="nyt-title" style={{ fontSize: "22px", lineHeight: 1.15, color: "#1c1917", marginBottom: "8px" }}>
                          {capaArticles[0].title}
                        </h2>
                        {capaArticles[0].summary && (
                          <p className="nyt-body" style={{ fontSize: "12px", color: "#44403c", lineHeight: 1.5 }}>
                            {capaArticles[0].summary}
                          </p>
                        )}
                        <div className="nyt-body clamp-hero" style={{ fontSize: "12px", color: "#57534e", marginTop: "6px", lineHeight: 1.45 }}>
                          {stripHtml(capaArticles[0].content)}
                        </div>
                        <span className="nyt-sans" style={{ fontSize: "9px", color: catColor, fontWeight: 700, textTransform: "uppercase", marginTop: "6px" }}>
                          Continua na página 2 ›
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* SECONDARY — artigos 2, 3, 4 */}
              {capaArticles.length > 1 ? (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1px 1fr 1px 1fr", gap: "0", flex: 1, minHeight: 0, overflow: "hidden" }}>
                  {capaArticles.slice(1, 4).map((art, i) => {
                    const catColor = getCategoryColor(art.category);
                    return [
                      i > 0 && <div key={`div-${i}`} style={{ background: "#d4d4d8", width: "1px" }} />,
                      <div key={art.id} style={{ padding: "0 10px", display: "flex", flexDirection: "column", overflow: "hidden" }}>
                        <div className="cat-badge color-bg" style={{ display: "inline-block", background: catColor, color: "#fff", fontSize: "8px", fontWeight: 700, letterSpacing: "0.06em", padding: "1px 6px", textTransform: "uppercase", marginBottom: "5px" }}>
                          {art.category}
                        </div>
                        <h3 className="nyt-title" style={{ fontSize: "13px", lineHeight: 1.2, color: "#1c1917", marginBottom: "4px" }}>
                          {art.title}
                        </h3>
                        {art.image_url && (
                          <div style={{ width: "100%", aspectRatio: "16/9", overflow: "hidden", marginBottom: "5px", border: `1px solid ${catColor}40` }}>
                            <img src={art.image_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          </div>
                        )}
                        <div className="nyt-body clamp-sec" style={{ fontSize: "11px", color: "#57534e", lineHeight: 1.45 }}>
                          {art.summary || stripHtml(art.content)}
                        </div>
                        <span className="nyt-sans" style={{ fontSize: "8.5px", color: catColor, fontWeight: 700, textTransform: "uppercase", marginTop: "auto", paddingTop: "4px" }}>
                          Autor: {art.author || "Redação"} · Pág. {i + 3} ›
                        </span>
                      </div>
                    ];
                  })}
              </div>
              ) : (
                /* Preenchimento Flexível de Espaço na Capa caso não haja notícias suficientes */
                <div style={{ flex: 1, display: "flex", flexDirection: "column", borderTop: "2px solid #e4e4e7", overflow: "hidden", minHeight: "150px" }}>
                  <AdPlaceholder label="Publicidade de Capa Principal" dims="Destaque Flexível Ajustável" color="#1c1917" />
                </div>
              )}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center border border-dashed border-zinc-300 text-zinc-400 p-8">
              <p className="text-sm">Sem notícias disponíveis para a capa.</p>
            </div>
          )}

          {/* Capa: banner ad strip at bottom if available */}
          {(() => {
            const bannerAd = getAd([AD_SLOTS.BANNER, AD_SLOTS.BANNER_BOTTOM, AD_SLOTS.BANNER_TOP]);
            if (bannerAd) {
              return (
                <div style={{ marginTop: "8px", border: "1px solid #e4e4e7", overflow: "hidden", height: "48px" }}>
                  <AdImage ad={bannerAd} />
                </div>
              );
            }
            return null;
          })()}

          {/* Capa footer */}
          <div style={{ borderTop: "2px solid #1c1917", marginTop: "6px", paddingTop: "4px", display: "flex", justifyContent: "space-between" }}>
            <span className="nyt-sans" style={{ fontSize: "8.5px", color: "#78716c", textTransform: "uppercase" }}>© Angola Sem Filtros</span>
            <span className="nyt-sans" style={{ fontSize: "8.5px", color: "#b91c1c", fontWeight: 700, textTransform: "uppercase" }}>Edição {totalPages} Páginas</span>
            <span className="nyt-sans" style={{ fontSize: "8.5px", color: "#78716c", textTransform: "uppercase" }}>Página 1</span>
          </div>
        </div>

        {/* ==================== PÁGINAS INTERNAS ==================== */}
        {internalArticles.length > 0 ? (
          internalArticles.map((article, idx) => {
            const pageNum = idx + 2;
            const catColor = getCategoryColor(article.category);
            // Coloca publicidade horizontal na base de todas as páginas internas
            const halfAd = getAd([AD_SLOTS.HALF_H, AD_SLOTS.BANNER, AD_SLOTS.BANNER_TOP, AD_SLOTS.BANNER_BOTTOM], idx);

            return (
              <div key={article.id} className="newspaper-page">
                <RunningHeader section={article.category} page={pageNum} color={catColor} />

                <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
                  <h2 className="nyt-title" style={{ fontSize: "24px", lineHeight: 1.15, color: "#1c1917", marginBottom: "6px" }}>
                    {article.title}
                  </h2>

                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "9px", color: "#78716c", borderBottom: "1px solid #e4e4e7", paddingBottom: "5px", marginBottom: "8px" }} className="nyt-sans">
                    <span>Redator: <strong style={{ color: catColor }}>{article.author || "Redacção"}</strong></span>
                    <span>{format(new Date(article.created_at), "dd/MM/yyyy HH:mm")}</span>
                  </div>

                  {article.summary && (
                    <p className="nyt-body" style={{ fontSize: "13px", color: "#44403c", borderLeft: `3px solid ${catColor}`, paddingLeft: "10px", marginBottom: "10px", fontStyle: "italic", lineHeight: 1.5 }}>
                      {article.summary}
                    </p>
                  )}

                  {/* Main content area: body + optional quarter ad sidebar */}
                  <div style={{ flex: 1, display: "flex", gap: "12px", overflow: "hidden" }}>
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px", overflow: "hidden" }}>
                      {article.image_url && (
                        <div style={{ width: "100%", aspectRatio: "16/9", flexShrink: 0, overflow: "hidden", border: `2px solid ${catColor}40` }}>
                          <img
                            src={article.image_url}
                            alt=""
                            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 20%", display: "block" }}
                          />
                        </div>
                      )}
                      {/* Ao remover o flex: 1 daqui, forçamos as colunas a balancearem o texto perfeitamente */}
                      <div className="nyt-body clamp-internal newspaper-cols-3" style={{ fontSize: "12px", lineHeight: 1.5, color: "#292524" }}>
                        {stripHtml(article.content)}
                      </div>

                      {/* Caixa Dinâmica de Preenchimento: absorve qualquer espaço branco indesejado na parte inferior */}
                      <div style={{ flex: 1, minHeight: halfAd ? "60px" : 0, display: "flex", flexDirection: "column", marginTop: "4px", overflow: "hidden" }}>
                        {halfAd ? (
                          <div style={{ flex: 1, overflow: "hidden", border: `1px solid ${catColor}20` }}>
                            <AdImage ad={halfAd} style={{ objectFit: "cover", width: "100%", height: "100%" }} />
                          </div>
                        ) : (
                          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                            <AdPlaceholder label="Espaço Publicitário Automático" dims="Tamanho Ajustável" color={catColor} />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <PageFooter page={pageNum} section={article.category} color={catColor} />
              </div>
            );
          })
        ) : (
          /* No articles at all — render a full ad page */
          <FullAdPage pageNum={2} adIndex={0} />
        )}

        {/* ==================== PÁGINAS DE OPINIÃO ==================== */}
        {existingOpinions.length > 0 ? (
          existingOpinions.map((opinion, idx) => {
            const pageNum = internalArticles.length + 2 + idx;
            const opColor = "#9f1239";
            // Inject a square ad after the author block every 2nd opinion
            const squareAd = (idx % 2 === 1) ? getAd([AD_SLOTS.SQUARE], idx) : null;

            return (
              <div key={opinion.id} className="newspaper-page">
                <RunningHeader section="OPINIÃO &amp; DEBATE" page={pageNum} color={opColor} />

                <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
                  {/* Author banner */}
                  <div style={{ display: "flex", alignItems: "center", gap: "14px", borderBottom: "1px solid #e4e4e7", paddingBottom: "10px", marginBottom: "10px" }}>
                    <div style={{ width: "56px", height: "56px", borderRadius: "50%", overflow: "hidden", border: `3px solid ${opColor}`, flexShrink: 0 }}>
                      {opinion.avatar_url ? (
                        <img src={opinion.avatar_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      ) : (
                        <div style={{ width: "100%", height: "100%", background: `${opColor}22`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <span className="nyt-title" style={{ fontSize: "20px", color: opColor }}>{opinion.author?.[0] ?? "?"}</span>
                        </div>
                      )}
                    </div>
                    <div style={{ flex: 1 }}>
                      <span className="nyt-sans" style={{ fontSize: "9px", color: opColor, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em" }}>Coluna Editorial</span>
                      <h4 className="nyt-title" style={{ fontSize: "15px", color: "#1c1917", margin: "2px 0 1px" }}>{opinion.author}</h4>
                      {opinion.excerpt && (
                        <p className="nyt-sans" style={{ fontSize: "10px", color: "#44403c", marginBottom: "2px", letterSpacing: "0.02em" }}>
                          {opinion.excerpt}
                        </p>
                      )}
                      <span className="nyt-sans" style={{ fontSize: "9px", color: "#78716c" }}>
                        {format(new Date(opinion.created_at), "dd 'de' MMMM 'de' yyyy", { locale: pt })}
                      </span>
                    </div>
                    {/* Square ad alongside author if available */}
                    {squareAd && (
                      <div style={{ width: "70px", height: "70px", overflow: "hidden", border: `1px solid ${opColor}30`, flexShrink: 0 }}>
                        <AdImage ad={squareAd} style={{ objectFit: "contain" }} />
                      </div>
                    )}
                  </div>

                  <h2 className="nyt-italic" style={{ fontSize: "22px", lineHeight: 1.25, color: "#1c1917", marginBottom: "14px" }}>
                    "{opinion.title}"
                  </h2>

                  <div className="nyt-body newspaper-cols-2 clamp-opinion" style={{ fontSize: "12px", lineHeight: 1.55, color: "#292524" }}>
                    {stripHtml(opinion.content)}
                  </div>

                  <div style={{ flex: 1, minHeight: 0, height: 0, display: "flex", flexDirection: "column", marginTop: "12px", overflow: "hidden" }}>
                    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                      <AdPlaceholder label="Espaço Publicitário (Opinião)" dims="Tamanho Ajustável" color={opColor} />
                    </div>
                  </div>
                </div>

                <PageFooter page={pageNum} section="SECÇÃO OPINIÃO" color={opColor} />
              </div>
            );
          })
        ) : (
          /* No opinions — show ad page */
          <FullAdPage pageNum={internalArticles.length + 2} adIndex={1} />
        )}

      </div>
    </div>
  );
};

export default DigitalNewspaperTemplate;
