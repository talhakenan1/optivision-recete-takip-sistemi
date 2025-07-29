-- Rollback script for Enhanced Debt Management Schema Updates
-- This migration can be used to rollback the changes made in 20250127000000_enhance_debt_management_schema.sql

-- WARNING: This will remove data and functionality. Use with caution.

-- 1. Drop the trigger and function for debt status logging
DROP TRIGGER IF EXISTS trigger_log_debt_status_change ON public.debts;
DROP FUNCTION IF EXISTS log_debt_status_change();

-- 2. Drop the debt_status_log table (this will remove all status change history)
DROP TABLE IF EXISTS public.debt_status_log;

-- 3. Drop the new functions
DROP FUNCTION IF EXISTS get_debt_statistics(uuid, text[], uuid, date, date);
DROP FUNCTION IF EXISTS update_overdue_debts_batch();

-- 4. Drop the new indexes
DROP INDEX IF EXISTS idx_debts_status_due_date;
DROP INDEX IF EXISTS idx_debts_user_status;
DROP INDEX IF EXISTS idx_debts_customer_status;
DROP INDEX IF EXISTS idx_debts_amount;
DROP INDEX IF EXISTS idx_debts_created_at;
DROP INDEX IF EXISTS idx_telegram_users_active;
DROP INDEX IF EXISTS idx_telegram_users_names;
DROP INDEX IF EXISTS idx_debt_status_log_debt_id;
DROP INDEX IF EXISTS idx_debt_status_log_changed_at;
DROP INDEX IF EXISTS idx_debt_status_log_new_status;
DROP INDEX IF EXISTS idx_reminders_type_status;
DROP INDEX IF EXISTS idx_reminders_sent_at;
DROP INDEX IF EXISTS idx_debts_composite_filter;
DROP INDEX IF EXISTS idx_debts_amount_range;

-- 5. Remove the new columns from telegram_users table
-- WARNING: This will remove any data stored in these columns
ALTER TABLE public.telegram_users 
DROP COLUMN IF EXISTS telegram_first_name,
DROP COLUMN IF EXISTS telegram_last_name;

-- 6. Remove the reminder_days_before column from reminder_settings
-- WARNING: This will remove the array-based reminder configuration
ALTER TABLE public.reminder_settings 
DROP COLUMN IF EXISTS reminder_days_before;

-- Note: The original days_before_due column should still exist and contain the original values
-- If you need to restore the original functionality, you may need to update the application code
-- to use days_before_due instead of reminder_days_before

-- 7. Remove comments
COMMENT ON TABLE public.debt_status_log IS NULL;
COMMENT ON COLUMN public.telegram_users.telegram_first_name IS NULL;
COMMENT ON COLUMN public.telegram_users.telegram_last_name IS NULL;
COMMENT ON COLUMN public.reminder_settings.reminder_days_before IS NULL;