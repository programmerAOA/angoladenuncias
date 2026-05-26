import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SEOMetadata } from "@/components/SEOMetadata";
import { Mail, Phone, MapPin } from "lucide-react";

const TechnicalSheetPage = () => {
    return (
        <div className="min-h-screen bg-background">
            <SEOMetadata
                title="Ficha Técnica e Contactos | Sem Filtros"
                description="Informações sobre a equipa e contactos oficiais do portal Sem Filtros."
            />
            <Header />
            <main className="container py-12 max-w-4xl">
                <h1 className="text-3xl font-heading font-black uppercase tracking-tighter border-b-4 border-primary pb-2 mb-8">
                    Ficha Técnica e Contactos
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12">
                    {/* Ficha Técnica */}
                    <div className="prose prose-sm dark:prose-invert">
                        <h3 className="text-xl font-bold border-b border-primary pb-2 mb-4">Ficha Técnica</h3>
                        <div className="space-y-4">
                            <div>
                                <p className="font-bold uppercase text-xs text-primary mb-0">Director Geral</p>
                                <p className="text-base">Ivan Lima</p>
                            </div>
                            <div>
                                <p className="font-bold uppercase text-xs text-primary mb-0">Redacção</p>
                                <p className="text-base shadow-sm">Equipa Sem Filtros</p>
                            </div>
                            <div>
                                <p className="font-bold uppercase text-xs text-primary mb-0">Propriedade</p>
                                <p className="text-base italic">Portal A Denúncia, Lda.</p>
                            </div>
                            <div>
                                <p className="font-bold uppercase text-xs text-primary mb-0">NIF</p>
                                <p className="text-base">5000984831</p>
                            </div>
                        </div>
                    </div>

                    {/* Contactos */}
                    <div className="space-y-8">
                        <h3 className="text-xl font-bold border-b border-primary pb-2 mb-4">Nossos Contactos</h3>

                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-primary/10 flex items-center justify-center rounded-full flex-shrink-0 text-primary">
                                <Mail className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="font-bold text-sm">E-mail</p>
                                <a href="mailto:angolasemfiltros@gmail.com" className="text-muted-foreground hover:text-primary transition-colors">
                                    angolasemfiltros@gmail.com
                                </a>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-primary/10 flex items-center justify-center rounded-full flex-shrink-0 text-primary">
                                <Phone className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="font-bold text-sm">WhatsApp / Telefone</p>
                                <a href="https://wa.me/244952679780" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                                    +244 952 679 780
                                </a>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-primary/10 flex items-center justify-center rounded-full flex-shrink-0 text-primary">
                                <MapPin className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="font-bold text-sm">Localização</p>
                                <p className="text-muted-foreground">
                                    Luanda, Angola
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default TechnicalSheetPage;
