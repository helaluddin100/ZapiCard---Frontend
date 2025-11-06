'use client'

import { useState } from 'react'
import Link from 'next/link'
import DashboardLayout from '@/components/DashboardLayout'
import { motion, AnimatePresence } from 'framer-motion'
import {
    ArrowLeft,
    ArrowRight,
    CheckCircle2,
    User,
    Mail,
    Phone,
    Building,
    MapPin,
    Link as LinkIcon,
    Facebook,
    Twitter,
    Instagram,
    Linkedin,
    Upload,
    Palette,
    Calendar,
    QrCode,
    Radio
} from 'lucide-react'

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
        facebook: '',
        twitter: '',
        instagram: '',
        linkedin: '',
        youtube: '',
        github: '',
        // Step 3: Profile Photo
        profilePhoto: null,
        logo: null,
        // Step 4: QR Customization
        qrColor: '#000000',
        qrShape: 'square',
        qrLogoCenter: false,
        // Step 5: Appointment Settings
        appointmentEnabled: false,
        appointmentLink: '',
        availableHours: '9:00 AM - 5:00 PM',
        timezone: 'UTC'
    })

    const steps = [
        { number: 1, title: 'Personal Info', icon: User },
        { number: 2, title: 'Social Links', icon: LinkIcon },
        { number: 3, title: 'Photo & Logo', icon: Upload },
        { number: 4, title: 'QR Customization', icon: QrCode },
        { number: 5, title: 'Appointments', icon: Calendar }
    ]

    const handleNext = () => {
        if (step < 5) setStep(step + 1)
    }

    const handleBack = () => {
        if (step > 1) setStep(step - 1)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        // Mock save - no backend
        console.log('Card saved:', formData)
        alert('Card created successfully!')
        window.location.href = '/dashboard'
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
                    <Link href="/dashboard" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4">
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
                                    <motion.div
                                        key="step1"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        className="bg-white rounded-xl shadow-lg p-6 space-y-6"
                                    >
                                        <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>

                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Full Name *
                                                </label>
                                                <div className="relative">
                                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                                    <input
                                                        type="text"
                                                        required
                                                        value={formData.name}
                                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                                        placeholder="John Doe"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Job Title *
                                                </label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={formData.title}
                                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                                    placeholder="Marketing Director"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Company *
                                                </label>
                                                <div className="relative">
                                                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                                    <input
                                                        type="text"
                                                        required
                                                        value={formData.company}
                                                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                                        placeholder="TechCorp Inc"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Email *
                                                </label>
                                                <div className="relative">
                                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                                    <input
                                                        type="email"
                                                        required
                                                        value={formData.email}
                                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                                        placeholder="john@example.com"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Phone
                                                </label>
                                                <div className="relative">
                                                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                                    <input
                                                        type="tel"
                                                        value={formData.phone}
                                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                                        placeholder="+1 (555) 123-4567"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Website
                                                </label>
                                                <input
                                                    type="url"
                                                    value={formData.website}
                                                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                                    placeholder="https://example.com"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Address
                                            </label>
                                            <div className="relative">
                                                <MapPin className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                                                <input
                                                    type="text"
                                                    value={formData.address}
                                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                                    placeholder="123 Main St, City, State 12345"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Bio
                                            </label>
                                            <textarea
                                                value={formData.bio}
                                                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                                rows={4}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                                placeholder="Tell people about yourself..."
                                            />
                                        </div>

                                        <div className="flex justify-end">
                                            <button type="button" onClick={handleNext} className="btn-primary flex items-center">
                                                Next Step
                                                <ArrowRight className="w-5 h-5 ml-2" />
                                            </button>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Step 2: Social Links */}
                                {step === 2 && (
                                    <motion.div
                                        key="step2"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        className="bg-white rounded-xl shadow-lg p-6 space-y-6"
                                    >
                                        <h2 className="text-2xl font-bold text-gray-900">Social Links</h2>
                                        <p className="text-gray-600">Add your social media profiles (optional)</p>

                                        <div className="space-y-4">
                                            {[
                                                { key: 'facebook', label: 'Facebook', icon: Facebook, color: 'text-blue-600' },
                                                { key: 'twitter', label: 'Twitter', icon: Twitter, color: 'text-blue-400' },
                                                { key: 'instagram', label: 'Instagram', icon: Instagram, color: 'text-pink-600' },
                                                { key: 'linkedin', label: 'LinkedIn', icon: Linkedin, color: 'text-blue-700' },
                                                { key: 'youtube', label: 'YouTube', icon: LinkIcon, color: 'text-red-600' },
                                                { key: 'github', label: 'GitHub', icon: LinkIcon, color: 'text-gray-800' }
                                            ].map((social) => {
                                                const Icon = social.icon
                                                return (
                                                    <div key={social.key}>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            {social.label}
                                                        </label>
                                                        <div className="relative">
                                                            <Icon className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${social.color}`} />
                                                            <input
                                                                type="url"
                                                                value={formData[social.key]}
                                                                onChange={(e) => setFormData({ ...formData, [social.key]: e.target.value })}
                                                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                                                placeholder={`https://${social.key}.com/username`}
                                                            />
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>

                                        <div className="flex justify-between">
                                            <button type="button" onClick={handleBack} className="btn-outline flex items-center">
                                                <ArrowLeft className="w-5 h-5 mr-2" />
                                                Back
                                            </button>
                                            <button type="button" onClick={handleNext} className="btn-primary flex items-center">
                                                Next Step
                                                <ArrowRight className="w-5 h-5 ml-2" />
                                            </button>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Step 3: Photo & Logo */}
                                {step === 3 && (
                                    <motion.div
                                        key="step3"
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
                                                                className="text-sm text-red-600 hover:text-red-700"
                                                            >
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
                                                                className="text-sm text-red-600 hover:text-red-700"
                                                            >
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

                                        <div className="flex justify-between">
                                            <button type="button" onClick={handleBack} className="btn-outline flex items-center">
                                                <ArrowLeft className="w-5 h-5 mr-2" />
                                                Back
                                            </button>
                                            <button type="button" onClick={handleNext} className="btn-primary flex items-center">
                                                Next Step
                                                <ArrowRight className="w-5 h-5 ml-2" />
                                            </button>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Step 4: QR Customization */}
                                {step === 4 && (
                                    <motion.div
                                        key="step4"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        className="bg-white rounded-xl shadow-lg p-6 space-y-6"
                                    >
                                        <h2 className="text-2xl font-bold text-gray-900">QR Code Customization</h2>
                                        <p className="text-gray-600">Customize your QR code appearance</p>

                                        <div className="space-y-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    QR Code Color
                                                </label>
                                                <div className="flex items-center gap-4">
                                                    <input
                                                        type="color"
                                                        value={formData.qrColor}
                                                        onChange={(e) => setFormData({ ...formData, qrColor: e.target.value })}
                                                        className="w-20 h-12 rounded-lg border border-gray-300 cursor-pointer"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={formData.qrColor}
                                                        onChange={(e) => setFormData({ ...formData, qrColor: e.target.value })}
                                                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                                        placeholder="#000000"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    QR Code Shape
                                                </label>
                                                <div className="grid grid-cols-3 gap-4">
                                                    {['square', 'rounded', 'circle'].map((shape) => (
                                                        <button
                                                            key={shape}
                                                            type="button"
                                                            onClick={() => setFormData({ ...formData, qrShape: shape })}
                                                            className={`p-4 border-2 rounded-lg transition ${formData.qrShape === shape
                                                                ? 'border-blue-500 bg-blue-50'
                                                                : 'border-gray-300 hover:border-gray-400'
                                                                }`}
                                                        >
                                                            <div className={`w-16 h-16 mx-auto mb-2 ${shape === 'square' ? 'rounded-none' :
                                                                shape === 'rounded' ? 'rounded-lg' : 'rounded-full'
                                                                } bg-gray-800`} />
                                                            <p className="text-sm font-medium capitalize">{shape}</p>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    id="qr-logo"
                                                    checked={formData.qrLogoCenter}
                                                    onChange={(e) => setFormData({ ...formData, qrLogoCenter: e.target.checked })}
                                                    className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                                                />
                                                <label htmlFor="qr-logo" className="ml-3 text-sm font-medium text-gray-700">
                                                    Add logo in center of QR code
                                                </label>
                                            </div>
                                        </div>

                                        <div className="flex justify-between">
                                            <button type="button" onClick={handleBack} className="btn-outline flex items-center">
                                                <ArrowLeft className="w-5 h-5 mr-2" />
                                                Back
                                            </button>
                                            <button type="button" onClick={handleNext} className="btn-primary flex items-center">
                                                Next Step
                                                <ArrowRight className="w-5 h-5 ml-2" />
                                            </button>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Step 5: Appointment Settings */}
                                {step === 5 && (
                                    <motion.div
                                        key="step5"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        className="bg-white rounded-xl shadow-lg p-6 space-y-6"
                                    >
                                        <h2 className="text-2xl font-bold text-gray-900">Appointment Settings</h2>
                                        <p className="text-gray-600">Enable appointment booking on your card (optional)</p>

                                        <div className="space-y-6">
                                            <div className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    id="appointment-enabled"
                                                    checked={formData.appointmentEnabled}
                                                    onChange={(e) => setFormData({ ...formData, appointmentEnabled: e.target.checked })}
                                                    className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                                                />
                                                <label htmlFor="appointment-enabled" className="ml-3 text-sm font-medium text-gray-700">
                                                    Enable appointment booking
                                                </label>
                                            </div>

                                            {formData.appointmentEnabled && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    className="space-y-4"
                                                >
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            Appointment Booking Link
                                                        </label>
                                                        <input
                                                            type="url"
                                                            value={formData.appointmentLink}
                                                            onChange={(e) => setFormData({ ...formData, appointmentLink: e.target.value })}
                                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                                            placeholder="https://calendly.com/your-link"
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            Available Hours
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={formData.availableHours}
                                                            onChange={(e) => setFormData({ ...formData, availableHours: e.target.value })}
                                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                                            placeholder="9:00 AM - 5:00 PM"
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            Timezone
                                                        </label>
                                                        <select
                                                            value={formData.timezone}
                                                            onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                                        >
                                                            <option value="UTC">UTC</option>
                                                            <option value="America/New_York">Eastern Time</option>
                                                            <option value="America/Chicago">Central Time</option>
                                                            <option value="America/Denver">Mountain Time</option>
                                                            <option value="America/Los_Angeles">Pacific Time</option>
                                                        </select>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </div>

                                        <div className="flex justify-between">
                                            <button type="button" onClick={handleBack} className="btn-outline flex items-center">
                                                <ArrowLeft className="w-5 h-5 mr-2" />
                                                Back
                                            </button>
                                            <button type="submit" className="btn-primary flex items-center">
                                                Create Card
                                                <CheckCircle2 className="w-5 h-5 ml-2" />
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </form>
                    </div>

                    {/* Live Preview */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-8">
                            <div className="bg-white rounded-xl shadow-lg p-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Live Preview</h3>
                                <div className="bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 rounded-xl p-6 text-white">
                                    <div className="text-center mb-4">
                                        {formData.profilePhoto ? (
                                            <img
                                                src={formData.profilePhoto}
                                                alt="Profile"
                                                className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-white shadow-lg"
                                            />
                                        ) : (
                                            <div className="w-24 h-24 rounded-full mx-auto bg-white/20 flex items-center justify-center">
                                                <User className="w-12 h-12" />
                                            </div>
                                        )}
                                        <h4 className="text-xl font-bold mt-4">{formData.name || 'Your Name'}</h4>
                                        <p className="text-white/90">{formData.title || 'Your Title'}</p>
                                        <p className="text-white/80 text-sm">{formData.company || 'Your Company'}</p>
                                    </div>

                                    <div className="space-y-2 text-sm mb-4">
                                        {formData.email && (
                                            <div className="flex items-center">
                                                <Mail className="w-4 h-4 mr-2" />
                                                {formData.email}
                                            </div>
                                        )}
                                        {formData.phone && (
                                            <div className="flex items-center">
                                                <Phone className="w-4 h-4 mr-2" />
                                                {formData.phone}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex justify-center gap-2 mb-4">
                                        {formData.facebook && <Facebook className="w-5 h-5" />}
                                        {formData.twitter && <Twitter className="w-5 h-5" />}
                                        {formData.instagram && <Instagram className="w-5 h-5" />}
                                        {formData.linkedin && <Linkedin className="w-5 h-5" />}
                                    </div>

                                    <div className="bg-white rounded-lg p-4 flex justify-center">
                                        <div
                                            className={`w-32 h-32 ${formData.qrShape === 'square' ? 'rounded-none' :
                                                formData.qrShape === 'rounded' ? 'rounded-lg' : 'rounded-full'
                                                }`}
                                            style={{ backgroundColor: formData.qrColor }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}

