import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SEOMetadata } from "@/components/SEOMetadata";
import { useNavigate } from "react-router-dom";
import { Search, CheckCircle2, XCircle, AlertTriangle, FileSearch, ChevronRight, ExternalLink } from "lucide-react";

const FactCheckingPage = () => {
    const navigate = useNavigate();

    const methodology = [
        {
            step: "1",
            title: "Identificação da Informação",
            desc: "Identificamos alegações que circulam nas redes sociais, em comunicados oficiais ou em declarações de figuras públicas que necessitem de verificação factual.",
            icon: <Search className="w-5 h-5" />
        },
        {
            step: "2",
            title: "Pesquisa de Fontes Primárias",
            desc: "Consultamos documentos oficiais, relatórios estatísticos, bases de dados públicas e arquivos jornalísticos para obter dados verificáveis.",
            icon: <FileSearch className="w-5 h-5" />
        },
        {
            step: "3",
            title: "Contacto com Especialistas",
            desc: "Ouvimos economistas, juristas, médicos, cientistas e outros especialistas independentes para contextualizar e validar a informação.",
            icon: <CheckCircle2 className="w-5 h-5" />
        },
        {
            step: "4",
            title: "Direito de Resposta",
            desc: "Sempre que uma entidade ou pessoa é referenciada no fact-checking, é-lhe concedido o direito de resposta antes da publicação.",
            icon: <AlertTriangle className="w-5 h-5" />
        },
        {
            step: "5",
            title: "Classificação e Publicação",
            desc: "A informação é classificada segundo a nossa escala e o artigo publicado com total transparência sobre as fontes consultadas.",
            icon: <CheckCircle2 className="w-5 h-5" />
        },
    ];

    const classifications = [
        { label: "Verdadeiro", color: "bg-green-500", textColor: "text-green-600 dark:text-green-400", desc: "A informação é confirmada por múltiplas fontes primárias fidedignas." },
        { label: "Maioritariamente Verdadeiro", color: "bg-lime-500", textColor: "text-lime-600 dark:text-lime-400", desc: "A informação é essencialmente correcta mas contém imprecisões ou contexto omisso." },
        { label: "Enganador", color: "bg-yellow-500", textColor: "text-yellow-600 dark:text-yellow-400", desc: "O facto pode ser verdadeiro mas está apresentado de forma a induzir em erro." },
        { label: "Falso", color: "bg-red-500", textColor: "text-red-600 dark:text-red-400", desc: "A informação é factualmente incorrecta e contradiz fontes verificáveis." },
        { label: "Sem Provas Suficientes", color: "bg-zinc-500", textColor: "text-zinc-600 dark:text-zinc-400", desc: "Não existem provas suficientes para confirmar ou negar a alegação." },
    ];

    return (
        <div className="min-h-screen bg-background">
            <SEOMetadata
                title="Fact-Checking | Sem Filtros — Verificação de Factos em Angola"
                description="Conheça a metodologia de verificação de factos do Sem Filtros. Como verificamos informações, como classificamos alegações e quais as fontes que consultamos."
                url="https://www.semfiltros.com/fact-checking"
                type="website"
            />
            <Header />

            <main className="container py-16 max-w-4xl">
                {/* Breadcrumbs */}
                <nav aria-label="breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground mb-10">
                    <button onClick={() => navigate("/")} className="hover:text-primary transition-colors">Início</button>
                    <ChevronRight className="w-3 h-3" />
                    <span className="text-foreground font-medium">Fact-Checking</span>
                </nav>

                <header className="mb-14 animate-fade-in">
                    <span className="news-category-badge mb-4 inline-block">Verificação de Factos</span>
                    <h1 className="text-4xl sm:text-5xl font-heading font-black tracking-tight text-foreground mb-6 leading-tight">
                        Fact-Checking — Como Verificamos a Informação
                    </h1>
                    <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl">
                        Num ambiente mediático saturado de desinformação, o Sem Filtros comprometeu-se a verificar
                        sistematicamente as informações que publica e a denunciar as falsidades que circulam nas redes.
                    </p>
                </header>

                <article className="space-y-14 animate-fade-in">

                    {/* O que é fact-checking */}
                    <section>
                        <h2 className="text-2xl font-heading font-bold text-foreground mb-6">O que é o Fact-Checking?</h2>
                        <div className="prose prose-zinc dark:prose-invert max-w-none text-justify space-y-4">
                            <p className="text-foreground/80 leading-relaxed">
                                O fact-checking, ou verificação de factos, é o processo jornalístico de confrontar alegações públicas —
                                sejam de políticos, empresários, meios de comunicação ou virais nas redes sociais — com fontes primárias
                                verificáveis. O objectivo não é atacar quem erra, mas garantir que a desinformação não prospere.
                            </p>
                            <p className="text-foreground/80 leading-relaxed">
                                Em Angola, a desinformação é um problema crítico que afecta decisões políticas, comportamentos sociais e
                                a percepção pública sobre temas como saúde, economia e governação. O Sem Filtros investiu na criação de
                                uma secção dedicada à verificação de factos para combater este fenómeno de forma sistemática.
                            </p>
                            <p className="text-foreground/80 leading-relaxed">
                                A nossa equipa de verificação é independente do restante processo editorial e segue padrões internacionais
                                estabelecidos pela{" "}
                                <a
                                    href="https://ifcncodeofprinciples.poynter.org/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary hover:underline inline-flex items-center gap-1"
                                >
                                    IFCN — International Fact-Checking Network <ExternalLink className="w-3 h-3" />
                                </a>.
                            </p>
                        </div>
                    </section>

                    {/* Metodologia */}
                    <section>
                        <h2 className="text-2xl font-heading font-bold text-foreground mb-8">A Nossa Metodologia</h2>
                        <div className="space-y-4">
                            {methodology.map((step, i) => (
                                <div key={i} className="flex gap-4 p-6 bg-secondary border border-border rounded-xl">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-black font-heading flex-shrink-0 text-sm">
                                        {step.step}
                                    </div>
                                    <div>
                                        <h3 className="font-heading font-bold text-foreground mb-1">{step.title}</h3>
                                        <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Classificações */}
                    <section>
                        <h2 className="text-2xl font-heading font-bold text-foreground mb-6">Escala de Classificação</h2>
                        <p className="text-muted-foreground mb-8">
                            Utilizamos uma escala de cinco níveis para classificar a veracidade das alegações verificadas:
                        </p>
                        <div className="space-y-3">
                            {classifications.map((c, i) => (
                                <div key={i} className="flex items-start gap-4 p-4 bg-secondary border border-border rounded-lg">
                                    <span className={`w-3 h-3 rounded-full ${c.color} flex-shrink-0 mt-1`} />
                                    <div>
                                        <span className={`font-bold text-sm ${c.textColor}`}>{c.label}</span>
                                        <p className="text-xs text-muted-foreground mt-0.5">{c.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Fontes */}
                    <section>
                        <h2 className="text-2xl font-heading font-bold text-foreground mb-6">Fontes que Consultamos</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[
                                "Instituto Nacional de Estatística de Angola (INE)",
                                "Banco Nacional de Angola (BNA)",
                                "Tribunal Constitucional de Angola",
                                "Assembleia Nacional de Angola",
                                "Ministérios do Governo angolano",
                                "Organização Mundial da Saúde (OMS)",
                                "Banco Mundial e FMI — relatórios por país",
                                "Transparência Internacional",
                                "Reuters, AFP e Associated Press",
                                "Documentos oficiais e diário da república"
                            ].map((s, i) => (
                                <div key={i} className="flex items-center gap-2 p-3 bg-secondary/50 rounded-lg border border-border/50">
                                    <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                                    <span className="text-sm text-foreground/80">{s}</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Limitações */}
                    <section className="p-8 bg-yellow-500/5 border border-yellow-500/20 rounded-2xl">
                        <div className="flex items-center gap-3 mb-4">
                            <AlertTriangle className="w-6 h-6 text-yellow-500" />
                            <h2 className="text-xl font-heading font-bold text-foreground">As Nossas Limitações</h2>
                        </div>
                        <div className="prose prose-zinc dark:prose-invert max-w-none text-justify">
                            <p className="text-foreground/80 leading-relaxed">
                                O Sem Filtros reconhece que o fact-checking tem limitações. Nem sempre é possível verificar todas as alegações
                                que chegam à nossa redacção. Em Angola, o acesso a dados estatísticos actualizados e a documentos oficiais
                                é frequentemente difícil ou impossível. Quando não temos certeza suficiente, optamos por não publicar ou por
                                classificar como "Sem Provas Suficientes" até obtermos mais informação.
                            </p>
                        </div>
                    </section>

                    {/* Denuncia */}
                    <section className="p-8 bg-primary/5 border border-primary/15 rounded-2xl text-center">
                        <h2 className="text-xl font-heading font-bold text-foreground mb-4">Submeta uma Alegação para Verificação</h2>
                        <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                            Encontrou uma informação suspeita? Partilhe connosco e a nossa equipa verificará a sua veracidade.
                        </p>
                        <a
                            href="mailto:redaccao@semfiltros.com"
                            className="inline-block px-6 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors"
                        >
                            redaccao@semfiltros.com
                        </a>
                    </section>
                </article>
            </main>

            <Footer />
        </div>
    );
};

export default FactCheckingPage;
