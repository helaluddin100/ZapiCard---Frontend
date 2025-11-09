'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import DashboardLayout from '@/components/DashboardLayout'
import { useToast } from '@/lib/toast'
import { productAPI } from '@/lib/api'
import { ArrowLeft, Loader2 } from 'lucide-react'

// Product Components
import ProductImageGallery from '@/components/products/ProductImageGallery'
import ProductHeader from '@/components/products/ProductHeader'
import ProductPricing from '@/components/products/ProductPricing'
import ProductTabs from '@/components/products/ProductTabs'
import ProductStockStatus from '@/components/products/ProductStockStatus'
import QuantitySelector from '@/components/products/QuantitySelector'
import ProductActions from '@/components/products/ProductActions'

// Utilities
import {
    getProductImages,
    getProductPrice,
    getOriginalPrice,
    getCurrencySymbol
} from '@/components/products/productUtils'

export default function ProductDetailPage() {
    const params = useParams()
    const router = useRouter()
    const { error: showError } = useToast()
    const [product, setProduct] = useState(null)
    const [loading, setLoading] = useState(true)
    const [quantity, setQuantity] = useState(1)

    const loadProduct = useCallback(async () => {
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
    }, [params.slug, showError, router])

    useEffect(() => {
        if (params.slug) {
            loadProduct()
        }
    }, [params.slug, loadProduct])

    const handleOrder = () => {
        if (!product) return
        router.push(`/dashboard/products/${product.slug}/checkout?quantity=${quantity}`)
    }

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
                    <div className="text-center">
                        <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
                        <p className="text-gray-600 font-medium">Loading product details...</p>
                    </div>
                </div>
            </DashboardLayout>
        )
    }

    if (!product) {
        return null
    }

    const images = getProductImages(product)
    const price = getProductPrice(product)
    const originalPrice = getOriginalPrice(product)
    const currencySymbol = getCurrencySymbol(product)

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
                <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Back Button */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <Link
                            href="/dashboard/products"
                            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 group transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                            <span className="font-medium">Back to Products</span>
                        </Link>
                    </motion.div>

                    <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
                        {/* Left Column - Product Images */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <ProductImageGallery
                                images={images}
                                productName={product.name}
                            />
                        </motion.div>

                        {/* Right Column - Product Info */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="space-y-6"
                        >
                            {/* Product Header */}
                            <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-lg border-2 border-gray-100">
                                <ProductHeader product={product} />
                            </div>

                            {/* Pricing */}
                            <ProductPricing
                                price={price}
                                originalPrice={originalPrice}
                                currencySymbol={currencySymbol}
                            />

                            {/* Stock Status */}
                            <ProductStockStatus inStock={product.in_stock} />

                            {/* Quantity Selector */}
                            <QuantitySelector
                                quantity={quantity}
                                setQuantity={setQuantity}
                                price={price}
                                currencySymbol={currencySymbol}
                                inStock={product.in_stock}
                            />

                            {/* Order Button */}
                            <ProductActions
                                inStock={product.in_stock}
                                onOrder={handleOrder}
                            />
                        </motion.div>
                    </div>

                    {/* Product Tabs - Description, Information, Features (Full Width) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mt-8"
                    >
                        <ProductTabs product={product} />
                    </motion.div>
                </div>
            </div>
        </DashboardLayout>
    )
}

