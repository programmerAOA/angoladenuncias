import fs from 'fs';

const data = JSON.parse(fs.readFileSync('old_project_data.json', 'utf8'));

function escapeSql(val) {
  if (val === null || val === undefined) return 'NULL';
  if (typeof val === 'string') {
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
let sqlOthers = "-- LOTE 1: DEFINIÇÕES E VÍDEOS\n\n";
for (const table of otherTables) {
  const rows = data[table] || [];
  for (const row of rows) {
    const keys = Object.keys(row);
    const values = Object.values(row).map(escapeSql);
    sqlOthers += `INSERT INTO public.${table} (${keys.join(', ')}) VALUES (${values.join(', ')}) ON CONFLICT DO NOTHING;\n`;
  }
}
fs.writeFileSync('supabase/MIGRATE_V2_PART_1.sql', sqlOthers);

// 2. Notícias em lotes de 10
const batchSize = 10;
let fileIndex = 2;
for (let i = 0; i < newsArticles.length; i += batchSize) {
  const chunk = newsArticles.slice(i, i + batchSize);
  let sqlChunk = `-- LOTE ${fileIndex}: NOTÍCIAS (Artigos ${i + 1} a ${i + chunk.length})\n\n`;
  for (const row of chunk) {
    const keys = Object.keys(row);
    const values = Object.values(row).map(escapeSql);
    sqlChunk += `INSERT INTO public.news_articles (${keys.join(', ')}) VALUES (${values.join(', ')}) ON CONFLICT DO NOTHING;\n`;
  }
  fs.writeFileSync(`supabase/MIGRATE_V2_PART_${fileIndex}.sql`, sqlChunk);
  fileIndex++;
}

console.log(`✅ Gerados ${fileIndex - 1} lotes em supabase/MIGRATE_V2_PART_*.sql`);
