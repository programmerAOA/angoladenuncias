import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const AnalyticsTracker = () => {
    useEffect(() => {
        const trackVisit = async () => {
            // Basic check to see if we've already tracked this session to avoid double counting
            const hasTracked = sessionStorage.getItem("site_visit_tracked");
            if (hasTracked) return;

            try {
                // Detect country via IP API (free and no key required for basic tier)
                let country = "Desconhecido";
                try {
                    const response = await fetch("https://ipapi.co/json/");
                    const data = await response.json();
                    if (data && data.country_name) {
                        country = data.country_name;
                    }
                } catch (ipError) {
                    console.warn("Failed to detect country via IP:", ipError);
                }

                // Log the visit to Supabase
                const { error } = await supabase.from("site_visits").insert({ country });

                if (!error) {
                    sessionStorage.setItem("site_visit_tracked", "true");
                    console.log("Visit tracked successfully from", country);
                } else {
                    console.error("Error logging visit:", error);
                }
            } catch (err) {
                console.error("Unexpected error in AnalyticsTracker:", err);
            }
        };

        trackVisit();
    }, []);

    return null; // This component doesn't render anything
};
