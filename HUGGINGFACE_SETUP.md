# Hugging Face Setup Guide for WrenchMC

This guide will walk you through setting up Hugging Face to generate embeddings for your Pinecone vector database.

## 🎯 What You'll Get

- **Free API access** to generate embeddings
- **No credit card required**
- **Perfect for getting started** with RAG

## 📋 Step-by-Step Instructions

### Step 1: Create Hugging Face Account

1. **Go to Hugging Face**
   - Visit [https://huggingface.co](https://huggingface.co)
   - Click **"Sign Up"** (top right)

2. **Sign Up Options**
   - You can sign up with:
     - Email address
     - Google account
     - GitHub account
   - Choose whichever is easiest for you

3. **Verify Your Email**
   - Check your email for verification link
   - Click the link to verify (if required)

### Step 2: Create an Access Token

1. **Go to Settings**
   - Once logged in, click your **profile icon** (top right)
   - Click **"Settings"** from the dropdown

2. **Navigate to Access Tokens**
   - In the left sidebar, click **"Access Tokens"**
   - Or go directly to: [https://huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)

3. **Create New Token**
   - Click **"New token"** button
   - Give it a name: `WrenchMC Embeddings` (or your choice)
   - **Select role**: Choose **"Read"** (this is sufficient for embeddings)
   - Click **"Generate token"**

4. **Copy Your Token**
   - **IMPORTANT**: Copy the token immediately!
   - It looks like: `hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
   - You won't be able to see it again after closing the dialog
   - Save it somewhere safe (password manager, notes, etc.)

### Step 3: Add Token to Environment Variables

#### For Local Development (`.env.local`)

1. **Open `.env.local`** in your project root
   - If it doesn't exist, create it: `touch .env.local`

2. **Add the Hugging Face API Key**
   ```env
   HUGGINGFACE_API_KEY="hf_your-actual-token-here"
   ```
   - Replace `hf_your-actual-token-here` with your actual token
   - Keep the quotes around it

3. **Save the file**

#### For Vercel Deployment

1. **Go to Vercel Dashboard**
   - Visit [https://vercel.com/dashboard](https://vercel.com/dashboard)
   - Select your WrenchMC project

2. **Navigate to Environment Variables**
   - Click **"Settings"** tab
   - Click **"Environment Variables"** in the left sidebar

3. **Add New Variable**
   - Click **"Add New"**
   - **Name**: `HUGGINGFACE_API_KEY`
   - **Value**: Paste your Hugging Face token (the `hf_...` value)
   - **Environment**: Select all three:
     - ☑️ Production
     - ☑️ Preview
     - ☑️ Development
   - Click **"Save"**

4. **Redeploy Your App**
   - After adding the variable, Vercel will usually auto-deploy
   - Or manually trigger a redeploy from the dashboard

### Step 4: Verify Your Pinecone Index Dimensions

**IMPORTANT**: Hugging Face embeddings use **384 dimensions**

1. **Check Your Pinecone Index**
   - Go to [Pinecone Dashboard](https://app.pinecone.io)
   - Click on your index
   - Check the **"Dimension"** field

2. **If Dimension is NOT 384**
   - You need to create a new index with 384 dimensions
   - Or use OpenAI embeddings (which use 1536 dimensions)
   - See `EMBEDDING_PROVIDER_SETUP.md` for details

3. **If Dimension IS 384**
   - ✅ You're all set!

### Step 5: Test the Setup

1. **Restart Your Local Server** (if running)
   ```bash
   # Stop the server (Ctrl+C)
   # Then restart
   npm run dev
   ```

2. **Run the Population Script**
   ```bash
   npm run populate-pinecone
   ```
   
   You should see:
   ```
   ✅ Configuration check passed
      Using: Hugging Face for embeddings
   ```

3. **Check for Errors**
   - If you see "Hugging Face API error", check:
     - Token is correct (starts with `hf_`)
     - Token has "Read" permissions
     - Token hasn't been revoked

## 🐛 Troubleshooting

### Error: "HUGGINGFACE_API_KEY not configured"

**Solution:**
- Make sure the key is in `.env.local` (local) AND Vercel (deployment)
- Restart your dev server after adding to `.env.local`
- Check for typos in the variable name

### Error: "Hugging Face API error: 401 Unauthorized"

**Solution:**
- Token is incorrect or revoked
- Create a new token in Hugging Face settings
- Make sure token has "Read" permissions
- Update both `.env.local` and Vercel

### Error: "Hugging Face API error: 429 Too Many Requests"

**Solution:**
- Free tier has rate limits
- Wait a few minutes and try again
- Consider upgrading to a paid plan if you need higher limits

### Error: "Dimension mismatch" when populating Pinecone

**Solution:**
- Hugging Face = 384 dimensions
- Your Pinecone index must be 384 dimensions
- Check your index in Pinecone dashboard
- Create a new index with 384 dimensions if needed

### Token Not Working

**Check:**
1. Token starts with `hf_`
2. Token is copied completely (no spaces before/after)
3. Token has "Read" permissions
4. Token hasn't expired (they don't expire, but can be revoked)

## ✅ Verification Checklist

- [ ] Hugging Face account created
- [ ] Access token created with "Read" permissions
- [ ] Token copied and saved securely
- [ ] `HUGGINGFACE_API_KEY` added to `.env.local`
- [ ] `HUGGINGFACE_API_KEY` added to Vercel
- [ ] Pinecone index dimension is 384
- [ ] Local dev server restarted (if running)
- [ ] Vercel app redeployed
- [ ] Population script runs without errors

## 🎯 Next Steps

Once Hugging Face is set up:

1. **Populate Pinecone**:
   ```bash
   npm run populate-pinecone
   ```

2. **Test Queries**:
   - Go to `/query` page
   - Ask a question
   - AI should use RAG with your Pinecone data

3. **Monitor Usage**:
   - Check Hugging Face dashboard for API usage
   - Free tier is generous but has limits

## 💡 Pro Tips

1. **Keep Token Secure**
   - Never commit `.env.local` to git
   - Use a password manager for tokens
   - Rotate tokens if exposed

2. **Free Tier Limits**
   - Hugging Face free tier is generous
   - Rate limits apply (wait and retry if needed)
   - Perfect for testing and small-scale use

3. **Upgrade Path**
   - If you hit limits, consider:
     - Hugging Face Pro (paid)
     - OpenAI embeddings (paid, more reliable)

## 📚 Additional Resources

- [Hugging Face Documentation](https://huggingface.co/docs)
- [Hugging Face Inference API](https://huggingface.co/docs/api-inference/index)
- [Access Tokens Guide](https://huggingface.co/docs/hub/security-tokens)

---

**Need help?** Check `EMBEDDING_PROVIDER_SETUP.md` for comparison with OpenAI option.

