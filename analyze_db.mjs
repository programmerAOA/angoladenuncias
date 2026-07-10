import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://pstzibmplwiatkuanhhn.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzdHppYm1wbHdpYXRrdWFuaGhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2MjczMzEsImV4cCI6MjA4NzIwMzMzMX0.iY_kNiKkXjXPdCmHV0OMQquXWvfrrHPsR1c8m5Q0wBw';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function analyze() {
    console.log("🔍 Fetching recent articles...");
    const { data: articles, error } = await supabase.from('news_articles').select('id, title, content, created_at').order('created_at', { ascending: false }).limit(3);
    
    if (error) {
        console.error("❌ Error:", error);
        return;
    }

    console.log(`✅ Loaded ${articles?.length} articles.`);
    for (const art of articles || []) {
        console.log(`\n----------------------------------------`);
        console.log(`ID: ${art.id}`);
        console.log(`Title: ${art.title}`);
        console.log(`Created At: ${art.created_at}`);
        console.log(`Content type: ${typeof art.content}`);
        console.log(`Content Preview (first 500 chars):`);
        console.log(JSON.stringify(art.content?.substring(0, 500)));
        console.log(`Has HTML tags regex test:`, /<[a-z][\s\S]*>/i.test(art.content || ""));
    }
}

analyze();
