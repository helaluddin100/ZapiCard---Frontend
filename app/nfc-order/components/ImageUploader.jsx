'use client'

import { Upload, X, Image as ImageIcon } from 'lucide-react'
import { motion } from 'framer-motion'
import Image from 'next/image'

export default function ImageUploader({
    label,
    currentImage,
    onImageChange,
    accept = 'image/*',
    maxSize = 5,
    description
}) {
    const handleFileChange = (e) => {
        const file = e.target.files?.[0]
        if (file) {
            if (file.size > maxSize * 1024 * 1024) {
                alert(`File size must be less than ${maxSize}MB`)
                return
            }
            const reader = new FileReader()
            reader.onload = (event) => {
                onImageChange(event.target?.result)
            }
            reader.readAsDataURL(file)
        }
    }

    return (
        <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
                {label}
            </label>
            {description && (
                <p className="text-sm text-gray-600 mb-3">{description}</p>
            )}
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors">
                <input
                    type="file"
                    id={`image-upload-${label}`}
                    accept={accept}
                    onChange={handleFileChange}
                    className="hidden"
                />
                <label
                    htmlFor={`image-upload-${label}`}
                    className="cursor-pointer flex flex-col items-center"
                >
                    {currentImage ? (
                        <motion.div
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            className="relative"
                        >
                            <div className="relative w-48 h-48 rounded-lg overflow-hidden shadow-lg">
                                <Image
                                    src={currentImage}
                                    alt="Uploaded"
                                    fill
                                    className="object-cover"
                                    unoptimized={currentImage.startsWith('data:')}
                                />
                            </div>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation()
                                    onImageChange(null)
                                }}
                                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 shadow-lg"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </motion.div>
                    ) : (
                        <>
                            <Upload className="w-12 h-12 text-gray-400 mb-3 mx-auto" />
                            <p className="text-gray-700 font-semibold mb-1">Upload Image</p>
                            <p className="text-sm text-gray-500">PNG, JPG (Max {maxSize}MB)</p>
                        </>
                    )}
                </label>
            </div>
        </div>
    )
}

