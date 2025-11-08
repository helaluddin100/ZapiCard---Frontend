'use client'

import { useState, useEffect } from 'react'
import { CreditCard, CheckCircle2, Loader2 } from 'lucide-react'
import { cardAPI } from '@/lib/api'
import { useToast } from '@/lib/toast'

export default function CardSelector({ selectedCardId, onCardSelect }) {
    const { error: showError } = useToast()
    const [cards, setCards] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadCards()
    }, [])

    const loadCards = async () => {
        try {
            setLoading(true)
            const response = await cardAPI.getCards()
            if (response.status === 'success' && response.data) {
                setCards(response.data)
            }
        } catch (err) {
            console.error('Error loading cards:', err)
            showError('Failed to load cards')
        } finally {
            setLoading(false)
        }
    }

    const selectedCard = cards.find(card => card.id === selectedCardId)

    return (
        <div className="glass-effect rounded-2xl shadow-xl p-6 md:p-8 border border-gray-200/50 bg-white">
            <div className="flex items-center gap-2 mb-6">
                <CreditCard className="w-5 h-5 text-blue-500" />
                <h2 className="text-2xl font-bold text-gray-900">Choose which card to order</h2>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                </div>
            ) : (
                <>
                    <div className="mb-4">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Select Your Card
                        </label>
                        <select
                            value={selectedCardId || ''}
                            onChange={(e) => onCardSelect(parseInt(e.target.value))}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-gray-50 focus:bg-white font-medium"
                        >
                            <option value="">-- Select a card --</option>
                            {cards.map((card) => (
                                <option key={card.id} value={card.id}>
                                    {card.name} - {card.title || 'No title'} {card.company ? `at ${card.company}` : ''}
                                </option>
                            ))}
                        </select>
                    </div>

                    {selectedCard && (
                        <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
                            <div className="flex items-center gap-3">
                                {selectedCard.profile_photo ? (
                                    <img
                                        src={selectedCard.profile_photo}
                                        alt={selectedCard.name}
                                        className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md"
                                    />
                                ) : (
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold border-2 border-white shadow-md">
                                        {selectedCard.name.charAt(0).toUpperCase()}
                                    </div>
                                )}
                                <div className="flex-1">
                                    <p className="font-semibold text-gray-900">{selectedCard.name}</p>
                                    <p className="text-sm text-gray-600">
                                        {selectedCard.title} {selectedCard.company ? `at ${selectedCard.company}` : ''}
                                    </p>
                                </div>
                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                            </div>
                        </div>
                    )}

                    {cards.length === 0 && !loading && (
                        <div className="text-center py-8 text-gray-500">
                            <CreditCard className="w-12 h-12 mx-auto mb-2 opacity-50" />
                            <p>No cards found. Please create a card first.</p>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}

