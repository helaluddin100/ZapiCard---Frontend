'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
    ArrowLeft,
    CreditCard,
    Lock,
    CheckCircle2
} from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function CheckoutPage() {
    const router = useRouter()
    const [formData, setFormData] = useState({
        email: '',
        firstName: '',
        lastName: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'United States',
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        nameOnCard: ''
    })

    const handleSubmit = (e) => {
        e.preventDefault()
        // Mock checkout - no backend
        console.log('Checkout:', formData)
        router.push('/nfc-order/confirmation')
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <Link href="/nfc-order" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Order
                    </Link>
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Checkout</h1>
                    <p className="text-gray-600">Complete your order securely</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Checkout Form */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Contact Information */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-xl shadow-lg p-6"
                            >
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Information</h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Email Address *
                                        </label>
                                        <input
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                            placeholder="you@example.com"
                                        />
                                    </div>
                                </div>
                            </motion.div>

                            {/* Shipping Address */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="bg-white rounded-xl shadow-lg p-6"
                            >
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">Shipping Address</h2>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            First Name *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.firstName}
                                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Last Name *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.lastName}
                                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Address *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.address}
                                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                            placeholder="123 Main Street"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            City *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.city}
                                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            State *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.state}
                                            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            ZIP Code *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.zipCode}
                                            onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Country *
                                        </label>
                                        <select
                                            required
                                            value={formData.country}
                                            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                        >
                                            <option>United States</option>
                                            <option>Canada</option>
                                            <option>United Kingdom</option>
                                            <option>Australia</option>
                                        </select>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Payment Information */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="bg-white rounded-xl shadow-lg p-6"
                            >
                                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                                    <CreditCard className="w-6 h-6 mr-2" />
                                    Payment Information
                                </h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Card Number *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            maxLength="19"
                                            value={formData.cardNumber}
                                            onChange={(e) => {
                                                const value = e.target.value.replace(/\s/g, '').replace(/\D/g, '')
                                                const formatted = value.match(/.{1,4}/g)?.join(' ') || value
                                                setFormData({ ...formData, cardNumber: formatted })
                                            }}
                                            placeholder="1234 5678 9012 3456"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Name on Card *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.nameOnCard}
                                            onChange={(e) => setFormData({ ...formData, nameOnCard: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Expiry Date *
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                maxLength="5"
                                                value={formData.expiryDate}
                                                onChange={(e) => {
                                                    let value = e.target.value.replace(/\D/g, '')
                                                    if (value.length >= 2) {
                                                        value = value.slice(0, 2) + '/' + value.slice(2, 4)
                                                    }
                                                    setFormData({ ...formData, expiryDate: value })
                                                }}
                                                placeholder="MM/YY"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                CVV *
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                maxLength="4"
                                                value={formData.cvv}
                                                onChange={(e) => setFormData({ ...formData, cvv: e.target.value.replace(/\D/g, '') })}
                                                placeholder="123"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Lock className="w-4 h-4" />
                                        <span>Your payment information is secure and encrypted</span>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-white rounded-xl shadow-lg p-6 sticky top-8"
                            >
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>

                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between text-gray-700">
                                        <span>Premium Plastic × 1</span>
                                        <span>$9.99</span>
                                    </div>
                                    <div className="flex justify-between text-gray-700">
                                        <span>Shipping</span>
                                        <span>$4.99</span>
                                    </div>
                                    <div className="flex justify-between text-gray-700">
                                        <span>Tax</span>
                                        <span>$1.20</span>
                                    </div>
                                    <div className="border-t border-gray-200 pt-3 flex justify-between text-lg font-bold text-gray-900">
                                        <span>Total</span>
                                        <span>$16.18</span>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full btn-primary mb-4 flex items-center justify-center"
                                >
                                    <Lock className="w-5 h-5 mr-2" />
                                    Complete Order
                                </button>

                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                                    <span>Secure 256-bit SSL encryption</span>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

