'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

export default function FAQSection({ faqs, openFaq, setOpenFaq }) {
  return (
    <section id="faq" className="py-28 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute inset-0 opacity-5 dark:opacity-10">
                <div className="absolute top-20 left-10 w-96 h-96 bg-blue-400 dark:bg-blue-900 rounded-full filter blur-3xl"></div>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400 dark:bg-purple-900 rounded-full filter blur-3xl"></div>
            </div>

            <div className="max-w-4xl mx-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <div className="inline-block mb-4">
                        <span className="px-4 py-1 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-700 dark:text-blue-300 text-sm font-semibold border border-blue-200 dark:border-blue-800">
                            FAQ
                        </span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 gradient-primary bg-clip-text text-transparent">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 text-lg">Everything you need to know about Zapi Card</p>
                </motion.div>

                <div className="space-y-4">
                    {faqs.map((faq, idx) => (
                        <motion.div
                            key={faq.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="relative group"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity blur-xl"></div>
                            <div className="relative glass-effect rounded-2xl overflow-hidden border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all bg-white dark:bg-gray-800">
                                <motion.button
                                    onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
                                    className="w-full px-6 md:px-8 py-5 md:py-6 flex justify-between items-center text-left group/button"
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.99 }}
                                >
                                    <span className="font-bold text-lg md:text-xl text-gray-900 dark:text-gray-100 pr-4 group-hover/button:text-blue-600 dark:group-hover/button:text-blue-400 transition-colors">
                                        {faq.question}
                                    </span>
                                    <motion.div
                                        animate={{ rotate: openFaq === faq.id ? 180 : 0 }}
                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                        className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white shadow-lg group-hover/button:shadow-xl transition-all"
                                    >
                                        <ChevronDown className="w-5 h-5" />
                                    </motion.div>
                                </motion.button>

                                <motion.div
                                    initial={false}
                                    animate={{
                                        height: openFaq === faq.id ? 'auto' : 0,
                                        opacity: openFaq === faq.id ? 1 : 0
                                    }}
                                    transition={{
                                        height: { duration: 0.3, ease: "easeInOut" },
                                        opacity: { duration: 0.2, ease: "easeInOut" }
                                    }}
                                    className="overflow-hidden"
                                >
                                    <div className="px-6 md:px-8 pb-5 md:pb-6 pt-2">
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{
                                                opacity: openFaq === faq.id ? 1 : 0,
                                                y: openFaq === faq.id ? 0 : -10
                                            }}
                                            transition={{ delay: 0.1 }}
                                            className="text-gray-700 dark:text-gray-300 leading-relaxed text-base md:text-lg bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4 border-l-4 border-blue-500 dark:border-blue-400"
                                        >
                                            {faq.answer}
                                        </motion.div>
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* CTA Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-12 text-center"
                >
                    <p className="text-gray-600 dark:text-gray-400 mb-4">Still have questions?</p>
                    <Link
                        href="/contact"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all transform hover:scale-105"
                    >
                        Contact Us
                        <ChevronDown className="w-4 h-4 rotate-[-90deg]" />
                    </Link>
                </motion.div>
            </div>
        </section>
    )
}

