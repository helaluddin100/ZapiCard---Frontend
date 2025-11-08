'use client'

import { useState } from 'react'
import { Palette, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'

export default function ColorCustomizer({
    bgColor,
    textColor,
    useGradient,
    gradientColors,
    onBgColorChange,
    onTextColorChange,
    onGradientToggle,
    onGradientColorsChange
}) {
    const colorPresets = [
        { name: 'Classic Black', bg: '#000000', text: '#FFFFFF' },
        { name: 'Pure White', bg: '#FFFFFF', text: '#000000' },
        { name: 'Ocean Blue', bg: '#1E40AF', text: '#FFFFFF' },
        { name: 'Royal Purple', bg: '#6B21A8', text: '#FFFFFF' },
        { name: 'Forest Green', bg: '#166534', text: '#FFFFFF' },
        { name: 'Sunset Orange', bg: '#EA580C', text: '#FFFFFF' },
        { name: 'Elegant Gray', bg: '#374151', text: '#FFFFFF' },
        { name: 'Gold Luxury', bg: '#F59E0B', text: '#000000' },
        { name: 'Rose Pink', bg: '#EC4899', text: '#FFFFFF' },
        { name: 'Sky Blue', bg: '#0EA5E9', text: '#FFFFFF' },
        { name: 'Emerald', bg: '#10B981', text: '#FFFFFF' },
        { name: 'Indigo', bg: '#4F46E5', text: '#FFFFFF' }
    ]

    return (
        <div className="glass-effect rounded-2xl shadow-xl p-6 md:p-8 border border-gray-200/50 bg-white">
            <div className="flex items-center gap-2 mb-6">
                <Palette className="w-5 h-5 text-blue-500" />
                <h2 className="text-2xl font-bold text-gray-900">Color Customization</h2>
            </div>

            {/* Gradient Toggle */}
            <div className="mb-6">
                <button
                    onClick={() => onGradientToggle(!useGradient)}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all w-full ${useGradient
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300'
                        }`}
                >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${useGradient ? 'bg-purple-500' : 'bg-gray-200'
                        }`}>
                        <Sparkles className={`w-5 h-5 ${useGradient ? 'text-white' : 'text-gray-600'}`} />
                    </div>
                    <div className="text-left flex-1">
                        <h3 className="font-bold text-gray-900">Use Gradient</h3>
                        <p className="text-sm text-gray-600">Enable gradient color effect</p>
                    </div>
                    <div className={`w-12 h-6 rounded-full transition-colors ${useGradient ? 'bg-purple-500' : 'bg-gray-300'
                        }`}>
                        <motion.div
                            animate={{ x: useGradient ? 24 : 0 }}
                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                            className="w-6 h-6 bg-white rounded-full shadow-lg"
                        />
                    </div>
                </button>
            </div>

            {useGradient ? (
                /* Gradient Colors */
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Gradient Start Color</label>
                        <div className="flex items-center gap-3">
                            <input
                                type="color"
                                value={gradientColors.from}
                                onChange={(e) => onGradientColorsChange({ ...gradientColors, from: e.target.value })}
                                className="w-16 h-16 rounded-lg border-2 border-gray-300 cursor-pointer"
                            />
                            <input
                                type="text"
                                value={gradientColors.from}
                                onChange={(e) => onGradientColorsChange({ ...gradientColors, from: e.target.value })}
                                className="flex-1 px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none font-mono text-sm"
                                placeholder="#3B82F6"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Gradient End Color</label>
                        <div className="flex items-center gap-3">
                            <input
                                type="color"
                                value={gradientColors.to}
                                onChange={(e) => onGradientColorsChange({ ...gradientColors, to: e.target.value })}
                                className="w-16 h-16 rounded-lg border-2 border-gray-300 cursor-pointer"
                            />
                            <input
                                type="text"
                                value={gradientColors.to}
                                onChange={(e) => onGradientColorsChange({ ...gradientColors, to: e.target.value })}
                                className="flex-1 px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none font-mono text-sm"
                                placeholder="#8B5CF6"
                            />
                        </div>
                    </div>

                    {/* Text Color Option for Gradient */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Text Color</label>
                        <div className="flex items-center gap-3">
                            <input
                                type="color"
                                value={textColor}
                                onChange={(e) => onTextColorChange(e.target.value)}
                                className="w-16 h-16 rounded-lg border-2 border-gray-300 cursor-pointer"
                            />
                            <input
                                type="text"
                                value={textColor}
                                onChange={(e) => onTextColorChange(e.target.value)}
                                className="flex-1 px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none font-mono text-sm"
                                placeholder="#FFFFFF"
                            />
                        </div>
                    </div>

                    <div className="p-4 rounded-xl border-2 border-purple-200 bg-gradient-to-r" style={{
                        background: `linear-gradient(135deg, ${gradientColors.from} 0%, ${gradientColors.to} 100%)`
                    }}>
                        <p className="text-sm font-semibold text-center" style={{
                            color: textColor
                        }}>
                            Gradient Preview
                        </p>
                    </div>
                </div>
            ) : (
                /* Solid Colors */
                <>
                    {/* Color Presets */}
                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-gray-700 mb-3">Quick Color Presets</label>
                        <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                            {colorPresets.map((preset, idx) => (
                                <motion.button
                                    key={idx}
                                    onClick={() => {
                                        onBgColorChange(preset.bg)
                                        onTextColorChange(preset.text)
                                    }}
                                    whileHover={{ scale: 1.05, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="relative group"
                                >
                                    <div
                                        className="w-full aspect-square rounded-lg border-2 border-gray-200 shadow-md overflow-hidden"
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
                                    value={bgColor}
                                    onChange={(e) => onBgColorChange(e.target.value)}
                                    className="w-16 h-16 rounded-lg border-2 border-gray-300 cursor-pointer"
                                />
                                <input
                                    type="text"
                                    value={bgColor}
                                    onChange={(e) => onBgColorChange(e.target.value)}
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
                                    value={textColor}
                                    onChange={(e) => onTextColorChange(e.target.value)}
                                    className="w-16 h-16 rounded-lg border-2 border-gray-300 cursor-pointer"
                                />
                                <input
                                    type="text"
                                    value={textColor}
                                    onChange={(e) => onTextColorChange(e.target.value)}
                                    className="flex-1 px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none font-mono text-sm"
                                    placeholder="#000000"
                                />
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

