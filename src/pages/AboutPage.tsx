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
                        Somos um portal de jornalismo independente, crítico e investigativo dedicado a informar os angolanos
                        com rigor, transparência e sem qualquer filtro ideológico ou comercial.
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
                                O <strong>Sem Filtros</strong> nasceu da convicção de que Angola merece um jornalismo livre, responsável e sem autocensura.
                                A nossa missão é simples: publicar a verdade, documentar os factos e dar voz aos cidadãos que raramente aparecem
                                nas páginas dos meios de comunicação convencionais.
                            </p>
                            <p className="text-foreground/80 leading-relaxed text-lg mt-4">
                                Em Angola, onde a informação é frequentemente controlada por interesses políticos e económicos, o Sem Filtros
                                posiciona-se como uma alternativa editorial independente. Não somos afiliados a nenhum partido político,
                                grupo empresarial ou governo. O nosso único compromisso é com o leitor e com a verdade dos factos.
                            </p>
                            <p className="text-foreground/80 leading-relaxed text-lg mt-4">
                                Acreditamos que cidadãos bem informados constroem democracias mais sólidas. Por isso, trabalhamos todos os dias
                                para produzir artigos aprofundados, investigações exclusivas e análises críticas que sirvam o interesse público
                                e promovam a transparência nas instituições angolanas.
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
                                "Ser a referência de jornalismo independente e investigativo em Angola, contribuindo para uma
                                sociedade mais informada, mais crítica e mais exigente com o poder."
                            </p>
                        </div>
                        <div className="prose prose-zinc dark:prose-invert max-w-none text-justify mt-6">
                            <p className="text-foreground/80 leading-relaxed">
                                Queremos ser reconhecidos não pela rapidez na publicação, mas pela qualidade, profundidade e rigor editorial.
                                Cada artigo publicado no Sem Filtros passa por um processo de verificação interna antes de ser disponibilizado ao público.
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
                                { title: "Independência", desc: "Não recebemos financiamento de partidos políticos, governos ou grupos empresariais com interesses editoriais." },
                                { title: "Rigor Factual", desc: "Todos os factos publicados são verificados junto de fontes primárias ou documentos oficiais antes da publicação." },
                                { title: "Transparência", desc: "Identificamos sempre as nossas fontes quando possível. Quando usamos fontes confidenciais, explicamos o porquê." },
                                { title: "Responsabilidade", desc: "Corrigimos os nossos erros abertamente e sem hesitação. O leitor tem o direito de ser bem informado." },
                                { title: "Pluralismo", desc: "Damos espaço a diferentes perspectivas e vozes, garantindo um debate plural e enriquecedor." },
                                { title: "Interesse Público", desc: "Priorizamos temas que afectam directamente a vida dos angolanos: saúde, economia, direitos, segurança e governação." },
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
                                O Sem Filtros foi fundado em 2024 por um grupo de jornalistas angolanos frustrados com as limitações éditoriais
                                dos meios de comunicação tradicionais. Com recursos limitados mas com determinação inabalável, começámos a publicar
                                conteúdo online, focando em investigações que os outros jornais optavam por ignorar.
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
