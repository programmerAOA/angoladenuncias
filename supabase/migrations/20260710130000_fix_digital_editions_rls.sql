-- Fix RLS policies for digital_editions table
-- Problem: FOR ALL with only USING clause doesn't cover INSERT (needs WITH CHECK)
-- Also: only admin was allowed, but editor should be able to manage too (consistent with other tables)

-- Drop existing policies
DROP POLICY IF EXISTS "Admins can manage digital editions" ON public.digital_editions;
DROP POLICY IF EXISTS "Anyone can view published digital editions" ON public.digital_editions;

-- Recreate SELECT policy (public can view published editions)
CREATE POLICY "Anyone can view published digital editions"
  ON public.digital_editions FOR SELECT
  USING (published = true);

-- Recreate management policy with explicit WITH CHECK for INSERT support
-- Consistent with news_articles, video_news, opinion_articles (allow admin OR editor)
CREATE POLICY "Admins can manage digital editions"
  ON public.digital_editions FOR ALL
  USING (
    public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor')
  )
  WITH CHECK (
    public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor')
  );

-- Also fix digital_purchases: admins should be able to insert/delete purchases
DROP POLICY IF EXISTS "Admins can manage all purchases" ON public.digital_purchases;
CREATE POLICY "Admins can manage all purchases"
  ON public.digital_purchases FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
