import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { FileText, Download, Lock, CheckCircle, CreditCard, ShoppingBag, Eye, X } from "lucide-react";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface DigitalEdition {
    id: string;
    title: string;
    edition_date: string;
    description: string;
    price_aoa: number;
    price_usd: number;
    cover_url: string;
    pdf_url: string;
    is_free: boolean;
}

const DigitalEditions = () => {
    const [editions, setEditions] = useState<DigitalEdition[]>([]);
    const [purchases, setPurchases] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const { user } = useAuth();

    const fetchEditions = async () => {
        try {
            const { data, error } = await (supabase
                .from("digital_editions" as any)
                .select("*")
                .eq("published", true)
                .order("edition_date", { ascending: false }) as any);

            if (error) throw error;
            setEditions(data || []);
        } catch (error) {
            console.error("Error fetching editions:", error);
        }
    };

    const fetchPurchases = async () => {
        if (!user) return;
        try {
            const { data, error } = await (supabase
                .from("digital_purchases" as any)
                .select("edition_id")
                .eq("user_id", user.id) as any);

            if (error) throw error;
            setPurchases(data?.map((p: any) => p.edition_id) || []);
        } catch (error) {
            console.error("Error fetching purchases:", error);
        }
    };

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            await fetchEditions();
            if (user) await fetchPurchases();
            setLoading(false);
        };
        load();
    }, [user]);

    const handleDownload = async (edition: DigitalEdition) => {
        if (edition.is_free || purchases.includes(edition.id)) {
            // Logica de download (link assinado)
            const { data, error } = await supabase.storage
                .from("digital-editions")
                .createSignedUrl(edition.pdf_url, 60);

            if (error) {
                toast.error("Erro ao gerar link de download.");
                return;
            }
            window.open(data.signedUrl, "_blank");
        } else {
            toast.error("Você precisa comprar esta edição para baixar.");
        }
    };

    const handleBuyContent = async (edition: DigitalEdition) => {
        if (!user) {
            toast.error("Por favor, faça login para comprar.");
            return;
        }

        setProcessingId(edition.id);
        toast.info(`Processando pagamento para: ${edition.title}...`);

        try {
            // Simulando um delay de processamento de pagamento
            await new Promise(resolve => setTimeout(resolve, 2000));

            const { data, error } = await supabase.functions.invoke("process-payment", {
                body: {
                    edition_id: edition.id,
                    paypal_order_id: `SIMULATED_${Math.random().toString(36).substr(2, 9)}`,
                    amount: edition.price_aoa,
                    currency: "AOA",
                },
            });

            if (error) throw error;

            if (data?.success) {
                toast.success(`Compra de "${edition.title}" realizada com sucesso!`);
                setPurchases(prev => [...prev, edition.id]);
            } else {
                throw new Error(data?.error || "Erro desconhecido no processamento");
            }
        } catch (error: any) {
            console.error("Error processing payment:", error);
            toast.error("Erro ao processar pagamento: " + (error.message || "Tente novamente mais tarde."));
        } finally {
            setProcessingId(null);
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="container py-12 px-4 max-w-6xl">
                <div className="text-center mb-16 relative overflow-hidden py-12 rounded-[2rem] bg-gradient-to-br from-[#b91c1c] to-[#7f1d1d] text-white shadow-2xl">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
                    <div className="relative z-10">
                        <h1 className="text-5xl md:text-7xl font-heading font-black uppercase tracking-tighter mb-4">
                            Jornal <span className="italic opacity-80 underline decoration-4 underline-offset-8">Digital</span>
                        </h1>
                        <p className="text-white/80 text-lg max-w-2xl mx-auto font-medium px-4">
                            Sinta a experiência do jornal impresso em formato digital.
                            Qualidade impecável, acesso instantâneo e pagamento seguro.
                        </p>
                    </div>
                </div>

                {loading ? (
                    <LoadingSpinner />
                ) : editions.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {editions.map((edition) => (
                            <div key={edition.id} className="group relative bg-secondary/30 rounded-2xl border border-border overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10">
                                {/* Capa do Jornal */}
                                <div className="aspect-[3/4] overflow-hidden relative group-hover:cursor-pointer" onClick={() => setPreviewImage(edition.cover_url)}>
                                    {edition.cover_url ? (
                                        <img
                                            src={edition.cover_url}
                                            alt={edition.title}
                                            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-secondary flex items-center justify-center">
                                            <FileText className="w-16 h-16 text-muted-foreground/30" />
                                        </div>
                                    )}

                                    {/* Glassmorphism Overlay */}
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
                                        <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 transform scale-50 group-hover:scale-100 transition-transform duration-500">
                                            <Eye className="w-10 h-10 text-white drop-shadow-lg" />
                                        </div>
                                    </div>

                                    {/* Overlay status */}
                                    {(edition.is_free || purchases.includes(edition.id)) && (
                                        <div className="absolute top-4 right-4 bg-green-500 text-white p-2.5 rounded-full shadow-2xl z-20 animate-bounce">
                                            <CheckCircle className="w-5 h-5" />
                                        </div>
                                    )}
                                </div>

                                {/* Conteúdo do Card */}
                                <div className="p-6 flex flex-col gap-5">
                                    <div className="flex flex-col items-center gap-1">
                                        <p className="text-white/60 text-[10px] uppercase font-bold tracking-widest">Pague por</p>
                                        <p className="text-[#22c55e] text-xl font-black tabular-nums">
                                            {edition.is_free ? "GRÁTIS" : `${edition.price_aoa.toLocaleString()} Kz / ${edition.price_usd.toLocaleString()}$`}
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-center gap-2 border-y border-white/5 py-2">
                                        <span className="text-[#eab308] text-xs font-bold uppercase tracking-tighter">Edição de</span>
                                        <span className="text-white font-bold text-sm">
                                            {format(new Date(edition.edition_date), "dd/MM/yyyy")}
                                        </span>
                                    </div>

                                    {edition.is_free || purchases.includes(edition.id) ? (
                                        <button
                                            onClick={() => handleDownload(edition)}
                                            className="w-full bg-[#b91c1c] text-white py-3.5 rounded-xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 hover:bg-[#991b1b] transition-all"
                                        >
                                            <Download className="w-4 h-4" /> Baixar Edição
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleBuyContent(edition)}
                                            disabled={processingId === edition.id}
                                            className="w-full bg-black text-white py-4 rounded-xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 hover:bg-zinc-900 transition-all border border-white/10 disabled:opacity-50"
                                        >
                                            {processingId === edition.id ? (
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent animate-spin rounded-full" />
                                            ) : (
                                                <CreditCard className="w-4 h-4" />
                                            )}
                                            {processingId === edition.id ? "A processar..." : "Comprar via PayPal"}
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 border-2 border-dashed border-border rounded-3xl bg-secondary/10">
                        <ShoppingBag className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-foreground mb-2">Nenhuma edição disponível</h3>
                        <p className="text-muted-foreground text-sm">Aguarde as próximas edições digitais.</p>
                    </div>
                )}

                {/* Secção de Vantagens */}
                <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="p-8 rounded-3xl bg-primary/5 border border-primary/10">
                        <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-primary/20">
                            <Lock className="w-6 h-6 text-white" />
                        </div>
                        <h4 className="text-xl font-bold mb-3">Acesso Seguro</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">Seus arquivos e transações são protegidos com as tecnologias mais recentes do mercado.</p>
                    </div>
                    <div className="p-8 rounded-3xl bg-primary/5 border border-primary/10">
                        <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-primary/20">
                            <CreditCard className="w-6 h-6 text-white" />
                        </div>
                        <h4 className="text-xl font-bold mb-3">Pagamento Fácil</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">Pague rapidamente via PayPal usando seu cartão de crédito ou saldo.</p>
                    </div>
                    <div className="p-8 rounded-3xl bg-primary/5 border border-primary/10">
                        <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-primary/20">
                            <FileText className="w-6 h-6 text-white" />
                        </div>
                        <h4 className="text-xl font-bold mb-3">Qualidade Premium</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">PDFs em alta resolução, perfeitos para leitura em tablets, computadores ou telemóveis.</p>
                    </div>
                </div>
            </main>

            {/* Modal de Preview da Capa */}
            {previewImage && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300"
                    onClick={() => setPreviewImage(null)}
                >
                    <button
                        className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors"
                        onClick={() => setPreviewImage(null)}
                    >
                        <X className="w-10 h-10" />
                    </button>

                    <div
                        className="relative max-w-4xl w-full max-h-[90vh] flex items-center justify-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={previewImage}
                            alt="Preview da Capa"
                            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl border border-white/10 animate-in zoom-in-95 duration-300"
                        />
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
};

export default DigitalEditions;
