import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://pstzibmplwiatkuanhhn.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzdHppYm1wbHdpYXRrdWFuaGhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2MjczMzEsImV4cCI6MjA4NzIwMzMzMX0.iY_kNiKkXjXPdCmHV0OMQquXWvfrrHPsR1c8m5Q0wBw';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function analyze() {
    console.log("🔍 Checking connection to Supabase...");

    // 1. Check profiles table
    console.log("\n📋 Checking 'profiles' table existence...");
    const pRes = await supabase.from('profiles').select('id').limit(1);
    if (pRes.error) {
        console.log("❌ Error accessing 'profiles':", pRes.error.message, pRes.error.code);
    } else {
        console.log("✅ 'profiles' table exists! Status: 200 OK");
    }

    // 2. Check user_roles table
    console.log("\n📋 Checking 'user_roles' table existence...");
    const urRes = await supabase.from('user_roles').select('id').limit(1);
    if (urRes.error) {
        console.log("❌ Error accessing 'user_roles':", urRes.error.message, urRes.error.code);
    } else {
        console.log("✅ 'user_roles' table exists! Status: 200 OK");
    }
}

analyze();
