# 🎉 Next Steps - Getting WrenchMC Goliath Running

Your app is deployed! Now let's get it fully functional. Follow these steps in order:

## ✅ Step 1: Set Up Environment Variables on Vercel

Go to your Vercel project dashboard and add these environment variables:

### Required (Minimum to run):
1. **Database Connection Strings** (you already have these):
   - `PRISMA_DATABASE_URL` - Your Prisma Accelerate connection string
   - `POSTGRES_URL` - Your direct Postgres connection string

2. **NextAuth Secret** (for authentication):
   - `NEXTAUTH_SECRET` - Generate one: `openssl rand -base64 32`
   - `NEXTAUTH_URL` - Your production URL: `https://your-app.vercel.app`

### Optional (for full features):
3. **Google OAuth** (for Google sign-in):
   - `GOOGLE_CLIENT_ID` - From Google Cloud Console
   - `GOOGLE_CLIENT_SECRET` - From Google Cloud Console

4. **AI Features**:
   - `GROK_API_KEY` - xAI Grok API key (for AI queries)
   - `OPENAI_API_KEY` - OpenAI API key (fallback for embeddings/AI)

5. **YouTube Integration**:
   - `YOUTUBE_API_KEY` - YouTube Data API v3 key ✅ (You have this - add to Vercel)

6. **Vector Database** (for RAG):
   - `PINECONE_API_KEY` - Pinecone API key ✅ (You have this - add to Vercel)
   - `PINECONE_INDEX_NAME` - Your Pinecone index name ✅ (`wrenchmc`)
   - `PINECONE_ENVIRONMENT` - Your Pinecone environment ✅ (`us-east-1`)
   - **Embedding Provider** (choose one):
   - `HUGGINGFACE_API_KEY` - Hugging Face API key (free, 384 dims)
   - OR `OPENAI_API_KEY` - OpenAI API key (paid, 1536 dims)

### How to Add in Vercel:
1. Go to your project → **Settings** → **Environment Variables**
2. Click **"Add New"**
3. Add each variable (select **Production**, **Preview**, and **Development**)
4. Click **"Save"**
5. **Redeploy** your app (or it will auto-deploy on next push)

---

## ✅ Step 2: Run Database Migrations

Your database schema needs to be created. You have two options:

### Option A: Using Prisma Migrate (Recommended)
```bash
# In your local terminal
npm run db:migrate
```

This will:
- Create all tables in your database
- Set up relationships
- Create indexes

### Option B: Manual SQL (If migrate doesn't work)
1. Go to your Prisma Postgres dashboard in Vercel
2. Find the **"SQL Editor"** or **"Query"** tab
3. Copy the contents of `prisma/schema.prisma`
4. Convert it to SQL (or use Prisma Studio: `npm run db:studio`)

---

## ✅ Step 3: Test Your App

1. **Visit your deployed app**: `https://your-app.vercel.app`
2. **Test basic features**:
   - Homepage loads
   - Navigation works
   - Try signing in (if you set up Google OAuth)
   - Try the search page

3. **Test database connection**:
   - Go to `/database` - should load (even if empty)
   - Try submitting a spec at `/specs/new` (if logged in)

---

## ✅ Step 4: Set Up Optional Features (As Needed)

### Google OAuth Setup:
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project (or use existing)
3. Enable **Google+ API**
4. Create **OAuth 2.0 credentials**
5. Add authorized redirect URI: `https://your-app.vercel.app/api/auth/callback/google`
6. Copy Client ID and Secret to Vercel env vars

### xAI Grok API:
1. Go to [x.ai](https://x.ai) and sign up
2. Get your API key from the dashboard
3. Add `GROK_API_KEY` to Vercel env vars

### YouTube Data API:
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Enable **YouTube Data API v3**
3. Create API key
4. Add `YOUTUBE_API_KEY` to Vercel env vars

### Pinecone (for RAG):
1. Sign up at [pinecone.io](https://pinecone.io)
2. Create an index
3. Get API key and index name
4. Add to Vercel env vars

---

## ✅ Step 5: Seed Initial Data (Optional)

To populate your database with sample data:

```bash
# Run the seed script (if you have one)
npm run seed
```

Or manually add data via:
- Prisma Studio: `npm run db:studio`
- Direct SQL queries in your database dashboard

---

## 🐛 Troubleshooting

### "Database connection failed"
- ✅ Check `PRISMA_DATABASE_URL` and `POSTGRES_URL` are set correctly
- ✅ Verify database is running in Vercel dashboard
- ✅ Check connection strings match your database

### "NextAuth error"
- ✅ Ensure `NEXTAUTH_SECRET` is set (generate new one if needed)
- ✅ Check `NEXTAUTH_URL` matches your production URL
- ✅ Verify Google OAuth credentials if using Google sign-in

### "API key errors"
- ✅ Check API keys are added to Vercel environment variables
- ✅ Ensure keys are valid and have proper permissions
- ✅ Redeploy after adding new env vars

### "Prisma Client not found"
- ✅ This should be fixed now with the postinstall script
- ✅ If still happening, check build logs on Vercel

---

## 🎯 Quick Checklist

- [ ] Database connection strings added to Vercel
- [ ] `NEXTAUTH_SECRET` generated and added
- [ ] `NEXTAUTH_URL` set to production URL
- [ ] Database migrations run
- [ ] App loads without errors
- [ ] (Optional) Google OAuth set up
- [ ] (Optional) AI API keys added
- [ ] (Optional) YouTube API key added

---

## 🚀 You're Ready!

Once the basics are set up (database + NextAuth), your app should be functional. Add optional features as needed.

**Need help?** Check the detailed setup guides:
- `SETUP_GUIDE.md` - Complete platform setup instructions
- `README.md` - Project overview and features

