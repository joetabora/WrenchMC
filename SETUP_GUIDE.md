# WrenchMC Goliath - Complete Setup Guide

## 🚀 Quick Start Overview

This guide will walk you through setting up every platform and service needed for WrenchMC Goliath. Follow each section in order.

---

## 1. Database Setup (Choose One Option)

Vercel offers several Postgres database options. We recommend **Prisma Postgres** for the easiest setup, but **Neon** is also an excellent choice.

### Option A: Prisma Postgres (Recommended - Easiest Setup)

#### Step 1: Create Vercel Account
1. Go to [vercel.com](https://vercel.com)
2. Click **"Sign Up"** (use GitHub, GitLab, or email)
3. Complete account verification

#### Step 2: Create a New Project
1. In Vercel Dashboard, click **"Add New..."** → **"Project"**
2. Import your GitHub repository (or create a new one)
3. Click **"Skip"** on framework configuration (we'll configure later)

#### Step 3: Create Prisma Postgres Database
1. In Vercel Dashboard, go to **"Storage"** tab (left sidebar)
2. Click **"Create Database"**
3. In the marketplace, find and select **"Prisma Postgres"** (or search for it)
4. Click **"Create"** or **"Add Integration"**
5. Choose a name (e.g., `wrenchmc-db`)
6. Select a region (choose closest to your users)
7. Click **"Create"** or **"Provision"**

#### Step 4: Get Connection Strings
1. Once database is created, click on it
2. Look for **"Connection Strings"** or **".env.local"** tab
3. You'll see three connection strings - copy them:
   - **`PRISMA_DATABASE_URL`** - Prisma Accelerate connection (pooled, for Prisma Client)
   - **`POSTGRES_URL`** or **`DATABASE_URL`** - Direct connection (for migrations)
   - Both direct connection strings are the same, use either one

4. Copy all strings - you'll add them to your `.env.local` file

**Note:** Prisma Postgres uses Prisma Accelerate for connection pooling, which is why you see `PRISMA_DATABASE_URL` with a special format (`prisma+postgres://...`).

---

### Option B: Neon (Serverless Postgres - Alternative)

#### Step 1: Create Database via Vercel
1. In Vercel Dashboard, go to **"Storage"** tab
2. Click **"Create Database"**
3. Select **"Neon"** from the marketplace
4. Click **"Add Integration"** or **"Create"**
5. You may need to authorize Neon (first time only)
6. Choose a name and region
7. Click **"Create Database"**

#### Step 2: Get Connection Strings
1. Click on your Neon database
2. Go to **"Settings"** or **"Connection Details"**
3. Copy the connection strings:
   - **`POSTGRES_PRISMA_URL`** - Use the connection string with `?pgbouncer=true` appended
   - **`POSTGRES_URL_NON_POOLING`** - Use the direct connection string (without pooling)

**Note:** Neon provides serverless Postgres with automatic scaling.

---

### Option C: Supabase (If You Prefer)

#### Step 1: Create Database via Vercel
1. In Vercel Dashboard, go to **"Storage"** tab
2. Click **"Create Database"**
3. Select **"Supabase"** from the marketplace
4. Click **"Add Integration"**
5. Authorize Supabase if needed
6. Create a new project or link existing one
7. Choose a name and region

#### Step 2: Get Connection Strings
1. In Supabase dashboard, go to **"Settings"** → **"Database"**
2. Find **"Connection string"** section
3. Copy:
   - **`POSTGRES_PRISMA_URL`** - Use "Connection pooling" → "Session" mode connection string
   - **`POSTGRES_URL_NON_POOLING`** - Use "Connection string" (direct connection)

**Note:** Supabase includes additional features like auth and storage, but we're only using Postgres.

### Step 5: Initialize Database Schema (All Options)

1. In your project root, create `.env.local` file:
   ```bash
   touch .env.local
   ```

2. Add the connection strings you copied:

   **For Prisma Postgres:**
   ```env
   PRISMA_DATABASE_URL="prisma+postgres://accelerate.prisma-data.net/?api_key=..."
   POSTGRES_URL="postgres://user:pass@db.prisma.io:5432/postgres?sslmode=require"
   POSTGRES_URL_NON_POOLING="postgres://user:pass@db.prisma.io:5432/postgres?sslmode=require"
   ```
   - Use `PRISMA_DATABASE_URL` for Prisma Client (pooled connection)
   - Use `POSTGRES_URL` or `POSTGRES_URL_NON_POOLING` for migrations (both are the same)

   **For Neon:**
   ```env
   POSTGRES_PRISMA_URL="postgresql://user:pass@host:5432/db?pgbouncer=true"
   POSTGRES_URL_NON_POOLING="postgresql://user:pass@host:5432/db"
   ```
   - Add `?pgbouncer=true` to the pooled URL if not present

   **For Supabase:**
   ```env
   POSTGRES_PRISMA_URL="postgresql://user:pass@host:5432/db?pgbouncer=true"
   POSTGRES_URL_NON_POOLING="postgresql://user:pass@host:5432/db"
   ```
   - Use the "Session" mode connection string for pooled URL

3. Run Prisma commands:
   ```bash
   # Generate Prisma Client
   npm run db:generate

   # Create and run migrations
   npm run db:migrate
   ```

4. Verify it worked:
   ```bash
   # Open Prisma Studio to see your database
   npm run db:studio
   ```
   - This opens a browser at `http://localhost:5555`
   - You should see empty tables (User, Spec, Tutorial, etc.)

**Troubleshooting Connection:**
- If migrations fail, try using `POSTGRES_URL_NON_POOLING` for migrations
- Ensure connection strings don't have extra spaces or quotes
- For Neon: Make sure you're using the correct connection string format

---

## 2. xAI Grok API Setup (REQUIRED for AI Queries)

### Step 1: Sign Up for xAI
1. Go to [x.ai](https://x.ai)
2. Click **"Sign Up"** or **"Get Started"**
3. Sign up with your email or X (Twitter) account
4. Verify your email if required

### Step 2: Access API Dashboard
1. Once logged in, look for **"API"** or **"Developers"** section
2. Navigate to **"API Keys"** or **"Developer Portal"**
3. If you don't see it, check:
   - Your account may need approval (wait for email)
   - Look for "Developers" in the main navigation

### Step 3: Create API Key
1. Click **"Create API Key"** or **"Generate New Key"**
2. Give it a name (e.g., "WrenchMC Production")
3. Copy the key immediately (you won't see it again!)
4. Save it securely

### Step 4: Add to Environment Variables
Add to your `.env.local`:
```env
XAI_API_KEY="xai-your-actual-api-key-here"
```

### Step 5: Test the API
1. Check your API quota/limits in the dashboard
2. Note: Free tier may have rate limits
3. The app will use this for all AI-powered queries

**Troubleshooting:**
- If you can't find the API section, xAI may still be in beta - check their documentation
- API keys typically start with `xai-`
- Make sure you're on the correct xAI platform (not X/Twitter)

---

## 3. YouTube Data API Setup (REQUIRED for Tutorials)

### Step 1: Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Sign in with your Google account
3. Click the project dropdown (top left)
4. Click **"New Project"**
5. Enter project name: `WrenchMC` (or any name)
6. Click **"Create"**
7. Wait for project creation (10-30 seconds)

### Step 2: Enable YouTube Data API
1. In your new project, go to **"APIs & Services"** → **"Library"** (left sidebar)
2. Search for **"YouTube Data API v3"**
3. Click on it
4. Click **"Enable"**
5. Wait for it to enable (5-10 seconds)

### Step 3: Create API Credentials
1. Go to **"APIs & Services"** → **"Credentials"** (left sidebar)
2. Click **"+ CREATE CREDENTIALS"** (top)
3. Select **"API Key"**
4. A popup will show your API key - **copy it immediately**
5. Click **"Restrict Key"** (recommended for security)

### Step 4: Restrict API Key (Recommended)
1. Under **"API restrictions"**, select **"Restrict key"**
2. Choose **"YouTube Data API v3"** from the list
3. Click **"Save"**

### Step 5: Set Up Billing (Required for Production)
1. Go to **"Billing"** in left sidebar
2. Click **"Link a billing account"**
3. Add a payment method (Google gives $300 free credit for new accounts)
4. Note: YouTube Data API has generous free tier (10,000 units/day)

### Step 6: Add to Environment Variables
Add to your `.env.local`:
```env
YOUTUBE_API_KEY="AIzaSyYourActualAPIKeyHere"
```

### Step 7: Test the API
You can test in browser:
```
https://www.googleapis.com/youtube/v3/search?part=snippet&q=harley+davidson&key=YOUR_API_KEY
```

**Troubleshooting:**
- API key format: Starts with `AIzaSy`
- Quota: Default is 10,000 units/day (1 search = 100 units)
- If you hit quota, wait 24 hours or request increase

---

## 4. ElevenLabs API Setup (Optional - Enhanced Voice Quality)

ElevenLabs provides high-quality, natural-sounding text-to-speech that makes voice responses sound much better than the default browser TTS.

### Step 1: Create Account
1. Go to [elevenlabs.io](https://elevenlabs.io)
2. Click **"Sign Up"** (top right)
3. Sign up with email or Google
4. Verify your email

### Step 2: Get API Key
1. Once logged in, click your profile icon (top right)
2. Go to **"Profile"** → **"API Keys"** (or go to [elevenlabs.io/app/settings/api-keys](https://elevenlabs.io/app/settings/api-keys))
3. Click **"Create API Key"**
4. Give it a name: `WrenchMC Production`

### Step 2a: Configure API Key Permissions
When creating the API key, you'll see permission options. Set these for security:

**Required:**
- **Text to Speech**: **Access** ✅ (This is the main feature we need)

**Optional but Recommended:**
- **Voices**: **Read** ✅ (Allows browsing available voices)
- **Models**: **Read** ✅ (Helps verify available models)

**Everything Else**: **No Access** ❌
- Speech to Speech: No Access
- Speech to Text: No Access
- Sound Effects: No Access
- Audio Isolation: No Access
- Music Generation: No Access
- Dubbing: No Access
- ElevenLabs Agents: No Access
- Projects: No Access
- Audio Native: No Access
- Voice Generation: No Access
- Forced Alignment: No Access
- History: No Access
- Pronunciation Dictionaries: No Access
- User: No Access
- Workspace: No Access

**Note:** The app will work with just "Text to Speech: Access" - everything else is optional for security.

5. After setting permissions, copy the key (starts with a long alphanumeric string)
6. **Save it immediately** - you can view it again but be careful

### Step 3: Choose a Voice (Optional)
1. Go to **"Voice Library"** in your dashboard
2. Browse available voices (Rachel is the default, but you can choose any)
3. Click on a voice you like
4. Copy the **Voice ID** (visible in the URL or voice details)
5. Popular voices:
   - **Rachel** (ID: `21m00Tcm4TlvDq8ikWAM`) - Default, friendly female
   - **Adam** (ID: `pNInz6obpgDQGcFmaJgB`) - Professional male
   - **Antoni** (ID: `ErXwobaYiN019PkySvjV`) - Clear male voice
   - Or create your own custom voice!

### Step 4: Choose a Model (Optional)
- **`eleven_turbo_v2_5`** (Default) - Fast, low latency, good quality
- **`eleven_multilingual_v2`** - Supports multiple languages
- **`eleven_monolingual_v1`** - Highest quality, English only

### Step 5: Add to Environment Variables
Add to your `.env.local`:
```env
# ElevenLabs API (Optional - for enhanced voice quality)
ELEVENLABS_API_KEY="your-api-key-here"
ELEVENLABS_VOICE_ID="21m00Tcm4TlvDq8ikWAM"  # Optional: defaults to Rachel
ELEVENLABS_MODEL_ID="eleven_turbo_v2_5"    # Optional: defaults to turbo
```

**For Vercel Production:**
1. Go to Vercel Dashboard → Settings → Environment Variables
2. Add the same variables
3. Redeploy after adding

**Note:** 
- ElevenLabs has a free tier (10,000 characters/month)
- Paid plans start at $5/month with more characters
- The app automatically falls back to Web Speech API if ElevenLabs fails or isn't configured
- Voice quality is significantly better with ElevenLabs!

---

## 5. Google OAuth Setup (Optional but Recommended)

### Step 1: Create OAuth 2.0 Credentials
1. In Google Cloud Console (same project as YouTube API)
2. Go to **"APIs & Services"** → **"Credentials"**
3. Click **"+ CREATE CREDENTIALS"**
4. Select **"OAuth client ID"**
5. If prompted, configure OAuth consent screen first (see Step 2)

### Step 2: Configure OAuth Consent Screen
1. Go to **"APIs & Services"** → **"OAuth consent screen"**
2. Select **"External"** (unless you have Google Workspace)
3. Click **"Create"**
4. Fill in required fields:
   - **App name**: `WrenchMC Goliath`
   - **User support email**: Your email
   - **Developer contact**: Your email
5. Click **"Save and Continue"**
6. Skip "Scopes" (click "Save and Continue")
7. Add test users if needed (click "Save and Continue")
8. Review and go back to credentials

### Step 3: Create OAuth Client
1. Back in **"Credentials"** → **"+ CREATE CREDENTIALS"** → **"OAuth client ID"**
2. Application type: **"Web application"**
3. Name: `WrenchMC Web Client`
4. **Authorized JavaScript origins**:
   - `http://localhost:3000` (for development)
   - `https://yourdomain.vercel.app` (for production)
5. **Authorized redirect URIs**:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://yourdomain.vercel.app/api/auth/callback/google` (production)
6. Click **"Create"**
7. Copy the **Client ID** and **Client Secret**

### Step 4: Add to Environment Variables
Add to your `.env.local`:
```env
GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-client-secret"
```

**Troubleshooting:**
- Client ID format: Ends with `.apps.googleusercontent.com`
- Redirect URIs must match exactly (including http/https)
- For production, add your Vercel domain after deployment

---

## 6. NextAuth Secret Setup

### Step 1: Generate Secret
Run this command in your terminal:
```bash
openssl rand -base64 32
```

### Step 2: Copy the Output
You'll get something like: `aBc123XyZ456...` (32+ characters)

### Step 3: Add to Environment Variables
Add to your `.env.local`:
```env
NEXTAUTH_SECRET="paste-your-generated-secret-here"
NEXTAUTH_URL="http://localhost:3000"
```

**For Production:**
- Update `NEXTAUTH_URL` to your Vercel domain: `https://yourdomain.vercel.app`
- Use the same secret (or generate a new one for production)

---

## 7. Pinecone Setup (Optional - for Vector Storage/RAG)

### Step 1: Sign Up
1. Go to [pinecone.io](https://www.pinecone.io)
2. Click **"Get Started"** or **"Sign Up"**
3. Sign up with email or Google
4. Verify your email

### Step 2: Create Index
1. Once logged in, you'll see the dashboard
2. Click **"Create Index"**
3. Configure:
   - **Index name**: `wrenchmc` (lowercase, no spaces)
   - **Dimensions**: `384` (for sentence-transformers/all-MiniLM-L6-v2)
   - **Metric**: `cosine`
   - **Pod type**: `s1.x1` (free tier) or `p1.x1` (paid)
4. Click **"Create Index"**
5. Wait for index creation (1-2 minutes)

### Step 3: Get API Key
1. Go to **"API Keys"** in left sidebar
2. Click **"Create API Key"**
3. Give it a name: `WrenchMC Production`
4. Copy the key (starts with `pc-`)

### Step 4: Get Environment
1. In your index details, note the **"Environment"** (e.g., `us-east-1-aws`)
2. Also note the **"Index Name"** (e.g., `wrenchmc`)

### Step 5: Add to Environment Variables
Add to your `.env.local`:
```env
PINECONE_API_KEY="pc-your-actual-api-key"
PINECONE_INDEX_NAME="wrenchmc"
PINECONE_ENVIRONMENT="us-east-1-aws"  # Your actual environment
```

**Troubleshooting:**
- Free tier: Limited to 1 index, 100K vectors
- Dimensions must match your embedding model (384 for MiniLM)
- Index name is case-sensitive

---

## 8. Hugging Face Setup (Optional - for Free Embeddings)

### Step 1: Create Account
1. Go to [huggingface.co](https://huggingface.co)
2. Click **"Sign Up"**
3. Sign up with email or GitHub
4. Verify your email

### Step 2: Create Access Token
1. Click your profile icon (top right)
2. Go to **"Settings"** → **"Access Tokens"**
3. Click **"New token"**
4. Name: `WrenchMC`
5. Type: **"Read"** (sufficient for inference)
6. Click **"Generate token"**
7. Copy the token (starts with `hf_`)

### Step 3: Add to Environment Variables
Add to your `.env.local`:
```env
HUGGINGFACE_API_KEY="hf_your-actual-token-here"
```

**Note:** Hugging Face is free but has rate limits. The app will fall back to OpenAI if needed.

---

## 9. OpenAI Setup (Optional - Fallback for Embeddings)

### Step 1: Create Account
1. Go to [platform.openai.com](https://platform.openai.com)
2. Click **"Sign Up"**
3. Sign up with email or Google
4. Verify your email and phone

### Step 2: Add Payment Method
1. Go to **"Settings"** → **"Billing"**
2. Add a payment method (required for API access)
3. Set usage limits if desired

### Step 3: Create API Key
1. Go to **"API Keys"** in left sidebar
2. Click **"+ Create new secret key"**
3. Name: `WrenchMC Production`
4. Copy the key (starts with `sk-`)
5. **Save it immediately** (you won't see it again)

### Step 4: Add to Environment Variables
Add to your `.env.local`:
```env
OPENAI_API_KEY="sk-your-actual-api-key-here"
```

**Note:** OpenAI charges per token. Used as fallback if Hugging Face fails.

---

## 10. Complete .env.local File

Your final `.env.local` should look like this:

# Database (Choose one: Prisma Postgres, Neon, or Supabase) - REQUIRED
POSTGRES_PRISMA_URL="postgresql://user:pass@host:5432/db?pgbouncer=true"
POSTGRES_URL_NON_POOLING="postgresql://user:pass@host:5432/db"

# NextAuth - REQUIRED
NEXTAUTH_SECRET="your-generated-secret-here"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth - OPTIONAL (but recommended)
GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-client-secret"

# xAI Grok API - REQUIRED for AI queries
XAI_API_KEY="xai-your-api-key"

# YouTube Data API - REQUIRED for tutorials
YOUTUBE_API_KEY="AIzaSyYourAPIKey"

# ElevenLabs API - OPTIONAL (for enhanced voice quality)
ELEVENLABS_API_KEY="your-elevenlabs-api-key"
ELEVENLABS_VOICE_ID="21m00Tcm4TlvDq8ikWAM"  # Optional: defaults to Rachel
ELEVENLABS_MODEL_ID="eleven_turbo_v2_5"    # Optional: defaults to turbo

# Pinecone - OPTIONAL (for better RAG performance)
PINECONE_API_KEY="pc-your-api-key"
PINECONE_INDEX_NAME="wrenchmc"
PINECONE_ENVIRONMENT="us-east-1-aws"

# Hugging Face - OPTIONAL (free embeddings)
HUGGINGFACE_API_KEY="hf_your-token"

# OpenAI - OPTIONAL (fallback embeddings)
OPENAI_API_KEY="sk-your-api-key"
```

---

## 11. Final Setup Steps

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Generate Prisma Client
```bash
npm run db:generate
```

### Step 3: Run Database Migrations
```bash
npm run db:migrate
```

### Step 4: Start Development Server
```bash
npm run dev
```

### Step 5: Verify Everything Works
1. Open `http://localhost:3000`
2. Try signing up/in
3. Try an AI query: "Torque specs for transmission cover on 2005 Road King"
4. Check tutorials page loads videos
5. Check database browser shows empty (no specs yet)

---

## 🚨 Troubleshooting Common Issues

### Database Connection Fails
- **Problem**: `Can't reach database server` or `Connection refused`
- **Solution**: 
  - Verify connection strings are correct (copied from database dashboard)
  - **For Prisma Postgres**: 
    - Use `PRISMA_DATABASE_URL` for Prisma Client (not `POSTGRES_PRISMA_URL`)
    - Use `POSTGRES_URL` for migrations (direct connection)
    - Ensure Prisma schema uses `PRISMA_DATABASE_URL` in `url` field
  - **For Neon**: 
    - Check `POSTGRES_PRISMA_URL` has `?pgbouncer=true` (for pooled connections)
    - Check that database is not paused (Neon pauses inactive databases)
  - **For Supabase**: 
    - Verify project is active and not suspended
    - Use "Session" mode connection string for pooled URL
  - Try using direct connection (`POSTGRES_URL` or `POSTGRES_URL_NON_POOLING`) for migrations if pooled connection fails

### AI Queries Return Errors
- **Problem**: `XAI_API_KEY not configured` or `401 Unauthorized`
- **Solution**:
  - Verify `XAI_API_KEY` is in `.env.local`
  - Check API key is correct (starts with `xai-`)
  - Verify API quota hasn't been exceeded

### YouTube Videos Don't Load
- **Problem**: `YouTube API error` or no videos show
- **Solution**:
  - Verify `YOUTUBE_API_KEY` is correct
  - Check API quota in Google Cloud Console
  - Ensure YouTube Data API v3 is enabled

### Authentication Doesn't Work
- **Problem**: Can't sign in or OAuth fails
- **Solution**:
  - Verify `NEXTAUTH_SECRET` is set
  - Check `NEXTAUTH_URL` matches your domain
  - For OAuth: Verify redirect URIs match exactly
  - Check browser console for errors

### Prisma Migrations Fail
- **Problem**: `Migration failed` or `Can't connect`
- **Solution**:
  - Use `POSTGRES_URL_NON_POOLING` for migrations (not pooled URL)
  - Ensure database exists in Vercel
  - Try: `npx prisma migrate reset` (WARNING: deletes all data)

---

## 📚 Next Steps After Setup

1. **Seed Database**: Add some test specs manually or run PDF parser
2. **Deploy to Vercel**: Push to GitHub and deploy
3. **Update Production URLs**: Add production domain to OAuth redirect URIs
4. **Monitor Usage**: Check API quotas and database usage
5. **Add More Data**: Use PDF parser or manual entry to populate specs

---

## 🆘 Need Help?

- Check the main [README.md](./README.md) for more details
- Review error messages in browser console and terminal
- Check Vercel logs for deployment issues
- Open an issue on GitHub with error details

---

**You're all set! 🎉** Your WrenchMC Goliath is ready to help Harley mechanics find specs faster than ever!
