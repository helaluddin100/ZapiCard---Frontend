'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import DashboardLayout from '@/components/DashboardLayout'
import { useToast } from '@/lib/toast'
import { productAPI, categoryAPI } from '@/lib/api'
import {
    Search,
    Filter,
    Grid,
    ShoppingBag,
    Star,
    Loader2,
    X
} from 'lucide-react'

export default function ProductsPage() {
    const { success, error: showError } = useToast()
    const [products, setProducts] = useState([])
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const [initialLoad, setInitialLoad] = useState(true) // Track first load
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCategory, setSelectedCategory] = useState(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [pagination, setPagination] = useState(null)

    useEffect(() => {
        loadCategories()
    }, [])

    useEffect(() => {
        loadProducts()
    }, [selectedCategory, searchTerm, currentPage])

    const loadCategories = async () => {
        try {
            const response = await categoryAPI.getCategories()
            if (response.status === 'success') {
                setCategories(response.data || [])
            }
        } catch (err) {
            console.error('Error loading categories:', err)
        }
    }

    const loadProducts = async () => {
        try {
            setLoading(true)
            const params = {
                page: currentPage,
                per_page: 12,
            }

            if (selectedCategory) {
                params.category_id = selectedCategory
            }

            if (searchTerm) {
                params.search = searchTerm
            }

            const response = await productAPI.getPublicProducts(params)
            if (response.status === 'success') {
                setProducts(response.data.data || [])
                setPagination({
                    current_page: response.data.current_page,
                    last_page: response.data.last_page,
                    per_page: response.data.per_page,
                    total: response.data.total,
                })
            }
        } catch (err) {
            console.error('Error loading products:', err)
            // Only show error if not initial load to avoid flash
            if (!initialLoad) {
                showError('Failed to load products')
            }
        } finally {
            setLoading(false)
            setInitialLoad(false)
        }
    }

    const handleCategoryFilter = (categoryId) => {
        setSelectedCategory(categoryId === selectedCategory ? null : categoryId)
        setCurrentPage(1)
    }

    const handleSearch = (e) => {
        e.preventDefault()
        setCurrentPage(1)
        loadProducts()
    }

    // SVG placeholder as data URL to avoid 404 errors
    const PLACEHOLDER_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect fill='%23f3f4f6' width='400' height='300'/%3E%3Cg fill='%239ca3af'%3E%3Crect x='175' y='100' width='50' height='60' rx='4'/%3E%3Ccircle cx='200' cy='85' r='20'/%3E%3Ctext x='200' y='180' text-anchor='middle' font-family='system-ui' font-size='14'%3ENo Image%3C/text%3E%3C/g%3E%3C/svg%3E"

    const getProductImage = (product) => {
        if (product.images && product.images.length > 0) {
            const primaryImage = product.images.find(img => img.is_primary) || product.images[0]
            let imageUrl = primaryImage.image_url || primaryImage.thumbnail_url || primaryImage.full_image_url

            if (!imageUrl) return PLACEHOLDER_IMAGE

            // If URL is relative, convert to absolute
            if (!imageUrl.startsWith('http') && !imageUrl.startsWith('//') && !imageUrl.startsWith('data:')) {
                const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
                const baseUrl = apiBase.replace('/api', '')
                
                if (imageUrl.startsWith('/storage/') || imageUrl.startsWith('storage/')) {
                    imageUrl = baseUrl + '/' + imageUrl.replace(/^\//, '')
                } else if (imageUrl.startsWith('/')) {
                    imageUrl = baseUrl + imageUrl
                } else {
                    imageUrl = baseUrl + '/storage/' + imageUrl
                }
            }

            return imageUrl
        }
        return PLACEHOLDER_IMAGE
    }

    const getProductPrice = (product) => {
        if (product.default_price) {
            return product.default_price.sale_price || product.default_price.price
        }
        if (product.prices && product.prices.length > 0) {
            const defaultPrice = product.prices.find(p => p.is_default) || product.prices[0]
            return defaultPrice.sale_price || defaultPrice.price
        }
        return 0
    }

    const getOriginalPrice = (product) => {
        if (product.default_price && product.default_price.sale_price) {
            return product.default_price.price
        }
        if (product.prices && product.prices.length > 0) {
            const defaultPrice = product.prices.find(p => p.is_default) || product.prices[0]
            if (defaultPrice.sale_price) {
                return defaultPrice.price
            }
        }
        return null
    }

    const getCurrencySymbol = (product) => {
        if (product.default_price) {
            return product.default_price.currency_symbol || '৳'
        }
        if (product.prices && product.prices.length > 0) {
            const defaultPrice = product.prices.find(p => p.is_default) || product.prices[0]
            return defaultPrice.currency_symbol || '৳'
        }
        return '৳'
    }

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Card Shop</h1>
                    <p className="text-gray-600 dark:text-gray-400">Browse and order different types of visiting cards</p>
                </div>

                {/* Search and Filter */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6 border border-gray-200 dark:border-gray-700">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search */}
                        <form onSubmit={handleSearch} className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Search cards..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                                />
                            </div>
                        </form>

                        {/* Category Filter */}
                        <div className="flex items-center gap-2 flex-wrap">
                            <Filter className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Categories:</span>
                            <button
                                onClick={() => handleCategoryFilter(null)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${!selectedCategory
                                    ? 'bg-blue-500 dark:bg-blue-600 text-white'
                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                    }`}
                            >
                                All
                            </button>
                            {categories.map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() => handleCategoryFilter(category.id)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${selectedCategory === category.id
                                        ? 'bg-blue-500 dark:bg-blue-600 text-white'
                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                        }`}
                                >
                                    {category.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Products Grid */}
                {loading || initialLoad ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-500 dark:text-blue-400" />
                        <span className="ml-3 text-gray-600 dark:text-gray-400">Loading products...</span>
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                        <ShoppingBag className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">No products found</h3>
                        <p className="text-gray-600 dark:text-gray-400">Try adjusting your search or filter criteria</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                            {products.map((product) => {
                                const price = getProductPrice(product)
                                const originalPrice = getOriginalPrice(product)
                                const currencySymbol = getCurrencySymbol(product)

                                return (
                                    <motion.div
                                        key={product.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        whileHover={{ y: -5 }}
                                        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow border border-gray-200 dark:border-gray-700"
                                    >
                                        <Link href={`/dashboard/products/${product.slug}`}>
                                            <div className="relative">
                                                <img
                                                    src={getProductImage(product)}
                                                    alt={product.name}
                                                    className="w-full h-64 object-cover bg-gray-100 dark:bg-gray-700"
                                                    onError={(e) => {
                                                        // Prevent infinite loop by checking if already using placeholder
                                                        if (!e.target.dataset.fallback) {
                                                            e.target.dataset.fallback = 'true'
                                                            e.target.src = PLACEHOLDER_IMAGE
                                                        }
                                                    }}
                                                />
                                                {product.is_featured && (
                                                    <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold">
                                                        Featured
                                                    </div>
                                                )}
                                                {originalPrice && (
                                                    <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                                                        Sale
                                                    </div>
                                                )}
                                            </div>
                                            <div className="p-4">
                                                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2">
                                                    {product.name}
                                                </h3>
                                                {product.short_description && (
                                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                                                        {product.short_description}
                                                    </p>
                                                )}
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        {originalPrice ? (
                                                            <div>
                                                                <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                                                                    {currencySymbol}{price}
                                                                </span>
                                                                <span className="text-sm text-gray-500 dark:text-gray-400 line-through ml-2">
                                                                    {currencySymbol}{originalPrice}
                                                                </span>
                                                            </div>
                                                        ) : (
                                                            <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                                                                {currencySymbol}{price}
                                                            </span>
                                                        )}
                                                    </div>
                                                    {product.in_stock ? (
                                                        <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded-full">
                                                            In Stock
                                                        </span>
                                                    ) : (
                                                        <span className="text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-2 py-1 rounded-full">
                                                            Out of Stock
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </Link>
                                    </motion.div>
                                )
                            })}
                        </div>

                        {/* Pagination */}
                        {pagination && pagination.last_page > 1 && (
                            <div className="flex items-center justify-center gap-2">
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 transition"
                                >
                                    Previous
                                </button>
                                <span className="px-4 py-2 text-gray-700 dark:text-gray-300">
                                    Page {pagination.current_page} of {pagination.last_page}
                                </span>
                                <button
                                    onClick={() => setCurrentPage(p => Math.min(pagination.last_page, p + 1))}
                                    disabled={currentPage === pagination.last_page}
                                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 transition"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </DashboardLayout>
    )
}

