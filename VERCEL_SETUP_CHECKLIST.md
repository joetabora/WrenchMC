# Vercel Setup Checklist for WrenchMC

This checklist ensures your Vercel deployment is properly configured for authentication.

## ✅ Required Environment Variables in Vercel

Go to **Vercel Dashboard → Your Project → Settings → Environment Variables** and verify you have:

### 1. `NEXT_PUBLIC_SUPABASE_URL`
- **Value**: `https://your-project-id.supabase.co`
- **Environment**: Production, Preview, Development (select all)
- **Where to find**: Supabase Dashboard → Settings → API → Project URL

### 2. `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Value**: Your Supabase anon/public key (starts with `eyJ...`)
- **Environment**: Production, Preview, Development (select all)
- **Where to find**: Supabase Dashboard → Settings → API → Project API keys → `anon` `public`

### 3. `SUPABASE_SERVICE_ROLE_KEY`
- **Value**: Your Supabase service role key (starts with `eyJ...`)
- **Environment**: Production, Preview, Development (select all)
- **Where to find**: Supabase Dashboard → Settings → API → Project API keys → `service_role` `secret`
- **⚠️ Important**: This is a secret key - never expose it in client code

## ✅ Supabase Configuration

### 1. Site URL Configuration
1. Go to **Supabase Dashboard → Authentication → URL Configuration**
2. Set **Site URL** to your Vercel domain:
   - `https://your-app.vercel.app`
   - Or your custom domain if you have one
3. Add **Redirect URLs**:
   - `https://your-app.vercel.app/auth/login`
   - `https://your-app.vercel.app/**` (wildcard for all routes)
   - `http://localhost:3000/**` (for local development)

### 2. Email Provider Settings
1. Go to **Authentication → Settings**
2. **Enable email confirmations**: Toggle ON or OFF (your choice)
   - **OFF** = Users can sign in immediately (good for testing)
   - **ON** = Users must verify email first (better for production)
3. **Email templates**: Customize if needed

### 3. OAuth Providers (if using Google)
1. Go to **Authentication → Providers**
2. Enable **Google** provider
3. Add your Google OAuth credentials
4. Make sure redirect URL in Google Console matches: `https://your-project-id.supabase.co/auth/v1/callback`

## ✅ Vercel Project Settings

### 1. Build Settings
- **Framework Preset**: Next.js (should auto-detect)
- **Build Command**: `next build` (default)
- **Output Directory**: `.next` (default)
- **Install Command**: `npm install` (default)

### 2. Environment Variables
- Make sure all three variables are added
- **Important**: After adding/changing env vars, you MUST redeploy
- Go to **Deployments** tab → Click **⋯** on latest deployment → **Redeploy**

## ✅ Common Issues & Fixes

### Issue: "Invalid API key" or "Unauthorized"
**Fix:**
- Double-check your environment variables in Vercel
- Make sure `NEXT_PUBLIC_SUPABASE_URL` starts with `https://`
- Make sure `NEXT_PUBLIC_SUPABASE_ANON_KEY` is the `anon` key, not `service_role`
- Redeploy after adding env vars

### Issue: Login works but redirects to wrong URL
**Fix:**
- Check Supabase **Authentication → URL Configuration → Redirect URLs**
- Add your Vercel domain to the list
- Make sure Site URL matches your Vercel domain

### Issue: "Email not sent" or "Email confirmation required"
**Fix:**
- Go to Supabase **Authentication → Settings**
- Toggle **"Enable email confirmations"** OFF for testing
- Or configure SMTP provider for production

### Issue: Google OAuth not working
**Fix:**
- Verify Google OAuth is enabled in Supabase
- Check redirect URL in Google Console matches Supabase callback URL
- Format: `https://YOUR_PROJECT_ID.supabase.co/auth/v1/callback`

### Issue: Session not persisting
**Fix:**
- Check browser console for errors
- Verify environment variables are set correctly
- Clear browser cache and localStorage
- Check Supabase Auth logs: **Authentication → Logs**

## ✅ Testing Checklist

After setup, test these:

1. **Email/Password Sign Up**
   - [ ] Can create account
   - [ ] Receives email (if enabled) or can sign in immediately
   - [ ] Redirects to profile page after signup

2. **Email/Password Sign In**
   - [ ] Can sign in with existing account
   - [ ] Session persists on page refresh
   - [ ] Can sign out

3. **Google OAuth** (if enabled)
   - [ ] Google button appears
   - [ ] Redirects to Google sign-in
   - [ ] Returns to app after authentication
   - [ ] User is signed in

4. **Profile Page**
   - [ ] Requires authentication (redirects if not signed in)
   - [ ] Can save bike profile
   - [ ] Profile data persists

## ✅ Quick Verification Commands

You can verify your environment variables are set in Vercel:

1. Go to **Deployments** tab
2. Click on a deployment
3. Check **Build Logs** - should not show "undefined" for env vars
4. Check **Runtime Logs** - should not show auth errors

## 🔍 Debugging Steps

If login still doesn't work:

1. **Check Vercel Build Logs**
   - Look for any errors during build
   - Verify environment variables are being read

2. **Check Browser Console**
   - Open DevTools → Console
   - Look for Supabase errors
   - Check Network tab for failed requests

3. **Check Supabase Auth Logs**
   - Go to Supabase Dashboard → Authentication → Logs
   - Look for failed authentication attempts
   - Check error messages

4. **Verify Environment Variables**
   - In Vercel, make sure variables are set for the correct environment
   - Production variables should be set for Production environment
   - Redeploy after any changes

5. **Test Locally First**
   - Create `.env.local` with your Supabase credentials
   - Run `npm run dev`
   - Test login locally to isolate if it's a Vercel-specific issue

## 📝 Important Notes

- **Always redeploy** after adding/changing environment variables
- Environment variables are case-sensitive
- `NEXT_PUBLIC_*` variables are exposed to the browser (safe for anon key)
- `SUPABASE_SERVICE_ROLE_KEY` should NEVER be exposed to browser
- Site URL in Supabase must match your Vercel domain

## 🆘 Still Not Working?

If you've checked everything above and it's still not working:

1. Share the specific error message you're seeing
2. Check Vercel deployment logs
3. Check browser console errors
4. Verify Supabase project is active (not paused)
5. Make sure you're using the correct Supabase project credentials

