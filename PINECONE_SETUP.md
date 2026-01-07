# Pinecone Vector Database Setup Guide

This guide will help you set up Pinecone for vector embeddings and RAG (Retrieval Augmented Generation) in WrenchMC Goliath.

## 🎯 What Pinecone Provides

- **Vector Storage**: Store embeddings of specs, manuals, and documentation
- **Semantic Search**: Find similar content based on meaning, not just keywords
- **RAG Enhancement**: Improve AI query accuracy by retrieving relevant context
- **Fast Similarity Search**: Find related specs and content instantly

---

## Step 1: Create Pinecone Account

1. **Sign Up for Pinecone**
   - Visit [https://www.pinecone.io/](https://www.pinecone.io/)
   - Click **"Get Started"** or **"Sign Up"**
   - Sign up with email or Google account
   - Verify your email if required

2. **Choose a Plan**
   - **Free Tier**: 1 index, 100K vectors, perfect for getting started
   - **Starter Plan**: $70/month for more capacity
   - For WrenchMC, the free tier is usually sufficient to start

---

## Step 2: Create Your First Index

1. **Go to Pinecone Dashboard**
   - After signing up, you'll be in the Pinecone dashboard
   - Click **"Create Index"** or **"Indexes"** → **"Create Index"**

2. **Configure Index Settings**
   - **Index Name**: `wrenchmc` (or your choice - lowercase, no spaces)
   - **Dimensions**: `384` (for `all-MiniLM-L6-v2` model) or `1536` (for OpenAI embeddings)
     - **Note**: Use `384` if using Hugging Face embeddings (default)
     - Use `1536` if using OpenAI embeddings
   - **Metric**: `cosine` (recommended for text similarity)
   - **Cloud Provider**: Choose AWS, GCP, or Azure (closest to your users)
   - **Region**: Choose closest to your Vercel deployment (e.g., `us-east-1`)

3. **Create the Index**
   - Click **"Create Index"**
   - Wait for index creation (usually 1-2 minutes)

---

## Step 3: Get Your API Key

1. **Navigate to API Keys**
   - In Pinecone dashboard, go to **"API Keys"** (left sidebar)
   - Or click on your index → **"API Keys"** tab

2. **Create API Key**
   - Click **"Create API Key"**
   - Give it a name: `WrenchMC Production` (or your choice)
   - Click **"Create Key"**

3. **Copy Your Credentials**
   - **API Key**: Copy this immediately (looks like: `abc123-def456-...`)
   - **Index Name**: Your index name (e.g., `wrenchmc`)
   - **Environment**: Your cloud region (e.g., `us-east-1`)
   - **Note**: The environment is the region you selected when creating the index

---

## Step 4: Add Environment Variables to Vercel

1. **Go to Vercel Dashboard**
   - Visit [https://vercel.com/dashboard](https://vercel.com/dashboard)
   - Select your WrenchMC project

2. **Add Environment Variables**
   - Go to **Settings** → **Environment Variables**
   - Click **"Add New"** for each:

   **Variable 1:**
   - **Name**: `PINECONE_API_KEY`
   - **Value**: Your Pinecone API key
   - **Environment**: Production, Preview, Development

   **Variable 2:**
   - **Name**: `PINECONE_INDEX_NAME`
   - **Value**: Your index name (e.g., `wrenchmc`)
   - **Environment**: Production, Preview, Development

   **Variable 3:**
   - **Name**: `PINECONE_ENVIRONMENT`
   - **Value**: Your environment/region (e.g., `us-east-1`)
   - **Environment**: Production, Preview, Development
   - **Note**: This is optional - defaults to `us-east-1` if not set

3. **Save and Redeploy**
   - Click **"Save"** for each variable
   - Redeploy your app (or it will auto-deploy on next push)

---

## Step 5: Configure Embeddings (Choose One)

Pinecone needs embeddings to store. You have two options:

### Option A: Hugging Face (Free, Recommended)

1. **Get Hugging Face API Key**
   - Visit [https://huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)
   - Click **"New token"**
   - Name it: `WrenchMC`
   - Select **"Read"** permissions
   - Copy the token

2. **Add to Vercel**
   - **Name**: `HUGGINGFACE_API_KEY`
   - **Value**: Your Hugging Face token
   - **Note**: Make sure your Pinecone index uses **384 dimensions** for this model

### Option B: OpenAI (More Reliable, Costs Money)

1. **Get OpenAI API Key**
   - Visit [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
   - Create a new API key
   - Copy it

2. **Add to Vercel**
   - **Name**: `OPENAI_API_KEY`
   - **Value**: Your OpenAI API key
   - **Note**: Make sure your Pinecone index uses **1536 dimensions** for OpenAI embeddings

---

## Step 6: Test Pinecone Integration

1. **Visit Your App**
   - Go to `https://your-app.vercel.app/query`
   - Ask a question: "What's the torque spec for a transmission cover?"

2. **Check Logs**
   - The app will automatically:
     - Generate embeddings for your query
     - Search Pinecone for similar content
     - Use results to enhance AI responses

3. **Verify It's Working**
   - Check Vercel function logs for Pinecone queries
   - If working, you'll see relevant context in AI responses
   - If not configured, the app will work but without RAG enhancement

---

## Step 7: Populate Your Index (Optional)

To get the most out of Pinecone, you should populate it with your existing data:

1. **Create a Script** (optional)
   - The app will automatically store embeddings when:
     - New specs are submitted
     - Manuals are imported
     - Content is added to the database

2. **Manual Population** (if needed)
   - You can create a script to backfill existing data
   - This is optional - the app works without it

---

## 🐛 Troubleshooting

### "Pinecone not configured, skipping vector storage"
**Problem**: Environment variables not set

**Solution**:
- Verify all three variables are set in Vercel:
  - `PINECONE_API_KEY`
  - `PINECONE_INDEX_NAME`
  - `PINECONE_ENVIRONMENT` (optional)
- Redeploy after adding variables

### "Pinecone error: 404 Not Found"
**Problem**: Index name or environment incorrect

**Solution**:
- Check `PINECONE_INDEX_NAME` matches your index name exactly
- Verify `PINECONE_ENVIRONMENT` matches your index region
- Check index exists in Pinecone dashboard

### "Pinecone error: 401 Unauthorized"
**Problem**: Invalid API key

**Solution**:
- Verify `PINECONE_API_KEY` is correct
- Check API key hasn't been revoked
- Create a new API key if needed

### "Dimension mismatch" Error
**Problem**: Embedding dimensions don't match index

**Solution**:
- **Hugging Face**: Index must be **384 dimensions**
- **OpenAI**: Index must be **1536 dimensions**
- Delete and recreate index with correct dimensions if needed

### No Results from Pinecone Search
**Problem**: Index is empty or query failed

**Solution**:
- Check if index has vectors (Pinecone dashboard → Index → View vectors)
- Verify embeddings are being generated (check logs)
- Test API key directly with Pinecone API

---

## 📊 Understanding Dimensions

### Embedding Dimensions:
- **Hugging Face (`all-MiniLM-L6-v2`)**: 384 dimensions
- **OpenAI (`text-embedding-3-small`)**: 1536 dimensions
- **OpenAI (`text-embedding-3-large`)**: 3072 dimensions

**Important**: Your Pinecone index dimensions must match your embedding model dimensions!

---

## 🔒 Security Best Practices

1. **Never Commit API Keys**
   - Keep keys in `.env.local` (local) and Vercel (production)
   - Never commit to git
   - Rotate keys if exposed

2. **Restrict API Key Access**
   - Pinecone API keys are scoped to your account
   - Use different keys for dev/prod if needed
   - Monitor usage in Pinecone dashboard

3. **Monitor Usage**
   - Check Pinecone dashboard for usage stats
   - Set up alerts for quota limits
   - Free tier: 100K vectors, 1 index

---

## 💰 Pricing & Limits

### Free Tier:
- **1 Index**
- **100,000 Vectors**
- **No credit card required**
- Perfect for getting started

### Paid Plans:
- **Starter**: $70/month - 1M vectors, 2 indexes
- **Standard**: $140/month - 5M vectors, 5 indexes
- Check [Pinecone Pricing](https://www.pinecone.io/pricing/) for current rates

---

## 🎯 How RAG Works in WrenchMC

1. **User asks a question** (e.g., "Torque for transmission cover")
2. **Query is embedded** (converted to vector)
3. **Pinecone searches** for similar vectors in your database
4. **Top results retrieved** (most relevant specs/manuals)
5. **AI uses context** to generate accurate answer
6. **Answer includes sources** (cited from your database)

This makes AI responses much more accurate and grounded in your actual data!

---

## ✅ Checklist

- [ ] Pinecone account created
- [ ] Index created with correct dimensions (384 for HF, 1536 for OpenAI)
- [ ] API key created and copied
- [ ] `PINECONE_API_KEY` added to Vercel
- [ ] `PINECONE_INDEX_NAME` added to Vercel
- [ ] `PINECONE_ENVIRONMENT` added to Vercel (optional)
- [ ] Embedding API key added (Hugging Face or OpenAI)
- [ ] App redeployed
- [ ] Tested query with RAG enhancement
- [ ] Verified vectors are being stored

---

## 📚 Additional Resources

- [Pinecone Documentation](https://docs.pinecone.io/)
- [Pinecone Quickstart](https://docs.pinecone.io/guides/get-started/quickstart)
- [Vector Embeddings Guide](https://www.pinecone.io/learn/vector-embeddings/)
- [Pinecone Dashboard](https://app.pinecone.io/)

---

## 💡 Tips

1. **Start with Free Tier**: Perfect for testing and small-scale use
2. **Use Hugging Face**: Free embeddings work great for most use cases
3. **Monitor Usage**: Check Pinecone dashboard regularly
4. **Index Dimensions**: Double-check dimensions match your embedding model
5. **Region Selection**: Choose region closest to your Vercel deployment

---

## Quick Reference

**Required Environment Variables**:
- `PINECONE_API_KEY` - Your Pinecone API key
- `PINECONE_INDEX_NAME` - Your index name (e.g., `wrenchmc`)
- `PINECONE_ENVIRONMENT` - Your region (e.g., `us-east-1`) - optional

**Embedding Options**:
- `HUGGINGFACE_API_KEY` - For free embeddings (384 dims)
- `OPENAI_API_KEY` - For paid embeddings (1536 dims)

**Index Dimensions**:
- Hugging Face: **384**
- OpenAI: **1536**

**Where to Get**:
- API Key: Pinecone Dashboard → API Keys
- Index Name: Your index name in Pinecone
- Environment: Your index region (shown in index settings)

