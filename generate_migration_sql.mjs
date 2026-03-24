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

let sqlOut = "-- ################################################################################\n";
sqlOut += "-- SCRIPT DE MIGRAÇÃO DE CONTEÚDO (ANGOLA SEM FILTROS)\n";
sqlOut += "-- Executar no SQL Editor do novo projeto\n";
sqlOut += "-- ################################################################################\n\n";

const tables = ['system_settings', 'breaking_news', 'opinion_articles', 'video_news', 'news_articles'];

for (const table of tables) {
  const rows = data[table];
  if (!rows || rows.length === 0) continue;

  sqlOut += `-- ### INSERINDO DADOS EM ${table.toUpperCase()} (${rows.length} LINHAS)\n`;
  
  for (const row of rows) {
    const keys = Object.keys(row);
    const values = Object.values(row).map(escapeSql);
    
    sqlOut += `INSERT INTO public.${table} (${keys.join(', ')}) VALUES (${values.join(', ')}) ON CONFLICT DO NOTHING;\n`;
  }
  sqlOut += "\n";
}

fs.writeFileSync('supabase/MIGRATE_CONTENT.sql', sqlOut);
console.log("✅ Script supabase/MIGRATE_CONTENT.sql gerado com sucesso!");
