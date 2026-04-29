-- Adicionar flag de controlo para não enviar a mesma notificação dúzias de vezes
ALTER TABLE public.news_articles ADD COLUMN IF NOT EXISTS notification_sent BOOLEAN DEFAULT false;
ALTER TABLE public.opinion_articles ADD COLUMN IF NOT EXISTS notification_sent BOOLEAN DEFAULT false;
