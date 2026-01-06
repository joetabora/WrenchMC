# WrenchMC Goliath - Setup Guide

## 🚀 Quick Start

### 1. Environment Variables

Create `.env.local` with these required variables:

```env
# Database (Vercel Postgres)
POSTGRES_PRISMA_URL="postgresql://user:password@host:5432/db?pgbouncer=true"
POSTGRES_URL_NON_POOLING="postgresql://user:password@host:5432/db"

# NextAuth
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth (optional but recommended)
GOOGLE_CLIENT_ID="your-client-id"
GOOGLE_CLIENT_SECRET="your-client-secret"

# xAI Grok API (REQUIRED for AI queries)
XAI_API_KEY="your-xai-api-key"

# YouTube Data API (REQUIRED for tutorials)
YOUTUBE_API_KEY="your-youtube-api-key"

# Optional: Vector Storage (for RAG)
PINECONE_API_KEY="your-pinecone-key"
PINECONE_INDEX_NAME="wrenchmc"
PINECONE_ENVIRONMENT="us-east-1"

# Optional: Embeddings (Hugging Face or OpenAI)
HUGGINGFACE_API_KEY="your-hf-key"
OPENAI_API_KEY="your-openai-key"  # Fallback if HF fails
```

### 2. Set Up Vercel Postgres

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Create a new Postgres database
3. Copy the connection strings to `.env.local`

### 3. Initialize Database

```bash
# Generate Prisma Client
npm run db:generate

# Run migrations
npm run db:migrate

# (Optional) Open Prisma Studio to view data
npm run db:studio
```

### 4. Get API Keys

#### xAI Grok API
1. Sign up at [x.ai](https://x.ai)
2. Get your API key from the dashboard
3. Add to `.env.local` as `XAI_API_KEY`

#### YouTube Data API
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Enable YouTube Data API v3
4. Create credentials (API Key)
5. Add to `.env.local` as `YOUTUBE_API_KEY`

#### Google OAuth (Optional)
1. In Google Cloud Console, create OAuth 2.0 credentials
2. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
3. Add to `.env.local`

### 5. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` 🎉

## 📝 Migration from Supabase

If you're migrating from the old Supabase setup:

1. **Export existing data** from Supabase:
   ```sql
   -- Export specs
   COPY (SELECT * FROM specs) TO '/tmp/specs.csv' CSV HEADER;
   ```

2. **Import to Vercel Postgres** using Prisma:
   ```bash
   # Use Prisma Studio or write a migration script
   npm run db:studio
   ```

3. **Update authentication**: Users will need to sign up again (or migrate user data)

## 🔧 Troubleshooting

### Database Connection Issues
- Verify `POSTGRES_PRISMA_URL` uses `?pgbouncer=true`
- Verify `POSTGRES_URL_NON_POOLING` is the direct connection
- Check Vercel dashboard for correct connection strings

### AI Queries Not Working
- Verify `XAI_API_KEY` is set correctly
- Check API quota/limits
- Review error logs in browser console

### YouTube Videos Not Loading
- Verify `YOUTUBE_API_KEY` is valid
- Check API quota (default: 10,000 units/day)
- Ensure YouTube Data API v3 is enabled

### Authentication Issues
- Generate new `NEXTAUTH_SECRET`: `openssl rand -base64 32`
- Verify `NEXTAUTH_URL` matches your domain
- Check OAuth redirect URIs match exactly

## 🎯 Next Steps

1. **Seed Database**: Run PDF parsing script or manually add specs
2. **Configure Vector Storage**: Set up Pinecone for better RAG performance
3. **Customize Branding**: Update colors, logos, and content
4. **Add More Data Sources**: Update `scripts/parse-pdfs.ts` with real PDF URLs
5. **Deploy to Vercel**: Push to GitHub and deploy!

## 📚 Additional Resources

- [Prisma Docs](https://www.prisma.io/docs)
- [NextAuth.js Docs](https://next-auth.js.org)
- [xAI Grok API](https://docs.x.ai)
- [YouTube Data API](https://developers.google.com/youtube/v3)
- [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)

---

**Need help?** Open an issue on GitHub or check the main README.md

