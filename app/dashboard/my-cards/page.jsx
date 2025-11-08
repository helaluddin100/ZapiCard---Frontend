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
    Loader2
} from 'lucide-react'

export default function MyCardsPage() {
    const { success, error: showError } = useToast()
    const [viewMode, setViewMode] = useState('grid')
    const [searchQuery, setSearchQuery] = useState('')
    const [cards, setCards] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        fetchCards()
    }, [])

    const fetchCards = async () => {
        try {
            setLoading(true)
            setError(null)
            const response = await cardAPI.getCards()
            if (response.status === 'success' && response.data) {
                setCards(response.data)
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
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">My Cards</h1>
                            <p className="text-gray-600">Manage and organize your visiting cards</p>
                        </div>
                        <Link href="/dashboard/create" className="btn-primary flex items-center">
                            <Plus className="w-5 h-5 mr-2" />
                            Create New Card
                        </Link>
                    </div>

                    {/* Search and Filters */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search cards..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            />
                        </div>
                        <button className="btn-outline flex items-center">
                            <Filter className="w-5 h-5 mr-2" />
                            Filter
                        </button>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded-lg transition ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                            >
                                <Grid3x3 className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded-lg transition ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                            >
                                <List className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="text-center py-20">
                        <Loader2 className="w-12 h-12 mx-auto text-blue-600 animate-spin mb-4" />
                        <p className="text-gray-600">Loading your cards...</p>
                    </div>
                )}

                {/* Error State */}
                {error && !loading && (
                    <div className="text-center py-20">
                        <div className="text-red-400 mb-4">
                            <CreditCard className="w-16 h-16 mx-auto" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Error loading cards</h3>
                        <p className="text-gray-600 mb-6">{error}</p>
                        <button onClick={fetchCards} className="btn-primary inline-flex items-center">
                            Try Again
                        </button>
                    </div>
                )}

                {/* Cards Grid/List */}
                {!loading && !error && filteredCards.length === 0 && (
                    <div className="text-center py-20">
                        <div className="text-gray-400 mb-4">
                            <CreditCard className="w-16 h-16 mx-auto" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            {cards.length === 0 ? 'No cards found' : 'No cards match your search'}
                        </h3>
                        <p className="text-gray-600 mb-6">
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
                                className="bg-white rounded-xl shadow-lg overflow-hidden card-hover"
                            >
                                <div className="relative h-48" style={getCardBackground(card)}>
                                    {card.profile_photo ? (
                                        <img
                                            src={card.profile_photo}
                                            alt={card.name}
                                            className="w-full h-full object-cover opacity-80"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center">
                                                <span className="text-4xl font-bold text-white">
                                                    {getInitials(card.name)}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        {card.qr_code && (
                                            <img
                                                src={card.qr_code}
                                                alt="QR Code"
                                                className="w-32 h-32 bg-white p-2 rounded-lg shadow-lg"
                                            />
                                        )}
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-gray-900 mb-1">{card.name || 'Untitled Card'}</h3>
                                    {card.title && <p className="text-gray-600 text-sm mb-1">{card.title}</p>}
                                    {card.company && <p className="text-gray-500 text-sm mb-4">{card.company}</p>}
                                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                                        <span className="flex items-center">
                                            <Eye className="w-4 h-4 mr-1" />
                                            {card.views || 0} views
                                        </span>
                                        <span>{card.created_at ? new Date(card.created_at).toLocaleDateString() : ''}</span>
                                    </div>
                                    <div className="flex gap-2">
                                        {card.slug && (
                                            <Link
                                                href={`/card/${card.slug}`}
                                                className="flex-1 btn-outline text-center py-2 text-sm"
                                            >
                                                <Eye className="w-4 h-4 inline mr-1" />
                                                View
                                            </Link>
                                        )}
                                        <Link
                                            href={`/dashboard/edit/${card.id}`}
                                            className="flex-1 btn-outline text-center py-2 text-sm"
                                        >
                                            <Edit className="w-4 h-4 inline mr-1" />
                                            Edit
                                        </Link>
                                        <button 
                                            onClick={() => handleDelete(card.id)}
                                            className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                        {filteredCards.map((card, idx) => (
                            <motion.div
                                key={card.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="border-b border-gray-200 last:border-0 p-6 hover:bg-gray-50 transition"
                            >
                                <div className="flex items-center gap-6">
                                    {card.profile_photo ? (
                                        <img
                                            src={card.profile_photo}
                                            alt={card.name}
                                            className="w-16 h-16 rounded-full object-cover"
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
                                            <h3 className="text-lg font-semibold text-gray-900">{card.name || 'Untitled Card'}</h3>
                                        </div>
                                        <p className="text-gray-600 text-sm">
                                            {card.title && card.company 
                                                ? `${card.title} at ${card.company}`
                                                : card.title || card.company || 'No details'}
                                        </p>
                                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
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
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
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

