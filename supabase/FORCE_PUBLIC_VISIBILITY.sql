-- ################################################################################
-- SCRIPT DE REPARAÇÃO DE ACESSO PÚBLICO (FORCE READ)
-- Execute este código no SQL Editor do seu novo Supabase.
-- Ele garante que as notícias sejam visíveis para todos os visitantes.
-- ################################################################################

-- 1. Desativar RLS temporariamente para garantir que os dados apareçam
ALTER TABLE public.news_articles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_news DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.opinion_articles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.breaking_news DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.advertisements DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.digital_editions DISABLE ROW LEVEL SECURITY;

-- 2. Garantir que as tabelas têm políticas de leitura se o RLS for reativado no futuro
DROP POLICY IF EXISTS "Allow public read news_articles" ON public.news_articles;
CREATE POLICY "Allow public read news_articles" ON public.news_articles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read video_news" ON public.video_news;
CREATE POLICY "Allow public read video_news" ON public.video_news FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read opinion_articles" ON public.opinion_articles;
CREATE POLICY "Allow public read opinion_articles" ON public.opinion_articles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read breaking_news" ON public.breaking_news;
CREATE POLICY "Allow public read breaking_news" ON public.breaking_news FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read system_settings" ON public.system_settings;
CREATE POLICY "Allow public read system_settings" ON public.system_settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read advertisements" ON public.advertisements;
CREATE POLICY "Allow public read advertisements" ON public.advertisements FOR SELECT USING (true);

-- 3. Dar permissão de SELECT explicitamente ao utilizador anónimo (visitante)
GRANT SELECT ON TABLE public.news_articles TO anon, authenticated;
GRANT SELECT ON TABLE public.video_news TO anon, authenticated;
GRANT SELECT ON TABLE public.opinion_articles TO anon, authenticated;
GRANT SELECT ON TABLE public.breaking_news TO anon, authenticated;
GRANT SELECT ON TABLE public.system_settings TO anon, authenticated;
GRANT SELECT ON TABLE public.advertisements TO anon, authenticated;
GRANT SELECT ON TABLE public.digital_editions TO anon, authenticated;

-- 4. Reativar RLS (opcional, mas recomendado depois de confirmar que funciona)
-- ALTER TABLE public.news_articles ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.video_news ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.opinion_articles ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.breaking_news ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.advertisements ENABLE ROW LEVEL SECURITY;
