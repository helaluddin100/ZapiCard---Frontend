'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Heart, Briefcase, ArrowRight } from 'lucide-react'

export default function HeroSection({ mounted }) {
    // Animated background icons
    const backgroundIcons = [
        { icon: '🏥', left: 10, top: 15, size: 'text-6xl', delay: 0 },
        { icon: '📇', left: 85, top: 20, size: 'text-7xl', delay: 0.5 },
        { icon: '💊', left: 15, top: 75, size: 'text-5xl', delay: 1 },
        { icon: '📱', left: 80, top: 70, size: 'text-6xl', delay: 1.5 },
        { icon: '🩺', left: 50, top: 10, size: 'text-5xl', delay: 2 },
        { icon: '💳', left: 20, top: 45, size: 'text-6xl', delay: 2.5 },
        { icon: '📋', left: 75, top: 45, size: 'text-5xl', delay: 3 },
    ]

    return (
        <section className="relative pt-40 pb-20 md:pt-40 md:pb-32 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 min-h-[600px] md:min-h-[800px]">
            {/* Animated Background Gradient */}
            <div className="absolute inset-0 z-0">
                <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-blue-500/50 via-purple-500/50 to-pink-500/50"
                    animate={{
                        backgroundPosition: ['0% 0%', '100% 100%'],
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        repeatType: 'reverse',
                    }}
                />
            </div>

            {/* Animated Background Icons */}
            {mounted && (
                <div className="absolute inset-0 z-5 overflow-hidden pointer-events-none opacity-10">
                    {backgroundIcons.map((item, i) => (
                        <motion.div
                            key={i}
                            className={`absolute ${item.size}`}
                            initial={{
                                scale: 0,
                                opacity: 0,
                                rotate: 0,
                            }}
                            animate={{
                                scale: [0.8, 1.2, 0.8],
                                opacity: [0.2, 0.4, 0.2],
                                rotate: [0, 10, -10, 0],
                                y: [0, -20, 0],
                            }}
                            transition={{
                                duration: 8 + i,
                                repeat: Infinity,
                                delay: item.delay,
                                ease: "easeInOut",
                            }}
                            style={{
                                left: `${item.left}%`,
                                top: `${item.top}%`,
                            }}
                        >
                            {item.icon}
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Content */}
            <div className="relative z-20 max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-center"
                >
                    {/* Animated Badge */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="inline-block mb-8"
                    >
                        <span className="px-6 py-3 rounded-full bg-white/20 backdrop-blur-md text-white text-sm md:text-base font-semibold border border-white/30 shadow-lg">
                            ✨ Smart Networking Revolution
                        </span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="text-3xl sm:text-4xl md:text-7xl lg:text-8xl font-bold mb-4 sm:mb-5 md:mb-6 lg:mb-8 text-white drop-shadow-2xl leading-tight px-2 space-y-2"
                    >
                        <div className="block">Smart Cards for</div>
                        <div className="block bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 bg-clip-text text-transparent">
                            Business & Health
                        </div>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                        className="text-base sm:text-lg md:text-2xl lg:text-3xl text-white/90 mb-3 sm:mb-4 md:mb-5 lg:mb-6 max-w-3xl mx-auto leading-relaxed font-light px-2"
                    >
                        Create your digital identity with{' '}
                        <span className="font-semibold text-yellow-300">NFC & QR technology</span>
                    </motion.p>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="text-sm sm:text-base md:text-xl text-white/80 mb-6 sm:mb-8 md:mb-10 lg:mb-12 max-w-2xl mx-auto px-2"
                    >
                        Professional networking meets healthcare innovation
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.8 }}
                        className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6 justify-center items-center mt-4 px-4"
                    >
                        <Link
                            href="/health-dashboard/create"
                            className="group relative w-full sm:w-auto px-6 sm:px-8 md:px-12 py-3.5 sm:py-4 md:py-5 bg-white text-blue-600 rounded-xl font-bold text-base sm:text-lg md:text-xl shadow-2xl hover:shadow-white/50 transition-all duration-300 transform hover:scale-105 border-2 border-white/20 text-center overflow-hidden"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-2 sm:gap-3">
                                <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 group-hover:scale-110 transition-transform" />
                                <span>Create Health Card</span>
                                <motion.span
                                    animate={{ x: [0, 5, 0] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                    className="hidden sm:inline-block"
                                >
                                    <ArrowRight className="w-5 h-5" />
                                </motion.span>
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </Link>
                        <Link
                            href="/dashboard/create"
                            className="group relative w-full sm:w-auto px-6 sm:px-8 md:px-12 py-3.5 sm:py-4 md:py-5 bg-white/10 backdrop-blur-md text-white border-2 border-white/30 rounded-xl font-bold text-base sm:text-lg md:text-xl hover:bg-white/20 hover:border-white/50 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl text-center overflow-hidden"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-2 sm:gap-3">
                                <Briefcase className="w-5 h-5 sm:w-6 sm:h-6 text-white group-hover:scale-110 transition-transform" />
                                <span>Create Visiting Card</span>
                                <motion.span
                                    animate={{ x: [0, 5, 0] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                    className="hidden sm:inline-block"
                                >
                                    <ArrowRight className="w-5 h-5" />
                                </motion.span>
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </Link>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    )
}

