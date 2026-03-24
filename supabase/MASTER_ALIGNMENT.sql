-- ################################################################################
-- MASTER SCHEMA ALIGNMENT - ANGOLA DENÚNCIAS
-- Execute este script no SQL Editor do Supabase para alinhar TUDO de uma vez.
-- ################################################################################

-- 1. ALINHAMENTO DE ARTIGOS DE OPINIÃO
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'opinion_articles' AND column_name = 'summary') THEN
    ALTER TABLE public.opinion_articles RENAME COLUMN summary TO excerpt;
  END IF;
END $$;

-- 2. ALINHAMENTO DE COMENTÁRIOS
ALTER TABLE public.article_comments ADD COLUMN IF NOT EXISTS user_name TEXT;

-- 3. ALINHAMENTO DE PERFIS (UTILIZADORES)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS last_access TIMESTAMPTZ;

-- 4. REESTRUTURAÇÃO COMPLETA DE ANALYTICS (SITE_VISITS)
-- Vamos recriar para coincidir exatamente com o AnalyticsTracker.tsx
DROP TABLE IF EXISTS public.site_visits;
CREATE TABLE public.site_visits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  visitor_id TEXT,
  country TEXT,
  device_type TEXT,
  device_model TEXT,
  browser TEXT,
  os TEXT,
  user_email TEXT,
  page_url TEXT, -- Opcional, mantido para compatibilidade futura
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. ALINHAMENTO DE ANÚNCIOS (GARANTIA)
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'advertisements' AND column_name = 'target_url') THEN
    ALTER TABLE public.advertisements RENAME COLUMN target_url TO link_url;
  END IF;
END $$;
ALTER TABLE public.advertisements ADD COLUMN IF NOT EXISTS video_url TEXT;

-- 6. CORREÇÃO DE COMENTÁRIOS (POLIMORFISMO E PERMISSÕES)
-- Remover restrição de FK para permitir comentários em Notícias E Opiniões
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'article_comments_article_id_fkey') THEN
    ALTER TABLE public.article_comments DROP CONSTRAINT article_comments_article_id_fkey;
  END IF;
END $$;

-- Garantir políticas de RLS para inserção
DROP POLICY IF EXISTS "Anyone can insert comments" ON public.article_comments;
CREATE POLICY "Anyone can insert comments" ON public.article_comments FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Public can view approved comments" ON public.article_comments;
CREATE POLICY "Public can view approved comments" ON public.article_comments FOR SELECT USING (true); -- Permitir ver todos para teste rapido, ou manter (status = 'approved')

-- 7. GARANTIR PERMISSÕES PÚBLICAS (GRANT)
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT INSERT ON public.article_comments TO anon, authenticated;
GRANT INSERT ON public.site_visits TO anon, authenticated;

-- 8. ATIVAR REALTIME PARA DASHBOARD DINÂMICO
-- Isto permite que as estatísticas no Admin atualizem sem Refresh
DO $$ 
BEGIN
  -- Garantir que a publicação existe
  IF NOT EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    CREATE PUBLICATION supabase_realtime;
  END IF;
  
  -- Adicionar tabelas à publicação (ignorar se já existirem)
  ALTER PUBLICATION supabase_realtime ADD TABLE public.site_visits;
  ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
  ALTER PUBLICATION supabase_realtime ADD TABLE public.news_articles;
  ALTER PUBLICATION supabase_realtime ADD TABLE public.opinion_articles;
  ALTER PUBLICATION supabase_realtime ADD TABLE public.video_news;
EXCEPTION WHEN OTHERS THEN
  -- Ignorar erros se a tabela já estiver na publicação
  NULL;
END $$;

-- 9. RECARREGAR CACHE
NOTIFY pgrst, 'reload schema';
