# 🚀 Quick Start Guide - Zapi Card Optimizations

## ⚡ 5-Minute Setup

### 1️⃣ Create Required Assets (5 min)

Visit https://realfavicongenerator.net/ and upload your logo:
- Download the generated files
- Place them in `public/` folder

**Minimum Required:**
```
public/
├── favicon.ico
├── apple-touch-icon.png  
├── icon-192x192.png
├── icon-512x512.png
└── og-image.jpg (Create at https://www.canva.com/ - Size: 1200x630px)
```

---

### 2️⃣ Set Environment Variables (2 min)

Create/Update `.env.local`:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

**For Production:**
```env
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
```

---

### 3️⃣ Test Locally (2 min)

```bash
# Start development server
npm run dev

# Visit these URLs to verify:
# ✅ http://localhost:3000 - Homepage
# ✅ http://localhost:3000/sitemap.xml - Sitemap
# ✅ http://localhost:3000/robots.txt - Robots
```

---

### 4️⃣ Build & Deploy (5 min)

```bash
# Test production build
npm run build

# If successful, deploy to your hosting provider
# (Vercel, Netlify, etc.)
```

---

## 📊 Quick Test Checklist

After deployment, test these:

- [ ] Homepage loads fast (< 2 seconds)
- [ ] Images are optimized (check Network tab)
- [ ] Sitemap works: `yourdomain.com/sitemap.xml`
- [ ] Robots.txt works: `yourdomain.com/robots.txt`
- [ ] Social sharing preview looks good
- [ ] Mobile responsive
- [ ] Dark mode works

---

## 🎯 Quick Performance Test

### Test #1: Lighthouse (in Chrome)
```
F12 → Lighthouse → Generate Report
```
**Target Scores:**
- Performance: 90+
- SEO: 100
- Accessibility: 95+
- Best Practices: 95+

### Test #2: PageSpeed
Visit: https://pagespeed.web.dev/
Enter your URL

---

## 🔧 Quick Troubleshooting

### Issue: Build fails
```bash
# Clear cache and rebuild
rm -rf .next
npm run build
```

### Issue: Images not loading
Check `next.config.js` - add your image domain:
```javascript
images: {
  domains: ['your-api-domain.com'],
}
```

### Issue: Metadata not showing
- Make sure page is Server Component
- Or remove 'use client' from page with metadata

---

## 📚 Full Documentation

- 📘 **Technical Guide:** `SEO_PERFORMANCE_GUIDE.md`
- ✅ **Step-by-Step:** `IMPLEMENTATION_CHECKLIST.md`  
- 📊 **Summary:** `IMPROVEMENT_SUMMARY.md`

---

## 🎉 You're Done!

Your Zapi Card is now:
- ✅ SEO Optimized
- ✅ Fast & Performant
- ✅ Accessible
- ✅ Production Ready

**Happy Coding! 🚀**

