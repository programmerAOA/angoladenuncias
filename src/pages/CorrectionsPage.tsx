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

                    <section className="p-8 bg-primary/5 border border-primary/15 rounded-2xl text-center">
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <AlertCircle className="w-6 h-6 text-primary" />
                            <h2 className="text-xl font-heading font-bold text-foreground">Encontrou um Erro?</h2>
                        </div>
                        <p className="text-muted-foreground mb-6 leading-relaxed max-w-xl mx-auto">
                            Se identificou um erro factual, uma informação desactualizada ou qualquer imprecisão nos nossos artigos,
                            pedimos que nos contacte. A sua contribuição é essencial para mantermos os padrões editoriais que nos comprometemos a cumprir.
                        </p>
                        <div className="flex justify-center">
                            <a
                                href="https://wa.me/244952679780"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#25D366] text-white font-bold rounded-lg hover:bg-[#20ba5a] transition-colors"
                            >
                                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.458L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436.002 9.858-4.42 9.86-9.86.002-2.63-1.023-5.102-2.884-6.964a9.782 9.782 0 00-6.956-2.88c-5.433 0-9.859 4.417-9.863 9.857-.001 1.8.49 3.559 1.42 5.11L1.936 21.08l5.215-1.366zM15.86 12.59c-.312-.156-1.848-.91-2.128-1.012-.281-.102-.485-.156-.689.156-.204.311-.79.1-.96.115-.17.015-.34-.062-.653-.218-1.32-.526-2.308-1.52-2.83-2.422-.156-.268-.017-.414.118-.549.12-.12.28-.328.42-.492.14-.164.186-.28.28-.468.093-.188.047-.353-.023-.509-.07-.156-.689-1.66-.944-2.274-.25-.6-.505-.519-.689-.527-.179-.008-.383-.01-.587-.01s-.536.078-.816.383c-.28.305-1.072 1.047-1.072 2.553 0 1.506 1.097 2.96 1.248 3.166.15.206 2.16 3.3 5.23 4.624.73.315 1.298.503 1.743.644.733.233 1.4.2 1.929.122.589-.089 1.848-.755 2.11-.1.263-.733.263-1.288.188-1.396-.075-.108-.28-.156-.593-.312z" />
                                </svg>
                                <span>WhatsApp: +244 952 679 780</span>
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
