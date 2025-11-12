'use client'

import { motion } from 'framer-motion'
import { Tag, TrendingDown } from 'lucide-react'

export default function ProductPricing({ price, originalPrice, currencySymbol }) {
    // Ensure price and originalPrice are numbers
    const numPrice = typeof price === 'number' ? price : parseFloat(price) || 0
    const numOriginalPrice = originalPrice
        ? (typeof originalPrice === 'number' ? originalPrice : parseFloat(originalPrice) || null)
        : null

    const discount = numOriginalPrice ? ((numOriginalPrice - numPrice) / numOriginalPrice * 100).toFixed(0) : 0
    const savings = numOriginalPrice ? (numOriginalPrice - numPrice) : 0

    return (
        <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-900/20 dark:via-purple-900/20 dark:to-pink-900/20 rounded-2xl p-6 border-2 border-blue-100 dark:border-blue-800/50">
            <div className="flex items-center gap-2 mb-4">
                <Tag className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">Price</span>
            </div>

            <div className="space-y-3">
                {numOriginalPrice ? (
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-2"
                    >
                        <div className="flex items-baseline gap-4">
                            <span className="text-4xl font-bold text-gray-900 dark:text-gray-100">
                                {currencySymbol}{numPrice.toFixed(2)}
                            </span>
                            <span className="text-2xl text-gray-400 dark:text-gray-500 line-through">
                                {currencySymbol}{numOriginalPrice.toFixed(2)}
                            </span>
                            {discount > 0 && (
                                <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                                    -{discount}%
                                </span>
                            )}
                        </div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="flex items-center gap-2 text-green-600 dark:text-green-400 font-semibold"
                        >
                            <TrendingDown className="w-4 h-4" />
                            <span>You save {currencySymbol}{savings.toFixed(2)}</span>
                        </motion.div>
                    </motion.div>
                ) : (
                    <motion.span
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-4xl font-bold text-gray-900 dark:text-gray-100"
                    >
                        {currencySymbol}{numPrice.toFixed(2)}
                    </motion.span>
                )}
            </div>
        </div>
    )
}

