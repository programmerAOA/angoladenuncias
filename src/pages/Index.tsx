import { useState, useMemo } from "react";
import Header from "@/components/Header";
import BreakingNewsTicker from "@/components/BreakingNewsTicker";
import HeroSection from "@/components/HeroSection";
import NewsGrid from "@/components/NewsGrid";
import VideoSection from "@/components/VideoSection";
import Footer from "@/components/Footer";
import RadioPlayer from "@/components/RadioPlayer";
import { heroArticle, topArticles, latestArticles } from "@/data/newsData";

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState("Destaque");
  const [searchQuery, setSearchQuery] = useState("");

  // Filtrar artigos com base na categoria e/ou pesquisa
  const isFiltering = selectedCategory !== "Destaque" || searchQuery.trim() !== "";

  const filteredArticles = useMemo(() => {
    const allArticles = [heroArticle, ...topArticles, ...latestArticles];

    return allArticles.filter((article) => {
      const matchesCategory =
        selectedCategory === "Destaque" || article.category === selectedCategory;
      const matchesSearch =
        searchQuery.trim() === "" ||
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.summary.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-background">
      <Header
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        onSearch={setSearchQuery}
      />
      <BreakingNewsTicker />
      <main>
        {isFiltering ? (
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
            <HeroSection />
            <VideoSection />
            <NewsGrid />
          </>
        )}
      </main>
      <Footer />
      <RadioPlayer />
    </div>
  );
};

export default Index;
