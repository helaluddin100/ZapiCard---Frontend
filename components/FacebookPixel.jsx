'use client'

import { useEffect, Suspense } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

function FacebookPixelContent() {
    const pathname = usePathname()
    const searchParams = useSearchParams()

    useEffect(() => {
        // Get Facebook Pixel ID from environment variable
        const pixelId = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID
        const testEventCode = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_TEST_CODE

        if (!pixelId) {
            // Only show warning in development, suppress in production
            if (process.env.NODE_ENV === 'development') {
                // Silently skip - don't show warning
            }
            return
        }

        // Initialize Facebook Pixel
        if (typeof window !== 'undefined' && !window.fbq) {
            !function (f, b, e, v, n, t, s) {
                if (f.fbq) return; n = f.fbq = function () {
                    n.callMethod ?
                        n.callMethod.apply(n, arguments) : n.queue.push(arguments)
                };
                if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0';
                n.queue = []; t = b.createElement(e); t.async = !0;
                t.src = v; s = b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t, s)
            }(window, document, 'script',
                'https://connect.facebook.net/en_US/fbevents.js');

            // Initialize with test event code if provided
            if (testEventCode) {
                window.fbq('init', pixelId, {
                    test_event_code: testEventCode
                })
                console.log('Facebook Pixel initialized with Test Event Code:', testEventCode)
            } else {
                window.fbq('init', pixelId)
            }
            window.fbq('track', 'PageView')
        }

        // Track page views on route changes
        if (typeof window !== 'undefined' && window.fbq) {
            window.fbq('track', 'PageView')
        }
    }, [pathname, searchParams])

    return null
}

export default function FacebookPixel() {
    return (
        <Suspense fallback={null}>
            <FacebookPixelContent />
        </Suspense>
    )
}

