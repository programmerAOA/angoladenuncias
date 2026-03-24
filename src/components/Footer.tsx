import { useNavigate } from "react-router-dom";
import { Facebook, Twitter, Linkedin, Globe } from "lucide-react";

const footerSections = [
  { title: "Secções", links: ["Política", "Economia", "Mundo", "Desporto", "Cultura", "Tecnologia"] },
  { title: "Opinião", links: ["Editoriais", "Colunistas", "Cartas dos Leitores", "Debates"] },
  { title: "Multimédia", links: ["Vídeos", "Podcasts", "Fotogalerias", "Infografias"] },
];

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="bg-secondary border-t border-border mt-12">
      <div className="container py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="text-xs font-bold uppercase tracking-widest text-foreground mb-4">
                {section.title}
              </h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link}>
                    <button
                      onClick={() => {
                        if (section.title === "Secções") {
                          navigate("/", { state: { category: link } });
                        } else if (section.title === "Opinião") {
                          navigate("/", { state: { category: "Opinião" } });
                        } else if (section.title === "Multimédia") {
                          if (link === "Vídeos") navigate("/videos");
                          else navigate("/videos");
                        } else {
                          navigate("/");
                        }
                      }}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors text-left w-full"
                    >
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact Section */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-foreground mb-4">
              Contacto
            </h4>
            <ul className="space-y-3">
              <li>
                <span className="block text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5 font-bold">Email Geral</span>
                <a
                  href="mailto:geral@angolasemfiltros.com"
                  className="text-sm text-foreground hover:text-primary transition-colors font-medium break-all"
                >
                  geral@angolasemfiltros.com
                </a>
              </li>
              <li>
                <span className="block text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5 font-bold">Publicidade</span>
                <button
                  onClick={() => navigate("/publicidade")}
                  className="text-sm text-foreground hover:text-primary transition-colors font-medium text-left bg-primary/5 px-2 py-1 rounded border border-primary/10 w-full"
                >
                  Anuncie connosco
                </button>
              </li>
              <li>
                <span className="block text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5 font-bold">Documentos</span>
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => navigate("/termos")}
                    className="text-xs text-muted-foreground hover:text-primary transition-colors text-left"
                  >
                    Termos de Uso
                  </button>
                  <button
                    onClick={() => navigate("/privacidade")}
                    className="text-xs text-muted-foreground hover:text-primary transition-colors text-left"
                  >
                    Política de Privacidade
                  </button>
                </div>
              </li>
              <li>
                <span className="block text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5 font-bold">WhatsApp</span>
                <a
                  href="https://wa.me/244952679780"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-foreground hover:text-primary transition-colors font-medium"
                >
                  +244 952 679 780
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="section-divider my-8" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center cursor-pointer" onClick={() => navigate("/")}>
            <img src="/logo.png" alt="Sem Filtros" className="h-10 w-auto object-contain" />
            <span className="font-heading font-black text-xl text-foreground uppercase tracking-tight ml-2 hidden sm:inline">
              Sem Filtros
            </span>
          </div>
          <span className="text-xs text-muted-foreground">
            © 2026 Sem Filtros. Todos os direitos reservados.
          </span>
          <div className="flex items-center gap-4">
            <a href="https://facebook.com/angolasemfiltros" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" title="Facebook">
              <Facebook className="w-5 h-5" />
            </a>
            <a href="https://twitter.com/angolasemfiltros" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" title="Twitter">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="https://linkedin.com/company/angolasemfiltros" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" title="LinkedIn">
              <Linkedin className="w-5 h-5" />
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1" title="Ubuntu">
              <Globe className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-widest hidden sm:inline">Ubuntu</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
