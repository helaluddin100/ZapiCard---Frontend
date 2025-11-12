'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ZoomIn, ChevronLeft, ChevronRight } from 'lucide-react'

export default function ProductImageGallery({ images, productName }) {
    const [selectedIndex, setSelectedIndex] = useState(0)
    const [isZoomed, setIsZoomed] = useState(false)

    if (!images || images.length === 0) {
        images = ['/placeholder-card.png']
    }

    const handlePrevious = () => {
        setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
    }

    const handleNext = () => {
        setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
    }

    return (
        <div className="space-y-4">
            {/* Main Image */}
            <div className="relative group bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-2xl overflow-hidden shadow-xl border-2 border-gray-100 dark:border-gray-700">
                <div className="aspect-square relative overflow-hidden">
                    <motion.img
                        key={selectedIndex}
                        src={images[selectedIndex]}
                        alt={productName}
                        className="w-full h-full object-cover"
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        onError={(e) => {
                            e.target.src = '/placeholder-card.png'
                        }}
                    />

                    {/* Zoom Indicator */}
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full p-2 shadow-lg">
                            <ZoomIn className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                        </div>
                    </div>

                    {/* Navigation Arrows */}
                    {images.length > 1 && (
                        <>
                            <button
                                onClick={handlePrevious}
                                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-white dark:hover:bg-gray-800 transition-all opacity-0 group-hover:opacity-100"
                                aria-label="Previous image"
                            >
                                <ChevronLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                            </button>
                            <button
                                onClick={handleNext}
                                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-white dark:hover:bg-gray-800 transition-all opacity-0 group-hover:opacity-100"
                                aria-label="Next image"
                            >
                                <ChevronRight className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                            </button>
                        </>
                    )}

                    {/* Image Counter */}
                    {images.length > 1 && (
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm text-white px-4 py-1.5 rounded-full text-sm font-medium">
                            {selectedIndex + 1} / {images.length}
                        </div>
                    )}
                </div>
            </div>

            {/* Thumbnail Gallery */}
            {images.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                    {images.map((img, index) => (
                        <motion.button
                            key={index}
                            onClick={() => setSelectedIndex(index)}
                            className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${selectedIndex === index
                                ? 'border-blue-500 dark:border-blue-400 ring-2 ring-blue-200 dark:ring-blue-800 shadow-lg scale-105'
                                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                                }`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <img
                                src={img}
                                alt={`${productName} - ${index + 1}`}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.target.src = '/placeholder-card.png'
                                }}
                            />
                            {selectedIndex === index && (
                                <div className="absolute inset-0 bg-blue-500/20" />
                            )}
                        </motion.button>
                    ))}
                </div>
            )}
        </div>
    )
}

