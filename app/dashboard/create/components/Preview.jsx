'use client'

import { motion } from 'framer-motion'
import {
    Mail,
    Phone,
    MapPin,
    Globe,
    Facebook,
    Twitter,
    Instagram,
    Linkedin,
    Youtube,
    Github,
    QrCode
} from 'lucide-react'

export default function Preview({ formData }) {
    const getInitials = (name) => {
        if (!name) return 'JD'
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    }

    const getBackgroundStyle = () => {
        if (formData.useGradient && formData.gradientColors) {
            return {
                background: `linear-gradient(135deg, ${formData.gradientColors.from} 0%, ${formData.gradientColors.to} 100%)`
            }
        }
        return {
            backgroundColor: formData.primaryColor || '#3b82f6'
        }
    }

    return (
        <div className="sticky top-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Live Preview</h3>

                {/* Glassmorphic Card matching view page */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-effect rounded-xl shadow-2xl overflow-hidden"
                >
                    {/* Header with gradient/color background */}
                    <div className="relative p-8 sm:p-12" style={getBackgroundStyle()}>
                        <div className="text-center">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2 }}
                                className="mb-6"
                            >
                                {formData.profilePhoto ? (
                                    <img
                                        src={formData.profilePhoto}
                                        alt={formData.name || 'Profile'}
                                        className="w-32 h-32 sm:w-40 sm:h-40 rounded-full mx-auto border-4 border-white shadow-2xl object-cover"
                                    />
                                ) : (
                                    <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full mx-auto border-4 border-white shadow-2xl bg-white/20 flex items-center justify-center">
                                        <span className="text-4xl font-bold text-white">
                                            {getInitials(formData.name)}
                                        </span>
                                    </div>
                                )}
                            </motion.div>

                            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                                {formData.name || 'Your Name'}
                            </h1>
                            <p className="text-lg md:text-xl text-white/90 mb-1">
                                {formData.title || 'Your Title'}
                            </p>
                            <p className="text-lg md:text-xl text-white/80">
                                {formData.company || 'Your Company'}
                            </p>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 sm:p-8 bg-white dark:bg-gray-800">
                        {/* Contact Information */}
                        <div className="space-y-4 mb-8">
                            {formData.email && (
                                <div className="flex items-center text-gray-700 dark:text-gray-300">
                                    <Mail className="w-5 h-5 mr-3 text-gray-400 dark:text-gray-500" />
                                    <span>{formData.email}</span>
                                </div>
                            )}

                            {formData.phone && (
                                <div className="flex items-center text-gray-700 dark:text-gray-300">
                                    <Phone className="w-5 h-5 mr-3 text-gray-400 dark:text-gray-500" />
                                    <span>{formData.phone}</span>
                                </div>
                            )}

                            {formData.website && (
                                <div className="flex items-center text-gray-700 dark:text-gray-300">
                                    <Globe className="w-5 h-5 mr-3 text-gray-400 dark:text-gray-500" />
                                    <span>{formData.website}</span>
                                </div>
                            )}

                            {formData.address && (
                                <div className="flex items-start text-gray-700 dark:text-gray-300">
                                    <MapPin className="w-5 h-5 mr-3 text-gray-400 dark:text-gray-500 mt-0.5" />
                                    <span>{formData.address}</span>
                                </div>
                            )}
                        </div>

                        {/* Bio */}
                        {formData.bio && (
                            <div className="mb-8 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                <div
                                    className="bio-preview text-gray-700 dark:text-gray-300 leading-relaxed text-sm prose prose-sm max-w-none dark:prose-invert"
                                    dangerouslySetInnerHTML={{ __html: formData.bio }}
                                />
                            </div>
                        )}

                        {/* Social Links */}
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Connect</h3>
                            <div className="flex flex-wrap gap-3">
                                {formData.socialLinks?.linkedin && (
                                    <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center">
                                        <Linkedin className="w-6 h-6" />
                                    </div>
                                )}
                                {formData.socialLinks?.twitter && (
                                    <div className="w-12 h-12 rounded-full bg-blue-400 text-white flex items-center justify-center">
                                        <Twitter className="w-6 h-6" />
                                    </div>
                                )}
                                {formData.socialLinks?.facebook && (
                                    <div className="w-12 h-12 rounded-full bg-blue-700 text-white flex items-center justify-center">
                                        <Facebook className="w-6 h-6" />
                                    </div>
                                )}
                                {formData.socialLinks?.instagram && (
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 text-white flex items-center justify-center">
                                        <Instagram className="w-6 h-6" />
                                    </div>
                                )}
                                {formData.socialLinks?.youtube && (
                                    <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center">
                                        <Youtube className="w-6 h-6" />
                                    </div>
                                )}
                                {formData.socialLinks?.github && (
                                    <div className="w-12 h-12 rounded-full bg-gray-800 text-white flex items-center justify-center">
                                        <Github className="w-6 h-6" />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* QR Code Preview */}
                        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                            <div className="flex flex-col items-center">
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">QR Code will be generated automatically</p>
                                <div className="w-32 h-32 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600">
                                    <QrCode className="w-16 h-16 text-gray-400 dark:text-gray-500" />
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

