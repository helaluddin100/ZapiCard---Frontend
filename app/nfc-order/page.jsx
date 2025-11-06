'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
    ArrowLeft,
    Radio,
    CheckCircle2,
    CreditCard,
    Truck,
    Shield
} from 'lucide-react'

export default function NFCOrderPage() {
    const [selectedMaterial, setSelectedMaterial] = useState('plastic')
    const [selectedColor, setSelectedColor] = useState('black')
    const [quantity, setQuantity] = useState(1)

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

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <Link href="/" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Home
                    </Link>
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Order NFC Card</h1>
                    <p className="text-gray-600">Get your physical NFC-enabled smart visiting card</p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Product Selection */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Material Selection */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-xl shadow-lg p-6"
                        >
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Choose Material</h2>
                            <div className="grid md:grid-cols-3 gap-4">
                                {materials.map((material) => (
                                    <button
                                        key={material.id}
                                        onClick={() => setSelectedMaterial(material.id)}
                                        className={`p-4 border-2 rounded-lg text-left transition ${selectedMaterial === material.id
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-semibold text-gray-900">{material.name}</span>
                                            {selectedMaterial === material.id && (
                                                <CheckCircle2 className="w-5 h-5 text-blue-600" />
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-600 mb-2">{material.description}</p>
                                        <p className="text-lg font-bold text-blue-600">${material.price}</p>
                                    </button>
                                ))}
                            </div>
                        </motion.div>

                        {/* Color Selection */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-xl shadow-lg p-6"
                        >
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Choose Color</h2>
                            <div className="grid grid-cols-6 gap-4">
                                {colors.map((color) => (
                                    <button
                                        key={color.id}
                                        onClick={() => setSelectedColor(color.id)}
                                        className={`relative aspect-square rounded-lg border-2 transition ${selectedColor === color.id
                                            ? 'border-blue-500 ring-2 ring-blue-200'
                                            : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                        style={{ backgroundColor: color.hex }}
                                    >
                                        {selectedColor === color.id && (
                                            <CheckCircle2 className="absolute -top-2 -right-2 w-6 h-6 text-blue-600 bg-white rounded-full" />
                                        )}
                                        <span className="sr-only">{color.name}</span>
                                    </button>
                                ))}
                            </div>
                            <p className="text-sm text-gray-600 mt-4 text-center">
                                Selected: <span className="font-semibold">{colors.find(c => c.id === selectedColor)?.name}</span>
                            </p>
                        </motion.div>

                        {/* Quantity Selection */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white rounded-xl shadow-lg p-6"
                        >
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Quantity</h2>
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="w-12 h-12 rounded-lg border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition flex items-center justify-center"
                                >
                                    -
                                </button>
                                <input
                                    type="number"
                                    min="1"
                                    value={quantity}
                                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                    className="w-20 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                />
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="w-12 h-12 rounded-lg border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition flex items-center justify-center"
                                >
                                    +
                                </button>
                                <div className="ml-auto">
                                    <p className="text-sm text-gray-600">Free shipping on orders of 3+</p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Features */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-white rounded-xl shadow-lg p-6"
                        >
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">What&apos;s Included</h2>
                            <div className="grid md:grid-cols-2 gap-4">
                                {[
                                    { icon: Radio, text: 'NFC Chip Enabled' },
                                    { icon: Shield, text: 'Water Resistant' },
                                    { icon: Truck, text: 'Fast Shipping' },
                                    { icon: CheckCircle2, text: 'Lifetime Warranty' }
                                ].map((feature, idx) => {
                                    const Icon = feature.icon
                                    return (
                                        <div key={idx} className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                                <Icon className="w-5 h-5 text-blue-600" />
                                            </div>
                                            <span className="text-gray-700">{feature.text}</span>
                                        </div>
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
                            className="bg-white rounded-xl shadow-lg p-6 sticky top-8"
                        >
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>

                            {/* Preview Card */}
                            <div className="mb-6 p-4 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg">
                                <div className="bg-white rounded-lg p-4 text-center">
                                    <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-gray-200 flex items-center justify-center">
                                        <Radio className="w-8 h-8 text-gray-400" />
                                    </div>
                                    <div
                                        className="w-full h-32 rounded-lg mx-auto mb-2"
                                        style={{ backgroundColor: colors.find(c => c.id === selectedColor)?.hex }}
                                    />
                                    <p className="text-xs text-gray-600">{selectedMaterialData?.name}</p>
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
                                className="w-full btn-primary text-center block mb-4"
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

