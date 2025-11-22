'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Brain, PenTool, AlertCircle, Heart, FileText, Shield, Sparkles, Activity } from 'lucide-react'

export default function HealthCardShowcase() {
    const healthCardFeatures = [
        {
            title: "AI Prescription Reading",
            description: "Upload prescription images - AI automatically reads and inputs data",
            icon: Brain,
            iconColor: 'from-blue-500 to-cyan-500',
            bgColor: 'from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20',
            borderColor: 'border-blue-200 dark:border-blue-800'
        },
        {
            title: "Manual Data Entry",
            description: "Complete control - add health records, medications, and allergies manually",
            icon: PenTool,
            iconColor: 'from-purple-500 to-pink-500',
            bgColor: 'from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20',
            borderColor: 'border-purple-200 dark:border-purple-800'
        },
        {
            title: "Emergency Access",
            description: "Critical health info available instantly via NFC tap or QR scan",
            icon: AlertCircle,
            iconColor: 'from-red-500 to-orange-500',
            bgColor: 'from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20',
            borderColor: 'border-red-200 dark:border-red-800'
        },
        {
            title: "Pregnancy Tracking",
            description: "Specialized cards for expectant mothers with prenatal records",
            icon: Heart,
            iconColor: 'from-pink-500 to-rose-500',
            bgColor: 'from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20',
            borderColor: 'border-pink-200 dark:border-pink-800'
        },
        {
            title: "Medical History",
            description: "Complete health timeline - past treatments, surgeries, and conditions",
            icon: FileText,
            iconColor: 'from-indigo-500 to-purple-500',
            bgColor: 'from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20',
            borderColor: 'border-indigo-200 dark:border-indigo-800'
        },
        {
            title: "Secure & Private",
            description: "Your health data encrypted and accessible only by authorized personnel",
            icon: Shield,
            iconColor: 'from-emerald-500 to-teal-500',
            bgColor: 'from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20',
            borderColor: 'border-emerald-200 dark:border-emerald-800'
        }
    ]

    return (
        <section className="py-28 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50/50 via-purple-50/50 to-pink-50/50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.1, 0.2, 0.1],
                        x: [0, 50, 0],
                        y: [0, 30, 0]
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute top-20 left-10 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl"
                ></motion.div>
                <motion.div
                    animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.1, 0.15, 0.1],
                        x: [0, -30, 0],
                        y: [0, 50, 0]
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1
                    }}
                    className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-purple-300/20 rounded-full blur-3xl"
                ></motion.div>
                <motion.div
                    animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.1, 0.2, 0.1],
                    }}
                    transition={{
                        duration: 12,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 2
                    }}
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-300/20 rounded-full blur-3xl"
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
                        <span className="px-6 py-2.5 rounded-full bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-blue-300/30 dark:border-blue-600/30 text-blue-600 dark:text-blue-400 text-sm md:text-base font-semibold shadow-sm">
                            <Activity className="w-4 h-4 inline mr-2" />
                            Revolutionary Healthcare Solution
                        </span>
                    </motion.div>

                    {/* Title */}
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-blue-600 to-purple-600 dark:from-white dark:via-blue-400 dark:to-purple-400 bg-clip-text text-transparent leading-tight">
                        Smart Health Card
                    </h2>

                    {/* Subtitle */}
                    <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
                        Perfect for patients, pregnant women, and anyone who needs instant access to their medical information
                    </p>
                </motion.div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-16">
                    {healthCardFeatures.map((feature, idx) => {
                        const IconComponent = feature.icon
                        return (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: idx * 0.1 }}
                                whileHover={{ y: -8, scale: 1.02 }}
                                className="relative group"
                            >
                                <div className={`relative h-full p-8 rounded-3xl border-2 transition-all duration-300 bg-gradient-to-br ${feature.bgColor} ${feature.borderColor} shadow-lg hover:shadow-2xl dark:bg-gray-800/50`}>
                                    {/* Icon with gradient background */}
                                    <motion.div
                                        whileHover={{ scale: 1.1, rotate: 5 }}
                                        className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 bg-gradient-to-br ${feature.iconColor} shadow-lg`}
                                    >
                                        <IconComponent className="w-8 h-8 text-white" />
                                    </motion.div>

                                    <h3 className="text-xl md:text-2xl font-bold mb-3 text-gray-900 dark:text-gray-100">
                                        {feature.title}
                                    </h3>
                                    <p className="text-base leading-relaxed text-gray-600 dark:text-gray-400">
                                        {feature.description}
                                    </p>

                                    {/* Decorative element */}
                                    <div className={`absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-br ${feature.iconColor} opacity-10 rounded-full blur-2xl`}></div>
                                </div>
                            </motion.div>
                        )
                    })}
                </div>

                {/* CTA Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="text-center"
                >
                    <div className="inline-block p-8 md:p-12 bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-gray-900 rounded-3xl border-2 border-blue-200 dark:border-blue-800 shadow-2xl max-w-2xl">
                        <motion.div
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 3, repeat: Infinity }}
                            className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 mb-6 shadow-lg"
                        >
                            <Heart className="w-10 h-10 text-white" />
                        </motion.div>
                        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                            Ready to Create Your Health Card?
                        </h3>
                        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-8">
                            Join thousands of users managing their health information digitally
                        </p>
                        <Link
                            href="/health-dashboard/create"
                            className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-bold text-lg md:text-xl rounded-xl shadow-2xl hover:shadow-blue-500/50 transition-all transform hover:scale-105"
                        >
                            <Sparkles className="w-5 h-5" />
                            <span>Create Your Health Card Now</span>
                            <motion.span
                                animate={{ x: [0, 5, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                            >
                                <ArrowRight className="w-5 h-5" />
                            </motion.span>
                        </Link>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}

