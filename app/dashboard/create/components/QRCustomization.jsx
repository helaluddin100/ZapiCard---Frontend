'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, CheckCircle2, Upload, X, RotateCcw } from 'lucide-react'

// QR Frame Samples
const qrFrames = [
    { id: 'none', label: 'No Frame', icon: '❌' },
    { id: 'frame1', label: 'GET CONTACT', icon: '📱' },
    { id: 'frame2', label: 'SCAN ME', icon: '📲' },
    { id: 'frame3', label: 'SCAN ME', icon: '🎁' },
    { id: 'frame4', label: 'SCAN ME', icon: '👆' },
]

// QR Logo Samples
const qrLogos = [
    { id: 'none', label: 'No Logo', icon: '❌' },
    { id: 'logo1', label: 'ID Card', icon: '🆔' },
    { id: 'logo2', label: 'Person', icon: '👤' },
    { id: 'logo3', label: 'SCAN ME', icon: '📋' },
]

// QR Shapes
const qrShapes = [
    { id: 'square', label: 'Square', preview: '⬜' },
    { id: 'rounded', label: 'Rounded', preview: '▢' },
    { id: 'circle', label: 'Circle', preview: '⭕' },
    { id: 'dot', label: 'Dot', preview: '⚫' },
]

// QR Corner Styles
const qrCorners = [
    { id: 'square', label: 'Square' },
    { id: 'rounded', label: 'Rounded' },
    { id: 'circle', label: 'Circle' },
    { id: 'cut', label: 'Cut' },
    { id: 'diamond', label: 'Diamond' },
]

export default function QRCustomization({ formData, setFormData, onNext, onBack }) {
    const [showAllFrames, setShowAllFrames] = useState(false)
    const [showAllLogos, setShowAllLogos] = useState(false)
    const [cornerTab, setCornerTab] = useState('all')

    const handleReset = () => {
        setFormData({
            ...formData,
            qrFrame: 'none',
            qrLogo: 'none',
            qrShape: 'square',
            qrCorner: 'square',
            qrColor: '#000000',
            qrBackgroundColor: '#ffffff',
            qrCustomLogo: null
        })
    }

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="bg-white rounded-xl shadow-lg p-6 space-y-6"
        >
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">QR Customization</h2>
                    <p className="text-gray-600">Customize your QR code appearance</p>
                </div>
                <button
                    type="button"
                    onClick={handleReset}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition flex items-center gap-2"
                >
                    <RotateCcw className="w-4 h-4" />
                    Reset Design
                </button>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Left Panel - Customization Options */}
                <div className="space-y-6">
                    {/* Frames */}
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <label className="block text-sm font-semibold text-gray-900 uppercase">
                                Frames
                            </label>
                            <button
                                type="button"
                                onClick={() => setShowAllFrames(!showAllFrames)}
                                className="text-xs text-blue-600 hover:text-blue-700"
                            >
                                {showAllFrames ? 'Show Less' : 'Show All →'}
                            </button>
                        </div>
                        <div className="grid grid-cols-4 gap-3">
                            {(showAllFrames ? qrFrames : qrFrames.slice(0, 4)).map((frame) => {
                                const isSelected = formData.qrFrame === frame.id
                                return (
                                    <button
                                        key={frame.id}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, qrFrame: frame.id })}
                                        className={`
                                            p-3 border-2 rounded-lg transition
                                            ${isSelected
                                                ? 'border-blue-500 bg-blue-50'
                                                : 'border-gray-200 hover:border-gray-300'
                                            }
                                        `}
                                    >
                                        <div className="text-2xl mb-1">{frame.icon}</div>
                                        <div className="text-xs text-gray-600">{frame.label}</div>
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    {/* Logos */}
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <label className="block text-sm font-semibold text-gray-900 uppercase">
                                Logos
                            </label>
                            <button
                                type="button"
                                className="px-3 py-1 text-xs bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition"
                            >
                                Upload
                            </button>
                        </div>
                        <div className="grid grid-cols-4 gap-3">
                            {(showAllLogos ? qrLogos : qrLogos.slice(0, 4)).map((logo) => {
                                const isSelected = formData.qrLogo === logo.id
                                return (
                                    <button
                                        key={logo.id}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, qrLogo: logo.id })}
                                        className={`
                                            p-3 border-2 rounded-lg transition
                                            ${isSelected
                                                ? 'border-blue-500 bg-blue-50'
                                                : 'border-gray-200 hover:border-gray-300'
                                            }
                                        `}
                                    >
                                        <div className="text-2xl mb-1">{logo.icon}</div>
                                        <div className="text-xs text-gray-600">{logo.label}</div>
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    {/* Shapes */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-900 uppercase mb-3">
                            Shapes
                        </label>
                        <div className="grid grid-cols-4 gap-3">
                            {qrShapes.map((shape) => {
                                const isSelected = formData.qrShape === shape.id
                                return (
                                    <button
                                        key={shape.id}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, qrShape: shape.id })}
                                        className={`
                                            p-4 border-2 rounded-lg transition
                                            ${isSelected
                                                ? 'border-blue-500 bg-blue-50'
                                                : 'border-gray-200 hover:border-gray-300'
                                            }
                                        `}
                                    >
                                        <div className="text-3xl mb-2">{shape.preview}</div>
                                        <div className="text-xs font-medium capitalize">{shape.label}</div>
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    {/* Colors */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                QR Code Color
                            </label>
                            <div className="flex items-center gap-3">
                                <input
                                    type="color"
                                    value={formData.qrColor || '#000000'}
                                    onChange={(e) => setFormData({ ...formData, qrColor: e.target.value })}
                                    className="w-16 h-12 rounded-lg border border-gray-300 cursor-pointer"
                                />
                                <input
                                    type="text"
                                    value={formData.qrColor || '#000000'}
                                    onChange={(e) => setFormData({ ...formData, qrColor: e.target.value })}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                    placeholder="#000000"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Background Color
                            </label>
                            <div className="flex items-center gap-3">
                                <input
                                    type="color"
                                    value={formData.qrBackgroundColor || '#ffffff'}
                                    onChange={(e) => setFormData({ ...formData, qrBackgroundColor: e.target.value })}
                                    className="w-16 h-12 rounded-lg border border-gray-300 cursor-pointer"
                                />
                                <input
                                    type="text"
                                    value={formData.qrBackgroundColor || '#ffffff'}
                                    onChange={(e) => setFormData({ ...formData, qrBackgroundColor: e.target.value })}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                    placeholder="#ffffff"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Corners */}
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <label className="block text-sm font-semibold text-gray-900 uppercase">
                                Corners
                            </label>
                            <div className="flex gap-1 ml-auto">
                                <button
                                    type="button"
                                    onClick={() => setCornerTab('all')}
                                    className={`px-3 py-1 text-xs rounded ${cornerTab === 'all' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}
                                >
                                    All
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setCornerTab('custom')}
                                    className={`px-3 py-1 text-xs rounded ${cornerTab === 'custom' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}
                                >
                                    Custom
                                </button>
                            </div>
                        </div>
                        <div className="grid grid-cols-6 gap-2">
                            {qrCorners.map((corner, index) => {
                                const isSelected = formData.qrCorner === corner.id
                                return (
                                    <button
                                        key={corner.id}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, qrCorner: corner.id })}
                                        className={`
                                            p-3 border-2 rounded-lg transition
                                            ${isSelected
                                                ? 'border-blue-500 bg-blue-50'
                                                : 'border-gray-200 hover:border-gray-300'
                                            }
                                        `}
                                        title={corner.label}
                                    >
                                        <div className="w-8 h-8 mx-auto bg-gray-800 rounded-sm" />
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                </div>

                {/* Right Panel - Preview */}
                <div className="lg:sticky lg:top-8 h-fit">
                    <div className="bg-gray-50 rounded-lg p-6">
                        <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase">Preview</h3>
                        <div className="bg-white p-6 rounded-lg flex justify-center">
                            <div
                                className="w-48 h-48 flex items-center justify-center"
                                style={{ backgroundColor: formData.qrBackgroundColor || '#ffffff' }}
                            >
                                <div
                                    className="w-40 h-40"
                                    style={{
                                        backgroundColor: formData.qrColor || '#000000',
                                        borderRadius: formData.qrShape === 'circle' ? '50%' :
                                            formData.qrShape === 'rounded' ? '8px' : '0'
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between pt-4 border-t border-gray-200">
                <button type="button" onClick={onBack} className="btn-outline flex items-center">
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back
                </button>
                <button type="button" onClick={onNext} className="btn-primary flex items-center">
                    Create Card
                    <CheckCircle2 className="w-5 h-5 ml-2" />
                </button>
            </div>
        </motion.div>
    )
}

