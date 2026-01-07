# How to Debug Query API Errors

If your AI query is failing even though API keys are set, follow these steps to find the exact issue.

## 🔍 Step 1: Check Vercel Function Logs

This is the **most important** step - the logs will show the exact error.

### Method A: Via Vercel Dashboard (Easiest)

1. **Go to Vercel Dashboard**
   - Visit [vercel.com/dashboard](https://vercel.com/dashboard)
   - Select your WrenchMC project

2. **Open Deployments**
   - Click **"Deployments"** tab
   - Click on your **latest deployment**

3. **View Function Logs**
   - Click **"Functions"** tab
   - Find `/api/query` in the list
   - Click on it
   - Click **"Logs"** tab

4. **Trigger an Error**
   - In another tab, visit your app
   - Go to `/query` page
   - Ask a question
   - Go back to Vercel logs - you should see the error

### Method B: Via Vercel CLI (Advanced)

```bash
# Install Vercel CLI if you haven't
npm i -g vercel

# Login
vercel login

# View logs
vercel logs your-project-name --follow
```

---

## 🔍 Step 2: Check Browser Console

1. **Open Browser DevTools**
   - Press `F12` or `Cmd+Option+I` (Mac) / `Ctrl+Shift+I` (Windows)
   - Go to **"Console"** tab

2. **Try a Query**
   - Visit `/query` page
   - Ask a question
   - Look for red error messages in console

3. **Check Network Tab**
   - Go to **"Network"** tab
   - Try query again
   - Click on the `/api/query` request
   - Check **"Response"** tab for error details

---

## 🔍 Step 3: Common Error Messages & Fixes

### "GROQ_API_KEY not configured" or "GEMINI_API_KEY not configured"
**Problem**: API key not found in environment

**Check**:
- [ ] Key is added to Vercel (not just `.env.local`)
- [ ] Key is set for **Production** environment (not just Development)
- [ ] App was **redeployed** after adding key
- [ ] Key name is exactly correct (no typos)

**Fix**: Add key to Vercel → Redeploy

---

### "Groq API error: 401" or "Gemini API error: 401"
**Problem**: Invalid API key

**Check**:
- [ ] Key is copied correctly (no extra spaces)
- [ ] Key hasn't been revoked
- [ ] Key is for the right service (Groq vs Gemini)

**Fix**: Generate new API key and update in Vercel

---

### "Groq API error: 429" or "quota exceeded"
**Problem**: Rate limit or quota exceeded

**Check**:
- [ ] Check your API provider dashboard for quota
- [ ] Wait a few minutes and try again
- [ ] Consider upgrading plan if needed

**Fix**: Wait or upgrade API plan

---

### "Database connection error" or Prisma errors
**Problem**: Database not accessible

**Check**:
- [ ] `PRISMA_DATABASE_URL` is set in Vercel
- [ ] `POSTGRES_URL` is set in Vercel
- [ ] Database is running in Vercel dashboard
- [ ] Migrations have been run

**Fix**: Check database status and connection strings

---

### "No response from AI"
**Problem**: AI API returned empty response

**Check**:
- [ ] API key is valid
- [ ] API service is operational
- [ ] Check API provider status page

**Fix**: Verify API key and service status

---

## 🔍 Step 4: Test API Keys Directly

### Test Groq API Key

```bash
curl https://api.groq.com/openai/v1/chat/completions \
  -H "Authorization: Bearer YOUR_GROQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "llama-3.1-70b-versatile",
    "messages": [{"role": "user", "content": "Hello"}],
    "max_tokens": 10
  }'
```

**Expected**: JSON response with AI answer
**If 401**: Invalid key
**If 429**: Rate limited

### Test Gemini API Key

```bash
curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=YOUR_GEMINI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "contents": [{
      "role": "user",
      "parts": [{"text": "Hello"}]
    }]
  }'
```

**Expected**: JSON response with AI answer
**If 400**: Invalid key or request
**If 429**: Rate limited

---

## 🔍 Step 5: Enable Detailed Logging

The query API now logs detailed errors. Check Vercel logs for:

```
Query API error: [actual error message]
Error details: {
  message: "...",
  stack: "...",
  name: "..."
}
```

This will tell you exactly what's failing.

---

## 🔍 Step 6: Verify Environment Variables

### Check What Vercel Sees

1. **Temporarily add a test endpoint** (or check existing logs)
2. **Look for environment variable values** in logs
3. **Verify keys are actually set**

### Quick Test: Add Debug Endpoint

Create `src/app/api/debug-env/route.ts`:

```typescript
import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    hasGroq: !!process.env.GROQ_API_KEY,
    hasGemini: !!process.env.GEMINI_API_KEY,
    groqLength: process.env.GROQ_API_KEY?.length || 0,
    geminiLength: process.env.GEMINI_API_KEY?.length || 0,
    // Don't return actual keys for security
  })
}
```

Visit `/api/debug-env` to see if keys are loaded.

**⚠️ Remove this endpoint after debugging!**

---

## 📋 Debugging Checklist

- [ ] Checked Vercel function logs for `/api/query`
- [ ] Checked browser console for errors
- [ ] Checked Network tab for API response
- [ ] Verified API keys are in Vercel (not just `.env.local`)
- [ ] Verified keys are set for **Production** environment
- [ ] Verified app was redeployed after adding keys
- [ ] Tested API keys directly with curl
- [ ] Checked API provider status pages
- [ ] Verified database connection strings are set
- [ ] Checked for rate limit/quota errors

---

## 🚨 Still Can't Find It?

1. **Copy the exact error message** from Vercel logs
2. **Check the error stack trace** in logs
3. **Note when it happens** (immediately? after a delay?)
4. **Check if it's consistent** (always fails? sometimes works?)

Share the exact error message from Vercel logs and I can help debug further!

---

## 💡 Pro Tips

1. **Always check Vercel logs first** - they have the most detail
2. **Redeploy after adding env vars** - they don't apply to running deployments
3. **Check Production environment** - Preview/Dev might have different keys
4. **Test with curl** - isolates API key issues from app issues
5. **Check API provider dashboards** - they show usage and errors

