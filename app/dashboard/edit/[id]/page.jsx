'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import DashboardLayout from '@/components/DashboardLayout'
import { motion, AnimatePresence } from 'framer-motion'
import { cardAPI } from '@/lib/api'
import {
    ArrowLeft,
    CheckCircle2,
    User,
    Link as LinkIcon,
    Upload,
    Palette,
    Loader2,
    AlertCircle
} from 'lucide-react'

// Import Components
import PersonalInfo from '../../create/components/PersonalInfo'
import SocialLinks from '../../create/components/SocialLinks'
import PhotoLogo from '../../create/components/PhotoLogo'
import DesignCustomize from '../../create/components/DesignCustomize'
import Preview from '../../create/components/Preview'

export default function EditCardPage() {
    const router = useRouter()
    const params = useParams()
    const cardId = params?.id

    const [step, setStep] = useState(1)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState(null)
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
        }
    })

    const steps = [
        { number: 1, title: 'Personal Info', icon: User },
        { number: 2, title: 'Social Links', icon: LinkIcon },
        { number: 3, title: 'Photo & Logo', icon: Upload },
        { number: 4, title: 'Design', icon: Palette }
    ]

    // Load card data on mount
    useEffect(() => {
        if (cardId) {
            loadCardData()
        }
    }, [cardId])

    const loadCardData = async () => {
        try {
            setLoading(true)
            setError(null)
            const response = await cardAPI.getCard(cardId)

            if (response.status === 'success' && response.data) {
                const card = response.data

                // Map backend data to frontend form format
                setFormData({
                    name: card.name || '',
                    title: card.title || '',
                    company: card.company || '',
                    email: card.email || '',
                    phone: card.phone || '',
                    website: card.website || '',
                    address: card.address || '',
                    bio: card.bio || '',
                    socialLinks: card.social_links || {},
                    profilePhoto: card.profile_photo || null,
                    logo: card.logo || null,
                    primaryColor: card.primary_color || '#3b82f6',
                    buttonColor: card.button_color || '#8b5cf6',
                    useGradient: card.use_gradient || false,
                    gradientColors: card.gradient_colors || {
                        from: card.primary_color || '#3b82f6',
                        to: card.button_color || '#8b5cf6'
                    }
                })
            } else {
                setError('Card not found')
            }
        } catch (err) {
            console.error('Error loading card:', err)
            setError(err.message || 'Failed to load card data')
        } finally {
            setLoading(false)
        }
    }

    const handleNext = () => {
        if (step < 4) setStep(step + 1)
    }

    const handleBack = () => {
        if (step > 1) setStep(step - 1)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSaving(true)
        setError(null)

        try {
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
NOTE:${formData.bio ? formData.bio.replace(/<[^>]*>/g, '') : ''}
END:VCARD`

            // Prepare card data for backend
            const cardData = {
                name: formData.name,
                title: formData.title,
                company: formData.company,
                email: formData.email,
                phone: formData.phone,
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
                qr_data: vcard,
            }

            // Update card via API
            const response = await cardAPI.updateCard(cardId, cardData)

            if (response.status === 'success') {
                alert('Card updated successfully!')
                router.push('/dashboard/my-cards')
            } else {
                throw new Error(response.message || 'Failed to update card')
            }
        } catch (error) {
            console.error('Error updating card:', error)
            setError(error.message || 'Failed to update card. Please try again.')
            alert(error.message || 'Failed to update card. Please try again.')
        } finally {
            setSaving(false)
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

    if (loading) {
        return (
            <DashboardLayout>
                <div className="max-w-7xl mx-auto">
                    <div className="text-center py-20">
                        <Loader2 className="w-12 h-12 mx-auto text-blue-600 animate-spin mb-4" />
                        <p className="text-gray-600">Loading card data...</p>
                    </div>
                </div>
            </DashboardLayout>
        )
    }

    if (error && !loading) {
        return (
            <DashboardLayout>
                <div className="max-w-7xl mx-auto">
                    <div className="text-center py-20">
                        <AlertCircle className="w-16 h-16 mx-auto text-red-400 mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Error loading card</h3>
                        <p className="text-gray-600 mb-6">{error}</p>
                        <div className="flex gap-4 justify-center">
                            <button onClick={loadCardData} className="btn-primary inline-flex items-center">
                                Try Again
                            </button>
                            <Link href="/dashboard/my-cards" className="btn-outline inline-flex items-center">
                                <ArrowLeft className="w-5 h-5 mr-2" />
                                Back to My Cards
                            </Link>
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        )
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
                    <h1 className="text-3xl font-bold text-gray-900">Edit Card</h1>
                    <p className="text-gray-600 mt-1">Update your smart visiting card</p>
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

                        {/* Error Message */}
                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-red-800">{error}</p>
                            </div>
                        )}

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
                                        buttonText={saving ? 'Saving...' : 'Update Card'}
                                        disabled={saving}
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

