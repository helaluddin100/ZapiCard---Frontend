'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import DashboardLayout from '@/components/DashboardLayout'
import { motion } from 'framer-motion'
import { cardAPI } from '@/lib/api'
import { useToast } from '@/lib/toast'
import {
    Plus,
    QrCode,
    Radio,
    Eye,
    Edit,
    Trash2,
    Grid3x3,
    List,
    Search,
    Filter,
    CreditCard,
    Loader2,
    Download,
    ExternalLink
} from 'lucide-react'
import QRCodeLib from 'qrcode'

export default function MyCardsPage() {
    const { success, error: showError } = useToast()
    const [viewMode, setViewMode] = useState('grid')
    const [searchQuery, setSearchQuery] = useState('')
    const [cards, setCards] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [qrCodes, setQrCodes] = useState({})

    // Get base URL for images (images are served from public directory, not /api)
    const getImageBaseUrl = () => {
        // Get API base URL from environment or default
        let apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

        // Remove /api from the end if present
        if (apiBase.endsWith('/api')) {
            return apiBase.slice(0, -4)
        } else if (apiBase.endsWith('/api/')) {
            return apiBase.slice(0, -5)
        }

        // If no /api, assume it's already the base URL
        return apiBase
    }

    // Helper function to convert relative image paths to full URLs
    const getImageUrl = (imagePath) => {
        if (!imagePath) return null

        // If it's already a full URL, return as is
        if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
            return imagePath
        }

        // If it's a base64 data URL, return as is
        if (imagePath.startsWith('data:image/')) {
            return imagePath
        }

        // If it's a relative path, prepend image base URL (without /api)
        // Remove leading slash if present
        let cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath

        const imageBase = getImageBaseUrl()
        // Ensure no double slashes
        const fullUrl = `${imageBase.replace(/\/$/, '')}/${cleanPath}`
        return fullUrl
    }

    useEffect(() => {
        fetchCards()
    }, [])

    // Generate QR codes for all cards
    useEffect(() => {
        if (cards.length > 0) {
            generateQRCodes()
        }
    }, [cards])

    const generateQRCodes = async () => {
        if (typeof window === 'undefined') return

        const newQrCodes = {}
        for (const card of cards) {
            if (card.slug) {
                try {
                    const viewUrl = `${window.location.origin}/card/${card.slug}`
                    const qrDataUrl = await QRCodeLib.toDataURL(viewUrl, {
                        width: 200,
                        margin: 2,
                        color: {
                            dark: '#10b981',
                            light: '#ffffff'
                        }
                    })
                    newQrCodes[card.id] = qrDataUrl
                } catch (error) {
                    console.error(`Error generating QR code for card ${card.id}:`, error)
                }
            }
        }
        setQrCodes(newQrCodes)
    }

    const downloadQRCode = async (card) => {
        if (!card.slug || typeof window === 'undefined') return

        try {
            const viewUrl = `${window.location.origin}/card/${card.slug}`
            // Generate high resolution QR code (1000x1000)
            const qrDataUrl = await QRCodeLib.toDataURL(viewUrl, {
                width: 1000,
                margin: 3,
                color: {
                    dark: '#10b981',
                    light: '#ffffff'
                }
            })

            // Create download link
            const link = document.createElement('a')
            link.href = qrDataUrl
            link.download = `${card.name || 'visiting-card'}-qr-code.png`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            success('QR code downloaded successfully!')
        } catch (error) {
            console.error('Error downloading QR code:', error)
            showError('Failed to download QR code')
        }
    }

    const fetchCards = async () => {
        try {
            setLoading(true)
            setError(null)
            const response = await cardAPI.getCards()
            if (response.status === 'success' && response.data) {
                setCards(response.data)
                // Debug: Check first card's image
                if (response.data.length > 0 && response.data[0].profile_photo) {
                    const firstCard = response.data[0]
                    console.log('🔍 First card image debug:', {
                        original: firstCard.profile_photo,
                        converted: getImageUrl(firstCard.profile_photo),
                        imageBase: getImageBaseUrl()
                    })
                }
            } else {
                setCards([])
            }
        } catch (err) {
            console.error('Error fetching cards:', err)
            setError(err.message || 'Failed to fetch cards')
            setCards([])
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (cardId) => {
        if (!confirm('Are you sure you want to delete this card?')) {
            return
        }

        try {
            await cardAPI.deleteCard(cardId)
            // Remove the card from the list
            setCards(cards.filter(card => card.id !== cardId))
            success('Card deleted successfully!')
        } catch (err) {
            console.error('Error deleting card:', err)
            showError('Failed to delete card. Please try again.')
        }
    }

    const getInitials = (name) => {
        if (!name) return 'JD'
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    }

    const getCardBackground = (card) => {
        if (card.use_gradient && card.gradient_colors) {
            return {
                background: `linear-gradient(135deg, ${card.gradient_colors.from} 0%, ${card.gradient_colors.to} 100%)`
            }
        }
        return {
            backgroundColor: card.primary_color || '#3b82f6'
        }
    }

    const filteredCards = cards.filter(card =>
        card.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        card.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        card.title?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <DashboardLayout>
            <div className="max-w-8xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">My Cards</h1>
                            <p className="text-gray-600 dark:text-gray-400">Manage and organize your visiting cards</p>
                        </div>
                        <Link href="/dashboard/create" className="btn-primary flex items-center">
                            <Plus className="w-5 h-5 mr-2" />
                            Create New Card
                        </Link>
                    </div>

                    {/* Search and Filters */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search cards..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                            />
                        </div>
                        <button className="btn-outline flex items-center">
                            <Filter className="w-5 h-5 mr-2" />
                            Filter
                        </button>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded-lg transition ${viewMode === 'grid' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                            >
                                <Grid3x3 className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded-lg transition ${viewMode === 'list' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                            >
                                <List className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="text-center py-20">
                        <Loader2 className="w-12 h-12 mx-auto text-blue-600 dark:text-blue-400 animate-spin mb-4" />
                        <p className="text-gray-600 dark:text-gray-400">Loading your cards...</p>
                    </div>
                )}

                {/* Error State */}
                {error && !loading && (
                    <div className="text-center py-20">
                        <div className="text-red-400 dark:text-red-500 mb-4">
                            <CreditCard className="w-16 h-16 mx-auto" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Error loading cards</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
                        <button onClick={fetchCards} className="btn-primary inline-flex items-center">
                            Try Again
                        </button>
                    </div>
                )}

                {/* Cards Grid/List */}
                {!loading && !error && filteredCards.length === 0 && (
                    <div className="text-center py-20">
                        <div className="text-gray-400 dark:text-gray-500 mb-4">
                            <CreditCard className="w-16 h-16 mx-auto" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                            {cards.length === 0 ? 'No cards found' : 'No cards match your search'}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            {cards.length === 0
                                ? 'Create your first smart visiting card to get started'
                                : 'Try adjusting your search query'}
                        </p>
                        {cards.length === 0 && (
                            <Link href="/dashboard/create" className="btn-primary inline-flex items-center">
                                <Plus className="w-5 h-5 mr-2" />
                                Create Your First Card
                            </Link>
                        )}
                    </div>
                )}

                {!loading && !error && filteredCards.length > 0 && viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredCards.map((card, idx) => (
                            <motion.div
                                key={card.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="group relative rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all transform hover:scale-[1.02]"
                                style={{
                                    aspectRatio: '3.5 / 2',
                                    minHeight: '300px'
                                }}
                            >
                                {/* Background Image with Gradient Overlay */}
                                <div className="absolute inset-0">
                                    {card.profile_photo ? (
                                        <>
                                            <img
                                                src={getImageUrl(card.profile_photo) || ''}
                                                alt={card.name}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    console.error('❌ Background image failed to load:', {
                                                        original: card.profile_photo,
                                                        converted: getImageUrl(card.profile_photo),
                                                        cardId: card.id,
                                                        cardName: card.name
                                                    })
                                                    // Hide image and show fallback background
                                                    e.target.style.display = 'none'
                                                }}
                                                onLoad={() => {
                                                    console.log('✅ Background image loaded:', getImageUrl(card.profile_photo))
                                                }}
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/80 via-purple-600/80 to-pink-600/80"></div>
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                                        </>
                                    ) : (
                                        <div className="w-full h-full" style={getCardBackground(card)}>
                                            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/80 via-purple-600/80 to-pink-600/80"></div>
                                        </div>
                                    )}
                                </div>

                                {/* Action Buttons on Hover */}
                                <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all z-20">
                                    {card.slug && (
                                        <Link
                                            href={`/card/${card.slug}`}
                                            target="_blank"
                                            className="p-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-gray-700 dark:text-gray-300 rounded-full hover:bg-white dark:hover:bg-gray-700 hover:shadow-lg transition-all"
                                            title="View Public Page"
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                        </Link>
                                    )}
                                    <Link
                                        href={`/dashboard/edit/${card.id}`}
                                        className="p-2 bg-white/90 backdrop-blur-sm text-gray-700 rounded-full hover:bg-white hover:shadow-lg transition-all"
                                        title="Edit Card"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(card.id)}
                                        className="p-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-red-600 dark:text-red-400 rounded-full hover:bg-white dark:hover:bg-gray-700 hover:shadow-lg transition-all"
                                        title="Delete Card"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* Card Content */}
                                <div className="relative h-full flex flex-col p-4 sm:p-5 md:p-6 text-white z-10">
                                    {/* Top Section - Profile Photo & QR Code */}
                                    <div className="flex items-start justify-between mb-3">
                                        {/* Profile Photo */}
                                        <div className="flex-shrink-0">
                                            {card.profile_photo ? (
                                                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-2 md:border-4 border-white/90 shadow-xl overflow-hidden">
                                                    <img
                                                        src={getImageUrl(card.profile_photo)}
                                                        alt={card.name}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            console.error('❌ Profile photo failed to load:', {
                                                                original: card.profile_photo,
                                                                converted: getImageUrl(card.profile_photo),
                                                                cardId: card.id
                                                            })
                                                            e.target.style.display = 'none'
                                                        }}
                                                    />
                                                </div>
                                            ) : (
                                                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-2 md:border-4 border-white/90 shadow-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white text-xl md:text-2xl font-bold">
                                                    {getInitials(card.name)}
                                                </div>
                                            )}
                                        </div>

                                        {/* QR Code */}
                                        <div className="flex-shrink-0">
                                            {qrCodes[card.id] ? (
                                                <div className="w-16 h-16 md:w-20 md:h-20 rounded-lg bg-white p-1 md:p-1.5 shadow-xl">
                                                    <img
                                                        src={qrCodes[card.id]}
                                                        alt="QR Code"
                                                        className="w-full h-full object-contain"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="w-16 h-16 md:w-20 md:h-20 rounded-lg bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm flex items-center justify-center shadow-xl">
                                                    <QrCode className="w-8 h-8 md:w-10 md:h-10 text-gray-400 dark:text-gray-500 animate-pulse" />
                                                </div>
                                            )}
                                            {/* Download QR Button */}
                                            {qrCodes[card.id] && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        downloadQRCode(card)
                                                    }}
                                                    className="mt-1 w-full px-1.5 md:px-2 py-0.5 md:py-1 text-xs bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-gray-700 dark:text-gray-300 rounded-md hover:bg-white dark:hover:bg-gray-700 hover:shadow-md transition-all opacity-0 group-hover:opacity-100"
                                                    title="Download QR Code"
                                                >
                                                    <Download className="w-2.5 h-2.5 md:w-3 md:h-3 mx-auto" />
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Middle Section - Name & Title */}
                                    <div className="flex-1 flex flex-col justify-center min-h-0">
                                        <h3 className="text-xl md:text-2xl font-bold mb-1.5 md:mb-2 drop-shadow-lg line-clamp-2 break-words">{card.name || 'Untitled Card'}</h3>
                                        <div className="flex flex-col gap-1 mb-2">
                                            {card.title && (
                                                <span className="px-2 md:px-3 py-0.5 md:py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold rounded-full border border-white/30 inline-block w-fit">
                                                    {card.title}
                                                </span>
                                            )}
                                            {card.company && (
                                                <span className="px-2 md:px-3 py-0.5 md:py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold rounded-full border border-white/30 inline-block w-fit">
                                                    {card.company}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Bottom Section - Stats & Info */}
                                    <div className="mt-auto pt-2 md:pt-3 border-t border-white/20">
                                        <div className="flex items-center justify-between text-xs md:text-sm">
                                            <div className="flex items-center gap-1.5 md:gap-2">
                                                <Eye className="w-3.5 h-3.5 md:w-4 md:h-4 flex-shrink-0" />
                                                <span className="font-medium truncate">
                                                    {card.views || 0} views
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1.5 md:gap-2 text-white/80 flex-shrink-0">
                                                <span className="text-xs truncate">
                                                    {card.created_at ? new Date(card.created_at).toLocaleDateString() : ''}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                        {filteredCards.map((card, idx) => (
                            <motion.div
                                key={card.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="border-b border-gray-200 dark:border-gray-700 last:border-0 p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
                            >
                                <div className="flex items-center gap-6">
                                    {card.profile_photo ? (
                                        <img
                                            src={getImageUrl(card.profile_photo)}
                                            alt={card.name}
                                            className="w-16 h-16 rounded-full object-cover"
                                            onError={(e) => {
                                                console.error('❌ List view image failed to load:', {
                                                    original: card.profile_photo,
                                                    converted: getImageUrl(card.profile_photo),
                                                    cardId: card.id
                                                })
                                                e.target.style.display = 'none'
                                            }}
                                        />
                                    ) : (
                                        <div
                                            className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-lg"
                                            style={getCardBackground(card)}
                                        >
                                            {getInitials(card.name)}
                                        </div>
                                    )}
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-1">
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{card.name || 'Untitled Card'}</h3>
                                        </div>
                                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                                            {card.title && card.company
                                                ? `${card.title} at ${card.company}`
                                                : card.title || card.company || 'No details'}
                                        </p>
                                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                                            <span className="flex items-center">
                                                <Eye className="w-4 h-4 mr-1" />
                                                {card.views || 0} views
                                            </span>
                                            {card.created_at && (
                                                <span>Created {new Date(card.created_at).toLocaleDateString()}</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {card.slug && (
                                            <Link
                                                href={`/card/${card.slug}`}
                                                className="btn-outline text-sm py-2 px-4"
                                            >
                                                <Eye className="w-4 h-4 inline mr-1" />
                                                View
                                            </Link>
                                        )}
                                        <Link
                                            href={`/dashboard/edit/${card.id}`}
                                            className="btn-outline text-sm py-2 px-4"
                                        >
                                            <Edit className="w-4 h-4 inline mr-1" />
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(card.id)}
                                            className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    )
}

