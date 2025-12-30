# Supabase Email Configuration Guide

If you're not receiving verification emails when signing up, follow these steps:

## Option 1: Disable Email Confirmation (Recommended for Development)

This is the quickest solution for testing:

1. Go to your Supabase Dashboard: https://app.supabase.com
2. Select your project
3. Navigate to **Authentication** → **Settings** (or **Authentication** → **Providers** → **Email**)
4. Find the setting **"Enable email confirmations"**
5. **Turn it OFF**
6. Save changes

Now users can sign up and immediately sign in without email verification.

## Option 2: Configure Email Provider (For Production)

If you want email verification for production:

### Using Supabase's Built-in Email Service

1. Go to **Authentication** → **Settings**
2. Under **Email Templates**, you can customize the confirmation email
3. Supabase uses a default email service with rate limits

**Note:** Supabase's free tier has limited email sending. For production, you should configure a custom SMTP provider.

### Using Custom SMTP (Recommended for Production)

1. Go to **Authentication** → **Settings** → **SMTP Settings**
2. Configure your SMTP provider (Gmail, SendGrid, Mailgun, etc.)
3. Enter your SMTP credentials
4. Test the connection

### Popular SMTP Providers:
- **SendGrid** (Free tier: 100 emails/day)
- **Mailgun** (Free tier: 5,000 emails/month)
- **Resend** (Free tier: 3,000 emails/month)
- **Gmail SMTP** (Requires app password)

## Option 3: Check Email Settings

If emails are enabled but not arriving:

1. **Check Spam Folder** - Verification emails often go to spam
2. **Check Supabase Logs** - Go to **Logs** → **Auth Logs** to see if emails were sent
3. **Verify Email Domain** - Some email providers block automated emails
4. **Rate Limits** - Supabase free tier has email sending limits

## Quick Fix for Testing

For immediate testing without email setup:

1. Disable email confirmation in Supabase Dashboard
2. Users can sign up and immediately use the app
3. Re-enable it when ready for production

## Troubleshooting

### "Email rate limit exceeded"
- You've hit Supabase's email sending limit
- Wait a few minutes or configure custom SMTP

### "Email not found in inbox"
- Check spam/junk folder
- Verify email address is correct
- Check Supabase auth logs

### "Email confirmation required"
- Either disable it in settings (dev) or configure SMTP (production)

