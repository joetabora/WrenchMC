# Google OAuth Setup Guide for WrenchMC

This guide will help you set up Google sign-in for your WrenchMC application.

## Step 1: Create Google OAuth Credentials

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API:
   - Go to **APIs & Services** → **Library**
   - Search for "Google+ API"
   - Click **Enable**

4. Create OAuth 2.0 credentials:
   - Go to **APIs & Services** → **Credentials**
   - Click **Create Credentials** → **OAuth client ID**
   - If prompted, configure the OAuth consent screen first:
     - Choose **External** (unless you have a Google Workspace)
     - Fill in the required fields (App name, User support email, Developer contact)
     - Add your domain to authorized domains
     - Save and continue through the scopes (you can skip adding scopes)
     - Add test users if your app is in testing mode
   - For Application type, select **Web application**
   - Give it a name (e.g., "WrenchMC Web Client")
   - Add **Authorized JavaScript origins**:
     - `http://localhost:3000` (for local development)
     - `https://your-vercel-domain.vercel.app` (your production domain)
   - Add **Authorized redirect URIs**:
     - `https://your-project-id.supabase.co/auth/v1/callback`
     - You can find your Supabase project URL in your Supabase dashboard → Settings → API
   - Click **Create**
   - **Copy the Client ID and Client Secret** (you'll need these for Supabase)

## Step 2: Configure Google OAuth in Supabase

1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Navigate to **Authentication** → **Providers**
4. Find **Google** in the list and click on it
5. Toggle **Enable Google provider** to ON
6. Enter your Google OAuth credentials:
   - **Client ID (for OAuth)**: Paste your Google Client ID
   - **Client Secret (for OAuth)**: Paste your Google Client Secret
7. Click **Save**

## Step 3: Update Redirect URLs in Google Console

After setting up Supabase, you need to add the exact Supabase callback URL:

1. Go back to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services** → **Credentials**
3. Click on your OAuth 2.0 Client ID
4. Under **Authorized redirect URIs**, make sure you have:
   - `https://YOUR_PROJECT_ID.supabase.co/auth/v1/callback`
   - Replace `YOUR_PROJECT_ID` with your actual Supabase project ID
   - You can find this in Supabase Dashboard → Settings → API → Project URL
5. Click **Save**

## Step 4: Test Google Sign-In

1. Deploy your changes to Vercel (or run locally)
2. Go to `/auth/login` on your site
3. Click **"Continue with Google"**
4. You should be redirected to Google's sign-in page
5. After signing in, you'll be redirected back to your app

## Troubleshooting

### "redirect_uri_mismatch" Error
- Make sure the redirect URI in Google Console exactly matches: `https://YOUR_PROJECT_ID.supabase.co/auth/v1/callback`
- Check for typos, trailing slashes, or http vs https

### "Access blocked: This app's request is invalid"
- Your OAuth consent screen might not be configured
- Make sure you've completed the OAuth consent screen setup
- If in testing mode, add your email as a test user

### "Error 400: invalid_request"
- Verify your Client ID and Client Secret are correct in Supabase
- Make sure Google+ API is enabled in Google Cloud Console

### Google Sign-In Button Not Appearing
- Check browser console for errors
- Verify the `signInWithGoogle` function is properly exported from AuthProvider
- Make sure Google provider is enabled in Supabase dashboard

### Users Not Being Created
- Check Supabase Auth logs: **Authentication** → **Logs**
- Verify RLS policies allow user creation
- Check if email confirmation is required (might block OAuth users)

## Production Checklist

Before going to production:

- [ ] OAuth consent screen is published (not in testing mode)
- [ ] Authorized domains include your production domain
- [ ] Redirect URIs include your production Supabase callback URL
- [ ] Google+ API is enabled
- [ ] Test the full OAuth flow in production

## Additional Notes

- Google OAuth works immediately after setup (no email confirmation needed)
- Users can link their Google account to an existing email/password account
- Google profile information (name, avatar) is automatically synced
- The redirect URL format is always: `https://YOUR_PROJECT_ID.supabase.co/auth/v1/callback`

## Need Help?

- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Google OAuth Docs](https://developers.google.com/identity/protocols/oauth2)
- [Supabase Discord](https://discord.supabase.com/)


