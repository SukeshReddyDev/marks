# ✅ Backend Setup Complete!

Your website now has a **Supabase backend**. Here's how to get started:

## 🚀 Quick Setup (5 minutes)

### Step 1: Create Supabase Account
```
1. Go to https://supabase.com
2. Click "Start Your Project"
3. Sign up with Email or GitHub
```

### Step 2: Create New Project
```
1. Click "New Project"
2. Name: IEEE-Ignite (any name works)
3. Create strong password
4. Select your region
5. Wait for project to initialize
```

### Step 3: Get Your API Keys
```
1. Go to Project → Settings → API
2. Copy these two values:
   - Project URL (looks like: https://xxxxx.supabase.co)
   - Anon Key (long string of alphanumerics)
```

### Step 4: Update Configuration File
Edit `js/supabase-config.js` and replace:
```javascript
const SUPABASE_URL = 'https://your-project.supabase.co'; // Paste Project URL here
const SUPABASE_ANON_KEY = 'your-anon-key'; // Paste Anon Key here
```

### Step 5: Create Database Tables
1. In Supabase Dashboard, go to **SQL Editor**
2. Click **"New Query"**
3. Copy-paste the SQL from `backend/supabase-setup.md`
4. Click **"Run"**

### Step 6: Test Connection
Open your browser console (F12) and look for:
```
✓ Supabase connected successfully
```

## 📁 File Structure

```
evaluation/
├── index.html              (Login page - no changes needed)
├── admin.html              (Admin dashboard - updated for Supabase)
├── judge.html              (Judge dashboard - updated for Supabase)
├── js/
│   ├── app.js             (Main app - NOW USES SUPABASE!)
│   ├── supabase-config.js (YOUR CONFIG GOES HERE ⬅️)
│   └── supabase-api.js    (Supabase API functions)
├── css/
│   └── styles.css
└── backend/
    └── supabase-setup.md  (Full SQL schema)
```

## 🔑 Features Implemented

✅ **Teams Management**
- Add new teams
- View all teams with members
- Store teams in database

✅ **Judge Evaluation**
- Select team and round
- Submit scores (0-10 per criterion)
- Save to database

✅ **Admin Dashboard**
- View leaderboards (live from database)
- View all scores
- Add teams

✅ **Data Persistence**
- All data saves to Supabase PostgreSQL
- Real-time leaderboard updates

## 📝 How It Works

### Login
- Currently accepts any email/password for demo
- In production, enable Supabase Auth

### Adding Teams (Admin)
```javascript
// Automatically calls:
await addTeam(name, college, project, members)
// Saves to database
```

### Submitting Evaluations (Judge)
```javascript
// Automatically calls:
await addScore(teamId, judgeId, round, c1, c2, c3, c4, c5, remarks)
// Saves scores to database
```

### Leaderboard
```javascript
// Automatically fetches and calculates:
await getLeaderboard()
// Returns ranked teams by total scores
```

## 🔐 Security Note

- Your **Anon Key** is safe to expose (it's meant for public use)
- Row Level Security (RLS) is enabled
- For production: enable Supabase Auth

## 🆘 Troubleshooting

**Not connecting?**
- Check browser console (F12) for error message
- Verify URL and Anon Key are correct
- Make sure Supabase project is active

**Data not saving?**
- Check database tables exist (run SQL)
- Verify RLS policies allow inserts

**Need Help?**
- Supabase Docs: https://supabase.com/docs
- Check browser console for error messages

## 🎉 Done!

Your website now has a complete backend. Teams, scores, and leaderboards are stored in Supabase!

**Next Steps:**
- Add Supabase Auth for proper authentication
- Add delete team functionality
- Add edit team functionality
- Add user management for admins
