'use client'

import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Upload, X } from 'lucide-react'

export default function PhotoLogo({ formData, setFormData, onNext, onBack, handleFileUpload }) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="bg-white rounded-xl shadow-lg p-6 space-y-6"
        >
            <h2 className="text-2xl font-bold text-gray-900">Photo & Logo</h2>
            <p className="text-gray-600">Upload your profile photo and company logo</p>

            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Profile Photo
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition">
                        {formData.profilePhoto ? (
                            <div className="space-y-4">
                                <img
                                    src={formData.profilePhoto}
                                    alt="Profile"
                                    className="w-32 h-32 rounded-full mx-auto object-cover"
                                />
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, profilePhoto: null })}
                                    className="text-sm text-red-600 hover:text-red-700 flex items-center justify-center gap-1 mx-auto"
                                >
                                    <X className="w-4 h-4" />
                                    Remove Photo
                                </button>
                            </div>
                        ) : (
                            <div>
                                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-600 mb-2">Click to upload or drag and drop</p>
                                <p className="text-sm text-gray-500">PNG, JPG up to 5MB</p>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleFileUpload('profilePhoto', e.target.files[0])}
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Company Logo
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition">
                        {formData.logo ? (
                            <div className="space-y-4">
                                <img
                                    src={formData.logo}
                                    alt="Logo"
                                    className="w-32 h-32 mx-auto object-contain"
                                />
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, logo: null })}
                                    className="text-sm text-red-600 hover:text-red-700 flex items-center justify-center gap-1 mx-auto"
                                >
                                    <X className="w-4 h-4" />
                                    Remove Logo
                                </button>
                            </div>
                        ) : (
                            <div>
                                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-600 mb-2">Click to upload or drag and drop</p>
                                <p className="text-sm text-gray-500">PNG, SVG up to 2MB</p>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleFileUpload('logo', e.target.files[0])}
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

            <div className="flex justify-between pt-4 border-t border-gray-200">
                <button type="button" onClick={onBack} className="btn-outline flex items-center">
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back
                </button>
                <button type="button" onClick={onNext} className="btn-primary flex items-center">
                    Next Step
                    <ArrowRight className="w-5 h-5 ml-2" />
                </button>
            </div>
        </motion.div>
    )
}

