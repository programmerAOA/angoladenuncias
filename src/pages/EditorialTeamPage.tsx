import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SEOMetadata } from "@/components/SEOMetadata";
import { useNavigate } from "react-router-dom";
import { Users, ChevronRight, Mail, Linkedin } from "lucide-react";

const team = [
    {
        name: "Marcelino da Costa Figueiredo",
        role: "Director Editorial",
        bio: "Jornalista com mais de 18 anos de experiência em jornalismo de investigação em Angola e no contexto africano. Formado em Ciências da Comunicação pela Universidade Agostinho Neto, especializou-se em jornalismo económico e político. Fundador do Sem Filtros em 2024.",
        specialties: ["Política", "Investigação", "Economia"],
        initials: "MF"
    },
    {
        name: "Ana Beatriz Soares Lemos",
        role: "Editora-Chefe",
        bio: "Responsável pela supervisão editorial diária do portal. Com formação em Jornalismo pela Universidade Católica de Angola e pós-graduação em Jornalismo Digital, tem experiência em coberturas internacionais para agências de notícias na África Subsaariana.",
        specialties: ["Edição", "Fact-Checking", "Gestão Editorial"],
        initials: "AL"
    },
    {
        name: "Eduardo Simões Nkosi",
        role: "Jornalista de Investigação",
        bio: "Especializou-se em investigação jornalística sobre corrupção, governação e finanças públicas em Angola. Colaborou com organizações internacionais de jornalismo investigativo como o OCCRP. Formado em Direito e Jornalismo.",
        specialties: ["Corrupção", "Finanças Públicas", "Direito"],
        initials: "EN"
    },
    {
        name: "Filomena Cardoso Augusto",
        role: "Jornalista — Sociedade e Saúde",
        bio: "Cobertura especializada em saúde pública, educação e questões sociais. Defende o jornalismo de proximidade como ferramenta de transformação social. Vencedora do Prémio Jornalismo Cidadão Angola 2022.",
        specialties: ["Saúde", "Educação", "Sociedade"],
        initials: "FA"
    },
    {
        name: "Rui António Bango Tchitembo",
        role: "Jornalista — Economia e Negócios",
        bio: "Economista de formação convertido ao jornalismo, traz uma perspectiva analítica única à cobertura da economia angolana. Especializado em mercados financeiros, petróleo, e impacto das políticas económicas no quotidiano dos angolanos.",
        specialties: ["Economia", "Petróleo", "Negócios"],
        initials: "RT"
    },
    {
        name: "Sónia Waleska Matias Paulo",
        role: "Responsável de Multimédia e Redes Sociais",
        bio: "Gestora da presença digital do Sem Filtros. Com experiência em produção audiovisual e estratégia de conteúdo, coordena a equipa de vídeo e a presença do portal nas redes sociais. Formada em Comunicação Digital.",
        specialties: ["Multimédia", "Redes Sociais", "Vídeo"],
        initials: "SP"
    },
];

const EditorialTeamPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-background">
            <SEOMetadata
                title="Equipa Editorial | Sem Filtros — Quem Faz o Jornalismo Angolano"
                description="Conheça a equipa de jornalistas e editores do Sem Filtros. Profissionais comprometidos com o jornalismo independente, rigoroso e ao serviço dos angolanos."
                url="https://www.semfiltros.com/equipa-editorial"
                type="website"
            />
            <Header />

            <main className="container py-16 max-w-5xl">
                {/* Breadcrumbs */}
                <nav aria-label="breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground mb-10">
                    <button onClick={() => navigate("/")} className="hover:text-primary transition-colors">Início</button>
                    <ChevronRight className="w-3 h-3" />
                    <span className="text-foreground font-medium">Equipa Editorial</span>
                </nav>

                <header className="mb-14 animate-fade-in">
                    <span className="news-category-badge mb-4 inline-block">Transparência</span>
                    <h1 className="text-4xl sm:text-5xl font-heading font-black tracking-tight text-foreground mb-6 leading-tight">
                        Equipa Editorial
                    </h1>
                    <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl">
                        Por detrás de cada artigo existe um jornalista dedicado. Acreditamos na transparência total
                        sobre quem faz as notícias e que responsabilidades tem cada elemento da nossa equipa.
                    </p>
                </header>

                <article className="space-y-14 animate-fade-in">

                    {/* Sobre a Equipa */}
                    <section>
                        <div className="flex items-center gap-3 mb-6">
                            <Users className="w-6 h-6 text-primary" />
                            <h2 className="text-2xl font-heading font-bold text-foreground">A Nossa Redacção</h2>
                        </div>
                        <div className="prose prose-zinc dark:prose-invert max-w-none text-justify space-y-4">
                            <p className="text-foreground/80 leading-relaxed">
                                A equipa editorial do Sem Filtros é composta por jornalistas angolanos com formação académica em comunicação,
                                direito, economia e ciências sociais. Todos partilham o compromisso com o jornalismo ético, independente e ao
                                serviço do interesse público.
                            </p>
                            <p className="text-foreground/80 leading-relaxed">
                                Não aceitamos pressões externas na nossa linha editorial. Cada elemento da equipa tem autonomia editorial
                                nas suas coberturas, sujeita apenas às directrizes de rigor factual e ao código de ética jornalística que
                                todos subscrevemos no início da nossa colaboração com o portal.
                            </p>
                        </div>
                    </section>

                    {/* Membros da Equipa */}
                    <section>
                        <h2 className="text-2xl font-heading font-bold text-foreground mb-8">Os Jornalistas</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {team.map((member, i) => (
                                <div
                                    key={i}
                                    className="p-6 bg-secondary border border-border rounded-2xl animate-fade-in"
                                    style={{ animationDelay: `${i * 100}ms` }}
                                >
                                    <div className="flex items-start gap-4 mb-4">
                                        <div className="w-16 h-16 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center flex-shrink-0">
                                            <span className="text-xl font-black font-heading text-primary">{member.initials}</span>
                                        </div>
                                        <div>
                                            <h3 className="font-heading font-bold text-foreground text-lg leading-tight">{member.name}</h3>
                                            <p className="text-sm text-primary font-semibold mt-0.5">{member.role}</p>
                                        </div>
                                    </div>
                                    <p className="text-sm text-muted-foreground leading-relaxed mb-4 text-justify">
                                        {member.bio}
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {member.specialties.map((spec, j) => (
                                            <span key={j} className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full font-medium">
                                                {spec}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Código de Ética */}
                    <section>
                        <h2 className="text-2xl font-heading font-bold text-foreground mb-6">Código de Ética Editorial</h2>
                        <div className="space-y-3">
                            {[
                                "Nunca aceitar dinheiro, presentes ou benefícios de fontes ou entidades sobre as quais reportamos.",
                                "Revelar conflitos de interesse antes de cobrir temas onde existam interesses pessoais.",
                                "Nunca publicar informação não verificada por pelo menos uma fonte primária fidedigna.",
                                "Tratar todas as pessoas e instituições com equidade, independentemente da posição política ou social.",
                                "Dar sempre direito de resposta às entidades criticadas nos nossos artigos.",
                                "Proteger as fontes confidenciais e nunca as revelar mesmo sob pressão.",
                            ].map((rule, i) => (
                                <div key={i} className="flex items-start gap-3 p-4 bg-background border border-border rounded-lg">
                                    <span className="text-primary font-black text-sm mt-0.5 flex-shrink-0">{i + 1}.</span>
                                    <p className="text-sm text-foreground/80 leading-relaxed">{rule}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Contacto */}
                    <section className="p-8 bg-zinc-900 border border-zinc-700 rounded-2xl text-white">
                        <h2 className="text-xl font-heading font-bold mb-4">Contactar a Redacção</h2>
                        <p className="text-zinc-400 mb-6 leading-relaxed">
                            Para denúncias, sugestões de investigação, pedidos de imprensa ou qualquer questão editorial,
                            contacte-nos directamente:
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <a href="mailto:redaccao@semfiltros.com" className="flex items-center gap-3 p-4 bg-zinc-800 rounded-lg border border-zinc-700 hover:bg-zinc-700 transition-colors">
                                <Mail className="w-5 h-5 text-primary" />
                                <div>
                                    <div className="text-xs text-zinc-400">Email Editorial</div>
                                    <div className="text-sm font-semibold">redaccao@semfiltros.com</div>
                                </div>
                            </a>
                            <button onClick={() => navigate("/ficha-tecnica")} className="flex items-center gap-3 p-4 bg-zinc-800 rounded-lg border border-zinc-700 hover:bg-zinc-700 transition-colors text-left">
                                <Linkedin className="w-5 h-5 text-primary" />
                                <div>
                                    <div className="text-xs text-zinc-400">Ficha Técnica Completa</div>
                                    <div className="text-sm font-semibold">Ver Ficha Técnica →</div>
                                </div>
                            </button>
                        </div>
                    </section>
                </article>
            </main>

            <Footer />
        </div>
    );
};

export default EditorialTeamPage;
