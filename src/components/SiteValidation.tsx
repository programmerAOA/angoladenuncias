import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const SiteValidation = () => {
    useEffect(() => {
        const applyValidation = async () => {
            try {
                const { data, error } = await supabase
                    .from("system_settings")
                    .select("value")
                    .eq("key", "site_validation")
                    .single();

                if (error || !data?.value) return;

                const { method, content } = data.value as { method?: string; content?: string };
                if (!content) return;

                if (method === "metatag") {
                    // Check if already exists
                    if (document.querySelector('meta[name="google-adsense-account"]')) return;

                    // The content might be the whole tag or just the ID. 
                    // Usually AdSense says "Paste this <meta> tag..."
                    if (content.includes("<meta")) {
                        const temp = document.createElement("div");
                        temp.innerHTML = content.trim();
                        const meta = temp.firstChild as HTMLMetaElement;
                        if (meta) document.head.appendChild(meta);
                    } else {
                        const meta = document.createElement("meta");
                        meta.name = "google-adsense-account";
                        meta.content = content;
                        document.head.appendChild(meta);
                    }
                } else if (method === "adsense") {
                    // Inject script
                    if (document.querySelector('script[src*="adsbygoogle.js"]')) return;

                    if (content.includes("<script")) {
                        // Handle script tag injection
                        const temp = document.createElement("div");
                        temp.innerHTML = content.trim();
                        const script = temp.querySelector("script");
                        if (script) {
                            const newScript = document.createElement("script");
                            Array.from(script.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
                            if (script.innerHTML) newScript.innerHTML = script.innerHTML;
                            document.head.appendChild(newScript);
                        }
                    } else {
                        const script = document.createElement("script");
                        script.async = true;
                        script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${content}`;
                        script.crossOrigin = "anonymous";
                        document.head.appendChild(script);
                    }
                }
            } catch (err) {
                console.error("Error applying site validation:", err);
            }
        };

        applyValidation();
    }, []);

    return null;
};

export default SiteValidation;
