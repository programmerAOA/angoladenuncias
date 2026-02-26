import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Cookie, X, CheckCircle2 } from "lucide-react";

const CookieConsent = () => {
    const [showBanner, setShowBanner] = useState(false);

    useEffect(() => {
        const savedConsent = localStorage.getItem("cookie-consent");
        if (!savedConsent) {
            setShowBanner(true);
        }
    }, []);

    const handleAcceptAll = () => {
        localStorage.setItem("cookie-consent", "accepted");
        setShowBanner(false);
    };

    if (!showBanner) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-[100] px-4 pb-4 md:px-8 md:pb-8 animate-fade-in">
            <div className="mx-auto max-w-4xl bg-card border border-border/50 shadow-2xl rounded-2xl overflow-hidden backdrop-blur-xl bg-card/95">
                <div className="p-6 md:p-8">
                    <div className="flex flex-col md:flex-row gap-6 items-start">
                        <div className="hidden md:flex flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full items-center justify-center">
                            <Cookie className="w-6 h-6 text-primary" />
                        </div>

                        <div className="flex-1 space-y-5">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Cookie className="md:hidden w-5 h-5 text-primary" />
                                    <h3 className="text-lg font-heading font-bold text-foreground uppercase tracking-tight">Privacidade e Cookies</h3>
                                </div>
                                <button
                                    onClick={() => setShowBanner(false)}
                                    className="text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    Este site utiliza cookies para garantir a melhor experiência possível. Ao continuar a navegar, está a consentir com a utilização das seguintes categorias de cookies:
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pb-2">
                                    <div className="flex items-center gap-2.5 p-3 rounded-xl bg-secondary/30 border border-border/50">
                                        <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                                        <div>
                                            <p className="text-[11px] font-bold uppercase tracking-wider text-foreground">Essenciais</p>
                                            <p className="text-[10px] text-muted-foreground leading-tight">Necessários para o funcionamento do site.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2.5 p-3 rounded-xl bg-secondary/30 border border-border/50">
                                        <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                                        <div>
                                            <p className="text-[11px] font-bold uppercase tracking-wider text-foreground">Desempenho</p>
                                            <p className="text-[10px] text-muted-foreground leading-tight">Colecta de dados estatísticos.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2.5 p-3 rounded-xl bg-secondary/30 border border-border/50">
                                        <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                                        <div>
                                            <p className="text-[11px] font-bold uppercase tracking-wider text-foreground">Funcionais</p>
                                            <p className="text-[10px] text-muted-foreground leading-tight">Salvaguarda de preferências.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2.5 p-3 rounded-xl bg-secondary/30 border border-border/50">
                                        <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                                        <div>
                                            <p className="text-[11px] font-bold uppercase tracking-wider text-foreground">Marketing</p>
                                            <p className="text-[10px] text-muted-foreground leading-tight">Anúncios personalizados.</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 pt-2">
                                    <Button onClick={handleAcceptAll} className="w-full md:w-auto bg-primary text-primary-foreground font-bold uppercase tracking-widest text-xs px-10 py-6 h-auto hover:opacity-90 shadow-lg shadow-primary/20">
                                        Aceitar e Continuar
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/5 rounded-full -ml-12 -mb-12 blur-2xl pointer-events-none" />
            </div>
        </div>
    );
};

export default CookieConsent;
