# Google OAuth Login Fix for Production

## 🔴 Problem Identified:
**"Invalid state parameter"** error কারণ backend এবং frontend এর OAuth flow mismatch

## ✅ Solution Steps:

### 1. Backend (Laravel) Configuration Update করুন:

#### A. Environment File Update (.env):
```bash
# Frontend URLs
FRONTEND_URL=https://zapycard.com
# Or if different:
# FRONTEND_URL=https://your-frontend-domain.com

# Google OAuth Settings
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=https://smart.buytiq.store/login/google/callback

# Session Configuration
SESSION_DRIVER=cookie
SESSION_LIFETIME=120
SESSION_SECURE_COOKIE=true
SESSION_SAME_SITE=none
```

#### B. Update `config/services.php`:
```php
'google' => [
    'client_id' => env('GOOGLE_CLIENT_ID'),
    'client_secret' => env('GOOGLE_CLIENT_SECRET'),
    'redirect' => env('GOOGLE_REDIRECT_URI'),
],
```

#### C. Update GoogleController (Backend):
```php
// app/Http/Controllers/Auth/GoogleController.php

public function handleGoogleCallback()
{
    try {
        $user = Socialite::driver('google')->user();
        
        // ... user login/registration logic ...
        
        $token = $user->createToken('auth-token')->plainTextToken;
        
        // Redirect to FRONTEND callback, not backend
        $frontendUrl = env('FRONTEND_URL', 'https://zapycard.com');
        
        return redirect($frontendUrl . '/auth/google/callback?' . http_build_query([
            'status' => 'success',
            'token' => $token,
        ]));
        
    } catch (\Exception $e) {
        $frontendUrl = env('FRONTEND_URL', 'https://zapycard.com');
        
        return redirect($frontendUrl . '/auth/google/callback?' . http_build_query([
            'status' => 'error',
            'message' => 'Authentication failed'
        ]));
    }
}
```

#### D. CORS Configuration Update:
```php
// config/cors.php
'allowed_origins' => [
    'https://zapycard.com',
    'https://smart.buytiq.store',
    'http://localhost:3000', // for development
],

'supports_credentials' => true,
```

### 2. Google Console Configuration:

#### Go to: https://console.cloud.google.com/

1. Select your project
2. Go to **APIs & Services** → **Credentials**
3. Click on your OAuth 2.0 Client ID
4. Add these **Authorized redirect URIs**:
   ```
   https://smart.buytiq.store/login/google/callback
   https://zapycard.com/auth/google/callback
   http://localhost:8000/login/google/callback (for dev)
   http://localhost:3000/auth/google/callback (for dev)
   ```
5. Save changes

### 3. Frontend Updates (Already Done):

Update these files with production detection:

```javascript
// app/login/page.jsx & app/signup/page.jsx

const handleSocialLogin = async (provider) => {
  if (provider === 'google') {
    // Detect if production
    const isProduction = typeof window !== 'undefined' && 
      (window.location.hostname === 'zapycard.com' || 
       window.location.hostname === 'www.zapycard.com')
    
    // Use appropriate backend URL
    const backendUrl = isProduction 
      ? 'https://smart.buytiq.store'
      : 'http://localhost:8000'
    
    // Redirect to backend Google OAuth endpoint
    window.location.href = `${backendUrl}/login/google`
  }
}
```

### 4. Test OAuth Flow:

1. **Clear browser cookies** and cache
2. Try login again
3. Flow should be:
   - User clicks "Login with Google" → Goes to `smart.buytiq.store/login/google`
   - Google authentication → Redirects to `smart.buytiq.store/login/google/callback`
   - Backend processes → Redirects to `zapycard.com/auth/google/callback?token=xxx`
   - Frontend handles token → Redirects to dashboard

### 5. Debug Checklist:

- [ ] Frontend URL is correct in backend .env
- [ ] Google Console has all redirect URIs
- [ ] CORS is configured properly
- [ ] Session cookies are set to `secure` and `same_site=none`
- [ ] SSL certificates are valid on both domains

### 6. Alternative Quick Fix:

If backend changes are difficult, create a middleware route in Next.js:

```javascript
// app/api/auth/google/route.js
export async function GET(request) {
  const searchParams = request.nextUrl.searchParams
  const token = searchParams.get('token')
  const status = searchParams.get('status')
  
  // Redirect to proper frontend callback
  return NextResponse.redirect(
    new URL(`/auth/google/callback?token=${token}&status=${status}`, request.url)
  )
}
```

Then update backend to redirect to: `https://zapycard.com/api/auth/google`

## 📌 Important Notes:

1. **State parameter** is used for CSRF protection in OAuth
2. If using different domains, ensure **cookies** work cross-domain
3. **SSL/HTTPS** is required for production OAuth
4. Test in **incognito/private** mode to avoid cache issues

## 🚀 Immediate Action Required:

1. Update backend Laravel code
2. Add redirect URIs in Google Console
3. Set FRONTEND_URL in backend .env
4. Clear all caches and test
