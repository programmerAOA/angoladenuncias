import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SEOMetadata } from "@/components/SEOMetadata";
import { useNavigate } from "react-router-dom";
import { Target, Eye, Shield, Newspaper, ChevronRight } from "lucide-react";

const AboutPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-background">
            <SEOMetadata
                title="Sobre Nós | Sem Filtros — Portal de Notícias de Angola"
                description="Conheça a missão, visão e equipa editorial do Sem Filtros, o portal de jornalismo independente e investigativo dedicado à verdade em Angola."
                url="https://www.semfiltros.com/sobre-nos"
                type="website"
            />
            <Header />

            <main className="container py-16 max-w-4xl">
                {/* Breadcrumbs */}
                <nav aria-label="breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground mb-10">
                    <button onClick={() => navigate("/")} className="hover:text-primary transition-colors">Início</button>
                    <ChevronRight className="w-3 h-3" />
                    <span className="text-foreground font-medium">Sobre Nós</span>
                </nav>

                <header className="mb-14 animate-fade-in">
                    <span className="news-category-badge mb-4 inline-block">Institucional</span>
                    <h1 className="text-4xl sm:text-5xl font-heading font-black tracking-tight text-foreground mb-6 leading-tight">
                        Sobre o Sem Filtros
                    </h1>
                    <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl">
                        Somos um portal de jornalismo independente e investigativo dedicado a informar os angolanos
                        com rigor, transparência total e responsabilidade cidadã, salvaguardando em primeiro lugar o bem-estar do povo.
                    </p>
                </header>

                <article className="space-y-14 animate-fade-in">

                    {/* Missão */}
                    <section>
                        <div className="flex items-center gap-3 mb-6">
                            <Target className="w-6 h-6 text-primary flex-shrink-0" />
                            <h2 className="text-2xl font-heading font-bold text-foreground">A Nossa Missão</h2>
                        </div>
                        <div className="prose prose-zinc dark:prose-invert max-w-none text-justify">
                            <p className="text-foreground/80 leading-relaxed text-lg">
                                O <strong>Sem Filtros</strong> nasceu da convicção de que Angola merece um jornalismo livre, crítico, transparente e sem autocensura.
                                A nossa missão é publicar a verdade crua, documentar os factos com rigor investigativo e dar voz aos cidadãos angolanos.
                            </p>
                            <p className="text-foreground/80 leading-relaxed text-lg mt-4">
                                Em Angola, o Sem Filtros posiciona-se como uma plataforma de escrutínio rigoroso. O nosso único compromisso é com o leitor, com o bem-estar do povo angolano e com a denúncia de irregularidades que afetem a sociedade.
                            </p>
                            <p className="text-foreground/80 leading-relaxed text-lg mt-4">
                                Acreditamos que cidadãos informados com transparência constroem uma sociedade mais justa. Por isso, trabalhamos diariamente para produzir análises sem filtros que fiscalizem a gestão pública e protejam o interesse coletivo.
                            </p>
                        </div>
                    </section>

                    {/* Visão */}
                    <section>
                        <div className="flex items-center gap-3 mb-6">
                            <Eye className="w-6 h-6 text-primary flex-shrink-0" />
                            <h2 className="text-2xl font-heading font-bold text-foreground">A Nossa Visão</h2>
                        </div>
                        <div className="p-8 bg-primary/5 border-l-4 border-primary rounded-r-xl">
                            <p className="text-foreground/90 leading-relaxed text-lg italic">
                                "Ser a voz independente e intransigente na defesa dos direitos do povo angolano, promovendo a transparência, a prestação de contas e a verdade sem rodeios."
                            </p>
                        </div>
                        <div className="prose prose-zinc dark:prose-invert max-w-none text-justify mt-6">
                            <p className="text-foreground/80 leading-relaxed">
                                Queremos ser reconhecidos pelo rigor investigativo e pela coragem editorial.
                                Cada artigo publicado no Sem Filtros passa por um processo rigoroso de verificação de factos e cruzamento de fontes primárias.
                                Os erros são corrigidos publicamente e de forma transparente, conforme estabelecido na nossa{" "}
                                <button onClick={() => navigate("/correcoes")} className="text-primary hover:underline font-semibold">
                                    Política de Correções
                                </button>.
                            </p>
                        </div>
                    </section>

                    {/* Valores */}
                    <section>
                        <div className="flex items-center gap-3 mb-6">
                            <Shield className="w-6 h-6 text-primary flex-shrink-0" />
                            <h2 className="text-2xl font-heading font-bold text-foreground">Os Nossos Valores</h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {[
                                { title: "Bem-Estar do Povo", desc: "Colocamos as necessidades, direitos e dignidade dos cidadãos angolanos acima de quaisquer interesses políticos ou corporativos." },
                                { title: "Análise Sem Filtros", desc: "Examinamos os factos sem floreados ou propaganda, oferecendo leituras transparentes e críticas sobre a realidade." },
                                { title: "Fiscalização da Causa Pública", desc: "Escrutinamos rigorosamente a governação e a gestão dos recursos públicos para combater a corrupção e os abusos." },
                                { title: "Rigor Factual", desc: "Todos os factos são checados e cruzados com fontes primárias antes de qualquer publicação." },
                                { title: "Independência Absoluta", desc: "Não aceitamos financiamentos nem pressões que condicionem a nossa autonomia editorial." },
                                { title: "Transparência Total", desc: "Identificamos claramente os factos, revelando o contexto completo e assumindo correções de forma aberta." },
                            ].map((v, i) => (
                                <div key={i} className="p-6 bg-secondary border border-border rounded-xl">
                                    <h3 className="font-heading font-bold text-foreground mb-2">{v.title}</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* História */}
                    <section>
                        <div className="flex items-center gap-3 mb-6">
                            <Newspaper className="w-6 h-6 text-primary flex-shrink-0" />
                            <h2 className="text-2xl font-heading font-bold text-foreground">A Nossa História</h2>
                        </div>
                        <div className="prose prose-zinc dark:prose-invert max-w-none text-justify space-y-4">
                            <p className="text-foreground/80 leading-relaxed">
                                O Sem Filtros foi fundado em 2024 por um grupo de profissionais angolanos com a missão de elevar 
                                o nível do debate público no país. Focámo-nos desde o início numa linha editorial contributiva, destacando soluções 
                                e avanços num panorama que precisava de perspectivas mais construtivas.
                            </p>
                            <p className="text-foreground/80 leading-relaxed">
                                Em poucos meses, o portal ganhou projecção nas redes sociais e tornou-se numa das referências de informação
                                independente para os angolanos dentro e fora do país. A diáspora angolana encontrou no Sem Filtros uma janela
                                fidedigna para os acontecimentos que moldam a Angola de hoje.
                            </p>
                            <p className="text-foreground/80 leading-relaxed">
                                Hoje, o Sem Filtros publica diariamente conteúdo sobre política, economia, sociedade, saúde e cultura,
                                sempre com o compromisso de informar com honestidade e de servir o interesse público angolano acima de qualquer outro.
                            </p>
                        </div>
                    </section>

                    {/* CTA */}
                    <section className="p-8 bg-zinc-900 border border-zinc-700 rounded-2xl text-center">
                        <h2 className="text-2xl font-heading font-bold text-white mb-4">Junte-se à Comunidade Sem Filtros</h2>
                        <p className="text-zinc-400 mb-8 max-w-xl mx-auto">
                            Siga o nosso trabalho, partilhe os nossos artigos e faça parte de uma comunidade que valoriza o jornalismo independente.
                        </p>
                        <div className="flex flex-wrap gap-4 justify-center">
                            <button
                                onClick={() => navigate("/")}
                                className="px-6 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors"
                            >
                                Ler as Últimas Notícias
                            </button>
                            <button
                                onClick={() => navigate("/equipa-editorial")}
                                className="px-6 py-3 border border-zinc-600 text-white font-bold rounded-lg hover:bg-white/5 transition-colors"
                            >
                                Conhecer a Equipa
                            </button>
                        </div>
                    </section>
                </article>
            </main>

            <Footer />
        </div>
    );
};

export default AboutPage;
