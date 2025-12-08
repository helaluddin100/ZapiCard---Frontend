'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { cardAPI, visitorTrackingAPI } from '@/lib/api'
import { useToast } from '@/lib/toast'
import { getVisitorDataForAPI } from '@/lib/visitorData'
import AppointmentModal from './components/AppointmentModal'
import {
    Mail,
    Phone,
    MapPin,
    Globe,
    Download,
    Calendar,
    Facebook,
    Twitter,
    Instagram,
    Linkedin,
    Youtube,
    Github,
    QrCode,
    Radio,
    Share2,
    Loader2,
    AlertCircle,
    Link as LinkIcon,
    Moon,
    Sun,
    MessageCircle
} from 'lucide-react'

export default function PublicCardPage() {
    const params = useParams()
    const slug = params?.id
    const { success } = useToast()
    const [showQR, setShowQR] = useState(false)
    const [cardData, setCardData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [showAppointmentModal, setShowAppointmentModal] = useState(false)
    const [trackingId, setTrackingId] = useState(null)
    const [visitStartTime, setVisitStartTime] = useState(null)
    const [darkMode, setDarkMode] = useState(false)
    const [mounted, setMounted] = useState(false)
    const [tilt, setTilt] = useState({ x: 0, y: 0 })

    // Check for dark mode preference on mount
    useEffect(() => {
        setMounted(true)
        // Check localStorage first
        const savedTheme = localStorage.getItem('theme')
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

        if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
            setDarkMode(true)
            document.documentElement.classList.add('dark')
        } else {
            setDarkMode(false)
            document.documentElement.classList.remove('dark')
        }
    }, [])

    const toggleDarkMode = () => {
        const newDarkMode = !darkMode
        setDarkMode(newDarkMode)

        if (newDarkMode) {
            document.documentElement.classList.add('dark')
            localStorage.setItem('theme', 'dark')
        } else {
            document.documentElement.classList.remove('dark')
            localStorage.setItem('theme', 'light')
        }
    }

    // 3D Tilt Effect for mobile
    const handleMouseMove = (e) => {
        if (window.innerWidth < 768) return // Only on desktop

        const card = e.currentTarget
        const rect = card.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top

        const centerX = rect.width / 2
        const centerY = rect.height / 2

        const rotateX = (y - centerY) / 20
        const rotateY = (centerX - x) / 20

        setTilt({ x: rotateX, y: rotateY })
    }

    const handleMouseLeave = () => {
        setTilt({ x: 0, y: 0 })
    }

    const loadCardData = useCallback(async () => {
        if (!slug) return

        try {
            setLoading(true)
            setError(null)

            // Collect visitor data (geolocation is now skipped to avoid permission prompts)
            console.log('🔄 Starting visitor data collection...')
            const visitorData = await getVisitorDataForAPI()

            // Log collected data for debugging
            console.log('✅ Collected visitor data:', visitorData)

            // Send visitor data via POST body instead of query params to avoid URL length issues
            // Filter out null/undefined values and large objects
            const cleanedVisitorData = {}
            Object.keys(visitorData).forEach(key => {
                const value = visitorData[key]
                // Skip null/undefined/empty values
                if (value === null || value === undefined || value === '') {
                    return
                }
                // Skip large nested objects (like fingerprint_components) - they're too large
                if (key === 'additional_data' && typeof value === 'object') {
                    // Only keep essential parts, skip large fingerprint components
                    const cleaned = {}
                    if (value.full_ua_parsed) {
                        cleaned.full_ua_parsed = value.full_ua_parsed
                    }
                    // Skip fingerprint_components as it's too large
                    cleanedVisitorData[key] = cleaned
                } else {
                    cleanedVisitorData[key] = value
                }
            })

            console.log('📤 Sending visitor data via POST body (keys:', Object.keys(cleanedVisitorData).length, ')')

            const response = await cardAPI.getCardBySlug(slug, cleanedVisitorData)

            console.log('📥 Response received:', response)

            if (response.status === 'success' && response.data) {
                setCardData(response.data)
                // Store tracking ID if available
                if (response.data.tracking_id) {
                    setTrackingId(response.data.tracking_id)
                }
                // Record visit start time
                setVisitStartTime(Date.now())
            } else {
                setError('Card not found')
            }
        } catch (err) {
            console.error('Error loading card:', err)
            setError(err.message || 'Failed to load card')
        } finally {
            setLoading(false)
        }
    }, [slug])

    useEffect(() => {
        loadCardData()
    }, [loadCardData])

    // Track visit duration when component unmounts or page is closed
    useEffect(() => {
        return () => {
            if (trackingId && visitStartTime) {
                const duration = Math.floor((Date.now() - visitStartTime) / 1000) // in seconds
                // Send duration update (optional, can be done via API if needed)
                // For now, we'll track it when contact is saved or appointment is created
            }
        }
    }, [trackingId, visitStartTime])

    const getInitials = (name) => {
        if (!name) return 'JD'
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    }

    const getBackgroundStyle = () => {
        if (!cardData) return { background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)' }

        if (cardData.use_gradient && cardData.gradient_colors) {
            return {
                background: `linear-gradient(135deg, ${cardData.gradient_colors.from || cardData.primary_color || '#3b82f6'} 0%, ${cardData.gradient_colors.to || cardData.button_color || '#8b5cf6'} 100%)`
            }
        }
        return {
            backgroundColor: cardData.primary_color || '#3b82f6'
        }
    }

    const getSocialIcon = (key) => {
        const icons = {
            facebook: Facebook,
            twitter: Twitter,
            instagram: Instagram,
            linkedin: Linkedin,
            youtube: Youtube,
            github: Github,
            whatsapp: LinkIcon,
            tiktok: LinkIcon,
            snapchat: LinkIcon,
            pinterest: LinkIcon,
            telegram: LinkIcon,
            discord: LinkIcon,
            behance: LinkIcon,
            dribbble: LinkIcon,
            medium: LinkIcon,
            reddit: LinkIcon
        }
        return icons[key] || LinkIcon
    }

    const getSocialColor = (key) => {
        const colors = {
            facebook: 'bg-blue-700 hover:bg-blue-800',
            twitter: 'bg-blue-400 hover:bg-blue-500',
            instagram: 'bg-gradient-to-br from-purple-600 to-pink-600 hover:opacity-90',
            linkedin: 'bg-blue-600 hover:bg-blue-700',
            youtube: 'bg-red-600 hover:bg-red-700',
            github: 'bg-gray-800 hover:bg-gray-900',
            whatsapp: 'bg-green-500 hover:bg-green-600',
            tiktok: 'bg-black hover:bg-gray-900',
            snapchat: 'bg-yellow-400 hover:bg-yellow-500',
            pinterest: 'bg-red-700 hover:bg-red-800',
            telegram: 'bg-blue-500 hover:bg-blue-600',
            discord: 'bg-indigo-600 hover:bg-indigo-700',
            behance: 'bg-blue-500 hover:bg-blue-600',
            dribbble: 'bg-pink-500 hover:bg-pink-600',
            medium: 'bg-gray-800 hover:bg-gray-900',
            reddit: 'bg-orange-500 hover:bg-orange-600'
        }
        return colors[key] || 'bg-gray-600 hover:bg-gray-700'
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 mx-auto text-blue-600 dark:text-blue-400 animate-spin mb-4" />
                    <p className="text-gray-600 dark:text-gray-300">Loading card...</p>
                </div>
            </div>
        )
    }

    if (error || !cardData) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center py-12 px-4">
                <div className="text-center max-w-md">
                    <AlertCircle className="w-16 h-16 mx-auto text-red-400 dark:text-red-500 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Card Not Found</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">{error || 'The card you are looking for does not exist or is not active.'}</p>
                    <a
                        href="/"
                        className="btn-primary inline-flex items-center"
                    >
                        ← Back to Home
                    </a>
                </div>
            </div>
        )
    }

    const handleDownloadVCard = async () => {
        if (!cardData) return

        const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${cardData.name || ''}
ORG:${cardData.company || ''}
TITLE:${cardData.title || ''}
EMAIL:${cardData.email || ''}
TEL:${cardData.phone || ''}
URL:${cardData.website || ''}
ADR:;;${cardData.address || ''};;;;
NOTE:${cardData.bio || ''}
END:VCARD`

        const blob = new Blob([vcard], { type: 'text/vcard' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `${(cardData.name || 'card').replace(/\s+/g, '_')}.vcf`
        link.click()
        URL.revokeObjectURL(url)

        // Track contact saved
        if (trackingId) {
            try {
                await visitorTrackingAPI.markContactSaved(trackingId)
            } catch (error) {
                console.error('Failed to track contact save:', error)
            }
        }
    }

    const handleShare = async () => {
        if (!cardData) return

        if (navigator.share) {
            try {
                await navigator.share({
                    title: `${cardData.name} - ${cardData.title || ''}`,
                    text: `Check out ${cardData.name}'s smart visiting card`,
                    url: window.location.href
                })
            } catch (err) {
                console.log('Error sharing:', err)
            }
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(window.location.href)
            success('Link copied to clipboard!')
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-4 sm:py-8 px-3 sm:px-4 lg:px-8">
            <div className="max-w-md sm:max-w-2xl lg:max-w-4xl mx-auto perspective-1000">
                {/* 3D Card Container */}
                <motion.div
                    initial={{ opacity: 1, y: 0, rotateX: 0 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    transition={{ duration: 0 }}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    style={{
                        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(1, 1, 1)`,
                        transformStyle: 'preserve-3d',
                    }}
                    className="relative transform-gpu"
                >
                    {/* Glassmorphic Card with 3D effect */}
                    <div className="rounded-2xl sm:rounded-3xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] dark:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] overflow-hidden bg-white dark:bg-gray-800 border border-gray-200/80 dark:border-gray-700/80 relative"
                    >
                        {/* Header with gradient background - 3D effect */}
                        <div
                            className="relative p-6 sm:p-8 lg:p-12 overflow-hidden"
                            style={getBackgroundStyle()}
                        >
                            {/* Animated background gradient overlay - no blur */}
                            <div className="absolute inset-0 opacity-30 dark:opacity-20">
                                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/40 to-transparent"></div>
                                <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/30 rounded-full"></div>
                            </div>

                            <div className="absolute top-3 right-3 sm:top-4 sm:right-4 flex gap-2 z-10">
                                <motion.button
                                    onClick={toggleDarkMode}
                                    whileHover={{ scale: 1.1, y: -2 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="flex items-center justify-center p-2.5 sm:p-2 bg-white/30 rounded-full text-white hover:bg-white/40 transition-all duration-200 shadow-lg hover:shadow-xl"
                                    title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                                >
                                    {darkMode ? <Sun className="w-4 h-4 sm:w-5 sm:h-5" /> : <Moon className="w-4 h-4 sm:w-5 sm:h-5" />}
                                </motion.button>
                                <motion.button
                                    onClick={handleShare}
                                    whileHover={{ scale: 1.1, y: -2 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="flex items-center justify-center p-2.5 sm:p-2 bg-white/30 rounded-full text-white hover:bg-white/40 transition-all duration-200 shadow-lg hover:shadow-xl"
                                    title="Share this card"
                                >
                                    <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
                                </motion.button>
                            </div>

                            <div className="text-center relative z-10">
                                <motion.div
                                    initial={{ scale: 1, rotateY: 0 }}
                                    animate={{ scale: 1, rotateY: 0 }}
                                    transition={{ duration: 0 }}
                                    className="mb-4 sm:mb-6"
                                >
                                    {cardData.profile_photo ? (
                                        <div className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 rounded-full mx-auto border-4 border-white/90 shadow-[0_10px_40px_rgba(0,0,0,0.3)] overflow-hidden relative"
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                                            <Image
                                                src={cardData.profile_photo}
                                                alt={cardData.name}
                                                width={160}
                                                height={160}
                                                className="w-full h-full object-cover relative z-10"
                                                unoptimized={cardData.profile_photo.startsWith('data:')}
                                            />
                                        </div>
                                    ) : (
                                        <div className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 rounded-full mx-auto border-4 border-white/90 shadow-[0_10px_40px_rgba(0,0,0,0.3)] bg-white/25 flex items-center justify-center relative"
                                        >
                                            <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white relative z-10">
                                                {getInitials(cardData.name)}
                                            </span>
                                        </div>
                                    )}
                                </motion.div>

                                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1 sm:mb-2 drop-shadow-lg">
                                    {cardData.name || 'Name'}
                                </h1>
                                {cardData.title && (
                                    <p className="text-lg sm:text-xl text-white/95 mb-1 drop-shadow-md">
                                        {cardData.title}
                                    </p>
                                )}
                                {cardData.company && (
                                    <p className="text-base sm:text-lg text-white/85 drop-shadow-sm">
                                        {cardData.company}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Content - 3D effect */}
                        <div
                            className="p-4 sm:p-6 lg:p-8 bg-white dark:bg-gray-800 relative"
                        >
                            {/* Bio */}
                            {cardData.bio && (
                                <div
                                    className="mb-6 sm:mb-8 p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-indigo-50 via-white to-blue-50 dark:from-gray-700 dark:via-gray-800 dark:to-gray-700 border border-indigo-100/50 dark:border-gray-600/50 shadow-[inset_0_2px_4px_rgba(0,0,0,0.04),0_2px_8px_rgba(99,102,241,0.1)] dark:shadow-[inset_0_2px_4px_rgba(0,0,0,0.2),0_2px_8px_rgba(99,102,241,0.2)]"
                                >
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-100 to-indigo-200 dark:from-indigo-900/50 dark:to-indigo-800/50 shadow-[inset_0_1px_2px_rgba(255,255,255,0.5)] dark:shadow-[inset_0_1px_2px_rgba(0,0,0,0.3)]">
                                            <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600 dark:text-indigo-400" />
                                        </div>
                                        <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100">About</h3>
                                    </div>
                                    <div
                                        className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed prose prose-sm dark:prose-invert max-w-none prose-headings:text-gray-900 dark:prose-headings:text-gray-100 prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-a:text-indigo-600 dark:prose-a:text-indigo-400 prose-a:font-medium"
                                        dangerouslySetInnerHTML={{ __html: cardData.bio }}
                                    />
                                </div>
                            )}
                            {/* Contact Information */}
                            <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                                {cardData.email && (
                                    <motion.a
                                        href={`mailto:${cardData.email}`}
                                        whileHover={{ scale: 1.02, x: 5, y: -2 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="flex items-center p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-700 dark:via-gray-800 dark:to-gray-700 text-gray-800 dark:text-gray-100 hover:text-blue-700 dark:hover:text-blue-300 transition-all duration-300 group shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)] hover:shadow-[inset_0_2px_8px_rgba(59,130,246,0.15),0_4px_12px_rgba(59,130,246,0.2)] dark:hover:shadow-[inset_0_2px_8px_rgba(59,130,246,0.25),0_4px_12px_rgba(59,130,246,0.3)] border border-blue-100/50 dark:border-gray-600/50 hover:border-blue-300 dark:hover:border-blue-500/50"
                                    >
                                        <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/50 dark:to-blue-800/50 mr-4 group-hover:from-blue-200 group-hover:to-blue-300 dark:group-hover:from-blue-800 dark:group-hover:to-blue-700 transition-all duration-300 shadow-[inset_0_1px_2px_rgba(255,255,255,0.5)] dark:shadow-[inset_0_1px_2px_rgba(0,0,0,0.3)]">
                                            <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-xs text-gray-500 dark:text-gray-400 mb-0.5 font-medium">Email</div>
                                            <span className="font-semibold text-sm sm:text-base break-all block">{cardData.email}</span>
                                        </div>
                                    </motion.a>
                                )}

                                {cardData.phone && (
                                    <motion.a
                                        href={`tel:${cardData.phone}`}
                                        whileHover={{ scale: 1.02, x: 5, y: -2 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="flex items-center p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-700 dark:via-gray-800 dark:to-gray-700 text-gray-800 dark:text-gray-100 hover:text-green-700 dark:hover:text-green-300 transition-all duration-300 group shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)] hover:shadow-[inset_0_2px_8px_rgba(34,197,94,0.15),0_4px_12px_rgba(34,197,94,0.2)] dark:hover:shadow-[inset_0_2px_8px_rgba(34,197,94,0.25),0_4px_12px_rgba(34,197,94,0.3)] border border-green-100/50 dark:border-gray-600/50 hover:border-green-300 dark:hover:border-green-500/50"
                                    >
                                        <div className="p-2.5 rounded-xl bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/50 dark:to-green-800/50 mr-4 group-hover:from-green-200 group-hover:to-green-300 dark:group-hover:from-green-800 dark:group-hover:to-green-700 transition-all duration-300 shadow-[inset_0_1px_2px_rgba(255,255,255,0.5)] dark:shadow-[inset_0_1px_2px_rgba(0,0,0,0.3)]">
                                            <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 dark:text-green-400 group-hover:text-green-700 dark:group-hover:text-green-300 transition-colors" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-xs text-gray-500 dark:text-gray-400 mb-0.5 font-medium">Phone</div>
                                            <span className="font-semibold text-sm sm:text-base">{cardData.phone}</span>
                                        </div>
                                    </motion.a>
                                )}

                                {cardData.website && (
                                    <motion.a
                                        href={cardData.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        whileHover={{ scale: 1.02, x: 5, y: -2 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="flex items-center p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-700 dark:via-gray-800 dark:to-gray-700 text-gray-800 dark:text-gray-100 hover:text-purple-700 dark:hover:text-purple-300 transition-all duration-300 group shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)] hover:shadow-[inset_0_2px_8px_rgba(168,85,247,0.15),0_4px_12px_rgba(168,85,247,0.2)] dark:hover:shadow-[inset_0_2px_8px_rgba(168,85,247,0.25),0_4px_12px_rgba(168,85,247,0.3)] border border-purple-100/50 dark:border-gray-600/50 hover:border-purple-300 dark:hover:border-purple-500/50"
                                    >
                                        <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/50 dark:to-purple-800/50 mr-4 group-hover:from-purple-200 group-hover:to-purple-300 dark:group-hover:from-purple-800 dark:group-hover:to-purple-700 transition-all duration-300 shadow-[inset_0_1px_2px_rgba(255,255,255,0.5)] dark:shadow-[inset_0_1px_2px_rgba(0,0,0,0.3)]">
                                            <Globe className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 dark:text-purple-400 group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-colors" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-xs text-gray-500 dark:text-gray-400 mb-0.5 font-medium">Website</div>
                                            <span className="font-semibold text-sm sm:text-base break-all block">{cardData.website}</span>
                                        </div>
                                    </motion.a>
                                )}

                                {cardData.address && (
                                    <motion.div
                                        whileHover={{ scale: 1.01, y: -2 }}
                                        className="flex items-start p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-orange-50 via-white to-amber-50 dark:from-gray-700 dark:via-gray-800 dark:to-gray-700 text-gray-800 dark:text-gray-100 shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)] border border-orange-100/50 dark:border-gray-600/50"
                                    >
                                        <div className="p-2.5 rounded-xl bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/50 dark:to-orange-800/50 mr-4 flex-shrink-0 shadow-[inset_0_1px_2px_rgba(255,255,255,0.5)] dark:shadow-[inset_0_1px_2px_rgba(0,0,0,0.3)]">
                                            <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600 dark:text-orange-400" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-xs text-gray-500 dark:text-gray-400 mb-0.5 font-medium">Address</div>
                                            <span className="font-semibold text-sm sm:text-base">{cardData.address}</span>
                                        </div>
                                    </motion.div>
                                )}
                            </div>



                            {/* Social Links */}
                            {cardData.social_links && Object.keys(cardData.social_links).length > 0 && (
                                <div className="mb-6 sm:mb-8">
                                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4">Connect</h3>
                                    <div className="flex flex-wrap gap-2 sm:gap-3 justify-center sm:justify-start">
                                        {Object.entries(cardData.social_links).map(([key, url], index) => {
                                            if (!url) return null
                                            const Icon = getSocialIcon(key)
                                            const colorClass = getSocialColor(key)

                                            return (
                                                <motion.a
                                                    key={key}
                                                    href={url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    initial={{ opacity: 0, scale: 0 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    transition={{ delay: 0.4 + index * 0.1 }}
                                                    whileHover={{ scale: 1.15, y: -5 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full ${colorClass} text-white flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-2xl`}
                                                    title={key.charAt(0).toUpperCase() + key.slice(1)}
                                                >
                                                    <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                                                </motion.a>
                                            )
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons - Premium Design with Shimmer & Glow */}
                            <div className={`grid gap-4 sm:gap-5 mb-6 sm:mb-8 ${cardData.enable_appointment !== false ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'}`}>
                                {/* Save Contact Button */}
                                <motion.button
                                    onClick={handleDownloadVCard}
                                    whileHover={{ scale: 1.02, y: -4 }}
                                    whileTap={{ scale: 0.98, y: 0 }}
                                    className="group relative overflow-hidden flex items-center justify-center py-4 sm:py-4 px-6 rounded-2xl text-white text-sm sm:text-base font-bold transition-all duration-300"
                                >
                                    {/* Animated gradient background */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 dark:from-emerald-600 dark:via-teal-600 dark:to-cyan-600" />
                                    
                                    {/* Shimmer effect */}
                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
                                    </div>
                                    
                                    {/* Glow effect */}
                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 -z-10 scale-110" />
                                    
                                    {/* Top shine */}
                                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />
                                    
                                    {/* Inner shadow overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-50" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                                    
                                    {/* Icon with bounce animation */}
                                    <motion.div
                                        className="relative z-10 mr-3"
                                        whileHover={{ y: [0, -3, 0] }}
                                        transition={{ duration: 0.4, repeat: Infinity, repeatDelay: 0.5 }}
                                    >
                                        <div className="p-2 rounded-xl bg-white/20 backdrop-blur-sm shadow-inner">
                                            <Download className="w-5 h-5 sm:w-5 sm:h-5" />
                                        </div>
                                    </motion.div>
                                    
                                    {/* Text */}
                                    <span className="relative z-10 tracking-wide">Save Contact</span>
                                    
                                    {/* Bottom border glow */}
                                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-transparent via-white/40 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </motion.button>
                                
                                {/* Book Appointment Button */}
                                {cardData.enable_appointment !== false && (
                                    <motion.button
                                        onClick={() => setShowAppointmentModal(true)}
                                        whileHover={{ scale: 1.02, y: -4 }}
                                        whileTap={{ scale: 0.98, y: 0 }}
                                        className="group relative overflow-hidden flex items-center justify-center py-4 sm:py-4 px-6 rounded-2xl text-white text-sm sm:text-base font-bold transition-all duration-300"
                                    >
                                        {/* Animated gradient background */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 dark:from-violet-600 dark:via-purple-600 dark:to-fuchsia-600" />
                                        
                                        {/* Shimmer effect */}
                                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
                                        </div>
                                        
                                        {/* Glow effect */}
                                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400 -z-10 scale-110" />
                                        
                                        {/* Top shine */}
                                        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />
                                        
                                        {/* Inner shadow overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-50" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                                        
                                        {/* Icon with pulse animation */}
                                        <motion.div
                                            className="relative z-10 mr-3"
                                            whileHover={{ rotate: [0, -10, 10, 0] }}
                                            transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 0.8 }}
                                        >
                                            <div className="p-2 rounded-xl bg-white/20 backdrop-blur-sm shadow-inner">
                                                <Calendar className="w-5 h-5 sm:w-5 sm:h-5" />
                                            </div>
                                        </motion.div>
                                        
                                        {/* Text */}
                                        <span className="relative z-10 tracking-wide">Book Appointment</span>
                                        
                                        {/* Animated ring effect on hover */}
                                        <div className="absolute inset-0 rounded-2xl border-2 border-white/0 group-hover:border-white/30 transition-all duration-300 group-hover:scale-105 opacity-0 group-hover:opacity-100" />
                                        
                                        {/* Bottom border glow */}
                                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-transparent via-white/40 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    </motion.button>
                                )}
                            </div>

                            {/* QR Code & NFC */}
                            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 sm:pt-6">
                                <div className="flex flex-col items-center justify-center gap-4 sm:gap-6">
                                    {cardData.qr_code && (
                                        <div className="text-center w-full">
                                            <motion.button
                                                onClick={() => setShowQR(!showQR)}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                className="mb-3 px-4 py-2.5 sm:py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl transition-all duration-200 inline-flex items-center gap-2 shadow-sm hover:shadow-md"
                                            >
                                                <QrCode className="w-4 h-4" />
                                                {showQR ? 'Hide' : 'Show'} QR Code
                                            </motion.button>
                                            {showQR && (
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.8, rotateY: -90 }}
                                                    animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                                                    transition={{ duration: 0.4, type: "spring" }}
                                                    className="bg-white dark:bg-gray-700 p-4 sm:p-6 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-600 inline-block"
                                                >
                                                    <Image
                                                        src={cardData.qr_code}
                                                        alt="QR Code"
                                                        width={192}
                                                        height={192}
                                                        className="w-40 h-40 sm:w-48 sm:h-48"
                                                        unoptimized
                                                    />
                                                    <p className="mt-3 text-xs text-gray-600 dark:text-gray-400">Scan to view this card</p>
                                                </motion.div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Back to Home */}
                <div className="text-center mt-8">
                    <motion.a
                        href="/"
                        whileHover={{ x: -5 }}
                        className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 inline-flex items-center gap-2 font-medium"
                    >
                        <span>←</span>
                        <span>Create your own smart card</span>
                    </motion.a>
                </div>
            </div>

            {/* Appointment Modal */}
            {cardData && (
                <AppointmentModal
                    isOpen={showAppointmentModal}
                    onClose={() => setShowAppointmentModal(false)}
                    cardSlug={slug}
                    cardId={cardData.id}
                    trackingId={trackingId}
                />
            )}
        </div>
    )
}

