import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        const adminAuthClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        );

        const onesignalAppId = "8384c1db-26fa-4cde-9ccb-070e605b7dec";
        const onesignalRestApiKey = Deno.env.get('ONESIGNAL_REST_API_KEY');

        if (!onesignalRestApiKey) {
            console.error("Missing ONESIGNAL_REST_API_KEY");
            return new Response(JSON.stringify({ error: "Missing ONESIGNAL_REST_API_KEY" }), { status: 500, headers: corsHeaders });
        }

        const now = new Date().toISOString();

        // 1. Fetch News Articles
        const { data: newsData, error: newsError } = await adminAuthClient
            .from('news_articles')
            .select('id, title, summary, image_url, category')
            .eq('published', true)
            .eq('notification_sent', false)
            .or(`scheduled_at.is.null,scheduled_at.lte.${now}`);

        if (newsError) throw newsError;

        // 2. Fetch Opinion Articles
        const { data: opinionData, error: opinionError } = await adminAuthClient
            .from('opinion_articles')
            .select('id, title, author, excerpt, avatar_url')
            .eq('published', true)
            .eq('notification_sent', false)
            .or(`scheduled_at.is.null,scheduled_at.lte.${now}`);

        if (opinionError) throw opinionError;

        const notifications = [];
        const newsIdsToUpdate = [];
        const opinionIdsToUpdate = [];

        for (const news of (newsData || [])) {
            notifications.push({
                app_id: onesignalAppId,
                included_segments: ["Subscribed Users"],
                headings: { "en": "Nova Notícia: " + news.category, "pt": "Nova Notícia: " + news.category },
                contents: { "en": news.title, "pt": news.title },
                url: `https://www.semfiltros.com/article/${news.id}`,
                big_picture: news.image_url || null
            });
            newsIdsToUpdate.push(news.id);
        }

        for (const opinion of (opinionData || [])) {
            notifications.push({
                app_id: onesignalAppId,
                included_segments: ["Subscribed Users"],
                headings: { "en": "Opinião: " + opinion.author, "pt": "Opinião: " + opinion.author },
                contents: { "en": opinion.title, "pt": opinion.title },
                url: `https://www.semfiltros.com/opinion/${opinion.id}`,
                big_picture: opinion.avatar_url || null
            });
            opinionIdsToUpdate.push(opinion.id);
        }

        if (notifications.length === 0) {
            return new Response(JSON.stringify({ message: "No new notifications to send." }), { headers: corsHeaders });
        }

        let sentCount = 0;
        let errorDetails = "";

        // Send notifications to OneSignal
        for (const notif of notifications) {
            const payloadStr = JSON.stringify(notif);
            const res = await fetch("https://onesignal.com/api/v1/notifications", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json; charset=utf-8",
                    "Authorization": `Basic ${onesignalRestApiKey}`
                },
                body: payloadStr
            });

            const responseText = await res.text();

            // Log to database for debugging
            await adminAuthClient.from('push_notification_logs').insert({
                status: res.ok ? 'success' : 'error: ' + res.status,
                response_body: responseText,
                payload: JSON.parse(payloadStr)
            });

            if (!res.ok) {
                errorDetails += responseText + " | ";
                console.error("OneSignal Error:", responseText);
            } else {
                sentCount++;
            }
        }

        // Update DB Flags
        if (newsIdsToUpdate.length > 0) {
            await adminAuthClient.from('news_articles').update({ notification_sent: true }).in('id', newsIdsToUpdate);
        }
        if (opinionIdsToUpdate.length > 0) {
            await adminAuthClient.from('opinion_articles').update({ notification_sent: true }).in('id', opinionIdsToUpdate);
        }

        return new Response(
            JSON.stringify({ success: true, processed: notifications.length, sent: sentCount, errors: errorDetails }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        );

    } catch (error: any) {
        console.error('Error sending push notifications:', error);
        return new Response(
            JSON.stringify({ error: error.message }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        );
    }
});
