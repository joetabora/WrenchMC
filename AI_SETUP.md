# AI Setup Guide - Groq AI & Google Gemini

WrenchMC Goliath now uses **Groq AI** (primary) and **Google Gemini** (fallback) for AI-powered features.

## 🚀 Quick Setup

### Step 1: Add API Keys to Vercel

Go to your Vercel project → **Settings** → **Environment Variables** and add:

**Required (at least one):**
- `GROQ_API_KEY` = (your Groq API key - get from [console.groq.com](https://console.groq.com))
- `GEMINI_API_KEY` = (your Gemini API key - get from [ai.google.dev](https://ai.google.dev))

**Optional (for local development):**
- `GROQ_MODEL` = `llama-3.1-70b-versatile` (default)
- `GEMINI_MODEL` = `gemini-1.5-flash` (default)

### Step 2: Redeploy

After adding the environment variables, redeploy your app on Vercel.

---

## 📋 How It Works

### Priority Order:
1. **Groq AI** (if `GROQ_API_KEY` is set) - Fast inference, recommended
2. **Google Gemini** (if `GEMINI_API_KEY` is set) - Fallback option
3. **OpenAI** (if `OPENAI_API_KEY` is set) - Legacy fallback

The system automatically tries Groq first, then falls back to Gemini if Groq fails or isn't configured.

---

## 🎯 Features Using AI

### 1. AI-Powered Query (`/query`)
- Natural language questions about Harley maintenance
- Uses RAG (Retrieval Augmented Generation) with database context
- Provides cited answers with sources

### 2. Spec Extraction (`/admin/import`)
- Extracts technical specs from PDFs and text
- Parses torque values, bolt sizes, sequences
- Automatically structures data for database

---

## 🔧 Configuration

### Groq AI Models
Available models (set via `GROQ_MODEL`):
- `llama-3.1-70b-versatile` (default) - Fast and capable
- `llama-3.1-8b-instant` - Faster, smaller
- `mixtral-8x7b-32768` - Large context window
- `gemma-7b-it` - Google's model on Groq

### Gemini Models
Available models (set via `GEMINI_MODEL`):
- `gemini-1.5-flash` (default) - Fast and efficient
- `gemini-1.5-pro` - More capable, slower
- `gemini-pro` - Original model

---

## 🧪 Testing

### Test AI Query:
1. Visit `/query` on your app
2. Ask: "What's the torque spec for a 2005 Road King transmission cover?"
3. Should get an AI-generated answer with sources

### Test Spec Extraction:
1. Visit `/admin/import`
2. Upload a PDF or paste text with torque specs
3. Click "Extract Specs"
4. Should parse and extract technical data

---

## 🐛 Troubleshooting

### "No AI API key configured"
- **Fix**: Add `GROQ_API_KEY` or `GEMINI_API_KEY` to Vercel environment variables
- **Verify**: Check that keys are set for Production, Preview, and Development

### "Groq API error" or "Gemini API error"
- **Check**: API keys are correct and valid
- **Verify**: Keys haven't expired or been revoked
- **Note**: Groq has rate limits on free tier

### AI responses are slow
- **Solution**: Use Groq (faster than Gemini)
- **Check**: Network latency to API endpoints
- **Note**: First request may be slower (cold start)

### Spec extraction not working
- **Check**: Source text contains actual specs
- **Verify**: AI API is responding (check logs)
- **Try**: Different model or API provider

---

## 📊 API Usage

### Groq AI
- **Free Tier**: Limited requests per minute
- **Pricing**: Check [groq.com/pricing](https://groq.com/pricing)
- **Rate Limits**: Varies by model

### Google Gemini
- **Free Tier**: Generous free quota
- **Pricing**: Check [ai.google.dev/pricing](https://ai.google.dev/pricing)
- **Rate Limits**: 60 requests per minute (free tier)

---

## 🔒 Security Notes

- **Never commit** API keys to git
- Keep keys in `.env.local` (local) and Vercel (production)
- Rotate keys if exposed
- Monitor API usage to prevent abuse

---

## 📚 Additional Resources

- [Groq AI Documentation](https://console.groq.com/docs)
- [Google Gemini Documentation](https://ai.google.dev/docs)
- [Groq Models](https://console.groq.com/docs/models)
- [Gemini Models](https://ai.google.dev/models/gemini)

---

## ✅ Checklist

- [ ] `GROQ_API_KEY` added to Vercel
- [ ] `GEMINI_API_KEY` added to Vercel (optional but recommended)
- [ ] Environment variables set for Production, Preview, Development
- [ ] App redeployed
- [ ] Tested AI query at `/query`
- [ ] Tested spec extraction at `/admin/import`

