'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Upload, X, Crop } from 'lucide-react'
import ImageCropper from './ImageCropper'

export default function PhotoLogo({ formData, setFormData, onNext, onBack, handleFileUpload }) {
    const [croppingImage, setCroppingImage] = useState(null)
    const [croppingField, setCroppingField] = useState(null) // 'profilePhoto' or 'logo'

    const handleFileSelect = (field, file) => {
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                // Show cropper instead of directly setting the image
                setCroppingImage(reader.result)
                setCroppingField(field)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleCropComplete = (croppedImage) => {
        if (croppingField) {
            setFormData({ ...formData, [croppingField]: croppedImage })
        }
        setCroppingImage(null)
        setCroppingField(null)
    }

    const handleCropCancel = () => {
        setCroppingImage(null)
        setCroppingField(null)
    }

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 space-y-6 border border-gray-200 dark:border-gray-700"
        >
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">Photo & Logo</h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Upload your profile photo (300×300px) and company logo (300×300px)</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Profile Photo
                    </label>
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 sm:p-8 text-center hover:border-blue-500 dark:hover:border-blue-400 transition bg-gray-50 dark:bg-gray-700/50">
                        {formData.profilePhoto ? (
                            <div className="space-y-4">
                                <img
                                    src={formData.profilePhoto}
                                    alt="Profile"
                                    className="w-24 h-24 sm:w-32 sm:h-32 rounded-full mx-auto object-cover border-2 border-gray-300 dark:border-gray-600"
                                />
                                <div className="flex gap-2 justify-center">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const input = document.createElement('input')
                                            input.type = 'file'
                                            input.accept = 'image/*'
                                            input.onchange = (e) => {
                                                if (e.target.files[0]) {
                                                    handleFileSelect('profilePhoto', e.target.files[0])
                                                }
                                            }
                                            input.click()
                                        }}
                                        className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center justify-center gap-1 px-2 sm:px-3 py-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20 transition active:scale-95"
                                    >
                                        <Crop className="w-4 h-4" />
                                        Change
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, profilePhoto: null })}
                                        className="text-xs sm:text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 flex items-center justify-center gap-1 px-2 sm:px-3 py-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition active:scale-95"
                                    >
                                        <X className="w-4 h-4" />
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <Upload className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 dark:text-gray-500 mx-auto mb-3 sm:mb-4" />
                                <p className="text-gray-600 dark:text-gray-400 mb-2">Click to upload or drag and drop</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">PNG, JPG up to 5MB</p>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleFileSelect('profilePhoto', e.target.files[0])}
                                    className="hidden"
                                    id="profile-upload"
                                />
                                <label
                                    htmlFor="profile-upload"
                                    className="mt-4 btn-outline inline-block cursor-pointer"
                                >
                                    Choose File
                                </label>
                            </div>
                        )}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Company Logo
                    </label>
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 sm:p-8 text-center hover:border-blue-500 dark:hover:border-blue-400 transition bg-gray-50 dark:bg-gray-700/50">
                        {formData.logo ? (
                            <div className="space-y-4">
                                <img
                                    src={formData.logo}
                                    alt="Logo"
                                    className="w-24 h-24 sm:w-32 sm:h-32 mx-auto object-contain border-2 border-gray-300 dark:border-gray-600 rounded-lg p-2 bg-white dark:bg-gray-800"
                                />
                                <div className="flex gap-2 justify-center">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const input = document.createElement('input')
                                            input.type = 'file'
                                            input.accept = 'image/*'
                                            input.onchange = (e) => {
                                                if (e.target.files[0]) {
                                                    handleFileSelect('logo', e.target.files[0])
                                                }
                                            }
                                            input.click()
                                        }}
                                        className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center justify-center gap-1 px-2 sm:px-3 py-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20 transition active:scale-95"
                                    >
                                        <Crop className="w-4 h-4" />
                                        Change
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, logo: null })}
                                        className="text-xs sm:text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 flex items-center justify-center gap-1 px-2 sm:px-3 py-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition active:scale-95"
                                    >
                                        <X className="w-4 h-4" />
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <Upload className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 dark:text-gray-500 mx-auto mb-3 sm:mb-4" />
                                <p className="text-gray-600 dark:text-gray-400 mb-2">Click to upload or drag and drop</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">PNG, JPG, SVG up to 5MB</p>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleFileSelect('logo', e.target.files[0])}
                                    className="hidden"
                                    id="logo-upload"
                                />
                                <label
                                    htmlFor="logo-upload"
                                    className="mt-4 btn-outline inline-block cursor-pointer"
                                >
                                    Choose File
                                </label>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                <button type="button" onClick={onBack} className="btn-outline flex items-center">
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back
                </button>
                <button type="button" onClick={onNext} className="btn-primary flex items-center">
                    Next Step
                    <ArrowRight className="w-5 h-5 ml-2" />
                </button>
            </div>

            {/* Image Cropper Modal */}
            {croppingImage && croppingField && (
                <ImageCropper
                    imageSrc={croppingImage}
                    onCrop={handleCropComplete}
                    onCancel={handleCropCancel}
                    aspectRatio={1}
                    outputSize={300}
                    cropShape={croppingField === 'profilePhoto' ? 'circle' : 'rect'}
                />
            )}
        </motion.div>
    )
}

