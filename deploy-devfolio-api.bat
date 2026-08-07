@echo off
REM Devfolio API Proxy - Deployment & Testing Script for Windows
REM This script helps you deploy and test the Devfolio API proxy

echo.
echo 🚀 Devfolio API Proxy - Deployment Helper
echo ==========================================
echo.

REM Check if git is initialized
if not exist .git (
  echo ⚠️  Warning: Git not initialized. Run 'git init' first.
  exit /b 1
)

REM Add files to git
echo 📦 Adding files to git...
git add api/devfolio.js
git add src/hooks/useDevfolioData.ts
git add src/components/DevfolioStats.tsx
git add vercel.json
git add DEVFOLIO_API_SETUP.md
git add INTEGRATION_EXAMPLES.tsx

echo ✅ Files staged for commit
echo.

REM Commit
echo 💾 Creating commit...
git commit -m "Add Devfolio API proxy serverless function - Created /api/devfolio.js as Vercel serverless function - Added useDevfolioData hook for easy integration - Added DevfolioStats example component - Updated vercel.json to exclude /api routes from rewrite - Added documentation and integration examples - Fixes CORS issues when calling Devfolio API from browser"

echo ✅ Changes committed
echo.

REM Push to main
echo 📤 Pushing to main branch...
git push origin main

echo ✅ Pushed to repository
echo.

echo 🎉 Deployment Complete!
echo.
echo Next steps:
echo 1. Wait for Vercel to deploy (usually 1-2 minutes)
echo 2. Test the API endpoint: https://innofusion.tech/api/devfolio
echo 3. Check deployment logs: vercel logs
echo.
echo Testing commands:
echo   # Test locally (if dev server running):
echo   curl http://localhost:5173/api/devfolio
echo.
echo   # Test production:
echo   curl https://innofusion.tech/api/devfolio
echo.
echo   # In browser console (on innofusion.tech):
echo   fetch('/api/devfolio').then(r =^> r.json()).then(console.log)
echo.
echo Happy coding! 🎊
echo.

pause
