'use client'

import { useState } from 'react'
import Link from 'next/link'
import DashboardLayout from '@/components/DashboardLayout'
import { motion, AnimatePresence } from 'framer-motion'
import {
    ArrowLeft,
    CheckCircle2,
    User,
    Link as LinkIcon,
    Upload,
    Palette
} from 'lucide-react'
import { useToast } from '@/lib/toast'

// Import Components
import PersonalInfo from './components/PersonalInfo'
import SocialLinks from './components/SocialLinks'
import PhotoLogo from './components/PhotoLogo'
import DesignCustomize from './components/DesignCustomize'
import Preview from './components/Preview'

export default function CreateCardPage() {
    const { success, error: showError } = useToast()
    const [step, setStep] = useState(1)
    const [formData, setFormData] = useState({
        // Step 1: Personal Info
        name: '',
        title: '',
        company: '',
        email: '',
        phone: '',
        whatsapp: '',
        secondary_phone: '',
        website: '',
        address: '',
        bio: '',
        // Step 2: Social Links
        socialLinks: {},
        // Step 3: Profile Photo
        profilePhoto: null,
        logo: null,
        // Step 4: Design & Customize
        primaryColor: '#3b82f6',
        buttonColor: '#8b5cf6',
        useGradient: false,
        gradientColors: {
            from: '#3b82f6',
            to: '#8b5cf6'
        }
    })

    const steps = [
        { number: 1, title: 'Personal Info', icon: User },
        { number: 2, title: 'Social Links', icon: LinkIcon },
        { number: 3, title: 'Photo & Logo', icon: Upload },
        { number: 4, title: 'Design', icon: Palette }
    ]

    const handleNext = () => {
        if (step < 4) setStep(step + 1)
    }

    const handleBack = () => {
        if (step > 1) setStep(step - 1)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            // Generate vCard data for QR code
            const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${formData.name || 'Name'}
ORG:${formData.company || 'Company'}
TITLE:${formData.title || 'Title'}
EMAIL:${formData.email || ''}
TEL:${formData.phone || ''}
${formData.whatsapp ? `TEL;TYPE=CELL;PREF:${formData.whatsapp}` : ''}
${formData.secondary_phone ? `TEL;TYPE=CELL:${formData.secondary_phone}` : ''}
URL:${formData.website || ''}
ADR:;;${formData.address || ''};;;;
NOTE:${formData.bio ? formData.bio.replace(/<[^>]*>/g, '') : ''}
END:VCARD`

            // QR code will be generated on backend with actual card URL

            // Prepare card data for backend
            const cardData = {
                name: formData.name,
                title: formData.title,
                company: formData.company,
                email: formData.email,
                phone: formData.phone,
                whatsapp: formData.whatsapp,
                secondary_phone: formData.secondary_phone,
                website: formData.website,
                address: formData.address,
                bio: formData.bio,
                social_links: formData.socialLinks || {},
                profile_photo: formData.profilePhoto,
                logo: formData.logo,
                primary_color: formData.primaryColor,
                button_color: formData.buttonColor,
                use_gradient: formData.useGradient || false,
                gradient_colors: formData.gradientColors || null,
                // QR customization will use backend defaults
                qr_data: vcard,
            }

            // Import cardAPI
            const { cardAPI } = await import('@/lib/api')

            // Create card via API
            const response = await cardAPI.createCard(cardData)

            if (response.status === 'success') {
                success('Card created successfully!')
                setTimeout(() => {
                    window.location.href = '/dashboard/my-cards'
                }, 500)
            } else {
                throw new Error(response.message || 'Failed to create card')
            }
        } catch (error) {
            console.error('Error creating card:', error)
            showError(error.message || 'Failed to create card. Please try again.')
        }
    }

    const handleFileUpload = (field, file) => {
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setFormData({ ...formData, [field]: reader.result })
            }
            reader.readAsDataURL(file)
        }
    }

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <Link href="/dashboard/my-cards" className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 mb-4">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to My Cards
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Create New Card</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">Build your smart visiting card step by step</p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Form */}
                    <div className="lg:col-span-2">
                        {/* Progress Steps */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6 border border-gray-200 dark:border-gray-700">
                            <div className="flex items-center justify-between">
                                {steps.map((s, idx) => {
                                    const Icon = s.icon
                                    const isActive = step === s.number
                                    const isCompleted = step > s.number
                                    return (
                                        <div key={s.number} className="flex items-center flex-1">
                                            <div className="flex flex-col items-center flex-1">
                                                <div className={`
                          w-12 h-12 rounded-full flex items-center justify-center mb-2 transition
                          ${isActive ? 'gradient-primary text-white scale-110' : ''}
                          ${isCompleted ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}
                        `}>
                                                    {isCompleted ? (
                                                        <CheckCircle2 className="w-6 h-6" />
                                                    ) : (
                                                        <Icon className="w-6 h-6" />
                                                    )}
                                                </div>
                                                <span className={`text-xs font-medium ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}>
                                                    {s.title}
                                                </span>
                                            </div>
                                            {idx < steps.length - 1 && (
                                                <div className={`h-1 flex-1 mx-2 ${step > s.number ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'}`} />
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Form Steps */}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <AnimatePresence mode="wait">
                                {/* Step 1: Personal Info */}
                                {step === 1 && (
                                    <PersonalInfo
                                        formData={formData}
                                        setFormData={setFormData}
                                        onNext={handleNext}
                                    />
                                )}

                                {/* Step 2: Social Links */}
                                {step === 2 && (
                                    <SocialLinks
                                        formData={formData}
                                        setFormData={setFormData}
                                        onNext={handleNext}
                                        onBack={handleBack}
                                    />
                                )}

                                {/* Step 3: Photo & Logo */}
                                {step === 3 && (
                                    <PhotoLogo
                                        formData={formData}
                                        setFormData={setFormData}
                                        onNext={handleNext}
                                        onBack={handleBack}
                                        handleFileUpload={handleFileUpload}
                                    />
                                )}

                                {/* Step 4: Design & Customize */}
                                {step === 4 && (
                                    <DesignCustomize
                                        formData={formData}
                                        setFormData={setFormData}
                                        onNext={handleSubmit}
                                        onBack={handleBack}
                                    />
                                )}
                            </AnimatePresence>
                        </form>
                    </div>

                    {/* Live Preview */}
                    <div className="lg:col-span-1">
                        <Preview formData={formData} />
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}
