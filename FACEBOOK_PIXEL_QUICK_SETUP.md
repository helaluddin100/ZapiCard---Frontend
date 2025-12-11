# Facebook Pixel Quick Setup

## আপনার দেওয়া Information:

- **Facebook Pixel ID:** `2117458195728620`
- **Test Event Code:** `TEST27913`

## Setup Steps:

### 1. `.env.local` ফাইল তৈরি করুন

Project root-এ `.env.local` ফাইল তৈরি করুন এবং নিচের content যোগ করুন:

```env
# Facebook Pixel Configuration
NEXT_PUBLIC_FACEBOOK_PIXEL_ID=2117458195728620
NEXT_PUBLIC_FACEBOOK_PIXEL_TEST_CODE=TEST27913
```

### 2. Development Server Restart করুন

```bash
npm run dev
```

### 3. Test করুন

1. Browser-এ website open করুন
2. Browser Console (F12) open করুন
3. দেখবেন: `Facebook Pixel initialized with Test Event Code: TEST27913`
4. Facebook Events Manager → **Test Events** tab-এ real-time events দেখবেন

### 4. Test Events Verify করুন

1. [Facebook Events Manager](https://business.facebook.com/events_manager2) এ যান
2. আপনার Pixel select করুন
3. **Test Events** tab-এ click করুন
4. Website-এ navigate করুন - সব events real-time এ দেখবেন

### 5. Production-এ Deploy করার সময়

Production environment-এ test event code remove করুন:

```env
# Production - Test Event Code remove করুন
NEXT_PUBLIC_FACEBOOK_PIXEL_ID=2117458195728620
# NEXT_PUBLIC_FACEBOOK_PIXEL_TEST_CODE=TEST27913  # Remove this line
```

## Event Tracking Examples:

```javascript
import { trackPurchase, trackCardCreated, trackCompleteRegistration } from '@/lib/facebook-pixel'

// Purchase track করুন
trackPurchase({
  name: 'NFC Card',
  ids: ['card-123'],
  value: 29.99,
  currency: 'USD',
  num_items: 1
})

// Card creation track করুন
trackCardCreated({
  id: 'card-123',
  type: 'standard'
})

// Registration track করুন
trackCompleteRegistration('email')
```

## Troubleshooting:

- **Pixel load হচ্ছে না?** → `.env.local` file check করুন, server restart করুন
- **Test events দেখা যাচ্ছে না?** → Facebook Events Manager → Test Events tab check করুন
- **Console-এ error?** → Browser console check করুন, pixel ID সঠিক কিনা verify করুন

## Support:

সম্পূর্ণ documentation: `FACEBOOK_PIXEL_SETUP.md`

