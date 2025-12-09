# Google OAuth Live Server Fix Guide

## ⚠️ PROBLEM IDENTIFIED:
"Invalid state parameter" - Google is redirecting to frontend instead of backend

## 🌐 URL CONFIGURATION:

### Production URLs:
- **Frontend URL:** `https://zapycard.com`
- **Backend URL:** `https://smart.buytiq.store`
- **API Base URL:** `https://smart.buytiq.store/api`
- **Google OAuth Redirect:** `https://smart.buytiq.store/login/google/callback`

### Development URLs:
- **Frontend URL:** `http://localhost:3000`
- **Backend URL:** `http://localhost:8000`
- **API Base URL:** `http://localhost:8000/api`
- **Google OAuth Redirect:** `http://localhost:8000/login/google/callback`

## 📁 IMPORTANT FILES REFERENCE:

### Backend Files (Laravel):
- **Environment:** `D:\WWW\ZapiCard_Backend\.env`
- **Routes:** `D:\WWW\ZapiCard_Backend\routes\web.php`
- **Controller:** `D:\WWW\ZapiCard_Backend\app\Http\Controllers\AuthController.php`
- **CORS Config:** `D:\WWW\ZapiCard_Backend\config\cors.php`
- **Session Config:** `D:\WWW\ZapiCard_Backend\config\session.php`
- **App Config:** `D:\WWW\ZapiCard_Backend\config\app.php`
- **Logs:** `D:\WWW\ZapiCard_Backend\storage\logs\laravel.log`

### Frontend Files (Next.js):
- **Environment:** `D:\Work\Zapi Card\.env.local`
- **Login Page:** `D:\Work\Zapi Card\app\login\page.jsx`
- **Callback Page:** `D:\Work\Zapi Card\app\auth\google\callback\page.jsx`

## 🔧 IMMEDIATE FIX:

### Step 1: Google Cloud Console Configuration

**Location:** https://console.cloud.google.com/ (Web Interface)

1. Go to: https://console.cloud.google.com/
2. Select your project
3. Navigate to: **APIs & Services** → **Credentials**
4. Click on your **OAuth 2.0 Client ID**
5. Update **Authorized redirect URIs**:

#### REMOVE (if exists):
```
https://smart.buytiq.store/auth/google/callback
https://zapycard.com/auth/google/callback
```

#### ADD (Backend URLs):
```
https://smart.buytiq.store/login/google/callback
http://localhost:8000/login/google/callback (for local testing)
```

**Important:** 
- Frontend URL: `https://zapycard.com`
- Backend URL: `https://smart.buytiq.store`

### Step 2: Backend Environment Variables

**File Path:** `D:\WWW\ZapiCard_Backend\.env`

Open and update your Laravel backend `.env` file:
```env
# Google OAuth
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_REDIRECT_URI=https://smart.buytiq.store/login/google/callback

# Frontend URL (where to redirect after success)
FRONTEND_URL=https://zapycard.com

# Backend URL
APP_URL=https://smart.buytiq.store
```

**After updating, run:**
```bash
cd D:\WWW\ZapiCard_Backend
php artisan config:clear
```

### Step 3: Frontend Environment Variables

**File Path:** `D:\Work\Zapi Card\.env.local` (create if doesn't exist)

Create or update `.env.local` file in your Next.js project root:
```env
# API Configuration (Backend URL)
NEXT_PUBLIC_API_URL=https://smart.buytiq.store/api

# Frontend URL
NEXT_PUBLIC_SITE_URL=https://zapycard.com

# Google OAuth Endpoint (Backend)
NEXT_PUBLIC_GOOGLE_AUTH_URL=https://smart.buytiq.store/login/google
```

**Note:** For production deployment (Vercel/Netlify), add these as environment variables in your hosting platform settings.

### Step 4: Verify Backend Routes

**File Path:** `D:\WWW\ZapiCard_Backend\routes\web.php`

Check your Laravel routes file. It should have:
```php
// Google OAuth routes
Route::get('login/google', [AuthController::class, 'redirectToGoogle']);
Route::get('login/google/callback', [AuthController::class, 'handleGoogleCallback']);
```

**Or check:** `D:\WWW\ZapiCard_Backend\routes\api.php` if routes are in API file.

### Step 5: Verify Frontend Login Button

**File Path:** `D:\Work\Zapi Card\app\login\page.jsx`

The login button should redirect to backend. Check around **line 148-154**:
```javascript
// ✅ CORRECT (Frontend already has this)
const handleGoogleLogin = () => {
  const backendUrl = isProduction
    ? 'https://smart.buytiq.store'  // Backend URL
    : 'http://localhost:8000'
  window.location.href = `${backendUrl}/login/google`
}
```

**Verify this code exists in:** `D:\Work\Zapi Card\app\login\page.jsx`

**Expected Flow:**
1. User clicks "Login with Google" on `https://zapycard.com/login`
2. Redirects to: `https://smart.buytiq.store/login/google` (Backend)
3. Backend redirects to Google OAuth
4. Google redirects back to: `https://smart.buytiq.store/login/google/callback` (Backend)
5. Backend processes and redirects to: `https://zapycard.com/auth/google/callback?token=...&status=success` (Frontend)

## 🔍 DEBUGGING STEPS:

### 1. Test Backend OAuth Endpoint:
**Test URL:** Visit this URL directly in browser:
```
https://smart.buytiq.store/login/google
```

It should redirect you to Google login page.

### 2. Check Laravel Logs:
**File Path:** `D:\WWW\ZapiCard_Backend\storage\logs\laravel.log`

**On Local Machine:**
```bash
cd D:\WWW\ZapiCard_Backend
tail -f storage/logs/laravel.log
```

**On Live Server (SSH):**
```bash
# SSH into your server
cd /path/to/ZapiCard_Backend
tail -f storage/logs/laravel.log
```

### 3. Verify Session Configuration:
**File Path:** `D:\WWW\ZapiCard_Backend\.env`

Update your Laravel `.env` file:
```env
SESSION_DRIVER=file
# or for production (recommended):
SESSION_DRIVER=database

# Important for production:
SESSION_DOMAIN=.smart.buytiq.store
SESSION_SECURE_COOKIE=true
SESSION_HTTP_ONLY=true
SESSION_SAME_SITE=lax
```

**Also check:** `D:\WWW\ZapiCard_Backend\config\session.php` for session configuration.

### 4. Clear Laravel Cache:
**Run in:** `D:\WWW\ZapiCard_Backend` directory
```bash
cd D:\WWW\ZapiCard_Backend
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear
```

## 💡 COMMON ISSUES & FIXES:

### Issue 1: State Parameter Mismatch
**Cause:** Session not persisting between requests

**Fix Files:**
- **File Path:** `D:\WWW\ZapiCard_Backend\.env`
  - Check `SESSION_DOMAIN` setting
  - Ensure cookies are enabled
  - Use database or redis session driver for production

- **File Path:** `D:\WWW\ZapiCard_Backend\config\session.php`
  - Verify session driver configuration
  - Check cookie settings

### Issue 2: CORS Error
**Cause:** Frontend and backend on different domains

**Fix File:** `D:\WWW\ZapiCard_Backend\config\cors.php`

Update Laravel CORS config:
```php
// File: D:\WWW\ZapiCard_Backend\config\cors.php
'allowed_origins' => [
    'https://zapycard.com',
    'https://smart.buytiq.store',
    'http://localhost:3000'
],
```

**After updating, run:**
```bash
cd D:\WWW\ZapiCard_Backend
php artisan config:clear
```

### Issue 3: Wrong Redirect After Success
**Cause:** Backend not configured with correct frontend URL

**Fix File:** `D:\WWW\ZapiCard_Backend\app\Http\Controllers\AuthController.php`

The callback method should already be correct (around line 635-636):
```php
// File: D:\WWW\ZapiCard_Backend\app\Http\Controllers\AuthController.php
// In handleGoogleCallback() method
$frontendUrl = env('FRONTEND_URL', 'http://localhost:3000');
return redirect($frontendUrl . '/auth/google/callback?token=' . urlencode($token) . '&status=success');
```

**Make sure:** `D:\WWW\ZapiCard_Backend\.env` has:
```env
FRONTEND_URL=https://zapycard.com
```

**Also check:** `D:\WWW\ZapiCard_Backend\config\app.php` if needed, but using `.env` is preferred.

## 🚀 QUICK TEST:

1. **Clear browser cookies** for smart.buytiq.store
2. **Try login again**
3. **Check Network tab** in browser DevTools
4. **Look for:** 
   - Initial redirect to `/login/google`
   - Google redirect
   - Callback to backend `/login/google/callback`
   - Final redirect to frontend with token

## 📝 VERIFICATION CHECKLIST:

- [ ] **Google Console** (https://console.cloud.google.com/) has backend callback URL: `https://smart.buytiq.store/login/google/callback`
- [ ] **File:** `D:\WWW\ZapiCard_Backend\.env` has:
  - `FRONTEND_URL=https://zapycard.com`
  - `GOOGLE_REDIRECT_URI=https://smart.buytiq.store/login/google/callback`
  - `APP_URL=https://smart.buytiq.store`
- [ ] **File:** `D:\WWW\ZapiCard_Backend\.env` has correct `SESSION_DOMAIN` and session settings
- [ ] **File:** `D:\WWW\ZapiCard_Backend\config\cors.php` has `https://zapycard.com` in allowed_origins
- [ ] **File:** `D:\Work\Zapi Card\.env.local` has:
  - `NEXT_PUBLIC_API_URL=https://smart.buytiq.store/api`
  - `NEXT_PUBLIC_SITE_URL=https://zapycard.com`
- [ ] **File:** `D:\Work\Zapi Card\app\login\page.jsx` redirects to `https://smart.buytiq.store/login/google`
- [ ] **File:** `D:\WWW\ZapiCard_Backend\app\Http\Controllers\AuthController.php` redirects to `https://zapycard.com/auth/google/callback` after success
- [ ] **File:** `D:\WWW\ZapiCard_Backend\routes\web.php` has Google OAuth routes defined

## 🆘 IF STILL NOT WORKING:

Share these details:
1. **File:** `D:\WWW\ZapiCard_Backend\.env` (hide sensitive data like CLIENT_SECRET)
2. **Screenshot:** Google Console redirect URIs (https://console.cloud.google.com/)
3. **Screenshot:** Browser Network tab during login attempt
4. **File Content:** `D:\WWW\ZapiCard_Backend\storage\logs\laravel.log` (last 50 lines)
5. **File Content:** `D:\WWW\ZapiCard_Backend\routes\web.php` (Google OAuth routes section)
6. **File Content:** `D:\Work\Zapi Card\app\login\page.jsx` (handleGoogleLogin function)

---

**Note:** The main issue is that Google must redirect to your BACKEND callback URL, not frontend. The backend will handle the OAuth flow and then redirect to frontend with the token.
