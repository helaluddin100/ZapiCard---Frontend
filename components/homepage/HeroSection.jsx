'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export default function HeroSection({ mounted }) {
    return (
        <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600">
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

            {/* Floating Elements */}
            {mounted && (
                <div className="absolute inset-0 z-5 overflow-hidden pointer-events-none">
                    {[...Array(6)].map((_, i) => {
                        const randomLeft = 10 + (i * 13.33) % 80
                        const randomTop = 10 + (i * 15) % 80
                        return (
                            <motion.div
                                key={i}
                                className="absolute w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/10 backdrop-blur-sm"
                                initial={{
                                    scale: 0,
                                    opacity: 0,
                                }}
                                animate={{
                                    y: [0, -30, 0],
                                    x: [0, 20, 0],
                                    scale: [0, 1, 0.8],
                                    opacity: [0, 0.5, 0],
                                }}
                                transition={{
                                    duration: 8 + i * 2,
                                    repeat: Infinity,
                                    delay: i * 0.5,
                                    ease: "easeInOut",
                                }}
                                style={{
                                    left: `${randomLeft}%`,
                                    top: `${randomTop}%`,
                                }}
                            />
                        )
                    })}
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
                        className="inline-block mb-6"
                    >
                        <span className="px-4 py-2 rounded-full bg-white/20 backdrop-blur-md text-white text-sm font-semibold border border-white/30">
                            ✨ Smart Networking Revolution
                        </span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-white drop-shadow-2xl"
                    >
                        Smart Cards for
                        <br />
                        <span className="bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 bg-clip-text text-transparent animate-gradient">
                            Business & Health
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                        className="text-xl md:text-2xl lg:text-3xl text-white/90 mb-8 max-w-4xl mx-auto font-medium drop-shadow-lg"
                    >
                        Revolutionary digital cards with <span className="font-bold text-yellow-300">NFC & QR technology</span>
                        <br />
                        <span className="text-white/90 text-lg md:text-xl">
                            📇 Smart Visiting Cards for Professionals | 🏥 Smart Health Cards for Patients
                        </span>
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.7 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                    >
                        <Link
                            href="/health-dashboard/create"
                            className="group relative px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold text-lg shadow-2xl hover:shadow-green-500/50 transition-all duration-300 transform hover:scale-105"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                🏥 Create Health Card
                                <motion.span
                                    animate={{ x: [0, 5, 0] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                >
                                    →
                                </motion.span>
                            </span>
                        </Link>
                        <Link
                            href="/dashboard/create"
                            className="group relative px-8 py-4 bg-white text-blue-600 rounded-xl font-bold text-lg shadow-2xl hover:shadow-white/50 transition-all duration-300 transform hover:scale-105 overflow-hidden"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                📇 Create Visiting Card
                            </span>
                        </Link>
                        <Link
                            href="/nfc-order"
                            className="group px-8 py-4 bg-white/10 backdrop-blur-md text-white border-2 border-white/30 rounded-xl font-bold text-lg hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
                        >
                            Order NFC Card
                        </Link>
                    </motion.div>

                    {/* Stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 1.1 }}
                        className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-4xl mx-auto"
                    >
                        {[
                            { number: '15K+', label: 'Active Users', icon: '👥' },
                            { number: '80K+', label: 'Cards Created', icon: '📇' },
                            { number: '5K+', label: 'Health Cards', icon: '🏥' },
                            { number: '4.9★', label: 'User Rating', icon: '⭐' }
                        ].map((stat, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5, delay: 1.2 + idx * 0.1 }}
                                className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20"
                            >
                                <div className="text-2xl mb-2">{stat.icon}</div>
                                <div className="text-3xl md:text-4xl font-bold text-white mb-1">{stat.number}</div>
                                <div className="text-white/80 text-sm md:text-base">{stat.label}</div>
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.div>
            </div>
        </section>
    )
}

