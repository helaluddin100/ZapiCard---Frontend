'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FileText, Package, Sparkles, Database } from 'lucide-react'
import ProductDescription from './ProductDescription'
import ProductDetails from './ProductDetails'
import ProductFeatures from './ProductFeatures'
import ProductFeaturesTable from './ProductFeaturesTable'

const tabs = [
    {
        id: 'description',
        label: 'Product Description',
        icon: FileText,
        component: ProductDescription,
    },
    {
        id: 'information',
        label: 'Product Information',
        icon: Package,
        component: ProductDetails,
    },
    {
        id: 'features',
        label: 'Features',
        icon: Sparkles,
        component: ProductFeatures,
    },
    {
        id: 'featuresTable',
        label: 'Features Data',
        icon: Database,
        component: ProductFeaturesTable,
    },
]

export default function ProductTabs({ product }) {
    // Find which tabs have content
    const availableTabs = useMemo(() => {
        return tabs.filter(tab => {
            if (tab.id === 'description') {
                return product?.description
            }
            if (tab.id === 'information') {
                const hasDetails = product?.sku || product?.brand || product?.weight || product?.dimensions
                return hasDetails
            }
            if (tab.id === 'features') {
                return product?.features && product.features.length > 0
            }
            if (tab.id === 'featuresTable') {
                // Check if features column has JSON data (could be array or JSON string)
                const featuresData = product?.features
                if (!featuresData) return false
                // If it's already an array or object, show it
                if (Array.isArray(featuresData) || typeof featuresData === 'object') {
                    return Object.keys(featuresData).length > 0
                }
                // If it's a string, try to parse it
                if (typeof featuresData === 'string') {
                    try {
                        const parsed = JSON.parse(featuresData)
                        return parsed && (Array.isArray(parsed) ? parsed.length > 0 : Object.keys(parsed).length > 0)
                    } catch {
                        return false
                    }
                }
                return false
            }
            return false
        })
    }, [product])

    // Set initial active tab to first available tab
    const [activeTab, setActiveTab] = useState(() => {
        return availableTabs.length > 0 ? availableTabs[0].id : 'description'
    })

    // Update active tab if current tab is not available
    useEffect(() => {
        if (availableTabs.length > 0 && !availableTabs.find(tab => tab.id === activeTab)) {
            setActiveTab(availableTabs[0].id)
        }
    }, [availableTabs, activeTab])

    // If no tabs available, don't render
    if (availableTabs.length === 0) return null

    const activeTabData = tabs.find(tab => tab.id === activeTab)
    const ActiveComponent = activeTabData?.component

    const getTabProps = () => {
        if (activeTab === 'description') {
            return { description: product?.description }
        }
        if (activeTab === 'information') {
            return { product }
        }
        if (activeTab === 'features') {
            return { features: product?.features }
        }
        if (activeTab === 'featuresTable') {
            // Get features data from product
            const featuresData = product?.features
            return { featuresData }
        }
        return {}
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden"
        >
            {/* Tab Headers */}
            <div className="flex border-b-2 border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800">
                {availableTabs.map((tab) => {
                    const Icon = tab.icon
                    const isActive = activeTab === tab.id

                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 flex items-center justify-center gap-2 px-4 py-4 font-semibold text-sm transition-all relative ${isActive
                                ? 'text-blue-600 dark:text-blue-400'
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                                }`}
                        >
                            <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`} />
                            <span className="hidden sm:inline">{tab.label}</span>
                            <span className="sm:hidden">{tab.label.split(' ')[0]}</span>

                            {/* Active Indicator */}
                            {isActive && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500"
                                    initial={false}
                                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                />
                            )}
                        </button>
                    )
                })}
            </div>

            {/* Tab Content */}
            <div className="p-6 bg-white dark:bg-gray-800">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        {ActiveComponent && (
                            <ActiveComponent {...getTabProps()} />
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </motion.div>
    )
}

