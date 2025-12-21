'use client'

import { useState, useRef, useEffect } from 'react'
import { X, Check, RotateCw, ZoomIn, ZoomOut } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function ImageCropper({ 
    imageSrc, 
    onCrop, 
    onCancel, 
    aspectRatio = 1, 
    outputSize = 300,
    cropShape = 'rect'
}) {
    const [cropArea, setCropArea] = useState({ x: 15, y: 15, width: 70, height: 70 })
    const [imageRotation, setImageRotation] = useState(0)
    const [isDragging, setIsDragging] = useState(false)
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
    const containerRef = useRef(null)
    const imageRef = useRef(null)
    const [imageLoaded, setImageLoaded] = useState(false)
    const [imageDisplaySize, setImageDisplaySize] = useState({ width: 0, height: 0, offsetX: 0, offsetY: 0 })

    useEffect(() => {
        if (imageSrc) {
            setImageLoaded(false)
            setImageRotation(0) // Reset rotation when image changes
            const img = new Image()
            img.onload = () => {
                setImageLoaded(true)
                // Store image object for dimension reference
                imageRef.current = img
            }
            img.onerror = () => {
                console.error('Failed to load image')
                setImageLoaded(false)
            }
            img.src = imageSrc
        } else {
            setImageLoaded(false)
        }
    }, [imageSrc])
    
    // Separate effect to calculate display size when image loads or container is ready
    useEffect(() => {
        if (imageLoaded && containerRef.current) {
            // Use requestAnimationFrame to ensure DOM is ready
            requestAnimationFrame(() => {
                setTimeout(() => {
                    calculateImageDisplaySize()
                    // Set initial crop area (centered, 70% of container)
                    setCropArea({
                        x: 15,
                        y: 15,
                        width: 70,
                        height: 70
                    })
                }, 100)
            })
        }
    }, [imageLoaded])

    const calculateImageDisplaySize = () => {
        if (!containerRef.current) return

        const container = containerRef.current
        const containerRect = container.getBoundingClientRect()
        
        // Try to get image dimensions from DOM element or Image object
        let imgWidth, imgHeight
        if (imageRef.current) {
            if (imageRef.current instanceof HTMLImageElement) {
                imgWidth = imageRef.current.naturalWidth || imageRef.current.width || containerRect.width
                imgHeight = imageRef.current.naturalHeight || imageRef.current.height || containerRect.height
            } else if (imageRef.current.width && imageRef.current.height) {
                imgWidth = imageRef.current.width
                imgHeight = imageRef.current.height
            } else {
                // Fallback: use container size
                imgWidth = containerRect.width
                imgHeight = containerRect.height
            }
        } else {
            // Fallback: use container size
            imgWidth = containerRect.width
            imgHeight = containerRect.height
        }
        
        // Calculate rotated dimensions
        const rotationRad = (imageRotation * Math.PI) / 180
        const cos = Math.abs(Math.cos(rotationRad))
        const sin = Math.abs(Math.sin(rotationRad))
        
        const rotatedWidth = imgWidth * cos + imgHeight * sin
        const rotatedHeight = imgWidth * sin + imgHeight * cos
        
        const imgAspect = rotatedWidth / rotatedHeight
        const containerAspect = containerRect.width / containerRect.height
        
        let displayedWidth, displayedHeight, offsetX, offsetY
        
        if (imgAspect > containerAspect) {
            // Image is wider than container
            displayedWidth = containerRect.width
            displayedHeight = displayedWidth / imgAspect
            offsetX = 0
            offsetY = (containerRect.height - displayedHeight) / 2
        } else {
            // Image is taller than container
            displayedHeight = containerRect.height
            displayedWidth = displayedHeight * imgAspect
            offsetX = (containerRect.width - displayedWidth) / 2
            offsetY = 0
        }
        
        setImageDisplaySize({ width: displayedWidth, height: displayedHeight, offsetX, offsetY })
    }

    useEffect(() => {
        if (imageLoaded && containerRef.current && imageRef.current) {
            // Recalculate when rotation changes
            calculateImageDisplaySize()
        }
    }, [imageRotation, imageLoaded])

    useEffect(() => {
        if (imageLoaded && containerRef.current && imageRef.current) {
            const handleResize = () => {
                calculateImageDisplaySize()
            }
            
            // Initial calculation after a small delay to ensure DOM is ready
            const timer = setTimeout(() => {
                calculateImageDisplaySize()
            }, 100)
            
            window.addEventListener('resize', handleResize)
            return () => {
                window.removeEventListener('resize', handleResize)
                clearTimeout(timer)
            }
        }
    }, [imageLoaded])

    const getTouchPoint = (e) => {
        if (e.touches && e.touches[0]) {
            return { x: e.touches[0].clientX, y: e.touches[0].clientY }
        }
        return { x: e.clientX, y: e.clientY }
    }

    const handleStart = (e) => {
        e.preventDefault()
        setIsDragging(true)
        const point = getTouchPoint(e)
        const rect = containerRef.current.getBoundingClientRect()
        const x = ((point.x - rect.left) / rect.width) * 100
        const y = ((point.y - rect.top) / rect.height) * 100
        
        setDragStart({
            x: x - cropArea.x,
            y: y - cropArea.y
        })
    }

    const handleMove = (e) => {
        if (!isDragging) return
        e.preventDefault()
        
        const point = getTouchPoint(e)
        const rect = containerRef.current.getBoundingClientRect()
        const x = ((point.x - rect.left) / rect.width) * 100
        const y = ((point.y - rect.top) / rect.height) * 100
        
        const newX = x - dragStart.x
        const newY = y - dragStart.y
        
        setCropArea(prev => ({
            ...prev,
            x: Math.max(0, Math.min(100 - prev.width, newX)),
            y: Math.max(0, Math.min(100 - prev.height, newY))
        }))
    }

    const handleEnd = (e) => {
        e.preventDefault()
        setIsDragging(false)
    }

    const adjustZoom = (delta) => {
        setCropArea(prev => {
            const newWidth = Math.max(20, Math.min(90, prev.width + delta))
            const newHeight = Math.max(20, Math.min(90, prev.height + delta))
            
            return {
                ...prev,
                width: newWidth,
                height: newHeight,
                x: Math.max(0, Math.min(100 - newWidth, prev.x)),
                y: Math.max(0, Math.min(100 - newHeight, prev.y))
            }
        })
    }

    const rotateImage = () => {
        setImageRotation(prev => (prev + 90) % 360)
    }

    const handleCrop = () => {
        // Get the actual DOM image element
        const imgElement = imageRef.current
        if (!imgElement || !containerRef.current || imageDisplaySize.width === 0 || !imageDisplaySize.height) return

        // Get actual image dimensions from the original image (before any CSS rotation)
        let actualImgWidth, actualImgHeight
        if (imgElement instanceof HTMLImageElement) {
            actualImgWidth = imgElement.naturalWidth
            actualImgHeight = imgElement.naturalHeight
        } else if (imgElement.width && imgElement.height) {
            actualImgWidth = imgElement.width
            actualImgHeight = imgElement.height
        } else {
            return
        }

        if (!actualImgWidth || !actualImgHeight) return

        const canvas = document.createElement('canvas')
        canvas.width = outputSize
        canvas.height = outputSize
        const ctx = canvas.getContext('2d')

        // Get container dimensions
        const containerRect = containerRef.current.getBoundingClientRect()
        
        // Crop area in percentage of container
        const cropXPercent = cropArea.x / 100
        const cropYPercent = cropArea.y / 100
        const cropWidthPercent = cropArea.width / 100
        const cropHeightPercent = cropArea.height / 100
        
        // Crop area in container pixel coordinates
        const cropXInContainer = cropXPercent * containerRect.width
        const cropYInContainer = cropYPercent * containerRect.height
        const cropWidthInContainer = cropWidthPercent * containerRect.width
        const cropHeightInContainer = cropHeightPercent * containerRect.height
        
        // Convert container coordinates to displayed image coordinates
        // (subtract the offset where image starts in container)
        const cropXInDisplayedImage = cropXInContainer - imageDisplaySize.offsetX
        const cropYInDisplayedImage = cropYInContainer - imageDisplaySize.offsetY
        
        // Calculate scale factor: how many actual image pixels = 1 displayed pixel
        // This is the key: displayed image size vs actual image size
        const scaleX = actualImgWidth / imageDisplaySize.width
        const scaleY = actualImgHeight / imageDisplaySize.height
        
        // Convert displayed image coordinates to actual image coordinates
        let sourceX = cropXInDisplayedImage * scaleX
        let sourceY = cropYInDisplayedImage * scaleY
        let sourceWidth = cropWidthInContainer * scaleX
        let sourceHeight = cropHeightInContainer * scaleY
        
        // Ensure coordinates are within image bounds
        sourceX = Math.max(0, sourceX)
        sourceY = Math.max(0, sourceY)
        sourceWidth = Math.min(sourceWidth, actualImgWidth - sourceX)
        sourceHeight = Math.min(sourceHeight, actualImgHeight - sourceY)

        // Note: CSS rotation is only visual - we crop from the original unrotated image
        // The crop area is already correctly calculated relative to the displayed (rotated) image
        // and converted to original image coordinates via the scale factor
        // So we can use sourceX, sourceY, sourceWidth, sourceHeight directly
        
        // Final bounds check to ensure we don't go outside image
        sourceX = Math.max(0, Math.min(sourceX, actualImgWidth - sourceWidth))
        sourceY = Math.max(0, Math.min(sourceY, actualImgHeight - sourceHeight))
        sourceWidth = Math.min(sourceWidth, actualImgWidth - sourceX)
        sourceHeight = Math.min(sourceHeight, actualImgHeight - sourceY)

        // Draw cropped image
        ctx.save()
        
        if (cropShape === 'circle') {
            ctx.beginPath()
            ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2, 0, 2 * Math.PI)
            ctx.clip()
        }

        // Draw the cropped portion to fill the canvas (300x300)
        ctx.drawImage(
            imgElement,
            sourceX, sourceY, sourceWidth, sourceHeight,
            0, 0, canvas.width, canvas.height
        )

        ctx.restore()

        const croppedImage = canvas.toDataURL('image/png', 0.95)
        onCrop(croppedImage)
    }

    if (!imageLoaded) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
                <div className="text-white">Loading image...</div>
            </div>
        )
    }

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-2 sm:p-4"
                onMouseUp={handleEnd}
                onMouseLeave={handleEnd}
                onTouchEnd={handleEnd}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-3xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">
                            Crop Image ({outputSize}×{outputSize}px)
                        </h3>
                        <button
                            onClick={onCancel}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
                        >
                            <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        </button>
                    </div>

                    {/* Crop Area */}
                    <div className="flex-1 p-3 sm:p-6 overflow-auto bg-gray-100 dark:bg-gray-900 flex items-center justify-center min-h-0">
                        <div 
                            ref={containerRef}
                            className="relative bg-gray-200 dark:bg-gray-700 overflow-hidden"
                            style={{ 
                                width: '100%',
                                maxWidth: '400px',
                                height: '400px',
                                maxHeight: 'calc(90vh - 300px)',
                                minHeight: '250px',
                                aspectRatio: '1'
                            }}
                            onMouseDown={handleStart}
                            onMouseMove={handleMove}
                            onTouchStart={handleStart}
                            onTouchMove={handleMove}
                        >
                            {imageSrc && (
                                <img
                                    ref={(el) => {
                                        imageRef.current = el
                                        if (el && el.complete && containerRef.current) {
                                            setTimeout(() => calculateImageDisplaySize(), 50)
                                        }
                                    }}
                                    src={imageSrc}
                                    alt="Crop"
                                    className="absolute"
                                    style={{
                                        width: imageDisplaySize.width > 0 ? `${imageDisplaySize.width}px` : '100%',
                                        height: imageDisplaySize.height > 0 ? `${imageDisplaySize.height}px` : '100%',
                                        left: `${imageDisplaySize.offsetX}px`,
                                        top: `${imageDisplaySize.offsetY}px`,
                                        objectFit: 'contain',
                                        transform: `rotate(${imageRotation}deg)`,
                                        transformOrigin: 'center',
                                        userSelect: 'none',
                                        pointerEvents: 'none'
                                    }}
                                    onLoad={(e) => {
                                        const img = e.target
                                        if (img && containerRef.current) {
                                            setTimeout(() => {
                                                calculateImageDisplaySize()
                                            }, 50)
                                        }
                                    }}
                                />
                            )}
                            
                            {/* Dark overlay with crop window */}
                            <div 
                                className="absolute inset-0 bg-black bg-opacity-50 pointer-events-none"
                                style={{
                                    clipPath: cropShape === 'circle' 
                                        ? `circle(${cropArea.width / 2}% at ${cropArea.x + cropArea.width / 2}% ${cropArea.y + cropArea.height / 2}%)`
                                        : `polygon(
                                            0% 0%, 
                                            0% 100%, 
                                            ${cropArea.x}% 100%, 
                                            ${cropArea.x}% ${cropArea.y}%, 
                                            ${cropArea.x + cropArea.width}% ${cropArea.y}%, 
                                            ${cropArea.x + cropArea.width}% ${cropArea.y + cropArea.height}%, 
                                            ${cropArea.x}% ${cropArea.y + cropArea.height}%, 
                                            ${cropArea.x}% 100%, 
                                            100% 100%, 
                                            100% 0%
                                        )`
                                }}
                            />
                            
                            {/* Crop area border */}
                            <div
                                className="absolute border-2 border-blue-500 bg-transparent cursor-move"
                                style={{
                                    left: `${cropArea.x}%`,
                                    top: `${cropArea.y}%`,
                                    width: `${cropArea.width}%`,
                                    height: `${cropArea.height}%`,
                                    borderRadius: cropShape === 'circle' ? '50%' : '4px',
                                    pointerEvents: isDragging ? 'none' : 'auto'
                                }}
                            >
                                {/* Corner handles for desktop */}
                                {cropShape === 'rect' && (
                                    <>
                                        <div className="absolute -top-1 -left-1 w-3 h-3 sm:w-4 sm:h-4 bg-blue-500 border-2 border-white rounded-full cursor-nwse-resize shadow-lg hidden sm:block" />
                                        <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-blue-500 border-2 border-white rounded-full cursor-nesw-resize shadow-lg hidden sm:block" />
                                        <div className="absolute -bottom-1 -left-1 w-3 h-3 sm:w-4 sm:h-4 bg-blue-500 border-2 border-white rounded-full cursor-nesw-resize shadow-lg hidden sm:block" />
                                        <div className="absolute -bottom-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-blue-500 border-2 border-white rounded-full cursor-nwse-resize shadow-lg hidden sm:block" />
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="p-3 sm:p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                        <div className="flex items-center justify-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                            <button
                                type="button"
                                onClick={() => adjustZoom(-5)}
                                className="p-2 sm:p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 active:scale-95 transition"
                                title="Zoom Out"
                            >
                                <ZoomOut className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-400" />
                            </button>
                            <button
                                type="button"
                                onClick={() => adjustZoom(5)}
                                className="p-2 sm:p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 active:scale-95 transition"
                                title="Zoom In"
                            >
                                <ZoomIn className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-400" />
                            </button>
                            <button
                                type="button"
                                onClick={rotateImage}
                                className="p-2 sm:p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 active:scale-95 transition"
                                title="Rotate 90°"
                            >
                                <RotateCw className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-400" />
                            </button>
                        </div>
                        <p className="text-center text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-3 sm:mb-4 px-2">
                            {isDragging ? 'Dragging...' : 'Drag the crop area to reposition • Use buttons to zoom and rotate'}
                        </p>
                        <div className="flex gap-2 sm:gap-3 justify-end">
                            <button
                                type="button"
                                onClick={onCancel}
                                className="px-4 sm:px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 active:scale-95 transition font-medium text-sm sm:text-base"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleCrop}
                                className="px-4 sm:px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:scale-95 transition font-medium flex items-center gap-2 text-sm sm:text-base"
                            >
                                <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                                Apply Crop
                            </button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}
