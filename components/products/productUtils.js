/**
 * Utility functions for product data processing
 */

export const getProductImages = (product) => {
    if (!product || !product.images || product.images.length === 0) {
        return ['/placeholder-card.png']
    }

    const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

    return product.images.map(img => {
        let imageUrl = img.image_url || img.thumbnail_url

        // If URL is relative, convert to absolute
        if (imageUrl && !imageUrl.startsWith('http') && !imageUrl.startsWith('//')) {
            if (imageUrl.startsWith('/storage/')) {
                // Relative storage path - prepend API base URL
                imageUrl = apiBase.replace('/api', '') + imageUrl
            } else if (!imageUrl.startsWith('/')) {
                // Missing leading slash
                imageUrl = '/' + imageUrl
            }
        }

        return imageUrl || '/placeholder-card.png'
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

