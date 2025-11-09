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
            showError('Failed to load products')
        } finally {
            setLoading(false)
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

    const getProductImage = (product) => {
        if (product.images && product.images.length > 0) {
            const primaryImage = product.images.find(img => img.is_primary) || product.images[0]
            let imageUrl = primaryImage.image_url || primaryImage.thumbnail_url
            
            // If URL is relative, convert to absolute
            if (imageUrl && !imageUrl.startsWith('http') && !imageUrl.startsWith('//')) {
                if (imageUrl.startsWith('/storage/')) {
                    // Relative storage path - prepend API base URL
                    const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
                    imageUrl = apiBase.replace('/api', '') + imageUrl
                } else if (!imageUrl.startsWith('/')) {
                    // Missing leading slash
                    imageUrl = '/' + imageUrl
                }
            }
            
            return imageUrl || '/placeholder-card.png'
        }
        return '/placeholder-card.png'
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
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Card Shop</h1>
                    <p className="text-gray-600">Browse and order different types of visiting cards</p>
                </div>

                {/* Search and Filter */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search */}
                        <form onSubmit={handleSearch} className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Search cards..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </form>

                        {/* Category Filter */}
                        <div className="flex items-center gap-2 flex-wrap">
                            <Filter className="w-5 h-5 text-gray-500" />
                            <span className="text-sm font-medium text-gray-700">Categories:</span>
                            <button
                                onClick={() => handleCategoryFilter(null)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                                    !selectedCategory
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                All
                            </button>
                            {categories.map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() => handleCategoryFilter(category.id)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                                        selectedCategory === category.id
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    {category.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Products Grid */}
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-xl shadow-lg">
                        <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
                        <p className="text-gray-600">Try adjusting your search or filter criteria</p>
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
                                        className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                                    >
                                        <Link href={`/dashboard/products/${product.slug}`}>
                                            <div className="relative">
                                                <img
                                                    src={getProductImage(product)}
                                                    alt={product.name}
                                                    className="w-full h-64 object-cover"
                                                    onError={(e) => {
                                                        e.target.src = '/placeholder-card.png'
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
                                                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                                                    {product.name}
                                                </h3>
                                                {product.short_description && (
                                                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                                        {product.short_description}
                                                    </p>
                                                )}
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        {originalPrice ? (
                                                            <div>
                                                                <span className="text-lg font-bold text-gray-900">
                                                                    {currencySymbol}{price}
                                                                </span>
                                                                <span className="text-sm text-gray-500 line-through ml-2">
                                                                    {currencySymbol}{originalPrice}
                                                                </span>
                                                            </div>
                                                        ) : (
                                                            <span className="text-lg font-bold text-gray-900">
                                                                {currencySymbol}{price}
                                                            </span>
                                                        )}
                                                    </div>
                                                    {product.in_stock ? (
                                                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                                                            In Stock
                                                        </span>
                                                    ) : (
                                                        <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
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
                                    className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                >
                                    Previous
                                </button>
                                <span className="px-4 py-2 text-gray-700">
                                    Page {pagination.current_page} of {pagination.last_page}
                                </span>
                                <button
                                    onClick={() => setCurrentPage(p => Math.min(pagination.last_page, p + 1))}
                                    disabled={currentPage === pagination.last_page}
                                    className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
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

