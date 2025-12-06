'use client'

import { motion } from 'framer-motion'
import { RotateCcw, Package, CheckCircle2, XCircle, Clock, CreditCard, AlertCircle, FileText } from 'lucide-react'
import Link from 'next/link'

export default function ReturnPolicyPage() {
    const returnReasons = [
        {
            icon: <XCircle className="w-6 h-6" />,
            title: "Design Error - Customer's Fault",
            description: "If the card design contains incorrect information provided by the customer (wrong name, phone number, email, address, etc.), we will accept the return and provide a full refund.",
            process: [
                "Contact our customer support within 7 days of receiving the card",
                "Provide photos showing the incorrect information",
                "Return the card in original condition",
                "We will process a full refund within 14 business days"
            ],
            eligible: true
        },
        {
            icon: <AlertCircle className="w-6 h-6" />,
            title: "NFC Functionality Issue",
            description: "If the NFC chip does not work properly or fails to connect to your digital card, we will accept the return and provide a full refund.",
            process: [
                "Contact our customer support within 30 days of receiving the card",
                "Provide a video demonstration showing the NFC not working",
                "Return the card in original condition with packaging",
                "We will test the card and process a full refund if confirmed defective"
            ],
            eligible: true
        },
        {
            icon: <AlertCircle className="w-6 h-6" />,
            title: "QR Code Not Working",
            description: "If the QR code does not scan properly or redirects to the wrong page, we will accept the return and provide a full refund.",
            process: [
                "Contact our customer support within 30 days of receiving the card",
                "Provide photos/video showing the QR code issue",
                "Return the card in original condition",
                "We will verify and process a full refund if confirmed defective"
            ],
            eligible: true
        },
        {
            icon: <XCircle className="w-6 h-6" />,
            title: "Physical Damage During Shipping",
            description: "If the card arrives damaged due to shipping issues, we will replace it free of charge or provide a full refund.",
            process: [
                "Contact us within 3 days of delivery",
                "Provide photos of the damaged card and packaging",
                "We will send a replacement or process a full refund"
            ],
            eligible: true
        },
        {
            icon: <CheckCircle2 className="w-6 h-6" />,
            title: "Change of Mind",
            description: "Returns due to change of mind are not eligible for refund unless the card is unopened and unused.",
            process: [
                "Contact us within 7 days of delivery",
                "Card must be unopened and in original packaging",
                "Return shipping costs will be borne by the customer",
                "Refund will be processed minus a 15% restocking fee"
            ],
            eligible: false
        }
    ]

    const returnProcess = [
        {
            step: 1,
            icon: <FileText className="w-6 h-6" />,
            title: "Contact Support",
            description: "Email us at support@zapycard.com or call +880 1744220807 with your order number and reason for return."
        },
        {
            step: 2,
            icon: <Package className="w-6 h-6" />,
            title: "Return the Card",
            description: "Pack the card securely in its original packaging and send it to our return address. We will provide the address upon approval."
        },
        {
            step: 3,
            icon: <CheckCircle2 className="w-6 h-6" />,
            title: "Inspection",
            description: "We will inspect the returned card within 3-5 business days of receipt to verify the issue."
        },
        {
            step: 4,
            icon: <CreditCard className="w-6 h-6" />,
            title: "Refund Processing",
            description: "If approved, we will process your refund to the original payment method within 14 business days."
        }
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pt-16 md:pt-20">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">Return & Refund Policy</h1>
                        <p className="text-xl text-blue-100">Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </motion.div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Introduction */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-8"
                >
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                        At <strong>Zapy Card</strong>, we stand behind the quality of our products and services. This Return & Refund Policy outlines the circumstances under which we accept returns and provide refunds for our NFC and QR code cards.
                    </p>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        This policy is designed in compliance with the <strong>Consumer Rights Protection Act, 2009</strong> of Bangladesh and ensures fair treatment for both customers and our business.
                    </p>
                </motion.div>

                {/* Eligible Return Reasons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="mb-8"
                >
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Eligible Return Reasons</h2>
                    <div className="space-y-6">
                        {returnReasons.map((reason, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                                className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border-l-4 ${reason.eligible
                                        ? 'border-green-500'
                                        : 'border-gray-300 dark:border-gray-600'
                                    }`}
                            >
                                <div className="flex items-start gap-4 mb-4">
                                    <div className={`p-3 rounded-xl ${reason.eligible
                                            ? 'bg-gradient-to-br from-green-500 to-emerald-500 text-white'
                                            : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                                        }`}>
                                        {reason.icon}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                            {reason.title}
                                        </h3>
                                        <p className="text-gray-700 dark:text-gray-300 mb-4">
                                            {reason.description}
                                        </p>
                                        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Return Process:</h4>
                                            <ul className="space-y-2">
                                                {reason.process.map((step, idx) => (
                                                    <li key={idx} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                                                        <span className="text-green-600 dark:text-green-400 mt-1">✓</span>
                                                        <span>{step}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Return Process Steps */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.7 }}
                    className="mb-8"
                >
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Return Process</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        {returnProcess.map((process, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
                                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
                            >
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white flex items-center justify-center font-bold text-xl">
                                        {process.step}
                                    </div>
                                    <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                                        {process.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                        {process.title}
                                    </h3>
                                </div>
                                <p className="text-gray-700 dark:text-gray-300">
                                    {process.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Important Notes */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1.1 }}
                    className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 rounded-2xl shadow-lg p-6 mb-8"
                >
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <Clock className="w-6 h-6" />
                        Important Notes
                    </h2>
                    <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                        <li className="flex items-start gap-2">
                            <span className="text-yellow-600 dark:text-yellow-400 mt-1">•</span>
                            <span>Return requests must be made within the specified timeframes mentioned above.</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-yellow-600 dark:text-yellow-400 mt-1">•</span>
                            <span>Cards must be returned in their original condition and packaging when possible.</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-yellow-600 dark:text-yellow-400 mt-1">•</span>
                            <span>Refunds will be processed to the original payment method used for the purchase.</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-yellow-600 dark:text-yellow-400 mt-1">•</span>
                            <span>Shipping costs for returns due to customer error or change of mind will be borne by the customer.</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-yellow-600 dark:text-yellow-400 mt-1">•</span>
                            <span>For defective products (NFC/QR code issues), we will cover return shipping costs.</span>
                        </li>
                    </ul>
                </motion.div>

                {/* Contact Information */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1.2 }}
                    className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl shadow-lg p-8 text-white"
                >
                    <h2 className="text-2xl font-bold mb-4">Need Help?</h2>
                    <p className="mb-4">If you have questions about returns or refunds, please contact us:</p>
                    <ul className="space-y-2">
                        <li><strong>Email:</strong> support@zapycard.com</li>
                        <li><strong>Phone:</strong> +880 1744220807</li>
                        <li><strong>Address:</strong> Dhaka, Bangladesh</li>
                        <li><strong>Business Hours:</strong> Sunday-Thursday, 9AM-5PM EST</li>
                    </ul>
                </motion.div>

                {/* Back to Home */}
                <div className="mt-8 text-center">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:shadow-lg transition-all"
                    >
                        ← Back to Home
                    </Link>
                </div>
            </div>
        </div>
    )
}

