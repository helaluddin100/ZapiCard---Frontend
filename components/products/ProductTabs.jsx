'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FileText, Package, Sparkles } from 'lucide-react'
import ProductDescription from './ProductDescription'
import ProductDetails from './ProductDetails'
import ProductFeatures from './ProductFeatures'

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
        return {}
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border-2 border-gray-100 shadow-sm overflow-hidden"
        >
            {/* Tab Headers */}
            <div className="flex border-b-2 border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
                {availableTabs.map((tab) => {
                    const Icon = tab.icon
                    const isActive = activeTab === tab.id
                    
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 flex items-center justify-center gap-2 px-4 py-4 font-semibold text-sm transition-all relative ${
                                isActive
                                    ? 'text-blue-600'
                                    : 'text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
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
            <div className="p-6">
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

