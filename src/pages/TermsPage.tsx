import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ShieldCheck, Info, FileWarning, Scale, RefreshCw, UserCheck } from "lucide-react";

const TermsPage = () => {
    const sections = [
        {
            title: "Aceitação de Termos",
            content: "Ao aceder ao Sem Filtros, o utilizador concorda com os presentes termos de uso em sua totalidade.",
            icon: <ShieldCheck className="w-5 h-5 text-primary" />
        },
        {
            title: "Natureza do Conteúdo",
            content: "O conteúdo publicado é destinado exclusivamente para fins informativos e jornalísticos.",
            icon: <Info className="w-5 h-5 text-primary" />
        },
        {
            title: "Propriedade Intelectual",
            content: "É proibida a reprodução total ou parcial de qualquer conteúdo (textos, imagens ou vídeos) sem autorização expressa.",
            icon: <Scale className="w-5 h-5 text-primary" />
        },
        {
            title: "Conduta do Utilizador",
            content: "Comentários ofensivos, ilegais ou que violem direitos de terceiros poderão ser removidos sem aviso prévio.",
            icon: <UserCheck className="w-5 h-5 text-primary" />
        },
        {
            title: "Actualizações",
            content: "O site reserva-se o direito de actualizar conteúdos e termos sem aviso prévio. Recomendamos a consulta regular desta página.",
            icon: <RefreshCw className="w-5 h-5 text-primary" />
        },
        {
            title: "Responsabilidade",
            content: "O utilizador é inteiramente responsável pelo uso que faz das informações publicadas no portal.",
            icon: <FileWarning className="w-5 h-5 text-primary" />
        }
    ];

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="container py-16 max-w-4xl">
                <header className="mb-12 animate-fade-in">
                    <span className="news-category-badge mb-4 inline-block">Legal</span>
                    <h1 className="text-4xl font-heading font-black tracking-tight text-foreground mb-4 uppercase">
                        Termos de Uso
                    </h1>
                    <p className="text-muted-foreground leading-relaxed">
                        Última actualização: 21 de Fevereiro de 2026
                    </p>
                </header>

                <div className="prose prose-zinc dark:prose-invert max-w-none mb-12 animate-fade-in">
                    <p className="text-lg leading-relaxed text-foreground/80">
                        Bem-vindo ao Sem Filtros. Ao utilizar os nossos serviços, o utilizador aceita as condições abaixo descritas. Estes termos visam garantir uma experiênca segura e informativa para todos os nossos leitores.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
                    {sections.map((section, index) => (
                        <div key={index} className="p-6 bg-secondary border border-border rounded-xl">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-background rounded-full flex items-center justify-center shadow-sm">
                                    {section.icon}
                                </div>
                                <h3 className="font-heading font-bold text-foreground">{section.title}</h3>
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed italic">
                                {section.content}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="mt-16 p-8 bg-primary/5 border border-primary/10 rounded-2xl animate-fade-in">
                    <h2 className="text-xl font-heading font-bold text-foreground mb-4">Dúvidas ou Esclarecimentos?</h2>
                    <p className="text-muted-foreground mb-4">
                        Se tiver qualquer questão sobre os nossos termos de uso, não hesite em contactar-nos.
                    </p>
                    <a
                        href="mailto:angolasemfiltros@gmail.com"
                        className="text-primary font-bold hover:underline"
                    >
                        angolasemfiltros@gmail.com
                    </a>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default TermsPage;
