-- ################################################################################
-- RESET ALL USERS & CREATE NEW ADMIN (v3)
-- ⚠️ WARNING: Deletes ALL existing users permanently.
-- Run ONCE in the Supabase SQL Editor.
-- ################################################################################

-- 1. Clean up all dependent data first (order matters for FK constraints)
DELETE FROM public.kyc_submissions;
DELETE FROM public.digital_purchases;
DELETE FROM public.user_roles;
DELETE FROM public.editor_categories;
DELETE FROM public.editor_menu_permissions;
DELETE FROM public.profiles;
DELETE FROM auth.identities;
DELETE FROM auth.sessions;
DELETE FROM auth.refresh_tokens;
DELETE FROM auth.users;

-- 2. Create the new admin user
-- The on_auth_user_created trigger will automatically run and create the profile.
-- We update it afterwards to set the admin role.
DO $$
DECLARE
  v_user_id UUID := gen_random_uuid();
  v_email   TEXT := 'bytekwanza@gmail.com';
  v_pw_hash TEXT;
BEGIN
  v_pw_hash := crypt('@MPLA1975#', gen_salt('bf'));

  -- Insert into auth.users (trigger fires automatically)
  -- Note: confirmed_at is a generated column, omit it
  INSERT INTO auth.users (
    id, instance_id, aud, role,
    email, encrypted_password,
    email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data,
    is_super_admin,
    created_at, updated_at,
    last_sign_in_at
  ) VALUES (
    v_user_id,
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    v_email, v_pw_hash,
    NOW(),
    '{"provider":"email","providers":["email"]}',
    jsonb_build_object('full_name', 'Admin', 'role', 'admin'),
    false,
    NOW(), NOW(), NOW()
  );

  -- Insert identity record (required for email/password login)
  INSERT INTO auth.identities (
    provider_id, user_id,
    identity_data, provider,
    last_sign_in_at, created_at, updated_at
  ) VALUES (
    v_email, v_user_id,
    jsonb_build_object('sub', v_user_id::text, 'email', v_email, 'email_verified', true),
    'email',
    NOW(), NOW(), NOW()
  );

  -- Update profile to ensure admin role (trigger may have created it as 'user')
  UPDATE public.profiles
  SET role = 'admin'::public.app_role,
      status = 'ACTIVO',
      full_name = 'Admin',
      email = v_email
  WHERE user_id = v_user_id;

  -- If profile wasn't created by trigger, insert it now
  INSERT INTO public.profiles (id, user_id, email, full_name, role, status)
  VALUES (v_user_id, v_user_id, v_email, 'Admin', 'admin'::public.app_role, 'ACTIVO')
  ON CONFLICT (id) DO NOTHING;

  -- Assign admin role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (v_user_id, 'admin'::public.app_role)
  ON CONFLICT (user_id, role) DO NOTHING;

  RAISE NOTICE '✅ Admin criado: %', v_email;
END $$;
