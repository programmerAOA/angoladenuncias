import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const AnalyticsTracker = () => {
    useEffect(() => {
        const trackVisit = async () => {
            // Basic check to see if we've already tracked this session to avoid double counting
            const hasTracked = sessionStorage.getItem("site_visit_tracked");
            if (hasTracked) return;

            try {
                // 1. Detect device/browser/OS via User Agent
                const ua = navigator.userAgent;
                let deviceType = "Desktop";
                let deviceModel = "Windows PC";
                let browser = "Outro";
                let os = "Windows";

                if (/tablet|ipad|playbook|silk/i.test(ua)) {
                    deviceType = "Tablet";
                } else if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
                    deviceType = "Mobile";
                }

                // Detect OS
                if (/Windows/i.test(ua)) os = "Windows";
                else if (/Macintosh/i.test(ua)) os = "macOS";
                else if (/Android/i.test(ua)) os = "Android";
                else if (/iPhone|iPad|iPod/i.test(ua)) os = "iOS";
                else if (/Linux/i.test(ua)) os = "Linux";

                // Detect Browser
                if (/Chrome/i.test(ua)) browser = "Chrome";
                else if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) browser = "Safari";
                else if (/Firefox/i.test(ua)) browser = "Firefox";
                else if (/Edge/i.test(ua)) browser = "Edge";

                // Simple Mobile Model detection
                if (/iPhone/i.test(ua)) deviceModel = "iPhone";
                else if (/iPad/i.test(ua)) deviceModel = "iPad";
                else if (/Android/i.test(ua)) {
                    const match = ua.match(/Android\s+([^\s;]+)/);
                    deviceModel = match ? `Android ${match[1]}` : "Android Device";
                }

                // 2. Detect country via IP API
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

                // 3. Get User Email if logged in
                const { data: { user } } = await supabase.auth.getUser();
                const userEmail = user?.email || null;

                // 4. Log the visit to Supabase
                const { error } = await supabase.from("site_visits").insert({
                    country,
                    device_type: deviceType,
                    device_model: deviceModel,
                    browser,
                    os,
                    user_email: userEmail
                });

                if (!error) {
                    sessionStorage.setItem("site_visit_tracked", "true");
                    console.log("Visit tracked successfully:", { country, deviceType, deviceModel, browser, os, userEmail });
                } else {
                    console.error("Error logging visit:", error);
                }
            } catch (err) {
                console.error("Unexpected error in AnalyticsTracker:", err);
            }
        };

        trackVisit();
    }, []);

    return null;
};
