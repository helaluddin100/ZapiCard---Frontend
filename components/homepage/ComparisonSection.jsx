'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export default function ComparisonSection() {
    return (
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-gray-100">
                        Traditional vs Smart Cards
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-400">
                        See why thousands are making the switch
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Traditional Cards */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="p-8 bg-gray-100 dark:bg-gray-800 rounded-2xl border-2 border-gray-300 dark:border-gray-700"
                    >
                        <div className="text-center mb-6">
                            <div className="text-4xl mb-3">📄</div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Traditional Cards</h3>
                        </div>
                        <ul className="space-y-4">
                            {[
                                "❌ Limited information space",
                                "❌ Easily lost or damaged",
                                "❌ Need reprinting for updates",
                                "❌ No analytics or tracking",
                                "❌ Environmental waste",
                                "❌ One-way information sharing",
                                "❌ No appointment booking",
                                "❌ Manual data entry required"
                            ].map((item, idx) => (
                                <li key={idx} className="text-gray-700 dark:text-gray-300 flex items-start gap-2">
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Smart Cards */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="p-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl border-2 border-green-400 shadow-2xl transform scale-105"
                    >
                        <div className="text-center mb-6">
                            <div className="text-4xl mb-3">✨</div>
                            <h3 className="text-2xl font-bold text-white">Zapi Smart Cards</h3>
                        </div>
                        <ul className="space-y-4">
                            {[
                                "✅ Unlimited information storage",
                                "✅ Cloud-based, never lost",
                                "✅ Instant updates anytime",
                                "✅ Complete analytics dashboard",
                                "✅ 100% eco-friendly",
                                "✅ Two-way communication",
                                "✅ Built-in appointment system",
                                "✅ AI-powered data reading"
                            ].map((item, idx) => (
                                <li key={idx} className="text-white font-medium flex items-start gap-2">
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                        <div className="mt-8 pt-6 border-t border-white/20">
                            <Link
                                href="/signup"
                                className="block text-center py-3 bg-white text-green-600 rounded-lg font-bold hover:bg-gray-100 transition-all transform hover:scale-105"
                            >
                                Make the Switch Today →
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}

