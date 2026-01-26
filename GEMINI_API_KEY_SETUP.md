# How to Get a Gemini API Key (New Email)

## Step-by-Step Guide

### Step 1: Create/Use a New Google Account
1. Go to https://accounts.google.com/signup
2. Create a new Google account with a different email address
3. Verify the email address if required

### Step 2: Get Gemini API Key
1. **Go to Google AI Studio:**
   - Visit: https://aistudio.google.com/apikey
   - Or: https://makersuite.google.com/app/apikey

2. **Sign in with your new Google account**
   - Make sure you're using the new email address

3. **Create API Key:**
   - Click **"Create API Key"** button
   - Select **"Create API key in new project"** (recommended)
   - Or select an existing project if you have one

4. **Copy the API Key:**
   - The API key will be displayed (starts with `AIza...`)
   - **Copy it immediately** - you won't be able to see it again!
   - Format: `AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`

### Step 3: Update Your Project

1. **Open `config.env` file**
2. **Replace the old API key:**
   ```env
   GOOGLE_AI_API_KEY=YOUR_NEW_API_KEY_HERE
   ```
3. **Save the file**
4. **Restart your server** for changes to take effect

---

## Free Tier Limits

- **20 requests per day per model** (current limit you hit)
- **15 requests per minute**
- **No credit card required**
- Resets daily (based on UTC time)

---

## Multiple API Keys Strategy (Optional)

If you need more requests, you could:
1. Get multiple API keys from different Google accounts
2. Implement API key rotation in your code
3. Use different keys for different features

---

## Important Notes

⚠️ **Security:**
- Never commit API keys to Git
- Keep `config.env` in `.gitignore`
- Don't share API keys publicly

⚠️ **Rate Limits:**
- Each API key has its own quota
- Free tier: 20 requests/day per model
- Consider upgrading to paid tier for higher limits

⚠️ **API Key Management:**
- You can view/manage keys at: https://aistudio.google.com/apikey
- You can delete old keys if needed
- Each key is tied to a Google Cloud project

---

## Quick Reference

- **Get API Key:** https://aistudio.google.com/apikey
- **Documentation:** https://ai.google.dev/gemini-api/docs
- **Rate Limits:** https://ai.google.dev/gemini-api/docs/rate-limits
- **Pricing:** https://ai.google.dev/pricing

---

## After Setup

1. Update `config.env` with new key
2. Restart server: `npm run dev` or `pnpm dev`
3. Test the endpoint again
4. Check logs to confirm Gemini is initialized

