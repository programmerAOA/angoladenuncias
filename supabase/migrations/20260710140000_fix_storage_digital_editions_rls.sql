-- ============================================================
-- FIX: Storage RLS policies for 'digital-editions' bucket
-- Execute this in Supabase Dashboard > SQL Editor
-- ============================================================

-- Remove existing storage policies for the bucket
DROP POLICY IF EXISTS "Admins can manage digital edition files" ON storage.objects;
DROP POLICY IF EXISTS "Users can access their purchased digital edition files" ON storage.objects;
DROP POLICY IF EXISTS "Public can view digital edition files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can upload digital edition files" ON storage.objects;

-- Allow admin AND editor to upload, update, delete files in the bucket
CREATE POLICY "Admins and editors can manage digital edition files"
ON storage.objects FOR ALL
USING (
    bucket_id = 'digital-editions'
    AND (
        public.has_role(auth.uid(), 'admin')
        OR public.has_role(auth.uid(), 'editor')
    )
)
WITH CHECK (
    bucket_id = 'digital-editions'
    AND (
        public.has_role(auth.uid(), 'admin')
        OR public.has_role(auth.uid(), 'editor')
    )
);

-- Allow authenticated users to read files they purchased (or free editions)
CREATE POLICY "Users can read purchased or free digital edition files"
ON storage.objects FOR SELECT
USING (
    bucket_id = 'digital-editions'
    AND (
        public.has_role(auth.uid(), 'admin')
        OR public.has_role(auth.uid(), 'editor')
        OR EXISTS (
            SELECT 1 FROM public.digital_editions de
            WHERE de.is_free = true
        )
        OR EXISTS (
            SELECT 1 FROM public.digital_purchases dp
            WHERE dp.user_id = auth.uid()
        )
    )
);
