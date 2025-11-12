'use client'

import { motion } from 'framer-motion'
import { Star, Award } from 'lucide-react'

export default function ProductHeader({ product }) {
    if (!product) return null

    return (
        <div className="space-y-4">
            {/* Title and Badges */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex-1">
                    <motion.h1
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-3 leading-tight"
                    >
                        {product.name}
                    </motion.h1>

                    {/* Category and Featured Badge */}
                    <div className="flex flex-wrap items-center gap-3">
                        {product.category_relation && (
                            <motion.span
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.1 }}
                                className="inline-flex items-center gap-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-md"
                            >
                                <Award className="w-4 h-4" />
                                {product.category_relation.name}
                            </motion.span>
                        )}
                        {product.is_featured && (
                            <motion.span
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.15 }}
                                className="inline-flex items-center gap-1.5 bg-gradient-to-r from-yellow-400 to-orange-400 text-yellow-900 px-4 py-2 rounded-full text-sm font-bold shadow-md"
                            >
                                <Star className="w-4 h-4 fill-current" />
                                Featured Product
                            </motion.span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

