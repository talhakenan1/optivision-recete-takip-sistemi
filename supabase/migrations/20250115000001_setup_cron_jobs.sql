-- Enable pg_cron extension
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Create a function to call the send-reminders edge function
CREATE OR REPLACE FUNCTION trigger_reminder_function()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Call the edge function using pg_net
  PERFORM
    net.http_post(
      url := 'https://your-project-ref.supabase.co/functions/v1/send-reminders',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || current_setting('app.service_role_key')
      ),
      body := '{}'
    );
END;
$$;

-- Schedule the reminder function to run daily at 9:00 AM
-- Note: Replace 'your-database-name' with your actual database name
SELECT cron.schedule(
  'daily-debt-reminders',
  '0 9 * * *', -- Every day at 9:00 AM
  'SELECT trigger_reminder_function();'
);

-- Schedule a function to run every hour to check for overdue debts
CREATE OR REPLACE FUNCTION update_overdue_debts()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Update debts that are past due date and still pending
  UPDATE debts 
  SET status = 'overdue', updated_at = NOW()
  WHERE due_date < CURRENT_DATE 
    AND status = 'pending';
END;
$$;

-- Schedule the overdue check to run every hour
SELECT cron.schedule(
  'hourly-overdue-check',
  '0 * * * *', -- Every hour at minute 0
  'SELECT update_overdue_debts();'
);

-- Create a function to clean up old reminders (optional)
CREATE OR REPLACE FUNCTION cleanup_old_reminders()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Delete reminders older than 6 months
  DELETE FROM reminders 
  WHERE created_at < NOW() - INTERVAL '6 months';
END;
$$;

-- Schedule cleanup to run weekly on Sunday at 2:00 AM
SELECT cron.schedule(
  'weekly-reminder-cleanup',
  '0 2 * * 0', -- Every Sunday at 2:00 AM
  'SELECT cleanup_old_reminders();'
);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA cron TO postgres;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA cron TO postgres;

-- View scheduled jobs (for reference)
-- SELECT * FROM cron.job;

-- To unschedule a job (for reference):
-- SELECT cron.unschedule('daily-debt-reminders');
-- SELECT cron.unschedule('hourly-overdue-check');
-- SELECT cron.unschedule('weekly-reminder-cleanup');