-- ################################################################################
-- ONE-CLICK SETUP SCRIPT FOR "ANGOLA DENUNCIAS"
-- COPIE ESTE CÓDIGO TODO E EXECUTE NO "SQL EDITOR" DO SEU NOVO SUPABASE!
-- ELE CRIA TODAS AS TABELAS E DÁ-LHE ACESSO DE ADMINISTRADOR IMEDIATAMENTE.
-- ################################################################################

-- 1. EXTENSÕES & ENUMS
SET search_path TO public, auth, extensions, storage;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
        CREATE TYPE public.app_role AS ENUM ('admin', 'editor', 'user');
    END IF;
END $$;

-- 2. TABELAS CENTRAIS E DE ADMINISTRAÇÃO
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  nome TEXT,
  full_name TEXT,
  avatar_url TEXT,
  role public.app_role DEFAULT 'user',
  status TEXT DEFAULT 'ACTIVO',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

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

CREATE TABLE IF NOT EXISTS public.system_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key TEXT UNIQUE NOT NULL,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
INSERT INTO public.system_settings (key, value) VALUES ('ticker', '{"speed": 30}') ON CONFLICT (key) DO NOTHING;

-- 3. TABELAS DE CONTEÚDO (NOTÍCIAS, VÍDEOS, ETC)
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

CREATE TABLE IF NOT EXISTS public.breaking_news (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  text TEXT NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.site_visits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  path TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

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

-- 4. GATILHO DE CRIAÇÃO AUTOMÁTICA DE PERFIL (Sem código de referências)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, user_id, email, full_name, nome, role, status)
  VALUES (
    NEW.id, NEW.id, NEW.email, 
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'nome', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'nome', NEW.raw_user_meta_data ->> 'full_name', ''),
    COALESCE((NEW.raw_user_meta_data ->> 'role')::public.app_role, 'user'::public.app_role), 'ACTIVO'
  )
  ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email;
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, COALESCE((NEW.raw_user_meta_data ->> 'role')::public.app_role, 'user'::public.app_role))
  ON CONFLICT (user_id, role) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 5. BUCKETS DE STORAGE
INSERT INTO storage.buckets (id, name, public) VALUES ('digital-editions', 'digital-editions', false) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('articles', 'articles', true) ON CONFLICT DO NOTHING;

-- 6. TRANSFORMAR BYTEKWANZA@GMAIL.COM EM ADMIN ESTATAL
-- O código abaixo garante que você é admin, independentemente de atrasos no sistema.
DO $$ 
DECLARE
  v_user_id UUID;
BEGIN
  -- Procurar o utilizador
  SELECT id INTO v_user_id FROM auth.users WHERE email = 'bytekwanza@gmail.com' LIMIT 1;
  
  -- Se o utilizador existir, recriar o perfil manual e o cargo
  IF v_user_id IS NOT NULL THEN
    INSERT INTO public.profiles (id, user_id, email, role, status, full_name)
    VALUES (v_user_id, v_user_id, 'bytekwanza@gmail.com', 'admin', 'ACTIVO', 'Administrador Global')
    ON CONFLICT (id) DO UPDATE SET role = 'admin', status = 'ACTIVO';

    INSERT INTO public.user_roles (user_id, role)
    VALUES (v_user_id, 'admin')
    ON CONFLICT (user_id, role) DO UPDATE SET role = 'admin';
  END IF;
END $$;
