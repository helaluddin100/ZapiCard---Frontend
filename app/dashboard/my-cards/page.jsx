'use client'

import { useState } from 'react'
import Link from 'next/link'
import DashboardLayout from '@/components/DashboardLayout'
import { motion } from 'framer-motion'
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
    CreditCard
} from 'lucide-react'

export default function MyCardsPage() {
    const [viewMode, setViewMode] = useState('grid')
    const [searchQuery, setSearchQuery] = useState('')

    // Mock data for cards
    const cards = [
        {
            id: 1,
            name: 'John Doe',
            title: 'Marketing Director',
            company: 'TechCorp',
            qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://zapicard.com/card/1',
            nfcEnabled: true,
            views: 245,
            createdAt: '2024-01-15',
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop'
        },
        {
            id: 2,
            name: 'Sarah Johnson',
            title: 'Product Manager',
            company: 'StartupXYZ',
            qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://zapicard.com/card/2',
            nfcEnabled: false,
            views: 189,
            createdAt: '2024-01-20',
            image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop'
        },
        {
            id: 3,
            name: 'Mike Chen',
            title: 'Sales Executive',
            company: 'Global Sales',
            qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://zapicard.com/card/3',
            nfcEnabled: true,
            views: 312,
            createdAt: '2024-02-01',
            image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop'
        }
    ]

    const filteredCards = cards.filter(card =>
        card.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        card.company.toLowerCase().includes(searchQuery.toLowerCase())
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

                {/* Cards Grid/List */}
                {filteredCards.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="text-gray-400 mb-4">
                            <CreditCard className="w-16 h-16 mx-auto" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No cards found</h3>
                        <p className="text-gray-600 mb-6">Create your first smart visiting card to get started</p>
                        <Link href="/dashboard/create" className="btn-primary inline-flex items-center">
                            <Plus className="w-5 h-5 mr-2" />
                            Create Your First Card
                        </Link>
                    </div>
                ) : viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredCards.map((card, idx) => (
                            <motion.div
                                key={card.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-white rounded-xl shadow-lg overflow-hidden card-hover"
                            >
                                <div className="relative h-48 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500">
                                    <img
                                        src={card.image}
                                        alt={card.name}
                                        className="w-full h-full object-cover opacity-80"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <img
                                            src={card.qrCode}
                                            alt="QR Code"
                                            className="w-32 h-32 bg-white p-2 rounded-lg shadow-lg"
                                        />
                                    </div>
                                    {card.nfcEnabled && (
                                        <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center">
                                            <Radio className="w-3 h-3 mr-1" />
                                            NFC
                                        </div>
                                    )}
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-gray-900 mb-1">{card.name}</h3>
                                    <p className="text-gray-600 text-sm mb-1">{card.title}</p>
                                    <p className="text-gray-500 text-sm mb-4">{card.company}</p>
                                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                                        <span className="flex items-center">
                                            <Eye className="w-4 h-4 mr-1" />
                                            {card.views} views
                                        </span>
                                        <span>{new Date(card.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <Link
                                            href={`/card/${card.id}`}
                                            className="flex-1 btn-outline text-center py-2 text-sm"
                                        >
                                            <Eye className="w-4 h-4 inline mr-1" />
                                            View
                                        </Link>
                                        <Link
                                            href={`/dashboard/edit/${card.id}`}
                                            className="flex-1 btn-outline text-center py-2 text-sm"
                                        >
                                            <Edit className="w-4 h-4 inline mr-1" />
                                            Edit
                                        </Link>
                                        <button className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition">
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
                                    <img
                                        src={card.image}
                                        alt={card.name}
                                        className="w-16 h-16 rounded-full object-cover"
                                    />
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-1">
                                            <h3 className="text-lg font-semibold text-gray-900">{card.name}</h3>
                                            {card.nfcEnabled && (
                                                <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-semibold flex items-center">
                                                    <Radio className="w-3 h-3 mr-1" />
                                                    NFC
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-gray-600 text-sm">{card.title} at {card.company}</p>
                                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                                            <span className="flex items-center">
                                                <Eye className="w-4 h-4 mr-1" />
                                                {card.views} views
                                            </span>
                                            <span>Created {new Date(card.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Link
                                            href={`/card/${card.id}`}
                                            className="btn-outline text-sm py-2 px-4"
                                        >
                                            <Eye className="w-4 h-4 inline mr-1" />
                                            View
                                        </Link>
                                        <Link
                                            href={`/dashboard/edit/${card.id}`}
                                            className="btn-outline text-sm py-2 px-4"
                                        >
                                            <Edit className="w-4 h-4 inline mr-1" />
                                            Edit
                                        </Link>
                                        <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition">
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

