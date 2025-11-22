'use client'

import { motion } from 'framer-motion'
import { QrCode, Calendar, Radio, CheckCircle2 } from 'lucide-react'

export default function FeaturesSection() {
    const features = [
        {
            icon: <QrCode className="w-8 h-8" />,
            title: "Smart Visiting Card",
            description: "Create professional digital business cards with QR and NFC technology",
            highlight: false
        },
        {
            icon: <Calendar className="w-8 h-8" />,
            title: "Appointment Booking",
            description: "Let visitors book appointments directly - schedule management made easy",
            highlight: false
        },
        {
            icon: <Radio className="w-8 h-8" />,
            title: "Smart Health Card",
            description: "Revolutionary health cards for patients, pregnant women with AI prescription scanning",
            highlight: true
        },
        {
            icon: <CheckCircle2 className="w-8 h-8" />,
            title: "NFC & QR Technology",
            description: "Instant access - tap NFC or scan QR to view complete health/contact information",
            highlight: false
        }
    ]

  return (
    <section id="features" className="py-28 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-900">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-gray-100">
                        Powerful Features for Every Need
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                        Two revolutionary card systems in one platform - Business networking and Healthcare management
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className={`glass-effect p-6 rounded-xl card-hover border-2 transition-all ${feature.highlight
                                ? 'bg-gradient-to-br from-green-500 to-emerald-600 border-green-400 text-white scale-105 shadow-2xl'
                                : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                                }`}
                        >
                            <div className={`mb-4 ${feature.highlight ? 'text-white' : 'text-blue-600 dark:text-blue-400'}`}>
                                {feature.icon}
                            </div>
                            <h3 className={`text-xl font-semibold mb-2 ${feature.highlight ? 'text-white' : 'text-gray-900 dark:text-gray-100'}`}>
                                {feature.title}
                                {feature.highlight && <span className="ml-2 text-yellow-300">⭐</span>}
                            </h3>
                            <p className={feature.highlight ? 'text-white/90' : 'text-gray-600 dark:text-gray-400'}>
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* Use Cases */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-16 grid md:grid-cols-2 gap-8"
                >
                    {/* Visiting Card Use Case */}
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="text-4xl">📇</div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Smart Visiting Card</h3>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">Perfect for professionals and businesses</p>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-2">
                                <CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                                <span className="text-gray-700 dark:text-gray-300">QR Code & NFC instant sharing</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                                <span className="text-gray-700 dark:text-gray-300">Appointment booking system</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                                <span className="text-gray-700 dark:text-gray-300">Schedule management for clients</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                                <span className="text-gray-700 dark:text-gray-300">Professional digital presence</span>
                            </li>
                        </ul>
                    </div>

                    {/* Health Card Use Case */}
                    <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-8 rounded-2xl shadow-xl border-2 border-green-400">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="text-4xl">🏥</div>
                            <h3 className="text-2xl font-bold text-white">Smart Health Card</h3>
                        </div>
                        <p className="text-white/90 mb-4">Essential for patients and pregnant women</p>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-2">
                                <CheckCircle2 className="w-5 h-5 text-yellow-300 flex-shrink-0 mt-0.5" />
                                <span className="text-white">AI prescription reading & data entry</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle2 className="w-5 h-5 text-yellow-300 flex-shrink-0 mt-0.5" />
                                <span className="text-white">Complete medical history tracking</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle2 className="w-5 h-5 text-yellow-300 flex-shrink-0 mt-0.5" />
                                <span className="text-white">Emergency access via NFC/QR scan</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle2 className="w-5 h-5 text-yellow-300 flex-shrink-0 mt-0.5" />
                                <span className="text-white">Pregnancy & chronic condition support</span>
                            </li>
                        </ul>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}

