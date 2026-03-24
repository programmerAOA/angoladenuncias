import pkg from 'pg';
const { Client } = pkg;
import fs from 'fs';

const connectionString = 'postgresql://postgres:bytekwanza1975@[2a05:d018:135e:16db:96bf:b26b:1d0e:4e8d]:5432/postgres';

async function restoreHeavy() {
  console.log("🚀 Iniciando restauro de imagens pesadas (Base64)...");
  
  const data = JSON.parse(fs.readFileSync('old_project_data.json', 'utf8'));
  const client = new Client({ connectionString });

  try {
    await client.connect();
    console.log("✅ Conexão estabelecida.");

    const tables = ['opinion_articles', 'video_news', 'news_articles'];
    const fieldsToRestore = ['image_url', 'avatar_url', 'thumbnail_url', 'video_url', 'cover_url'];

    for (const table of tables) {
      const rows = data[table] || [];
      for (const row of rows) {
        for (const field of fieldsToRestore) {
          const val = row[field];
          if (val && val.startsWith('data:image') && val.length > 50000) {
            console.log(`📥 Restaurando imagem de ${val.length} bytes para ${table} (ID: ${row.id})...`);
            await client.query(`UPDATE public.${table} SET ${field} = $1 WHERE id = $2`, [val, row.id]);
            console.log(`✅ Concluído.`);
          }
        }
      }
    }

    console.log("\n🎉 TODAS AS IMAGENS BASE64 FORAM RESTAURADAS!");

  } catch (err) {
    console.error("❌ Erro no restauro:", err.message);
  } finally {
    await client.end();
  }
}

restoreHeavy();
