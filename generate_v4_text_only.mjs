import fs from 'fs';

const data = JSON.parse(fs.readFileSync('old_project_data.json', 'utf8'));

function escapeNoImage(val, key) {
  if (val === null || val === undefined) return 'NULL';
  if (key === 'image_url' || key === 'avatar_url' || key === 'thumbnail_url' || key === 'cover_url') {
    return "'https://images.unsplash.com/photo-1585829365234-781fca5dd9c2?w=800&auto=format&fit=crop'";
  }
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

let sqlOut = "-- V4: MIGRACAO ULTRA-LEVE (APENAS TEXTO)\n";
const tables = ['system_settings', 'breaking_news', 'opinion_articles', 'video_news', 'news_articles'];

for (const table of tables) {
  const rows = data[table] || [];
  for (const row of rows) {
    const keys = Object.keys(row);
    const sqlKeys = keys.map(k => {
      if (table === 'opinion_articles' && k === 'excerpt') return 'summary';
      return k;
    });
    const values = keys.map(k => escapeNoImage(row[k], k));
    sqlOut += `INSERT INTO public.${table} (${sqlKeys.join(', ')}) VALUES (${values.join(', ')}) ON CONFLICT DO NOTHING;\n`;
  }
}

fs.writeFileSync('supabase/MIGRATE_V4_TEXT_ONLY.sql', sqlOut);
console.log("✅ Script V4 gerado!");
