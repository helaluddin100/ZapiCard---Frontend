'use client'

import Link from 'next/link'
import { Sparkles, Shield } from 'lucide-react'
import { motion } from 'framer-motion'
import CardPreview3D from './CardPreview3D'

export default function OrderSummary({
    card,
    bgColor,
    textColor,
    useGradient,
    gradientColors,
    profileImage,
    material,
    selectedMaterial,
    quantity,
    materials
}) {
    const selectedMaterialData = materials.find(m => m.id === selectedMaterial)
    const subtotal = (selectedMaterialData?.price || 0) * quantity
    const shipping = quantity > 2 ? 0 : 4.99
    const total = subtotal + shipping

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 sticky top-8 border border-gray-200/50"
        >
            <div className="flex items-center gap-2 mb-6">
                <Sparkles className="w-5 h-5 text-blue-500" />
                <h2 className="text-2xl font-bold text-gray-900">Order Summary</h2>
            </div>

            {/* 3D Card Preview */}
            <div className="mb-8">
                <h3 className="text-sm font-semibold text-gray-700 mb-4">Card Preview</h3>
                <div className="w-full max-w-full mx-auto overflow-hidden">
                    <CardPreview3D
                        card={card}
                        bgColor={bgColor}
                        textColor={textColor}
                        useGradient={useGradient}
                        gradientColors={gradientColors}
                        profileImage={profileImage}
                        material={selectedMaterial}
                    />
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
    )
}

