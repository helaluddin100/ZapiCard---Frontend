'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

export default function HealthCardShowcase() {
    const healthCardFeatures = [
        {
            title: "AI Prescription Reading",
            description: "Upload prescription images - AI automatically reads and inputs data",
            icon: "🤖"
        },
        {
            title: "Manual Data Entry",
            description: "Complete control - add health records, medications, and allergies manually",
            icon: "✍️"
        },
        {
            title: "Emergency Access",
            description: "Critical health info available instantly via NFC tap or QR scan",
            icon: "🚨"
        },
        {
            title: "Pregnancy Tracking",
            description: "Specialized cards for expectant mothers with prenatal records",
            icon: "🤰"
        },
        {
            title: "Medical History",
            description: "Complete health timeline - past treatments, surgeries, and conditions",
            icon: "📋"
        },
        {
            title: "Secure & Private",
            description: "Your health data encrypted and accessible only by authorized personnel",
            icon: "🔒"
        }
    ]

  return (
    <section className="py-28 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-20 left-10 text-9xl">🏥</div>
                <div className="absolute bottom-20 right-10 text-9xl">💊</div>
                <div className="absolute top-40 right-20 text-7xl">🩺</div>
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <span className="inline-block px-6 py-2 rounded-full bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 text-green-700 dark:text-green-300 text-sm font-semibold border border-green-200 dark:border-green-800 mb-6">
                        🏥 Revolutionary Healthcare Solution
                    </span>
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-primary bg-clip-text text-transparent">
                        Smart Health Card
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                        Perfect for patients, pregnant women, and anyone who needs instant access to their medical information
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {healthCardFeatures.map((feature, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 border border-gray-200 dark:border-gray-700"
                        >
                            <div className="text-4xl mb-4">{feature.icon}</div>
                            <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">{feature.title}</h3>
                            <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center"
                >
          <Link
            href="/health-dashboard/create"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-bold text-lg rounded-xl shadow-2xl hover:shadow-lg transition-all transform hover:scale-105"
          >
                        🏥 Create Your Health Card Now
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </motion.div>
            </div>
        </section>
    )
}

