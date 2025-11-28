# Google OAuth Login Setup Guide

এই guide-এ Google OAuth login setup করার সম্পূর্ণ process বর্ণনা করা হয়েছে।

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Google Cloud Console Setup](#google-cloud-console-setup)
3. [Backend Configuration](#backend-configuration)
4. [Frontend Configuration](#frontend-configuration)
5. [Testing](#testing)
6. [Troubleshooting](#troubleshooting)

---

## Prerequisites

- Google Account
- Laravel Backend running on `http://localhost:8000`
- Next.js Frontend running on `http://localhost:3000`
- Access to backend `.env` file

---

## Google Cloud Console Setup

### Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown at the top
3. Click **"New Project"**
4. Enter project name: `Zapi Card` (or your preferred name)
5. Click **"Create"**

### Step 2: Enable Google+ API

1. Go to **APIs & Services** > **Library**
2. Search for **"Google+ API"** or **"People API"**
3. Click on it and click **"Enable"**

### Step 3: Create OAuth 2.0 Credentials

1. Go to **APIs & Services** > **Credentials**
2. Click **"+ CREATE CREDENTIALS"** at the top
3. Select **"OAuth client ID"**

### Step 4: Configure OAuth Consent Screen

If prompted, configure the OAuth consent screen:

1. **User Type**: Select **"External"** (for testing) or **"Internal"** (for Google Workspace)
2. Click **"Create"**
3. Fill in the required information:
   - **App name**: `Zapi Card`
   - **User support email**: Your email
   - **Developer contact information**: Your email
4. Click **"Save and Continue"**
5. On **Scopes** page, click **"Save and Continue"**
6. On **Test users** page (if External), add test emails, then click **"Save and Continue"**
7. Click **"Back to Dashboard"**

### Step 5: Create OAuth Client ID

1. Go back to **Credentials** page
2. Click **"+ CREATE CREDENTIALS"** > **"OAuth client ID"**
3. **Application type**: Select **"Web application"**
4. **Name**: Enter `Zapi Card Web Client`
5. **Authorized JavaScript origins**: Add:
   ```
   http://localhost:8000
   http://localhost:3000
   ```
   **⚠️ Important:**
   - No trailing spaces or whitespace
   - No trailing slashes
   - Must be exact: `http://localhost:8000` (not `http://localhost:8000/`)
   - If you see "Invalid Origin: cannot contain whitespace" error, delete and re-add the URI

   (For production, add your actual domains)

6. **Authorized redirect URIs**: Add:
   ```
   http://localhost:8000/login/google/callback
   ```
   **⚠️ Important:**
   - Must be complete: `callback` (not `callbac` or `callbac `)
   - No trailing spaces
   - No trailing slashes
   - Exact match required: `http://localhost:8000/login/google/callback`

   (For production, add: `https://yourdomain.com/login/google/callback`)

7. Click **"Create"**

### Step 6: Copy Credentials

After creating, you'll see a popup with:
- **Client ID**: Copy this (looks like: `66718118026-q7q7mibgni9t1lk6crm3qivo3pnp7i4m.apps.googleusercontent.com`)
- **Client secret**: Copy this (looks like: `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`)

**Important**: Save these credentials securely. You'll need them for backend configuration.

---

## Backend Configuration

### Step 1: Update `.env` File

Backend folder (`D:\WWW\ZapiCard_Backend`) এর `.env` file এ নিচের variables add করুন:

```env
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-client-id-here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your-client-secret-here
GOOGLE_REDIRECT_URI=http://localhost:8000/login/google/callback

# Frontend URL (for redirects after OAuth)
FRONTEND_URL=http://localhost:3000
```

**Example:**
```env
GOOGLE_CLIENT_ID=123456789-abcdefghijklmnop.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abcdefghijklmnopqrstuvwxyz
GOOGLE_REDIRECT_URI=http://localhost:8000/login/google/callback
FRONTEND_URL=http://localhost:3000
```

### Step 2: Clear Config Cache

Backend terminal এ run করুন:

```bash
php artisan config:clear
php artisan cache:clear
```

### Step 3: Verify Configuration

Backend browser এ visit করুন:
```
http://localhost:8000/test-google-config
```

এই page এ দেখবেন:
- Client ID set আছে কিনা
- Redirect URI match করছে কিনা
- Configuration ঠিক আছে কিনা

---

## Frontend Configuration

### Step 1: Check Environment Variables

Frontend folder (`D:\Work\Zapi Card`) এ `.env.local` file create করুন (যদি না থাকে):

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### Step 2: Verify API URL

`lib/api.js` file এ check করুন যে `NEXT_PUBLIC_API_URL` properly configured আছে:

```javascript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'
```

---

## Testing

### Step 1: Start Backend Server

```bash
cd D:\WWW\ZapiCard_Backend
php artisan serve
```

Backend should run on `http://localhost:8000`

### Step 2: Start Frontend Server

```bash
cd D:\Work\Zapi Card
npm run dev
```

Frontend should run on `http://localhost:3000`

### Step 3: Test Google Login

1. Go to `http://localhost:3000/login`
2. Click **"Continue with Google"** button
3. You should be redirected to Google login page
4. Select your Google account
5. Grant permissions
6. You should be redirected back to your app and logged in

---

## Troubleshooting

### Problem 0: Common Configuration Errors in Google Cloud Console

**Error: "Invalid Origin: cannot contain whitespace"**
- **Cause**: There's a trailing space or whitespace in the JavaScript origin
- **Solution**: 
  1. Delete the URI with the error
  2. Type it again carefully: `http://localhost:3000` (no spaces before or after)
  3. Click outside the field to verify no error appears
  4. Click **"Save"**

**Error: Redirect URI incomplete (e.g., shows `callbac` instead of `callback`)**
- **Cause**: Typo or incomplete entry
- **Solution**:
  1. Delete the incomplete URI
  2. Add the complete URI: `http://localhost:8000/login/google/callback`
  3. Double-check spelling: `callback` (not `callbac`)
  4. Click **"Save"**

**General Tips:**
- Always copy-paste URIs to avoid typos
- After adding URIs, check for red error messages
- Wait 5-10 minutes after saving for changes to propagate

### Problem 1: "redirect_uri_mismatch" Error

এই error-টি সবচেয়ে common problem। এটি তখন হয় যখন backend থেকে পাঠানো redirect URI, Google Cloud Console-এ configured redirect URI-এর সাথে match করে না।

**Step-by-Step Solution:**

1. **Backend `.env` file check করুন:**
   
   Backend folder (`D:\WWW\ZapiCard_Backend`) এর `.env` file এ এই line আছে কিনা check করুন:
   ```env
   GOOGLE_REDIRECT_URI=http://localhost:8000/login/google/callback
   ```
   
   **⚠️ Important:**
   - No trailing slash: `http://localhost:8000/login/google/callback` ✅ (correct)
   - Wrong: `http://localhost:8000/login/google/callback/` ❌ (has trailing slash)
   - No spaces before or after
   - Must be exactly: `http://localhost:8000/login/google/callback`

2. **Google Cloud Console check করুন:**
   
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Navigate to **APIs & Services** > **Credentials**
   - Click on your OAuth 2.0 Client ID
   - **Authorized redirect URIs** section এ check করুন:
     - Must have: `http://localhost:8000/login/google/callback`
     - No trailing slash
     - No spaces
     - Exact match required

3. **Verify Backend Configuration:**
   
   Browser এ visit করুন:
   ```
   http://localhost:8000/test-google-config
   ```
   
   এই page এ দেখবেন:
   - `redirect_uri`: কি value set আছে
   - `expected_redirect`: কি হওয়া উচিত
   - `redirect_matches`: true/false (true হওয়া উচিত)

4. **Clear Config Cache:**
   
   Backend terminal এ run করুন:
   ```bash
   php artisan config:clear
   php artisan cache:clear
   ```

5. **Common Mistakes to Avoid:**
   - ❌ `http://localhost:8000/login/google/callback/` (trailing slash)
   - ❌ `http://localhost:8000/login/google/callback ` (trailing space)
   - ❌ ` http://localhost:8000/login/google/callback` (leading space)
   - ❌ `http://localhost:8000/login/google/callbac` (typo - incomplete)
   - ✅ `http://localhost:8000/login/google/callback` (correct)

6. **Wait for Changes to Propagate:**
   
   Google Cloud Console এ changes save করার পর **5-10 minutes** অপেক্ষা করুন। Google-এর side এ changes propagate হতে সময় লাগে।

**Quick Fix Checklist:**
- [ ] Backend `.env` এ `GOOGLE_REDIRECT_URI=http://localhost:8000/login/google/callback` আছে
- [ ] Google Cloud Console এ same URI add করা আছে
- [ ] No trailing slashes or spaces
- [ ] Config cache cleared
- [ ] 5-10 minutes waited after saving

### Problem 2: "Invalid client" Error

**Solution:**
- Google Cloud Console এ Client ID এবং Client Secret verify করুন
- Backend `.env` file এ credentials correctly paste করেছেন কিনা check করুন
- Config cache clear করুন: `php artisan config:clear`

### Problem 3: "Access blocked" Error

**Solution:**
- OAuth consent screen properly configured আছে কিনা check করুন
- Test users add করেছেন কিনা check করুন (External app এর জন্য)
- App verification status check করুন

### Problem 4: Redirect Loop বা Blank Page

**Solution:**
- Browser console এ errors check করুন
- Backend logs check করুন: `storage/logs/laravel.log`
- Frontend callback URL check করুন: `/auth/google/callback`
- Backend `FRONTEND_URL` environment variable check করুন

### Problem 5: Token Not Stored

**Solution:**
- Browser localStorage check করুন (Developer Tools > Application > Local Storage)
- Check করুন `auth_token` key আছে কিনা
- Frontend callback handler properly token receive করছে কিনা check করুন

### Problem 6: User Not Found After Login

**Solution:**
- Backend database এ `users` table check করুন
- User create হচ্ছে কিনা check করুন
- Backend logs check করুন for errors

---

## Production Setup

### For Production:

1. **Google Cloud Console:**
   - Create a new OAuth client for production
   - Add production domains to **Authorized JavaScript origins**
   - Add production callback URL: `https://yourdomain.com/login/google/callback`

2. **Backend `.env`:**
   ```env
   GOOGLE_CLIENT_ID=production-client-id
   GOOGLE_CLIENT_SECRET=production-client-secret
   GOOGLE_REDIRECT_URI=https://yourdomain.com/login/google/callback
   FRONTEND_URL=https://yourdomain.com
   ```

3. **Frontend `.env.production`:**
   ```env
   NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
   ```

4. **OAuth Consent Screen:**
   - Submit for verification (if using External app type)
   - Add privacy policy and terms of service URLs

---

## Important Notes

1. **Security:**
   - Never commit `.env` files to Git
   - Keep Client Secret secure
   - Use environment variables, never hardcode credentials

2. **Redirect URI:**
   - Must match exactly (including http/https, port, trailing slashes)
   - Google is very strict about this

3. **Testing:**
   - For local development, use `http://localhost:8000`
   - For production, use `https://yourdomain.com`
   - Don't mix local and production URLs

4. **Cache:**
   - Always clear config cache after changing `.env`:
     ```bash
     php artisan config:clear
     php artisan cache:clear
     ```

---

## Support

যদি সমস্যা হয়:

1. Backend logs check করুন: `storage/logs/laravel.log`
2. Browser console check করুন
3. Network tab এ requests check করুন
4. Google Cloud Console এ OAuth credentials verify করুন

---

## Quick Checklist

- [ ] Google Cloud Project created
- [ ] OAuth Consent Screen configured
- [ ] OAuth Client ID created
- [ ] Authorized redirect URI added: `http://localhost:8000/login/google/callback`
- [ ] Backend `.env` file updated with credentials
- [ ] Config cache cleared
- [ ] Frontend `.env.local` file configured
- [ ] Both servers running
- [ ] Tested login flow

---

**Last Updated:** January 2025

