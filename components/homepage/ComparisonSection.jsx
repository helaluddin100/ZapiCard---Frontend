'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { X, Check, Sparkles, FileText, TrendingUp, Zap } from 'lucide-react'

export default function ComparisonSection() {
    const traditionalFeatures = [
        { text: "Limited information space", icon: "📏" },
        { text: "Easily lost or damaged", icon: "💔" },
        { text: "Need reprinting for updates", icon: "🖨️" },
        { text: "No analytics or tracking", icon: "📊" },
        { text: "Environmental waste", icon: "🌍" },
        { text: "One-way information sharing", icon: "➡️" },
        { text: "No appointment booking", icon: "📅" },
        { text: "Manual data entry required", icon: "✍️" }
    ]

    const smartFeatures = [
        { text: "Unlimited information storage", icon: "☁️" },
        { text: "Cloud-based, never lost", icon: "🔒" },
        { text: "Instant updates anytime", icon: "⚡" },
        { text: "Complete analytics dashboard", icon: "📈" },
        { text: "100% eco-friendly", icon: "🌱" },
        { text: "Two-way communication", icon: "💬" },
        { text: "Built-in appointment system", icon: "📆" },
        { text: "AI-powered data reading", icon: "🤖" }
    ]

    return (
        <section className="py-28 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 via-white to-blue-50/50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.1, 0.2, 0.1],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute top-20 left-10 w-96 h-96 bg-blue-400 rounded-full blur-3xl"
                ></motion.div>
                <motion.div
                    animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.1, 0.15, 0.1],
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1
                    }}
                    className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-purple-400 rounded-full blur-3xl"
                ></motion.div>
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-20"
                >
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="inline-flex items-center gap-2 mb-6"
                    >
                        <span className="px-6 py-2.5 rounded-full bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 dark:from-blue-900/30 dark:via-purple-900/30 dark:to-pink-900/30 text-blue-700 dark:text-blue-300 text-sm md:text-base font-semibold border-2 border-blue-200 dark:border-blue-800 shadow-sm">
                            <Zap className="w-4 h-4 inline mr-2" />
                            Why Choose Smart Cards?
                        </span>
                    </motion.div>

                    {/* Title */}
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-blue-600 to-purple-600 dark:from-white dark:via-blue-400 dark:to-purple-400 bg-clip-text text-transparent leading-tight">
                        Traditional vs Smart Cards
                    </h2>

                    {/* Subtitle */}
                    <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
                        See why <span className="font-bold text-blue-600 dark:text-blue-400">15,000+</span> professionals are making the switch to digital smart cards
                    </p>
                </motion.div>

                {/* Comparison Cards Grid */}
                <div className="grid md:grid-cols-2 gap-8 lg:gap-12 mb-16">
                    {/* Traditional Cards - Left Side */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className="relative group"
                    >
                        <div className="relative h-full p-10 bg-white dark:bg-gray-800 rounded-3xl border-2 border-gray-200 dark:border-gray-700 shadow-xl hover:shadow-2xl transition-all duration-500 hover:border-gray-300 dark:hover:border-gray-600">
                            {/* Card Header */}
                            <div className="text-center mb-10">
                                <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 mb-6 shadow-lg">
                                    <FileText className="w-12 h-12 text-gray-600 dark:text-gray-400" />
                                </div>
                                <h3 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                                    Traditional Cards
                                </h3>
                                <p className="text-base text-gray-500 dark:text-gray-400 font-medium">
                                    The old way of networking
                                </p>
                            </div>

                            {/* Features List */}
                            <ul className="space-y-4">
                                {traditionalFeatures.map((feature, idx) => (
                                    <motion.li
                                        key={idx}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.4, delay: 0.4 + idx * 0.08 }}
                                        className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 border border-gray-100 dark:border-gray-600"
                                    >
                                        <div className="flex-shrink-0 mt-1">
                                            <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                                                <X className="w-5 h-5 text-red-600 dark:text-red-400" />
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <span className="text-gray-700 dark:text-gray-300 text-base md:text-lg font-medium leading-relaxed block">
                                                {feature.text}
                                            </span>
                                        </div>
                                    </motion.li>
                                ))}
                            </ul>
                        </div>
                    </motion.div>

                    {/* Smart Cards - Right Side */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, delay: 0.3 }}
                        className="relative group"
                    >
                        {/* Glow Effect Behind Card */}
                        <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl blur-2xl opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>

                        {/* Popular Badge */}
                        <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 z-20">
                            <motion.div
                                initial={{ opacity: 0, y: -20, scale: 0.8 }}
                                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                                viewport={{ once: true }}
                                animate={{ scale: [1, 1.05, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="px-6 py-2.5 rounded-full bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-400 text-white text-sm font-bold shadow-2xl border-2 border-white/50 flex items-center gap-2"
                            >
                                <TrendingUp className="w-4 h-4" />
                                Most Popular Choice
                            </motion.div>
                        </div>

                        {/* Main Card */}
                        <div className="relative h-full p-10 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-3xl border-2 border-purple-400 shadow-2xl transform md:scale-105 hover:scale-[1.06] transition-all duration-500 overflow-hidden">
                            {/* Animated Background Pattern */}
                            <div className="absolute inset-0 opacity-20">
                                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]"></div>
                            </div>

                            <div className="relative z-10">
                                {/* Card Header */}
                                <div className="text-center mb-10">
                                    <motion.div
                                        animate={{ rotate: [0, 5, -5, 0] }}
                                        transition={{ duration: 4, repeat: Infinity }}
                                        className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-white/20 backdrop-blur-md mb-6 shadow-2xl border-2 border-white/30"
                                    >
                                        <Sparkles className="w-12 h-12 text-white" />
                                    </motion.div>
                                    <h3 className="text-3xl md:text-4xl font-bold text-white mb-3">
                                        Zapi Smart Cards
                                    </h3>
                                    <p className="text-base text-white/90 font-medium">
                                        The future of networking
                                    </p>
                                </div>

                                {/* Features List */}
                                <ul className="space-y-4 mb-10">
                                    {smartFeatures.map((feature, idx) => (
                                        <motion.li
                                            key={idx}
                                            initial={{ opacity: 0, x: 20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 0.4, delay: 0.5 + idx * 0.08 }}
                                            className="flex items-start gap-4 p-4 rounded-xl bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 border border-white/20 hover:border-white/30"
                                        >
                                            <div className="flex-shrink-0 mt-1">
                                                <div className="w-8 h-8 rounded-full bg-green-400/30 backdrop-blur-sm flex items-center justify-center border border-green-300/50">
                                                    <Check className="w-5 h-5 text-green-200" />
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <span className="text-white font-semibold text-base md:text-lg leading-relaxed block">
                                                    {feature.text}
                                                </span>
                                            </div>
                                        </motion.li>
                                    ))}
                                </ul>

                                {/* CTA Button */}
                                <div className="pt-6 border-t border-white/30">
                                    <Link
                                        href="/signup"
                                        className="group block w-full text-center py-4 bg-white text-blue-600 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all transform hover:scale-105 shadow-2xl hover:shadow-white/50"
                                    >
                                        <span className="flex items-center justify-center gap-3">
                                            Make the Switch Today
                                            <motion.span
                                                animate={{ x: [0, 5, 0] }}
                                                transition={{ duration: 1.5, repeat: Infinity }}
                                                className="text-xl"
                                            >
                                                →
                                            </motion.span>
                                        </span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Bottom CTA Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="text-center"
                >
                    <div className="inline-block p-8 md:p-12 bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-gray-900 rounded-3xl border-2 border-blue-200 dark:border-blue-800 shadow-2xl max-w-2xl">
                        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                            Ready to Make the Switch?
                        </h3>
                        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-8">
                            Join <span className="font-bold text-blue-600 dark:text-blue-400">15,000+</span> professionals already using smart cards
                        </p>
                        <Link
                            href="/signup"
                            className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-bold text-lg md:text-xl rounded-xl shadow-2xl hover:shadow-blue-500/50 transition-all transform hover:scale-105"
                        >
                            <span>Get Started Free</span>
                            <motion.span
                                animate={{ x: [0, 5, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                            >
                                →
                            </motion.span>
                        </Link>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
