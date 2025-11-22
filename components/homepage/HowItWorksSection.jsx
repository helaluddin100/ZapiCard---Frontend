'use client'

import { motion } from 'framer-motion'

export default function HowItWorksSection() {
    const steps = [
        { step: "1", title: "Create Account", desc: "Sign up for free and choose your card type - Visiting or Health Card", icon: "👤" },
        { step: "2", title: "Add Information", desc: "Fill in your details or upload prescriptions for AI to read automatically", icon: "✍️" },
        { step: "3", title: "Share & Access", desc: "Share via QR code, NFC tap, or direct link - instant access anywhere!", icon: "🚀" }
    ]

  return (
    <section className="py-28 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-gray-900 dark:text-gray-100">How It Works</h2>
                <p className="text-center text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
                    Create your smart card in 3 simple steps - whether it&apos;s for business or health
                </p>
                <div className="grid md:grid-cols-3 gap-8">
                    {steps.map((item, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.2 }}
                            className="text-center p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 card-hover border-2 border-transparent hover:border-blue-300 dark:hover:border-blue-700"
                        >
                            <div className="text-5xl mb-4">{item.icon}</div>
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full gradient-primary flex items-center justify-center text-white text-2xl font-bold">
                                {item.step}
                            </div>
                            <h3 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-gray-100">{item.title}</h3>
                            <p className="text-gray-600 dark:text-gray-400">{item.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}

