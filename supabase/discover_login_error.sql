-- ################################################################################
-- DIAGNÓSTICO PROFUNDO DE ERROS DE LOGIN E TRIGGERS
-- Execute no SQLEditor do Supabase e envie um Print Screen do resultado!
-- ################################################################################

-- 1. Ver os últimos ERROS REAIS que impediram o login
SELECT
  created_at,
  payload->>'message' AS error_message
FROM auth.audit_log_entries
WHERE
  payload->>'error' IS NOT NULL
  OR payload->>'message' ILIKE '%error%'
ORDER BY created_at DESC
LIMIT 5;

-- 2. Mostrar TODOS os triggers (gatilhos) que ficaram "perdidos" do outro projeto na tabela auth.users
SELECT 
  tgname AS nome_do_gatilho, 
  tgenabled AS ativo
FROM pg_trigger
WHERE tgrelid = 'auth.users'::regclass
AND tgname NOT LIKE 'RI_ConstraintTrigger%';
