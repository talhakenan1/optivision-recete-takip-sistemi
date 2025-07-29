-- Test Script for Enhanced Debt Management Schema Migration
-- This script can be run to test the migration in a safe way

-- Create a test transaction that will be rolled back
BEGIN;

-- 1. Test that all required tables exist
DO $
DECLARE
    table_exists boolean;
BEGIN
    -- Test debt_status_log table exists
    SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'debt_status_log'
    ) INTO table_exists;
    
    IF NOT table_exists THEN
        RAISE EXCEPTION 'debt_status_log table does not exist';
    END IF;
    
    RAISE NOTICE 'debt_status_log table exists ✓';
END;
$;

-- 2. Test that all required columns exist
DO $
DECLARE
    column_exists boolean;
BEGIN
    -- Test telegram_first_name column
    SELECT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'telegram_users' 
        AND column_name = 'telegram_first_name'
    ) INTO column_exists;
    
    IF NOT column_exists THEN
        RAISE EXCEPTION 'telegram_users.telegram_first_name column does not exist';
    END IF;
    
    RAISE NOTICE 'telegram_users.telegram_first_name column exists ✓';
    
    -- Test telegram_last_name column
    SELECT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'telegram_users' 
        AND column_name = 'telegram_last_name'
    ) INTO column_exists;
    
    IF NOT column_exists THEN
        RAISE EXCEPTION 'telegram_users.telegram_last_name column does not exist';
    END IF;
    
    RAISE NOTICE 'telegram_users.telegram_last_name column exists ✓';
    
    -- Test reminder_days_before column
    SELECT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'reminder_settings' 
        AND column_name = 'reminder_days_before'
    ) INTO column_exists;
    
    IF NOT column_exists THEN
        RAISE EXCEPTION 'reminder_settings.reminder_days_before column does not exist';
    END IF;
    
    RAISE NOTICE 'reminder_settings.reminder_days_before column exists ✓';
END;
$;

-- 3. Test that all required functions exist
DO $
DECLARE
    function_exists boolean;
BEGIN
    -- Test get_debt_statistics function
    SELECT EXISTS (
        SELECT FROM pg_proc 
        WHERE proname = 'get_debt_statistics'
    ) INTO function_exists;
    
    IF NOT function_exists THEN
        RAISE EXCEPTION 'get_debt_statistics function does not exist';
    END IF;
    
    RAISE NOTICE 'get_debt_statistics function exists ✓';
    
    -- Test update_overdue_debts_batch function
    SELECT EXISTS (
        SELECT FROM pg_proc 
        WHERE proname = 'update_overdue_debts_batch'
    ) INTO function_exists;
    
    IF NOT function_exists THEN
        RAISE EXCEPTION 'update_overdue_debts_batch function does not exist';
    END IF;
    
    RAISE NOTICE 'update_overdue_debts_batch function exists ✓';
    
    -- Test log_debt_status_change function
    SELECT EXISTS (
        SELECT FROM pg_proc 
        WHERE proname = 'log_debt_status_change'
    ) INTO function_exists;
    
    IF NOT function_exists THEN
        RAISE EXCEPTION 'log_debt_status_change function does not exist';
    END IF;
    
    RAISE NOTICE 'log_debt_status_change function exists ✓';
END;
$;

-- 4. Test that required indexes exist
DO $
DECLARE
    index_exists boolean;
BEGIN
    -- Test key indexes
    SELECT EXISTS (
        SELECT FROM pg_indexes 
        WHERE indexname = 'idx_debts_status_due_date'
    ) INTO index_exists;
    
    IF NOT index_exists THEN
        RAISE EXCEPTION 'idx_debts_status_due_date index does not exist';
    END IF;
    
    RAISE NOTICE 'idx_debts_status_due_date index exists ✓';
    
    SELECT EXISTS (
        SELECT FROM pg_indexes 
        WHERE indexname = 'idx_debt_status_log_debt_id'
    ) INTO index_exists;
    
    IF NOT index_exists THEN
        RAISE EXCEPTION 'idx_debt_status_log_debt_id index does not exist';
    END IF;
    
    RAISE NOTICE 'idx_debt_status_log_debt_id index exists ✓';
END;
$;

-- 5. Test that triggers exist
DO $
DECLARE
    trigger_exists boolean;
BEGIN
    SELECT EXISTS (
        SELECT FROM pg_trigger 
        WHERE tgname = 'trigger_log_debt_status_change'
    ) INTO trigger_exists;
    
    IF NOT trigger_exists THEN
        RAISE EXCEPTION 'trigger_log_debt_status_change trigger does not exist';
    END IF;
    
    RAISE NOTICE 'trigger_log_debt_status_change trigger exists ✓';
END;
$;

-- 6. Test RLS policies exist
DO $
DECLARE
    policy_count integer;
BEGIN
    SELECT COUNT(*) INTO policy_count
    FROM pg_policies 
    WHERE tablename = 'debt_status_log';
    
    IF policy_count < 2 THEN
        RAISE EXCEPTION 'debt_status_log table does not have sufficient RLS policies (found %)', policy_count;
    END IF;
    
    RAISE NOTICE 'debt_status_log RLS policies exist (% policies) ✓', policy_count;
END;
$;

-- 7. Test data integrity
DO $
DECLARE
    test_user_id uuid := gen_random_uuid();
    test_customer_id uuid := gen_random_uuid();
    test_debt_id uuid;
    status_log_count integer;
BEGIN
    -- Create test data (will be rolled back)
    INSERT INTO auth.users (id, email) VALUES (test_user_id, 'test@example.com');
    
    INSERT INTO public.customers (id, user_id, name, email) 
    VALUES (test_customer_id, test_user_id, 'Test Customer', 'customer@example.com');
    
    INSERT INTO public.debts (id, customer_id, user_id, amount, due_date, status)
    VALUES (gen_random_uuid(), test_customer_id, test_user_id, 100.00, CURRENT_DATE + INTERVAL '7 days', 'pending')
    RETURNING id INTO test_debt_id;
    
    -- Test that status change trigger works
    UPDATE public.debts SET status = 'paid' WHERE id = test_debt_id;
    
    -- Check that status log was created
    SELECT COUNT(*) INTO status_log_count
    FROM public.debt_status_log
    WHERE debt_id = test_debt_id;
    
    IF status_log_count = 0 THEN
        RAISE EXCEPTION 'Status change trigger did not create log entry';
    END IF;
    
    RAISE NOTICE 'Status change logging works ✓ (% entries)', status_log_count;
    
    -- Test statistics function
    PERFORM get_debt_statistics(test_user_id);
    RAISE NOTICE 'get_debt_statistics function works ✓';
    
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Data integrity test failed: %', SQLERRM;
END;
$;

-- 8. Test array functionality for reminder_days_before
DO $
DECLARE
    test_user_id uuid := gen_random_uuid();
    reminder_array integer[];
BEGIN
    -- Create test user
    INSERT INTO auth.users (id, email) VALUES (test_user_id, 'test2@example.com');
    
    -- Test array insertion
    INSERT INTO public.reminder_settings (user_id, reminder_days_before)
    VALUES (test_user_id, ARRAY[7, 3, 1]);
    
    -- Test array retrieval
    SELECT reminder_days_before INTO reminder_array
    FROM public.reminder_settings
    WHERE user_id = test_user_id;
    
    IF array_length(reminder_array, 1) != 3 THEN
        RAISE EXCEPTION 'reminder_days_before array not working correctly';
    END IF;
    
    RAISE NOTICE 'reminder_days_before array functionality works ✓';
    
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Array functionality test failed: %', SQLERRM;
END;
$;

-- 9. Performance test - check that indexes are being used
EXPLAIN (ANALYZE false, BUFFERS false, COSTS false) 
SELECT d.*, c.name as customer_name
FROM public.debts d
JOIN public.customers c ON d.customer_id = c.id
WHERE d.status = 'pending' 
  AND d.due_date < CURRENT_DATE
  AND d.user_id = gen_random_uuid();

RAISE NOTICE 'Performance test completed - check EXPLAIN output above ✓';

-- 10. Final success message
RAISE NOTICE '🎉 All migration tests passed successfully!';

-- Rollback the test transaction
ROLLBACK;