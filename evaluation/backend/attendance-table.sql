-- Check if table exists and drop if needed
DROP TABLE IF EXISTS public.attendance CASCADE;

-- Create attendance table for tracking team member attendance
CREATE TABLE public.attendance (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  team_id BIGINT NOT NULL,
  member_name TEXT NOT NULL,
  status TEXT NOT NULL,
  round INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Disable RLS completely (allow all access)
ALTER TABLE public.attendance DISABLE ROW LEVEL SECURITY;

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_attendance_team_id ON public.attendance(team_id);
CREATE INDEX IF NOT EXISTS idx_attendance_round ON public.attendance(round);
CREATE INDEX IF NOT EXISTS idx_attendance_created_at ON public.attendance(created_at DESC);

-- Grant permissions to public
GRANT SELECT, INSERT, UPDATE, DELETE ON public.attendance TO anon, authenticated, postgres;
