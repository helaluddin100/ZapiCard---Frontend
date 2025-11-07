'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Palette, Ruler, ChevronUp, HelpCircle } from 'lucide-react'

const colorPresets = [
    { primary: '#455a64', button: '#e91e63' },
    { primary: '#1976d2', button: '#42a5f5' },
    { primary: '#d32f2f', button: '#f48fb1' },
    { primary: '#388e3c', button: '#81c784' },
    { primary: '#5d4037', button: '#ff9800' },
    { primary: '#00796b', button: '#ff6f00' },
    { primary: '#e91e63', button: '#4caf50' },
    { primary: '#ff9800', button: '#424242' },
    { primary: '#7b1fa2', button: '#00bcd4' },
    { primary: '#1565c0', button: '#e91e63' },
]

export default function DesignCustomize({ formData, setFormData, onNext, onBack }) {
    const [isExpanded, setIsExpanded] = useState(true)

    const handlePresetSelect = (preset) => {
        setFormData({
            ...formData,
            primaryColor: preset.primary,
            buttonColor: preset.button,
            useGradient: false
        })
    }

    const handleGradientToggle = (enabled) => {
        if (enabled && !formData.gradientColors) {
            setFormData({
                ...formData,
                useGradient: true,
                gradientColors: {
                    from: formData.primaryColor || '#3b82f6',
                    to: formData.buttonColor || '#8b5cf6'
                }
            })
        } else {
            setFormData({
                ...formData,
                useGradient: false
            })
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
        >
            {/* Header */}
            <div
                className="bg-gray-50 px-6 py-4 flex items-center justify-between cursor-pointer hover:bg-gray-100 transition"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center gap-3">
                    <Palette className="w-5 h-5 text-gray-600" />
                    <Ruler className="w-5 h-5 text-gray-600" />
                    <h2 className="text-lg font-semibold text-gray-900">Design & Customize your vCard</h2>
                </div>
                <ChevronUp className={`w-5 h-5 text-gray-600 transition-transform ${isExpanded ? '' : 'rotate-180'}`} />
            </div>

            {isExpanded && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-6 space-y-6"
                >
                    <p className="text-gray-600">Personalize your vCard by selecting colors and uploading an image.</p>

                    {/* Color Presets */}
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <label className="block text-sm font-medium text-gray-700">
                                Colors:
                            </label>
                            <HelpCircle className="w-4 h-4 text-gray-400" />
                        </div>
                        <div className="grid grid-cols-5 gap-3">
                            {colorPresets.map((preset, index) => {
                                const isSelected = !formData.useGradient &&
                                    formData.primaryColor === preset.primary &&
                                    formData.buttonColor === preset.button

                                return (
                                    <button
                                        key={index}
                                        type="button"
                                        onClick={() => handlePresetSelect(preset)}
                                        className={`
                                            relative p-2 bg-white border-2 rounded-lg transition
                                            ${isSelected ? 'border-green-500 ring-2 ring-green-200' : 'border-gray-200 hover:border-gray-300'}
                                        `}
                                    >
                                        <div className="space-y-1">
                                            <div
                                                className="w-full h-8 rounded"
                                                style={{ backgroundColor: preset.primary }}
                                            />
                                            <div
                                                className="w-4 h-4 rounded-full mx-auto"
                                                style={{ backgroundColor: preset.button }}
                                            />
                                        </div>
                                        {isSelected && (
                                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                                                <span className="text-white text-xs">✓</span>
                                            </div>
                                        )}
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    {/* Primary and Button Colors */}
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Primary
                            </label>
                            <div className="flex items-center gap-3">
                                <input
                                    type="color"
                                    value={formData.useGradient ? formData.gradientColors?.from || '#3b82f6' : formData.primaryColor || '#3b82f6'}
                                    onChange={(e) => {
                                        if (formData.useGradient) {
                                            setFormData({
                                                ...formData,
                                                gradientColors: {
                                                    ...formData.gradientColors,
                                                    from: e.target.value
                                                }
                                            })
                                        } else {
                                            setFormData({ ...formData, primaryColor: e.target.value })
                                        }
                                    }}
                                    className="w-16 h-12 rounded-lg border border-gray-300 cursor-pointer"
                                />
                                <input
                                    type="text"
                                    value={formData.useGradient ? formData.gradientColors?.from || '#3b82f6' : formData.primaryColor || '#3b82f6'}
                                    onChange={(e) => {
                                        if (formData.useGradient) {
                                            setFormData({
                                                ...formData,
                                                gradientColors: {
                                                    ...formData.gradientColors,
                                                    from: e.target.value
                                                }
                                            })
                                        } else {
                                            setFormData({ ...formData, primaryColor: e.target.value })
                                        }
                                    }}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                    placeholder="#3b82f6"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Button
                            </label>
                            <div className="flex items-center gap-3">
                                <input
                                    type="color"
                                    value={formData.useGradient ? formData.gradientColors?.to || '#8b5cf6' : formData.buttonColor || '#8b5cf6'}
                                    onChange={(e) => {
                                        if (formData.useGradient) {
                                            setFormData({
                                                ...formData,
                                                gradientColors: {
                                                    ...formData.gradientColors,
                                                    to: e.target.value
                                                }
                                            })
                                        } else {
                                            setFormData({ ...formData, buttonColor: e.target.value })
                                        }
                                    }}
                                    className="w-16 h-12 rounded-lg border border-gray-300 cursor-pointer"
                                />
                                <input
                                    type="text"
                                    value={formData.useGradient ? formData.gradientColors?.to || '#8b5cf6' : formData.buttonColor || '#8b5cf6'}
                                    onChange={(e) => {
                                        if (formData.useGradient) {
                                            setFormData({
                                                ...formData,
                                                gradientColors: {
                                                    ...formData.gradientColors,
                                                    to: e.target.value
                                                }
                                            })
                                        } else {
                                            setFormData({ ...formData, buttonColor: e.target.value })
                                        }
                                    }}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                    placeholder="#8b5cf6"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Gradient Toggle */}
                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            id="use-gradient"
                            checked={formData.useGradient || false}
                            onChange={(e) => handleGradientToggle(e.target.checked)}
                            className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <label htmlFor="use-gradient" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            Use color gradient?
                            <HelpCircle className="w-4 h-4 text-gray-400" />
                        </label>
                    </div>

                    {formData.useGradient && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="p-4 bg-gray-50 rounded-lg"
                        >
                            <div className="h-12 rounded-lg mb-2" style={{
                                background: `linear-gradient(135deg, ${formData.gradientColors?.from || '#3b82f6'} 0%, ${formData.gradientColors?.to || '#8b5cf6'} 100%)`
                            }} />
                            <p className="text-xs text-gray-500">Gradient preview</p>
                        </motion.div>
                    )}
                </motion.div>
            )}

            {/* Navigation */}
            <div className="flex justify-between p-6 border-t border-gray-200">
                <button type="button" onClick={onBack} className="btn-outline flex items-center">
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back
                </button>
                <button type="button" onClick={onNext} className="btn-primary flex items-center">
                    Next Step
                    <ArrowRight className="w-5 h-5 ml-2" />
                </button>
            </div>
        </motion.div>
    )
}

