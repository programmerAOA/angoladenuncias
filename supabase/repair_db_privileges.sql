-- ################################################################################
-- REPAIR AUTHENTICATOR & POSTGRES PRIVILEGES
-- Run this in the Supabase SQL Editor.
-- This script fixes any permissions that the microcredit app might have revoked,
-- which causes GoTrue to fail with "Database error querying schema" before logging.
-- ################################################################################

-- 1. Reset search paths for critical auth roles
ALTER ROLE authenticator SET search_path = public, auth, extensions;
ALTER ROLE authenticated SET search_path = public, auth, extensions;
ALTER ROLE anon SET search_path = public, auth, extensions;

-- 2. Grant usage on schemas explicitly
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT USAGE ON SCHEMA auth TO postgres, anon, authenticated, service_role;

-- 3. Fix permissions on auth.users for Supabase internal roles
GRANT ALL PRIVILEGES ON TABLE auth.users TO postgres;
GRANT ALL PRIVILEGES ON TABLE auth.users TO service_role;
GRANT ALL PRIVILEGES ON TABLE auth.users TO dashboard_user;

-- 4. Check if there are any rogue triggers on ALL auth tables that might crash session creation
-- By dropping commonly named triggers from microcredit apps if they exist on sessions
DO $$ 
BEGIN
  -- We just drop them IF they exist, no harm if they don't.
  DROP TRIGGER IF EXISTS on_auth_session_created ON auth.sessions;
  DROP TRIGGER IF EXISTS on_auth_identity_created ON auth.identities;
EXCEPTION WHEN OTHERS THEN 
  -- Ignore errors if we don't have permission to drop these
END $$;
