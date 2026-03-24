-- ################################################################################
-- FINAL ADMIN ACCESS REPAIR
-- Execute este código no SQL Editor.
-- ################################################################################

-- 1. Desativar RLS na tabela de cargos para o frontend conseguir ler
ALTER TABLE public.user_roles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- 2. Garantir permissões de leitura para utilizadores autenticados
GRANT SELECT ON TABLE public.user_roles TO authenticated, anon;
GRANT SELECT ON TABLE public.profiles TO authenticated, anon;

-- 3. Confirmar que o utilizador bytekwanza@gmail.com é ADMIN (Forçar novamente)
DO $$ 
DECLARE
  v_user_id UUID;
BEGIN
  SELECT id INTO v_user_id FROM auth.users WHERE email = 'bytekwanza@gmail.com' LIMIT 1;
  
  IF v_user_id IS NOT NULL THEN
    -- Inserir/Atualizar na tabela profiles
    INSERT INTO public.profiles (id, user_id, email, role, status, full_name)
    VALUES (v_user_id, v_user_id, 'bytekwanza@gmail.com', 'admin', 'ACTIVO', 'Administrador Global')
    ON CONFLICT (id) DO UPDATE SET role = 'admin', status = 'ACTIVO';

    -- Inserir/Atualizar na tabela user_roles
    INSERT INTO public.user_roles (user_id, role)
    VALUES (v_user_id, 'admin')
    ON CONFLICT (user_id, role) DO UPDATE SET role = 'admin';
  END IF;
END $$;
