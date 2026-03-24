-- ################################################################################
-- DROP AND RECREATE PROFILES TABLE
-- Run this in Supabase SQL Editor to safely drop and recreate the table
-- ################################################################################

-- 1. Drop the table and any dependent constraints/views (CASCADE)
DROP TABLE IF EXISTS public.profiles CASCADE;

-- 2. Recreate the table with the exact schema needed
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  email TEXT,
  nome TEXT,
  role public.app_role DEFAULT 'user',
  status TEXT DEFAULT 'ACTIVO',
  referral_code TEXT,
  last_access TIMESTAMPTZ,
  access_count INTEGER DEFAULT 0
);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 4. Re-create generic security policies for profiles
CREATE POLICY "Profiles are viewable by everyone" 
  ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" 
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can manage all profiles" 
  ON public.profiles FOR ALL USING (
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
  );

-- 5. Restore the admin profile
INSERT INTO public.profiles (id, user_id, email, full_name, role, status)
SELECT id, id, email, 'Admin Central', 'admin', 'ACTIVO'
FROM auth.users
WHERE email = 'bytekwanza@gmail.com'
ON CONFLICT (id) DO NOTHING;

-- 6. Re-create any dropped Foreign Keys that depended on profiles (e.g. kyc_submissions)
-- Check if kyc_submissions exists before altering
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'kyc_submissions') THEN
    ALTER TABLE public.kyc_submissions 
      ADD CONSTRAINT kyc_submissions_user_id_fkey 
      FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
  END IF;
END $$;
