import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Cookie, X, CheckCircle2 } from "lucide-react";

const CookieConsent = () => {
    const [showBanner, setShowBanner] = useState(() => {
        if (typeof window === 'undefined') return false;
        try {
            const savedConsent = localStorage.getItem("cookie-consent");
            const hasCookie = document.cookie.split(';').some((item) => item.trim().startsWith('cookie-consent='));
            return !savedConsent && !hasCookie;
        } catch (e) {
            return true;
        }
    });

    const setConsentAttributes = (status: string) => {
        // Save to localStorage
        localStorage.setItem("cookie-consent", status);

        // Save to long-lived cookie (1 year)
        const date = new Date();
        date.setTime(date.getTime() + (365 * 24 * 60 * 60 * 1000));
        document.cookie = `cookie-consent=${status}; expires=${date.toUTCString()}; path=/; SameSite=Lax`;

        setShowBanner(false);
    };

    const handleAcceptAll = () => {
        setConsentAttributes("accepted");
    };

    const handleDismiss = () => {
        // If they click X, we still should remember it for at least 30 days so they aren't bothered every visit
        const date = new Date();
        date.setTime(date.getTime() + (30 * 24 * 60 * 60 * 1000));
        document.cookie = `cookie-consent=dismissed; expires=${date.toUTCString()}; path=/; SameSite=Lax`;
        localStorage.setItem("cookie-consent", "dismissed");
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
                                    onClick={handleDismiss}
                                    className="text-muted-foreground hover:text-foreground transition-colors p-2"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="space-y-6">
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    Utilizamos cookies essenciais e tecnologias semelhantes de acordo com a nossa política de privacidade. Ao continuar navegando, você concorda com estas condições. <a href="/privacy" className="text-primary hover:underline font-bold">Saiba mais</a>
                                </p>

                                <div className="flex items-center gap-3">
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
