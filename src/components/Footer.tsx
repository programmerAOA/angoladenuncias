import { useNavigate } from "react-router-dom";
import { Facebook, Instagram, Youtube, Mail, MessageSquare } from "lucide-react";

const Footer = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black text-white py-12 px-4 border-t border-white/10">
      <div className="container max-w-4xl mx-auto flex flex-col items-center">

        {/* Social Icons */}
        <div className="flex items-center gap-4 mb-8">
          <a
            href="https://facebook.com/angolasemfiltros"
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-all duration-300 group"
          >
            <Facebook className="w-5 h-5 text-white" />
          </a>
          <a
            href="https://instagram.com/angolasemfiltros"
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-all duration-300"
          >
            <Instagram className="w-5 h-5 text-white" />
          </a>
          <a
            href="https://youtube.com/@semfiltrostv"
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-all duration-300"
          >
            <Youtube className="w-5 h-5 text-white" />
          </a>
        </div>

        {/* Main Navigation */}
        <nav className="flex flex-wrap justify-center gap-x-8 gap-y-4 mb-10">
          <button
            onClick={() => navigate("/")}
            className="text-sm font-bold uppercase tracking-wider hover:text-primary transition-colors"
          >
            Página Inicial
          </button>
          <button
            onClick={() => navigate("/linha-editorial")}
            className="text-sm font-bold uppercase tracking-wider hover:text-primary transition-colors"
          >
            Linha Editorial
          </button>
          <button
            onClick={() => navigate("/ficha-tecnica")}
            className="text-sm font-bold uppercase tracking-wider hover:text-primary transition-colors"
          >
            Ficha Técnica e Contactos
          </button>
        </nav>

        {/* Secondary Links & Contacts */}
        <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 mb-8 text-white/60 text-xs">
          <a href="mailto:redaccao@semfiltros.com" className="flex items-center gap-1.5 hover:text-white transition-colors">
            <Mail className="w-3.5 h-3.5" />
            redaccao@semfiltros.com
          </a>
          <a href="https://wa.me/244952679780" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-white transition-colors">
            <MessageSquare className="w-3.5 h-3.5" />
            +244 952 679 780
          </a>
          <button onClick={() => navigate("/termos")} className="hover:text-white transition-colors">
            Termos de Uso
          </button>
          <button onClick={() => navigate("/privacidade")} className="hover:text-white transition-colors">
            Política de Privacidade
          </button>
        </div>

        {/* Copyright */}
        <div className="text-center text-white/40 text-[11px] select-none">
          <p>© {currentYear} Todos os Direitos Reservados. <span className="font-bold text-white/60">Portal Sem Filtros.</span></p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
