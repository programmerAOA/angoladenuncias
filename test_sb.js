import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";

// Puxar as credenciais do .env local para testar a comunicação
let envContent = "";
try {
    envContent = readFileSync(".env", "utf8");
} catch (e) {
    console.log("No .env file found");
    process.exit(1);
}

const urlMatch = envContent.match(/VITE_SUPABASE_URL=(.+)/);
const keyMatch = envContent.match(/VITE_SUPABASE_PUBLISHABLE_KEY=(.+)/);

if (!urlMatch || !keyMatch) {
    console.log("Credentials missing from .env");
    process.exit(1);
}

const SUPABASE_URL = urlMatch[1].trim();
const SUPABASE_PUBLISHABLE_KEY = keyMatch[1].trim();

console.log("Targeting:", SUPABASE_URL);

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

async function test() {
    console.log("Testing connection...");
    const startTime = Date.now();

    try {
        const { data, error } = await supabase.from("news_articles").select("id").limit(1);
        console.log(`[Read Test] Finished in ${Date.now() - startTime}ms. Success:`, !error);
        if (error) console.log("Read error:", error);
    } catch (err) {
        console.log("Read threw:", err);
    }

    console.log("Testing insert...");
    const istartTime = Date.now();
    try {
        const result = await supabase.from("news_articles").insert({
            title: 'TEST AI NODE',
            summary: 'Test summary from node',
            content: 'Node test content',
            category: 'Política',
            author: 'AI',
            published: true
        }).select();

        console.log(`[Insert Test] Finished in ${Date.now() - istartTime}ms.`);
        console.log("Result data:", result.data);
        console.log("Result error:", result.error);
    } catch (err) {
        console.log("Insert threw:", err);
    }
}

test();
