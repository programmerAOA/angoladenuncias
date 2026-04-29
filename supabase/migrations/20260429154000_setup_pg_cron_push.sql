-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS pg_net;
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule a one-minute interval webhook to trigger push notifications
SELECT cron.schedule(
  'trigger-push-notifications-every-minute',
  '* * * * *',
  $$
    select net.http_post(
      url:='https://qsjhkhiohpfslfkpjoeb.supabase.co/functions/v1/send-push-notifications',
      headers:=jsonb_build_object('Content-Type', 'application/json'),
      body:='{}'::jsonb
    )
  $$
);
