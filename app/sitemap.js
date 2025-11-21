// Dynamic Sitemap for SEO
export default async function sitemap() {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://zapicard.com'

    // Static routes
    const routes = [
        '',
        '/about',
        '/contact',
        '/login',
        '/signup',
        '/nfc-order',
        '/testimonials',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: route === '' ? 'daily' : 'weekly',
        priority: route === '' ? 1 : 0.8,
    }))

    // Add dashboard routes (lower priority, only if logged in)
    const dashboardRoutes = [
        '/dashboard',
        '/dashboard/create',
        '/dashboard/my-cards',
        '/dashboard/profile',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.6,
    }))

    // You can add dynamic routes here by fetching from API
    // Example: Fetch all public cards
    // const cards = await fetch(`${baseUrl}/api/cards/public`).then(res => res.json())
    // const cardRoutes = cards.map(card => ({
    //   url: `${baseUrl}/card/${card.slug}`,
    //   lastModified: new Date(card.updated_at),
    //   changeFrequency: 'monthly',
    //   priority: 0.7,
    // }))

    return [...routes, ...dashboardRoutes]
}

