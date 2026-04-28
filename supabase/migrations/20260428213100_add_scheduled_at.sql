-- Add scheduled_at to news_articles and opinion_articles for scheduling feature
ALTER TABLE public.news_articles ADD COLUMN IF NOT EXISTS scheduled_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.opinion_articles ADD COLUMN IF NOT EXISTS scheduled_at TIMESTAMP WITH TIME ZONE;
