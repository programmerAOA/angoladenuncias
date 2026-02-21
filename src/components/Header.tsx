import { useState, useRef, useEffect } from "react";
import { Search, Menu, X, User, LogOut, Shield, Loader2 } from "lucide-react";
import { categories } from "@/data/newsData";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { pt } from "date-fns/locale";

interface HeaderProps {
  selectedCategory?: string;
  onCategoryChange?: (category: string) => void;
  onSearch?: (query: string) => void;
}

const Header = ({ selectedCategory = "Destaque", onCategoryChange, onSearch }: HeaderProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();

  const todayDate = format(new Date(), "EEEE, d 'de' MMMM 'de' yyyy", { locale: pt });
  // Capitalizar a primeira letra
  const formattedDate = todayDate.charAt(0).toUpperCase() + todayDate.slice(1);

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  const handleAuthClick = async () => {
    if (user) {
      await signOut();
      navigate("/");
    } else {
      navigate("/auth");
    }
  };

  const handleSearchToggle = () => {
    if (searchOpen) {
      setSearchQuery("");
      onSearch?.("");
    }
    setSearchOpen(!searchOpen);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch?.(query);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setSearchOpen(false);
      setSearchQuery("");
      onSearch?.("");
    }
  };

  const handleCategoryClick = (category: string) => {
    onCategoryChange?.(category);
    setMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      {/* Top bar */}
      <div className="container flex items-center justify-between py-2 border-b border-border">
        <span className="news-timestamp hidden sm:block">{formattedDate}</span>
        <div className="flex items-center gap-4">
          <button className="nav-link text-xs">Newsletter</button>
          {isAdmin && (
            <button
              onClick={() => navigate("/admin")}
              className="nav-link text-xs flex items-center gap-1 text-primary"
            >
              <Shield className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Admin</span>
            </button>
          )}
          <button
            onClick={handleAuthClick}
            disabled={loading}
            className="nav-link text-xs flex items-center gap-1 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : user ? (
              <LogOut className="w-3.5 h-3.5" />
            ) : (
              <User className="w-3.5 h-3.5" />
            )}
            <span className="hidden sm:inline">
              {loading ? "A carregar..." : user ? "Sair" : "Entrar"}
            </span>
          </button>
          {!loading && !user && (
            <button
              onClick={() => navigate("/auth")}
              className="px-3 py-1 text-xs font-semibold bg-primary text-primary-foreground uppercase tracking-wider hover:opacity-90 transition-opacity"
            >
              Assinar
            </button>
          )}
        </div>
      </div>

      {/* Logo + Search */}
      <div className="container flex items-center justify-between py-4">
        <button
          className="lg:hidden text-foreground"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        <h1
          onClick={() => {
            navigate("/");
            onCategoryChange?.("Destaque");
          }}
          className="font-heading text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-foreground mx-auto lg:mx-0 uppercase cursor-pointer"
        >
          Angola Denúncias
        </h1>

        <div className="flex items-center gap-2">
          {/* Campo de pesquisa expandível */}
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${searchOpen ? "w-48 sm:w-64 opacity-100" : "w-0 opacity-0"
              }`}
          >
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyDown={handleSearchKeyDown}
              placeholder="Pesquisar artigos..."
              className="w-full px-3 py-1.5 text-sm bg-secondary text-foreground border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground"
            />
          </div>
          <button
            onClick={handleSearchToggle}
            className={`text-foreground hover:text-primary transition-colors ${searchOpen ? "text-primary" : ""
              }`}
          >
            {searchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className={`${menuOpen ? "block" : "hidden"} lg:block border-t border-border`}>
        <div className="container overflow-x-auto">
          <ul className="flex items-center gap-6 py-3 min-w-max">
            {categories.map((cat) => (
              <li key={cat}>
                <button
                  onClick={() => handleCategoryClick(cat)}
                  className={`nav-link ${selectedCategory === cat ? "nav-link-active" : ""}`}
                >
                  {cat}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;
