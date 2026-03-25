import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Megaphone, Layout, FileText, Share2, Users, Mail, ArrowRight } from "lucide-react";

const AdvertisingPage = () => {
    const offerings = [
        {
            title: "Banners no Site",
            description: "Posicionamentos estratégicos na página inicial e em todas as páginas de notícias para máxima visibilidade.",
            icon: <Layout className="w-6 h-6 text-primary" />
        },
        {
            title: "Publicidade em Artigos",
            description: "Integração natural da sua marca dentro do conteúdo editorial mais relevante para o seu público.",
            icon: <FileText className="w-6 h-6 text-primary" />
        },
        {
            title: "Conteúdos Patrocinados",
            description: "Artigos dedicados escritos pela nossa equipa ou fornecidos pela sua marca para contar a sua história.",
            icon: <Megaphone className="w-6 h-6 text-primary" />
        },
        {
            title: "Divulgação nas Redes Sociais",
            description: "Amplificação da sua mensagem através dos nossos canais oficiais no Facebook, Instagram e Twitter.",
            icon: <Share2 className="w-6 h-6 text-primary" />
        },
        {
            title: "Parcerias de Média",
            description: "Colaborações a longo prazo para cobertura de eventos e projectos especiais com impacto nacional.",
            icon: <Users className="w-6 h-6 text-primary" />
        }
    ];

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="container py-16 max-w-4xl">
                <header className="text-center mb-16 animate-fade-in">
                    <span className="news-category-badge mb-4 inline-block">Publicidade & Parcerias</span>
                    <h1 className="text-4xl sm:text-5xl font-heading font-black tracking-tight text-foreground mb-6 uppercase">
                        Anuncie no Sem Filtros
                    </h1>
                    <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                        Alcance uma audiência qualificada, influente e interessada na actualidade de Angola através de soluções de publicidade personalizadas.
                    </p>
                </header>

                <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
                    {offerings.map((item, index) => (
                        <div
                            key={index}
                            className="p-6 bg-secondary border border-border hover:border-primary/50 transition-all group animate-fade-in"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <div className="mb-4 bg-background w-12 h-12 flex items-center justify-center rounded-lg shadow-sm group-hover:scale-110 transition-transform">
                                {item.icon}
                            </div>
                            <h3 className="text-xl font-heading font-bold text-foreground mb-2">{item.title}</h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                                {item.description}
                            </p>
                        </div>
                    ))}
                </section>

                <section className="bg-primary text-primary-foreground p-8 sm:p-12 rounded-2xl relative overflow-hidden shadow-2xl animate-fade-in">
                    {/* Decorative background element */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" />

                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="text-center md:text-left">
                            <h2 className="text-3xl font-heading font-black mb-4 uppercase tracking-tight">
                                Solicite Proposta
                            </h2>
                            <p className="text-primary-foreground/80 mb-0 max-w-md">
                                Para solicitar a nossa tabela de preços (Media Kit) ou propostas personalizadas, entre em contacto com o nosso departamento comercial.
                            </p>
                        </div>

                        <a
                            href="mailto:angolasemfiltros@gmail.com"
                            className="bg-primary text-white px-8 py-3 rounded-full font-heading font-semibold hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl"
                        >
                            angolasemfiltros@gmail.com
                        </a>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default AdvertisingPage;
