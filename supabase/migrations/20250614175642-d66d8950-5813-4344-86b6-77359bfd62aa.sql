
-- Remove dangerous RLS policies that allow any authenticated user to access all data
-- This fixes the critical security vulnerability where users could access each other's data

-- First, drop all overly permissive policies on customers table
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON public.customers;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.customers;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON public.customers;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON public.customers;

-- Drop all overly permissive policies on orders table  
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON public.orders;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.orders;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON public.orders;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON public.orders;

-- Drop all overly permissive policies on prescriptions table
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON public.prescriptions;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.prescriptions;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON public.prescriptions;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON public.prescriptions;

-- Drop existing user-specific policies first to recreate them consistently
DROP POLICY IF EXISTS "Users can view their own customers" ON public.customers;
DROP POLICY IF EXISTS "Users can insert their own customers" ON public.customers;
DROP POLICY IF EXISTS "Users can update their own customers" ON public.customers;
DROP POLICY IF EXISTS "Users can delete their own customers" ON public.customers;

DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can insert their own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can update their own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can delete their own orders" ON public.orders;

DROP POLICY IF EXISTS "Users can view their own prescriptions" ON public.prescriptions;
DROP POLICY IF EXISTS "Users can insert their own prescriptions" ON public.prescriptions;
DROP POLICY IF EXISTS "Users can update their own prescriptions" ON public.prescriptions;
DROP POLICY IF EXISTS "Users can delete their own prescriptions" ON public.prescriptions;

-- Now create secure, user-specific RLS policies

-- Customers table policies - users can only access their own customers
CREATE POLICY "Users can view their own customers" 
  ON public.customers 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own customers" 
  ON public.customers 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own customers" 
  ON public.customers 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own customers" 
  ON public.customers 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Orders table policies - users can only access their own orders
CREATE POLICY "Users can view their own orders" 
  ON public.orders 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own orders" 
  ON public.orders 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own orders" 
  ON public.orders 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own orders" 
  ON public.orders 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Prescriptions table policies - users can only access their own prescriptions
CREATE POLICY "Users can view their own prescriptions" 
  ON public.prescriptions 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own prescriptions" 
  ON public.prescriptions 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own prescriptions" 
  ON public.prescriptions 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own prescriptions" 
  ON public.prescriptions 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Make user_id columns NOT NULL to prevent security bypasses
ALTER TABLE public.customers ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE public.orders ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE public.prescriptions ALTER COLUMN user_id SET NOT NULL;
