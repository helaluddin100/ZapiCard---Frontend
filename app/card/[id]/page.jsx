'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { cardAPI, visitorTrackingAPI } from '@/lib/api'
import { useToast } from '@/lib/toast'
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
    Link as LinkIcon
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

    const loadCardData = useCallback(async () => {
        if (!slug) return

        try {
            setLoading(true)
            setError(null)
            const response = await cardAPI.getCardBySlug(slug)

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
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 mx-auto text-blue-600 animate-spin mb-4" />
                    <p className="text-gray-600">Loading card...</p>
                </div>
            </div>
        )
    }

    if (error || !cardData) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center py-12 px-4">
                <div className="text-center max-w-md">
                    <AlertCircle className="w-16 h-16 mx-auto text-red-400 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Card Not Found</h3>
                    <p className="text-gray-600 mb-6">{error || 'The card you are looking for does not exist or is not active.'}</p>
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
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Glassmorphic Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-effect rounded-3xl shadow-2xl overflow-hidden"
                >
                    {/* Header with gradient background */}
                    <div className="relative p-8 sm:p-12" style={getBackgroundStyle()}>
                        <div className="absolute top-4 right-4">
                            <button
                                onClick={handleShare}
                                className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition"
                            >
                                <Share2 className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="text-center">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2 }}
                                className="mb-6"
                            >
                                {cardData.profile_photo ? (
                                    <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full mx-auto border-4 border-white shadow-2xl overflow-hidden">
                                        <Image
                                            src={cardData.profile_photo}
                                            alt={cardData.name}
                                            width={160}
                                            height={160}
                                            className="w-full h-full object-cover"
                                            unoptimized={cardData.profile_photo.startsWith('data:')}
                                        />
                                    </div>
                                ) : (
                                    <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full mx-auto border-4 border-white shadow-2xl bg-white/20 flex items-center justify-center">
                                        <span className="text-4xl font-bold text-white">
                                            {getInitials(cardData.name)}
                                        </span>
                                    </div>
                                )}
                            </motion.div>

                            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">{cardData.name || 'Name'}</h1>
                            {cardData.title && <p className="text-xl text-white/90 mb-1">{cardData.title}</p>}
                            {cardData.company && <p className="text-lg text-white/80">{cardData.company}</p>}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 sm:p-8 bg-white">
                        {/* Contact Information */}
                        <div className="space-y-4 mb-8">
                            {cardData.email && (
                                <a
                                    href={`mailto:${cardData.email}`}
                                    className="flex items-center text-gray-700 hover:text-blue-600 transition group"
                                >
                                    <Mail className="w-5 h-5 mr-3 text-gray-400 group-hover:text-blue-600" />
                                    <span>{cardData.email}</span>
                                </a>
                            )}

                            {cardData.phone && (
                                <a
                                    href={`tel:${cardData.phone}`}
                                    className="flex items-center text-gray-700 hover:text-blue-600 transition group"
                                >
                                    <Phone className="w-5 h-5 mr-3 text-gray-400 group-hover:text-blue-600" />
                                    <span>{cardData.phone}</span>
                                </a>
                            )}

                            {cardData.website && (
                                <a
                                    href={cardData.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center text-gray-700 hover:text-blue-600 transition group"
                                >
                                    <Globe className="w-5 h-5 mr-3 text-gray-400 group-hover:text-blue-600" />
                                    <span>{cardData.website}</span>
                                </a>
                            )}

                            {cardData.address && (
                                <div className="flex items-start text-gray-700">
                                    <MapPin className="w-5 h-5 mr-3 text-gray-400 mt-0.5" />
                                    <span>{cardData.address}</span>
                                </div>
                            )}
                        </div>

                        {/* Bio */}
                        {cardData.bio && (
                            <div className="mb-8 p-4 bg-gray-50 rounded-lg">
                                <div
                                    className="text-gray-700 leading-relaxed prose prose-sm max-w-none"
                                    dangerouslySetInnerHTML={{ __html: cardData.bio }}
                                />
                            </div>
                        )}

                        {/* Social Links */}
                        {cardData.social_links && Object.keys(cardData.social_links).length > 0 && (
                            <div className="mb-8">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Connect</h3>
                                <div className="flex flex-wrap gap-3">
                                    {Object.entries(cardData.social_links).map(([key, url]) => {
                                        if (!url) return null
                                        const Icon = getSocialIcon(key)
                                        const colorClass = getSocialColor(key)

                                        return (
                                            <a
                                                key={key}
                                                href={url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={`w-12 h-12 rounded-full ${colorClass} text-white flex items-center justify-center transition card-hover`}
                                                title={key.charAt(0).toUpperCase() + key.slice(1)}
                                            >
                                                <Icon className="w-6 h-6" />
                                            </a>
                                        )
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="grid sm:grid-cols-2 gap-4 mb-8">
                            <button
                                onClick={handleDownloadVCard}
                                className="btn-primary flex items-center justify-center"
                            >
                                <Download className="w-5 h-5 mr-2" />
                                Save Contact
                            </button>
                            <button
                                onClick={() => setShowAppointmentModal(true)}
                                className="btn-secondary flex items-center justify-center"
                            >
                                <Calendar className="w-5 h-5 mr-2" />
                                Book Appointment
                            </button>
                        </div>

                        {/* QR Code & NFC */}
                        <div className="border-t border-gray-200 pt-6">
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                                {cardData.qr_code && (
                                    <div className="text-center">
                                        <button
                                            onClick={() => setShowQR(!showQR)}
                                            className="mb-2 text-sm text-gray-600 hover:text-blue-600 transition"
                                        >
                                            {showQR ? 'Hide' : 'Show'} QR Code
                                        </button>
                                        {showQR && (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className="bg-white p-4 rounded-lg shadow-lg"
                                            >
                                                <Image
                                                    src={cardData.qr_code}
                                                    alt="QR Code"
                                                    width={192}
                                                    height={192}
                                                    className="w-48 h-48"
                                                    unoptimized
                                                />
                                            </motion.div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Back to Home */}
                <div className="text-center mt-8">
                    <a
                        href="/"
                        className="text-gray-600 hover:text-blue-600 transition inline-flex items-center"
                    >
                        ← Create your own smart card
                    </a>
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

