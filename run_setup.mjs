import pkg from 'pg';
const { Client } = pkg;
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const connectionString = 'postgresql://postgres:bytekwanza1975@db.qsjhkhiohpfslfkpjoeb.supabase.co:5432/postgres';

async function runSetup() {
    const client = new Client({
        connectionString,
    });

    try {
        console.log("Connecting to PostgreSQL...");
        await client.connect();
        console.log("Connected successfully to:", connectionString.split('@')[1]);

        // 1. Read files
        const cleanSetupPath = path.join(__dirname, 'supabase', 'clean_setup_v3.sql');
        const contentSetupPath = path.join(__dirname, 'supabase', 'recreate_all_content_tables.sql');

        console.log("Reading setup scripts...");
        const cleanSetupSql = fs.readFileSync(cleanSetupPath, 'utf8');
        const contentSetupSql = fs.readFileSync(contentSetupPath, 'utf8');

        // 2. Execute scripts
        console.log("Executing strict clean_setup_v3.sql...");
        await client.query(cleanSetupSql);
        console.log("✅ clean_setup_v3.sql executed.");

        console.log("Executing recreate_all_content_tables.sql...");
        await client.query(contentSetupSql);
        console.log("✅ recreate_all_content_tables.sql executed.");

        // 3. Make user admin
        console.log("Applying ADMIN privileges to bytekwanza@gmail.com...");
        const adminSql = `
      INSERT INTO public.user_roles (user_id, role) 
      SELECT id, 'admin' FROM auth.users WHERE email = 'bytekwanza@gmail.com'
      ON CONFLICT (user_id, role) DO UPDATE SET role = 'admin';
    `;
        const res = await client.query(adminSql);
        console.log(`✅ Admin applied! Rows affected: ${res.rowCount}`);

    } catch (err) {
        console.error("❌ SQL Execution Error:");
        console.error(err);
    } finally {
        await client.end();
        console.log("Connection closed.");
    }
}

runSetup();
