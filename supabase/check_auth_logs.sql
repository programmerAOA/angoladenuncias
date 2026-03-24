-- ################################################################################
-- DIAGNOSE AUTH LOGS: Find the exact error causing "Database error querying schema"
-- Turn on the SQL Editor in Supabase Dashboard and run this query.
-- ################################################################################

SELECT
  created_at,
  payload->>'message' AS error_message,
  payload->>'error' AS error_code,
  payload
FROM
  auth.audit_log_entries
WHERE
  payload->>'error' IS NOT NULL
  OR payload->>'message' ILIKE '%error%'
ORDER BY
  created_at DESC
LIMIT 10;
