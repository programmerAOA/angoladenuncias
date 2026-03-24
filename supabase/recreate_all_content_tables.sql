-- ################################################################################
-- CONTENT SCHEMA - RECREATE MISSING TABLES
-- Run this in your NEW Supabase Project's SQL Editor to restore all content tables
-- ################################################################################

-- 1. NEWS ARTICLES
CREATE TABLE IF NOT EXISTS public.news_articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  summary TEXT,
  content TEXT,
  category TEXT DEFAULT 'Geral',
  author TEXT DEFAULT 'Redacção',
  image_url TEXT,
  is_hero BOOLEAN DEFAULT false,
  is_breaking BOOLEAN DEFAULT false,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  views INTEGER DEFAULT 0
);

-- 2. VIDEO NEWS
CREATE TABLE IF NOT EXISTS public.video_news (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  duration TEXT,
  category TEXT DEFAULT 'Geral',
  published BOOLEAN DEFAULT true,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. OPINION ARTICLES
CREATE TABLE IF NOT EXISTS public.opinion_articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  summary TEXT,
  content TEXT,
  author TEXT NOT NULL,
  avatar_url TEXT,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  views INTEGER DEFAULT 0
);

-- 4. BREAKING NEWS (ALERTS)
CREATE TABLE IF NOT EXISTS public.breaking_news (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  text TEXT NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. SITE VISITS (ANALYTICS)
CREATE TABLE IF NOT EXISTS public.site_visits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  path TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. ADVERTISEMENTS
CREATE TABLE IF NOT EXISTS public.advertisements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  image_url TEXT NOT NULL,
  target_url TEXT,
  slot TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. ARTICLE COMMENTS
CREATE TABLE IF NOT EXISTS public.article_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  article_id UUID REFERENCES public.news_articles(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  user_avatar TEXT,
  content TEXT NOT NULL,
  status TEXT DEFAULT 'approved',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.news_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opinion_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.breaking_news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.advertisements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_comments ENABLE ROW LEVEL SECURITY;

-- 9. CREATE READ-ONLY PUBLIC POLICIES
CREATE POLICY "Public can view articles" ON public.news_articles FOR SELECT USING (published = true OR auth.role() = 'authenticated');
CREATE POLICY "Public can view videos" ON public.video_news FOR SELECT USING (published = true OR auth.role() = 'authenticated');
CREATE POLICY "Public can view opinions" ON public.opinion_articles FOR SELECT USING (published = true OR auth.role() = 'authenticated');
CREATE POLICY "Public can view breaking" ON public.breaking_news FOR SELECT USING (active = true OR auth.role() = 'authenticated');
CREATE POLICY "Public can view ads" ON public.advertisements FOR SELECT USING (active = true);
CREATE POLICY "Public can view approved comments" ON public.article_comments FOR SELECT USING (status = 'approved');

-- 10. CREATE ADMIN POLICIES (ALL ACCESS)
-- (We use simple EXIST checks against user_roles)
CREATE POLICY "Admins full access articles" ON public.news_articles FOR ALL USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role IN ('admin', 'editor'))
);
CREATE POLICY "Admins full access videos" ON public.video_news FOR ALL USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role IN ('admin', 'editor'))
);
CREATE POLICY "Admins full access opinions" ON public.opinion_articles FOR ALL USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role IN ('admin', 'editor'))
);
CREATE POLICY "Admins full access breaking" ON public.breaking_news FOR ALL USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role IN ('admin', 'editor'))
);
CREATE POLICY "Admins full access ads" ON public.advertisements FOR ALL USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins full access comments" ON public.article_comments FOR ALL USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role IN ('admin', 'editor'))
);

-- Site visits can be inserted by anyone, viewed by admins
CREATE POLICY "Anyone can insert site visits" ON public.site_visits FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins view site visits" ON public.site_visits FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);
