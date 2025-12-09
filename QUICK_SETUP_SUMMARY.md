# ⚡ Quick Setup Summary

## 🎯 এই File এ সব Important Points একসাথে!

---

## 📍 URLs (Copy-Paste Ready)

### Local Development:
```
Frontend: http://localhost:3000
Backend:  http://localhost:8000
API:      http://localhost:8000/api
```

### Production:
```
Frontend: https://zapycard.com
Backend:  https://smart.buytiq.store
API:      https://smart.buytiq.store/api
```

---

## 🔧 Backend .env Configuration

### File: `D:\WWW\ZapiCard_Backend\.env`

**For LOCAL:**
```env
APP_URL=http://localhost:8000
FRONTEND_URL=http://localhost:3000
GOOGLE_REDIRECT_URI=http://localhost:8000/login/google/callback
SESSION_DRIVER=file
SESSION_SECURE_COOKIE=false
```

**For PRODUCTION:**
```env
APP_URL=https://smart.buytiq.store
FRONTEND_URL=https://zapycard.com
GOOGLE_REDIRECT_URI=https://smart.buytiq.store/login/google/callback
SESSION_DRIVER=database
SESSION_DOMAIN=.smart.buytiq.store
SESSION_SECURE_COOKIE=true
```

---

## 🎨 Frontend .env Configuration

### File: `D:\Work\Zapi Card\.env.local` (Local)

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### For Production (Vercel/Netlify Environment Variables):

```env
NEXT_PUBLIC_API_URL=https://smart.buytiq.store/api
NEXT_PUBLIC_SITE_URL=https://zapycard.com
```

---

## 🔐 Google OAuth Setup

### Google Cloud Console:
**URL:** https://console.cloud.google.com/apis/credentials

**Authorized Redirect URIs:**

**Local:**
```
http://localhost:8000/login/google/callback
```

**Production:**
```
https://smart.buytiq.store/login/google/callback
```

---

## ✅ Verification Commands

### Backend:
```bash
cd D:\WWW\ZapiCard_Backend

# Verify setup
php verify-setup.php

# Clear cache
php artisan config:clear
php artisan cache:clear
php artisan route:clear
```

### Frontend:
```bash
cd "D:\Work\Zapi Card"

# Build and test
npm run build
npm run dev
```

---

## 🧪 Quick Test

### Local:
1. Start backend: `php artisan serve` (port 8000)
2. Start frontend: `npm run dev` (port 3000)
3. Visit: `http://localhost:3000/login`
4. Click "Login with Google"
5. Should redirect to: `http://localhost:3000/auth/google/callback?token=...&status=success`

### Production:
1. Deploy backend to `https://smart.buytiq.store`
2. Deploy frontend to `https://zapycard.com`
3. Visit: `https://zapycard.com/login`
4. Click "Login with Google"
5. Should redirect to: `https://zapycard.com/auth/google/callback?token=...&status=success`

---

## 🚨 Common Issues & Quick Fixes

### Issue: "Invalid state parameter"
```bash
# Fix: Clear cache and cookies
php artisan config:clear
php artisan cache:clear
# Then clear browser cookies
```

### Issue: CORS Error
```bash
# Check: D:\WWW\ZapiCard_Backend\config\cors.php
# Should have: 'https://zapycard.com' in allowed_origins
```

### Issue: Wrong redirect URL
```bash
# Check: D:\WWW\ZapiCard_Backend\.env
# FRONTEND_URL should be: https://zapycard.com (no trailing slash)
```

---

## 📁 Important Files

### Backend:
- `.env` → `D:\WWW\ZapiCard_Backend\.env`
- Routes → `D:\WWW\ZapiCard_Backend\routes\web.php`
- Controller → `D:\WWW\ZapiCard_Backend\app\Http\Controllers\AuthController.php`
- CORS → `D:\WWW\ZapiCard_Backend\config\cors.php` ✅ (Already configured)

### Frontend:
- `.env.local` → `D:\Work\Zapi Card\.env.local`
- Login → `D:\Work\Zapi Card\app\login\page.jsx` ✅ (Already configured)
- Callback → `D:\Work\Zapi Card\app\auth\google\callback\page.jsx`

---

## ✅ Checklist

### Before Starting:
- [ ] Backend `.env` file configured
- [ ] Frontend `.env.local` file configured
- [ ] Google OAuth credentials set
- [ ] Google Console redirect URIs added
- [ ] Database configured
- [ ] Cache cleared

### After Setup:
- [ ] Local login works
- [ ] Production login works
- [ ] No CORS errors
- [ ] No "Invalid state" errors
- [ ] Token properly stored
- [ ] User redirected correctly

---

## 📚 Full Documentation

For detailed setup instructions, see:
- `COMPLETE_SETUP_GUIDE.md` - Complete step-by-step guide
- `GOOGLE_OAUTH_LIVE_FIX.md` - OAuth troubleshooting
- `GOOGLE_OAUTH_REDIRECT_FIX.md` - Redirect issues

---

**Last Updated:** All configurations verified and ready for both local and production! 🚀

