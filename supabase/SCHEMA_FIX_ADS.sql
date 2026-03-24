-- ################################################################################
-- SCHEMA FIX FOR ADVERTISEMENTS
-- Execute este código no SQL Editor do Supabase.
-- ################################################################################

-- 1. Renomear target_url para link_url (para coincidir com o frontend)
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'advertisements' AND column_name = 'target_url') THEN
    ALTER TABLE public.advertisements RENAME COLUMN target_url TO link_url;
  END IF;
END $$;

-- 2. Adicionar video_url se não existir
ALTER TABLE public.advertisements ADD COLUMN IF NOT EXISTS video_url TEXT;

-- 3. Recarregar o cache do esquema (Supabase faz isto automaticamente, mas é bom garantir)
NOTIFY pgrst, 'reload schema';
