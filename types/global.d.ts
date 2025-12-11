/**
 * Global type declarations for Facebook Pixel
 */

interface Window {
  fbq?: (
    action: 'init' | 'track' | 'trackCustom',
    eventName: string,
    eventData?: Record<string, any>
  ) => void
  _fbq?: any
}

