'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
    CheckCircle2,
    Package,
    Mail,
    Home,
    Radio
} from 'lucide-react'

export default function ConfirmationPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto text-center">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', duration: 0.5 }}
                    className="mb-8"
                >
                    <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
                        <CheckCircle2 className="w-16 h-16 text-green-600" />
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Order Confirmed!
                    </h1>
                    <p className="text-xl text-gray-600 mb-8">
                        Thank you for your order. We&apos;ve received your payment and will process your NFC card shortly.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white rounded-xl shadow-lg p-8 mb-8"
                >
                    <div className="space-y-4 text-left">
                        <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                                    <Radio className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">NFC Card Order</h3>
                                    <p className="text-sm text-gray-600">Order #12345</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-gray-900">$16.18</p>
                                <p className="text-sm text-gray-600">Paid</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-gray-700">
                                <Package className="w-5 h-5 text-gray-400" />
                                <span>Estimated delivery: 5-7 business days</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-700">
                                <Mail className="w-5 h-5 text-gray-400" />
                                <span>Confirmation email sent to your inbox</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center"
                >
                    <Link href="/dashboard" className="btn-primary flex items-center justify-center">
                        Go to Dashboard
                    </Link>
                    <Link href="/" className="btn-outline flex items-center justify-center">
                        <Home className="w-5 h-5 mr-2" />
                        Back to Home
                    </Link>
                </motion.div>
            </div>
        </div>
    )
}

