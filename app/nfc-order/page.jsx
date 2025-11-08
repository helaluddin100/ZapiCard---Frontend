'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
    ArrowLeft,
    Radio,
    CreditCard,
    Shield,
    Sparkles,
    Zap,
    Upload,
    Palette,
    Download,
    QrCode,
    Eye,
    X,
    Wand2,
    Layers,
    FileImage,
    Loader2
} from 'lucide-react'
import { useToast } from '@/lib/toast'
import { cardAPI } from '@/lib/api'
import CardSelector from './components/CardSelector'
import ColorCustomizer from './components/ColorCustomizer'
import ImageUploader from './components/ImageUploader'
import OrderSummary from './components/OrderSummary'
import CardPreview3D from './components/CardPreview3D'

export default function NFCOrderPage() {
    const { success, error: showError } = useToast()
    const [selectedCardId, setSelectedCardId] = useState(null)
    const [selectedCard, setSelectedCard] = useState(null)
    const [selectedMaterial, setSelectedMaterial] = useState('plastic')
    const [selectedBgColor, setSelectedBgColor] = useState('#FFFFFF')
    const [selectedTextColor, setSelectedTextColor] = useState('#000000')
    const [useGradient, setUseGradient] = useState(false)
    const [gradientColors, setGradientColors] = useState({ from: '#3B82F6', to: '#8B5CF6' })
    const [quantity, setQuantity] = useState(1)
    const [profileImage, setProfileImage] = useState(null)
    const [loadingCard, setLoadingCard] = useState(false)

    const materials = [
        { id: 'plastic', name: 'Premium Plastic', price: 9.99, description: 'Durable and lightweight' },
        { id: 'metal', name: 'Metal Card', price: 24.99, description: 'Premium metal finish' },
        { id: 'wood', name: 'Wooden Card', price: 19.99, description: 'Eco-friendly wooden design' }
    ]

    // Load card data when selected
    useEffect(() => {
        if (selectedCardId) {
            loadCardData(selectedCardId)
        } else {
            setSelectedCard(null)
            setProfileImage(null)
        }
    }, [selectedCardId])

    const loadCardData = async (cardId) => {
        try {
            setLoadingCard(true)
            const response = await cardAPI.getCard(cardId)
            if (response.status === 'success' && response.data) {
                const card = response.data
                setSelectedCard(card)

                // Set profile image from card
                if (card.profile_photo) {
                    setProfileImage(card.profile_photo)
                }

                // Set colors from card if available
                if (card.primary_color) {
                    setSelectedBgColor(card.primary_color)
                }
                if (card.use_gradient && card.gradient_colors) {
                    setUseGradient(true)
                    setGradientColors(card.gradient_colors)
                }

                // Generate QR code URL if not exists
                if (!card.qrCode && card.slug) {
                    const cardUrl = typeof window !== 'undefined'
                        ? `${window.location.origin}/card/${card.slug}`
                        : `https://zapicard.com/card/${card.slug}`
                    card.qrCode = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(cardUrl)}`
                }

                // Ensure phone number is available
                if (!card.phone && card.phone_number) {
                    card.phone = card.phone_number
                }
            }
        } catch (err) {
            console.error('Error loading card:', err)
            showError('Failed to load card data')
        } finally {
            setLoadingCard(false)
        }
    }

    const handleCardSelect = (cardId) => {
        setSelectedCardId(cardId)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                <div className="absolute top-40 right-10 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-8 left-1/2 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
            </div>

            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <Link href="/" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6 group">
                        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                        Back to Home
                    </Link>
                    <div className="flex items-center gap-3 mb-4">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: 'spring' }}
                            className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg"
                        >
                            <Radio className="w-6 h-6 text-white" />
                        </motion.div>
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">Order NFC Card</h1>
                            <p className="text-gray-600 text-lg">Customize and order your physical NFC-enabled smart visiting card</p>
                        </div>
                    </div>
                </motion.div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Card Selection */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <CardSelector
                                selectedCardId={selectedCardId}
                                onCardSelect={handleCardSelect}
                            />
                        </motion.div>

                        {/* Profile Image Upload */}
                        {selectedCard && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="glass-effect rounded-2xl shadow-xl p-6 md:p-8 border border-gray-200/50 bg-white"
                            >
                                <div className="flex items-center gap-2 mb-6">
                                    <Upload className="w-5 h-5 text-blue-500" />
                                    <h2 className="text-2xl font-bold text-gray-900">Profile Image</h2>
                                </div>
                                <ImageUploader
                                    label="Change Profile Image (Optional)"
                                    currentImage={profileImage}
                                    onImageChange={setProfileImage}
                                    description="Upload a new image to replace the current profile photo, or keep the existing one"
                                />
                            </motion.div>
                        )}

                        {/* Color Customization */}
                        {selectedCard && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <ColorCustomizer
                                    bgColor={selectedBgColor}
                                    textColor={selectedTextColor}
                                    useGradient={useGradient}
                                    gradientColors={gradientColors}
                                    onBgColorChange={setSelectedBgColor}
                                    onTextColorChange={setSelectedTextColor}
                                    onGradientToggle={setUseGradient}
                                    onGradientColorsChange={setGradientColors}
                                />
                            </motion.div>
                        )}

                        {/* Material Selection */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="glass-effect rounded-2xl shadow-xl p-6 md:p-8 border border-gray-200/50 bg-white"
                        >
                            <div className="flex items-center gap-2 mb-6">
                                <CreditCard className="w-5 h-5 text-blue-500" />
                                <h2 className="text-2xl font-bold text-gray-900">Choose Material</h2>
                            </div>
                            <div className="grid md:grid-cols-3 gap-4">
                                {materials.map((material) => (
                                    <motion.button
                                        key={material.id}
                                        onClick={() => setSelectedMaterial(material.id)}
                                        whileHover={{ scale: 1.02, y: -2 }}
                                        whileTap={{ scale: 0.98 }}
                                        className={`relative p-5 border-2 rounded-xl text-left transition-all ${selectedMaterial === material.id
                                            ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-purple-50 shadow-lg'
                                            : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
                                            }`}
                                    >
                                        {selectedMaterial === material.id && (
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center shadow-lg"
                                            >
                                                <Zap className="w-4 h-4 text-white" />
                                            </motion.div>
                                        )}
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="font-bold text-gray-900 text-lg">{material.name}</span>
                                        </div>
                                        <p className="text-sm text-gray-600 mb-3">{material.description}</p>
                                        <div className="flex items-center justify-between">
                                            <p className="text-xl font-bold gradient-primary bg-clip-text text-transparent">
                                                ${material.price}
                                            </p>
                                            {material.id === 'metal' && (
                                                <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full font-semibold">
                                                    Premium
                                                </span>
                                            )}
                                        </div>
                                    </motion.button>
                                ))}
                            </div>
                        </motion.div>

                        {/* Quantity Selection */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="glass-effect rounded-2xl shadow-xl p-6 md:p-8 border border-gray-200/50 bg-white"
                        >
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Quantity</h2>
                            <div className="flex items-center gap-4">
                                <motion.button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="w-12 h-12 rounded-lg border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition flex items-center justify-center font-bold text-lg"
                                >
                                    -
                                </motion.button>
                                <input
                                    type="number"
                                    min="1"
                                    value={quantity}
                                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                    className="w-20 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                />
                                <motion.button
                                    onClick={() => setQuantity(quantity + 1)}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="w-12 h-12 rounded-lg border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition flex items-center justify-center font-bold text-lg"
                                >
                                    +
                                </motion.button>
                                <div className="ml-auto">
                                    <p className="text-sm text-gray-600 font-medium">
                                        {quantity >= 3 ? (
                                            <span className="text-green-600 font-semibold">✓ Free shipping!</span>
                                        ) : (
                                            `Free shipping on orders of 3+`
                                        )}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="lg:col-span-1">
                        {loadingCard ? (
                            <div className="bg-white rounded-2xl shadow-2xl p-8 flex items-center justify-center min-h-[400px]">
                                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                            </div>
                        ) : (
                            <OrderSummary
                                card={selectedCard}
                                bgColor={selectedBgColor}
                                textColor={selectedTextColor}
                                useGradient={useGradient}
                                gradientColors={gradientColors}
                                profileImage={profileImage}
                                material={selectedMaterial}
                                selectedMaterial={selectedMaterial}
                                quantity={quantity}
                                materials={materials}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
