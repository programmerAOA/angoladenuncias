import pkg from 'pg';
const { Client } = pkg;
import dns from 'dns';

async function diagnose() {
    const originalHost = 'db.qsjhkhiohpfslfkpjoeb.supabase.co';
    console.log(`Resolving IPv6 address for ${originalHost}...`);
    
    let ip;
    try {
        const ips = await dns.promises.resolve6(originalHost);
        ip = ips[0];
        console.log(`Resolved to IP: ${ip}`);
    } catch (dnsErr) {
        console.error("DNS Resolution failed. Trying custom DNS...", dnsErr);
        // Fallback: use public DNS or the resolved address from nslookup
        ip = '2a05:d018:135e:16e0:6246:3ab8:eeac:2c65';
    }

    const client = new Client({
        host: ip,
        port: 5432,
        database: 'postgres',
        user: 'postgres',
        password: 'bytekwanza1975',
        ssl: {
            rejectUnauthorized: false
        }
    });

    try {
        await client.connect();
        console.log("Connected successfully to PostgreSQL database!");

        // 1. Get policies for digital_editions
        console.log("\n--- Active RLS Policies for 'digital_editions' ---");
        const policiesRes = await client.query(`
            SELECT policyname, cmd, roles, qual, with_check 
            FROM pg_policies 
            WHERE tablename = 'digital_editions';
        `);
        console.log(JSON.stringify(policiesRes.rows, null, 2));

        // 2. Check if RLS is enabled on digital_editions
        console.log("\n--- Table properties for 'digital_editions' ---");
        const rlsEnabledRes = await client.query(`
            SELECT relname, relrowsecurity, relforcerowsecurity 
            FROM pg_class 
            WHERE relname = 'digital_editions';
        `);
        console.log(JSON.stringify(rlsEnabledRes.rows, null, 2));

        // 3. Check trigger functions on digital_editions
        console.log("\n--- Triggers on 'digital_editions' ---");
        const triggersRes = await client.query(`
            SELECT trigger_name, event_manipulation, action_statement
            FROM information_schema.triggers
            WHERE event_object_table = 'digital_editions';
        `);
        console.log(JSON.stringify(triggersRes.rows, null, 2));

        // 4. View active user roles
        console.log("\n--- Active User Roles in public.user_roles ---");
        const rolesRes = await client.query(`
            SELECT ur.id, ur.user_id, ur.role, au.email 
            FROM public.user_roles ur
            JOIN auth.users au ON ur.user_id = au.id;
        `);
        console.log(JSON.stringify(rolesRes.rows, null, 2));

    } catch (err) {
        console.error("Error during diagnosis:", err);
    } finally {
        await client.end();
    }
}

diagnose();
