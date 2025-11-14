'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, User, Mail, Phone, Building, MapPin, MessageCircle } from 'lucide-react'
import dynamic from 'next/dynamic'

// Dynamically import ReactQuill to avoid SSR issues
// Use a more robust import with error handling
const ReactQuill = dynamic(
    async () => {
        try {
            const quillModule = await import('react-quill')
            return quillModule.default || quillModule
        } catch (err) {
            console.error('Failed to load react-quill:', err)
            // Return a fallback component
            const FallbackEditor = () => (
                <div className="h-[200px] border border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center">
                    <p className="text-red-500">Editor failed to load. Please refresh the page.</p>
                </div>
            )
            FallbackEditor.displayName = 'FallbackEditor'
            return FallbackEditor
        }
    },
    { 
        ssr: false,
        loading: () => (
            <div className="h-[200px] border border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Loading editor...</p>
            </div>
        )
    }
)

// Import CSS - Next.js will handle this properly
import 'react-quill/dist/quill.snow.css'

export default function PersonalInfo({ formData, setFormData, onNext }) {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const quillModules = {
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'color': [] }, { 'background': [] }],
            ['link'],
            ['clean']
        ],
    }

    const quillFormats = [
        'header',
        'bold', 'italic', 'underline', 'strike',
        'list', 'bullet',
        'color', 'background',
        'link'
    ]

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 space-y-6 border border-gray-200 dark:border-gray-700"
        >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Personal Information</h2>

            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Full Name *
                    </label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
                        <input
                            type="text"
                            required
                            value={formData.name || ''}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                            placeholder="John Doe"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Job Title *
                    </label>
                    <input
                        type="text"
                        required
                        value={formData.title || ''}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                        placeholder="Marketing Director"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Company *
                    </label>
                    <div className="relative">
                        <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
                        <input
                            type="text"
                            required
                            value={formData.company || ''}
                            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                            placeholder="TechCorp Inc"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Email *
                    </label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
                        <input
                            type="email"
                            required
                            value={formData.email || ''}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                            placeholder="john@example.com"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Phone
                    </label>
                    <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
                        <input
                            type="tel"
                            value={formData.phone || ''}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                            placeholder="+1 (555) 123-4567"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        WhatsApp
                    </label>
                    <div className="relative">
                        <MessageCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
                        <input
                            type="tel"
                            value={formData.whatsapp || ''}
                            onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                            placeholder="+1 (555) 123-4567"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Secondary Phone
                    </label>
                    <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
                        <input
                            type="tel"
                            value={formData.secondary_phone || ''}
                            onChange={(e) => setFormData({ ...formData, secondary_phone: e.target.value })}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                            placeholder="+1 (555) 987-6543"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Website
                    </label>
                    <input
                        type="url"
                        value={formData.website || ''}
                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                        placeholder="https://example.com"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Address
                </label>
                <div className="relative">
                    <MapPin className="absolute left-3 top-3 text-gray-400 dark:text-gray-500 w-5 h-5" />
                    <input
                        type="text"
                        value={formData.address || ''}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                        placeholder="123 Main St, City, State 12345"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Bio
                </label>
                {mounted ? (
                    <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden quill-editor-wrapper">
                        <ReactQuill
                            theme="snow"
                            value={formData.bio || ''}
                            onChange={(value) => setFormData({ ...formData, bio: value })}
                            modules={quillModules}
                            formats={quillFormats}
                            placeholder="Tell people about yourself..."
                            className="bg-white dark:bg-gray-700"
                            style={{ minHeight: '200px' }}
                        />
                    </div>
                ) : (
                    <textarea
                        value={formData.bio || ''}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        rows={6}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                        placeholder="Tell people about yourself..."
                    />
                )}
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
                <button type="button" onClick={onNext} className="btn-primary flex items-center">
                    Next Step
                    <ArrowRight className="w-5 h-5 ml-2" />
                </button>
            </div>
        </motion.div>
    )
}
