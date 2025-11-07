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
    Palette,
    QrCode
} from 'lucide-react'

// Import Components
import PersonalInfo from './components/PersonalInfo'
import SocialLinks from './components/SocialLinks'
import PhotoLogo from './components/PhotoLogo'
import DesignCustomize from './components/DesignCustomize'
import QRCustomization from './components/QRCustomization'
import Preview from './components/Preview'

export default function CreateCardPage() {
    const [step, setStep] = useState(1)
    const [formData, setFormData] = useState({
        // Step 1: Personal Info
        name: '',
        title: '',
        company: '',
        email: '',
        phone: '',
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
        },
        // Step 5: QR Customization
        qrFrame: 'none',
        qrLogo: 'none',
        qrShape: 'square',
        qrCorner: 'square',
        qrColor: '#000000',
        qrBackgroundColor: '#ffffff',
        qrCustomLogo: null,
        qrCode: null
    })

    const steps = [
        { number: 1, title: 'Personal Info', icon: User },
        { number: 2, title: 'Social Links', icon: LinkIcon },
        { number: 3, title: 'Photo & Logo', icon: Upload },
        { number: 4, title: 'Design', icon: Palette },
        { number: 5, title: 'QR Code', icon: QrCode }
    ]

    const handleNext = () => {
        if (step < 5) setStep(step + 1)
    }

    const handleBack = () => {
        if (step > 1) setStep(step - 1)
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        // Generate vCard data for QR code
        const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${formData.name || 'Name'}
ORG:${formData.company || 'Company'}
TITLE:${formData.title || 'Title'}
EMAIL:${formData.email || ''}
TEL:${formData.phone || ''}
URL:${formData.website || ''}
ADR:;;${formData.address || ''};;;;
NOTE:${formData.bio || ''}
END:VCARD`

        // Generate QR code URL
        const cardUrl = typeof window !== 'undefined'
            ? `${window.location.origin}/card/${Date.now()}`
            : 'https://zapicard.com/card/1'

        const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(cardUrl)}&color=${(formData.qrColor || '#000000').replace('#', '')}&bgcolor=${(formData.qrBackgroundColor || '#ffffff').replace('#', '')}`

        setFormData({ ...formData, qrCode: qrCodeUrl })

        // Mock save - no backend
        console.log('Card saved:', { ...formData, qrCode: qrCodeUrl })
        alert('Card created successfully!')
        window.location.href = '/dashboard/my-cards'
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
                    <Link href="/dashboard/my-cards" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to My Cards
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900">Create New Card</h1>
                    <p className="text-gray-600 mt-1">Build your smart visiting card step by step</p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Form */}
                    <div className="lg:col-span-2">
                        {/* Progress Steps */}
                        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
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
                          ${isCompleted ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'}
                        `}>
                                                    {isCompleted ? (
                                                        <CheckCircle2 className="w-6 h-6" />
                                                    ) : (
                                                        <Icon className="w-6 h-6" />
                                                    )}
                                                </div>
                                                <span className={`text-xs font-medium ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
                                                    {s.title}
                                                </span>
                                            </div>
                                            {idx < steps.length - 1 && (
                                                <div className={`h-1 flex-1 mx-2 ${step > s.number ? 'bg-green-500' : 'bg-gray-200'}`} />
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
                                        onNext={handleNext}
                                        onBack={handleBack}
                                    />
                                )}

                                {/* Step 5: QR Customization */}
                                {step === 5 && (
                                    <QRCustomization
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
