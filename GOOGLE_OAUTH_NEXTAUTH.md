# Google OAuth Setup for NextAuth (WrenchMC Goliath)

This guide will help you set up Google sign-in using NextAuth.js for your WrenchMC application.

## Step 1: Create Google OAuth Credentials

1. **Go to Google Cloud Console**
   - Visit [https://console.cloud.google.com/](https://console.cloud.google.com/)
   - Sign in with your Google account

2. **Create or Select a Project**
   - Click the project dropdown at the top
   - Click **"New Project"** (or select an existing one)
   - Enter project name: `WrenchMC` (or your choice)
   - Click **"Create"**

3. **Configure OAuth Consent Screen**
   - Go to **APIs & Services** → **OAuth consent screen** (left sidebar)
   - Choose **External** (unless you have Google Workspace)
   - Click **"Create"**
   - Fill in required fields:
     - **App name**: `WrenchMC` (or your app name)
     - **User support email**: Your email
     - **Developer contact information**: Your email
   - Click **"Save and Continue"**
   - **Scopes**: Click **"Add or Remove Scopes"**
     - Select: `.../auth/userinfo.email` and `.../auth/userinfo.profile`
     - Click **"Update"** → **"Save and Continue"**
   - **Test users** (if in testing mode): Add your email
   - Click **"Save and Continue"** → **"Back to Dashboard"**

4. **Create OAuth 2.0 Client ID**
   - Go to **APIs & Services** → **Credentials**
   - Click **"+ CREATE CREDENTIALS"** → **"OAuth client ID"**
   - **Application type**: Select **"Web application"**
   - **Name**: `WrenchMC Web Client` (or your choice)
   
5. **Add Authorized JavaScript Origins**
   - Click **"+ ADD URI"** for each:
     - `http://localhost:3000` (for local development)
     - `https://your-app-name.vercel.app` (your production URL)
   
6. **Add Authorized Redirect URIs**
   - Click **"+ ADD URI"** for each:
     - `http://localhost:3000/api/auth/callback/google` (local)
     - `https://your-app-name.vercel.app/api/auth/callback/google` (production)
   
7. **Create and Copy Credentials**
   - Click **"CREATE"**
   - **IMPORTANT**: Copy both:
     - **Your Client ID** (looks like: `123456789-abc.apps.googleusercontent.com`)
     - **Your Client Secret** (looks like: `GOCSPX-abc123...`)
   - Save these securely - you'll need them for Vercel

---

## Step 2: Add Environment Variables to Vercel

1. **Go to Vercel Dashboard**
   - Visit [https://vercel.com/dashboard](https://vercel.com/dashboard)
   - Select your WrenchMC project

2. **Add Environment Variables**
   - Go to **Settings** → **Environment Variables**
   - Click **"Add New"**
   
3. **Add Google OAuth Credentials**
   - **Name**: `GOOGLE_CLIENT_ID`
   - **Value**: Paste your Google Client ID
   - **Environment**: Select **Production**, **Preview**, and **Development**
   - Click **"Save"**
   
   - Click **"Add New"** again
   - **Name**: `GOOGLE_CLIENT_SECRET`
   - **Value**: Paste your Google Client Secret
   - **Environment**: Select **Production**, **Preview**, and **Development**
   - Click **"Save"**

4. **Verify NextAuth Variables**
   - Make sure you also have:
     - `NEXTAUTH_SECRET` (generate with: `openssl rand -base64 32`)
     - `NEXTAUTH_URL` (your production URL: `https://your-app.vercel.app`)

5. **Redeploy**
   - Go to **Deployments** tab
   - Click **"..."** on latest deployment → **"Redeploy"**
   - Or push a new commit to trigger auto-deploy

---

## Step 3: Test Google Sign-In

1. **Visit Your App**
   - Go to `https://your-app.vercel.app/auth/login`
   - Or locally: `http://localhost:3000/auth/login`

2. **Click "Sign in with Google"**
   - You should see a Google sign-in button
   - Click it

3. **Complete OAuth Flow**
   - You'll be redirected to Google's sign-in page
   - Sign in with your Google account
   - Grant permissions if prompted
   - You'll be redirected back to your app

4. **Verify Success**
   - You should be logged in
   - Check your profile page (`/profile`)
   - Your Google name and email should be displayed

---

## Step 4: Local Development Setup

For local testing, add to your `.env.local` file:

```env
GOOGLE_CLIENT_ID=your-client-id-here
GOOGLE_CLIENT_SECRET=your-client-secret-here
NEXTAUTH_SECRET=your-nextauth-secret-here
NEXTAUTH_URL=http://localhost:3000
```

Then restart your dev server:
```bash
npm run dev
```

---

## Troubleshooting

### "redirect_uri_mismatch" Error
**Problem**: Google says the redirect URI doesn't match

**Solution**:
- Check that your redirect URI in Google Console **exactly** matches:
  - Production: `https://your-app.vercel.app/api/auth/callback/google`
  - Local: `http://localhost:3000/api/auth/callback/google`
- No trailing slashes
- Must be `https` in production (not `http`)
- Check for typos in your Vercel domain

### "Access blocked: This app's request is invalid"
**Problem**: OAuth consent screen not configured

**Solution**:
- Complete the OAuth consent screen setup in Google Cloud Console
- If in testing mode, add your email as a test user
- Make sure you've saved all steps in the consent screen

### "Error 400: invalid_request"
**Problem**: Invalid credentials

**Solution**:
- Verify `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are correct in Vercel
- Make sure they're copied correctly (no extra spaces)
- Check that the credentials are for a "Web application" type

### Google Sign-In Button Not Working
**Problem**: Button doesn't redirect or shows error

**Solution**:
- Check browser console for errors
- Verify environment variables are set in Vercel
- Make sure you've redeployed after adding env vars
- Check that NextAuth is properly configured in `src/lib/auth.ts`

### Users Not Being Created in Database
**Problem**: Sign-in works but user isn't in database

**Solution**:
- Check Prisma database connection
- Verify `PRISMA_DATABASE_URL` is set correctly
- Check database logs in Vercel
- Make sure Prisma migrations have been run

### "NEXTAUTH_SECRET is missing"
**Problem**: NextAuth can't find the secret

**Solution**:
- Generate a new secret: `openssl rand -base64 32`
- Add it to Vercel as `NEXTAUTH_SECRET`
- Make sure `NEXTAUTH_URL` is also set
- Redeploy

---

## Production Checklist

Before going live:

- [ ] OAuth consent screen is published (not in testing mode)
- [ ] Authorized JavaScript origins include production domain
- [ ] Authorized redirect URIs include production callback URL
- [ ] `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` added to Vercel
- [ ] `NEXTAUTH_SECRET` and `NEXTAUTH_URL` set in Vercel
- [ ] Tested full OAuth flow in production
- [ ] Database migrations completed
- [ ] Users can successfully sign in and are created in database

---

## Security Notes

- **Never commit** `GOOGLE_CLIENT_SECRET` or `NEXTAUTH_SECRET` to git
- Keep these values in `.env.local` (local) and Vercel (production)
- `.env.local` is already in `.gitignore`
- Use different OAuth credentials for development and production (optional but recommended)

---

## Additional Resources

- [NextAuth.js Google Provider Docs](https://next-auth.js.org/providers/google)
- [Google OAuth 2.0 Docs](https://developers.google.com/identity/protocols/oauth2)
- [NextAuth.js Configuration](https://next-auth.js.org/configuration/options)

---

## Quick Reference

**Callback URL Format**:
- Local: `http://localhost:3000/api/auth/callback/google`
- Production: `https://your-app.vercel.app/api/auth/callback/google`

**Required Environment Variables**:
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`

**Where to Find**:
- Google Client ID/Secret: Google Cloud Console → APIs & Services → Credentials
- NextAuth Secret: Generate with `openssl rand -base64 32`
- NextAuth URL: Your Vercel deployment URL

