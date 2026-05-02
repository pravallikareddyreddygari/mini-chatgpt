# Vercel Deployment Setup

## Environment Variables for Vercel

Go to your Vercel project settings → Environment Variables and add:

---

## Required Variables:

### 1. OPENROUTER_API_KEY
- Value: your_api_key_here
- Environment: Production, Preview, Development

---

### 2. API_PROVIDER
- Value: openrouter
- Environment: Production, Preview, Development

---

## Steps:

1. Go to your Vercel project dashboard
2. Open **Settings → Environment Variables**
3. Add the variables listed above
4. Click **Save**
5. Redeploy your application:
   - Go to **Deployments**
   - Click **⋯ (three dots)**
   - Click **Redeploy**

---

## Important Notes:

- Variable names are **case-sensitive**
- Do NOT include `KEY=` in the value field
- After adding variables, you **must redeploy**
- Never expose your API key in code or GitHub

---

## Troubleshooting:

- Check logs:
  Vercel → Deployments → Select Deployment → Runtime Logs
- Ensure variables exist in all environments (Production, Preview, Development)

---

## Optional (Fallback):

If needed, you can also add:

### NEXT_PUBLIC_OPENROUTER_API_KEY
- Value: your_api_key_here

### NEXT_PUBLIC_API_PROVIDER
- Value: openrouter

> The app supports both formats.