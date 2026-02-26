# Attendance Table Setup Guide

## Problem
The evaluation saves but attendance records are not being saved because the `attendance` table doesn't exist in your Supabase database.

## Solution - Follow These Steps EXACTLY:

### Step 1: Go to Supabase Dashboard
- Open browser
- Go to: https://app.supabase.com/
- Sign in to your account
- Click on your **IEEE Ignite** project

### Step 2: Go to SQL Editor
- Look at the **left sidebar**
- Click on **SQL Editor** (it looks like a code icon)
- You'll see the editor on the right

### Step 3: Create New Query
- Click the **"New Query"** button (top right, green button with + icon)
- You'll get a blank SQL editor

### Step 4: Copy This SQL Code
Copy the exact code below and paste it into the SQL editor:

```sql
CREATE TABLE IF NOT EXISTS public.attendance (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  team_id BIGINT NOT NULL,
  member_name TEXT NOT NULL,
  status TEXT NOT NULL,
  round INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_attendance_team_id ON public.attendance(team_id);
CREATE INDEX idx_attendance_round ON public.attendance(round);
```

### Step 5: Run the SQL
- Click the **"RUN"** button (bottom right, green button)
- Wait for it to complete
- You should see: **"Success"** message with no errors

### Step 6: Verify the Table Was Created
1. Click on **Table Editor** (left sidebar)
2. Look for `attendance` table in the list
3. If you see it, the table was created successfully ✅

### Step 7: Test in Your App
1. Go to Judge Dashboard
2. Select a team
3. Mark attendance for each member
4. Click "Submit Evaluation"
5. **Now attendance should save successfully!** ✅

---

## If It Still Doesn't Work

### Check Browser Console:
1. Press **F12** in your browser
2. Go to **Console** tab
3. Submit an evaluation again
4. Look for error messages and share with me

### Verify Table in Supabase:
1. Go to **Table Editor** in Supabase
2. Scroll down to find `attendance` table
3. If you don't see it, the table wasn't created - try Step 4-5 again

### Most Common Issues:
- ❌ **"table already exists"** → That's OK! The table is there. Test the app again.
- ❌ **"syntax error"** → Copy the SQL again carefully, no extra spaces
- ✅ **"Success" or no error** → Table is created! Go test the app.
