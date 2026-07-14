import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SEOMetadata } from "@/components/SEOMetadata";
import { useNavigate } from "react-router-dom";
import { AlertCircle, ChevronRight, CheckCircle2, Clock } from "lucide-react";

const CorrectionsPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-background">
            <SEOMetadata
                title="Política de Correções | Sem Filtros — Transparência Editorial"
                description="O Sem Filtros compromete-se a corrigir erros de forma transparente e imediata. Conheça a nossa política editorial de rectificações e correcções."
                url="https://www.semfiltros.com/correcoes"
                type="website"
            />
            <Header />

            <main className="container py-16 max-w-4xl">
                {/* Breadcrumbs */}
                <nav aria-label="breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground mb-10">
                    <button onClick={() => navigate("/")} className="hover:text-primary transition-colors">Início</button>
                    <ChevronRight className="w-3 h-3" />
                    <span className="text-foreground font-medium">Correções</span>
                </nav>

                <header className="mb-14 animate-fade-in">
                    <span className="news-category-badge mb-4 inline-block">Institucional</span>
                    <h1 className="text-4xl sm:text-5xl font-heading font-black tracking-tight text-foreground mb-6 leading-tight">
                        Política de Correções
                    </h1>
                    <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl">
                        O Sem Filtros comete erros. Quando isso acontece, corrigimo-los aberta e imediatamente,
                        porque a credibilidade jornalística constrói-se sobre a honestidade — inclusive a honestidade de reconhecer falhas.
                    </p>
                </header>

                <article className="space-y-14 animate-fade-in">

                    <section>
                        <h2 className="text-2xl font-heading font-bold text-foreground mb-6">O Nosso Compromisso com a Exactidão</h2>
                        <div className="prose prose-zinc dark:prose-invert max-w-none text-justify space-y-4">
                            <p className="text-foreground/80 leading-relaxed">
                                A exactidão factual é o alicerce do jornalismo responsável. No Sem Filtros, todos os artigos passam por
                                um processo de revisão editorial antes da publicação. No entanto, erros acontecem: datas incorrectas,
                                nomes mal escritos, dados desactualizados ou interpretações imprecisas podem escapar ao processo de revisão.
                            </p>
                            <p className="text-foreground/80 leading-relaxed">
                                A nossa política é clara: quando um erro é identificado — seja por um leitor, por uma fonte ou pela
                                redacção — agimos imediatamente para o corrigir. A correcção é feita no próprio artigo, com indicação
                                clara da alteração realizada, para que os leitores que já tenham lido o conteúdo saibam que houve uma rectificação.
                            </p>
                        </div>
                    </section>

                    {/* Tipos de Correcção */}
                    <section>
                        <h2 className="text-2xl font-heading font-bold text-foreground mb-6">Tipos de Rectificações</h2>
                        <div className="space-y-4">
                            {[
                                {
                                    type: "Correcção Factual",
                                    desc: "Quando publicamos um facto errado (data, número, nome, declaração). O facto é corrigido e é adicionada uma nota no artigo a explicar a correcção.",
                                    severity: "Alta",
                                    color: "border-red-500/30 bg-red-500/5"
                                },
                                {
                                    type: "Actualização Editorial",
                                    desc: "Quando novos desenvolvimentos alteram o contexto ou significado de uma notícia já publicada. O artigo é actualizado com a nova informação.",
                                    severity: "Média",
                                    color: "border-yellow-500/30 bg-yellow-500/5"
                                },
                                {
                                    type: "Rectificação de Formatação ou Estilo",
                                    desc: "Erros tipográficos, gramaticais ou de formatação que não alteram o sentido factual do artigo. São corrigidos silenciosamente.",
                                    severity: "Baixa",
                                    color: "border-blue-500/30 bg-blue-500/5"
                                },
                                {
                                    type: "Remoção de Conteúdo",
                                    desc: "Em casos excepcionais (conteúdo que viola privacidade, decisões judiciais ou falsidades graves), o conteúdo pode ser removido. Este procedimento é sempre explicado.",
                                    severity: "Crítica",
                                    color: "border-zinc-800/50 bg-zinc-900/30"
                                }
                            ].map((item, i) => (
                                <div key={i} className={`p-6 border rounded-xl ${item.color}`}>
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="font-heading font-bold text-foreground">{item.type}</h3>
                                        <span className="text-xs text-muted-foreground uppercase tracking-wider font-mono">{item.severity}</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Processo */}
                    <section>
                        <h2 className="text-2xl font-heading font-bold text-foreground mb-6">Processo de Correcção</h2>
                        <div className="space-y-3">
                            {[
                                { step: "1", action: "O erro é identificado (por leitor, fonte ou redacção)" },
                                { step: "2", action: "O editor responsável verifica e confirma o erro" },
                                { step: "3", action: "O artigo é corrigido no prazo de 24 horas (correcções urgentes são imediatas)" },
                                { step: "4", action: "É adicionada uma nota de correcção visível no artigo" },
                                { step: "5", action: "O leitor que reportou é notificado por email, quando aplicável" },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-4 p-4 bg-secondary border border-border rounded-lg">
                                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm flex-shrink-0">
                                        {item.step}
                                    </div>
                                    <p className="text-sm text-foreground/80">{item.action}</p>
                                    <CheckCircle2 className="w-4 h-4 text-green-500 ml-auto flex-shrink-0" />
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Tempo de Resposta */}
                    <section className="p-6 bg-secondary border border-border rounded-xl">
                        <div className="flex items-center gap-3 mb-4">
                            <Clock className="w-5 h-5 text-primary" />
                            <h2 className="text-lg font-heading font-bold text-foreground">Prazos de Resposta</h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="text-center p-4 bg-background rounded-lg border border-border">
                                <div className="text-2xl font-black text-primary mb-1">1h</div>
                                <div className="text-xs text-muted-foreground">Erros factuais graves</div>
                            </div>
                            <div className="text-center p-4 bg-background rounded-lg border border-border">
                                <div className="text-2xl font-black text-primary mb-1">24h</div>
                                <div className="text-xs text-muted-foreground">Correcções editoriais</div>
                            </div>
                            <div className="text-center p-4 bg-background rounded-lg border border-border">
                                <div className="text-2xl font-black text-primary mb-1">48h</div>
                                <div className="text-xs text-muted-foreground">Resposta ao leitor</div>
                            </div>
                        </div>
                    </section>

                    {/* Reportar Erro */}
                    <section className="p-8 bg-primary/5 border border-primary/15 rounded-2xl">
                        <div className="flex items-center gap-3 mb-4">
                            <AlertCircle className="w-6 h-6 text-primary" />
                            <h2 className="text-xl font-heading font-bold text-foreground">Encontrou um Erro?</h2>
                        </div>
                        <p className="text-muted-foreground mb-6 leading-relaxed">
                            Se identificou um erro factual, uma informação desactualizada ou qualquer imprecisão nos nossos artigos,
                            pedimos que nos contacte. A sua contribuição é essencial para mantermos os padrões editoriais que nos comprometemos a cumprir.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <a
                                href="mailto:correcoes@semfiltros.com"
                                className="px-6 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors"
                            >
                                correcoes@semfiltros.com
                            </a>
                            <a
                                href="https://wa.me/244900000000"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-6 py-3 border border-border text-foreground font-bold rounded-lg hover:bg-secondary transition-colors"
                            >
                                WhatsApp Editorial
                            </a>
                        </div>
                    </section>
                </article>
            </main>

            <Footer />
        </div>
    );
};

export default CorrectionsPage;
