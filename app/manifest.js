// Web App Manifest for PWA support
export default function manifest() {
    return {
        name: 'Zapi Card - Smart Digital Visiting Cards',
        short_name: 'Zapi Card',
        description: 'Create stunning digital business cards with NFC and QR code technology',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#3b82f6',
        icons: [
            {
                src: '/icon-192x192.png',
                sizes: '192x192',
                type: 'image/png',
                purpose: 'any maskable',
            },
            {
                src: '/icon-512x512.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'any maskable',
            },
        ],
        categories: ['business', 'productivity', 'utilities'],
        orientation: 'portrait-primary',
        scope: '/',
        lang: 'en-US',
    }
}

