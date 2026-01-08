# Environment Variables Setup Guide

This guide explains where to put your environment variables for local development vs production.

## 📁 Two Places for Environment Variables

### 1. `.env.local` (Local Development)
- **Location**: Project root directory
- **Purpose**: Used when running `npm run dev` locally
- **Never commit to git** (already in `.gitignore`)

### 2. Vercel Environment Variables (Production)
- **Location**: Vercel Dashboard → Settings → Environment Variables
- **Purpose**: Used when deployed on Vercel
- **Never commit to git**

---

## 🔧 Required Environment Variables

### Minimum Required (to run the app):

```env
# Database (Required)
PRISMA_DATABASE_URL=your-prisma-accelerate-url
POSTGRES_URL=your-direct-postgres-url

# NextAuth (Required)
NEXTAUTH_SECRET=your-generated-secret
NEXTAUTH_URL=http://localhost:3000  # or https://your-app.vercel.app for production
```

### AI Features (Required for `/query` to work):

```env
# Choose at least ONE:
GROQ_API_KEY=your-groq-api-key
# OR
GEMINI_API_KEY=your-gemini-api-key
```

### Optional Features:

```env
# Google OAuth (for Google sign-in)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# YouTube Integration (for video tutorials)
YOUTUBE_API_KEY=your-youtube-api-key

# ElevenLabs API (for enhanced voice quality - optional)
ELEVENLABS_API_KEY=your-elevenlabs-api-key
ELEVENLABS_VOICE_ID=21m00Tcm4TlvDq8ikWAM  # Optional: defaults to Rachel
ELEVENLABS_MODEL_ID=eleven_turbo_v2_5    # Optional: defaults to turbo

# Vector Database (for RAG - optional)
PINECONE_API_KEY=your-pinecone-api-key
PINECONE_INDEX_NAME=your-index-name
PINECONE_ENVIRONMENT=us-east-1

# Embeddings (required if using Pinecone)
HUGGINGFACE_API_KEY=your-hf-token  # Free option
# OR
OPENAI_API_KEY=your-openai-key  # Paid option
```

---

## 📝 Setting Up `.env.local`

1. **Create/Edit `.env.local`** in your project root:
   ```bash
   # In your terminal
   touch .env.local
   # Or open it in your editor
   ```

2. **Add all your keys**:
   ```env
   # Database
   PRISMA_DATABASE_URL=your-prisma-url
   POSTGRES_URL=your-postgres-url

   # NextAuth
   NEXTAUTH_SECRET=your-secret-here
   NEXTAUTH_URL=http://localhost:3000

   # AI (at least one)
   GROQ_API_KEY=your-groq-api-key-here
   GEMINI_API_KEY=your-gemini-api-key-here

   # Optional
   YOUTUBE_API_KEY=your-youtube-api-key-here
   ELEVENLABS_API_KEY=your-elevenlabs-api-key-here
   ELEVENLABS_VOICE_ID=21m00Tcm4TlvDq8ikWAM
   ELEVENLABS_MODEL_ID=eleven_turbo_v2_5
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   PINECONE_API_KEY=your-pinecone-api-key-here
   PINECONE_INDEX_NAME=wrenchmc
   PINECONE_ENVIRONMENT=us-east-1
   ```

3. **Restart your dev server**:
   ```bash
   # Stop the server (Ctrl+C) and restart
   npm run dev
   ```

---

## 🚀 Setting Up Vercel Environment Variables

1. **Go to Vercel Dashboard**
   - Visit [vercel.com/dashboard](https://vercel.com/dashboard)
   - Select your WrenchMC project

2. **Add Variables**
   - Go to **Settings** → **Environment Variables**
   - Click **"Add New"** for each variable
   - **Important**: Select **Production**, **Preview**, and **Development** for each

3. **Redeploy**
   - After adding variables, redeploy your app
   - Or push a commit to trigger auto-deploy

---

## ✅ Quick Checklist

### Local Development (`.env.local`):
- [ ] `PRISMA_DATABASE_URL` added
- [ ] `POSTGRES_URL` added
- [ ] `NEXTAUTH_SECRET` added
- [ ] `NEXTAUTH_URL=http://localhost:3000` added
- [ ] `GROQ_API_KEY` or `GEMINI_API_KEY` added
- [ ] Optional keys added as needed
- [ ] Dev server restarted after adding

### Production (Vercel):
- [ ] All same variables added to Vercel
- [ ] `NEXTAUTH_URL` set to production URL (e.g., `https://your-app.vercel.app`)
- [ ] Variables set for Production, Preview, and Development
- [ ] App redeployed after adding variables

---

## 🔍 How to Verify

### Local:
```bash
# Start dev server
npm run dev

# Visit http://localhost:3000/query
# Try asking a question - should work if keys are set
```

### Production:
- Visit your Vercel deployment
- Try the query feature
- Check Vercel function logs if errors occur

---

## 🐛 Common Issues

### "API key not configured" locally
- **Fix**: Add keys to `.env.local`
- **Verify**: Restart dev server after adding

### "API key not configured" in production
- **Fix**: Add keys to Vercel environment variables
- **Verify**: Redeploy after adding

### Keys work locally but not in production
- **Check**: Keys are added to Vercel (not just `.env.local`)
- **Check**: Variables are set for Production environment
- **Check**: App was redeployed after adding keys

### Different behavior locally vs production
- **Check**: `NEXTAUTH_URL` is different (localhost vs production URL)
- **Check**: Database URLs might be different
- **Check**: Some keys might only be in one place

---

## 🔒 Security Notes

1. **Never commit `.env.local`** - It's already in `.gitignore`
2. **Never commit API keys** - Always use environment variables
3. **Use different keys for dev/prod** (optional but recommended)
4. **Rotate keys if exposed** - Generate new ones if needed
5. **Check `.gitignore`** - Make sure `.env.local` is listed

---

## 📚 File Structure

```
WrenchMC/
├── .env.local          ← Your local environment variables (NOT in git)
├── .env                 ← Optional: shared defaults (can be in git, no secrets)
├── .gitignore          ← Should include .env.local
└── ...
```

---

## 💡 Pro Tips

1. **Use the same keys**: You can use the same API keys for local and production
2. **Test locally first**: Always test with `.env.local` before deploying
3. **Keep them in sync**: When you add a key to Vercel, add it to `.env.local` too
4. **Use a template**: Create `.env.example` (without real keys) as a template
5. **Documentation**: Keep notes of which keys you have and where

---

## 🎯 Quick Reference

**Local Development**: `.env.local` file in project root
**Production**: Vercel Dashboard → Settings → Environment Variables
**Both need**: Database URLs, NextAuth secrets, AI API keys
**Restart required**: After changing `.env.local`, restart `npm run dev`
**Redeploy required**: After changing Vercel env vars, redeploy app

