'use client'

import { motion } from 'framer-motion'
import { Package, Weight, Ruler, Hash } from 'lucide-react'

const detailIcons = {
    sku: Hash,
    brand: Package,
    weight: Weight,
    dimensions: Ruler,
}

export default function ProductDetails({ product }) {
    const details = [
        { key: 'sku', label: 'SKU', value: product?.sku, icon: Hash },
        { key: 'brand', label: 'Brand', value: product?.brand, icon: Package },
        { key: 'weight', label: 'Weight', value: product?.weight, icon: Weight },
        { key: 'dimensions', label: 'Dimensions', value: product?.dimensions, icon: Ruler },
    ].filter(detail => detail.value)

    if (details.length === 0) return null

    return (
        <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
                <Package className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                Product Information
            </h3>

            <div className="grid sm:grid-cols-2 gap-4">
                {details.map((detail, index) => {
                    const Icon = detail.icon
                    return (
                        <motion.div
                            key={detail.key}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center gap-4 p-4 bg-gradient-to-br from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 rounded-xl border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-md transition-all"
                        >
                            <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                                <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-sm text-gray-600 dark:text-gray-400 font-medium mb-1">
                                    {detail.label}
                                </div>
                                <div className="text-base font-bold text-gray-900 dark:text-gray-100">
                                    {detail.value}
                                </div>
                            </div>
                        </motion.div>
                    )
                })}
            </div>
        </div>
    )
}

