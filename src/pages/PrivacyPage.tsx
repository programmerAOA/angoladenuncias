import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Cookie, Eye, Lock, MessageSquare, Database, Trash2 } from "lucide-react";

const PrivacyPage = () => {
    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="container py-16 max-w-4xl">
                <header className="mb-12 animate-fade-in">
                    <span className="news-category-badge mb-4 inline-block">Legal</span>
                    <h1 className="text-4xl font-heading font-black tracking-tight text-foreground mb-4 uppercase">
                        Política de Privacidade
                    </h1>
                    <p className="text-muted-foreground leading-relaxed">
                        Última actualização: 21 de Fevereiro de 2026
                    </p>
                </header>

                <section className="space-y-12 animate-fade-in">
                    <div className="prose prose-zinc dark:prose-invert max-w-none">
                        <p className="text-lg leading-relaxed text-foreground/80">
                            O **Sem Filtros** respeita a privacidade dos utilizadores. Esta política descreve como tratamos as suas informações pessoais e asseguramos a sua protecção.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-2xl font-heading font-bold text-foreground mb-6 flex items-center gap-3">
                            <Database className="w-6 h-6 text-primary" />
                            O que recolhemos
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            <div className="p-5 bg-secondary rounded-xl border border-border">
                                <Cookie className="w-6 h-6 text-primary mb-3" />
                                <h4 className="font-bold mb-2">Cookies</h4>
                                <p className="text-xs text-muted-foreground">Dados de navegação para melhorar a performance e experiência.</p>
                            </div>
                            <div className="p-5 bg-secondary rounded-xl border border-border">
                                <MessageSquare className="w-6 h-6 text-primary mb-3" />
                                <h4 className="font-bold mb-2">Voluntário</h4>
                                <p className="text-xs text-muted-foreground">Informações fornecidas (email, mensagens, comentários).</p>
                            </div>
                            <div className="p-5 bg-secondary rounded-xl border border-border">
                                <Eye className="w-6 h-6 text-primary mb-3" />
                                <h4 className="font-bold mb-2">Melhoria</h4>
                                <p className="text-xs text-muted-foreground">Dados analíticos para entender as preferências dos leitores.</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 bg-zinc-900 border border-zinc-800 rounded-2xl text-white">
                        <h2 className="text-2xl font-heading font-bold mb-6 flex items-center gap-3">
                            <Lock className="w-6 h-6 text-green-500" />
                            Segurança e Uso
                        </h2>
                        <p className="text-zinc-400 mb-6">
                            Os dados não são vendidos a terceiros e são utilizados rigorosamente para:
                        </p>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <li className="flex items-center gap-3 text-sm">
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full" /> Comunicação directa com o utilizador
                            </li>
                            <li className="flex items-center gap-3 text-sm">
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full" /> Medidas de segurança e protecção
                            </li>
                            <li className="flex items-center gap-3 text-sm">
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full" /> Estatísticas internas de audiência
                            </li>
                            <li className="flex items-center gap-3 text-sm">
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full" /> Melhoria contínua do serviço editorial
                            </li>
                        </ul>
                    </div>

                    <div className="p-8 border border-red-500/20 bg-red-500/5 rounded-2xl">
                        <h2 className="text-2xl font-heading font-bold text-foreground mb-4 flex items-center gap-3">
                            <Trash2 className="w-6 h-6 text-red-500" />
                            Os Seus Direitos
                        </h2>
                        <p className="text-muted-foreground leading-relaxed">
                            O utilizador tem total controlo sobre os seus dados. Pode solicitar a **remoção total** das suas informações ou histórico a qualquer momento, bastando enviar um email para o nosso suporte técnico.
                        </p>
                        <div className="mt-6">
                            <a
                                href="mailto:geral@angolasemfiltros.com"
                                className="inline-block px-6 py-3 bg-red-500 text-white rounded-lg font-bold hover:bg-red-600 transition-colors"
                            >
                                Solicitar Remoção de Dados
                            </a>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default PrivacyPage;
