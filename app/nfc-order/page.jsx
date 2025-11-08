'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
    ArrowLeft,
    Radio,
    CheckCircle2,
    CreditCard,
    Truck,
    Shield,
    Sparkles,
    Zap,
    RotateCw,
    Upload,
    Image as ImageIcon,
    User,
    Briefcase,
    Mail,
    Phone,
    MapPin,
    Globe,
    Layout,
    Palette,
    Type,
    Settings,
    FlipHorizontal,
    Download,
    QrCode,
    Eye,
    EyeOff,
    Sliders
} from 'lucide-react'

export default function NFCOrderPage() {
    const [selectedMaterial, setSelectedMaterial] = useState('plastic')
    const [selectedColor, setSelectedColor] = useState('black')
    const [selectedBgColor, setSelectedBgColor] = useState('#FFFFFF')
    const [selectedTextColor, setSelectedTextColor] = useState('#000000')
    const [quantity, setQuantity] = useState(1)
    const [selectedCardId, setSelectedCardId] = useState(null)
    const [customDesign, setCustomDesign] = useState(null)
    const [showDesignGuide, setShowDesignGuide] = useState(false)
    const [cardSide, setCardSide] = useState('front') // 'front' or 'back'
    const [showDesignTool, setShowDesignTool] = useState(false)

    // Design tool settings
    const [designSettings, setDesignSettings] = useState({
        showName: true,
        showTitle: true,
        showCompany: true,
        showEmail: true,
        showPhone: true,
        showWebsite: true,
        showLogo: true,
        fontSize: 14,
        fontFamily: 'Inter',
        textAlign: 'left'
    })

    // Mock cards data (in real app, this would come from API)
    const userCards = [
        {
            id: 1,
            name: 'John Doe',
            title: 'Marketing Director',
            company: 'TechCorp',
            email: 'john@techcorp.com',
            phone: '+1 234-567-8900',
            address: '123 Business St, San Francisco, CA',
            website: 'www.techcorp.com',
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
            qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://zapicard.com/card/1'
        },
        {
            id: 2,
            name: 'Sarah Johnson',
            title: 'Product Manager',
            company: 'StartupXYZ',
            email: 'sarah@startupxyz.com',
            phone: '+1 234-567-8901',
            address: '456 Innovation Ave, New York, NY',
            website: 'www.startupxyz.com',
            image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
            qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://zapicard.com/card/2'
        },
        {
            id: 3,
            name: 'Mike Chen',
            title: 'Sales Executive',
            company: 'Global Sales',
            email: 'mike@globalsales.com',
            phone: '+1 234-567-8902',
            address: '789 Commerce Blvd, Los Angeles, CA',
            website: 'www.globalsales.com',
            image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
            qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://zapicard.com/card/3'
        }
    ]

    const selectedCard = userCards.find(card => card.id === selectedCardId)

    const materials = [
        { id: 'plastic', name: 'Premium Plastic', price: 9.99, description: 'Durable and lightweight' },
        { id: 'metal', name: 'Metal Card', price: 24.99, description: 'Premium metal finish' },
        { id: 'wood', name: 'Wooden Card', price: 19.99, description: 'Eco-friendly wooden design' }
    ]

    const colors = [
        { id: 'black', name: 'Black', hex: '#000000' },
        { id: 'white', name: 'White', hex: '#FFFFFF' },
        { id: 'blue', name: 'Blue', hex: '#3B82F6' },
        { id: 'red', name: 'Red', hex: '#EF4444' },
        { id: 'gold', name: 'Gold', hex: '#F59E0B' },
        { id: 'silver', name: 'Silver', hex: '#9CA3AF' }
    ]

    const selectedMaterialData = materials.find(m => m.id === selectedMaterial)
    const subtotal = (selectedMaterialData?.price || 0) * quantity
    const shipping = quantity > 2 ? 0 : 4.99
    const total = subtotal + shipping

    // Color combinations/presets
    const colorPresets = [
        { name: 'Classic Black', bg: '#000000', text: '#FFFFFF' },
        { name: 'Pure White', bg: '#FFFFFF', text: '#000000' },
        { name: 'Ocean Blue', bg: '#1E40AF', text: '#FFFFFF' },
        { name: 'Royal Purple', bg: '#6B21A8', text: '#FFFFFF' },
        { name: 'Forest Green', bg: '#166534', text: '#FFFFFF' },
        { name: 'Sunset Orange', bg: '#EA580C', text: '#FFFFFF' },
        { name: 'Elegant Gray', bg: '#374151', text: '#FFFFFF' },
        { name: 'Gold Luxury', bg: '#F59E0B', text: '#000000' }
    ]

    // Export card design for printing
    const exportCardDesign = () => {
        // In a real app, this would generate a print-ready PDF/SVG
        // For now, we'll create a canvas and download as image
        const cardElement = document.getElementById('card-preview')
        if (cardElement) {
            // This is a simplified version - in production, use html2canvas or similar
            // Export functionality: In production, this would generate a print-ready PDF/SVG file (1050×663px @ 300DPI)
            // You can add toast here if needed
            console.log('Exporting card design with settings:', {
                card: selectedCard,
                material: selectedMaterial,
                colors: { bg: selectedBgColor, text: selectedTextColor },
                designSettings
            })
        }
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
                            <p className="text-gray-600 text-lg">Get your physical NFC-enabled smart visiting card</p>
                        </div>
                    </div>
                </motion.div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Product Selection */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Card Selection */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="glass-effect rounded-2xl shadow-xl p-6 md:p-8 border border-gray-200/50 bg-white"
                        >
                            <div className="flex items-center gap-2 mb-6">
                                <CreditCard className="w-5 h-5 text-blue-500" />
                                <h2 className="text-2xl font-bold text-gray-900">Select Your Card</h2>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Choose which card to order
                                </label>
                                <select
                                    value={selectedCardId || ''}
                                    onChange={(e) => setSelectedCardId(parseInt(e.target.value))}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-gray-50 focus:bg-white font-medium"
                                >
                                    <option value="">-- Select a card --</option>
                                    {userCards.map((card) => (
                                        <option key={card.id} value={card.id}>
                                            {card.name} - {card.title} at {card.company}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {selectedCard && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200"
                                >
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={selectedCard.image}
                                            alt={selectedCard.name}
                                            className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md"
                                        />
                                        <div className="flex-1">
                                            <p className="font-semibold text-gray-900">{selectedCard.name}</p>
                                            <p className="text-sm text-gray-600">{selectedCard.title} at {selectedCard.company}</p>
                                        </div>
                                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                                    </div>
                                </motion.div>
                            )}
                        </motion.div>

                        {/* Custom Design Upload */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.05 }}
                            className="glass-effect rounded-2xl shadow-xl p-6 md:p-8 border border-gray-200/50 bg-white"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <ImageIcon className="w-5 h-5 text-blue-500" />
                                    <h2 className="text-2xl font-bold text-gray-900">Custom Design (Optional)</h2>
                                </div>
                                <button
                                    onClick={() => setShowDesignGuide(!showDesignGuide)}
                                    className="text-sm text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
                                >
                                    <Layout className="w-4 h-4" />
                                    Design Guide
                                </button>
                            </div>

                            {showDesignGuide && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="mb-4 p-4 bg-blue-50 rounded-xl border border-blue-200"
                                >
                                    <h3 className="font-semibold text-gray-900 mb-2">Design Guidelines:</h3>
                                    <ul className="text-sm text-gray-700 space-y-1">
                                        <li>• Card size: 85.6mm × 53.98mm (standard credit card size)</li>
                                        <li>• Safe area: Keep important info 5mm from edges</li>
                                        <li>• NFC chip area: Top-right corner (avoid placing text here)</li>
                                        <li>• Recommended resolution: 1050 × 663 pixels (300 DPI)</li>
                                        <li>• File formats: PNG, JPG, or PDF</li>
                                    </ul>
                                </motion.div>
                            )}

                            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors">
                                <input
                                    type="file"
                                    id="design-upload"
                                    accept="image/*,.pdf"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0]
                                        if (file) {
                                            const reader = new FileReader()
                                            reader.onload = (event) => {
                                                setCustomDesign(event.target?.result)
                                            }
                                            reader.readAsDataURL(file)
                                        }
                                    }}
                                    className="hidden"
                                />
                                <label
                                    htmlFor="design-upload"
                                    className="cursor-pointer flex flex-col items-center"
                                >
                                    {customDesign ? (
                                        <motion.div
                                            initial={{ scale: 0.8 }}
                                            animate={{ scale: 1 }}
                                            className="relative"
                                        >
                                            <img
                                                src={customDesign}
                                                alt="Custom design"
                                                className="max-w-full max-h-48 rounded-lg shadow-lg"
                                            />
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    setCustomDesign(null)
                                                }}
                                                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
                                            >
                                                ×
                                            </button>
                                        </motion.div>
                                    ) : (
                                        <>
                                            <Upload className="w-12 h-12 text-gray-400 mb-3 mx-auto" />
                                            <p className="text-gray-700 font-semibold mb-1">Upload Custom Design</p>
                                            <p className="text-sm text-gray-500">PNG, JPG, or PDF (Max 5MB)</p>
                                        </>
                                    )}
                                </label>
                            </div>
                        </motion.div>

                        {/* Material Selection */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
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
                                                <CheckCircle2 className="w-4 h-4 text-white" />
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

                        {/* Advanced Color Customization */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="glass-effect rounded-2xl shadow-xl p-6 md:p-8 border border-gray-200/50 bg-white"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-2">
                                    <Palette className="w-5 h-5 text-blue-500" />
                                    <h2 className="text-2xl font-bold text-gray-900">Color Customization</h2>
                                </div>
                                <button
                                    onClick={() => setShowDesignTool(!showDesignTool)}
                                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:shadow-lg transition"
                                >
                                    <Sliders className="w-4 h-4" />
                                    {showDesignTool ? 'Hide' : 'Show'} Design Tool
                                </button>
                            </div>

                            {/* Color Presets */}
                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-gray-700 mb-3">Quick Color Presets</label>
                                <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
                                    {colorPresets.map((preset, idx) => (
                                        <motion.button
                                            key={idx}
                                            onClick={() => {
                                                setSelectedBgColor(preset.bg)
                                                setSelectedTextColor(preset.text)
                                            }}
                                            whileHover={{ scale: 1.05, y: -2 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="relative group"
                                        >
                                            <div className="w-full aspect-square rounded-lg border-2 border-gray-200 shadow-md overflow-hidden"
                                                style={{ backgroundColor: preset.bg }}
                                            >
                                                <div className="w-full h-1/2" style={{ backgroundColor: preset.bg }}></div>
                                                <div className="w-full h-1/2" style={{ backgroundColor: preset.text }}></div>
                                            </div>
                                            <p className="text-xs text-center mt-1 text-gray-600 group-hover:text-gray-900 font-medium">
                                                {preset.name.split(' ')[0]}
                                            </p>
                                        </motion.button>
                                    ))}
                                </div>
                            </div>

                            {/* Custom Color Pickers */}
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Background Color</label>
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="color"
                                            value={selectedBgColor}
                                            onChange={(e) => setSelectedBgColor(e.target.value)}
                                            className="w-16 h-16 rounded-lg border-2 border-gray-300 cursor-pointer"
                                        />
                                        <input
                                            type="text"
                                            value={selectedBgColor}
                                            onChange={(e) => setSelectedBgColor(e.target.value)}
                                            className="flex-1 px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none font-mono text-sm"
                                            placeholder="#FFFFFF"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Text Color</label>
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="color"
                                            value={selectedTextColor}
                                            onChange={(e) => setSelectedTextColor(e.target.value)}
                                            className="w-16 h-16 rounded-lg border-2 border-gray-300 cursor-pointer"
                                        />
                                        <input
                                            type="text"
                                            value={selectedTextColor}
                                            onChange={(e) => setSelectedTextColor(e.target.value)}
                                            className="flex-1 px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none font-mono text-sm"
                                            placeholder="#000000"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Design Tool Panel */}
                            <AnimatePresence>
                                {showDesignTool && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="mt-6 p-6 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl border-2 border-blue-200"
                                    >
                                        <div className="flex items-center gap-2 mb-4">
                                            <Settings className="w-5 h-5 text-blue-600" />
                                            <h3 className="font-bold text-gray-900">Design Customization</h3>
                                        </div>

                                        {/* Show/Hide Elements */}
                                        <div className="mb-4">
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Show/Hide Elements</label>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                                {[
                                                    { key: 'showName', label: 'Name', icon: User },
                                                    { key: 'showTitle', label: 'Title', icon: Briefcase },
                                                    { key: 'showCompany', label: 'Company', icon: Briefcase },
                                                    { key: 'showEmail', label: 'Email', icon: Mail },
                                                    { key: 'showPhone', label: 'Phone', icon: Phone },
                                                    { key: 'showWebsite', label: 'Website', icon: Globe },
                                                    { key: 'showLogo', label: 'Logo', icon: ImageIcon }
                                                ].map((item) => {
                                                    const Icon = item.icon
                                                    return (
                                                        <button
                                                            key={item.key}
                                                            onClick={() => setDesignSettings(prev => ({
                                                                ...prev,
                                                                [item.key]: !prev[item.key]
                                                            }))}
                                                            className={`flex items-center gap-2 px-3 py-2 rounded-lg border-2 transition ${designSettings[item.key]
                                                                ? 'border-blue-500 bg-blue-50 text-blue-700'
                                                                : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                                                                }`}
                                                        >
                                                            {designSettings[item.key] ? (
                                                                <Eye className="w-4 h-4" />
                                                            ) : (
                                                                <EyeOff className="w-4 h-4" />
                                                            )}
                                                            <span className="text-xs font-medium">{item.label}</span>
                                                        </button>
                                                    )
                                                })}
                                            </div>
                                        </div>

                                        {/* Font Settings */}
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">Font Size</label>
                                                <div className="flex items-center gap-3">
                                                    <Type className="w-4 h-4 text-gray-500" />
                                                    <input
                                                        type="range"
                                                        min="10"
                                                        max="24"
                                                        value={designSettings.fontSize}
                                                        onChange={(e) => setDesignSettings(prev => ({
                                                            ...prev,
                                                            fontSize: parseInt(e.target.value)
                                                        }))}
                                                        className="flex-1"
                                                    />
                                                    <span className="text-sm font-semibold text-gray-700 w-8">{designSettings.fontSize}px</span>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">Text Align</label>
                                                <div className="flex gap-2">
                                                    {['left', 'center', 'right'].map((align) => (
                                                        <button
                                                            key={align}
                                                            onClick={() => setDesignSettings(prev => ({
                                                                ...prev,
                                                                textAlign: align
                                                            }))}
                                                            className={`flex-1 px-3 py-2 rounded-lg border-2 font-semibold text-sm capitalize ${designSettings.textAlign === align
                                                                ? 'border-blue-500 bg-blue-50 text-blue-700'
                                                                : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                                                                }`}
                                                        >
                                                            {align}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>

                        {/* Quantity Selection */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
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

                        {/* Features */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="glass-effect rounded-2xl shadow-xl p-6 md:p-8 border border-gray-200/50 bg-white"
                        >
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">What&apos;s Included</h2>
                            <div className="grid md:grid-cols-2 gap-4">
                                {[
                                    { icon: Radio, text: 'NFC Chip Enabled', desc: 'Tap to share instantly' },
                                    { icon: Shield, text: 'Water Resistant', desc: 'IP68 certified' },
                                    { icon: Truck, text: 'Fast Shipping', desc: '5-7 business days' },
                                    { icon: CheckCircle2, text: 'Lifetime Warranty', desc: 'Quality guaranteed' }
                                ].map((feature, idx) => {
                                    const Icon = feature.icon
                                    return (
                                        <motion.div
                                            key={idx}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.3 + idx * 0.1 }}
                                            whileHover={{ scale: 1.02, x: 5 }}
                                            className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition"
                                        >
                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-lg">
                                                <Icon className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                <span className="text-gray-900 font-semibold block">{feature.text}</span>
                                                <span className="text-xs text-gray-600">{feature.desc}</span>
                                            </div>
                                        </motion.div>
                                    )
                                })}
                            </div>
                        </motion.div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 sticky top-8 border border-gray-200/50"
                        >
                            <div className="flex items-center gap-2 mb-6">
                                <Sparkles className="w-5 h-5 text-blue-500" />
                                <h2 className="text-2xl font-bold text-gray-900">Order Summary</h2>
                            </div>

                            {/* Enhanced Card Preview with Front/Back */}
                            <div className="mb-8 relative">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-700 mb-1">Card Preview</h3>
                                        <p className="text-xs text-gray-500">Real-time preview • Click to flip</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setCardSide('front')}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${cardSide === 'front'
                                                ? 'bg-blue-500 text-white'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                }`}
                                        >
                                            Front
                                        </button>
                                        <button
                                            onClick={() => setCardSide('back')}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${cardSide === 'back'
                                                ? 'bg-blue-500 text-white'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                }`}
                                        >
                                            Back
                                        </button>
                                    </div>
                                </div>

                                {/* Card Container with 3D effect and Flip */}
                                <div className="perspective-1000">
                                    <motion.div
                                        animate={{ rotateY: cardSide === 'back' ? 180 : 0 }}
                                        transition={{ duration: 0.6, ease: "easeInOut" }}
                                        className="relative transform-gpu"
                                        style={{ transformStyle: 'preserve-3d' }}
                                    >
                                        {/* Card Shadow */}
                                        <div className="absolute inset-0 bg-black/20 blur-xl rounded-2xl transform translate-y-4"></div>

                                        {/* Front Side */}
                                        <div
                                            id="card-preview"
                                            className="relative bg-white rounded-2xl p-6 shadow-2xl border-2 border-gray-200"
                                            style={{
                                                aspectRatio: '85.6 / 53.98',
                                                minHeight: '240px',
                                                backfaceVisibility: 'hidden',
                                                WebkitBackfaceVisibility: 'hidden',
                                                transform: cardSide === 'back' ? 'rotateY(180deg)' : 'rotateY(0deg)',
                                                backgroundColor: customDesign ? 'transparent' : selectedBgColor
                                            }}
                                        >
                                            {customDesign ? (
                                                <div className="absolute inset-0 rounded-2xl overflow-hidden">
                                                    <img
                                                        src={customDesign}
                                                        alt="Custom design"
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                            ) : (
                                                <>
                                                    {/* Card Background Gradient */}
                                                    <div
                                                        className="absolute inset-0 rounded-2xl"
                                                        style={{
                                                            background: selectedMaterial === 'metal'
                                                                ? `linear-gradient(135deg, ${selectedBgColor} 0%, ${selectedBgColor}dd 100%)`
                                                                : selectedMaterial === 'wood'
                                                                    ? `repeating-linear-gradient(45deg, ${selectedBgColor}, ${selectedBgColor} 2px, ${selectedBgColor}dd 2px, ${selectedBgColor}dd 4px)`
                                                                    : selectedBgColor
                                                        }}
                                                    />

                                                    {/* Card Content */}
                                                    <div className="relative z-10 h-full flex flex-col justify-between" style={{ color: selectedTextColor }}>
                                                        {/* Top Section */}
                                                        <div className="flex items-start justify-between mb-2">
                                                            <div className="flex items-center gap-2">
                                                                {selectedCard && designSettings.showLogo && selectedCard.image ? (
                                                                    <img
                                                                        src={selectedCard.image}
                                                                        alt={selectedCard.name}
                                                                        className="w-10 h-10 rounded-lg object-cover border-2 border-white/50 shadow-md"
                                                                    />
                                                                ) : (
                                                                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-lg opacity-80">
                                                                        <Zap className="w-5 h-5 text-white" />
                                                                    </div>
                                                                )}
                                                                <div>
                                                                    <div className="text-xs font-semibold uppercase tracking-wider opacity-70">Zapi Card</div>
                                                                    <div className="text-xs opacity-60">Smart NFC</div>
                                                                </div>
                                                            </div>

                                                            {/* NFC Chip Indicator */}
                                                            <motion.div
                                                                animate={{ scale: [1, 1.1, 1] }}
                                                                transition={{ duration: 2, repeat: Infinity }}
                                                                className="relative"
                                                            >
                                                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg">
                                                                    <Radio className="w-5 h-5 text-white" />
                                                                </div>
                                                                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>
                                                            </motion.div>
                                                        </div>

                                                        {/* Card Information */}
                                                        {selectedCard ? (
                                                            <div className={`flex-1 flex flex-col justify-center space-y-2`} style={{ textAlign: designSettings.textAlign }}>
                                                                {designSettings.showName && (
                                                                    <h3 className="font-bold leading-tight" style={{ fontSize: `${designSettings.fontSize}px` }}>
                                                                        {selectedCard.name}
                                                                    </h3>
                                                                )}
                                                                {designSettings.showTitle && (
                                                                    <p className="font-semibold opacity-90" style={{ fontSize: `${designSettings.fontSize - 2}px` }}>
                                                                        {selectedCard.title}
                                                                    </p>
                                                                )}
                                                                {designSettings.showCompany && (
                                                                    <p className="opacity-80" style={{ fontSize: `${designSettings.fontSize - 4}px` }}>
                                                                        {selectedCard.company}
                                                                    </p>
                                                                )}
                                                                <div className="mt-2 space-y-1">
                                                                    {designSettings.showEmail && selectedCard.email && (
                                                                        <div className="flex items-center gap-1" style={{ fontSize: `${designSettings.fontSize - 6}px` }}>
                                                                            <Mail className="w-3 h-3" />
                                                                            <span className="truncate">{selectedCard.email}</span>
                                                                        </div>
                                                                    )}
                                                                    {designSettings.showPhone && selectedCard.phone && (
                                                                        <div className="flex items-center gap-1" style={{ fontSize: `${designSettings.fontSize - 6}px` }}>
                                                                            <Phone className="w-3 h-3" />
                                                                            <span>{selectedCard.phone}</span>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div className="flex-1 flex items-center justify-center">
                                                                <div className="text-center">
                                                                    <p className="text-sm opacity-70">Select a card to preview</p>
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* Bottom Section */}
                                                        <div className="flex items-center justify-between mt-2">
                                                            {designSettings.showWebsite && selectedCard?.website && (
                                                                <div className="flex items-center gap-1" style={{ fontSize: `${designSettings.fontSize - 6}px` }}>
                                                                    <Globe className="w-3 h-3" />
                                                                    <span className="truncate">{selectedCard.website}</span>
                                                                </div>
                                                            )}
                                                            <div className="text-xs font-mono opacity-60">NFC</div>
                                                        </div>
                                                    </div>

                                                    {/* Material-specific overlay effects */}
                                                    {selectedMaterial === 'metal' && (
                                                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent pointer-events-none"></div>
                                                    )}
                                                    {selectedMaterial === 'wood' && (
                                                        <div className="absolute inset-0 rounded-2xl opacity-20" style={{
                                                            backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 1px, rgba(0,0,0,0.1) 1px, rgba(0,0,0,0.1) 2px)'
                                                        }}></div>
                                                    )}
                                                </>
                                            )}
                                        </div>

                                        {/* Back Side with QR Code */}
                                        <div
                                            className="absolute inset-0 bg-white rounded-2xl p-6 shadow-2xl border-2 border-gray-200"
                                            style={{
                                                aspectRatio: '85.6 / 53.98',
                                                minHeight: '240px',
                                                backfaceVisibility: 'hidden',
                                                WebkitBackfaceVisibility: 'hidden',
                                                transform: 'rotateY(180deg)',
                                                backgroundColor: selectedBgColor
                                            }}
                                        >
                                            {/* Back Background */}
                                            <div
                                                className="absolute inset-0 rounded-2xl"
                                                style={{
                                                    background: selectedMaterial === 'metal'
                                                        ? `linear-gradient(135deg, ${selectedBgColor} 0%, ${selectedBgColor}dd 100%)`
                                                        : selectedMaterial === 'wood'
                                                            ? `repeating-linear-gradient(45deg, ${selectedBgColor}, ${selectedBgColor} 2px, ${selectedBgColor}dd 2px, ${selectedBgColor}dd 4px)`
                                                            : selectedBgColor
                                                }}
                                            />

                                            {/* Back Content */}
                                            <div className="relative z-10 h-full flex flex-col items-center justify-center" style={{ color: selectedTextColor }}>
                                                {selectedCard ? (
                                                    <>
                                                        <div className="mb-4">
                                                            <div className="w-32 h-32 bg-white p-3 rounded-xl shadow-2xl">
                                                                <img
                                                                    src={selectedCard.qrCode}
                                                                    alt="QR Code"
                                                                    className="w-full h-full object-contain"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="text-center">
                                                            <p className="font-bold mb-1" style={{ fontSize: `${designSettings.fontSize}px` }}>
                                                                {selectedCard.name}
                                                            </p>
                                                            <p className="text-sm opacity-80 mb-2">
                                                                Scan to save contact
                                                            </p>
                                                            <div className="flex items-center justify-center gap-2 text-xs opacity-60">
                                                                <Radio className="w-4 h-4" />
                                                                <span>NFC Enabled</span>
                                                            </div>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <div className="text-center">
                                                        <QrCode className="w-24 h-24 mx-auto mb-4 opacity-30" style={{ color: selectedTextColor }} />
                                                        <p className="text-sm opacity-70">QR Code will appear here</p>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Material effects for back */}
                                            {selectedMaterial === 'metal' && (
                                                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent pointer-events-none"></div>
                                            )}
                                            {selectedMaterial === 'wood' && (
                                                <div className="absolute inset-0 rounded-2xl opacity-20" style={{
                                                    backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 1px, rgba(0,0,0,0.1) 1px, rgba(0,0,0,0.1) 2px)'
                                                }}></div>
                                            )}
                                        </div>
                                    </motion.div>
                                </div>

                                {/* Flip and Export buttons */}
                                <div className="flex items-center justify-center gap-3 mt-4">
                                    <motion.button
                                        onClick={() => setCardSide(cardSide === 'front' ? 'back' : 'front')}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-semibold text-gray-700 transition"
                                    >
                                        <FlipHorizontal className="w-4 h-4" />
                                        Flip Card
                                    </motion.button>
                                    <motion.button
                                        onClick={exportCardDesign}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg text-sm font-semibold hover:shadow-lg transition"
                                    >
                                        <Download className="w-4 h-4" />
                                        Export for Print
                                    </motion.button>
                                </div>
                            </div>

                            {/* Price Breakdown */}
                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-gray-700">
                                    <span>{selectedMaterialData?.name} × {quantity}</span>
                                    <span>${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-700">
                                    <span>Shipping</span>
                                    <span>{shipping > 0 ? `$${shipping.toFixed(2)}` : 'Free'}</span>
                                </div>
                                <div className="border-t border-gray-200 pt-3 flex justify-between text-lg font-bold text-gray-900">
                                    <span>Total</span>
                                    <span>${total.toFixed(2)}</span>
                                </div>
                            </div>

                            <Link
                                href="/nfc-order/checkout"
                                className="w-full btn-primary text-center block mb-4 py-4 text-lg font-bold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                            >
                                Proceed to Checkout
                            </Link>

                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Shield className="w-4 h-4" />
                                <span>Secure checkout with 256-bit SSL</span>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    )
}

