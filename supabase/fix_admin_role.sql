-- ################################################################################
-- DIAGNOSE: Run this SELECT first to see the current state
-- ################################################################################
SELECT
  u.id,
  u.email,
  u.email_confirmed_at,
  u.raw_user_meta_data->>'role' AS meta_role,
  p.role   AS profile_role,
  p.status AS profile_status,
  r.role   AS user_roles_role
FROM auth.users u
LEFT JOIN public.profiles  p ON p.user_id = u.id
LEFT JOIN public.user_roles r ON r.user_id = u.id
WHERE u.email = 'bytekwanza@gmail.com';

-- ################################################################################
-- FIX: If profile_role or user_roles_role is NULL or wrong, run this block
-- ################################################################################
DO $$
DECLARE
  v_user_id UUID;
  v_email   TEXT := 'bytekwanza@gmail.com';
BEGIN
  SELECT id INTO v_user_id FROM auth.users WHERE email = v_email;

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Utilizador não encontrado: %. Crie o utilizador primeiro no Dashboard Authentication.', v_email;
  END IF;

  RAISE NOTICE 'User ID encontrado: %', v_user_id;

  -- 1. Update metadata to include role=admin
  UPDATE auth.users
  SET raw_user_meta_data = COALESCE(raw_user_meta_data, '{}'::jsonb)
                           || jsonb_build_object('full_name', 'Admin', 'role', 'admin'),
      updated_at = NOW()
  WHERE id = v_user_id;

  -- 2. Upsert profile with admin role
  INSERT INTO public.profiles (id, user_id, email, full_name, role, status)
  VALUES (v_user_id, v_user_id, v_email, 'Admin', 'admin'::public.app_role, 'ACTIVO')
  ON CONFLICT (id) DO UPDATE
    SET role     = 'admin'::public.app_role,
        status   = 'ACTIVO',
        email    = EXCLUDED.email,
        full_name = 'Admin',
        user_id  = v_user_id;

  -- 3. Upsert into user_roles
  INSERT INTO public.user_roles (user_id, role)
  VALUES (v_user_id, 'admin'::public.app_role)
  ON CONFLICT (user_id, role) DO NOTHING;

  -- 4. Clean up any 'user' role that might override admin
  DELETE FROM public.user_roles
  WHERE user_id = v_user_id AND role = 'user'::public.app_role;

  RAISE NOTICE '✅ Admin configurado com sucesso para: %', v_email;
END $$;

-- ################################################################################
-- VERIFY: Run this after to confirm everything is correct
-- ################################################################################
SELECT
  u.email,
  u.raw_user_meta_data->>'role' AS meta_role,
  p.role   AS profile_role,
  r.role   AS user_roles_role
FROM auth.users u
LEFT JOIN public.profiles   p ON p.user_id = u.id
LEFT JOIN public.user_roles r ON r.user_id = u.id
WHERE u.email = 'bytekwanza@gmail.com';
