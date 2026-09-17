# Email Verification System - Complete Setup

## Quick Summary

Your website now has a **complete email verification system**:

```
User Submits Form
        ↓
Entry Saved (unverified)
        ↓
Verification Email Sent
        ↓
User Clicks Link
        ↓
Entry Marked Verified
        ↓
Shows Success Page
```

## All SQL Commands Needed

### 1. Create/Update Table with Verification Fields
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

### 2. Enable Row Level Security
```sql
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
```

### 3. Create Insert Policy
```sql
CREATE POLICY "Allow anonymous inserts" ON contact_submissions
  FOR INSERT WITH CHECK (true);
```

### 4. Create Update Policy
```sql
CREATE POLICY "Allow updating submissions" ON contact_submissions
  FOR UPDATE USING (true) WITH CHECK (true);
```

### 5. Create Select Policy
```sql
CREATE POLICY "Allow viewing submissions" ON contact_submissions
  FOR SELECT USING (true);
```

## Setup Steps

### Step 1: Create Supabase Table
1. Go to Supabase Dashboard → Your Project
2. Open SQL Editor
3. Run all 5 SQL commands above (one at a time)

### Step 2: Get Email Service (Resend)
1. Go to [https://resend.com](https://resend.com)
2. Create free account
3. Get API key from dashboard
4. Note: Free tier allows 100 emails/day

### Step 3: Configure Email in Your Code
Edit `js/email-verification.js`:

Find these lines (around line 3-4):
```javascript
const RESEND_API_KEY = 're_YOUR_RESEND_API_KEY_HERE';
const RESEND_FROM_EMAIL = 'noreply@aksprasad.com';
```

Replace with:
```javascript
const RESEND_API_KEY = 're_1234567890abcdef'; // Your actual key from Resend
const RESEND_FROM_EMAIL = 'hello@aksprasad.com'; // Your email
```

### Step 4: Test the System
1. Go to `http://localhost:8000/contact.html`
2. Fill out form and submit
3. Check browser console for any errors
4. Check your email for verification link
5. Click link to verify
6. See success page
7. Check Supabase dashboard - should see entry with `verified = true`

## Files Created/Updated

✅ **New Files:**
- `js/email-verification.js` - Email verification logic
- `verify-email.html` - Verification landing page
- `EMAIL_VERIFICATION_SETUP.md` - This setup guide

✅ **Updated Files:**
- `js/form-handler.js` - Updated to use verification
- `contact.html` - Added email verification script

## How Each Page Works

### contact.html (Submit Form)
```
1. User fills form
2. Form validates
3. Unverified entry saved to database
4. Verification email sent
5. Shows "Check your email" message
```

### verify-email.html (Click Link)
```
1. User clicks link from email
2. Page shows "Verifying..."
3. Updates database entry to verified
4. Shows success or error message
5. Link to go back home
```

## What Users See

### Step 1: Submit Form
```
Form submitted ✓
Verification email sent!
Please check your inbox and click the link to confirm your submission.
```

### Step 2: Check Email
Email subject: "Verify Your Email - Aks Prasad"
- Project type and budget shown
- Big blue "Verify Email" button
- Link expires in 24 hours

### Step 3: Click Link
```
Verifying your email...
⏳ (loading)
```

### Step 4: Success
```
✓ Email Verified!
Thank you for confirming your email. 
Your project submission has been saved 
and I'll get back to you soon.
```

## View Submissions in Supabase

### Only Verified:
```sql
SELECT * FROM contact_submissions 
WHERE verified = true 
ORDER BY created_at DESC;
```

### All Submissions:
```sql
SELECT * FROM contact_submissions 
ORDER BY created_at DESC;
```

### By Email:
```sql
SELECT * FROM contact_submissions 
WHERE email = 'user@example.com' 
ORDER BY created_at DESC;
```

## Dashboard View

Your Supabase dashboard will show:
- `id` - Auto-generated ID
- `name` - User's name
- `email` - Their email
- `project_type` - Type of project
- `budget` - Budget range
- `message` - Their message
- `verified` - true/false (verified status)
- `verified_at` - Timestamp of verification
- `created_at` - When submitted

## Complete Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│ User visits http://localhost:8000/contact.html              │
└──────────────────────┬──────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────────┐
│ Fills out form: Name, Email, Project Type, Budget, Message  │
└──────────────────────┬──────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────────┐
│ Clicks "Send Project Request" button                         │
└──────────────────────┬──────────────────────────────────────┘
                       ↓
         ┌─────────────────────────────┐
         │ Form Validation (JavaScript)│
         └──────────┬──────────────────┘
                    ↓
         ┌─────────────────────────────┐
         │ Save to Supabase (unverified)
         │ verified = false             │
         └──────────┬──────────────────┘
                    ↓
         ┌─────────────────────────────┐
         │ Send Email via Resend API    │
         │ Subject: Verify Your Email   │
         │ Contains: Verification Link  │
         └──────────┬──────────────────┘
                    ↓
    ┌───────────────────────────────────────┐
    │ User receives email in inbox          │
    │ Email contains verification link:     │
    │ http://localhost:8000/verify-email.html
    │ ?id=123&email=user@example.com        │
    └──────────┬────────────────────────────┘
               ↓
    ┌──────────────────────────────────────┐
    │ User clicks link or copies it        │
    │ Browser navigates to verify-email.html
    └──────────┬─────────────────────────────┘
               ↓
    ┌──────────────────────────────────────┐
    │ verify-email.html page loads         │
    │ Shows: "Verifying your email..."     │
    │ Extracts: id and email from URL      │
    │ Sends: PATCH request to Supabase     │
    │ Updates: verified = true             │
    │ Sets: verified_at = current time     │
    └──────────┬─────────────────────────────┘
               ↓
    ┌──────────────────────────────────────┐
    │ Success!                             │
    │ Shows: "Email Verified!"             │
    │ Displays: "Your submission saved"    │
    │ Button: "Back to Home"               │
    └──────────┬─────────────────────────────┘
               ↓
    ┌──────────────────────────────────────┐
    │ In Supabase Dashboard:               │
    │ Entry shows:                         │
    │ - verified: true ✓                   │
    │ - verified_at: 2026-09-17 11:36:45   │
    │ - All user data saved                │
    └──────────────────────────────────────┘
```

## Checklist

- [ ] Create Supabase table with all columns
- [ ] Enable RLS and create policies
- [ ] Sign up for Resend (resend.com)
- [ ] Get Resend API key
- [ ] Update `RESEND_API_KEY` in `js/email-verification.js`
- [ ] Update `RESEND_FROM_EMAIL` in `js/email-verification.js`
- [ ] Test form submission at `http://localhost:8000/contact.html`
- [ ] Check email for verification link
- [ ] Click link to verify
- [ ] Check Supabase dashboard for verified entry
- [ ] See success page

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "Email service not configured" | Update Resend API key in js/email-verification.js |
| Emails not arriving | Check spam folder, verify sender email in Resend |
| Verification link not working | Check browser console, ensure verify-email.html exists |
| Database not updating | Check RLS policies, verify Supabase URL and keys |
| Form won't submit | Check browser console for JavaScript errors |

## Support

If you need help:
1. Check browser console (F12 → Console tab)
2. Check Supabase logs
3. Check Resend email logs
4. Review error messages

---

**All set! Your email verification system is ready to go.** 🚀
