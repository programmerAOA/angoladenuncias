-- ################################################################################
-- SYSTEM HEALTH & SYNCHRONIZATION SCRIPT (V2.4 - EXTREME ROBUST)
-- ################################################################################

-- 0. Environment Setup
SET search_path TO public, auth, extensions, storage;

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. ENUMS
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
        CREATE TYPE public.app_role AS ENUM ('admin', 'editor', 'user');
    END IF;
END $$;

-- 3. PROFILES TABLE SYNCHRONIZATION
-- Ensure it is a table and add columns
DO $$
BEGIN
    -- Only proceed if it is a table
    IF (SELECT relkind FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace WHERE n.nspname = 'public' AND c.relname = 'profiles') = 'v' THEN
        RAISE NOTICE 'Warning: public.profiles is a VIEW. This script expects a TABLE.';
    END IF;
END $$;

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS nome TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role public.app_role DEFAULT 'user';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'ACTIVO';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS referral_code TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS last_access TIMESTAMPTZ;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS access_count INTEGER DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Update user_id mapping
UPDATE public.profiles SET user_id = id WHERE user_id IS NULL AND id IS NOT NULL;

-- 4. SYSTEM SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.system_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key TEXT UNIQUE NOT NULL,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO public.system_settings (key, value)
VALUES ('ticker', '{"speed": 30}')
ON CONFLICT (key) DO NOTHING;

-- 5. ACCESS CONTROL TABLES
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role public.app_role NOT NULL DEFAULT 'user',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, role)
);

CREATE TABLE IF NOT EXISTS public.editor_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    category TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, category)
);

CREATE TABLE IF NOT EXISTS public.editor_menu_permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    menu_id TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, menu_id)
);

-- 6. DIGITAL EDITIONS TABLES
CREATE TABLE IF NOT EXISTS public.digital_editions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  pdf_url TEXT,
  cover_url TEXT,
  price_aoa DECIMAL(12,2) DEFAULT 0,
  price_usd DECIMAL(12,2) DEFAULT 0,
  is_free BOOLEAN DEFAULT false,
  published BOOLEAN DEFAULT true,
  edition_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.digital_purchases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  edition_id UUID REFERENCES public.digital_editions(id) ON DELETE CASCADE,
  purchase_date TIMESTAMPTZ DEFAULT NOW(),
  amount DECIMAL(12,2) NOT NULL,
  status TEXT DEFAULT 'completed',
  UNIQUE(user_id, edition_id)
);

-- 7. AUTH TRIGGER FIX
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- Dynamic SQL to bypass potential validation issues with newly added columns
  EXECUTE '
    INSERT INTO public.profiles (id, user_id, email, full_name, nome, role, status, referral_code)
    VALUES ($1, $1, $2, $3, $4, $5, $6, $7)
    ON CONFLICT (id) DO UPDATE SET
      email = EXCLUDED.email,
      user_id = EXCLUDED.user_id,
      full_name = EXCLUDED.full_name,
      nome = EXCLUDED.nome,
      status = EXCLUDED.status,
      updated_at = NOW()'
  USING 
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'nome', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'nome', NEW.raw_user_meta_data ->> 'full_name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'role', 'user')::public.app_role,
    'ACTIVO',
    'REF-' || (1000 + floor(random() * 9000))::text;
  
  -- Insert into user_roles
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data ->> 'role', 'user')::public.app_role)
  ON CONFLICT (user_id, role) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Re-attach trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 8. ADMIN SETUP (Dynamic Execution to bypass parser)
DO $$ 
DECLARE
  v_user_id UUID;
  v_email TEXT := 'angoladenuncias@gmail.com';
BEGIN
  SELECT id INTO v_user_id FROM auth.users WHERE email = v_email;

  IF v_user_id IS NOT NULL THEN
    -- Metadata update
    UPDATE auth.users 
    SET raw_user_meta_data = raw_user_meta_data || '{"role":"admin"}',
        updated_at = now()
    WHERE id = v_user_id;

    -- Profile setup - Dynamic SQL to handle newly created columns
    -- Split into multiple statements if necessary
    EXECUTE '
      INSERT INTO public.profiles (user_id, email, full_name, role, status)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (user_id) DO UPDATE 
      SET role = EXCLUDED.role, status = EXCLUDED.status, email = EXCLUDED.email'
    USING v_user_id, v_email, 'Admin Central', 'admin', 'ACTIVO';

    -- Role setup
    INSERT INTO public.user_roles (user_id, role)
    VALUES (v_user_id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
END $$;

-- 9. RLS POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.digital_editions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.digital_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.editor_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.editor_menu_permissions ENABLE ROW LEVEL SECURITY;

-- Editor Categories & Menu Permissions (Admin Only)
DROP POLICY IF EXISTS "Admins manage editor categories" ON public.editor_categories;
CREATE POLICY "Admins manage editor categories" ON public.editor_categories FOR ALL USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

DROP POLICY IF EXISTS "Admins manage editor menu permissions" ON public.editor_menu_permissions;
CREATE POLICY "Admins manage editor menu permissions" ON public.editor_menu_permissions FOR ALL USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

-- Others can select their own (though mostly for checks)
DROP POLICY IF EXISTS "Users view own categories" ON public.editor_categories;
CREATE POLICY "Users view own categories" ON public.editor_categories FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users view own menu permissions" ON public.editor_menu_permissions;
CREATE POLICY "Users view own menu permissions" ON public.editor_menu_permissions FOR SELECT USING (auth.uid() = user_id);

-- 10. STORAGE Buckets
INSERT INTO storage.buckets (id, name, public) 
VALUES ('digital-editions', 'digital-editions', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('articles', 'articles', true)
ON CONFLICT (id) DO NOTHING;

-- Policies (Simplified for broad access)
DROP POLICY IF EXISTS "Settings view" ON public.system_settings;
CREATE POLICY "Settings view" ON public.system_settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin manage settings" ON public.system_settings;
CREATE POLICY "Admin manage settings" ON public.system_settings FOR ALL USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);
