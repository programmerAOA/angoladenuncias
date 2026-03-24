-- ################################################################################
-- DIAGNOSE & FIX LOGIN - Check and repair auth.identities
-- ################################################################################

-- 1. Check current state
SELECT 
  u.id, u.email, u.email_confirmed_at, u.created_at,
  i.provider_id, i.provider, i.id as identity_id
FROM auth.users u
LEFT JOIN auth.identities i ON i.user_id = u.id;

-- 2. If identity is missing or broken, re-create it
-- Replace the SELECT above with this block if needed:
/*
DO $$
DECLARE
  v_user_id UUID;
  v_email TEXT := 'bytekwanza@gmail.com';
BEGIN
  SELECT id INTO v_user_id FROM auth.users WHERE email = v_email;

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'User not found: %', v_email;
  END IF;

  -- Remove any broken identity
  DELETE FROM auth.identities WHERE user_id = v_user_id;

  -- Re-insert identity with correct structure
  INSERT INTO auth.identities (
    user_id,
    provider_id,
    identity_data,
    provider,
    last_sign_in_at, created_at, updated_at
  ) VALUES (
    v_user_id,
    v_email,
    jsonb_build_object(
      'sub',            v_user_id::text,
      'email',          v_email,
      'email_verified', true,
      'provider',       'email'
    ),
    'email',
    NOW(), NOW(), NOW()
  );

  -- Ensure email is confirmed
  UPDATE auth.users
  SET email_confirmed_at = NOW(), updated_at = NOW()
  WHERE id = v_user_id;

  RAISE NOTICE 'Identity fixed for: %', v_email;
END $$;
*/
