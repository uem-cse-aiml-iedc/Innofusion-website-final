# 🎯 QUICK START GUIDE - Devfolio API CORS Fix

## ✅ What Was Done

Created a **Vercel Serverless Function** that acts as a proxy to fix CORS issues when calling the Devfolio API from your browser.

---

## 📁 Files Created

1. **`/api/devfolio.js`** - Serverless function (the proxy)
2. **`/src/hooks/useDevfolioData.ts`** - React hook for easy data fetching
3. **`/src/components/DevfolioStats.tsx`** - Example component
4. **`/vercel.json`** - Updated to exclude `/api` routes from SPA rewrites
5. **Documentation files** - Setup guide and examples

---

## 🚀 Deploy Now (3 Steps)

### Step 1: Commit & Push
```bash
git add .
git commit -m "Add Devfolio API proxy to fix CORS"
git push origin main
```

**Or use the helper script:**
- Windows: `deploy-devfolio-api.bat`
- Mac/Linux: `bash deploy-devfolio-api.sh`

### Step 2: Wait for Vercel
Vercel will automatically deploy (1-2 minutes). Check status at: https://vercel.com/dashboard

### Step 3: Test It
```bash
# Test the API endpoint
curl https://innofusion.tech/api/devfolio

# Or open in browser:
# https://innofusion.tech/api/devfolio
```

---

## 💻 Use in Your Code

### Method 1: Use the Hook (Easiest)
```tsx
import { useDevfolioData } from './hooks/useDevfolioData';

function MyComponent() {
  const { data, loading, error } = useDevfolioData();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return <div>{data?.name}</div>;
}
```

### Method 2: Direct Fetch
```tsx
const [data, setData] = useState(null);

useEffect(() => {
  fetch('/api/devfolio')
    .then(res => res.json())
    .then(data => setData(data));
}, []);
```

### Method 3: Use Example Component
```tsx
import { DevfolioStats } from './components/DevfolioStats';

<DevfolioStats />
```

---

## 🧪 Test Locally

```bash
# Start dev server
npm run dev
# or
bun dev

# Test in browser console:
fetch('/api/devfolio').then(r => r.json()).then(console.log)

# Or visit:
http://localhost:5173/api/devfolio
```

---

## ✨ How It Works

**Before (❌ CORS Error):**
```
Browser → api.devfolio.co ❌ CORS Error
```

**After (✅ Works):**
```
Browser → innofusion.tech/api/devfolio
        → Vercel Function (server-side)
        → api.devfolio.co
        → Returns data ✅
```

---

## 📊 What Data You Get

```json
{
  "name": "Innofusion 3.0",
  "slug": "innofusion-3",
  "tagline": "...",
  "starts_at": "2026-01-20T00:00:00Z",
  "ends_at": "2026-01-22T00:00:00Z",
  "registration_ends_at": "2026-01-19T00:00:00Z",
  "max_team_size": 4,
  "min_team_size": 1,
  "themes": ["AI", "Blockchain", ...],
  "prizes": [...],
  "registrations_count": 0,
  "teams_count": 0,
  ...
}
```

---

## 🔥 Common Use Cases

```tsx
// Get registration count
const { data } = useDevfolioData();
const count = data?.registrations_count || 0;

// Check if registration is open
const isOpen = new Date(data?.registration_ends_at) > new Date();

// Display themes
{data?.themes?.map(theme => <Badge key={theme}>{theme}</Badge>)}

// Show team size
Team Size: {data?.min_team_size} - {data?.max_team_size}
```

---

## 🐛 Troubleshooting

### Issue: 404 on /api/devfolio
**Fix:** Ensure `api/devfolio.js` is committed and pushed. Redeploy on Vercel.

### Issue: Still getting CORS
**Fix:** Make sure you're calling `/api/devfolio` (not `api.devfolio.co`)

### Issue: Works locally, not on Vercel
**Fix:** Check Vercel logs: `vercel logs`. Ensure files are in git.

---

## 📚 Full Documentation

- **Setup Guide:** [DEVFOLIO_API_SETUP.md](./DEVFOLIO_API_SETUP.md)
- **Code Examples:** [INTEGRATION_EXAMPLES.tsx](./INTEGRATION_EXAMPLES.tsx)

---

## ✅ Ready to Deploy!

**You're all set!** Just commit, push, and your API proxy will work on production.

```bash
git add .
git commit -m "Add Devfolio API proxy"
git push origin main
```

Then visit: **https://innofusion.tech/api/devfolio** 🎉

---

**Questions?** Check the full docs in `DEVFOLIO_API_SETUP.md`
