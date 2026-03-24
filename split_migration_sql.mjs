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

// 1. Criar ficheiro para as tabelas pequenas
let sqlOthers = "-- PARTE 1: DEFINIÇÕES, VÍDEOS E OPINIÃO\n\n";
for (const table of otherTables) {
  const rows = data[table] || [];
  for (const row of rows) {
    const keys = Object.keys(row);
    const values = Object.values(row).map(escapeSql);
    sqlOthers += `INSERT INTO public.${table} (${keys.join(', ')}) VALUES (${values.join(', ')}) ON CONFLICT DO NOTHING;\n`;
  }
  sqlOthers += "\n";
}
fs.writeFileSync('supabase/MIGRATE_PART_1_OTHERS.sql', sqlOthers);

// 2. Dividir news_articles em 3 partes
const chunkSize = Math.ceil(newsArticles.length / 3);
for (let i = 0; i < 3; i++) {
  const chunk = newsArticles.slice(i * chunkSize, (i + 1) * chunkSize);
  let sqlChunk = `-- PARTE ${i + 2}: NOTÍCIAS (LOTE ${i + 1})\n\n`;
  for (const row of chunk) {
    const keys = Object.keys(row);
    const values = Object.values(row).map(escapeSql);
    sqlChunk += `INSERT INTO public.news_articles (${keys.join(', ')}) VALUES (${values.join(', ')}) ON CONFLICT DO NOTHING;\n`;
  }
  fs.writeFileSync(`supabase/MIGRATE_PART_${i + 2}_NEWS.sql`, sqlChunk);
}

console.log("✅ Scripts divididos gerados em supabase/MIGRATE_PART_*.sql");
