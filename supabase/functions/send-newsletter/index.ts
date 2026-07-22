import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        // Extrair o token JWT do header de autorização
        const authHeader = req.headers.get('Authorization');
        if (!authHeader) throw new Error('Não autorizado: header de autorização em falta');
        const token = authHeader.replace('Bearer ', '');

        // Usar apenas o cliente admin (service role) para tudo
        const supabaseAdmin = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        );

        // Validar o utilizador pelo token JWT
        const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);
        if (userError || !user) throw new Error('Não autorizado: token inválido');

        // Verificar se o utilizador possui regra de 'admin'
        const { data: roles } = await supabaseAdmin
            .from('user_roles')
            .select('role')
            .eq('user_id', user.id)
            .eq('role', 'admin')
            .single();

        if (!roles) {
            throw new Error('Acesso negado: apenas administradores podem enviar newsletters');
        }

        const { subject, content } = await req.json();
        if (!subject || !content) throw new Error('Assunto e conteúdo são obrigatórios');

        // Buscar perfis com e-mail
        const { data: profiles, error: profilesError } = await supabaseAdmin
            .from('profiles')
            .select('email, full_name')
            .not('email', 'is', null);

        if (profilesError) throw profilesError;
        if (!profiles || profiles.length === 0) throw new Error('Nenhum utilizador com email encontrado');

        const resendApiKey = Deno.env.get('RESEND_API_KEY');
        if (!resendApiKey) throw new Error('A chave da API do Resend (RESEND_API_KEY) não está configurada nos segredos (secrets)');

        const batchedEmails = [];
        const BATCH_SIZE = 50;

        for (let i = 0; i < profiles.length; i += BATCH_SIZE) {
            const batch = profiles.slice(i, i + BATCH_SIZE).map(profile => ({
                from: 'Angola Sem Filtros <angolasemfiltros@gmail.com>',
                to: [profile.email],
                subject: subject,
                html: content,
            }));
            batchedEmails.push(batch);
        }

        let successCount = 0;
        let errorDetails = '';

        // Envio em Lotes 
        for (const batch of batchedEmails) {
            const res = await fetch('https://api.resend.com/emails/batch', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${resendApiKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(batch),
            });

            if (!res.ok) {
                const err = await res.text();
                console.error('Erro ao enviar lote:', err);
                errorDetails += err + ' | ';
            } else {
                successCount += batch.length;
            }
        }

        const finalStatus = successCount === profiles.length ? 'success' : (successCount > 0 ? 'partial' : 'error');

        // Gravar o log da newsletter 
        const { error: logError } = await supabaseAdmin.from('newsletter_logs').insert({
            subject,
            content,
            recipient_count: successCount,
            status: finalStatus,
            error_details: errorDetails || null,
            created_by: user.id
        });

        if (logError) console.error('Erro ao gravar log:', logError);

        return new Response(
            JSON.stringify({ success: true, sent: successCount, status: finalStatus }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        );

    } catch (error) {
        console.error('Erro Edge Function da Newsletter:', error);
        return new Response(
            JSON.stringify({ error: error.message }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        );
    }
});
