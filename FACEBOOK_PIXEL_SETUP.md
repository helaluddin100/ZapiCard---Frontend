# Facebook Pixel Setup Guide

This guide will help you set up Facebook Pixel for tracking user events and conversions on your Zapy Card application.

## Prerequisites

1. A Facebook Business account
2. Access to Facebook Events Manager
3. A Facebook Pixel ID

## Step 1: Get Your Facebook Pixel ID

1. Go to [Facebook Events Manager](https://business.facebook.com/events_manager2)
2. Click on **Connect Data Sources** → **Web**
3. Select **Facebook Pixel** and click **Connect**
4. Name your pixel (e.g., "Zapy Card Pixel")
5. Copy your **Pixel ID** (it looks like: `123456789012345`)

## Step 2: Configure Environment Variables

1. Create a `.env.local` file in the root of your project (if it doesn't exist)
2. Add your Facebook Pixel ID:

```env
NEXT_PUBLIC_FACEBOOK_PIXEL_ID=your_pixel_id_here
```

3. (Optional) Add Test Event Code for testing:

```env
NEXT_PUBLIC_FACEBOOK_PIXEL_ID=2117458195728620
NEXT_PUBLIC_FACEBOOK_PIXEL_TEST_CODE=TEST27913
```

**Important:** 
- Replace `your_pixel_id_here` with your actual Pixel ID
- The variable name must start with `NEXT_PUBLIC_` to be accessible in the browser
- Test Event Code is optional - only add it when you want to test events
- Never commit `.env.local` to version control

### Test Event Setup

To test Facebook Pixel events before going live:

1. Go to [Facebook Events Manager](https://business.facebook.com/events_manager2)
2. Select your Pixel
3. Go to **Test Events** tab
4. Click **Test Events** → **Generate Test Event Code**
5. Copy the test event code (e.g., `TEST27913`)
6. Add it to your `.env.local` file as `NEXT_PUBLIC_FACEBOOK_PIXEL_TEST_CODE`
7. Restart your development server
8. All events will now appear in the Test Events tab in real-time

**Note:** Remove the test event code from production environment variables when you're ready to go live.

## Step 3: Restart Your Development Server

After adding the environment variable, restart your Next.js development server:

```bash
npm run dev
```

## Step 4: Verify Installation

1. Open your website in a browser
2. Open the browser's Developer Tools (F12)
3. Go to the **Console** tab
4. You should see: `Facebook Pixel event tracked: PageView`
5. If test event code is set, you should see: `Facebook Pixel initialized with Test Event Code: TEST27913`
6. Install the [Facebook Pixel Helper Chrome Extension](https://chrome.google.com/webstore/detail/facebook-pixel-helper/fdgfkebogiimcoedlicjlajpkdmockpc) to verify pixel is firing correctly
7. If using test events, check Facebook Events Manager → **Test Events** tab to see events in real-time

## Available Event Tracking Functions

The Facebook Pixel utility (`lib/facebook-pixel.js`) provides the following tracking functions:

### Standard Events

- `trackPageView()` - Track page views
- `trackViewContent(contentName, contentCategory)` - Track content views
- `trackSearch(searchString)` - Track searches
- `trackAddToCart(productData)` - Track add to cart
- `trackInitiateCheckout(checkoutData)` - Track checkout initiation
- `trackPurchase(purchaseData)` - Track purchases
- `trackCompleteRegistration(registrationMethod)` - Track registrations
- `trackStartTrial(registrationMethod)` - Track trial starts
- `trackLead(leadData)` - Track leads
- `trackContact()` - Track contact form submissions
- `trackSubscribe(subscriptionType)` - Track subscriptions

### Custom Events

- `trackCardCreated(cardData)` - Track when a user creates a card
- `trackCardViewed(cardId)` - Track when a user views a card
- `trackCardShared(cardId, shareMethod)` - Track when a user shares a card
- `trackAppointmentBooked(appointmentData)` - Track appointment bookings

### Generic Functions

- `trackEvent(eventName, eventData)` - Track any custom event
- `trackCustom(eventName, eventData, customData)` - Track custom events with additional data

## Usage Examples

### Track a Purchase

```javascript
import { trackPurchase } from '@/lib/facebook-pixel'

// After a successful purchase
trackPurchase({
  name: 'NFC Card',
  ids: ['card-123'],
  value: 29.99,
  currency: 'USD',
  num_items: 1
})
```

### Track Card Creation

```javascript
import { trackCardCreated } from '@/lib/facebook-pixel'

// After a user creates a card
trackCardCreated({
  id: 'card-123',
  type: 'standard'
})
```

### Track Registration

```javascript
import { trackCompleteRegistration } from '@/lib/facebook-pixel'

// After user signs up
trackCompleteRegistration('email')
```

### Track Custom Event

```javascript
import { trackEvent } from '@/lib/facebook-pixel'

// Track any custom event
trackEvent('ButtonClick', {
  button_name: 'Get Started',
  page: 'homepage'
})
```

## Where to Add Event Tracking

Here are some recommended places to add event tracking:

1. **Signup Page** - Track `CompleteRegistration` when user signs up
2. **Card Creation** - Track `CardCreated` when user creates a card
3. **Product Pages** - Track `ViewContent` when viewing products
4. **Checkout** - Track `InitiateCheckout` and `Purchase`
5. **Contact Form** - Track `Contact` when form is submitted
6. **Card Views** - Track `CardViewed` when someone views a card
7. **Appointments** - Track `AppointmentBooked` when appointment is scheduled

## Testing

1. Use Facebook Pixel Helper extension to verify events are firing
2. Check Facebook Events Manager → Test Events to see real-time events
3. Use browser console to see event tracking logs

## Troubleshooting

### Pixel Not Loading

- Check that `NEXT_PUBLIC_FACEBOOK_PIXEL_ID` is set in `.env.local`
- Restart your development server after adding the environment variable
- Check browser console for any errors
- Verify the Pixel ID is correct

### Events Not Tracking

- Ensure you're importing the tracking functions correctly
- Check browser console for warnings or errors
- Verify Facebook Pixel is loaded: `window.fbq` should be available
- Check Facebook Events Manager → Test Events for real-time verification

### Production Deployment

Make sure to add the `NEXT_PUBLIC_FACEBOOK_PIXEL_ID` environment variable to your production hosting platform (Vercel, Netlify, etc.)

## Privacy & Compliance

- Ensure you have a Privacy Policy that mentions Facebook Pixel
- Consider adding cookie consent if required by your jurisdiction
- Facebook Pixel automatically respects Do Not Track settings
- Review Facebook's [Data Processing Terms](https://www.facebook.com/legal/terms/dataprocessing)

## Support

For more information, visit:
- [Facebook Pixel Documentation](https://developers.facebook.com/docs/meta-pixel)
- [Facebook Events Manager](https://business.facebook.com/events_manager2)

