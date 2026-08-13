# Devfolio API Integration - CORS Fix

## Problem
Calling `https://api.devfolio.co/api/hackathons/innofusion-3` directly from the browser results in CORS errors because the Devfolio API doesn't allow cross-origin requests from your domain.

## Solution
Created a Vercel Serverless Function that acts as a proxy to bypass CORS restrictions.

---

## 📁 Files Created

### 1. **`/api/devfolio.js`** - Serverless Function (Proxy)
- **Endpoint**: `/api/devfolio`
- **Method**: GET
- **Purpose**: Fetches data from Devfolio API server-side and returns it to the frontend
- **Features**:
  - CORS headers configured
  - Error handling with proper HTTP status codes
  - Caching headers for performance (5 minutes)
  - User-Agent and Accept headers
  - Production-ready

### 2. **`/src/hooks/useDevfolioData.ts`** - React Hook
- Custom hook to fetch data from `/api/devfolio`
- Returns: `{ data, loading, error, refetch }`
- Automatically fetches on mount

### 3. **`/src/components/DevfolioStats.tsx`** - Example Component
- Demonstrates how to use the hook
- Includes loading states, error handling, and data display
- Also includes a standalone `fetchDevfolioData()` function

---

## 🚀 Usage

### Option 1: Using the Custom Hook (Recommended)

```tsx
import { useDevfolioData } from './hooks/useDevfolioData';

function MyComponent() {
  const { data, loading, error, refetch } = useDevfolioData();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!data) return <div>No data</div>;

  return (
    <div>
      <h1>{data.name}</h1>
      <p>{data.tagline}</p>
      <button onClick={refetch}>Refresh</button>
    </div>
  );
}
```

### Option 2: Direct Fetch

```tsx
import { useEffect, useState } from 'react';

function MyComponent() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/api/devfolio')
      .then(res => res.json())
      .then(data => setData(data))
      .catch(err => console.error(err));
  }, []);

  return <div>{data?.name}</div>;
}
```

### Option 3: Using the Example Component

```tsx
import { DevfolioStats } from './components/DevfolioStats';

function App() {
  return (
    <div>
      <DevfolioStats />
    </div>
  );
}
```

---

## 🔧 How It Works

### Before (❌ CORS Error):
```
Browser → https://api.devfolio.co/api/hackathons/innofusion-3
         ❌ CORS Error: Not allowed
```

### After (✅ Working):
```
Browser → https://innofusion.tech/api/devfolio
         → Vercel Serverless Function
         → https://api.devfolio.co/api/hackathons/innofusion-3
         → Returns JSON to Browser ✅
```

---

## 📦 Deployment

### Local Development
```bash
# Start development server
npm run dev
# or
bun dev

# The API will be available at:
# http://localhost:5173/api/devfolio
```

### Production (Vercel)

1. **No additional configuration needed!** Vercel automatically detects the `/api` folder.

2. **Deploy to Vercel:**
```bash
vercel --prod
```

3. **The API will be available at:**
   - `https://innofusion.tech/api/devfolio` ✅

### Vercel Configuration (Already included)
Your `vercel.json` should work automatically with this setup. If you need custom routing:

```json
{
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api/$1" }
  ]
}
```

---

## 🧪 Testing

### Test Locally
```bash
# Method 1: Browser
# Visit: http://localhost:5173/api/devfolio

# Method 2: cURL
curl http://localhost:5173/api/devfolio

# Method 3: Fetch in browser console
fetch('/api/devfolio').then(r => r.json()).then(console.log)
```

### Test Production
```bash
# Method 1: cURL
curl https://innofusion.tech/api/devfolio

# Method 2: Browser
# Visit: https://innofusion.tech/api/devfolio

# Method 3: Fetch in browser console (on innofusion.tech)
fetch('/api/devfolio').then(r => r.json()).then(console.log)
```

---

## 📊 API Response Example

```json
{
  "id": "...",
  "name": "Innofusion 3.0",
  "slug": "innofusion-3",
  "tagline": "...",
  "description": "...",
  "starts_at": "2026-01-20T00:00:00.000Z",
  "ends_at": "2026-01-22T00:00:00.000Z",
  "registration_ends_at": "2026-01-19T00:00:00.000Z",
  "max_team_size": 4,
  "min_team_size": 1,
  "themes": ["AI", "Blockchain", ...],
  "prizes": [...],
  "organisers": [...]
}
```

---

## 🔒 Security Best Practices

### For Production:
Update `/api/devfolio.js` line 10 to restrict CORS to your domain only:

```javascript
// Change this:
res.setHeader('Access-Control-Allow-Origin', '*');

// To this:
res.setHeader('Access-Control-Allow-Origin', 'https://innofusion.tech');
```

### Rate Limiting
Consider adding rate limiting in the future if needed:
```javascript
// Example with Vercel Rate Limiting
import rateLimit from '@vercel/rate-limit';
```

---

## 🐛 Troubleshooting

### Issue: API returns 404
- **Cause**: The `/api` folder structure is incorrect
- **Fix**: Ensure the file is at `/api/devfolio.js` (not `/api/devfolio/index.js`)

### Issue: Still getting CORS errors
- **Cause**: Fetching from the wrong URL
- **Fix**: Use `/api/devfolio` (relative path), NOT `https://api.devfolio.co/...`

### Issue: Serverless function timeout
- **Cause**: Devfolio API is slow or down
- **Fix**: The function has a 10s timeout by default. Check Devfolio API status.

### Issue: Works locally but not on Vercel
- **Cause**: Build or deployment configuration issue
- **Fix**: 
  1. Check Vercel deployment logs
  2. Ensure `api/devfolio.js` is committed to git
  3. Redeploy with `vercel --prod --force`

---

## 📝 Notes

- The serverless function uses native `fetch()` (Node.js 18+)
- No need for `axios` or `express` - keeps bundle size small
- Caching is set to 5 minutes (`s-maxage=300`)
- Function is stateless and scales automatically on Vercel

---

## ✅ Checklist

- [x] Created `/api/devfolio.js` serverless function
- [x] Created `/src/hooks/useDevfolioData.ts` custom hook
- [x] Created `/src/components/DevfolioStats.tsx` example component
- [x] Configured CORS headers
- [x] Added error handling
- [x] Added caching headers
- [x] Production-ready code
- [x] Documentation complete

---

## 🎯 Next Steps

1. **Replace old API calls**: Find any direct calls to `https://api.devfolio.co/...` in your code and replace with `/api/devfolio`

2. **Deploy to Vercel**: 
   ```bash
   git add .
   git commit -m "Add Devfolio API proxy serverless function"
   git push origin main
   ```

3. **Test on production**: Visit `https://innofusion.tech/api/devfolio`

4. **Update frontend components**: Import and use `useDevfolioData` hook or `DevfolioStats` component

---

## 📧 Support

If you encounter any issues, check:
- Vercel deployment logs: `vercel logs`
- Browser console for errors
- Network tab to see the actual request/response

---

**Ready to deploy! 🚀**
