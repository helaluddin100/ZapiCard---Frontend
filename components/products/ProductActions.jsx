'use client'

import { motion } from 'framer-motion'
import { ShoppingCart, X } from 'lucide-react'

export default function ProductActions({ inStock, onOrder }) {
    return (
        <div className="mt-6">
            {inStock ? (
                <motion.button
                    onClick={onOrder}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-5 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all relative overflow-hidden group"
                >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                        <ShoppingCart className="w-6 h-6" />
                        Order Now
                    </span>
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-blue-700 via-purple-700 to-pink-700"
                        initial={{ x: '-100%' }}
                        whileHover={{ x: 0 }}
                        transition={{ duration: 0.3 }}
                    />
                </motion.button>
            ) : (
                <button
                    disabled
                    className="w-full bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 py-5 rounded-2xl font-bold text-lg cursor-not-allowed flex items-center justify-center gap-2"
                >
                    <X className="w-6 h-6" />
                    Out of Stock
                </button>
            )}
        </div>
    )
}

