import fs from 'fs';

const data = JSON.parse(fs.readFileSync('old_project_data.json', 'utf8'));

function escapeSql(val) {
  if (val === null || val === undefined) return 'NULL';
  if (typeof val === 'string') return "'" + val.replace(/'/g, "''") + "'";
  return val;
}

let sqlOut = "-- SCRIPT DE RESTAURO DE LINKS DE IMAGENS E VIDEOS\n";
const tables = ['opinion_articles', 'video_news', 'news_articles'];

let heavyArticles = [];

for (const table of tables) {
  const rows = data[table] || [];
  for (const row of rows) {
    const updates = [];
    const fieldsToRestore = ['image_url', 'avatar_url', 'thumbnail_url', 'video_url', 'cover_url'];
    
    let isHeavy = false;
    for (const field of fieldsToRestore) {
      if (row[field]) {
        if (row[field].length > 50000) { // Mais de 50KB é "pesado" para o editor SQL em massa
          isHeavy = true;
          heavyArticles.push({ table, id: row.id, field, value: row[field] });
        } else {
          updates.push(`${field} = ${escapeSql(row[field])}`);
        }
      }
    }

    if (updates.length > 0) {
      sqlOut += `UPDATE public.${table} SET ${updates.join(', ')} WHERE id = '${row.id}';\n`;
    }
  }
}

fs.writeFileSync('supabase/RESTORE_MEDIA.sql', sqlOut);

// Gerar um script para cada imagem pesada (se houver poucas)
heavyArticles.forEach((art, index) => {
    let heavySql = `-- IMAGEM PESADA PARA ARTIGO ${art.id}\n`;
    heavySql += `UPDATE public.${art.table} SET ${art.field} = ${escapeSql(art.value)} WHERE id = '${art.id}';\n`;
    fs.writeFileSync(`supabase/RESTORE_HEAVY_MEDIA_${index + 1}.sql`, heavySql);
});

console.log(`✅ Script links leves gerado em supabase/RESTORE_MEDIA.sql`);
console.log(`✅ Gerados ${heavyArticles.length} scripts para imagens pesadas.`);
