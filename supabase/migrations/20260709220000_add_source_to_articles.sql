-- Add optional source fields to news_articles
ALTER TABLE public.news_articles
  ADD COLUMN IF NOT EXISTS source_name TEXT,
  ADD COLUMN IF NOT EXISTS source_url  TEXT;
