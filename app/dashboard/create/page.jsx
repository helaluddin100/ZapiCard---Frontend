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
import { trackCardCreated } from '@/lib/facebook-pixel'

// Import Components
import PersonalInfo from './components/PersonalInfo'
import SocialLinks from './components/SocialLinks'
import PhotoLogo from './components/PhotoLogo'
import DesignCustomize from './components/DesignCustomize'
import Preview from './components/Preview'

export default function CreateCardPage() {
  const { success, error: showError } = useToast()
  const [step, setStep] = useState(1)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState({})
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
    },
    enableAppointment: true
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
    setSaving(true)
    setErrors({}) // Clear previous errors

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
        enable_appointment: formData.enableAppointment !== undefined ? formData.enableAppointment : true,
        // QR customization will use backend defaults
        qr_data: vcard,
      }

      // Import cardAPI
      const { cardAPI } = await import('@/lib/api')

      // Create card via API
      const response = await cardAPI.createCard(cardData)

      if (response.status === 'success') {
        // Track card creation event (both client and server-side)
        await trackCardCreated(response.data, {
          email: formData.email || null,
          phone: formData.phone || null,
        })

        success('Card created successfully!')
        setTimeout(() => {
          window.location.href = '/dashboard/my-cards'
        }, 500)
      } else {
        throw new Error(response.message || 'Failed to create card')
      }
    } catch (error) {
      console.error('Error creating card:', error)

      // Handle validation errors from backend
      if (error.response?.data?.errors) {
        const backendErrors = error.response.data.errors
        const fieldErrors = {}

        // Direct mapping of backend field names (snake_case) to frontend field names
        const fieldMap = {
          'name': 'name',
          'email': 'email',
          'phone': 'phone',
          'website': 'website',
          'address': 'address',
          'title': 'title',
          'company': 'company',
          'whatsapp': 'whatsapp',
          'secondary_phone': 'secondary_phone'
        }

        // Map backend errors to frontend field names
        Object.keys(backendErrors).forEach(backendKey => {
          const frontendKey = fieldMap[backendKey] || backendKey
          fieldErrors[frontendKey] = Array.isArray(backendErrors[backendKey])
            ? backendErrors[backendKey][0]
            : backendErrors[backendKey]
        })

        setErrors(fieldErrors)

        // If errors are in step 1 fields, go back to step 1
        if (fieldErrors.name || fieldErrors.email || fieldErrors.phone || fieldErrors.website ||
          fieldErrors.address || fieldErrors.title || fieldErrors.company || fieldErrors.whatsapp || fieldErrors.secondary_phone) {
          setStep(1)
        }

        showError('Please fix the validation errors and try again.')
      } else {
        showError(error.message || 'Failed to create card. Please try again.')
      }
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

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard/my-cards"
            className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 mb-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to My Cards
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
            Create New Card
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Build your smart visiting card step by step
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 pb-6 md:pb-0">
            {/* Progress Steps */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-start justify-between">
                {steps.map((s, idx) => {
                  const Icon = s.icon;
                  const isActive = step === s.number;
                  const isCompleted = step > s.number;
                  return (
                    <div key={s.number} className="flex items-center flex-1">
                      <div className="flex flex-col items-center flex-1">
                        <div
                          className={`
                          w-12 h-12 rounded-full flex items-center justify-center mb-2 transition
                          ${isActive
                              ? "gradient-primary text-white scale-105"
                              : ""
                            }
                          ${isCompleted
                              ? "bg-green-500 text-white"
                              : "bg-gray-200 dark:text-white  dark:bg-gray-700 text-gray-500"
                            }
                        `}
                        >
                          {isCompleted ? (
                            <CheckCircle2 className="w-6 h-6" />
                          ) : (
                            <Icon className="w-6 h-6" />
                          )}
                        </div>
                        <span
                          className={`text-xs text-center font-medium ${isActive
                              ? "text-blue-600 dark:text-blue-400"
                              : "text-gray-500 dark:text-gray-400"
                            }`}
                        >
                          {s.title}
                        </span>
                      </div>
                      {idx < steps.length - 1 && (
                        <div
                          className={`h-1 flex-1 mx-2 ${step > s.number
                              ? "bg-green-500"
                              : "bg-gray-200 dark:bg-gray-700"
                            }`}
                        />
                      )}
                    </div>
                  );
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
                    errors={errors}
                    setErrors={setErrors}
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
                    buttonText={saving ? "Saving..." : "Create Card"}
                    disabled={saving}
                  />
                )}
              </AnimatePresence>
            </form>
          </div>

          {/* Live Preview */}
          <div className="lg:col-span-1 hidden md:block">
            <Preview formData={formData} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
