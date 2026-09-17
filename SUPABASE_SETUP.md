# Supabase Integration Setup Guide

## Quick Start

Your website contact form is now integrated with Supabase for secure data storage. Follow these steps to set it up.

## Step 1: Create Supabase Table

In your Supabase dashboard, open the SQL Editor and run this query to create the contact submissions table:

```sql
CREATE TABLE contact_submissions (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  project_type TEXT NOT NULL,
  budget TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Step 2: Enable Row Level Security (RLS)

Still in SQL Editor, run these commands to allow anonymous submissions:

```sql
-- Enable RLS on the table
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert
CREATE POLICY "Allow anonymous inserts" ON contact_submissions
  FOR INSERT WITH CHECK (true);

-- Create policy to allow viewing own submissions (optional)
CREATE POLICY "Allow users to view their own submissions" ON contact_submissions
  FOR SELECT USING (email = auth.jwt() ->> 'email');
```

## Step 3: Configure Your Project

Your Supabase credentials are already in `js/supabase-client.js`:

- **Project URL:** `https://grdlpybkqxkrewqyuvzl.supabase.co`
- **Anon Key:** Embedded in the script

✅ **The integration is ready to use!**

## How It Works

1. User fills out contact form on `/contact.html`
2. Form validates client-side
3. On submit, data is sent to Supabase via REST API
4. Submission is stored in `contact_submissions` table
5. User sees success/error message

## Viewing Submissions

### In Supabase Dashboard
1. Go to your Supabase project
2. Click on "contact_submissions" table in the left sidebar
3. View all submissions with timestamps

### Query Submissions via SQL
```sql
SELECT * FROM contact_submissions ORDER BY created_at DESC;
```

### Get Latest Submissions
```sql
SELECT * FROM contact_submissions 
ORDER BY created_at DESC 
LIMIT 10;
```

## Features

✅ **Secure:** Uses Supabase's Row Level Security
✅ **Validated:** Client-side validation before submission
✅ **Reliable:** Automatic timestamps
✅ **Scalable:** Supabase handles all backend infrastructure
✅ **Easy:** No backend code needed

## Troubleshooting

### Form not submitting?
1. Open browser DevTools (F12)
2. Check Console tab for errors
3. Ensure Supabase project URL and keys are correct
4. Verify table name is `contact_submissions`

### CORS errors?
- This is normal for development
- Supabase handles CORS automatically
- Should work fine in production

### Check if script loaded
In browser console, run:
```javascript
console.log(window.supabase);
```

Should show the Supabase client object.

## Security Notes

⚠️ **Important:**
- The anon key is intentionally public (it's for client-side use)
- RLS policies control what data can be accessed
- Only users can insert into the table (no direct updates/deletes)
- Always use RLS policies to restrict access

## File Structure

```
js/
├── supabase-client.js      # Supabase client initialization
├── form-handler.js         # Form validation and submission
└── main.js                 # Shared functionality
```

## Testing

1. Go to `http://localhost:8000/contact.html`
2. Fill out the form
3. Click "Send Project Request"
4. Should see success message
5. Check Supabase dashboard - submission should appear in the table

## Next Steps

1. ✅ Create table in Supabase (see Step 1)
2. ✅ Enable RLS (see Step 2)
3. ✅ Test form submission
4. ✅ View submissions in Supabase dashboard

## Advanced: Email Notifications

To send email notifications on new submissions, use Supabase Edge Functions or integrate with a service like:
- SendGrid
- Mailgun
- Resend
- Custom webhook

Contact me if you need help setting this up!

---

**Last Updated:** September 17, 2026
**Status:** Ready to use after creating the table
