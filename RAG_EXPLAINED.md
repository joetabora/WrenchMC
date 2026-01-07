# What is RAG? (Retrieval Augmented Generation)

## 🎯 Simple Explanation

**RAG** stands for **Retrieval Augmented Generation**. It's a technique that makes AI answers more accurate by:

1. **Searching your database** for relevant information
2. **Giving that context to the AI** along with the user's question
3. **AI generates answer** based on YOUR data, not just general knowledge

## 🔄 How RAG Works in WrenchMC

### Without RAG (Basic AI):
```
User: "What's the torque for transmission cover on 2005 Road King?"
AI: [Uses general knowledge, might be wrong or generic]
```

### With RAG (Enhanced):
```
User: "What's the torque for transmission cover on 2005 Road King?"

Step 1: Search your database
  → Finds: "Transmission cover: 20-25 Nm, M8 bolt, 2005 Road King"

Step 2: Give context to AI
  → AI sees: "Based on your database: Transmission cover: 20-25 Nm..."

Step 3: AI generates answer
  → "According to your database, the transmission cover on a 2005 Road King 
     requires 20-25 Nm of torque using M8 bolts..."
```

## 🧠 Why RAG is Better

- **More Accurate**: Uses YOUR actual data, not generic info
- **Cites Sources**: Can reference where info came from
- **Up-to-Date**: Reflects your latest database entries
- **Context-Aware**: Understands your specific use case

## 📊 The Process

```
User Query
    ↓
Convert to Vector (Embedding)
    ↓
Search Pinecone (Vector Database)
    ↓
Find Similar Content (Semantic Search)
    ↓
Retrieve Top Results
    ↓
Give to AI as Context
    ↓
AI Generates Answer (with citations)
```

## 🔍 Vector Embeddings Explained

**Embeddings** are numerical representations of text that capture meaning:

- Similar meanings = Similar numbers
- "Transmission cover" and "transmission housing" = close vectors
- Enables semantic search (meaning-based, not keyword-based)

### ⚠️ Important: Embedding Provider Required

**Pinecone stores vectors, but you need a provider to CREATE them:**

- **Hugging Face** (free tier): `HUGGINGFACE_API_KEY` - Recommended for free tier
- **OpenAI** (paid): `OPENAI_API_KEY` - More reliable, costs money
- **You only need ONE** - not both!

**Pinecone itself doesn't require Hugging Face** - it just stores the vectors. But to populate Pinecone, you need either Hugging Face OR OpenAI to generate the embeddings.

## 💡 Example

**Traditional Search** (keyword-based):
- Searches for exact words: "transmission cover"
- Misses: "trans housing", "gearbox cover", "tranny case"

**Vector Search** (semantic-based):
- Searches for meaning: "transmission cover"
- Finds: "trans housing", "gearbox cover", "tranny case" (same meaning!)

---

# How to Populate Pinecone for Better RAG

## 🎯 Goal

Store embeddings of your specs, manuals, and content in Pinecone so the AI can find relevant information quickly.

## 📋 Step-by-Step Guide

### Step 1: Check What You Have

Your database already has:
- Specs (torque values, bolt sizes, etc.)
- Query history (AI answers)
- Forum posts (community knowledge)

We need to convert these to embeddings and store in Pinecone.

### Step 2: Create a Population Script

I'll create a script that:
1. Reads all specs from your database
2. Generates embeddings for each spec
3. Stores them in Pinecone
4. Does the same for query history and forum posts

### Step 3: Run the Script

```bash
npm run populate-pinecone
```

### Step 4: Verify

Check Pinecone dashboard - you should see vectors!

---

## 🔧 What Gets Stored

For each spec/entry, we store:
- **Text**: The actual content (component name, torque, notes)
- **Metadata**: Source type, ID, model, year
- **Vector**: The embedding (numbers representing meaning)

## 🚀 Benefits After Population

- **Faster searches**: Vector search is instant
- **Better matches**: Semantic search finds related content
- **More context**: AI gets more relevant info
- **Improved answers**: More accurate, better cited responses

---

## 📚 Technical Details

### Embedding Models

- **Hugging Face** (`all-MiniLM-L6-v2`): 384 dimensions, free
- **OpenAI** (`text-embedding-3-small`): 1536 dimensions, paid

### Pinecone Index

- **Dimensions**: Must match embedding model (384 or 1536)
- **Metric**: Cosine similarity (measures how similar vectors are)
- **Capacity**: Free tier = 100K vectors

### Storage Format

Each vector in Pinecone contains:
```json
{
  "id": "spec_abc123",
  "values": [0.123, -0.456, ...], // 384 or 1536 numbers
  "metadata": {
    "text": "Transmission cover: 20-25 Nm",
    "sourceType": "spec",
    "sourceId": "abc123",
    "componentName": "Transmission cover",
    "model": "Road King",
    "year": "2005"
  }
}
```

---

## 🎯 Next Steps

1. **Run the population script** (I'll create it)
2. **Verify in Pinecone dashboard**
3. **Test queries** - should get better results
4. **Monitor usage** - check Pinecone dashboard

---

## 💡 Pro Tips

1. **Start Small**: Populate with approved specs first
2. **Incremental Updates**: Add new specs as they're approved
3. **Clean Data**: Remove duplicates before embedding
4. **Monitor Quota**: Free tier = 100K vectors
5. **Update Regularly**: Re-run script when database grows

