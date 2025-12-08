# Production Environment Setup Guide

## Image URL Issue Fix

### Problem
Product images not showing on live server (smart.buytiq.store)

### Solution Implemented

We've updated the following files to automatically detect when running on production and use the correct base URL:

1. **app/dashboard/products/page.jsx** - Product listing page
2. **components/products/productUtils.js** - Product utility functions
3. **app/dashboard/products/[slug]/checkout/page.jsx** - Checkout page
4. **app/dashboard/my-cards/page.jsx** - My Cards page
5. **app/health-card/[username]/[slug]/page.jsx** - Public health card page

### How It Works

The code now automatically detects if it's running on production by checking the hostname:
```javascript
const isProduction = typeof window !== 'undefined' && 
    (window.location.hostname === 'smart.buytiq.store' || 
     window.location.hostname === 'www.smart.buytiq.store')
```

When on production, it uses: `https://smart.buytiq.store/api`
When on development, it uses: `http://localhost:8000/api` (or env variable)

### Alternative Method: Environment Variables

If you prefer to use environment variables instead of automatic detection:

1. **Create `.env.production` file** in the root directory:
```bash
# Production Environment
NEXT_PUBLIC_API_URL=https://smart.buytiq.store/api
NEXT_PUBLIC_BASE_URL=https://smart.buytiq.store
```

2. **For local development**, create `.env.local`:
```bash
# Development Environment
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_BASE_URL=http://localhost:8000
```

### Deployment Instructions

1. **Build the project:**
```bash
npm run build
```

2. **Deploy to your hosting service**

3. **Set environment variables on your hosting platform:**
   - If using Vercel, Netlify, or similar:
     - Add `NEXT_PUBLIC_API_URL=https://smart.buytiq.store/api`
     - Add `NEXT_PUBLIC_BASE_URL=https://smart.buytiq.store`

### Testing

After deployment, verify that:
1. Product images are loading correctly
2. All API calls are working
3. Image URLs are using the correct base domain (`https://smart.buytiq.store`)

### Troubleshooting

If images still don't load:
1. Check browser console for errors
2. Verify API response contains correct image paths
3. Ensure CORS is properly configured on the backend
4. Check if images exist at the expected paths on the server

### Backend Requirements

Ensure your backend (Laravel) is configured to:
1. Serve images from `storage/` directory
2. Return correct image paths in API responses
3. Have proper CORS configuration for the frontend domain
