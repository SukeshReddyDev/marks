-- ============================================
-- COMPLETE FIX: Enable Team Deletion
-- ============================================
-- This script completely disables RLS and fixes deletion permissions

-- Step 1: Drop ALL existing RLS policies on teams table
DROP POLICY IF EXISTS "enable_read" ON public.teams;
DROP POLICY IF EXISTS "enable_insert" ON public.teams;
DROP POLICY IF EXISTS "enable_update" ON public.teams;
DROP POLICY IF EXISTS "enable_delete" ON public.teams;
DROP POLICY IF EXISTS "Teams are viewable by everyone" ON public.teams;
DROP POLICY IF EXISTS "Teams are insertable by everyone" ON public.teams;
DROP POLICY IF EXISTS "Teams are updatable by everyone" ON public.teams;
DROP POLICY IF EXISTS "Teams are deletable by everyone" ON public.teams;

-- Step 2: Disable RLS on teams table
ALTER TABLE public.teams DISABLE ROW LEVEL SECURITY;

-- Step 3: Grant ALL permissions for all roles
GRANT ALL ON public.teams TO anon, authenticated, postgres;

-- Step 4: Do the same for team_members (foreign key table)
DROP POLICY IF EXISTS "enable_read" ON public.team_members;
DROP POLICY IF EXISTS "enable_insert" ON public.team_members;
DROP POLICY IF EXISTS "enable_update" ON public.team_members;
DROP POLICY IF EXISTS "enable_delete" ON public.team_members;

ALTER TABLE public.team_members DISABLE ROW LEVEL SECURITY;
GRANT ALL ON public.team_members TO anon, authenticated, postgres;

-- Step 5: Same for scores table
DROP POLICY IF EXISTS "enable_read" ON public.scores;
DROP POLICY IF EXISTS "enable_insert" ON public.scores;
DROP POLICY IF EXISTS "enable_update" ON public.scores;
DROP POLICY IF EXISTS "enable_delete" ON public.scores;

ALTER TABLE public.scores DISABLE ROW LEVEL SECURITY;
GRANT ALL ON public.scores TO anon, authenticated, postgres;

-- Step 6: Same for attendance table  
DROP POLICY IF EXISTS "enable_read" ON public.attendance;
DROP POLICY IF EXISTS "enable_insert" ON public.attendance;
DROP POLICY IF EXISTS "enable_update" ON public.attendance;
DROP POLICY IF EXISTS "enable_delete" ON public.attendance;

ALTER TABLE public.attendance DISABLE ROW LEVEL SECURITY;
GRANT ALL ON public.attendance TO anon, authenticated, postgres;

-- Step 7: Verify all RLS is disabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN ('teams', 'team_members', 'scores', 'attendance')
ORDER BY tablename;

-- Expected output: All should show "f" (false) for rowsecurity
