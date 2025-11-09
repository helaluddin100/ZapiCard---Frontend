'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import DashboardLayout from '@/components/DashboardLayout'
import { useToast } from '@/lib/toast'
import { productAPI } from '@/lib/api'
import {
    ArrowLeft,
    ShoppingCart,
    Star,
    Loader2,
    Check,
    Share2,
    Heart,
    Package,
    Truck,
    Shield,
    X
} from 'lucide-react'

export default function ProductDetailPage() {
    const params = useParams()
    const router = useRouter()
    const { success, error: showError } = useToast()
    const [product, setProduct] = useState(null)
    const [loading, setLoading] = useState(true)
    const [selectedImageIndex, setSelectedImageIndex] = useState(0)
    const [quantity, setQuantity] = useState(1)

    useEffect(() => {
        if (params.slug) {
            loadProduct()
        }
    }, [params.slug])

    const loadProduct = async () => {
        try {
            setLoading(true)
            const response = await productAPI.getProductBySlug(params.slug)
            if (response.status === 'success') {
                setProduct(response.data)
            } else {
                showError('Product not found')
                router.push('/dashboard/products')
            }
        } catch (err) {
            console.error('Error loading product:', err)
            showError('Failed to load product')
            router.push('/dashboard/products')
        } finally {
            setLoading(false)
        }
    }

    const handleOrder = () => {
        if (!product) return
        router.push(`/dashboard/products/${product.slug}/checkout?quantity=${quantity}`)
    }

    const getProductImages = () => {
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

    const getProductPrice = () => {
        if (!product) return 0
        if (product.default_price) {
            return product.default_price.sale_price || product.default_price.price
        }
        if (product.prices && product.prices.length > 0) {
            const defaultPrice = product.prices.find(p => p.is_default) || product.prices[0]
            return defaultPrice.sale_price || defaultPrice.price
        }
        return 0
    }

    const getOriginalPrice = () => {
        if (!product) return null
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

    const getCurrencySymbol = () => {
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

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center min-h-screen">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                </div>
            </DashboardLayout>
        )
    }

    if (!product) {
        return null
    }

    const images = getProductImages()
    const price = getProductPrice()
    const originalPrice = getOriginalPrice()
    const currencySymbol = getCurrencySymbol()
    const totalPrice = price * quantity

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto">
                {/* Back Button */}
                <Link
                    href="/dashboard/products"
                    className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6 group"
                >
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to Products
                </Link>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Product Images */}
                    <div>
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-4">
                            <img
                                src={images[selectedImageIndex]}
                                alt={product.name}
                                className="w-full h-96 object-cover"
                                onError={(e) => {
                                    e.target.src = '/placeholder-card.png'
                                }}
                            />
                        </div>
                        {images.length > 1 && (
                            <div className="grid grid-cols-4 gap-2">
                                {images.map((img, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImageIndex(index)}
                                        className={`rounded-lg overflow-hidden border-2 transition ${selectedImageIndex === index
                                            ? 'border-blue-500'
                                            : 'border-gray-200'
                                            }`}
                                    >
                                        <img
                                            src={img}
                                            alt={`${product.name} - ${index + 1}`}
                                            className="w-full h-20 object-cover"
                                            onError={(e) => {
                                                e.target.src = '/placeholder-card.png'
                                            }}
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div>
                        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
                                    {product.category_relation && (
                                        <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                                            {product.category_relation.name}
                                        </span>
                                    )}
                                </div>
                                {product.is_featured && (
                                    <span className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold">
                                        Featured
                                    </span>
                                )}
                            </div>

                            {/* Price */}
                            <div className="mb-6">
                                {originalPrice ? (
                                    <div>
                                        <span className="text-3xl font-bold text-gray-900">
                                            {currencySymbol}{price}
                                        </span>
                                        <span className="text-xl text-gray-500 line-through ml-3">
                                            {currencySymbol}{originalPrice}
                                        </span>
                                        <div className="text-sm text-red-600 font-medium mt-1">
                                            Save {currencySymbol}{(originalPrice - price).toFixed(2)}
                                        </div>
                                    </div>
                                ) : (
                                    <span className="text-3xl font-bold text-gray-900">
                                        {currencySymbol}{price}
                                    </span>
                                )}
                            </div>

                            {/* Features Table */}
                            {product.features && product.features.length > 0 && (
                                <div className="mb-6">
                                    <h3 className="font-semibold text-gray-900 mb-3">Features</h3>
                                    <div className="overflow-x-auto">
                                        <table className="w-full border-collapse border border-gray-200 rounded-lg overflow-hidden">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="border border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-900">
                                                        Feature
                                                    </th>
                                                    <th className="border border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-900">
                                                        Details
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {product.features.map((feature, index) => {
                                                    // Handle both string and object formats
                                                    const featureName = typeof feature === 'object' && feature !== null
                                                        ? (feature.name || feature.title || feature.key || 'Feature')
                                                        : feature;
                                                    const featureValue = typeof feature === 'object' && feature !== null
                                                        ? (feature.value || feature.description || feature.detail || '')
                                                        : '';

                                                    return (
                                                        <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                                            <td className="border border-gray-200 px-4 py-3 text-sm font-medium text-gray-900">
                                                                {featureName}
                                                            </td>
                                                            <td className="border border-gray-200 px-4 py-3 text-sm text-gray-600">
                                                                {featureValue || (
                                                                    <span className="flex items-center text-green-600">
                                                                        <Check className="w-4 h-4 mr-1" />
                                                                        Included
                                                                    </span>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {/* Stock Status */}
                            <div className="mb-6">
                                {product.in_stock ? (
                                    <div className="flex items-center text-green-600">
                                        <Check className="w-5 h-5 mr-2" />
                                        <span className="font-medium">In Stock</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center text-red-600">
                                        <X className="w-5 h-5 mr-2" />
                                        <span className="font-medium">Out of Stock</span>
                                    </div>
                                )}
                            </div>

                            {/* Quantity Selector */}
                            {product.in_stock && (
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Quantity
                                    </label>
                                    <div className="flex items-center gap-4">
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="w-10 h-10 rounded-lg border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition flex items-center justify-center font-bold"
                                        >
                                            -
                                        </button>
                                        <input
                                            type="number"
                                            min="1"
                                            value={quantity}
                                            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                            className="w-20 text-center text-lg font-bold border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                        />
                                        <button
                                            onClick={() => setQuantity(quantity + 1)}
                                            className="w-10 h-10 rounded-lg border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition flex items-center justify-center font-bold"
                                        >
                                            +
                                        </button>
                                        <div className="ml-auto">
                                            <div className="text-sm text-gray-600">Total:</div>
                                            <div className="text-xl font-bold text-gray-900">
                                                {currencySymbol}{totalPrice.toFixed(2)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Order Button */}
                            {product.in_stock ? (
                                <motion.button
                                    onClick={handleOrder}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition"
                                >
                                    <ShoppingCart className="w-5 h-5 inline mr-2" />
                                    Order Now
                                </motion.button>
                            ) : (
                                <button
                                    disabled
                                    className="w-full bg-gray-300 text-gray-500 py-4 rounded-xl font-bold text-lg cursor-not-allowed"
                                >
                                    Out of Stock
                                </button>
                            )}
                        </div>


                        {/* Additional Info */}
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <h3 className="font-semibold text-gray-900 mb-4">Product Information</h3>
                            <div className="space-y-3">
                                {product.sku && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">SKU:</span>
                                        <span className="font-medium text-gray-900">{product.sku}</span>
                                    </div>
                                )}
                                {product.brand && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Brand:</span>
                                        <span className="font-medium text-gray-900">{product.brand}</span>
                                    </div>
                                )}
                                {product.weight && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Weight:</span>
                                        <span className="font-medium text-gray-900">{product.weight}</span>
                                    </div>
                                )}
                                {product.dimensions && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Dimensions:</span>
                                        <span className="font-medium text-gray-900">{product.dimensions}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}

