# Supabase Setup Guide

## Step 1: Create Supabase Account
1. Go to https://supabase.com
2. Sign up and create a new project
3. Name it "IEEE-Ignite" (or anything you prefer)
4. Choose a strong password and region

## Step 2: Get Your Credentials
After project creation, go to **Settings > API** and copy:
- **Project URL** (looks like: `https://xxxxx.supabase.co`)
- **Anon Key** (public key for frontend)

## Step 3: Create Database Tables
Go to **SQL Editor** and run this:

```sql
-- Users Table
CREATE TABLE users (
  id UUID = gen_random_uuid() PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  password_hash VARCHAR NOT NULL,
  role VARCHAR CHECK (role IN ('judge', 'admin')) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Teams Table
CREATE TABLE teams (
  id SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL,
  college VARCHAR NOT NULL,
  project VARCHAR NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Team Members Table
CREATE TABLE team_members (
  id SERIAL PRIMARY KEY,
  team_id INTEGER REFERENCES teams(id) ON DELETE CASCADE,
  name VARCHAR NOT NULL
);

-- Scores Table
CREATE TABLE scores (
  id SERIAL PRIMARY KEY,
  team_id INTEGER REFERENCES teams(id) ON DELETE CASCADE,
  judge_id UUID REFERENCES users(id) ON DELETE CASCADE,
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

-- Enable RLS (Row Level Security)
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Teams are viewable by everyone" ON teams
  FOR SELECT USING (true);

CREATE POLICY "Scores viewable by judges and admins" ON scores
  FOR SELECT USING (true);

CREATE POLICY "Users can view themselves" ON users
  FOR SELECT USING (auth.uid() = id);
```

## Step 4: Test Data (Optional)
Insert sample teams in SQL Editor:

```sql
INSERT INTO teams (name, college, project) VALUES
('Team Nexus', 'MIT College of Engineering', 'AI-Powered Smart Traffic Management'),
('Team Quantum', 'VIT University', 'Blockchain-Based Voting System'),
('Team Spark', 'BITS Pilani', 'IoT-Enabled Smart Agriculture'),
('Team Apex', 'NIT Trichy', 'AR-Based Campus Navigation'),
('Team Cipher', 'IIT Bombay', 'Cybersecurity Threat Prediction Engine');

-- Add members for Team Nexus
INSERT INTO team_members (team_id, name) VALUES
(1, 'Aarav Sharma'),
(1, 'Priya Iyer'),
(1, 'Rohan Das'),
(1, 'Sneha Kulkarni');
```

## Step 5: Update Frontend Config
After getting your credentials, update `js/supabase-config.js` with your keys.
