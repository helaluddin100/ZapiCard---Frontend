// SEO Metadata Configuration
export const siteConfig = {
    name: 'Zapy Card',
    title: 'Zapy Card - Smart Health Card & Digital Visiting Cards | NFC & QR Technology',
    description: 'Revolutionary smart cards for business and healthcare. Create digital visiting cards with appointment booking, and smart health cards with AI prescription reading for patients and pregnant women. NFC & QR instant access.',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://zapycard.com',
    ogImage: '/og-image.jpg',
    keywords: [
        // Health Card Keywords (Primary Focus)
        'smart health card',
        'digital health card',
        'medical card app',
        'health card with NFC',
        'AI prescription reading',
        'pregnancy health card',
        'patient medical card',
        'emergency medical card',
        'digital medical records',
        'health information card',
        'medical history card',
        'prescription scanner app',
        // Visiting Card Keywords
        'digital business card',
        'NFC visiting card',
        'QR code business card',
        'smart visiting card',
        'virtual business card',
        'contactless business card',
        'digital networking',
        'electronic business card',
        'appointment booking card',
        'professional digital card'
    ],
    author: 'Zapy Card',
    creator: '@zapycard',
    publisher: 'Zapy Card',
    category: 'Healthcare & Business Technology',
}

// Generate metadata for pages
export function generateMetadata({
    title,
    description,
    image,
    keywords,
    noIndex = false,
    canonical,
    type = 'website'
}) {
    const metaTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.title
    const metaDescription = description || siteConfig.description
    const metaImage = image || `${siteConfig.url}${siteConfig.ogImage}`
    const metaKeywords = keywords ? [...siteConfig.keywords, ...keywords] : siteConfig.keywords

    return {
        title: metaTitle,
        description: metaDescription,
        keywords: metaKeywords.join(', '),
        authors: [{ name: siteConfig.author }],
        creator: siteConfig.creator,
        publisher: siteConfig.publisher,
        category: siteConfig.category,
        metadataBase: new URL(siteConfig.url),
        alternates: {
            canonical: canonical || siteConfig.url,
        },
        robots: {
            index: !noIndex,
            follow: !noIndex,
            googleBot: {
                index: !noIndex,
                follow: !noIndex,
                'max-video-preview': -1,
                'max-image-preview': 'large',
                'max-snippet': -1,
            },
        },
        openGraph: {
            type: type,
            locale: 'en_US',
            url: canonical || siteConfig.url,
            title: metaTitle,
            description: metaDescription,
            siteName: siteConfig.name,
            images: [
                {
                    url: metaImage,
                    width: 1200,
                    height: 630,
                    alt: metaTitle,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: metaTitle,
            description: metaDescription,
            creator: siteConfig.creator,
            images: [metaImage],
        },
        icons: {
            icon: '/favicon.ico',
            shortcut: '/favicon-16x16.png',
            apple: '/apple-touch-icon.png',
        },
        manifest: '/site.webmanifest',
        verification: {
            google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
            // yandex: 'your-yandex-verification-code',
            // bing: 'your-bing-verification-code',
        },
    }
}

// Structured Data (JSON-LD) generators
export function generateOrganizationSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: siteConfig.name,
        url: siteConfig.url,
        logo: `${siteConfig.url}/logo.png`,
        description: siteConfig.description,
        contactPoint: {
            '@type': 'ContactPoint',
            contactType: 'Customer Service',
            email: 'support@zapycard.com',
        },
        sameAs: [
            'https://www.facebook.com/zapycard',
            'https://twitter.com/zapycard',
            'https://www.linkedin.com/company/zapycard',
            'https://www.instagram.com/zapycard',
        ],
    }
}

export function generateWebsiteSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: siteConfig.name,
        url: siteConfig.url,
        description: siteConfig.description,
        potentialAction: {
            '@type': 'SearchAction',
            target: {
                '@type': 'EntryPoint',
                urlTemplate: `${siteConfig.url}/search?q={search_term_string}`,
            },
            'query-input': 'required name=search_term_string',
        },
    }
}

export function generateProductSchema(product) {
    return {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        description: product.description,
        image: product.image,
        offers: {
            '@type': 'Offer',
            price: product.price,
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock',
            url: `${siteConfig.url}/products/${product.slug}`,
        },
    }
}

export function generateBreadcrumbSchema(items) {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: `${siteConfig.url}${item.path}`,
        })),
    }
}

export function generatePersonSchema(person) {
    return {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: person.name,
        jobTitle: person.title,
        worksFor: {
            '@type': 'Organization',
            name: person.company,
        },
        email: person.email,
        telephone: person.phone,
        url: `${siteConfig.url}/card/${person.slug}`,
    }
}

export function generateFAQSchema(faqs) {
    return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer,
            },
        })),
    }
}

export function generateReviewSchema(reviews) {
    return {
        '@context': 'https://schema.org',
        '@type': 'Review',
        itemReviewed: {
            '@type': 'Product',
            name: siteConfig.name,
        },
        reviewRating: {
            '@type': 'Rating',
            ratingValue: reviews.averageRating,
            bestRating: 5,
            worstRating: 1,
        },
        author: {
            '@type': 'Person',
            name: reviews.author,
        },
        reviewBody: reviews.text,
    }
}

