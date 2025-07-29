-- Validation Script for Enhanced Debt Management Schema
-- This script validates that the migration was successful and all components are working

-- 1. Validate table structure changes
DO $
DECLARE
    missing_columns text[] := ARRAY[]::text[];
    missing_tables text[] := ARRAY[]::text[];
    missing_indexes text[] := ARRAY[]::text[];
BEGIN
    -- Check if telegram_users has new columns
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'telegram_users' 
        AND column_name = 'telegram_first_name'
    ) THEN
        missing_columns := array_append(missing_columns, 'telegram_users.telegram_first_name');
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'telegram_users' 
        AND column_name = 'telegram_last_name'
    ) THEN
        missing_columns := array_append(missing_columns, 'telegram_users.telegram_last_name');
    END IF;
    
    -- Check if reminder_settings has new column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'reminder_settings' 
        AND column_name = 'reminder_days_before'
    ) THEN
        missing_columns := array_append(missing_columns, 'reminder_settings.reminder_days_before');
    END IF;
    
    -- Check if debt_status_log table exists
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'debt_status_log'
    ) THEN
        missing_tables := array_append(missing_tables, 'debt_status_log');
    END IF;
    
    -- Check for key indexes
    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes 
        WHERE indexname = 'idx_debts_status_due_date'
    ) THEN
        missing_indexes := array_append(missing_indexes, 'idx_debts_status_due_date');
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes 
        WHERE indexname = 'idx_debt_status_log_debt_id'
    ) THEN
        missing_indexes := array_append(missing_indexes, 'idx_debt_status_log_debt_id');
    END IF;
    
    -- Report results
    IF array_length(missing_columns, 1) > 0 THEN
        RAISE WARNING 'Missing columns: %', array_to_string(missing_columns, ', ');
    END IF;
    
    IF array_length(missing_tables, 1) > 0 THEN
        RAISE WARNING 'Missing tables: %', array_to_string(missing_tables, ', ');
    END IF;
    
    IF array_length(missing_indexes, 1) > 0 THEN
        RAISE WARNING 'Missing indexes: %', array_to_string(missing_indexes, ', ');
    END IF;
    
    IF array_length(missing_columns, 1) = 0 AND 
       array_length(missing_tables, 1) = 0 AND 
       array_length(missing_indexes, 1) = 0 THEN
        RAISE NOTICE 'All schema changes applied successfully!';
    END IF;
END;
$;

-- 2. Validate functions exist and are callable
DO $
BEGIN
    -- Test get_debt_statistics function
    IF EXISTS (
        SELECT 1 FROM pg_proc 
        WHERE proname = 'get_debt_statistics'
    ) THEN
        RAISE NOTICE 'Function get_debt_statistics exists';
    ELSE
        RAISE WARNING 'Function get_debt_statistics is missing';
    END IF;
    
    -- Test update_overdue_debts_batch function
    IF EXISTS (
        SELECT 1 FROM pg_proc 
        WHERE proname = 'update_overdue_debts_batch'
    ) THEN
        RAISE NOTICE 'Function update_overdue_debts_batch exists';
    ELSE
        RAISE WARNING 'Function update_overdue_debts_batch is missing';
    END IF;
    
    -- Test log_debt_status_change function
    IF EXISTS (
        SELECT 1 FROM pg_proc 
        WHERE proname = 'log_debt_status_change'
    ) THEN
        RAISE NOTICE 'Function log_debt_status_change exists';
    ELSE
        RAISE WARNING 'Function log_debt_status_change is missing';
    END IF;
END;
$;

-- 3. Validate triggers exist
DO $
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_trigger 
        WHERE tgname = 'trigger_log_debt_status_change'
    ) THEN
        RAISE NOTICE 'Trigger trigger_log_debt_status_change exists';
    ELSE
        RAISE WARNING 'Trigger trigger_log_debt_status_change is missing';
    END IF;
END;
$;

-- 4. Validate RLS policies exist
DO $
DECLARE
    policy_count integer;
BEGIN
    SELECT COUNT(*) INTO policy_count
    FROM pg_policies 
    WHERE tablename = 'debt_status_log';
    
    IF policy_count >= 2 THEN
        RAISE NOTICE 'RLS policies for debt_status_log exist (% policies)', policy_count;
    ELSE
        RAISE WARNING 'Missing RLS policies for debt_status_log (found % policies)', policy_count;
    END IF;
END;
$;

-- 5. Data validation queries
SELECT 
    'Data Validation Results' as section,
    '' as details
UNION ALL
SELECT 
    'telegram_users with names',
    COUNT(*)::text || ' records have first_name, ' || 
    COUNT(telegram_last_name)::text || ' have last_name'
FROM public.telegram_users
WHERE telegram_first_name IS NOT NULL
UNION ALL
SELECT 
    'reminder_settings with arrays',
    COUNT(*)::text || ' records have reminder_days_before array'
FROM public.reminder_settings
WHERE reminder_days_before IS NOT NULL
UNION ALL
SELECT 
    'debt_status_log entries',
    COUNT(*)::text || ' status change entries for ' || 
    COUNT(DISTINCT debt_id)::text || ' unique debts'
FROM public.debt_status_log
UNION ALL
SELECT 
    'Index count',
    COUNT(*)::text || ' indexes created for debt management'
FROM pg_indexes 
WHERE indexname LIKE 'idx_debts_%' 
   OR indexname LIKE 'idx_debt_status_log_%'
   OR indexname LIKE 'idx_telegram_users_%'
   OR indexname LIKE 'idx_reminders_%';

-- 6. Test the new functions with sample data (if any exists)
DO $
DECLARE
    sample_user_id uuid;
    stats_result record;
BEGIN
    -- Get a sample user ID
    SELECT user_id INTO sample_user_id 
    FROM public.debts 
    LIMIT 1;
    
    IF sample_user_id IS NOT NULL THEN
        -- Test the statistics function
        SELECT * INTO stats_result
        FROM get_debt_statistics(sample_user_id);
        
        RAISE NOTICE 'Statistics function test: % total debts, % total amount', 
            stats_result.total_debts, stats_result.total_amount;
    ELSE
        RAISE NOTICE 'No debt data available for function testing';
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE WARNING 'Error testing functions: %', SQLERRM;
END;
$;

-- 7. Performance validation - check if indexes are being used
EXPLAIN (ANALYZE false, BUFFERS false) 
SELECT * FROM public.debts 
WHERE status = 'pending' AND due_date < CURRENT_DATE;

-- 8. Final validation summary
SELECT 
    'Migration Validation Complete' as status,
    'Check the output above for any warnings or errors' as note;