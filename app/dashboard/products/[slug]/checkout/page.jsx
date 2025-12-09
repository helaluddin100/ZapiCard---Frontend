'use client'

import { useState, useEffect } from 'react'
import { useParams, useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import DashboardLayout from '@/components/DashboardLayout'
import { useToast } from '@/lib/toast'
import { productAPI, orderAPI, paymentAPI, cardAPI, healthCardAPI } from '@/lib/api'
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
    MapPin,
    Heart,
    Briefcase
} from 'lucide-react'

export default function CheckoutPage() {
    const params = useParams()
    const searchParams = useSearchParams()
    const router = useRouter()
    const { success, error: showError } = useToast()
    const [product, setProduct] = useState(null)
    const [loading, setLoading] = useState(true)
    const [processing, setProcessing] = useState(false)
    const [selectedManualPayment, setSelectedManualPayment] = useState('bkash')
    const [showPaymentModal, setShowPaymentModal] = useState(false)
    const [cards, setCards] = useState([])
    const [loadingCards, setLoadingCards] = useState(true)

    // Payment modal form data
    const [paymentFormData, setPaymentFormData] = useState({
        sender_number: '',
        transaction_id: ''
    })

    // Form data
    const [formData, setFormData] = useState({
        card_id: '',
        card_type: '', // 'visiting' or 'health'
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
            loadCards()
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

    const loadCards = async () => {
        try {
            setLoadingCards(true)
            // Fetch both visiting cards and health cards
            const [visitingCardsRes, healthCardsRes] = await Promise.all([
                cardAPI.getCards().catch(() => ({ status: 'success', data: [] })),
                healthCardAPI.getHealthCards().catch(() => ({ status: 'success', data: [] }))
            ])

            const visitingCards = visitingCardsRes.status === 'success' && visitingCardsRes.data
                ? visitingCardsRes.data.map(card => ({
                    id: card.id,
                    name: card.name || 'Unnamed Card',
                    type: 'visiting',
                    displayName: `${card.name || 'Unnamed Card'} (Visiting Card)`
                }))
                : []

            const healthCards = healthCardsRes.status === 'success' && healthCardsRes.data
                ? healthCardsRes.data.map(card => ({
                    id: card.id,
                    name: card.person_name || 'Unnamed Health Card',
                    type: 'health',
                    displayName: `${card.person_name || 'Unnamed Health Card'} (Health Card)`
                }))
                : []

            // Combine both types
            setCards([...visitingCards, ...healthCards])
        } catch (err) {
            console.error('Error loading cards:', err)
            setCards([])
        } finally {
            setLoadingCards(false)
        }
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleCardSelect = (e) => {
        const selectedValue = e.target.value
        if (selectedValue) {
            const [cardId, cardType] = selectedValue.split('|')
            setFormData(prev => ({
                ...prev,
                card_id: cardId,
                card_type: cardType
            }))
        } else {
            setFormData(prev => ({
                ...prev,
                card_id: '',
                card_type: ''
            }))
        }
    }

    const handlePaymentInputChange = (e) => {
        const { name, value } = e.target
        setPaymentFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleMobileBankingClick = () => {
        if (!validateForm()) return
        setShowPaymentModal(true)
    }

    const handlePlaceOrder = async () => {
        // Validate payment form
        if (!paymentFormData.sender_number.trim()) {
            showError('Please enter sender number')
            return
        }
        if (!paymentFormData.transaction_id.trim()) {
            showError('Please enter transaction ID')
            return
        }

        try {
            setProcessing(true)

            const orderData = {
                product_id: product.id,
                card_id: formData.card_id,
                card_type: formData.card_type,
                quantity: formData.quantity,
                customer_name: formData.name,
                customer_email: formData.email || null,
                customer_phone: formData.phone,
                shipping_address: formData.address,
                shipping_city: formData.city,
                shipping_postal_code: formData.postal_code,
                payment_method: selectedManualPayment,
                payment_sender_number: paymentFormData.sender_number,
                payment_transaction_id: paymentFormData.transaction_id,
                order_notes: `Order placed via ${selectedManualPayment}. Transaction ID: ${paymentFormData.transaction_id}`,
            }

            const response = await orderAPI.createOrder(orderData)

            if (response.status === 'success') {
                success('Order placed successfully!')
                // Redirect to order confirmation
                router.push(`/dashboard/orders/${response.data.id}/confirmation`)
            } else {
                showError(response.message || 'Failed to create order')
            }
        } catch (err) {
            console.error('Order creation error:', err)
            showError(err.message || 'Failed to create order')
        } finally {
            setProcessing(false)
            setShowPaymentModal(false)
        }
    }

    const validateForm = () => {
        if (!formData.card_id || !formData.card_type) {
            showError('Please select a card profile')
            return false
        }
        if (!formData.name.trim()) {
            showError('Please enter your name')
            return false
        }
        // Email is optional - only validate format if provided
        if (formData.email && formData.email.trim() && !formData.email.includes('@')) {
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

        if (!imageUrl) return '/placeholder-card.png'

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

        const baseUrl = apiBase.replace('/api', '')

        // Replace localhost URLs with production URL (handle backend returning localhost URLs)
        if (imageUrl.startsWith('http://localhost:8000') || imageUrl.startsWith('http://127.0.0.1:8000')) {
            imageUrl = imageUrl.replace(/http:\/\/(localhost|127\.0\.0\.1):8000/, baseUrl)
        }
        // If URL is relative, convert to absolute
        else if (!imageUrl.startsWith('http') && !imageUrl.startsWith('//')) {
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

    const selectedPaymentMethod = manualPaymentMethods.find(m => m.id === selectedManualPayment)

    if (loading || loadingCards) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center min-h-screen">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-500 dark:text-blue-400" />
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
                    className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 mb-6 group"
                >
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to Product
                </Link>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Checkout Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6 border border-gray-200 dark:border-gray-700">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Shipping Information</h2>

                            <div className="space-y-4">
                                {/* Card Selection */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Select Card Profile * <span className="text-xs text-gray-500">(Choose which card you&apos;re ordering for)</span>
                                    </label>
                                    <select
                                        name="card_id"
                                        value={formData.card_id && formData.card_type ? `${formData.card_id}|${formData.card_type}` : ''}
                                        onChange={handleCardSelect}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                        required
                                    >
                                        <option value="">-- Select a Card --</option>
                                        {cards.map((card) => (
                                            <option key={`${card.type}-${card.id}`} value={`${card.id}|${card.type}`}>
                                                {card.displayName}
                                            </option>
                                        ))}
                                    </select>
                                    {cards.length === 0 && (
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                            No cards found. Please create a card first.
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                                        required
                                    />
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Phone *
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Address *
                                    </label>
                                    <textarea
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        rows={3}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                                        required
                                    />
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            City
                                        </label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Postal Code
                                        </label>
                                        <input
                                            type="text"
                                            name="postal_code"
                                            value={formData.postal_code}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Quantity
                                    </label>
                                    <div className="flex items-center gap-4">
                                        <button
                                            onClick={() => setFormData(prev => ({ ...prev, quantity: Math.max(1, prev.quantity - 1) }))}
                                            className="w-10 h-10 rounded-lg border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition flex items-center justify-center font-bold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700"
                                        >
                                            -
                                        </button>
                                        <input
                                            type="number"
                                            min="1"
                                            value={formData.quantity}
                                            onChange={(e) => setFormData(prev => ({ ...prev, quantity: Math.max(1, parseInt(e.target.value) || 1) }))}
                                            className="w-20 text-center text-lg font-bold border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                        />
                                        <button
                                            onClick={() => setFormData(prev => ({ ...prev, quantity: prev.quantity + 1 }))}
                                            className="w-10 h-10 rounded-lg border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition flex items-center justify-center font-bold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Payment Method</h2>

                            <div className="space-y-4">
                                {/* Mobile Banking Options */}
                                <div
                                    className="p-4 border-2 rounded-lg border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/30"
                                >
                                    <div className="flex items-center mb-4">
                                        <Phone className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                        <span className="ml-3 font-medium text-gray-900 dark:text-gray-100">Mobile Banking (bKash/Rocket/Nagad)</span>
                                    </div>

                                    <div className="ml-8 mt-4 space-y-3">
                                        {manualPaymentMethods.map((method) => (
                                            <div
                                                key={method.id}
                                                onClick={() => setSelectedManualPayment(method.id)}
                                                className={`p-3 border rounded-lg cursor-pointer transition ${selectedManualPayment === method.id
                                                    ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/30'
                                                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                                                    }`}
                                            >
                                                <div className="flex items-center">
                                                    <input
                                                        type="radio"
                                                        name="manual_payment"
                                                        value={method.id}
                                                        checked={selectedManualPayment === method.id}
                                                        onChange={() => setSelectedManualPayment(method.id)}
                                                        className="w-4 h-4 text-blue-500 dark:text-blue-400"
                                                    />
                                                    <span className="ml-2 font-medium text-gray-900 dark:text-gray-100">{method.name}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Payment Button */}
                                <motion.button
                                    onClick={handleMobileBankingClick}
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
                                            Place Order
                                        </>
                                    )}
                                </motion.button>
                            </div>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sticky top-6 border border-gray-200 dark:border-gray-700">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Order Summary</h2>

                            {/* Product */}
                            <div className="flex gap-4 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                                <img
                                    src={getProductImage()}
                                    alt={product.name}
                                    className="w-20 h-20 object-cover rounded-lg"
                                    onError={(e) => {
                                        e.target.src = '/placeholder-card.png'
                                    }}
                                />
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">{product.name}</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Quantity: {formData.quantity}</p>
                                </div>
                            </div>

                            {/* Price Breakdown */}
                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                                    <span className="font-medium text-gray-900 dark:text-gray-100">{currencySymbol}{subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                                    <span className="font-medium text-green-600 dark:text-green-400">Free</span>
                                </div>
                                <div className="flex justify-between text-xl font-bold pt-3 border-t border-gray-200 dark:border-gray-700">
                                    <span className="text-gray-900 dark:text-gray-100">Total</span>
                                    <span className="text-gray-900 dark:text-gray-100">{currencySymbol}{total.toFixed(2)}</span>
                                </div>
                            </div>

                            {/* Security Badge */}
                            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-4">
                                <Shield className="w-4 h-4 mr-2" />
                                <span>Secure payment</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Payment Modal */}
            <AnimatePresence>
                {showPaymentModal && selectedPaymentMethod && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowPaymentModal(false)}
                            className="fixed inset-0 bg-black bg-opacity-50 z-50"
                        />

                        {/* Modal */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="fixed inset-0 z-50 flex items-center justify-center p-4"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                                <div className="p-6">
                                    {/* Header */}
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                            Payment Details - {selectedPaymentMethod.name}
                                        </h3>
                                        <button
                                            onClick={() => setShowPaymentModal(false)}
                                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>

                                    {/* Payment Information */}
                                    <div className="space-y-4">
                                        {/* Amount */}
                                        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Amount to Pay</p>
                                            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                                                {currencySymbol}{total.toFixed(2)}
                                            </p>
                                        </div>

                                        {/* Receiver Number */}
                                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Receiver Number</p>
                                            <p className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center">
                                                <Phone className="w-4 h-4 mr-2" />
                                                {selectedPaymentMethod.number}
                                            </p>
                                        </div>

                                        {/* Sender Number */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Your {selectedPaymentMethod.name} Number *
                                            </label>
                                            <input
                                                type="tel"
                                                name="sender_number"
                                                value={paymentFormData.sender_number}
                                                onChange={handlePaymentInputChange}
                                                placeholder={`Enter your ${selectedPaymentMethod.name} number`}
                                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                                                required
                                            />
                                        </div>

                                        {/* Transaction ID */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Transaction ID *
                                            </label>
                                            <input
                                                type="text"
                                                name="transaction_id"
                                                value={paymentFormData.transaction_id}
                                                onChange={handlePaymentInputChange}
                                                placeholder="Enter transaction ID"
                                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                                                required
                                            />
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                Enter the transaction ID you received after sending money
                                            </p>
                                        </div>

                                        {/* Instructions */}
                                        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-800">
                                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                                <strong>Instructions:</strong> Send {currencySymbol}{total.toFixed(2)} to {selectedPaymentMethod.number} via {selectedPaymentMethod.name}. After sending, enter your number and the transaction ID above.
                                            </p>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-3 pt-4">
                                            <button
                                                onClick={() => setShowPaymentModal(false)}
                                                className="flex-1 px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition font-medium"
                                            >
                                                Cancel
                                            </button>
                                            <motion.button
                                                onClick={handlePlaceOrder}
                                                disabled={processing || !paymentFormData.sender_number.trim() || !paymentFormData.transaction_id.trim()}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {processing ? (
                                                    <>
                                                        <Loader2 className="w-4 h-4 inline mr-2 animate-spin" />
                                                        Processing...
                                                    </>
                                                ) : (
                                                    'Place Order'
                                                )}
                                            </motion.button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </DashboardLayout>
    )
}
