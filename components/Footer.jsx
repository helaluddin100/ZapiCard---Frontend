'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Facebook, Twitter, Instagram, Linkedin, Zap, Mail, ArrowUp, CheckCircle2, AlertCircle } from 'lucide-react'
import { useState } from 'react'
import { subscriptionAPI } from '@/lib/api'
import logo from '../app/assets/images/logo.png'

export default function Footer() {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState({ type: '', text: '' })

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const validateEmail = (email) => {
        // Trim and lowercase
        const trimmedEmail = email.trim().toLowerCase()

        // Check if empty
        if (!trimmedEmail) {
            return { valid: false, message: 'Please enter your email address' }
        }

        // Check if starts with letter or number
        if (!/^[a-zA-Z0-9]/.test(trimmedEmail)) {
            return { valid: false, message: 'Email must start with a letter or number' }
        }

        // Comprehensive email regex validation
        const emailRegex = /^[a-zA-Z0-9][a-zA-Z0-9._-]*@[a-zA-Z0-9][a-zA-Z0-9.-]*\.[a-zA-Z]{2,}$/
        if (!emailRegex.test(trimmedEmail)) {
            return { valid: false, message: 'Please enter a valid email address' }
        }

        // Check email length
        if (trimmedEmail.length > 255) {
            return { valid: false, message: 'Email address is too long' }
        }

        // Check for valid domain
        const parts = trimmedEmail.split('@')
        if (parts.length !== 2) {
            return { valid: false, message: 'Invalid email format' }
        }

        const domain = parts[1]
        const domainParts = domain.split('.')

        if (domainParts.length < 2) {
            return { valid: false, message: 'Invalid email domain' }
        }

        // Check domain extension (at least 2 characters)
        const extension = domainParts[domainParts.length - 1]
        if (extension.length < 2) {
            return { valid: false, message: 'Invalid email domain extension' }
        }

        // Check for common invalid patterns
        if (trimmedEmail.includes('..') || trimmedEmail.includes('@@') || trimmedEmail.startsWith('.') || trimmedEmail.startsWith('@')) {
            return { valid: false, message: 'Invalid email format' }
        }

        return { valid: true, message: '' }
    }

    const handleSubscribe = async (e) => {
        e.preventDefault()

        // Clear previous messages
        setMessage({ type: '', text: '' })

        // Validate email format
        const validation = validateEmail(email)
        if (!validation.valid) {
            setMessage({ type: 'error', text: validation.message })
            return
        }

        // Normalize email (trim and lowercase)
        const normalizedEmail = email.trim().toLowerCase()

        setLoading(true)
        setMessage({ type: '', text: '' })

        try {
            const response = await subscriptionAPI.subscribe(normalizedEmail)
            if (response.status === 'success') {
                setMessage({ type: 'success', text: response.message || 'Thank you for subscribing!' })
                setEmail('')
                // Clear success message after 5 seconds
                setTimeout(() => {
                    setMessage({ type: '', text: '' })
                }, 5000)
            }
        } catch (error) {
            // Handle validation errors from backend
            if (error.response?.data?.errors?.email) {
                const errorMsg = Array.isArray(error.response.data.errors.email)
                    ? error.response.data.errors.email[0]
                    : error.response.data.errors.email
                setMessage({ type: 'error', text: errorMsg })
            } else {
                const errorMessage = error.response?.data?.message || error.message || 'Failed to subscribe. Please try again.'
                setMessage({ type: 'error', text: errorMessage })
            }
        } finally {
            setLoading(false)
        }
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
                        <Link href="/" className="inline-block mb-4 group">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.3 }}
                                className="flex items-center gap-2"
                            >
                                <Image
                                    src={logo}
                                    alt="Zapy Card Logo"
                                    width={40}
                                    height={50}
                                    className="h-auto"
                                    priority
                                />
                                <span className="text-2xl md:text-3xl font-bold gradient-primary bg-clip-text text-transparent group-hover:scale-105 transition-transform">
                                    Zapy Card
                                </span>
                            </motion.div>
                        </Link>
                        <p className="text-gray-400 mb-6 leading-relaxed">
                            Smart digital cards for business networking and healthcare. Create your digital identity with NFC & QR technology.
                        </p>
                        <div className="flex space-x-4">
                            {[
                                { icon: Facebook, color: 'hover:text-blue-400', href: 'https://facebook.com/zapycards', ariaLabel: 'Facebook' },
                                { icon: Twitter, color: 'hover:text-blue-400', href: 'https://twitter.com/zapycards', ariaLabel: 'Twitter' },
                                { icon: Instagram, color: 'hover:text-pink-400', href: 'https://instagram.com/zapycards', ariaLabel: 'Instagram' },
                                { icon: Linkedin, color: 'hover:text-blue-400', href: 'https://linkedin.com/company/zapycards', ariaLabel: 'LinkedIn' }
                            ].map((social, idx) => {
                                const Icon = social.icon
                                return (
                                    <motion.a
                                        key={idx}
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={social.ariaLabel}
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
                                { href: '/about', label: 'About Us' },

                                { href: '/#features', label: 'Features' },
                                // { href: '/#pricing', label: 'Pricing' },
                                { href: '/testimonials', label: 'Testimonials' },
                                // { href: '/nfc-order', label: 'Order NFC Card' }
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
                        <form onSubmit={handleSubscribe} className="space-y-3">
                            <div className="flex gap-2">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value)
                                        setMessage({ type: '', text: '' })
                                    }}
                                    placeholder="Your email"
                                    className="flex-1 px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                    required
                                    disabled={loading}
                                />
                                <motion.button
                                    type="submit"
                                    disabled={loading}
                                    whileHover={{ scale: loading ? 1 : 1.05 }}
                                    whileTap={{ scale: loading ? 1 : 0.95 }}
                                    className="px-4 py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                        <Mail className="w-5 h-5" />
                                    )}
                                </motion.button>
                            </div>
                            {message.text && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex items-center gap-2 text-sm p-2 rounded-lg ${message.type === 'success'
                                        ? 'bg-green-900/50 text-green-300 border border-green-700'
                                        : 'bg-red-900/50 text-red-300 border border-red-700'
                                        }`}
                                >
                                    {message.type === 'success' ? (
                                        <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                                    ) : (
                                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                    )}
                                    <span>{message.text}</span>
                                </motion.div>
                            )}
                        </form>
                    </motion.div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-800 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-gray-400 text-sm">
                            &copy; 2025 Zapy Card. All rights reserved.
                        </p>
                        <div className="flex items-center gap-6 text-sm text-gray-400">
                            <Link href="/privacy-policy" className="hover:text-white transition">Privacy Policy</Link>
                            <Link href="/terms-of-service" className="hover:text-white transition">Terms of Service</Link>
                            <Link href="/return-policy" className="hover:text-white transition">Return Policy</Link>
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

