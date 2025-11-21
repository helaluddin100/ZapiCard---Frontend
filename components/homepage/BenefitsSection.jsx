'use client'

import { motion } from 'framer-motion'
import { Zap, Shield, Clock, Users, TrendingUp, Heart } from 'lucide-react'

export default function BenefitsSection() {
    const benefits = [
        {
            icon: <Zap className="w-6 h-6" />,
            title: "Instant Access",
            description: "Share or access information in seconds with NFC tap or QR scan"
        },
        {
            icon: <Shield className="w-6 h-6" />,
            title: "Secure & Private",
            description: "Bank-level encryption protects your sensitive data"
        },
        {
            icon: <Clock className="w-6 h-6" />,
            title: "24/7 Available",
            description: "Your digital card works anytime, anywhere"
        },
        {
            icon: <Users className="w-6 h-6" />,
            title: "Easy to Share",
            description: "No app required - works with any smartphone"
        },
        {
            icon: <TrendingUp className="w-6 h-6" />,
            title: "Analytics Included",
            description: "Track views, scans, and engagement metrics"
        },
        {
            icon: <Heart className="w-6 h-6" />,
            title: "Eco-Friendly",
            description: "Save paper and reduce environmental impact"
        }
    ]

    return (
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-gray-100">
                        Why Choose Zapi Card?
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                        Trusted by thousands of professionals and healthcare users worldwide
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {benefits.map((benefit, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="flex items-start gap-4 p-6 rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 hover:shadow-lg transition-shadow"
                        >
                            <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 text-white flex items-center justify-center">
                                {benefit.icon}
                            </div>
                            <div className="flex-1">
                                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">
                                    {benefit.title}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    {benefit.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}

