// Dynamic robots.txt generation for SEO
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
                    '/health-dashboard/card/*/edit',
                    '/health-dashboard/card/*/entry',
                    '/dashboard/edit/',
                    '/dashboard/create',
                ],
            },
            {
                userAgent: 'Googlebot',
                allow: '/',
                disallow: [
                    '/api/',
                    '/dashboard/',
                    '/admin/',
                    '/_next/',
                ],
                crawlDelay: 0,
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
        host: baseUrl,
    }
}