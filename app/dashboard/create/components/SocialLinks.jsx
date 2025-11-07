'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    ArrowLeft,
    ArrowRight,
    Facebook,
    Twitter,
    Instagram,
    Linkedin,
    Youtube,
    Github,
    X,
    Link as LinkIcon
} from 'lucide-react'

const socialMediaOptions = [
    { key: 'facebook', label: 'Facebook', icon: Facebook, color: 'bg-blue-600', hoverColor: 'hover:bg-blue-700' },
    { key: 'twitter', label: 'Twitter', icon: Twitter, color: 'bg-blue-400', hoverColor: 'hover:bg-blue-500' },
    { key: 'instagram', label: 'Instagram', icon: Instagram, color: 'bg-gradient-to-br from-purple-600 to-pink-600', hoverColor: 'hover:opacity-90' },
    { key: 'linkedin', label: 'LinkedIn', icon: Linkedin, color: 'bg-blue-700', hoverColor: 'hover:bg-blue-800' },
    { key: 'youtube', label: 'YouTube', icon: Youtube, color: 'bg-red-600', hoverColor: 'hover:bg-red-700' },
    { key: 'github', label: 'GitHub', icon: Github, color: 'bg-gray-800', hoverColor: 'hover:bg-gray-900' },
    { key: 'whatsapp', label: 'WhatsApp', icon: LinkIcon, color: 'bg-green-500', hoverColor: 'hover:bg-green-600' },
    { key: 'tiktok', label: 'TikTok', icon: LinkIcon, color: 'bg-black', hoverColor: 'hover:bg-gray-900' },
    { key: 'snapchat', label: 'Snapchat', icon: LinkIcon, color: 'bg-yellow-400', hoverColor: 'hover:bg-yellow-500' },
    { key: 'pinterest', label: 'Pinterest', icon: LinkIcon, color: 'bg-red-700', hoverColor: 'hover:bg-red-800' },
    { key: 'telegram', label: 'Telegram', icon: LinkIcon, color: 'bg-blue-500', hoverColor: 'hover:bg-blue-600' },
    { key: 'discord', label: 'Discord', icon: LinkIcon, color: 'bg-indigo-600', hoverColor: 'hover:bg-indigo-700' },
    { key: 'behance', label: 'Behance', icon: LinkIcon, color: 'bg-blue-500', hoverColor: 'hover:bg-blue-600' },
    { key: 'dribbble', label: 'Dribbble', icon: LinkIcon, color: 'bg-pink-500', hoverColor: 'hover:bg-pink-600' },
    { key: 'medium', label: 'Medium', icon: LinkIcon, color: 'bg-gray-800', hoverColor: 'hover:bg-gray-900' },
    { key: 'reddit', label: 'Reddit', icon: LinkIcon, color: 'bg-orange-500', hoverColor: 'hover:bg-orange-600' },
]

export default function SocialLinks({ formData, setFormData, onNext, onBack }) {
    const [activeInput, setActiveInput] = useState(null)

    const handleSocialClick = (key) => {
        setActiveInput(activeInput === key ? null : key)
    }

    const handleInputChange = (key, value) => {
        setFormData({
            ...formData,
            socialLinks: {
                ...formData.socialLinks,
                [key]: value
            }
        })
    }

    const removeSocialLink = (key) => {
        const newSocialLinks = { ...formData.socialLinks }
        delete newSocialLinks[key]
        setFormData({
            ...formData,
            socialLinks: newSocialLinks
        })
        if (activeInput === key) {
            setActiveInput(null)
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="bg-white rounded-xl shadow-lg p-6 space-y-6"
        >
            <h2 className="text-2xl font-bold text-gray-900">Social Links</h2>
            <p className="text-gray-600">Click on any social media icon to add your profile link</p>

            {/* Social Media Grid */}
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-4">
                {socialMediaOptions.map((social) => {
                    const Icon = social.icon
                    const hasValue = formData.socialLinks?.[social.key]
                    const isActive = activeInput === social.key

                    return (
                        <div key={social.key} className="relative">
                            <button
                                type="button"
                                onClick={() => handleSocialClick(social.key)}
                                className={`
                                    w-full aspect-square rounded-lg flex items-center justify-center
                                    transition-all duration-200
                                    ${hasValue
                                        ? `${social.color} text-white shadow-lg scale-105`
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }
                                    ${isActive ? 'ring-4 ring-blue-400 ring-offset-2' : ''}
                                `}
                            >
                                <Icon className="w-6 h-6" />
                            </button>
                            {hasValue && !isActive && (
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        removeSocialLink(social.key)
                                    }}
                                    className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            )}
                        </div>
                    )
                })}
            </div>

            {/* Active Input Field */}
            <AnimatePresence>
                {activeInput && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {socialMediaOptions.find(s => s.key === activeInput)?.label} URL
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="url"
                                    value={formData.socialLinks?.[activeInput] || ''}
                                    onChange={(e) => handleInputChange(activeInput, e.target.value)}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                    placeholder={`https://${activeInput}.com/username`}
                                    autoFocus
                                />
                                <button
                                    type="button"
                                    onClick={() => setActiveInput(null)}
                                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                                >
                                    Done
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Navigation */}
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

