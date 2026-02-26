-- ============================================
-- ALTERNATIVE FIX: Create Explicit Allow Policies
-- ============================================
-- Use this if DISABLE RLS doesn't work

-- Step 1: Drop ALL policies
DROP POLICY IF EXISTS "enable_read" ON public.teams;
DROP POLICY IF EXISTS "enable_insert" ON public.teams;
DROP POLICY IF EXISTS "enable_update" ON public.teams;
DROP POLICY IF EXISTS "enable_delete" ON public.teams;

-- Step 2: Enable RLS (we'll manage with explicit policies)
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;

-- Step 3: Create explicit ALLOW policies for all operations
CREATE POLICY "teams_allow_all_read"
  ON public.teams
  FOR SELECT
  USING (true);

CREATE POLICY "teams_allow_all_insert"
  ON public.teams
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "teams_allow_all_update"
  ON public.teams
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "teams_allow_all_delete"
  ON public.teams
  FOR DELETE
  USING (true);

-- Step 4: Do the same for all other tables
DROP POLICY IF EXISTS "enable_read" ON public.team_members;
DROP POLICY IF EXISTS "enable_insert" ON public.team_members;
DROP POLICY IF EXISTS "enable_update" ON public.team_members;
DROP POLICY IF EXISTS "enable_delete" ON public.team_members;

ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "team_members_allow_all_read"
  ON public.team_members FOR SELECT USING (true);
CREATE POLICY "team_members_allow_all_insert"
  ON public.team_members FOR INSERT WITH CHECK (true);
CREATE POLICY "team_members_allow_all_update"
  ON public.team_members FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "team_members_allow_all_delete"
  ON public.team_members FOR DELETE USING (true);

-- Same for scores
DROP POLICY IF EXISTS "enable_read" ON public.scores;
DROP POLICY IF EXISTS "enable_insert" ON public.scores;
DROP POLICY IF EXISTS "enable_update" ON public.scores;
DROP POLICY IF EXISTS "enable_delete" ON public.scores;

ALTER TABLE public.scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "scores_allow_all_read"
  ON public.scores FOR SELECT USING (true);
CREATE POLICY "scores_allow_all_insert"
  ON public.scores FOR INSERT WITH CHECK (true);
CREATE POLICY "scores_allow_all_update"
  ON public.scores FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "scores_allow_all_delete"
  ON public.scores FOR DELETE USING (true);

-- Same for attendance
DROP POLICY IF EXISTS "enable_read" ON public.attendance;
DROP POLICY IF EXISTS "enable_insert" ON public.attendance;
DROP POLICY IF EXISTS "enable_update" ON public.attendance;
DROP POLICY IF EXISTS "enable_delete" ON public.attendance;

ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;

CREATE POLICY "attendance_allow_all_read"
  ON public.attendance FOR SELECT USING (true);
CREATE POLICY "attendance_allow_all_insert"
  ON public.attendance FOR INSERT WITH CHECK (true);
CREATE POLICY "attendance_allow_all_update"
  ON public.attendance FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "attendance_allow_all_delete"
  ON public.attendance FOR DELETE USING (true);

-- Verify policies are in place
SELECT tablename, policyname
FROM pg_policies
WHERE tablename IN ('teams', 'team_members', 'scores', 'attendance')
ORDER BY tablename, policyname;
