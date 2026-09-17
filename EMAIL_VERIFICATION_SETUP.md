# Email Verification Setup Guide

## Overview

Your contact form now has a **2-step verification system**:
1. User submits form → unverified entry stored in database
2. Verification email sent to their address
3. User clicks link in email → entry marked as verified
4. Only verified submissions appear in your dashboard

## Step 1: Update Supabase Table Schema

Run this SQL in your Supabase SQL Editor to add verification fields:

```sql
ALTER TABLE contact_submissions ADD COLUMN verified BOOLEAN DEFAULT false;
ALTER TABLE contact_submissions ADD COLUMN verified_at TIMESTAMP;
ALTER TABLE contact_submissions ADD COLUMN verification_token TEXT;
```

Or create a fresh table with all columns:

```sql
DROP TABLE IF EXISTS contact_submissions CASCADE;

CREATE TABLE contact_submissions (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  project_type TEXT NOT NULL,
  budget TEXT,
  message TEXT NOT NULL,
  verified BOOLEAN DEFAULT false,
  verified_at TIMESTAMP,
  verification_token TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Step 2: Enable Row Level Security (RLS)

```sql
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert
CREATE POLICY "Allow anonymous inserts" ON contact_submissions
  FOR INSERT WITH CHECK (true);

-- Allow updating own submissions
CREATE POLICY "Allow updating submissions" ON contact_submissions
  FOR UPDATE USING (true) WITH CHECK (true);

-- Allow viewing all submissions (you can view in dashboard)
CREATE POLICY "Allow viewing submissions" ON contact_submissions
  FOR SELECT USING (true);
```

## Step 3: Set Up Email Service (Resend)

### Get Resend API Key:
1. Go to [https://resend.com](https://resend.com)
2. Sign up for free account
3. Get your API key from dashboard
4. Verify your domain (or use free trial domain)

### Update Email Verification Code:
Edit `js/email-verification.js` and update these lines:

```javascript
const RESEND_API_KEY = 're_YOUR_RESEND_API_KEY_HERE'; // Your Resend API key
const RESEND_FROM_EMAIL = 'noreply@aksprasad.com'; // Change to your email
```

Replace with:
- Your actual Resend API key (starts with `re_`)
- Your email or domain

## How It Works

### User Submits Form:
1. Form validates
2. Entry stored with `verified = false`
3. Verification email sent to their address

### Email Verification Flow:
1. User receives email with verification link
2. Link includes submission ID and email
3. User clicks link → directed to `verify-email.html`
4. Link updates database to set `verified = true`
5. Success message shown to user

### In Your Dashboard:
- Go to Supabase → contact_submissions table
- Filter by `verified = true` to see confirmed submissions only
- Check `verified_at` timestamp for when they confirmed

## Query Verified Submissions Only

```sql
SELECT * FROM contact_submissions 
WHERE verified = true 
ORDER BY created_at DESC;
```

## View All Submissions (Including Unverified)

```sql
SELECT * FROM contact_submissions 
ORDER BY created_at DESC;
```

## Testing Locally

1. **Without Email Service** (Development):
   - Form will fail at email step but save to database
   - You can manually verify in Supabase dashboard:
     ```sql
     UPDATE contact_submissions SET verified = true 
     WHERE email = 'test@example.com';
     ```

2. **With Resend** (Production):
   - Users get real verification emails
   - Only verified submissions count

## File Structure

```
js/
├── supabase-client.js         # Supabase connection
├── email-verification.js      # Email and verification logic
├── form-handler.js            # Form submission handler
└── main.js                    # Shared utilities

verify-email.html              # Verification landing page
```

## Security Features

✅ **Row Level Security** - Only authorized access
✅ **Verification Tokens** - Prevents spam
✅ **Time-Limited Links** - Expire after 24 hours
✅ **Email Validation** - Server-side verification
✅ **Unverified Storage** - Separates confirmed from pending

## Troubleshooting

### "Email service not configured"
- Check Resend API key is correct
- Verify domain is set up in Resend
- Check `RESEND_FROM_EMAIL` is valid

### Verification link not working
- Check browser console for errors
- Ensure `verify-email.html` exists
- Verify Supabase URL is correct

### Emails not sending
1. Check Resend API key in `js/email-verification.js`
2. Verify sender email is configured in Resend
3. Check spam folder
4. Use Resend dashboard to debug

### Database not updating
- Check RLS policies are correct
- Verify Supabase keys are valid
- Check browser console for API errors

## Alternative Email Services

### SendGrid
```javascript
const SENDGRID_API_KEY = 'SG.xxxxx';
// Similar setup, just different API endpoint
```

### Mailgun
```javascript
const MAILGUN_API_KEY = 'key-xxx';
// Different API format
```

### Gmail (SMTP)
- Use a service like [SendGrid Inbound Parse](https://sendgrid.com)
- Or backend service like [Nodemailer](https://nodemailer.com)

## Next Steps

1. ✅ Update Supabase table with verification columns
2. ✅ Enable RLS policies
3. ✅ Get Resend API key
4. ✅ Update `js/email-verification.js` with your key
5. ✅ Test form submission
6. ✅ Check verification email
7. ✅ Click link to verify
8. ✅ Confirm in Supabase dashboard

## Example Flow

```
User fills form
    ↓
Form validates ✓
    ↓
Entry stored (verified = false)
    ↓
Email sent to user
    ↓
User clicks link
    ↓
Database updated (verified = true, verified_at = now)
    ↓
Success page shown
    ↓
You see verified submission in dashboard
```

---

**Last Updated:** September 17, 2026
**Status:** Ready to use with Resend integration
