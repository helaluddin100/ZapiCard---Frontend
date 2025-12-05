'use client'

import { motion } from 'framer-motion'
import { PlayCircle } from 'lucide-react'

export default function VideoDemoSection() {
    return (
        <section className="py-28 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-900">
            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-gray-100">
                        See Zapy Card in Action
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-400">
                        Watch how easy it is to create and share your smart cards
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-blue-600 to-purple-600"
                >
                    {/* Video Placeholder */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <button className="group relative">
                            <div className="absolute inset-0 bg-white rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
                            <div className="relative w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                                <PlayCircle className="w-12 h-12 text-blue-600" />
                            </div>
                        </button>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    <div className="absolute bottom-8 left-8 text-white">
                        <p className="text-2xl font-bold mb-2">3-Minute Quick Tour</p>
                        <p className="text-white/80">Learn everything about Smart Cards</p>
                    </div>
                </motion.div>

                {/* Key Stats Below Video */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
                    {[
                        { number: "2 Min", label: "Setup Time" },
                        { number: "100%", label: "Digital" },
                        { number: "∞", label: "Shares" },
                        { number: "24/7", label: "Access" }
                    ].map((stat, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg"
                        >
                            <div className="text-3xl md:text-4xl font-bold gradient-primary bg-clip-text text-transparent mb-2">
                                {stat.number}
                            </div>
                            <div className="text-gray-600 dark:text-gray-400">{stat.label}</div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}

