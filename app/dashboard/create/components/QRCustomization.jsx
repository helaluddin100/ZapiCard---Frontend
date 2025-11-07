'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, CheckCircle2, Upload, X, RotateCcw, HelpCircle } from 'lucide-react'
import CustomQRCode from './CustomQRCode'

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

// QR Shapes - Different module patterns
const qrShapes = [
    { id: 'square', label: 'Square', type: 'square' },
    { id: 'rounded', label: 'Rounded', type: 'rounded' },
    { id: 'circle', label: 'Circle', type: 'circle' },
    { id: 'dot', label: 'Dot', type: 'dot' },
    { id: 'organic', label: 'Organic', type: 'organic' },
    { id: 'rounded-square', label: 'Rounded Square', type: 'rounded-square' },
]

// QR Corner Styles - Different finder pattern designs
const qrCorners = [
    { id: 'square', label: 'Square', type: 'square' },
    { id: 'rounded', label: 'Rounded', type: 'rounded' },
    { id: 'circle', label: 'Circle', type: 'circle' },
    { id: 'extra-rounded', label: 'Extra Rounded', type: 'extra-rounded' },
    { id: 'dot', label: 'Dot', type: 'dot' },
    { id: 'classy', label: 'Classy', type: 'classy' },
    { id: 'classy-rounded', label: 'Classy Rounded', type: 'classy-rounded' },
    { id: 'smooth', label: 'Smooth', type: 'smooth' },
    { id: 'smooth-rounded', label: 'Smooth Rounded', type: 'smooth-rounded' },
    { id: 'cut', label: 'Cut', type: 'cut' },
    { id: 'diamond', label: 'Diamond', type: 'diamond' },
    { id: 'pointed', label: 'Pointed', type: 'pointed' },
    { id: 'pointed-smooth', label: 'Pointed Smooth', type: 'pointed-smooth' },
    { id: 'pointed-edge', label: 'Pointed Edge', type: 'pointed-edge' },
    { id: 'pointed-inverted', label: 'Pointed Inverted', type: 'pointed-inverted' },
]

export default function QRCustomization({ formData, setFormData, onNext, onBack }) {
    const [showAllFrames, setShowAllFrames] = useState(false)
    const [showAllLogos, setShowAllLogos] = useState(false)
    const [cornerTab, setCornerTab] = useState('all')

    // Generate QR code data URL
    const qrData = useMemo(() => {
        // Create vCard data or card URL
        const cardUrl = typeof window !== 'undefined'
            ? `${window.location.origin}/card/${Date.now()}`
            : 'https://zapicard.com/card/1'

        // Create vCard string
        const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${formData.name || 'Name'}
ORG:${formData.company || 'Company'}
TITLE:${formData.title || 'Title'}
EMAIL:${formData.email || ''}
TEL:${formData.phone || ''}
URL:${formData.website || ''}
ADR:;;${formData.address || ''};;;;
NOTE:${formData.bio || ''}
END:VCARD`

        return vcard
    }, [formData.name, formData.company, formData.title, formData.email, formData.phone, formData.website, formData.address, formData.bio])

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

    const handleLogoUpload = (e) => {
        const file = e.target.files[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setFormData({
                    ...formData,
                    qrCustomLogo: reader.result,
                    qrLogo: 'custom'
                })
            }
            reader.readAsDataURL(file)
        }
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
                            <label className="px-3 py-1 text-xs bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition cursor-pointer">
                                <Upload className="w-3 h-3 inline mr-1" />
                                Upload
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleLogoUpload}
                                    className="hidden"
                                />
                            </label>
                        </div>
                        <div className="grid grid-cols-4 gap-3">
                            {(showAllLogos ? qrLogos : qrLogos.slice(0, 4)).map((logo) => {
                                const isSelected = formData.qrLogo === logo.id || (logo.id === 'none' && !formData.qrLogo)
                                return (
                                    <button
                                        key={logo.id}
                                        type="button"
                                        onClick={() => {
                                            if (logo.id === 'none') {
                                                setFormData({ ...formData, qrLogo: 'none', qrCustomLogo: null })
                                            } else {
                                                setFormData({ ...formData, qrLogo: logo.id, qrCustomLogo: null })
                                            }
                                        }}
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
                            {formData.qrCustomLogo && (
                                <div className="relative">
                                    <div className="p-3 border-2 border-blue-500 bg-blue-50 rounded-lg">
                                        <img
                                            src={formData.qrCustomLogo}
                                            alt="Custom Logo"
                                            className="w-8 h-8 mx-auto mb-1 object-contain"
                                        />
                                        <div className="text-xs text-gray-600">Custom</div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, qrCustomLogo: null, qrLogo: 'none' })}
                                        className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Shapes */}
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <label className="block text-sm font-semibold text-gray-900 uppercase">
                                Shapes
                            </label>
                            <HelpCircle className="w-4 h-4 text-gray-400" />
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                            {qrShapes.map((shape) => {
                                const isSelected = formData.qrShape === shape.id
                                return (
                                    <button
                                        key={shape.id}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, qrShape: shape.id })}
                                        className={`
                                            p-3 border-2 rounded-lg transition
                                            ${isSelected
                                                ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                                                : 'border-gray-200 hover:border-gray-300'
                                            }
                                        `}
                                    >
                                        <div className="w-16 h-16 mx-auto mb-2 bg-gray-100 rounded flex items-center justify-center">
                                            <div className={`
                                                w-12 h-12
                                                ${shape.id === 'square' ? 'bg-gray-800 rounded-none' : ''}
                                                ${shape.id === 'rounded' ? 'bg-gray-800 rounded-lg' : ''}
                                                ${shape.id === 'circle' ? 'bg-gray-800 rounded-full' : ''}
                                                ${shape.id === 'dot' ? 'bg-gray-800 rounded-full w-8 h-8' : ''}
                                                ${shape.id === 'organic' ? 'bg-gray-800 rounded-full' : ''}
                                                ${shape.id === 'rounded-square' ? 'bg-gray-800 rounded-md' : ''}
                                            `} />
                                        </div>
                                        <div className="text-xs font-medium text-center">{shape.label}</div>
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
                        <div className="grid grid-cols-5 gap-2 max-h-64 overflow-y-auto">
                            {qrCorners.map((corner) => {
                                const isSelected = formData.qrCorner === corner.id
                                return (
                                    <button
                                        key={corner.id}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, qrCorner: corner.id })}
                                        className={`
                                            p-2 border-2 rounded-lg transition relative
                                            ${isSelected
                                                ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                                                : 'border-gray-200 hover:border-gray-300'
                                            }
                                        `}
                                        title={corner.label}
                                    >
                                        <div className="w-12 h-12 mx-auto bg-gray-800 flex items-center justify-center relative">
                                            {/* Corner preview based on type */}
                                            <div className={`
                                                w-10 h-10
                                                ${corner.id === 'square' ? 'bg-gray-800 rounded-none' : ''}
                                                ${corner.id === 'rounded' ? 'bg-gray-800 rounded-lg' : ''}
                                                ${corner.id === 'circle' ? 'bg-gray-800 rounded-full' : ''}
                                                ${corner.id === 'extra-rounded' ? 'bg-gray-800 rounded-2xl' : ''}
                                                ${corner.id === 'dot' ? 'bg-gray-800 rounded-full w-6 h-6' : ''}
                                                ${corner.id === 'classy' ? 'bg-gray-800 rounded-none border-2 border-white' : ''}
                                                ${corner.id === 'classy-rounded' ? 'bg-gray-800 rounded-lg border-2 border-white' : ''}
                                                ${corner.id === 'smooth' ? 'bg-gray-800 rounded-xl' : ''}
                                                ${corner.id === 'smooth-rounded' ? 'bg-gray-800 rounded-2xl' : ''}
                                                ${corner.id === 'cut' || corner.id === 'diamond' ? 'bg-gray-800 transform rotate-45' : ''}
                                                ${corner.id === 'pointed' ? 'bg-gray-800 rounded-t-lg' : ''}
                                                ${corner.id === 'pointed-smooth' ? 'bg-gray-800 rounded-t-2xl' : ''}
                                                ${corner.id === 'pointed-edge' ? 'bg-gray-800 rounded-t-lg' : ''}
                                                ${corner.id === 'pointed-inverted' ? 'bg-gray-800 rounded-b-lg' : ''}
                                            `} />
                                        </div>
                                        <div className="text-xs text-center mt-1 text-gray-600 truncate">{corner.label}</div>
                                    </button>
                                )
                            })}
                        </div>

                        {/* Use QR Code Color Toggle */}
                        <div className="flex items-center gap-3 mt-4 p-3 bg-gray-50 rounded-lg">
                            <input
                                type="checkbox"
                                id="use-qr-color"
                                checked={formData.useQrColorForCorners !== false}
                                onChange={(e) => setFormData({ ...formData, useQrColorForCorners: e.target.checked })}
                                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                            />
                            <label htmlFor="use-qr-color" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                Use QR Code color
                                <HelpCircle className="w-4 h-4 text-gray-400" />
                            </label>
                        </div>
                    </div>
                </div>

                {/* Right Panel - Preview */}
                <div className="lg:sticky lg:top-8 h-fit">
                    <div className="bg-gray-50 rounded-lg p-6">
                        <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase">Preview</h3>
                        <div className="bg-white p-6 rounded-lg flex justify-center">
                            <div
                                className="relative flex items-center justify-center"
                                style={{
                                    backgroundColor: formData.qrBackgroundColor || '#ffffff',
                                    padding: '20px',
                                    borderRadius: formData.qrFrame !== 'none' ? '12px' : '0',
                                    minWidth: '240px',
                                    minHeight: '240px'
                                }}
                            >
                                {/* QR Code */}
                                <div
                                    className="relative flex items-center justify-center"
                                    style={{
                                        borderRadius: formData.qrShape === 'circle' ? '50%' :
                                            formData.qrShape === 'rounded' ? '12px' : '0',
                                        overflow: 'hidden',
                                        padding: formData.qrFrame !== 'none' ? '8px' : '0'
                                    }}
                                >
                                    <CustomQRCode
                                        value={qrData}
                                        size={192}
                                        fgColor={formData.qrColor || '#000000'}
                                        bgColor={formData.qrBackgroundColor || '#ffffff'}
                                        shape={formData.qrShape || 'square'}
                                        corner={formData.qrCorner || 'square'}
                                        logo={
                                            formData.qrCustomLogo
                                                ? formData.qrCustomLogo
                                                : (formData.qrLogo !== 'none' && formData.qrLogo !== 'custom' && formData.qrLogo)
                                                    ? `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"><text x="50%" y="50%" font-size="24" text-anchor="middle" dominant-baseline="middle">${formData.qrLogo === 'logo1' ? '🆔' : formData.qrLogo === 'logo2' ? '👤' : '📋'}</text></svg>`)}`
                                                    : null
                                        }
                                    />
                                </div>

                                {/* Frame Label */}
                                {formData.qrFrame !== 'none' && (
                                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-xs font-semibold text-gray-700 bg-white/90 px-3 py-1 rounded">
                                        {qrFrames.find(f => f.id === formData.qrFrame)?.label || 'SCAN ME'}
                                    </div>
                                )}
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

