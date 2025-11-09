'use client'

import { motion } from 'framer-motion'
import { Check, Sparkles } from 'lucide-react'

export default function ProductFeatures({ features }) {
    if (!features || features.length === 0) return null

    return (
        <div>
            <div className="flex items-center gap-2 mb-6">
                <Sparkles className="w-5 h-5 text-purple-600" />
                <h3 className="text-xl font-bold text-gray-900">Product Features</h3>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                            <th className="border border-gray-200 px-4 py-3 text-left text-sm font-bold text-gray-900 uppercase tracking-wide">
                                Feature
                            </th>
                            <th className="border border-gray-200 px-4 py-3 text-left text-sm font-bold text-gray-900 uppercase tracking-wide">
                                Details
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {features.map((feature, index) => {
                            const featureName = typeof feature === 'object' && feature !== null
                                ? (feature.name || feature.title || feature.key || 'Feature')
                                : feature
                            const featureValue = typeof feature === 'object' && feature !== null
                                ? (feature.value || feature.description || feature.detail || '')
                                : ''

                            return (
                                <motion.tr
                                    key={index}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.03 }}
                                    className={`border-b border-gray-200 hover:bg-blue-50/50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                                        }`}
                                >
                                    <td className="border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-900">
                                        {featureName}
                                    </td>
                                    <td className="border border-gray-200 px-4 py-3 text-sm text-gray-700">
                                        {featureValue ? (
                                            <span>{featureValue}</span>
                                        ) : (
                                            <span className="flex items-center gap-1 text-green-600 font-medium">
                                                <Check className="w-4 h-4" />
                                                Included
                                            </span>
                                        )}
                                    </td>
                                </motion.tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

