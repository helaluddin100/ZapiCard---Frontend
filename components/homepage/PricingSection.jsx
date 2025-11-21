'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { CheckCircle2, ArrowRight } from 'lucide-react'

export default function PricingSection() {
    const pricingPlans = [
        {
            name: "Free",
            price: "$0",
            period: "/month",
            type: "Basic",
            features: [
                "1 Visiting Card",
                "1 Health Card",
                "Basic QR Code",
                "Standard Templates",
                "Email Support"
            ],
            cta: "Get Started",
            popular: false
        },
        {
            name: "Pro",
            price: "$9.99",
            period: "/month",
            type: "Most Popular",
            features: [
                "Unlimited Visiting Cards",
                "Unlimited Health Cards",
                "NFC Card Included",
                "AI Prescription Reading",
                "Appointment Booking",
                "Premium Templates",
                "Analytics Dashboard",
                "Priority Support"
            ],
            cta: "Go Pro",
            popular: true
        },
        {
            name: "Healthcare+",
            price: "$19.99",
            period: "/month",
            type: "For Medical Professionals",
            features: [
                "Everything in Pro",
                "Advanced Health Features",
                "Patient Management",
                "Prescription History",
                "Emergency Contacts",
                "Family Health Cards",
                "Medical Records Storage",
                "24/7 Support"
            ],
            cta: "Get Healthcare+",
            popular: false,
            highlight: true
        }
    ]

    return (
        <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-gray-100">
                        Simple, Transparent Pricing
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                        Choose the perfect plan for your needs - Business, Health, or Both
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-8">
                    {pricingPlans.map((plan, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className={`relative p-8 rounded-2xl ${plan.popular
                                ? 'gradient-primary text-white scale-105 shadow-2xl'
                                : plan.highlight
                                    ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white border-2 border-green-400 shadow-2xl'
                                    : 'bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700'
                                } card-hover`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-1 bg-yellow-400 dark:bg-yellow-500 text-gray-900 rounded-full text-sm font-bold">
                                    {plan.type}
                                </div>
                            )}
                            {plan.highlight && (
                                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-1 bg-white text-green-600 rounded-full text-sm font-bold shadow-lg">
                                    🏥 {plan.type}
                                </div>
                            )}
                            <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                            {!plan.popular && !plan.highlight && (
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{plan.type}</p>
                            )}
                            <div className="mb-6">
                                <span className="text-4xl font-bold">{plan.price}</span>
                                <span className="text-lg">{plan.period}</span>
                            </div>
                            <ul className="space-y-3 mb-8">
                                {plan.features.map((feature, fIdx) => (
                                    <li key={fIdx} className="flex items-start">
                                        <CheckCircle2 className={`w-5 h-5 mr-2 flex-shrink-0 ${plan.popular || plan.highlight ? 'text-white' : 'text-green-500 dark:text-green-400'
                                            }`} />
                                        <span className={plan.popular || plan.highlight ? '' : 'text-gray-700 dark:text-gray-300'}>
                                            {feature}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                            <Link
                                href="/signup"
                                className={`block text-center py-3 rounded-lg font-semibold transition ${plan.popular || plan.highlight
                                    ? 'bg-white text-blue-600 hover:bg-gray-100'
                                    : 'btn-primary'
                                    }`}
                            >
                                {plan.cta}
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {/* Enterprise CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-12 text-center"
                >
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Need a custom solution for your hospital or large organization?
                    </p>
                    <Link
                        href="/contact"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all transform hover:scale-105"
                    >
                        Contact Sales Team
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </motion.div>
            </div>
        </section>
    )
}

