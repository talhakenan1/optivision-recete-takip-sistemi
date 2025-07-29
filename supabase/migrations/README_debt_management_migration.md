# Debt Management Schema Enhancement Migration

This directory contains migration files for enhancing the debt management system with improved database schema, better indexing, and additional functionality.

## Migration Files

### 1. `20250127000000_enhance_debt_management_schema.sql`
**Main migration file** that implements all the schema enhancements:

- **telegram_users table enhancements:**
  - Adds `telegram_first_name` and `telegram_last_name` columns
  - Creates indexes for better filtering performance

- **reminder_settings table enhancements:**
  - Adds `reminder_days_before` array column to support multiple reminder days
  - Migrates existing `days_before_due` values to the new array format

- **New debt_status_log table:**
  - Tracks all status changes for debts with timestamps and reasons
  - Includes RLS policies for security
  - Automatic trigger to log status changes

- **Performance improvements:**
  - Multiple indexes for filtering operations
  - Composite indexes for complex queries
  - Optimized indexes for common query patterns

- **New functions:**
  - `get_debt_statistics()` - Returns filtered debt statistics
  - `update_overdue_debts_batch()` - Batch updates overdue debts
  - `log_debt_status_change()` - Trigger function for status logging

### 2. `20250127000001_rollback_debt_management_enhancements.sql`
**Rollback migration** that can be used to revert all changes if needed:
- Removes all new tables, columns, indexes, and functions
- **WARNING:** This will delete data stored in new columns and tables

### 3. `20250127000002_populate_existing_data.sql`
**Data population script** that migrates existing data to the new schema:
- Creates initial status log entries for existing debts
- Populates telegram user names from existing usernames
- Ensures all users have proper reminder settings
- Includes data cleaning and validation

### 4. `20250127000003_validate_migration.sql`
**Validation script** that verifies the migration was successful:
- Checks for missing tables, columns, and indexes
- Validates functions and triggers exist
- Tests RLS policies
- Provides data validation summary
- Tests new functions with sample data

## Running the Migration

### Option 1: Automatic Migration (Recommended)
If you're using Supabase CLI with automatic migrations:

```bash
# Navigate to the project directory
cd aurora-admin-panel-react

# Run the migration
supabase db push
```

### Option 2: Manual Migration
If you need to run migrations manually:

```bash
# Apply the main migration
supabase db reset --linked

# Or apply specific migration files
psql -h your-db-host -U postgres -d your-database -f supabase/migrations/20250127000000_enhance_debt_management_schema.sql
```

### Option 3: Step-by-Step Migration
For production environments, run migrations in order:

1. **Main schema changes:**
   ```sql
   \i 20250127000000_enhance_debt_management_schema.sql
   ```

2. **Populate existing data:**
   ```sql
   \i 20250127000002_populate_existing_data.sql
   ```

3. **Validate migration:**
   ```sql
   \i 20250127000003_validate_migration.sql
   ```

## Post-Migration Verification

After running the migration, verify the following:

1. **Check for warnings or errors** in the migration output
2. **Run the validation script** to ensure all components are working
3. **Test the application** to ensure existing functionality still works
4. **Verify new features** are available in the UI

## Rollback Procedure

If you need to rollback the migration:

```sql
\i 20250127000001_rollback_debt_management_enhancements.sql
```

**⚠️ WARNING:** Rollback will permanently delete:
- All debt status change history
- Telegram user first/last names
- Array-based reminder settings
- All new indexes and functions

## Schema Changes Summary

### New Tables
- `debt_status_log` - Tracks all debt status changes

### Modified Tables
- `telegram_users` - Added first_name and last_name columns
- `reminder_settings` - Added reminder_days_before array column

### New Indexes
- Multiple performance indexes for filtering and searching
- Composite indexes for complex queries

### New Functions
- `get_debt_statistics()` - Filtered debt statistics
- `update_overdue_debts_batch()` - Batch overdue updates
- `log_debt_status_change()` - Status change logging

### New Triggers
- `trigger_log_debt_status_change` - Automatic status logging

## Requirements Addressed

This migration addresses the following requirements from the specification:

- **Requirement 1.1:** Complete telegram_users schema with first_name and last_name
- **Requirement 1.2:** Support for reminder_days_before as array of integers
- **Requirement 1.3:** Preserve and migrate existing data properly

## Performance Impact

The migration includes several performance optimizations:
- **Indexes** for common query patterns
- **Composite indexes** for complex filtering
- **Optimized functions** for statistics and batch operations

Expected performance improvements:
- Faster debt filtering by status, customer, and date
- Improved telegram user searches
- Efficient status change tracking
- Better query performance for large datasets

## Troubleshooting

### Common Issues

1. **Migration fails with permission errors:**
   - Ensure you're running as a superuser or have necessary permissions
   - Check that RLS policies allow the operations

2. **Data migration doesn't populate names correctly:**
   - Check that telegram_username contains extractable name data
   - Run the populate script separately if needed

3. **Functions not accessible:**
   - Verify function permissions are granted correctly
   - Check that functions are created in the public schema

### Getting Help

If you encounter issues:
1. Check the validation script output for specific errors
2. Review the migration logs for detailed error messages
3. Ensure all prerequisites are met (extensions, permissions)
4. Consider running migrations step-by-step for better error isolation

## Maintenance

### Regular Tasks
- Monitor debt_status_log table size and archive old entries if needed
- Review index usage and optimize as data grows
- Update statistics functions if new filtering requirements emerge

### Monitoring
- Watch for slow queries that might benefit from additional indexes
- Monitor the automatic status change trigger performance
- Track the effectiveness of the new reminder array system