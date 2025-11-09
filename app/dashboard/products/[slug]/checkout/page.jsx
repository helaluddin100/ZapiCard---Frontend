'use client'

import { useState, useEffect } from 'react'
import { useParams, useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import DashboardLayout from '@/components/DashboardLayout'
import { useToast } from '@/lib/toast'
import { productAPI } from '@/lib/api'
import {
    ArrowLeft,
    CreditCard,
    Loader2,
    Check,
    X,
    Lock,
    Shield,
    Truck,
    Package,
    Phone,
    Mail,
    MapPin
} from 'lucide-react'

export default function CheckoutPage() {
    const params = useParams()
    const searchParams = useSearchParams()
    const router = useRouter()
    const { success, error: showError } = useToast()
    const [product, setProduct] = useState(null)
    const [loading, setLoading] = useState(true)
    const [processing, setProcessing] = useState(false)
    const [paymentMethod, setPaymentMethod] = useState('stripe')
    const [showManualPayment, setShowManualPayment] = useState(false)
    const [selectedManualPayment, setSelectedManualPayment] = useState('bkash')

    // Form data
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        postal_code: '',
        quantity: 1,
    })

    useEffect(() => {
        if (params.slug) {
            loadProduct()
            const qty = searchParams.get('quantity')
            if (qty) {
                setFormData(prev => ({ ...prev, quantity: parseInt(qty) || 1 }))
            }
        }
    }, [params.slug, searchParams])

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

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleStripeCheckout = async () => {
        if (!validateForm()) return

        try {
            setProcessing(true)
            // TODO: Integrate with Stripe Checkout
            // This would typically redirect to Stripe Checkout or create a payment session
            showError('Stripe integration pending. Please use manual payment for now.')
            // Example:
            // const response = await fetch('/api/create-stripe-session', {
            //     method: 'POST',
            //     body: JSON.stringify({ productId: product.id, quantity: formData.quantity, ...formData })
            // })
            // const { url } = await response.json()
            // window.location.href = url
        } catch (err) {
            console.error('Stripe checkout error:', err)
            showError('Failed to process payment')
        } finally {
            setProcessing(false)
        }
    }

    const handleManualPayment = async () => {
        if (!validateForm()) return

        try {
            setProcessing(true)
            // TODO: Create order with manual payment status
            // This would typically create an order in the database with status 'pending_payment'
            // and show payment instructions
            
            const orderData = {
                product_id: product.id,
                quantity: formData.quantity,
                payment_method: selectedManualPayment,
                payment_status: 'pending',
                ...formData
            }

            // Example API call:
            // const response = await fetch('/api/orders', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(orderData)
            // })

            success('Order placed successfully! Please complete the payment using the instructions below.')
            setShowManualPayment(true)
        } catch (err) {
            console.error('Order creation error:', err)
            showError('Failed to create order')
        } finally {
            setProcessing(false)
        }
    }

    const validateForm = () => {
        if (!formData.name.trim()) {
            showError('Please enter your name')
            return false
        }
        if (!formData.email.trim() || !formData.email.includes('@')) {
            showError('Please enter a valid email')
            return false
        }
        if (!formData.phone.trim()) {
            showError('Please enter your phone number')
            return false
        }
        if (!formData.address.trim()) {
            showError('Please enter your address')
            return false
        }
        return true
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

    const getProductImage = () => {
        if (!product || !product.images || product.images.length === 0) {
            return '/placeholder-card.png'
        }
        
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

    const price = getProductPrice()
    const currencySymbol = getCurrencySymbol()
    const subtotal = price * formData.quantity
    const shipping = 0 // Free shipping for now
    const total = subtotal + shipping

    const manualPaymentMethods = [
        {
            id: 'bkash',
            name: 'bKash',
            number: '01712345678',
            instructions: 'Send money to this bKash number and include your order ID in the reference.'
        },
        {
            id: 'rocket',
            name: 'Rocket',
            number: '01712345678',
            instructions: 'Send money to this Rocket number and include your order ID in the reference.'
        },
        {
            id: 'nagad',
            name: 'Nagad',
            number: '01712345678',
            instructions: 'Send money to this Nagad number and include your order ID in the reference.'
        }
    ]

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

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto">
                {/* Back Button */}
                <Link
                    href={`/dashboard/products/${params.slug}`}
                    className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6 group"
                >
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to Product
                </Link>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Checkout Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Shipping Information</h2>
                            
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    />
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Email *
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Phone *
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Address *
                                    </label>
                                    <textarea
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        rows={3}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    />
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            City
                                        </label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Postal Code
                                        </label>
                                        <input
                                            type="text"
                                            name="postal_code"
                                            value={formData.postal_code}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Quantity
                                    </label>
                                    <div className="flex items-center gap-4">
                                        <button
                                            onClick={() => setFormData(prev => ({ ...prev, quantity: Math.max(1, prev.quantity - 1) }))}
                                            className="w-10 h-10 rounded-lg border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition flex items-center justify-center font-bold"
                                        >
                                            -
                                        </button>
                                        <input
                                            type="number"
                                            min="1"
                                            value={formData.quantity}
                                            onChange={(e) => setFormData(prev => ({ ...prev, quantity: Math.max(1, parseInt(e.target.value) || 1) }))}
                                            className="w-20 text-center text-lg font-bold border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                        />
                                        <button
                                            onClick={() => setFormData(prev => ({ ...prev, quantity: prev.quantity + 1 }))}
                                            className="w-10 h-10 rounded-lg border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition flex items-center justify-center font-bold"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Method</h2>
                            
                            <div className="space-y-4">
                                {/* Stripe */}
                                <div
                                    onClick={() => setPaymentMethod('stripe')}
                                    className={`p-4 border-2 rounded-lg cursor-pointer transition ${
                                        paymentMethod === 'stripe'
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                >
                                    <div className="flex items-center">
                                        <input
                                            type="radio"
                                            name="payment"
                                            value="stripe"
                                            checked={paymentMethod === 'stripe'}
                                            onChange={() => setPaymentMethod('stripe')}
                                            className="w-5 h-5 text-blue-500"
                                        />
                                        <CreditCard className="w-6 h-6 ml-3 text-gray-700" />
                                        <span className="ml-3 font-medium text-gray-900">Stripe (Credit/Debit Card)</span>
                                    </div>
                                </div>

                                {/* Manual Payment Options */}
                                <div
                                    onClick={() => setPaymentMethod('manual')}
                                    className={`p-4 border-2 rounded-lg cursor-pointer transition ${
                                        paymentMethod === 'manual'
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                >
                                    <div className="flex items-center">
                                        <input
                                            type="radio"
                                            name="payment"
                                            value="manual"
                                            checked={paymentMethod === 'manual'}
                                            onChange={() => setPaymentMethod('manual')}
                                            className="w-5 h-5 text-blue-500"
                                        />
                                        <Phone className="w-6 h-6 ml-3 text-gray-700" />
                                        <span className="ml-3 font-medium text-gray-900">Mobile Banking (bKash/Rocket/Nagad)</span>
                                    </div>
                                </div>

                                {paymentMethod === 'manual' && (
                                    <div className="ml-8 mt-4 space-y-3">
                                        {manualPaymentMethods.map((method) => (
                                            <div
                                                key={method.id}
                                                onClick={() => setSelectedManualPayment(method.id)}
                                                className={`p-3 border rounded-lg cursor-pointer transition ${
                                                    selectedManualPayment === method.id
                                                        ? 'border-blue-500 bg-blue-50'
                                                        : 'border-gray-200'
                                                }`}
                                            >
                                                <div className="flex items-center">
                                                    <input
                                                        type="radio"
                                                        name="manual_payment"
                                                        value={method.id}
                                                        checked={selectedManualPayment === method.id}
                                                        onChange={() => setSelectedManualPayment(method.id)}
                                                        className="w-4 h-4 text-blue-500"
                                                    />
                                                    <span className="ml-2 font-medium">{method.name}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Payment Button */}
                                <motion.button
                                    onClick={paymentMethod === 'stripe' ? handleStripeCheckout : handleManualPayment}
                                    disabled={processing}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                                >
                                    {processing ? (
                                        <>
                                            <Loader2 className="w-5 h-5 inline mr-2 animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <Lock className="w-5 h-5 inline mr-2" />
                                            {paymentMethod === 'stripe' ? 'Pay with Stripe' : 'Place Order'}
                                        </>
                                    )}
                                </motion.button>
                            </div>
                        </div>

                        {/* Manual Payment Instructions */}
                        {showManualPayment && paymentMethod === 'manual' && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mt-6"
                            >
                                <h3 className="text-xl font-bold text-gray-900 mb-4">
                                    Payment Instructions - {manualPaymentMethods.find(m => m.id === selectedManualPayment)?.name}
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex items-center">
                                        <Phone className="w-5 h-5 text-blue-600 mr-2" />
                                        <span className="font-medium">Send payment to:</span>
                                        <span className="ml-2 text-lg font-bold text-blue-600">
                                            {manualPaymentMethods.find(m => m.id === selectedManualPayment)?.number}
                                        </span>
                                    </div>
                                    <p className="text-gray-700">
                                        {manualPaymentMethods.find(m => m.id === selectedManualPayment)?.instructions}
                                    </p>
                                    <div className="bg-white rounded-lg p-4 mt-4">
                                        <p className="text-sm text-gray-600 mb-2">Amount to send:</p>
                                        <p className="text-2xl font-bold text-gray-900">{currencySymbol}{total.toFixed(2)}</p>
                                    </div>
                                    <p className="text-sm text-gray-600 mt-4">
                                        After sending the payment, please contact us with your transaction ID. We will verify and process your order.
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>
                            
                            {/* Product */}
                            <div className="flex gap-4 mb-6 pb-6 border-b">
                                <img
                                    src={getProductImage()}
                                    alt={product.name}
                                    className="w-20 h-20 object-cover rounded-lg"
                                    onError={(e) => {
                                        e.target.src = '/placeholder-card.png'
                                    }}
                                />
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>
                                    <p className="text-sm text-gray-600">Quantity: {formData.quantity}</p>
                                </div>
                            </div>

                            {/* Price Breakdown */}
                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="font-medium">{currencySymbol}{subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Shipping</span>
                                    <span className="font-medium text-green-600">Free</span>
                                </div>
                                <div className="flex justify-between text-xl font-bold pt-3 border-t">
                                    <span>Total</span>
                                    <span>{currencySymbol}{total.toFixed(2)}</span>
                                </div>
                            </div>

                            {/* Security Badge */}
                            <div className="flex items-center text-sm text-gray-600 mb-4">
                                <Shield className="w-4 h-4 mr-2" />
                                <span>Secure payment</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}

