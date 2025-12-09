/**
 * Utility functions for product data processing
 */

// SVG placeholder as data URL to avoid 404 errors
export const PLACEHOLDER_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect fill='%23f3f4f6' width='400' height='300'/%3E%3Cg fill='%239ca3af'%3E%3Crect x='175' y='100' width='50' height='60' rx='4'/%3E%3Ccircle cx='200' cy='85' r='20'/%3E%3Ctext x='200' y='180' text-anchor='middle' font-family='system-ui' font-size='14'%3ENo Image%3C/text%3E%3C/g%3E%3C/svg%3E"

export const getProductImages = (product) => {
    if (!product || !product.images || product.images.length === 0) {
        return [PLACEHOLDER_IMAGE]
    }

    // Get API URL from environment variable first (primary source of truth)
    let apiBase = process.env.NEXT_PUBLIC_API_URL

    // If env variable is not set, check if we're on production by hostname
    if (!apiBase && typeof window !== 'undefined') {
        const isProduction = window.location.hostname === 'smart.buytiq.store' ||
            window.location.hostname === 'www.smart.buytiq.store' ||
            window.location.hostname.includes('buytiq.store')

        if (isProduction) {
            apiBase = 'https://smart.buytiq.store/api'
        }
    }

    // Fallback to localhost only if nothing else is available
    if (!apiBase) {
        apiBase = 'http://localhost:8000/api'
    }

    // Remove /api suffix to get base URL for images
    const baseUrl = apiBase.replace('/api', '')

    return product.images.map(img => {
        let imageUrl = img.image_url || img.thumbnail_url || img.full_image_url

        if (!imageUrl) return PLACEHOLDER_IMAGE

        // Replace localhost URLs with production URL (handle backend returning localhost URLs)
        if (imageUrl.startsWith('http://localhost:8000') || imageUrl.startsWith('http://127.0.0.1:8000')) {
            imageUrl = imageUrl.replace(/http:\/\/(localhost|127\.0\.0\.1):8000/, baseUrl)
        }
        // If URL is relative, convert to absolute
        else if (!imageUrl.startsWith('http') && !imageUrl.startsWith('//') && !imageUrl.startsWith('data:')) {
            if (imageUrl.startsWith('/storage/') || imageUrl.startsWith('storage/')) {
                imageUrl = baseUrl + '/' + imageUrl.replace(/^\//, '')
            } else if (imageUrl.startsWith('/')) {
                imageUrl = baseUrl + imageUrl
            } else {
                imageUrl = baseUrl + '/storage/' + imageUrl
            }
        }

        return imageUrl
    })
}

export const getProductPrice = (product) => {
    if (!product) return 0
    let price = 0

    if (product.default_price) {
        price = product.default_price.sale_price || product.default_price.price
    } else if (product.prices && product.prices.length > 0) {
        const defaultPrice = product.prices.find(p => p.is_default) || product.prices[0]
        price = defaultPrice.sale_price || defaultPrice.price
    }

    // Ensure we return a number
    const numPrice = parseFloat(price) || 0
    return isNaN(numPrice) ? 0 : numPrice
}

export const getOriginalPrice = (product) => {
    if (!product) return null
    let price = null

    if (product.default_price && product.default_price.sale_price) {
        price = product.default_price.price
    } else if (product.prices && product.prices.length > 0) {
        const defaultPrice = product.prices.find(p => p.is_default) || product.prices[0]
        if (defaultPrice.sale_price) {
            price = defaultPrice.price
        }
    }

    // Ensure we return a number or null
    if (price === null || price === undefined) return null
    const numPrice = parseFloat(price)
    return isNaN(numPrice) ? null : numPrice
}

export const getCurrencySymbol = (product) => {
    if (!product) return '৳'
    if (product.default_price) {
        return product.default_price.currency_symbol || '৳'
    }
    if (product.prices && product.prices.length > 0) {
        const defaultPrice = product.prices.find(p => p.is_default) || product.prices[0]
        return defaultPrice.currency_symbol || '৳'
    }
    return '৳'
}

