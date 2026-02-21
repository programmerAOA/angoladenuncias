import { useState, useMemo, useEffect } from "react";
import Header from "@/components/Header";
import BreakingNewsTicker from "@/components/BreakingNewsTicker";
import HeroSection from "@/components/HeroSection";
import NewsGrid from "@/components/NewsGrid";
import VideoSection, { VideoItem } from "@/components/VideoSection";
import Footer from "@/components/Footer";
import RadioPlayer from "@/components/RadioPlayer";
import { supabase } from "@/integrations/supabase/client";
import { formatRelativeDate, withTimeout } from "@/lib/utils";
import { NewsArticle } from "@/components/NewsCard";

import { categories } from "@/constants/categories";

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState("Destaque");
  const [searchQuery, setSearchQuery] = useState("");
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [opinions, setOpinions] = useState<any[]>([]);
  const [breakingHeadlines, setBreakingHeadlines] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      console.log("Index: Iniciar carregamento de dados...");
      setLoading(true);
      try {
        // Sequencial mas protegido por timeouts maiores para não quebrar a UI
        console.log("Index: Carregar artigos...");
        const articlesRes = await withTimeout(supabase.from("news_articles").select("*").order("created_at", { ascending: false }), 30000) as any;
        if (articlesRes.data) {
          console.log(`Index: ${articlesRes.data.length} artigos recebidos`);
          setArticles(articlesRes.data.map((a: any) => ({
            id: a.id, title: a.title, summary: a.summary, category: a.category,
            image: a.image_url || "https://images.unsplash.com/photo-1585829365234-781fcd04c8ef?w=800&q=80",
            timestamp: formatRelativeDate(a.created_at), author: a.author || "Redação"
          })));
        } else if (articlesRes.error) {
          console.error("Index: Erro artigos:", articlesRes.error);
        }

        console.log("Index: Carregar vídeos...");
        const videosRes = await withTimeout(supabase.from("video_news").select("*").order("created_at", { ascending: false }).limit(6), 20000) as any;
        if (videosRes.data) {
          setVideos(videosRes.data.map((v: any) => ({
            id: v.id, title: v.title, description: v.description || "",
            thumbnail: v.thumbnail_url || "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&q=80",
            duration: v.duration || "0:00", views: String(v.views || 0), category: v.category || "Geral",
            video_url: v.video_url
          })));
        }

        console.log("Index: Carregar opiniões...");
        const opinionsRes = await withTimeout(supabase.from("opinion_articles").select("*").order("created_at", { ascending: false }).limit(5), 20000) as any;
        if (opinionsRes.data) {
          setOpinions(opinionsRes.data.map((o: any) => ({
            id: o.id, title: o.title, author: o.author, timestamp: formatRelativeDate(o.created_at)
          })));
        }

        console.log("Index: Carregar última hora...");
        const breakingRes = await withTimeout(supabase.from("breaking_news").select("text").eq("active", true).order("created_at", { ascending: false }), 20000) as any;
        if (breakingRes.data) {
          setBreakingHeadlines(breakingRes.data.map((b: any) => b.text));
        }

        console.log("Index: Carregamento completo.");
      } catch (error) {
        console.error("Index: Erro de carregamento fatal:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filtrar artigos com base na categoria e/ou pesquisa
  const isFiltering = selectedCategory !== "Destaque" || searchQuery.trim() !== "";

  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      const matchesCategory =
        selectedCategory === "Destaque" || article.category === selectedCategory;
      const matchesSearch =
        searchQuery.trim() === "" ||
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.summary.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [articles, selectedCategory, searchQuery]);

  // Artigo em destaque (o mais recente da lista geral)
  const heroArticle = articles.length > 0 ? articles[0] : null;
  const sideArticles = articles.slice(1, 5);
  const gridTopArticles = articles.slice(5, 9);
  const gridLatestArticles = articles.slice(9);

  return (
    <div className="min-h-screen bg-background">
      <Header
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        onSearch={setSearchQuery}
      />
      <BreakingNewsTicker headlines={breakingHeadlines} />
      <main>
        {loading ? (
          <div className="container py-20 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">A carregar conteúdo...</p>
          </div>
        ) : isFiltering ? (
          <div className="container py-8">
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-xl font-heading font-bold text-foreground">
                {searchQuery.trim()
                  ? `Resultados para "${searchQuery}"`
                  : selectedCategory}
              </h2>
              <div className="flex-1 h-px bg-border" />
              <span className="text-sm text-muted-foreground">
                {filteredArticles.length} artigo{filteredArticles.length !== 1 ? "s" : ""}
              </span>
            </div>
            {filteredArticles.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredArticles.map((article, i) => (
                  <article
                    key={article.id}
                    className="group cursor-pointer animate-fade-in"
                    style={{ animationDelay: `${i * 80}ms` }}
                  >
                    {article.image && (
                      <div className="overflow-hidden mb-3">
                        <img
                          src={article.image}
                          alt={article.title}
                          className="w-full aspect-[16/9] object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    )}
                    <span className="news-category-badge mb-2 inline-block">
                      {article.category}
                    </span>
                    <h3 className="news-headline news-headline-hover text-lg">
                      {article.title}
                    </h3>
                    <p className="text-muted-foreground mt-2 text-sm line-clamp-2">
                      {article.summary}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-muted-foreground font-medium">
                        {article.author}
                      </span>
                      <span className="text-muted-foreground">·</span>
                      <span className="news-timestamp">{article.timestamp}</span>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-muted-foreground text-lg">
                  Nenhum artigo encontrado.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory("Destaque");
                    setSearchQuery("");
                  }}
                  className="mt-4 text-sm text-primary hover:underline"
                >
                  Voltar aos destaques
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <HeroSection heroArticle={heroArticle} sideArticles={sideArticles} />
            <VideoSection videos={videos} />
            <NewsGrid
              topArticles={gridTopArticles}
              latestArticles={gridLatestArticles}
              opinionArticles={opinions}
            />
          </>
        )}
      </main>
      <Footer />
      <RadioPlayer />
    </div>
  );
};

export default Index;
