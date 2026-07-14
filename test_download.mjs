import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qsjhkhiohpfslfkpjoeb.supabase.co';
const supabaseKey = 'sb_publishable_-cH7Xx0cAUTgGeK7KLFP4w_a2TLTf9x';
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
    console.log("Fetching published digital editions...");
    const { data: editions, error: fetchErr } = await supabase
        .from('digital_editions')
        .select('*')
        .eq('published', true);

    if (fetchErr) {
        console.error("Fetch error:", fetchErr);
        return;
    }

    console.log(`Found ${editions.length} editions.`);
    for (const ed of editions) {
        console.log(`\n- Edition: "${ed.title}"`);
        console.log(`  ID: ${ed.id}`);
        console.log(`  File: "${ed.pdf_url}"`);
        console.log(`  Is Free: ${ed.is_free}`);
        console.log(`  Price AOA: ${ed.price_aoa}`);
        console.log(`  Price USD: ${ed.price_usd}`);

        console.log("  Attempting to generate signed URL...");
        const { data, error } = await supabase.storage
            .from('digital-editions')
            .createSignedUrl(ed.pdf_url, 60);

        if (error) {
            console.error("  ❌ Signed URL Error:", error.message || error);
        } else {
            console.log("  ✅ Signed URL Success:", data.signedUrl);
        }
    }
}

run();
