# Quick Fix: redirect_uri_mismatch Error

## 🔴 Error Message
```
Error 400: redirect_uri_mismatch
Access blocked: This app's request is invalid
```

## ✅ Quick Fix Steps

### Step 1: Check Backend `.env` File

Backend folder এ যান: `D:\WWW\ZapiCard_Backend\.env`

এই line আছে কিনা check করুন:
```env
GOOGLE_REDIRECT_URI=http://localhost:8000/login/google/callback
```

**যদি নেই বা ভুল থাকে:**
1. File open করুন
2. এই line add করুন বা fix করুন:
   ```env
   GOOGLE_REDIRECT_URI=http://localhost:8000/login/google/callback
   ```
3. **⚠️ Important:** 
   - No trailing slash (`/`)
   - No spaces
   - Exact spelling: `callback` (not `callbac`)

### Step 2: Clear Backend Cache

Backend terminal এ run করুন:
```bash
cd D:\WWW\ZapiCard_Backend
php artisan config:clear
php artisan cache:clear
```

### Step 3: Verify Configuration

Browser এ visit করুন:
```
http://localhost:8000/test-google-config
```

Check করুন:
- `redirect_uri` value কি?
- `expected_redirect` কি?
- `redirect_matches` true আছে?

### Step 4: Check Google Cloud Console

1. Go to: https://console.cloud.google.com/apis/credentials
2. আপনার OAuth 2.0 Client ID click করুন
3. **Authorized redirect URIs** section এ check করুন:
   - `http://localhost:8000/login/google/callback` আছে কিনা
   - যদি না থাকে, add করুন
   - যদি ভুল spelling থাকে, delete করে আবার add করুন

4. **Save** করুন

### Step 5: Wait and Test

1. **5-10 minutes** অপেক্ষা করুন (Google-এর side এ changes propagate হতে)
2. Browser cache clear করুন (Ctrl+Shift+Delete)
3. আবার login try করুন

## 🔍 Verification Checklist

- [ ] Backend `.env` এ `GOOGLE_REDIRECT_URI=http://localhost:8000/login/google/callback` আছে
- [ ] No trailing slash (`/`) নেই
- [ ] No spaces নেই
- [ ] Google Cloud Console এ same URI আছে
- [ ] Config cache cleared
- [ ] 5-10 minutes waited
- [ ] Browser cache cleared

## ❌ Common Mistakes

1. **Trailing Slash:**
   - ❌ `http://localhost:8000/login/google/callback/`
   - ✅ `http://localhost:8000/login/google/callback`

2. **Spaces:**
   - ❌ `http://localhost:8000/login/google/callback ` (trailing space)
   - ❌ ` http://localhost:8000/login/google/callback` (leading space)
   - ✅ `http://localhost:8000/login/google/callback`

3. **Typo:**
   - ❌ `http://localhost:8000/login/google/callbac` (incomplete)
   - ✅ `http://localhost:8000/login/google/callback`

4. **Wrong Port:**
   - ❌ `http://localhost:3000/login/google/callback` (frontend port)
   - ✅ `http://localhost:8000/login/google/callback` (backend port)

## 🆘 Still Not Working?

1. **Backend logs check করুন:**
   ```
   D:\WWW\ZapiCard_Backend\storage\logs\laravel.log
   ```
   Error messages খুঁজুন

2. **Browser Console check করুন:**
   - F12 press করুন
   - Console tab এ errors দেখুন
   - Network tab এ requests check করুন

3. **Test Configuration:**
   Visit: `http://localhost:8000/test-google-config`
   সব values verify করুন

4. **Double-check:**
   - Backend `.env` file save করেছেন?
   - Config cache clear করেছেন?
   - Google Cloud Console এ save করেছেন?
   - 5-10 minutes waited?

---

**Last Updated:** January 2025

