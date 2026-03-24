-- ################################################################################
-- SCHEMA FIX FOR OPINION ARTICLES
-- Execute este código no SQL Editor do Supabase.
-- ################################################################################

-- 1. Renomear summary para excerpt (para coincidir com o frontend)
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'opinion_articles' AND column_name = 'summary') THEN
    ALTER TABLE public.opinion_articles RENAME COLUMN summary TO excerpt;
  END IF;
END $$;

-- 2. Recarregar o cache do esquema
NOTIFY pgrst, 'reload schema';
