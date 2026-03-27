import { useState, useEffect } from "react";
import { DollarSign, Euro } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const CurrencyWidget = () => {
    const [rates, setRates] = useState<{ usd: number; eur: number } | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchRates = async () => {
        try {
            const { data, error } = await supabase.functions.invoke("currency-rates");
            if (error) throw error;
            if (data) setRates(data);
        } catch (err) {
            console.error("Error fetching currency rates:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRates();
        // Refresh a cada 30 minutos
        const interval = setInterval(fetchRates, 30 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    if (loading && !rates) {
        return (
            <div className="flex items-center gap-3 animate-pulse opacity-50">
                <div className="h-4 w-12 bg-muted rounded"></div>
                <div className="h-4 w-12 bg-muted rounded"></div>
            </div>
        );
    }

    if (!rates && !loading) {
        return (
            <div className="flex items-center gap-1 text-[8px] text-muted-foreground uppercase opacity-70">
                <span>Câmbio Indisponível</span>
            </div>
        );
    }

    if (!rates) return null;

    return (
        <div className="flex items-center gap-3 text-[10px] font-bold tracking-tight">
            <div className="flex items-center gap-1 px-2 py-0.5 bg-secondary/80 rounded border border-border/30">
                <DollarSign className="w-3 h-3 text-green-600" />
                <span className="text-foreground">{rates.usd.toFixed(2)} <span className="text-[8px] text-muted-foreground ml-0.5">AOA</span></span>
            </div>
            <div className="flex items-center gap-1 px-2 py-0.5 bg-secondary/80 rounded border border-border/30">
                <Euro className="w-3 h-3 text-blue-600" />
                <span className="text-foreground">{rates.eur.toFixed(2)} <span className="text-[8px] text-muted-foreground ml-0.5">AOA</span></span>
            </div>
        </div>
    );
};

export default CurrencyWidget;
