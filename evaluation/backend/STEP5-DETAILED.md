# Step 5 Explained: Running SQL in Supabase

This guide shows you EXACTLY where to click and what to do.

---

## 📍 Part A: Go to SQL Editor in Supabase

**1. After you create your project, you'll see the Supabase Dashboard**

Look for the left sidebar menu. You should see these options:
- 🏠 Home
- 📊 Project
- **🔎 SQL Editor** ← CLICK THIS

**2. Click on "SQL Editor"**
- The page will show a large blank text area
- There's a "New Query" button in the top left

---

## 🔤 Part B: Copy and Paste the SQL Code

**3. Click the "New Query" button**
- A new blank query editor appears

**4. Copy this SQL code** (you need all of it):

```sql
-- Create Teams Table
CREATE TABLE teams (
  id SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL,
  college VARCHAR NOT NULL,
  project VARCHAR NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create Team Members Table
CREATE TABLE team_members (
  id SERIAL PRIMARY KEY,
  team_id INTEGER REFERENCES teams(id) ON DELETE CASCADE,
  name VARCHAR NOT NULL
);

-- Create Scores Table
CREATE TABLE scores (
  id SERIAL PRIMARY KEY,
  team_id INTEGER REFERENCES teams(id) ON DELETE CASCADE,
  judge_id UUID,
  round INTEGER NOT NULL,
  criteria_1 INTEGER,
  criteria_2 INTEGER,
  criteria_3 INTEGER,
  criteria_4 INTEGER,
  criteria_5 INTEGER,
  total_score INTEGER,
  remarks TEXT,
  judge_name VARCHAR,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS (Security)
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE scores ENABLE ROW LEVEL SECURITY;

-- Create Policies
CREATE POLICY "Teams are viewable" ON teams
  FOR SELECT USING (true);

CREATE POLICY "Scores are viewable" ON scores
  FOR SELECT USING (true);
```

**5. Paste the code into the text area**
- Right-click and paste (Ctrl+V)

---

## ▶️ Part C: Run the Query

**6. Click the "RUN" button** (big blue button in top right of editor)
   - OR press `Ctrl+Enter`

**7. Wait 2-3 seconds**
   - You should see: "Success! 0 rows affected" (or similar)
   - This means the tables were created ✅

---

## ✅ How to Verify It Worked

After you run the SQL:

**1. On the left sidebar, look for "Database" or "Tables"**

**2. Click on it and you should see:**
   - ✅ `teams` table
   - ✅ `team_members` table
   - ✅ `scores` table

If you see these 3 tables, **you're done!** 🎉

---

## 📸 What It Looks Like

```
Supabase Dashboard
├── SQL Editor (left menu)
│   └── New Query button (top)
│       └── Big text area (paste SQL here)
│           └── RUN button (top right, blue)
│
└── Tables (left menu)
    ├── teams ✅
    ├── team_members ✅
    └── scores ✅
```

---

## 🆘 If Something Goes Wrong

**Error: "table already exists"**
- You already ran the SQL once
- That's fine! You can delete the tables and run again, OR just skip this step

**Error: "syntax error"**
- Make sure you copied ALL the SQL code
- Don't include the markdown code blocks (the ``` lines)

**Nothing happens when I click RUN**
- Make sure you pasted the SQL code into the text area first
- The text area should be filled with SQL code

---

## 🎯 Summary

1. Click **SQL Editor** in left menu
2. Click **New Query**
3. **Paste** the SQL code above
4. Click **RUN** button (blue button, top right)
5. Check **Tables** menu to confirm all 3 tables exist

**That's it!** Your database is ready.
