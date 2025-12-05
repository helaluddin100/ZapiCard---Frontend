// Dynamic Robots.txt for SEO
export default function robots() {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://zapycard.com'

    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: [
                    '/api/',
                    '/dashboard/',
                    '/admin/',
                    '/_next/',
                    '/checkout/',
                    '/orders/',
                ],
            },
            {
                userAgent: 'Googlebot',
                allow: '/',
                disallow: [
                    '/api/',
                    '/dashboard/',
                    '/admin/',
                    '/checkout/',
                    '/orders/',
                ],
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
    }
}

