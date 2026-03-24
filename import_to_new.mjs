import pkg from 'pg';
const { Client } = pkg;
import fs from 'fs';

const connectionString = 'postgresql://postgres:bytekwanza1975@db.qsjhkhiohpfslfkpjoeb.supabase.co:5432/postgres';

async function importData() {
  const data = JSON.parse(fs.readFileSync('old_project_data.json', 'utf8'));
  const client = new Client({ connectionString });

  try {
    await client.connect();
    console.log("🚀 Conexão estabelecida com o novo banco de dados.");

    // Ordem de importação (tabelas independentes primeiro)
    const tables = ['system_settings', 'breaking_news', 'opinion_articles', 'video_news', 'news_articles'];

    for (const table of tables) {
      const rows = data[table];
      if (!rows || rows.length === 0) {
        console.log(`ℹ️ Tabela ${table} vazia no export, pulando...`);
        continue;
      }

      console.log(`📥 Importando ${rows.length} linhas para ${table}...`);

      for (const row of rows) {
        const keys = Object.keys(row);
        const values = Object.values(row);
        
        // Construir a query de INSERT dinâmica
        const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
        const columns = keys.join(', ');
        const sql = `INSERT INTO public.${table} (${columns}) VALUES (${placeholders}) ON CONFLICT DO NOTHING`;

        try {
          await client.query(sql, values);
        } catch (err) {
          console.error(`❌ Erro ao inserir na tabela ${table}:`, err.message);
        }
      }
      console.log(`✅ ${table} concluída.`);
    }

    console.log("\n🎉 MIGRACÃO CONCLUÍDA COM SUCESSO!");

  } catch (err) {
    console.error("❌ Erro fatal na migração:", err);
  } finally {
    await client.end();
  }
}

importData();
