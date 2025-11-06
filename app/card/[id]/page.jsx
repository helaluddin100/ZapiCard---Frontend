'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
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
    Share2
} from 'lucide-react'

export default function PublicCardPage({ params }) {
    const [showQR, setShowQR] = useState(false)

    // Mock card data - in real app, fetch based on params.id
    const cardData = {
        id: params?.id || '1',
        name: 'John Doe',
        title: 'Marketing Director',
        company: 'TechCorp Inc',
        email: 'john.doe@techcorp.com',
        phone: '+1 (555) 123-4567',
        website: 'https://techcorp.com',
        address: '123 Innovation Drive, San Francisco, CA 94105',
        bio: 'Passionate marketing professional with 10+ years of experience in digital marketing and brand strategy. Always looking to connect with like-minded professionals.',
        profilePhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
        logo: null,
        socialLinks: {
            facebook: 'https://facebook.com/johndoe',
            twitter: 'https://twitter.com/johndoe',
            instagram: 'https://instagram.com/johndoe',
            linkedin: 'https://linkedin.com/in/johndoe',
            youtube: 'https://youtube.com/@johndoe',
            github: 'https://github.com/johndoe'
        },
        appointmentEnabled: true,
        appointmentLink: 'https://calendly.com/johndoe',
        qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://zapicard.com/card/1',
        nfcEnabled: true
    }

    const handleDownloadVCard = () => {
        // Mock vCard download
        const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${cardData.name}
ORG:${cardData.company}
TITLE:${cardData.title}
EMAIL:${cardData.email}
TEL:${cardData.phone}
URL:${cardData.website}
ADR:;;${cardData.address};;;;
END:VCARD`

        const blob = new Blob([vcard], { type: 'text/vcard' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `${cardData.name.replace(' ', '_')}.vcf`
        link.click()
        URL.revokeObjectURL(url)
    }

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `${cardData.name} - ${cardData.title}`,
                    text: `Check out ${cardData.name}'s smart visiting card`,
                    url: window.location.href
                })
            } catch (err) {
                console.log('Error sharing:', err)
            }
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(window.location.href)
            alert('Link copied to clipboard!')
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
                    <div className="relative bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-8 sm:p-12">
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
                                {cardData.profilePhoto ? (
                                    <img
                                        src={cardData.profilePhoto}
                                        alt={cardData.name}
                                        className="w-32 h-32 sm:w-40 sm:h-40 rounded-full mx-auto border-4 border-white shadow-2xl object-cover"
                                    />
                                ) : (
                                    <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full mx-auto border-4 border-white shadow-2xl bg-white/20 flex items-center justify-center">
                                        <span className="text-4xl font-bold text-white">JD</span>
                                    </div>
                                )}
                            </motion.div>

                            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">{cardData.name}</h1>
                            <p className="text-xl text-white/90 mb-1">{cardData.title}</p>
                            <p className="text-lg text-white/80">{cardData.company}</p>
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
                                <p className="text-gray-700 leading-relaxed">{cardData.bio}</p>
                            </div>
                        )}

                        {/* Social Links */}
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Connect</h3>
                            <div className="flex flex-wrap gap-3">
                                {cardData.socialLinks.linkedin && (
                                    <a
                                        href={cardData.socialLinks.linkedin}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition card-hover"
                                    >
                                        <Linkedin className="w-6 h-6" />
                                    </a>
                                )}
                                {cardData.socialLinks.twitter && (
                                    <a
                                        href={cardData.socialLinks.twitter}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-12 h-12 rounded-full bg-blue-400 text-white flex items-center justify-center hover:bg-blue-500 transition card-hover"
                                    >
                                        <Twitter className="w-6 h-6" />
                                    </a>
                                )}
                                {cardData.socialLinks.facebook && (
                                    <a
                                        href={cardData.socialLinks.facebook}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-12 h-12 rounded-full bg-blue-700 text-white flex items-center justify-center hover:bg-blue-800 transition card-hover"
                                    >
                                        <Facebook className="w-6 h-6" />
                                    </a>
                                )}
                                {cardData.socialLinks.instagram && (
                                    <a
                                        href={cardData.socialLinks.instagram}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 text-white flex items-center justify-center hover:opacity-90 transition card-hover"
                                    >
                                        <Instagram className="w-6 h-6" />
                                    </a>
                                )}
                                {cardData.socialLinks.youtube && (
                                    <a
                                        href={cardData.socialLinks.youtube}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center hover:bg-red-700 transition card-hover"
                                    >
                                        <Youtube className="w-6 h-6" />
                                    </a>
                                )}
                                {cardData.socialLinks.github && (
                                    <a
                                        href={cardData.socialLinks.github}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-12 h-12 rounded-full bg-gray-800 text-white flex items-center justify-center hover:bg-gray-900 transition card-hover"
                                    >
                                        <Github className="w-6 h-6" />
                                    </a>
                                )}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="grid sm:grid-cols-2 gap-4 mb-8">
                            <button
                                onClick={handleDownloadVCard}
                                className="btn-primary flex items-center justify-center"
                            >
                                <Download className="w-5 h-5 mr-2" />
                                Save Contact
                            </button>

                            {cardData.appointmentEnabled && (
                                <a
                                    href={cardData.appointmentLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn-secondary flex items-center justify-center"
                                >
                                    <Calendar className="w-5 h-5 mr-2" />
                                    Book Appointment
                                </a>
                            )}
                        </div>

                        {/* QR Code & NFC */}
                        <div className="border-t border-gray-200 pt-6">
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                                {cardData.qrCode && (
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
                                                <img
                                                    src={cardData.qrCode}
                                                    alt="QR Code"
                                                    className="w-48 h-48"
                                                />
                                            </motion.div>
                                        )}
                                    </div>
                                )}

                                {cardData.nfcEnabled && (
                                    <div className="text-center">
                                        <div className="w-16 h-16 mx-auto mb-2 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                                            <Radio className="w-8 h-8 text-white" />
                                        </div>
                                        <p className="text-sm text-gray-600">NFC Enabled</p>
                                        <p className="text-xs text-gray-500">Tap to share</p>
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
        </div>
    )
}

