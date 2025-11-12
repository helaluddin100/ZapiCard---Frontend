'use client'

import { Check, X, Package } from 'lucide-react'
import { motion } from 'framer-motion'

export default function ProductStockStatus({ inStock }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`inline-flex items-center gap-2 px-4 py-3 rounded-xl font-semibold ${inStock
                ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-2 border-green-200 dark:border-green-800'
                : 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-2 border-red-200 dark:border-red-800'
                }`}
        >
            {inStock ? (
                <>
                    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                        <Check className="w-5 h-5 text-white" />
                    </div>
                    <span>In Stock - Ready to Ship</span>
                </>
            ) : (
                <>
                    <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center">
                        <X className="w-5 h-5 text-white" />
                    </div>
                    <span>Out of Stock</span>
                </>
            )}
        </motion.div>
    )
}

