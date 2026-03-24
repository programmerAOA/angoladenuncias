-- ################################################################################
-- REMOVE UNUSED TABLES & AUTH TRIGGER
-- Run this in Supabase SQL Editor to delete `profiles` and `user_roles`
-- and remove the trigger that is causing the login error
-- ################################################################################

-- 1. Remove the trigger that crashes the login when it tries to insert into these tables
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- 2. Drop any foreign keys from other tables that might still point to profiles or user_roles
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'kyc_submissions') THEN
    ALTER TABLE public.kyc_submissions DROP CONSTRAINT IF EXISTS kyc_submissions_user_id_fkey;
  END IF;
END $$;

-- 3. Drop the unused tables and their policies
DROP TABLE IF EXISTS public.user_roles CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- 4. Re-create the admin user if needed, or simply let the frontend handle the metadata
-- For the existing bytekwanza@gmail.com user, ensure the raw_user_meta_data is correct
UPDATE auth.users 
SET raw_user_meta_data = '{"full_name": "Admin", "role": "admin"}'::jsonb
WHERE email = 'bytekwanza@gmail.com';
