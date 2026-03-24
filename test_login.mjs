import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://pstzibmplwiatkuanhhn.supabase.co';
const SUPABASE_KEY = 'sb_publishable_daU9-fPGaE0GEzeDylGJUw_NyW1sxsD';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function testLogin() {
    console.log("🔍 Attempting to log in with bytekwanza@gmail.com...");

    const { data, error } = await supabase.auth.signInWithPassword({
        email: 'bytekwanza@gmail.com',
        password: '@MPLA1975#'
    });

    if (error) {
        console.log("❌ LOGIN ERROR:");
        console.log("- Message:", error.message);
        console.log("- Status:", error.status);
        console.log("- Name:", error.name);

        // Try to get raw response if possible
        try {
            const authUrl = `${SUPABASE_URL}/auth/v1/token?grant_type=password`;
            const rawRes = await fetch(authUrl, {
                method: 'POST',
                headers: {
                    'apikey': SUPABASE_KEY,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: 'bytekwanza@gmail.com',
                    password: '@MPLA1975#'
                })
            });
            const rawJson = await rawRes.json();
            console.log("\n📡 RAW HTTP RESPONSE:");
            console.log(JSON.stringify(rawJson, null, 2));
        } catch (e) {
            console.log("Could not fetch raw response:", e);
        }
    } else {
        console.log("✅ LOGIN SUCCESSFUL!");
        console.log("User:", data.user?.id);
    }
}

testLogin();
