import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// CREDENCIAIS DO PROJETO ANTIGO (PRODUÇÃO ATUAL)
const OLD_SUPABASE_URL = 'https://pstzibmplwiatkuanhhn.supabase.co';
const OLD_SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzdHppYm1wbHdpYXRrdWFuaGhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2MjczMzEsImV4cCI6MjA4NzIwMzMzMX0.iY_kNiKkXjXPdCmHV0OMQquXWvfrrHPsR1c8m5Q0wBw';

const oldSupabase = createClient(OLD_SUPABASE_URL, OLD_SUPABASE_KEY);

async function exportData() {
  console.log("🚀 Iniciando exportação de dados do projeto antigo...");
  
  const tables = [
    'news_articles', 
    'video_news', 
    'opinion_articles', 
    'breaking_news', 
    'system_settings',
    'digital_editions',
    'advertisements'
  ];
  const exportResult = {};

  for (const table of tables) {
    console.log(`📡 Lendo tabela: ${table}...`);
    const { data, error } = await oldSupabase.from(table).select('*');
    if (error) {
      console.error(`❌ Erro ao ler ${table}:`, error.message);
    } else {
      console.log(`✅ ${table}: ${data.length} registos encontrados.`);
      exportResult[table] = data;
    }
  }

  const outputPath = 'old_project_data.json';
  fs.writeFileSync(outputPath, JSON.stringify(exportResult, null, 2));
  console.log(`\n🎉 Exportação concluída! Dados guardados em: ${outputPath}`);
}

exportData();
