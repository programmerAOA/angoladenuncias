/**
 * Script para actualizar o URL do stream ao vivo via JS com logging detalhado
 */
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qsjhkhiohpfslfkpjoeb.supabase.co';
const supabaseKey = 'sb_publishable_-cH7Xx0cAUTgGeK7KLFP4w_a2TLTf9x';
const supabase = createClient(supabaseUrl, supabaseKey);

const VIDEO_ID = '8efe9327-9d56-4288-9b31-de40111abe44';
const NEW_STREAM_URL = 'https://ssh101.com/securelive/index.php?id=bytekwanzalive';

async function main() {
  // Login como admin
  console.log('Fazendo login como admin...');
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: 'bytekwanza@gmail.com',
    password: 'bytekwanza1975'
  });

  if (authError) {
    console.error('Erro de autenticação:', JSON.stringify(authError, null, 2));
    return;
  }
  console.log('Login OK:', authData.user.email);

  // Actualizar
  console.log('\\nActualizando video_url...');
  const { data: updated, error: updateError } = await supabase
    .from('video_news')
    .update({ 
      video_url: NEW_STREAM_URL,
      category: 'Directo'
    })
    .eq('id', VIDEO_ID)
    .select();

  if (updateError) {
    console.error('Erro ao actualizar:', JSON.stringify(updateError, null, 2));
    return;
  }

  if (!updated || updated.length === 0) {
    console.log('AVISO: update retornou vazio (pode ser RLS). A verificar...');
    const { data: check } = await supabase.from('video_news').select('video_url, category').eq('id', VIDEO_ID).single();
    console.log('Estado actual:', JSON.stringify(check, null, 2));
  } else {
    console.log('SUCESSO! Actualizado:');
    console.log(JSON.stringify(updated[0], null, 2));
  }
}

main().catch(e => console.error('Erro fatal:', e.message));
