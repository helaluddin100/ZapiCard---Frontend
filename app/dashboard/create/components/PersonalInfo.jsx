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

export default function PersonalInfo({ formData, setFormData, onNext, errors = {}, setErrors }) {
    const [mounted, setMounted] = useState(false)
    const [touched, setTouched] = useState({})

    useEffect(() => {
        setMounted(true)
    }, [])

    // Validation function
    const validateField = (field, value) => {
        const newErrors = { ...errors }

        switch (field) {
            case 'name':
                if (!value || value.trim() === '') {
                    newErrors.name = 'Name field is required'
                } else {
                    delete newErrors.name
                }
                break
            case 'email':
                if (!value || value.trim() === '') {
                    newErrors.email = 'Email field is required'
                } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    newErrors.email = 'Please enter a valid email address'
                } else {
                    delete newErrors.email
                }
                break
            case 'website':
                if (value && value.trim() !== '') {
                    const trimmedValue = value.trim()
                    // Accept various URL formats:
                    // example.com, www.example.com, http://example.com, https://example.com, https://www.example.com
                    const urlPattern = /^(https?:\/\/)?(www\.)?([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}(\/.*)?$/

                    if (urlPattern.test(trimmedValue)) {
                        delete newErrors.website
                    } else {
                        newErrors.website = 'Please enter a valid URL (e.g., example.com or https://example.com)'
                    }
                } else {
                    delete newErrors.website
                }
                break
            default:
                break
        }

        if (setErrors) {
            setErrors(newErrors)
        }
        return newErrors
    }

    // Handle field change
    const handleFieldChange = (field, value) => {
        setFormData({ ...formData, [field]: value })

        // Clear error when user starts typing
        if (errors[field] && touched[field]) {
            validateField(field, value)
        }
    }

    // Handle field blur
    const handleFieldBlur = (field) => {
        setTouched({ ...touched, [field]: true })
        validateField(field, formData[field])
    }

    // Handle next button click with validation
    const handleNextClick = (e) => {
        e.preventDefault()

        // Mark all required fields as touched
        const newTouched = { ...touched, name: true, email: true }
        setTouched(newTouched)

        // Validate all required fields
        let newErrors = { ...errors }

        // Validate name
        if (!formData.name || formData.name.trim() === '') {
            newErrors.name = 'Name field is required'
        } else {
            delete newErrors.name
        }

        // Validate email
        if (!formData.email || formData.email.trim() === '') {
            newErrors.email = 'Email field is required'
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address'
        } else {
            delete newErrors.email
        }

        // Update errors state
        if (setErrors) {
            setErrors(newErrors)
        }

        // Check if there are any errors
        if (newErrors.name || newErrors.email) {
            return
        }

        // If validation passes, proceed to next step
        onNext()
    }

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
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 space-y-4 sm:space-y-6 border border-gray-200 dark:border-gray-700"
        >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Personal Information</h2>

            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Full Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
                        <input
                            type="text"
                            required
                            value={formData.name || ''}
                            onChange={(e) => handleFieldChange('name', e.target.value)}
                            onBlur={() => handleFieldBlur('name')}
                            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 ${errors.name
                                ? 'border-red-500 dark:border-red-500 focus:ring-red-500 dark:focus:ring-red-500'
                                : 'border-gray-300 dark:border-gray-600'
                                }`}
                            placeholder="John Doe"
                        />
                    </div>
                    {errors.name && (
                        <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.name}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Job Title
                    </label>
                    <input
                        type="text"
                        value={formData.title || ''}
                        onChange={(e) => handleFieldChange('title', e.target.value)}
                        onBlur={() => handleFieldBlur('title')}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 ${errors.title
                            ? 'border-red-500 dark:border-red-500 focus:ring-red-500 dark:focus:ring-red-500'
                            : 'border-gray-300 dark:border-gray-600'
                            }`}
                        placeholder="Marketing Director"
                    />
                    {errors.title && (
                        <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.title}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Company
                    </label>
                    <div className="relative">
                        <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
                        <input
                            type="text"
                            value={formData.company || ''}
                            onChange={(e) => handleFieldChange('company', e.target.value)}
                            onBlur={() => handleFieldBlur('company')}
                            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 ${errors.company
                                ? 'border-red-500 dark:border-red-500 focus:ring-red-500 dark:focus:ring-red-500'
                                : 'border-gray-300 dark:border-gray-600'
                                }`}
                            placeholder="TechCorp Inc"
                        />
                    </div>
                    {errors.company && (
                        <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.company}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Email <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
                        <input
                            type="email"
                            required
                            value={formData.email || ''}
                            onChange={(e) => handleFieldChange('email', e.target.value)}
                            onBlur={() => handleFieldBlur('email')}
                            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 ${errors.email
                                ? 'border-red-500 dark:border-red-500 focus:ring-red-500 dark:focus:ring-red-500'
                                : 'border-gray-300 dark:border-gray-600'
                                }`}
                            placeholder="john@example.com"
                        />
                    </div>
                    {errors.email && (
                        <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.email}</p>
                    )}
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
                            onChange={(e) => handleFieldChange('phone', e.target.value)}
                            onBlur={() => handleFieldBlur('phone')}
                            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 ${errors.phone
                                ? 'border-red-500 dark:border-red-500 focus:ring-red-500 dark:focus:ring-red-500'
                                : 'border-gray-300 dark:border-gray-600'
                                }`}
                            placeholder="+1 (555) 123-4567"
                        />
                    </div>
                    {errors.phone && (
                        <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.phone}</p>
                    )}
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
                            onChange={(e) => handleFieldChange('whatsapp', e.target.value)}
                            onBlur={() => handleFieldBlur('whatsapp')}
                            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 ${errors.whatsapp
                                ? 'border-red-500 dark:border-red-500 focus:ring-red-500 dark:focus:ring-red-500'
                                : 'border-gray-300 dark:border-gray-600'
                                }`}
                            placeholder="+1 (555) 123-4567"
                        />
                    </div>
                    {errors.whatsapp && (
                        <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.whatsapp}</p>
                    )}
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
                            onChange={(e) => handleFieldChange('secondary_phone', e.target.value)}
                            onBlur={() => handleFieldBlur('secondary_phone')}
                            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 ${errors.secondary_phone
                                ? 'border-red-500 dark:border-red-500 focus:ring-red-500 dark:focus:ring-red-500'
                                : 'border-gray-300 dark:border-gray-600'
                                }`}
                            placeholder="+1 (555) 987-6543"
                        />
                    </div>
                    {errors.secondary_phone && (
                        <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.secondary_phone}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Website
                    </label>
                    <input
                        type="text"
                        value={formData.website || ''}
                        onChange={(e) => handleFieldChange('website', e.target.value)}
                        onBlur={() => handleFieldBlur('website')}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 ${errors.website
                            ? 'border-red-500 dark:border-red-500 focus:ring-red-500 dark:focus:ring-red-500'
                            : 'border-gray-300 dark:border-gray-600'
                            }`}
                        placeholder="example.com or https://example.com"
                    />
                    {errors.website && (
                        <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.website}</p>
                    )}
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
                        onChange={(e) => handleFieldChange('address', e.target.value)}
                        onBlur={() => handleFieldBlur('address')}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 ${errors.address
                            ? 'border-red-500 dark:border-red-500 focus:ring-red-500 dark:focus:ring-red-500'
                            : 'border-gray-300 dark:border-gray-600'
                            }`}
                        placeholder="123 Main St, City, State 12345"
                    />
                </div>
                {errors.address && (
                    <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.address}</p>
                )}
            </div>

            <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Bio
                </label>
                {mounted ? (
                    <div className="w-full border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden quill-editor-wrapper">
                        <ReactQuill
                            theme="snow"
                            value={formData.bio || ''}
                            onChange={(value) => setFormData({ ...formData, bio: value })}
                            modules={quillModules}
                            formats={quillFormats}
                            placeholder="Tell people about yourself..."
                            className="bg-white dark:bg-gray-700 w-full"
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
                <button type="button" onClick={handleNextClick} className="btn-primary flex items-center">
                    Next Step
                    <ArrowRight className="w-5 h-5 ml-2" />
                </button>
            </div>
        </motion.div>
    )
}
