-- Enhanced Debt Management Schema Updates
-- This migration adds missing fields and tables for improved debt management functionality

-- 1. Add missing fields to telegram_users table
ALTER TABLE public.telegram_users 
ADD COLUMN IF NOT EXISTS telegram_first_name text,
ADD COLUMN IF NOT EXISTS telegram_last_name text;

-- 2. Update reminder_settings table to support array of reminder days
-- First, add the new column
ALTER TABLE public.reminder_settings 
ADD COLUMN IF NOT EXISTS reminder_days_before integer[] DEFAULT ARRAY[3];

-- Migrate existing days_before_due values to the new array format
UPDATE public.reminder_settings 
SET reminder_days_before = ARRAY[days_before_due]
WHERE reminder_days_before IS NULL AND days_before_due IS NOT NULL;

-- Set default for records that don't have days_before_due
UPDATE public.reminder_settings 
SET reminder_days_before = ARRAY[3]
WHERE reminder_days_before IS NULL;

-- Make the new column NOT NULL now that all records have values
ALTER TABLE public.reminder_settings 
ALTER COLUMN reminder_days_before SET NOT NULL;

-- 3. Create debt_status_log table for tracking status changes
CREATE TABLE IF NOT EXISTS public.debt_status_log (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  debt_id uuid NOT NULL REFERENCES public.debts(id) ON DELETE CASCADE,
  old_status text NOT NULL,
  new_status text NOT NULL,
  changed_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  changed_by uuid REFERENCES auth.users(id),
  reason text,
  CONSTRAINT valid_status_values CHECK (
    old_status IN ('pending', 'paid', 'overdue', 'cancelled') AND
    new_status IN ('pending', 'paid', 'overdue', 'cancelled')
  )
);

-- Enable RLS on debt_status_log table
ALTER TABLE public.debt_status_log ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for debt_status_log table
CREATE POLICY "Users can view status logs for their own debts" 
  ON public.debt_status_log 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.debts 
      WHERE debts.id = debt_status_log.debt_id 
      AND debts.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert status logs for their own debts" 
  ON public.debt_status_log 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.debts 
      WHERE debts.id = debt_status_log.debt_id 
      AND debts.user_id = auth.uid()
    )
  );

-- 4. Create indexes for improved query performance on filtering operations

-- Indexes for debts table filtering
CREATE INDEX IF NOT EXISTS idx_debts_status_due_date ON public.debts(status, due_date);
CREATE INDEX IF NOT EXISTS idx_debts_user_status ON public.debts(user_id, status);
CREATE INDEX IF NOT EXISTS idx_debts_customer_status ON public.debts(customer_id, status);
CREATE INDEX IF NOT EXISTS idx_debts_amount ON public.debts(amount);
CREATE INDEX IF NOT EXISTS idx_debts_created_at ON public.debts(created_at);

-- Indexes for telegram_users table filtering
CREATE INDEX IF NOT EXISTS idx_telegram_users_active ON public.telegram_users(user_id, is_active);
CREATE INDEX IF NOT EXISTS idx_telegram_users_names ON public.telegram_users(telegram_first_name, telegram_last_name);

-- Indexes for debt_status_log table
CREATE INDEX IF NOT EXISTS idx_debt_status_log_debt_id ON public.debt_status_log(debt_id);
CREATE INDEX IF NOT EXISTS idx_debt_status_log_changed_at ON public.debt_status_log(changed_at);
CREATE INDEX IF NOT EXISTS idx_debt_status_log_new_status ON public.debt_status_log(new_status);

-- Indexes for reminders table filtering
CREATE INDEX IF NOT EXISTS idx_reminders_type_status ON public.reminders(reminder_type, status);
CREATE INDEX IF NOT EXISTS idx_reminders_sent_at ON public.reminders(sent_at);

-- 5. Create function to automatically log debt status changes
CREATE OR REPLACE FUNCTION log_debt_status_change()
RETURNS TRIGGER AS $
BEGIN
    -- Only log if status actually changed
    IF OLD.status IS DISTINCT FROM NEW.status THEN
        INSERT INTO public.debt_status_log (
            debt_id,
            old_status,
            new_status,
            changed_by,
            reason
        ) VALUES (
            NEW.id,
            OLD.status,
            NEW.status,
            auth.uid(),
            CASE 
                WHEN NEW.status = 'overdue' AND OLD.status = 'pending' THEN 'Automatic overdue update'
                ELSE 'Manual status update'
            END
        );
    END IF;
    RETURN NEW;
END;
$ language 'plpgsql' SECURITY DEFINER;

-- Create trigger to automatically log debt status changes
DROP TRIGGER IF EXISTS trigger_log_debt_status_change ON public.debts;
CREATE TRIGGER trigger_log_debt_status_change
    AFTER UPDATE ON public.debts
    FOR EACH ROW
    EXECUTE FUNCTION log_debt_status_change();

-- 6. Data migration: Populate telegram_first_name and telegram_last_name from existing data
-- This attempts to extract names from telegram_username if it contains full names
UPDATE public.telegram_users 
SET 
    telegram_first_name = CASE 
        WHEN telegram_username IS NOT NULL AND position(' ' in telegram_username) > 0 
        THEN split_part(telegram_username, ' ', 1)
        ELSE telegram_username
    END,
    telegram_last_name = CASE 
        WHEN telegram_username IS NOT NULL AND position(' ' in telegram_username) > 0 
        THEN substring(telegram_username from position(' ' in telegram_username) + 1)
        ELSE NULL
    END
WHERE telegram_first_name IS NULL AND telegram_username IS NOT NULL;

-- 7. Create function to get debt statistics with filtering support
CREATE OR REPLACE FUNCTION get_debt_statistics(
    p_user_id uuid,
    p_status_filter text[] DEFAULT NULL,
    p_customer_id_filter uuid DEFAULT NULL,
    p_date_from date DEFAULT NULL,
    p_date_to date DEFAULT NULL
)
RETURNS TABLE (
    total_debts bigint,
    total_amount numeric,
    pending_count bigint,
    pending_amount numeric,
    overdue_count bigint,
    overdue_amount numeric,
    paid_count bigint,
    paid_amount numeric
) AS $
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*) as total_debts,
        COALESCE(SUM(amount), 0) as total_amount,
        COUNT(*) FILTER (WHERE status = 'pending') as pending_count,
        COALESCE(SUM(amount) FILTER (WHERE status = 'pending'), 0) as pending_amount,
        COUNT(*) FILTER (WHERE status = 'overdue') as overdue_count,
        COALESCE(SUM(amount) FILTER (WHERE status = 'overdue'), 0) as overdue_amount,
        COUNT(*) FILTER (WHERE status = 'paid') as paid_count,
        COALESCE(SUM(amount) FILTER (WHERE status = 'paid'), 0) as paid_amount
    FROM public.debts
    WHERE user_id = p_user_id
        AND (p_status_filter IS NULL OR status = ANY(p_status_filter))
        AND (p_customer_id_filter IS NULL OR customer_id = p_customer_id_filter)
        AND (p_date_from IS NULL OR due_date >= p_date_from)
        AND (p_date_to IS NULL OR due_date <= p_date_to);
END;
$ language 'plpgsql' SECURITY DEFINER;

-- 8. Create function to batch update overdue debts (improved version)
CREATE OR REPLACE FUNCTION update_overdue_debts_batch()
RETURNS TABLE (
    updated_count integer,
    debt_ids uuid[]
) AS $
DECLARE
    updated_debt_ids uuid[];
    update_count integer;
BEGIN
    -- Update debts that are past due date and still pending
    WITH updated_debts AS (
        UPDATE public.debts 
        SET status = 'overdue', updated_at = timezone('utc'::text, now())
        WHERE due_date < CURRENT_DATE 
            AND status = 'pending'
        RETURNING id
    )
    SELECT array_agg(id), count(*)
    INTO updated_debt_ids, update_count
    FROM updated_debts;
    
    -- Return results
    RETURN QUERY SELECT update_count, updated_debt_ids;
END;
$ language 'plpgsql' SECURITY DEFINER;

-- 9. Grant necessary permissions for the new functions
GRANT EXECUTE ON FUNCTION get_debt_statistics(uuid, text[], uuid, date, date) TO authenticated;
GRANT EXECUTE ON FUNCTION update_overdue_debts_batch() TO service_role;

-- 10. Create composite indexes for complex queries
CREATE INDEX IF NOT EXISTS idx_debts_composite_filter ON public.debts(user_id, status, due_date, customer_id);
CREATE INDEX IF NOT EXISTS idx_debts_amount_range ON public.debts(user_id, amount) WHERE status IN ('pending', 'overdue');

-- 11. Add comments for documentation
COMMENT ON TABLE public.debt_status_log IS 'Tracks all status changes for debts with timestamp and reason';
COMMENT ON COLUMN public.telegram_users.telegram_first_name IS 'First name from Telegram user profile';
COMMENT ON COLUMN public.telegram_users.telegram_last_name IS 'Last name from Telegram user profile';
COMMENT ON COLUMN public.reminder_settings.reminder_days_before IS 'Array of days before due date to send reminders (e.g., [7, 3, 1])';
COMMENT ON FUNCTION get_debt_statistics IS 'Returns debt statistics with optional filtering by status, customer, and date range';
COMMENT ON FUNCTION update_overdue_debts_batch IS 'Batch updates overdue debts and returns count and IDs of updated records';