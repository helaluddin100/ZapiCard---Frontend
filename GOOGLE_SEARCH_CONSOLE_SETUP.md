# Google Search Console Setup Guide

## 🎯 Quick Setup Steps

### Method 1: DNS Verification (আপনি যেটা করছেন)

From your screenshot, copy this TXT record and add to your domain's DNS:
```
TXT Record: google-site-verification=nhjBmG9EOUqKItAkF4NotyGqM92zmsmVHo...
```

**Where to add DNS record:**
- GoDaddy: DNS Management → Add → TXT
- Namecheap: Advanced DNS → Add New Record → TXT
- Cloudflare: DNS → Add Record → TXT

### Method 2: HTML Meta Tag (Easier - Recommended)

1. **Get your verification code from Google Search Console:**
   - Go to Settings → Ownership verification
   - Choose "HTML tag"
   - Copy only the content value (e.g., "nhjBmG9EOUqKItAkF4N...")

2. **Add to environment file:**
   Create `.env.local` file in root directory:
   ```bash
   # Google Search Console Verification
   NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=your-verification-code-here
   
   # Site URL (change to your domain)
   NEXT_PUBLIC_SITE_URL=https://zapycard.com
   ```

3. **Deploy and verify:**
   - Deploy your site
   - Click "Verify" in Google Search Console

### Method 3: HTML File Upload

We've already created: `/public/google-site-verification.html`

1. Download the HTML file from Google Search Console
2. Replace content in `/public/google-site-verification.html`
3. Deploy your site
4. File will be available at: `https://yourdomain.com/google-site-verification.html`

## 📋 Complete Checklist

### ✅ Already Configured:
- [x] Sitemap at `/sitemap.xml`
- [x] Meta tag verification support in `metadata.js`
- [x] HTML file location ready
- [x] Robots.txt file
- [x] SEO metadata configuration

### 🔧 You Need To Do:

1. **Choose your domain:**
   - `zapycard.com` OR
   - `smart.buytiq.store`

2. **Update environment variables:**
   ```bash
   NEXT_PUBLIC_SITE_URL=https://your-chosen-domain.com
   NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=your-verification-code
   ```

3. **Deploy your site**

4. **Verify in Google Search Console**

## 🚀 After Verification

### Submit Your Sitemap:
1. Go to Google Search Console
2. Navigate to "Sitemaps"
3. Enter: `sitemap.xml`
4. Click "Submit"

### Check Coverage:
- Google will start crawling your site
- Check "Coverage" report after 24-48 hours
- Monitor "Performance" for search analytics

## 📝 Testing URLs

After deployment, these URLs should work:
- Sitemap: `https://yourdomain.com/sitemap.xml`
- Robots: `https://yourdomain.com/robots.txt`
- Verification file: `https://yourdomain.com/google-site-verification.html`

## 🔍 Troubleshooting

### If verification fails:
1. **DNS Method:** Wait 10-30 minutes for DNS propagation
2. **Meta Tag:** Check if environment variable is set correctly
3. **HTML File:** Ensure file is publicly accessible

### Check DNS propagation:
```bash
nslookup -type=TXT yourdomain.com
```

## 💡 Pro Tips

1. **Use Meta Tag method** - It's fastest and easiest
2. **Keep verification active** - Don't remove after verification
3. **Add multiple owners** - Add team members as owners
4. **Monitor regularly** - Check weekly for issues

## 🌐 For Production Deployment

### Vercel:
1. Go to Project Settings → Environment Variables
2. Add: `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`
3. Add: `NEXT_PUBLIC_SITE_URL`
4. Redeploy

### Netlify:
1. Site Settings → Environment Variables
2. Add both variables
3. Redeploy

### Traditional Hosting:
1. Create `.env.production` file
2. Add variables
3. Build and deploy

---

**Need Help?** 
- Google Search Console Help: https://support.google.com/webmasters
- DNS TXT Record Guide: https://support.google.com/a/answer/183895
