import pkg from 'pg';
const { Client } = pkg;

async function diagnose() {
    console.log("Connecting via pooler IP directly...");
    const client = new Client({
        host: '13.39.9.193', // Resolved IPv4 for aws-0-eu-west-3.pooler.supabase.com
        port: 6543,
        database: 'postgres',
        user: 'postgres.qsjhkhiohpfslfkpjoeb',
        password: 'bytekwanza1975',
        ssl: {
            rejectUnauthorized: false,
            servername: 'aws-0-eu-west-3.pooler.supabase.com'
        }
    });

    try {
        await client.connect();
        console.log("Connected successfully to pooler!");

        // 1. Get policies for digital_editions
        console.log("\n--- Active RLS Policies for 'digital_editions' ---");
        const policiesRes = await client.query(`
            SELECT policyname, cmd, roles, qual, with_check 
            FROM pg_policies 
            WHERE tablename = 'digital_editions';
        `);
        console.log("Policies count:", policiesRes.rows.length);
        for (const row of policiesRes.rows) {
            console.log(`- Policy: ${row.policyname} | CMD: ${row.cmd} | Qual: ${row.qual} | WithCheck: ${row.with_check}`);
        }

        // 2. Check if RLS is enabled on digital_editions
        console.log("\n--- Table properties for 'digital_editions' ---");
        const rlsEnabledRes = await client.query(`
            SELECT relname, relrowsecurity, relforcerowsecurity 
            FROM pg_class 
            WHERE relname = 'digital_editions';
        `);
        for (const row of rlsEnabledRes.rows) {
            console.log(`- Relname: ${row.relname} | RowSec: ${row.relrowsecurity} | ForceRowSec: ${row.relforcerowsecurity}`);
        }

        // 3. View active user roles
        console.log("\n--- Active User Roles in public.user_roles ---");
        const rolesRes = await client.query(`
            SELECT ur.role, au.email 
            FROM public.user_roles ur
            JOIN auth.users au ON ur.user_id = au.id;
        `);
        console.log("Roles count:", rolesRes.rows.length);
        for (const row of rolesRes.rows) {
            console.log(`- User: ${row.email} | Role: ${row.role}`);
        }

    } catch (err) {
        console.error("DIAGNOSIS ERROR:", err.message || err);
        if (err.stack) {
            console.error(err.stack);
        }
    } finally {
        await client.end();
    }
}

diagnose();
