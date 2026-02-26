-- ============================================
-- FIX: Enable Team Deletion
-- ============================================
-- This script fixes the issue where teams cannot be deleted from the database.
-- The problem is RLS (Row Level Security) policies blocking the deletion.

-- Step 1: Disable RLS on teams table
ALTER TABLE public.teams DISABLE ROW LEVEL SECURITY;

-- Step 2: Grant delete permissions for all roles
GRANT SELECT, INSERT, UPDATE, DELETE ON public.teams TO anon, authenticated, postgres;

-- Step 3: Verify RLS is disabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'teams';

-- Expected result: teams | f  (false means RLS is disabled)
