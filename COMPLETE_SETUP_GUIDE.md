# 🚀 Complete Setup Guide - Local & Production

## ✅ এই Guide follow করলে Local এবং Production দু'জায়গাতেই সব কিছু perfectly কাজ করবে!

---

## 📋 TABLE OF CONTENTS

1. [Backend Environment Setup](#1-backend-environment-setup)
2. [Frontend Environment Setup](#2-frontend-environment-setup)
3. [Google OAuth Configuration](#3-google-oauth-configuration)
4. [CORS Configuration](#4-cors-configuration)
5. [Session Configuration](#5-session-configuration)
6. [Testing Checklist](#6-testing-checklist)
7. [Troubleshooting](#7-troubleshooting)

---

## 1. BACKEND ENVIRONMENT SETUP

### File: `D:\WWW\ZapiCard_Backend\.env`

### For LOCAL Development:

```env
APP_NAME="Zapy Card"
APP_ENV=local
APP_KEY=base64:your-app-key-here
APP_DEBUG=true
APP_URL=http://localhost:8000

# Frontend URL (where to redirect after Google OAuth success)
FRONTEND_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here
GOOGLE_REDIRECT_URI=http://localhost:8000/login/google/callback

# Session Configuration
SESSION_DRIVER=file
SESSION_LIFETIME=120
SESSION_DOMAIN=
SESSION_SECURE_COOKIE=false
SESSION_HTTP_ONLY=true
SESSION_SAME_SITE=lax

# Database
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=zapycard_db
DB_USERNAME=root
DB_PASSWORD=your-password
```

### For PRODUCTION (Live Server):

```env
APP_NAME="Zapy Card"
APP_ENV=production
APP_KEY=base64:your-production-app-key
APP_DEBUG=false
APP_URL=https://smart.buytiq.store

# Frontend URL (where to redirect after Google OAuth success)
FRONTEND_URL=https://zapycard.com

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here
GOOGLE_REDIRECT_URI=https://smart.buytiq.store/login/google/callback

# Session Configuration (Important for Production!)
SESSION_DRIVER=database
SESSION_LIFETIME=120
SESSION_DOMAIN=.smart.buytiq.store
SESSION_SECURE_COOKIE=true
SESSION_HTTP_ONLY=true
SESSION_SAME_SITE=lax

# Database (Production)
DB_CONNECTION=mysql
DB_HOST=your-production-db-host
DB_PORT=3306
DB_DATABASE=your-production-db
DB_USERNAME=your-production-db-user
DB_PASSWORD=your-production-db-password
```

### After updating .env, run:

```bash
cd D:\WWW\ZapiCard_Backend
php artisan config:clear
php artisan cache:clear
php artisan route:clear
```

---

## 2. FRONTEND ENVIRONMENT SETUP

### File: `D:\Work\Zapi Card\.env.local` (for local development)

```env
# API Configuration (Backend URL)
NEXT_PUBLIC_API_URL=http://localhost:8000/api

# Frontend URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Google OAuth Endpoint (Backend)
NEXT_PUBLIC_GOOGLE_AUTH_URL=http://localhost:8000/login/google

# Google Search Console Verification
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=nhjBmG9EOUqKItAkF4NotyGqM92zmsmVHo_Utl_IiS0
```

### File: `D:\Work\Zapi Card\.env.production` (for production build)

```env
# API Configuration (Backend URL)
NEXT_PUBLIC_API_URL=https://smart.buytiq.store/api

# Frontend URL
NEXT_PUBLIC_SITE_URL=https://zapycard.com

# Google OAuth Endpoint (Backend)
NEXT_PUBLIC_GOOGLE_AUTH_URL=https://smart.buytiq.store/login/google

# Google Search Console Verification
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=nhjBmG9EOUqKItAkF4NotyGqM92zmsmVHo_Utl_IiS0
```

### For Vercel/Netlify Deployment:

Add these as **Environment Variables** in your hosting platform:

1. Go to Project Settings → Environment Variables
2. Add all variables from `.env.production` above
3. Redeploy

---

## 3. GOOGLE OAUTH CONFIGURATION

### Step 1: Google Cloud Console Setup

**URL:** https://console.cloud.google.com/

1. Go to **APIs & Services** → **Credentials**
2. Click on your **OAuth 2.0 Client ID**
3. Update **Authorized redirect URIs**:

#### For LOCAL Development:
```
http://localhost:8000/login/google/callback
```

#### For PRODUCTION:
```
https://smart.buytiq.store/login/google/callback
```

### Step 2: Verify Configuration

**Test URL (Local):**
```
http://localhost:8000/test-google-config
```

This will show you if Google OAuth is properly configured.

---

## 4. CORS CONFIGURATION

### File: `D:\WWW\ZapiCard_Backend\config\cors.php`

✅ **Already Updated!** The file now includes:
- `https://zapycard.com` (Production Frontend)
- `http://localhost:3000` (Local Frontend)

No changes needed unless you add more domains.

---

## 5. SESSION CONFIGURATION

### For LOCAL Development:

**File:** `D:\WWW\ZapiCard_Backend\.env`
```env
SESSION_DRIVER=file
SESSION_DOMAIN=
SESSION_SECURE_COOKIE=false
```

### For PRODUCTION:

**File:** `D:\WWW\ZapiCard_Backend\.env`
```env
SESSION_DRIVER=database
SESSION_DOMAIN=.smart.buytiq.store
SESSION_SECURE_COOKIE=true
```

**Important:** If using `SESSION_DRIVER=database`, create sessions table:

```bash
php artisan session:table
php artisan migrate
```

---

## 6. TESTING CHECKLIST

### ✅ Local Development Testing:

- [ ] Backend running on `http://localhost:8000`
- [ ] Frontend running on `http://localhost:3000`
- [ ] Backend `.env` has `FRONTEND_URL=http://localhost:3000`
- [ ] Backend `.env` has `GOOGLE_REDIRECT_URI=http://localhost:8000/login/google/callback`
- [ ] Frontend `.env.local` has `NEXT_PUBLIC_API_URL=http://localhost:8000/api`
- [ ] Google Console has `http://localhost:8000/login/google/callback` in redirect URIs
- [ ] Test login: `http://localhost:3000/login` → Click "Login with Google"
- [ ] Should redirect to: `http://localhost:3000/auth/google/callback?token=...&status=success`

### ✅ Production Testing:

- [ ] Backend deployed on `https://smart.buytiq.store`
- [ ] Frontend deployed on `https://zapycard.com`
- [ ] Backend `.env` has `FRONTEND_URL=https://zapycard.com`
- [ ] Backend `.env` has `GOOGLE_REDIRECT_URI=https://smart.buytiq.store/login/google/callback`
- [ ] Frontend environment variables set in hosting platform
- [ ] Google Console has `https://smart.buytiq.store/login/google/callback` in redirect URIs
- [ ] Test login: `https://zapycard.com/login` → Click "Login with Google"
- [ ] Should redirect to: `https://zapycard.com/auth/google/callback?token=...&status=success`

---

## 7. TROUBLESHOOTING

### Problem 1: "Invalid state parameter"

**Solution:**
1. Check `SESSION_DOMAIN` in backend `.env`
2. For production: `SESSION_DOMAIN=.smart.buytiq.store`
3. Clear browser cookies
4. Clear Laravel cache: `php artisan config:clear`

### Problem 2: CORS Error

**Solution:**
1. Check `D:\WWW\ZapiCard_Backend\config\cors.php`
2. Ensure frontend URL is in `allowed_origins`
3. Clear cache: `php artisan config:clear`

### Problem 3: Redirect to wrong URL

**Solution:**
1. Check `FRONTEND_URL` in backend `.env`
2. Verify it matches your actual frontend domain
3. No trailing slash: `https://zapycard.com` ✅ (not `https://zapycard.com/` ❌)

### Problem 4: Google OAuth not working

**Solution:**
1. Verify Google Console redirect URI matches backend `.env`
2. Check `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are correct
3. Test: `https://smart.buytiq.store/test-google-config`

### Problem 5: Token with special characters not working

**Solution:**
✅ **Already Fixed!** Token is now URL encoded in `AuthController.php` (line 636)

---

## 📝 QUICK REFERENCE

### URLs:

| Environment | Frontend | Backend | API |
|------------|----------|---------|-----|
| **Local** | `http://localhost:3000` | `http://localhost:8000` | `http://localhost:8000/api` |
| **Production** | `https://zapycard.com` | `https://smart.buytiq.store` | `https://smart.buytiq.store/api` |

### Important Files:

**Backend:**
- `.env` → `D:\WWW\ZapiCard_Backend\.env`
- Routes → `D:\WWW\ZapiCard_Backend\routes\web.php`
- Controller → `D:\WWW\ZapiCard_Backend\app\Http\Controllers\AuthController.php`
- CORS → `D:\WWW\ZapiCard_Backend\config\cors.php`

**Frontend:**
- `.env.local` → `D:\Work\Zapi Card\.env.local`
- Login → `D:\Work\Zapi Card\app\login\page.jsx`
- Callback → `D:\Work\Zapi Card\app\auth\google\callback\page.jsx`

---

## 🎯 FINAL STEPS

1. **Update Backend .env** with correct values
2. **Update Frontend .env.local** for local development
3. **Set Frontend environment variables** in hosting platform for production
4. **Update Google Console** redirect URIs
5. **Clear all caches** (backend and frontend)
6. **Test locally** first
7. **Deploy and test** on production

---

## ✅ SUCCESS INDICATORS

When everything is working correctly:

1. ✅ Local login works: `http://localhost:3000/login` → Google login → Success
2. ✅ Production login works: `https://zapycard.com/login` → Google login → Success
3. ✅ No CORS errors in browser console
4. ✅ No "Invalid state parameter" errors
5. ✅ Token properly stored after login
6. ✅ User redirected to dashboard after login

---

**Need Help?** Check the troubleshooting section or review the specific fix guides:
- `GOOGLE_OAUTH_LIVE_FIX.md` - Detailed OAuth setup
- `GOOGLE_OAUTH_REDIRECT_FIX.md` - Redirect issues

