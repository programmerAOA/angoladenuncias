import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface SiteConfig {
    siteName: string;
    logoUrl: string;
    primaryColor: string;
    facebookUrl: string;
    instagramUrl: string;
    youtubeUrl: string;
    contactEmail: string;
    whatsappNumber: string;
    copyrightText: string;
    geminiApiKey: string;
}

const DEFAULTS: SiteConfig = {
    siteName: "Angola Sem Filtros",
    logoUrl: "",
    primaryColor: "#e11d48",
    facebookUrl: "https://facebook.com/angolasemfiltros",
    instagramUrl: "https://instagram.com/angolasemfiltros",
    youtubeUrl: "https://youtube.com/@semfiltrostv",
    contactEmail: "redaccao@semfiltros.com",
    whatsappNumber: "+244952679780",
    copyrightText: "Portal Sem Filtros.",
    geminiApiKey: "",
};

const KEY_MAP: Record<string, keyof SiteConfig> = {
    site_name: "siteName",
    site_logo_url: "logoUrl",
    primary_color: "primaryColor",
    facebook_url: "facebookUrl",
    instagram_url: "instagramUrl",
    youtube_url: "youtubeUrl",
    contact_email: "contactEmail",
    whatsapp_number: "whatsappNumber",
    copyright_text: "copyrightText",
    gemini_api_key: "geminiApiKey",
};

export function useSiteConfig() {
    const [config, setConfig] = useState<SiteConfig>(DEFAULTS);
    const [loading, setLoading] = useState(true);

    const parseRows = (rows: { key: string; value: string | null }[]): SiteConfig => {
        const result = { ...DEFAULTS };
        for (const row of rows) {
            const field = KEY_MAP[row.key];
            if (field && row.value !== null && row.value !== "") {
                (result as any)[field] = row.value;
            }
        }
        return result;
    };

    useEffect(() => {
        let channel: ReturnType<typeof supabase.channel> | null = null;

        const load = async () => {
            const { data } = await supabase.from("site_config" as any).select("key, value");
            if (data) setConfig(parseRows(data as any));
            setLoading(false);
        };

        load();

        // Realtime updates - so changes in admin reflect everywhere instantly
        channel = supabase
            .channel("site_config_changes")
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "site_config" },
                async () => {
                    const { data } = await supabase.from("site_config" as any).select("key, value");
                    if (data) setConfig(parseRows(data as any));
                }
            )
            .subscribe();

        return () => {
            if (channel) supabase.removeChannel(channel);
        };
    }, []);

    return { ...config, loading };
}
