-- ################################################################################
-- RESTORE ADMIN TABLES (PROFILES & USER_ROLES)
-- Run this in Supabase SQL Editor to restore the Admin Dashboard
-- ################################################################################

-- 1. Create App Role Enum if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
        CREATE TYPE public.app_role AS ENUM ('admin', 'editor', 'user');
    END IF;
END $$;

-- 2. Create the PROFILES table
CREATE TABLE IF NOT EXISTS public.profiles (
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

-- 3. Create the USER_ROLES table
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role public.app_role NOT NULL DEFAULT 'user',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, role)
);

-- 4. Enable RLS (Security)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 5. Create generic security policies
CREATE POLICY "Profiles viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users read own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Service role manages roles" ON public.user_roles FOR ALL USING (auth.uid() = user_id OR auth.role() = 'service_role');

-- 6. Re-insert the Admin user
INSERT INTO public.profiles (id, user_id, email, full_name, role, status)
SELECT id, id, email, 'Admin Central', 'admin', 'ACTIVO'
FROM auth.users
WHERE email = 'bytekwanza@gmail.com'
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'
FROM auth.users
WHERE email = 'bytekwanza@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;

-- 7. Restore KYC Submissions foreign key (if applicable)
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'kyc_submissions') THEN
    ALTER TABLE public.kyc_submissions DROP CONSTRAINT IF EXISTS kyc_submissions_user_id_fkey;
    ALTER TABLE public.kyc_submissions ADD CONSTRAINT kyc_submissions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
  END IF;
END $$;
