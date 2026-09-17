# 🔧 Fix: Complete Supabase Setup Instructions

## Problem
Form is not submitting because the Supabase table doesn't exist yet.

## Solution - 3 Simple Steps

### Step 1: Go to Supabase Dashboard
1. Open https://supabase.com
2. Log in to your project
3. Click on your project name

### Step 2: Open SQL Editor
1. Click **SQL Editor** (left sidebar)
2. Click **New Query**

### Step 3: Copy & Paste This Code

```sql
CREATE TABLE contact_submissions (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  project_type TEXT NOT NULL,
  budget TEXT,
  message TEXT NOT NULL,
  verified BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous inserts" ON contact_submissions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow all updates" ON contact_submissions
  FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Allow all selects" ON contact_submissions
  FOR SELECT USING (true);
```

### Step 4: Run the Query
1. Paste the code above into the SQL Editor
2. Click the **Run** button (or press Ctrl+Enter)
3. Wait for success message

### Step 5: Test the Form
1. Go back to http://localhost:8000/contact.html
2. Fill out the form
3. Click "Send Project Request"
4. Should now work! ✓

---

## Verify It Works

After running SQL:
1. Go to Supabase Dashboard
2. Click **contact_submissions** table (left sidebar)
3. You should see the empty table
4. Submit the form from your website
5. Submission should appear in the table!

---

## If Still Not Working

Open browser DevTools (F12) and check:
1. Press **F12** to open DevTools
2. Go to **Console** tab
3. Fill and submit the form
4. Look for error messages
5. Share the error with me

---

**That's it! Your form will work after creating the table.** ✅
