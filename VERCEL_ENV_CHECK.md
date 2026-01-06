# Quick Vercel Environment Variables Check

## Required Variables (All 3 must be set)

In Vercel Dashboard → Settings → Environment Variables:

1. ✅ `NEXT_PUBLIC_SUPABASE_URL`
   - Format: `https://xxxxxxxxxxxxx.supabase.co`
   - Must start with `https://`
   - No trailing slash

2. ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Format: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (long JWT token)
   - This is the PUBLIC/ANON key (safe to expose)
   - NOT the service_role key

3. ✅ `SUPABASE_SERVICE_ROLE_KEY`
   - Format: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (long JWT token)
   - This is the SECRET key (keep private)
   - Used only for server-side API routes

## Critical Supabase Settings

### 1. Site URL (MUST MATCH YOUR VERCEL DOMAIN)
- Go to: **Supabase Dashboard → Authentication → URL Configuration**
- **Site URL**: `https://your-app.vercel.app`
- **Redirect URLs**: Add these:
  ```
  https://your-app.vercel.app/**
  https://your-app.vercel.app/auth/login
  http://localhost:3000/**
  ```

### 2. Email Settings
- Go to: **Supabase Dashboard → Authentication → Settings**
- **Enable email confirmations**: Toggle based on your preference
  - OFF = Immediate sign-in (good for testing)
  - ON = Requires email verification

## After Making Changes

1. **In Vercel**: After adding/changing env vars → **Redeploy**
2. **In Supabase**: Changes take effect immediately (no redeploy needed)

## Quick Test

1. Go to your Vercel deployment
2. Open browser DevTools → Console
3. Try to sign up/login
4. Check for errors like:
   - "Invalid API key"
   - "Unauthorized"
   - "Network error"
   - "Failed to fetch"

## Most Common Issues

### ❌ "Invalid API key"
- Wrong key copied (using service_role instead of anon)
- Key has extra spaces or newlines
- Key not set in Vercel

### ❌ "Redirect URL mismatch"
- Site URL in Supabase doesn't match Vercel domain
- Redirect URLs not added to Supabase

### ❌ "Email not sent"
- Email confirmations enabled but no SMTP configured
- Check spam folder
- Disable email confirmations for testing

### ❌ Login works but session doesn't persist
- Check browser console for errors
- Verify environment variables are correct
- Clear browser cache


