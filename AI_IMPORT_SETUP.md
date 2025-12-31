# AI-Powered Spec Import Setup Guide

This guide explains how to set up the AI-powered import feature that extracts technical specs from text sources.

## Overview

The AI import feature allows you to:
- Paste text from service manuals, technical documents, or any source
- Automatically extract structured spec data using AI
- Review and submit extracted specs in bulk
- Save hours of manual data entry

## Setup Instructions

### Option 1: OpenRouter (Recommended - Free Models Available) ⭐

OpenRouter provides access to multiple AI models including free ones. Perfect for cost-effective bulk imports.

#### Step 1: Get OpenRouter API Key

1. Go to https://openrouter.ai/
2. Sign up or log in (you mentioned you already have an account!)
3. Navigate to **Keys** (https://openrouter.ai/keys)
4. Click **Create Key**
5. Give it a name (e.g., "WrenchMC Import")
6. **Copy the key immediately**

#### Step 2: Add API Key to Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add a new variable:
   - **Name**: `OPENROUTER_API_KEY`
   - **Value**: Your OpenRouter API key
   - **Environment**: Select all (Production, Preview, Development)
4. (Optional) Add model preference:
   - **Name**: `OPENROUTER_MODEL`
   - **Value**: `google/gemini-flash-1.5:free` (free) or `anthropic/claude-3-haiku` (paid but cheap)
5. Click **Save**
6. **Important**: Redeploy your application for the change to take effect

#### Free Models Available via OpenRouter:
- `google/gemini-flash-1.5:free` - Google's free model (recommended)
- `meta-llama/llama-3.2-3b-instruct:free` - Meta's free model
- `qwen/qwen-2.5-7b-instruct:free` - Free alternative

### Option 2: OpenAI (Paid)

If you prefer OpenAI:

1. Go to https://platform.openai.com/
2. Sign up or log in
3. Navigate to **API Keys** (https://platform.openai.com/api-keys)
4. Click **Create new secret key**
5. **Copy the key immediately**

Then add to Vercel:
- **Name**: `OPENAI_API_KEY`
- **Value**: Your OpenAI API key (starts with `sk-...`)

### Step 3: Access the Import Page

1. Sign in to your account
2. Navigate to `/admin/import`
3. You should see the AI import interface

## How to Use

### Basic Usage

1. **Find Source Material**
   - Service manuals
   - Technical documentation
   - Forum posts with specs
   - Any text containing torque specs

2. **Copy the Text**
   - Select and copy relevant sections
   - Can be multiple specs in one paste

3. **Paste and Extract**
   - Paste into the text area
   - Click "Extract Specs with AI"
   - Wait for AI to process (usually 5-10 seconds)

4. **Review Extracted Specs**
   - Check each extracted spec on the right
   - Verify accuracy
   - Edit if needed (coming soon)

5. **Submit**
   - Submit individual specs
   - Or click "Submit All" to bulk submit

### Example Source Text

```
Transmission Cover Bolts:
Torque: 20-25 Nm (15-18 ft-lbs)
Bolt Size: M8 x 1.25
Tighten in a star pattern starting from center

Head Bolts:
Torque: 45-50 Nm
Bolt Size: M10
Tighten in sequence: center to outside

Exhaust Manifold Nuts:
Torque: 12-15 Nm
Bolt Size: M6
```

The AI will extract:
- Component names
- Torque ranges (converted to Nm)
- Bolt sizes
- Tightening sequences

## Cost Considerations

### OpenRouter Free Models (Recommended)

- **google/gemini-flash-1.5:free**: **FREE** - No cost for extraction!
- **meta-llama/llama-3.2-3b-instruct:free**: **FREE**
- Perfect for bulk imports with zero cost

### OpenRouter Paid Models (If Needed)

- **anthropic/claude-3-haiku**: ~$0.25 per 1M input tokens (very cheap)
- **google/gemini-pro**: ~$0.50 per 1M input tokens
- Still much cheaper than OpenAI for most use cases

### OpenAI Pricing (Alternative)

- **gpt-4o-mini**: ~$0.15 per 1M input tokens, ~$0.60 per 1M output tokens
- Typical extraction: ~$0.01-0.05 per extraction

### Tips to Reduce Costs

1. **Use free models** - OpenRouter's free models work great for extraction
2. **Clean your source text** - Remove unnecessary content before pasting
3. **Batch similar content** - Extract multiple specs in one go
4. **Review before submitting** - Avoid re-extracting the same content

## Alternative AI Providers

If you prefer a different AI provider, you can modify `/src/app/api/admin/extract-specs/route.ts`:

### Using Anthropic Claude

```typescript
const response = await fetch('https://api.anthropic.com/v1/messages', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': process.env.ANTHROPIC_API_KEY!,
    'anthropic-version': '2023-06-01',
  },
  body: JSON.stringify({
    model: 'claude-3-haiku-20240307',
    max_tokens: 4096,
    messages: [/* ... */]
  }),
})
```

### Using Google Gemini

```typescript
const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GOOGLE_AI_API_KEY}`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    contents: [/* ... */]
  }),
})
```

## Troubleshooting

### "No AI API key configured"
- Make sure `OPENROUTER_API_KEY` (recommended) or `OPENAI_API_KEY` is set in Vercel
- Redeploy after adding the variable
- Check the variable name is exactly correct

### "Invalid API key"
- For OpenRouter: Verify the key is correct in your OpenRouter dashboard
- For OpenAI: Verify the key starts with `sk-`
- Check for extra spaces or newlines
- Make sure the key hasn't been revoked

### "Model not found" (OpenRouter)
- Check that the model name is correct
- Use `google/gemini-flash-1.5:free` for free option
- See OpenRouter's model list: https://openrouter.ai/models

### "Rate limit exceeded"
- You've hit OpenAI's rate limit
- Wait a few minutes and try again
- Consider upgrading your OpenAI plan

### "No specs extracted"
- The AI might not have found any specs in the text
- Try being more specific in your source text
- Include clear component names and torque values

### Extracted data is inaccurate
- The AI does its best but may need review
- Always review extracted specs before submitting
- You can edit the form after extraction (coming soon)

## Best Practices

1. **Use clear source text**
   - Include component names
   - Include torque values
   - Include bolt sizes
   - Include any sequences or patterns

2. **Review before submitting**
   - Check all extracted values
   - Verify torque conversions (ft-lbs → Nm)
   - Confirm component names are accurate

3. **Batch similar content**
   - Extract multiple specs at once
   - More cost-effective
   - Faster workflow

4. **Keep source notes**
   - The AI will try to preserve source information
   - Add manual notes if needed
   - Helps with verification later

## Security Notes

- API key is stored server-side only (never exposed to browser)
- All API calls happen on the server
- Key is only used for extraction, not stored
- Consider setting usage limits in OpenAI dashboard

## Future Enhancements

- [ ] File upload (PDF, DOCX parsing)
- [ ] Edit extracted specs before submitting
- [ ] Bulk edit capabilities
- [ ] Support for images/OCR
- [ ] Integration with other AI providers
- [ ] Cost tracking dashboard

