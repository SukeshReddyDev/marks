# Quick Attendance Table Setup Checklist

## ✅ Before You Start
- [ ] Have your Supabase dashboard open
- [ ] You're logged into your project

## ✅ Step-by-Step

### Step 1️⃣: Navigate to SQL Editor
- [ ] In Supabase, click **SQL Editor** in left sidebar
- [ ] Click **New Query** button

### Step 2️⃣: Copy the SQL Code
Copy this EXACTLY:

```sql
CREATE TABLE IF NOT EXISTS public.attendance (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  team_id BIGINT NOT NULL,
  member_name TEXT NOT NULL,
  status TEXT NOT NULL,
  round INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_attendance_team_id ON public.attendance(team_id);
CREATE INDEX IF NOT EXISTS idx_attendance_round ON public.attendance(round);
```

### Step 3️⃣: Paste & Run
- [ ] Paste the SQL into the editor
- [ ] Click the **RUN** button (green, bottom right)
- [ ] Wait for success message (no red errors!)

### Step 4️⃣: Confirm Table Exists
- [ ] Click **Table Editor** in sidebar
- [ ] Look for `attendance` in the table list
- [ ] You should see it! ✅

### Step 5️⃣: Test Your App
- [ ] Go to Judge Dashboard
- [ ] Select a team
- [ ] Mark attendance ✅
- [ ] Submit evaluation ✅
- [ ] **DONE!** Both should save now! 🎉

---

## 🆘 If Something Goes Wrong

### Error: "Syntax error"
→ Copy the SQL code again very carefully

### Error: "permission denied"  
→ This usually means table needs proper permissions. Skip to the admin setup below.

### In Supabase: Can't see "SQL Editor"
→ Look in the left sidebar menu. It should be there after you expand the menu.

---

## 🔧 Advanced: If Simple Method Fails

If the above doesn't work, try this in SQL Editor:

```sql
DROP TABLE IF EXISTS public.attendance CASCADE;

CREATE TABLE public.attendance (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  team_id BIGINT NOT NULL,
  member_name TEXT NOT NULL,
  status TEXT NOT NULL,
  round INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Give public access
ALTER TABLE public.attendance DISABLE ROW LEVEL SECURITY;

CREATE INDEX idx_attendance_team_id ON public.attendance(team_id);
CREATE INDEX idx_attendance_round ON public.attendance(round);
```

Then click **RUN** again.

---

**Once you see ✅ Success** → Go back to your Judge Dashboard and test! The attendance should now save. 🎯
