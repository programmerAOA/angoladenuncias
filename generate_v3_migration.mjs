import fs from 'fs';

const data = JSON.parse(fs.readFileSync('old_project_data.json', 'utf8'));

function escapeAndCleanSql(val) {
  if (val === null || val === undefined) return 'NULL';
  if (typeof val === 'string') {
    // Se for uma imagem Base64 muito longa, vamos trocá-la por uma imagem de placeholder
    if (val.startsWith('data:image') && val.length > 2000) {
      console.log(`⚠️ Imagem Base64 detectada (tamanho: ${val.length}). Substituindo por placeholder...`);
      return "'https://images.unsplash.com/photo-1585829365234-781fca5dd9c2?w=800&auto=format&fit=crop'";
    }
    return "'" + val.replace(/'/g, "''") + "'";
  }
  if (typeof val === 'boolean') {
    return val ? 'true' : 'false';
  }
  if (typeof val === 'object') {
    return "'" + JSON.stringify(val).replace(/'/g, "''") + "'";
  }
  return val;
}

const newsArticles = data.news_articles || [];
const otherTables = ['system_settings', 'breaking_news', 'opinion_articles', 'video_news'];

// 1. Outras tabelas
let sqlOthers = "-- LOTE 1 V3: DEFINIÇÕES E VÍDEOS\n\n";
for (const table of otherTables) {
  const rows = data[table] || [];
  for (const row of rows) {
    const keys = Object.keys(row);
    const values = Object.values(row).map(escapeAndCleanSql);
    sqlOthers += `INSERT INTO public.${table} (${keys.join(', ')}) VALUES (${values.join(', ')}) ON CONFLICT DO NOTHING;\n`;
  }
}
fs.writeFileSync('supabase/MIGRATE_V3_PART_1.sql', sqlOthers);

// 2. Notícias em lotes de 10
const batchSize = 10;
let fileIndex = 2;
for (let i = 0; i < newsArticles.length; i += batchSize) {
  const chunk = newsArticles.slice(i, i + batchSize);
  let sqlChunk = `-- LOTE ${fileIndex} V3: NOTÍCIAS (Artigos ${i + 1} a ${i + chunk.length})\n\n`;
  for (const row of chunk) {
    const keys = Object.keys(row);
    const values = Object.values(row).map(escapeAndCleanSql);
    sqlChunk += `INSERT INTO public.news_articles (${keys.join(', ')}) VALUES (${values.join(', ')}) ON CONFLICT DO NOTHING;\n`;
  }
  fs.writeFileSync(`supabase/MIGRATE_V3_PART_${fileIndex}.sql`, sqlChunk);
  fileIndex++;
}

console.log(`✅ Gerados ${fileIndex - 1} lotes limpos em supabase/MIGRATE_V3_PART_*.sql`);
