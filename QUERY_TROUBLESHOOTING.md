# Query API Troubleshooting Guide

If you're getting "Failed to process query" errors, follow these steps:

## 🔍 Most Common Issues

### 1. Missing AI API Keys (Most Likely)

**Error**: "AI API keys not configured" or "GROQ_API_KEY not configured"

**Solution**:
- Go to Vercel → Your Project → Settings → Environment Variables
- Add **at least one** of these:
  - `GROQ_API_KEY` = (your Groq API key - get from [console.groq.com](https://console.groq.com))
  - `GEMINI_API_KEY` = (your Gemini API key - get from [ai.google.dev](https://ai.google.dev))
- Make sure to select **Production**, **Preview**, and **Development**
- **Redeploy** your app after adding

### 2. Database Connection Issues

**Error**: "Database connection error" or Prisma errors

**Solution**:
- Verify `PRISMA_DATABASE_URL` and `POSTGRES_URL` are set in Vercel
- Check that database migrations have been run: `npm run db:migrate`
- Verify database is running in Vercel dashboard

### 3. API Quota Exceeded

**Error**: "AI service error" or "quota exceeded"

**Solution**:
- **Groq**: Check rate limits at [console.groq.com](https://console.groq.com)
- **Gemini**: Check quota at [ai.google.dev](https://ai.google.dev)
- Wait a few minutes and try again
- Consider upgrading your API plan

### 4. Invalid API Keys

**Error**: "401 Unauthorized" or "403 Forbidden"

**Solution**:
- Verify API keys are correct (no extra spaces)
- Check keys haven't been revoked
- Generate new keys if needed

## 🧪 How to Debug

### Check Vercel Logs

1. Go to Vercel Dashboard → Your Project → **Deployments**
2. Click on latest deployment → **Functions** tab
3. Click on `/api/query` function
4. Check **Logs** for detailed error messages

### Test API Keys Locally

Add to your `.env.local`:
```env
GROQ_API_KEY=your-key-here
GEMINI_API_KEY=your-key-here
```

Then test:
```bash
npm run dev
# Visit http://localhost:3000/query
```

### Check Browser Console

1. Open browser DevTools (F12)
2. Go to **Console** tab
3. Try a query
4. Look for error messages

## ✅ Quick Checklist

- [ ] `GROQ_API_KEY` or `GEMINI_API_KEY` added to Vercel
- [ ] Environment variables set for Production, Preview, Development
- [ ] App redeployed after adding keys
- [ ] Database connection strings are set
- [ ] Database migrations completed
- [ ] API keys are valid and not expired
- [ ] Checked Vercel function logs for details

## 🔧 Quick Fixes

### If you see "No AI API key configured":
1. Add `GROQ_API_KEY` or `GEMINI_API_KEY` to Vercel
2. Redeploy

### If you see "Database connection error":
1. Check `PRISMA_DATABASE_URL` and `POSTGRES_URL` in Vercel
2. Run migrations: `npm run db:migrate`
3. Verify database is running

### If you see "API error" or "quota exceeded":
1. Check your API provider dashboard
2. Wait a few minutes
3. Try again

## 📞 Still Not Working?

1. **Check Vercel Logs**: Most detailed error info is there
2. **Test Locally**: Run `npm run dev` and test with `.env.local`
3. **Verify All Keys**: Make sure all required env vars are set
4. **Check API Status**: Visit provider status pages

