'use client'

import { useState } from 'react'
import { Radio, Mail, Phone, Globe, MapPin, RotateCw } from 'lucide-react'
import Image from 'next/image'

export default function CardPreview3D({
    card,
    bgColor,
    textColor,
    useGradient,
    gradientColors,
    profileImage,
    material
}) {
    const [showBack, setShowBack] = useState(false)

    const getBackgroundStyle = () => {
        if (useGradient && gradientColors) {
            return {
                background: `linear-gradient(135deg, ${gradientColors.from} 0%, ${gradientColors.to} 100%)`
            }
        }
        return { backgroundColor: bgColor }
    }

    const getInitials = (name) => {
        if (!name) return 'JD'
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    }

    // Standard credit card dimensions: 85.6mm x 53.98mm (ratio: 1.585)
    const cardAspectRatio = 85.6 / 53.98

    return (
        <div className="w-full max-w-full">
            {/* Flip Button */}
            <div className="flex justify-center mb-4">
                <button
                    onClick={() => setShowBack(!showBack)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm font-medium text-gray-700"
                >
                    <RotateCw className="w-4 h-4" />
                    {showBack ? 'Show Front' : 'Show Back'}
                </button>
            </div>

            {/* Card Container */}
            <div className="relative w-full" style={{ aspectRatio: cardAspectRatio, maxWidth: '400px', margin: '0 auto' }}>
                {/* Front Side */}
                {!showBack ? (
                    <div
                        className="relative rounded-2xl p-6 shadow-lg border border-gray-200 overflow-hidden w-full h-full"
                        style={getBackgroundStyle()}
                    >
                        {/* Material-specific overlay */}
                        {material === 'metal' && (
                            <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/5 pointer-events-none"></div>
                        )}
                        {material === 'wood' && (
                            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
                                backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)'
                            }}></div>
                        )}

                        {/* NFC Watermark - Right Middle */}
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-10">
                            <Radio className="w-12 h-12" style={{ color: textColor }} />
                        </div>

                        {/* Card Content */}
                        <div className="relative z-10 h-full flex flex-col justify-between" style={{ color: textColor }}>
                            {/* Top Section - User Name and Title */}
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    {profileImage ? (
                                        <div className="w-12 h-12 rounded-lg overflow-hidden border-2 border-white/30 shadow-md">
                                            <Image
                                                src={profileImage}
                                                alt={card?.name || 'Profile'}
                                                width={48}
                                                height={48}
                                                className="w-full h-full object-cover"
                                                unoptimized={profileImage.startsWith('data:')}
                                            />
                                        </div>
                                    ) : (
                                        <div className="w-12 h-12 rounded-lg bg-white/20 backdrop-blur-sm border-2 border-white/30 shadow-md flex items-center justify-center">
                                            <span className="text-lg font-bold">{getInitials(card?.name)}</span>
                                        </div>
                                    )}
                                    <div>
                                        <h3 className="font-bold text-lg leading-tight">
                                            {card?.name || 'Name'}
                                        </h3>
                                        {card?.title && (
                                            <p className="text-sm font-medium opacity-90 mt-0.5">
                                                {card.title}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Middle Section - Contact Info */}
                            {card && (
                                <div className="flex-1 flex flex-col justify-center space-y-1.5 mt-4">
                                    {card.phone && (
                                        <div className="flex items-center gap-2 text-sm">
                                            <Phone className="w-3.5 h-3.5 opacity-80" />
                                            <span className="font-medium">{card.phone}</span>
                                        </div>
                                    )}
                                    {card.email && (
                                        <div className="flex items-center gap-2 text-sm">
                                            <Mail className="w-3.5 h-3.5 opacity-80" />
                                            <span className="truncate text-xs">{card.email}</span>
                                        </div>
                                    )}
                                    {card.company ? (
                                        <div className="flex items-center gap-2 text-sm">
                                            <Globe className="w-3.5 h-3.5 opacity-80" />
                                            <span className="truncate text-xs">{card.company}</span>
                                        </div>
                                    ) : card.address ? (
                                        <div className="flex items-center gap-2 text-sm">
                                            <MapPin className="w-3.5 h-3.5 opacity-80" />
                                            <span className="truncate text-xs">{card.address}</span>
                                        </div>
                                    ) : null}
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    /* Back Side */
                    <div
                        className="relative rounded-2xl p-6 shadow-lg border border-gray-200 overflow-hidden w-full h-full"
                        style={getBackgroundStyle()}
                    >
                        {/* Material-specific overlay */}
                        {material === 'metal' && (
                            <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/5 pointer-events-none"></div>
                        )}
                        {material === 'wood' && (
                            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
                                backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)'
                            }}></div>
                        )}

                        {/* Card Content - Back */}
                        <div className="relative z-10 h-full flex flex-col items-center justify-center" style={{ color: textColor }}>
                            {card?.qrCode ? (
                                <div className="flex flex-col items-center justify-center gap-4 w-full px-4 h-full">
                                    {/* QR Code - Perfect Size */}
                                    <div className="bg-white/90 backdrop-blur-sm rounded-lg p-1.5 shadow-lg">
                                        <Image
                                            src={card.qrCode}
                                            alt="QR Code"
                                            width={70}
                                            height={70}
                                            className="w-[70px] h-[70px] object-contain"
                                            unoptimized
                                        />
                                    </div>

                                    {/* Bottom Section - NFC and URL */}
                                    {/* <div className="flex items-center justify-between w-full mt-auto pt-3 border-t border-white/20">
                                        <div className="text-xs font-mono opacity-60">NFC</div>
                                        {card?.website && (
                                            <div className="text-xs opacity-70 truncate max-w-[60%]">
                                                {card.website}
                                            </div>
                                        )}
                                    </div> */}
                                </div>
                            ) : (
                                <div className="text-center">
                                    <p className="text-sm opacity-70">No QR code available</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
