# How to Populate Pinecone with Embeddings

This guide will walk you through populating your Pinecone vector database with embeddings from your WrenchMC database.

## 🎯 What This Does

The population script will:
1. Read all approved specs from your database
2. Read query history (AI answers)
3. Read forum posts
4. Convert each to a vector embedding
5. Store them in Pinecone for fast semantic search

## 📋 Prerequisites

Before running the script, ensure you have:

1. **Pinecone configured**:
   - `PINECONE_API_KEY` in `.env.local`
   - `PINECONE_INDEX_NAME` in `.env.local`
   - `PINECONE_ENVIRONMENT` in `.env.local` (e.g., `us-east-1`)

2. **Embedding provider configured** (REQUIRED - you need ONE of these):
   - `HUGGINGFACE_API_KEY` in `.env.local` (free tier available)
   - **OR** `OPENAI_API_KEY` in `.env.local` (paid, more reliable)
   - **You don't need both** - just pick one!

3. **Database connection**:
   - `PRISMA_DATABASE_URL` configured
   - Database migrations run (`npm run db:migrate`)

4. **Pinecone index created**:
   - Index must exist in Pinecone dashboard
   - Dimension must match your embedding model:
     - **Hugging Face** (`all-MiniLM-L6-v2`): **384 dimensions**
     - **OpenAI** (`text-embedding-3-small`): **1536 dimensions**

## 🚀 Step-by-Step Instructions

### Step 1: Verify Your Pinecone Index

1. Go to [Pinecone Dashboard](https://app.pinecone.io)
2. Check that your index exists
3. Note the **dimension** (must match embedding model)
4. Note the **environment** (e.g., `us-east-1`)

### Step 2: Check Environment Variables

Run this to verify your setup:

```bash
npm run setup:env
```

Or manually check `.env.local`:

```env
PINECONE_API_KEY="your-key-here"
PINECONE_INDEX_NAME="wrenchmc"
PINECONE_ENVIRONMENT="us-east-1"

# Choose ONE embedding provider:
HUGGINGFACE_API_KEY="your-hf-key"
# OR
OPENAI_API_KEY="your-openai-key"
```

### Step 3: Run the Population Script

```bash
npm run populate-pinecone
```

### Step 4: Watch the Output

You'll see progress like:

```
🚀 Starting Pinecone population...

✅ Configuration check passed

📊 Processing Specs...
   Found 25 approved specs
   ✓ Stored: Transmission cover
   ✓ Stored: Head bolt
   ...

💬 Processing Query History...
   Found 50 query history entries
   ✓ Stored query: What's the torque for...
   ...

📝 Processing Forum Posts...
   Found 10 forum posts
   ✓ Stored post: How to change oil...
   ...

==================================================
📊 Population Summary:
   Total Processed: 85
   Successfully Stored: 85
   Errors: 0
==================================================

✅ Pinecone population complete!
   85 vectors stored in Pinecone
   Your RAG system is now enhanced! 🚀
```

### Step 5: Verify in Pinecone Dashboard

1. Go to Pinecone Dashboard
2. Click on your index
3. Check the **"Vector Count"** - should match your stored count
4. You can query the index to test

## 🔧 Troubleshooting

### Error: "Pinecone not configured"

**Solution**: Add `PINECONE_API_KEY` and `PINECONE_INDEX_NAME` to `.env.local`

### Error: "No embedding provider configured"

**Solution**: Add **ONE** of these to `.env.local`:
- `HUGGINGFACE_API_KEY="your-hf-token"` (free tier, recommended to start)
- **OR** `OPENAI_API_KEY="your-openai-key"` (paid, more reliable)

**You don't need both** - just choose one embedding provider!

### Error: "Pinecone error: 400 Bad Request"

**Common causes**:
- **Dimension mismatch**: Your index dimension doesn't match embedding model
  - Fix: Check index dimension in Pinecone dashboard
  - Hugging Face = 384, OpenAI = 1536
- **Wrong environment**: `PINECONE_ENVIRONMENT` doesn't match your index
  - Fix: Check environment in Pinecone dashboard

### Error: "Pinecone error: 404 Not Found"

**Solution**: 
- Index name is incorrect
- Index doesn't exist
- Check `PINECONE_INDEX_NAME` matches your Pinecone dashboard

### Error: "Hugging Face API error" or "OpenAI API error"

**Solution**:
- Verify API key is correct
- Check API quota/limits
- For Hugging Face: Ensure token has "Read" permissions

### Script runs but stores 0 vectors

**Check**:
1. Do you have approved specs in database? (`npm run db:studio`)
2. Are embeddings being generated? (Check console for warnings)
3. Is Pinecone API key valid? (Test in Pinecone dashboard)

## 📊 What Gets Stored

### For Each Spec:
- **Text**: Component name, torque, bolt size, notes
- **Metadata**: Component name, models, years, submitted by
- **Vector ID**: `spec_{specId}`

### For Each Query:
- **Text**: Query + AI answer
- **Metadata**: Query text, user ID, timestamp
- **Vector ID**: `query_{queryId}`

### For Each Forum Post:
- **Text**: Title + content
- **Metadata**: Title, author, tags, timestamp
- **Vector ID**: `forum_{postId}`

## 🔄 Re-running the Script

The script uses **upsert**, so it's safe to run multiple times:
- Existing vectors will be **updated**
- New vectors will be **added**
- No duplicates will be created

**When to re-run**:
- After adding new approved specs
- After significant database updates
- Periodically (weekly/monthly) to keep Pinecone in sync

## 💡 Pro Tips

1. **Start Small**: Test with a few specs first
2. **Monitor Quota**: Free tier = 100K vectors
3. **Batch Processing**: Script processes in batches to avoid rate limits
4. **Incremental Updates**: Re-run after approving new specs
5. **Clean Data**: Remove duplicates before embedding

## 🎯 After Population

Once populated, your RAG system will:

✅ **Find relevant specs faster** (vector search)
✅ **Match semantically** (not just keywords)
✅ **Provide better context** to AI
✅ **Generate more accurate answers**

Test it by asking questions in `/query` - you should see better, more relevant results!

## 📚 Next Steps

1. **Test queries** - Try asking questions in `/query`
2. **Monitor usage** - Check Pinecone dashboard for query stats
3. **Set up automation** - Consider running script on a schedule
4. **Expand data** - Add more specs, tutorials, forum posts

---

**Need help?** Check the main `RAG_EXPLAINED.md` for more details on how RAG works!

