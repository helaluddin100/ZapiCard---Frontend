'use client'

import { motion } from 'framer-motion'
import { Database, Check } from 'lucide-react'

export default function ProductFeaturesTable({ featuresData }) {
    if (!featuresData) return null

    // Parse JSON if it's a string
    let parsedData = featuresData
    if (typeof featuresData === 'string') {
        try {
            parsedData = JSON.parse(featuresData)
        } catch (e) {
            console.error('Error parsing features JSON:', e)
            return (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <p>Invalid JSON data in features</p>
                </div>
            )
        }
    }

    // Convert to array of key-value pairs if it's an object
    let featuresArray = []
    if (Array.isArray(parsedData)) {
        featuresArray = parsedData.map((item, index) => {
            if (typeof item === 'object' && item !== null) {
                return {
                    key: item.key || item.name || item.title || `Feature ${index + 1}`,
                    value: item.value || item.description || item.detail || ''
                }
            }
            return {
                key: `Feature ${index + 1}`,
                value: String(item)
            }
        })
    } else if (typeof parsedData === 'object' && parsedData !== null) {
        featuresArray = Object.entries(parsedData).map(([key, value]) => ({
            key: key,
            value: typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)
        }))
    } else {
        return (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <p>No valid features data found</p>
            </div>
        )
    }

    if (featuresArray.length === 0) return null

    return (
        <div>
            <div className="flex items-center gap-2 mb-6">
                <Database className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Features Data</h3>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800">
                            <th className="border border-gray-200 dark:border-gray-600 px-4 py-3 text-left text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wide">
                                Feature Name
                            </th>
                            <th className="border border-gray-200 dark:border-gray-600 px-4 py-3 text-left text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wide">
                                Value
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {featuresArray.map((feature, index) => (
                            <motion.tr
                                key={index}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.03 }}
                                className={`border-b border-gray-200 dark:border-gray-700 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-colors ${index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50/50 dark:bg-gray-700/50'
                                    }`}
                            >
                                <td className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-sm font-semibold text-gray-900 dark:text-gray-100">
                                    {feature.key}
                                </td>
                                <td className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                                    {feature.value ? (
                                        <span className="whitespace-pre-wrap break-words">
                                            {feature.value}
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-1 text-green-600 dark:text-green-400 font-medium">
                                            <Check className="w-4 h-4" />
                                            Included
                                        </span>
                                    )}
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

