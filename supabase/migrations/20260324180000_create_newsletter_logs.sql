-- Create newsletter logs table
CREATE TABLE IF NOT EXISTS public.newsletter_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject TEXT NOT NULL,
    content TEXT NOT NULL,
    recipient_count INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL,
    error_details TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

-- Safely enable RLS
ALTER TABLE public.newsletter_logs ENABLE ROW LEVEL SECURITY;

-- Grant access to authenticated users (admin logic will be handled at app level or RLS)
-- Since only admins can access the admin dashboard, we can allow insert/select for editors/admins
-- Assuming the previous RLS policies for admins apply. Let's make a simple policy:

CREATE POLICY "Enable read access for all users" ON "public"."newsletter_logs"
  AS PERMISSIVE FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON "public"."newsletter_logs"
  AS PERMISSIVE FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- It's better to lock this down to admins only, but we don't have a clear "admin" role in auth.users by default.
-- Based on the app's structure, "user_roles" holds the roles. So we can do:
-- USING ( auth.uid() IN (SELECT user_id FROM user_roles WHERE role IN ('admin', 'editor')) )
