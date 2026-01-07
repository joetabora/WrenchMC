# Embedding Provider Setup Guide

## 🤔 Do I Need Hugging Face for Pinecone?

**Short answer: No, but you need SOME embedding provider.**

## 📊 How It Works

```
Your Database (Specs, Queries, etc.)
    ↓
Embedding Provider (Hugging Face OR OpenAI) ← Creates vectors
    ↓
Pinecone (Vector Database) ← Stores vectors
    ↓
RAG Search (Finds similar content)
```

## 🎯 What You Need

**Pinecone** = Stores vectors (you already have this set up ✅)

**Embedding Provider** = Creates vectors from text (you need ONE of these):

### Option 1: Hugging Face (Free Tier - Recommended to Start)

**Pros:**
- ✅ Free tier available
- ✅ Good for getting started
- ✅ No credit card required

**Cons:**
- ⚠️ Can be slower
- ⚠️ Rate limits on free tier
- ⚠️ Less reliable than OpenAI

**Setup:**
1. Go to [huggingface.co](https://huggingface.co)
2. Sign up (free)
3. Go to Settings → Access Tokens
4. Create new token with "Read" permissions
5. Add to `.env.local`:
   ```env
   HUGGINGFACE_API_KEY="hf_your-token-here"
   ```

**Pinecone Index Dimension:** `384` (for `all-MiniLM-L6-v2` model)

---

### Option 2: OpenAI (Paid - More Reliable)

**Pros:**
- ✅ More reliable
- ✅ Faster
- ✅ Better quality embeddings

**Cons:**
- ❌ Costs money (~$0.02 per 1M tokens)
- ❌ Requires credit card

**Setup:**
1. Go to [platform.openai.com](https://platform.openai.com)
2. Sign up / Log in
3. Go to API Keys
4. Create new secret key
5. Add to `.env.local`:
   ```env
   OPENAI_API_KEY="sk-your-key-here"
   ```

**Pinecone Index Dimension:** `1536` (for `text-embedding-3-small` model)

---

## ⚠️ Important Notes

1. **You only need ONE** - not both!
2. **Pinecone dimension must match** your embedding provider:
   - Hugging Face = 384 dimensions
   - OpenAI = 1536 dimensions
3. **If you switch providers**, you need to:
   - Create a new Pinecone index with correct dimension
   - Re-run the population script

## 🚀 Quick Setup (Choose One)

### For Free Tier (Hugging Face):
```bash
# 1. Get Hugging Face token (see above)
# 2. Add to .env.local
HUGGINGFACE_API_KEY="hf_your-token"

# 3. Make sure Pinecone index dimension is 384
# 4. Run population script
npm run populate-pinecone
```

### For Paid (OpenAI):
```bash
# 1. Get OpenAI API key (see above)
# 2. Add to .env.local
OPENAI_API_KEY="sk-your-key"

# 3. Make sure Pinecone index dimension is 1536
# 4. Run population script
npm run populate-pinecone
```

## 🔍 How to Check Your Pinecone Index Dimension

1. Go to [Pinecone Dashboard](https://app.pinecone.io)
2. Click on your index
3. Check "Dimension" field
4. Must match:
   - **384** if using Hugging Face
   - **1536** if using OpenAI

## 💡 Recommendation

**Start with Hugging Face** (free) to test:
- No cost
- Easy setup
- Good enough for testing

**Upgrade to OpenAI** if:
- You need more reliability
- You're processing lots of data
- You want better quality

## 🐛 Troubleshooting

### "No embedding provider configured"
- Add `HUGGINGFACE_API_KEY` OR `OPENAI_API_KEY` to `.env.local`
- You only need ONE, not both

### "Pinecone error: 400 Bad Request"
- Check your Pinecone index dimension matches your embedding provider
- Hugging Face = 384, OpenAI = 1536

### "Hugging Face API error"
- Check token is valid
- Check token has "Read" permissions
- Free tier has rate limits - wait and retry

### "OpenAI API error"
- Check API key is valid
- Check you have credits/billing set up
- Check rate limits

---

## 📚 Summary

- **Pinecone** = Vector storage (you have this ✅)
- **Embedding Provider** = Vector creation (you need ONE)
  - Hugging Face (free) - dimension 384
  - OpenAI (paid) - dimension 1536
- **You don't need both** - just pick one!

