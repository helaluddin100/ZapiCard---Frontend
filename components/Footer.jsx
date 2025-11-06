'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Facebook, Twitter, Instagram, Linkedin, Zap, Mail, ArrowUp } from 'lucide-react'

export default function Footer() {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    return (
        <footer className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
                <div className="grid md:grid-cols-4 gap-8 md:gap-12 mb-12">
                    {/* Brand Column */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="md:col-span-1"
                    >
                        <Link href="/" className="flex items-center gap-2 mb-4 group">
                            <motion.div
                                whileHover={{ rotate: 360 }}
                                transition={{ duration: 0.5 }}
                                className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg"
                            >
                                <Zap className="w-6 h-6 text-white" />
                            </motion.div>
                            <span className="text-2xl font-bold gradient-primary bg-clip-text text-transparent">
                                Zapi Card
                            </span>
                        </Link>
                        <p className="text-gray-400 mb-6 leading-relaxed">
                            Smart visiting cards for the modern professional. Network smarter, not harder.
                        </p>
                        <div className="flex space-x-4">
                            {[
                                { icon: Facebook, color: 'hover:text-blue-400' },
                                { icon: Twitter, color: 'hover:text-blue-400' },
                                { icon: Instagram, color: 'hover:text-pink-400' },
                                { icon: Linkedin, color: 'hover:text-blue-400' }
                            ].map((social, idx) => {
                                const Icon = social.icon
                                return (
                                    <motion.a
                                        key={idx}
                                        href="#"
                                        whileHover={{ scale: 1.2, y: -2 }}
                                        whileTap={{ scale: 0.9 }}
                                        className={`w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center text-gray-400 ${social.color} transition-all border border-gray-700 hover:border-gray-600`}
                                    >
                                        <Icon className="w-5 h-5" />
                                    </motion.a>
                                )
                            })}
                        </div>
                    </motion.div>

                    {/* Product Column */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                    >
                        <h4 className="font-bold text-lg mb-6 text-white">Product</h4>
                        <ul className="space-y-3">
                            {[
                                { href: '/#features', label: 'Features' },
                                { href: '/#pricing', label: 'Pricing' },
                                { href: '/testimonials', label: 'Testimonials' },
                                { href: '/nfc-order', label: 'Order NFC Card' }
                            ].map((link, idx) => (
                                <li key={idx}>
                                    <Link
                                        href={link.href}
                                        className="text-gray-400 hover:text-white transition-all flex items-center gap-2 group"
                                    >
                                        <span className="w-1.5 h-1.5 rounded-full bg-gray-600 group-hover:bg-blue-500 transition-colors"></span>
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Company Column */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                    >
                        <h4 className="font-bold text-lg mb-6 text-white">Company</h4>
                        <ul className="space-y-3">
                            {[
                                { href: '/about', label: 'About Us' },
                                { href: '/contact', label: 'Contact' },
                                { href: '/testimonials', label: 'Testimonials' },
                                { href: '/#faq', label: 'FAQ' }
                            ].map((link, idx) => (
                                <li key={idx}>
                                    <Link
                                        href={link.href}
                                        className="text-gray-400 hover:text-white transition-all flex items-center gap-2 group"
                                    >
                                        <span className="w-1.5 h-1.5 rounded-full bg-gray-600 group-hover:bg-purple-500 transition-colors"></span>
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Newsletter Column */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                    >
                        <h4 className="font-bold text-lg mb-6 text-white">Stay Updated</h4>
                        <p className="text-gray-400 mb-4 text-sm">
                            Subscribe to our newsletter for the latest updates and features.
                        </p>
                        <div className="flex gap-2">
                            <input
                                type="email"
                                placeholder="Your email"
                                className="flex-1 px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            />
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-4 py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg hover:shadow-lg transition-all"
                            >
                                <Mail className="w-5 h-5" />
                            </motion.button>
                        </div>
                    </motion.div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-800 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-gray-400 text-sm">
                            &copy; 2024 Zapi Card. All rights reserved.
                        </p>
                        <div className="flex items-center gap-6 text-sm text-gray-400">
                            <Link href="#" className="hover:text-white transition">Privacy Policy</Link>
                            <Link href="#" className="hover:text-white transition">Terms of Service</Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Scroll to Top Button */}
            <motion.button
                onClick={scrollToTop}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.1, y: -5 }}
                whileTap={{ scale: 0.9 }}
                className="fixed bottom-8 right-8 w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white shadow-2xl flex items-center justify-center z-50 hover:shadow-blue-500/50 transition-all"
            >
                <ArrowUp className="w-6 h-6" />
            </motion.button>
        </footer>
    )
}

