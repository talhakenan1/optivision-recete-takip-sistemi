-- Data Population Script for Enhanced Debt Management
-- This script populates existing data with the new schema enhancements

-- 1. Create initial status log entries for existing debts
-- This creates a baseline entry for all existing debts showing their current status
INSERT INTO public.debt_status_log (debt_id, old_status, new_status, changed_at, reason)
SELECT 
    id as debt_id,
    'pending' as old_status,  -- Assume all debts started as pending
    status as new_status,
    created_at as changed_at,
    'Initial status from migration' as reason
FROM public.debts
WHERE NOT EXISTS (
    SELECT 1 FROM public.debt_status_log 
    WHERE debt_status_log.debt_id = debts.id
);

-- 2. Update reminder_settings for users who don't have the new array format
-- Ensure all users have proper reminder_days_before values
UPDATE public.reminder_settings 
SET reminder_days_before = CASE 
    WHEN days_before_due IS NOT NULL THEN ARRAY[days_before_due]
    ELSE ARRAY[3]  -- Default to 3 days
END
WHERE reminder_days_before IS NULL OR array_length(reminder_days_before, 1) IS NULL;

-- 3. Create default reminder settings for users who don't have any
-- This ensures all users with debts have reminder settings
INSERT INTO public.reminder_settings (user_id, reminder_days_before)
SELECT DISTINCT user_id, ARRAY[3]
FROM public.debts
WHERE user_id NOT IN (
    SELECT user_id FROM public.reminder_settings
);

-- 4. Update telegram_users with better name extraction
-- Try to extract names from telegram_username using various patterns
UPDATE public.telegram_users 
SET 
    telegram_first_name = CASE 
        -- If username contains underscore, use first part
        WHEN telegram_username LIKE '%_%' THEN 
            split_part(telegram_username, '_', 1)
        -- If username contains space, use first part
        WHEN telegram_username LIKE '% %' THEN 
            split_part(telegram_username, ' ', 1)
        -- If username contains dot, use first part
        WHEN telegram_username LIKE '%.%' THEN 
            split_part(telegram_username, '.', 1)
        -- Otherwise use the whole username as first name
        ELSE telegram_username
    END,
    telegram_last_name = CASE 
        -- If username contains underscore, use second part
        WHEN telegram_username LIKE '%_%' AND array_length(string_to_array(telegram_username, '_'), 1) > 1 THEN 
            split_part(telegram_username, '_', 2)
        -- If username contains space, use everything after first space
        WHEN telegram_username LIKE '% %' THEN 
            substring(telegram_username from position(' ' in telegram_username) + 1)
        -- If username contains dot, use second part
        WHEN telegram_username LIKE '%.%' AND array_length(string_to_array(telegram_username, '.'), 1) > 1 THEN 
            split_part(telegram_username, '.', 2)
        -- Otherwise leave last name as NULL
        ELSE NULL
    END
WHERE (telegram_first_name IS NULL OR telegram_last_name IS NULL) 
    AND telegram_username IS NOT NULL 
    AND telegram_username != '';

-- 5. Clean up extracted names (remove numbers, special characters, capitalize)
UPDATE public.telegram_users 
SET 
    telegram_first_name = CASE 
        WHEN telegram_first_name IS NOT NULL THEN 
            initcap(regexp_replace(telegram_first_name, '[^a-zA-Z]', '', 'g'))
        ELSE telegram_first_name
    END,
    telegram_last_name = CASE 
        WHEN telegram_last_name IS NOT NULL THEN 
            initcap(regexp_replace(telegram_last_name, '[^a-zA-Z]', '', 'g'))
        ELSE telegram_last_name
    END
WHERE telegram_first_name IS NOT NULL OR telegram_last_name IS NOT NULL;

-- 6. Set empty strings to NULL for cleaner data
UPDATE public.telegram_users 
SET 
    telegram_first_name = NULLIF(trim(telegram_first_name), ''),
    telegram_last_name = NULLIF(trim(telegram_last_name), '')
WHERE telegram_first_name = '' OR telegram_last_name = '';

-- 7. Create summary view for data validation
CREATE OR REPLACE VIEW migration_summary AS
SELECT 
    'telegram_users' as table_name,
    COUNT(*) as total_records,
    COUNT(telegram_first_name) as records_with_first_name,
    COUNT(telegram_last_name) as records_with_last_name,
    COUNT(*) - COUNT(telegram_first_name) as missing_first_name
FROM public.telegram_users
UNION ALL
SELECT 
    'reminder_settings' as table_name,
    COUNT(*) as total_records,
    COUNT(reminder_days_before) as records_with_array,
    0 as records_with_last_name,
    COUNT(*) - COUNT(reminder_days_before) as missing_array
FROM public.reminder_settings
UNION ALL
SELECT 
    'debt_status_log' as table_name,
    COUNT(*) as total_records,
    COUNT(DISTINCT debt_id) as unique_debts_logged,
    0 as records_with_last_name,
    0 as missing_data
FROM public.debt_status_log;

-- 8. Display migration summary
SELECT * FROM migration_summary;

-- 9. Clean up the temporary view
DROP VIEW IF EXISTS migration_summary;