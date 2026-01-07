# YouTube Data API Setup Guide

This guide will help you set up YouTube integration for WrenchMC Goliath, enabling video tutorials and search functionality.

## 🎯 What YouTube Integration Provides

- **Video Search**: Search for Harley-Davidson maintenance tutorials
- **Query Results**: Related YouTube videos appear in AI query responses
- **Tutorials Page**: Browse and search YouTube videos at `/tutorials`
- **Video Embeds**: Watch videos directly in the app

---

## Step 1: Create Google Cloud Project

1. **Go to Google Cloud Console**
   - Visit [https://console.cloud.google.com/](https://console.cloud.google.com/)
   - Sign in with your Google account

2. **Create or Select a Project**
   - Click the project dropdown at the top
   - Click **"New Project"** (or select existing if you already have one)
   - Enter project name: `WrenchMC` (or your choice)
   - Click **"Create"**
   - Wait for project creation (may take a few seconds)

---

## Step 2: Enable YouTube Data API v3

1. **Navigate to API Library**
   - In Google Cloud Console, go to **APIs & Services** → **Library** (left sidebar)

2. **Search for YouTube Data API**
   - In the search bar, type: `YouTube Data API v3`
   - Click on **"YouTube Data API v3"** from the results

3. **Enable the API**
   - Click the **"Enable"** button
   - Wait for the API to be enabled (usually instant)

---

## Step 3: Create API Key

1. **Go to Credentials**
   - In Google Cloud Console, go to **APIs & Services** → **Credentials** (left sidebar)

2. **Create API Key**
   - Click **"+ CREATE CREDENTIALS"** at the top
   - Select **"API key"** from the dropdown

3. **Copy Your API Key**
   - A popup will appear with your API key
   - **IMPORTANT**: Copy this key immediately - it looks like: `AIzaSyDfiI1ru52kpTxPGTIXZ9Abi68vWfGFtfo`
   - Click **"Close"** (don't restrict it yet - we'll do that next)

4. **Restrict the API Key (Recommended for Security)**
   - Click on your newly created API key in the credentials list
   - Under **"API restrictions"**:
     - Select **"Restrict key"**
     - Check **"YouTube Data API v3"**
     - Click **"Save"**
   
   - Under **"Application restrictions"** (optional but recommended):
     - Select **"HTTP referrers (web sites)"**
     - Add your domains:
       - `http://localhost:3000/*` (for local development)
       - `https://your-app.vercel.app/*` (your production domain)
     - Click **"Save"**

---

## Step 4: Add API Key to Vercel

1. **Go to Vercel Dashboard**
   - Visit [https://vercel.com/dashboard](https://vercel.com/dashboard)
   - Select your WrenchMC project

2. **Add Environment Variable**
   - Go to **Settings** → **Environment Variables**
   - Click **"Add New"**
   - **Name**: `YOUTUBE_API_KEY`
   - **Value**: Paste your YouTube API key
   - **Environment**: Select **Production**, **Preview**, and **Development**
   - Click **"Save"**

3. **Redeploy**
   - Go to **Deployments** tab
   - Click **"..."** on latest deployment → **"Redeploy"**
   - Or push a new commit to trigger auto-deploy

---

## Step 5: Test YouTube Integration

1. **Visit Your App**
   - Go to `https://your-app.vercel.app/tutorials`
   - Or locally: `http://localhost:3000/tutorials`

2. **Test Video Search**
   - Search for: `Harley Davidson maintenance`
   - Should display YouTube videos

3. **Test in Query Page**
   - Go to `/query`
   - Ask: "How to change oil on a Road King"
   - Should show related YouTube videos in the results

---

## Step 6: Local Development Setup

For local testing, add to your `.env.local` file:

```env
YOUTUBE_API_KEY=your-api-key-here
```

Then restart your dev server:
```bash
npm run dev
```

---

## 🐛 Troubleshooting

### "YOUTUBE_API_KEY not configured"
**Problem**: API key not set in environment variables

**Solution**:
- Verify `YOUTUBE_API_KEY` is added to Vercel
- Check that it's set for the correct environment (Production/Preview/Development)
- Redeploy after adding the key

### "YouTube API search failed" or "403 Forbidden"
**Problem**: API key restrictions or quota exceeded

**Solution**:
- Check API key restrictions in Google Cloud Console
- Verify "YouTube Data API v3" is enabled and allowed
- Check if you've exceeded the free quota (10,000 units/day)
- Verify HTTP referrer restrictions match your domain

### "YouTube API details failed"
**Problem**: Error fetching video details

**Solution**:
- Check API key is valid
- Verify YouTube Data API v3 is enabled
- Check browser console for specific error messages

### No Videos Appearing
**Problem**: Videos not showing in results

**Solution**:
- Check browser console for errors
- Verify API key is correct
- Test API key directly: `https://www.googleapis.com/youtube/v3/search?part=snippet&q=test&key=YOUR_KEY`
- Check if quota is exceeded

### Rate Limit Errors
**Problem**: "Quota exceeded" errors

**Solution**:
- YouTube Data API v3 has a free quota of 10,000 units per day
- Each search costs ~100 units
- Each video details request costs ~1 unit
- You can request a quota increase in Google Cloud Console
- Consider caching results to reduce API calls

---

## 📊 API Quota & Limits

### Free Tier Limits:
- **Daily Quota**: 10,000 units per day
- **Search Request**: ~100 units
- **Video Details**: ~1 unit
- **Channel Search**: ~100 units

### Quota Calculation:
- 100 video searches per day (free tier)
- Or 10,000 video detail requests
- Mixed usage depends on your app's needs

### Requesting Quota Increase:
1. Go to Google Cloud Console → **APIs & Services** → **Quotas**
2. Search for "YouTube Data API v3"
3. Click on the quota you want to increase
4. Click **"Edit Quotas"**
5. Request your desired limit
6. Google will review (usually approved quickly)

---

## 🔒 Security Best Practices

1. **Restrict API Key**
   - Always restrict to "YouTube Data API v3" only
   - Add HTTP referrer restrictions for production
   - Don't use the same key for multiple projects

2. **Never Commit Keys**
   - Keep API keys in `.env.local` (local) and Vercel (production)
   - Never commit keys to git
   - Rotate keys if exposed

3. **Monitor Usage**
   - Check quota usage in Google Cloud Console
   - Set up billing alerts if using paid tier
   - Monitor for unusual activity

---

## 🎯 Features Using YouTube API

### 1. Tutorials Page (`/tutorials`)
- Searchable gallery of YouTube videos
- Filters by model, year, difficulty
- Direct video embeds

### 2. Query Page (`/query`)
- AI queries automatically include related YouTube videos
- Shows top 3 relevant videos per query
- Embedded players for quick viewing

### 3. Video Details
- Title, description, thumbnail
- View count, like count
- Duration, channel information
- Published date

---

## ✅ Checklist

- [ ] Google Cloud project created
- [ ] YouTube Data API v3 enabled
- [ ] API key created
- [ ] API key restricted to YouTube Data API v3
- [ ] HTTP referrer restrictions added (optional)
- [ ] `YOUTUBE_API_KEY` added to Vercel
- [ ] Environment variables set for Production, Preview, Development
- [ ] App redeployed
- [ ] Tested video search at `/tutorials`
- [ ] Tested videos in query results at `/query`

---

## 📚 Additional Resources

- [YouTube Data API v3 Documentation](https://developers.google.com/youtube/v3)
- [API Quota Information](https://developers.google.com/youtube/v3/getting-started#quota)
- [API Explorer](https://developers.google.com/youtube/v3/docs/search/list) - Test API calls
- [Google Cloud Console](https://console.cloud.google.com/)

---

## 💡 Tips

1. **Caching**: Consider caching popular search results to reduce API calls
2. **Error Handling**: The app gracefully handles missing API keys (shows empty results)
3. **Performance**: YouTube API is fast, but consider debouncing search inputs
4. **User Experience**: Videos load asynchronously, so users can interact while loading

---

## Quick Reference

**API Endpoint**: `https://www.googleapis.com/youtube/v3`

**Required Environment Variable**:
- `YOUTUBE_API_KEY` - Your YouTube Data API v3 key

**Where to Get Key**:
- Google Cloud Console → APIs & Services → Credentials → Create API Key

**Test API Key**:
```
https://www.googleapis.com/youtube/v3/search?part=snippet&q=test&key=YOUR_KEY
```

**Free Quota**: 10,000 units per day

